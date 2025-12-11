# Docker Deployment Guide

## Prerequisites
- Docker and Docker Compose installed
- HuggingFace API token

## Setup

1. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file**
   - Add your HuggingFace token to `HF_TOKEN`
   - Modify database credentials if needed
   - Optionally configure rate limiting:
     - `RATE_LIMIT_MAX_REQUESTS=3` (default: 3 requests)
     - `RATE_LIMIT_WINDOW_MS=300` (default: 300 seconds / 5 minutes)

3. **Build and start services**
   ```bash
   docker-compose up -d --build
   ```

4. **Verify services are running**
   ```bash
   docker-compose ps
   ```

## Access the application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000/api
- **Database**: localhost:5432

## Useful commands


### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (WARNING: deletes database data)
```bash
docker-compose down -v
```

### Restart a service
```bash
docker-compose restart backend
```

### Rebuild after code changes
```bash
docker-compose up -d --build
```

## Features

### Daily Article Generation
- Automatically generates an article every day at **8 AM**
- Topics are randomly selected from `backend/article_topics.json`
- Uses HuggingFace AI for content generation

### Rate Limiting
- Limits article generation to **3 requests per 5 minutes** by default
- Configurable via environment variables:
  - `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window
  - `RATE_LIMIT_WINDOW_MS`: Time window in milliseconds
- Per-IP address tracking
- Returns HTTP 429 with retry information

### Database
- PostgreSQL 16 with persistent volume
- Auto-initialization from SQL scripts in `db_scripts/`
- Health checks before backend startup

## Production deployment

For production, update:

1. **Frontend Dockerfile** - Change `VITE_API_BASE_URL` to your production backend URL
2. **Nginx config** - Add SSL/TLS configuration
3. **Database** - Use managed database service or secure credentials
4. **Environment variables** - Use secrets management (Docker secrets, AWS Secrets Manager, etc.)

## Troubleshooting

### Backend can't connect to database
- Ensure `DB_HOST=postgres` in `.env`
- Check database is healthy: `docker-compose ps`

### Frontend shows API errors
- Verify backend is running: `docker-compose logs backend`
- Check API URL in browser console

### Database initialization issues
- SQL scripts in `db_scripts/` run on first startup only
- To re-initialize: `docker-compose down -v && docker-compose up -d`
