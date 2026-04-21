# 🏥 Smart Hospital Resource Allocation System
## Complete Project Roadmap | **4-Member Team (Frontend · Backend · AI/ML · DevOps)**

> **Stack**: React 18 + TypeScript · Node.js (Express) · **Python FastAPI (AI/ML Microservice)** · PostgreSQL + Redis · Socket.io · Docker · GitHub Actions · AWS/GCP
> **Goal**: Patient requests Blood / Organ / Bed → AI matches & predicts availability → Real-time allocation in < 5 seconds

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
A real-time hospital resource management platform where patients, doctors, and admins can request and track **blood** (all 8 types), **organs** (kidney, liver, heart, lungs, cornea, pancreas), and **beds** (ICU, general, emergency, isolation, pediatric, maternity) — with AI-powered matching, shortage prediction, and priority scoring, all updating live.

### Who Uses It
- **Doctors & Nurses** — request critical resources instantly; see real-time availability across wards
- **Hospital Admins** — manage inventory, view AI shortage alerts, approve organ matches
- **Patients / Families** — track their resource request status in real time

### Our 8 Differentiators vs Existing Systems

| Gap in Existing Tools | Our Answer |
|---|---|
| Static inventory spreadsheets | ✅ Real-time WebSocket updates for beds/blood/organs |
| No blood demand forecasting | ✅ Time-series AI model predicts shortage 3-7 days ahead |
| Manual organ matching | ✅ ML compatibility scorer with ranked candidate list |
| No bed surge prediction | ✅ XGBoost model flags admission surge risk |
| Siloed per-department data | ✅ Unified cross-hospital dashboard |
| No priority scoring for requests | ✅ AI urgency + compatibility combined priority engine |
| No audit trail | ✅ Immutable audit log for every resource action |
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
|  |  Socket.io-client |    |  Redis Cache          |    |  Bed Surge Predictor   |  |
|  |  React Query      |    |  Prisma ORM           |    |  Priority Score Engine |  |
|  +------------------+    +----------------------+    +------------------------+  |
|           |                        |                                              |
|           v                        v                                              |
|  +------------------+    +----------------------+                                |
|  |  BROWSER STATE    |    |  POSTGRES + REDIS     |                                |
|  |  Zustand Store    |    |  Patient Records      |                                |
|  |  React Query Cache|    |  Blood Inventory      |                                |
|  +------------------+    |  Organ Registry       |                                |
|                           |  Bed/Ward Status      |                                |
|                           +----------------------+                                |
+----------------------------------------------------------------------------------+
```

> ⚡ **Key Architecture Decision**: The Node.js backend is the **single point of contact** for the frontend. It forwards all AI/ML tasks to the **Python FastAPI microservice** via internal HTTP. Member 1 (Frontend) always calls the same Node.js endpoints — no direct contact with Python service.

### End-to-End Data Flow

```
Doctor submits resource request (Blood / Organ / Bed)
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
        +---> [Python AI Service] POST /ai/bed/predict
        |     → { ward, surge_probability, recommended_action }
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
|   +-- total_beds, contact, lat, lng, createdAt
|
+-- wards
|   +-- id, hospital_id (FK), name
|   +-- type (ICU/general/emergency/isolation/pediatric/maternity)
|   +-- total_beds, available_beds, updatedAt
|
+-- beds
|   +-- id, ward_id (FK), bed_number
|   +-- status (available/occupied/maintenance)
|   +-- patient_id (FK, nullable), updatedAt
|
+-- users
|   +-- id, name, email, password_hash
|   +-- role (admin/doctor/nurse/patient)
|   +-- hospital_id (FK), createdAt
|
+-- patients
|   +-- id, user_id (FK), name, age, gender, blood_type
|   +-- diagnosis, admission_date, discharge_date
|   +-- ward_id (FK), bed_id (FK)
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
|
+-- bed_requests
|   +-- id, patient_id (FK), doctor_id (FK)
|   +-- ward_type_preference, reason (diagnosis)
|   +-- urgency (emergency/planned)
|   +-- status (pending/assigned/waitlisted)
|   +-- assigned_bed_id (FK), createdAt
|
+-- audit_logs
    +-- id, action_type, resource_type, resource_id
    +-- performed_by (user_id), hospital_id
    +-- details (JSON), createdAt
```

**Redis Cache Keys**
```
bed:availability:{hospital_id}:{ward_type}   →  { available, total }    TTL: 30s
blood:inventory:{hospital_id}:{blood_type}   →  { units }               TTL: 60s
ai:forecast:{hospital_id}:{blood_type}       →  { prediction JSON }     TTL: 6h
ai:surge:{hospital_id}:{ward}                →  { surge_probability }   TTL: 1h
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
|   |   |   +-- beds/page.tsx
|   |   |   +-- requests/page.tsx
|   |   |   +-- admin/page.tsx
|   |   +-- components/
|   |   |   +-- ui/       (BloodTypeCard, BedMap, OrganCard, PriorityBadge)
|   |   |   +-- charts/   (BloodTrendChart, OccupancyChart, SurgeAlert)
|   |   |   +-- forms/    (BloodRequestForm, BedRequestForm, OrganRequestForm)
|   |   |   +-- layout/   (Sidebar, Navbar, AlertBanner, NotificationCenter)
|   |   +-- hooks/        (useSocket, useBlood, useBeds, useOrgans, useAuth)
|   |   +-- store/        (Zustand: auth, notifications, resources)
|   |   +-- lib/          (axios instance, query client, socket client)
|   +-- Dockerfile
|
+-- backend/                                ← Member 2
|   +-- src/
|   |   +-- routes/
|   |   |   +-- auth.js
|   |   |   +-- hospitals.js
|   |   |   +-- blood.js
|   |   |   +-- organs.js
|   |   |   +-- beds.js
|   |   |   +-- patients.js
|   |   |   +-- ai.js           (proxy to Python AI service)
|   |   |   +-- audit.js
|   |   +-- middleware/
|   |   |   +-- auth.js         (JWT verify + RBAC)
|   |   |   +-- cache.js        (Redis cache middleware)
|   |   |   +-- validate.js     (Zod schemas)
|   |   |   +-- rateLimit.js
|   |   +-- services/
|   |   |   +-- aiClient.js     (HTTP client to Python AI service)
|   |   |   +-- socket.js       (Socket.io emitters)
|   |   |   +-- notifications.js
|   |   +-- prisma/schema.prisma
|   |   +-- index.js
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
|   |   |   +-- bed.py          (POST /ai/bed/predict)
|   |   |   +-- priority.py     (POST /ai/priority)
|   |   +-- services/
|   |   |   +-- blood_forecast.py
|   |   |   +-- organ_matcher.py
|   |   |   +-- bed_predictor.py
|   |   |   +-- priority_engine.py
|   |   +-- models/             (saved .pkl / .h5 files)
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
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
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

