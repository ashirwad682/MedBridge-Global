# Security Policy & Vulnerability Reporting

**Project:** MedBridge Global  
**Project Owner & Security Lead:** Ashirwad Kumar  
**Repository:** [https://github.com/ashirwad682/MedBridge-Global](https://github.com/ashirwad682/MedBridge-Global)

---

## 1. Supported Versions

Security patches and vulnerability remediation are actively maintained for the current production release line:

| Version | Supported | Status |
| :--- | :--- | :--- |
| `1.0.x` | Yes | Actively Maintained |
| `< 1.0.0` | No | Deprecated |

---

## 2. Reporting a Vulnerability

We take the security and integrity of MedBridge Global very seriously. If you discover a security vulnerability, credential exposure, data leak, or potential exploit in this repository, please report it immediately through responsible disclosure:

- **Primary Contact:** Ashirwad Kumar
- **Email:** `ashirwad682@gmail.com`
- **Subject Line:** `[SECURITY] MedBridge Global - Vulnerability Report`

**Please do NOT disclose security vulnerabilities publicly** (such as in public GitHub issues, discussions, social media, or public forums) until the vulnerability has been triaged, patched, and verified.

### Information to Include in Your Report
To help us investigate and remediate the issue promptly, please include:
1. Type of issue (e.g., authentication bypass, injection, IDOR, credential leakage, SSRF).
2. Affected files, endpoints, or components.
3. Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
4. Potential security impact and severity assessment.

### Response & Remediation Timeline
- **Initial Acknowledgment:** Within 24-48 hours.
- **Triage & Assessment:** Within 72 hours.
- **Fix & Patch Deployment:** Critical vulnerabilities are addressed with highest priority.

---

## 3. Credential Protection & Secret Handling Policy

MedBridge Global enforces strict zero-credential-exposure standards:
- **Environment Isolation:** Secrets, JWT signing keys, and MongoDB connection strings are strictly kept within server-side environment variables (`.env.local`) and are NEVER exposed to client browsers or mobile builds.
- **Automated Secret Scanning:** Automated checks verify that no access tokens, cloud keys, or credentials are committed to version control.
- **Immediate Revocation:** In the event of any accidental credential exposure, affected secrets, keys, and connection credentials must be rotated and revoked immediately.

---

## 4. Branch Protection & Production Deployment Controls

To protect the integrity of the codebase:
- **Protected `main` Branch:** Direct pushes, force pushes, and branch deletions are strictly restricted.
- **Required Pull Request Reviews:** All changes must go through pull requests reviewed and authorized by the Project Owner (`@ashirwad682`).
- **Automated CI Checks:** Builds, type checks, and security scans must pass before any pull request can be merged.
- **Dependabot Alerts:** Automated vulnerability scanning tracks all package dependencies for security advisories.
