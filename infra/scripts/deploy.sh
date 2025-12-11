#!/usr/bin/env bash
set -euo pipefail

# Usage: ./deploy.sh [compose_dir]
# Default compose_dir is the directory containing this script's parent (infra/)

COMPOSE_DIR="${1:-$(cd "$(dirname "$0")/.." && pwd)}"
REGION="${AWS_DEFAULT_REGION:-eu-north-1}"
ACCOUNT_ID="${AWS_ACCOUNT_ID:-828414850187}"
REPO_URI="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

cd "$COMPOSE_DIR"

echo "Logging in to ECR..."
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$REPO_URI"

echo "Pulling latest images..."
docker compose pull

echo "Restarting services..."
docker compose up -d --force-recreate --remove-orphans

echo "Done."
