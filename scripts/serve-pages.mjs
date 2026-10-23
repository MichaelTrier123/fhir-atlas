import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { pagesBase } from "./pages-config.mjs";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};
export async function startPagesServer({ port = 0, directory = "dist" } = {}) {
  const root = resolve(directory);
  const config = JSON.parse(
    await readFile(resolve(root, "pages-build.json"), "utf8"),
  );
  const basePath = pagesBase({ basePath: config.basePath });
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      if (basePath !== "/" && url.pathname === basePath.slice(0, -1)) {
        res.writeHead(301, { Location: basePath + url.search });
        res.end();
        return;
      }
      if (!url.pathname.startsWith(basePath)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      const requested = decodeURIComponent(url.pathname.slice(basePath.length));
      const file = resolve(root, requested || "index.html");
      if (file !== root && !file.startsWith(root + sep)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      if (!(await stat(file)).isFile()) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": types[extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });
  await new Promise((ok, fail) => {
    server.once("error", fail);
    server.listen(port, "127.0.0.1", ok);
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  return {
    server,
    origin,
    basePath,
    close: () =>
      new Promise((ok, fail) =>
        server.close((error) => (error ? fail(error) : ok())),
      ),
  };
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const portIndex = process.argv.indexOf("--port");
  const port = portIndex === -1 ? 4173 : Number(process.argv[portIndex + 1]);
  const preview = await startPagesServer({ port });
  console.log(`Static Pages preview: ${preview.origin}${preview.basePath}`);
  console.log(
    "No application server or SPA fallback is provided. Hash routes are handled in the browser.",
  );
  const stop = () => {
    preview.server.close();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
}
