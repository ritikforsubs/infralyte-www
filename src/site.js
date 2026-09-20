const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

async function postForm(form, statusEl, endpoint) {
  const data = new FormData(form);
  statusEl.classList.remove("error");
  statusEl.textContent = "Sending…";
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
      signal: controller.signal,
    });
    clearTimeout(timer);
    const type = response.headers.get("content-type") || "";
    if (!response.ok || !type.includes("application/json")) {
      throw new Error("Request failed");
    }
    form.reset();
    statusEl.textContent = form.dataset.success || "Received. We will take it from here.";
  } catch (error) {
    statusEl.classList.add("error");
    const email = form.dataset.fallback || "hello@infralyte.com";
    statusEl.textContent = `The form could not be posted. Email ${email} instead.`;
  }
}

document.querySelectorAll("form[data-endpoint]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    if (!status) return;
    postForm(form, status, form.dataset.endpoint);
  });
});
