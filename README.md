# MedBridge Global — Cross-Platform Monorepo (Web + Mobile + Backend)

A premium healthcare platform delivering synchronized clinical records, board-certified physician discovery, zero-wait time scheduling, and private consultations across Web, Android, and iOS.

---

## 1. Monorepo Architecture

```
MedBridge-Global/
├── apps/
│   ├── web/                     # Full Next.js 16 Web Portal (App Router, Tailwind CSS v4)
│   │   ├── app/                 # All routes (/, /doctors, /book, /specialties, /dashboard)
│   │   ├── components/          # React web UI components & luxury design system
│   │   ├── public/              # High-res medical portraits, clinics, badges
│   │   ├── next.config.ts
│   │   ├── postcss.config.mjs
│   │   └── package.json
│   │
│   └── mobile/                  # React Native + Expo Mobile Application (iOS & Android)
│       ├── app/                 # Expo Router file-based screens
│       │   ├── (auth)/          # Splash, Welcome, Login, Register, Forgot Password
│       │   ├── (patient)/       # Patient Bottom Tabs: Home, Doctors, Bookings, Profile
│       │   ├── (doctor)/        # Doctor Bottom Tabs: Queue, Schedule, Profile
│       │   └── doctor/[id].tsx  # Doctor Details & Instant Slot Booking Screen
│       ├── components/          # Native mobile components & AuthContext
│       ├── assets/              # App icon, adaptive icon, splash screen
│       ├── app.json             # Expo project configuration
│       └── package.json
│
├── packages/
│   ├── types/                   # Shared TypeScript models (User, Doctor, Appointment, etc.)
│   ├── constants/               # Design tokens (Graphite, Violet, Lilac, Ice), time slots
│   ├── validation/              # Shared Zod validation schemas (Login, Register, Booking)
│   ├── api/                     # Universal API client supporting Web cookies & Mobile Bearer tokens
│   └── config/                  # Shared environment helpers & base URL resolvers
│
├── backend/                     # Dedicated Node.js + Express + MongoDB REST API
│   ├── controllers/             # Auth, Doctor, and Appointment controllers
│   ├── models/                  # Shared Mongoose models (User, Appointment, DoctorProfile)
│   ├── routes/                  # Express endpoints (/api/auth, /api/doctors, /api/appointments)
│   ├── middleware/              # JWT Bearer verification, RBAC, error handlers
│   ├── config/                  # MongoDB connection with graceful memory fallback
│   ├── server.ts                # Express server listening on PORT 5001
│   └── package.json
│
├── package.json                 # Monorepo root with npm workspaces ("apps/*", "packages/*", "backend")
├── tsconfig.json                # Root TSConfig with workspace path aliases
└── README.md
```

---

## 2. Design System Tokens

| Token | Hex Value | Role |
| :--- | :--- | :--- |
| **Graphite** | `#17151F` | Primary dark surface, text, and header background |
| **Violet** | `#7657FF` | Brand primary color, active highlights, buttons |
| **Lilac** | `#A99AFF` | Subtitles, pill borders, secondary brand accents |
| **Ice** | `#EDEAFF` | Subtle card tints, badges, and icon backgrounds |
| **White** | `#F8F7FC` | Background canvas and card surfaces |

---

## 3. Quick Start & Execution Commands

### Prerequisites
- Node.js `v18+` or `v20+` (tested up to Node `v25`)
- npm `v10+`
- Expo Go on physical device (optional for mobile testing)

### Install All Dependencies
From the repository root:
```bash
npm install
```

### Running Applications Independently

| Application | Command | URL / Environment |
| :--- | :--- | :--- |
| **Web Application** | `npm run web` | [http://localhost:3000](http://localhost:3000) |
| **Mobile Application** | `npm run mobile` | Starts Expo dev server & QR code |
| **Mobile (iOS)** | `npm run mobile:ios` | Launches iOS Simulator |
| **Mobile (Android)**| `npm run mobile:android` | Launches Android Emulator |
| **Backend API** | `npm run backend` | [http://localhost:5001](http://localhost:5001) |
| **Web Production Build** | `npm run web:build` | Generates 63 optimized static & ISR routes |

---

## 4. Mobile Application Experience (`apps/mobile`)

The mobile app has been built from scratch with native layouts:
- **Splash & Routing Gate**: Checks active auth session and routes to Patient, Doctor, or Welcome.
- **Authentication**:
  - `Welcome Screen`: MedBridge brand presentation with direct CTAs.
  - `Sign In`: Dual-role toggle (`Patient` vs `Physician`), input validation, and one-tap **Demo Fill** buttons.
  - `Patient Registration`: Name, email, phone, and password.
  - `Doctor Registration`: Medical registration / license number, specialization, hospital affiliation.
- **Patient Dashboard**:
  - `Home`: Greeting, active consultation spotlight card with direct pass access, horizontal specialty carousel, and top-rated specialists.
  - `Doctors`: Live search with debouncing, specialty filter chips, doctor ratings, experience, and fee cards.
  - `Consultations`: Segmented view (`Upcoming` vs `Past`), status tags (`CONFIRMED`, `COMPLETED`, `CANCELLED`), and appointment cancellation.
  - `Profile`: Verified medical record status, personal information, and session logout.
- **Doctor Dashboard**:
  - `Clinical Queue`: Real-time queue with patient complaint, consultation type (`In-Person` or `Virtual Video`), and status progression (`Checked In` → `In Consultation` → `Completed`).
  - `Schedule`: Weekly clinical day selectors, new patient toggles, and slot management.
  - `Profile`: Board credentialing verification, license details, and hospital affiliation.
- **Doctor Detail & Direct Booking (`doctor/[id]`)**:
  - Full biography, clinical qualifications, and hospital credentials.
  - Interactive 7-day date selector.
  - Live available time slots (synchronized with backend slot reservations).
  - One-tap booking confirmation with elevated Digital Consultation Pass.

---

## 5. Environment Variables

Create `.env.local` in the project root:
```env
# MongoDB Connection
MONGODB_URI=mongodb://127.0.0.1:27017/medbridge
MONGODB_DB_NAME=medbridge

# JWT Authentication
AUTH_SECRET=medbridge_super_secret_jwt_key_2026_healthcare_security

# Backend Port
BACKEND_PORT=5001

# Mobile Client URL (defaults to http://localhost:5001 or LAN IP)
EXPO_PUBLIC_API_URL=http://localhost:5001
```

---

## 6. Demo Accounts (Out-of-the-Box)

Both Web and Mobile support instant demonstration credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Patient** | `patient@medbridge.com` | `password123` |
| **Doctor** | `doctor@medbridge.com` | `password123` |

---

## 7. License

Copyright © 2026 Ashirwad Kumar. All Rights Reserved.  
This project and its original source materials are proprietary software. See [LICENSE](LICENSE) for terms. Third-party open-source dependencies are acknowledged in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

