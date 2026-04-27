# 🏥 Smart Hospital Resource Allocation System
## Hackathon Roadmap | **4-Member Team (Frontend · Backend · AI/ML · DevOps)**

> **Theme**: Smart Resource Allocation — Data-Driven Volunteer Coordination for Social Impact
> **Stack**: React 18 + TypeScript · Node.js (Express) · Python FastAPI · PostgreSQL + Redis · Socket.io · Docker · GitHub Actions
> **Goal**: AI-powered blood & organ allocation — right resource, right patient, right time — in < 5 seconds
> **Duration**: 8 Weeks

---

## TABLE OF CONTENTS

1. [Project Overview & Problem Statement](#1-project-overview--problem-statement)
2. [How This Fits the Hackathon Theme](#2-how-this-fits-the-hackathon-theme)
3. [System Architecture](#3-system-architecture)
4. [Database Schema (Corrected)](#4-database-schema-corrected)
5. [User Roles & Permissions](#5-user-roles--permissions)
6. [Complete Workflows (Real-Life Corrected)](#6-complete-workflows-real-life-corrected)
7. [Legal & Compliance Layer](#7-legal--compliance-layer)
8. [Member 1 — Frontend Developer Roadmap](#8-member-1--frontend-developer-roadmap)
9. [Member 2 — Backend Developer Roadmap](#9-member-2--backend-developer-roadmap)
10. [Member 3 — AI/ML Engineer Roadmap](#10-member-3--aiml-engineer-roadmap)
11. [Member 4 — DevOps Engineer Roadmap](#11-member-4--devops-engineer-roadmap)
12. [API Reference](#12-api-reference)
13. [WebSocket Events](#13-websocket-events)
14. [Integration Points Table](#14-integration-points-table)
15. [Week-by-Week Build Order](#15-week-by-week-build-order)
16. [Project Survival Rules](#16-project-survival-rules)
17. [Hackathon Demo Script](#17-hackathon-demo-script)

---

## 1. Project Overview & Problem Statement

### The Problem
Every year hospitals fail to save lives — not because of missing doctors — but because of missing resources at the right time. Blood inventory is managed in Excel sheets. Organ matching is done manually over phone calls. No prediction. No real-time visibility. No smart coordination.

### What We're Building
A real-time AI-powered hospital resource management platform that:
- Tracks **blood donations** across all 8 types (A+, A−, B+, B−, AB+, AB−, O+, O−)
- Matches **organ donors** to compatible patients using AI with SHAP explainability
- Predicts **blood shortages** 7 days in advance using time-series forecasting
- Updates **every stakeholder in real-time** via WebSocket — no page refresh needed

### Who Uses It

| User | What They Do |
|---|---|
| **Hospital Admin** | Registers blood donors, manages inventory, confirms organ matches |
| **Doctor** | Requests blood from blood bank for patients, reviews AI organ match suggestions, gives medical approval |
| **Nurse** | Submits blood requests, tracks patient status |
| **Donor** | Registers, gives consent, tracks their donation status |
| **Patient / Family** | Tracks their own request status only (read-only) |

### Our 9 Differentiators vs Existing Systems

| Gap in Existing Tools | Our Answer |
|---|---|
| Static blood inventory spreadsheets | ✅ Real-time WebSocket updates for blood stock changes |
| No blood demand forecasting | ✅ Prophet AI model predicts shortage 7 days ahead |
| Manual organ matching | ✅ Random Forest ML scorer with ranked candidate list |
| Siloed per-department data | ✅ Unified cross-hospital dashboard |
| No priority scoring for requests | ✅ AI urgency + wait time + compatibility combined score (P1–P4) |
| Black-box decisions | ✅ SHAP explainability on every AI recommendation |
| No donor traceability | ✅ Every donated unit linked from donor → patient (audit trail) |
| No cross-hospital coordination | ✅ AI automatically searches network hospitals when local stock/donor unavailable |
| No post-transplant monitoring | ✅ AI monitors post-op rejection risk and fires anomaly alerts |

---

## 2. How This Fits the Hackathon Theme

> **Theme**: Smart Resource Allocation — Data-Driven Volunteer Coordination for Social Impact

| Theme Words | Our Hospital System |
|---|---|
| "Scattered community information" | Blood requests + organ requests from multiple hospitals unified in one system |
| "Paper surveys and field reports" | Digital donor registration forms + blood request forms replacing paper-based processes |
| "Show most urgent local needs" | AI Priority Engine ranks all requests P1→P4; shortage alerts fire automatically |
| "Smart matching" | AI Organ Matcher ranks donors to patients in < 200ms with SHAP explanation |
| "Connect volunteers to tasks" | Donors (volunteers) matched to patients (community in need) by blood type, HLA, urgency |
| "Areas where needed most" | Hospital-scoped WebSocket rooms — each hospital sees its own critical needs |
| "Social Impact" | Every correct allocation = a life saved |

**In one sentence**: Patients are the community in need, donors are the volunteers, blood/organs are the resources, and hospitals are the local areas. Our AI allocates the right resource to the right patient at the right hospital, in real time.

---

## 3. System Architecture

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
|  |  BROWSER STATE    |    |  POSTGRES + REDIS     |                              |
|  |  Zustand Store    |    |  Patient Records      |                              |
|  |  React Query Cache|    |  Blood Inventory      |                              |
|  +------------------+    |  Organ Registry       |                              |
|                           +----------------------+                               |
+----------------------------------------------------------------------------------+
```

> ⚡ **Key Architecture Decision**: Node.js backend is the **single point of contact** for the frontend. It proxies all AI tasks to Python FastAPI via internal HTTP. Frontend never touches Python directly.

### End-to-End Data Flow

```
Doctor submits blood/organ request
        |
        v
[Node.js Backend] → validate (Zod) → check Redis cache → save to PostgreSQL
        |
        +---> [Python AI] POST /ai/priority            → P1/P2/P3/P4 score (background)
        |
        +---> [Python AI] POST /ai/blood/forecast      → shortage prediction (on blood page load)
        |
        +---> [Python AI] POST /ai/organ/match         → ranked donor list (local + cross-hospital)
        |
        +---> [Python AI] POST /ai/blood/check-stock   → local stock check → cross-hospital if unavailable
        |
        +---> [Python AI] POST /ai/postop/monitor      → rejection risk score + anomaly alerts
        |
        +---> [Python AI] POST /ai/reports/summary     → monthly blood use · transplant stats · alerts
        |
        v
[Node.js Backend] → publish WebSocket event → respond to frontend
        |
        v
[Frontend] → all connected users see live update instantly
```

---

## 4. Database Schema (Corrected)

```
hospital_system (PostgreSQL)
|
+-- hospitals
|   +-- id (uuid), name, city, state, type (govt/private/trust)
|   +-- contact, lat, lng, createdAt
|
+-- users
|   +-- id, name, email, password_hash
|   +-- role (admin/doctor/nurse/donor/patient)
|   +-- government_id                          ← NEW: legal verification
|   +-- hospital_id (FK), createdAt
|
+-- patients
|   +-- id, user_id (FK), name, age, gender, blood_type
|   +-- diagnosis (AES-256 encrypted)
|   +-- admission_date, discharge_date
|
+-- blood_inventory
|   +-- id, hospital_id (FK)
|   +-- blood_type (A+/A-/B+/B-/AB+/AB-/O+/O-)
|   +-- units_available, expiry_date, last_restocked
|   +-- min_threshold (alert trigger)
|
+-- blood_donations                            ← NEW TABLE (was missing)
|   +-- id, donor_id (FK → users)
|   +-- blood_type, units_donated
|   +-- donation_date
|   +-- expiry_date                            (whole blood: 35 days)
|   +-- lab_test_status (pending/cleared/rejected)
|   +-- used_in_request_id (FK → blood_requests) ← traceability
|   +-- hospital_id (FK)
|
+-- blood_requests
|   +-- id, patient_id (FK), doctor_id (FK), hospital_id (FK)
|   +-- blood_type, units_required
|   +-- urgency (critical/high/medium/low)
|   +-- clinical_reason                        ← NEW: why blood is needed
|   +-- status (pending/approved/fulfilled/rejected)
|   +-- ai_priority_score, ai_urgency_level
|   +-- createdAt, fulfilledAt
|
+-- organ_donors
|   +-- id, user_id (FK → users)
|   +-- name, age, gender, blood_type
|   +-- donor_type (living/deceased)           ← NEW: critical legal distinction
|   +-- available_organs [kidney/liver/heart/lungs/cornea/pancreas]
|   +-- hla_markers (JSON array)
|   +-- consent_signed (boolean)               ← NEW: legal requirement
|   +-- consent_document_url                   ← NEW: uploaded document
|   +-- government_id                          ← NEW: identity verification
|   +-- independent_evaluation_done (boolean)  ← NEW: for living donors
|   +-- family_consent (boolean)               ← NEW: for deceased donors
|   +-- brain_death_certified (boolean)        ← NEW: for deceased donors
|   +-- hospital_id (FK)
|   +-- status (active/matched/expired)
|   +-- registered_at
|
+-- organ_requests
|   +-- id, patient_id (FK), doctor_id (FK)
|   +-- organ_type (kidney/liver/heart/lungs/cornea/pancreas)
|   +-- urgency_score (0-100)
|   +-- clinical_notes                         ← NEW: doctor's medical notes
|   +-- wait_since
|   +-- status (waiting/matched/transplanted/cancelled)
|   +-- matched_donor_id (FK → organ_donors)
|   +-- doctor_approved (boolean)              ← NEW: doctor medical approval
|   +-- doctor_approved_at                     ← NEW: timestamp
|   +-- admin_confirmed (boolean)              ← NEW: admin legal confirmation
|   +-- admin_confirmed_at                     ← NEW: timestamp
|   +-- ai_priority_score, ai_urgency_level
|   +-- hospital_id (FK)
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

## 5. User Roles & Permissions

```
ROLE          CAN DO                                        CANNOT DO
----------    ------------------------------------------    ---------------------------
admin         Register blood donors                         Submit requests for patients
              Manage blood inventory + restock              Access other hospitals' data
              Register organ donors
              Confirm organ match (legal step)
              View all requests in priority queue
              View audit logs

doctor        Submit blood request for patient              Approve their own requests
              Submit organ request for patient              Restock inventory
              Review AI organ match ranked list             Register donors
              Give medical approval on organ match

nurse         Submit blood request for patient              Submit organ requests
              Track patient request status                  Approve anything
                                                            Access admin panel

donor         Register (admin creates account)              Submit requests
              View own donation status                      See other patients' data
              Digitally sign consent

patient       View their OWN request status only            Submit any request
              View their OWN organ/blood request            See other patients' data
              Track live status updates                     Access any form
```

---

## 6. Complete Workflows (Real-Life Corrected)

---

### 🩸 BLOOD WORKFLOW

#### Flow 1 — Blood Donation (Updated per new workflow)

```
Donor registers / walks in
├── Creates donor profile in system
                    ↓
Doctor: health screening
├── BP, Hb, eligibility check
├── Age: 18–65 years
├── Weight: > 50 kg
├── Last donation: at least 90 days ago
└── No active infection / medication / disease
                    ↓
         ┌──────────────────┐
         │   Eligible?      │ ← Doctor decides
         │  Doctor decides  │
         └──────────────────┘
          /                  \
        No                   Yes
         ↓                    ↓
   Deferred              Blood collection
   Notify donor     Donor donates, unit bagged & tagged
                              ↓
                Lab: blood group & disease test
                ├── ABO/Rh typing
                ├── HIV screening
                ├── Hepatitis B/C screening
                └── (Malaria where applicable)
                              ↓
                AI: logs unit to blood bank
                ├── Updates live inventory & expiry tracking
                └── ──→ [AI blood alert] Low stock → notify admin
                              ↓
                Admin: approve & store unit
                └── Quarantine lifted, unit available
                              ↓
                Donor receives donation card
                └── Next eligible date set by system
```

#### Flow 2 — Doctor Requests Blood + AI Allocation (Updated per new workflow)

```
Doctor: raises blood request
├── Blood type, units needed, urgency level
└── Clinical reason: "surgery" / "accident" / "anemia"
                    ↓
System validates:
├── Doctor is verified and role = doctor ✅
└── Patient is admitted at this hospital ✅
                    ↓
AI: checks local blood bank
├── Matches type, volume, expiry date
└── Assigns AI priority score (P1–P4)
                    ↓
         ┌──────────────────────┐
         │   Stock available?   │ ← AI / System decides
         └──────────────────────┘
          /                       \
        No                        Yes
         ↓                          ↓
[Cross-hospital]           Admin: approves unit release
AI: search other            Cross-match confirmed,
hospitals — urgent          unit issued
request                              ↓
                          Doctor: transfusion to patient
                          Bedside check, infusion monitored
                                     ↓
                          AI: deducts & checks stock level
                          └── Sends low-stock alert if threshold hit
                              ──→ [Admin alert] Replenish blood drive
                                     ↓
                          Patient outcome recorded
                          └── Doctor logs reaction / success
```

---

### 🫀 ORGAN WORKFLOW

#### Donor Types — Understanding First

```
TYPE A — Living Donor (can donate: one kidney OR partial liver only)
├── Person voluntarily comes forward
├── Must be 18+ with full mental capacity
├── Relation to recipient verified
├── Independent medical evaluation by separate doctor
└── Written + digital consent signed

TYPE B — Deceased Donor (can donate: both kidneys, liver, heart, lungs, cornea, pancreas)
├── Patient declared brain dead in ICU
├── Certified by 2 independent doctors (legal requirement)
├── Family gives written consent
└── Time critical — clock starts immediately:
    ├── Heart  → 4–6 hours window
    ├── Liver  → 12–24 hours window
    ├── Kidney → 24–36 hours window
    └── Cornea → up to 14 days
```

#### Flow 1 — Organ Donor Registration (Updated per new workflow)

```
LIVING DONOR:
Person decides to donate kidney to family member
                    ↓
Comes to hospital with Government ID
                    ↓
Donor: gives organ consent
└── Living or deceased, organs pledged
                    ↓
Admin: registers donor profile
├── Blood group, HLA markers, organ list logged
├── Name, Age, Gender, Government ID
├── donor_type → living
├── available_organs → [kidney]
├── hla_markers → [A2, B7, DR4]
├── consent_signed → true ✅
├── independent_evaluation_done → true ✅
└── status → active
                    ↓
Doctor: medical evaluation
├── Viability check
├── Contraindications check
└── (legally required independent doctor)

─────────────────────────────────────────

DECEASED DONOR:
Patient in ICU declared brain dead
                    ↓
2 independent doctors certify brain death (legal requirement)
                    ↓
Doctor informs family → family gives written consent
                    ↓
Donor: gives organ consent (family on behalf)
└── Deceased, organs pledged
                    ↓
Admin: registers donor profile
├── donor_type → deceased
├── available_organs → [kidney, liver, heart, lungs, cornea, pancreas]
├── brain_death_certified → true ✅
├── family_consent → true ✅
└── status → active
                    ↓
Doctor: medical evaluation
└── Viability, contraindications check
                    ↓
⚠️ COUNTDOWN STARTS — system shows organ viability timer:
├── Heart  → 4 hrs remaining
├── Liver  → 12 hrs remaining
├── Kidney → 24 hrs remaining
└── Cornea → 14 days remaining
```

#### Flow 2 — Patient Needs Organ

```
Patient diagnosed with kidney failure
                    ↓
DOCTOR submits Organ Request:
├── Select patient from admitted list
├── organ_type → kidney
├── urgency_score → 85 / 100
├── clinical_notes → "Stage 5 kidney failure, dialysis 3x/week"
└── wait_since → date patient started waiting
                    ↓
organ_requests saved → status: "waiting"
                    ↓
AI Priority Engine scores in background:
├── Urgency 40% + Wait time 30% + Compatibility 30%
└── P1 / P2 / P3 / P4 assigned
                    ↓
Request enters transplant waiting list
sorted by AI priority score
```

#### Flow 3 — AI Organ Matching (Updated per new workflow)

```
Doctor: medical evaluation complete
                    ↓
AI organ match engine runs:
├── Blood group compatibility
├── HLA marker overlap
├── Age difference factor
├── Patient urgency score
├── Wait time on list
└── Geography / proximity
→ Ranks best-matched recipients
                    ↓
                    ├──→ [Cross-hospital] Searches network if no local match
                    ↓
         ┌──────────────────┐
         │   Match found?   │ ← AI / System decides
         └──────────────────┘
          /                   \
        No                    Yes
         ↓                     ↓
   Waitlist              (proceed to Flow 4)
   Monitor & re-run
   periodically
```

#### Flow 4 — Medical Review + Legal Approval + Surgery (Updated per new workflow)

```
STEP 1 — DOCTOR confirms match to patient:
                    ↓
Doctor reviews AI ranked list
├── Reviews compatibility factors (SHAP breakdown)
├── Checks patient current health condition
├── Checks if patient is fit for surgery today
├── Obtains patient consent ✅
├── Alerts surgical team ✅
└── Clicks "Give Medical Approval" button
                    ↓
organ_requests:
├── doctor_approved → true
└── doctor_approved_at → timestamp

─────────────────────────────────────────

STEP 2 — ADMIN schedules transplant (Legal Confirmation):
                    ↓
Admin verifies:
├── Donor consent document on file ✅
├── Government ID verified ✅
├── Independent evaluation done ✅ (living donor)
│   OR brain death certificate + family consent ✅ (deceased)
└── All legal documents complete ✅
                    ↓
Admin clicks "Confirm Match" / Schedules transplant:
├── OT booked ✅
├── Logistics & transport arranged ✅
└── organ_requests: admin_confirmed → true, status → "matched"
                    ↓

─────────────────────────────────────────

STEP 3 — DOCTOR performs transplant surgery:
                    ↓
Doctor: transplant surgery
└── Post-op immunosuppression started
                    ↓
AI: monitors post-op patient
├── Rejection risk score computed
└── Alerts if anomaly detected
                    ↓
Patient outcome & follow-up
└── Doctor logs recovery; donor thanked
```

#### Flow 5 — Live Notification & Post Surgery

```
Both doctor_approved AND admin_confirmed → match confirmed ✅
                    ↓
WebSocket fires: organ:matched event
{
  request_id,
  donor_id,
  patient_id,
  organ_type: "kidney",
  compatibility_score: 85
}
                    ↓
Live updates across hospital:
├── 👨‍⚕️ Doctor → "Match confirmed for Patient #203" ✅
├── 🏥 Admin  → Request moves to "Matched" queue ✅
└── 🙋 Patient → "A kidney match has been found for you" ✅
                    ↓
Surgery completed:
Doctor updates → organ_requests status: "transplanted"
Admin updates → organ_donors status: "expired"
Full audit trail saved permanently
```

#### Complete Organ Status Journey

```
DONOR STATUS:              PATIENT REQUEST STATUS:

registered                 doctor submits request
    ↓                            ↓
active  ←────────────── waiting  (AI priority queue)
    ↓                            ↓
matched ←── AI + doctor + admin ──→ matched
    ↓                            ↓
expired                    transplanted (post surgery)
```

---

### 🖥️ ADMIN CENTRAL DASHBOARD (New — per updated workflow)

The admin dashboard provides a unified real-time view of all hospital operations, with three core panels and cross-cutting admin functions.

#### Dashboard Panels

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  Blood Inventory    │  │   Organ Waitlist     │  │  Alerts & Reports   │
│  Live stock per     │  │  Priority queue by   │  │  Low blood ·        │
│  blood type         │  │  AI score            │  │  Urgent organ       │
│  Expiry & usage     │  │  Cross-hospital      │  │  Audit trail        │
│  trend              │  │  status              │  │  & logs             │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

#### Admin: Manage Users & Access

```
Admin: manage users & access
└── Create / edit Doctor, Patient, Donor accounts
```

#### AI: Generates Summary Report

```
AI: generates summary report
├── Monthly blood use statistics
├── Transplant outcomes & stats
└── Critical alerts history
```

---

## 7. Legal & Compliance Layer

| Legal Requirement | How System Handles It |
|---|---|
| Donor must give written consent | `consent_signed` boolean + `consent_document_url` in DB |
| Blood must be lab-tested before use | `lab_test_status` field — only `cleared` units added to inventory |
| 90-day gap between blood donations | System calculates next eligible date, blocks re-registration; donor card issued |
| Living organ donor needs independent evaluation | `independent_evaluation_done` field required before status = active |
| Brain death must be certified by 2 doctors | `brain_death_certified` field required for deceased donor |
| Family consent for deceased donor | `family_consent` field required |
| Doctor must approve organ match medically | `doctor_approved` + `doctor_approved_at` required before admin can confirm |
| Admin confirms legal documents before finalizing | `admin_confirmed` — second step after doctor approval; OT booking & logistics logged |
| Every unit traceable from donor to patient | `blood_donations.used_in_request_id` links donation to request |
| Cross-match confirmation before blood release | Admin confirms cross-match before unit is issued to ward |
| Patient data is private | RBAC enforced — patients see only their own data |
| All actions logged | Full `audit_logs` table with actor, action, timestamp |
| Sensitive data encrypted | Patient `diagnosis` field encrypted with AES-256-CBC |
| Post-transplant monitoring required | AI rejection risk score computed; anomaly alerts fire if vitals deviate |

---

## 8. Member 1 — Frontend Developer Roadmap

**Owns**: All UI/UX — pages, components, real-time updates, charts, forms
**Never touches**: API business logic, ML model code, database schema, cloud infra
**Timeline**: 8 Weeks

---

### Phase 0 — Setup & Foundation (Week 1)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 1** | `npm create vite@latest frontend -- --template react-ts` → install deps: `react-router-dom zustand @tanstack/react-query axios socket.io-client` | React 18 + TypeScript boots on localhost:3000 |
| **Week 1** | Install Tailwind: `npm install -D tailwindcss postcss autoprefixer` → `npx tailwindcss init -p` | Tailwind utility classes working |
| **Week 1** | `lib/axios.ts` — Axios instance with `baseURL: VITE_API_BASE_URL` + request interceptor injecting `Authorization: Bearer <token>` | All API calls carry JWT automatically |
| **Week 1** | `lib/socket.ts` — Socket.io-client singleton: `io(VITE_SOCKET_URL, { autoConnect: false })` | Socket client ready |
| **Week 1** | `store/auth.ts` — Zustand: `{ user, token, role, login(), logout() }` persisted to localStorage | Auth state survives page refresh |
| **Week 1** | `components/layout/PrivateRoute.tsx` — checks `isAuthenticated`, redirects to `/login` if false | Protected routes block unauthenticated access |
| **Week 1** | Build base component library: `Button, Modal, Card, Badge, Table, AlertBanner, Skeleton` | Shared components ready for all pages |

✅ **Week 1 Checkpoint**: App boots. Auth store persists token. PrivateRoute works. Component library ready.

---

### Phase 1 — Auth & Dashboard (Week 2)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 2** | `app/(auth)/login/page.tsx` — email + password → `POST /auth/login` → stores token → redirects to `/dashboard` | Login flow complete |
| **Week 2** | `app/(auth)/register/page.tsx` — name, email, password, role selector (doctor/nurse/admin/donor/patient), hospital dropdown → `POST /auth/register` | Registration complete |
| **Week 2** | `components/layout/Sidebar.tsx` — role-based nav: doctor sees Blood/Organs/Requests; admin sees all + Admin panel; patient sees only Requests; donor sees Donations | Correct nav per role |
| **Week 2** | `app/dashboard/page.tsx` — 3 stat cards: Blood Shortage Alerts, Pending Organ Requests, Total Active Requests | Dashboard shows live hospital stats |
| **Week 2** | `components/layout/NotificationCenter.tsx` — slide-out tray, Zustand `notifications` store, badge count on bell icon | Notification tray with badge count |

✅ **Week 2 Checkpoint**: Login → dashboard flow works. Stats cards show real data.

---

### Phase 2 — Blood & Organ Pages (Week 3)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 3** | `app/blood/page.tsx` — fetches `GET /blood/inventory/:hospitalId` → renders `BloodTypeCard` grid (2×4, one per blood type) | Blood inventory page with all 8 types |
| **Week 3** | `components/ui/BloodTypeCard.tsx` — shortage badge: 🟢 safe / 🟡 low / 🔴 critical based on `min_threshold` | Cards show correct shortage status |
| **Week 3** | `components/forms/BloodDonorForm.tsx` (admin only) — donor name, age, blood type, government ID, consent checkbox → `POST /blood/donors` | Admin can register blood donor |
| **Week 3** | `components/forms/BloodRequestForm.tsx` (doctor/nurse) — patient selector, blood type, units, urgency, clinical reason → `POST /blood/requests` | Doctor can submit blood request |
| **Week 3** | `app/organs/page.tsx` — organ donor registry + organ type availability cards | Organ page renders donor availability |
| **Week 3** | `components/forms/OrganDonorForm.tsx` (admin only) — donor type selector (living/deceased), organs available, HLA markers, consent fields → `POST /organs/donors` | Admin can register organ donor |
| **Week 3** | `components/forms/OrganRequestForm.tsx` (doctor only) — organ type, urgency slider 0–100, patient selector, clinical notes → `POST /organs/requests` | Doctor can submit organ request |
| **Week 3** | `app/requests/page.tsx` — tabbed view: blood requests + organ requests; status badges; AI priority badges (P1–P4) | Unified requests view |

✅ **Week 3 Checkpoint**: Doctor can view blood inventory, submit requests. Admin can register donors. All forms validate and submit.

---

### Phase 3 — Real-Time Updates & AI Widgets (Week 4–5)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 4** | `hooks/useSocket.ts` — on mount: `socket.connect()` + `socket.emit('join-hospital', hospitalId)`; on unmount: `socket.disconnect()` | Socket connects/disconnects with component lifecycle |
| **Week 4** | Wire `blood:update` event → update Zustand `resources` store → `BloodTypeCard` re-renders without page refresh | Blood units update live |
| **Week 4** | Wire `organ:matched` event → toast + request status badge updates instantly in `/requests` | Organ match triggers live UI update |
| **Week 4** | Wire `alert:critical` event → push to Zustand `notifications` → toast appears + bell badge increments | Critical alerts show as toast |
| **Week 5** | `components/charts/BloodForecastChart.tsx` — Recharts `LineChart`; 7-day forecast; confidence bands as shaded area | Forecast chart renders on blood page |
| **Week 5** | AI shortage risk pill on `BloodTypeCard.tsx` — reads `shortage_risk` from forecast; grey/yellow/orange/red | Each blood card shows AI risk level |
| **Week 5** | `components/ui/CrossHospitalBanner.tsx` — shown when local stock unavailable; lists hospitals with available stock + transfer action | Cross-hospital search result displayed |
| **Week 5** | `components/charts/CompatibilityRankList.tsx` — ranked donor list inside organ request modal; score bar per candidate; cross-hospital badge if donor is from another hospital | Organ match ranked list renders with source hospital |
| **Week 5** | `components/ui/FactorCard.tsx` — SHAP factor breakdown as horizontal bar chart per candidate | Factor breakdown visible per match |
| **Week 5** | `app/admin/page.tsx` — Priority Queue table: all requests sorted by `ai_priority_score` desc; P1–P4 badge; approve/reject buttons | Admin sees AI-ranked priority queue |
| **Week 5** | Organ match modal — THREE STEP approval UI: "Give Medical Approval" (doctor) → "Confirm & Schedule" (admin, with OT booking form) — each only visible to correct role | Three-step legal approval UI works |
| **Week 5** | `components/ui/PostOpMonitor.tsx` — rejection risk score badge + anomaly alert banner on transplanted patient's record | AI post-op monitoring visible to doctor |
| **Week 5** | `components/ui/DonorCard.tsx` — displayed after donation cleared; shows next eligible date | Donor card shown on donation confirmation |
| **Week 5** | `app/admin/reports/page.tsx` — AI summary report view: monthly blood use chart, transplant stats table, critical alerts log | Admin can view AI-generated monthly report |

✅ **Week 5 Checkpoint**: Blood cards update live. Forecast chart, cross-hospital banner, compatibility rank list, priority queue, and post-op monitor rendering with real AI data. Three-step organ approval flow working.

---

### Phase 4 — Testing & Polish (Week 6–7)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 6** | Install Vitest: `npm install -D vitest @testing-library/react jsdom` | Test runner configured |
| **Week 6** | `BloodRequestForm.test.tsx` — required fields show error; units > 0 enforced; submit calls correct endpoint | Form validation tests pass |
| **Week 6** | `BloodTypeCard.test.tsx` — correct shortage badge for safe/low/critical thresholds | Card badge logic tested |
| **Week 6** | Playwright E2E: login → blood page → submit request → assert appears in requests tab | Blood request E2E test passes |
| **Week 7** | Mobile responsiveness: all pages usable at 375px width | App usable on mobile |
| **Week 7** | Add skeleton loaders on all pages while React Query `isLoading` is true | No blank page flashes |
| **Week 7** | Add empty state components: "No requests yet", "No donors registered" | No blank white boxes |
| **Week 7** | `ErrorBoundary` on each page — "Something went wrong" card with retry button | App doesn't white-screen on error |

✅ **Week 7 Checkpoint**: Tests pass. Mobile responsive. Skeleton loaders on all pages.

---

### Phase 5 — Production (Week 8)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 8** | Lazy-load heavy routes with `React.lazy()` + `<Suspense>` | Bundle size reduced |
| **Week 8** | Update `.env.production` with production URLs from M4 | Frontend points to production backend |
| **Week 8** | `npm run build` → verify no TypeScript errors → deploy to Vercel | Production build live |
| **Week 8** | Smoke test full flow on production URL | Zero broken flows on production |

✅ **Week 8 Checkpoint**: Production UI live. All flows verified.

---

## 9. Member 2 — Backend Developer Roadmap

**Owns**: All REST APIs, database schema + migrations, JWT auth, WebSocket server, Redis caching, AI proxy
**Never touches**: React components, ML model training, Dockerfile configs, cloud infra
**Timeline**: 8 Weeks

---

### Phase 0 — Setup & Foundation (Week 1)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 1** | `npm init -y` → install: `express cors helmet dotenv bcryptjs jsonwebtoken zod prisma @prisma/client ioredis axios` | Node.js + Express initialized |
| **Week 1** | `npx prisma init` → write full `prisma/schema.prisma` — all models including corrected `OrganDonor` (with donor_type, consent_signed, government_id) and `BloodDonation` (new table) and `OrganRequest` (with doctor_approved, admin_confirmed) | Full corrected DB schema defined |
| **Week 1** | `npx prisma migrate dev --name init` | All tables created in PostgreSQL |
| **Week 1** | `src/index.ts` — Express app, CORS, Helmet, JSON parser, mount routes, `GET /health` | Backend boots on localhost:4000 |
| **Week 1** | `src/middleware/auth.ts` — `verifyToken()`: extract Bearer token, `jwt.verify()`, attach `req.user = { id, role, hospitalId }` | JWT middleware protects all routes |
| **Week 1** | `src/middleware/validate.ts` — Zod schema validation middleware factory | Input validation on all routes |
| **Week 1** | `src/routes/auth.ts` — `POST /auth/register` + `POST /auth/login` | Auth endpoints return valid JWTs |
| **Week 1** | `src/services/aiClient.ts` — 3 stub functions: `getBloodForecast()`, `getOrganMatch()`, `getPriorityScore()` returning mock JSON | AI stubs callable by M1 immediately |

✅ **Week 1 Checkpoint**: Backend boots on localhost:4000. Register + login return JWTs. AI stubs ready.

---

### Phase 1 — Blood & Organ APIs (Week 2–3)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 2** | `GET /hospitals` + `GET /hospitals/:id/stats` — blood summary + organ summary | Hospital stats endpoint live |
| **Week 2** | Redis client singleton → `src/middleware/cache.ts` → apply `cacheMiddleware(60)` to stats | Stats cached in Redis |
| **Week 2** | `prisma/seed.ts` — 3 hospitals, blood inventory (8 types × 3 hospitals), 20 organ donors, 5 blood donors, 5 test users | DB seeded with demo data |
| **Week 3** | `POST /blood/donors` (admin only) — register blood donor: validate government_id, check 90-day gap, create user + blood_donations record with `lab_test_status: pending` | Blood donor registration endpoint |
| **Week 3** | `PATCH /blood/donors/:id/lab-result` (admin only) — update `lab_test_status` to `cleared` or `rejected`; on `cleared`: increment blood_inventory units_available | Lab result updates inventory |
| **Week 3** | `GET /blood/inventory/:hospitalId` — 8 types with `shortage_alert: units < minThreshold` | Blood inventory with shortage flags |
| **Week 3** | `POST /blood/requests` — role guard: `doctor/nurse`; Zod validate; create request + write audit_log; call `aiClient.getPriorityScore()` via `setImmediate` | Blood request saved + AI scored |
| **Week 3** | `PATCH /blood/requests/:id` (admin) — approve: decrement inventory + link `blood_donations.used_in_request_id`; emit `blood:update` WS event | Approval deducts inventory, traces donation |
| **Week 3** | `POST /organs/donors` (admin only) — validate consent fields; for living: require `independent_evaluation_done`; for deceased: require `brain_death_certified + family_consent` | Organ donor registration with legal checks |
| **Week 3** | `POST /organs/requests` (doctor only) — create request with `clinical_notes`; `setImmediate` AI priority score | Organ request saved + AI scored |
| **Week 3** | `GET /organs/requests/match/:requestId` — fetch request → call `aiClient.getOrganMatch()` → cache 30min → return ranked list | Organ match proxy returns AI-ranked list |

✅ **Week 3 Checkpoint**: All blood + organ CRUD endpoints working. Donor registration with legal validation. Organ match proxy live.

---

### Phase 2 — Two-Step Organ Approval + WebSocket (Week 4–5)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 4** | `PATCH /organs/requests/:id/doctor-approve` — role guard: `doctor`; sets `doctor_approved = true`; obtains patient consent flag; alerts surgical team via WS event | Doctor medical approval + consent endpoint |
| **Week 4** | `PATCH /organs/requests/:id/confirm` — role guard: `admin`; checks `doctor_approved == true` first; sets `admin_confirmed = true`; saves OT booking details; updates status to `matched`; updates donor status to `matched`; emits `organ:matched` WS event | Admin legal confirmation + transplant scheduling (requires doctor approval first) |
| **Week 4** | `PATCH /organs/requests/:id/transplant-complete` — role guard: `doctor`; updates status to `transplanted`; triggers AI post-op monitoring job | Surgery completion + post-op AI trigger |
| **Week 4** | Socket.io init → clients join hospital room; emit `blood:update` on inventory change; emit `organ:matched` on confirmed match; emit `alert:critical` when units < `min_threshold`; emit `postop:alert` on AI anomaly detection | All 4 WebSocket events live |
| **Week 5** | Replace AI stubs with real axios calls → all endpoints with 5s timeout + fallback to Redis cache | Real AI proxy live |
| **Week 5** | AI fallback: `try { await axios.post(...) } catch { return redis.get(cacheKey) ?? DEFAULT_SAFE_RESPONSE }` | Backend never crashes if AI is down |
| **Week 5** | `GET /blood/cross-hospital/:bloodType` — queries other hospitals in network for available stock; returns ranked list by proximity + availability | Cross-hospital blood search endpoint |
| **Week 5** | `GET /organs/cross-hospital/match/:requestId` — extends organ match to search donors across network hospitals | Cross-hospital organ match endpoint |
| **Week 5** | `GET /admin/reports/summary` — calls AI summary endpoint; returns monthly blood use, transplant stats, alert history | AI summary report endpoint |

✅ **Week 5 Checkpoint**: Three-step organ approval working. WebSocket events emitting. Real AI proxy live with fallback. Cross-hospital search endpoints live.

---

### Phase 3 — Security & Testing (Week 6–7)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 6** | Jest + Supertest tests: auth, blood inventory, blood donor registration, organ donor registration, two-step organ approval flow | All route tests pass |
| **Week 7** | Rate limiting: 100 req/15min on `/auth/*`; 500 req/15min on authenticated routes | Rate limiting returns 429 on exceed |
| **Week 7** | Encrypt `patients.diagnosis` with AES-256-CBC before Prisma create; decrypt on findUnique | Patient data encrypted at rest |
| **Week 7** | Swagger docs at `GET /api/docs` — all routes documented | API docs live |

✅ **Week 7 Checkpoint**: All tests pass. Security hardened. Swagger docs live.

---

### Phase 4 — Production (Week 8)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 8** | `npx prisma migrate deploy` + `npx prisma db seed` on production DB | Production DB migrated and seeded |
| **Week 8** | Deploy to Railway/AWS ECS; set all env vars; smoke test all endpoints | Backend live on production |

✅ **Week 8 Checkpoint**: Backend live. All smoke tests pass.

---

## 10. Member 3 — AI/ML Engineer Roadmap

**Owns**: Python FastAPI microservice, all 3 ML models, SHAP explainability, training pipelines
**Never touches**: React components, Node.js routes, database schema, cloud infra
**Timeline**: 8 Weeks

---

### Phase 0 — Setup & Schemas (Week 1)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 1** | `python -m venv venv` → install: `fastapi uvicorn pydantic scikit-learn prophet pandas numpy shap joblib python-dotenv mlflow` | Python ML environment ready |
| **Week 1** | `app/main.py` — FastAPI app, CORS, mount routers, `GET /health` → `{ status: "ok", model_versions }` | FastAPI boots on localhost:8000 |
| **Week 1** | `app/schemas/blood.py` — `BloodForecastRequest` + `BloodForecastResponse` (predicted_units_7d, shortage_risk, confidence, upper_bound, lower_bound) | Blood schema frozen |
| **Week 1** | `app/schemas/organ.py` — `OrganMatchRequest` (organ_type, donor, candidates[]) + `OrganMatchResponse` (ranked list with factors per candidate) | Organ schema frozen |
| **Week 1** | `app/schemas/priority.py` — `PriorityRequest` (request_type, urgency, wait_days, compatibility_score) + `PriorityResponse` (priority_score, urgency_level P1–P4, explanation) | Priority schema frozen |
| **Week 1** | **Share all 3 schema files with M2 immediately** — M2 builds aiClient.ts stubs from these | M2 can integrate without waiting |
| **Week 1** | `training/generate_synthetic_data.py` → 6-month daily blood usage (8 types × 3 hospitals) → `blood_history.csv`; 500 organ donor-recipient pairs with HLA + outcomes → `organ_pairs.csv` | Training CSVs ready |

✅ **Week 1 Checkpoint**: FastAPI boots. All 3 schemas frozen and shared with M2. Training data generated.

---

### Phase 1 — Blood Demand Forecasting (Week 2–3)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 2** | `training/train_blood_forecast.py` — for each of 8 blood types: `Prophet(yearly_seasonality=True, weekly_seasonality=True).fit(df_train)` | Prophet trains on all 8 types |
| **Week 2** | Shortage risk logic: `predicted > 2×threshold → "low"`, `> threshold → "medium"`, `> 0.5×threshold → "high"`, else `"critical"` | Risk levels compute correctly |
| **Week 2** | Evaluate: MAE on 1-month held-out split → `mlflow.log_metric(f"MAE_{blood_type}", mae)` | MAE < 5 units per type in MLflow |
| **Week 3** | Save all 8 models: `joblib.dump(model, f"models/blood_{blood_type}.pkl")` | 8 .pkl files saved |
| **Week 3** | `app/services/blood_forecast.py` — load from `app.state.blood_models`, run `model.predict(future_df)`, return `BloodForecastResponse` | Service returns valid forecast |
| **Week 3** | `POST /ai/blood/forecast` router → calls service → returns real predictions | Blood forecast endpoint live |
| **Week 3** | Fallback: if `len(historical_usage) < 3` → return safe default response with `shortage_risk: "unknown"` | Sparse data handled gracefully |

✅ **Week 3 Checkpoint**: `POST /ai/blood/forecast` returns `{ predicted_units_7d, shortage_risk, confidence, upper_bound, lower_bound }`. MAE < 5 units.

---

### Phase 2 — Organ Compatibility Matcher (Week 3–5)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 3** | Feature engineering from `organ_pairs.csv`: `blood_type_compatible (0/1)`, `hla_overlap_count (0–6)`, `age_diff_abs`, `urgency_score_norm`, `wait_days_norm`, `distance_km` (new: geography factor) | Feature matrix X and label y ready |
| **Week 4** | `RandomForestClassifier(n_estimators=100, max_depth=8, class_weight="balanced").fit(X_train, y_train)` | Random Forest trained |
| **Week 4** | Rule-based score per candidate: `blood_pts = 35 if compatible else 0`; `hla_pts = overlap × 5`; `urgency_pts = urgency × 0.2`; `wait_pts = min(wait_days/365,1) × 10`; `geo_pts = proximity factor`; total → 0–100 | 0–100 compatibility score with geography factor |
| **Week 4** | Cross-hospital search logic: if no local donor scores ≥ threshold → query `organ_donors` across all hospitals in network; flag `is_cross_hospital: true` on results | Cross-hospital fallback in organ match |
| **Week 4** | SHAP: `explainer = shap.TreeExplainer(model)` → per candidate: `sv = explainer.shap_values(X)[1]` → build `factors: [{name, value, impact}]` | SHAP explanations per candidate |
| **Week 4** | Evaluate: `roc_auc_score(y_test, model.predict_proba(X_test)[:,1])` → MLflow log | AUC-ROC > 0.85 |
| **Week 5** | Save model: `joblib.dump(model, "models/organ_matcher.pkl")` | Organ model persisted |
| **Week 5** | `app/services/organ_matcher.py` + `POST /ai/organ/match` router | Organ match endpoint live with SHAP + cross-hospital |
| **Week 5** | `app/services/postop_monitor.py` + `POST /ai/postop/monitor` — computes rejection risk score from post-op vitals; returns `{ rejection_risk, alert: bool, anomaly_details }` | Post-op monitoring endpoint live |
| **Week 5** | `app/services/reports.py` + `POST /ai/reports/summary` — aggregates monthly blood usage, transplant outcomes, alert counts → structured summary JSON | AI summary report endpoint live |

✅ **Week 5 Checkpoint**: `POST /ai/organ/match` returns ranked list with cross-hospital results, SHAP `factors`, and `is_cross_hospital` flag. AUC-ROC > 0.85. Post-op monitor and summary report live.

---

### Phase 3 — Priority Engine & Hardening (Week 5–6)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 5** | `app/services/priority_engine.py` — `score = (urgency/10)×40 + min(wait_days/30,1)×30 + (compatibility/100)×30`; level: `≥90→P1`, `≥70→P2`, `≥50→P3`, else `P4` | Priority scoring logic implemented |
| **Week 5** | `POST /ai/priority` router | Priority endpoint live |
| **Week 6** | Preload all models at startup: `@app.on_event("startup") async def load_models()` → 8 blood models + organ model + postop model into `app.state` | Zero per-request disk I/O |
| **Week 6** | Edge cases: blood with empty history → fallback 200; organ with all incompatible candidates → cross-hospital fallback triggered; priority with min inputs → returns P4; postop with missing vitals → returns `alert: false` with warning flag | All edge cases return 200 |
| **Week 6** | Request logging middleware: log `method, path, duration_ms, status_code` per inference call | All inference calls logged |

✅ **Week 6 Checkpoint**: All 5 AI endpoints live. Models preloaded. Edge cases handled.

---

### Phase 4 — Testing & Production (Week 7–8)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 7** | Pytest: blood forecast tests (valid history + empty fallback); organ match tests (ranked correctly, SHAP factors present, cross-hospital flag set when no local match); priority tests (P1/P4 boundaries); postop monitor tests (alert fires on anomaly, safe return on missing vitals) | All pytest tests pass |
| **Week 7** | `GET /ai/health` — `{ status, models_loaded: [...], uptime_seconds }` — now reports all 5 models | Health endpoint reports all models |
| **Week 7** | Run 50 sequential requests per endpoint → P95 < 300ms | Latency target confirmed |
| **Week 8** | Production Docker image → deploy to Railway/AWS ECS → `AI_SERVICE_URL` sent to M2 | ML service live on production |

✅ **Week 8 Checkpoint**: All tests pass. P95 < 300ms. ML service live. M2 AI proxy connected.

---

## 11. Member 4 — DevOps Engineer Roadmap

**Owns**: Docker, CI/CD, cloud infra, monitoring, backups, secrets management
**Never touches**: React components, Express routes, ML model architecture, Prisma schema
**Timeline**: 8 Weeks

---

### Phase 0 — Local Development Setup (Week 1)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 1** | Create GitHub monorepo → branch protection on `main`: require PR + 1 approval + CI passing | Repo created; main branch protected |
| **Week 1** | `docker-compose.yml` — 5 services: frontend (3000), backend (4000), ml-service (8000), postgres (5432), redis (6379) with volumes | `docker compose up` starts all 5 services |
| **Week 1** | Add `depends_on` with health checks — backend waits for postgres + redis | Services start in correct order |
| **Week 1** | Write Dockerfile templates for M1 (Node 18 Vite), M2 (Node 18 multi-stage), M3 (Python 3.11 multi-stage non-root) → send to team | All 3 Dockerfiles ready |
| **Week 1** | `.env.example` for all 3 services → `README.md` with setup steps: clone → cp .env → docker compose up → seed | Any member sets up in under 10 min |

✅ **Week 1 Checkpoint**: `docker compose up` starts all 5 services. README documented. Dockerfiles sent to team.

---

### Phase 1 — CI Pipelines (Week 2–3)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 2** | `.github/workflows/backend-ci.yml` — `setup-node → npm ci → lint → test → docker build` | Backend CI green on every push |
| **Week 2** | `.github/workflows/ml-service-ci.yml` — `setup-python → pip install → pytest → docker build` | ML service CI green |
| **Week 3** | `.github/workflows/frontend-ci.yml` — `setup-node → npm ci → lint → test → build` | Frontend CI green |
| **Week 3** | Postgres health check in docker-compose; `HEALTHCHECK` in all 3 Dockerfiles | Docker reports container health |

✅ **Week 3 Checkpoint**: All 3 CI pipelines green. Health checks configured.

---

### Phase 2 — Staging & Production (Week 4–5)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 4** | Terraform staging: ECS cluster, RDS PostgreSQL (t3.micro), ElastiCache Redis (t3.micro), VPC, subnets, security groups | Staging AWS resources provisioned |
| **Week 4** | ECS task definitions for backend + ml-service → `desiredCount=1` → staging services running | Backend and ML live on staging |
| **Week 4** | Store secrets in AWS Secrets Manager: `DATABASE_URL, REDIS_URL, JWT_SECRET, AI_SERVICE_URL` | Staging secrets secured |
| **Week 5** | Production Terraform: RDS (t3.medium, multi_az=true), ElastiCache, ALB, ACM SSL certificate | Production infra provisioned; HTTPS live |
| **Week 5** | Route 53: `api.hospital-system.com → ALB`; `app.hospital-system.com → Vercel` | Custom domains routing |

✅ **Week 5 Checkpoint**: Staging live. Production infra provisioned. HTTPS enforced.

---

### Phase 3 — Security & Monitoring (Week 6–8)

| 📅 Week | Task | Deliverable |
|---|---|---|
| **Week 6** | OWASP audit: SQL injection (Prisma parameterized), XSS (Helmet CSP), broken auth (JWT expiry) | Security audit passed |
| **Week 6** | RDS automated backups: `BackupRetentionPeriod=7`, `DeletionProtection=true` | 7-day backup retention active |
| **Week 6** | k6 load test: ramp 0 → 500 VUs over 5min → P95 < 500ms | Load test passes |
| **Week 7** | Prometheus scrape configs for backend, ML service, Postgres Exporter, Redis Exporter | Prometheus scraping all targets |
| **Week 7** | Grafana dashboards: API latency + error rate; DB connections; AI inference latency; blood/organ event rate | 4 dashboards showing data |
| **Week 8** | Production go-live: merge → CI → ECS deploy → `prisma migrate deploy` → seed → Vercel deploy | All 3 services live on production |
| **Week 8** | Monitor Grafana 48h after go-live; fix any P0/P1 issues | Zero P0 incidents in first 48h |

✅ **Week 8 Checkpoint**: Production live. Monitoring active. Zero P0 incidents in first 48h.

---

## 12. API Reference

### Backend REST (Node.js — port 4000)

```
AUTH
POST   /auth/register              Body: { name, email, password, role, hospital_id, government_id }
POST   /auth/login                 Body: { email, password } → { token, user }

HOSPITALS
GET    /hospitals                  → list all hospitals
GET    /hospitals/:id/stats        → { blood_summary, organ_summary }

BLOOD — DONATION SIDE
POST   /blood/donors               (admin) → register blood donor
PATCH  /blood/donors/:id/lab       (admin) → update lab_test_status → cleared/rejected → updates inventory

BLOOD — REQUEST SIDE
GET    /blood/inventory/:hospitalId         → 8 blood types + shortage flags
POST   /blood/inventory/update             (admin) → manual restock
POST   /blood/requests                     (doctor/nurse) → submit blood request
GET    /blood/requests/pending/:hospitalId → active requests sorted by AI priority
PATCH  /blood/requests/:id                 (admin) → approve/fulfill/reject

ORGANS — DONATION SIDE
POST   /organs/donors              (admin) → register organ donor with legal checks
GET    /organs/donors              → active donor registry

ORGANS — REQUEST SIDE
POST   /organs/requests            (doctor) → submit organ request with clinical notes
GET    /organs/requests/pending/:hospitalId → waiting list sorted by AI priority
GET    /organs/requests/match/:requestId    → AI-ranked donor list (local + cross-hospital, cached 30min)
PATCH  /organs/requests/:id/doctor-approve (doctor) → medical approval step 1 (consent + surgical alert)
PATCH  /organs/requests/:id/confirm        (admin)  → legal confirmation step 2 + transplant scheduling (OT booking)
PATCH  /organs/requests/:id/transplant-complete (doctor) → post-surgery update + triggers AI post-op monitoring

CROSS-HOSPITAL
GET    /blood/cross-hospital/:bloodType    → query network hospitals for available stock (ranked by proximity + availability)
GET    /organs/cross-hospital/match/:requestId → organ match extended to network hospitals

AI PROXY
POST   /ai/blood/forecast          → proxy to Python → shortage prediction
POST   /ai/blood/check-stock       → proxy to Python → local stock check + cross-hospital fallback
POST   /ai/organ/match             → proxy to Python → ranked compatibility list (local + cross-hospital)
POST   /ai/priority                → proxy to Python → P1–P4 score
POST   /ai/postop/monitor          → proxy to Python → rejection risk score + anomaly alert
POST   /ai/reports/summary         → proxy to Python → monthly stats report

ADMIN
GET    /admin/reports/summary      (admin) → AI-generated monthly blood use + transplant stats + alerts
GET    /admin/users                (admin) → list all users; filter by role / hospital
POST   /admin/users                (admin) → create Doctor / Patient / Donor account
PATCH  /admin/users/:id            (admin) → edit user role / access

AUDIT
GET    /audit/:hospitalId          (admin) → recent audit log
GET    /api/docs                            → Swagger UI
```

### Python AI Microservice (FastAPI — port 8000)

```
GET    /health
  Returns: { status, models_loaded: [...], uptime_seconds }

POST   /ai/blood/forecast
  Body:    { hospital_id, blood_type, historical_usage: [{date, units}] }
  Returns: { blood_type, predicted_units_7d, shortage_risk (low/medium/high/critical),
             confidence, upper_bound, lower_bound }

POST   /ai/organ/match
  Body:    { organ_type, donor: { blood_type, age, hla_markers, hospital_id, lat, lng },
             candidates: [{ patient_id, blood_type, age, hla_markers,
                            urgency_score, wait_days, hospital_id }],
             search_cross_hospital: bool }
  Returns: { ranked: [{ patient_id, compatibility_score (0–100),
                         factors: [{ name, value, impact }],
                         is_cross_hospital: bool, hospital_name }] }

POST   /ai/priority
  Body:    { request_type, urgency, wait_days, compatibility_score }
  Returns: { priority_score, urgency_level (P1/P2/P3/P4),
             explanation: [{ factor, contribution }] }

POST   /ai/postop/monitor
  Body:    { patient_id, organ_type, days_post_op, vitals: { temp, creatinine, wbc, ... } }
  Returns: { rejection_risk (0–100), alert: bool, anomaly_details: [...] }

POST   /ai/reports/summary
  Body:    { hospital_id, month, year }
  Returns: { blood_usage: [{type, units_used, units_donated}],
             transplants: { total, successful },
             critical_alerts: [{ date, type, message }] }

---

## 13. WebSocket Events

```
EVENT               PAYLOAD                                              WHO RECEIVES
blood:update     →  { hospital_id, blood_type,                          All doctors + admin
                      units_available, shortage_alert: bool }            in that hospital

organ:matched    →  { request_id, donor_id, patient_id,                 All staff in hospital
                      organ_type, compatibility_score,                   + that patient
                      is_cross_hospital: bool }

alert:critical   →  { type, message, hospital_id,                       Admin only
                      blood_type, predicted_runout_days }

postop:alert     →  { patient_id, organ_type, rejection_risk,           Doctor + Admin
                      anomaly_details }                                  in that hospital
```

---

## 14. Integration Points Table

| Integration | Producer | Consumer | Week | Contract |
|---|---|---|---|---|
| AuthContext (user + role + token) | M2 (issues JWT) | M1 (Zustand store) | Week 1 | `{ user, role, token, login(), logout() }` |
| AI Pydantic schemas | M3 (defines) | M2 (aiClient.ts stubs) | Week 1 | Frozen — no changes without team agreement |
| `GET /hospitals/:id/stats` | M2 | M1 Dashboard | Week 2 | `{ blood_summary, organ_summary }` |
| Blood inventory API | M2 | M1 BloodTypeCard | Week 3 | `[{ blood_type, units_available, min_threshold, shortage_alert }]` |
| `blood:update` WebSocket | M2 Socket.io | M1 useSocket | Week 4 | `{ blood_type, units_available, shortage_alert }` |
| `organ:matched` WebSocket | M2 Socket.io | M1 useSocket | Week 4 | `{ request_id, donor_id, patient_id, compatibility_score, is_cross_hospital }` |
| `postop:alert` WebSocket | M2 Socket.io | M1 PostOpMonitor widget | Week 5 | `{ patient_id, organ_type, rejection_risk, anomaly_details }` |
| AI prediction response shapes | M2 proxy | M1 AI widgets | Week 5 | Same shape as Python AI response |
| Cross-hospital blood/organ search API | M2 | M1 CrossHospitalBanner + CompatibilityRankList | Week 5 | `{ results: [...], is_cross_hospital: bool, hospital_name }` |
| AI summary report | M3 (generates) | M2 proxy → M1 reports page | Week 5 | `{ blood_usage, transplants, critical_alerts }` |
| Redis infra | M4 provisions | M2 cache middleware | Week 2 | Key naming: `resource:type:hospital_id` |
| Dockerfile templates | M4 provides | M1, M2, M3 | Week 1 | Multi-stage, non-root user |
| Production service URLs | M4 deploys | M1, M2 `.env` | Week 8 | `AI_SERVICE_URL`, `VITE_API_BASE_URL` |

---

## 15. Week-by-Week Build Order

```
Week 1  →  M4: Docker Compose + Dockerfiles + README
            M2: Express + Prisma schema (corrected) + JWT auth + AI stubs
            M3: FastAPI + all 3 Pydantic schemas + synthetic data → share schemas with M2
            M1: Vite + Tailwind + Zustand + component library + PrivateRoute

Week 2  →  M1: Login + Register + Dashboard
            M2: Hospital stats API + Redis cache + DB seed
            M3: Blood demand model training (Prophet)
            M4: Backend + ML service CI pipelines

Week 3  →  M1: Blood page + Organ page + Requests page + Donor registration forms
            M2: Blood donation API + lab result API + Blood CRUD + Organ CRUD
            M3: Blood forecast endpoint live + organ feature engineering
            M4: Frontend CI + staging Terraform + Postgres health check

Week 4  →  M1: useSocket hook + all 3 WebSocket events wired
            M2: Socket.io server + two-step organ approval endpoints + WS events
            M3: Organ Random Forest trained + SHAP explainability
            M4: Staging deploy (all 3 services live on staging)

Week 5  →  M1: BloodForecastChart + CompatibilityRankList + FactorCard + PriorityQueue + two-step approval UI
            M2: aiClient.ts wired to Python + AI proxy routes + priority auto-scoring background
            M3: Organ match endpoint live + priority engine + models preloaded at startup
            M4: Production infra (ECS/RDS/ElastiCache/SSL)

Week 6  →  M1: Vitest + Playwright tests
            M2: Jest integration tests + rate limiting + Swagger docs
            M3: Pytest all 3 models + edge cases + eval report
            M4: OWASP audit + RDS backups + k6 load test

Week 7  →  M1: Mobile fixes + skeleton loaders + error boundaries
            M2: AES encryption on patient diagnosis + Swagger complete
            M3: /ai/health endpoint + P95 < 300ms confirmed + all pytest passing
            M4: Prometheus + Grafana dashboards + Loki logs

Week 8  →  M1: Lazy loading + prod build + smoke test on production URL
            M2: Production deploy + prisma migrate deploy + prod smoke test
            M3: Production Docker image + model pre-warm + send AI_SERVICE_URL to M2
            M4: Go-live execution + Grafana alerting + 48h monitoring watch
```

### Master Timeline

```
Week 1   ████░░░░░░░░░░░░   Docker, scaffolds, corrected schema, schemas shared
Week 2   ░░████░░░░░░░░░░   Auth + Dashboard + blood forecast training
Week 3   ░░░░████░░░░░░░░   Blood + Organ pages + donor registration + all CRUD APIs
Week 4   ░░░░░░████░░░░░░   Real-time WebSocket + organ model + two-step approval + staging
Week 5   ░░░░░░░░████░░░░   AI widgets + all 3 AI endpoints live + prod infra
Week 6   ░░░░░░░░░░████░░   Testing + security + OWASP + load test
Week 7   ░░░░░░░░░░░░████   Polish + monitoring + final testing
Week 8   ░░░░░░░░░░░░░░██   Production go-live + 48h monitoring
```

### Key Milestones

| Milestone | Target | Description |
|---|---|---|
| M1: Local Dev Running | End Week 1 | All services via `docker compose up`; corrected schemas shared |
| M2: Auth + Dashboard Live | End Week 2 | Login works; hospital stats on dashboard |
| M3: Blood & Organ Pages + APIs | End Week 3 | Donor registration + all CRUD + blood forecast live |
| M4: Real-time + Organ AI | End Week 4 | WS events live; organ match + two-step approval; staging deployed |
| M5: AI Fully Integrated | End Week 5 | All 3 AI predictions rendered; prod infra ready |
| M6: Tests + Security | End Week 6 | 80%+ coverage; audit passed; load test green |
| M7: Monitoring Ready | End Week 7 | Grafana live on staging; all tests passing |
| M8: Production Launch | End Week 8 | Live system; zero P0 alerts in first 48h |

---

## 16. Project Survival Rules

| Rule | Detail |
|---|---|
| **M4 sets up Docker first** | `docker-compose.yml` + seed scripts ready by end of Week 1. No one can develop without the DB. |
| **M3 shares schemas with M2 on Day 1** | All 5 Pydantic schemas frozen and sent to M2 in Week 1. M2 builds stubs from these. No guessing. |
| **Corrected DB schema is the source of truth** | New tables (blood_donations) and new fields (donor_type, consent_signed, doctor_approved, admin_confirmed, ot_booking_details) are non-negotiable. Do not use the old schema. |
| **Doctor does health screening, not Admin** | Blood donation eligibility (BP, Hb, disease check) is a medical decision — done by Doctor, not Admin. Admin registers and stores the unit after lab clearance. |
| **Three-step organ approval is mandatory** | Doctor confirms match medically + obtains patient consent (Step 1). Admin schedules transplant legally + books OT (Step 2). Doctor performs surgery and marks complete — triggering AI post-op (Step 3). |
| **Blood donor registration is its own flow** | Blood inventory is NOT manually updated by admin anymore. Inventory increases only when `lab_test_status = cleared` AND admin approves storage. Donor card with next eligible date is issued. |
| **AI cross-hospital search is automatic** | When local blood stock is unavailable, AI triggers cross-hospital search automatically. When no local organ donor matches, AI extends search to network hospitals. This is not optional — it is part of the core allocation flow. |
| **Post-op AI monitoring is mandatory** | After transplant-complete is marked, AI post-op monitor fires and computes rejection risk. If anomaly detected, `postop:alert` WebSocket event fires to doctor and admin. |
| **Cache all AI calls** | Blood forecast TTL: 6h. Organ match TTL: 30min. Priority: per-request only. Post-op monitor: per-request only. Never call the model on every page load. |
| **Graceful AI fallback is mandatory** | If Python AI is down, backend serves cached result or safe default. Never propagate a 500 to the user. |
| **Patient cannot submit any request** | Only doctors/nurses submit requests. Patients are read-only. This is legally and medically correct. |
| **No direct DB access from frontend** | All data flows through Node.js. Never expose Postgres or Redis to the browser. |
| **Weekly Friday sync (30 min)** | Blockers, integration status, what's merged, what's next. |

### Priority Cut List

```
MUST SHIP (Hackathon core):
  ✅ Login + role-based access (doctor / admin / nurse / donor / patient)
  ✅ Blood donor registration flow (admin registers, doctor health screens, lab clears, admin stores, inventory updates)
  ✅ Blood request flow (doctor requests → AI checks local stock → admin approves + cross-match confirmed → AI deducts → doctor transfuses)
  ✅ Donor card issued with next eligible date after cleared donation
  ✅ Organ donor registration (living + deceased with consent, doctor medical evaluation)
  ✅ Organ request + three-step flow (AI match → doctor confirms to patient → admin schedules transplant)
  ✅ AI cross-hospital search for blood (when local stock unavailable) and organs (when no local match)
  ✅ Real-time WebSocket events (blood:update, organ:matched, alert:critical, postop:alert)
  ✅ All 5 AI endpoints responding on production
  ✅ Working production URL (all 3 services deployed)

SHIP IF TIME:
  ⚡ Blood shortage forecast chart (7-day prediction graph with confidence bands)
  ⚡ Organ compatibility ranked list with SHAP factor cards + cross-hospital badge
  ⚡ Admin AI priority queue view (P1–P4 ranked requests)
  ⚡ AI post-op monitoring widget (rejection risk score + anomaly alerts on transplanted patient record)
  ⚡ Admin AI summary report page (monthly blood use, transplant stats, critical alerts log)
  ⚡ Organ countdown timer for deceased donor viability window
  ⚡ Audit log page for admin

STRETCH / DROP IF NEEDED:
  🔵 Donor notification system (email/SMS)
  🔵 PDF allocation summary export
  🔵 Blood donation camp management
```

---

## 17. Hackathon Demo Script

```
TIME    SPEAKER   ACTION
────────────────────────────────────────────────────────────────────────
0:00    M4        "Every year hospitals fail to save lives — not because
                   of missing doctors — but because of missing resources
                   at the right time. We fix that."

0:20    M4        Competitor slide: Excel sheets, phone calls, manual
                   organ matching — slow, error-prone, no prediction,
                   no real-time visibility, no cross-hospital coordination

0:40    M1        Open live app → log in as Admin at City Hospital
                  Dashboard: 2 critical blood shortages, 1 organ match pending

1:00    M1        Click "Register Blood Donor" — fill form for walk-in donor
                  blood type O−, government ID verified
                  → Doctor screens donor: BP ✅, Hb ✅, eligible ✅
                  → Lab clears ABO/Rh typing + HIV/Hep screens
                  → Admin stores unit → quarantine lifted
                  "1 unit of O− added to blood bank. Donor card issued — next eligible in 90 days."

1:20    M1        Blood page → O− card shows 3 units, HIGH shortage risk
                  Click forecast chart → "AI predicts O− runs out in 4 days"

1:35    M3        "Our Prophet time-series model trains on 6 months of usage.
                   It predicts demand 7 days ahead — with confidence intervals
                   — giving admins time to act before crisis hits."

1:50    M1        Switch to Doctor login → Blood Request form
                  Patient: #203, Blood type: O−, Urgency: Critical, Reason: Surgery
                  Submit → "AI scores this P1 instantly in background"
                  → "AI checks local blood bank — stock available ✅"

2:05    M1        Switch back to Admin → Priority queue shows P1 at top
                  Approve (cross-match confirmed, unit issued) → inventory deducts
                  → Doctor transfuses bedside → AI deducts stock
                  WebSocket fires → Doctor sees "Approved" without refresh
                  "If local stock had been zero, AI would have searched partner hospitals automatically."

2:20    M2        "Every inventory change is a WebSocket event. Every donation
                   is traceable from donor to patient. AI cross-hospital search
                   activates automatically — no phone calls needed."

2:35    M1        Click Organs tab → open pending kidney request
                  Click "Find Best Match" → ranked list appears in < 200ms
                  → Top result has cross-hospital badge: "Donor at General Hospital"

2:50    M3        "Our Random Forest model scores all donors on blood type, HLA,
                   age, urgency, wait time, and geography. Cross-hospital donors
                   are searched automatically when no local match is found.
                   SHAP tells us exactly why each candidate was ranked."

3:00    M1        Click top match — SHAP factor card: "Blood type +35, HLA +20,
                   Urgency +20, Wait +10, Geography +5 = 90/100"

3:10    M1        Doctor clicks "Confirm Match to Patient" → consent obtained, surgical team alerted ✅
                  Admin clicks "Schedule Transplant" → OT booked, logistics arranged ✅
                  organ:matched fires → Patient sees "A kidney match has been found"

3:20    M1        Post-surgery: Doctor marks transplant complete →
                  AI post-op monitor shows rejection risk: 8% (low) ✅
                  "If risk spikes — postop:alert fires instantly to doctor and admin."

3:30    M4        "Blood. Organs. One system. Real-time. AI-assisted.
                   Cross-hospital. Post-op monitored. Legally correct. Built in 8 weeks.
                   Live at [production URL]. Thank you."
────────────────────────────────────────────────────────────────────────
```

---

*📋 Smart Hospital Resource Allocation System — Hackathon Roadmap v3.0*
*4-Member Team | 8 Weeks | Theme: Smart Resource Allocation — Data-Driven Volunteer Coordination for Social Impact*
*"The right resource. The right patient. The right time."*
*Updated: Reflects new AI-Powered Blood & Organ Management Workflow (4 roles · AI matching · Blood alerts · Cross-hospital search · Post-op monitoring)*
