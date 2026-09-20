import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)), "dist");
const port = Number(process.env.PORT || 4177);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const relative = clean.replace(/^\/+/, "");
  const candidates = relative
    ? [join(root, relative), join(root, relative, "index.html")]
    : [join(root, "index.html")];
  if (relative && !extname(relative)) {
    candidates.unshift(join(root, relative + ".html"));
  }
  for (const file of candidates) {
    const normalized = normalize(file);
    if (!normalized.startsWith(root)) continue;
    if (existsSync(normalized) && statSync(normalized).isFile()) return normalized;
  }
  const fallback = join(root, "404.html");
  return existsSync(fallback) ? fallback : null;
}

const server = createServer((request, response) => {
  const file = resolve(request.url || "/");
  if (!file) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  const status = file.endsWith("404.html") && request.url !== "/404.html" ? 404 : 200;
  response.writeHead(status, { "content-type": types[extname(file)] || "application/octet-stream" });
  response.end(readFileSync(file));
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Preview http://127.0.0.1:${port}/`);
});
