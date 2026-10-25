#!/usr/bin/env bash
# Backend folder launcher for Khandua Looms Kubernetes microservices.
# Delegates to kubernetes/k8s-start.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_SCRIPT="$SCRIPT_DIR/kubernetes/k8s-start.sh"

if [ -f "$TARGET_SCRIPT" ]; then
  exec bash "$TARGET_SCRIPT" "$@"
else
  echo "[ERROR] Could not find Kubernetes launcher at: $TARGET_SCRIPT"
  exit 1
fi
