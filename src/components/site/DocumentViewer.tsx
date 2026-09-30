"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ScanLine,
  X,
} from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useScrollLock } from "@/lib/scrollLock";
import type { SourceDoc } from "@/lib/records";
import { Watermark } from "@/components/site/Watermark";

/**
 * Document viewer.
 *
 * Renders an original INSIDE the page, to a canvas, with PDF.js. This exists
 * because the previous "Open original" handed the browser a real PDF URL,
 * which meant the browser's own viewer took over -- and that viewer has a
 * download button, a print button, and a context menu full of save options
 * that no right-click guard on our side can reach. An <iframe> would have the
 * same problem.
 *
 * By rasterising each page ourselves we control the whole surface: there is
 * no toolbar, no download affordance, and the only controls are the ones in
 * this file. The bytes still crossed the network, so this is not DRM and a
 * determined visitor can still get them out of devtools -- but the one-click
 * routes are genuinely gone rather than merely discouraged.
 *
 * Why canvas and not the PDF.js text layer: a selectable text layer would put
 * the document's words in the DOM, where they can be selected and copied
 * wholesale with Ctrl+A. Rasterising means the text is pixels. The trade is
 * that the viewer text is not searchable or readable by a screen reader, so
 * the drawer carries the full transcript, which is the accessible path to the
 * same information.
 */

type Status = "idle" | "loading" | "ready" | "error";

/** Render scale bounds. Below 1 you cannot read it, above 2 you only get blur. */
const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;

