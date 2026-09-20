/**
 * Verify every internal link, asset, form target, and anchor in dist/ resolves.
 * Run after `npm run build`. Exits non-zero on the first broken reference set.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, posix, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

// Routes served by Pages Functions rather than files in dist/.
const functionRoutes = new Set(["/contact", "/unsubscribe"]);

function walk(directory) {
  const found = [];
  for (const name of readdirSync(directory)) {
    const full = join(directory, name);
    if (statSync(full).isDirectory()) found.push(...walk(full));
    else found.push(full);
  }
  return found;
}

const files = walk(dist);
const htmlFiles = files.filter((file) => file.endsWith(".html"));

// Anchor ids available per page URL, so cross-page #fragments can be checked.
const idsByPage = new Map();

function urlOf(file) {
  const rel = relative(dist, file).split("\\").join("/");
  if (rel === "index.html") return "/";
  if (rel === "404.html") return "/404.html";
  return `/${rel.replace(/index\.html$/, "")}`;
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  idsByPage.set(urlOf(file), ids);
}

function fileExistsFor(urlPath) {
  const clean = urlPath.replace(/^\//, "");
  if (clean === "") return existsSync(join(dist, "index.html"));
  const candidates = [
    join(dist, clean),
    join(dist, clean, "index.html"),
    join(dist, `${clean.replace(/\/$/, "")}.html`),
  ];
  return candidates.some((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}

const problems = [];
let checked = 0;

for (const file of htmlFiles) {
  const pageUrl = urlOf(file);
  const html = readFileSync(file, "utf8");
  const refs = [...html.matchAll(/(href|src|action|data-endpoint)="([^"]+)"/g)].map((match) => ({
    attr: match[1],
    value: match[2],
  }));

  for (const { attr, value } of refs) {
    if (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("mailto:") ||
      value.startsWith("tel:") ||
      value.startsWith("data:")
    ) {
      continue;
    }

    checked += 1;

    // Same-page fragment.
    if (value.startsWith("#")) {
      const id = value.slice(1);
      if (id !== "main" && !idsByPage.get(pageUrl)?.has(id)) {
        problems.push(`${pageUrl}: ${attr}="${value}" — no element with that id on this page`);
      } else if (id === "main" && !html.includes('id="main"')) {
        problems.push(`${pageUrl}: ${attr}="${value}" — missing #main landmark`);
      }
      continue;
    }

    const [targetPath, fragment] = value.split("#");

    // Root-absolute references stand alone; relative ones resolve against this page's directory.
    const baseDir = pageUrl === "/404.html" ? "/" : pageUrl;
    const resolved = targetPath.startsWith("/")
      ? posix.normalize(targetPath)
      : posix.normalize(posix.join(baseDir, targetPath));
    const normalized = targetPath.endsWith("/") && !resolved.endsWith("/") ? `${resolved}/` : resolved;

    if (functionRoutes.has(normalized)) continue;

    if (!fileExistsFor(normalized)) {
      problems.push(`${pageUrl}: ${attr}="${value}" — resolves to ${normalized}, which is not in dist/`);
      continue;
    }

    if (fragment) {
      const targetUrl = normalized.endsWith("/") ? normalized : `${normalized}/`;
      const ids = idsByPage.get(targetUrl);
      if (ids && !ids.has(fragment)) {
        problems.push(`${pageUrl}: ${attr}="${value}" — ${targetUrl} has no id "${fragment}"`);
      }
    }
  }
}

console.log(`Checked ${checked} internal references across ${htmlFiles.length} pages.`);

if (problems.length) {
  console.error(`\n${problems.length} broken reference(s):`);
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  process.exit(1);
}

console.log("All internal references resolve.");
