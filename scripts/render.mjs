import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const site = "https://www.infralyte.in";
const year = new Date().getFullYear();

const brand = {
  legalName: "Infralyte Technologies",
  phoneDisplay: "+91 6265 040 463",
  phoneTel: "+916265040463",
  email: "hello@infralyte.in",
  hiringEmail: "hr@infralyte.in",
  gstin: "22BREPA1247F1ZK",
  studio: "Raipur, Chhattisgarh, India",
  registeredOffice:
    "Akhrabhatha, Ward No. 10, C/O Natwar Lal Agrawal, Sakti, District Sakti, Chhattisgarh 495689, India",
};

const markSvg = `<svg class="mark-glyph" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="12" fill="#d7b56d"/>
        <path fill="#0a0b09" d="M18 13h28v6.2H37.2V44.8H46V51H18v-6.2h8.8V19.2H18z"/>
      </svg>`;

const icons = {
  document: `<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h4"/>`,
  product: `<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/><path d="M8 11l2 2 4-4"/>`,
  operations: `<path d="M4 7h10M4 12h7M4 17h12"/><circle cx="18" cy="7" r="2"/><circle cx="15" cy="12" r="2"/>`,
  analytics: `<path d="M4 19V5M4 19h16"/><path d="M8 15l4-6 3 4 4-7"/>`,
  private: `<rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/><path d="M12 14v2"/>`,
  rescue: `<path d="M12 3l9 16H3z"/><path d="M12 9v5M12 16.5v.5"/>`,
  check: `<path d="M20 6 9 17l-5-5"/>`,
  cross: `<path d="M18 6 6 18M6 6l12 12"/>`,
};

const offers = [
  {
    slug: "document-intelligence",
    kicker: "01",
    icon: "document",
    name: "Document Intelligence",
    summary:
      "Citation-backed search, extraction, and working notes over the files a practice already lives in.",
    pilot: "A 2–4 week citation-backed document search or extraction pilot.",
    body: [
      "Most professional firms do not have a data problem. They have a pile-of-PDFs problem: ledgers, notices, contracts, case files, SOPs, and working papers that only a few people can actually find.",
      "Document Intelligence is not a chatbot over a drive. It is a bounded workflow: retrieve the right passage, keep the citation, draft the working note, and leave the judgement with the qualified human.",
      "This is usually the first credible AI step for chartered accountants, lawyers, and any operation whose work is still trapped in documents.",
    ],
    fits: ["Ledgers, GST notices, audit papers", "Contracts, pleadings, evidence", "Policies, SOPs, case files"],
    not: ["Autonomous filing or legal advice", "Uncited answers presented as fact"],
  },
  {
    slug: "product-layer",
    kicker: "02",
    icon: "product",
    name: "AI Product Layer",
    summary:
      "A copilot or workflow assistant inside a product you already ship — not a widget bolted on the side.",
    pilot: "A 2–4 week embedded copilot or workflow-assistant pilot.",
    body: [
      "If you already have a portal, API, or SaaS workflow, the highest-leverage move is often to put assistance inside that product rather than standing up a separate tool nobody opens.",
      "We work against your existing permissions, tenants, and evaluation bar. Claims get measured. The pilot is one workflow, not a platform rewrite.",
    ],
    fits: ["B2B SaaS and internal portals", "Support, onboarding, and docs search", "Workflow agents over existing APIs"],
    not: ["A generic chatbot with your logo", "Unbounded agents with production write access on day one"],
  },
  {
    slug: "operations",
    kicker: "03",
    icon: "operations",
    name: "AI Operations Automation",
    summary:
      "One measurable back-office workflow: email, spreadsheet, ticket, or intake, with a human in the loop.",
    pilot: "A 2–4 week human-in-the-loop automation of one measurable workflow.",
    body: [
      "Operations AI is for the work that already repeats: routing, reconciliation, drafting, classification, and follow-up. We pick one workflow, count the hours, and keep a person on the consequential step.",
      "The point is not to remove the operator. It is to stop using a skilled person as the copy-paste layer.",
    ],
    fits: ["Email and ticket triage", "Spreadsheet and ledger reconciliation", "Intake, onboarding, and exception routing"],
    not: ["Lights-out process replacement", "Unattended changes to money, filings, or customer records"],
  },
  {
    slug: "analytics",
    kicker: "04",
    icon: "analytics",
    name: "AI Analytics",
    summary: "One operational dataset, one decision: forecast, anomaly, inventory, production, or reporting.",
    pilot: "A focused analytics pilot over one operational dataset and business decision.",
    body: [
      "Analytics work fails when it tries to be a new data platform. We start from a decision someone already makes every week, and from the dataset they already trust enough to argue about.",
      "The deliverable is a measured improvement on that decision — not a dashboard nobody owns.",
    ],
    fits: [
      "Demand, inventory, and production",
      "Anomaly review and exception queues",
      "Reporting that still requires a human synthesis step",
    ],
    not: ["A second copy of your warehouse", "Predictions without an owner and a threshold"],
  },
  {
    slug: "private-ai",
    kicker: "05",
    icon: "private",
    name: "Private AI Infrastructure",
    summary: "Frontier models when they fit. Private models when data cannot leave.",
    pilot: "A private-model benchmark on representative, sanitized sample data.",
    body: [
      "Some work can use a frontier model. Some work cannot leave the building. Pretending those are the same thing is how projects get blocked by legal, security, or a partner who will not share a ledger.",
      "Private AI Infrastructure is the path for confidential client files, regulated records, and any workflow where the deployment model is part of the product.",
      "We benchmark on sanitized samples first. Production stays customer-controlled.",
    ],
    fits: [
      "Client files that cannot leave the firm",
      "Healthcare, tax, legal, and other regulated records",
      "Air-gapped or customer-managed model hosting",
    ],
    not: [
      "Shipping confidential samples to a public model to “just try it”",
      "A private-cloud sticker on an otherwise public pipeline",
    ],
  },
  {
    slug: "rescue",
    kicker: "06",
    icon: "rescue",
    name: "AI Rescue",
    summary: "The model is already in production and it is expensive, slow, or untrustworthy.",
    pilot: "A measured reliability and cost audit with a production remediation plan.",
    body: [
      "A surprising number of AI projects do not need a new model. They need evaluations, guardrails, retrieval that actually cites, latency that a user will wait for, and a cost curve someone can defend.",
      "AI Rescue is for teams who already shipped something and now have to live with it.",
    ],
    fits: [
      "Hallucinations in a customer-facing flow",
      "Token cost and latency that broke the unit economics",
      "Missing evaluations, permissions, or fallback behaviour",
    ],
    not: ["A silent rewrite of a working system", "Replacing a vendor without measuring the current baseline"],
  },
];