---

### Phase 0 — Setup & Foundation (Week 1–2)

- [ ] Initialize React 18 + TypeScript project with Vite
- [ ] Set up Tailwind CSS, React Router v6, Zustand, React Query
- [ ] Configure Axios instance with base URL + JWT interceptor
- [ ] Build reusable component library: Button, Modal, Table, Card, Badge, AlertBanner
- [ ] Set up Socket.io-client in `lib/socket.ts`
- [ ] Create `useAuth` hook with `AuthContext` (stores token + user role)
- [ ] Write `PrivateRoute` HOC for role-based page protection

✅ **Checkpoint**: App boots on `localhost:3000`. Login page renders. Protected routes redirect unauthenticated users.

---

### Phase 1 — Auth & Hospital Dashboard (Week 3–4)

- [ ] Build Login page (`/auth/login`) — email + password form, JWT storage in localStorage
- [ ] Build Register page (`/auth/register`) — role selector (doctor/nurse/patient)
- [ ] Build Hospital Dashboard (`/dashboard`):
  - Stats cards: total beds, available beds, critical blood alerts, pending organ requests
  - Sidebar navigation with role-based menu items
  - Hospital selector dropdown (for admins managing multiple hospitals)
- [ ] Connect dashboard stats to `GET /hospitals/:id/stats` via React Query
- [ ] Build `NotificationCenter` component — real-time alert tray

✅ **Checkpoint**: Login works end-to-end. Dashboard shows live hospital stats pulled from the backend.

---

### Phase 2 — Blood & Organ Pages (Week 4–5)

- [ ] Build Blood page (`/blood`):
  - `BloodTypeCard` grid — 8 blood types (A+, A−, B+, B−, AB+, AB−, O+, O−)
  - Each card shows: units available, expiry status, shortage badge (safe/low/critical)
  - `BloodRequestForm` — blood type selector, units needed, urgency dropdown, patient ID
  - Connect to `GET /blood/inventory/:hospitalId` and `POST /blood/requests`
- [ ] Build Organ page (`/organs`):
  - `OrganCard` list — kidney, liver, heart, lungs, cornea, pancreas
  - Shows donor count and pending request count per organ type
  - `OrganRequestForm` — organ type, urgency score slider, patient details
  - Connect to `GET /organs/donors` and `POST /organs/requests`
- [ ] Build Requests page (`/requests`) — unified view of all pending blood + organ + bed requests with status badges

✅ **Checkpoint**: Doctor can view blood inventory, submit a blood request, view organ donor list, and submit an organ request.

---

### Phase 3 — Bed Map & Real-time (Week 5–6)

- [ ] Build Bed page (`/beds`):
  - `BedMap` component — ward grid (ICU, General, Emergency, Isolation, Pediatric, Maternity)
  - Color-coded bed cells: green (available), red (occupied), grey (maintenance)
  - Bed detail tooltip on hover: patient name, admission date, diagnosis
  - `BedRequestForm` — ward type preference, reason/diagnosis, urgency toggle
  - Connect to `GET /beds/:hospitalId` and `POST /beds/requests`
- [ ] Build `useSocket` hook — subscribes to WebSocket events on mount, cleans up on unmount
- [ ] Wire real-time events:
  - `bed:update` → update Zustand store → re-render BedMap cell instantly
  - `blood:update` → update BloodTypeCard units + shortage badge
  - `alert:critical` → push toast notification to NotificationCenter
- [ ] Add live "last updated" timestamp badge on all resource pages

✅ **Checkpoint**: Bed map updates in under 1 second when a bed status changes. No page refresh needed.

---

### Phase 4 — AI Prediction Widgets (Week 6–7)

- [ ] Blood page — add `BloodForecastChart` (line chart, next 7 days predicted units per blood type)
- [ ] Blood page — add shortage risk pill on each `BloodTypeCard` (LOW / MEDIUM / HIGH / CRITICAL)
- [ ] Organ page — add `CompatibilityRankList` on organ request detail:
  - Ranked recipient list with compatibility score (0–100)
  - `FactorCard` breakdown per recipient: blood type, HLA match, urgency, wait time
- [ ] Bed page — add `SurgeAlertBanner` at top of ward view (shows if ICU/Emergency surge probability > 70%)
- [ ] Admin page — build `PriorityQueue` view: all active requests ranked by AI priority score (P1–P4)
- [ ] Connect all widgets to backend AI proxy endpoints via React Query

