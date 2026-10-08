export type DocumentKind =
  | "resume"
  | "scholarship_cv"
  | "cover_letter"
  | "motivation_letter"
  | "recommendation_letter"
  | "personal_statement";
export type Entry = {
  id: string;
  title: string;
  organization: string;
  location: string;
  dates: string;
  details: string;
};
export type Content = {
  template: string;
  accent: string;
  paper: "A4" | "Letter";
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  skills: string;
  languages: string;
  certifications: string;
  awards: string;
  publications: string;
  additional: string;
  experience: Entry[];
  education: Entry[];
  projects: Entry[];
  volunteering: Entry[];
  recipient: string;
  organization: string;
  subject: string;
  date: string;
  opening: string;
  body: string;
  closing: string;
};
export type VitaDocument = {
  id: string;
  title: string;
  document_type: DocumentKind;
  content: Content;
  updated_at: string;
  created_at: string;
  user_id?: string;
};
export type Template = {
  id: string;
  name: string;
  category: string;
  kind: DocumentKind;
  description: string;
  color: string;
  tag: string;
};
export const kindNames: Record<DocumentKind, string> = {
  resume: "Resume / CV",
  scholarship_cv: "Scholarship CV",
  cover_letter: "Cover letter",
  motivation_letter: "Motivation letter",
  recommendation_letter: "Recommendation draft",
  personal_statement: "Personal statement",
};
export const templates: Template[] = [
  {
    id: "essential",
    name: "The Essential",
    category: "Professional",
    kind: "resume",
    description: "A clear, single-column foundation for your next career move.",
    color: "#263c50",
    tag: "Simple & readable",
  },
  {
    id: "modern",
    name: "The Modern",
    category: "Professional",
    kind: "resume",
    description:
      "A confident heading, generous space, and a contemporary rhythm.",
    color: "#067c75",
    tag: "Modern resume",
  },
  {
    id: "executive",
    name: "The Executive",
    category: "Professional",
    kind: "resume",
    description:
      "Refined typography with room for leadership and measurable impact.",
    color: "#65543e",
    tag: "Experienced professionals",
  },
  {
    id: "europe",
    name: "The European",
    category: "Europe",
    kind: "resume",
    description:
      "A structured CV with languages, skills, and international experience.",
    color: "#2859a0",
    tag: "European applications",
  },
  {
    id: "gulf",
    name: "The Gulf",
    category: "Gulf / GCC",
    kind: "resume",
    description:
      "A focused layout for experience, certifications, and GCC applications.",
    color: "#246d64",
    tag: "Gulf / GCC CV",
  },
  {
    id: "scholar",
    name: "The Scholar",
    category: "Scholarship",
    kind: "scholarship_cv",
    description:
      "Put education, achievements, and community contribution first.",
    color: "#635295",
    tag: "Scholarship applications",
  },
  {
    id: "graduate",
    name: "The Graduate",
    category: "Students",
    kind: "resume",
    description:
      "Give projects, education, and transferable skills the space they deserve.",
    color: "#a15032",
    tag: "Students & first jobs",
  },
  {
    id: "academic",
    name: "The Academic",
    category: "Scholarship",
    kind: "scholarship_cv",
    description:
      "An understated academic CV with space for research and publications.",
    color: "#334b6a",
    tag: "Research & academia",
  },
  {
    id: "cover",
    name: "The Cover Letter",
    category: "Letters",
    kind: "cover_letter",
    description:
      "Connect your experience to the role with a focused professional letter.",
    color: "#067c75",
    tag: "Job applications",
  },
  {
    id: "motivation",
    name: "The Motivation Letter",
    category: "Letters",
    kind: "motivation_letter",
    description:
      "Explain your purpose, programme fit, and future contribution.",
    color: "#635295",
    tag: "Study applications",
  },
  {
    id: "recommendation",
    name: "The Recommendation",
    category: "Letters",
    kind: "recommendation_letter",
    description:
      "Organise a draft for your recommender to verify, edit, and approve.",
    color: "#65543e",
    tag: "For recommender review",
  },
  {
    id: "statement",
    name: "The Personal Statement",
    category: "Letters",
    kind: "personal_statement",
    description:
      "Build a considered narrative around your experiences and ambitions.",
    color: "#2859a0",
    tag: "Your story & purpose",
  },
];
export const isLetter = (kind: DocumentKind) =>
  !["resume", "scholarship_cv"].includes(kind);
export const findTemplate = (id: string) =>
  templates.find((t) => t.id === id) || templates[0];
export const blankContent = (template = "essential"): Content => ({
  template,
  accent: findTemplate(template).color,
  paper: "A4",
  name: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  skills: "",
  languages: "",
  certifications: "",
  awards: "",
  publications: "",
  additional: "",
  experience: [],
  education: [],
  projects: [],
  volunteering: [],
  recipient: "",
  organization: "",
  subject: "",
  date: "",
  opening: "",
  body: "",
  closing: "",
});
export function newDocument(template = "essential"): VitaDocument {
  const t = findTemplate(template);
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: `Untitled ${kindNames[t.kind].toLowerCase()}`,
    document_type: t.kind,
    content: blankContent(t.id),
    created_at: now,
    updated_at: now,
  };
}
export const newEntry = (): Entry => ({
  id: crypto.randomUUID(),
  title: "",
  organization: "",
  location: "",
  dates: "",
  details: "",
});
const str = (value: unknown, limit = 12000): string =>
  typeof value === "string" ? value.slice(0, limit) : "";
