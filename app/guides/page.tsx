import { templateHref } from "../../lib/routes";
import { Header, Footer } from "../../components/shell";
import { Icon } from "../../components/icon";
const guides = [
  {
    id: "resume",
    number: "01",
    title: "Write a resume that is easy to read",
    intro:
      "Give a reviewer a clear picture of your relevant experience. Prioritise evidence over decorative language.",
    tips: [
      "Tailor your headline and summary to the role. Use a few specific sentences about the experience and strengths you bring.",
      "List recent experience first. Include the role, organisation, dates, and the work you actually did.",
      "Start a bullet with an action, explain what you worked on, and give a result when you can verify it. Do not invent percentages or numbers.",
      "Use ordinary headings such as Experience, Education, and Skills. Keep essential information in the document body.",
      "Follow the requested file format. After exporting, check that PDF text can be selected and copied in the correct order.",
    ],
    example:
      "Instead of “Responsible for customers”, try “Helped customers compare products, answered questions, and kept daily sales records.” Add a number only if you can support it.",
    source: "Harvard Mignone Center for Career Success",
    url: "https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/",
    template: "essential",
  },
  {
    id: "europe",
    number: "02",
    title: "Prepare a CV for a European application",
    intro:
      "Read the vacancy carefully. The employer’s instructions matter more than a regional label on a template.",
    tips: [
      "Show relevant qualifications and experience in a clear, consistent structure. State the full names of institutions and qualifications.",
      "Describe language ability honestly. Use a recognised scale only when you understand its levels; distinguish self-assessment from a certified test.",
      "Adapt the CV for each role and explain qualifications that may be unfamiliar to the reviewer.",
      "If Europass is explicitly required, create the document with the official Europass service. VitaPath’s European template is an independent design.",
      "Include personal details only when they are relevant or specifically requested. Avoid passport numbers, bank details, and unrelated sensitive information.",
    ],
    example:
      "A useful language entry: “English — B2, self-assessed.” Do not present a self-assessment as an IELTS, TOEFL, or other test result.",
    source: "Official Europass CV guidance",
    url: "https://europass.europa.eu/en/create-europass-cv",
    template: "europe",
  },
  {
    id: "gulf",
    number: "03",
    title: "Build a focused Gulf / GCC CV",
    intro:
      "Use the Gulf template to organise your application. Requirements vary between countries, industries, and employers.",
    tips: [
      "Lead with the role you are targeting and the experience that is directly relevant to it.",
      "Make current contact details, location, skills, and relevant certifications easy to find.",
      "State language ability and practical skills accurately. Add licence details only when relevant to the job.",
      "If an employer asks about availability, relocation, or work authorisation, give a truthful, concise response. Never imply a visa or permission you do not hold.",
      "Check the employer’s own instructions for length, photos, and required details. The VitaPath template does not require a photograph or nationality.",
    ],
    example:
      "Optional additional information: “Available to relocate; start date to be agreed.” Adapt this to your actual circumstances.",
    source: "General resume principles — Harvard Mignone Center",
    url: "https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/",
    template: "gulf",
  },
  {
    id: "scholarship",
    number: "04",
    title: "Show your potential in a scholarship CV",
    intro:
      "Make your education, contribution, and development visible. The specific scholarship call sets the requirements.",
    tips: [
      "Start with education when it is your strongest evidence. Include the correct qualification, institution, dates, and verified results.",
      "Add projects, research, leadership, volunteering, and achievements that relate to the selection criteria.",
      "Explain what you personally contributed to a team activity. Distinguish completed courses from courses in progress.",
      "List awards with their awarding organisation and date. Do not describe a participation certificate as a competitive award.",
      "Read the current call for page limits, document language, required forms, and referee instructions.",
    ],
    example:
      "“Community education volunteer — Organised weekly reading practice and helped students prepare for school assessments.” Use dates and outcomes you can verify.",
    source: "DAAD application information",
    url: "https://www.daad.de/en/studying-in-germany/scholarships/important-information-for-scholarship-applicants/",
    template: "scholar",
  },
  {
    id: "letters",
    number: "05",
    title: "Write a purposeful application letter",
    intro:
      "A letter should make a connection between your background and this particular opportunity.",
    tips: [
      "Open with the role or programme you are applying for and a specific reason it interests you.",
      "Develop one or two relevant examples. Explain your actions and what you learned instead of repeating the whole CV.",
      "For a motivation letter, connect your preparation, programme choice, and realistic future plans.",
      "For a personal statement, follow the exact prompt and word limit. Keep your voice and avoid generic claims.",
      "Close professionally and check the recipient, organisation name, dates, spelling, and any required declaration about assistance.",
    ],
    example:
      "A useful structure: purpose → evidence → fit → next step. The editor’s word count helps you work toward the limit in the application instructions.",
    source: "DAAD motivation letter guidance",
    url: "https://www2.daad.de/medien/deutschland/stipendien/formulare/advice-for-motivation-letter.pdf",
    template: "motivation",
  },
  {
    id: "recommendation",
    number: "06",
    title: "Prepare a recommendation draft responsibly",
    intro:
      "A recommendation represents the recommender’s assessment. A draft is only a starting point for their review.",
    tips: [
      "Ask whether the recommender is comfortable writing the letter and whether the programme accepts applicant-prepared drafts.",
      "Share the opportunity, deadline, submission instructions, and a short list of verified work you did with them.",
      "Suggest factual examples they can assess from first-hand experience. Leave their judgement to them.",
      "Do not invent endorsements, signatures, letterhead, or an institutional email address.",
      "Have the recommender verify and approve the final text, then follow the programme’s required submission process. VitaPath marks this document as a draft.",
    ],
    example:
      "A useful evidence note: “During the project we worked on together, I prepared the research summary and presented the findings.” The recommender decides how to evaluate that contribution.",
    source: "DAAD scholarship applicant information",
    url: "https://www.daad.de/en/studying-in-germany/scholarships/important-information-for-scholarship-applicants/",
    template: "recommendation",
  },
];
export default function Guides() {
  return (
    <>
      <Header />
      <main id="main" className="container guides-page">
        <div className="page-heading">
          <span className="eyebrow">THE WRITING ROOM</span>
          <h1>
            A little guidance.
            <br />
            <em>A clearer story.</em>
          </h1>
          <p>
            Practical prompts to help you turn real experience into a thoughtful
            application.
          </p>
        </div>
        <div className="guides-layout">
          <nav className="guide-nav" aria-label="Guide topics">
            {guides.map((g) => (
              <a href={`#${g.id}`} key={g.id}>
                <span>{g.number}</span>
                {g.title}
              </a>
            ))}
            <div className="info-box">
              <Icon name="book" />
              <p>
                These are general writing suggestions. Always follow the current
                employer or programme instructions.
              </p>
            </div>
          </nav>
          <div>
            {guides.map((g) => (
              <article className="guide-article" id={g.id} key={g.id}>
                <span className="eyebrow">GUIDE {g.number}</span>
                <h2>{g.title}</h2>
                <p className="guide-lead">{g.intro}</p>
                <ol>
                  {g.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ol>
                <div className="writing-example">
                  <b>PUT IT INTO PRACTICE</b>
                  <p>{g.example}</p>
                </div>
                <div className="guide-bottom">
                  <a
                    href={templateHref(g.template)}
                    className="text-link"
                  >
                    Start with this template <Icon name="arrow" size={17} />
                  </a>
                  <a href={g.url} target="_blank" rel="noopener noreferrer">
                    Further reading: {g.source} ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