✅ **Checkpoint**: AI predictions visible on all 3 resource pages. Priority queue renders ranked requests.

---

### Phase 5 — Testing & Polish (Week 8)

- [ ] Write unit tests with Vitest + React Testing Library:
  - BloodRequestForm validation (required fields, units > 0)
  - BedMap renders correct color per status
  - useSocket hook connects and cleans up correctly
- [ ] Write E2E tests with Playwright:
  - Blood request flow: login → blood page → submit form → request appears in list
  - Bed assignment flow: login → bed map → admit patient → bed turns red
- [ ] Fix mobile responsiveness (breakpoints for tablet and phone)
- [ ] Accessibility audit: ARIA labels, keyboard navigation, color contrast
- [ ] Add loading skeleton states for all data-fetching components
- [ ] Add error boundary components with user-friendly fallback UI

✅ **Checkpoint**: 80%+ component test coverage. E2E tests pass. Lighthouse accessibility score > 90.

---

### Phase 6 — Production Polish (Week 9–10)

- [ ] Code splitting + lazy loading for all route-level pages
- [ ] Optimize bundle size (analyze with `vite-bundle-visualizer`)
- [ ] Add empty state illustrations for zero-data views
- [ ] Final Lighthouse audit: Performance > 85, Accessibility > 90, Best Practices > 90
- [ ] Update `NEXT_PUBLIC_API_BASE_URL` to production backend URL from M4
- [ ] Smoke test full flow on production URL

✅ **Checkpoint**: Production UI live. Lighthouse scores pass. Zero broken flows on prod.

---

## 7. Member 2 — Backend Developer Roadmap

**Owns**: All REST APIs, database schema + migrations, JWT auth, WebSocket server, Redis caching, AI service proxy
**Never touches**: React components, ML model training, Dockerfile configs, cloud infra provisioning

---

### Phase 0 — Setup & Foundation (Week 1–2)

- [ ] Initialize Node.js + Express project with TypeScript
- [ ] Set up Prisma ORM — write full `schema.prisma` (all 10 tables)
- [ ] Run initial migration: `prisma migrate dev --name init`
- [ ] Set up JWT auth scaffold: `POST /auth/register`, `POST /auth/login`
  - bcrypt password hashing (12 rounds)
  - JWT signing with role embedded in payload
- [ ] Write `auth.js` middleware: verify JWT + extract role for RBAC
- [ ] Write `validate.js` middleware: Zod schemas for all request bodies
- [ ] Set up `GET /health` endpoint returning `{ status: "ok", db: "connected" }`
- [ ] Create stub `aiClient.js` — placeholder functions for all 4 AI calls (return mock data)

✅ **Checkpoint**: Backend boots on `localhost:4000`. Auth endpoints return JWTs. `/health` returns 200.

---

### Phase 1 — Hospital & Stats APIs (Week 3–4)

- [ ] `GET /hospitals` — list all hospitals (name, city, type, total beds)
- [ ] `GET /hospitals/:id` — single hospital with ward breakdown
- [ ] `GET /hospitals/:id/stats` — aggregate: blood summary, organ summary, bed summary
- [ ] `GET /hospitals/:id/wards` — list wards with available_beds per ward
- [ ] Add Redis caching to `/stats` and `/wards` endpoints (TTL: 30s)
- [ ] `GET /auth/refresh` — issue new token from valid refresh token
- [ ] Write DB seed script: 3 hospitals, 6 wards each, 200 beds, full blood inventory for all 8 types

✅ **Checkpoint**: Frontend dashboard can call `/stats` and get real data. Seeded DB has enough data to demo.

---

### Phase 2 — Blood & Organ APIs (Week 4–5)

- [ ] **Blood APIs**:
  - `GET /blood/inventory/:hospitalId` — all 8 blood types with units, expiry, shortage flag
  - `POST /blood/inventory/update` — admin restocks a blood type (role: admin)
  - `POST /blood/requests` — doctor submits blood request (validates blood type, urgency)
  - `GET /blood/requests/pending/:hospitalId` — all active requests
  - `PATCH /blood/requests/:id` — approve / fulfill / reject (role: admin)
- [ ] **Organ APIs**:
  - `GET /organs/donors` — all active donors with available organs
  - `POST /organs/donors` — register new donor
  - `POST /organs/requests` — submit organ request with urgency score
  - `GET /organs/requests/pending/:hospitalId` — all waiting requests
  - `GET /organs/requests/match/:requestId` — proxy to Python AI → return ranked recipient list
- [ ] Wire `aiClient.js` blood forecast: call `POST /ai/blood/forecast` on Python service, cache result 6h

✅ **Checkpoint**: All blood + organ CRUD endpoints pass Postman tests. AI forecast proxy returns data.

---

### Phase 3 — Bed APIs & WebSocket (Week 5–6)

- [ ] **Bed APIs**:
  - `GET /beds/:hospitalId` — all wards + beds with status per bed
  - `POST /beds/requests` — submit bed request (ward preference, urgency)
  - `PATCH /beds/:id/status` — update bed: `admit` (occupied), `discharge` (available), `maintenance`
  - `GET /beds/requests/pending/:hospitalId` — all waitlisted bed requests
- [ ] Set up **Socket.io server** in `services/socket.js`:
  - On `PATCH /beds/:id/status` → emit `bed:update` event to hospital room
  - On blood inventory update → emit `blood:update` event
  - On organ match confirmed → emit `organ:matched` event
  - On blood/bed threshold breach → emit `alert:critical` event
