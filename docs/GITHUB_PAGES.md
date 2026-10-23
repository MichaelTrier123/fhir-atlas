# WP03 — GitHub Pages delivery

## Current status

The Pages build, workflow, and local production checks are implemented. The project has not been published: the source folder is not yet a Git repository and no target GitHub repository has been selected. WP03's public-URL acceptance criterion remains pending until that repository is configured and its first deployment succeeds.

The copy revision replaces promotional headings, taglines, navigation notes, search prompts, and feedback with descriptive English. The FHIR version, DK Core scope, fixture labels, and no-backend architecture are unchanged.

## Build and deploy behavior

`.github/workflows/pages.yml` runs on pushes, pull requests, and manual dispatch. It installs locked dependencies, lints, runs unit/integration and base-path tests, builds the static application, and checks its assets and hash links. Only a non-PR run on the repository's default branch uploads and deploys the Pages artifact. Deployment has a separate job with `pages: write` and `id-token: write`; ordinary builds have `contents: read`. Deployments are queued, not canceled while publishing.

Node 22 is selected through `.nvmrc`. No API key or additional deployment secret is needed for the standard Actions Pages deployment. Only `dist/` is uploaded as the site artifact. The application has no runtime server or external API dependency; build-time GitHub Actions infrastructure is separate from the public static site.

## Base path

`npm run build:pages` determines the path from `GITHUB_REPOSITORY`:

- `owner/project` → `/project/`
- `owner/owner.github.io` → `/`
- Set the repository Actions variable `PAGES_BASE_PATH` to `/` for a custom domain or to another explicit absolute path ending in `/` when needed.

Local examples (the repository name is illustrative):

```sh
npm ci
GITHUB_REPOSITORY=example/fhir-atlas npm run build:pages
npm run check:pages
npm run preview:pages -- --port 4173
```

Or build with an explicit path:

```sh
PAGES_BASE_PATH=/fhir-atlas/ npm run build:pages
```

The preview prints its complete URL, including the project prefix. It serves the built files and deliberately does not provide an SPA fallback. `npm run dev` remains available for source development at the normal Vite URL.

`pages-build.json` records the generated prefix for the local checker/preview. It contains no credentials or personal data. The ordinary `npm run build` still uses Vite's configurable `VITE_BASE_PATH` and does not create Pages-specific preview metadata; use `build:pages` before `check:pages` or `preview:pages`.

## Configure the target repository

Once an owner/name or repository URL is selected:

1. Initialize and connect this source folder, or integrate it into the chosen repository after inspecting any existing contents. Do not overwrite another project.
2. Push the project, including `.github/workflows/pages.yml` and `package-lock.json`, to its default branch.
3. In repository Settings → Pages → Build and deployment, set Source to **GitHub Actions**. This may be set before the first push; if the first workflow runs before Pages is enabled, enable it and rerun the deployment.
4. Run or inspect “Check and deploy GitHub Pages”. The `github-pages` environment and deployment output provide the actual public URL.
5. Verify that public URL, direct lesson/Explorer links, refresh, browser Back, the lazy-loaded graph, fonts, and local progress. Until then, local checks are not evidence of a successful public deployment.

## Verification performed locally

- Lint and TypeScript/production build.
- Eight existing prototype unit/integration tests and four new base-path configuration tests.
- Production build for `/fhir-atlas/`.
- Static checker: entry HTML, all built JS/CSS/font assets, CSS URL resolution, five hash deep links, missing-file 404s, and trailing-slash redirect.
- Browser check of direct lesson loading and refresh under the project prefix, navigation to Patient, definition inspection, browser Back, and lazy graph loading.

The HTTP hash-link checks confirm delivery of the same static entry document. They do not alone assert that React rendered a route; browser checks cover rendering and interaction separately.

## Remaining acceptance item

A successful deployment to the chosen GitHub repository and verification on its returned public Pages URL. Repository selection is the only missing user configuration; DK Core package ingestion belongs to WP04.

References: [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Vite GitHub Pages deployment](https://vite.dev/guide/static-deploy.html#github-pages).

## Current UI screenshot

[Revised lesson with neutral copy](review/wp03/lesson-neutral.png). Earlier WP02 screenshots are historical and predate this copy revision.
