# Contributing

Thanks for helping improve the Nexza portfolio. Keep content in JSON, preserve keyboard and reduced-motion accessibility, and avoid adding dependencies that require native binaries or install-time network scripts: the project should remain runnable on Android/Termux.

## Local setup

Requirements: Node.js 20 or later and npm.

```sh
npm install
npm run dev
```

## Content changes

Most site content is in `data/*.json`. Use the existing structure, do not add unsupported claims or links, and run `npm run validate:data` after edits. Empty arrays are valid; the Education, Open Source Contributions, Achievements and Focus Areas sections show their configured empty-state copy until data is added.

When adding a project, give it a unique numeric ID and add a cover in `src/pages/projects/covers/coverRegistry.ts`. When adding a skill, add its name to the relevant category in `data/skills.json` and register an icon in `src/utils/skillIcons.ts` if it should have a glyph. The icon generator uses only Node.js built-ins:

```sh
npm run brand:icons
```

To customize the mascot, replace `src/assets/brand/mascot-frames.svg` with an eight-frame horizontal sprite strip. Keep the frame order and ground contacts documented in `src/assets/brand/README.md`.

## Checks

Run the full local gates before opening a pull request:

```sh
npm run format:check
npm run lint
npm run type-check
npm run validate:data
npm test
npm run build
```

Pull requests should describe the change, note the checks run, and include a screenshot for visible UI changes where practical. CI runs the same checks and deploys only from `main`.
