"use client";

import { useRef, useState, useContext } from "react";
import { ArrowUpRight, Check, Copy, Mail, MapPin, Phone } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import {
  CaseDrop,
  LiftOff,
  ProseReveal,
  RegisterShift,
  useDirectionalWipe,
} from "@/components/motion/Kinetic";
import { CAPABILITY, DOCS, PROFILE } from "@/lib/records";
import { DocLinkContext } from "@/components/site/DocumentAccess";
import { useOpenDocument } from "@/components/site/DocumentViewerProvider";

/**
 * Warrant.
 * Each claim terminates in the document that backs it, so the section is an
 * argument rather than a skills cloud. The reference on the right slides in
 * after its claim, which is the point: the paper arrives second.
 */
export function Warrant() {
  const root = useRef<HTMLElement | null>(null);

  // Signed links for every capability's evidence document, minted in one read
  // of the context. doc.file is a bare path into /secured and must never be
  // written into the DOM, so the reference links resolve through here instead.
  const links = useContext(DocLinkContext);
  const openDocument = useOpenDocument();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".warrant-row", {
        y: 26,
        opacity: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: ".warrant-list", start: "top 82%", once: true },
      });

      gsap.from(".warrant-ref", {
        x: 18,
        opacity: 0,
        duration: 0.8,
        delay: 0.22,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: ".warrant-list", start: "top 82%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section
      id="warrant"
      ref={root as React.RefObject<HTMLElement>}
      className="relative scroll-mt-[var(--chrome)] py-24 md:py-32"
      style={{ borderTop: "1px solid var(--rule-strong)", background: "var(--stock-raised)" }}
    >
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <RegisterShift as="h2" className="t-h2">
              What I can do, and the paper that says so.
            </RegisterShift>
          </div>
        </div>

        <div className="warrant-list mt-16">
          {CAPABILITY.map((c, i) => {
            const doc = DOCS.find((d) => d.id === c.evidence);
            const link = doc ? links[doc.id] : undefined;
            return (
              <div
                key={c.head}
                className="warrant-row grid items-baseline gap-x-10 gap-y-4 py-8 md:grid-cols-[230px_minmax(0,1fr)_190px]"
                style={{
                  borderTop: i === 0 ? "1px solid var(--rule-strong)" : "none",
                  borderBottom: "1px solid var(--rule)",
                }}
              >
                <CaseDrop as="h3" className="t-h3" seed={11 + i * 7}>
                  {c.head}
                </CaseDrop>
                <p className="t-body">{c.body}</p>

                {/*
                  A button, not a link. An <a href> to the file hands it to the
                  browser's native PDF viewer, which brings its own download and
                  print buttons. Opening the same canvas reader the cabinet
                  uses keeps every document behind one surface.
                */}
                {doc && link && (
                  <button
                    type="button"
                    onClick={() => openDocument(doc.id)}
                    className="warrant-ref rule-link t-data inline-flex items-start gap-2 text-[0.625rem] uppercase leading-relaxed tracking-[0.12em] md:justify-self-end md:text-right"
                    style={{ color: "var(--ink-mut)", cursor: "pointer" }}
                  >
                    {doc.reference ?? doc.issuer}
                    <ArrowUpRight
                      size={11}
                      strokeWidth={2.2}
                      className="mt-[3px] shrink-0"
                      style={{ color: "var(--accent-ink)" }}
                    />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Colophon.
 * One contact intent for the whole page, matching the running head. The
 * statement sets on a closing axis morph so the sheet ends the way it opened.
 */
export function Colophon() {
  const [copied, setCopied] = useState<string | null>(null);
  const wipe = useDirectionalWipe<HTMLAnchorElement>();

  const copy = (value: string, key: string) => {
    void navigator.clipboard.writeText(value).then(() => {
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1700);
    });
  };

  return (
    <section
      id="colophon"
      className="relative scroll-mt-[var(--chrome)] py-24 md:py-32"
      style={{ borderTop: "1px solid var(--rule-strong)" }}
    >
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <LiftOff as="h2" className="t-statement">
            Open for an AI and ML internship from summer 2027.
          </LiftOff>

          <ProseReveal as="p" className="t-body mt-7">
            Reachable on the college address below. If you want the record before the conversation, every document on this page is already open.
          </ProseReveal>

          <a ref={wipe} href={`mailto:${PROFILE.email}`} className="btn mt-9">
            Email me
            <ArrowUpRight size={13} strokeWidth={2.2} />
          </a>
        </div>

        <div className="lg:col-span-5">
          <dl>
            <Line
              icon={<Mail size={13} strokeWidth={1.9} />}
              k="Email"
              v={PROFILE.email}
              href={`mailto:${PROFILE.email}`}
              onCopy={() => copy(PROFILE.email, "email")}
              copied={copied === "email"}
              first
            />
            <Line
              icon={<Phone size={13} strokeWidth={1.9} />}
              k="Phone"
              v={PROFILE.phone}
              href={`tel:${PROFILE.phone.replace(/\s/g, "")}`}
              onCopy={() => copy(PROFILE.phone, "phone")}
              copied={copied === "phone"}
            />
            <Line
              icon={<ArrowUpRight size={13} strokeWidth={1.9} />}
              k="GitHub"
              v={PROFILE.githubHandle}
              href={PROFILE.github}
            />
            <Line
              icon={<ArrowUpRight size={13} strokeWidth={1.9} />}
              k="LinkedIn"
              v="izazahmed-dev"
              href={PROFILE.linkedin}
            />
            <Line
              icon={<MapPin size={13} strokeWidth={1.9} />}
              k="Based"
              v={`${PROFILE.home}, studying in Tamil Nadu`}
            />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Line({
  icon,
  k,
  v,
  href,
  onCopy,
  copied,
  first,
}: {
  icon: React.ReactNode;
  k: string;
  v: string;
  href?: string;
  onCopy?: () => void;
  copied?: boolean;
  first?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 py-[18px]"
      style={{
        borderTop: first ? "1px solid var(--rule-strong)" : "none",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <span style={{ color: "var(--ink-lbl)" }}>{icon}</span>
        <div className="min-w-0">
          <dt className="t-label">{k}</dt>
          <dd className="mt-1 truncate text-[0.9375rem]">
            {href ? (
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="rule-link"
              >
                {v}
              </a>
            ) : (
              v
            )}
          </dd>
        </div>
      </div>

      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          className="btn--quiet shrink-0"
          aria-label={`Copy ${k.toLowerCase()}`}
        >
          {copied ? (
            <Check size={12} strokeWidth={2.2} style={{ color: "var(--accent)" }} />
          ) : (
            <Copy size={12} strokeWidth={1.9} />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      )}
    </div>
  );
}
