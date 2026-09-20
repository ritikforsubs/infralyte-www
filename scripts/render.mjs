import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const site = "https://www.infralyte.com";
const year = new Date().getFullYear();

const offers = [
  {
    slug: "document-intelligence",
    kicker: "01",
    name: "Document Intelligence",
    summary: "Citation-backed search, extraction, and working notes over the files a practice already lives in.",
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
    name: "AI Product Layer",
    summary: "A copilot or workflow assistant inside a product you already ship — not a widget bolted on the side.",
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
    name: "AI Operations Automation",
    summary: "One measurable back-office workflow: email, spreadsheet, ticket, or intake, with a human in the loop.",
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
    name: "AI Analytics",
    summary: "One operational dataset, one decision: forecast, anomaly, inventory, production, or reporting.",
    pilot: "A focused analytics pilot over one operational dataset and business decision.",
    body: [
      "Analytics work fails when it tries to be a new data platform. We start from a decision someone already makes every week, and from the dataset they already trust enough to argue about.",
      "The deliverable is a measured improvement on that decision — not a dashboard nobody owns.",
    ],
    fits: ["Demand, inventory, and production", "Anomaly review and exception queues", "Reporting that still requires a human synthesis step"],
    not: ["A second copy of your warehouse", "Predictions without an owner and a threshold"],
  },
  {
    slug: "private-ai",
    kicker: "05",
    name: "Private AI Infrastructure",
    summary: "Frontier models when they fit. Private models when data cannot leave.",
    pilot: "A private-model benchmark on representative, sanitized sample data.",
    body: [
      "Some work can use a frontier model. Some work cannot leave the building. Pretending those are the same thing is how projects get blocked by legal, security, or a partner who will not share a ledger.",
      "Private AI Infrastructure is the path for confidential client files, regulated records, and any workflow where the deployment model is part of the product.",
      "We benchmark on sanitized samples first. Production stays customer-controlled.",
    ],
    fits: ["Client files that cannot leave the firm", "Healthcare, tax, legal, and other regulated records", "Air-gapped or customer-managed model hosting"],
    not: ["Shipping confidential samples to a public model to “just try it”", "A private-cloud sticker on an otherwise public pipeline"],
  },
  {
    slug: "rescue",
    kicker: "06",
    name: "AI Rescue",
    summary: "The model is already in production and it is expensive, slow, or untrustworthy.",
    pilot: "A measured reliability and cost audit with a production remediation plan.",
    body: [
      "A surprising number of AI projects do not need a new model. They need evaluations, guardrails, retrieval that actually cites, latency that a user will wait for, and a cost curve someone can defend.",
      "AI Rescue is for teams who already shipped something and now have to live with it.",
    ],
    fits: ["Hallucinations in a customer-facing flow", "Token cost and latency that broke the unit economics", "Missing evaluations, permissions, or fallback behaviour"],
    not: ["A silent rewrite of a working system", "Replacing a vendor without measuring the current baseline"],
  },
];

const industries = [
  {
    id: "ca-tax",
    name: "Chartered accountancy, tax, and audit",
    text: "Document search, GST and ledger assistance, notice working notes, deadline monitoring. A chartered accountant still reviews conclusions and filings.",
  },
  {
    id: "legal",
    name: "Legal practices and law firms",
    text: "Matter search with citations, chronologies, contract comparison, intake. Lawyers retain advice, strategy, and filings. Confidential matters stay private.",
  },
  {
    id: "manufacturing",
    name: "Manufacturing and distribution",
    text: "Inventory and demand analytics, PO and invoice reconciliation, quality exceptions, SOP assistance. Operational actions keep human escalation.",
  },
  {
    id: "healthcare",
    name: "Healthcare and diagnostics",
    text: "Record retrieval, administrative claims assistance, scheduling workflows. No autonomous diagnosis or treatment. Patient data stays private and audited.",
  },
  {
    id: "logistics",
    name: "Logistics and transport",
    text: "Exception routing, document packs, and operational reporting over the systems you already run.",
  },
  {
    id: "real-estate",
    name: "Real estate",
    text: "Listing, document, and enquiry workflows — including the local-market work we already know from building our own property product.",
  },
  {
    id: "education",
    name: "Education and training",
    text: "Knowledge assistance, assessment support, and operations around the programmes you already deliver.",
  },
  {
    id: "recruitment",
    name: "Recruitment and staffing",
    text: "Intake, screening assistance, and knowledge over roles and candidates — with a human on every consequential decision.",
  },
  {
    id: "financial",
    name: "Financial services and insurance",
    text: "Document-heavy review, reporting assistance, and private deployment where customer data cannot travel.",
  },
  {
    id: "saas",
    name: "B2B SaaS and technology-enabled services",
    text: "Embedded copilots, docs search, support assistance, and rescue work when an existing AI feature is not holding up.",
  },
];

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

