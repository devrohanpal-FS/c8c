export interface ServiceCapabilityItem {
  title: string;
  description: string;
  tags: string[];
}

export interface ServiceProcessStep {
  stepNumber: string;
  title: string;
  description: string;
  duration?: string;
}

export interface ServiceRelatedWork {
  title: string;
  slug: string;
  client: string;
  category: string;
  image: string;
  videoUrl?: string;
}

export interface ServiceDetailData {
  id: string;
  slug: string;
  title: string;
  titleSerifPart?: string;
  subtitle: string;
  categoryNumber: string;
  tagline: string;
  overview: string;
  fullOverviewParagraphs: string[];
  heroVideo: string;
  heroImage: string;
  capabilities: ServiceCapabilityItem[];
  processSteps: ServiceProcessStep[];
  relatedWorks: ServiceRelatedWork[];
  deliverables: string[];
  quote: {
    text: string;
    author: string;
    role: string;
    company: string;
  };
  nextService: {
    slug: string;
    title: string;
    number: string;
    image: string;
  };
}

export const serviceDetailsMap: Record<string, ServiceDetailData> = {
  // 01. WEB DEVELOPMENT
  'web-development': {
    id: 'tech-01',
    slug: 'web-development',
    title: 'Web Development',
    titleSerifPart: 'Engineering',
    subtitle: 'WEBSITES • WEB APPS • SAAS • E-COMMERCE',
    categoryNumber: '01',
    tagline: 'Websites that load before you can blink, rank on page 1, and make your competitors look amateur.',
    overview: 'Most websites are bloated digital brochures that look pretty and convert nothing. We build high-performance Next.js web applications that merge ruthless aesthetic craft with sub-second page loads, conversion-obsessed UX, and zero technical debt.',
    fullOverviewParagraphs: [
      'Let’s be honest: in today’s attention economy, your visitors have zero patience for sluggish loading screens or janky layouts. If your site takes more than two seconds to render, you’re throwing marketing dollars out the window.',
      'We build custom digital flagships powered by Next.js 14/15, Tailwind CSS, TypeScript, and modern headless CMS backends. Every line of code is written by hand to ensure 60fps micro-interactions, flawless accessibility, and rock-solid SEO architecture.',
      'Whether it’s an interactive 3D WebGL product showcase, a headless e-commerce store with instant checkout, or a high-traffic SaaS portal, we engineer web experiences that command respect and drive revenue.'
    ],
    heroVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    heroImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Custom Next.js & React Applications',
        description: 'Zero layout shift, server-side rendering, and instant edge caching engineered for sub-second speeds.',
        tags: ['Next.js App Router', 'React 18/19', 'TypeScript', 'Tailwind CSS']
      },
      {
        title: 'Headless E-Commerce & Checkout',
        description: 'Bespoke Shopify and Stripe setups with instant cart drawers, 1-click checkout, and automated inventory sync.',
        tags: ['Headless Commerce', 'Stripe Integration', 'Custom Product Catalogs', 'Conversion Tuning']
      },
      {
        title: 'Bespoke CMS & Admin Portals',
        description: 'Tailored content management backends with real-time previewing, role management, and instant publishing.',
        tags: ['Custom CMS', 'Prisma ORM', 'Database Architecture', 'Media Optimization']
      },
      {
        title: 'Motion Craft & 3D WebGL',
        description: 'Scroll-driven GSAP storytelling, canvas shaders, and micro-interactions that make visitors stop and explore.',
        tags: ['GSAP ScrollTrigger', 'Three.js / WebGL', 'Canvas Animations', 'Framer Motion']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Architecture & UX Wireframing', description: 'User flow mapping, information hierarchy, and performance benchmarking.', duration: 'Week 1' },
      { stepNumber: '02', title: 'UI Design & Interactive Prototype', description: 'Pixel-perfect visual design with responsive layouts and motion specifications.', duration: 'Weeks 2-3' },
      { stepNumber: '03', title: 'Full-Stack Development & CMS', description: 'Clean TypeScript coding, API connections, database setup, and CMS integration.', duration: 'Weeks 4-5' },
      { stepNumber: '04', title: 'QA, Speed Optimization & Launch', description: 'Cross-browser testing, SEO audit, Lighthouse 95+ tuning, and DNS deployment.', duration: 'Week 6' }
    ],
    deliverables: [
      'Production-Ready Next.js & TypeScript Codebase',
      'Bespoke Admin Panel & Content Management System',
      'SEO Structured Data & Dynamic OpenGraph Engine',
      'High-Speed Edge CDN Deployment (Vercel / AWS)',
      'Cross-Device Responsive Guarantee & Source Assets'
    ],
    quote: {
      text: 'Cre8tiveCove rebuilt our web platform from the ground up. Our bounce rate dropped 38% in the first week, and we finally have a website that matches the quality of our product.',
      author: 'MARCUS VANCE',
      role: 'VP OF DIGITAL PRODUCT',
      company: 'CYBERPULSE INC.'
    },
    relatedWorks: [
      {
        title: 'MIDLANDS TECH',
        slug: 'midlands-tech',
        client: 'Follow Your Inner Maverick',
        category: '3D WebGL & Motion Craft',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
      },
      {
        title: 'THE PLAYERS CLUB',
        slug: 'the-players-club',
        client: 'SC Education Lottery',
        category: 'Commercial Direction',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
      }
    ],
    nextService: {
      slug: 'mobile-app-development',
      title: 'Mobile App Development',
      number: '02',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 02. MOBILE APP DEVELOPMENT
  'mobile-app-development': {
    id: 'tech-02',
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    titleSerifPart: 'Engineering',
    subtitle: 'IOS • ANDROID • CROSS-PLATFORM APPS',
    categoryNumber: '02',
    tagline: 'iOS & Android apps that feel like butter in the hand. Zero bloat, offline-first reliability, and 5-star UX.',
    overview: 'Building an app that gets downloaded is easy. Building an app people keep on their home screen and use every single day is hard. We build fluid, tactile mobile applications with React Native and Flutter that feel native, run at 60fps, and never crash.',
    fullOverviewParagraphs: [
      'Your users don’t care what framework you used—they care that the app opens instantly, gestures feel natural, and data updates without a hiccup even in bad elevator WiFi.',
      'We handle the full mobile product lifecycle: intuitive onboarding, biometric authentication, push notifications, in-app purchases, real-time WebSockets, and bulletproof offline synchronization.',
      'From TestFlight beta cycles to App Store and Google Play approvals, we navigate the store guidelines and deliver production-ready apps ready for prime time.'
    ],
    heroVideo: 'https://vjs.zencdn.net/v/oceans.mp4',
    heroImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Cross-Platform App Development',
        description: 'Single codebase efficiency delivering native performance on both iOS and Android platforms.',
        tags: ['React Native', 'Flutter', 'Expo EAS', 'Native Bridges']
      },
      {
        title: 'Real-Time Sync & Offline First',
        description: 'Local caching and instantaneous cloud data synchronization for uninterrupted user experiences.',
        tags: ['SQLite / WatermelonDB', 'WebSockets', 'GraphQL Subscriptions', 'Background Sync']
      },
      {
        title: 'In-App Purchases & Subscriptions',
        description: 'Frictionless monetization workflows via RevenueCat, Apple StoreKit, and Google Play Billing.',
        tags: ['RevenueCat', 'Apple Pay / Google Pay', 'Tiered Subscriptions', 'Paywalls']
      },
      {
        title: 'Push Notifications & Deep Linking',
        description: 'Targeted customer engagement with automated rich push notifications and deep link routing.',
        tags: ['OneSignal / FCM', 'Universal Links', 'Analytics SDKs', 'A/B Testing']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'UX Flow & Screen Architecture', description: 'Wireframing user journeys, onboarding sequences, and state diagrams.', duration: 'Week 1' },
      { stepNumber: '02', title: 'High-Fidelity Mobile UI Design', description: 'Native iOS/Android HIG design systems, custom iconography, and micro-animations.', duration: 'Weeks 2-3' },
      { stepNumber: '03', title: 'Frontend & API Integration', description: 'App development, backend API endpoints, push notifications, and payment hooks.', duration: 'Weeks 4-6' },
      { stepNumber: '04', title: 'TestFlight, Beta QA & Store Launch', description: 'Beta distribution, performance profiling, and submission to App Store / Google Play.', duration: 'Week 7' }
    ],
    deliverables: [
      'Native iOS (IPA) & Android (AAB/APK) Production Binaries',
      'Complete React Native / Flutter Source Code Repository',
      'Backend API Documentation & Database Schema',
      'App Store Connect & Google Play Console Setup',
      'Post-Launch Analytics & Crashlytics Monitoring'
    ],
    quote: {
      text: 'The mobile app Cre8tiveCove delivered achieved a 4.9 rating on the App Store in our first month. The motion polish and performance are second to none.',
      author: 'ELENA ROSTOVA',
      role: 'FOUNDER & CEO',
      company: 'AETHERIA MOBILE'
    },
    relatedWorks: [
      {
        title: 'MIDLANDS TECH',
        slug: 'midlands-tech',
        client: 'Follow Your Inner Maverick',
        category: '3D WebGL & Motion Craft',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
      }
    ],
    nextService: {
      slug: 'ai-solutions',
      title: 'AI Solutions',
      number: '03',
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 03. AI SOLUTIONS
  'ai-solutions': {
    id: 'tech-03',
    slug: 'ai-solutions',
    title: 'AI Solutions',
    titleSerifPart: 'Intelligence',
    subtitle: 'AI APPS • RAG • LLM • AI INTEGRATION',
    categoryNumber: '03',
    tagline: 'Skip the generic ChatGPT wrappers. We build custom RAG pipelines, private LLMs, and automated intelligence engines trained on your data.',
    overview: 'Artificial intelligence shouldn’t be an expensive gimmick or a bullet point in a pitch deck. We build enterprise-grade AI applications and semantic search pipelines that turn messy company documents, SQL databases, and internal knowledge into instant, accurate answers.',
    fullOverviewParagraphs: [
      'Generic AI chatbots hallucinate and lack internal context. We develop custom Retrieval-Augmented Generation (RAG) architectures that securely index your proprietary company documents, codebases, and databases.',
      'Whether you require smart document summarizers, automated customer intelligence extraction, multi-model AI synthesis, or custom LLM fine-tuning, we build secure, enterprise-ready pipelines.',
      'We integrate cutting-edge models from OpenAI, Anthropic Claude, Google Gemini, and open-source models (Llama 3 / Mistral) with rigorous guardrails and privacy guarantees.'
    ],
    heroVideo: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Enterprise RAG & Semantic Search',
        description: 'Connecting vector databases with LLMs to query company documents, PDFs, and SQL databases accurately.',
        tags: ['Pinecone / pgvector', 'Hybrid Search', 'Document Chunking', 'LangChain / LlamaIndex']
      },
      {
        title: 'Custom AI Applications & Dashboards',
        description: 'Interactive web and desktop interfaces for specialized AI analysis, writing, and data extraction.',
        tags: ['Next.js AI SDK', 'Streaming Responses', 'Prompt Engineering', 'Structured JSON Outputs']
      },
      {
        title: 'Multi-Model LLM Orchestration',
        description: 'Routing queries to the most cost-effective model (Gemini, Claude, GPT-4) based on complexity.',
        tags: ['Model Router', 'Cost Optimization', 'Fallback Redundancy', 'Low-Latency Caching']
      },
      {
        title: 'AI Guardrails & Privacy Compliance',
        description: 'Data anonymization, PII redaction, and strict compliance layers to protect proprietary IP.',
        tags: ['PII Masking', 'Hallucination Mitigation', 'SOC2 Compliance', 'Audit Logging']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Data Audit & AI Feasibility', description: 'Evaluating internal data structures, identifying high-ROI AI use cases, and selecting models.', duration: 'Week 1' },
      { stepNumber: '02', title: 'Embedding & Pipeline Architecture', description: 'Building the embedding pipeline, vector indexing, and prompt engineering framework.', duration: 'Weeks 2-3' },
      { stepNumber: '03', title: 'Application UI & Integration', description: 'Developing the frontend interface, real-time streaming, and backend business logic.', duration: 'Weeks 4-5' },
      { stepNumber: '04', title: 'Evaluation, Hardening & Deploy', description: 'Benchmarking accuracy, red-teaming safety guardrails, and production cloud launch.', duration: 'Week 6' }
    ],
    deliverables: [
      'Custom AI Application with Real-Time Streaming UI',
      'Vector Database Indexing & Automated Ingestion Script',
      'Secured API Endpoints with Rate Limiting & Auth',
      'Prompt Template Library & Evaluation Metrics Suite',
      'Deployment Architecture (Cloud or Private VPC)'
    ],
    quote: {
      text: 'Cre8tiveCove built a customized RAG solution that reduced our research team’s document analysis time from 4 hours to 30 seconds with 99.4% accuracy.',
      author: 'DR. ARJUN SHARMA',
      role: 'CHIEF TECHNOLOGY OFFICER',
      company: 'VORTEX TECH'
    },
    relatedWorks: [
      {
        title: 'MIDLANDS TECH',
        slug: 'midlands-tech',
        client: 'Follow Your Inner Maverick',
        category: '3D WebGL & Motion Craft',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
      }
    ],
    nextService: {
      slug: 'ai-agents',
      title: 'AI Agents',
      number: '04',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 04. AI AGENTS
  'ai-agents': {
    id: 'tech-04',
    slug: 'ai-agents',
    title: 'AI Agents',
    titleSerifPart: 'Autonomy',
    subtitle: 'SALES AGENTS • SUPPORT AGENTS • BUSINESS AGENTS • CUSTOM AI AGENTS',
    categoryNumber: '04',
    tagline: 'Autonomous digital teammates that qualify incoming leads, answer customer questions at 3 AM, and update your CRM on autopilot.',
    overview: 'Chatbots answer questions; AI agents get work done. We architect autonomous agents equipped with custom tool-calling capabilities that interact directly with your software tools, schedule meetings, query internal APIs, and execute complex business workflows without human bottlenecks.',
    fullOverviewParagraphs: [
      'The era of static decision trees is over. We design autonomous AI agents that think, reason, and take concrete actions across your existing tech stack: reading and updating CRMs, issuing invoices, verifying booking requests, and triaging customer tickets.',
      'From inbound SDR agents that engage high-intent website visitors in seconds to 24/7 technical support agents that resolve tickets without human intervention, our agents deliver measurable ROI.',
      'Every agent is built with comprehensive state tracking, conversational memory, fallback mechanisms, and human-in-the-loop oversight.'
    ],
    heroVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Autonomous Sales & Inbound SDR Agents',
        description: 'Engaging website visitors, qualifying leads against ICP criteria, and booking meetings directly on calendars.',
        tags: ['CRM Auto-Sync', 'Lead Scoring', 'Calendar Booking', 'Personalized Sequences']
      },
      {
        title: '24/7 Customer Support Resolution Agents',
        description: 'Resolving customer queries, looking up order statuses, issuing refunds, and routing escalations.',
        tags: ['Zendesk / Intercom Sync', 'Order Status APIs', 'Multi-Language Support', 'Sentiment Analysis']
      },
      {
        title: 'Tool-Calling & Operations Agents',
        description: 'Agents that query internal databases, execute SQL queries, send emails, and generate business reports.',
        tags: ['Function Calling', 'Database Querying', 'Slack / Discord Bots', 'Multi-Agent Teams']
      },
      {
        title: 'Memory & Context Management',
        description: 'Persistent user profiles, long-term memory recall, and contextual awareness across conversations.',
        tags: ['Episodic Memory', 'Redis Context Store', 'Session Serialization', 'Entity Extraction']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Workflow & Tool Mapping', description: 'Defining the agent’s goals, available tools/APIs, edge cases, and escalation triggers.', duration: 'Week 1' },
      { stepNumber: '02', title: 'Agent Architecture & Function Calling', description: 'Developing system prompts, tool schemas, memory layers, and error-handling logic.', duration: 'Weeks 2-3' },
      { stepNumber: '03', title: 'CRM & Channel Integration', description: 'Connecting agents to website chat, WhatsApp, Slack, HubSpot, or custom portals.', duration: 'Weeks 4-5' },
      { stepNumber: '04', title: 'Simulation Testing & Live Deployment', description: 'Running thousands of simulated scenarios, fine-tuning responses, and launching.', duration: 'Week 6' }
    ],
    deliverables: [
      'Production Autonomous AI Agent with Tool Integrations',
      'Live Channel Connectors (Web, WhatsApp, Slack, CRM)',
      'Admin Monitoring Dashboard with Conversation Transcripts',
      'Human-in-the-Loop Handover Interface',
      'Agent Performance & Conversion Analytics'
    ],
    quote: {
      text: 'Our AI Sales Agent now handles 80% of initial lead qualifications and increased our booked sales meetings by 3x within the first 60 days.',
      author: 'SARAH JENKINS',
      role: 'HEAD OF GROWTH',
      company: 'SKYLA DIGITAL'
    },
    relatedWorks: [
      {
        title: 'THE PLAYERS CLUB',
        slug: 'the-players-club',
        client: 'SC Education Lottery',
        category: 'Commercial Direction',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
      }
    ],
    nextService: {
      slug: 'whatsapp-solutions',
      title: 'WhatsApp Solutions',
      number: '05',
      image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 05. WHATSAPP SOLUTIONS
  'whatsapp-solutions': {
    id: 'tech-05',
    slug: 'whatsapp-solutions',
    title: 'WhatsApp Solutions',
    titleSerifPart: 'Commerce',
    subtitle: 'WHATSAPP API • AI CHATBOTS • NOTIFICATIONS • CRM INTEGRATION',
    categoryNumber: '05',
    tagline: 'Turn WhatsApp into your highest-converting sales channel. Official Meta Cloud APIs, automated cart recovery, and instant AI chat.',
    overview: 'With a 98% open rate, WhatsApp is the most direct communication channel on Earth. We build certified Meta Cloud API solutions that automate customer onboarding, recover abandoned carts, dispatch transactional receipts, and run 24/7 AI conversational sales assistants.',
    fullOverviewParagraphs: [
      'Email marketing is crowded; WhatsApp delivers instant, direct conversation. We implement official Meta WhatsApp Business Cloud APIs, verified green tick applications, and compliant template message managers.',
      'We combine conversational AI with structured interactive buttons, list messages, payment links, and product catalogs to create seamless shopping and support experiences.',
      'Everything syncs bidirectionally with your existing CRM (HubSpot, Zoho, Salesforce) and e-commerce platforms (Shopify, WooCommerce, Custom DB).'
    ],
    heroVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    heroImage: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Meta WhatsApp Cloud API Integration',
        description: 'Official API registration, high-throughput message pipelines, and template approval management.',
        tags: ['Meta Cloud API', 'Green Tick Verification', 'Webhook Handlers', 'Multi-Agent Inbox']
      },
      {
        title: 'AI WhatsApp Chatbots & Sales Assistants',
        description: 'Natural language bots that answer questions, recommend products, and process orders 24/7.',
        tags: ['GPT-4 Integration', 'Interactive Buttons', 'Catalog Commerce', 'Human Handoff']
      },
      {
        title: 'Automated Transactional Notifications',
        description: 'Triggering instant WhatsApp updates for order confirmation, shipping tracking, OTPs, and reminders.',
        tags: ['Shopify Webhooks', 'OTP Authentication', 'Payment Reminders', 'Automated Receipts']
      },
      {
        title: 'Two-Way CRM & Helpdesk Sync',
        description: 'Logging every customer chat, lead status, and tag directly into your centralized CRM.',
        tags: ['HubSpot / Zoho Sync', 'Custom Tagging', 'Lead Routing', 'Broadcast Campaigns']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Business Account & API Verification', description: 'Setting up Meta Business Manager, phone number onboarding, and API credentials.', duration: 'Week 1' },
      { stepNumber: '02', title: 'Conversation Flow & AI Training', description: 'Designing interactive bot flows, prompt guidelines, and catalog assets.', duration: 'Week 2' },
      { stepNumber: '03', title: 'Backend Webhooks & CRM Integration', description: 'Connecting triggers to e-commerce engines, payment gateways, and CRM systems.', duration: 'Weeks 3-4' },
      { stepNumber: '04', title: 'Testing, Template Approval & Launch', description: 'Meta template approval, load testing, and team training on the shared agent inbox.', duration: 'Week 5' }
    ],
    deliverables: [
      'Official Meta WhatsApp Business Cloud API Configuration',
      'Trained AI Chatbot with Interactive Buttons & Menus',
      'Automated Order & Abandoned Cart Notification Workflows',
      'Shared Multi-Agent Customer Support Inbox',
      'Detailed API Documentation & Template Library'
    ],
    quote: {
      text: 'Our WhatsApp cart recovery automated workflow recovered $38,000 in revenue in just 30 days. Customers love the instant responses.',
      author: 'VIKRAM SINGHANIA',
      role: 'MANAGING DIRECTOR',
      company: 'URBAN CRAFT APPAREL'
    },
    relatedWorks: [
      {
        title: 'SKYLA CREDIT UNION',
        slug: 'skyla-credit-union',
        client: 'Skyla Financial',
        category: 'Brand Strategy & Film',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
      }
    ],
    nextService: {
      slug: 'automation',
      title: 'Automation',
      number: '06',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 06. AUTOMATION
  'automation': {
    id: 'tech-06',
    slug: 'automation',
    title: 'Automation',
    titleSerifPart: 'Efficiency',
    subtitle: 'N8N • WORKFLOW AUTOMATION • BUSINESS PROCESS AUTOMATION • AI AUTOMATION',
    categoryNumber: '06',
    tagline: 'Stop paying humans to copy-paste between spreadsheets. We automate complex workflows with self-hosted n8n and AI document parsing.',
    overview: 'Manual data entry and repetitive busywork are silent killers of business momentum. We build robust, self-hosted n8n automation clusters that connect your CRMs, billing systems, spreadsheets, and inboxes into an uninterrupted operational machine with zero per-task fees.',
    fullOverviewParagraphs: [
      'When your team spends hours copying data between spreadsheets, CRMs, and email inboxes, business scalability stalls. We build resilient automation pipelines using self-hosted n8n, custom cloud webhooks, and AI cognitive extractors.',
      'From automated invoice and receipt extraction to customer onboarding pipelines, automated contract drafting, and multi-app data synchronization, we build logic that runs 24/7 without breaking.',
      'Self-hosted n8n instances guarantee zero per-task execution fees and complete privacy for sensitive customer data.'
    ],
    heroVideo: 'https://vjs.zencdn.net/v/oceans.mp4',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Self-Hosted n8n Architecture',
        description: 'Scalable, secure n8n automation clusters with unlimited workflow execution and custom node creation.',
        tags: ['n8n Self-Hosted', 'Docker / Kubernetes', 'Custom Webhooks', 'Zero Task Cost']
      },
      {
        title: 'AI Document Parsing & OCR Extraction',
        description: 'Extracting structured data from PDF invoices, contracts, receipts, and images using Vision LLMs.',
        tags: ['Vision AI', 'Receipt / Invoice Parsing', 'JSON Schema Output', 'Automated Reconciliation']
      },
      {
        title: 'Cross-Platform Data Synchronization',
        description: 'Two-way sync across CRMs, Google Sheets, Airtable, Slack, Notion, and financial software.',
        tags: ['HubSpot / Salesforce', 'Stripe Billing Webhooks', 'Slack Alerting', 'Airtable Sync']
      },
      {
        title: 'Error Handling & Monitoring Alerting',
        description: 'Automated retry queues, dead-letter notifications, and instant alerts on failure via Telegram/Slack.',
        tags: ['Auto-Retry Queues', 'Sentry Integration', 'Slack Error Bots', 'Health Dashboards']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Process Audit & Bottleneck Mapping', description: 'Documenting repetitive manual workflows, calculating time waste, and architecting data flows.', duration: 'Week 1' },
      { stepNumber: '02', title: 'n8n Infrastructure & Node Setup', description: 'Deploying secure self-hosted n8n servers with encrypted credential vaults.', duration: 'Week 2' },
      { stepNumber: '03', title: 'Workflow Build & AI Logic Testing', description: 'Constructing multi-branch automation trees, parsing logic, and webhook triggers.', duration: 'Weeks 3-4' },
      { stepNumber: '04', title: 'Stress Testing & Handover Training', description: 'Simulating edge cases, setting up monitoring alerts, and delivering documentation.', duration: 'Week 5' }
    ],
    deliverables: [
      'Self-Hosted or Cloud n8n Infrastructure Cluster',
      'Configured Multi-Branch Automation Workflows',
      'AI Document Parsing & JSON Extraction Pipelines',
      'Comprehensive Error Handling & Slack Alerting System',
      'Workflow Documentation & Visual Diagram Architecture'
    ],
    quote: {
      text: 'Cre8tiveCove’s automated n8n workflows saved our operations team over 120 hours every month and completely eliminated manual data entry errors.',
      author: 'DAVID CHEN',
      role: 'VP OF OPERATIONS',
      company: 'CYBERPULSE LOGISTICS'
    },
    relatedWorks: [
      {
        title: 'MIDLANDS TECH',
        slug: 'midlands-tech',
        client: 'Follow Your Inner Maverick',
        category: '3D WebGL & Motion Craft',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
      }
    ],
    nextService: {
      slug: 'software-saas-development',
      title: 'Software & SaaS Development',
      number: '07',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 07. SOFTWARE & SAAS DEVELOPMENT
  'software-saas-development': {
    id: 'tech-07',
    slug: 'software-saas-development',
    title: 'Software & SaaS Development',
    titleSerifPart: 'Architecture',
    subtitle: 'CRM • ERP • MARKETPLACES • BOOKING SYSTEMS • CUSTOM PLATFORMS',
    categoryNumber: '07',
    tagline: 'Custom SaaS platforms, internal ERPs, and booking engines built from scratch to handle real scale without crashing on launch day.',
    overview: 'Off-the-shelf software forces your business to adapt to someone else’s constraints. We engineer bespoke internal software, multi-tenant SaaS platforms, and enterprise dashboards built on modern TypeScript, PostgreSQL, and scalable cloud architectures.',
    fullOverviewParagraphs: [
      'When your business model outgrows off-the-shelf tools, generic software becomes a bottleneck. We engineer custom operational hubs, client portals, booking platforms, and B2B SaaS applications engineered to your exact specifications.',
      'Our tech stack uses modern TypeScript, Next.js, Node.js/Go backends, PostgreSQL/Prisma, Redis caching, and Stripe Billing architectures for rock-solid stability.',
      'We build intuitive dashboards, audit trails, multi-tenant workspace isolation, role-based access permissions, and automated onboarding flows that delight end users.'
    ],
    heroVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Multi-Tenant SaaS Architecture',
        description: 'Complete workspace isolation, custom domain support, seat-based billing, and role-based permissions.',
        tags: ['Multi-Tenancy', 'Stripe Billing / LemonSqueezy', 'Custom Domains', 'RBAC Security']
      },
      {
        title: 'Custom CRM & ERP Systems',
        description: 'Centralized operational dashboards managing inventory, sales pipelines, client data, and staff tasks.',
        tags: ['PostgreSQL Database', 'Kanban / Table Views', 'Audit Logging', 'Automated Reporting']
      },
      {
        title: 'Marketplaces & Booking Platforms',
        description: 'Two-sided marketplaces with escrow payments, vendor payouts, calendar scheduling, and instant booking.',
        tags: ['Stripe Connect Payouts', 'Real-Time Availability', 'Review Systems', 'Search & Filtering']
      },
      {
        title: 'Analytics & Real-Time Dashboards',
        description: 'Interactive visualization charts, business KPIs, CSV exports, and event-driven data streaming.',
        tags: ['Chart.js / Recharts', 'Aggregation Queries', 'PDF Invoicing', 'Activity Feeds']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Product Scoping & Data Modeling', description: 'Defining entities, relational database schemas, user roles, and business rules.', duration: 'Weeks 1-2' },
      { stepNumber: '02', title: 'UI/UX Design & Design Tokens', description: 'Crafting comprehensive component systems, dark/light themes, and dashboard layouts.', duration: 'Weeks 3-4' },
      { stepNumber: '03', title: 'Core Engineering & Authentication', description: 'Implementing backend APIs, multi-tenant data layer, auth, and payment integrations.', duration: 'Weeks 5-8' },
      { stepNumber: '04', title: 'Security Audit, QA & Deployment', description: 'Penetration testing, load testing, automated CI/CD pipelines, and cloud deployment.', duration: 'Weeks 9-10' }
    ],
    deliverables: [
      'Full-Stack Next.js / TypeScript SaaS Codebase',
      'PostgreSQL Relational Database Schema & Migrations',
      'Integrated Stripe / LemonSqueezy Subscription Billing',
      'Role-Based Access Control (RBAC) & Audit Log Engine',
      'API Documentation & Cloud Hosting Infrastructure'
    ],
    quote: {
      text: 'Cre8tiveCove built our custom B2B SaaS platform from scratch in 10 weeks. We onboarded our first 50 enterprise clients with zero downtime.',
      author: 'MARCUS VANCE',
      role: 'FOUNDER',
      company: 'PULSEFLOW SAAS'
    },
    relatedWorks: [
      {
        title: 'THE PLAYERS CLUB',
        slug: 'the-players-club',
        client: 'SC Education Lottery',
        category: 'Commercial Direction',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
      }
    ],
    nextService: {
      slug: 'api-integrations',
      title: 'API & Integrations',
      number: '08',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 08. API & INTEGRATIONS
  'api-integrations': {
    id: 'tech-08',
    slug: 'api-integrations',
    title: 'API & Integrations',
    titleSerifPart: 'Connectivity',
    subtitle: 'PAYMENT GATEWAYS • CRM • ERP • THIRD-PARTY APIS • WEBHOOKS',
    categoryNumber: '08',
    tagline: 'We connect your payment gateways, CRMs, logistics, and legacy databases into one synchronized, fail-safe system.',
    overview: 'Data silos kill execution speed. We connect your frontend applications, databases, and third-party SaaS tools through high-throughput REST, GraphQL, and webhook pipelines equipped with automated retries, cryptographic signatures, and zero latency.',
    fullOverviewParagraphs: [
      'Data silos kill operational velocity. We connect your frontend applications, databases, and third-party SaaS tools through resilient APIs, microservices, and secure authentication protocols.',
      'We specialize in integrating financial payment gateways (Stripe, Razorpay, PayPal), enterprise CRMs (Salesforce, HubSpot), ERP systems, logistics tracking APIs, and custom webhook dispatchers.',
      'Every integration includes rate-limiting protection, token rotation, cryptographic signature verification, and automated retry logic.'
    ],
    heroVideo: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Payment Gateway Integration',
        description: 'Flawless checkout flows, recurring billing, multi-currency support, and fraud prevention.',
        tags: ['Stripe Elements', 'Razorpay', 'Apple Pay / Google Pay', 'Webhook Verification']
      },
      {
        title: 'Custom REST & GraphQL APIs',
        description: 'Type-safe, self-documenting API endpoints built with Node.js, Next.js API routes, or Go.',
        tags: ['OpenAPI / Swagger', 'GraphQL Schemas', 'JWT / OAuth2 Auth', 'Rate Limiting']
      },
      {
        title: 'Enterprise CRM & ERP Sync',
        description: 'Real-time bidirectional synchronization between internal databases and enterprise software.',
        tags: ['HubSpot API', 'Salesforce REST', 'Zoho CRM', 'QuickBooks Accounting']
      },
      {
        title: 'Webhook Infrastructure & Queues',
        description: 'Asynchronous event queues (Redis / BullMQ) ensuring zero dropped messages during traffic surges.',
        tags: ['BullMQ / Redis', 'Exponential Backoff', 'Dead-Letter Queues', 'Payload Verification']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'API Audit & Schema Mapping', description: 'Reviewing API documentation, rate limits, data schemas, and authentication methods.', duration: 'Week 1' },
      { stepNumber: '02', title: 'Endpoint Construction & Middleware', description: 'Building type-safe connectors, validation layers, and security middleware.', duration: 'Weeks 2-3' },
      { stepNumber: '03', title: 'Webhook Handlers & Queue Logic', description: 'Implementing asynchronous event workers, caching, and idempotency keys.', duration: 'Weeks 4-5' },
      { stepNumber: '04', title: 'Load Testing & OpenAPI Docs', description: 'Benchmarking latency under load, documenting with Swagger, and deployment.', duration: 'Week 6' }
    ],
    deliverables: [
      'Documented REST / GraphQL API Endpoints',
      'Resilient Webhook Receiver & Queue Dispatcher',
      'OpenAPI (Swagger) Interactive Documentation',
      'Secure Token & Secret Key Management Setup',
      'Integration Health Check & Monitoring Dashboard'
    ],
    quote: {
      text: 'Cre8tiveCove integrated our payment gateway, ERP, and logistics APIs flawlessly. Our checkout failures dropped to zero.',
      author: 'SARAH JENKINS',
      role: 'VP OF COMMERCE',
      company: 'SKYLA MERCHANDISE'
    },
    relatedWorks: [
      {
        title: 'MIDLANDS TECH',
        slug: 'midlands-tech',
        client: 'Follow Your Inner Maverick',
        category: '3D WebGL & Motion Craft',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
      }
    ],
    nextService: {
      slug: 'digital-experience-virtual-tours',
      title: 'Digital Experience & Virtual Tours',
      number: '09',
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 09. DIGITAL EXPERIENCE & VIRTUAL TOURS
  'digital-experience-virtual-tours': {
    id: 'tech-09',
    slug: 'digital-experience-virtual-tours',
    title: 'Digital Experience & Virtual Tours',
    titleSerifPart: 'Immersion',
    subtitle: '360° VIRTUAL TOURS • INTERACTIVE PANORAMAS • VIRTUAL SHOWROOMS • 3D PRODUCT EXPERIENCES • AR/VR',
    categoryNumber: '09',
    tagline: 'Interactive 3D web spaces and digital showrooms your customers can explore right in their browser without downloading an app.',
    overview: 'Flat 2D pages only tell half the story. We build photorealistic 3D virtual showrooms, spatial product customizers, and interactive digital walkthroughs that run directly in any web browser at silky 60fps.',
    fullOverviewParagraphs: [
      'Physical distance is no longer a barrier. We build photorealistic 3D virtual showrooms and interactive 360° environments that visitors can explore from any phone, desktop, or VR headset with zero plugin installs.',
      'From real estate developments and luxury vehicle configurators to interactive digital exhibition booths and educational museum tours, we engineer smooth WebGL shaders and spatial audio.',
      'Every virtual experience includes clickable interactive hotspots, embedded video players, live booking forms, and detailed visitor analytics.'
    ],
    heroVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    heroImage: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Virtual Showrooms & WebGL Spaces',
        description: 'Interactive 3D environments where users walk through virtual architecture and inspect products in 3D.',
        tags: ['Three.js / React Three Fiber', 'PBR Lighting', 'Spatial Navigation', 'Browser-Based VR']
      },
      {
        title: 'Interactive 3D Product Customizers',
        description: 'Real-time 360° product rotation, material swapping, color configurators, and instant quote generation.',
        tags: ['GLTF / GLB Optimization', 'Material Shaders', 'Dynamic Pricing', 'AR Quick Look']
      },
      {
        title: 'Interactive Maps & Multi-Floor Hotspots',
        description: 'Interactive architectural floor plans with live radar orientation and clickable multimedia tags.',
        tags: ['Interactive Hotspots', 'Floor Plan Overlays', 'Audio Guides', 'Video Embedding']
      },
      {
        title: 'Cross-Device & VR Headset Compatibility',
        description: 'Optimized rendering for mobile browsers, desktop screens, and Meta Quest / Apple Vision Pro.',
        tags: ['WebXR', 'Mobile Touch Gestures', 'Gyroscopic Controls', 'Fast Asset CDN']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Spatial Concept & 3D Asset Prep', description: 'CAD modeling, texture baking, panoramic photography, and spatial mapping.', duration: 'Weeks 1-2' },
      { stepNumber: '02', title: 'WebGL Scene Setup & Lighting', description: 'Configuring Three.js shaders, lighting baking, and spatial audio cues.', duration: 'Weeks 3-4' },
      { stepNumber: '03', title: 'Hotspots & E-Commerce Integration', description: 'Programming interactive pins, product modals, video popups, and booking forms.', duration: 'Weeks 5-6' },
      { stepNumber: '04', title: 'Performance Optimization & Launch', description: 'Asset compression, cross-browser QA, mobile touch tuning, and deployment.', duration: 'Week 7' }
    ],
    deliverables: [
      'Interactive 3D / 360° WebGL Virtual Experience',
      'Embedded Product Hotspots & Multimedia Popups',
      'Interactive Architectural Floor Plan System',
      'WebXR / Mobile Gyroscope Navigation Support',
      'Visitor Spatial Engagement Analytics'
    ],
    quote: {
      text: 'Cre8tiveCove built our virtual showroom. Our international buyers spent an average of 8 minutes exploring our collection and inquiries jumped 65%.',
      author: 'ELENA ROSTOVA',
      role: 'DIRECTOR OF ARCHITECTURE',
      company: 'AETHERIA LIVING'
    },
    relatedWorks: [
      {
        title: 'MIDLANDS TECH',
        slug: 'midlands-tech',
        client: 'Follow Your Inner Maverick',
        category: '3D WebGL & Motion Craft',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
      }
    ],
    nextService: {
      slug: '360-panorama-virtual-tours',
      title: '360° Panorama & Virtual Tours',
      number: '10',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 10. 360° PANORAMA & VIRTUAL TOURS
  '360-panorama-virtual-tours': {
    id: 'tech-10',
    slug: '360-panorama-virtual-tours',
    title: '360° Panorama & Virtual Tours',
    titleSerifPart: 'Reality',
    subtitle: 'REAL ESTATE • HOTELS & RESORTS • RETAIL • OFFICE TOURS • GOOGLE STREET VIEW',
    categoryNumber: '10',
    tagline: 'Crystal-clear 8K HDR virtual walkthroughs for luxury real estate, resorts, and Google Maps that turn lookers into bookers.',
    overview: 'Bring your physical space to life in stunning 8K resolution. We capture HDR panoramic imagery and build branded interactive walkthroughs with floor plans, audio narration, and Google Street View publishing that give prospective buyers an unmistakable sense of presence.',
    fullOverviewParagraphs: [
      'Prospective buyers and travelers want to explore physical spaces before they visit or book. We shoot high-dynamic-range (HDR) 360° imagery using specialized panoramic camera rigs and professional post-processing.',
      'We build branded interactive walkthroughs with custom logos, background music, audio narration, interactive information hotspots, and floor plan navigation.',
      'We also provide verified Google Street View / Google Business Profile publishing to boost your Google Maps local search ranking and physical foot traffic.'
    ],
    heroVideo: 'https://vjs.zencdn.net/v/oceans.mp4',
    heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: '8K HDR 360° Panoramic Photography',
        description: 'High-resolution panoramic captures with perfect exposure balancing, color grading, and nadir patching.',
        tags: ['8K HDR Capture', 'Nadir Removal', 'Color Grading', 'Drone 360 Panoramas']
      },
      {
        title: 'Custom Branded Walkthrough Players',
        description: 'Interactive HTML5 web tours with custom branding, menus, audio narration, and floor plan radar.',
        tags: ['Custom Branding', 'Interactive Hotspots', 'Floor Plan Maps', 'Lead Capture Modals']
      },
      {
        title: 'Google Street View Publishing',
        description: 'Official verified upload to Google Maps and Google Business Profile to dominate local search results.',
        tags: ['Google Street View', 'Google Maps Sync', 'Local SEO Boost', 'Blue Line Connectivity']
      },
      {
        title: 'Real Estate & Hospitality Embeds',
        description: 'Seamless embedding into Zillow, MLS listings, Airbnb, Booking.com, and company websites.',
        tags: ['MLS / Zillow Ready', 'iFrame Embed Code', 'Offline Kiosk Mode', 'High-Speed CDN']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Location Scouting & Shoot Prep', description: 'Staging the property, planning camera nodes, and scheduling optimal natural lighting.', duration: 'Day 1' },
      { stepNumber: '02', title: 'On-Site 360° HDR Capture', description: 'Capturing multi-exposure 360° photography across all key rooms, exterior, and drone views.', duration: 'Days 2-3' },
      { stepNumber: '03', title: 'Stitching, Color Pass & Interface', description: 'Stitching 8K panoramas, color grading, and programming interactive hotspot links.', duration: 'Week 2' },
      { stepNumber: '04', title: 'Google Maps Publish & Web Embed', description: 'Deploying custom tour URL, publishing to Google Street View, and delivering embed codes.', duration: 'Week 3' }
    ],
    deliverables: [
      'Full 8K HDR Interactive 360° Virtual Tour Web Link',
      'Embeddable iFrame Code for Real Estate & Corporate Websites',
      'Verified Google Street View & Google Maps Integration',
      'High-Resolution 360° Panoramic Equirectangular Source JPEGs',
      'Interactive Floor Plan Map with Hotspot Linking'
    ],
    quote: {
      text: 'The 360° virtual tour Cre8tiveCove produced for our resort boosted our direct online bookings by 48% and significantly improved our Google Maps presence.',
      author: 'SALLY W. SWEENEY',
      role: 'MANAGING DIRECTOR',
      company: 'THE PALMS LUXURY RESORT'
    },
    relatedWorks: [
      {
        title: 'THE PLAYERS CLUB',
        slug: 'the-players-club',
        client: 'SC Education Lottery',
        category: 'Commercial Direction',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
      }
    ],
    nextService: {
      slug: 'maintenance-support',
      title: 'Maintenance & Support',
      number: '11',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 11. MAINTENANCE & SUPPORT
  'maintenance-support': {
    id: 'tech-11',
    slug: 'maintenance-support',
    title: 'Maintenance & Support',
    titleSerifPart: 'Reliability',
    subtitle: 'MONITORING • SECURITY • OPTIMIZATION • BUG FIXING • CONTINUOUS DEVELOPMENT',
    categoryNumber: '11',
    tagline: 'Sleep easy knowing senior engineers are monitoring your servers 24/7, patching security flaws, and fixing bugs before users notice.',
    overview: 'Software isn’t a one-and-done project—it’s living infrastructure. We provide dedicated engineering retainers with 24/7 automated monitoring, proactive security patching, speed optimization, and guaranteed SLA response times to keep your revenue flowing uninterrupted.',
    fullOverviewParagraphs: [
      'Websites and apps degrade over time without active maintenance: dependencies go stale, security vulnerabilities emerge, and third-party APIs change without warning. We act as your dedicated engineering team post-launch.',
      'Our proactive maintenance plans include 24/7 real-time server monitoring, automated database backups, security patch applications, dependency upgrades, and guaranteed SLA response times.',
      'We also provide continuous monthly development hours for iterative UI enhancements, new feature releases, A/B conversion tests, and performance tuning.'
    ],
    heroVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: '24/7 Uptime & Server Health Monitoring',
        description: 'Instant automated alerts and automated self-healing scripts if servers experience latency spikes or downtime.',
        tags: ['24/7 Ping Monitors', 'CloudWatch Alerts', 'SSL Renewal', 'Database Health Checks']
      },
      {
        title: 'Security Audits & Patch Management',
        description: 'Proactive vulnerability scanning, dependency patching (npm/pip), and firewall rules updates.',
        tags: ['CVE Vulnerability Patching', 'DDoS Protection', 'Automated Daily Backups', 'Penetration Audits']
      },
      {
        title: 'Speed Tuning & Core Web Vitals',
        description: 'Continuous asset optimization, query indexing, and caching configurations to maintain 95+ Lighthouse scores.',
        tags: ['Lighthouse 95+ Maintenance', 'SQL Indexing', 'CDN Cache Tuning', 'Asset Minification']
      },
      {
        title: 'Continuous Feature Development & SLA',
        description: 'Dedicated monthly engineering hours for bug fixing, UI tweaks, new page rollouts, and integrations.',
        tags: ['Guaranteed SLA Response', 'Dedicated Slack Channel', 'Monthly Release Sprints', 'Priority Support']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'System Audit & Baseline Health Check', description: 'Auditing codebases, database performance, security vulnerabilities, and server setup.', duration: 'Day 1' },
      { stepNumber: '02', title: 'Monitoring & Automated Backup Setup', description: 'Configuring 24/7 uptime monitors, alert webhooks, and automated daily backup routines.', duration: 'Week 1' },
      { stepNumber: '03', title: 'Monthly Maintenance & Patching Sprints', description: 'Applying dependency updates, optimizing speed, and resolving bug tickets.', duration: 'Ongoing' },
      { stepNumber: '04', title: 'Monthly Reporting & Strategic Roadmap', description: 'Delivering detailed uptime reports, traffic analytics, and proposing future upgrades.', duration: 'Monthly' }
    ],
    deliverables: [
      '24/7 Automated Uptime & Error Alerting Infrastructure',
      'Automated Daily Off-Site Encrypted Database Backups',
      'Guaranteed SLA Priority Bug Resolution Support',
      'Monthly Security & Dependency Patching Report',
      'Dedicated Direct Slack / WhatsApp Channel with Senior Engineers'
    ],
    quote: {
      text: 'Having Cre8tiveCove on our maintenance retainer gives our executive team complete peace of mind. Any issue is resolved within minutes.',
      author: 'DAVID CHEN',
      role: 'CTO',
      company: 'CYBERPULSE ENTERPRISE'
    },
    relatedWorks: [
      {
        title: 'MIDLANDS TECH',
        slug: 'midlands-tech',
        client: 'Follow Your Inner Maverick',
        category: '3D WebGL & Motion Craft',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
      }
    ],
    nextService: {
      slug: 'web-development',
      title: 'Web Development',
      number: '01',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 01. BRAND IDENTITY & CREATIVE STRATEGY
  'brand-identity': {
    id: 'srv-1',
    slug: 'brand-identity',
    title: 'Brand Identity & Creative Strategy',
    titleSerifPart: 'Creative Strategy',
    subtitle: 'POSITIONING • VISUAL SYSTEMS • CULTURAL RELEVANCE',
    categoryNumber: '01',
    tagline: 'Comprehensive brand positioning, logo design systems, typography guidelines, visual asset packages, and brand voice definition for market leaders.',
    overview: 'In an era of algorithmic noise and copycat brands, aesthetics alone won’t save you. We craft fearless brand identities rooted in authentic human psychology, sharp cultural tension, and unapologetic craft.',
    fullOverviewParagraphs: [
      'We don’t believe in sterile 100-page corporate brand books that gather dust in Google Drive. We build living, breathing brand identities that give founders, marketers, and creative teams the license to make bold moves.',
      'From foundational market positioning and strategic narrative to custom typographic hierarchies, kinetic motion languages, and packaging design—we make sure every single touchpoint feels undeniably iconic.',
      'Whether you are an ambitious venture-backed startup launching into a crowded market or a legacy enterprise staging a radical reinvention, we position you to dominate your cultural category.'
    ],
    heroVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    heroImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Brand Strategy & Positioning',
        description: 'Uncovering the singular truth of your product and defining a market-defining value proposition that competitors cannot copy.',
        tags: ['Market Auditing', 'Audience Archetypes', 'Brand DNA & Pillars', 'Messaging Framework']
      },
      {
        title: 'Visual Identity & Design Systems',
        description: 'Creating memorable logomarks, color palettes, custom typographic pairings, and grid systems built for digital and physical worlds.',
        tags: ['Logo & Iconography', 'Color Architecture', 'Custom Typography', 'Design Token Specs']
      },
      {
        title: 'Tone of Voice & Verbal Identity',
        description: 'Defining the exact personality, rhythm, humor, and vocabulary your brand uses across marketing, product, and press.',
        tags: ['Brand Voice Playbook', 'Taglines & Slogans', 'Micro-copy Guidelines', 'Editorial Framework']
      },
      {
        title: 'Kinetic & Motion Guidelines',
        description: 'Bringing the brand to life in motion — how your logos animate, how UI components bounce, and how video overlays behave.',
        tags: ['Logo Choreography', 'UI Motion Rules', 'Social Media Templates', '3D Asset Guidelines']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Immersion & Deconstruction', description: 'We audit your competitor landscape, interview key stakeholders, and isolate the whitespace your brand will conquer.', duration: 'Week 1' },
      { stepNumber: '02', title: 'Strategic Architecture & Positioning', description: 'Formulating the core narrative, brand pillars, manifesto, and tone-of-voice directives that guide all creative execution.', duration: 'Week 2' },
      { stepNumber: '03', title: 'Visual World Building & Iteration', description: 'Designing 2-3 distinct creative directions with fully realized mockups: from identity marks to real-world applications.', duration: 'Weeks 3-4' },
      { stepNumber: '04', title: 'Systematization & Brand Guidelines', description: 'Delivering full asset packages, vector libraries, motion files, and an interactive digital brand guidelines hub.', duration: 'Week 5' }
    ],
    deliverables: [
      'Master Logo Suite & Vector Iconography',
      'Comprehensive Brand Guidelines Manual (PDF & Web)',
      'Custom Typography Hierarchy & Color Tokens',
      'Social Media Templates & Stationery Assets',
      'Motion Guidelines & Kinetic Logo Animations'
    ],
    quote: {
      text: 'Cre8tiveCove took our ambiguous vision and sculpted it into a fierce, distinctive identity that immediately set us apart from every legacy player in our space.',
      author: 'SARAH JENKINS',
      role: 'VP OF BRAND MARKETING',
      company: 'SKYLA CREDIT UNION'
    },
    relatedWorks: [
      {
        title: 'SKYLA CREDIT UNION',
        slug: 'skyla-credit-union',
        client: 'Skyla Financial',
        category: 'Brand Strategy & Film',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
      },
      {
        title: 'THE PLAYERS CLUB',
        slug: 'the-players-club',
        client: 'SC Education Lottery',
        category: 'Commercial Direction',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
      }
    ],
    nextService: {
      slug: 'cgi-3d-motion-design',
      title: 'CGI & 3D Motion Design',
      number: '02',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 02. CGI & 3D MOTION DESIGN
  'cgi-3d-motion-design': {
    id: 'srv-2',
    slug: 'cgi-3d-motion-design',
    title: 'CGI & 3D Motion Design',
    titleSerifPart: 'Motion Design',
    subtitle: '3D PRODUCT VISUALS • ARCHITECTURAL FLY-THROUGHS • KINETIC MOTION',
    categoryNumber: '02',
    tagline: 'Cutting-edge 3D product visualizations, architectural fly-throughs, photorealistic visualizers, and high-octane motion graphics.',
    overview: 'Break free from the constraints of physical camera shoots. We build photorealistic 3D product renders, explosive procedural particle simulations, and cinematic architectural fly-throughs that elevate your product into an art piece.',
    fullOverviewParagraphs: [
      'Whether you are unveiling an unreleased industrial hardware design, architectural luxury development, or abstract brand world, our 3D artists bring it to life with microscopic detail.',
      'We utilize Cinema 4D, Blender, Houdini, and Octane/Redshift rendering engines to sculpt realistic materials, ray-traced lighting, glass refractions, and fluid particle simulations.',
      'Every 3D asset is delivered in high-resolution video cuts, looping social visuals, and lightweight WebGL formats ready for interactive web integration.'
    ],
    heroVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    heroImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: '3D Product Modeling & Texturing',
        description: 'Creating hyper-detailed CAD models, custom PBR material textures, and photorealistic lighting rigs.',
        tags: ['CAD / NURBS Modeling', 'PBR Shaders', 'Subsurface Scattering', 'Octane / Redshift']
      },
      {
        title: 'Kinetic Motion Graphics & Type',
        description: 'Dynamic 3D typography, title sequences, broadcast idents, and rhythm-synced visual animations.',
        tags: ['Kinetic Typography', 'Logo Resolves', 'After Effects Compositing', 'Dynamic Physics']
      },
      {
        title: 'Architectural CGI & Spatial Tours',
        description: 'Photorealistic architectural fly-throughs, luxury interior showcases, and dramatic environmental renders.',
        tags: ['Architectural Visualization', 'Camera Fly-Throughs', 'Volumetric Lighting', '4K Mastering']
      },
      {
        title: 'Interactive 3D WebGL Assets',
        description: 'Optimized low-polygon 3D models and GLTF exports for seamless in-browser 3D web configurators.',
        tags: ['GLTF / GLB Compression', 'Three.js Compatibility', 'Real-Time Shaders', 'WebXR Assets']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Concept, Moodboard & 3D Pre-Vis', description: 'Defining the creative visual direction, camera choreography, and lighting mood reels.', duration: 'Week 1' },
      { stepNumber: '02', title: '3D Modeling & Material Texturing', description: 'Sculpting high-precision geometry, baking custom displacement maps, and dialing in materials.', duration: 'Weeks 2-3' },
      { stepNumber: '03', title: 'Animation & Simulation Pass', description: 'Animating camera moves, procedural physics, fluid simulations, and kinetic motion.', duration: 'Weeks 3-4' },
      { stepNumber: '04', title: 'Final Render, Color & Audio Master', description: '4K ray-traced rendering, compositing, sound design sync, and multi-format delivery.', duration: 'Week 5' }
    ],
    deliverables: [
      'High-Resolution 3D CGI Still Renders (8K / Print-Ready)',
      'Cinematic 3D Motion Video Clips (16:9 & 9:16 ProRes)',
      'Interactive 3D Web Assets (GLTF / GLB / Three.js)',
      'Layered Compositing Project Files & Render Passes',
      'Custom Sound Design & Foley Integration'
    ],
    quote: {
      text: 'The 3D product visualizations Cre8tiveCove created allowed us to pre-sell $1.2M of our hardware before physical manufacturing was even finished.',
      author: 'VIKRAM SINGHANIA',
      role: 'FOUNDER & CEO',
      company: 'VORTEX HARDWARE'
    },
    relatedWorks: [
      {
        title: 'MIDLANDS TECH',
        slug: 'midlands-tech',
        client: 'Follow Your Inner Maverick',
        category: '3D WebGL & Motion Craft',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
      }
    ],
    nextService: {
      slug: 'video-production',
      title: 'Video Production & Commercial Shoots',
      number: '03',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 03. VIDEO PRODUCTION & COMMERCIAL SHOOTS
  'video-production': {
    id: 'srv-3',
    slug: 'video-production',
    title: 'Video Production & Commercial Shoots',
    titleSerifPart: 'Commercial Shoots',
    subtitle: 'BROADCAST COMMERCIALS • BRAND FILMS • DRONE CINEMATOGRAPHY',
    categoryNumber: '03',
    tagline: 'Commercial TVCs, brand films, product launches, corporate AVs, and drone cinematography shot with cinema-grade rigs and post-produced to perfection.',
    overview: 'Motion is the ultimate medium for emotional resonance. We produce broadcast-ready commercial spots, cinematic brand anthems, and high-octane visual storytelling that command total audience attention.',
    fullOverviewParagraphs: [
      'From the opening frame to the final sound sting, every frame of video we produce is crafted to trigger a physiological reaction — goosebumps, laughter, awe, or pure adrenaline.',
      'We run full-scale production pipelines: scriptwriting, talent casting, location scouting, director-led cinema crews, RED/ARRI camera packages, high-speed robotics, and industry-leading post-production workflows.',
      'Our in-house visual effects and color-grading suite delivers Hollywood-grade grading, photorealistic 3D particle simulations, and bespoke sound design that elevates your brand onto the grandest stage.'
    ],
    heroVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    heroImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Commercial Direction & Live Action',
        description: 'End-to-end film production: from director vision and lighting design to set direction and multi-camera shoots.',
        tags: ['Director of Photography', 'ARRI/RED Cinema Systems', 'Set Design & Lighting', 'Talent Casting & Scouting']
      },
      {
        title: 'High-Speed Camera & Drone Cinematography',
        description: 'High-speed robotic camera moves, FPV drone chase shots, and licensed aerial cinema capture.',
        tags: ['FPV Cinema Drone', 'High-Speed Phantom Shoots', 'Gimbal Stabilization', 'Licensed FAA Pilots']
      },
      {
        title: 'Color Grading & Finishing',
        description: 'DaVinci Resolve color grading that establishes distinct mood, rich cinematic grain, and exact brand aesthetic fidelity.',
        tags: ['DaVinci Resolve Studio', 'Film Emulation LUTs', 'HDR & SDR Mastering', 'Broadcast Standards Compliance']
      },
      {
        title: 'Sound Design & Original Score',
        description: 'Immersive soundscapes, foley recording, voiceover casting, and custom musical scores that supercharge emotional impact.',
        tags: ['Spatial Audio Mixing', 'Voiceover Direction', 'Foley & SFX Library', 'Licensing & Original Scoring']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Treatment & Visual Concept', description: 'Crafting the director’s treatment, mood reels, storyboard breakdowns, and lighting blueprints.', duration: 'Week 1' },
      { stepNumber: '02', title: 'Pre-Production & Logistics', description: 'Locking talent, scouting prime locations, coordinating camera robotics, and gear prep.', duration: 'Week 2' },
      { stepNumber: '03', title: 'Production Shoot Days', description: 'High-energy shoot days executed with military precision, artistic improvisation, and Zen focus.', duration: 'Week 3' },
      { stepNumber: '04', title: 'Post-Production, VFX & Color Master', description: 'Editing multi-cut storylines, compositing 3D VFX, final color grading pass, and mastering sound.', duration: 'Weeks 4-5' }
    ],
    deliverables: [
      'Master Broadcast TV Commercial Cuts (15s, 30s, 60s in 4K/ProRes)',
      'Optimized Vertical Social Cuts (9:16 for Reels / TikTok / Shorts)',
      'Behind-The-Scenes Video Cut & Production Stills',
      'Complete DaVinci Resolve Color Grade Archive',
      'Fully Mastered Stereo & 5.1 Surround Audio Tracks'
    ],
    quote: {
      text: 'They have helped produce some of the most iconic commercials in our industry. Their ability to fuse high-concept cinematic direction with commercial clarity is unmatched.',
      author: 'SALLY W. SWEENEY',
      role: 'VP OF SALES AND MARKETING',
      company: 'SC EDUCATION LOTTERY'
    },
    relatedWorks: [
      {
        title: 'THE PLAYERS CLUB',
        slug: 'the-players-club',
        client: 'SC Education Lottery',
        category: 'Commercial Direction',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
      },
      {
        title: "WORK DOESN'T WORK",
        slug: 'work-doesnt-work',
        client: 'SC DHEC',
        category: 'Cinematography & VFX',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
      }
    ],
    nextService: {
      slug: 'ai-ads-creatives',
      title: 'AI Ads & Creatives',
      number: '04',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 04. AI ADS & CREATIVES
  'ai-ads-creatives': {
    id: 'srv-4',
    slug: 'ai-ads-creatives',
    title: 'AI Ads & Creatives',
    titleSerifPart: 'Generative AI',
    subtitle: 'GENERATIVE VISUALS • HYPER-TARGETED AD CREATIVES • RAPID ITERATION',
    categoryNumber: '04',
    tagline: 'From concept to campaign, we blend human creativity with cutting-edge AI to create high-performing ads, visuals, videos, and branded content that capture attention and deliver measurable results.',
    overview: 'Supercharge your marketing velocity. We combine expert human art direction with state-of-the-art generative AI pipelines to produce hundreds of high-converting ad variations, hyper-realistic visuals, and synthetic video assets in a fraction of traditional production timelines.',
    fullOverviewParagraphs: [
      'In modern paid media, creative fatigue kills ROI fast. If you run the same two ad creatives for a month, your cost-per-acquisition skyrockets. We solve creative fatigue with AI-accelerated production.',
      'We combine Midjourney, Stable Diffusion, ComfyUI, Runway Gen-3, Kling, and custom LoRA models trained on your specific brand visual identity to generate infinite campaign variations without losing aesthetic quality.',
      'Every single AI asset is reviewed, retouched, and mastered by human senior designers to ensure zero uncanny valley artifacts and 100% brand safety.'
    ],
    heroVideo: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Generative Visual Production & LoRA Models',
        description: 'Training custom AI image models on your exact product to generate unlimited on-brand photoshoot visuals.',
        tags: ['Custom LoRA Training', 'ComfyUI Pipelines', 'Product Placement AI', 'Upscaling & Inpainting']
      },
      {
        title: 'AI Video & Motion Generation',
        description: 'Generating cinematic B-roll, fluid background transformations, and dynamic video ads using Runway and Kling.',
        tags: ['Runway Gen-3', 'Kling AI', 'Text-to-Video', 'Frame Interpolation']
      },
      {
        title: 'High-Velocity Social Ad Creative Testing',
        description: 'Producing dozens of visual hooks, copy angles, and thumbnail variations for Meta, TikTok, and YouTube Ads.',
        tags: ['Meta Ads Creative Suite', 'TikTok Hook Testing', 'Dynamic Creative Optimization', 'CTR Tuning']
      },
      {
        title: 'Human-in-the-Loop Post Finishing',
        description: 'Professional color balancing, typography typography, motion cleanup, and brand compliance review.',
        tags: ['Photoshop Retouching', 'After Effects Kinetic Titles', 'Brand Safety Guardrails', '4K Mastering']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Creative Angle Strategy & Prompt Blueprint', description: 'Analyzing audience pain points, formulating visual hypotheses, and building prompt engineering blueprints.', duration: 'Week 1' },
      { stepNumber: '02', title: 'Custom Model Training & Generation Sprints', description: 'Training LoRA weights on your product assets and generating initial visual candidate batches.', duration: 'Week 2' },
      { stepNumber: '03', title: 'Human Art Direction & Motion Finishing', description: 'Retouching artifacts, adding kinetic text, audio scoring, and preparing multi-aspect exports.', duration: 'Week 3' },
      { stepNumber: '04', title: 'Campaign Launch & Rapid Iteration', description: 'Deploying across Meta/TikTok ads, analyzing performance data, and spinning up winning variant batches.', duration: 'Ongoing' }
    ],
    deliverables: [
      'Suite of 20-50 High-Converting AI Ad Creatives',
      'Optimized 9:16 Vertical & 1:1 Square Video Cuts',
      'High-Resolution 4K Generative Hero Stills',
      'Ad Copy Variations & Headline Testing Matrix',
      'Trained Custom Brand LoRA Model Weights'
    ],
    quote: {
      text: 'Cre8tiveCove’s AI ad creative sprints slashed our cost per acquisition by 44% on Meta Ads while giving us 3x more creative assets each month.',
      author: 'MARCUS VANCE',
      role: 'GROWTH MARKETING LEAD',
      company: 'CYBERPULSE DIRECT'
    },
    relatedWorks: [
      {
        title: 'MIDLANDS TECH',
        slug: 'midlands-tech',
        client: 'Follow Your Inner Maverick',
        category: '3D WebGL & Motion Craft',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
      }
    ],
    nextService: {
      slug: 'event-coverage-content-production',
      title: 'Event Coverage & Content Production',
      number: '05',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 05. EVENT COVERAGE & CONTENT PRODUCTION
  'event-coverage-content-production': {
    id: 'srv-5',
    slug: 'event-coverage-content-production',
    title: 'Event Coverage & Content Production',
    titleSerifPart: 'Live Production',
    subtitle: 'CONFERENCES • PRODUCT LAUNCHES • RECAP FILMS • REAL-TIME REELS',
    categoryNumber: '05',
    tagline: 'From corporate conferences and product launches to award ceremonies, exhibitions, and brand activations, we create high-quality visual content that keeps your audience engaged before, during, and long after the event.',
    overview: 'Your flagship event is a goldmine of brand equity. We deploy multi-camera cinema crews, high-energy editors, and on-site post-production suites to capture every keynote, panel, and emotional crowd reaction with broadcast quality.',
    fullOverviewParagraphs: [
      'Don’t let your multi-million dollar annual conference vanish into a single generic slide deck. We turn live physical moments into an enduring content engine that fuels your marketing for the next 12 months.',
      'Our team handles full-scale live production: multi-camera 4K stage recordings, wireless roaming gimbal crews, backstage VIP interviews, high-energy same-day social media cuts, and cinematic final highlight recap films.',
      'With our on-site rapid editing pod, you can publish polished Reels and LinkedIn clips while the keynote speaker is still walking off the stage.'
    ],
    heroVideo: 'https://vjs.zencdn.net/v/oceans.mp4',
    heroImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Multi-Camera Stage & Keynote Capture',
        description: 'Broadcast-quality 4K recording of keynote speakers, panel discussions, and presentation slides.',
        tags: ['Multi-Cam 4K Stage Setup', 'Wireless Audio Sync', 'Clean Slide Capture', 'Live Video Switching']
      },
      {
        title: 'On-Site Real-Time Social Content',
        description: 'Dedicated on-site editor turning raw footage into polished social clips within hours of recording.',
        tags: ['Same-Day Reels / Shorts', 'Rapid Subtitle Generation', 'Event Hashtag Boost', 'Instagram / LinkedIn Formats']
      },
      {
        title: 'Cinematic Highlight Recap Films',
        description: 'High-octane aftermovies capturing the electric energy, attendees, VIPs, and memorable takeaways.',
        tags: ['Cinematic Aftermovie', 'Licensed Soundtracks', 'Color Grading', 'Sound Design Mastering']
      },
      {
        title: 'Attendee Interviews & Testimonials',
        description: 'Backstage pop-up studio capturing raw, authentic client testimonials and thought-leadership soundbites.',
        tags: ['Pop-Up Studio Rig', 'VIP Micro-Interviews', 'Customer Testimonials', 'Audio Sweetening']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Schedule Planning & Shot List', description: 'Reviewing event agenda, mapping keynote timings, VIP arrival schedules, and camera positions.', duration: 'Pre-Event' },
      { stepNumber: '02', title: 'On-Site Rigging & Multi-Cam Setup', description: 'Setting up stage cameras, wireless audio feeds, lighting rigs, and the on-site editing hub.', duration: 'Day 0' },
      { stepNumber: '03', title: 'Live Shoot & Same-Day Social Drops', description: 'Executing multi-camera filming while on-site editors pump out real-time social reels.', duration: 'Event Days' },
      { stepNumber: '04', title: 'Post-Production Master & Asset Bank', description: 'Delivering the full master keynote archive, final cinematic recap film, and categorized b-roll vault.', duration: 'Post-Event' }
    ],
    deliverables: [
      'Master Cinematic Event Recap Film (2-3 Minutes 4K)',
      'Full Keynote & Panel Recording Video Archive',
      'Batch of 10-15 Same-Day Social Clips (9:16 Reels/TikTok)',
      'VIP & Attendee Testimonial Soundbites',
      'High-Resolution Event Photography Gallery'
    ],
    quote: {
      text: 'Cre8tiveCove’s event video crew operated with complete invisible professionalism. Their same-day highlight reels drove record engagement across our global channels.',
      author: 'ELENA ROSTOVA',
      role: 'VP OF GLOBAL EVENTS',
      company: 'AETHERIA SUMMIT'
    },
    relatedWorks: [
      {
        title: 'THE PLAYERS CLUB',
        slug: 'the-players-club',
        client: 'SC Education Lottery',
        category: 'Commercial Direction',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
      }
    ],
    nextService: {
      slug: 'digital-content-campaign-strategy',
      title: 'Digital Content & Campaign Strategy',
      number: '06',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80'
    }
  },

  // 06. DIGITAL CONTENT & CAMPAIGN STRATEGY
  'digital-content-campaign-strategy': {
    id: 'srv-6',
    slug: 'digital-content-campaign-strategy',
    title: 'Digital Content & Campaign Strategy',
    titleSerifPart: 'Campaign Strategy',
    subtitle: 'OMNICHANNEL STRATEGY • SOCIAL VISUALS • INFOGRAPHICS • CONVERSION COPY',
    categoryNumber: '06',
    tagline: 'High-converting digital content, social media campaigns, visual storytelling, and infographics that amplify your brand’s voice across all digital channels.',
    overview: 'Consistent, unforgettable brand storytelling engineered to build real community and convert followers into customers. We develop full-funnel digital content strategies, visual social libraries, and viral editorial campaigns.',
    fullOverviewParagraphs: [
      'Posting random graphics and expecting organic reach is a recipe for frustration. We architect comprehensive omnichannel content systems with distinct content pillars, thumb-stopping visual templates, and razor-sharp copy.',
      'From LinkedIn executive ghostwriting and high-design infographic carousels to viral Twitter/X threads, interactive Instagram stories, and YouTube content production, we manage the complete content engine.',
      'We treat every post like a mini-campaign: testing headline hooks, measuring click-throughs, and iterating based on hard engagement data.'
    ],
    heroVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    heroImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Full-Funnel Campaign Architecture',
        description: 'Mapping awareness, consideration, and conversion content pillars across marketing channels.',
        tags: ['Audience Persona Mapping', 'Content Calendars', 'Campaign Themes', 'Conversion Copywriting']
      },
      {
        title: 'High-Design Social Visuals & Carousels',
        description: 'Typography-driven infographic carousels, data visualizations, and animated social assets.',
        tags: ['Figma Social Design Systems', 'LinkedIn PDF Carousels', 'Animated GIFs', 'Brand Asset Kit']
      },
      {
        title: 'Executive Ghostwriting & Thought Leadership',
        description: 'Crafting authoritative articles, newsletters, and thought-leadership posts for founders and executives.',
        tags: ['Founder Ghostwriting', 'Substack Newsletters', 'LinkedIn Articles', 'PR Press Releases']
      },
      {
        title: 'Analytics & Viral Hook Optimization',
        description: 'Tracking engagement rates, testing visual hooks, and scaling top-performing content formats.',
        tags: ['A/B Hook Testing', 'Engagement Analytics', 'Content ROI Audits', 'Monthly Performance Reports']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Content Audit & Competitor Teardown', description: 'Analyzing your past performance, identifying market whitespace, and defining core content pillars.', duration: 'Week 1' },
      { stepNumber: '02', title: 'Visual Framework & Template System', description: 'Designing bespoke social templates in Figma with custom typographic hierarchies and color tokens.', duration: 'Week 2' },
      { stepNumber: '03', title: 'Content Creation & Copywriting Sprint', description: 'Producing one month of high-converting social visuals, carousel guides, and compelling copy.', duration: 'Weeks 3-4' },
      { stepNumber: '04', title: 'Publishing, Analytics & Iteration', description: 'Scheduled publishing, real-time community engagement, and data-driven creative iteration.', duration: 'Ongoing' }
    ],
    deliverables: [
      'Comprehensive Omnichannel Content Strategy Playbook',
      'Monthly Batch of 20-30 Custom Designed Social Assets',
      'Custom Figma Social Media Design System & Templates',
      'High-Converting Ad Copy & Headline Swipe File',
      'Monthly Performance Analytics & Growth Report'
    ],
    quote: {
      text: 'Our LinkedIn impressions jumped 340% in two months after Cre8tiveCove took over our digital campaign strategy. The visual polish is unmatched.',
      author: 'SARAH JENKINS',
      role: 'VP OF BRAND MARKETING',
      company: 'SKYLA CREDIT UNION'
    },
    relatedWorks: [
      {
        title: 'SKYLA CREDIT UNION',
        slug: 'skyla-credit-union',
        client: 'Skyla Financial',
        category: 'Brand Strategy & Film',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
      }
    ],
    nextService: {
      slug: 'brand-identity',
      title: 'Brand Identity & Creative Strategy',
      number: '01',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80'
    }
  }
};

export function getServiceDetailBySlug(slug: string): ServiceDetailData | null {
  if (serviceDetailsMap[slug]) {
    return serviceDetailsMap[slug];
  }

  const normalized = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  if (serviceDetailsMap[normalized]) {
    return serviceDetailsMap[normalized];
  }

  // Check aliases or fuzzy matching
  for (const key of Object.keys(serviceDetailsMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return {
        ...serviceDetailsMap[key],
        slug,
        title: slug.replace(/-/g, ' ').toUpperCase(),
      };
    }
  }

  // Fallback generic template
  return {
    id: `srv-${slug}`,
    slug,
    title: slug.replace(/-/g, ' ').toUpperCase(),
    titleSerifPart: 'Craft',
    subtitle: 'BESPOKE CAPABILITY • CRAFTED WITH DISTINCTION',
    categoryNumber: '01',
    tagline: 'Tailored creative direction, strategic precision, and technical mastery.',
    overview: 'We provide specialized creative and technical execution designed to elevate your brand above the noise.',
    fullOverviewParagraphs: [
      'Every project we take on is approached with a relentless commitment to originality, deep strategic insight, and immaculate craftsmanship.',
      'We collaborate closely with ambitious founders and forward-thinking brands to build solutions that leave a lasting mark on their audience.'
    ],
    heroVideo: 'https://vjs.zencdn.net/v/oceans.mp4',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    capabilities: [
      {
        title: 'Strategic Consultation & Scoping',
        description: 'Deep diving into your brand objectives and architecting a clear, actionable roadmap.',
        tags: ['Strategy', 'Discovery', 'Analysis', 'Architecture']
      },
      {
        title: 'Creative Execution & Craft',
        description: 'Executing bespoke design, motion, and technical builds that push modern boundaries.',
        tags: ['Design', 'Engineering', 'Direction', 'Motion']
      }
    ],
    processSteps: [
      { stepNumber: '01', title: 'Discovery & Immersion', description: 'Understanding requirements, aligning goals, and establishing project benchmarks.', duration: 'Phase 1' },
      { stepNumber: '02', title: 'Concept & Production', description: 'Rapid creative iteration, rigorous development, and polished execution.', duration: 'Phase 2' },
      { stepNumber: '03', title: 'Review & Deployment', description: 'Refining every nuance and deploying across all target platforms with perfection.', duration: 'Phase 3' }
    ],
    deliverables: [
      'Comprehensive Master Assets & Source Packages',
      'Documentation & Implementation Guides',
      'High-Resolution Deliverables & Web Exports'
    ],
    quote: {
      text: 'Working with Cre8tiveCove was easily the most seamless and rewarding creative partnership our marketing team has ever experienced.',
      author: 'SARAH JENKINS',
      role: 'VP OF BRAND MARKETING',
      company: 'CRE8TIVECOVE PARTNER'
    },
    relatedWorks: [
      {
        title: 'THE PLAYERS CLUB',
        slug: 'the-players-club',
        client: 'SC Education Lottery',
        category: 'Commercial Direction',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
      }
    ],
    nextService: {
      slug: 'web-development',
      title: 'Web Development',
      number: '01',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
    }
  };
}
