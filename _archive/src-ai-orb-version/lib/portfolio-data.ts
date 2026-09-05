export interface MarkItem {
  subject: string;
  max: number;
  secured: number;
  percentage?: number;
  grade?: string;
  detail?: string;
}

export interface AcademicRecord {
  id: string;
  level: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  score: string;
  scoreLabel: string;
  gradeBadge: string;
  regNumber: string;
  status: string;
  highlights: string[];
  subjects: MarkItem[];
  verificationRef: string;
  certificateIssuer: string;
}

export interface CertificationRecord {
  id: string;
  title: string;
  issuer: string;
  date: string;
  validity: string;
  verificationId: string;
  badge: string;
  skills: string[];
  description: string;
}

export const PORTFOLIO_DATA = {
  profile: {
    name: "PEDDAPALEM IZAZ AHMED",
    displayName: "Izaz Ahmed",
    tagline: "Engineering Autonomous Agentic AI Systems & Neural Architectures",
    role: "AI/ML Engineer & Systems Architect",
    registerNumber: "111525203076",
    department: "Artificial Intelligence & Machine Learning",
    batch: "Class of 2029 (2025–2029)",
    tenure: "2025 — 2029",
    academicStatus: "ACTIVE UNDERGRADUATE // BATCH 2025–2029",
    availability: "UNDERGRADUATE (2025–2029) • OPEN FOR ML INTERNSHIPS",
    horizon: "PIPELINE HORIZON: 2029 // OPEN TO APPLIED RESEARCH",
    institution: "R.M.D. Engineering College",
    affiliation: "Anna University Affiliated",
    location: "Tirupati // Chennai, India",
    email: "25al076@rmd.ac.in",
    phone: "+91 9985656586",
    statusBeacon: "SYSTEM ONLINE // CLASS OF 2029",
    careerObjective:
      "Undergraduate AI engineer targeting high-throughput autonomous agent networks, deep learning pipelines, and forward-deployed AI systems.",
  },

  metrics: {
    totalFrames: 239,
    academicBenchmark: "Top 1% Percentile",
    arrears: "0 Arrears (Clean Record)",
    tenthScore: "95.83%",
    interScore: "94.00%",
    btechCgpa: "9.375",
    graduationYear: "2029",
  },

  nodes: [
    {
      id: "node-01",
      number: "01",
      codeName: "CORE_SYSTEMS",
      title: "Languages & Tools",
      category: "Foundation & Systems",
      badge: "High Performance",
      description:
        "Engineered foundational expertise in systems programming, data structures, and algorithmic optimization across modern runtimes.",
      technologies: ["Python", "C++", "Java", "VS Code", "TypeScript", "Linux/Git"],
      metrics: [
        { label: "Core Langs", value: "3 Primary" },
        { label: "Runtime", value: "Native & JVM" },
        { label: "Algorithmic Base", value: "Optimized" },
      ],
      color: "from-blue-500/20 via-cyan-500/10 to-transparent",
      accent: "#38BDF8",
    },
    {
      id: "node-02",
      number: "02",
      codeName: "AGENTIC_ARCH",
      title: "Oracle Certified Agentic AI",
      category: "Specialization",
      badge: "Oracle Certified",
      description:
        "Oracle Certified Foundations Associate in Agentic AI (Cert: 103498358AAI26OFA, July 2026). Specializing in multi-agent orchestration, tool routing, memory hierarchies, and autonomous agent workflows.",
      technologies: [
        "Oracle Agentic AI",
        "Autonomous Swarms",
        "RAG Pipelines",
        "Prompt Routing",
        "Deterministic Workflows",
        "Vector Databases",
      ],
      metrics: [
        { label: "Certificate ID", value: "103498358AAI26OFA" },
        { label: "Domain", value: "Agentic Workflows" },
        { label: "Validity", value: "2026 — 2028" },
      ],
      color: "from-emerald-500/20 via-teal-500/10 to-transparent",
      accent: "#10B981",
    },
    {
      id: "node-03",
      number: "03",
      codeName: "INDUSTRY_MATH",
      title: "Industry ML & National Math Honors",
      category: "Experience & Honors",
      badge: "ISTE National Finalist",
      description:
        "Machine Learning Intern @ Corizo Edu Tech & National Level Finalist in ISTE Srinivasa Ramanujan Mathematical Competitions 2025–26 (Level 3 National Level).",
      technologies: [
        "Corizo Edu Tech",
        "ISTE National Level",
        "Applied Mathematics",
        "Supervised Learning",
        "Pipeline Automation",
      ],
      metrics: [
        { label: "Role", value: "ML Intern" },
        { label: "Honors", value: "ISTE Ramanujan L3" },
        { label: "Batch", value: "Class of 2029" },
      ],
      color: "from-indigo-500/20 via-purple-500/10 to-transparent",
      accent: "#818CF8",
    },
  ],

  academics: [
    {
      id: "academic-btech",
      level: "B.Tech AI & Machine Learning • 2025–2029 [In Progress]",
      degree: "B.Tech in Artificial Intelligence & Machine Learning",
      institution: "R.M.D. Engineering College (Anna University Affiliated)",
      location: "Chennai / Kavaraipettai, Tamil Nadu",
      period: "2025 — 2029",
      score: "9.375",
      scoreLabel: "CGPA (Current) • Zero Arrears",
      gradeBadge: "Active Full-Time • Zero Arrears",
      regNumber: "Reg No: 111525203076",
      status: "ACTIVE UNDERGRADUATE",
      verificationRef: "ANNA-UNIV-RMD-AIML-2029",
      certificateIssuer: "Anna University / R.M.D. Engineering College",
      highlights: [
        "Graduation Horizon: Class of 2029",
        "100% First-Attempt Clearance (Zero Arrears Standing)",
        "Specializing in Agentic AI Architectures & Neural Systems",
        "ISTE Srinivasa Ramanujan National Math Competition (Level 3)",
      ],
      subjects: [
        { subject: "Data Structures & Algorithms", max: 100, secured: 88, grade: "A" },
        { subject: "Object-Oriented Programming (C++/Java)", max: 100, secured: 85, grade: "A" },
        { subject: "Mathematics for Machine Learning", max: 100, secured: 84, grade: "A" },
        { subject: "Database Management & Systems", max: 100, secured: 82, grade: "A" },
        { subject: "Discrete Mathematics & Linear Algebra", max: 100, secured: 80, grade: "A" },
        { subject: "Python Programming for Data Science", max: 100, secured: 90, grade: "A+" },
      ],
    },
    {
      id: "academic-12th",
      level: "Higher Secondary (12th MPC)",
      degree: "Intermediate Pass Certificate (MPC)",
      institution: "Raju Junior College",
      location: "170 Air Bypass Road, Tirupati",
      period: "2024 — 2025",
      score: "94.00%",
      scoreLabel: "940 / 1000 Marks",
      gradeBadge: "A Grade • 100% Practicals",
      regNumber: "Reg No: 2519230494",
      status: "VERIFIED RECORD",
      verificationRef: "BIEAP-Y285672",
      certificateIssuer: "Board of Intermediate Education, Andhra Pradesh",
      highlights: [
        "Mathematics (Paper A & B): 288 / 300 (96%)",
        "100% Score in Physics & Chemistry Practicals (60/60)",
        "Sanskrit: 188 / 200 (94%)",
        "English: 180 / 200 (90%)",
      ],
      subjects: [
        { subject: "Mathematics - B (Yr 1 & 2)", max: 150, secured: 149, percentage: 99.3, detail: "75/75 + 74/75" },
        { subject: "Sanskrit (Yr 1 & 2)", max: 200, secured: 188, percentage: 94.0, detail: "97/100 + 91/100" },
        { subject: "English (Yr 1 & 2)", max: 200, secured: 180, percentage: 90.0, detail: "90/100 + 90/100" },
        { subject: "Mathematics - A (Yr 1 & 2)", max: 150, secured: 139, percentage: 92.7, detail: "71/75 + 68/75" },
        { subject: "Physics Theory & Practicals", max: 150, secured: 144, percentage: 96.0, detail: "58 + 56 + 30/30" },
        { subject: "Chemistry Theory & Practicals", max: 150, secured: 140, percentage: 93.3, detail: "54 + 56 + 30/30" },
      ],
    },
    {
      id: "academic-10th",
      level: "Secondary School (10th SSC)",
      degree: "Secondary School Certificate",
      institution: "Sri Venkateshwara Children's High School",
      location: "Bhavani Nagar, Tirupati",
      period: "2022 — 2023",
      score: "95.83%",
      scoreLabel: "575 / 600 Marks",
      gradeBadge: "First Division with Distinction",
      regNumber: "Roll No: 2319127769",
      status: "VERIFIED RECORD",
      verificationRef: "BSEAP-WW-315890",
      certificateIssuer: "Board of Secondary Education, Andhra Pradesh",
      highlights: [
        "Mathematics: 98 / 100",
        "General Science: 99 / 100",
        "First Language (Telugu/Sanskrit): 99 / 100",
        "Social Studies: 96 / 100",
      ],
      subjects: [
        { subject: "Telugu / Sanskrit", max: 100, secured: 99, percentage: 99 },
        { subject: "General Science", max: 100, secured: 99, percentage: 99 },
        { subject: "Mathematics", max: 100, secured: 98, percentage: 98 },
        { subject: "Social Studies", max: 100, secured: 96, percentage: 96 },
        { subject: "Hindi", max: 100, secured: 95, percentage: 95 },
        { subject: "English", max: 100, secured: 88, percentage: 88 },
      ],
    },
  ] as AcademicRecord[],

  certifications: [
    {
      id: "cert-oracle",
      title: "Oracle Certified Foundations Associate: Agentic AI",
      issuer: "Oracle Corporation",
      date: "July 30, 2026",
      validity: "Valid until July 30, 2028",
      verificationId: "103498358AAI26OFA",
      badge: "Oracle Certified",
      skills: ["Agentic AI", "Autonomous Swarms", "LLM Workflows", "Vector Databases", "Prompt Engineering"],
      description: "Official eCertificate recognized by Oracle Corporation and signed by Gary N Miller (Customer Success Officer, EVP CSS).",
    },
    {
      id: "cert-iste-ramanujan",
      title: "National Level Srinivasa Ramanujan Mathematical Competitions 2025–26",
      issuer: "Indian Society for Technical Education (ISTE) Tamilnadu Section",
      date: "February 21–22, 2026",
      validity: "National Level Achievement",
      verificationId: "ISTE-TNS-SRMC-2026",
      badge: "National Finalist (Level 3)",
      skills: ["Advanced Engineering Mathematics", "Analytical Reasoning", "Algorithms", "Calculus & Linear Algebra"],
      description: "Level 3 National Level competition for engineering college students across India.",
    },
    {
      id: "cert-corizo",
      title: "Machine Learning Internship Credential",
      issuer: "Corizo Edu Tech",
      date: "2024",
      validity: "Industry Verified",
      verificationId: "CORIZO-ML-2024",
      badge: "ML Intern",
      skills: ["Model Deployment", "Data Pipelines", "Scikit-Learn", "Feature Engineering"],
      description: "Production exploratory data analysis and predictive model pipelines.",
    },
  ] as CertificationRecord[],
};
