import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export const viewport: Viewport = {
  themeColor: "#100904",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "PEDDAPALEM IZAZ AHMED — AI Systems & Autonomous Agent Architecture",
  description:
    "Engineering portfolio & verified academic dossier of Peddapalem Izaz Ahmed (B.Tech AIML Batch 2025–2029, RMD Engineering College). Specializing in Oracle Certified Agentic AI Architectures, Autonomous Swarms, and High-Throughput Neural Systems.",
  keywords: [
    "Peddapalem Izaz Ahmed",
    "Izaz Ahmed",
    "AIML",
    "RMD Engineering College",
    "Oracle Certified Agentic AI",
    "Autonomous AI Agents",
    "Machine Learning Intern",
    "Class of 2029",
  ],
  authors: [{ name: "Peddapalem Izaz Ahmed" }],
  openGraph: {
    title: "PEDDAPALEM IZAZ AHMED — AI Systems & Autonomous Agent Architecture",
    description: "Oracle Certified Agentic AI Architect • RMD Engineering College (2025–2029)",
    type: "website",
    locale: "en_US",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Peddapalem Izaz Ahmed",
  "jobTitle": "Artificial Intelligence & Machine Learning Student Engineer",
  "affiliation": {
    "@type": "CollegeOrUniversity",
    "name": "RMD Engineering College"
  },
  "alumniOf": [
    {
      "@type": "EducationalOrganization",
      "name": "Sri Venkateshwara Children's High School"
    },
    {
      "@type": "EducationalOrganization",
      "name": "Raju Junior College"
    }
  ],
  "knowsAbout": [
    "Oracle Agentic AI",
    "Python",
    "Machine Learning",
    "C++",
    "Java",
    "Autonomous Multi-Agent Swarms"
  ],
  "description": "B.Tech AIML undergraduate (Batch 2025–2029) specializing in agentic workflows, autonomous systems, and predictive modeling."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#100904] text-[#ffedd7] antialiased overflow-x-hidden selection:bg-[#dc5000] selection:text-[#100904]">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
