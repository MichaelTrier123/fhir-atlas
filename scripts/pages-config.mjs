/** Resolve the URL prefix without assuming the final repository name. */
export function pagesBase({ basePath, repository } = {}) {
  if (basePath !== undefined && basePath !== "") {
    if (
      !/^\/(?:[A-Za-z0-9._~-]+\/)*$/.test(basePath) ||
      basePath.split("/").some((segment) => segment === "." || segment === "..")
    ) {
      throw new Error(
        "PAGES_BASE_PATH must be an absolute path with a trailing slash, such as /fhir-atlas/ or /.",
      );
    }
    return basePath;
  }
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository || "")) {
    throw new Error(
      "Set GITHUB_REPOSITORY=owner/repository or PAGES_BASE_PATH=/repository/ before building for Pages.",
    );
  }
  const [owner, name] = repository.split("/");
  return name.toLowerCase() === `${owner.toLowerCase()}.github.io`
    ? "/"
    : `/${name}/`;
}
