import { test } from "node:test";
import assert from "node:assert/strict";
import { pagesBase } from "../scripts/pages-config.mjs";
test("project Pages uses the repository path", () =>
  assert.equal(pagesBase({ repository: "owner/fhir-atlas" }), "/fhir-atlas/"));
test("account Pages uses the origin root", () =>
  assert.equal(pagesBase({ repository: "Owner/owner.github.io" }), "/"));
test("a custom domain or explicitly configured path overrides the repository", () => {
  assert.equal(pagesBase({ repository: "owner/project", basePath: "/" }), "/");
  assert.equal(
    pagesBase({ repository: "owner/project", basePath: "/custom/path/" }),
    "/custom/path/",
  );
});
test("invalid and ambiguous configuration fails instead of generating broken URLs", () => {
  for (const basePath of [
    "project",
    "./",
    "/project",
    "//external/",
    "/../",
    "/a/../",
    "/a?b/",
  ])
    assert.throws(() => pagesBase({ basePath }));
  assert.throws(() => pagesBase());
  assert.throws(() => pagesBase({ repository: "missing-owner" }));
});