export function DocumentViewer({
  doc,
  url,
  onClose,
}: {
  doc: SourceDoc;
  /** signed, expiring URL from useDocLink */
  url: string;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const docRef = useRef<{ pages: number; render: (n: number) => void } | null>(
    null
  );

  const [status, setStatus] = useState<Status>("loading");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1);
  const [message, setMessage] = useState("");

  // --- open / close behaviour ----------------------------------------------

  // The page behind a full-screen reader must not move. This replaces the
  // body-overflow hack, which could not hold against Lenis -- see scrollLock.
  useScrollLock();

  useEffect(() => {
    // Remember what had focus so it can be handed back on close.
    triggerRef.current = document.activeElement as HTMLElement | null;

    closeRef.current?.focus();

    return () => {
      // preventScroll: handing focus back to the card would otherwise scroll
      // the page to bring that button into view, so dismissing the reader
      // teleported the reader to wherever the trigger happened to sit.
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, []);

  // Escape closes; arrows page; plus/minus zoom. Home/End jump to first/last.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      /*
       * Two classes of key this handler must not swallow.
       *
       * A focused control owns Space and Enter, and preventDefault on keydown
       * is precisely what stops a focused button from activating. Tabbing to
       * "Zoom in" and pressing Space used to page the document instead of
       * zooming, so part of the toolbar was unreachable by keyboard.
       *
       * The stage is focusable so it can be scrolled without a pointer, and
       * once it holds focus the browser scrolls it natively -- which is what the
       * arrow keys would otherwise be doing by hand, badly.
       */
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          'button, a[href], input, select, textarea, [contenteditable=""], [contenteditable="true"]'
        ) ||
        target === scrollerRef.current
      ) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        // The pager is inert on a single-page scan, so claiming the scroll keys
        // there would swallow every one of them for no visible effect.
        if (pageCount <= 1) return;
        e.preventDefault();
        setPage((p) => Math.min(pageCount, p + 1));
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        if (pageCount <= 1) return;
        e.preventDefault();
        setPage((p) => Math.max(1, p - 1));
        return;
      }
      if (e.key === "Home") {
        if (pageCount <= 1) return;
        e.preventDefault();
        setPage(1);
        return;
      }
      if (e.key === "End") {
        if (pageCount <= 1) return;
        e.preventDefault();
        setPage(pageCount);
        return;
      }
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        setScale((s) => Math.min(MAX_SCALE, +(s + 0.25).toFixed(2)));
        return;
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        setScale((s) => Math.max(MIN_SCALE, +(s - 0.25).toFixed(2)));
        return;
      }

      // Focus trap. This claims aria-modal, so Tab must stay inside.
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, pageCount]);


  // --- load the document ----------------------------------------------------

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setPage(1);
    setPageCount(0);

    async function load() {
      try {
        // Imported dynamically: ~350KB of PDF.js, needed only once a visitor
        // actually opens a document. Keeping it out of the initial bundle is
        // the difference between a 185KB first load and a 540KB one.
        const pdfjs = await import("pdfjs-dist");

        // Self-hosted worker. Pointing this at a CDN would leak every view to
        // a third party and add an external dependency to a page that is
        // otherwise self-contained.
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const task = pdfjs.getDocument({
          url,
          // The file arrives from our own route. No credentials to send, and
          // no reason for the worker to reach anything but this one origin.
          withCredentials: false,
        });

        const pdf = await task.promise;
        if (cancelled) return;

        docRef.current = {
          pages: pdf.numPages,
          render: async (n: number) => {
            if (cancelled) return;
            const p = await pdf.getPage(n);
            if (cancelled) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            // Rasterise at devicePixelRatio so text stays crisp on a
            // high-density screen instead of looking like an upscaled photo.
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const viewport = p.getViewport({ scale: scale * dpr });

            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            // The CSS box is the logical size, so layout is unaffected by dpr.
            canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
            canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

            const ctx = canvas.getContext("2d", { alpha: false });
            if (!ctx) return;

            // Certificates and mark sheets are mostly white paper. Without a
            // fill, transparent regions render black on some canvases.
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            await p.render({ canvasContext: ctx, viewport }).promise;
            if (cancelled) return;
            setStatus("ready");
          },
        };

        setPageCount(pdf.numPages);
        await docRef.current.render(1);
      } catch (err) {
        if (cancelled) return;
        console.error("Document render failed:", err);
        setStatus("error");
        setMessage(
          "This document could not be rendered. The link may have expired, so reload the page and try again."
        );
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [url, scale]);

  // --- actions --------------------------------------------------------------

  const goTo = useCallback((n: number) => {
    const target = Math.max(1, Math.min(docRef.current?.pages ?? 1, n));
    setPage(target);
    void docRef.current?.render(target);
    scrollerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const zoom = useCallback(
    (delta: number) => {
      setScale((s) => {
        const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, +(s + delta).toFixed(2)));
        // Re-render at the new size, same page.
        queueMicrotask(() => void docRef.current?.render(page));
        return next;
      });
    },
    [page]
  );

  const label = `${doc.issuer}, ${doc.title}`;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Same gesture as the cabinet drawer: the sheet is pulled up onto the bed.
    // Reusing that easing and feel is what keeps the two layers reading as one
    // mechanism rather than two components that happen to overlap.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panelRef.current,
        { yPercent: 3, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: "power4.out" }
      );
    }, panelRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ zIndex: "var(--z-sheet)" as unknown as number }}
      role="dialog"
      aria-modal="true"
      aria-label={`${doc.title}, full document`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Scrim is not interactive: the viewer is the whole surface, and a
          click-outside-to-close here would fight the scroller. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "var(--ink-900)" }}
      />

      <div
        ref={panelRef}
        className="relative flex min-h-0 flex-1 flex-col"
        style={{ background: "var(--stock-sunk)" }}
      >
        {/* --- toolbar --- */}
        <div
          className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 px-4 py-3 sm:px-6"
          style={{
            background: "var(--stock-raised)",
            borderBottom: "1px solid var(--rule-strong)",
          }}
        >
          <div className="min-w-0 flex-1">
            <p className="t-label truncate">{doc.category}</p>
            <h2 className="t-h3 mt-1 truncate" style={{ fontSize: "0.9375rem" }}>
              {doc.title}
            </h2>
          </div>

          {/*
            One instrument bar. The circles are the theme toggle's control
            repeated; the readouts between them are tag chips. Splitting these
            into three separate flex rows is what made the first version read
            as a different website.
          */}
          <div className="viewer-bar">
            {/* Page controls. Hidden for single-page scans, where paging is
                meaningless and an inert pager is just clutter. */}
            {doc.kind === "pdf" && pageCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(page - 1)}
                  disabled={page <= 1}
                  className="viewer-btn"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={15} strokeWidth={2} />
                </button>
                <span
                  className="viewer-readout viewer-readout--page"
                  aria-live="polite"
                >
                  {page} / {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => goTo(page + 1)}
                  disabled={page >= pageCount}
                  className="viewer-btn"
                  aria-label="Next page"
                >
                  <ChevronRight size={15} strokeWidth={2} />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => zoom(-0.25)}
              disabled={scale <= MIN_SCALE}
              className="viewer-btn"
              aria-label="Zoom out"
            >
              <Minus size={15} strokeWidth={2} />
            </button>
            <span className="viewer-readout" aria-live="polite">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => zoom(0.25)}
              disabled={scale >= MAX_SCALE}
              className="viewer-btn"
              aria-label="Zoom in"
            >
              <Plus size={15} strokeWidth={2} />
            </button>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="viewer-btn"
              aria-label="Close document viewer"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* --- stage ---
            data-lenis-prevent is load-bearing. Lenis listens on the window and
            takes every wheel event to drive the page, so without this attribute
            the wheel over a long document scrolled the page behind the reader
            and the sheet itself never moved. This hands those events back to
            the native scroller. overscroll-contain stops the pane from chaining
            its leftover momentum to the page once the reader hits the end. */}
        <div
          ref={scrollerRef}
          data-lenis-prevent
          // Focusable so the sheet can be scrolled without a pointer. A scrollable
          // region that is not in the tab order is unreachable by keyboard, and
          // this one is the only way to reach the bottom of a long page at zoom.
          // The visible focus ring is the global :focus-visible outline -- adding
          // a local one here would have doubled it up.
          tabIndex={0}
          role="group"
          aria-label={`${label}, page ${page} of ${pageCount || 1}. Scrollable.`}
          className="viewer-bed relative min-h-0 flex-1 overflow-auto overscroll-contain"
        >
          {status === "loading" && (
            /* The site's loading idiom is the paper shimmer, not a spinner.
               A spinner would be the one control on this page that belongs to
               no other section. The sheet outline keeps the layout from
               jumping when the page lands. */
            <div className="flex min-h-full items-start justify-center p-4 sm:p-8">
              <div
                className="skeleton"
                style={{ width: "min(100%, 760px)", aspectRatio: "1.294 / 1" }}
              />
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 grid place-items-center px-6">
              <span className="flex max-w-[38ch] flex-col items-center gap-3 text-center">
                <ScanLine size={20} strokeWidth={1.6} style={{ color: "var(--ink-lbl)" }} />
                <span className="t-label">Cannot display</span>
                <span className="t-small">{message}</span>
              </span>
            </div>
          )}

          {/* The canvas is the document. No <img>, no <iframe>, no object or
              embed: each of those hands the browser a native viewer with its
              own save affordances. */}
          <div className="flex min-h-full items-start justify-center p-4 sm:p-8">
            <div className="relative">
              <canvas
                ref={canvasRef}
                role="img"
                aria-label={`${label}, page ${page} of ${pageCount || 1}`}
                className={`viewer-sheet ${status === "ready" ? "block" : "hidden"} max-w-full`}
                draggable={false}
              />
              <Watermark />
            </div>
          </div>
        </div>

        {/* --- footer: the honest note --- */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6"
          style={{
            background: "var(--stock-raised)",
            borderTop: "1px solid var(--rule)",
          }}
        >
          <p className="t-data text-[0.625rem] uppercase tracking-[0.12em]" style={{ color: "var(--ink-lbl)" }}>
            {doc.reference ? `Reference ${doc.reference}` : "No reference printed"}
            {doc.issued ? ` · ${doc.issued}` : ""}
          </p>
          <p className="t-data text-[0.625rem] uppercase tracking-[0.12em]" style={{ color: "var(--ink-lbl)" }}>
            {/*
              Advertise only the keys that work. Telling a reader to press the
              arrows on a single-page scan teaches them to press keys that do
              nothing, and it undercuts the rest of the label.
            */}
            {doc.kind === "pdf" && pageCount > 1
              ? "Viewing copy · arrows page · escape closes"
              : "Viewing copy · escape closes"}
          </p>
        </div>
      </div>
    </div>
  );
}