const offerBySlug = new Map(offers.map((offer) => [offer.slug, offer]));

const industries = [
  {
    id: "ca-tax",
    index: "01",
    name: "Chartered accountancy, tax, and audit",
    short: "Chartered accountancy, tax &amp; audit",
    tile: "Ledgers, GST notices, working notes.",
    text: "Document search, GST and ledger assistance, notice working notes, deadline monitoring. A chartered accountant still reviews conclusions and filings.",
    offers: ["document-intelligence", "operations"],
  },
  {
    id: "legal",
    index: "02",
    name: "Legal practices and law firms",
    short: "Legal practices &amp; law firms",
    tile: "Matter search with citations, chronologies.",
    text: "Matter search with citations, chronologies, contract comparison, intake. Lawyers retain advice, strategy, and filings. Confidential matters stay private.",
    offers: ["document-intelligence", "private-ai"],
  },
  {
    id: "manufacturing",
    index: "03",
    name: "Manufacturing and distribution",
    short: "Manufacturing &amp; distribution",
    tile: "Inventory, reconciliation, quality exceptions.",
    text: "Inventory and demand analytics, PO and invoice reconciliation, quality exceptions, SOP assistance. Operational actions keep human escalation.",
    offers: ["analytics", "operations"],
  },
  {
    id: "healthcare",
    index: "04",
    name: "Healthcare and diagnostics",
    short: "Healthcare &amp; diagnostics",
    tile: "Record retrieval and admin workflows.",
    text: "Record retrieval, administrative claims assistance, scheduling workflows. No autonomous diagnosis or treatment. Patient data stays private and audited.",
    offers: ["private-ai", "document-intelligence"],
  },
  {
    id: "logistics",
    index: "05",
    name: "Logistics and transport",
    short: "Logistics &amp; transport",
    tile: "Exception routing and document packs.",
    text: "Exception routing, document packs, and operational reporting over the systems you already run.",
    offers: ["operations", "analytics"],
  },
  {
    id: "real-estate",
    index: "06",
    name: "Real estate",
    short: "Real estate",
    tile: "Listing, document and enquiry workflows.",
    text: "Listing, document, and enquiry workflows — including the local-market work we already know from building our own property product.",
    offers: ["product-layer", "operations"],
  },
  {
    id: "education",
    index: "07",
    name: "Education and training",
    short: "Education &amp; training",
    tile: "Knowledge and assessment support.",
    text: "Knowledge assistance, assessment support, and operations around the programmes you already deliver.",
    offers: ["document-intelligence", "product-layer"],
  },
  {
    id: "recruitment",
    index: "08",
    name: "Recruitment and staffing",
    short: "Recruitment &amp; staffing",
    tile: "Intake and screening assistance.",
    text: "Intake, screening assistance, and knowledge over roles and candidates — with a human on every consequential decision.",
    offers: ["operations", "document-intelligence"],
  },
  {
    id: "financial",
    index: "09",
    name: "Financial services and insurance",
    short: "Financial services &amp; insurance",
    tile: "Document-heavy review, private deployment.",
    text: "Document-heavy review, reporting assistance, and private deployment where customer data cannot travel.",
    offers: ["private-ai", "document-intelligence"],
  },
  {
    id: "saas",
    index: "10",
    name: "B2B SaaS and technology-enabled services",
    short: "B2B SaaS &amp; tech services",
    tile: "Embedded copilots, docs search, rescue.",
    text: "Embedded copilots, docs search, support assistance, and rescue work when an existing AI feature is not holding up.",
    offers: ["product-layer", "rescue"],
  },
];

const steps = [
  ["01", "Public research", "We read what your organisation already publishes. Exact quotes, with URLs. Inference is labelled as a hypothesis."],
  ["02", "Opportunity Scan", "A one-page recommendation: build, buy, or skip. One workflow. One offer."],
  ["03", "Capped discovery", "Used only when public evidence is not enough and deeper access is required."],
  ["04", "2–4 week pilot", "Fixed scope. A qualified human stays in the loop. Success is a measured workflow, not a slide."],
  ["05", "Production", "Rollout, private deployment where needed, and managed support after the pilot holds."],
];

const roles = [
  ["Backend Developer", "APIs, data stores, and the unglamorous path from a pilot to something that stays up."],
  ["Full-stack Developer", "Interfaces and services for scans, pilots, and internal tools."],
  ["Data Engineer", "Pipelines, retrieval corpora, and the evidence layer behind Document Intelligence."],
  ["AI / ML Engineer", "Evaluations, private-model serving, and the difference between a demo and a workflow."],
];

/* ───────────── helpers ───────────── */

function escape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pathParts(pathname) {
  if (pathname === "/" || pathname === "/404.html") return [];
  return pathname.replace(/\/$/, "").split("/").filter(Boolean);
}

