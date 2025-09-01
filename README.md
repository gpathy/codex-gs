# Access Control App (FastAPI + React + Postgres)

A minimal full-stack starter implementing Users, Modules, and per-user module access. Includes JWT auth, admin CRUD, and Docker Compose for local dev and deployment.

## Stack
- Backend: FastAPI, SQLAlchemy, JWT, PostgreSQL
- Frontend: React (Vite), react-router
- Infra: Dockerfiles + docker-compose

## Quick Start (Docker)

1. Copy env file and tweak as needed:
   - `cp .env.example .env`
2. Start services:
   - `docker compose up --build`
3. Open the app:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:8000/docs`
4. Log in as admin (auto-seeded on first start):
   - email: value from `ADMIN_EMAIL` (default `admin@example.com`)
   - password: value from `ADMIN_PASSWORD` (default `admin123`)

## App Features
- Login (JWT)
- View my modules
- Admin-only:
  - Create/list/update/delete users
  - Create/list/delete modules
  - Assign/remove modules to users

## Project Structure
```
backend/
  app/
    main.py          # Routes and startup
    models.py        # SQLAlchemy ORM models
    database.py      # DB engine + session
    schemas.py       # Pydantic schemas
    auth.py          # Auth helpers and dependencies
    crud.py          # DB operations
  requirements.txt
  Dockerfile
frontend/
  src/               # React app
  Dockerfile
  index.html
  vite.config.js
  package.json
```

## Configuration
- `DATABASE_URL` (backend): defaults to the compose Postgres service.
- `CORS_ORIGINS` (backend): comma-separated origins; defaults to `*`.
- `SECRET_KEY` (backend): set in `.env` for JWT signing.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` (backend): auto-create admin on startup.
- `VITE_API_URL` (frontend): API base URL for the build; compose sets `http://localhost:8000`.

## Local (without Docker)
Backend:
- `python -m venv .venv && source .venv/bin/activate` (Windows: `.venv\\Scripts\\activate`)
- `pip install -r backend/requirements.txt`
- Set `DATABASE_URL` (e.g. `postgresql+psycopg2://postgres:postgres@localhost:5432/appdb`)
- Optionally set `ADMIN_EMAIL`/`ADMIN_PASSWORD` to seed admin
- Run: `uvicorn app.main:app --reload --port 8000 --app-dir backend`

Frontend:
- `cd frontend`
- `npm ci`
- `npm run dev` (served at `http://localhost:5173`)
- Create `.env` with `VITE_API_URL=http://localhost:8000`

## Notes
- Tables are created automatically on backend startup via `Base.metadata.create_all`.
- Change the default admin credentials in production.
- Use a stronger `SECRET_KEY` for production.

