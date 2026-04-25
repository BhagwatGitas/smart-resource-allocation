# 🏥 Smart Hospital Resource Allocation System
## Complete Project Roadmap | **4-Member Team (Frontend · Backend · AI/ML · DevOps)**

> **Stack**: React 18 + TypeScript · Node.js (Express) · **Python FastAPI (AI/ML Microservice)** · PostgreSQL + Redis · Socket.io · Docker · GitHub Actions · AWS/GCP
> **Goal**: Patient requests Blood / Organ → AI matches & predicts availability → Real-time allocation in < 5 seconds
> **Duration**: 8 Weeks (2 Months)

---

## TABLE OF CONTENTS

1. [Project Overview & Differentiators](#1-project-overview--differentiators)
2. [System Architecture](#2-system-architecture)
3. [Database Schema](#3-database-schema)
4. [Folder Structure](#4-folder-structure)
5. [Environment Variables](#5-environment-variables)
6. [Member 1 — Frontend Developer Roadmap](#6-member-1--frontend-developer-roadmap)
7. [Member 2 — Backend Developer Roadmap](#7-member-2--backend-developer-roadmap)
8. [Member 3 — AI/ML Engineer Roadmap](#8-member-3--aiml-engineer-roadmap)
9. [Member 4 — DevOps Engineer Roadmap](#9-member-4--devops-engineer-roadmap)
10. [API Reference](#10-api-reference)
11. [Integration Points Table](#11-integration-points-table)
12. [Project Survival Rules](#12-project-survival-rules)
13. [Build Order Quick Reference](#13-build-order-quick-reference)
14. [Demo Script](#14-demo-script)

---

## 1. Project Overview & Differentiators

### What We're Building
A real-time hospital resource management platform where patients, doctors, and admins can request and track **blood** (all 8 types: A+, A−, B+, B−, AB+, AB−, O+, O−) and **organs** (kidney, liver, heart, lungs, cornea, pancreas) — with AI-powered matching, shortage prediction, and priority scoring, all updating live.

### Who Uses It
- **Doctors & Nurses** — request critical resources instantly; see real-time blood and organ availability
- **Hospital Admins** — manage inventory, view AI shortage alerts, approve organ matches
- **Patients / Families** — track their resource request status in real time

### Our 6 Differentiators vs Existing Systems

| Gap in Existing Tools | Our Answer |
|---|---|
| Static blood inventory spreadsheets | ✅ Real-time WebSocket updates for blood stock changes |
| No blood demand forecasting | ✅ Time-series AI model predicts shortage 3–7 days ahead |
| Manual organ matching | ✅ ML compatibility scorer with ranked candidate list |
| Siloed per-department data | ✅ Unified cross-hospital dashboard |
| No priority scoring for requests | ✅ AI urgency + compatibility combined priority engine |
| Black-box decisions | ✅ SHAP-style explainability on every AI recommendation |

---

## 2. System Architecture

```
+----------------------------------------------------------------------------------+
|                   SMART HOSPITAL RESOURCE ALLOCATION SYSTEM                      |
|                                                                                  |
|  +------------------+    +----------------------+    +------------------------+  |
|  |   FRONTEND        |    |  NODE.JS BACKEND      |    |  PYTHON AI MICROSERVICE|  |
|  |  React 18 + TS    |<-->|  Express REST API     |<-->|  FastAPI + Uvicorn     |  |
|  |  Tailwind CSS     |    |  JWT Auth (RBAC)      |    |  Blood Demand Forecast |  |
|  |  Recharts         |    |  WebSocket (Socket.io)|    |  Organ Compatibility   |  |
|  |  Socket.io-client |    |  Redis Cache          |    |  Priority Score Engine |  |
|  |  React Query      |    |  Prisma ORM           |    |                        |  |
|  +------------------+    +----------------------+    +------------------------+  |
|           |                        |                                              |
|           v                        v                                              |
|  +------------------+    +----------------------+                                |
|  |  BROWSER STATE    |    |  POSTGRES + REDIS     |                                |
|  |  Zustand Store    |    |  Patient Records      |                                |
|  |  React Query Cache|    |  Blood Inventory      |                                |
|  +------------------+    |  Organ Registry       |                                |
|                           +----------------------+                                |
+----------------------------------------------------------------------------------+
```

> ⚡ **Key Architecture Decision**: The Node.js backend is the **single point of contact** for the frontend. It forwards all AI/ML tasks to the **Python FastAPI microservice** via internal HTTP. Member 1 (Frontend) always calls the same Node.js endpoints — no direct contact with Python service.

### End-to-End Data Flow

```
Doctor submits resource request (Blood / Organ)
        |
        v
[Node.js Backend] validate → check Redis cache → query PostgreSQL
        |
        +---> [Python AI Service] POST /ai/blood/forecast
        |     → { blood_type, predicted_units, shortage_risk, confidence }
        |
        +---> [Python AI Service] POST /ai/organ/match
        |     → { ranked_recipients: [{patient_id, score, factors}] }
        |
        +---> [Python AI Service] POST /ai/priority
        |     → { priority_score, urgency_level, explanation_factors }
        |
        v
[Node.js Backend] save → publish WebSocket event → respond to frontend
        |
        v
[Frontend] Dashboard updates in real-time: availability + AI recommendations
```

---

## 3. Database Schema

```
hospital_system (PostgreSQL)
|
+-- hospitals
|   +-- id (uuid), name, city, state, type (govt/private/trust)
|   +-- contact, lat, lng, createdAt
|
+-- users
|   +-- id, name, email, password_hash
|   +-- role (admin/doctor/nurse/patient)
|   +-- hospital_id (FK), createdAt
|
+-- patients
|   +-- id, user_id (FK), name, age, gender, blood_type
|   +-- diagnosis, admission_date, discharge_date
|
+-- blood_inventory
|   +-- id, hospital_id (FK)
|   +-- blood_type (A+/A-/B+/B-/AB+/AB-/O+/O-)
|   +-- units_available, expiry_date, last_restocked
|   +-- min_threshold (alert trigger)
|
+-- blood_requests
|   +-- id, patient_id (FK), doctor_id (FK), hospital_id (FK)
|   +-- blood_type, units_required
|   +-- urgency (critical/high/medium/low)
|   +-- status (pending/approved/fulfilled/rejected)
|   +-- ai_priority_score, ai_urgency_level
|   +-- createdAt, fulfilledAt
|
+-- organ_donors
|   +-- id, name, age, gender, blood_type
|   +-- available_organs [kidney/liver/heart/lungs/cornea/pancreas]
|   +-- hla_markers, hospital_id (FK)
|   +-- status (active/matched/expired)
|
+-- organ_requests
|   +-- id, patient_id (FK), doctor_id (FK), organ_type
|   +-- urgency_score (0-100), wait_since
|   +-- status (waiting/matched/transplanted/cancelled)
|   +-- matched_donor_id (FK)
|   +-- ai_priority_score, ai_urgency_level
|
+-- audit_logs
    +-- id, action_type, resource_type, resource_id
    +-- performed_by (user_id), hospital_id
    +-- details (JSON), createdAt
```

**Redis Cache Keys**
```
blood:inventory:{hospital_id}:{blood_type}   →  { units }               TTL: 60s
ai:forecast:{hospital_id}:{blood_type}       →  { prediction JSON }     TTL: 6h
ai:organ_match:{request_id}                  →  { ranked JSON }         TTL: 30m
```

---

## 4. Folder Structure

```
hospital-resource-system/                   ← Monorepo root
|
+-- frontend/                               ← Member 1
|   +-- src/
|   |   +-- app/
|   |   |   +-- layout.tsx
|   |   |   +-- page.tsx
|   |   |   +-- (auth)/login/page.tsx
|   |   |   +-- (auth)/register/page.tsx
|   |   |   +-- dashboard/page.tsx
|   |   |   +-- blood/page.tsx
|   |   |   +-- organs/page.tsx
|   |   |   +-- requests/page.tsx
|   |   |   +-- admin/page.tsx
|   |   +-- components/
|   |   |   +-- ui/       (BloodTypeCard, OrganCard, PriorityBadge, FactorCard)
|   |   |   +-- charts/   (BloodForecastChart, CompatibilityRankList)
|   |   |   +-- forms/    (BloodRequestForm, OrganRequestForm)
|   |   |   +-- layout/   (Sidebar, Navbar, AlertBanner, NotificationCenter)
|   |   +-- hooks/        (useSocket, useBlood, useOrgans, useAuth)
|   |   +-- store/        (Zustand: auth, notifications, resources)
|   |   +-- lib/          (axios instance, query client, socket client)
|   +-- Dockerfile
|
+-- backend/                                ← Member 2
|   +-- src/
|   |   +-- routes/
|   |   |   +-- auth.ts
|   |   |   +-- hospitals.ts
|   |   |   +-- blood.ts
|   |   |   +-- organs.ts
|   |   |   +-- patients.ts
|   |   |   +-- ai.ts           (proxy to Python AI service)
|   |   |   +-- audit.ts
|   |   +-- middleware/
|   |   |   +-- auth.ts         (JWT verify + RBAC)
|   |   |   +-- cache.ts        (Redis cache middleware)
|   |   |   +-- validate.ts     (Zod schemas)
|   |   |   +-- rateLimit.ts
|   |   +-- services/
|   |   |   +-- aiClient.ts     (HTTP client to Python AI service)
|   |   |   +-- socket.ts       (Socket.io emitters)
|   |   |   +-- notifications.ts
|   |   +-- prisma/schema.prisma
|   |   +-- index.ts
|   +-- tests/
|   +-- swagger.yaml
|   +-- Dockerfile
|
+-- ml-service/                             ← Member 3
|   +-- app/
|   |   +-- main.py
|   |   +-- routers/
|   |   |   +-- blood.py        (POST /ai/blood/forecast)
|   |   |   +-- organ.py        (POST /ai/organ/match)
|   |   |   +-- priority.py     (POST /ai/priority)
|   |   +-- services/
|   |   |   +-- blood_forecast.py
|   |   |   +-- organ_matcher.py
|   |   |   +-- priority_engine.py
|   |   +-- models/             (saved .pkl files)
|   |   +-- schemas/            (Pydantic input/output)
|   |   +-- utils/              (SHAP explainer, feature engineering)
|   +-- training/               (notebooks, training scripts)
|   +-- tests/
|   +-- requirements.txt
|   +-- Dockerfile
|
+-- infra/                                  ← Member 4
|   +-- terraform/
|   +-- k8s/
|   |   +-- frontend-deployment.yaml
|   |   +-- backend-deployment.yaml
|   |   +-- ml-service-deployment.yaml
|   |   +-- ingress.yaml
|   +-- monitoring/
|       +-- prometheus.yml
|       +-- grafana-dashboard.json
|
+-- .github/workflows/
|   +-- frontend-ci.yml
|   +-- backend-ci.yml
|   +-- ml-service-ci.yml
|
+-- docker-compose.yml                      ← Member 4 owns
+-- README.md
```

---

## 5. Environment Variables

### Frontend (`frontend/.env.local`)
```env
VITE_API_BASE_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

### Backend (`backend/.env`)
```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/hospital_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
AI_SERVICE_URL=http://localhost:8000
BCRYPT_ROUNDS=12
```

### ML Service (`ml-service/.env`)
```env
PORT=8000
MODEL_DIR=./models
LOG_LEVEL=info
```

### DevOps / Infra (`infra/.env`)
```env
AWS_REGION=ap-south-1
ECR_REGISTRY=your_account.dkr.ecr.ap-south-1.amazonaws.com
DB_INSTANCE_CLASS=db.t3.medium
REDIS_NODE_TYPE=cache.t3.micro
```

---

## 6. Member 1 — Frontend Developer Roadmap

**Owns**: All UI/UX — pages, components, real-time updates, charts, forms, accessibility
**Never touches**: API business logic, ML model code, database schema, cloud infra
**Timeline**: 8 Weeks

---

### Phase 0 — Setup & Foundation (Week 1)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 1** | `npm create vite@latest frontend -- --template react-ts` → `cd frontend` → `npm install` → verify app runs on `localhost:3000` | React 18 + TypeScript app boots |
| **Week 1** | `npm install -D tailwindcss postcss autoprefixer` → `npx tailwindcss init -p` → configure `tailwind.config.ts` with content paths | Tailwind CSS working, utility classes apply |
| **Week 1** | `npm install react-router-dom@6 zustand @tanstack/react-query axios socket.io-client` | All core dependencies installed |
| **Week 1** | `lib/axios.ts` — create Axios instance with `baseURL: import.meta.env.VITE_API_BASE_URL` + request interceptor that injects `Authorization: Bearer <token>` from Zustand store | All API calls automatically carry JWT |
| **Week 1** | `lib/socket.ts` — create Socket.io-client singleton: `io(import.meta.env.VITE_SOCKET_URL, { autoConnect: false })` | Socket client ready to connect on auth |
| **Week 1** | `store/auth.ts` — Zustand store: `{ user, token, role, login(token, user), logout() }`, persist token to `localStorage` | Auth state survives page refresh |
| **Week 1** | `hooks/useAuth.ts` — exposes `user`, `role`, `isAuthenticated`, `login()`, `logout()` | Auth hook usable in any component |
| **Week 1** | `components/layout/PrivateRoute.tsx` — checks `isAuthenticated`; redirects to `/login` if false | Protected pages redirect unauthenticated users |
| **Week 1** | Build reusable component library: `Button`, `Modal`, `Card`, `Badge`, `Table`, `AlertBanner`, `Skeleton` in `components/ui/` | Shared components ready for all pages |

✅ **Week 1 Checkpoint**: App boots on `localhost:3000`. Auth store persists token. PrivateRoute blocks unauthenticated access. Component library ready.

---

### Phase 1 — Auth & Hospital Dashboard (Week 2)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 2** | `app/(auth)/login/page.tsx` — email + password form, calls `POST /auth/login`, stores token via `auth.login()`, redirects to `/dashboard` | Login page submits and redirects on success |
| **Week 2** | `app/(auth)/register/page.tsx` — name, email, password, role selector (`doctor / nurse / patient`), hospital dropdown, calls `POST /auth/register` | Registration flow complete |
| **Week 2** | `components/layout/Sidebar.tsx` — role-based nav links: doctor sees Blood / Organs / Requests; admin sees all + Admin panel; patient sees only Requests | Sidebar shows correct links per role |
| **Week 2** | `components/layout/Navbar.tsx` — hospital name, logged-in user name, logout button, notification bell icon linking to `NotificationCenter` | Top navigation renders with user info |
| **Week 2** | `app/dashboard/page.tsx` — 3 stat cards: Blood Shortage Alerts, Pending Organ Requests, Total Active Requests; fetches `GET /hospitals/:id/stats` with React Query (`staleTime: 30000`) | Dashboard shows live hospital stats |
| **Week 2** | `components/layout/NotificationCenter.tsx` — slide-out tray; stores alerts in Zustand `notifications` store; badge count on bell icon | Notification tray opens/closes with badge count |
| **Week 2** | Hospital selector dropdown on dashboard (admin only) — `GET /hospitals` populates list; switching hospital updates all React Query cache keys | Admin can switch between hospitals |

✅ **Week 2 Checkpoint**: Login → dashboard flow works end-to-end. Stats cards show real data from backend.

---

### Phase 2 — Blood & Organ Pages (Week 3)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 3** | `app/blood/page.tsx` — fetches `GET /blood/inventory/:hospitalId` → renders `BloodTypeCard` grid (2×4 layout, one card per blood type) | Blood inventory page renders all 8 types |
| **Week 3** | `components/ui/BloodTypeCard.tsx` — props: `{ bloodType, unitsAvailable, minThreshold, expiryDate }`; shortage badge: green (safe), yellow (low: < 2× threshold), red (critical: < threshold) | Cards display correct shortage status |
| **Week 3** | `components/forms/BloodRequestForm.tsx` — blood type selector, units input (min 1), urgency dropdown (`critical/high/medium/low`), patient ID field; calls `POST /blood/requests`; success toast on submit | Doctor can submit blood request |
| **Week 3** | `app/organs/page.tsx` — fetches `GET /organs/donors` → renders `OrganCard` list for 6 organ types (kidney, liver, heart, lungs, cornea, pancreas) | Organ page renders donor availability |
| **Week 3** | `components/ui/OrganCard.tsx` — props: `{ organType, donorCount, pendingRequests }`; availability badge; "Request" button opens `OrganRequestForm` modal | Each organ card shows count + request button |
| **Week 3** | `components/forms/OrganRequestForm.tsx` — organ type (pre-filled), urgency score slider (0–100), patient details; calls `POST /organs/requests`; closes modal on success | Organ request submits and modal closes |
| **Week 3** | `app/requests/page.tsx` — fetches all pending requests (blood + organ); tabbed view; status badges (`pending/approved/fulfilled/rejected`) | Unified requests view shows all active requests |

✅ **Week 3 Checkpoint**: Doctor can view blood inventory, submit blood request, view organ donors, and submit organ request. All forms validate and submit.

---

### Phase 3 — Real-time Updates & AI Widgets (Week 4–5)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 4** | `hooks/useSocket.ts` — on mount: `socket.connect()`, `socket.emit('join-hospital', hospitalId)`; on unmount: `socket.disconnect()`; returns `socket` instance | Socket connects/disconnects cleanly with component lifecycle |
| **Week 4** | Wire `blood:update` event in `BloodTypeCard.tsx` → on receive `{ blood_type, units_available, shortage_alert }` → update Zustand `resources` store → card re-renders without page refresh | Blood units update live without page refresh |
| **Week 4** | Wire `organ:matched` event → push toast: "Organ match confirmed for request #ID" → update request status badge in `/requests` page instantly | Organ match event triggers UI update |
| **Week 4** | Wire `alert:critical` event → push `{ type, message }` to Zustand `notifications` store → toast appears + bell badge increments | Critical shortage alerts show as toast notifications |
| **Week 4** | Add "Last updated: X seconds ago" badge on blood page — updates every second using `setInterval` | Users can see blood data freshness |
| **Week 5** | `components/charts/BloodForecastChart.tsx` — Recharts `LineChart`; x-axis: next 7 days, y-axis: predicted units; fetches `POST /ai/blood/forecast` via React Query; upper/lower confidence bands as shaded area | Forecast chart renders on blood page |
| **Week 5** | Add AI shortage risk pill to `BloodTypeCard.tsx` — reads `shortage_risk` from forecast response; pill colors: grey (LOW), yellow (MEDIUM), orange (HIGH), red (CRITICAL) | Each blood card shows AI risk level |
| **Week 5** | `components/charts/CompatibilityRankList.tsx` — inside organ request detail modal; ranked recipient list; each row: patient name, `compatibility_score` bar (0–100), expand button | Organ match ranked list renders in modal |
| **Week 5** | `components/ui/FactorCard.tsx` — props: `{ factors: [{name, value, impact}] }`; renders SHAP factor breakdown as horizontal bar chart; shown on expand in `CompatibilityRankList` | SHAP factor breakdown visible per recipient |
| **Week 5** | `app/admin/page.tsx` — `PriorityQueue` table: all active requests sorted by `ai_priority_score` desc; columns: type, patient, urgency level (P1–P4 badge), score, wait time | Admin sees AI-ranked priority queue |
| **Week 5** | Add React Query `refetchInterval: 300000` (5 min) on all AI widgets — stale predictions refresh automatically | AI data stays current without manual reload |

✅ **Week 5 Checkpoint**: Blood cards update live. Organ match events trigger status updates. Forecast chart, compatibility rank list, and priority queue all rendering with real AI data.

---

### Phase 4 — Testing & Polish (Week 6–7)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 6** | `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom` → configure `vitest.config.ts` | Test runner configured |
| **Week 6** | `BloodRequestForm.test.tsx` — test: required fields show error when empty; units must be > 0; submit calls `POST /blood/requests` with correct body | Form validation tests pass |
| **Week 6** | `BloodTypeCard.test.tsx` — test: renders correct shortage badge class for safe / low / critical thresholds | BloodTypeCard badge logic tested |
| **Week 6** | `useSocket.test.ts` — test: socket connects on mount; disconnects on unmount; `blood:update` event updates store | Socket hook lifecycle tested |
| **Week 6** | `npm install -D @playwright/test` → `npx playwright install` → E2E: login → blood page → submit request → assert request appears in `/requests` tab | Blood request E2E test passes |
| **Week 6** | Playwright E2E: login → organs page → open organ request → assert compatibility ranked list loads with at least 1 result | Organ match E2E test passes |
| **Week 7** | Mobile responsiveness pass: all pages usable on 375px width (iPhone SE); fix wrapping issues in `BloodTypeCard` grid | App usable on mobile |
| **Week 7** | Accessibility audit: add `aria-label` to all icon buttons; ensure color contrast ≥ 4.5:1 for shortage badges; keyboard tab order on all forms | Lighthouse accessibility > 90 |
| **Week 7** | Replace all raw data fetches with skeleton loaders (`components/ui/Skeleton.tsx`) while React Query `isLoading` is true | No blank page flashes during data load |
| **Week 7** | Add empty state components: "No blood requests yet", "No donors registered" with illustrative icons | No blank white boxes in empty state |
| **Week 7** | Add `ErrorBoundary` wrapper around each page — catches runtime errors, shows "Something went wrong" card with retry button | App doesn't white-screen on component error |

✅ **Week 7 Checkpoint**: 80%+ component coverage. Both E2E tests pass. Lighthouse accessibility > 90. No layout breaks on mobile. Skeleton loaders on all pages.

---

### Phase 5 — Production Launch (Week 8)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 8** | `npm install -D rollup-plugin-visualizer` → `npx vite-bundle-visualizer` → lazy-load heavy routes with `React.lazy(() => import('./page'))` + `<Suspense>` | Bundle size reduced; heavy routes load on demand |
| **Week 8** | Update `frontend/.env.production` — set `VITE_API_BASE_URL` and `VITE_SOCKET_URL` to production URLs provided by M4 | Frontend points to production backend |
| **Week 8** | Run `npm run build` → verify no TypeScript errors → check `dist/` output → deploy to Vercel or Netlify | Production build compiles clean |
| **Week 8** | Run Lighthouse audit on production URL: Performance > 85, Accessibility > 90, Best Practices > 90 | Lighthouse scores pass on prod |
| **Week 8** | Smoke test full flow on production URL: register → login → submit blood request → submit organ request → verify WebSocket blood update fires | Zero broken flows on production |

✅ **Week 8 Checkpoint**: Production UI live. Lighthouse scores pass. All flows verified end-to-end on production URL.

---

## 7. Member 2 — Backend Developer Roadmap

**Owns**: All REST APIs, database schema + migrations, JWT auth, WebSocket server, Redis caching, AI service proxy
**Never touches**: React components, ML model training, Dockerfile configs, cloud infra provisioning
**Timeline**: 8 Weeks

---

### Phase 0 — Setup & Foundation (Week 1)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 1** | `mkdir backend && cd backend` → `npm init -y` → `npm install express cors helmet dotenv bcryptjs jsonwebtoken zod` → `npm install -D typescript ts-node nodemon @types/express @types/node` | Node.js + Express project initialized |
| **Week 1** | `npm install @prisma/client` → `npx prisma init` → write full `prisma/schema.prisma` — all 7 models: `Hospital, User, Patient, BloodInventory, BloodRequest, OrganDonor, OrganRequest, AuditLog` | Full DB schema defined |
| **Week 1** | `npx prisma migrate dev --name init` — run initial migration against local PostgreSQL (from M4's docker-compose) | All 7 tables created in DB |
| **Week 1** | `src/index.ts` — Express app init, CORS config, Helmet headers, JSON body parser, mount routes, `GET /health` returning `{ status: "ok", db: "connected", timestamp }` | Backend boots on `localhost:4000`; `/health` returns 200 |
| **Week 1** | `src/middleware/auth.ts` — `verifyToken(req, res, next)`: extract Bearer token, `jwt.verify()`, attach `req.user = { id, role, hospitalId }`; return 401 on invalid/missing token | JWT middleware protects routes |
| **Week 1** | `src/middleware/validate.ts` — generic `validate(schema: ZodSchema)` middleware factory; parses `req.body`; returns 400 with field errors on failure | Zod validation wired to all routes |
| **Week 1** | `src/routes/auth.ts` — `POST /auth/register` (bcrypt 12 rounds, create User, return JWT) and `POST /auth/login` (compare hash, sign JWT with `{ id, role, hospitalId }`, 7d expiry) | Auth endpoints return valid JWTs |
| **Week 1** | `src/services/aiClient.ts` — stub: 3 async functions `getBloodForecast()`, `getOrganMatch()`, `getPriorityScore()` returning hardcoded mock JSON | AI client functions callable immediately by M1 |

✅ **Week 1 Checkpoint**: Backend boots on `localhost:4000`. Register + login return JWTs. `/health` returns 200. AI stubs callable.

---

### Phase 1 — Hospital, Blood & Organ APIs (Week 2–3)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 2** | `src/routes/hospitals.ts` — `GET /hospitals`: Prisma `findMany`; `GET /hospitals/:id/stats`: 2 parallel queries — blood summary (units + shortage flags per type), organ summary (pending count per organ type) | Hospital list + stats endpoints live |
| **Week 2** | `npm install ioredis` → `src/services/redis.ts` — Redis client singleton; export `get(key)`, `set(key, value, ttl)`, `del(key)` helpers | Redis client connected |
| **Week 2** | `src/middleware/cache.ts` — `cacheMiddleware(ttl)` — checks Redis; if hit returns cached JSON; if miss calls `next()` and caches response → apply `cacheMiddleware(60)` to `GET /hospitals/:id/stats` | Stats queries cached in Redis |
| **Week 2** | `prisma/seed.ts` — seed 3 hospitals, full blood inventory (8 types × 3 hospitals × 20 units), 20 organ donors, 5 test users (1 admin, 2 doctors, 1 nurse, 1 patient); run via `npx prisma db seed` | DB seeded with enough demo data for all pages |
| **Week 3** | `src/routes/blood.ts` — `GET /blood/inventory/:hospitalId`: compute `shortageAlert: units < minThreshold`; return 8 types with shortage flag | Blood inventory endpoint returns shortage status |
| **Week 3** | `POST /blood/inventory/update` — role guard: `admin` only; Prisma `update` units + `last_restocked`; invalidate Redis cache; emit `blood:update` WebSocket event | Admin restocks blood; cache clears; WS fires |
| **Week 3** | `POST /blood/requests` — Zod schema: `{ blood_type, units_required (min 1), urgency, patient_id }`; Prisma `create`; write `audit_logs`; return `{ id, status: "pending" }` | Blood request saved with audit log |
| **Week 3** | `GET /blood/requests/pending/:hospitalId` — Prisma `findMany` where `status: "pending"`, include patient + doctor names | Pending blood requests list live |
| **Week 3** | `PATCH /blood/requests/:id` — role guard: `admin/doctor`; updates status; on `fulfilled`: decrement inventory; emit `blood:update` WS event | Status update triggers inventory change and WS event |
| **Week 3** | `src/routes/organs.ts` — `GET /organs/donors`: active donors grouped by organ type count; `POST /organs/donors`: admin registers donor; `POST /organs/requests`: creates request with audit log | All organ CRUD endpoints live |
| **Week 3** | `GET /organs/requests/match/:requestId` — fetch request + patient → call `aiClient.getOrganMatch()` → cache result 30min in Redis → return ranked list | Organ match proxy returns AI-ranked list |

✅ **Week 3 Checkpoint**: All blood + organ CRUD endpoints working. Blood inventory updates emit WebSocket events. Organ match proxy returns ranked list.

---

### Phase 2 — WebSocket & AI Proxy (Week 4–5)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 4** | `npm install socket.io` → `src/services/socket.ts` — init Socket.io on Express HTTP server; `io.on('connection', socket => socket.join(socket.handshake.query.hospitalId))` | Socket.io initialized; clients join hospital rooms |
| **Week 4** | After blood update → `io.to(hospitalId).emit('blood:update', { blood_type, units_available, shortage_alert })` | Blood restocks broadcast in real-time |
| **Week 4** | After organ match confirmed → `io.to(hospitalId).emit('organ:matched', { request_id, donor_id, patient_id, compatibility_score })` | Organ match event broadcasts to hospital room |
| **Week 4** | When blood units fall below `min_threshold` → `io.to(hospitalId).emit('alert:critical', { type: "blood_shortage", message, blood_type })` | Critical shortage alert broadcasts instantly |
| **Week 4** | `npm install @socket.io/redis-adapter` → `io.adapter(createAdapter(pubClient, subClient))` | Socket.io scales across multiple backend instances |
| **Week 5** | `src/services/aiClient.ts` — replace stubs with real `axios` calls: `getBloodForecast()` → `POST /ai/blood/forecast`; `getOrganMatch()` → `POST /ai/organ/match`; `getPriorityScore()` → `POST /ai/priority`; all 5s timeout | All 3 AI client functions proxy to Python service |
| **Week 5** | AI fallback: `try { return await axios.post(...) } catch { const cached = await redis.get(cacheKey); if (cached) return JSON.parse(cached); return DEFAULT_SAFE_RESPONSE }` | Backend never crashes when AI service is down |
| **Week 5** | `src/routes/ai.ts` — `POST /ai/blood/forecast`, `POST /ai/organ/match`, `POST /ai/priority` — validate body with Zod, proxy to `aiClient`, cache results (blood: 6h, organ: 30m) | AI proxy routes live with caching |
| **Week 5** | On `POST /blood/requests` and `POST /organs/requests` — after saving, call `aiClient.getPriorityScore()` via `setImmediate` → update record with `ai_priority_score` + `ai_urgency_level` | All new requests auto-scored by AI in background |

✅ **Week 5 Checkpoint**: WebSocket events emit on blood/organ updates. All 3 AI proxy routes return real data. Fallback serves cache/default when AI is down.

---

### Phase 3 — Testing & Security (Week 6–7)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 6** | `npm install -D jest supertest @types/jest ts-jest` → configure `jest.config.ts` with `ts-jest` preset | Jest test runner configured |
| **Week 6** | `tests/auth.test.ts` — `POST /auth/register`: valid body returns token; duplicate email returns 409; missing fields return 400. `POST /auth/login`: correct creds return token; wrong password returns 401 | Auth tests pass |
| **Week 6** | `tests/blood.test.ts` — `GET /blood/inventory/:id`: returns 8 types each with `shortageAlert` boolean; `POST /blood/requests` with invalid `blood_type` returns 400 | Blood endpoint tests pass |
| **Week 6** | `tests/organs.test.ts` — `POST /organs/requests`: valid body returns 201 with `{ id, status: "pending" }`; missing `organ_type` returns 400 | Organ request tests pass |
| **Week 7** | `npm install express-rate-limit` → apply: `100 req / 15 min` on `/auth/*`; `500 req / 15 min` on authenticated routes | Rate limiting returns 429 on exceed |
| **Week 7** | Audit all routes: every `POST` / `PATCH` has a Zod schema; no route accesses `req.body` without validation | Zero unvalidated inputs |
| **Week 7** | `npm install swagger-jsdoc swagger-ui-express` → write JSDoc `@swagger` comments on all routes → `GET /api/docs` serves Swagger UI | API docs live at `/api/docs` |
| **Week 7** | Patient diagnosis fields: encrypt `diagnosis` with AES-256-CBC before Prisma `create`; decrypt on `findUnique` | Sensitive patient data encrypted |

✅ **Week 7 Checkpoint**: All route tests pass. Swagger docs at `/api/docs`. Rate limiting active. No unvalidated inputs.

---

### Phase 4 — Production Deployment (Week 8)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 8** | Receive production Dockerfile from M4 → `docker build -t hospital-backend .` → verify image starts, `/health` returns 200 | Production Docker image builds successfully |
| **Week 8** | Deploy to Railway or AWS ECS → set all env vars: `DATABASE_URL` (RDS), `REDIS_URL` (ElastiCache), `JWT_SECRET`, `AI_SERVICE_URL` (from M3) | Backend live on production infrastructure |
| **Week 8** | `npx prisma migrate deploy` against production RDS → `npx prisma db seed` to populate demo data | Production DB migrated and seeded |
| **Week 8** | Smoke test production: `POST /auth/login`, `GET /hospitals/:id/stats`, `GET /blood/inventory/:id`, WebSocket connect + receive `blood:update` | All production endpoints return correct responses |
| **Week 8** | Set `AI_SERVICE_URL` to M3's production URL → re-test `POST /ai/blood/forecast` → verify real AI response | Backend AI proxy connected to production ML service |

✅ **Week 8 Checkpoint**: Backend live on production. All smoke tests pass. AI proxy connected to production ML service. DB seeded.

---

## 8. Member 3 — AI/ML Engineer Roadmap

**Owns**: Python FastAPI microservice, all 3 ML models, explainability layer, training pipelines, model evaluation
**Never touches**: React components, Node.js route logic, database schema, cloud infra configs
**Timeline**: 8 Weeks

---

### Phase 0 — Setup & Foundation (Week 1)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 1** | `mkdir ml-service && cd ml-service` → `python -m venv venv` → `source venv/bin/activate` → `pip install fastapi uvicorn pydantic scikit-learn prophet pandas numpy shap joblib python-dotenv mlflow` | Python environment with all ML dependencies |
| **Week 1** | `app/main.py` — FastAPI app init, CORS middleware, mount routers, `GET /health` returning `{ status: "ok", model_versions: { blood: "1.0", organ: "1.0", priority: "1.0" } }` | FastAPI boots on `localhost:8000`; `/health` returns 200 |
| **Week 1** | `mlflow ui --port 5001` → verify MLflow tracking dashboard accessible → create experiment `hospital-resource-models` | MLflow tracking UI accessible |
| **Week 1** | `app/schemas/blood.py` — `BloodForecastRequest(hospital_id, blood_type, historical_usage: List[UsagePoint])` + `BloodForecastResponse(blood_type, predicted_units_7d, shortage_risk, confidence, upper_bound, lower_bound)` | Blood forecast Pydantic schemas frozen |
| **Week 1** | `app/schemas/organ.py` — `OrganMatchRequest(organ_type, donor: DonorSchema, candidates: List[CandidateSchema])` + `OrganMatchResponse(ranked: List[RankedCandidate])` where each `RankedCandidate` has `factors: List[FactorSchema]` | Organ match schemas frozen |
| **Week 1** | `app/schemas/priority.py` — `PriorityRequest(request_type, urgency: int, wait_days: int, compatibility_score: float)` + `PriorityResponse(priority_score, urgency_level, explanation: List[FactorSchema])` | Priority schemas frozen |
| **Week 1** | **Share all 3 schema files with M2 immediately** — M2 uses these to build `aiClient.ts` stub without waiting for models | M2 can start AI proxy integration |
| **Week 1** | `training/generate_synthetic_data.py` → generate: 6-month daily blood usage (8 types × 3 hospitals) → `data/blood_history.csv`; 500 organ donor-recipient pairs with HLA markers + match outcomes → `data/organ_pairs.csv` | Training CSVs ready for both models |

✅ **Week 1 Checkpoint**: FastAPI boots on `localhost:8000`. All 3 schemas frozen and shared with M2. Synthetic training data generated. `/health` returns 200.

---

### Phase 1 — Blood Demand Forecasting (Week 2–3)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 2** | `training/train_blood_forecast.py` — load `blood_history.csv` → for each of 8 blood types: rename columns to `ds` + `y` → `model = Prophet(yearly_seasonality=True, weekly_seasonality=True)` → `model.fit(df_train)` | Prophet fits without errors for all 8 types |
| **Week 2** | Add `shortage_risk` logic: `predicted > 2*threshold → "low"`; `> threshold → "medium"`; `> 0.5*threshold → "high"`; else `"critical"` | Risk levels compute correctly from thresholds |
| **Week 2** | Confidence intervals: `upper_bound = yhat_upper`, `lower_bound = yhat_lower`; `confidence = 1 - (yhat_upper - yhat_lower) / yhat` | Confidence bands included in response |
| **Week 2** | Evaluate: `mean_absolute_error` on 1-month held-out split per blood type → `mlflow.log_metric(f"MAE_{blood_type}", mae)` | MAE < 5 units per type logged to MLflow |
| **Week 3** | `joblib.dump(model, f"models/blood_forecast_{blood_type.replace('+','pos').replace('-','neg')}.pkl")` — save all 8 models | 8 `.pkl` files saved in `models/` |
| **Week 3** | `app/services/blood_forecast.py` — `predict_blood(req)`: load from `app.state.blood_models[req.blood_type]`, run `model.predict(future_df)`, extract 7-day forecast, return `BloodForecastResponse` | Service returns valid forecast response |
| **Week 3** | `app/routers/blood.py` — `@router.post("/ai/blood/forecast", response_model=BloodForecastResponse)` → calls `blood_forecast.predict_blood(request)` | `POST /ai/blood/forecast` returns real predictions |
| **Week 3** | Fallback: `if len(request.historical_usage) < 3: return BloodForecastResponse(predicted_units_7d=avg*1.2, confidence=0.4, shortage_risk="unknown", ...)` | Endpoint returns 200 with fallback on sparse data |

✅ **Week 3 Checkpoint**: `POST /ai/blood/forecast` returns `{ predicted_units_7d, shortage_risk, confidence, upper_bound, lower_bound }`. MAE < 5 units on test set.

---

### Phase 2 — Organ Compatibility Matcher (Week 3–5)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 3** | `training/train_organ_matcher.py` — load `organ_pairs.csv` → engineer features: `blood_type_compatible (0/1)`, `hla_overlap_count (0–3)`, `age_diff_abs`, `urgency_score_norm`, `wait_days_norm` | Feature matrix `X` and binary label `y` (match=1) ready |
| **Week 4** | `RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42, class_weight="balanced")` → `model.fit(X_train, y_train)` | Random Forest trained with balanced classes |
| **Week 4** | Rule-based score per candidate: `blood_pts = 35 if compatible else 0`; `hla_pts = hla_overlap * 10`; `urgency_pts = urgency_score * 0.15`; `wait_pts = min(wait_days/365,1) * 10`; `total_score = sum of all` | Deterministic 0–100 compatibility score per candidate |
| **Week 4** | SHAP: `explainer = shap.TreeExplainer(model)` → for each candidate: `sv = explainer.shap_values(X_candidate)[1]` → build `factors: [{ name, value, impact }]` | SHAP factor cards generated per candidate |
| **Week 4** | Evaluate: `roc_auc_score(y_test, model.predict_proba(X_test)[:,1])` → `mlflow.log_metric("organ_auc", auc)` | AUC-ROC > 0.85 logged to MLflow |
| **Week 5** | `joblib.dump(model, "models/organ_matcher.pkl")` → save | Organ model persisted to `models/` |
| **Week 5** | `app/services/organ_matcher.py` — `match_organ(req)`: load model, compute rule score + SHAP per candidate, sort descending, return `OrganMatchResponse(ranked=[...])` | Organ matcher service returns ranked list |
| **Week 5** | `app/routers/organ.py` — `@router.post("/ai/organ/match", response_model=OrganMatchResponse)` | `POST /ai/organ/match` returns ranked recipients with factor cards |

✅ **Week 5 Checkpoint**: `POST /ai/organ/match` returns ranked list with `compatibility_score` and SHAP `factors` per candidate. AUC-ROC > 0.85.

---

### Phase 3 — Priority Engine & Model Hardening (Week 5–6)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 5** | `app/services/priority_engine.py` — `score = (req.urgency/10)*40 + min(req.wait_days/30,1)*30 + (req.compatibility_score/100)*30`; level: `>=90 → "P1"`, `>=70 → "P2"`, `>=50 → "P3"`, else `"P4"` | Priority scoring logic implemented |
| **Week 5** | `explanation = [{ factor: "urgency", contribution: (req.urgency/10)*40 }, { factor: "wait_time", ... }, { factor: "compatibility", ... }]` | Factor contributions returned per request |
| **Week 5** | `app/routers/priority.py` — `@router.post("/ai/priority", response_model=PriorityResponse)` | `POST /ai/priority` returns P1–P4 with explanation |
| **Week 6** | Preload all models at startup: `@app.on_event("startup") async def load_models()` → load 8 blood models + organ model into `app.state` | Zero per-request disk I/O; models in memory at boot |
| **Week 6** | Edge cases — blood: `historical_usage=[]` → fallback 200; organ: all same blood type → assert SHAP + urgency drives ranking; priority: min inputs → assert `"P4"` | All edge cases return 200 with correct response |
| **Week 6** | Write `training/eval_report.md` — Blood MAE per type, Organ AUC-ROC + precision/recall, Priority score distribution on 100 sample requests | Eval report committed to repo |
| **Week 6** | Add request logging middleware: `method`, `path`, `duration_ms`, `status_code` logged on every inference call | All inference calls logged with latency |

✅ **Week 6 Checkpoint**: All 3 AI endpoints live. Models preloaded at startup. Eval report committed. All edge cases return 200.

---

### Phase 4 — Testing & Production (Week 7–8)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 7** | `pip install pytest pytest-asyncio httpx` → `pytest.ini` with `asyncio_mode = auto` | Pytest configured for async FastAPI tests |
| **Week 7** | `tests/test_blood.py` — valid 6-month history → assert `shortage_risk in ["low","medium","high","critical"]`; assert `predicted_units_7d > 0`; `historical_usage=[]` → assert status 200, `shortage_risk == "unknown"` | Blood forecast tests pass including fallback |
| **Week 7** | `tests/test_organ.py` — 5 candidates → assert `len(ranked) == 5`; assert `ranked[0].score >= ranked[-1].score`; assert each has `len(factors) > 0`; same blood type → ranking differs via SHAP + urgency | Organ match ordering and edge case tests pass |
| **Week 7** | `tests/test_priority.py` — `urgency=10, wait_days=60, compatibility_score=90` → assert `"P1"`; min values → assert `"P4"` | Priority boundary tests pass |
| **Week 7** | Add `GET /ai/health`: `{ status, models_loaded: ["blood_A_pos", ..., "organ"], uptime_seconds }` | Health endpoint reports all loaded models |
| **Week 7** | Run 50 sequential requests per endpoint → confirm P95 < 300ms | Inference latency confirmed < 300ms P95 |
| **Week 8** | Receive Dockerfile from M4 → `docker build -t hospital-ml-service .` → `docker run -p 8000:8000` → verify `/health` returns 200 with all models listed | Production Docker image builds and loads models |
| **Week 8** | Deploy to Railway or AWS ECS → set `PORT=8000`, `MODEL_DIR=/app/models` → check startup logs for `"All models loaded"` before first request | ML service live; zero cold-start latency |
| **Week 8** | Send production `AI_SERVICE_URL` to M2 → joint test: M2 calls `POST /ai/blood/forecast` from prod backend → verify reaches prod ML service | Full AI proxy chain validated on production |

✅ **Week 8 Checkpoint**: All pytest tests pass. P95 < 300ms. ML service live on production. M2 backend proxy resolves to production ML service.

---

## 9. Member 4 — DevOps Engineer Roadmap

**Owns**: Docker, CI/CD pipelines, cloud infra, monitoring, security, database backups, secrets management
**Never touches**: React components, Express route logic, ML model architecture, Prisma schema definitions
**Timeline**: 8 Weeks

---

### Phase 0 — Setup & Foundation (Week 1)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 1** | Create GitHub monorepo → push to GitHub → Settings → Branch protection on `main`: require PR + 1 approval + CI passing before merge | Repo created; `main` branch protected |
| **Week 1** | Write `docker-compose.yml` — 5 services: `frontend` (3000), `backend` (4000), `ml-service` (8000), `postgres` (5432, volume: `pgdata`), `redis` (6379) | `docker compose up` starts all 5 services |
| **Week 1** | Add `depends_on` with health checks: `backend` depends on `postgres` (`condition: service_healthy`) + `redis` | Services start in correct dependency order |
| **Week 1** | Write `Dockerfile` templates for M1 (Node 18 + Vite build), M2 (Node 18 multi-stage), M3 (Python 3.11 multi-stage, non-root user) → send to respective members | All 3 Dockerfiles usable as starting point |
| **Week 1** | Create `.env.example` for all 3 services with every required key name but no values | Members know which env vars to set |
| **Week 1** | Write DB seed: `prisma/seed.ts` — 3 hospitals, 8-type blood inventory × 3 hospitals, 20 organ donors, 5 test users | `npx prisma db seed` populates all demo data |
| **Week 1** | `README.md` — prerequisites, setup: `git clone` → `cp .env.example .env` → fill values → `docker compose up` → seed DB | Any member sets up from scratch in under 10 min |

✅ **Week 1 Checkpoint**: `docker compose up` starts all 5 services. Seed script works. README documented. Dockerfiles shared with team.

---

### Phase 1 — CI Pipelines (Week 2–3)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 2** | `.github/workflows/backend-ci.yml` — trigger: push/PR to `main`; steps: `setup-node@v4 → npm ci → npm run lint → npm test → docker build -t hospital-backend .` | Backend CI green on every push |
| **Week 2** | `.github/workflows/ml-service-ci.yml` — steps: `setup-python@v5 → pip install -r requirements.txt → pytest → docker build -t hospital-ml .` | ML service CI green on every push |
| **Week 2** | Set GitHub Actions secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN` → add `docker push` step to both CI files after successful build | Docker images pushed to registry on CI pass |
| **Week 3** | `.github/workflows/frontend-ci.yml` — steps: `setup-node@v4 → npm ci → npm run lint → npm test → npm run build`; fail on TypeScript errors | Frontend CI green on every push |
| **Week 3** | Add Postgres health check: `healthcheck: test: ["CMD","pg_isready","-U","postgres"] interval: 10s retries: 5` | Docker Compose waits for Postgres ready |
| **Week 3** | Add `HEALTHCHECK` to all 3 Dockerfiles: `HEALTHCHECK --interval=30s --timeout=10s CMD curl -f http://localhost:${PORT}/health || exit 1` | Docker reports container health status |
| **Week 3** | `infra/README.md` — Redis key naming: `blood:inventory:h1:O_pos` (TTL 60s), `ai:forecast:h1:A_pos` (TTL 6h), `ai:organ_match:{requestId}` (TTL 30m) | Shared cache contract for M2 |

✅ **Week 3 Checkpoint**: All 3 CI pipelines green. Docker images pushed to registry. Health checks configured.

---

### Phase 2 — Staging Environment (Week 3–4)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 3** | `infra/terraform/staging/main.tf` — define: `aws_ecs_cluster`, `aws_db_instance` (PostgreSQL 15, db.t3.micro), `aws_elasticache_cluster` (Redis 7, cache.t3.micro), VPC, subnets, security groups | Terraform staging config written |
| **Week 4** | `terraform init && terraform plan -var-file=staging.tfvars` → review → `terraform apply` | Staging AWS resources provisioned |
| **Week 4** | Create ECS task definitions: backend (1 vCPU, 512MB), ML service (1 vCPU, 1GB) → create ECS services with `desiredCount=1` | Backend and ML running on ECS staging |
| **Week 4** | Store staging secrets in AWS Secrets Manager: `hospital/staging/backend` → `{ DATABASE_URL, REDIS_URL, JWT_SECRET, AI_SERVICE_URL }` | All staging env vars secured |
| **Week 4** | Add staging deploy job to CI: on merge to `develop` → `aws ecs update-service --cluster staging --force-new-deployment` | Auto-deploy to staging on every `develop` merge |
| **Week 4** | Smoke test staging: `curl https://staging-backend/health` → 200; `curl https://staging-ml/health` → 200; test blood inventory GET on staging | Staging stack fully accessible |

✅ **Week 4 Checkpoint**: Staging live on AWS. Auto-deploy active. All 3 services healthy on staging URLs.

---

### Phase 3 — Production Infrastructure (Week 5)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 5** | `infra/terraform/prod/main.tf` — ECS cluster, RDS PostgreSQL (db.t3.medium, `multi_az=true`), ElastiCache Redis, ALB with target groups for backend + ML service | Production Terraform config written |
| **Week 5** | `terraform apply -var-file=prod.tfvars` → provision production resources | Production AWS resources provisioned |
| **Week 5** | ACM certificate → DNS validate → attach to ALB HTTPS listener port 443 → redirect HTTP 80 → 443 | SSL live; HTTPS enforced on all endpoints |
| **Week 5** | Route 53: `api.hospital-system.com → ALB`; `app.hospital-system.com → Vercel` | Custom domains routing correctly |
| **Week 5** | Store prod secrets in Secrets Manager: `hospital/prod/backend` → `{ DATABASE_URL, REDIS_URL, JWT_SECRET, AI_SERVICE_URL }` | Production secrets secured |
| **Week 5** | `infra/k8s/` — write Kubernetes equivalents: `frontend-deployment.yaml`, `backend-deployment.yaml`, `ml-service-deployment.yaml`, `ingress.yaml` | K8s manifests ready as ECS alternative |

✅ **Week 5 Checkpoint**: Production infra provisioned. HTTPS live. Custom domains routing. Secrets in Secrets Manager.

---

### Phase 4 — Security & Backup (Week 6)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 6** | OWASP — SQL injection: verify all Prisma queries parameterized; `npm audit` → fix high severity vulns | SQL injection audit passed |
| **Week 6** | OWASP — XSS: verify `helmet()` sets `Content-Security-Policy` on all backend responses | XSS mitigation confirmed |
| **Week 6** | OWASP — Broken Auth: confirm JWT `exp` set (7d); test expired token → verify 401 | Auth security checks passed |
| **Week 6** | RDS automated backups: `BackupRetentionPeriod=7` → enable `DeletionProtection=true` → test restore on staging | 7-day backup retention; restore tested |
| **Week 6** | `infra/runbook.md` — DR steps: identify incident → get latest snapshot ARN → restore → update `DATABASE_URL` in Secrets Manager → redeploy ECS | Runbook written and committed |
| **Week 6** | PagerDuty: backend `/health` non-200 > 2min → P1; ML `/health` non-200 > 5min → P2; RDS CPU > 80% for 10min → P2 | PagerDuty alerts configured and tested |
| **Week 6** | `k6 run infra/load-test.js` — ramp 0 → 500 VUs over 5min, hold 5min → assert P95 < 500ms | Load test passes at 500 concurrent users |

✅ **Week 6 Checkpoint**: OWASP audit passed. Backups active. PagerDuty alerts firing. Load test P95 < 500ms.

---

### Phase 5 — Monitoring & Go-Live (Week 7–8)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 7** | `infra/monitoring/prometheus.yml` — scrape configs for backend, ML service, Postgres Exporter, Redis Exporter; `scrape_interval: 15s` | Prometheus scraping all 4 targets |
| **Week 7** | `infra/monitoring/grafana-dashboard.json` — Dashboard 1 (API): request rate, P95 latency, error rate; Dashboard 2 (Infra): DB connections, Redis memory, CPU; Dashboard 3 (AI): inference latency per endpoint; Dashboard 4 (Hospital): blood update event rate, organ match event rate | 4 Grafana dashboards imported and showing data |
| **Week 7** | Set up Loki for log aggregation → add Loki Docker driver → configure Grafana Loki data source → verify logs stream from all 3 services | Logs from all services visible in Grafana |
| **Week 8** | Production go-live: (1) merge final code → CI passes → images pushed; (2) `aws ecs update-service --force-new-deployment`; (3) `npx prisma migrate deploy`; (4) `npx prisma db seed`; (5) deploy frontend to Vercel | All 3 production services deployed |
| **Week 8** | Full E2E smoke test on production: login → blood request → WS blood:update fires → organ match returns ranked list → AI forecast chart loads | All production flows verified working |
| **Week 8** | Enable Grafana alerting: API error rate > 5% for 2min → PagerDuty; P95 > 1000ms for 5min → alert | Production alerting active |
| **Week 8** | Monitor all 4 Grafana dashboards for 48h after go-live → fix any P0/P1 → declare stable | Zero P0/P1 alerts in first 48h post-launch |

✅ **Week 8 Checkpoint**: Full production stack live. All 4 Grafana dashboards showing real data. PagerDuty + Grafana alerts active. Zero P0 incidents in first 48h.

---

## 10. API Reference

### Backend REST (Node.js — port 4000)

```
POST   /auth/register           Body: { name, email, password, role, hospital_id }
POST   /auth/login              Body: { email, password } → { token, user }
GET    /auth/refresh            Headers: Authorization: Bearer <token>

GET    /hospitals               → list all hospitals
GET    /hospitals/:id/stats     → { blood_summary, organ_summary }

GET    /blood/inventory/:hospitalId          → 8 blood types with units + shortage flag
POST   /blood/inventory/update               → restock a blood type (admin)
POST   /blood/requests                       → submit blood request
GET    /blood/requests/pending/:hospitalId   → active blood requests
PATCH  /blood/requests/:id                   → approve / fulfill / reject

GET    /organs/donors                        → available donor registry
POST   /organs/donors                        → register new donor
POST   /organs/requests                      → submit organ request
GET    /organs/requests/pending/:hospitalId  → active organ requests
GET    /organs/requests/match/:requestId     → AI-ranked recipient list

POST   /ai/blood/forecast       → proxy to Python → shortage prediction
POST   /ai/organ/match          → proxy to Python → ranked compatibility list
POST   /ai/priority             → proxy to Python → unified priority score

GET    /audit/:hospitalId        → recent audit log (admin)
GET    /api/docs                 → Swagger UI
```

### Python AI Microservice (FastAPI — port 8000)

```
GET    /health
  Returns: { status, model_versions: { blood, organ, priority } }

POST   /ai/blood/forecast
  Body:    { hospital_id, blood_type, historical_usage: [{date, units}] }
  Returns: { blood_type, predicted_units_7d, shortage_risk, confidence,
             upper_bound, lower_bound }

POST   /ai/organ/match
  Body:    { organ_type, donor: { blood_type, age, hla_markers },
             candidates: [{patient_id, blood_type, age, hla_markers,
                           urgency_score, wait_days}] }
  Returns: { ranked: [{ patient_id, compatibility_score,
                        factors: [{name, value, impact}] }] }

POST   /ai/priority
  Body:    { request_type, urgency, wait_days, compatibility_score }
  Returns: { priority_score, urgency_level (P1/P2/P3/P4),
             explanation: [{factor, contribution}] }
```

### WebSocket Events (Socket.io)

```
blood:update    → { hospital_id, blood_type, units_available, shortage_alert: bool }
organ:matched   → { request_id, donor_id, patient_id, compatibility_score }
alert:critical  → { type, message, hospital_id, resource_type }
```

---

## 11. Integration Points Table

| Integration | Producer | Consumer | When | Contract |
|---|---|---|---|---|
| `AuthContext` (user + role + token) | M2 (issues JWT) | M1 (stores in context) | Week 1 hard deadline | `{ user, role, token, login(), logout() }` |
| JWT token verification | M2 (auth middleware) | All protected routes | Week 1 | `Authorization: Bearer <token>` |
| `GET /hospitals/:id/stats` | M2 | M1 (Dashboard) | Week 2 | `{ blood_summary, organ_summary }` |
| `POST /ai/blood/forecast` schema | M3 (defines) | M2 (`aiClient.ts`, calls) | Week 2 | `{ blood_type, predicted_units_7d, shortage_risk, confidence }` |
| `POST /ai/organ/match` schema | M3 (defines) | M2 (`aiClient.ts`, calls) | Week 2 | `{ ranked: [{patient_id, score, factors}] }` |
| Blood inventory API response | M2 | M1 (`BloodTypeCard`) | Week 3 | `[{ blood_type, units_available, min_threshold, shortage_alert }]` |
| `blood:update` WebSocket event | M2 (Socket.io) | M1 (`useSocket`) | Week 4 | `{ blood_type, units_available, shortage_alert: bool }` |
| `organ:matched` WebSocket event | M2 (Socket.io) | M1 (`useSocket`) | Week 4 | `{ request_id, donor_id, patient_id, compatibility_score }` |
| `POST /ai/priority` schema | M3 (defines) | M2 (`aiClient.ts`, calls) | Week 5 | `{ priority_score, urgency_level, explanation }` |
| AI prediction widgets | M2 (proxy response) | M1 (AI widgets) | Week 5 | Same shape as Python AI response |
| Redis caching infrastructure | M4 (provisions) | M2 (cache middleware) | Week 2 | Key naming: `resource:type:hospital_id`, agreed TTLs |
| Dockerfile templates | M4 (provides) | M1, M2, M3 (use) | Week 1 | Multi-stage, non-root user templates |
| CI/CD pipelines | M4 (writes) | All (tests must pass) | Week 2 | Test pass = merge gate to `main` |
| Production service URLs | M4 (deploys) | M1, M2 (update `.env`) | Week 8 | `AI_SERVICE_URL`, `VITE_API_BASE_URL` |

---

## 12. Project Survival Rules

| Rule | Detail |
|---|---|
| **M4 sets up Docker first** | `docker-compose.yml` + seed scripts ready by end of Week 1. No one else can develop without the DB. |
| **M3 tests Python offline before wiring routes** | Run each model standalone with hardcoded inputs. Find JSON errors in Week 1, not Week 5. |
| **M3's `/health` must be live before M2 integrates** | `aiClient.ts` throws 500 if Python is down. M3 must have `/health` working before M2 wires AI routes. |
| **M2 publishes API contract by Week 2** | Swagger spec draft shared with M1 before M1 starts building forms. No guessing response shapes. |
| **Pydantic schemas are the frozen AI contract** | M3 defines and locks all 3 schemas in Week 1. M2 must not break them. Any change = team agreement. |
| **Cache all AI calls** | Blood forecast TTL: 6h. Organ match TTL: 30min. Priority: per-request only. Never call the model on every page load. |
| **M4 owns all production env vars** | No member hand-edits production secrets. All go through M4's secrets manager. |
| **Weekly Friday sync (30 min)** | Blockers, integration status, what's merged, what's next. Missing this = blocked team. |
| **No direct DB access from frontend** | All data flows through Node.js. Never expose Postgres or Redis to the browser. |
| **Graceful AI fallback is mandatory** | If Python AI service is down, backend serves cached result or safe default. Never propagate a 500 to the user. |

### Priority Cut List

```
MUST SHIP:
  ✅ Login + role-based access (doctor / admin / patient)
  ✅ Blood inventory display + request form (all 8 blood types)
  ✅ Organ donor registry + organ request form
  ✅ Real-time blood:update WebSocket events
  ✅ All 3 AI endpoints responding on production
  ✅ Working production URL (all 3 services deployed)

SHIP IF TIME:
  ⚡ Blood shortage forecast chart (7-day prediction graph)
  ⚡ Organ compatibility ranked list with factor explanation cards
  ⚡ Admin AI priority queue view (P1–P4 ranked requests)
  ⚡ Admin audit log page

STRETCH / DROP IF NEEDED:
  🔵 Cross-hospital resource search ("find O- blood near me")
  🔵 Donor-recipient notification system (email/SMS)
  🔵 PDF allocation summary export
  🔵 Compare two hospitals side-by-side
```

---

## 13. Build Order Quick Reference

```
Week 1  →  M4: Docker Compose + Dockerfiles + DB seed + README
            M2: Express + Prisma schema + JWT auth + AI stubs
            M3: FastAPI + all 3 Pydantic schemas + synthetic data (share schemas with M2 immediately)
            M1: Vite + Tailwind + Zustand + component library + PrivateRoute

Week 2  →  M1: Login + Register + Dashboard
            M2: Hospital stats API + Redis cache + DB seed
            M3: Blood demand model training (Prophet)
            M4: Backend + ML service CI pipelines

Week 3  →  M1: Blood page + Organ page + Requests page
            M2: Blood CRUD APIs + Organ CRUD APIs + organ match proxy
            M3: Blood forecast endpoint live + organ matcher feature engineering
            M4: Frontend CI + staging Terraform + Postgres health check

Week 4  →  M1: useSocket hook + blood:update + organ:matched WS wiring
            M2: Socket.io server + WS events + Redis adapter
            M3: Organ Random Forest trained + SHAP explainability
            M4: Staging deploy (all 3 services live)

Week 5  →  M1: BloodForecastChart + CompatibilityRankList + FactorCard + PriorityQueue
            M2: aiClient.ts wired to Python + AI proxy routes + priority auto-scoring
            M3: Organ match endpoint live + priority engine + models preloaded at startup
            M4: Production infra (ECS/RDS/ElastiCache/SSL)

Week 6  →  M1: Tests (Vitest + Playwright)
            M2: Jest integration tests + rate limiting + Swagger docs
            M3: Pytest + edge cases + eval report + inference latency tuning
            M4: OWASP audit + RDS backups + PagerDuty + k6 load test

Week 7  →  M1: Mobile fixes + accessibility audit + skeleton loaders + error boundaries
            M2: Swagger docs complete + AES encryption on patient fields
            M3: All pytest passing + /ai/health endpoint + P95 < 300ms confirmed
            M4: Prometheus + Grafana + Loki setup

Week 8  →  M1: Lazy loading + prod build + Lighthouse audit + prod smoke test
            M2: Production Docker image + Railway/ECS deploy + prod smoke test
            M3: Production Docker image + model pre-warm + prod validation
            M4: Go-live execution + Grafana alerting + 48h monitoring watch
```

### Master Timeline

```
Week 1   ████░░░░░░░░░░░░   Docker, scaffolds, schemas (all members — densest week)
Week 2   ░░████░░░░░░░░░░   Auth + Dashboard + blood model training
Week 3   ░░░░████░░░░░░░░   Blood + Organ pages + all CRUD APIs + CI pipelines
Week 4   ░░░░░░████░░░░░░   Real-time WebSocket + organ model trained + staging live
Week 5   ░░░░░░░░████░░░░   AI widgets + all 3 AI endpoints live + prod infra
Week 6   ░░░░░░░░░░████░░   Testing + security + OWASP + load test (all members)
Week 7   ░░░░░░░░░░░░████   Polish + monitoring setup + final testing
Week 8   ░░░░░░░░░░░░░░██   Production go-live + 48h monitoring watch
```

### Key Milestones

| Milestone | Target | Description |
|---|---|---|
| M1: Local Dev Running | End of Week 1 | All services run via `docker compose up`; schemas shared |
| M2: Auth + Dashboard Live | End of Week 2 | Login works; hospital stats on dashboard |
| M3: Blood & Organ Pages + APIs | End of Week 3 | Full CRUD + blood forecast endpoint working |
| M4: Real-time + Organ AI | End of Week 4 | WS blood events live; organ match endpoint working; staging deployed |
| M5: AI Fully Integrated | End of Week 5 | All 3 AI predictions rendered in frontend; prod infra ready |
| M6: Tests + Security | End of Week 6 | 80%+ coverage; security audit passed; load test green |
| M7: Monitoring Ready | End of Week 7 | Grafana dashboards live on staging; all tests passing |
| M8: Production Launch | End of Week 8 | Live system with monitoring; zero P0 alerts in first 48h |

---

## 14. Demo Script

```
TIME    SPEAKER   ACTION
----------------------------------------------------------------------------------
0:00    M4        "Every year, hospitals fail to save lives not because of missing
                   doctors — but because of missing resources. We fix that."

0:20    M4        Competitor slide: Excel sheets, phone calls, manual organ matching
                  — slow, error-prone, no prediction, no real-time visibility

0:40    M1        Open live app → log in as Dr. Patel at City Hospital
                  Dashboard loads: 3 critical blood shortages, 2 organ matches pending

1:00    M1        Click Blood tab → blood type grid appears
                  "O- has 2 units left — AI flags HIGH shortage risk"

1:15    M1        Click forecast chart → "AI predicts we run out in 4 days —
                  system triggers an early restock alert automatically"

1:30    M3        "Our Prophet time-series model trains on 6 months of usage history.
                  It predicts demand 7 days ahead with confidence intervals."

1:50    M1        Blood restock approved in another tab → O- card updates live
                  "Units jump from 2 to 12 — WebSocket pushes the change instantly"

2:05    M2        "No refresh needed. Every inventory change pushes live to all
                  connected doctors via Socket.io."

2:20    M1        Click Organs tab → open pending kidney request
                  Ranked recipient list appears with compatibility scores

2:35    M3        "Our ML scorer ranks 12 candidates in under 200ms — blood type,
                  HLA markers, urgency, and wait time — full SHAP explanations included"

2:50    M1        Click top match → factor breakdown card:
                  "Blood type +32, HLA match +28, Urgency +20, Wait time +12"

3:05    M1        Confirm match → organ:matched event fires → request status flips
                  to "Matched" instantly across all open sessions

3:15    M4        "Blood. Organs. One system. Real-time. AI-assisted. Built in 8 weeks."
                  "Live at [production URL]. Thank you."
```

---

*📋 Roadmap v5.0 — Smart Hospital Resource Allocation System (Blood & Organ)*
*Duration: 8 Weeks | 2 Months*
*"The right resource, for the right patient, at the right time."*