function rebase(fromPath, html) {
  return html.replace(/(href|src|action|data-endpoint)="(\/[^"]*)"/g, (_, attr, target) => {
    return `${attr}="${rel(fromPath, target)}"`;
  });
}

function navItems(path) {
  const items = [
    ["/approach/", "Approach"],
    ["/offers/", "Offers"],
    ["/industries/", "Industries"],
    ["/scan/", "Scan"],
    ["/careers/", "Careers"],
  ];
  return items
    .map(([href, label]) => {
      const current = path === href || path.startsWith(href);
      return `<a href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a>`;
    })
    .join("");
}

function layout({ path, title, description, body }) {
  const canonical = `${site}${path}`;
  const fullTitle = path === "/" ? "Infralyte — AI in the work you already run" : `${title} — Infralyte`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(fullTitle)}</title>
  <meta name="description" content="${escape(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${escape(fullTitle)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="Infralyte">
  <meta name="twitter:card" content="summary">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.bunny.net">
  <link rel="stylesheet" href="https://fonts.bunny.net/css?family=figtree:400,500,600,700|fraunces:460,560|ibm-plex-mono:500">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Infralyte",
    url: site,
    email: "hello@infralyte.com",
    telephone: "+916265040463",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Raipur",
      addressRegion: "Chhattisgarh",
      addressCountry: "IN",
    },
    description,
  })}</script>
</head>
<body>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="mark" href="/">
        <svg class="mark-glyph" viewBox="0 0 64 64" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#d7b56d"/>
          <path fill="#0a0b09" d="M18 14h28v7.2H36.4V50H27.6V21.2H18z"/>
        </svg>
        Infralyte
      </a>
      <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-label="Open menu">☰</button>
      <nav class="nav" data-nav>
        ${navItems(path)}
        <a class="btn btn-primary" href="/contact/">Talk to us</a>
      </nav>
    </div>
  </header>
  <main>${body}</main>
  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div>
        <h2>Infralyte</h2>
        <p>We build AI into existing products and operations. Frontier models when they fit, private models when data cannot leave.</p>
      </div>
      <div class="footer-col">
        <a href="/offers/">Offers</a>
        <a href="/approach/">How we work</a>
        <a href="/scan/">Opportunity Scan</a>
        <a href="/industries/">Industries</a>
      </div>
      <div class="footer-col">
        <a href="/careers/">Careers</a>
        <a href="/studio/">Studio</a>
        <a href="/privacy/">Privacy</a>
        <a href="/unsubscribe/">Unsubscribe</a>
      </div>
      <div class="footer-col">
        <a href="mailto:hello@infralyte.com">hello@infralyte.com</a>
        <a href="tel:+916265040463">+91 6265 040 463</a>
        <span>Raipur, Chhattisgarh</span>
      </div>
    </div>
    <div class="wrap legal">
      <span>© ${year} Infralyte. All rights reserved.</span>
      <span>Draft outreach only. We do not buy or scrape personal inboxes.</span>
    </div>
  </footer>
  <script src="/site.js"></script>
