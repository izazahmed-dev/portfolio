"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Lock,
  Minus,
  Plus,
  RotateCw,
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
  const scrimRef = useRef<HTMLButtonElement | null>(null);
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
  // Bumped by the reload button. The load effect depends on it, so a reload is
  // a genuine refetch rather than a repaint of whatever is already in memory.
  const [reloadKey, setReloadKey] = useState(0);

  /*
   * What the address bar shows.
   *
   * The signed URL is a bearer token: the query string is the signature. Putting
   * it in a visible field would undo the entire point of the expiring link, since
   * a screenshot, a screen share or a shoulder-surfer would all capture a valid
   * grant for whatever window it is valid in. So the bar renders the real
   * pathname and states plainly that the signature is withheld. Nothing here is
   * a link, and there is no origin to navigate to.
   */
  const shownPath = useMemo(() => {
    try {
      return new URL(url, "https://localhost").pathname;
    } catch {
      return "/api/doc";
    }
  }, [url]);

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
        if (doc.kind === "image") {
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error("Image failed to load"));
            img.src = url;
          });
          if (cancelled) return;

          const naturalWidth = img.naturalWidth || img.width || 1200;
          const naturalHeight = img.naturalHeight || img.height || 800;
          const baseWidth = Math.min(840, naturalWidth);
          const aspectRatio = naturalHeight / naturalWidth;

          docRef.current = {
            pages: 1,
            render: async () => {
              if (cancelled) return;
              const canvas = canvasRef.current;
              if (!canvas) return;

              const dpr = Math.min(window.devicePixelRatio || 1, 2);
              const displayWidth = Math.round(baseWidth * scale);
              const displayHeight = Math.round(displayWidth * aspectRatio);

              canvas.width = Math.floor(displayWidth * dpr);
              canvas.height = Math.floor(displayHeight * dpr);
              canvas.style.width = `${displayWidth}px`;
              canvas.style.height = `${displayHeight}px`;

              const ctx = canvas.getContext("2d", { alpha: false });
              if (!ctx) return;

              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              if (cancelled) return;
              setStatus("ready");
            },
          };

          setPageCount(1);
          await docRef.current.render(1);
          return;
        }

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
  }, [url, scale, reloadKey, doc.kind]);

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
    // A window opens by rising and settling, not by fading in place. The easing
    // is the same press easing the cabinet drawer uses, so the two layers still
    // read as one mechanism rather than two components that happen to overlap.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        scrimRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.34, ease: "power2.out" }
      );
      gsap.fromTo(
        panelRef.current,
        { y: 14, scale: 0.985, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.46, ease: "power4.out" }
      );
    }, panelRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-6"
      style={{ zIndex: "var(--z-sheet)" as unknown as number }}
      role="dialog"
      aria-modal="true"
      aria-label={`${doc.title}, full document`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/*
        A floating window is dismissed by clicking away from it, so the scrim is
        a real control here. It was deliberately inert when the reader covered
        the whole viewport, where a stray click would have fought the scroller.
        tabIndex -1 keeps it out of the focus order: Escape and the close button
        are the labelled routes, and a full-bleed button in the tab order is a
        trap for screen reader users.
      */}
      <button
        ref={scrimRef}
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className="viewer-scrim absolute inset-0 h-full w-full"
      />

      <div
        ref={panelRef}
        className="viewer-window relative flex min-h-0 w-full max-w-[1180px] flex-col overflow-hidden"
      >
        {/* --- tab strip --- */}
        <div className="viewer-chrome viewer-chrome--tabs">
          {/*
            Traffic lights. Decorative, so they are spans rather than buttons:
            three controls that do nothing would be worse than no controls, and
            a focusable dot invites a keyboard user to press it.
          */}
          <span className="viewer-lights" aria-hidden>
            <i />
            <i />
            <i />
          </span>

          <div className="viewer-tab">
            <FileText size={12.5} strokeWidth={1.9} aria-hidden />
            <span className="truncate">{doc.title}</span>
          </div>
        </div>

        {/* --- toolbar --- */}
        <div className="viewer-chrome viewer-chrome--bar">
          <div className="flex items-center gap-1">
            {/*
              Back and forward are present and permanently disabled, for the same
              reason a disabled pager stays visible: a control that appears only
              when it works makes the window look broken. This viewer has no
              history, so "nowhere to go" is the truth.
            */}
            <button
              type="button"
              disabled
              className="viewer-nav"
              aria-label="Back, unavailable"
            >
              <ArrowLeft size={15} strokeWidth={2} />
            </button>
            <button
              type="button"
              disabled
              className="viewer-nav"
              aria-label="Forward, unavailable"
            >
              <ArrowRight size={15} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="viewer-nav"
              aria-label="Reload document"
            >
              <RotateCw size={14} strokeWidth={2} />
            </button>
          </div>

          {/* The address bar. Zoom lives at its right edge, where a browser
              puts it, which is also what keeps the window free of a second
              floating group of buttons. */}
          <div className="viewer-omni">
            <Lock size={12} strokeWidth={2} aria-hidden />
            <span className="truncate">{shownPath}</span>
            <span className="viewer-omni__sig" aria-hidden>
              signature withheld
            </span>

            <span className="viewer-omni__split" aria-hidden />

            <button
              type="button"
              onClick={() => zoom(-0.25)}
              disabled={scale <= MIN_SCALE}
              className="viewer-nav viewer-nav--tight"
              aria-label="Zoom out"
            >
              <Minus size={14} strokeWidth={2} />
            </button>
            <span className="viewer-readout viewer-readout--flush" aria-live="polite">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => zoom(0.25)}
              disabled={scale >= MAX_SCALE}
              className="viewer-nav viewer-nav--tight"
              aria-label="Zoom in"
            >
              <Plus size={14} strokeWidth={2} />
            </button>
          </div>

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

        {/* --- status bar: the pager and the honest note --- */}
        <div className="viewer-chrome viewer-chrome--status">
          <div className="flex min-w-0 items-center gap-2">
            <VerifiedMark status={status} />
            <span className="viewer-omni__split" aria-hidden />
            {/* The pager lives here rather than in the toolbar. A page control
                is not a browser control, and the status bar is the one strip in
                a window that is not pretending to be navigation. */}
            {doc.kind === "pdf" && pageCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(page - 1)}
                  disabled={page <= 1}
                  className="viewer-nav viewer-nav--tight"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} strokeWidth={2} />
                </button>
                <span
                  className="viewer-readout viewer-readout--page viewer-readout--flush"
                  aria-live="polite"
                >
                  {page} / {pageCount}
                </span>
                <button
                  type="button"
                  onClick={() => goTo(page + 1)}
                  disabled={page >= pageCount}
                  className="viewer-nav viewer-nav--tight"
                  aria-label="Next page"
                >
                  <ChevronRight size={14} strokeWidth={2} />
                </button>
                <span className="viewer-omni__split" aria-hidden />
              </>
            )}
            <p
              className="t-data truncate text-[0.625rem] uppercase tracking-[0.12em]"
              style={{ color: "var(--ink-lbl)" }}
            >
              {doc.reference ? `Reference ${doc.reference}` : "No reference printed"}
              {doc.issued ? ` · ${doc.issued}` : ""}
            </p>
          </div>
          <p
            className="t-data shrink-0 text-[0.625rem] uppercase tracking-[0.12em]"
            style={{ color: "var(--ink-lbl)" }}
          >
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


