// NSZ Group — site content. Edit here, then run:  node _build/build.mjs

export const SITE = {
  name: "NSZ Group",
  legalName: "NSZ Group (Pty) Ltd",
  url: "https://nszgroup.co.za",
  description:
    "NSZ Group is a Cape Town web and IT studio building custom websites, online stores with PayFast and Stripe, branding and IT systems for South African businesses.",
  founded: "2024",
  city: "Cape Town",
  region: "Western Cape",
  phoneDisplay: "063 437 1374",
  phoneIntl: "+27 63 437 1374",
  tel: "+27634371374",
  whatsapp: "https://wa.me/27634371374?text=Hi%20NSZ%20Group%2C%20I%27d%20like%20a%20quote.",
  email: "nszgroupbussines@gmail.com",
  hours: "Mon–Fri, 09:00–18:00 SAST",
  instagram: "https://www.instagram.com/nszgroup",
  sameAs: ["https://www.instagram.com/nszgroup"],
};

const f = (text, no = false) => ({ text, no });

// Prices as published on the previous NSZ Group pricing page.
export const PRICING = {
  websites: {
    id: "websites",
    title: "Websites",
    intro: "Custom, responsive websites. Once-off prices; hosting can be added.",
    plans: [
      { name: "Single Page", for: "Ideal for startups and freelancers", price: 1500, unit: "once-off",
        features: [f("1-page responsive website"), f("Contact form"), f("Basic SEO setup"), f("Mobile optimised"), f("CMS / editable content", true), f("Hosting included", true)] },
      { name: "Business Website", for: "For growing businesses", price: 4500, unit: "once-off", popular: true,
        features: [f("Up to 5 pages"), f("Contact form and newsletter signup"), f("SEO optimisation"), f("Google Analytics setup"), f("3 months free maintenance"), f("E-commerce functionality", true)] },
      { name: "Premium Website", for: "For established businesses", price: 8500, unit: "once-off",
        features: [f("Unlimited pages"), f("Advanced contact forms"), f("Advanced SEO and analytics"), f("CMS integration"), f("6 months free maintenance"), f("Performance optimisation")] },
    ],
  },
  ecommerce: {
    id: "ecommerce",
    title: "E-Commerce",
    intro: "Online stores with payment integration. Once-off build plus monthly hosting.",
    plans: [
      { name: "Starter Store", for: "Perfect for getting started", price: 6500, unit: "once-off + R250/month hosting",
        features: [f("Up to 10 products"), f("Payment integration"), f("Basic inventory management"), f("Mobile responsive"), f("Advanced analytics", true), f("Multi-vendor support", true)] },
      { name: "Business Store", for: "For growing online businesses", price: 12500, unit: "once-off + R450/month hosting", popular: true,
        features: [f("Unlimited products"), f("Advanced payment options"), f("Inventory and order management"), f("Customer accounts"), f("Basic analytics dashboard"), f("Multi-vendor marketplace", true)] },
      { name: "Enterprise Store", for: "For enterprise solutions", price: 25000, unit: "once-off + custom hosting",
        features: [f("Everything in Business Store"), f("Multi-vendor marketplace"), f("Advanced analytics and reporting"), f("Custom integrations"), f("24/7 premium support"), f("SLA guarantee")] },
    ],
  },
  branding: {
    id: "branding",
    title: "Logo & Branding",
    intro: "From a logo on its own to a full brand identity or rebrand.",
    plans: [
      { name: "Logo Package", for: "Essential branding package", price: 2500, unit: "once-off",
        features: [f("3 logo concepts"), f("3 revisions per concept"), f("Vector files in all formats"), f("Brand guidelines"), f("Business card design", true), f("Social media templates", true)] },
      { name: "Brand Identity", for: "Complete brand identity", price: 7500, unit: "once-off", popular: true,
        features: [f("Everything in Logo Package"), f("Business card design"), f("Letterhead and envelope"), f("Social media templates"), f("Brand colour palette"), f("Typography selection")] },
      { name: "Brand Refresh", for: "For rebranding projects", price: 12500, unit: "once-off",
        features: [f("Brand audit and analysis"), f("Logo redesign"), f("Updated brand guidelines"), f("New marketing materials"), f("Implementation strategy"), f("3 months brand support")] },
    ],
  },
  posters: {
    id: "posters",
    title: "Posters & Design",
    intro: "Event, promotional and social posters with fast turnaround.",
    plans: [
      { name: "Casual", for: "Perfect for individuals", price: 150, unit: "per poster",
        features: [f("1 custom poster design"), f("1 revision"), f("Digital file (JPG/PNG)"), f("3–5 day turnaround"), f("Print-ready files", true), f("Source file included", true)] },
      { name: "Startup", for: "Great for small businesses", price: 350, unit: "per poster", popular: true,
        features: [f("1 premium poster design"), f("3 revisions"), f("Digital and print-ready files"), f("2–3 day turnaround"), f("Social media resize included"), f("Source file included", true)] },
      { name: "Business", for: "For brands and campaigns", price: 800, unit: "per poster, bulk discounts available",
        features: [f("Up to 3 poster designs"), f("Unlimited revisions"), f("Digital, print-ready and source files"), f("1–2 day turnaround"), f("Social media resize included"), f("Brand consistency review")] },
    ],
  },
  social: {
    id: "social",
    title: "Social Media Management",
    intro: "Monthly content, design and community management.",
    plans: [
      { name: "Social Starter", for: "Monthly social media management", price: 2500, unit: "per month",
        features: [f("8 posts per month"), f("2 platforms"), f("Content creation"), f("Basic engagement monitoring"), f("Ad management", true), f("Monthly strategy report", true)] },
      { name: "Social Pro", for: "Complete social media solution", price: 5500, unit: "per month", popular: true,
        features: [f("16 posts per month"), f("4 platforms"), f("Content and graphic design"), f("Community management"), f("Monthly analytics report"), f("Ad campaign management")] },
      { name: "Social Enterprise", for: "For established brands", price: 12500, unit: "per month",
        features: [f("24+ posts per month"), f("Unlimited platforms"), f("Advanced content strategy"), f("Influencer partnerships"), f("Weekly performance reports"), f("Crisis management")] },
    ],
  },
};

