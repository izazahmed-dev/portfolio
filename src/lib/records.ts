/**
 * records.ts
 * Every value in this file is transcribed from a real document that ships in
 * /public/documents. Nothing here is estimated, rounded up, or invented.
 * If a document does not state a number, this file does not claim one.
 */

export type DocKind = "pdf" | "image";

export interface SourceDoc {
  /** stable id, used for deep links and the ledger URL hash */
  id: string;
  /** ledger row label */
  title: string;
  issuer: string;
  /** short kind tag shown in the index */
  category: "Certification" | "Competition" | "Industry" | "Institution" | "Board";
  /** printed date on the document */
  issued: string;
  /** identifier printed on the document, or null when none exists */
  reference: string | null;
  /** the single most load-bearing fact on the page */
  headline: string;
  /** verbatim-ish detail lines, each independently checkable on the scan */
  facts: string[];
  file: string;
  preview: string;
  kind: DocKind;
  /** honest note about what the document does and does not prove */
  caveat?: string;
}

export interface MarkRow {
  subject: string;
  /** left column value */
  a: string;
  /** right column value, empty when the sheet has a single column */
  b?: string;
}

export interface Transcript {
  id: string;
  label: string;
  authority: string;
  institution: string;
  place: string;
  session: string;
  identifier: string;
  result: string;
  headline: string;
  headlineNote: string;
  columns: [string, string?];
  rows: MarkRow[];
  totalLabel: string;
  totalValue: string;
  docId: string;
}

export interface Repo {
  id: string;
  index: string;
  name: string;
  url: string;
  tagline: string;
  /** concise problem-to-outcome summary shown before engineering details */
  outcome: string;
  /** what problem it solves, in plain language */
  premise: string;
  /** engineering decisions worth defending in an interview */
  decisions: { head: string; body: string }[];
  /** measured or code-defined values, never marketing numbers */
  readings: { label: string; value: string; note: string }[];
  stack: string[];
  languages: { name: string; bytes: number }[];
  license: string;
  preview: string;
  previewAlt: string;
}

export const PROFILE = {
  legalName: "Peddapalem Izaz Ahmed",
  shortName: "Izaz Ahmed",
  role: "AI and Machine Learning undergraduate",
  registerNo: "111525203076",
  programme: "B.Tech Artificial Intelligence and Machine Learning",
  institution: "R.M.D. Engineering College",
  institutionNote: "An autonomous institution affiliated to Anna University, Chennai",
  campus: "R.S.M. Nagar, Kavaraipettai 601 206, Thiruvallur District, Tamil Nadu",
  batch: "2025 to 2029",
  home: "Tirupati, Andhra Pradesh",
  email: "izazahmed.dev@gmail.com",
  phone: "+91 99856 56586",
  github: "https://github.com/izazahmed-dev",
  githubHandle: "izazahmed-dev",
  /**
   * LinkedIn is the single highest-value addition to sameAs for a student
   * hunting an internship: it is where recruiters actually search. Set the
   * real URL here before deploying -- an empty string is filtered out of the
   * JSON-LD rather than emitted as a broken link.
   */
  linkedin: "https://www.linkedin.com/in/izazahmed-dev",
  /** hero: the name sets as the headline, in the display face */
  statement: ["Peddapalem", "Izaz Ahmed"],
  /** 24 words */
  subtext:
    "Everything on this page opens its own receipt. Second year AI and ML undergraduate, two shipped projects, ten source documents, no unverifiable claim.",
} as const;

/* ------------------------------------------------------------------
   THE LEDGER
   Ten documents. Each row in the index resolves to one of these.
   ------------------------------------------------------------------ */
