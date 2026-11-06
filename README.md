# Nexza Portfolio

A React 19 + Vite portfolio for **Nexza** — Network Engineer · Developer · Cyber Security, based in Greece. Networking and network security lead.

## Run locally

```sh
npm install && npm run dev
```

Node.js 20 or later is required. npm is the only package manager. The project has no install-time network hooks and keeps the Vite bundler's optional Android bindings for Termux compatibility.

## Build and verify

```sh
npm run build
npm test
npm run type-check
npm run lint
npm run format:check
npm run validate:data
npm audit --omit=dev
```

Vite writes the production site to `build/`. To preview it locally, run `npm run preview`.

## Structure

- `src/` — application entry, routes/sections, shared components, hooks, utilities and constants
- `data/` — JSON content and interface copy
- `public/` — static assets, resume pages and Cloudflare Pages headers
- `scripts/` — data validation, resume preparation, machine-readable views and security-header generation
- `.github/` — CI and scheduled data-sync workflows

`public/_headers` is generated from `scripts/security-policy.js`; the same policy is used by the Vite development and preview servers. No third-party analytics script is shipped or loaded. The contact form uses EmailJS only when all three configured IDs are present; otherwise it falls back to `mailto:`.

## Content

The portfolio is JSON-driven. Update `data/personal.json`, `data/experience.json`, `data/skills.json`, `data/projects.json`, `data/education.json`, `data/achievements.json`, `data/services.json`, `data/news.json`, `data/contact.json`, `data/sections.json`, and `data/ui.json` for content and interface copy.

## Deployment

When deploying to Cloudflare Pages, set **Root directory** to the repository root (change it from `nexza-portfolio`). The build output directory is `build`.

## License

GPL-3.0. See `LICENSE` and `NOTICE` for the original template attribution.