export const SERVICES = [
  {
    slug: "websites",
    name: "Websites & Web Apps",
    short: "Websites & web apps",
    hero: "Websites.",
    serviceType: "Web design and development",
    summary: "Custom, mobile-first websites, plus web apps with accounts, bookings and dashboards.",
    tags: ["Business sites", "Web apps", "SEO", "AI features"],
    fromLabel: "From R1 500",
    title: "Website Design & Development in Cape Town | NSZ Group",
    description: "Custom, mobile-first websites and web apps for South African businesses. Single-page sites R1 500, 5-page business sites R4 500. Based in Cape Town.",
    h1: "Website design and development in Cape Town.",
    lead: "We design and build fast, mobile-first websites, from a one-page site that gets you found to web apps with logins, bookings and a database behind them.",
    includesTitle: "From a one-page site to a full web app.",
    groups: [
      { title: "Business websites", items: ["Custom responsive design, not a template", "Single-page and multi-page sites", "Contact forms and WhatsApp click-to-chat", "On-page SEO set up from day one", "Google Analytics setup (Business Website and up)"] },
      { title: "Web apps", items: ["User accounts and sign-in with Supabase", "Bookings, listings and dashboards", "Admin panels for your team", "Moderation and identity-verification tools"] },
      { title: "AI features & automation", items: ["AI chat assistants for your website", "AI-generated images and media", "Workflow automation that saves admin time"] },
      { title: "Launch & handover", items: ["Deployed on Netlify or Vercel with HTTPS", "Tested on phone, tablet and desktop", "Code you own, never a locked-in page builder"] },
    ],
    pricing: ["websites"],
    work: ["vaultly", "dripzilla", "talenttide", "pitchflow", "digitalbloom"],
    faqs: [
      { q: "How much does a website cost?", a: "A single-page website is R1 500 once-off. A business website of up to five pages is R4 500, and a premium website with unlimited pages and CMS integration is R8 500. Web apps with accounts, bookings or dashboards are quoted per project." },
      { q: "Do I own my website’s code?", a: "Yes. Every site is custom-built and the files are handed over to you, so you are never locked into a page builder or a platform subscription to keep your site online." },
      { q: "Will my website work on phones?", a: "Yes. Every site is designed mobile-first and tested on phone, tablet and desktop before launch." },
    ],
  },
  {
    slug: "ecommerce",
    name: "E-Commerce",
    short: "E-commerce",
    hero: "Online stores.",
    serviceType: "E-commerce website development",
    summary: "Online stores with PayFast or Stripe checkout, stock and order management your team can run.",
    tags: ["PayFast", "Stripe", "Inventory", "Customer accounts"],
    fromLabel: "From R6 500",
    title: "E-Commerce Website Development in South Africa | NSZ Group",
    description: "Online stores for South African businesses with PayFast or Stripe checkout, inventory and order management. Starter stores from R6 500. Built in Cape Town.",
    h1: "Online stores that take payment in Rand.",
    lead: "We build online stores with PayFast or Stripe checkout that work on any phone and are simple for your team to run day to day.",
    includesTitle: "Everything you need to sell online.",
    groups: [
      { title: "Store build", items: ["Product catalogue, cart and checkout", "PayFast or Stripe payment integration", "Mobile-first, conversion-focused layout", "Customer accounts (Business Store and up)"] },
      { title: "Running the store", items: ["Inventory and order management", "Analytics dashboard (Business Store and up)", "Multi-vendor marketplace (Enterprise Store)", "Monthly hosting with maintenance"] },
    ],
    pricing: ["ecommerce"],
    work: ["sevenity", "sheate", "quickbite", "y2k"],
    faqs: [
      { q: "How much does an online store cost?", a: "A Starter Store with up to 10 products is R6 500 once-off plus R250 a month for hosting. A Business Store with unlimited products and customer accounts is R12 500 plus R450 a month. Enterprise stores with multi-vendor marketplaces are R25 000 with custom hosting." },
      { q: "Which payment gateways do you integrate?", a: "PayFast for South African payments, including card and instant EFT, and Stripe for international card payments." },
      { q: "Can I add and edit products myself?", a: "Yes. Every store includes product and inventory management, so your team can add, edit and remove products without a developer." },
    ],
  },
  {
    slug: "branding",
    name: "Branding, Design & Social Media",
    short: "Branding & social media",
    hero: "Branding.",
    serviceType: "Graphic design and social media management",
    summary: "Logos and brand identities, posters for print and social, and monthly social media management.",
    tags: ["Logos", "Brand identity", "Posters", "Social media"],
    fromLabel: "Posters from R150",
    title: "Logo Design, Posters & Social Media Management | NSZ Group",
    description: "Logos, brand identity, posters and monthly social media management for South African brands. Posters from R150, logo packages from R2 500.",
    h1: "Logos, posters and social media that make you look established.",
    lead: "From a single event poster to a full brand identity and a month of social content, designed in Cape Town for South African brands.",
    includesTitle: "Identity, print and social, in one place.",
    groups: [
      { title: "Brand identity", items: ["Logo concepts with vector files in all formats", "Colour palette and typography selection", "Business cards, letterheads and envelopes", "Brand guidelines you can reuse"] },
      { title: "Posters & print", items: ["Event and promotional posters", "Print-ready and social-media-sized files", "1–5 day turnaround depending on package"] },
      { title: "Social media management", items: ["8 to 24+ posts per month", "Content creation and graphic design", "Community management and monthly reports", "Ad campaign management (Social Pro and up)"] },
    ],
    pricing: ["branding", "posters", "social"],
    work: [],
    faqs: [
      { q: "How much does a logo cost?", a: "The Logo Package is R2 500 and includes three concepts, three revisions per concept, vector files in all formats and brand guidelines. A full Brand Identity is R7 500 and a Brand Refresh is R12 500." },
      { q: "How much does a poster cost and how fast is it?", a: "Posters start at R150 with a 3–5 day turnaround. The Startup package is R350 with print-ready files in 2–3 days, and the Business package is R800 for up to three designs in 1–2 days." },
      { q: "How much is social media management?", a: "Social Starter is R2 500 a month for 8 posts on 2 platforms. Social Pro is R5 500 a month for 16 posts on 4 platforms with ad management. Social Enterprise is R12 500 a month for 24+ posts." },
    ],
  },
  {
    slug: "it-services",
    name: "IT Services, Hosting & CCTV",
    short: "IT, hosting & CCTV",
    hero: "IT & CCTV.",
    serviceType: "IT services, network installation and CCTV installation",
    summary: "Domains, hosting and business email, office networks and Wi-Fi, and CCTV installation.",
    tags: ["Domains & hosting", "Business email", "Networking", "CCTV"],
    fromLabel: "Quoted per site",
    title: "IT Services, Hosting & CCTV in Cape Town | NSZ Group",
    description: "Domains, hosting, business email, office networks and CCTV installation for Cape Town businesses, set up, secured and supported by NSZ Group.",
    h1: "IT, networking and CCTV for Cape Town businesses.",
    lead: "We set up the technology your business runs on: domains, hosting and email, reliable office networks, and CCTV systems you can check from your phone.",
    includesTitle: "The tech setup a growing business needs.",
    groups: [
      { title: "Domains, hosting & email", items: [".co.za and international domain registration", "Website hosting with SSL", "Business email and Google Workspace setup"] },
      { title: "Networking", items: ["LAN / WAN setup and configuration", "Wireless network installation", "Firewall and network security", "Ongoing maintenance and support"] },
      { title: "CCTV", items: ["Site survey and system design", "HD and IP camera installation", "NVR / DVR configuration", "Remote viewing setup"] },
      { title: "Business setup", items: ["Company registration support", "Third-party integrations", "Practical tech setup and advice"] },
    ],
    pricing: [],
    quoteNote: "Networking and CCTV are quoted after a site survey, because the cost depends on the size of the site and the equipment needed. Domains, hosting and business email are quoted with your website or on their own.",
    work: [],
    faqs: [
      { q: "How is networking and CCTV priced?", a: "We quote after a site survey, because the price depends on the size of the premises, the number of cameras or access points, and the equipment you need." },
      { q: "Can you set up business email on my own domain?", a: "Yes. We register .co.za or international domains and set up business email, including Google Workspace, so your team sends mail from your company address." },
    ],
  },
];