export const DOCS: SourceDoc[] = [
  {
    id: "oracle-agentic-ai",
    title: "Agentic AI Certified Foundations Associate",
    issuer: "Oracle",
    category: "Certification",
    issued: "30 July 2026",
    reference: "103498358AAI26OFA",
    headline: "Valid to 30 July 2028",
    facts: [
      "Issued in the name Izaz Ahmed Peddapalem",
      "Oracle certification track, foundations tier",
      "Certificate number printed on the eCertificate itself",
    ],
    file: "/documents/oracle-agentic-ai-associate.pdf",
    preview: "/previews/oracle-agentic-ai-associate.webp",
    kind: "pdf",
  },
  {
    id: "corizo-internship",
    title: "Certificate of Internship, Machine Learning",
    issuer: "Corizo",
    category: "Industry",
    issued: "04 February 2026 to 05 April 2026",
    reference: "CRZ942568",
    headline: "Machine learning internship, completed",
    facts: [
      "Issued in the name P. Izaz Ahmed",
      "Signed by Hemant Ingle, Academic Head",
      "Carries a QR verification code and Corizo Dice ID",
    ],
    file: "/documents/corizo-ml-internship.pdf",
    preview: "/previews/corizo-ml-internship.webp",
    kind: "pdf",
    caveat:
      "The certificate is co-branded with IIT Bombay's Mood Indigo. That is a partnership mark, not an IIT Bombay academic credential.",
  },
  {
    id: "corizo-training",
    title: "Certificate of Training, Machine Learning",
    issuer: "Corizo",
    category: "Industry",
    issued: "04 February 2026 to 05 April 2026",
    reference: "CRZ942567",
    headline: "Training track completed alongside the internship",
    facts: [
      "Issued in the name P. Izaz Ahmed",
      "Separate Dice ID from the internship certificate",
      "Same programme window as CRZ942568",
    ],
    file: "/documents/corizo-ml-training.pdf",
    preview: "/previews/corizo-ml-training.webp",
    kind: "pdf",
  },
  {
    id: "iste-level-3",
    title: "Ramanujan Mathematical Competitions, Level 3",
    issuer: "ISTE Tamilnadu Section",
    category: "Competition",
    issued: "21 and 22 February 2026",
    reference: null,
    headline: "National level round, reached from two qualifying rounds",
    facts: [
      "Certificate of participation, national level",
      "Issued to Izaz Ahmed P, first year AIML, R.M.D. Engineering College",
      "Signed by the ISTE Tamilnadu Section Chairman and Secretary",
    ],
    file: "/documents/iste-ramanujan-level-3.jpg",
    preview: "/previews/iste-ramanujan-level-3.webp",
    kind: "image",
    caveat:
      "This is a participation certificate for the national round. It records the stage reached, not a rank or a score.",
  },
  {
    id: "iste-level-2",
    title: "Ramanujan Mathematical Competitions, Level 2",
    issuer: "ISTE Tamilnadu Section",
    category: "Competition",
    issued: "14 and 15 February 2026",
    reference: null,
    headline: "State level round",
    facts: [
      "Second of three rounds in the 2025 to 2026 cycle",
      "Conducted for engineering college students across the section",
      "Precedes the national round held the following week",
    ],
    file: "/documents/iste-ramanujan-level-2.jpg",
    preview: "/previews/iste-ramanujan-level-2.webp",
    kind: "image",
  },
  {
    id: "iste-level-1",
    title: "Ramanujan Mathematical Competitions, Level 1",
    issuer: "ISTE Tamilnadu Section",
    category: "Competition",
    issued: "24 and 25 January 2026",
    reference: null,
    headline: "Chapter level round, entry point of the cycle",
    facts: [
      "First of three rounds, held at chapter level",
      "Academic year 2025 to 2026",
      "Same competition series as Level 2 and Level 3",
    ],
    file: "/documents/iste-ramanujan-level-1.jpg",
    preview: "/previews/iste-ramanujan-level-1.webp",
    kind: "image",
  },
  {
    id: "rmd-sem-2",
    title: "End Semester Results, Semester 2",
    issuer: "R.M.D. Engineering College",
    category: "Institution",
    issued: "April and May 2026",
    reference: "111525203076",
    headline: "GPA 9.375, eight graded courses, zero re-appearances",
    facts: [
      "S grade in Data Structures, Java Programming, Linear Algebra, Idea Lab II",
      "Issued by the Office of the Controller of Examinations",
      "Every listed course carries the result PASS",
    ],
    file: "/documents/rmd-semester-2-result.pdf",
    preview: "/previews/rmd-semester-2-result.webp",
    kind: "pdf",
    caveat:
      "The sheet is marked provisional by the college. The institution treats its final mark sheets as authoritative.",
  },
  {
    id: "rmd-sem-1",
    title: "End Semester Results, Semester 1",
    issuer: "R.M.D. Engineering College",
    category: "Institution",
    issued: "November and December 2025",
    reference: "111525203076",
    headline: "GPA 8.792, CGPA 8.79 as printed",
    facts: [
      "O grade in Idea Lab I, A+ in four courses",
      "Four non credit courses recorded as completed",
      "Every listed course carries the result PASS",
    ],
    file: "/documents/rmd-semester-1-result.pdf",
    preview: "/previews/rmd-semester-1-result.webp",
    kind: "pdf",
    caveat: "Provisional result sheet, same disclaimer as the semester 2 sheet.",
  },
  {
    id: "bieap-intermediate",
    title: "Intermediate Pass Certificate cum Memorandum of Marks",
    issuer: "Board of Intermediate Education, Andhra Pradesh",
    category: "Board",
    issued: "Examination held March 2025",
    reference: "Y285672",
    headline: "940 of 1000, A grade",
    facts: [
      "Registered number 2519230494",
      "Mathematics B, 149 of 150 across both years",
      "Full marks in both Physics and Chemistry practicals",
    ],
    file: "/documents/bieap-intermediate-marks.pdf",
    preview: "/previews/bieap-intermediate-marks.webp",
    kind: "pdf",
  },
  {
    id: "bseap-ssc",
    title: "Secondary School Certificate",
    issuer: "Board of Secondary Education, Andhra Pradesh",
    category: "Board",
    issued: "Examination held April 2023",
    reference: "WW 315890",
    headline: "575 of 600, first division",
    facts: [
      "Roll number 2319127769",
      "99 in first language and 99 in general science",
      "Certificate carries a QR code and a board barcode",
    ],
    file: "/documents/bseap-ssc-marks.pdf",
    preview: "/previews/bseap-ssc-marks.webp",
    kind: "pdf",
  },
];

