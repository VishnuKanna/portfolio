export const profile = {
  name: 'Vishnu Kanna J.',
  short: 'VK',
  role: 'Senior Software Engineer',
  identity: 'Backend Engineering · Distributed Systems · Payments · Cloud · Event-Driven Architecture',
  current: 'Capco Technologies',
  location: 'Bengaluru · India',
};

export const contact = {
  linkedin: 'https://www.linkedin.com/in/vishnukannaj',
  github: 'https://github.com/VishnuKanna',
  email: 'mailto:vishnukannaj97@gmail.com',
  tel: '+91 00000 00000',
  displayEmail: 'vishnukannaj97@gmail.com',
};

export const nav = [
  { href: '#about', label: 'About' },
  { href: '#execution', label: 'Expertise' },
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
] as const;

export const hero = {
  eyebrow: 'Senior Software Engineer · Backend & Distributed Systems',
  status: 'Currently engineering at Capco',
  headline: ['Build systems', 'that scale.'],
  identities: [
    'Backend engineer.',
    'Distributed systems builder.',
    'Payments & platform engineer.',
  ],
  primaryCta: 'Explore my work',
  secondaryCta: "Let's connect",
} as const;

export const about = {
  kicker: '01 / About',
  headline: ['Engineering', 'beyond the', 'endpoint.'],
  paragraphs: [
    "I'm Vishnu Kanna J., a Senior Software Engineer focused on backend and distributed systems.",
    'I build services, APIs and event-driven platforms where reliability, scalability and observability matter.',
    'My experience spans financial services, payments, enterprise platforms and large-scale technology ecosystems.',
    "I've worked across environments connected to Visa, Goldman Sachs, Morgan Stanley, Flipkart and Cognizant.",
  ],
  metrics: [
    { value: 7, suffix: '+', label: 'Years engineering', meta: 'CONSISTENTLY SHIPPING' },
    { value: null, label: 'Java-first backend', meta: 'CORE STRENGTH' },
    { value: null, label: 'Distributed systems', meta: 'ARCHITECTURE' },
    { value: null, label: 'Payments & fintech', meta: 'DOMAIN' },
  ],
} as const;

export const marqueeTech = [
  'Java 17',
  'Spring Boot',
  'Spring Cloud',
  'Kafka',
  'IBM MQ',
  'Redis',
  'AWS',
  'Kubernetes',
  'Docker',
  'Oracle',
  'MySQL',
  'DB2',
  'Jenkins',
  'GitHub Actions',
  'Prometheus',
  'Grafana',
  'OAuth 2.0',
  'JWT',
  'OpenAPI',
] as const;

export type CorePillar = {
  index: string;
  title: string;
  blurb: string;
  tech: string[];
  flow: string[];
};

export const coreExecution: CorePillar[] = [
  {
    index: '01',
    title: 'Backend',
    blurb: 'Designing maintainable backend services and APIs for complex enterprise workflows.',
    tech: ['Java', 'Spring Boot', 'Spring Cloud', 'Microservices', 'REST APIs', 'OAuth 2.0', 'JWT', 'OpenAPI'],
    flow: ['CLIENT', 'API', 'SERVICE', 'DATABASE'],
  },
  {
    index: '02',
    title: 'Distributed Systems',
    blurb: 'Building reliable communication and processing across distributed services.',
    tech: ['Kafka', 'IBM MQ', 'Event-driven', 'Redis', 'Async processing', 'Caching', 'Scalability'],
    flow: ['SERVICE', 'KAFKA', 'CONSUMER', 'REDIS', 'DATABASE'],
  },
  {
    index: '03',
    title: 'Cloud / DevOps',
    blurb: "Taking services from source code to observable production infrastructure.",
    tech: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'CI/CD', 'Grafana', 'Prometheus', 'Splunk'],
    flow: ['CODE', 'CI/CD', 'CONTAINER', 'KUBERNETES', 'OBSERVABILITY'],
  },
  {
    index: '04',
    title: 'Data & Messaging',
    blurb: 'Designing reliable data flows across storage, messaging and distributed applications.',
    tech: ['Oracle', 'MySQL', 'IBM DB2', 'Kafka', 'IBM MQ', 'Redis'],
    flow: ['SOURCE', 'PUBLISH', 'STREAM', 'CACHE', 'STORE'],
  },
];

export type Project = {
  index: string;
  company: string;
  capability: string;
  title: string;
  copy: string;
  tech: string[];
  focus: string[];
  architecture: string[];
};