- [ ] Redis pub/sub for Socket.io: allows horizontal scaling across multiple backend instances
- [ ] Wire `aiClient.js` bed surge: call `POST /ai/bed/predict` on Python service, cache 1h

✅ **Checkpoint**: Bed status change emits WebSocket event. Frontend receives it within 1 second.

---

### Phase 4 — AI Proxy & Priority Engine (Week 6–7)

- [ ] Wire all 4 `aiClient.js` functions to live Python AI service:
  - `getBloodForecast(hospitalId, bloodType, history)`
  - `getOrganMatch(organType, donor, candidates)`
  - `getBedSurgePrediction(hospitalId, wardType, history)`
  - `getPriorityScore(requestType, urgency, waitDays, compatibilityScore)`
- [ ] Add AI fallback logic: if Python service returns 5xx or times out → serve Redis cached result → if no cache → return safe default JSON
- [ ] `POST /ai/priority` route: calls AI priority engine, returns P1–P4 rank for a request
- [ ] Add `ai_priority_score` and `ai_recommendation` fields to blood_requests, organ_requests, bed_requests tables (new migration)
- [ ] On every new request submission, call AI priority in background and update record

✅ **Checkpoint**: All 4 AI endpoints return real data. Fallback works when Python service is stopped.

---

### Phase 5 — Testing & Security (Week 8)

- [ ] Write integration tests with Jest + Supertest for every route:
  - Auth: register, login, token refresh, invalid token
  - Blood: inventory GET, request POST, invalid blood type
  - Beds: status PATCH, WebSocket event emits
- [ ] Add `express-rate-limit`: 100 req/15min for public routes, 500 req/15min for authenticated
- [ ] Full input validation audit — every route has Zod schema, no raw req.body trust
- [ ] Publish Swagger/OpenAPI spec at `GET /api/docs`
- [ ] Encrypt sensitive patient fields at application layer (AES-256 for diagnosis notes)

✅ **Checkpoint**: All routes have tests. Swagger docs live. Rate limiting active.

---

### Phase 6 — Production Deployment (Week 9–10)

- [ ] Build production Docker image (multi-stage, non-root user)
- [ ] Deploy to Railway or AWS ECS — set all production env vars
- [ ] Set `AI_SERVICE_URL` to M3's production Python service URL
- [ ] Run production DB migration: `prisma migrate deploy`
- [ ] Run smoke tests against production URL (auth, blood GET, bed PATCH, WebSocket connect)
- [ ] Monitor Railway/ECS logs for first 24h, fix any prod-only errors

✅ **Checkpoint**: Backend live on production URL. All smoke tests pass. AI proxy connects to prod Python service.

---

## 8. Member 3 — AI/ML Engineer Roadmap

**Owns**: Python FastAPI microservice, all 4 ML models, explainability layer, training pipelines, model evaluation
**Never touches**: React components, Node.js route logic, database schema, cloud infra configs

---

### Phase 0 — Setup & Foundation (Week 1–2)

- [ ] Initialize Python 3.11 FastAPI project with Uvicorn
- [ ] Define and **freeze** all Pydantic input/output schemas (share with M2 immediately):
  - `BloodForecastRequest` / `BloodForecastResponse`
  - `OrganMatchRequest` / `OrganMatchResponse`
  - `BedPredictRequest` / `BedPredictResponse`
  - `PriorityRequest` / `PriorityResponse`
- [ ] Set up MLflow experiment tracking (local server)
- [ ] Generate synthetic training datasets:
  - Blood: 6 months daily usage per blood type × 3 hospitals
  - Organ: 500 donor-recipient pairs with HLA markers, outcome labels
  - Beds: 12 months daily admissions per ward type × 3 hospitals
- [ ] Set up `GET /health` endpoint: `{ status, model_versions: { blood, organ, bed, priority } }`
- [ ] Test each service file standalone with hardcoded inputs before wiring to routes

✅ **Checkpoint**: FastAPI boots on `localhost:8000`. Schemas finalized and shared with M2. `/health` returns 200.

---

### Phase 1 — Blood Demand Forecasting (Week 3–4)

- [ ] **Model**: Prophet (Facebook) time-series forecasting
- [ ] **Features**: date, day_of_week, month, hospital_type, historical_units_used, seasonal_flags
- [ ] **Target**: predicted units needed per blood type for next 7 days
- [ ] Train separate Prophet model per blood type (8 models total)
- [ ] Add `shortage_risk` threshold logic: `< min_threshold × 1.5` → HIGH, `< min_threshold` → CRITICAL
- [ ] Add `confidence` interval (80% prediction band)
- [ ] Save trained models to `models/blood_forecast_{type}.pkl`
- [ ] Expose `POST /ai/blood/forecast` via FastAPI router
- [ ] **Evaluation**: MAE < 5 units on held-out test set

✅ **Checkpoint**: `POST /ai/blood/forecast` returns `{ blood_type, predicted_units_7d, shortage_risk, confidence }` with correct values.

---

### Phase 2 — Organ Compatibility Matcher (Week 4–5)

- [ ] **Model**: Rule-based scoring + Random Forest re-ranking
- [ ] **Compatibility factors and weights**:
  - Blood type compatibility: 35 points
  - HLA marker overlap (A, B, DR loci): 30 points
  - Age difference donor-recipient: 10 points
  - Urgency score of recipient: 15 points
  - Wait time in days: 10 points
- [ ] Generate 500 synthetic donor-recipient training pairs with match outcome labels
- [ ] Train Random Forest classifier on compatibility features
- [ ] Produce ranked list with per-candidate `compatibility_score` (0–100)
- [ ] Add **SHAP explainability**: for each candidate, return `factors: [{name, value, impact}]`
- [ ] Save model to `models/organ_matcher.pkl`
- [ ] Expose `POST /ai/organ/match` via FastAPI router
- [ ] **Evaluation**: AUC-ROC > 0.85 on held-out test set