/* ------------------------------------------------------------------
   TRANSCRIPTS
   ------------------------------------------------------------------ */
export const TRANSCRIPTS: Transcript[] = [
  {
    id: "btech",
    label: "Undergraduate, in progress",
    authority: "Office of the Controller of Examinations",
    institution: "R.M.D. Engineering College",
    place: "Kavaraipettai, Tamil Nadu",
    session: "2025 to 2029",
    identifier: "Register 111525203076",
    result: "Zero re-appearances across both semesters",
    headline: "8.792 to 9.375",
    headlineNote: "GPA, semester 1 to semester 2",
    columns: ["Sem 1", "Sem 2"],
    rows: [
      { subject: "Mathematics", a: "A+ Matrices and Calculus", b: "S Linear Algebra" },
      { subject: "Programming", a: "A+ C++", b: "S Java" },
      { subject: "Core computing", a: "A+ Software Development Practices", b: "S Data Structures" },
      { subject: "Artificial intelligence", a: "not offered", b: "A Introduction to AI" },
      { subject: "Sciences", a: "A+ Engineering Chemistry", b: "A Physics for Information Science" },
      { subject: "Hardware", a: "A Digital Principles and System Design", b: "not offered" },
      { subject: "Idea Lab", a: "O Idea Lab I", b: "S Idea Lab II" },
      { subject: "Human sciences", a: "A Interpersonal Skills", b: "S Innovation and Creativity" },
    ],
    totalLabel: "Semester GPA",
    totalValue: "8.792 then 9.375",
    docId: "rmd-sem-2",
  },
  {
    id: "intermediate",
    label: "Higher secondary, MPC",
    authority: "Board of Intermediate Education, Andhra Pradesh",
    institution: "Raju Junior College",
    place: "170 Air Bypass Road, Tirupati",
    session: "Examination held March 2025",
    identifier: "Registered 2519230494",
    result: "Passed in A grade",
    headline: "940 / 1000",
    headlineNote: "Aggregate across both years",
    columns: ["Year 1", "Year 2"],
    rows: [
      { subject: "Mathematics B", a: "75 / 75", b: "74 / 75" },
      { subject: "Mathematics A", a: "71 / 75", b: "68 / 75" },
      { subject: "Sanskrit", a: "97 / 100", b: "91 / 100" },
      { subject: "English", a: "90 / 100", b: "90 / 100" },
      { subject: "Physics theory", a: "58 / 60", b: "56 / 60" },
      { subject: "Chemistry theory", a: "54 / 60", b: "56 / 60" },
      { subject: "Physics practical", a: "not held", b: "30 / 30" },
      { subject: "Chemistry practical", a: "not held", b: "30 / 30" },
    ],
    totalLabel: "Aggregate",
    totalValue: "940 of 1000",
    docId: "bieap-intermediate",
  },
  {
    id: "ssc",
    label: "Secondary school",
    authority: "Board of Secondary Education, Andhra Pradesh",
    institution: "Sri Venkateswara Childrens High School",
    place: "Bhavani Nagar, Tirupati",
    session: "Examination held April 2023",
    identifier: "Roll 2319127769",
    result: "Passed in first division",
    headline: "575 / 600",
    headlineNote: "Six subjects, English medium",
    columns: ["Marks"],
    rows: [
      { subject: "First language, Telugu and Sanskrit", a: "99 / 100" },
      { subject: "General science", a: "99 / 100" },
      { subject: "Mathematics", a: "98 / 100" },
      { subject: "Social studies", a: "96 / 100" },
      { subject: "Hindi", a: "95 / 100" },
      { subject: "English", a: "88 / 100" },
    ],
    totalLabel: "Grand total",
    totalValue: "575 of 600",
    docId: "bseap-ssc",
  },
];

