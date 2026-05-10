# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Always run `nvm use` first to pick up the Node version pinned in `.nvmrc`.

- `npm run dev` — generates `src/lib/projects.js` from markdown, then starts Vite dev server.
- `npm run build` — same generate step, then production static build (output in `build/`).
- `npm run preview` — serves the built site on port 4173 (used by Playwright).
- `npm run check` — `svelte-kit sync` + `svelte-check` against `tsconfig.json`.
- `npm run lint` — `prettier --check .` followed by `eslint .`.
- `npm run format` — Prettier write.
- `npm run test` / `npm run test:e2e` — Playwright. The config (`playwright.config.ts`) starts its own webserver via `npm run build && npm run preview`, so a dev server does not need to be running. Run a single file with `npx playwright test e2e/<file>.test.ts` and a single test with `-g "<title>"`.
- `npm run generate-projects` — regenerates `src/lib/projects.js` from `projects/**/*.md`.
- `npm run generate-workflows` — regenerates `.github/workflows/integration.yml` and `submit-project.yml`.
- `npm run licenses` — refreshes `third-party-licenses.txt`.

## Architecture

### Static SvelteKit site, markdown-driven content

Built with SvelteKit 2 + Svelte 5 (runes) + Vite 7 + Tailwind 4. `@sveltejs/adapter-static` outputs a fully prerendered site (`prerender = true` in `src/routes/+layout.ts`) with a `404.html` fallback, deployed to GitHub Pages. `svelte.config.js` reads `BASE_PATH` from the env at build time so it works under a subpath.

### Generated content module is the data layer

`projects/<Category>/<slug>.md` is the source of truth for guides. `scripts/generate-projects.js` walks that tree and writes `src/lib/projects.js` with three exports consumed throughout the app:

- `groupedProjects` — array of `{ folder, projects: [{ slug, title, markdown }] }`, with `Getting Started` pinned first.
- `projectsData` — `{ [slug]: { title, category, markdown } }` (used by `routes/projects/[slug]/+page.ts`).
- `projects` — flat array of slugs.

Title is extracted from the first line starting with `# `. **`src/lib/projects.js` is generated — never edit it by hand. It is committed (so `npm run check` can resolve imports), but `npm run dev` / `build` / `preview` regenerate it first, and the integration workflow auto-commits regenerated output back to PR branches.**

### Custom markdown rendering pipeline

`src/lib/CustomMarkdown.svelte` is the renderer used for guide content. It splits markdown into three section kinds before rendering:

- Lines that are bare `https://scratch.mit.edu/projects/<id>` URLs become embedded `<ScratchProject>` iframes.
- ` ```scratchblocks ` fenced blocks become `<ScratchBlock>` components rendered with the `scratchblocks` library.
- Everything else is passed to `<Markdown>` (markdown-it).

When editing markdown rendering, change `CustomMarkdown.svelte` rather than substituting a stock markdown component — the scratchblocks/embed handling lives only in this splitter.

### Generated GitHub workflows

`.github/workflows/integration.yml` and `submit-project.yml` are emitted by `scripts/generate-workflows.js` and carry a "THIS FILE IS GENERATED — DO NOT EDIT DIRECTLY" header. To change CI steps or the submission flow, edit the generator and run `npm run generate-workflows`. The generator hard-codes the list of valid project categories from the names of subfolders under `projects/`, so **adding a new top-level category requires regenerating the workflows** (otherwise issue submissions for that category will be rejected by the workflow).

### Project submission flow

Users open an issue using `.github/ISSUE_TEMPLATE/project-submission.yml`. When the issue is labeled `project-submission`, `submit-project.yml` parses the form fields, sanitizes the filename, writes `projects/<Category>/<slug>.md`, runs the same generate/format/lint/check/build/test pipeline as integration, then opens a PR closing the issue. Because PRs created by `GITHUB_TOKEN` cannot trigger other workflows, the integration steps are inlined into this workflow on purpose.

### Routing

- `/` (`routes/+page.svelte`) — index of `groupedProjects`.
- `/projects/[slug]` — renders `projectsData[slug].markdown` via `CustomMarkdown`.
- `/about`, `/submit-project` — static pages. `+layout.svelte` switches `<main>` to `full-width` for the submit-project route based on `data.page` from `+layout.ts`.

## Conventions

- TypeScript throughout `.ts` and `.svelte` files; a couple of legacy lib modules use `// @ts-nocheck` or `// @ts-expect-error because of laziness` — fine to keep, no need to refactor opportunistically.
- ESLint config disables `svelte/no-at-html-tags` (the markdown renderer needs `{@html}`).
- Prettier with `prettier-plugin-svelte` and `prettier-plugin-tailwindcss` is the formatter of record; `npm run lint` will fail on unformatted files.
- When you change a project markdown file, run `npm run generate-projects` (or just `npm run dev` / `build`) so `src/lib/projects.js` stays in sync — CI will regenerate and commit it back if you forget, but local checks (`npm run check`) read from the committed file.
