# Contributing to MedBridge Global

Thank you for your interest in contributing to **MedBridge Global**.

**Project Owner & Copyright Holder:** Ashirwad Kumar  
**Repository:** [https://github.com/ashirwad682/MedBridge-Global](https://github.com/ashirwad682/MedBridge-Global)

---

## 1. Proprietary Licensing & Intellectual Property Assignment

MedBridge Global is a proprietary software project owned exclusively by **Ashirwad Kumar**.

By submitting a pull request, issue, patch, or code contribution to this repository, you explicitly acknowledge and agree that:
1. **Intellectual Property Assignment:** Any contribution you submit becomes the exclusive property of Ashirwad Kumar, or you grant an irrevocable, worldwide, perpetual, royalty-free, exclusive license to Ashirwad Kumar to use, modify, sublicense, distribute, and commercialize the contribution.
2. **Originality:** You represent that all contributed code and assets are your original creations or that you have full legal right and authorization to submit them under these terms.
3. **No Third-Party Entanglements:** You will not introduce any code subject to GPL, AGPL, or other reciprocal copyleft licenses that would conflict with the proprietary licensing of MedBridge Global.
4. **No Direct Push to `main`:** All contributions must be submitted via feature branches and pull requests. Direct commits or pushes to `main` or production branches are strictly forbidden.

---

## 2. Pull Request & Review Process

1. **Branch Naming Conventions:**
   - Features: `feat/<feature-name>` (e.g., `feat/patient-telehealth`)
   - Bugfixes: `fix/<issue-name>` (e.g., `fix/appointment-slot-overlap`)
   - Documentation: `docs/<topic>`
   - Security: `security/<patch-name>`

2. **Pull Request Requirements:**
   - Must be submitted against a dedicated feature branch, never directly to `main`.
   - Must complete all template fields in `.github/PULL_REQUEST_TEMPLATE.md`.
   - Must pass all automated checks, linting, and TypeScript compilation (`npx tsc --noEmit`).
   - Must include no committed secrets, environment variables, or private API keys.
   - Must be reviewed and approved by the Project Owner (`@ashirwad682`) prior to merging.

---

## 3. Security & Secret Protection

- Never commit `.env`, `.env.local`, `.pem`, private keys, MongoDB credentials, or API secrets.
- Run `npm run security:check` before opening a pull request to verify that no sensitive credentials exist in the diff.
- Any vulnerability must be disclosed confidentially in accordance with [SECURITY.md](../SECURITY.md).

---

## 4. Code Standards & Architecture

- **Web:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React icons.
- **Mobile:** Expo SDK, React Native, TypeScript.
- **Backend:** Node.js, Express, MongoDB with Mongoose ODM.
- **Typing:** Strict TypeScript across all monorepo packages.
