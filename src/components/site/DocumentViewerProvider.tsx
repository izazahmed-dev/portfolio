"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SourceDoc } from "@/lib/records";
import { DOCS } from "@/lib/records";
import { DocumentViewer } from "@/components/site/DocumentViewer";
import { useDocLink } from "@/components/site/DocumentAccess";

/**
 * The one place a document can be opened.
 *
 * Every entry point -- the cabinet drawer, the register's "Open the sheet",
 * and the warrant's evidence references -- routes through here rather than
 * linking straight at the file. That is the whole point: an <a href> to a PDF
 * hands it to the browser's native viewer, which has a download button and a
 * print button that no right-click guard on our side can reach. A single
 * shared surface means there is exactly one code path that shows a document,
 * and it is the canvas reader.
 *
 * Mount once, near the root, so the reader can be summoned from any section
 * without any of them owning its state.
 */
type OpenFn = (docId: string) => void;
type IsOpenFn = () => boolean;

const OpenContext = createContext<OpenFn>(() => {});
const IsOpenContext = createContext<IsOpenFn>(() => false);

export function DocumentViewerProvider({ children }: { children: ReactNode }) {
  const [docId, setDocId] = useState<string | null>(null);

  const open = useCallback((id: string) => setDocId(id), []);
  const value = useMemo(() => open, [open]);
  const isOpen = useMemo(() => () => docId !== null, [docId]);

  const doc: SourceDoc | null = docId
    ? DOCS.find((d) => d.id === docId) ?? null
    : null;

  return (
    <OpenContext.Provider value={value}>
      <IsOpenContext.Provider value={isOpen}>
        {children}
        {doc ? <Viewer doc={doc} onClose={() => setDocId(null)} /> : null}
      </IsOpenContext.Provider>
    </OpenContext.Provider>
  );
}

/** Open a document in the reader. Replaces a raw file link. */
export function useOpenDocument(): OpenFn {
  return useContext(OpenContext);
}

/**
 * Whether the reader is currently up.
 *
 * Layers below the reader use this to stand down: the cabinet drawer also
 * binds Escape, and without this a single press would close the reader AND
 * the drawer underneath it, throwing the visitor out of two steps at once.
 * Escape should peel one layer per press.
 */
export function useDocumentViewerOpen(): IsOpenFn {
  return useContext(IsOpenContext);
}

/**
 * Resolves the expiring signed URL. Kept inside the provider so the reader
 * never receives a URL from a caller, which keeps a single source of truth
 * for a value that expires.
 */
function Viewer({
  doc,
  onClose,
}: {
  doc: SourceDoc;
  onClose: () => void;
}) {
  const link = useDocLink(doc.id);
  if (!link) return null;
  return <DocumentViewer doc={doc} url={link.file} onClose={onClose} />;
}