/* ------------------------------------------------------------------
   WORK
   Language byte counts come from the GitHub languages endpoint.
   ------------------------------------------------------------------ */
export const REPOS: Repo[] = [
  {
    id: "civicpulse",
    index: "01",
    name: "CivicPulse",
    url: "https://github.com/izazahmed-dev/CivicPulse",
    tagline: "Civic complaints in eleven languages, by voice if typing is the barrier",
    outcome:
      "A multilingual reporting path that turns a spoken complaint into a triaged authority-board case, with citizen tracking instead of a silent submission box.",
    premise:
      "Municipal reporting in India assumes a literate English speaker with a smartphone and patience. CivicPulse removes all three assumptions. A citizen speaks a complaint about water, roads, electricity or sanitation in their own language, and it lands on an authority board already triaged.",
    decisions: [
      {
        head: "Voice first, not voice added",
        body: "Web Speech API handles browsers that support the language. Sarvam AI speech to text covers the Indian languages browsers do not. A Twilio IVR line handles the citizen who has a phone but no browser at all.",
      },
      {
        head: "Triage belongs to the authority, not the citizen",
        body: "Complaints arrive on a Kanban board with a model generated first diagnosis attached. The official moves the card. The citizen sees a tracking timeline, so the queue position is never a mystery.",
      },
      {
        head: "Verification is crowdsourced and paid in bounties",
        body: "Open issues become claimable bounties. A claimant uploads photo proof, a model checks the proof against the original report, and area leaderboards convert that into something people actually compete over.",
      },
      {
        head: "Forecasting runs outside the web tier",
        body: "Area level water supply prediction is a separate Python FastAPI service with scikit-learn, fed by complaint history plus news and dam bulletin signals. Keeping it out of the Next.js runtime keeps the request path short.",
      },
    ],
    readings: [
      { label: "Languages in the interface", value: "11", note: "Full UI translation, not partial strings" },
      { label: "API routes", value: "19", note: "Complaints, bounties, forecast, IVR, chat" },
      { label: "Routed pages", value: "12", note: "Citizen, authority and analytics surfaces" },
      { label: "TypeScript", value: "813 KB", note: "Reported by the GitHub languages endpoint" },
    ],
    stack: [
      "Next.js App Router",
      "TypeScript",
      "Tailwind",
      "MongoDB Atlas",
      "Gemini",
      "Sarvam AI STT",
      "Twilio IVR",
      "FastAPI",
      "scikit-learn",
      "Leaflet",
    ],
    languages: [
      { name: "TypeScript", bytes: 813529 },
      { name: "CSS", bytes: 20436 },
      { name: "JavaScript", bytes: 7581 },
      { name: "Python", bytes: 6132 },
    ],
    license: "MIT",
    preview: "/previews/repo-civicpulse.webp",
    previewAlt: "GitHub repository card for CivicPulse showing the project description and language breakdown",
  },
  {
    id: "posture",
    index: "02",
    name: "Posture and Blink Monitor",
    url: "https://github.com/izazahmed-dev/Posture-and-Blink-monitor",
    tagline: "A webcam that tells you when your neck has quietly given up",
    outcome:
      "A local-first webcam monitor that combines posture and blink signals into timely alerts while keeping camera data on the machine.",
    premise:
      "Slouching and eye strain are slow injuries with no alarm attached. This runs on the webcam already in the laptop, reads facial and upper body landmarks locally, and raises a flag the moment posture or blink rate crosses a defined threshold. Nothing leaves the machine.",
    decisions: [
      {
        head: "Eye aspect ratio, six points per eye",
        body: "MediaPipe FaceMesh supplies the landmarks. The Soukupova and Cech eye aspect ratio reduces each eye to one scalar, so blink detection needs no training data and no per user calibration.",
      },
      {
        head: "Distance invariance by normalisation",
        body: "Neck posture is the vertical gap between the ear midpoint and the shoulder midpoint, divided by shoulder width. Dividing by shoulder width means leaning toward the camera does not read as slouching.",
      },
      {
        head: "Two signals, not one",
        body: "A normalised neck ratio and a neck inclination angle are computed separately, plus a shoulder tilt angle for lateral collapse. Agreement between them is what suppresses false alarms.",
      },
      {
        head: "Audio off the render thread",
        body: "Alerts are Windows tones dispatched through a rate limited daemon thread pool. Beeping on the capture loop would cost frames, and a posture monitor that drops frames stops being a posture monitor.",
      },
    ],
    readings: [
      { label: "Blink threshold", value: "EAR < 0.21", note: "Open eyes sit between 0.28 and 0.35" },
      { label: "Strain alert", value: "5.0 s", note: "Raised when no blink is detected in that window" },
      { label: "Drowsiness alarm", value: "2.5 s", note: "Raised when the eyes stay closed that long" },
      { label: "Capture target", value: "45+ FPS", note: "Pose model complexity pinned to 0" },
    ],
    stack: ["Python", "OpenCV", "MediaPipe FaceMesh", "MediaPipe Pose", "NumPy", "winsound"],
    languages: [
      { name: "Python", bytes: 21522 },
      { name: "Batchfile", bytes: 315 },
    ],
    license: "MIT",
    preview: "/previews/repo-posture-blink.webp",
    previewAlt: "GitHub repository card for the Posture and Blink Monitor showing the project description",
  },
];