✅ **Checkpoint**: `POST /ai/organ/match` returns ranked recipients with score + factor breakdown for each.

---

### Phase 3 — Bed Surge Predictor & Priority Engine (Week 5–6)

- [ ] **Bed Surge Model**: XGBoost classifier
- [ ] **Features**: day_of_week, month, current_occupancy_pct, last_7d_admission_rate, disease_outbreak_flag, season
- [ ] **Target**: binary — surge (> 85% occupancy in next 48h) or no surge
- [ ] Train per ward type (ICU, General, Emergency, Pediatric, Maternity, Isolation)
- [ ] Output: `{ surge_probability, risk_level (low/medium/high), recommended_action }`
- [ ] Save to `models/bed_predictor_{ward}.pkl`
- [ ] Expose `POST /ai/bed/predict` via FastAPI router
- [ ] **Priority Score Engine** (rule-based, no model needed):
  - Score = `(urgency_weight × urgency) + (wait_weight × normalized_wait) + (compatibility_weight × compat_score)`
  - Maps to urgency level: P1 (90–100), P2 (70–89), P3 (50–69), P4 (< 50)
  - Returns SHAP-style `explanation: [{factor, contribution}]`
- [ ] Expose `POST /ai/priority` via FastAPI router
- [ ] **Evaluation**: Bed surge F1-score > 0.80 on held-out test set

✅ **Checkpoint**: All 4 AI endpoints working. Priority engine returns P1–P4 with factor breakdown.

---

### Phase 4 — Explainability & Fine-tuning (Week 6–7)

- [ ] Integrate SHAP library for organ matcher: generate per-prediction force plots (JSON, not images)
- [ ] Add confidence intervals to blood forecast output (upper_bound, lower_bound)
- [ ] Fine-tune XGBoost bed model with hyperparameter search (GridSearchCV)
- [ ] Validate all models with realistic edge cases:
  - All same blood type candidates (organ match)
  - Zero historical usage data (blood forecast)
  - 100% current occupancy (bed predictor)
- [ ] Write model evaluation report (MLflow artifacts):
  - Blood: MAE, RMSE per blood type
  - Organ: AUC-ROC, precision, recall
  - Bed: F1, precision, recall per ward type

✅ **Checkpoint**: Explainability layer returns factor cards. Eval report saved to MLflow. Edge cases handled.

---

### Phase 5 — Testing & Hardening (Week 8)

- [ ] Write pytest unit tests for all 4 service files:
  - Test each model with valid inputs → assert output schema matches Pydantic model
  - Test with null fields, missing keys, unknown blood types
  - Test priority engine edge cases (all equal weights, zero wait time)
- [ ] Add input validation in all Pydantic schemas (field validators, min/max bounds)
- [ ] Add `/ai/health` endpoint: returns model versions + last training date per model
- [ ] Add request logging middleware: log every inference call with latency
- [ ] Test that all 4 endpoints respond in < 300ms on average

✅ **Checkpoint**: All pytest tests pass. Service handles all edge case inputs. Inference latency < 300ms.

---

### Phase 6 — Production Deployment (Week 9–10)

- [ ] Build production Docker image (multi-stage, non-root user)
- [ ] Deploy to Railway or AWS ECS — set `PORT`, `MODEL_DIR` env vars
- [ ] Pre-warm model cache on startup: load all `.pkl` files into memory at boot
- [ ] Verify all 4 AI endpoints on production URL with real request payloads
- [ ] Send production `AI_SERVICE_URL` to M2 for backend env update
- [ ] Monitor inference logs for first 24h, fix any serialization or cold-start issues

✅ **Checkpoint**: ML service live on production. All 4 AI endpoints healthy. M2's backend connected to prod AI service.

---

## 9. Member 4 — DevOps Engineer Roadmap

**Owns**: Docker, CI/CD pipelines, cloud infra, monitoring, security, database backups, secrets management
**Never touches**: React components, Express route logic, ML model architecture, Prisma schema definitions

---

### Phase 0 — Setup & Foundation (Week 1–2)

- [ ] Create GitHub monorepo with branch protection rules on `main`
- [ ] Write `docker-compose.yml` with all 5 containers:
  - `frontend` (port 3000), `backend` (port 4000), `ml-service` (port 8000)
  - `postgres` (port 5432, with volume for data persistence)
  - `redis` (port 6379)
- [ ] Write `Dockerfile` templates for frontend, backend, and ml-service (hand to M1, M2, M3)
- [ ] Create `.env.example` files for all 3 services (no real secrets, just key names)
- [ ] Write DB seed scripts: 3 hospitals, 6 wards, 200 beds, full blood inventory
- [ ] Verify `docker compose up` starts all 5 containers with one command
- [ ] Document local dev setup in `README.md` (prerequisites, setup steps, run command)

✅ **Checkpoint**: Any team member can clone the repo, run `docker compose up`, and have the full stack running locally within 5 minutes.

---

### Phase 1 — CI Pipelines (Week 3–4)

- [ ] **Backend CI** (`.github/workflows/backend-ci.yml`):
  - Trigger: push to `main` or PR targeting `main`
  - Steps: checkout → install deps → `npm run lint` → `npm test` → Docker build
  - Gate: merge blocked if any step fails
- [ ] **ML Service CI** (`.github/workflows/ml-service-ci.yml`):
  - Steps: checkout → `pip install` → `pytest` → Docker build