</body>
</html>
`;
}

const pages = [];

function add(path, title, description, body) {
  pages.push({ path, title, description, body });
}

add(
  "/",
  "Infralyte",
  "Infralyte builds AI into existing products and operations — frontier models when they fit, private models when data cannot leave.",
  `
  <section class="hero">
    <div class="wrap hero-grid">
      <div>
        <p class="eyebrow">Infralyte · Raipur / worldwide</p>
        <h1>AI, built into the work you already run.</h1>
        <p class="lede">We research how a business actually operates, name one bounded workflow worth changing, and prove it in a two-to-four week pilot. No transformation theatre. No bulk email.</p>
        <div class="actions">
          <a class="btn btn-primary" href="/scan/">Request an Opportunity Scan</a>
          <a class="btn btn-ghost" href="/approach/">See how we work</a>
        </div>
      </div>
      <aside class="panel">
        <p><strong>The rule.</strong> Frontier models when they fit. Private models when data cannot leave. A chartered accountant, lawyer, clinician, or operator still owns the consequential decision.</p>
      </aside>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <h2>Six offers. One at a time.</h2>
        <p>Sales is customized. The platform underneath is reusable. We pick the offer that matches the evidence, not the one that sounds largest.</p>
      </div>
      <div class="cards">
        ${offers
          .map(
            (offer) => `
          <a class="card" href="/offers/${offer.slug}/">
            <p class="kicker">${offer.kicker}</p>
            <h3>${escape(offer.name)}</h3>
            <p>${escape(offer.summary)}</p>
            <span class="more">Read the offer →</span>
          </a>`,
          )
          .join("")}
      </div>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <h2>A short commercial path.</h2>
        <p>We would rather tell you to skip than sell a twelve-month transformation with no first workflow.</p>
      </div>
      <div class="steps">
        <article class="step"><div class="step-num">01</div><h3>Public research</h3><p>We read what your organisation already publishes. Exact quotes, with URLs. Inference is labelled as a hypothesis.</p></article>
        <article class="step"><div class="step-num">02</div><h3>Opportunity Scan</h3><p>A one-page recommendation: build, buy, or skip. One workflow. One offer.</p></article>
        <article class="step"><div class="step-num">03</div><h3>Capped discovery</h3><p>Used only when public evidence is not enough and deeper access is required.</p></article>
        <article class="step"><div class="step-num">04</div><h3>2–4 week pilot</h3><p>Fixed scope. A qualified human stays in the loop. Success is a measured workflow, not a slide.</p></article>
        <article class="step"><div class="step-num">05</div><h3>Production</h3><p>Rollout, private deployment where needed, and managed support after the pilot holds.</p></article>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="section-head">
        <h2>Built for operators, not a single niche.</h2>
        <p>The same method holds for a two-partner CA firm and a product company with an existing platform. The vertical changes. The discipline does not.</p>
      </div>
      <div class="chips">
        ${industries.map((item) => `<a class="chip" href="/industries/#${item.id}">${escape(item.name)}</a>`).join("")}
      </div>
    </div>
  </section>
  <section class="section">
    <div class="wrap split">
      <div>
        <p class="eyebrow">Proof, without name-dropping</p>
        <h2>Technology work across 20+ engagements.</h2>
        <p class="lede">We have delivered software and data work across multiple sectors. We do not claim twenty AI transformations, and we do not name confidential customers.</p>
      </div>
      <div class="note">If a case study cannot be told without a client’s permission, it stays off this site and out of outreach. That is a commercial constraint, not a slogan.</div>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="cta-band">
        <div>
          <h2>Start with a scan, not a proposal deck.</h2>
          <p>Tell us the organisation and the workflow that hurts. We will tell you whether to build, buy, or skip.</p>
        </div>
        <a class="btn btn-primary" href="/contact/">Contact Infralyte</a>
      </div>
    </div>
  </section>