// Projects from github.com/Sithenkosimbasa. Screenshots in /assets/work/.
export const PROJECTS = [
  { id: "dripzilla", name: "Drip Zilla", type: "Artist website", img: "dripzilla", url: "https://dripzilla.netlify.app",
    alt: "Drip Zilla homepage with the headline Art Without Limits over a hand-painted sneaker",
    summary: "Website for a hand-painting studio that customises sneakers, clothing, canvas and murals, with starting prices shown up front and enquiries straight to WhatsApp.",
    stack: "HTML, CSS, JavaScript · Netlify" },
  { id: "vaultly", name: "Vaultly", type: "Marketplace web app", img: "vaultly", label: "Vaultly · Cape Town",
    alt: "Vaultly homepage with the headline Find Space. Store Smarter.",
    summary: "Peer-to-peer storage marketplace for Cape Town that matches people who need storage with neighbours who have space, plus an admin console for listings, bookings, disputes and identity verification.",
    stack: "JavaScript, TypeScript · Supabase auth, database and edge functions" },
  { id: "sevenity", name: "Sevenity", type: "E-commerce", img: "sevenity", label: "Sevenity · streetwear",
    alt: "Sevenity streetwear store homepage with large SEVENITY headline and Shop Now button",
    summary: "Streetwear store with a catalogue, lookbook, wishlist and cart, built around heavy type and a restrained palette.",
    stack: "HTML, CSS, JavaScript" },
  { id: "talenttide", name: "Talent Tide SA", type: "Freelance marketplace", img: "talenttide", label: "Talent Tide SA",
    alt: "Talent Tide SA homepage with the headline Find Top Freelancers in South Africa and a skills search bar",
    summary: "Marketplace for hiring South African freelancers in web development, design and marketing, with search by skill and location.",
    stack: "TypeScript · Supabase" },
];