- [ ] Set up container registry (Docker Hub or AWS ECR)
- [ ] Configure GitHub Actions secrets: `DOCKERHUB_TOKEN`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- [ ] Add Redis health check to `docker-compose.yml` (depends_on with condition)
- [ ] Add Redis TTL key naming convention doc to `infra/README.md`

✅ **Checkpoint**: Backend and ML service CI pipelines run green on every push. Docker images pushed to registry.

---

### Phase 2 — Frontend CI & Socket.io Scaling (Week 4–5)

- [ ] **Frontend CI** (`.github/workflows/frontend-ci.yml`):
  - Steps: checkout → install deps → `npm run lint` → `npm test` → `npm run build`
  - Fail on TypeScript errors or test failures
- [ ] Configure Redis pub/sub adapter for Socket.io (`@socket.io/redis-adapter`):
  - Allows Socket.io events to propagate across multiple backend instances
  - Document Redis pub/sub channels in `infra/README.md`
- [ ] Add health-check endpoints to all 3 Dockerfiles:
  - `HEALTHCHECK CMD curl -f http://localhost:{PORT}/health || exit 1`
- [ ] Add `restart: unless-stopped` policy to all services in `docker-compose.yml`

✅ **Checkpoint**: All 3 CI pipelines green. Socket.io works correctly when running 2 backend instances.

---

### Phase 3 — Staging Environment (Week 5–6)

- [ ] Provision staging cloud environment (AWS or GCP):
  - ECS or GKE cluster for containers
  - RDS PostgreSQL instance (db.t3.micro for staging)
  - ElastiCache Redis instance (cache.t3.micro for staging)
- [ ] Write Terraform configs for all staging resources (`infra/terraform/staging/`)
- [ ] Deploy all 3 services to staging via CI/CD on merge to `develop` branch:
  - Frontend → Vercel preview or CloudFront staging distribution
  - Backend → ECS staging service
  - ML Service → ECS staging service
- [ ] Configure staging env vars in AWS Secrets Manager
- [ ] Run full smoke test against staging URLs: auth flow, blood request, bed update, WebSocket connect

✅ **Checkpoint**: All 3 services live on staging URLs. Full flow testable without running locally.

---

### Phase 4 — Production Infrastructure (Week 6–7)

- [ ] Provision production cloud environment via Terraform (`infra/terraform/prod/`):
  - ECS or GKE for container orchestration
  - RDS PostgreSQL (db.t3.medium, Multi-AZ for prod)
  - ElastiCache Redis (cache.t3.micro, with replication)
  - ACM SSL certificate + HTTPS enforced on all endpoints
  - ALB (Application Load Balancer) for backend and ML service
- [ ] Write Kubernetes manifests (`infra/k8s/`) as alternative to ECS
- [ ] Configure AWS Secrets Manager for all production secrets
- [ ] Set up CDN (CloudFront) for frontend static assets
- [ ] Configure custom domain + DNS routing

✅ **Checkpoint**: Production infrastructure provisioned. SSL live. All services reachable via HTTPS on custom domain.

---

### Phase 5 — Security & Backup (Week 8)

- [ ] Run OWASP top-10 security checklist:
  - SQL injection: confirm Prisma parameterized queries used everywhere
  - XSS: confirm Content-Security-Policy headers set
  - Broken auth: confirm JWT expiry + refresh token rotation working
  - Sensitive data: confirm patient data encrypted at application layer (M2)
- [ ] Set up automated daily RDS snapshots (retained for 7 days)
- [ ] Write disaster recovery runbook: steps to restore DB from snapshot
- [ ] Set up **PagerDuty** alerting rules:
  - Backend `/health` returns non-200 for > 2 minutes → P1 alert
  - ML service `/health` returns non-200 for > 5 minutes → P2 alert
  - DB CPU > 80% for > 10 minutes → P2 alert
- [ ] Run k6 load test: 500 concurrent users, 10-minute ramp, measure P95 latency
- [ ] Ensure P95 latency < 500ms for all critical endpoints under load

✅ **Checkpoint**: Security audit passed. Backups automated. PagerDuty alerts firing correctly. Load test P95 < 500ms.

---

### Phase 6 — Monitoring & Go-Live (Week 9–10)

- [ ] Set up **Prometheus + Grafana** stack in production (`infra/monitoring/`):
  - Dashboard 1 — API: request rate, P95 latency, error rate per route
  - Dashboard 2 — Infrastructure: DB connections, Redis memory, CPU/memory per service
  - Dashboard 3 — AI Service: inference latency per endpoint, model call count
  - Dashboard 4 — Hospital: WebSocket event rate, bed update lag, blood alert count
- [ ] Set up **ELK stack** (or Loki) for log aggregation — all 3 services stream logs
- [ ] Write incident runbook: escalation path, rollback steps, on-call contacts
- [ ] Execute production go-live:
  1. Deploy all 3 services via CI/CD to production
  2. Run DB migration: `prisma migrate deploy`
  3. Seed production DB with demo hospital data
  4. Run full E2E smoke test on production URLs
  5. Enable Grafana alerts
- [ ] Monitor all dashboards for first 48h after go-live

✅ **Checkpoint**: Full production stack live. Grafana dashboards showing real data. Zero P0/P1 alerts in first 48h.

---

## 10. API Reference

### Backend REST (Node.js — port 4000)

