// NSZ Group — static site generator.
// Run from the repo root:   node _build/build.mjs
// Writes every page, sitemap.xml, robots.txt, llms.txt and llms-full.txt.
// Edit prices, services, projects and contact details in _build/data.mjs, then re-run.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE, PRICING, SERVICES, PROJECTS, MORE_PROJECTS, HOME_FAQS, STEPS, REASONS } from "./data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TODAY = new Date().toISOString().slice(0, 10);
const YEAR = new Date().getFullYear();

/* ---------------- helpers ---------------- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rand = (n) => "R" + n.toLocaleString("en-ZA").replace(/[\s\u00a0\u202f,]/g, "\u00a0");
const randPlain = (n) => "R" + n.toLocaleString("en-ZA").replace(/[\s\u00a0\u202f,]/g, " ");
const abs = (p) => SITE.url + p;
const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const ext = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>`;
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

const NAV = [
  { href: "/services/", label: "Services" },
  { href: "/work/", label: "Work" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

const ORG_ID = SITE.url + "/#org";
const ORG = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: SITE.name,
  legalName: SITE.legalName,
  url: SITE.url + "/",
  logo: abs("/assets/brand/nsz-logo.png"),
  image: abs("/assets/og/nsz-group-og.png"),
  description: SITE.description,
  foundingDate: SITE.founded,
  email: SITE.email,
  telephone: SITE.phoneIntl,
  priceRange: "R150 – R25 000",
  currenciesAccepted: "ZAR",
  address: { "@type": "PostalAddress", addressLocality: SITE.city, addressRegion: SITE.region, addressCountry: "ZA" },
  areaServed: [{ "@type": "City", name: "Cape Town" }, { "@type": "Country", name: "South Africa" }],
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" }],
  contactPoint: [{ "@type": "ContactPoint", contactType: "sales", telephone: SITE.phoneIntl, email: SITE.email, areaServed: "ZA", availableLanguage: ["English"] }],
  sameAs: SITE.sameAs,
  knowsAbout: ["Web design", "Web development", "E-commerce", "PayFast integration", "Supabase", "Logo design", "Social media management", "Web hosting", "Business email", "Network installation", "CCTV installation"],
};
const WEBSITE = { "@context": "https://schema.org", "@type": "WebSite", "@id": SITE.url + "/#website", url: SITE.url + "/", name: SITE.name, publisher: { "@id": ORG_ID }, inLanguage: "en-ZA" };

const crumbsLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.href) })),
});
const faqLd = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

/* ---------------- shared chrome ---------------- */
function header(current) {
  const items = NAV.map((n) => `<li><a href="${n.href}"${current === n.href ? ' aria-current="page"' : ""}>${n.label}</a></li>`).join("");
  return `<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="NSZ Group home"><span class="brand-bar" aria-hidden="true"></span><span class="brand-nsz">NSZ</span><span class="brand-group">Group</span></a>
    <nav class="nav" aria-label="Main"><ul>${items}</ul></nav>
    <a class="btn btn-primary header-cta" href="/contact/">Get a quote</a>
    <details class="menu">
      <summary><span class="menu-icon" aria-hidden="true"></span>Menu</summary>
      <nav class="menu-panel" aria-label="Main (mobile)"><ul>${items}</ul><a class="btn btn-primary" href="/contact/">Get a quote</a></nav>
    </details>
  </div>
</header>`;
}

function ctaBand(heading = "Tell us what you’re building.", text = "Send a few lines about your project. We reply with a plan and a fixed quote, usually within one business day.") {
  return `<section class="cta-band" aria-labelledby="cta-title">
  <div class="wrap cta-grid">
    <div>
      <h2 id="cta-title" class="h2">${heading}</h2>
      <p>${text}</p>
      <div class="actions">
        <a class="btn btn-gold" href="/contact/">Get a quote ${arrow}</a>
        <a class="btn btn-outline-light" href="${SITE.whatsapp}" rel="noopener">WhatsApp us</a>
      </div>
    </div>
    <ul class="contact-lines">
      <li><span class="k">Phone</span><a href="tel:${SITE.tel}">${SITE.phoneDisplay}</a></li>
      <li><span class="k">Email</span><a href="mailto:${SITE.email}">${SITE.email}</a></li>
      <li><span class="k">Hours</span><span class="v">${SITE.hours}</span></li>
      <li><span class="k">Based in</span><span class="v">${SITE.city}, South Africa</span></li>
    </ul>
  </div>
</section>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-about">
        <a class="brand" href="/" aria-label="NSZ Group home"><span class="brand-bar" aria-hidden="true"></span><span class="brand-nsz">NSZ</span><span class="brand-group">Group</span></a>
        <p>A Cape Town web and IT studio building websites, online stores and digital systems for South African businesses. Est. ${SITE.founded}.</p>
      </div>
      <nav aria-labelledby="f-services"><h2 id="f-services">Services</h2><ul>
        ${SERVICES.map((s) => `<li><a href="/services/${s.slug}/">${s.short}</a></li>`).join("")}
      </ul></nav>
      <nav aria-labelledby="f-company"><h2 id="f-company">Company</h2><ul>
        <li><a href="/work/">Work</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/about/">About</a></li><li><a href="/contact/">Contact</a></li>
      </ul></nav>
      <div><h2>Contact</h2>
        <address>
          <span>${SITE.city}, ${SITE.region}</span>
          <a href="tel:${SITE.tel}">${SITE.phoneDisplay}</a>
          <a href="mailto:${SITE.email}">${SITE.email}</a>
          <a href="${SITE.whatsapp}" rel="noopener">WhatsApp</a>
          <a href="${SITE.instagram}" rel="noopener">Instagram</a>
        </address>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${YEAR} ${SITE.legalName}</p>
      <ul role="list"><li><a href="/privacy/">Privacy policy</a></li><li><a href="/sitemap.xml">Sitemap</a></li></ul>
    </div>
  </div>
</footer>`;
}