export const MORE_PROJECTS = [
  { id: "sheate", name: "She Ate", type: "Food ordering", url: "https://she-ate.vercel.app", summary: "Mobile-first food website with ordering, meal planning, cart, checkout and customer accounts.", stack: "JavaScript · Supabase" },
  { id: "quickbite", name: "QuickBite", type: "Food platform", summary: "Multi-restaurant food ordering platform for exploring and ordering from several kitchens.", stack: "HTML, CSS, JavaScript" },
  { id: "digitalbloom", name: "Digital Bloom", type: "Web app", summary: "Interactive birthday-card creator with Google and Facebook sign-in, real-time saving and QR-code share links.", stack: "JavaScript · Supabase" },
  { id: "pitchflow", name: "PitchFlow", type: "AI web app", summary: "AI-powered sales-call analysis and coaching platform.", stack: "TypeScript · Supabase" },
  { id: "kidflix", name: "KidFlix", type: "Streaming platform", summary: "Safe streaming hub for children’s movies and shows, with parent sign-in.", stack: "JavaScript" },
  { id: "y2k", name: "Y2K Closet", type: "E-commerce", summary: "Online fashion store.", stack: "HTML, CSS, JavaScript" },
  { id: "nanarulz", name: "Nanarulz", type: "Business website", summary: "Website for a barber shop.", stack: "HTML, CSS, JavaScript" },
  { id: "trustbridge", name: "TrustBridge", type: "Job platform", summary: "Job-search platform.", stack: "HTML, CSS" },
  { id: "codezack", name: "Code Zack Jobs", type: "Automation tool", summary: "Tool that finds job listings and applies to them automatically.", stack: "Python" },
  { id: "quizmaster", name: "Quiz Master", type: "Web app", url: "https://sithenkosimbasa.github.io/Quiz-Master/", summary: "Browser-based quiz builder and player.", stack: "JavaScript" },
];