```
POST   /auth/register           Body: { name, email, password, role, hospital_id }
POST   /auth/login              Body: { email, password } → { token, user }
GET    /auth/refresh            Headers: Authorization: Bearer <token>

GET    /hospitals               → list all hospitals
GET    /hospitals/:id/stats     → { blood_summary, organ_summary, bed_summary }

GET    /blood/inventory/:hospitalId          → 8 blood types with units + shortage flag
POST   /blood/inventory/update               → restock a blood type (admin)
POST   /blood/requests                       → submit blood request
GET    /blood/requests/pending/:hospitalId   → active requests

GET    /organs/donors                        → available donor registry
POST   /organs/donors                        → register new donor
POST   /organs/requests                      → submit organ request
GET    /organs/requests/match/:requestId     → AI-ranked recipient list

GET    /beds/:hospitalId                     → ward + bed map with status per bed
POST   /beds/requests                        → submit bed request
PATCH  /beds/:id/status                      → admit / discharge / maintenance

POST   /ai/blood/forecast       → proxy to Python → shortage prediction
POST   /ai/organ/match          → proxy to Python → ranked compatibility list
POST   /ai/bed/predict          → proxy to Python → surge probability
POST   /ai/priority             → proxy to Python → unified priority score

GET    /audit/:hospitalId        → recent audit log (admin)
GET    /api/docs                 → Swagger UI
```

### Python AI Microservice (FastAPI — port 8000)

```
GET    /health
  Returns: { status, model_versions: { blood, organ, bed, priority } }

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

POST   /ai/bed/predict
  Body:    { hospital_id, ward_type,
             historical_admissions: [{date, count}], current_occupancy }
  Returns: { surge_probability, risk_level, recommended_action, confidence }

POST   /ai/priority
  Body:    { request_type, urgency, wait_days, compatibility_score }
  Returns: { priority_score, urgency_level (P1/P2/P3/P4),
             explanation: [{factor, contribution}] }
```

### WebSocket Events (Socket.io)

```
bed:update      → { hospital_id, ward_id, bed_id, new_status, available_count }
blood:update    → { hospital_id, blood_type, units_available, shortage_alert: bool }
organ:matched   → { request_id, donor_id, patient_id, compatibility_score }
alert:critical  → { type, message, hospital_id, resource_type }
```

---

## 11. Integration Points Table

| Integration | Producer | Consumer | When | Contract |
|---|---|---|---|---|
| `AuthContext` (user + role + token) | M2 (issues JWT) | M1 (stores in context) | Week 3 hard deadline | `{ user, role, token, login(), logout() }` |
| JWT token verification | M2 (auth middleware) | All protected routes | Week 3 | `Authorization: Bearer <token>` |
| `GET /hospitals/:id/stats` | M2 | M1 (Dashboard) | Week 4 | `{ blood_summary, organ_summary, bed_summary }` |
| `POST /ai/blood/forecast` schema | M3 (Python, defines) | M2 (`aiClient.js`, calls) | Week 5 | `{ blood_type, predicted_units_7d, shortage_risk, confidence }` |
| `POST /ai/organ/match` schema | M3 (Python, defines) | M2 (`aiClient.js`, calls) | Week 5 | `{ ranked: [{patient_id, score, factors}] }` |
| Blood inventory API response | M2 | M1 (`BloodTypeCard`) | Week 5 | `[{ blood_type, units_available, min_threshold, shortage_alert }]` |
| `POST /ai/bed/predict` schema | M3 (Python, defines) | M2 (`aiClient.js`, calls) | Week 6 | `{ surge_probability, risk_level, recommended_action }` |
| `bed:update` WebSocket event | M2 (Socket.io emits) | M1 (`useSocket` hook) | Week 6 | `{ ward_id, bed_id, new_status, available_count }` |
| `POST /ai/priority` schema | M3 (Python, defines) | M2 (`aiClient.js`, calls) | Week 7 | `{ priority_score, urgency_level, explanation }` |
| AI predictions in UI widgets | M2 (proxy response) | M1 (AI widgets) | Week 7 | Same shape as Python AI response |
| Redis caching infrastructure | M4 (provisions Redis) | M2 (cache middleware) | Week 4 | Key naming: `resource:type:hospital_id`, agreed TTLs |
| Dockerfile templates | M4 (provides) | M1, M2, M3 (use) | Week 2 | Multi-stage, non-root user templates |
| CI/CD pipelines | M4 (writes) | All (tests must pass) | Week 3 | Test pass = merge gate to `main` |
| Production service URLs | M4 (deploys services) | M1, M2 (update `.env`) | Week 10 | `AI_SERVICE_URL`, `NEXT_PUBLIC_API_BASE_URL` |

---

## 12. Project Survival Rules

| Rule | Detail |
|---|---|
| **M4 sets up Docker first** | `docker-compose.yml` + seed scripts ready by end of Week 1. No one else can develop without the DB. |
| **M3 tests Python offline before wiring routes** | Run each model standalone with hardcoded inputs. Find JSON errors in Week 2, not Week 6. |
| **M3's `/health` must be live before M2 integrates** | `aiClient.js` will throw 500 if Python is down. M3 must have `/health` working before M2 wires AI routes. |
| **M2 publishes API contract by Week 3** | Swagger spec draft shared with M1 before M1 starts building forms. No guessing response shapes. |
| **Pydantic schemas are the frozen AI contract** | M3 defines and locks all schemas in Week 2. M2 must not break them. Any change requires both members to agree. |
| **Cache all AI calls** | Blood forecast TTL: 6h. Bed surge TTL: 1h. Organ match: per-request only. Never call the model on every page load. |
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
  ✅ Bed map with real-time availability via WebSocket
  ✅ All 4 AI endpoints responding on production
  ✅ Working production URL (all 3 services deployed)