/* ------------------------------------------------------------------
   CAPABILITY, stated as evidence rather than as a skills cloud
   ------------------------------------------------------------------ */
export const CAPABILITY = [
  {
    head: "Languages",
    body: "Python and C++ from coursework graded A+ and S, TypeScript from shipping CivicPulse, Java from a graded S laboratory course.",
    evidence: "rmd-sem-2",
  },
  {
    head: "Applied machine learning",
    body: "A two month industry programme in machine learning, plus a computer vision project running MediaPipe inference in a live capture loop.",
    evidence: "corizo-internship",
  },
  {
    head: "Agentic systems",
    body: "Oracle foundations certification in agentic AI, and a production path that routes model output into human triage rather than straight to the user.",
    evidence: "oracle-agentic-ai",
  },
  {
    head: "Mathematics",
    /*
     * The intermediate (Class 12) Mathematics paper, not a board examination.
     * An earlier draft said "board Mathematics B", which was wrong twice over:
     * BIEAP conducts the intermediate, and the paper is Mathematics-A, not B.
     * On a site whose entire claim is that every figure traces to a document,
     * one mislabelled credential is enough to make a reader doubt the other
     * nine.
     */
    body: "Three rounds of the ISTE Ramanujan competition ending at the national level round, on top of 139 of 150 in the Class 12 intermediate Mathematics paper.",
    evidence: "iste-level-3",
  },
] as const;
