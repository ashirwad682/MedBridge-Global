<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Git & PR Workflow Rules
- **Never push directly to `origin/main`**: All updates must be made on a dedicated branch.
- **Dynamic Branch & PR Names**: Every branch and PR name must be unique and descriptive of the exact changes performed (e.g. `feat/add-patient-portal`, `fix/login-rate-limiting`).
- **Pull Request Only**: Always push the feature branch to origin and generate a Pull Request link targeting `main`.