function rel(fromPath, toPath) {
  if (!toPath.startsWith("/")) return toPath;
  const from = pathParts(fromPath);
  const to = pathParts(toPath);
  let index = 0;
  while (index < from.length && index < to.length && from[index] === to[index]) {
    index += 1;
  }
  const up = "../".repeat(from.length - index);
  const down = to.slice(index).join("/");
  const trailing = toPath.endsWith("/") || toPath === "/" ? "/" : "";
  if (!up && !down) return trailing === "/" ? "./" : toPath.split("/").pop();
  return `${up}${down}${down ? trailing : ""}` || "./";
}

// Links and assets are rewritten relative to the page so the tree can be served
// from any base path. Form targets stay root-absolute: they resolve against the
// Pages Function route, and a relative "contact" would post to /contact/contact.
function rebase(fromPath, html) {
  return html.replace(/(href|src)="(\/[^"]*)"/g, (_, attr, target) => {
    return `${attr}="${rel(fromPath, target)}"`;
  });
}

/* ───────────── shared blocks ───────────── */

function navItems(path) {
  return [
    ["/approach/", "Approach"],
    ["/offers/", "Offers"],
    ["/industries/", "Industries"],
    ["/scan/", "Scan"],
    ["/careers/", "Careers"],
  ]
    .map(([href, label]) => {
      const current = path === href || path.startsWith(href);
      return `<a href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a>`;
    })
    .join("");
}

function offerCard(offer) {
  return `
        <a class="card" href="/offers/${offer.slug}/">
          <span class="card-num" aria-hidden="true">${offer.kicker}</span>
          <span class="card-ico" aria-hidden="true"><svg viewBox="0 0 24 24">${icons[offer.icon]}</svg></span>
          <h3>${escape(offer.name)}</h3>
          <p>${escape(offer.summary)}</p>
          <span class="card-more">Read the offer <em aria-hidden="true">→</em></span>
        </a>`;
}

function offerCards(list = offers) {
  return `<div class="cards" data-reveal>${list.map(offerCard).join("")}</div>`;
}

function pathTimeline() {
  return `<ol class="path" data-reveal>${steps
    .map(
      ([num, title, text]) => `
        <li class="path-step">
          <span class="path-num" aria-hidden="true">${num}</span>
          <h3>${escape(title)}</h3>
          <p>${escape(text)}</p>
        </li>`,
    )
    .join("")}</ol>`;
}

function industryTiles() {
  return `<div class="tiles" data-reveal>${industries
    .map(
      (item) => `
        <a class="tile" href="/industries/#${item.id}">
          <span class="tile-ico" aria-hidden="true">${item.index}</span>
          <h4>${item.short}</h4>
          <p>${escape(item.tile)}</p>
        </a>`,
    )
    .join("")}</div>`;
}

function ruleList(items, kind) {
  const icon = kind === "yes" ? icons.check : icons.cross;
  const label = kind === "yes" ? "Included" : "Excluded";
  return `<ul class="rule-list">${items
    .map(
      (item) => `
          <li class="is-${kind}"><svg viewBox="0 0 24 24" role="img" aria-label="${label}">${icon}</svg><span>${escape(item)}</span></li>`,
    )
    .join("")}</ul>`;
}

function ctaBand({ title, text, label = "Contact Infralyte", href = "/contact/" }) {
  return `
  <section class="section section-cta">
    <div class="wrap-wide">
      <div class="cta-band" data-reveal>
        <span class="cta-shine" aria-hidden="true"></span>
        <div class="cta-copy">
          <h2>${title}</h2>
          <p>${escape(text)}</p>
        </div>
        <div class="cta-actions">
          <a class="btn btn-primary btn-lg" href="${href}">${escape(label)} <span class="btn-arrow" aria-hidden="true">→</span></a>
          <a class="cta-mail" href="mailto:${brand.email}">${brand.email}</a>
        </div>
      </div>
    </div>
  </section>`;
}

function pageHero({ eyebrow, title, lede, actions = "" }) {
  return `
  <section class="page-hero">
    <div class="wrap-wide">
      <p class="eyebrow">${escape(eyebrow)}</p>
      <h1>${title}</h1>
      ${lede ? `<p class="lede">${lede}</p>` : ""}
      ${actions ? `<div class="actions">${actions}</div>` : ""}
    </div>
  </section>`;
}

function layout({ path, title, description, body }) {
  const canonical = `${site}${path === "/404.html" ? "/404.html" : path}`;
  const fullTitle =
    path === "/" ? "Infralyte Technologies — AI in the work you already run" : `${title} — Infralyte`;
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(fullTitle)}</title>
  <meta name="description" content="${escape(description)}">
  <meta name="theme-color" content="#080907">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${escape(fullTitle)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="${escape(brand.legalName)}">
  <meta property="og:image" content="${site}/og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${site}/og.png">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
  <link rel="stylesheet" href="https://fonts.bunny.net/css?family=figtree:400,500,600,700|fraunces:460,560|ibm-plex-mono:400,500">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: brand.legalName,
    alternateName: "Infralyte",
    url: site,
    logo: `${site}/favicon.svg`,
    image: `${site}/og.png`,
    email: brand.email,
    telephone: brand.phoneTel,
    vatID: brand.gstin,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Akhrabhatha, Ward No. 10, C/O Natwar Lal Agrawal",
      addressLocality: "Sakti",
      addressRegion: "Chhattisgarh",
      postalCode: "495689",
      addressCountry: "IN",
    },
    areaServed: "Worldwide",
    numberOfEmployees: { "@type": "QuantitativeValue", minValue: 8, maxValue: 12 },
    description,
  })}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" data-header>
    <div class="wrap-wide header-inner">
      <a class="mark" href="/">
        ${markSvg}
        Infralyte
      </a>
      <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">
        <span></span><span></span>
      </button>
      <nav class="nav" id="site-nav" data-nav aria-label="Primary">
        ${navItems(path)}
        <a class="btn btn-primary btn-sm" href="/contact/">Talk to us</a>
      </nav>
    </div>
  </header>
  <main id="main">${body}</main>
  <footer class="site-footer">
    <div class="wrap-wide footer-grid">
      <div class="footer-brand">
        <a class="mark" href="/">
          ${markSvg}
          Infralyte
        </a>
        <p>We build AI into existing products and operations. Frontier models when they fit, private models when data cannot leave.</p>
      </div>
      <div class="footer-col">
        <h2>Work</h2>
        <a href="/offers/">Offers</a>
        <a href="/approach/">How we work</a>
        <a href="/scan/">Opportunity Scan</a>
        <a href="/industries/">Industries</a>
      </div>
      <div class="footer-col">
        <h2>Company</h2>
        <a href="/careers/">Careers</a>
        <a href="/studio/">Studio</a>
        <a href="/legal/">Legal</a>
        <a href="/privacy/">Privacy</a>
        <a href="/unsubscribe/">Unsubscribe</a>
      </div>
      <div class="footer-col">
        <h2>Contact</h2>
        <a href="mailto:${brand.email}">${brand.email}</a>
        <a href="tel:${brand.phoneTel}">${brand.phoneDisplay}</a>
        <span>Studio · ${escape(brand.studio)}</span>
      </div>
    </div>
    <div class="wrap-wide legal">
      <span>© ${year} ${escape(brand.legalName)}. GSTIN ${brand.gstin}.</span>
      <span>${escape(brand.registeredOffice)}</span>
    </div>
  </footer>
  <script src="/site.js" defer></script>
