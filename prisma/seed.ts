import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CRE8TIVECOVE database...');

  const adminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@cre8tivecove.com').toLowerCase().trim();
  let adminPassword = process.env.SEED_ADMIN_PASSWORD;
  let isGeneratedAdminPassword = false;

  if (!adminPassword || adminPassword.trim().length < 8) {
    adminPassword = crypto.randomBytes(12).toString('base64url');
    isGeneratedAdminPassword = true;
  }

  const editorEmail = (process.env.SEED_EDITOR_EMAIL || 'editor@cre8tivecove.com').toLowerCase().trim();
  let editorPassword = process.env.SEED_EDITOR_PASSWORD;
  let isGeneratedEditorPassword = false;

  if (!editorPassword || editorPassword.trim().length < 8) {
    editorPassword = crypto.randomBytes(12).toString('base64url');
    isGeneratedEditorPassword = true;
  }

  const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);
  const hashedEditorPassword = await bcrypt.hash(editorPassword, 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      password: hashedAdminPassword,
    },
    create: {
      name: 'Super Admin',
      email: adminEmail,
      password: hashedAdminPassword,
      role: 'SUPER_ADMIN',
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: editorEmail },
    update: {
      name: 'Content Editor',
      role: 'EDITOR',
      password: hashedEditorPassword,
    },
    create: {
      name: 'Content Editor',
      email: editorEmail,
      password: hashedEditorPassword,
      role: 'EDITOR',
    },
  });

  console.log('✅ Accounts seeded:');
  console.log(`   - Super Admin: ${adminEmail}`);
  if (isGeneratedAdminPassword) {
    console.log(`     ⚠️  Generated One-Time Password: ${adminPassword}`);
    console.log(`     👉  Please store this securely and update the password upon first login!`);
  }
  console.log(`   - Editor: ${editorEmail}`);
  if (isGeneratedEditorPassword) {
    console.log(`     ⚠️  Generated One-Time Password: ${editorPassword}`);
  }


  await prisma.siteSettings.deleteMany();
  await prisma.siteSettings.create({
    data: {
      siteName: 'CRE8TIVECOVE',
      tagline: 'Lean Mean Storytelling Machine • Weird Energy Since Y2K',
      description: 'Full-stack creative agency, digital design studio, and video production hub.',
      phone: '+91 9999-659-129',
      email: 'hello@cre8tivecove.com',
      address: 'Delhi, India',
      linkedin: 'https://www.linkedin.com/company/cre8tivecove/',
      instagram: 'https://www.instagram.com/cre8tivecove.cc/',
      youtube: 'https://www.youtube.com/@CRE8TIVECOVE',
      footerContent: '© 2026 CRE8TIVECOVE. All rights reserved. Weird Energy Since Y2K.',
      defaultCtaHeading: 'READY TO MAKE SOMETHING WEIRD?',
      defaultCtaText: "Let's build something people won't stop talking about.",
      defaultCtaUrl: '/contact',
      defaultSeoTitle: 'CRE8TIVECOVE — Creative & Digital Agency',
      defaultSeoDesc: 'We make people feel something. Strategy, Creative Direction, Digital Experiences, Brand Design.',
    },
  });
  console.log('✅ Site Settings seeded');


  await prisma.homePage.deleteMany();
  await prisma.homePage.create({
    data: {
      heroTitle: 'WE ARE CRE8TIVECOVE',
      heroSubtitle: 'Featured Work',
      heroVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      heroPosterUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      heroCtaText: 'EXPLORE WORK',
      heroCtaUrl: '/work',
      marqueeText: 'STRATEGY • CREATIVE DIRECTION • VISUAL IDENTITY • DIGITAL EXPERIENCES • BRANDING • VIDEO PRODUCTION',
      marqueeActive: true,
      ctaHeading: 'READY TO MAKE SOMETHING WEIRD?',
      ctaDescription: "Let's build something people won't stop talking about.",
      ctaButtonText: 'START A PROJECT',
      ctaButtonUrl: '/contact',
    },
  });

  await prisma.homeCollageItem.deleteMany();
  await prisma.btsImage.deleteMany();

  const btsEntries = Array.from({ length: 16 }, (_, i) => ({
    imageUrl: `/images/BTS/${i + 1}.jpg`,
    title: null,
    caption: null,
    order: i + 1,
    active: true,
  }));

  const collageEntries = Array.from({ length: 16 }, (_, i) => ({
    mediaUrl: `/images/BTS/${i + 1}.jpg`,
    alt: `BTS ${i + 1}`,
    title: null,
    subtitle: null,
    badge: `0${i + 1} BTS`,
    buttonText: 'View Photo',
    linkUrl: `/images/BTS/${i + 1}.jpg`,
    order: i + 1,
    active: true,
  }));

  await prisma.btsImage.createMany({ data: btsEntries });
  await prisma.homeCollageItem.createMany({ data: collageEntries });

  console.log('✅ Home Page seeded');


  await prisma.aboutPage.deleteMany();
  await prisma.aboutPage.create({
    data: {
      heroTitle: 'WE ARE CRE8TIVECOVE',
      heroContent: 'We are CRE8TIVECOVE — a fearless digital design, visual identity, and filmmaking collective built for brands that refuse to be boring.',
      backgroundUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      missionTitle: 'WE MAKE PEOPLE FEEL SOMETHING',
      missionBody: 'In a world flooded with AI-generated templates and cookie-cutter noise, we craft visceral, memorable visual stories that stick in human memory.',
      companyStory: 'Founded in 2020 by designers, directors, and creative coders. We combine high-end aesthetic craft with technical rigor.',
      historyBody: 'Over 5+ years of delivering award-winning campaigns, web platforms, and brand systems for high-growth tech startups and culture brands.',
      credentials: JSON.stringify(['Awwwards Site of the Day', 'FWA of the Month', 'Red Dot Design Award']),
      certifications: JSON.stringify(['Google Cloud Partner', 'Prisma Certified Enterprise Developer']),
      ctaHeading: 'WANT TO WORK WITH US?',
      ctaButtonText: 'GET IN TOUCH',
      ctaButtonUrl: '/contact',
    },
  });
  console.log('✅ About Page seeded');


  await prisma.service.deleteMany();
  const servicesData = [
    // 6 CREATIVE SERVICES
    {
      title: 'Brand Identity & Creative Strategy',
      slug: 'brand-identity',
      category: 'CREATIVE',
      tags: 'Master Logo Suite • Brand Guidelines Manual • Typography & Color Tokens',
      description: 'Comprehensive brand positioning, logo design systems, typography guidelines, visual asset packages, and brand voice definition for market leaders.',
      fullDescription: 'We build foundational brand identities that scale from mobile screens to physical billboards with effortless distinction.',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      order: 1,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: 'CGI & 3D Motion Design',
      slug: 'cgi-3d-motion-design',
      category: 'CREATIVE',
      tags: 'High-Resolution 3D Renders • 3D Motion Video Clips • Interactive 3D Assets',
      description: 'Cutting-edge 3D product visualizations, architectural fly-throughs, photorealistic visualizers, and high-octane motion graphics.',
      fullDescription: 'Break free from the constraints of physical camera shoots. We build photorealistic 3D product renders, procedural particle simulations, and cinematic architectural fly-throughs.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      order: 2,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: 'Video Production & Commercial Shoots',
      slug: 'video-production',
      category: 'CREATIVE',
      tags: 'Master Broadcast Film • Social Media Edits • Behind-The-Scenes Cut',
      description: 'Commercial TVCs, brand films, product launches, corporate AVs, and drone cinematography shot with cinema-grade rigs and post-produced to perfection.',
      fullDescription: 'Motion is the ultimate medium for emotional resonance. We produce broadcast-ready commercial spots, cinematic brand anthems, and high-octane visual storytelling.',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      order: 3,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: 'AI Ads & Creatives',
      slug: 'ai-ads-creatives',
      category: 'CREATIVE',
      tags: 'Generative Visuals • Hyper-Targeted Ad Creatives • AI Video Production • Rapid Iteration',
      description: 'From concept to campaign, we blend human creativity with cutting-edge AI to create high-performing ads, visuals, videos, and branded content that capture attention, spark engagement, and deliver measurable results.',
      fullDescription: 'Supercharge your marketing velocity with AI-accelerated creative production. We generate hundreds of high-converting ad variations, hyper-realistic visuals, and synthetic video assets with senior art direction.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      order: 4,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: 'Event Coverage & Content Production',
      slug: 'event-coverage-content-production',
      category: 'CREATIVE',
      tags: 'Keynote & Panel Filming • Same-Day Social Reels • Highlight Films • Multi-Cam Live Feeds',
      description: 'From corporate conferences and product launches to award ceremonies, exhibitions, and brand activations, we create high-quality visual content that keeps your audience engaged before, during, and long after the event.',
      fullDescription: 'Deploy multi-camera cinema crews, high-energy editors, and on-site post-production suites to capture every keynote, panel, and emotional crowd reaction with broadcast quality.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://www.youtube.com/watch?v=hu-mu6556so',
      order: 5,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: 'Digital Content & Campaign Strategy',
      slug: 'digital-content-campaign-strategy',
      category: 'CREATIVE',
      tags: 'Omnichannel Campaign Strategy • Social Media Visuals • Infographics & Carousels • High-Converting Ad Copy',
      description: 'High-converting digital content, social media campaigns, visual storytelling, and infographics that amplify your brand’s voice across all digital channels.',
      fullDescription: 'Consistent, unforgettable brand storytelling engineered to build real community and convert followers into customers. We develop full-funnel digital content strategies and visual social libraries.',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      order: 6,
      active: true,
      status: 'PUBLISHED',
    },

    // 11 TECHNOLOGY SERVICES
    {
      title: 'Web Development',
      slug: 'web-development',
      category: 'TECHNOLOGY',
      tags: 'Next.js 14/15 • Full-Stack React • Headless CMS • Sub-Second Speeds',
      description: 'Next.js web apps and digital flagships built for speed, SEO dominance, and people with zero patience for slow load times.',
      fullDescription: 'Most websites are bloated digital brochures that look pretty and convert nothing. We build high-performance Next.js web applications that merge ruthless aesthetic craft with sub-second page loads, conversion-obsessed UX, and zero technical debt.',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      order: 1,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: 'Mobile App Development',
      slug: 'mobile-app-development',
      category: 'TECHNOLOGY',
      tags: 'iOS & Android • React Native / Flutter • Offline-First Sync • App Store Launch',
      description: 'iOS & Android apps that feel like butter in the hand. Built with React Native & Flutter, zero bloat, and rock-solid offline sync.',
      fullDescription: 'Building an app that gets downloaded is easy. Building an app people keep on their home screen and use every single day is hard. We build fluid, tactile mobile applications with React Native and Flutter that feel native, run at 60fps, and never crash.',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://www.youtube.com/watch?v=hu-mu6556so',
      order: 2,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: 'AI Solutions',
      slug: 'ai-solutions',
      category: 'TECHNOLOGY',
      tags: 'Enterprise RAG • Private LLMs • Semantic Search • Zero Hallucinations',
      description: 'Skip the generic wrapper gimmicks. We build custom RAG pipelines and private AI engines trained on your company’s proprietary data.',
      fullDescription: 'Artificial intelligence shouldn’t be an expensive gimmick or a bullet point in a pitch deck. We build enterprise-grade AI applications and semantic search pipelines that turn messy company documents, SQL databases, and internal knowledge into instant, accurate answers.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      order: 3,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: 'AI Agents',
      slug: 'ai-agents',
      category: 'TECHNOLOGY',
      tags: 'Sales SDR Agents • 24/7 Support Bots • CRM Automation • Function Calling',
      description: 'Autonomous digital teammates that qualify incoming leads, answer customer questions at 3 AM, and update your CRM on autopilot.',
      fullDescription: 'Chatbots answer questions; AI agents get work done. We architect autonomous agents equipped with custom tool-calling capabilities that interact directly with your software tools, schedule meetings, query internal APIs, and execute complex business workflows without human bottlenecks.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      order: 4,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: 'WhatsApp Solutions',
      slug: 'whatsapp-solutions',
      category: 'TECHNOLOGY',
      tags: 'Meta Cloud API • Green Tick Verification • Cart Recovery • CRM Sync',
      description: 'Turn WhatsApp into your highest-converting sales channel. Official Meta Cloud APIs, automated cart recovery, and instant AI chat.',
      fullDescription: 'With a 98% open rate, WhatsApp is the most direct communication channel on Earth. We build certified Meta Cloud API solutions that automate customer onboarding, recover abandoned carts, dispatch transactional receipts, and run 24/7 AI conversational sales assistants.',
      image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      order: 5,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: 'Automation',
      slug: 'automation',
      category: 'TECHNOLOGY',
      tags: 'Self-Hosted n8n • Invoice & PDF OCR • Zero Per-Task Fees • Zapier Replacement',
      description: 'Stop paying humans to copy-paste between spreadsheets. We automate complex workflows with self-hosted n8n and AI document parsing.',
      fullDescription: 'Manual data entry and repetitive busywork are silent killers of business momentum. We build robust, self-hosted n8n automation clusters that connect your CRMs, billing systems, spreadsheets, and inboxes into an uninterrupted operational machine with zero per-task fees.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://www.youtube.com/watch?v=hu-mu6556so',
      order: 6,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: 'Software & SaaS Development',
      slug: 'software-saas-development',
      category: 'TECHNOLOGY',
      tags: 'Multi-Tenant SaaS • Custom ERP / CRM • Stripe Billing • PostgreSQL Scale',
      description: 'Custom SaaS platforms, internal ERPs, and booking engines built from scratch to handle real scale without crashing on launch day.',
      fullDescription: 'Off-the-shelf software forces your business to adapt to someone else’s constraints. We engineer bespoke internal software, multi-tenant SaaS platforms, and enterprise dashboards built on modern TypeScript, PostgreSQL, and scalable cloud architectures.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      order: 7,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: 'API & Integrations',
      slug: 'api-integrations',
      category: 'TECHNOLOGY',
      tags: 'Stripe / Razorpay • Custom Webhooks • REST & GraphQL • Fail-Safe Queues',
      description: 'We connect your payment gateways, CRMs, logistics, and legacy databases into one synchronized, fail-safe system.',
      fullDescription: 'Data silos kill execution speed. We connect your frontend applications, databases, and third-party SaaS tools through high-throughput REST, GraphQL, and webhook pipelines equipped with automated retries, cryptographic signatures, and zero latency.',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      order: 8,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: 'Digital Experience & Virtual Tours',
      slug: 'digital-experience-virtual-tours',
      category: 'TECHNOLOGY',
      tags: '3D WebGL Configurator • Virtual Showrooms • Interactive Hotspots • Browser-Based VR',
      description: 'Interactive 3D web spaces and digital showrooms your customers can explore right in their browser without downloading an app.',
      fullDescription: 'Flat 2D pages only tell half the story. We build photorealistic 3D virtual showrooms, spatial product customizers, and interactive digital walkthroughs that run directly in any web browser at silky 60fps.',
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      order: 9,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: '360° Panorama & Virtual Tours',
      slug: '360-panorama-virtual-tours',
      category: 'TECHNOLOGY',
      tags: '8K HDR Photography • Google Street View • Real Estate Tours • Resort Showcases',
      description: 'Crystal-clear 8K HDR virtual walkthroughs for luxury real estate, resorts, and Google Maps that turn lookers into bookers.',
      fullDescription: 'Bring your physical space to life in stunning 8K resolution. We capture HDR panoramic imagery and build branded interactive walkthroughs with floor plans, audio narration, and Google Street View publishing that give prospective buyers an unmistakable sense of presence.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://www.youtube.com/watch?v=hu-mu6556so',
      order: 10,
      active: true,
      status: 'PUBLISHED',
    },
    {
      title: 'Maintenance & Support',
      slug: 'maintenance-support',
      category: 'TECHNOLOGY',
      tags: '24/7 Health Monitoring • Security Patches • Guaranteed SLA • Speed Tuning',
      description: 'Sleep easy knowing senior engineers are monitoring your servers 24/7, patching security flaws, and fixing bugs before users notice.',
      fullDescription: 'Software isn’t a one-and-done project—it’s living infrastructure. We provide dedicated engineering retainers with 24/7 automated monitoring, proactive security patching, speed optimization, and guaranteed SLA response times to keep your revenue flowing uninterrupted.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      hoverVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      order: 11,
      active: true,
      status: 'PUBLISHED',
    },
  ];

  for (const s of servicesData) {
    await prisma.service.create({ data: s });
  }
  console.log('✅ Services seeded with all 11 Technology Services + Creative Services');


  await prisma.processStep.deleteMany();
  await prisma.processStep.createMany({
    data: [
      { stepNumber: '01', title: 'DISCOVERY & STRATEGY', description: 'We dive deep into your brand DNA, audience psychology, and competitive landscape.', media: '/images/stock/stock-bts.jpg', order: 1, active: true },
      { stepNumber: '02', title: 'CONCEPT & PROTOTYPING', description: 'Rapid creative exploration, moodboards, and interactive prototypes.', media: '/images/stock/stock-work.jpg', order: 2, active: true },
      { stepNumber: '03', title: 'PRODUCTION & CRAFT', description: 'Pixel-perfect UI design, motion graphics, sound design, and clean full-stack code.', media: '/images/stock/stock-hero.jpg', order: 3, active: true },
      { stepNumber: '04', title: 'LAUNCH & AMPLIFICATION', description: 'Seamless deployment, performance tuning, analytics, and ongoing support.', media: '/images/stock/stock-service.jpg', order: 4, active: true },
    ],
  });
  console.log('✅ Process Steps seeded');


  await prisma.pricingTier.deleteMany();
  await prisma.pricingTier.createMany({
    data: [
      {
        name: 'Brand Identity Suite',
        slug: 'brand-identity-suite',
        description: 'Complete brand positioning and visual design system for ambitious startups.',
        priceLabel: '$4,500',
        billingPeriod: 'project',
        features: JSON.stringify(['Brand Strategy & Positioning', 'Logo & Iconography System', 'Color Palette & Typography', 'Brand Guidelines (PDF & Web)', '2 Weeks Delivery']),
        ctaText: 'SELECT PLAN',
        ctaUrl: '/contact',
        featured: false,
        active: true,
        order: 1,
      },
      {
        name: 'Full Digital Experience',
        slug: 'full-digital-experience',
        description: 'Custom Next.js website with GSAP animations and integrated CMS.',
        priceLabel: '$9,500',
        billingPeriod: 'project',
        features: JSON.stringify(['Custom Next.js & Tailwind Architecture', 'Custom CMS & Admin Panel', 'GSAP & Micro-Animations', 'SEO & Performance Optimization', 'Full Content Migration', '4 Weeks Delivery']),
        ctaText: 'START BUILD',
        ctaUrl: '/contact',
        featured: true,
        active: true,
        order: 2,
      },
      {
        name: 'Creative Retainer',
        slug: 'creative-retainer',
        description: 'Dedicated monthly creative direction, motion design, and web updates.',
        priceLabel: '$6,000',
        billingPeriod: 'month',
        features: JSON.stringify(['Dedicated Creative Director & Lead Dev', 'Unlimited Small Requests', '48h SLA Turnaround', 'Monthly Analytics & Audits', 'Cancel Anytime']),
        ctaText: 'BOOK RETAINER',
        ctaUrl: '/contact',
        featured: false,
        active: true,
        order: 3,
      },
    ],
  });
  console.log('✅ Pricing Tiers seeded');


  await prisma.faq.deleteMany();
  await prisma.faq.createMany({
    data: [
      { question: 'What is your typical project timeline?', answer: 'Most website and branding builds take between 3 to 6 weeks from initial kickoff to final launch.', category: 'General', order: 1, active: true },
      { question: 'Do you offer custom CMS management?', answer: 'Yes! Every project includes a custom admin panel tailored specifically to your content structure.', category: 'Services', order: 2, active: true },
      { question: 'How do you handle revisions?', answer: 'We work in collaborative sprints with clear feedback milestones built into each phase.', category: 'Process', order: 3, active: true },
    ],
  });
  console.log('✅ FAQs seeded');


  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'SARAH JENKINS',
        designation: 'VP OF BRAND MARKETING',
        company: 'SKYLA CREDIT UNION',
        quote: 'Working with Cre8tiveCove was easily the most seamless and rewarding creative partnership our marketing team has ever experienced. They took a complex message and turned it into an award-winning campaign that crushed our conversion metrics.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        logo: '/images/clients/axis-max-life-insurance-logo.png',
        featured: true,
        active: true,
        order: 1,
      },
      {
        name: 'MARCUS VANCE',
        designation: 'HEAD OF CREATIVE STRATEGY',
        company: 'CYBERPULSE INC.',
        quote: 'Cre8tiveCove transformed our product vision into a jaw-dropping digital experience. Their attention to motion craft, 3D webgl visual identity, and speed of delivery set a new benchmark for creative agencies.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        logo: '/images/clients/sbi-logo.webp',
        featured: true,
        active: true,
        order: 2,
      },
    ],
  });
  console.log('✅ Testimonials seeded');


  await prisma.client.deleteMany();
  await prisma.client.createMany({
    data: [
      { name: 'Indian Railways', slug: 'indian-railways', logo: '/images/clients/indian-railways-logo.png', website: 'https://indianrailways.gov.in', description: 'Ministry of Railways, Government of India', featured: true, order: 1, active: true },
      { name: 'Hindustan Petroleum', slug: 'hindustan-petroleum', logo: '/images/clients/hp-hindustan-petroleum-logo.png', website: 'https://hindustanpetroleum.com', description: 'Hindustan Petroleum Corporation Limited (HPCL)', featured: true, order: 2, active: true },
      { name: 'Axis Max Life Insurance', slug: 'axis-max-life-insurance', logo: '/images/clients/axis-max-life-insurance-logo.png', website: 'https://maxlifeinsurance.com', description: 'Axis Max Life Insurance Company', featured: true, order: 3, active: true },
      { name: 'State Bank of India', slug: 'sbi', logo: '/images/clients/sbi-logo.webp', website: 'https://sbi.co.in', description: 'State Bank of India', featured: true, order: 4, active: true },
      { name: 'Bharat Petroleum', slug: 'bharat-petroleum', logo: '/images/clients/bharat-petroleum-logo.png', website: 'https://bharatpetroleum.in', description: 'Bharat Petroleum Corporation Limited (BPCL)', featured: true, order: 5, active: true },
      { name: 'Bharat Gas', slug: 'bharat-gas', logo: '/images/clients/bharat-gas-logo.webp', website: 'https://my.ebharatgas.com', description: 'Bharat Petroleum Corporation Limited (BPCL)', featured: true, order: 6, active: true },
      { name: 'WARIVO Motors', slug: 'warivo-motors', logo: '/images/clients/warivo-motors-logo.png', website: 'https://warivomotor.com', description: 'WARIVO Electric Vehicles', featured: true, order: 7, active: true },
      { name: 'Barco', slug: 'barco', logo: '/images/clients/barco-logo.png', website: 'https://barco.com', description: 'Barco Visual Solutions', featured: true, order: 8, active: true },
      { name: 'Bajaj Allianz', slug: 'bajaj-allianz', logo: '/images/clients/bajaj-allianz-logo.png', website: 'https://bajajallianz.com', description: 'Bajaj Financial & Insurance', featured: true, order: 9, active: true },
      { name: 'NeuroEquilibrium', slug: 'neuro-equilibrium', logo: '/images/clients/neuro-equilibrium-logo.png', website: 'https://neuroequilibrium.in', description: 'NeuroEquilibrium Diagnostic Systems', featured: true, order: 10, active: true },
    ],
  });
  console.log('✅ Clients seeded with client brand logos and portfolio brands');


  const workProjects = [
    {
      title: 'TVC- SBI Foreign Card',
      slug: 'tvc-sbi-foreign-card',
      client: 'State Bank of India (SBI)',
      category: 'Commercial & Film',
      year: '2025',
      description: 'High-impact television commercial campaign showcasing the SBI Foreign Travel Card for international students and global travelers.',
      fullDescription: 'Directed and produced with cinematic scope, this commercial spot for State Bank of India captures the vibrant journey of Indian students venturing abroad, highlighting ease, security, and financial freedom with SBI Foreign Travel Cards.',
      heroMedia: '/uploads/media_1789716925770_1926afe5529db945.webp',
      thumbnailUrl: '/uploads/media_1789716925770_1926afe5529db945.webp',
      heroVideoUrl: '/uploads/media_1789641018034_c785dac94a320847.mp4',
      projectVideoUrl: '/uploads/media_1789641018034_c785dac94a320847.mp4',
      services: 'Commercial Direction, Cinematography, Color Grading, Post-Production',
      strategy: 'Relatable, aspirational visual storytelling connecting with youth and parents preparing for global education.',
      artDirection: 'Filmic anamorphic look, vibrant global locations, kinetic transitions.',
      deliverables: 'Broadcast TV Commercial, Digital Cutdowns (15s/30s), Social Media Reels',
      credits: 'Creative Direction & Production: Cre8tiveCove Team',
      featured: true,
      status: 'PUBLISHED',
      order: 1,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: 'WARIVO New EV Scooter',
      slug: 'warivo-new-ev-scooter',
      client: 'WARIVO Motors',
      category: 'Automotive & Product Launch',
      year: '2025',
      description: 'High-energy launch film and dynamic visual storytelling introducing WARIVO’s next-generation electric scooter line-up.',
      fullDescription: 'A visually electrifying launch film combining dynamic tracking shots, precision lighting, and futuristic sound design to unveil the performance, styling, and smart tech of the all-new WARIVO EV scooter.',
      heroMedia: '/uploads/media_1790317167178_9f8fd034136f906b.webp',
      thumbnailUrl: '/uploads/media_1790317167178_9f8fd034136f906b.webp',
      heroVideoUrl: 'https://www.youtube.com/watch?v=hu-mu6556so',
      projectVideoUrl: 'https://www.youtube.com/watch?v=hu-mu6556so',
      services: 'Product Launch Direction, Automotive Cinematography, CGI & VFX',
      strategy: 'Position WARIVO as the premier blend of cutting-edge tech, sustainable power, and urban freedom.',
      artDirection: 'Moody high-contrast lighting, neon accents, high-speed camera tracking.',
      deliverables: 'Hero Launch Anthem, Feature Showcase Clips, Social Teasers',
      credits: 'Creative Direction & Production: Cre8tiveCove Team',
      featured: true,
      status: 'PUBLISHED',
      order: 2,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: 'Digital Ad - ECODET',
      slug: 'digital-ad-ecodet',
      client: 'ECODET',
      category: 'Digital Advertising & Motion',
      year: '2025',
      description: 'Targeted digital advertising campaign with sleek visual craft highlighting modern eco-friendly cleaning formulas.',
      fullDescription: 'Engineered for high social-feed conversion, the ECODET digital campaign combined crisp macro product visuals, playful fluid animations, and crisp messaging to showcase powerful eco-friendly cleaning.',
      heroMedia: '/uploads/media_1789712476931_2390ae4a260c6b9f.png',
      thumbnailUrl: '/uploads/media_1789712476931_2390ae4a260c6b9f.png',
      heroVideoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      projectVideoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      services: 'Digital Ad Direction, Motion Design, Product Styling',
      strategy: 'Fast-hook visual storytelling tailored for Meta, YouTube, and digital performance ad channels.',
      artDirection: 'Clean organic minimalism, fresh emerald and white palettes, snappy typography.',
      deliverables: 'Vertical & Horizontal Ad Variations, Social Carousels',
      credits: 'Creative Direction & Design: Cre8tiveCove Team',
      featured: true,
      status: 'PUBLISHED',
      order: 3,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: 'Drone Flythrough',
      slug: 'drone-flythrough',
      client: 'Real Estate & Architecture Studio',
      category: 'Aerial Cinematography & FPV',
      year: '2024',
      description: 'Seamless single-take FPV drone cinematography and architectural showcase delivering an immersive flythrough experience.',
      fullDescription: 'Navigating narrow corridors, soaring over sweeping landscapes, and gliding into luxury interiors, this continuous FPV drone flythrough offers an exhilarating, visceral perspective on high-end architectural space.',
      heroMedia: '/uploads/media_1789645040441_8156aa071d1b958d.jpg',
      thumbnailUrl: '/uploads/media_1789645040441_8156aa071d1b958d.jpg',
      heroVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      projectVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      services: 'FPV Drone Piloting, 4K Cinema Drone Capture, Sound Design',
      strategy: 'Create an uninterrupted visual journey that elevates real estate marketing into an emotional spatial experience.',
      artDirection: 'Smooth continuous motion, natural golden hour exposure, spatial audio mix.',
      deliverables: 'Master 4K Flythrough Film, 60s Social Cuts, High-Res Stills',
      credits: 'Cinematography: Cre8tiveCove Aerial Team',
      featured: true,
      status: 'PUBLISHED',
      order: 4,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: 'Neuro Equilibrium Vertigo Clinic',
      slug: 'neuro-equilibrium-vertigo-clinic',
      client: 'NeuroEquilibrium Diagnostic Systems',
      category: 'Healthcare & Medical Film',
      year: '2024',
      description: 'Empathetic medical storytelling and clinic walkthrough demonstrating cutting-edge vertigo diagnosis technology.',
      fullDescription: 'Balancing clinical precision with human empathy, this film demystifies vertigo and vestibular disorders, illustrating NeuroEquilibrium’s advanced diagnostic technology and patient recovery journeys.',
      heroMedia: '/uploads/media_1790317263343_1a8f8ea6fd90b213.webp',
      thumbnailUrl: '/uploads/media_1790317263343_1a8f8ea6fd90b213.webp',
      heroVideoUrl: 'https://www.youtube.com/watch?v=hu-mu6556so',
      projectVideoUrl: 'https://www.youtube.com/watch?v=hu-mu6556so',
      services: 'Medical Storytelling, Clinic Walkthrough, Motion Graphics',
      strategy: 'Build deep patient trust and clinical credibility through calm, informative visual pacing.',
      artDirection: 'Bright medical modernism, warm patient interactions, clear infographics.',
      deliverables: 'Clinic Profile Film, Explainer Modules, Patient Testimonial Series',
      credits: 'Production: Cre8tiveCove Medical Visuals',
      featured: true,
      status: 'PUBLISHED',
      order: 5,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: 'Barco at GITEX GLOBAL 2025 Dubai',
      slug: 'barco-at-gitex-global-2025-dubai',
      client: 'Barco Visual Solutions',
      category: 'Event Technology & 3D Interactive',
      year: '2025',
      description: 'Immersive booth visual systems and interactive digital presentation designed for Barco at GITEX GLOBAL in Dubai.',
      fullDescription: 'Created for the world’s premier technology exhibition at Dubai World Trade Centre, we designed larger-than-life visual systems and real-time interactive product displays that turned Barco’s booth into an undeniable crowd magnet.',
      heroMedia: '/uploads/media_1789640757160_d4e2ed81fbdc0699.png',
      thumbnailUrl: '/uploads/media_1789640757160_d4e2ed81fbdc0699.png',
      heroVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      projectVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      services: 'Event Technology, 3D Motion Graphics, Interactive Screen Design',
      strategy: 'Command attention across the crowded GITEX exhibition floor with monumental, synchronized visual choreography.',
      artDirection: 'High-contrast futuristic neon, giant LED wall pixel-mapping, immersive audio loops.',
      deliverables: 'Multi-Screen Video Canvas, Interactive Touch Kiosk UI, Event Highlight Film',
      credits: 'Interactive Visuals & Event Direction: Cre8tiveCove',
      featured: true,
      status: 'PUBLISHED',
      order: 6,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: 'Bajaj Insurance',
      slug: 'bajaj-insurance',
      client: 'Bajaj Allianz',
      category: 'Finance & Brand Campaign',
      year: '2025',
      description: 'Digital film and visual asset campaign focusing on trust, protection, and life milestones.',
      fullDescription: 'An emotionally resonant digital campaign exploring key life transitions and highlighting peace of mind with comprehensive financial security from Bajaj Insurance.',
      heroMedia: '/uploads/media_1790317334958_9020ba24327380de.webp',
      thumbnailUrl: '/uploads/media_1790317334958_9020ba24327380de.webp',
      heroVideoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      projectVideoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      services: 'Brand Storytelling, Film Production, Digital Campaign Assets',
      strategy: 'Humanize insurance offerings through relatable real-life moments.',
      artDirection: 'Warm cinematic tones, natural lighting, elegant typography.',
      deliverables: 'Digital Campaign Films, Social Media Content Suite, Performance Creatives',
      credits: 'Creative Direction: Cre8tiveCove',
      featured: true,
      status: 'PUBLISHED',
      order: 7,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: 'Bharat Gas',
      slug: 'bharat-gas',
      client: 'Bharat Petroleum (BPCL)',
      category: 'Brand Campaign & Motion Craft',
      year: '2024',
      description: 'Nationwide brand awareness film and motion campaign communicating household energy reliability and safety.',
      fullDescription: 'Blending warm live-action scenes of family warmth with crystal-clear 3D motion graphics explaining safety standards and quick-delivery app integrations.',
      heroMedia: '/uploads/media_1789716642256_dbd919690b02362a.webp',
      thumbnailUrl: '/uploads/media_1789716642256_dbd919690b02362a.webp',
      heroVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      projectVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      services: 'Brand Campaign, 3D Motion Graphics, Scriptwriting & Voiceover',
      strategy: 'Reinforce national household trust while modernizing the brand’s digital service narrative.',
      artDirection: 'Rich warm colors, approachable character moments, 3D safety visualizers.',
      deliverables: 'Multi-Language TV & Digital Commercials, Safety Infographics, Print & OOH',
      credits: 'Creative Direction & Animation: Cre8tiveCove',
      featured: true,
      status: 'PUBLISHED',
      order: 8,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: 'SBI YONO Logo Launch',
      slug: 'sbi-yono-logo-launch',
      client: 'SBI YONO',
      category: 'Brand Identity & Motion Graphics',
      year: '2024',
      description: 'Dynamic logo reveal and identity animation celebrating the evolution of India’s flagship mobile banking platform.',
      fullDescription: 'A celebration of speed, accessibility, and modern financial life. We crafted a sleek, particle-driven 3D motion identity reveal for SBI YONO’s updated visual branding.',
      heroMedia: '/uploads/media_1789645370035_7d71477fba6f51e1.png',
      thumbnailUrl: '/uploads/media_1789645370035_7d71477fba6f51e1.png',
      heroVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      projectVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      services: '3D Motion Identity, Logo Reveal Animation, Sonic Branding',
      strategy: 'Position YONO as a modern, world-class financial ecosystem for millions of daily active users.',
      artDirection: 'Sleek dark mode environment with radiant blue and magenta light streaks.',
      deliverables: 'Broadcast Logo Reveal, App Splash Screen Animation, Social Launch Assets',
      credits: 'Identity Motion Design: Cre8tiveCove',
      featured: true,
      status: 'PUBLISHED',
      order: 9,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: 'Xtended Space Through',
      slug: 'xtended-space-through',
      client: 'Xtended Space',
      category: 'Virtual Tour & 360 Experience',
      year: '2024',
      description: 'Interactive 360-degree virtual space tour enabling customers to explore storage and flexible warehousing environments.',
      fullDescription: 'Providing total transparency and customer confidence, this interactive 360-degree virtual walkthrough allows users to navigate warehousing and storage units from their phone or laptop with precise measurements and interactive hotspots.',
      heroMedia: '/uploads/media_1789645284182_7ee3f75c6acdfd77.png',
      thumbnailUrl: '/uploads/media_1789645284182_7ee3f75c6acdfd77.png',
      heroVideoUrl: 'https://www.youtube.com/watch?v=hu-mu6556so',
      projectVideoUrl: 'https://www.youtube.com/watch?v=hu-mu6556so',
      services: '360 Panorama Photography, Interactive Web Walkthrough, Virtual Tour Engine',
      strategy: 'Eliminate customer hesitation by letting them inspect storage units virtually before booking.',
      artDirection: 'High-clarity panoramic stitch, clean UI overlay, interactive hotspot markers.',
      deliverables: 'Web-Embedded 360 Virtual Tour, Mobile-Optimized Viewer, Google Street View Sync',
      credits: 'Virtual Tour Engineering: Cre8tiveCove',
      featured: false,
      status: 'PUBLISHED',
      order: 10,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: 'GST',
      slug: 'gst',
      client: 'Ministry of Finance',
      category: 'Motion Design & Explainer',
      year: '2024',
      description: 'Educational motion graphics and visual campaign simplifying GST compliance and tax filing workflows.',
      fullDescription: 'Translating complex tax regulations into friendly, digestible, and visually engaging kinetic typography and character animation to help small business owners navigate GST filing smoothly.',
      heroMedia: '/uploads/media_1789645418345_61ded377282767a6.png',
      thumbnailUrl: '/uploads/media_1789645418345_61ded377282767a6.png',
      heroVideoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      projectVideoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      services: 'Motion Graphics, Explainer Scripting, Kinetic Typography',
      strategy: 'Demystify procedural tax steps with welcoming colors, clear pacing, and straightforward visual guides.',
      artDirection: 'Modern flat 2D vector animation with vibrant palette and crisp kinetic text.',
      deliverables: 'Explainer Video Series, Social Media Infographics, Step-by-Step Portal Walkthroughs',
      credits: 'Motion Design & Script: Cre8tiveCove',
      featured: false,
      status: 'PUBLISHED',
      order: 11,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: 'THE PLAYERS CLUB',
      slug: 'the-players-club',
      client: 'SC Education Lottery',
      category: 'Commercial Direction',
      year: '2025',
      description: 'High-stakes broadcast commercial direction and cinematic storytelling for SC Education Lottery.',
      fullDescription: 'The Players Club campaign delivered record-breaking engagement through high-energy broadcast direction, stylized set design, and cutting-edge visual effects.',
      heroMedia: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      heroVideoUrl: 'https://www.youtube.com/watch?v=hu-mu6556so',
      thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      projectVideoUrl: 'https://www.youtube.com/watch?v=hu-mu6556so',
      services: 'Commercial Direction, Cinematography, Color Grading',
      strategy: 'High-octane entertainment aesthetic designed to drive lottery signups.',
      artDirection: 'Stylized golden hour lighting, rapid kinetic camera moves.',
      deliverables: 'Broadcast TV Commercials, Social Spots, OOH Assets',
      credits: 'Creative Director: Rohit Pal • Director of Photography: Alex Mercer',
      featured: true,
      status: 'PUBLISHED',
      order: 12,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: 'SKYLA CREDIT UNION',
      slug: 'skyla-credit-union',
      client: 'Skyla Financial',
      category: 'Brand Strategy & Film',
      year: '2025',
      description: 'Complete brand strategy, anthem video production, and visual identity refresh for Skyla Credit Union.',
      fullDescription: 'Rebranding Skyla required a human-centered creative direction, combining candid lifestyle cinematography with modern typography and motion assets.',
      heroMedia: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80',
      heroVideoUrl: 'https://www.youtube.com/watch?v=hu-mu6556so',
      thumbnailUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80',
      projectVideoUrl: 'https://www.youtube.com/watch?v=hu-mu6556so',
      services: 'Brand Strategy, Film Production, Graphic Design',
      strategy: 'Authentic financial storytelling focusing on real community members.',
      artDirection: 'Warm filmic tones, clean serif typography, candid portraiture.',
      deliverables: 'Brand Anthem Film, Rebrand Playbook, Digital Ad Suite',
      credits: 'Creative Lead: Rohit Pal',
      featured: true,
      status: 'PUBLISHED',
      order: 13,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: 'CONVERSATIONS',
      slug: 'conversations',
      client: 'DAODAS',
      category: 'Public Awareness Campaign',
      year: '2024',
      description: 'Impactful public health campaign featuring multi-channel video spots and digital story arcs.',
      fullDescription: 'Conversations was engineered to drive meaningful dialogue across state channels using documentary-style filmmaking and emotional resonance.',
      heroMedia: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
      heroVideoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
      projectVideoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      services: 'Campaign Strategy, Video Production, Social Assets',
      strategy: 'Raw, honest personal stories to dismantle public stigma.',
      artDirection: 'High-contrast monochrome lighting, intimate close-ups.',
      deliverables: 'Documentary Short Film, Interactive Web Hub',
      credits: 'Director: Rohit Pal',
      featured: true,
      status: 'PUBLISHED',
      order: 14,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: 'MIDLANDS TECH',
      slug: 'midlands-tech',
      client: 'Follow Your Inner Maverick',
      category: '3D WebGL & Motion Craft',
      year: '2024',
      description: 'Interactive 3D campus web platform and kinetic campaign spot for Midlands Technical College.',
      fullDescription: 'Empowering students to follow their inner maverick with immersive 3D WebGL web experiences, dynamic motion graphics, and bold visual branding.',
      heroMedia: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
      heroVideoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
      projectVideoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      services: '3D Animation, WebGL Development, Motion Graphics',
      strategy: 'High-energy futuristic design to inspire prospective students.',
      artDirection: 'Neon blue and gold glow effects, kinetic typography.',
      deliverables: 'Interactive 3D Web Experience, Recruitment Video',
      credits: 'WebGL Developer & Director: Rohit Pal',
      featured: true,
      status: 'PUBLISHED',
      order: 15,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
    {
      title: "WORK DOESN'T WORK",
      slug: 'work-doesnt-work',
      client: 'SC DHEC',
      category: 'Cinematography & VFX',
      year: '2023',
      description: 'High-concept anti-vaping commercial featuring surreal VFX and intense dark-mode cinematography.',
      fullDescription: "Work Doesn't Work captured youth culture through high-speed camera rigging, volumetric lighting, and customized particle VFX.",
      heroMedia: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
      heroVideoUrl: 'https://www.youtube.com/watch?v=hu-mu6556so',
      thumbnailUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80',
      projectVideoUrl: 'https://www.youtube.com/watch?v=hu-mu6556so',
      services: 'Cinematography, VFX Supervision, Sound Design',
      strategy: 'Surreal visual metaphors highlighting workplace stress.',
      artDirection: 'Moody cyan and deep black palette, atmospheric smoke VFX.',
      deliverables: '30s TV Spot, VFX Breakdown, Social Stills',
      credits: 'VFX Director: Rohit Pal',
      featured: true,
      status: 'PUBLISHED',
      order: 16,
      createdById: superAdmin.id,
      updatedById: superAdmin.id,
    },
  ];

  for (const w of workProjects) {
    await prisma.work.upsert({
      where: { slug: w.slug },
      update: {
        ...w,
        deletedAt: null,
      },
      create: w,
    });
  }

  console.log('✅ Works (Portfolio Projects) seeded');

  // Seed Hero Slides if not present
  const heroSlideCount = await prisma.heroSlide.count();
  if (heroSlideCount === 0) {
    await prisma.heroSlide.createMany({
      data: [
        {
          title: "WE ARE CRE8TIVECOVE",
          subtitle: "Lean Mean Storytelling Machine & Bold Digital Studio",
          tagline: "CREATIVE DIRECTION & FILMS",
          mediaUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=85",
          mediaType: "IMAGE",
          ctaText: "EXPLORE WORK",
          ctaUrl: "/work",
          secondaryCtaText: "ABOUT US",
          secondaryCtaUrl: "/about",
          order: 1,
          active: true,
        },
        {
          title: "WEIRD ENERGY SINCE Y2K",
          subtitle: "We Make People Feel Something Unforgettable Through Digital Craft",
          tagline: "STRATEGY • DESIGN • PRODUCTION",
          mediaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85",
          mediaType: "IMAGE",
          ctaText: "OUR SERVICES",
          ctaUrl: "/services",
          secondaryCtaText: "START A PROJECT",
          secondaryCtaUrl: "/contact",
          order: 2,
          active: true,
        },
        {
          title: "CULTURE BEYOND THE LENS",
          subtitle: "Award-Winning Narrative, Soundscapes & High-Voltage Experiences",
          tagline: "CINEMATIC STORYTELLING",
          mediaUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=85",
          mediaType: "IMAGE",
          ctaText: "VIEW PORTFOLIO",
          ctaUrl: "/work",
          secondaryCtaText: "CONTACT US",
          secondaryCtaUrl: "/contact",
          order: 3,
          active: true,
        },
      ],
    });
    console.log('✅ Hero Slides seeded');
  }

  console.log('🎉 CRE8TIVECOVE Database successfully seeded with all Part 4 content!');
}


main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });