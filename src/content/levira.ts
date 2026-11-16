export const site = {
  brand: "LEVIRA",
  tagline: "Research & Consultancy",
  pillars: ["Public Health", "WASH", "Research & MEL", "Policy"] as const,
  headline: "Healthier systems start with water.",
  description:
    "We help governments, donors, and implementers strengthen public health, WASH, research, and policy across Africa.",
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Expertise", href: "/expertise" },
  { label: "Partners", href: "/partners" },
  { label: "Contact", href: "/contact" },
] as const;

export type AboutArcStage = {
  id: "field" | "evidence" | "policy";
  label: string;
  headline: string;
  body: string;
};

export type AboutPillar = {
  id: string;
  label: string;
  blurb: string;
};

export const about = {
  eyebrow: "About",
  title: "Field depth. Policy clarity.",
  years: 15,
  yearsLabel: "years across public health & WASH programmes",
  lead: "We are a Nairobi-based research and consultancy practice. We help governments, donors, and implementers strengthen WASH and public health systems with evidence they can act on.",
  locationLine: "Practice based in Nairobi · Assignments across Africa",
  arc: [
    {
      id: "field",
      label: "Field",
      headline: "From the facility floor.",
      body: "We start where the work is real: facility surveys, county sanitation plans, outbreak response. We lead from field evaluation through program design so the evidence is grounded before it reaches a slide deck.",
    },
    {
      id: "policy",
      label: "Policy",
      headline: "Into something ministries can use.",
      body: "We help clients land that same arc as national guidelines, procurement-ready design, and systems partners can actually run.",
    },
    {
      id: "evidence",
      label: "Evidence",
      headline: "MEL that stays honest.",
      body: "We build monitoring, evaluation, and learning frameworks that keep portfolios clear about what works: technically sound in African contexts, clear enough for day-to-day delivery teams.",
    },
  ] as const satisfies readonly AboutArcStage[],
  pillars: [
    {
      id: "public-health",
      label: "Public Health",
      blurb: "We support IPC, cholera response, and health systems work that holds up under real facility pressure.",
    },
    {
      id: "wash",
      label: "WASH",
      blurb: "We design WASH in facilities and schools, CWIS, CLTS, and humanitarian sanitation for African contexts.",
    },
    {
      id: "mel",
      label: "Research & MEL",
      blurb: "We build theory of change, field assessments, and learning agendas that keep portfolios honest.",
    },
    {
      id: "policy",
      label: "Policy",
      blurb: "We develop guidelines and advisory that ministries and partners can act on.",
    },
  ] as const satisfies readonly AboutPillar[],
};

export type ExpertiseCategory = {
  id: string;
  title: string;
  /** One-line outcome for the open accordion panel. */
  summary: string;
  items: string[];
};

export const expertiseIntro = {
  eyebrow: "Areas of expertise",
  title: "Technical depth across the WASH and public health value chain",
  note: "Six domains. One practice: from facility floors to national guidelines.",
  cta: "Start a conversation",
};

export const expertise: ExpertiseCategory[] = [
  {
    id: "wash",
    title: "WASH Programming",
    summary:
      "We design and deliver sanitation and hygiene programmes that hold up in facilities, counties, and humanitarian settings.",
    items: [
      "WASH in health care facilities and in schools",
      "County-Wide Inclusive Sanitation (CWIS)",
      "Community-Led Total Sanitation (CLTS) and market-based sanitation",
      "WASH in humanitarian settings; container-based sanitation",
      "WASH program management",
      "Infection Prevention and Control (IPC)",
      "Monitoring, Evaluation & Learning (MEL)",
    ],
  },
  {
    id: "public-health",
    title: "Public Health",
    summary:
      "We strengthen infection prevention, outbreak response, and health-system routines that keep people safer day to day.",
    items: [
      "Infection Prevention and Control (IPC)",
      "Cholera outbreak response",
      "Environmental cleaning and disinfection",
      "Hand hygiene compliance",
      "Health systems strengthening",
      "Decentralized chlorine and alcohol-based hand rub (ABHR) production",
    ],
  },
  {
    id: "cross-cutting",
    title: "Cross-Cutting",
    summary:
      "We embed equity, behaviour change, and inclusion so programmes reach the people most often left out.",
    items: [
      "Gender Equity and Social Inclusion (GESI)",
      "Social and Behavior Change Communication (SBCC)",
      "Menstrual hygiene management",
      "Public health policy and health systems strengthening",
    ],
  },
  {
    id: "research",
    title: "Research and M&E",
    summary:
      "We build evidence that decision-makers can trust, from survey design through impact evaluation.",
    items: [
      "Research design, data collection and analysis",
      "Monitoring and evaluation; survey and evaluation design",
      "Qualitative and quantitative research",
      "Impact evaluation and randomized controlled trials",
      "Survey coordination",
    ],
  },
  {
    id: "policy",
    title: "Policy and Coordination",
    summary:
      "We turn field evidence into guidelines, advocacy, and sector coordination that governments can run with.",
    items: [
      "National WASH policy and guideline development",
      "Public health policy advocacy",
      "Government and partner collaboration",
      "Sector coordination",
      "Technical working group leadership",
    ],
  },
  {
    id: "leadership",
    title: "Leadership",
    summary:
      "We grow teams and programmes through mentorship, facilitation, and budget discipline that keeps delivery honest.",
    items: [
      "Capacity building and mentorship",
      "Training and workshop facilitation",
      "Team management",
      "Program and budget management",
    ],
  },
];

