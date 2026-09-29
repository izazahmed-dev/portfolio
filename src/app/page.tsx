import { RunningHead, Imprint } from "@/components/site/Chrome";
import { TitlePage } from "@/components/site/TitlePage";
import { Dossier } from "@/components/site/Dossier";
import { Cabinet } from "@/components/site/Cabinet";
import { Register } from "@/components/site/Register";
import { Warrant, Colophon } from "@/components/site/Warrant";
import { DOCS } from "@/lib/records";
import { fileUrl, previewUrl } from "@/lib/signing";
import { DocumentAccess } from "@/components/site/DocumentAccess";

/**
 * Server component. Every animated island below is its own client leaf.
 *
 * force-dynamic is load-bearing, not decorative. Ten documents get a fresh
 * signed link on every request, so caching the rendered HTML would ship an
 * already-expiring set of links to every visitor after it. Per-request
 * rendering is the cost of access control.
 *
 * Section order is the argument, and the order was revised so the reader
 * meets the work before the record: statement, built work, evidence cabinet,
 * transcribed register, warranted capability, contact. A recruiter scrolling
 * for six seconds should hit a shipped project, not a semester sheet.
 *
 * Layout families, each used once and deliberately not matching: asymmetric
 * split title page, full-width case with drawn margin rule, index plus
 * sticky plate, tabbed register table, three column warrant rows, split
 * colophon. Section headers vary for the same reason: one full-width
 * headline with no preamble, one marginalia rail, one inverted right-hand
 * headline, one with no header at all because the table is the header.
 */
export const dynamic = "force-dynamic";

export default function Page() {
  /*
   * Signed links are minted HERE, in a server component, and only the finished
   * strings cross into the client half. The HMAC secret is imported solely by
   * this module and the route handlers, so it is never part of the browser
   * bundle and cannot be read from devtools.
   */
  const links = Object.fromEntries(
    DOCS.map((d) => [d.id, { file: fileUrl(d.id), preview: previewUrl(d.id) }])
  );

  return (
    <DocumentAccess links={links}>
      <RunningHead />
      <main id="main">
        <TitlePage />
        <Dossier />
        <Cabinet />
        <Register />
        <Warrant />
        <Colophon />
      </main>
      <Imprint />
    </DocumentAccess>
  );
}
