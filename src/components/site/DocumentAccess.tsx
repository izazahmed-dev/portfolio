"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Signed document links, passed from the server and shared with client leaves.
 *
 * The split matters. The PROVIDER has to be a client component because
 * createContext is a client-side hook, but the VALUES are computed in
 * src/app/page.tsx, which is a server component. That is the whole design:
 * the HMAC secret is imported only by the server half, so it can never reach
 * the client bundle, while the consumers underneath stay ordinary client
 * components.
 *
 * Every link here is signed and expiring. No bare path into /secured is ever
 * written into the HTML.
 */
export interface DocLinks {
  /** original, opened in a new tab */
  file: string;
  /** watermarked webp preview */
  preview: string;
}

export const DocLinkContext = createContext<Record<string, DocLinks>>({});

export function DocumentAccess({
  links,
  children,
}: {
  links: Record<string, DocLinks>;
  children: ReactNode;
}) {
  return (
    <DocLinkContext.Provider value={links}>{children}</DocLinkContext.Provider>
  );
}

/**
 * Read the signed links for one document. Returns undefined if the context is
 * missing, which callers treat as "no link available" rather than crashing.
 */
export function useDocLink(docId: string): DocLinks | undefined {
  return useContext(DocLinkContext)[docId];
}