`,
);

add(
  "/approach/",
  "How we work",
  "Infralyte’s commercial path: public research, a one-page Opportunity Scan, capped discovery, a 2–4 week pilot, then production.",
  `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">Approach</p>
      <h1>Research broadly. Understand vertically. Propose one workflow.</h1>
      <p class="lede">Infralyte is an AI transformation practice, not a SaaS-only lead machine. The market is any organisation with document-heavy, repetitive, analytical, or knowledge-intensive work.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap prose">
      <h2>What you get</h2>
      <p>A customized recommendation on top of a reusable method. We do not arrive with a single product and then hunt for a place to put it.</p>
      <p>Individual professionals can receive a productized workspace and onboarding. Mid-market organisations receive workflow integrations. Enterprises receive governance, private deployment, SSO, evaluations, and staged rollout.</p>
      <h2>What we will not do</h2>
      <ul>
        <li>Auto-send outreach, scrape personal inboxes, or buy leaked lists.</li>
        <li>Present model guesses as facts.</li>
        <li>Replace a CA, lawyer, clinician, or other qualified human on a regulated decision.</li>
        <li>Name confidential consulting customers to win a meeting.</li>
      </ul>
      <p><a href="/scan/">Read the Opportunity Scan →</a></p>
    </div>
  </section>
`,
);

add(
  "/scan/",
  "AI Opportunity Scan",
  "A one-page AI Opportunity Scan from Infralyte: build, buy, or skip — one bounded workflow, with evidence.",
  `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">Productized offer</p>
      <h1>The AI Opportunity Scan.</h1>
      <p class="lede">A one-page recommendation for a single organisation. We tell you whether to build, buy, or skip, and we name one bounded workflow if the answer is build.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap split">
      <div class="prose">
        <p>The scan is how most engagements start. It is cheaper and clearer than a vague discovery month, and more honest than a demo of a tool you did not ask for.</p>
        <p>Where public evidence is enough, the scan stands on cited pages. Where it is not, we will say so and offer capped discovery instead of inventing access we do not have.</p>
        <p>After a scan, the next step is a 2–4 week pilot on one of six offers — or a clean skip.</p>
      </div>
      <dl class="meta-list">
        <div><dt>Output</dt><dd>One page. Build, buy, or skip. One workflow if we recommend a build.</dd></div>
        <div><dt>Evidence</dt><dd>Exact public quotes with URLs. Hypotheses labelled as such.</dd></div>
        <div><dt>Next step</dt><dd>A fixed-scope pilot, private infrastructure, or no project.</dd></div>
      </dl>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="cta-band">
        <div>
          <h2>Ask for a scan.</h2>
          <p>Use a public business mailbox. Tell us the website and the workflow that is eating time.</p>
        </div>
        <a class="btn btn-primary" href="/contact/">Request a scan</a>
      </div>
    </div>
  </section>
`,
);

add(
  "/offers/",
  "Offers",
  "Infralyte’s six productized AI offers: documents, product layer, operations, analytics, private infrastructure, and rescue.",
  `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">Offers</p>
      <h1>Pick one offer. Prove it. Then talk about the rest.</h1>
      <p class="lede">Every pilot is two to four weeks and tied to a single workflow. The names below are the only offers we sell first.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap cards">
      ${offers
        .map(
          (offer) => `
        <a class="card" href="/offers/${offer.slug}/">
          <p class="kicker">${offer.kicker}</p>
          <h3>${escape(offer.name)}</h3>
          <p>${escape(offer.summary)}</p>
          <span class="more">${escape(offer.pilot)}</span>
        </a>`,
        )
        .join("")}
    </div>
  </section>