function breadcrumb(items) {
  return `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${items
    .map((c, i) => (i === items.length - 1 ? `<li><span aria-current="page">${c.name}</span></li>` : `<li><a href="${c.href}">${c.name}</a></li>`))
    .join("")}</ol></nav>`;
}

function layout({ path, title, description, nav, body, schema = [], noindex = false, scripts = "" }) {
  const url = abs(path);
  return `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">'}
<meta name="theme-color" content="#F6F5F1">
<meta property="og:type" content="website">
<meta property="og:site_name" content="NSZ Group">
<meta property="og:locale" content="en_ZA">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${abs("/assets/og/nsz-group-og.png")}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="NSZ Group — websites, online stores and IT in Cape Town">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs("/assets/og/nsz-group-og.png")}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="alternate" type="text/plain" title="LLM-readable summary" href="/llms.txt">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..800&family=IBM+Plex+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/assets/css/site.css?v=${TODAY.replace(/-/g, "")}">
${[ORG, WEBSITE, ...schema].map(ld).join("\n")}
</head>
<body>
${header(nav)}
<main id="main">
${body}
</main>
${footer()}
${scripts}
</body>
</html>
`;
}

/* ---------------- reusable blocks ---------------- */
function planCard(p, cat) {
  const items = p.features.map((f) => (f.no ? `<li class="no"><span class="sr-only">Not included: </span>${f.text}</li>` : `<li>${f.text}</li>`)).join("");
  return `<article class="plan${p.popular ? " popular" : ""}">
  ${p.popular ? '<span class="plan-badge">Most popular</span>' : ""}
  <h3>${p.name}</h3>
  <p class="plan-for">${p.for}</p>
  <p class="plan-price"><span class="amt">${rand(p.price)}</span><span class="unit">${p.unit}</span></p>
  <ul class="checks">${items}</ul>
  <a class="btn ${p.popular ? "btn-primary" : "btn-secondary"}" href="/contact/?service=${encodeURIComponent(cat.title + " — " + p.name)}">Choose ${p.name}</a>
</article>`;
}

