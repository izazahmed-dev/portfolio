import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import { PROFILE } from "@/lib/records";

/**
 * Display: Bricolage Grotesque. Loaded as a variable font with its wdth, wght
 * and opsz axes exposed, because the headlines animate those axes on scroll.
 * Body: Instrument Sans. Data: JetBrains Mono for every figure and reference.
 * One variable file per family beats fetching five static weights.
 *
 * AXIS NOTE: Bricolage Grotesque's wdth range on Google Fonts is 75 to 100,
 * with wght from 200 to 800. There is no extended width above 100, so no
 * animation in this codebase asks the axis to travel there.
 */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-display",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ece9e1" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f14" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const TITLE = `${PROFILE.legalName}, AI and ML undergraduate, verified record`;
const DESCRIPTION =
  "AI and ML portfolio of Peddapalem Izaz Ahmed: CivicPulse turns spoken complaints into triaged cases across eleven languages, alongside a local-first computer-vision monitor.";

export const metadata: Metadata = {
  metadataBase: new URL("https://izazahmed.dev"),
  title: TITLE,
  description: DESCRIPTION,
  category: "technology",
  formatDetection: { telephone: false },
  applicationName: "Izaz Ahmed, document cabinet",
  authors: [{ name: PROFILE.legalName, url: PROFILE.github }],
  creator: PROFILE.legalName,
  keywords: [
    "Peddapalem Izaz Ahmed",
    "Izaz Ahmed",
    "AI and Machine Learning undergraduate",
    "R.M.D. Engineering College",
    "CivicPulse",
    "posture and blink monitor",
    "Oracle Agentic AI Foundations Associate",
    "ISTE Ramanujan Mathematical Competitions",
    "machine learning internship",
  ],
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "profile",
    url: "https://izazahmed.dev",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_IN",
    siteName: `${PROFILE.shortName}, document cabinet`,
    // AVIF first, PNG as the declared fallback. The previous metadata pointed
    // only at a 235KB PNG while a 30KB AVIF sat unused in /public -- a 208KB
    // saving on every social preview fetch, which is the single most-crawled
    // asset on the site.
    images: [
      {
        url: "/og.avif",
        width: 1200,
        height: 630,
        alt: "Izaz Ahmed, AI and ML undergraduate. CivicPulse, a multilingual civic reporting project.",
        type: "image/avif",
      },
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Izaz Ahmed, AI and ML undergraduate. CivicPulse, a multilingual civic reporting project.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      { url: "/og.avif", alt: "Izaz Ahmed, AI and ML undergraduate building CivicPulse" },
      { url: "/og.png", alt: "Izaz Ahmed, AI and ML undergraduate building CivicPulse" },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      // Real files rather than a data URI: crawlers and browser home-screen
      // shortcuts handle a fetchable asset more reliably, and the raster sizes
      // let a high-density display pick a sharp one.
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.legalName,
  alternateName: PROFILE.shortName,
  jobTitle: PROFILE.role,
  email: `mailto:${PROFILE.email}`,
  telephone: PROFILE.phone,
  url: "https://izazahmed.dev",
  sameAs: [
    PROFILE.github,
    PROFILE.linkedin,
  ],
  identifier: PROFILE.registerNo,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tirupati",
    addressRegion: "Andhra Pradesh",
    addressCountry: "IN",
  },
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: PROFILE.institution,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kavaraipettai",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
  },
  alumniOf: [
    { "@type": "EducationalOrganization", name: "Raju Junior College, Tirupati" },
    {
      "@type": "EducationalOrganization",
      name: "Sri Venkateswara Childrens High School, Tirupati",
    },
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "Agentic AI Certified Foundations Associate",
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: "Oracle" },
      identifier: "103498358AAI26OFA",
      validFrom: "2026-07-30",
      // The schema.org property is validThrough. The previous "expires" key was
      // not a valid property and validators were silently dropping it, so the
      // two-year validity never reached a consumer of this data.
      validThrough: "2028-07-30",
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Certificate of Internship, Machine Learning",
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: "Corizo" },
      identifier: "CRZ942568",
      validFrom: "2026-02-04",
      validThrough: "2026-04-05",
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Certificate of Training, Machine Learning",
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: "Corizo" },
      identifier: "CRZ942567",
      validFrom: "2026-02-04",
      validThrough: "2026-04-05",
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Ramanujan Mathematical Competition, Level 3, national round",
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: "ISTE Tamilnadu Section" },
      // A participation certificate for the national round. Stated as such
      // rather than implied as a rank, which the document does not record.
      description: "Certificate of participation at the national level round",
      validFrom: "2026-02-21",
    },
  ],
  knowsLanguage: ["en", "te", "hi", "sa"],
  knowsAbout: [
    "Python",
    "C++",
    "Java",
    "TypeScript",
    "Machine learning",
    "Computer vision",
    "MediaPipe",
    "OpenCV",
    "Next.js",
    "Agentic AI",
  ],
};

/**
 * Applied before the first paint, synchronously, so the page never flashes
 * the wrong sheet of paper. Sizing the document in the same script avoids a
 * second layout pass and the layout shift that comes with it.
 */