export const STEPS = [
  { title: "Discover", text: "We pin down your goals, your customers and the one job the site has to do, before any design or code." },
  { title: "Design", text: "A layout, colours and type built around your brand, shared with you for feedback before we build." },
  { title: "Build", text: "Clean, responsive code with payments, accounts and content wired in and tested on real devices." },
  { title: "Launch", text: "Deployed, secured with HTTPS and handed over, with the know-how to run it yourself." },
];

export const REASONS = [
  { title: "Code you own", text: "Your website files are handed over to you. No locked-in page builder, no platform fee just to stay online." },
  { title: "Prices on the page", text: "Our packages and prices are published in Rand, and you get a fixed written quote before work starts." },
  { title: "Built for South Africa", text: "PayFast checkout, .co.za domains, POPIA-friendly forms and the business setup a new company needs." },
  { title: "One point of contact", text: "The same team from first call to launch day, reachable on WhatsApp and phone during business hours." },
];

export const HOME_FAQS = [
  { q: "What does NSZ Group do?", a: "NSZ Group is a Cape Town web and IT studio. We design and build websites and web apps, build online stores with PayFast or Stripe checkout, design logos, posters and social media content, and set up hosting, domains, business email, office networks and CCTV for South African businesses." },
  { q: "How much does a website cost?", a: "A single-page website is R1 500, a business website of up to five pages is R4 500, and a premium website with unlimited pages is R8 500, all once-off. Online stores start at R6 500 plus R250 a month for hosting." },
  { q: "How long does a website take?", a: "Most small sites take days rather than months. We confirm a fixed timeline in writing with your quote, based on the number of pages and features." },
  { q: "Do you only work with clients in Cape Town?", a: "No. We are based in Cape Town and work with businesses across South Africa remotely. Networking and CCTV installations are done on site." },
  { q: "How do I get a quote?", a: "Fill in the form on our contact page, WhatsApp us on 063 437 1374, or email nszgroupbussines@gmail.com. We usually reply within one business day." },
];