`,
);

for (const offer of offers) {
  add(
    `/offers/${offer.slug}/`,
    offer.name,
    offer.summary,
    `
    <section class="page-hero">
      <div class="wrap">
        <p class="eyebrow">Offer ${offer.kicker}</p>
        <h1>${escape(offer.name)}</h1>
        <p class="lede">${escape(offer.summary)}</p>
        <div class="actions">
          <a class="btn btn-primary" href="/contact/">Start with a scan</a>
          <a class="btn btn-ghost" href="/offers/">All offers</a>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="wrap split">
        <div class="prose">
          ${offer.body.map((paragraph) => `<p>${escape(paragraph)}</p>`).join("")}
          <p><strong>Pilot.</strong> ${escape(offer.pilot)}</p>
        </div>
        <div>
          <h3>Where it fits</h3>
          <ul>${offer.fits.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>
          <h3>Where it stops</h3>
          <ul>${offer.not.map((item) => `<li>${escape(item)}</li>`).join("")}</ul>
        </div>
      </div>
    </section>
  `,
  );
}

add(
  "/industries/",
  "Industries",
  "Infralyte works across professional firms, operations-heavy businesses, and product companies — with profession-specific judgement.",
  `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">Industries</p>
      <h1>The platform is universal. The judgement is not.</h1>
      <p class="lede">We keep vertical playbooks so a CA practice and a SaaS company are not treated as the same buyer with a different logo.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap">
      ${industries
        .map(
          (item) => `
        <article class="industry" id="${item.id}">
          <h3>${escape(item.name)}</h3>
          <p>${escape(item.text)}</p>
        </article>`,
        )
        .join("")}
    </div>
  </section>
`,
);

add(
  "/studio/",
  "Studio",
  "Infralyte also builds its own products. That is how we stay current — without putting those products on someone else’s host.",
  `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">Studio</p>
      <h1>We ship our own products too.</h1>
      <p class="lede">Services work pays for depth. Studio work keeps us honest about what is actually usable. These products are built and hosted by Infralyte.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap cards">
      <article class="card">
        <p class="kicker">Property</p>
        <h3>GharBazaar</h3>
        <p>A local real-estate product for buying, selling, and renting — starting in Raipur. Hosted by us when it is public, not on a third-party app builder.</p>
      </article>
      <article class="card">
        <p class="kicker">Voice</p>
        <h3>FlowSpeak</h3>
        <p>Real-time speech to clean, structured text. Built for people who think faster than they type.</p>
      </article>
      <article class="card">
        <p class="kicker">Meetings</p>
        <h3>Briefly</h3>
        <p>Preparation, structured response, and summaries for meetings and interviews.</p>
      </article>
    </div>
  </section>
`,
);

add(
  "/careers/",
  "Careers",
  "Infralyte is hiring freshers in Raipur for backend, full-stack, data, and AI engineering roles.",
  `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">On-site · Raipur, Chhattisgarh</p>
      <h1>Start here. Work on real systems.</h1>
      <p class="lede">We hire people who want to learn on production work — client workflows, private models, and our own products. These seats are for freshers, on site in Raipur.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap cards">
      ${[
        ["Backend Developer", "APIs, data stores, and the unglamorous path from a pilot to something that stays up."],
        ["Full-stack Developer", "Interfaces and services for scans, pilots, and internal tools."],
        ["Data Engineer", "Pipelines, retrieval corpora, and the evidence layer behind Document Intelligence."],
        ["AI / ML Engineer", "Evaluations, private-model serving, and the difference between a demo and a workflow."],
      ]
        .map(
          ([title, text]) => `
        <article class="card">
          <p class="kicker">Fresher</p>
          <h3>${title}</h3>
          <p>${text}</p>
          <a class="more" href="/contact/">Apply via contact →</a>
        </article>`,
        )
        .join("")}
    </div>
  </section>
`,
);

add(
  "/contact/",
  "Contact",
  "Contact Infralyte for an AI Opportunity Scan, a pilot, or a role in Raipur.",
  `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">Contact</p>
      <h1>Tell us the workflow, not the vision deck.</h1>
      <p class="lede">Public business mailboxes only for outreach. For a scan, send the organisation website and the work that is repeating.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap split">
      <dl class="meta-list">
        <div><dt>Email</dt><dd><a href="mailto:hello@infralyte.com">hello@infralyte.com</a></dd></div>
        <div><dt>Phone</dt><dd><a href="tel:+916265040463">+91 6265 040 463</a></dd></div>
        <div><dt>Studio</dt><dd>Raipur, Chhattisgarh, India</dd></div>
        <div><dt>Unsubscribe</dt><dd><a href="/unsubscribe/">www.infralyte.com/unsubscribe</a></dd></div>
      </dl>
      <form class="form" data-endpoint="/contact" data-fallback="hello@infralyte.com" data-success="Received. We will reply from hello@infralyte.com.">
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
        <p class="form-status" role="status"></p>
      </form>
    </div>
  </section>
`,
);

add(
  "/unsubscribe/",
  "Unsubscribe",
  "Unsubscribe from Infralyte email. Opt-outs are permanent.",
  `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">Email preferences</p>
      <h1>Unsubscribe.</h1>
      <p class="lede">Opt-outs are permanent. We will not email that address again, and we do not sell lists.</p>
    </div>
  </section>
  <section class="section">
    <div class="wrap" style="max-width:32rem">
      <form class="form" data-endpoint="/unsubscribe" data-fallback="hello@infralyte.com" data-success="You are unsubscribed. This is permanent.">
        <label>Work email to suppress <input name="email" type="email" required autocomplete="email"></label>
        <button class="btn btn-primary" type="submit">Unsubscribe</button>
        <p class="form-status" role="status"></p>
      </form>
      <p class="lede">If the form is unavailable, email <a href="mailto:hello@infralyte.com?subject=Unsubscribe">hello@infralyte.com</a> with the subject Unsubscribe.</p>
    </div>
  </section>
`,
);

add(
  "/privacy/",
  "Privacy",
  "Infralyte privacy notice for the public website, contact form, and unsubscribe requests.",
  `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">Legal</p>
      <h1>Privacy.</h1>
    </div>
  </section>
  <section class="section">
    <div class="wrap prose">
      <p>This site is operated by Infralyte in Raipur, India. Contact: <a href="mailto:hello@infralyte.com">hello@infralyte.com</a>.</p>
      <p>We collect what you send us: contact-form fields, unsubscribe requests, and ordinary web logs. We use that information to reply, to honour opt-outs, and to keep the site working. We do not sell it.</p>
      <p>Unsubscribe requests are kept so we can honour them permanently. We do not use hidden tracking pixels in this marketing site, and we do not run advertising cookies.</p>
      <p>If we research a public organisation, we use pages that organisation already published. We do not collect personal inboxes or leaked lists.</p>
    </div>
  </section>
`,
);

add(
  "/404.html",
  "Not found",
  "That page is not on infralyte.com.",
  `
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">404</p>
      <h1>That page is not here.</h1>
      <p class="lede"><a href="/">Back to Infralyte</a></p>
    </div>
  </section>
`,
);

function writePage(page) {
  const urlPath = page.path.endsWith(".html") ? page.path : page.path.endsWith("/") ? `${page.path}index.html` : `${page.path}/index.html`;
  const target = join(dist, urlPath.replace(/^\//, ""));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, rebase(page.path, layout(page)));
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const page of pages) {
  writePage(page);
}

writeFileSync(join(dist, "styles.css"), readFileSync(join(root, "src/styles.css")));
writeFileSync(join(dist, "site.js"), readFileSync(join(root, "src/site.js")));

const publicDir = join(root, "public");
for (const file of readdirSync(publicDir)) {
  copyFileSync(join(publicDir, file), join(dist, file));
}

const sitemapUrls = pages
  .filter((page) => page.path !== "/404.html")
  .map((page) => `  <url><loc>${site}${page.path === "/" ? "/" : page.path}</loc></url>`)
  .join("\n");
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`,
);

console.log(`Wrote ${pages.length} pages to dist/`);