</body>
</html>
`;
}

const pages = [];

function add(path, title, description, body) {
  pages.push({ path, title, description, body });
}

/* ───────────── home ───────────── */

add(
  "/",
  "Infralyte",
  "Infralyte builds AI into existing products and operations — frontier models when they fit, private models when data cannot leave.",
  `
  <section class="hero">
    <div class="hero-bg" aria-hidden="true">
      <span class="aurora aurora-1"></span>
      <span class="aurora aurora-2"></span>
      <span class="aurora aurora-3"></span>
      <span class="grid-fade"></span>
    </div>
    <div class="wrap-wide hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">Infralyte Technologies · Raipur studio / worldwide</p>
        <h1>AI, built into<br>the work you<br><em>already run.</em></h1>
        <p class="lede">We research how a business actually operates, name one bounded workflow worth changing, and prove it in a two-to-four week pilot. We use AI to build AI, so work that used to take a quarter can ship in weeks.</p>
        <div class="actions">
          <a class="btn btn-primary" href="/scan/">Request an Opportunity Scan <span class="btn-arrow" aria-hidden="true">→</span></a>
          <a class="btn btn-ghost" href="/approach/">See how we work</a>
        </div>
        <p class="hero-proof"><span class="dot" aria-hidden="true"></span> No transformation theatre &nbsp;·&nbsp; No bulk email &nbsp;·&nbsp; Private models when data cannot leave</p>
      </div>
      <figure class="artifact">
        <span class="artifact-glow" aria-hidden="true"></span>
        <div class="artifact-inner">
          <div class="artifact-top">
            <span class="artifact-title">Opportunity Scan</span>
            <span class="artifact-note">Example output</span>
          </div>
          <div class="artifact-row">
            <p class="artifact-label">Public evidence</p>
            <p class="artifact-value">Pages read, with exact quotes kept</p>
            <div class="bar" aria-hidden="true"><span style="--w:88%"></span></div>
          </div>
          <div class="artifact-row">
            <p class="artifact-label">Workflow named</p>
            <p class="artifact-mono">One bounded workflow, start to finish</p>
          </div>
          <div class="artifact-row">
            <p class="artifact-label">Recommendation</p>
            <div class="verdicts">
              <span class="verdict is-on">Build</span>
              <span class="verdict">Buy</span>
              <span class="verdict">Skip</span>
            </div>
          </div>
          <figcaption class="artifact-foot">
            <span>Pilot 2–4 weeks</span>
            <a href="/scan/">How the scan works →</a>
          </figcaption>
        </div>
      </figure>
    </div>
    <div class="wrap-wide">
      <div class="stats" data-reveal>
        <div class="stat"><span class="stat-num">~10</span><span class="stat-label">engineers, one studio</span></div>
        <div class="stat"><span class="stat-num">20+</span><span class="stat-label">software &amp; data engagements</span></div>
        <div class="stat"><span class="stat-num">2–4</span><span class="stat-label">weeks to a measured pilot</span></div>
        <div class="stat"><span class="stat-num">6</span><span class="stat-label">offers, sold one at a time</span></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap-wide">
      <div class="section-head" data-reveal>
        <div>
          <p class="eyebrow">Offers</p>
          <h2>Six offers.<br>One at a time.</h2>
        </div>
        <p class="section-sub">Sales is customized. The platform underneath is reusable. We pick the offer that matches the evidence, not the one that sounds largest.</p>
      </div>
      ${offerCards()}
    </div>
  </section>

  <section class="section section-alt">
    <div class="wrap-wide">
      <div class="section-head" data-reveal>
        <div>
          <p class="eyebrow">How we work</p>
          <h2>A short<br>commercial path.</h2>
        </div>
        <p class="section-sub">We would rather tell you to skip than sell a twelve-month transformation with no first workflow.</p>
      </div>
      ${pathTimeline()}
    </div>
  </section>

  <section class="section">
    <div class="wrap-wide">
      <div class="section-head" data-reveal>
        <div>
          <p class="eyebrow">Industries</p>
          <h2>Built for operators,<br>not a single niche.</h2>
        </div>
        <p class="section-sub">The same method holds for a two-partner CA firm and a product company with an existing platform. The vertical changes. The discipline does not.</p>
      </div>
      ${industryTiles()}
    </div>
  </section>

  <section class="section section-alt">
    <div class="wrap-wide split" data-reveal>
      <div>
        <p class="eyebrow">What is true</p>
        <h2>A compact engineering company with its own private-model lab.</h2>
        <p class="lede">Infralyte Technologies is a services firm of about ten engineers. We have delivered software and data work across 20+ engagements. We do not claim twenty AI transformations, and we do not name confidential customers. Private work can run on our own lab when data cannot leave.</p>
        <figure class="quote">
          <span class="quote-glyph" aria-hidden="true">“</span>
          <blockquote>If a case study cannot be told without a client’s permission, it stays off this site and out of outreach.</blockquote>
          <figcaption>That is a commercial constraint, not a slogan.</figcaption>
        </figure>
      </div>
      <dl class="fact-list">
        <div><dt class="fact-k">Lab</dt><dd class="fact-v">NVIDIA DGX + Apple Silicon</dd></div>
        <div><dt class="fact-k">Deployment</dt><dd class="fact-v">Customer-controlled where required</dd></div>
        <div><dt class="fact-k">Outreach</dt><dd class="fact-v">Reviewed by a human, never bulk</dd></div>
        <div><dt class="fact-k">Evidence</dt><dd class="fact-v">Exact quote and source URL, always</dd></div>
        <div><dt class="fact-k">Decision</dt><dd class="fact-v">A qualified human, every time</dd></div>
      </dl>
    </div>
  </section>
