# Ivan Surya Hutomo

Personal portfolio for a Lead Applied AI Engineer and product builder. Redesigned in November 2026 with Hallmark and Design Taste.

## Run locally

Requires Node.js 22.12+ (Node.js 24 recommended).

```sh
npm ci
npm run dev
```

Vite prints the preview address. `npm run build` produces a standalone static site in `dist/`; `npm run preview` serves that build.

## Edit content

- `content/portfolio.json`: experience, education, publications, and independent project stories.
- `content/work.json`: three conservative IdeasLab cases (Studio and web combined; commercial work anonymized), six researched projects, and Kita Taiwan.
- `src/i18n/`: locale detection, React text localization, language control, and five structured catalogs.
- `src/Portfolio.jsx`: the full React portfolio, including all sections and interactive controls.
- `src/Resume.jsx`: the complete React resume, including publications and patents.
- `src/templates/`: document heads and metadata; `scripts/prerender.mjs` generates accessible HTML from React.
- `index.html` and `resume/index.html`: generated React HTML. Edit components, templates, or structured data rather than these files.
- `styles/tokens.css`: font, surfaces, colour themes, spacing, and radius rules.
- `styles/main.css`: responsive layouts and initial motion.
- `src/components/ProjectViewer.jsx`: the Motion project viewer, loaded only on project interaction.
- `src/client.js` and `src/hydrate.jsx`: a small first-paint loader and React hydration.
- `public/assets/`: self-hosted images, font files, and icons.

After editing structured content, run `node scripts/render-content.mjs`, or run the build. No backend, account, analytics, or contact service is needed. Contact uses the visitor's email client; the clipboard action reports actual success or failure.

## Verification

```sh
npm run check
npm run build
npm run preview -- --port 4175
# In a second terminal:
PORTFOLIO_URL=http://127.0.0.1:4175 npm test
PORTFOLIO_URL=http://127.0.0.1:4175 npm run test:locales
```

The browser check uses an installed Chrome and can be pointed elsewhere with `CHROME_PATH`. It checks both themes at seven widths, modal focus and Escape, theme persistence, mobile navigation, clipboard failure recovery, the no-JavaScript fallback, resume printing, and legacy URLs. Local screenshots, a printable resume PDF, and browser results are written to `.hallmark/reports/` and are not included in the build.

Every portfolio section and the resume are React components. React pre-renders both pages at build time, then hydrates after the first paint or on interaction. Without JavaScript, native project disclosures and mobile navigation still work. Reduced-motion and reduced-transparency preferences have explicit fallbacks.

## Existing URLs

The original portfolio is retained at `legacy.html`. All original demos (`line/`, `simplereact/`, and `usandb/`) and the former Readmory redirects (`kobo-books-summary/`) remain untouched and are copied into the production build. The original webpack bundles and GIF are retained for the archive. The new page does not load their dependencies or services.

## Publication

GitHub Pages builds and deploys `dist/` from `master` using `.github/workflows/pages.yml`. The original demo folders are included to preserve their URLs. See [deployment and rollback instructions](docs/deployment.md).

The canonical domain and social preview URLs currently target `https://alexivaner.github.io/`. Update these and `scripts/build.mjs` if changing the domain.

## Assets and attribution

Host Grotesk is self-hosted, with its license in `public/assets/fonts/`. Icons come from Phosphor (MIT). The opening describes IdeasLab / XView through an attributed editorial product overview. Employer imagery is excluded because portfolio reuse is not authorized. The earlier abstract artwork has been retired. Readmory shows a real capture of the owner’s connected Kobo library, with local covers and aggregate activity. Raw databases, notes, interview documents, and device serial numbers are excluded from the site. Aegis is a screenshot of the owner's working local prototype, not a public deployment or production-readiness claim.

Company cases contain factual employment history, general engineering skills, official links, and explicit team ownership attribution. Company-owned images, customer information, and private review documents are excluded from both this repository and the deployable artifact. Case-study copy stays general. The owner confirmed company approval to publish the exact supplied resume PDF; that file is served unchanged. This permission does not extend to other company material.

Public media provenance and license notices are recorded in [the asset attribution file](public/assets/ATTRIBUTION.md). All supplied client destinations remain referenced. Kita Taiwan opens a local case study because live availability could not be verified.

To update translations, edit the matching English source-string keys in all five `src/i18n/locales/*.json` catalogs. Missing entries display readable English. Keep names and technical identifiers intact. `test:locales` checks catalog parity, detection, persistence, failure recovery, modal state, and video lifecycle.

Run `npm run test:feedback` for media, keyboard navigation, research cases, and GHI. Run `npm run test:publication` for viewport playback policies, embedded robotics players, and resume PDF delivery. `npm run check:release` verifies that private review files and unapproved company media stay out of the production artifact.

The resume page works as readable HTML on mobile. Download and new-tab actions serve the owner's original one-page PDF, preserved byte-for-byte at `public/assets/ivan-surya-hutomo-resume.pdf`. Replace it only with an approved source PDF; the site does not generate or overwrite it from the HTML profile.

Product, website, and robotics thumbnails open their corresponding project details with keyboard focus restored on close. Separate source links still open the original website or video. The shared thumbnail component handles lazy viewer loading, first-click hydration, and a native disclosure fallback.