function workCard(p, headingLevel = "h3") {
  const img = `<img src="/assets/work/${p.img}-1200.jpg" srcset="/assets/work/${p.img}-640.jpg 640w, /assets/work/${p.img}-1200.jpg 1200w" sizes="(min-width: 760px) 50vw, 100vw" width="1200" height="675" alt="${esc(p.alt)}" loading="lazy" decoding="async">`;
  const label = p.url ? p.url.replace(/^https?:\/\//, "").replace(/\/$/, "") : p.label;
  const shot = p.url
    ? `<a class="shot" href="${p.url}" rel="noopener" aria-label="${esc(p.name)} live site"><span class="shot-bar">${label}</span>${img}</a>`
    : `<div class="shot"><span class="shot-bar">${label}</span>${img}</div>`;
  return `<article class="work-card">
  ${shot}
  <div>
    <p class="work-type">${p.type}</p>
    <${headingLevel}>${p.name}</${headingLevel}>
    <p class="desc">${p.summary}</p>
    <p class="work-stack">${p.stack}</p>
    ${p.url ? `<a class="text-link" href="${p.url}" rel="noopener">Visit live site ${ext}</a>` : ""}
  </div>
</article>`;
}

function builtList(items) {
  return `<ul class="built-list">${items
    .map(
      (m) => `<li><span class="name">${m.name}</span><span class="kind">${m.type}</span><span class="what">${m.summary}</span>${
        m.url ? `<a class="link" href="${m.url}" rel="noopener">Live site</a>` : `<span class="link"></span>`
      }</li>`
    )
    .join("")}</ul>`;
}

function faqBlock(faqs) {
  return `<div class="faq">${faqs
    .map((f) => `<details><summary><h3>${f.q}</h3><span class="pm" aria-hidden="true"></span></summary><div class="answer"><p>${f.a}</p></div></details>`)
    .join("")}</div>`;
}

function stepsBlock() {
  return `<ol class="steps">${STEPS.map((s, i) => `<li><span class="num">0${i + 1}</span><h3>${s.title}</h3><p>${s.text}</p></li>`).join("")}</ol>`;
}

/* ---------------- pages ---------------- */
const pages = [];

// HOME
{
  const featuredPrices = [
    { label: "Single-page website", sub: "Responsive, contact form, basic SEO", price: PRICING.websites.plans[0].price, unit: "once-off" },
    { label: "Business website", sub: "Up to 5 pages, SEO, analytics", price: PRICING.websites.plans[1].price, unit: "once-off" },
    { label: "Online store", sub: "Up to 10 products, payments", price: PRICING.ecommerce.plans[0].price, unit: "+ R250 / month" },
    { label: "Logo package", sub: "3 concepts, vector files, guidelines", price: PRICING.branding.plans[0].price, unit: "once-off" },
  ];
  const body = `
<section class="hero">
  <div class="wrap">
    <p class="eyebrow hero-eyebrow">NSZ Group · Cape Town · Est. ${SITE.founded}</p>
    <h1 class="hero-scream">
      <span class="sr-only">NSZ Group builds </span>
      ${SERVICES.map((s, i) => `<a class="scream-line" href="/services/${s.slug}/"><span class="scream-idx" aria-hidden="true">0${i + 1}</span>${s.hero}</a>`).join("\n      ")}
      <span class="hero-tail">For South African businesses.</span>
    </h1>
  </div>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="lead">We design and hand-code websites and web apps, build online stores with PayFast checkout, design brands, and set up hosting, email, networks and CCTV. One team, published prices.</p>
      <div class="actions">
        <a class="btn btn-primary" href="/contact/">Get a quote ${arrow}</a>
        <a class="btn btn-secondary" href="${SITE.whatsapp}" rel="noopener">WhatsApp ${SITE.phoneDisplay}</a>
      </div>
    </div>
    <aside class="price-panel" aria-labelledby="pp-title">
      <h2 id="pp-title" class="panel-title">Published prices</h2>
      <dl class="price-rows">
        ${featuredPrices.map((r) => `<div class="price-row"><dt>${r.label}<span>${r.sub}</span></dt><dd>${rand(r.price)}<small>${r.unit}</small></dd></div>`).join("")}
      </dl>
      <div class="price-panel-foot"><span>Prices in Rand. No hidden fees.</span><a class="text-link" href="/pricing/">Full price list ${arrow}</a></div>
    </aside>
  </div>
</section>

<section class="section" aria-labelledby="services-title">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Services</p>
      <h2 id="services-title" class="h2">One studio for the site, the shop and the systems behind them.</h2>
    </div>
    <ol class="service-list">
      ${SERVICES.map(
        (s, i) => `<li><a class="service-row" href="/services/${s.slug}/">
        <span class="idx">0${i + 1}</span>
        <div><h3>${s.name}</h3><p>${s.summary}</p><ul class="tags">${s.tags.map((t) => `<li>${t}</li>`).join("")}</ul></div>
        <span class="from">${s.fromLabel} ${arrow}</span>
      </a></li>`
      ).join("")}
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="work-title">
  <div class="wrap">
    <div class="section-head-row">
      <div class="section-head">
        <p class="eyebrow">Selected work</p>
        <h2 id="work-title" class="h2">Built by us, running in the real world.</h2>
      </div>
      <a class="text-link" href="/work/">All projects ${arrow}</a>
    </div>
    <div class="work-grid">${PROJECTS.map((p) => workCard(p)).join("")}</div>
  </div>
</section>

<section class="section" aria-labelledby="process-title">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">How we work</p>
      <h2 id="process-title" class="h2">Four steps, and you always know which one we’re on.</h2>
    </div>
    ${stepsBlock()}
  </div>
</section>

<section class="section" aria-labelledby="why-title">
  <div class="wrap split">
    <div class="split-sticky section-head">
      <p class="eyebrow">Why NSZ Group</p>
      <h2 id="why-title" class="h2">Agency quality, without the agency wait.</h2>
    </div>
    <ul class="reasons">${REASONS.map((r) => `<li><h3>${r.title}</h3><p>${r.text}</p></li>`).join("")}</ul>
  </div>
</section>

<section class="section" aria-labelledby="faq-title">
  <div class="wrap split">
    <div class="split-sticky section-head">
      <p class="eyebrow">FAQ</p>
      <h2 id="faq-title" class="h2">Questions we get asked most.</h2>
      <p>Something else? <a href="/contact/">Ask us directly</a>.</p>
    </div>
    ${faqBlock(HOME_FAQS)}
  </div>
</section>
${ctaBand()}`;
  pages.push({
    path: "/",
    file: "index.html",
    title: "Web Design, E-Commerce & IT in Cape Town | NSZ Group",
    description: "Cape Town web studio building hand-coded websites, online stores with PayFast, branding and IT for South African businesses. Websites from R1 500.",
    nav: "/",
    body,
    schema: [faqLd(HOME_FAQS)],
    priority: "1.0",
  });
}

// SERVICES HUB
{
  const crumbs = [{ name: "Home", href: "/" }, { name: "Services", href: "/services/" }];
  const body = `
<section class="page-hero"><div class="wrap">
  ${breadcrumb(crumbs)}
  <p class="eyebrow">Services</p>
  <h1>Everything a growing business needs online, from one team.</h1>
  <p class="lead">Websites, online stores, branding and the IT underneath them. Pick one service or let us handle the lot, with one point of contact from quote to launch.</p>
</div></section>
<section class="section"><div class="wrap">
  <ol class="service-list">
    ${SERVICES.map(
      (s, i) => `<li><a class="service-row" href="/services/${s.slug}/">
      <span class="idx">0${i + 1}</span>
      <div><h2 class="service-h">${s.name}</h2><p>${s.summary}</p><ul class="tags">${s.tags.map((t) => `<li>${t}</li>`).join("")}</ul></div>
      <span class="from">${s.fromLabel} ${arrow}</span>
    </a></li>`
    ).join("")}
  </ol>
</div></section>
<section class="section" aria-labelledby="process-title"><div class="wrap">
  <div class="section-head"><p class="eyebrow">How we work</p><h2 id="process-title" class="h2">The same four steps on every project.</h2></div>
  ${stepsBlock()}
</div></section>
${ctaBand()}`;
  pages.push({
    path: "/services/",
    file: "services/index.html",
    title: "Services | Web Design, E-Commerce, Branding & IT | NSZ Group",
    description: "Website design, online stores, logo and social media design, hosting, networking and CCTV for businesses in Cape Town and across South Africa.",
    nav: "/services/",
    body,
    schema: [
      crumbsLd(crumbs),
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: SERVICES.map((s, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/services/${s.slug}/`), name: s.name })),
      },
    ],
    priority: "0.9",
  });
}

// SERVICE PAGES
for (const s of SERVICES) {
  const crumbs = [{ name: "Home", href: "/" }, { name: "Services", href: "/services/" }, { name: s.short, href: `/services/${s.slug}/` }];
  const cats = (s.pricing || []).map((k) => PRICING[k]);
  const work = (s.work || []).map((id) => PROJECTS.find((p) => p.id === id) || MORE_PROJECTS.find((p) => p.id === id)).filter(Boolean);
  const featuredWork = work.filter((w) => w.img);
  const otherWork = work.filter((w) => !w.img);
  const body = `
<section class="page-hero"><div class="wrap">
  ${breadcrumb(crumbs)}
  <p class="eyebrow">${s.short}</p>
  <h1>${s.h1}</h1>
  <p class="lead">${s.lead}</p>
  <div class="actions">
    <a class="btn btn-primary" href="/contact/?service=${encodeURIComponent(s.short)}">Get a quote ${arrow}</a>
    ${cats.length ? `<a class="btn btn-secondary" href="#pricing">See prices</a>` : `<a class="btn btn-secondary" href="${SITE.whatsapp}" rel="noopener">WhatsApp us</a>`}
  </div>
</div></section>

<section class="section" aria-labelledby="inc-title"><div class="wrap">
  <div class="section-head"><p class="eyebrow">What’s included</p><h2 id="inc-title" class="h2">${s.includesTitle}</h2></div>
  <div class="includes">
    ${s.groups.map((g) => `<div class="include-group"><h3>${g.title}</h3><ul class="checks">${g.items.map((it) => `<li>${it}</li>`).join("")}</ul></div>`).join("")}
  </div>
</div></section>

${cats
  .map(
    (cat, i) => `<section class="section"${i === 0 ? ' id="pricing"' : ""} aria-labelledby="price-${cat.id}"><div class="wrap">
  <div class="price-cat-head"><div><p class="eyebrow">Pricing</p><h2 id="price-${cat.id}" class="h2">${cat.title}</h2></div><p>${cat.intro}</p></div>
  <div class="plans">${cat.plans.map((p) => planCard(p, cat)).join("")}</div>
</div></section>`
  )
  .join("")}

${
  s.quoteNote
    ? `<section class="section" id="pricing" aria-labelledby="quote-title"><div class="wrap split">
  <div class="section-head"><p class="eyebrow">Pricing</p><h2 id="quote-title" class="h2">Quoted per site.</h2></div>
  <div class="prose"><p>${s.quoteNote}</p><p><a class="text-link" href="/contact/?service=${encodeURIComponent(s.short)}">Request a site survey ${arrow}</a></p></div>
</div></section>`
    : ""
}

${
  work.length
    ? `<section class="section" aria-labelledby="work-title"><div class="wrap">
  <div class="section-head-row"><div class="section-head"><p class="eyebrow">Related work</p><h2 id="work-title" class="h2">Projects like this we’ve built.</h2></div><a class="text-link" href="/work/">All projects ${arrow}</a></div>
  ${featuredWork.length ? `<div class="work-grid">${featuredWork.map((p) => workCard(p)).join("")}</div>` : ""}
  ${otherWork.length ? `<div class="built">${featuredWork.length ? "<h3>Also built</h3>" : ""}${builtList(otherWork)}</div>` : ""}
</div></section>`
    : ""
}

<section class="section" aria-labelledby="faq-title"><div class="wrap split">
  <div class="split-sticky section-head"><p class="eyebrow">FAQ</p><h2 id="faq-title" class="h2">${s.short}: common questions.</h2></div>
  ${faqBlock(s.faqs)}
</div></section>
${ctaBand()}`;

  const offers = cats.flatMap((cat) =>
    cat.plans.map((p) => ({ "@type": "Offer", name: `${cat.title}: ${p.name}`, price: p.price, priceCurrency: "ZAR", description: p.unit, url: abs(`/services/${s.slug}/#pricing`) }))
  );
  pages.push({
    path: `/services/${s.slug}/`,
    file: `services/${s.slug}/index.html`,
    title: s.title,
    description: s.description,
    nav: "/services/",
    body,
    schema: [
      crumbsLd(crumbs),
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: s.name,
        serviceType: s.serviceType,
        description: s.lead,
        url: abs(`/services/${s.slug}/`),
        provider: { "@id": ORG_ID },
        areaServed: [{ "@type": "City", name: "Cape Town" }, { "@type": "Country", name: "South Africa" }],
        ...(offers.length ? { offers } : {}),
      },
      faqLd(s.faqs),
    ],
    priority: "0.9",
  });
}

// WORK
{
  const crumbs = [{ name: "Home", href: "/" }, { name: "Work", href: "/work/" }];
  const body = `
<section class="page-hero"><div class="wrap">
  ${breadcrumb(crumbs)}
  <p class="eyebrow">Work</p>
  <h1>Websites, stores and web apps we’ve built.</h1>
  <p class="lead">Marketplaces, online stores, food ordering, a children’s streaming hub and an AI sales coach, all designed and built by NSZ Group.</p>
</div></section>
<section class="section" aria-labelledby="featured-title"><div class="wrap">
  <h2 id="featured-title" class="sr-only">Featured projects</h2>
  <div class="work-grid">${PROJECTS.map((p) => workCard(p)).join("")}</div>
  <div class="built"><h3>More projects</h3>${builtList(MORE_PROJECTS)}</div>
</div></section>
${ctaBand("Want something like this?", "Tell us what you have in mind. We’ll point you to the closest project we’ve built and quote yours.")}`;
  pages.push({
    path: "/work/",
    file: "work/index.html",
    title: "Our Work | Websites, Stores & Web Apps | NSZ Group",
    description: "Portfolio of websites, online stores and web apps built by NSZ Group in Cape Town: Drip Zilla, Vaultly, Sevenity, Talent Tide SA, She Ate and more.",
    nav: "/work/",
    body,
    schema: [
      crumbsLd(crumbs),
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "NSZ Group portfolio",
        url: abs("/work/"),
        mainEntity: {
          "@type": "ItemList",
          itemListElement: [...PROJECTS, ...MORE_PROJECTS].map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: { "@type": "CreativeWork", name: p.name, description: p.summary, genre: p.type, creator: { "@id": ORG_ID }, ...(p.url ? { url: p.url } : {}) },
          })),
        },
      },
    ],
    priority: "0.8",
  });
}

