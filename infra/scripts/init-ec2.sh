#!/usr/bin/env bash
set -euo pipefail

# Bootstrap an Ubuntu EC2 for dit-blog
# - Installs Docker & Compose plugin
# - Logs into ECR
# - Creates runtime directory and .env placeholder
# - Starts the stack from infra/docker-compose.yml

REGION="${AWS_DEFAULT_REGION:-eu-north-1}"
ACCOUNT_ID="${AWS_ACCOUNT_ID:-828414850187}"
REPO_URI="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"
APP_DIR="/home/ubuntu/dit-blog"

sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg awscli

# Docker Engine
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo usermod -aG docker ubuntu || true

# App directory
sudo mkdir -p "$APP_DIR/infra"
sudo chown -R ubuntu:ubuntu "$APP_DIR"

# ECR login
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$REPO_URI"

# Create .env placeholder if missing
if [ ! -f "$APP_DIR/.env" ]; then
  cat <<EOF > "$APP_DIR/.env"
# Runtime environment
DB_NAME=dit_blog
DB_USER=postgres
DB_PASS=postgres
HF_TOKEN=
RATE_LIMIT_MAX_REQUESTS=3
RATE_LIMIT_WINDOW_MS=300
VITE_API_BASE_URL=http://localhost:3000/api
EOF
fi

# Assume repo is already present under $APP_DIR
cd "$APP_DIR/infra"

docker compose up -d

echo "Bootstrap complete. You may need to log out/in for docker group to apply."