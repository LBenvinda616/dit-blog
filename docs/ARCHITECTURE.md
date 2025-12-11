# dit-blog Architecture

This repo contains a monorepo-style layout with separate apps and infrastructure:

- backend/: Node.js Express API (Sequelize + Postgres) and scheduler
- frontend/: Vite + React SPA
- infra/: CI/CD definitions, Docker Compose, and operational scripts
- docs/: Documentation

## Runtime

- Postgres, backend, and frontend run under docker-compose.
- Backend exposes `/api/articles` to the frontend.
- Daily job posts articles using an AI provider.

## CI/CD

- CodeBuild builds/pushes images to ECR (see infra/buildspec.yml)
- A deploy job runs on EC2 via SSM, invoking infra/scripts/deploy.sh

## Local Dev

- `npm install` in backend/ and frontend/
- `npm run dev` per app, or `docker compose up` under infra/
