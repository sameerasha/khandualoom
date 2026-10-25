#!/usr/bin/env bash
# ===================================================================
# Khandua Looms — Dynamic Docker Compose Launcher (dev / prod / stop)
# ===================================================================

ACTION="${1:-dev}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

if [ "$ACTION" = "stop" ]; then
  echo "[Khandua Looms] Stopping all Docker Compose containers..."
  docker compose stop
  echo "[Khandua Looms] All containers stopped."
  exit 0
fi

if [ "$ACTION" = "status" ]; then
  docker compose ps
  exit 0
fi

TARGET_ENV="dev"
if [ "$ACTION" = "prod" ]; then
  TARGET_ENV="prod"
fi

BACKEND_ENV=".env.$TARGET_ENV"
FRONTEND_ENV="../frontend/.env.$TARGET_ENV"

echo "[Khandua Looms] Launching Docker Compose in [$TARGET_ENV] mode..."
export ENV_FILE="$BACKEND_ENV"
export FRONTEND_ENV_FILE="$FRONTEND_ENV"

docker compose --env-file "$BACKEND_ENV" up -d
docker compose ps
