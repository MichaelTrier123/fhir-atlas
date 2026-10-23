import { spawnSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { pagesBase } from "./pages-config.mjs";
const basePath = pagesBase({
  basePath: process.env.PAGES_BASE_PATH || process.env.VITE_BASE_PATH,
  repository: process.env.GITHUB_REPOSITORY,
});
console.log(`Building GitHub Pages assets for ${basePath}`);
const result = spawnSync(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["run", "build"],
  { stdio: "inherit", env: { ...process.env, VITE_BASE_PATH: basePath } },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
await writeFile(
  "dist/pages-build.json",
  JSON.stringify({ basePath }, null, 2) + "\n",
);
await writeFile("dist/.nojekyll", "");