${ctaBand({
  title: "Start with a scan,<br>not a proposal deck.",
  text: "Tell us the organisation and the workflow that hurts. We will tell you whether to build, buy, or skip.",
})}
`,
);

/* ───────────── approach ───────────── */

add(
  "/approach/",
  "How we work",
  "Infralyte’s commercial path: public research, a one-page Opportunity Scan, capped discovery, a 2–4 week pilot, then production.",
  `
${pageHero({
  eyebrow: "Approach",
  title: "Research broadly.<br>Understand vertically.<br><em>Propose one workflow.</em>",
  lede: "Infralyte is an AI transformation practice, not a SaaS-only lead machine. The market is any organisation with document-heavy, repetitive, analytical, or knowledge-intensive work.",
  actions: `<a class="btn btn-primary" href="/scan/">Start with a scan <span class="btn-arrow" aria-hidden="true">→</span></a><a class="btn btn-ghost" href="/offers/">See the six offers</a>`,
})}

  <section class="section">
    <div class="wrap-wide">
      <div class="section-head" data-reveal>
        <div>
          <p class="eyebrow">The path</p>
          <h2>Five steps, in order.</h2>
        </div>
        <p class="section-sub">Each step can end the engagement. That is the point — a clean skip costs you a week, not a quarter.</p>
      </div>
      ${pathTimeline()}
    </div>
  </section>

  <section class="section section-alt">
    <div class="wrap-wide split" data-reveal>
      <div class="prose">
        <h2>What you get</h2>
        <p>A customized recommendation on top of a reusable method. We do not arrive with a single product and then hunt for a place to put it.</p>
        <p>Individual professionals can receive a productized workspace and onboarding. Mid-market organisations receive workflow integrations. Enterprises receive governance, private deployment, SSO, evaluations, and staged rollout.</p>
        <p>We already run document-heavy operations and agentic workflows internally. That is how we stay fast: we use AI to build AI. When a client cannot send data to a public model, the same lab that serves our own work — NVIDIA DGX Spark plus Apple Silicon — is how we prove a private path.</p>
        <p><a class="text-link" href="/scan/">Read the Opportunity Scan →</a></p>
      </div>
      <div>
        <h2>What we will not do</h2>
        ${ruleList(
          [
            "Auto-send outreach, scrape personal inboxes, or buy leaked lists.",
            "Present model guesses as facts.",
            "Replace a CA, lawyer, clinician, or other qualified human on a regulated decision.",
            "Name confidential consulting customers to win a meeting.",
          ],
          "no",
        )}
      </div>
    </div>
  </section>
${ctaBand({
  title: "Bring one workflow.<br>We will tell you if it is worth it.",
  text: "A scan ends in build, buy, or skip. We are comfortable saying skip.",
})}
`,
);

/* ───────────── scan ───────────── */

add(
  "/scan/",
  "AI Opportunity Scan",
  "A one-page AI Opportunity Scan from Infralyte: build, buy, or skip — one bounded workflow, with evidence.",
  `
${pageHero({
  eyebrow: "Productized offer",
  title: "The AI<br>Opportunity Scan.",
  lede: "A one-page recommendation for a single organisation. We tell you whether to build, buy, or skip, and we name one bounded workflow if the answer is build.",
  actions: `<a class="btn btn-primary" href="/contact/">Request a scan <span class="btn-arrow" aria-hidden="true">→</span></a><a class="btn btn-ghost" href="/approach/">How we work</a>`,
})}

  <section class="section">
    <div class="wrap-wide split" data-reveal>
      <div class="prose">
        <h2>Why the scan comes first</h2>
        <p>The scan is how most engagements start. It is cheaper and clearer than a vague discovery month, and more honest than a demo of a tool you did not ask for.</p>
        <p>Where public evidence is enough, the scan stands on cited pages. Where it is not, we will say so and offer capped discovery instead of inventing access we do not have.</p>
        <p>After a scan, the next step is a 2–4 week pilot on one of six offers — or a clean skip.</p>
      </div>
      <dl class="meta-list">
        <div><dt>Output</dt><dd>One page. Build, buy, or skip. One workflow if we recommend a build.</dd></div>
        <div><dt>Evidence</dt><dd>Exact public quotes with URLs. Hypotheses labelled as such.</dd></div>
        <div><dt>Next step</dt><dd>A fixed-scope pilot, private infrastructure, or no project.</dd></div>
        <div><dt>What we need</dt><dd>A public business mailbox, your website, and the workflow that is eating time.</dd></div>
      </dl>
    </div>
  </section>

  <section class="section section-alt">
    <div class="wrap-wide">
      <div class="section-head" data-reveal>
        <div>
          <p class="eyebrow">After the scan</p>
          <h2>One of six offers.</h2>
        </div>
        <p class="section-sub">If the answer is build, the scan names the offer it belongs to. Nothing bundles.</p>
      </div>
      ${offerCards()}
    </div>
  </section>