export function normalizeContent(value: unknown): Content {
  const raw =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const c = blankContent(str(raw.template));
  for (const key of Object.keys(c) as (keyof Content)[]) {
    if (["experience", "education", "projects", "volunteering"].includes(key))
      continue;
    if (typeof raw[key] === "string")
      (c as unknown as Record<string, unknown>)[key] = str(raw[key]);
  }
  c.template = findTemplate(c.template).id;
  c.accent = /^#[0-9a-f]{6}$/i.test(c.accent)
    ? c.accent
    : findTemplate(c.template).color;
  c.paper = raw.paper === "Letter" ? "Letter" : "A4";
  for (const key of [
    "experience",
    "education",
    "projects",
    "volunteering",
  ] as const) {
    c[key] = Array.isArray(raw[key])
      ? (raw[key] as unknown[])
          .slice(0, 30)
          .filter((v) => v && typeof v === "object")
          .map((v) => {
            const e = v as Record<string, unknown>;
            return {
              id: str(e.id, 100) || crypto.randomUUID(),
              title: str(e.title, 300),
              organization: str(e.organization, 300),
              location: str(e.location, 300),
              dates: str(e.dates, 100),
              details: str(e.details),
            };
          })
      : [];
  }
  return c;
}
export function parseDocument(raw: unknown): VitaDocument {
  if (!raw || typeof raw !== "object")
    throw new Error("This is not a VitaPath document.");
  const d = raw as Record<string, unknown>;
  if (
    typeof d.title !== "string" ||
    typeof d.document_type !== "string" ||
    !Object.hasOwn(kindNames, d.document_type) ||
    !d.content ||
    typeof d.content !== "object"
  )
    throw new Error("The document format is not supported.");
  const now = new Date().toISOString();
  return {
    id: str(d.id, 100),
    title: str(d.title, 160) || "Untitled document",
    document_type: d.document_type as DocumentKind,
    content: normalizeContent(d.content),
    created_at: str(d.created_at) || now,
    updated_at: str(d.updated_at) || now,
  };
}
const LOCAL_KEY = "vitapath.documents.v1";
export function localDocuments(): VitaDocument[] {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (!raw) return [];
  const values: unknown = JSON.parse(raw);
  if (!Array.isArray(values))
    throw new Error(
      "Your browser drafts could not be read. Export any open document before clearing storage.",
    );
  return values.map(parseDocument);
}
export function saveLocal(doc: VitaDocument) {
  const list = localDocuments();
  const index = list.findIndex((d) => d.id === doc.id);
  const clean = parseDocument(doc);
  if (index < 0) list.unshift(clean);
  else list[index] = clean;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
}
export function deleteLocal(id: string) {
  localStorage.setItem(
    LOCAL_KEY,
    JSON.stringify(localDocuments().filter((d) => d.id !== id)),
  );
}
export function migrateLegacyDraft() {
  const raw = localStorage.getItem("vitapath_resume");
  if (!raw || localStorage.getItem("vitapath.legacy.migrated")) return;
  const old = JSON.parse(raw);
  const doc = newDocument();
  doc.title = "Previous resume draft";
  for (const key of [
    "name",
    "email",
    "phone",
    "location",
    "summary",
    "skills",
  ] as const)
    doc.content[key] = str(old[key]);
  doc.content.headline = str(old.title);
  for (const key of ["education", "experience"] as const)
    if (str(old[key]))
      doc.content[key] = [{ ...newEntry(), details: str(old[key]) }];
  saveLocal(doc);
  localStorage.setItem("vitapath.legacy.migrated", "true");
}
export function downloadBackup(doc: VitaDocument) {
  const blob = new Blob(
    [
      JSON.stringify(
        { format: "vitapath", version: 1, document: parseDocument(doc) },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc.title.replace(/[^a-z0-9 _-]/gi, "").trim() || "VitaPath-document"}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function checks(doc: VitaDocument) {
  const c = doc.content;
  const list = [
    { label: "Add your name", done: !!c.name.trim() },
    {
      label: "Add a valid contact email",
      done: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim()),
    },
  ];
  if (isLetter(doc.document_type))
    return [
      ...list,
      { label: "Give your document a subject", done: !!c.subject.trim() },
      { label: "Write your main paragraphs", done: c.body.trim().length > 150 },
      ...(doc.document_type === "personal_statement"
        ? []
        : [{ label: "Add a closing", done: !!c.closing.trim() }]),
    ];
  return [
    ...list,
    { label: "Add a title or study focus", done: !!c.headline.trim() },
    { label: "Write a focused summary", done: c.summary.trim().length > 40 },
    {
      label: "Add education or experience",
      done: [...c.education, ...c.experience].some(
        (e) => e.title.trim() || e.details.trim(),
      ),
    },
    { label: "Include relevant skills", done: !!c.skills.trim() },
  ];
}
export function sampleContent(template = "essential"): Content {
  const sample: Content = {
    ...blankContent(template),
    name: "Alex Morgan",
    headline: "Project Coordinator",
    email: "alex@example.com",
    location: "City, Country",
    website: "portfolio.example.com",
    summary:
      "Organised project coordinator with experience supporting cross-functional teams. Brings clear communication, practical problem-solving, and a thoughtful approach to delivering work.",
    experience: [
      {
        id: "sample-exp",
        title: "Project Coordinator",
        organization: "Example Studio",
        location: "City",
        dates: "2023 – Present",
        details:
          "Coordinated weekly project updates across three teams.\nIntroduced a shared task tracker to improve visibility and follow-through.",
      },
    ],
    education: [
      {
        id: "sample-edu",
        title: "BSc in Business & Technology",
        organization: "Example University",
        location: "City",
        dates: "2019 – 2023",
        details: "Final project: digital tools for community organisations.",
      },
    ],
    projects: [
      {
        id: "sample-project",
        title: "Community Skills Workshop",
        organization: "Independent project",
        location: "",
        dates: "2024",
        details:
          "Helped organise practical digital skills sessions for local students.",
      },
    ],
    skills: "Project coordination, research, spreadsheets, communication",
    languages: "English · Fluent\nFrench · Intermediate",
    awards: "Student leadership recognition · 2023",
    subject: "Application for Project Coordinator",
    recipient: "Hiring team",
    organization: "Example Studio",
    opening: "Dear Hiring Team,",
    body: "I am applying for the Project Coordinator position. The opportunity to help a collaborative team deliver thoughtful, practical work aligns with the experience I have developed in project support.\n\nIn my current role, I coordinate updates across three teams and maintain a shared tracker for deadlines and responsibilities. This has taught me to communicate clearly, anticipate questions, and follow through on commitments.\n\nI would welcome the opportunity to discuss how my skills could support your team.",
    closing: "Kind regards,",
  };
  if (template === "motivation")
    return {
      ...sample,
      headline: "Graduate study applicant",
      subject: "Motivation for MSc in Technology and Society",
      recipient: "Admissions Committee",
      organization: "Example University",
      opening: "Dear Admissions Committee,",
      body: "My interest in technology grew through a university project exploring digital tools for community organisations. I now want to study how those tools can be designed around the people who use them.\n\nWhile coordinating a community skills workshop, I learned to translate technical instructions into practical steps. Listening to participants changed my assumptions about what makes a tool useful and accessible.\n\nI am interested in a programme that combines research methods with community-led design. I would connect these areas to my experience in project coordination and develop the skills to evaluate the impact of digital services.\n\nAfter graduation, I hope to contribute to accessible public-interest technology. I would bring careful organisation, curiosity, and experience working with people from different backgrounds to the programme.",
    };
  if (template === "recommendation")
    return {
      ...sample,
      name: "[Recommender name]",
      headline: "[Role and institution]",
      email: "recommender@example.com",
      website: "",
      subject: "Recommendation for [applicant name]",
      recipient: "Admissions Committee",
      organization: "[Institution / programme]",
      opening: "Dear Admissions Committee,",
      body: "I have known [applicant name] for [duration] as their [supervisor / lecturer / manager] at [institution]. My assessment is based on our work together in [specific context].\n\nDuring [project or course], I observed [specific action taken by the applicant]. This demonstrated [relevant quality], as shown by [an outcome the recommender can verify].\n\nA further example is [independently observed contribution]. In this situation, the applicant [describe their actions and what the recommender learned about their abilities].\n\n[The recommender should add their own considered recommendation, explain its relevance to the opportunity, and confirm all facts before approval.]",
      closing: "[Closing and signature to be completed by the recommender]",
    };
  if (template === "statement")
    return {
      ...sample,
      headline: "Technology and Society applicant",
      subject: "Personal statement",
      recipient: "",
      organization: "",
      opening: "",
      closing: "",
      body: "At a community workshop, I watched a participant hesitate before using a new digital form. The instructions seemed clear to me, but our conversation revealed assumptions I had overlooked. That experience shaped my interest in designing technology around people.\n\nMy degree in Business and Technology gave me a foundation for understanding how organisations adopt digital tools. For my final project, I explored tools used by community organisations and learned to turn broad questions into manageable research tasks.\n\nWorking as a project coordinator has strengthened my ability to listen, organise information, and follow through. Introducing a shared task tracker taught me that a tool becomes useful only when a team understands how it supports their work.\n\nI want to deepen my understanding of research and inclusive design, then apply those skills to public-interest services. I would bring practical experience, a willingness to examine my assumptions, and a clear commitment to learning from the people a service is meant to support.",
    };
  return sample;
}