const noFlash = `(function(){try{
  var s=localStorage.getItem("press-run");
  var t=(s==="light"||s==="dark")?s:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");
  document.documentElement.setAttribute("data-theme",t);
  document.documentElement.style.colorScheme=t;
}catch(e){
  document.documentElement.setAttribute("data-theme","dark");
  document.documentElement.style.colorScheme="dark";
}})();`;


/**
 * CONTEXT MENU GUARD
 *
 * Installed in the document head as a blocking script so it is live before
 * React hydrates, rather than a useEffect that leaves a window where the menu
 * still opens. Written as a plain string rather than a component because it
 * has to exist in the very first parsed HTML.
 *
 * WHAT IT DOES: suppresses the browser context menu on the document, and on
 * every image, so "Save image as" and "Open image in new tab" are not offered
 * by right-click. It also stops drag-to-desktop on images, the other
 * one-click route to a file.
 *
 * WHAT IT DOES NOT DO, and it is worth being blunt: this is not protection.
 * A visitor who wants the bytes still gets them, and there is no way to
 * change that. F12 to the Network tab, Ctrl+S, or plain curl all bypass a
 * listener trivially, because curl never runs JavaScript. The real protection
 * is the signed expiring URLs in src/lib/signing.ts, which remove the
 * permanent public link. This only raises the effort for the casual case.
 *
 * THE ACCESSIBILITY TRADE, made explicit. Right-click is not the only route to
 * a context menu: keyboard and screen-reader users use Shift+F10 or the Menu
 * key, and touch users long-press. So this deliberately:
 *
 *   - still opens the menu when Shift is held, which is how keyboard and
 *     screen-reader users raise the same menu (Shift+F10, and the Menu key on
 *     most layouts), so keyboard-only navigation is not degraded;
 *   - still allows the menu inside text fields, where right-click is the only
 *     route to cut, copy and paste;
 *   - never sets user-select none, because that would break text selection
 *     for everyone, and copying an email address is a legitimate need here.
 *
 * Net effect: mouse users lose right-click, keyboard and touch users do not.
 * Making it absolute for everyone is a two-line change marked ABSOLUTE below,
 * but it will fail WCAG 2.1 success criterion 2.1.1, and this is a portfolio
 * you want recruiters to be able to use comfortably.
 */
const contextGuard = `(function(){
  /*
   * The keyboard escape hatch.
   *
   * IMPORTANT, and this was a real bug caught by testing: a contextmenu event
   * carries NO usable key information. A mouse right-click has key === "" and
   * a real Shift+F10 also reports key === "" on the contextmenu event, because
   * that event is fired by the browser's menu logic rather than from the key
   * press. So the original check for e.key === 'F10' could never be true and
   * the escape hatch silently never worked -- the menu was blocked for
   * keyboard users too, which is exactly the accessibility failure this was
   * meant to avoid.
   *
   * The only reliable signal is the modifier, because the OS/browsers do set
   * shiftKey for the Shift+F10 combination. That is what is tested below. It
   * means a user who happens to be holding Shift while right-clicking with a
   * mouse also gets the menu, which is a far better failure mode than denying
   * keyboard users their only route to the menu.
   */
  function openForKeyboard(e){
    return e.shiftKey === true;
  }

  function onContextMenu(e){
    var t = e.target;
    if(!t || !t.nodeType) return;
    if(openForKeyboard(e)) return;

    // Text entry keeps its menu: cut, copy and paste are keyboard-reachable
    // everywhere except here, so blocking it would remove the ability.
    if(t.closest && t.closest('input, textarea, select, [contenteditable="" i], [contenteditable="true" i]')) return;

    e.preventDefault();
  }

  // Capture phase, so this runs before any component-level handler and cannot
  // be defeated by a child calling stopPropagation first.
  document.addEventListener('contextmenu', onContextMenu, true);

  // Images: also stop the native drag-to-desktop.
  document.addEventListener('dragstart', function(e){
    if(e.target && e.target.nodeName === 'IMG') e.preventDefault();
  }, true);
})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // data-theme is set by the inline script above; the attribute is
      // present on first paint so nothing inverts mid-load.
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        {/*
          First, before anything else. The guard is a blocking script with no
          defer, so the listener is attached during initial parse -- there is
          no hydration window in which right-click still opens a menu.
        */}
        <script dangerouslySetInnerHTML={{ __html: contextGuard }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          // Determines the press run before React exists. No flash, no
          // inverted frame, no layout shift from the colour swap.
          dangerouslySetInnerHTML={{ __html: noFlash }}
        />
      </head>
      <body>
        {/*
          Points at #main, the wrapper around every section, rather than at
          #cabinet. Targeting the cabinet skipped the hero AND both project
          cases, which is most of the page -- the opposite of what a skip link
          is for.
        */}
        <a href="#main" className="skip-link">
          Skip to the content
        </a>
        <ThemeProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
        {/* Fixed paper grain. Pointer-events none, never on a scroll container. */}
        <div className="grain no-print" aria-hidden="true" />
      </body>
    </html>
  );
}
