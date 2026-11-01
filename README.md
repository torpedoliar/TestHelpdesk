# iDesk Helpdesk

**English** · [Bahasa Indonesia](README.id.md)

iDesk is a helpdesk ticketing system with a NestJS backend and a React frontend. Agents work tickets on a kanban board with live updates over Socket.io, and customers can open and follow tickets from a client portal or through a Telegram bot. The project codename is "Antigravity". This repository is a development prototype; see [Project status](#project-status) before deploying it.

![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-realtime-010101?logo=socketdotio&logoColor=white)

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Docker](#docker)
- [Testing](#testing)
- [Project status](#project-status)
- [License](#license)

## Features

- Ticketing: create, assign, and update tickets, with a drag-and-drop kanban board and a list view. Status and messages update live in every open browser through Socket.io.
- SLA: SLA targets are configured per priority, and an hourly job checks tickets against them.
- Saved replies for answers that agents send often.
- Customer satisfaction surveys sent after a ticket is resolved and answered on a public `/feedback/:token` page.
- Knowledge base with articles for self-service.
- Reports with charts and Excel export.
- File attachments, stored in the backend `uploads/` folder.
- Telegram integration through an adapter, so other chat providers can be added later without touching the ticket logic. Incoming messages arrive on a webhook controller.
- Users and departments, with role-based access for `ADMIN`, `AGENT`, and `USER` (customer). Customers use a separate client area (`/client/my-tickets`).
- JWT authentication, bcrypt password hashing, and Helmet security headers.

## Tech stack

| Layer | Technology |
|---|---|
| Backend | NestJS 10, TypeORM, PostgreSQL, Socket.io, Passport JWT, nodemailer, handlebars, exceljs |
| Frontend | React 18, Vite 5, Tailwind CSS, TanStack Query, Zustand, React Router, dnd-kit, recharts, socket.io-client |
| Tooling | npm workspaces-style root scripts with `concurrently`, Docker Compose |

## Repository layout

```
apps/
  backend/                NestJS API (port 5050)
    src/modules/
      auth/               login, JWT strategy (clean-architecture layers)
      ticketing/          tickets, messages, SLA, saved replies, surveys, Telegram adapter
      knowledge-base/     articles
      reports/            dashboards and exports
      uploads/            attachment upload endpoint
      users/              users, departments, roles
    src/seed.ts           creates the first admin account
  frontend/               React + Vite app (port 4050)
docker-compose.yml        postgres + backend + frontend
docker-compose.db.yml     PostgreSQL only, for local development
startup.bat               Windows one-click development start
```

## Getting started

Requirements: Node.js 18 or newer and Docker (for PostgreSQL).

### 1. Start PostgreSQL

```bash
cp .env.example .env      # set DB_* values and a strong JWT_SECRET
docker compose -f docker-compose.db.yml --env-file .env up -d
```

On Windows, `deploy_database_docker.bat` does the same.

### 2. Install dependencies

```bash
npm install
npm run install:all
```

### 3. Run the backend and frontend

```bash
npm start
```

This runs `nest start --watch` for the backend and `vite` for the frontend in one terminal. On Windows you can double-click `startup.bat` instead; it opens each service in its own window and then opens `http://localhost:4050`.

TypeORM runs with `synchronize: true`, so tables are created on first start.

### 4. Create the first admin

```bash
cd apps/backend
npx ts-node src/seed.ts
```

The seed creates `admin@antigravity.com` with the password `admin123` if that account does not exist yet. Change the password after the first login.

| Service | URL |
|---|---|
| Frontend | http://localhost:4050 |
| Backend API and Socket.io | http://localhost:5050 |

## Configuration

The backend does not load a `.env` file on its own. It reads these variables from the process environment and falls back to the defaults shown:

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USERNAME` | `postgres` | Database user |
| `DB_PASSWORD` | `postgres` | Database password |
| `DB_DATABASE` | `idesk_db` | Database name |
| `JWT_SECRET` | none | Secret used to sign access tokens. Always set it |
| `TELEGRAM_BOT_TOKEN` | none | Telegram bot token for the chatbot channel |
| `FRONTEND_URL` | none | Passed in by `docker-compose.yml`; the current code does not read it yet |

The frontend reads `VITE_API_URL` (default `http://localhost:5050`). The Socket.io URL is currently fixed to `http://localhost:5050` in `apps/frontend/src/lib/socket.ts`.

## Docker

`docker-compose.yml` builds PostgreSQL, the backend, and the frontend (served by nginx on port 80):

```bash
docker compose --env-file .env up -d --build
```

Before you rely on it, note that the compose file publishes the backend on port 3000 while the application listens on 5050. Align the port mapping, CORS origin, and the frontend API and Socket.io URLs for your environment first.

## Testing

```bash
cd apps/backend
npm test           # Jest unit tests
npm run test:cov   # with coverage
```

[QA_CHECKLIST.md](QA_CHECKLIST.md) lists the manual test scenarios (login, CORS, uploads, realtime updates, session persistence), and [Walktrough.md](Walktrough.md) walks through the main flows.

## Project status

iDesk is a working prototype for development and evaluation. Open items before production use:

- Replace `synchronize: true` with TypeORM migrations.
- Move the hard-coded `localhost` origins (CORS, Socket.io) into configuration.
- Fix the Docker port mapping described above.
- Treat any credential that has ever been committed, including example files, as compromised and rotate it.
- `apps/backend/prisma/schema.prisma` is left over from an earlier design; the running code uses TypeORM entities.

## License

This repository does not include a license file. Contact the author before reusing the code.

Developed by Yohanes Octavian Rizky ([@torpedoliar](https://github.com/torpedoliar)).
