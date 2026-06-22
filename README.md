# MediTrack — Frontend

The client-side application for **MediTrack**, a patient medical record management system. Built with React 19, TypeScript, and Tailwind CSS v4, featuring JWT authentication, role-based routing, and data visualisation with Recharts.

**Live App:** https://meditrack-frontend-mocha.vercel.app

**Backend Repo:** https://github.com/Himeshika/meditrack_backend

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| HTTP Client | Axios |
| Routing | React Router DOM v7 |
| Charts | Recharts |
| Icons | Lucide React |

---

## Project Structure

```
meditrack_frontend/
├── src/
│   ├── main.tsx              # App entry point
│   ├── App.tsx               # Route definitions
│   ├── context/
│   │   └── AuthContext.tsx   # Auth state, token management, getMe
│   ├── components/
│   │   ├── ProtectedRoute.tsx # Route guard component
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Patients.tsx
│   │   ├── PatientDetail.tsx
│   │   └── NotFound.tsx
│   ├── api/
│   │   └── axios.ts          # Axios instance with base URL + auth interceptor
│   └── types/
│       └── index.ts          # Shared TypeScript interfaces
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env
```

---

## Prerequisites

- Node.js v18+
- npm
- The MediTrack backend running locally or deployed

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Himeshika/meditrack_frontend.git
cd meditrack_frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, point this to the deployed backend URL:

```env
VITE_API_URL=https://meditrack-backend-rho.vercel.app/api
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## Features

- **JWT Authentication** — Login form with token stored in `localStorage`. User profile is hydrated from the login response.
- **Protected Routes** — `ProtectedRoute` component redirects unauthenticated users to `/login`. Renders a loading state while auth resolves to prevent flash.
- **Role-Based Access** — UI elements and routes are conditionally rendered based on the user's role (e.g. admin-only actions).
- **Patient Records** — Full CRUD interface for managing patient records, including medical image uploads.
- **Dashboard Charts** — Summary statistics visualised with Recharts (e.g. patients per month, record counts).
- **Responsive UI** — Tailwind CSS v4 utility classes used throughout for a clean, responsive layout.

---

## Authentication Flow

1. User submits credentials on `/login`.
2. The API returns a JWT token and the user object.
3. Both are saved to `localStorage`; `AuthContext` state is updated.
4. On subsequent loads, the token and user are read from `localStorage` directly — no additional API call on mount.
5. Axios interceptor attaches the token to every outgoing request automatically.
6. On logout, `localStorage` is cleared and the user is redirected to `/login`.

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the MediTrack backend API |

All `VITE_` prefixed variables are statically replaced at build time by Vite and safe to use in client code. **Do not** put secrets here.

---

## Deployment

The frontend is deployed on **Vercel**. On every push to `main`, Vercel runs `npm run build` and serves the `dist/` output. Ensure the `VITE_API_URL` environment variable is set in your Vercel project settings to point to the production backend.
