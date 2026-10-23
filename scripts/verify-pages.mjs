import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { startPagesServer } from "./serve-pages.mjs";
const preview = await startPagesServer();
try {
  const { origin, basePath } = preview;
  const response = await fetch(origin + basePath);
  assert.equal(response.status, 200, "Pages entry must be available");
  const html = await response.text();
  assert(
    !html.includes("/src/"),
    "Source entry must be replaced by the production build",
  );
  const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((ref) => !ref.startsWith("#"));
  assert(
    references.some((ref) => ref.endsWith(".js")),
    "Entry must contain built JavaScript",
  );
  for (const reference of references) {
    assert(
      reference.startsWith(basePath + "assets/"),
      `Unexpected root or external asset: ${reference}`,
    );
    assert.equal(
      (await fetch(origin + reference)).status,
      200,
      `Asset missing: ${reference}`,
    );
  }
  const files = await readdir("dist/assets");
  for (const file of files) {
    assert.equal(
      (await fetch(origin + basePath + "assets/" + file)).status,
      200,
      `Missing built asset: ${file}`,
    );
    if (file.endsWith(".css")) {
      const css = await readFile("dist/assets/" + file, "utf8");
      for (const match of css.matchAll(/url\((?:"|')?([^\s)"']+)/g)) {
        const reference = match[1];
        if (reference.startsWith("data:")) continue;
        const url = new URL(reference, origin + basePath + "assets/" + file);
        assert(
          url.pathname.startsWith(basePath + "assets/"),
          `Font or image outside project path: ${reference}`,
        );
        assert.equal(
          (await fetch(url)).status,
          200,
          `Missing CSS asset: ${reference}`,
        );
      }
    }
  }
  for (const route of [
    "learn",
    "lesson/resource-profile-ig",
    "explore/Patient?tab=Structure&element=Patient.name",
    "relationships",
    "workspace?artifact=profile",
  ]) {
    const direct = await fetch(origin + basePath + "#/" + route);
    assert.equal(direct.status, 200, `Hash route failed: ${route}`);
    assert.equal(
      await direct.text(),
      html,
      `Hash route must load the same static entry: ${route}`,
    );
  }
  assert.equal(
    (await fetch(origin + basePath + "missing-file")).status,
    404,
    "Preview must not rely on a SPA fallback",
  );
  if (basePath !== "/") {
    assert.equal(
      (await fetch(origin + "/assets/" + files[0])).status,
      404,
      "Assets must not accidentally depend on origin-root paths",
    );
    assert.equal(
      (await fetch(origin + basePath.slice(0, -1), { redirect: "manual" }))
        .status,
      301,
      "Project root should redirect to trailing slash",
    );
  }
  console.log(
    `Pages static checks passed at ${basePath}: entry, ${files.length} assets, CSS fonts, five hash deep links, and no SPA fallback.`,
  );
  console.log(
    "These checks verify static delivery. Browser hydration/navigation is verified separately.",
  );
} finally {
  await preview.close();
}
