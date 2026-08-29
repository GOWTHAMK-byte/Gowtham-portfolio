# AGENTS.md

## Project purpose
This repository is a static personal portfolio site for a software engineer. The site is built with plain HTML, CSS, and JavaScript and is meant to showcase profile, projects, coding stats, and contact links without a framework or build pipeline.

## Working conventions
- Keep the page static and lightweight; do not introduce a framework or dependency-heavy tooling unless explicitly requested.
- Prefer small, targeted edits in the existing structure rather than rewriting the page.
- Maintain the current visual language: dark futuristic UI, glassmorphism panels, neon accents, and monospaced labels.
- Preserve accessibility: semantic sectioning, meaningful link labels, alt/aria text where relevant, and readable contrast.

## Key files
- [index.html](index.html): page structure and content sections for hero, stats, projects, and contact.
- [styles.css](styles.css): layout, theming, animations, responsive behavior, and reusable utility classes.
- [script.js](script.js): reveal-on-scroll, counters, and browser-side GitHub API fetching.
- [assets/](assets/): local media and brand assets.

## Editing guidance
- Add or update content in the relevant section of [index.html](index.html) instead of creating duplicate content elsewhere.
- Keep styling changes in [styles.css](styles.css) using the existing CSS variable palette and class patterns.
- Keep interactivity small and deterministic in [script.js](script.js); avoid introducing async patterns or dependency fetching beyond the existing GitHub data request.
- If a new project or profile section is added, match the current card-based layout and spacing conventions.

## Runtime and verification
- There is no package build step in this project.
- For local preview, run a static file server from the workspace root, for example:
  - `python -m http.server 8000`
  - then open `http://localhost:8000`
- Browser-side GitHub stats rely on the public GitHub API and should fail gracefully if the request is limited or blocked.

## Quality bar
- Preserve responsive design across desktop and mobile breakpoints.
- Do not break existing anchor navigation links (`#projects`, `#internships`, `#services`, `#contact`, etc.).
- When updating text, prefer concise, polished portfolio language over filler content.
- If visual tweaks are needed, keep them consistent with the existing aesthetic rather than introducing a drastically different style.

## Change checklist for agents
Before finalizing a change, verify that:
1. The page still loads without console-breaking errors in a static browser context.
2. The layout remains visually coherent on common viewport sizes.
3. Links and navigation anchors still work.
4. Any dynamic content remains gracefully non-blocking if data endpoints fail.