// PRICING
{
  const crumbs = [{ name: "Home", href: "/" }, { name: "Pricing", href: "/pricing/" }];
  const cats = Object.values(PRICING);
  const body = `
<section class="page-hero"><div class="wrap">
  ${breadcrumb(crumbs)}
  <p class="eyebrow">Pricing</p>
  <h1>Prices you can see before you call us.</h1>
  <p class="lead">Every package below is in South African Rand. We confirm the final scope and a fixed quote in writing before any work starts.</p>
</div></section>
<nav class="price-nav" aria-label="Price categories"><div class="wrap"><ul>${cats.map((c) => `<li><a href="#${c.id}">${c.title}</a></li>`).join("")}</ul></div></nav>
${cats
  .map(
    (cat) => `<section class="price-cat" id="${cat.id}" aria-labelledby="h-${cat.id}"><div class="wrap">
  <div class="price-cat-head"><h2 id="h-${cat.id}">${cat.title}</h2><p>${cat.intro}</p></div>
  <div class="plans">${cat.plans.map((p) => planCard(p, cat)).join("")}</div>
</div></section>`
  )
  .join("")}
<section class="section" aria-labelledby="custom-title"><div class="wrap split">
  <div class="section-head"><p class="eyebrow">Not listed?</p><h2 id="custom-title" class="h2">Web apps, networking and CCTV are quoted per project.</h2></div>
  <div class="prose">
    <p>Custom web apps (accounts, bookings, dashboards, marketplaces) depend on features, so we scope them with you first. Office networks and CCTV depend on the size of the site and the equipment needed, so we quote after a site survey.</p>
    <p><a class="text-link" href="/contact/">Ask for a quote ${arrow}</a></p>
  </div>
</div></section>
${ctaBand()}`;
  pages.push({
    path: "/pricing/",
    file: "pricing/index.html",
    title: "Pricing in Rand: Websites, Stores & Design | NSZ Group",
    description: "Published prices: websites from R1 500, online stores from R6 500, logos from R2 500, posters from R150 and social media management from R2 500 a month.",
    nav: "/pricing/",
    body,
    schema: [
      crumbsLd(crumbs),
      {
        "@context": "https://schema.org",
        "@type": "OfferCatalog",
        name: "NSZ Group price list",
        url: abs("/pricing/"),
        itemListElement: cats.map((cat) => ({
          "@type": "OfferCatalog",
          name: cat.title,
          itemListElement: cat.plans.map((p) => ({
            "@type": "Offer",
            name: p.name,
            description: `${p.for}. ${p.features.filter((f) => !f.no).map((f) => f.text).join("; ")}`,
            price: p.price,
            priceCurrency: "ZAR",
            seller: { "@id": ORG_ID },
          })),
        })),
      },
    ],
    priority: "0.9",
  });
}

