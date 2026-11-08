# Ape Para

A full-stack civic reporting platform for Sri Lanka where citizens can report local infrastructure issues with photos, descriptions, and map coordinates.

## Project Structure

```text
ape_para/
├── backend/
│   ├── sql/
│   │   └── schema.sql
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── reportRoutes.js
│   │   ├── services/
│   │   │   └── routingService.js
│   │   ├── app.js
│   │   ├── config.js
│   │   ├── db.js
│   │   └── server.js
│   ├── uploads/
│   │   └── .gitkeep
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── IssueForm.jsx
    │   │   └── MapPickerStub.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── DashboardPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

## Database Schema (PostgreSQL + PostGIS)

`/backend/sql/schema.sql` includes:

- `users` with role (`citizen` | `admin`) and optional `department_id`
- `departments` with type (`municipal` | `ceb` | `water_board`) and `region_polygon GEOMETRY(POLYGON, 4326)`
- `reports` with status (`submitted` | `in_review` | `in_progress` | `resolved`) and `location GEOGRAPHY(POINT, 4326)`
- GIST indexes for spatial performance and trigger for `updated_at`

## Backend API (Node.js + Express)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

JWT-based auth with RBAC middleware (`authenticate`, `authorize`) is used for protected routes.

### Reports
- `POST /api/reports` (authenticated, multipart upload)
- `GET /api/reports/me` (citizen view)
- `GET /api/reports` (admin only)

Automated routing logic (`routingService.js`) assigns reports to departments using:
1. Spatial containment against `region_polygon`
2. Category-to-department type mapping fallback

## Frontend (React + Tailwind)

- Sri Lankan-themed warm UI
- Login/Register with JWT state persisted in localStorage
- Dashboard with map picker stub + submission status list
- Issue submission form with image upload, category, description, and coordinates

## Run Locally

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Apply schema:

```bash
psql "$DATABASE_URL" -f sql/schema.sql
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Optional env:

- `VITE_API_BASE_URL` (default: `http://localhost:5000/api`)
