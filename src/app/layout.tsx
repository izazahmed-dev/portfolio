import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { PROFILE } from "@/lib/records";

/**
 * Display: Bricolage Grotesque. Loaded as a variable font with its wdth, wght
 * and opsz axes exposed, because the headlines animate those axes on scroll.
 * Body: Instrument Sans. Data: JetBrains Mono for every figure and reference.
 * One variable file per family beats fetching five static weights.
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
  themeColor: "#ece9e1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const TITLE = `${PROFILE.legalName}, AI and ML undergraduate, verified record`;
const DESCRIPTION =
  "Portfolio and document cabinet of Peddapalem Izaz Ahmed. B.Tech AI and Machine Learning at R.M.D. Engineering College, batch 2025 to 2029. Two shipped projects and ten source documents, each one openable.";

export const metadata: Metadata = {
  metadataBase: new URL("https://izazahmed.dev"),
  title: TITLE,
  description: DESCRIPTION,
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
  openGraph: {
    type: "profile",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_IN",
    siteName: `${PROFILE.shortName}, document cabinet`,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Izaz Ahmed, AI and ML undergraduate. Ten source documents, two shipped projects.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#ece9e1"/><path d="M6 6h20M6 6v20" stroke="#14120f" stroke-width="2.4"/><path d="M16 6v20M6 16h20" stroke="#d2320f" stroke-width="1.4"/></svg>'
          ),
        type: "image/svg+xml",
      },
    ],
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
  sameAs: [PROFILE.github],
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
      expires: "2028-07-30",
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Certificate of Internship, Machine Learning",
      credentialCategory: "certificate",
      recognizedBy: { "@type": "Organization", name: "Corizo" },
      identifier: "CRZ942568",
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <a href="#cabinet" className="skip-link">
          Skip to the documents
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        {/* Fixed paper grain. Pointer-events none, never on a scroll container. */}
        <div className="grain no-print" aria-hidden="true" />
      </body>
    </html>
  );
}
