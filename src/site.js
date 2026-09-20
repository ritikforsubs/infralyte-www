const root = document.documentElement;
const supportsReveal = "IntersectionObserver" in window;

if (supportsReveal) {
  root.classList.remove("no-js");
}

/* ── mobile navigation ── */

const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");

function setNav(open) {
  if (!nav || !navToggle) return;
  nav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

if (nav && navToggle) {
  navToggle.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNav(false);
  });
  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (event.target.closest(".site-header")) return;
    setNav(false);
  });
}

/* ── header border once scrolled ── */

const header = document.querySelector("[data-header]");

if (header) {
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ── scroll reveal ── */

for (const group of document.querySelectorAll(".cards, .tiles, .path, .stats")) {
  [...group.children].forEach((child, index) => child.style.setProperty("--i", index));
}

if (supportsReveal) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    // threshold 0 so a section taller than the viewport still fires
    { rootMargin: "0px 0px -8% 0px", threshold: 0 },
  );
  document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
}

/* ── cursor spotlight on linked cards ── */

if (window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll("a.card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - box.left}px`);
      card.style.setProperty("--my", `${event.clientY - box.top}px`);
    });
  });
}

/* ── forms ── */

function setStatus(element, message, isError) {
  element.textContent = message;
  element.classList.toggle("is-error", Boolean(isError));
}

async function postForm(form, statusEl) {
  const fallback = form.dataset.fallback;
  const submit = form.querySelector("button[type=submit]");
  setStatus(statusEl, "Sending…", false);
  if (submit) submit.disabled = true;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(form.dataset.endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const type = response.headers.get("content-type") || "";
    if (!response.ok || !type.includes("application/json")) {
      throw new Error(`Unexpected response: ${response.status}`);
    }
    form.reset();
    setStatus(statusEl, form.dataset.success || "Received. We will take it from here.", false);
  } catch (error) {
    setStatus(statusEl, `That did not post. Email ${fallback} instead and we will pick it up.`, true);
  } finally {
    if (submit) submit.disabled = false;
  }
}

document.querySelectorAll("form[data-endpoint]").forEach((form) => {
  const statusEl = form.querySelector(".form-status");
  if (!statusEl) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    postForm(form, statusEl);
  });

  // the no-JS path posts natively and comes back with a query flag
  const params = new URLSearchParams(window.location.search);
  if (params.get(form.dataset.flag || "sent")) {
    setStatus(statusEl, form.dataset.success || "Received. We will take it from here.", false);
  }
});