${ctaBand({
  title: "Ask for a scan.",
  text: "Use a public business mailbox. Tell us the website and the workflow that is eating time.",
  label: "Request a scan",
})}
`,
);

/* ───────────── offers index ───────────── */

add(
  "/offers/",
  "Offers",
  "Infralyte’s six productized AI offers: documents, product layer, operations, analytics, private infrastructure, and rescue.",
  `
${pageHero({
  eyebrow: "Offers",
  title: "Pick one offer.<br>Prove it.<br><em>Then talk about the rest.</em>",
  lede: "Every pilot is two to four weeks and tied to a single workflow. The names below are the only offers we sell first.",
  actions: `<a class="btn btn-primary" href="/scan/">Start with a scan <span class="btn-arrow" aria-hidden="true">→</span></a>`,
})}

  <section class="section">
    <div class="wrap-wide">
      ${offerCards()}
    </div>
  </section>
${ctaBand({
  title: "Not sure which one?",
  text: "That is what the scan is for. We pick the offer that matches the evidence.",
  label: "Request a scan",
  href: "/scan/",
})}
`,
);

/* ───────────── offer detail ───────────── */

offers.forEach((offer, position) => {
  const others = [offers[(position + 1) % offers.length], offers[(position + 2) % offers.length]];
  add(
    `/offers/${offer.slug}/`,
    offer.name,
    offer.summary,
    `
${pageHero({
  eyebrow: `Offer ${offer.kicker}`,
  title: escape(offer.name),
  lede: escape(offer.summary),
  actions: `<a class="btn btn-primary" href="/contact/">Start with a scan <span class="btn-arrow" aria-hidden="true">→</span></a><a class="btn btn-ghost" href="/offers/">All offers</a>`,
})}

  <section class="section">
    <div class="wrap-wide split" data-reveal>
      <div class="prose">
        ${offer.body.map((paragraph) => `<p>${escape(paragraph)}</p>`).join("")}
        <p><strong>Pilot.</strong> ${escape(offer.pilot)}</p>
      </div>
      <div>
        <h3>Where it fits</h3>
        ${ruleList(offer.fits, "yes")}
        <h3 style="margin-top:2.2rem">Where it stops</h3>
        ${ruleList(offer.not, "no")}
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="wrap-wide">
      <div class="section-head" data-reveal>
        <div>
          <p class="eyebrow">Also relevant</p>
          <h2>Other offers.</h2>
        </div>
        <p class="section-sub">Each one is a separate two-to-four week pilot. We do not bundle them to raise a number.</p>
      </div>
      <div class="cards cards-2" data-reveal>${others.map(offerCard).join("")}</div>
    </div>
  </section>
${ctaBand({
  title: `Pilot ${escape(offer.name)}.`,
  text: "Send the organisation, the public website, and the workflow that repeats. We will tell you whether this is the right offer.",
})}
`,
  );
});

/* ───────────── industries ───────────── */

add(
  "/industries/",
  "Industries",
  "Infralyte works across professional firms, operations-heavy businesses, and product companies — with profession-specific judgement.",
  `
${pageHero({
  eyebrow: "Industries",
  title: "The platform is universal.<br><em>The judgement is not.</em>",
  lede: "We keep vertical playbooks so a CA practice and a SaaS company are not treated as the same buyer with a different logo.",
  actions: `<a class="btn btn-primary" href="/scan/">Request an Opportunity Scan <span class="btn-arrow" aria-hidden="true">→</span></a>`,
})}

  <section class="section">
    <div class="wrap-wide">
      ${industries
        .map(
          (item) => `
        <article class="industry" id="${item.id}" data-reveal>
          <span class="industry-index" aria-hidden="true">${item.index}</span>
          <h3>${escape(item.name)}</h3>
          <p>${escape(item.text)}</p>
          <p class="actions" style="margin-top:1.1rem">${item.offers
            .map((slug) => `<a class="btn btn-ghost btn-sm" href="/offers/${slug}/">${escape(offerBySlug.get(slug).name)}</a>`)
            .join("")}</p>
        </article>`,
        )
        .join("")}
    </div>
  </section>
${ctaBand({
  title: "Your vertical is not on the list?",
  text: "The method is the same wherever work is document-heavy, repetitive, analytical, or knowledge-intensive. Tell us the workflow.",
})}
`,
);

/* ───────────── studio ───────────── */

add(
  "/studio/",
  "Studio",
  "Infralyte also builds its own products. That is how we stay current — without putting those products on someone else’s host.",
  `
${pageHero({
  eyebrow: "Studio",
  title: "We ship our<br>own products too.",
  lede: "Services work pays for depth. Studio work keeps us honest about what is actually usable. These products are built and hosted by Infralyte.",
})}

  <section class="section">
    <div class="wrap-wide">
      <div class="cards" data-reveal>
        <article class="card">
          <p class="kicker">Property</p>
          <h3>GharBazaar</h3>
          <p>A local real-estate product for buying, selling, and renting — starting in Raipur. Hosted by us when it is public, not on a third-party app builder.</p>
          <span class="card-tag">In development</span>
        </article>
        <article class="card">
          <p class="kicker">Voice</p>
          <h3>FlowSpeak</h3>
          <p>Real-time speech to clean, structured text. Built for people who think faster than they type.</p>
          <span class="card-tag">In development</span>
        </article>
        <article class="card">
          <p class="kicker">Meetings</p>
          <h3>Briefly</h3>
          <p>Preparation, structured response, and summaries for meetings and interviews.</p>
          <span class="card-tag">In development</span>
        </article>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="wrap-wide split" data-reveal>
      <div class="prose">
        <h2>Why we keep a studio</h2>
        <p>Running our own products means we hit the same problems our clients hit: retrieval that has to cite, latency a real person will wait for, and a cost curve that has to survive a month of actual use.</p>
        <p>It is also why the private-model lab exists. We needed it before we sold it.</p>
      </div>
      <dl class="meta-list">
        <div><dt>Hosting</dt><dd>Infralyte infrastructure, not a third-party app builder.</dd></div>
        <div><dt>Status</dt><dd>These are in development. We will link them here when they are public.</dd></div>
        <div><dt>Services work</dt><dd><a href="/offers/">See the six offers →</a></dd></div>
      </dl>
    </div>
  </section>
