import { RunningHead, Imprint } from "@/components/site/Chrome";
import { TitlePage } from "@/components/site/TitlePage";
import { Cabinet } from "@/components/site/Cabinet";
import { Dossier } from "@/components/site/Dossier";
import { Register } from "@/components/site/Register";
import { Warrant, Colophon } from "@/components/site/Warrant";

/**
 * Server component. Every animated island below is its own client leaf.
 *
 * Section order is the argument: statement, evidence cabinet, project dossier,
 * transcribed register, warranted capability, contact.
 *
 * Layout families, each used once: asymmetric split title page, index plus
 * sticky plate, full-width case with drawn margin rule, tabbed register table,
 * three column warrant rows, split colophon.
 */
export default function Page() {
  return (
    <>
      <RunningHead />
      <main id="main">
        <TitlePage />
        <Cabinet />
        <Dossier />
        <Register />
        <Warrant />
        <Colophon />
      </main>
      <Imprint />
    </>
  );
}
