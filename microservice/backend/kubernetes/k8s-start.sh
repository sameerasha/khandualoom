#!/usr/bin/env bash
# ===================================================================
# Khandua Looms — Dynamic Kubernetes Deployer (dev / prod / stop)
# Injects secrets directly from .env.dev or .env.prod
# ===================================================================

ACTION="${1:-dev}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1
NAMESPACE="khandualoom"

if [ "$ACTION" = "stop" ]; then
  echo "[Khandua Looms K8s] Stopping all Kubernetes containers in namespace [$NAMESPACE]..."
  kubectl scale deployment --all --replicas=0 -n "$NAMESPACE"
  echo "[Khandua Looms K8s] All Kubernetes containers stopped."
  exit 0
fi

if [ "$ACTION" = "status" ] || [ "$ACTION" = "ps" ]; then
  echo "[Khandua Looms K8s] Clean Container Status:"
  kubectl get pods -n "$NAMESPACE" -o custom-columns="CONTAINER:.spec.containers[0].name,STATUS:.status.phase,RESTARTS:.status.containerStatuses[0].restartCount,POD:.metadata.name" -o custom-columns="CONTAINER:.spec.containers[0].name,STATUS:.status.phase,RESTARTS:.status.containerStatuses[0].restartCount,POD:.metadata.name"
  echo ""
  echo "[Khandua Looms K8s] Services & Endpoints:"
  kubectl get svc -n "$NAMESPACE"
  exit 0
fi

TARGET_ENV="dev"
if [ "$ACTION" = "prod" ]; then
  TARGET_ENV="prod"
fi

ENV_FILE="../.env.$TARGET_ENV"

if [ ! -f "$ENV_FILE" ]; then
  echo "[ERROR] Environment file not found: $ENV_FILE"
  exit 1
fi

echo "[Khandua Looms K8s] Starting Kubernetes containers in [$TARGET_ENV] mode..."
echo "[1/4] Injecting cluster secrets dynamically from $ENV_FILE..."
kubectl create secret generic app-secrets \
  --namespace="$NAMESPACE" \
  --from-env-file="$ENV_FILE" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "[2/4] Applying Kubernetes infrastructure and microservice manifests for [$TARGET_ENV]..."
kubectl apply -k "overlays/$TARGET_ENV"

echo "[3/4] Ensuring all microservices are running (replicas=1)..."
kubectl scale deployment --all --replicas=1 -n "$NAMESPACE"

echo "[4/4] Verifying pod rollout..."
sleep 5
kubectl get pods -n "$NAMESPACE" -o custom-columns="CONTAINER:.spec.containers[0].name,STATUS:.status.phase,RESTARTS:.status.containerStatuses[0].restartCount,POD:.metadata.name"