export const projects: Project[] = [
  {
    index: '01',
    company: 'Visa',
    capability: 'Platform APIs · event-driven onboarding flows',
    title: 'Enterprise Onboarding Platform',
    copy: 'Backend capabilities supporting enterprise onboarding workflows, APIs and platform services within Visa\u2019s technology ecosystem.',
    tech: ['Java', 'Spring Boot', 'Kafka', 'Redis', 'Oracle', 'AWS', 'Docker', 'Kubernetes'],
    focus: ['API design', 'Event-driven', 'Scalability', 'Reliability'],
    architecture: ['CLIENT', 'API', 'BACKEND SERVICE', 'KAFKA', 'DATA / CACHE'],
  },
  {
    index: '02',
    company: 'Goldman Sachs',
    capability: 'Production-grade Java services & integrations',
    title: 'Financial Services Backend',
    copy: 'Backend engineering within a financial-services environment, working across Java services, APIs, messaging, databases and enterprise infrastructure.',
    tech: ['Java', 'Spring Boot', 'REST', 'IBM MQ', 'Oracle', 'Microservices', 'CI/CD'],
    focus: ['Reliability', 'Integration', 'Production eng', 'Backend systems'],
    architecture: ['CLIENT', 'API GATEWAY', 'SERVICE', 'IBM MQ', 'ORACLE'],
  },
  {
    index: '03',
    company: 'Morgan Stanley',
    capability: 'Distributed services · engineering quality',
    title: 'Distributed Backend Systems',
    copy: 'Backend engineering within a large financial-services ecosystem, contributing to service development, integrations and production-ready engineering practices.',
    tech: ['Java', 'Spring', 'Microservices', 'REST APIs', 'Database systems', 'Testing', 'CI/CD'],
    focus: ['Microservices', 'Integration', 'APIs', 'Engineering quality'],
    architecture: ['REQUEST', 'SERVICE', 'TRANSFORM', 'VALIDATE', 'STORE'],
  },
  {
    index: '04',
    company: 'Flipkart',
    capability: 'Scale-out commerce backend patterns',
    title: 'High-Scale Commerce Systems',
    copy: 'Backend engineering within a large commerce technology ecosystem, working across Java services, APIs, databases and distributed application patterns.',
    tech: ['Java', 'Backend services', 'APIs', 'Databases', 'Distributed systems'],
    focus: ['Scale', 'Backend', 'Integration', 'Reliability'],
    architecture: ['TRAFFIC', 'INTAKE', 'SERVICE', 'EVENT BUS', 'STORE'],
  },
];

export const philosophy = [
  { line: 'I don\u2019t just', strong: 'write services.' },
  { line: 'I think about what happens', strong: 'after deployment.' },
];

export const philosophyQuestions = [
  'How does it behave under load?',
  'What happens when Kafka is unavailable?',
  'Where does the request fail?',
  'Can we observe it?',
  'Can we recover it?',
  'Can another engineer understand it six months later?',
];

export const loopLine = 'Build \u2192 Observe \u2192 Scale \u2192 Improve';

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  note: string;
  current?: boolean;
};

export const experience: ExperienceEntry[] = [
  {
    company: 'Capco Technologies',
    role: 'Senior Software Engineer',
    period: 'Current',
    note: 'Engineering within Capco\u2019s technology practice, building backend systems and platform capabilities at production grade.',
    current: true,
  },
  {
    company: 'NTT DATA',
    role: 'Software Engineering',
    period: '2024 \u2014 2025',
    note: 'Backend engineering across financial-services workloads, integrations and production-ready delivery.',
  },
  {
    company: 'Wissen Technology',
    role: 'Software Engineering',
    period: '2022 \u2014 2024',
    note: 'Deeper responsibility on distributed systems, messaging and reliability under scale.',
  },
  {
    company: 'Cognizant',
    role: 'Software Engineering',
    period: '2020 \u2014 2022',
    note: 'The foundation years \u2014 enterprise engineering, APIs and backend services.',
  },
];

export type PlaygroundNode = {
  id: string;
  label: string;
  sub: string;
  detail: string;
};

export const playground: PlaygroundNode[] = [
  { id: 'request', label: 'Request', sub: 'inbound', detail: 'A call entering the system. Authenticated, authorized, traced.' },
  { id: 'api', label: 'API', sub: 'REST', detail: 'REST / authentication — routes, contracts and security boundaries.' },
  { id: 'service', label: 'Service', sub: 'JVM', detail: 'Java / Spring Boot service logic — the workload that matters.' },
  { id: 'bus', label: 'Message bus', sub: 'stream', detail: 'Kafka / IBM MQ — decoupling producers from consumers.' },
  { id: 'consumer', label: 'Consumer', sub: 'worker', detail: 'Async workers applying side effects without blocking the caller.' },
  { id: 'cache', label: 'Cache', sub: 'hot path', detail: 'Redis — fast reads and state that lives close to the service.' },
  { id: 'database', label: 'Database', sub: 'source of truth', detail: 'Oracle / MySQL / DB2 — durable, consistent storage.' },
];

export const contactSection = {
  kicker: '05 / Contact',
  headline: ['Have a system', 'worth building?'],
  copy: "Let's talk about the architecture, the problem, or the next thing you're building.",
  endpoint: '/.netlify/functions/contact',
  button: {
    idle: 'Send payload',
    hover: 'Send payload',
    serializing: 'Serializing',
    transmitting: 'Transmitting',
    success: 'Payload accepted',
    error: 'Retry payload',
  },
};

export const footer = {
  note: 'Senior Software Engineer',
  columnLinks: [
    { href: contact.linkedin, label: 'LinkedIn' },
    { href: contact.github, label: 'GitHub' },
    { href: contact.email, label: 'Email' },
    { href: '#top', label: 'Portfolio' },
  ],
  tags: ['Backend', 'Distributed Systems', 'Cloud', 'Payments'],
  closing: 'Build something that lasts.',
};