export const thematicNote = {
  title: "Leave No-One Behind Thematic Group",
  detail: "Led by the Rural Water Supply Network (RWSN)",
};

export type Partner = {
  name: string;
  /** One or more paragraphs of partner narrative. */
  description: string[];
};

export type PartnerGroup = {
  id: string;
  label: string;
  partners: Partner[];
};

export const partnersIntro = {
  eyebrow: "Who we work with",
  title: "Clients and partners",
  blurb: "We work with governments, donors, private sector, and institutions.",
};

export const partnerGroups: PartnerGroup[] = [
  {
    id: "governments",
    label: "Governments",
    partners: [
      {
        name: "MOH",
        description: [
          "We help the Ministry of Health strengthen WASH in health care facilities, infection prevention and control, and program design that links national policy to facility-level practice. For example: baseline and endline assessments, protocol development, and coaching for county and facility teams responsible for safer water, sanitation, and hygiene services.",
          "We also support evidence synthesis for decision-makers, alignment of WASH indicators with health-sector reporting, and practical roadmaps that turn national standards into day-to-day routines in clinics and hospitals across diverse Kenyan contexts.",
        ],
      },
      {
        name: "MOWSI",
        description: [
          "We partner with the Ministry of Water, Sanitation and Irrigation on county-wide inclusive sanitation, rural water supply, and monitoring frameworks that leave no one behind. For example: technical advisory on CWIS approaches, service-level monitoring, and coordination between national policy and county implementation plans.",
          "We combine field diagnostics, stakeholder facilitation, and written products that ministries can use for budgeting, partner alignment, and progress tracking against national WASH and SDG commitments.",
        ],
      },
      {
        name: "Counties",
        description: [
          "We help counties strengthen WASH delivery, local MEL systems, and practical rollout of national standards in communities, schools, and health facilities. For example: co-designing interventions, training implementing teams, and building simple tools counties can sustain after external support ends.",
          "We emphasize equity by reaching informal settlements, rural wards, and institutions that often fall outside flagship programs, while keeping reporting lean enough for local capacity and useful enough for county leadership.",
        ],
      },
    ],
  },
  {
    id: "donors",
    label: "Donors & multilaterals",
    partners: [
      {
        name: "CDC",
        description: [
          "We collaborate with CDC on evidence-led public health and WASH evaluations that inform outbreak preparedness, facility standards, and community-level interventions. For example: survey design, field coordination, and analysis that CDC and government counterparts can act on.",
          "We frame outputs for both technical and policy audiences: clear methods, defensible findings, and recommendations that connect WASH performance to infection risk, outbreak readiness, and safer care environments.",
        ],
      },
      {
        name: "USAID",
        description: [
          "We deliver program design, implementation support, and independent evaluation for USAID-funded WASH and public health investments across African contexts. For example: theory-of-change refinement, MEL frameworks, field assessments, and learning agendas that keep portfolios honest about what works.",
          "We ground our work in partner-government systems and local implementing capacity, so recommendations stay practical for mission staff, prime partners, and ministry counterparts who must carry results beyond a single award cycle.",
        ],
      },
      {
        name: "Sanitation and Hygiene Fund",
        description: [
          "We advise the Sanitation and Hygiene Fund on market-based sanitation, inclusive hygiene programming, and results frameworks that translate fund priorities into measurable field outcomes. For example: designing interventions that reach underserved households while remaining commercially and institutionally viable.",
          "We also support monitoring approaches, partner capacity strengthening, and synthesis products that help the Fund and country stakeholders compare models, track equity, and adapt investments as markets and regulations evolve.",
        ],
      },
      {
        name: "World Bank",
        description: [
          "We contribute technical advisory and evaluation expertise to World Bank backed WASH and health systems projects, from design through learning cycles. Our work sits where infrastructure, service delivery, and institutional reform meet: where technical standards meet political and fiscal realities.",
          "We produce diagnostic studies, mid-term and end-of-project learning, and concise briefs that task teams and client governments can use to course-correct, document results, and shape follow-on financing.",
        ],
      },
      {
        name: "The Global Fund to Fight AIDS, Tuberculosis and Malaria",
        description: [
          "We strengthen facility WASH and infection prevention components that underpin Global Fund disease programs and safer care environments. We focus on the WASH and IPC foundations that protect patients and health workers while disease-specific services are delivered.",
          "For example: facility assessments, improvement planning, and MEL that shows whether water, sanitation, hygiene, and waste-management upgrades are actually reducing risk in high-burden settings.",
        ],
      },
      {
        name: "EU",
        description: [
          "We support European Union financed WASH and public health initiatives with research, MEL, and policy-ready synthesis for decision-makers. For example: design-phase evidence reviews and independent evaluations that test whether investments delivered intended equity and systems outcomes.",
          "We structure reporting for EU accountability requirements while keeping it usable for African government counterparts who need clear findings, not only compliance paperwork.",
        ],
      },
      {
        name: "EC",
        description: [
          "We provide technical depth for European Commission programs on sanitation, hygiene, and health systems strengthening across partner countries. For example: advisory input on program logic, field verification, and learning that connects community and facility results to regional and national priorities.",
          "We focus on durable institutional uptake so EC-financed gains in WASH and public health persist through local systems, budgets, and professional practice after project close.",
        ],
      },
      {
        name: "DFID",
        description: [
          "We bring field evaluation and advisory experience to UK-supported WASH and public health portfolios, with a focus on equity and durable results. For example: design review, independent evaluation, and synthesis that helps portfolio managers see what is working for the poorest and hardest-to-reach.",
          "We keep recommendations grounded in operational reality: what county and facility teams can implement, what ministries can fund, and what implementing partners need to measure progress without drowning in indicators.",
        ],
      },
    ],
  },
  {
    id: "private",
    label: "Private sector",
    partners: [
      {
        name: "Lemak Hygiene Services",
        description: [
          "We partner with Lemak Hygiene Services on hygiene service delivery models that blend commercial viability with public health standards for institutions and communities. For example: service design, quality benchmarks, and practical ways to verify that contracted hygiene outcomes meet health expectations.",
          "We aim for sustainable delivery: models that clients will pay for, regulators will accept, and operators can scale, without sacrificing the infection-prevention and dignity outcomes that matter for users.",
        ],
      },
      {
        name: "Center for Policy and Health Metrics - Africa",
        description: [
          "We collaborate on metrics, policy analysis, and learning products that help African health systems measure what matters and act on the evidence. For example: indicator design, secondary analysis, and briefs that translate complex data into decisions for ministries and partners.",
          "We build products for African decision contexts: clear methods, honest uncertainty, and recommendations that respect fiscal and institutional constraints while pushing for stronger measurement of WASH and public health performance.",
        ],
      },
    ],
  },
  {
    id: "institutions",
    label: "Institutions",
    partners: [
      {
        name: "Njiru Level 4 Hospital",
        description: [
          "We help Njiru Level 4 Hospital strengthen facility-level WASH, IPC, and operational improvements so patients and staff benefit from safer water, sanitation, and hygiene services. For example: assessments of water supply, sanitation, hand hygiene, waste management, and cleaning systems against national and WHO-aligned standards.",
          "We follow through with actionable improvement plans, staff coaching, and simple monitoring so gains stick under real hospital workload, not only during a one-off assessment visit.",
        ],
      },
      {
        name: "Green Valley Academy",
        description: [
          "We help Green Valley Academy strengthen WASH in schools through practical assessments, intervention design, and monitoring that keep learners in healthier learning environments. For example: water access, sanitation for girls and boys, hygiene facilities, and routines that school leadership can maintain with limited budgets.",
          "We emphasize student dignity and attendance, especially for adolescent girls, and produce clear next steps for school boards, PTAs, and county education teams to fund and sustain improvements.",
        ],
      },
    ],
  },
];

export const contact = {
  eyebrow: "Contact",
  title: "Let's strengthen WASH and health systems together",
  blurb:
    "We take on program design, evaluations, research, policy support, training, and technical advisory assignments.",
  email: "hello@levira.consulting",
  phone: "0714848132",
  phoneHref: "tel:+254714848132",
  location: "Nairobi, Kenya",
  linkedin: "https://www.linkedin.com/in/levira",
  linkedinLabel: "linkedin.com/in/levira",
};