// ABOUT
{
  const crumbs = [{ name: "Home", href: "/" }, { name: "About", href: "/about/" }];
  const body = `
<section class="page-hero"><div class="wrap">
  ${breadcrumb(crumbs)}
  <p class="eyebrow">About</p>
  <h1>A small Cape Town studio that ships like a big one.</h1>
  <p class="lead">NSZ Group was founded in ${SITE.founded} on a simple idea: small and growing businesses deserve web work that looks and performs like the big players’, without the big-agency price or wait.</p>
</div></section>
<section class="section"><div class="wrap split">
  <dl class="facts split-sticky">
    <div><dt>Company</dt><dd>${SITE.legalName}</dd></div>
    <div><dt>Founded</dt><dd>${SITE.founded}</dd></div>
    <div><dt>Based in</dt><dd>${SITE.city}, ${SITE.region}</dd></div>
    <div><dt>Works with</dt><dd>Businesses across South Africa</dd></div>
    <div><dt>Services</dt><dd>Websites, web apps, e-commerce, branding, social media, hosting, networking, CCTV</dd></div>
    <div><dt>Hours</dt><dd>${SITE.hours}</dd></div>
  </dl>
  <div class="prose">
    <h2>What we do</h2>
    <p>We design and build websites, online stores and web apps, and we set up the technology a business runs on: domains, hosting, business email, office networks and CCTV. Clients get one team and one point of contact for all of it.</p>
    <h2>How we build</h2>
    <p>Every site is hand-coded in clean HTML, CSS and JavaScript, so it loads fast and you own the code. When a project needs accounts, bookings or a database, we build on Supabase. Payments run through PayFast for South African customers or Stripe for international cards, and sites are deployed on Netlify or Vercel.</p>
    <p>We use AI tools to speed up production, which keeps delivery fast and prices lower. Every design decision and every line that ships is still checked by a person.</p>
    <h2>Why local matters</h2>
    <p>We know the South African setup: PayFast, .co.za domains, POPIA-compliant contact forms and the business registration steps a new company needs. When you need us, we’re reachable by phone or WhatsApp during business hours.</p>
    <h2>What we’ve built</h2>
    <p>Our portfolio covers artist and service websites, streetwear e-commerce, a peer-to-peer storage marketplace, a freelancer marketplace, food ordering platforms, a children’s streaming hub and an AI sales-coaching tool. <a href="/work/">See the work</a>.</p>
  </div>
</div></section>
<section class="section" aria-labelledby="why-title"><div class="wrap">
  <div class="section-head"><p class="eyebrow">What you can expect</p><h2 id="why-title" class="h2">How we treat every project.</h2></div>
  <ul class="reasons">${REASONS.map((r) => `<li><h3>${r.title}</h3><p>${r.text}</p></li>`).join("")}</ul>
</div></section>
${ctaBand()}`;
  pages.push({
    path: "/about/",
    file: "about/index.html",
    title: "About NSZ Group | Cape Town Web & IT Studio, Est. 2024",
    description: "NSZ Group (Pty) Ltd is a Cape Town web and IT studio, founded in 2024, building hand-coded websites, online stores and IT systems for South African firms.",
    nav: "/about/",
    body,
    schema: [crumbsLd(crumbs), { "@context": "https://schema.org", "@type": "AboutPage", url: abs("/about/"), name: "About NSZ Group", about: { "@id": ORG_ID } }],
    priority: "0.7",
  });
}

