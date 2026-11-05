#!/usr/bin/env bash
# ===================================================================
# Khandua Looms – Kubernetes Dynamic Deployment Script
# Supports: dev, staging, production, stop, status
# ===================================================================

set -e

ACTION="${1:-dev}"
TARGET_ENV="${ACTION}"
if [ "$TARGET_ENV" = "prod" ]; then
  TARGET_ENV="production"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

NAMESPACE="khandualoom"

if [ "$TARGET_ENV" = "stop" ]; then
  echo "Stopping all Kubernetes deployments in namespace [$NAMESPACE]..."
  kubectl scale deployment --all --replicas=0 -n "$NAMESPACE"
  exit 0
fi

if [ "$TARGET_ENV" = "status" ] || [ "$TARGET_ENV" = "ps" ]; then
  echo "Clean Container Status:"
  kubectl get pods -n "$NAMESPACE"
  echo ""
  echo "Services:"
  kubectl get svc -n "$NAMESPACE"
  echo ""
  echo "Ingress:"
  kubectl get ingress -n "$NAMESPACE"
  exit 0
fi

ENV_LOOKUP="$TARGET_ENV"
if [ "$TARGET_ENV" = "production" ]; then
  ENV_LOOKUP="prod"
fi
BACKEND_ENV_FILE="$SCRIPT_DIR/../../.env.$ENV_LOOKUP"

echo "Deploying Kubernetes cluster in [$TARGET_ENV] mode..."

# 1. Apply Namespace
kubectl apply -f base/namespace.yaml

# 2. Inject Secrets if env file exists
if [ -f "$BACKEND_ENV_FILE" ]; then
  echo "Injecting cluster secrets from $BACKEND_ENV_FILE..."
  kubectl create secret generic khandualoom-secrets \
    --namespace="$NAMESPACE" \
    --from-env-file="$BACKEND_ENV_FILE" \
    --dry-run=client -o yaml | kubectl apply -f -
fi

# 3. Apply Kustomize Overlay
echo "Applying Kustomize overlay for [$TARGET_ENV]..."
kubectl apply -k "overlays/$TARGET_ENV"

echo "Deployment complete for [$TARGET_ENV]!"