${ctaBand({
  title: "Want the same team on your product?",
  text: "The AI Product Layer offer puts assistance inside a product you already ship.",
  label: "Read the offer",
  href: "/offers/product-layer/",
})}
`,
);

/* ───────────── careers ───────────── */

add(
  "/careers/",
  "Careers",
  "Infralyte is hiring freshers in Raipur for backend, full-stack, data, and AI engineering roles.",
  `
${pageHero({
  eyebrow: "On-site · Raipur, Chhattisgarh",
  title: "Start here.<br>Work on real systems.",
  lede: "We’re looking for people who want to learn on production work — client workflows, private models, and our own products. The team is small, on site in Raipur, and already running its own NVIDIA and Apple Silicon lab.",
  actions: `<a class="btn btn-primary" href="mailto:${brand.hiringEmail}?subject=Application">Email ${brand.hiringEmail} <span class="btn-arrow" aria-hidden="true">→</span></a><a class="btn btn-ghost" href="/contact/">Use the contact form</a>`,
})}

  <section class="section">
    <div class="wrap-wide">
      <div class="section-head" data-reveal>
        <div>
          <p class="eyebrow">Open roles</p>
          <h2>Four fresher roles.</h2>
        </div>
        <p class="section-sub">No prior industry experience required. We care whether you can take a vague problem and return something that runs.</p>
      </div>
      <div class="cards cards-2" data-reveal>
        ${roles
          .map(
            ([title, text]) => `
        <a class="card" href="mailto:${brand.hiringEmail}?subject=${encodeURIComponent(`Application — ${title}`)}">
          <p class="kicker">Fresher · Raipur</p>
          <h3>${escape(title)}</h3>
          <p>${escape(text)}</p>
          <span class="card-more">Apply by email <em aria-hidden="true">→</em></span>
        </a>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="wrap-wide split" data-reveal>
      <div class="prose">
        <h2>How hiring works here</h2>
        <p>Send anything that shows your work: a repository, a project, a write-up of something you debugged. A polished CV is fine but it is not what decides the conversation.</p>
        <p>Applications go to <a class="text-link" href="mailto:${brand.hiringEmail}">${brand.hiringEmail}</a>. If you would rather use a form, the <a class="text-link" href="/contact/">contact page</a> has one — pick “A role in Raipur”.</p>
      </div>
      <dl class="meta-list">
        <div><dt>Location</dt><dd>On site, Raipur, Chhattisgarh</dd></div>
        <div><dt>Level</dt><dd>Fresher — we train on production work</dd></div>
        <div><dt>Applications</dt><dd><a href="mailto:${brand.hiringEmail}">${brand.hiringEmail}</a></dd></div>
      </dl>
    </div>
  </section>
`,
);

/* ───────────── contact ───────────── */

add(
  "/contact/",
  "Contact",
  "Contact Infralyte for an AI Opportunity Scan, a pilot, or a role in Raipur.",
  `
${pageHero({
  eyebrow: "Contact",
  title: "Tell us the workflow,<br>not the vision deck.",
  lede: "Public business mailboxes only for outreach. For a scan, send the organisation website and the work that is repeating.",
})}

  <section class="section">
    <div class="wrap-wide split" data-reveal>
      <div>
        <dl class="meta-list">
          <div><dt>Email</dt><dd><a href="mailto:${brand.email}">${brand.email}</a></dd></div>
          <div><dt>Hiring</dt><dd><a href="mailto:${brand.hiringEmail}">${brand.hiringEmail}</a></dd></div>
          <div><dt>Phone</dt><dd><a href="tel:${brand.phoneTel}">${brand.phoneDisplay}</a></dd></div>
          <div><dt>Studio</dt><dd>${escape(brand.studio)}</dd></div>
          <div><dt>Registered office</dt><dd>${escape(brand.registeredOffice)}</dd></div>
          <div><dt>Unsubscribe</dt><dd><a href="/unsubscribe/">www.infralyte.in/unsubscribe</a></dd></div>
        </dl>
      </div>
      <form class="form" method="post" action="/contact" data-endpoint="/contact" data-flag="sent" data-fallback="${brand.email}" data-success="Received. We will reply from ${brand.email}.">
        <label>Name <input name="name" required autocomplete="name"></label>
        <label>Email <input name="email" type="email" required autocomplete="email"></label>
        <label>I am writing about
          <select name="purpose">
            <option value="scan">An Opportunity Scan</option>
            <option value="pilot">A pilot / existing AI problem</option>
            <option value="job">A role in Raipur</option>
            <option value="other">Something else</option>
          </select>
        </label>
        <label>Message <textarea name="message" required placeholder="Organisation, public website, and the workflow that hurts."></textarea></label>
        <button class="btn btn-primary" type="submit">Send</button>
        <p class="form-status" role="status" aria-live="polite"></p>
        <p class="form-aside">Prefer plain email? Write to <a href="mailto:${brand.email}">${brand.email}</a> and it reaches the same place.</p>
      </form>
    </div>
  </section>
`,
);

/* ───────────── unsubscribe ───────────── */

add(
  "/unsubscribe/",
  "Unsubscribe",
  "Unsubscribe from Infralyte email. Opt-outs are permanent.",
  `
${pageHero({
  eyebrow: "Email preferences",
  title: "Unsubscribe.",
  lede: "Opt-outs are permanent. We will not email that address again, and we do not sell lists.",
})}

  <section class="section">
    <div class="wrap-narrow" data-reveal>
      <form class="form" method="post" action="/unsubscribe" data-endpoint="/unsubscribe" data-flag="status" data-fallback="${brand.email}" data-success="You are unsubscribed. This is permanent.">
        <label>Work email to suppress <input name="email" type="email" required autocomplete="email"></label>
        <button class="btn btn-primary" type="submit">Unsubscribe</button>
        <p class="form-status" role="status" aria-live="polite"></p>
        <p class="form-aside">If this form is unavailable, email <a href="mailto:${brand.email}?subject=Unsubscribe">${brand.email}</a> with the subject Unsubscribe.</p>
      </form>
    </div>
  </section>
`,
);

/* ───────────── privacy ───────────── */

add(
  "/privacy/",
  "Privacy",
  "Infralyte Technologies privacy notice for the public website, contact form, and unsubscribe requests.",
  `
${pageHero({ eyebrow: "Legal", title: "Privacy.", lede: "What this site collects, why, and how long it is kept." })}

  <section class="section">
    <div class="wrap-narrow prose" data-reveal>
      <p>This site is operated by ${escape(brand.legalName)}. Contact: <a class="text-link" href="mailto:${brand.email}">${brand.email}</a>. Studio: ${escape(brand.studio)}. Registered office: ${escape(brand.registeredOffice)}.</p>
      <p>We collect what you send us: contact-form fields, unsubscribe requests, and ordinary web logs. We use that information to reply, to honour opt-outs, and to keep the site working. We do not sell it.</p>
      <p>Unsubscribe requests are kept so we can honour them permanently. We do not use hidden tracking pixels in this marketing site, and we do not run advertising cookies.</p>
      <p>If we research a public organisation, we use pages that organisation already published. We do not collect personal inboxes or leaked lists.</p>
      <p>To have a submission deleted, email <a class="text-link" href="mailto:${brand.email}?subject=Data%20request">${brand.email}</a>. Suppression records are the exception — we keep those so an opt-out stays honoured.</p>
    </div>
  </section>
`,
);

/* ───────────── legal ───────────── */

add(
  "/legal/",
  "Legal",
  "Legal identity for Infralyte Technologies, including GSTIN and registered office.",
  `
${pageHero({
  eyebrow: "Company",
  title: "Legal identity.",
  lede: "The public brand is Infralyte. The trading name is Infralyte Technologies.",
})}

  <section class="section">
    <div class="wrap-wide split" data-reveal>
      <dl class="meta-list">
        <div><dt>Legal name</dt><dd>${escape(brand.legalName)}</dd></div>
        <div><dt>GSTIN</dt><dd>${brand.gstin}</dd></div>
        <div><dt>Studio</dt><dd>${escape(brand.studio)}</dd></div>
        <div><dt>Registered office</dt><dd>${escape(brand.registeredOffice)}</dd></div>
        <div><dt>Email</dt><dd><a href="mailto:${brand.email}">${brand.email}</a></dd></div>
        <div><dt>Phone</dt><dd><a href="tel:${brand.phoneTel}">${brand.phoneDisplay}</a></dd></div>
      </dl>
      <div class="prose">
        <h2>Outreach and opt-outs</h2>
        <p>Outreach from Infralyte uses a Workspace mailbox, this postal address, and <a class="text-link" href="/unsubscribe/">https://www.infralyte.in/unsubscribe/</a>. Opt-outs are permanent.</p>
        <p>Confidential consulting customers are never named here or in outbound mail without permission.</p>
        <p>Security contact: <a class="text-link" href="/.well-known/security.txt">/.well-known/security.txt</a>.</p>
      </div>
    </div>
  </section>
`,
);

/* ───────────── 404 ───────────── */

add(
  "/404.html",
  "Not found",
  "That page is not on infralyte.in.",
  `
${pageHero({
  eyebrow: "404",
  title: "That page is not here.",
  lede: "The link may be old. These are the pages that exist.",
  actions: `<a class="btn btn-primary" href="/">Back to Infralyte <span class="btn-arrow" aria-hidden="true">→</span></a><a class="btn btn-ghost" href="/offers/">See the offers</a>`,
})}

  <section class="section">
    <div class="wrap-wide">
      ${industryTiles()}
    </div>
  </section>
`,
);

/* ───────────── write ───────────── */

function writePage(page) {
  const urlPath = page.path.endsWith(".html")
    ? page.path
    : page.path.endsWith("/")
      ? `${page.path}index.html`
      : `${page.path}/index.html`;
  const target = join(dist, urlPath.replace(/^\//, ""));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, rebase(page.path, layout(page)));
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const page of pages) {
  writePage(page);
}

function copyPublic(from, to) {
  mkdirSync(to, { recursive: true });
  for (const name of readdirSync(from)) {
    const src = join(from, name);
    const dest = join(to, name);
    if (statSync(src).isDirectory()) {
      copyPublic(src, dest);
    } else {
      copyFileSync(src, dest);
    }
  }
}

writeFileSync(join(dist, "styles.css"), readFileSync(join(root, "src/styles.css")));
writeFileSync(join(dist, "site.js"), readFileSync(join(root, "src/site.js")));
copyPublic(join(root, "public"), dist);

const sitemapUrls = pages
  .filter((page) => page.path !== "/404.html")
  .map((page) => `  <url><loc>${site}${page.path}</loc></url>`)
  .join("\n");

writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`,
);

console.log(`Wrote ${pages.length} pages to dist/`);