// CONTACT
{
  const crumbs = [{ name: "Home", href: "/" }, { name: "Contact", href: "/contact/" }];
  const serviceOptions = ["A website", "A web app", "An online store", "Logo or branding", "Posters or design", "Social media management", "Hosting, domains or email", "Networking or CCTV", "Something else"];
  const body = `
<section class="page-hero"><div class="wrap">
  ${breadcrumb(crumbs)}
  <p class="eyebrow">Contact</p>
  <h1>Start a project with NSZ Group.</h1>
  <p class="lead">Tell us what you need. We reply with next steps and a fixed quote, usually within one business day.</p>
</div></section>
<section class="section"><div class="wrap contact-grid">
  <form class="form" id="contact-form" name="contact" method="POST" action="/contact/thanks/" data-netlify="true" netlify-honeypot="company_website" novalidate>
    <input type="hidden" name="form-name" value="contact">
    <p class="hp"><label>Leave this empty <input name="company_website" tabindex="-1" autocomplete="off"></label></p>
    <div class="field-row">
      <div class="field">
        <label for="f-name">Your name</label>
        <input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="f-name-err">
        <p class="field-error" id="f-name-err" hidden></p>
      </div>
      <div class="field">
        <label for="f-company">Business name <span class="opt">(optional)</span></label>
        <input id="f-company" name="company" type="text" autocomplete="organization">
      </div>
    </div>
    <div class="field-row">
      <div class="field">
        <label for="f-email">Email</label>
        <input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="f-email-err">
        <p class="field-error" id="f-email-err" hidden></p>
      </div>
      <div class="field">
        <label for="f-phone">Phone or WhatsApp <span class="opt">(optional)</span></label>
        <input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel">
      </div>
    </div>
    <div class="field">
      <label for="f-service">What do you need?</label>
      <select id="f-service" name="service">
        ${serviceOptions.map((o) => `<option>${o}</option>`).join("")}
      </select>
    </div>
    <div class="field">
      <label for="f-message">Project details</label>
      <textarea id="f-message" name="message" required aria-describedby="f-message-help f-message-err"></textarea>
      <p class="field-help" id="f-message-help">A few lines is enough: what it’s for, any sites you like, and when you need it.</p>
      <p class="field-error" id="f-message-err" hidden></p>
    </div>
    <div class="form-foot">
      <button class="btn btn-primary" type="submit">Send enquiry ${arrow}</button>
      <p>We only use your details to reply. <a href="/privacy/">Privacy policy</a>.</p>
    </div>
    <p class="form-status" id="form-status" role="status" aria-live="polite"></p>
  </form>
  <aside class="aside-card" aria-label="Other ways to reach us">
    <h2>Prefer to talk?</h2>
    <ul class="contact-lines light">
      <li><span class="k">WhatsApp</span><a href="${SITE.whatsapp}" rel="noopener">${SITE.phoneDisplay}</a></li>
      <li><span class="k">Phone</span><a href="tel:${SITE.tel}">${SITE.phoneDisplay}</a></li>
      <li><span class="k">Email</span><a href="mailto:${SITE.email}">${SITE.email}</a></li>
      <li><span class="k">Hours</span><span class="v">${SITE.hours}</span></li>
      <li><span class="k">Based in</span><span class="v">${SITE.city}, South Africa</span></li>
    </ul>
    <h2>What happens next</h2>
    <ol class="next-steps">
      <li>We read your message and reply, usually within one business day.</li>
      <li>A short call or WhatsApp chat to pin down what you need.</li>
      <li>You get a written plan and a fixed quote before any work starts.</li>
    </ol>
  </aside>
</div></section>`;
  pages.push({
    path: "/contact/",
    file: "contact/index.html",
    title: "Contact NSZ Group | Get a Website or IT Quote in Cape Town",
    description: `Get a quote for a website, online store, branding or IT work. WhatsApp or call ${SITE.phoneDisplay}, or email ${SITE.email}. Based in Cape Town.`,
    nav: "/contact/",
    body,
    schema: [crumbsLd(crumbs), { "@context": "https://schema.org", "@type": "ContactPage", url: abs("/contact/"), name: "Contact NSZ Group", about: { "@id": ORG_ID } }],
    scripts: `<script src="/assets/js/contact.js?v=${TODAY.replace(/-/g, "")}" defer></script>`,
    priority: "0.8",
  });

  pages.push({
    path: "/contact/thanks/",
    file: "contact/thanks/index.html",
    title: "Thanks, message received | NSZ Group",
    description: "Thanks for contacting NSZ Group. We usually reply within one business day.",
    nav: "/contact/",
    noindex: true,
    sitemap: false,
    body: `<section class="notfound"><div class="wrap">
  <p class="eyebrow">Message sent</p>
  <h1 class="display">Thanks, we’ve got your message.</h1>
  <p class="lead">We usually reply within one business day. Need us sooner? WhatsApp ${SITE.phoneDisplay}.</p>
  <div class="actions"><a class="btn btn-primary" href="/">Back to home</a><a class="btn btn-secondary" href="${SITE.whatsapp}" rel="noopener">WhatsApp us</a></div>
</div></section>`,
  });
}