SHIP IF TIME:
  ⚡ Blood shortage forecast chart (7-day prediction graph)
  ⚡ Organ compatibility ranked list with factor explanation cards
  ⚡ Bed surge alert banner driven by AI prediction
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
Week 1-2   →  M4: Docker Compose + DB seed  |  M1: React scaffold + auth pages
               M2: Express + Prisma + JWT    |  M3: FastAPI + Pydantic schemas + synthetic data

Week 3-4   →  M1: Dashboard + hospital stats UI
               M2: Hospital stats API + blood/organ CRUD
               M3: Blood demand model training
               M4: Backend CI pipeline + Redis config

Week 4-5   →  M1: Blood page + Organ page
               M2: Bed APIs + Socket.io server
               M3: Organ matcher + bed surge predictor
               M4: Frontend CI + staging environment setup

Week 5-6   →  M1: Bed map + useSocket hook + real-time events
               M2: AI proxy routes wired to Python
               M3: Priority engine + all 4 AI endpoints live
               M4: Staging deploy (all 3 services)

Week 6-7   →  M1: AI prediction widgets on all 3 pages
               M2: AI fallback logic + priority fields in DB
               M3: SHAP explainability + model fine-tuning
               M4: Production infra provisioned (ECS/RDS/ElastiCache)

Week 8     →  M1: Tests (Vitest + Playwright) + mobile fixes
               M2: Integration tests + Swagger docs + rate limiting
               M3: Pytest + edge cases + inference latency tuning
               M4: Security audit + DB backups + PagerDuty alerts

Week 9-10  →  M1: UI polish + Lighthouse audit + prod smoke test
               M2: Production Docker image + Railway/ECS deploy
               M3: Production Docker image + model cache pre-warm
               M4: Grafana dashboards + go-live execution + runbook
```

### Master Timeline

```
Week 1   ██░░░░░░░░░░░░░░░░░░   Docker, repo, scaffolds (all members)
Week 2   ████░░░░░░░░░░░░░░░░   Services boot, DB seeded, AI schemas frozen
Week 3   ░░████░░░░░░░░░░░░░░   Auth + Dashboard (M1+M2), model training begins (M3)
Week 4   ░░░░████░░░░░░░░░░░░   Blood + Organ APIs + pages (M1+M2), forecast model (M3)
Week 5   ░░░░░░████░░░░░░░░░░   Bed map + WebSocket (M1+M2), organ matcher (M3), CI green (M4)
Week 6   ░░░░░░░░████░░░░░░░░   AI integration (M1+M2+M3), staging deployed (M4)
Week 7   ░░░░░░░░░░████░░░░░░   AI explainability (M3), AI widgets (M1), prod infra (M4)
Week 8   ░░░░░░░░░░░░████░░░░   Testing + security + hardening (all members)
Week 9   ░░░░░░░░░░░░░░████░░   Production deploy + monitoring setup (M4), UI polish (M1)
Week 10  ░░░░░░░░░░░░░░░░████   Go-live, Grafana active, demo walkthrough done
```

### Key Milestones

| Milestone | Target | Description |
|---|---|---|
| M1: Local Dev Running | Week 2 | All 4 services run via `docker compose up` |
| M2: Auth + Dashboard Live | Week 4 | Login works; hospital stats on dashboard |
| M3: Blood & Organ APIs + Pages | Week 5 | Full CRUD + AI forecast endpoint working |
| M4: Real-time Bed Map | Week 6 | WebSocket bed updates visible in browser |
| M5: AI Fully Integrated | Week 7 | All 4 AI predictions rendered in frontend |
| M6: Staging Deployed | Week 7 | All 3 services live on cloud staging URLs |
| M7: Tests + Security | Week 8 | 80%+ coverage; security audit passed |
| M8: Production Launch | Week 10 | Live system with Grafana monitoring active |

---

## 14. Demo Script

```
TIME    SPEAKER   ACTION
----------------------------------------------------------------------------------
0:00    M4        "Every year, hospitals lose patients not because of missing doctors
                   — but because of missing resources. We fix that."

0:20    M4        Competitor slide: Excel sheets, phone calls, manual organ matching
                  — slow, error-prone, no prediction, no real-time visibility

0:40    M1        Open live app → log in as Dr. Patel at City Hospital
                  Dashboard loads: 142 beds available, 3 critical blood shortages,
                  2 organ matches pending

1:05    M1        Click Blood tab → blood type grid appears
                  "O- has 2 units left — AI flags HIGH shortage risk"

1:20    M1        Click forecast chart → "AI predicts we run out in 4 days —
                  system triggers an early restock alert automatically"

1:35    M3        "Our Prophet time-series model trains on 6 months of usage history.
                  It predicts demand 7 days ahead with confidence intervals."

1:50    M1        Click Organs tab → open pending kidney request
                  Ranked recipient list appears with compatibility scores

2:05    M3        "Our ML scorer ranks 12 candidates in under 200ms — blood type,
                  HLA markers, urgency, and wait time — with full SHAP explanations"

2:20    M1        Click top match → factor breakdown card:
                  "Blood type +32, HLA match +28, Urgency +20, Wait time +12"

2:35    M1        Click Beds tab → live ward bed map loads
                  Admit a patient → bed turns red in under 1 second

2:50    M2        "Every status change pushed live via Socket.io —
                  no refresh, no polling, instant update across all connected users"

3:05    M1        ICU surge alert banner appears:
                  "ICU at 89% — AI predicts high admission risk this weekend"

3:15    M4        "Blood. Organs. Beds. One system. Real-time. AI-assisted."
                  "Live at [production URL]. Thank you."
```

---

*📋 Roadmap v3.0 — Smart Hospital Resource Allocation System*
*"The right resource, for the right patient, at the right time."*
