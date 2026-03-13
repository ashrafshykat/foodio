# Foodio - Restaurant Ordering System

**Live Deployment**: [To be deployed]

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, Zustand, Axios, Lucide React
- **Backend**: NestJS, Prisma, PostgreSQL
- **Auth**: JWT (JSON Web Tokens), Role Based Access Control (RBAC)

## Project Architecture
- Monorepo style structure with decoupled `frontend` and `backend` services.
- Data persistence for Cart is managed via client-side `localStorage` synchronized with `zustand` state management.
- Complete implementation of the provided Figma UI requirements.

## Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or via Docker)

---

## Setup & Run Instructions

### 1. Database Setup
A `docker-compose.yml` is provided at the root directory to spin up a PostgreSQL instance instantly.
```bash
docker-compose up -d
```
*(If you are using a local PostgreSQL installation, bypass this step and verify your `DATABASE_URL` inside `backend/.env` is correct).*

### 2. Backend Setup
Navigate into the backend directory, install dependencies, initialize the database schema, seed initial data, and start the server.

```bash
cd backend
npm install
npx prisma db push
npm run prisma:seed
npm run start:dev
```

**Seeder Credentials:**
The `npm run prisma:seed` command populates the database with default categories, items, and these users:
- **Admin**: `admin@foodio.com` / Password: `admin123`
- **User**: `user@foodio.com` / Password: `user123`

### 3. Frontend Setup
Navigate into the frontend directory, install dependencies, and start the Next.js development server.

```bash
cd frontend
npm install
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## Features Implemented
- **Public Area**: Homepage with distinct menu items, categorization, search, availability filtering. Next.js server-side loading logic simulated via fetching.
- **Cart System**: Zustand global store with `persist` middleware ensures cart items persist across page refreshes.
- **Authentication**: JWT based Local strategy via Passport.js.
- **Checkout Flow**: Consolidated cart items are transactionally validated against the backend database before an order is placed.
- **Role-Based Access**: Specialized `@Roles()` decorator enforces access to sensitive admin operations.
- **Admin Dashboard**: Visual overview of platform performance alongside a real-time order status manipulation panel.