// PRIVACY
{
  const crumbs = [{ name: "Home", href: "/" }, { name: "Privacy policy", href: "/privacy/" }];
  const body = `
<section class="page-hero"><div class="wrap">
  ${breadcrumb(crumbs)}
  <p class="eyebrow">Legal</p>
  <h1>Privacy policy</h1>
  <p class="lead">How ${SITE.legalName} collects, uses and protects personal information, in line with the Protection of Personal Information Act (POPIA). Last updated ${new Date(TODAY).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}.</p>
</div></section>
<section class="section"><div class="wrap">
  <div class="prose">
    <h2>1. Who we are</h2>
    <p>${SITE.legalName} (“NSZ Group”, “we”, “us”) is a web and IT services company based in ${SITE.city}, South Africa. We are the responsible party for personal information collected through nszgroup.co.za.</p>
    <h2>2. Information we collect</h2>
    <ul>
      <li><strong>Information you give us</strong>: your name, email address, phone number, business name and project details when you use our contact form, email us or message us on WhatsApp.</li>
      <li><strong>Project and billing information</strong>: requirements, timelines, budgets and invoicing details when you become a client. Card payments are handled by third-party payment providers; we never store full card details.</li>
      <li><strong>Technical information</strong>: our hosting provider records standard server logs (such as IP address, browser type and pages requested) for security and reliability.</li>
    </ul>
    <h2>3. Cookies and tracking</h2>
    <p>This website does not use analytics, advertising or tracking cookies. Our pages load fonts from Google Fonts, which means your browser connects to Google’s servers and shares your IP address with Google when you visit.</p>
    <h2>4. How we use your information</h2>
    <ul>
      <li>To reply to enquiries and prepare quotes.</li>
      <li>To deliver, host and support the services you hire us for.</li>
      <li>To send invoices and keep records required by South African law.</li>
    </ul>
    <p>We process personal information on the basis of your consent, to perform a contract with you, to comply with legal obligations, or for our legitimate business interests, as allowed by POPIA.</p>
    <h2>5. Who we share it with</h2>
    <p>We do not sell personal information. We share it only with service providers who help us run our business, such as our website host (Netlify), email provider, payment processors and, where a project requires it, the database provider used to build your system (Supabase). We also share information when the law requires it. Some of these providers store data outside South Africa; we only use providers with adequate data-protection safeguards.</p>
    <h2>6. How long we keep it</h2>
    <p>We keep enquiry information only as long as needed to respond and follow up. Client and financial records are kept for as long as tax and company law require.</p>
    <h2>7. Security</h2>
    <p>We use reasonable technical and organisational measures to protect personal information, including encrypted connections (HTTPS), access controls and reputable hosting providers. No method of transmission over the internet is completely secure. If a data breach affects your information, we will notify you and the Information Regulator as POPIA requires.</p>
    <h2>8. Your rights</h2>
    <p>Under POPIA you may ask us to confirm what personal information we hold about you, correct or delete it, object to its processing, or withdraw consent. You may also lodge a complaint with the Information Regulator (South Africa) at <a href="https://inforegulator.org.za" rel="noopener">inforegulator.org.za</a>.</p>
    <h2>9. PAIA manual and Information Officer</h2>
    <p>Our Promotion of Access to Information Act (PAIA) manual is available on request. To make a request or to contact our Information Officer, email <a href="mailto:${SITE.email}">${SITE.email}</a> or call <a href="tel:${SITE.tel}">${SITE.phoneDisplay}</a>.</p>
    <h2>10. Links to other websites</h2>
    <p>Our site links to projects we have built and to third-party services. We are not responsible for the privacy practices of those websites.</p>
    <h2>11. Changes to this policy</h2>
    <p>We may update this policy from time to time. The latest version will always be on this page with its updated date.</p>
  </div>
</div></section>`;
  pages.push({
    path: "/privacy/",
    file: "privacy/index.html",
    title: "Privacy Policy | NSZ Group (Pty) Ltd",
    description: "How NSZ Group (Pty) Ltd collects, uses and protects personal information under South Africa’s Protection of Personal Information Act (POPIA).",
    nav: "",
    body,
    schema: [crumbsLd(crumbs)],
    priority: "0.3",
  });
}

