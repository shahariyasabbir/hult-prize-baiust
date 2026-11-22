# Hult Prize @ BAIUST

A web application for the Hult Prize on-campus program at **Bangladesh Army International University of Science and Technology (BAIUST)**. The platform combines an informational landing page with a secure, self-service team registration portal for contestants.

## Overview

This project helps organizers present event information and collect team submissions in one place. Prospective participants can learn about the competition, create an account, submit their team and idea details, and return later to review or update their registration while it remains editable.

## Problem Statement

Campus Hult Prize activities often require both public-facing event communication and a structured way to manage team registrations. This project addresses that need by providing:

- **Event information:** A landing experience describing the on-campus round, motto/theme, alignment with the UN Sustainable Development Goals (SDGs), organizing panel, and competition details.
- **Online team registration:** An authenticated flow for contestants to submit team information and startup idea summaries.
- **Submission visibility:** A personal dashboard where contestants can view their registration status (`draft`, `submitted`, `under_review`, `accepted`, `rejected`).
- **Controlled editing:** Contestants can edit only while a submission is in an editable state; organizer-managed review/decision states are locked.
- **Secure per-user data access:** Registrations are stored in Supabase Postgres and protected with Row Level Security (RLS), ensuring each authenticated user can access only their own record under defined rules.

## Key Features

- **Landing page sections:** Hero, About/SDGs, panel, competition details, and registration entry point.
- **Authentication:** Email/password sign-up and sign-in via Supabase Auth, with session-aware routing.
- **Protected dashboard:** Authenticated area for creating, viewing, and updating a team registration.
- **Structured registration form:** Client-side validation for team details, additional members, and idea summaries.
- **Status tracking:** Visual status badges and read-only locking once a submission enters organizer review.
- **Configurable content:** Primary site copy and event data are centralized in [`src/data/content.js`](src/data/content.js).
- **Graceful asset handling:** Logo placeholders/fallback behavior for missing branding assets.

## Architecture

The application is a **React single-page application (SPA)** backed by **Supabase** (Auth + Postgres). There is no custom application server in this repository.

```text
Browser (React SPA)
  ├─ Routing (React Router): "/" landing, "/dashboard" protected
  ├─ Auth state (React Context) <──> Supabase Auth (email/password, session)
  ├─ UI: landing sections + auth/registration forms + status view
  └─ Data access layer (src/lib/registrations.js) <──> Supabase PostgREST
                                                └─ Postgres: public.registrations
                                                    └─ RLS policies (per-user, status-gated)

Organizer review/status updates are performed through the Supabase dashboard
(service role), which bypasses RLS.
```

### Application Flow

1. **Browse:** Visitors view event information and registration details on the landing page.
2. **Authenticate:** Users create an account or sign in through Supabase Auth.
3. **Submit:** A contestant submits a team registration (stored as `submitted` on first save).
4. **Manage:** Contestants can review and edit their submission from `/dashboard` while the status is `draft` or `submitted`.
5. **Review:** Organizers update status in Supabase; once moved to `under_review`, `accepted`, or `rejected`, contestant edits are restricted by both UI and database policies.

## Tech Stack

- **Frontend:** React 18, React Router 6
- **Build Tooling:** Vite 5
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Backend Services:** Supabase (`@supabase/supabase-js`) for authentication and database access
- **Database:** PostgreSQL (Supabase) with RLS policies and constraints

## Project Structure

```text
.
├─ public/                  # Static assets (favicon, logos)
├─ src/
│  ├─ components/           # Reusable UI and feature components
│  ├─ context/              # Authentication/session context
│  ├─ data/                 # Editable landing-page content/config
│  ├─ lib/                  # Supabase client and registration data helpers
│  ├─ pages/                # Route-level pages (Landing, Dashboard)
│  ├─ sections/             # Landing page sections
│  ├─ App.jsx               # Route configuration
│  ├─ main.jsx              # Application entry point
│  └─ index.css             # Global styles and theme tokens
├─ supabase/
│  └─ schema.sql            # Table, trigger, grants, and RLS policies
├─ index.html
├─ package.json
└─ vite.config.js
```

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended) and **npm**
- A **Supabase** project with:
  - Email/password authentication enabled
  - Access to the SQL Editor for schema/policy setup
  - Project URL and anon (publishable) key

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and configure the required values:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: deadline used by the registration countdown
# VITE_REGISTRATION_DEADLINE=2026-12-31T23:59:59+06:00
```

> The app requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` at startup.

### Database Setup (Supabase)

1. Open your Supabase project dashboard.
2. Navigate to **SQL Editor**.
3. Run the contents of [`supabase/schema.sql`](supabase/schema.sql).

This creates the `public.registrations` table, validation constraints, `updated_at` trigger, grants, and RLS policies used by the application.

### Run Locally

```bash
npm run dev
```

Then open the local URL shown by Vite in your browser.

## Available Scripts

- `npm run dev` — Start the Vite development server
- `npm run build` — Create a production build
- `npm run preview` — Preview the production build locally

## Data Model & Access Control (Summary)

- **One registration per user:** `registrations.user_id` is unique and linked to `auth.users`.
- **Contestant permissions:** Authenticated users may select/insert/update **only their own** registration (subject to RLS rules).
- **Status rules:**
  - Contestants can create/update only when status is `draft` or `submitted`.
  - Contestants cannot self-assign review/decision statuses (`under_review`, `accepted`, `rejected`).
  - Records become locked for contestant edits once moved out of editable states.
- **No contestant deletes:** Deletion is not permitted by policy; organizers manage review outcomes in Supabase.

## Content & Customization

- **Landing page content:** Update event copy, SDGs, panel members, and competition details in [`src/data/content.js`](src/data/content.js).
- **Branding/assets:** Place logo files in [`public/logos/`](public/logos/) as needed (see [`public/logos/README.txt`](public/logos/README.txt) for expected filenames and placeholder behavior).
- **Registration constraints:** UI validation and database constraints should be kept aligned (e.g., member limits, field lengths, status values).

## Notes

- Some content in the repository may be placeholder/TBD (e.g., panel details or announced dates) and should be finalized before production use.
- This project relies on Supabase-managed authentication and database security; ensure your Supabase project settings (auth, URL configuration, and policies) are correctly configured for your deployment environment.
Netlify-specific notes
Build: npm run build
Publish directory: dist
SPA rewrite required: add a redirect so all routes serve index.html (needed for /dashboard refresh/direct access), e.g. a _redirects rule /* /index.html 200 or equivalent in netlify.toml.