#!/usr/bin/env bash
# Root launcher for Khandua Looms Docker Compose services.
# Delegates to microservice/backend/docker-start.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_SCRIPT="$SCRIPT_DIR/microservice/backend/docker-start.sh"

if [ -f "$TARGET_SCRIPT" ]; then
  exec bash "$TARGET_SCRIPT" "$@"
else
  echo "[ERROR] Could not find Docker launcher at: $TARGET_SCRIPT"
  exit 1
fi