// 404
pages.push({
  path: "/404.html",
  file: "404.html",
  title: "Page not found | NSZ Group",
  description: "This page doesn’t exist. Try the NSZ Group homepage, services or pricing.",
  nav: "",
  noindex: true,
  sitemap: false,
  body: `<section class="notfound"><div class="wrap">
  <p class="code">404</p>
  <h1 class="display">This page doesn’t exist.</h1>
  <p class="lead">It may have moved when we rebuilt the site. These links should get you where you need to go.</p>
  <div class="actions"><a class="btn btn-primary" href="/">Home</a><a class="btn btn-secondary" href="/services/">Services</a><a class="btn btn-secondary" href="/pricing/">Pricing</a><a class="btn btn-secondary" href="/contact/">Contact</a></div>
</div></section>`,
});

/* ---------------- write pages ---------------- */
for (const p of pages) {
  const out = join(ROOT, p.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, layout(p));
}

/* ---------------- sitemap / robots ---------------- */
const sitemapPages = pages.filter((p) => p.sitemap !== false && !p.noindex);
writeFileSync(
  join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages.map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${TODAY}</lastmod><priority>${p.priority || "0.5"}</priority></url>`).join("\n")}
</urlset>
`
);

const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot", "Meta-ExternalAgent", "Amazonbot", "DuckAssistBot", "MistralAI-User", "cohere-ai"];
writeFileSync(
  join(ROOT, "robots.txt"),
  `# NSZ Group — nszgroup.co.za
# Search engines and AI assistants are welcome to crawl and cite this site.
# A plain-text summary for language models is at /llms.txt (full version: /llms-full.txt).

User-agent: *
Allow: /
Disallow: /_build/
Disallow: /contact/thanks/

${AI_BOTS.map((b) => `User-agent: ${b}\nAllow: /\nDisallow: /_build/`).join("\n\n")}

Sitemap: ${abs("/sitemap.xml")}
`
);

/* ---------------- llms.txt / llms-full.txt ---------------- */
const contactMd = `- Phone / WhatsApp: ${SITE.phoneIntl} (${SITE.whatsapp})
- Email: ${SITE.email}
- Location: ${SITE.city}, ${SITE.region}, South Africa (works with clients across South Africa)
- Hours: ${SITE.hours}
- Quote form: ${abs("/contact/")}`;

writeFileSync(
  join(ROOT, "llms.txt"),
  `# NSZ Group

> ${SITE.description}

${SITE.legalName} is a web and IT studio in ${SITE.city}, South Africa, founded in ${SITE.founded}. It designs and hand-codes websites and web apps, builds online stores with PayFast or Stripe checkout, does logo, poster and social media design, and sets up hosting, domains, business email, office networks and CCTV. Prices are published in South African Rand.

## Contact
${contactMd}

## Services
${SERVICES.map((s) => `- [${s.name}](${abs(`/services/${s.slug}/`)}): ${s.summary} ${s.fromLabel}.`).join("\n")}

## Key pages
- [Pricing](${abs("/pricing/")}): full price list for websites, e-commerce, branding, posters and social media
- [Work](${abs("/work/")}): portfolio of websites, stores and web apps
- [About](${abs("/about/")}): company facts and how NSZ Group builds
- [Contact](${abs("/contact/")}): quote form, phone, WhatsApp and email

## Optional
- [Full content for LLMs](${abs("/llms-full.txt")}): every price, service detail, project and FAQ in one Markdown file
- [Privacy policy](${abs("/privacy/")})
`
);

const allFaqs = [...HOME_FAQS, ...SERVICES.flatMap((s) => s.faqs)];
writeFileSync(
  join(ROOT, "llms-full.txt"),
  `# NSZ Group — full site content

> ${SITE.description}

Source: ${SITE.url}/ · Last updated: ${TODAY} · All prices in South African Rand (ZAR).

## Company facts
- Legal name: ${SITE.legalName}
- Founded: ${SITE.founded}
- Based in: ${SITE.city}, ${SITE.region}, South Africa
- Serves: businesses in Cape Town and across South Africa
- Builds with: hand-coded HTML, CSS and JavaScript; TypeScript; Supabase for accounts and databases; PayFast and Stripe for payments; Netlify and Vercel for hosting
${contactMd}

## Services
${SERVICES.map(
  (s) => `### ${s.name}
URL: ${abs(`/services/${s.slug}/`)}

${s.lead}

${s.groups.map((g) => `**${g.title}**\n${g.items.map((i) => `- ${i}`).join("\n")}`).join("\n\n")}
${s.quoteNote ? `\nPricing: ${s.quoteNote}` : `\nPricing: ${s.fromLabel}. See the price list below.`}
`
).join("\n")}
## Price list
${Object.values(PRICING)
  .map(
    (cat) => `### ${cat.title}
${cat.intro}

| Package | Price | Billing | Best for | Includes |
|---|---|---|---|---|
${cat.plans
  .map((p) => `| ${p.name} | ${randPlain(p.price)} | ${p.unit} | ${p.for} | ${p.features.filter((f) => !f.no).map((f) => f.text).join("; ")} |`)
  .join("\n")}
`
  )
  .join("\n")}
Custom web apps are quoted per project. Networking and CCTV are quoted after a site survey.

## Portfolio
${[...PROJECTS, ...MORE_PROJECTS].map((p) => `- **${p.name}** (${p.type}): ${p.summary}${p.stack ? ` Built with ${p.stack}.` : ""}${p.url ? ` Live: ${p.url}` : ""}`).join("\n")}

## How a project works
${STEPS.map((s, i) => `${i + 1}. **${s.title}**: ${s.text}`).join("\n")}

## Frequently asked questions
${allFaqs.map((f) => `**${f.q}**\n${f.a}`).join("\n\n")}
`
);

console.log(`Built ${pages.length} pages, sitemap.xml, robots.txt, llms.txt, llms-full.txt`);
