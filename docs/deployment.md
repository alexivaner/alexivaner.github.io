# Deployment

The personal portfolio is hosted at https://alexivaner.github.io/. GitHub Pages uses the Actions build type. A push to `master` runs `.github/workflows/pages.yml`, installs the lockfile dependencies with Node.js 24, builds both pre-rendered React pages, checks content and release boundaries, and deploys only `dist/`.

## Verify before pushing

Run `npm ci`, `npm run build`, `npm run check`, and `npm run check:release`. Serve the production directory on port 4175, then run `npm test`, `npm run test:locales`, `npm run test:feedback`, `npm run test:publication`, `npm run test:motion`, and `npm run test:protected` (the latter requires the ignored private source and passphrase) with local Chrome. Check the Actions run after pushing and inspect the public homepage, `/resume/`, the resume PDF, and existing demo routes.

Private employment documents, review reports, and permission-pending drafts are deliberately ignored. Never force-add these files. Employer media requires confirmed reuse permission.

## Roll back

Use a new commit reverting the offending source change on `master`, then let the same workflow rebuild. Do not force-push. To restore the original 2021 site, the preserved `/legacy.html` remains available while a rollback is prepared. Full pre-redesign source is at commit `622c8d0`; restoring it also requires returning Pages to the legacy `master` root source because that commit predates this build workflow.
