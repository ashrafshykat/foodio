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
## Project File Structure 
foodio/
├── .gitignore
├── backend/
│   ├── .gitignore
│   ├── .prettierrc
│   ├── eslint.config.mjs
│   ├── nest-cli.json
│   ├── package-lock.json
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── prisma.config.ts
│   ├── README.md
│   ├── src/
│   │   ├── app.controller.spec.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── local-auth.guard.ts
│   │   │   ├── local.strategy.ts
│   │   │   ├── roles.decorator.ts
│   │   │   └── roles.guard.ts
│   │   ├── categories/
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.module.ts
│   │   │   └── categories.service.ts
│   │   ├── main.ts
│   │   ├── menu-items/
│   │   │   ├── menu-items.controller.ts
│   │   │   ├── menu-items.module.ts
│   │   │   └── menu-items.service.ts
│   │   ├── orders/
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.module.ts
│   │   │   └── orders.service.ts
│   │   ├── prisma/
│   │   │   ├── prisma.module.ts
│   │   │   └── prisma.service.ts
│   │   └── users/
│   │       ├── users.module.ts
│   │       └── users.service.ts
│   ├── test/
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── tsconfig.build.json
│   └── tsconfig.json
├── docker-compose.yml
├── frontend/
│   ├── .gitignore
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── public/
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── README.md
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   │   ├── categories/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── menu-items/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── orders/
│   │   │   │       └── page.tsx
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── item/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── components/
│   │   │   ├── MenuItemCard.tsx
│   │   │   └── Navbar.tsx
│   │   ├── lib/
│   │   │   └── api.ts
│   │   └── store/
│   │       └── cartStore.ts
│   └── tsconfig.json
└── README.md