/**
 * VERIFIED MARK -- adapted from React Bits' StatusMark, ported from
 * motion/react to the GSAP DrawSVG already registered in lib/gsap.
 *
 * A document only renders if the route accepted its signed link, so the
 * moment the sheet lands is the moment the signature is known to be good.
 * The dashed ring turns while the request is out, then draws closed with a
 * tick. It makes the access control visible as evidence, which is the
 * argument of the whole site. It says "verified", never "valid for 30
 * minutes": the link was minted when the page rendered, so the remaining
 * time is not something this window knows.
 */
function VerifiedMark({ status }: { status: Status }) {
  const ring = useRef<SVGCircleElement | null>(null);
  const tick = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    if (status !== "ready" || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      if (ring.current) {
        gsap.fromTo(ring.current, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, ease: "power2.out" });
      }
      if (tick.current) {
        gsap.fromTo(
          tick.current,
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.3, delay: 0.36, ease: "power2.out" }
        );
      }
    });
    return () => ctx.revert();
  }, [status]);

  const label =
    status === "ready"
      ? "Signed link verified"
      : status === "error"
        ? "Link not verified"
        : "Verifying signed link";

  return (
    <span className="verify-mark" data-state={status} role="status">
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
        <circle ref={ring} cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        {status === "ready" && (
          <path
            ref={tick}
            d="M5 8.3l2 2 4-4.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      <span className="t-data text-[0.625rem] uppercase tracking-[0.12em]">{label}</span>
    </span>
  );
}
