<#
.SYNOPSIS
  Dynamically deploys or stops Khandua Looms Kubernetes microservices.
  Automatically reads secrets from .env.dev or .env.prod and injects them into Kubernetes Secrets.
.EXAMPLE
  .\k8s-start.ps1 -env dev
  .\k8s-start.ps1 -env prod
  .\k8s-start.ps1 stop
  .\k8s-start.ps1 status
#>
param(
  [Parameter(Position=0)]
  [ValidateSet('dev', 'prod', 'stop', 'status', 'ps', 'restart')]
  [string]$Action = 'dev',

  [Alias('env')]
  [string]$Environment = ''
)

$targetEnv = if ($Environment) { $Environment } else { $Action }
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

$namespace = "khandualoom"

if ($targetEnv -eq 'stop') {
  Write-Host "[Khandua Looms K8s] Stopping all Kubernetes containers in namespace [$namespace]..." -ForegroundColor Yellow
  kubectl scale deployment --all --replicas=0 -n $namespace
  Start-Sleep -Seconds 3
  Write-Host "[Khandua Looms K8s] All Kubernetes containers stopped." -ForegroundColor Green
  exit 0
}

if ($targetEnv -in @('status', 'ps')) {
  Write-Host "[Khandua Looms K8s] Clean Container Status:" -ForegroundColor Cyan
  kubectl get pods -n $namespace -o custom-columns="CONTAINER:.spec.containers[0].name,STATUS:.status.phase,RESTARTS:.status.containerStatuses[0].restartCount,POD:.metadata.name" -o custom-columns="CONTAINER:.spec.containers[0].name,STATUS:.status.phase,RESTARTS:.status.containerStatuses[0].restartCount,POD:.metadata.name"
  Write-Host ""
  Write-Host "[Khandua Looms K8s] Services & Endpoints:" -ForegroundColor Cyan
  kubectl get svc -n $namespace
  exit 0
}

if ($targetEnv -notin @('dev', 'prod')) {
  $targetEnv = 'dev'
}

$backendEnvFile = Join-Path $scriptDir "..\.env.$targetEnv"

if (-not (Test-Path $backendEnvFile)) {
  Write-Host "[ERROR] Environment file not found: $backendEnvFile" -ForegroundColor Red
  exit 1
}

Write-Host "[Khandua Looms K8s] ===============================================" -ForegroundColor Cyan
Write-Host "[Khandua Looms K8s] Starting Kubernetes containers in [$targetEnv] mode" -ForegroundColor Cyan
Write-Host "[Khandua Looms K8s] Clean Container Names (no prefix)" -ForegroundColor Cyan
Write-Host "[Khandua Looms K8s] Ingesting Secrets dynamically from: $backendEnvFile" -ForegroundColor Gray
Write-Host "[Khandua Looms K8s] ===============================================" -ForegroundColor Cyan

# 1. Ensure Namespace exists
kubectl apply -f base/01-namespace.yml | Out-Null

# 2. Dynamically create/replace Secret from the local .env file (no plaintext secrets stored in git manifests!)
Write-Host "[1/4] Injecting cluster secrets dynamically from $backendEnvFile..." -ForegroundColor Yellow
kubectl create secret generic app-secrets `
  --namespace=$namespace `
  --from-env-file=$backendEnvFile `
  --dry-run=client -o yaml | kubectl apply -f -

# 3. Apply environment overlay via Kustomize (base + overlays/$targetEnv)
Write-Host "[2/4] Applying Kubernetes manifests for environment [$targetEnv]..." -ForegroundColor Yellow
kubectl apply -k "overlays/$targetEnv"

# 4. Scale up deployments if they were scaled down
Write-Host "[3/4] Ensuring all microservices are running (replicas=1)..." -ForegroundColor Yellow
kubectl scale deployment --all --replicas=1 -n $namespace

# 5. Display status
Write-Host "[4/4] Verifying pod rollout..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
kubectl get pods -n $namespace -o custom-columns="CONTAINER:.spec.containers[0].name,STATUS:.status.phase,RESTARTS:.status.containerStatuses[0].restartCount,POD:.metadata.name"
Write-Host ""
Write-Host "[Khandua Looms K8s] Deployment complete!" -ForegroundColor Green
Write-Host "  Storefront NodePort: http://localhost:30080" -ForegroundColor White
Write-Host "  Storefront API:      http://localhost:30080/api/products" -ForegroundColor White
Write-Host "  Check live status:   .\k8s-start.ps1 status" -ForegroundColor Gray
Write-Host "  Stop containers:     .\k8s-start.ps1 stop" -ForegroundColor Gray

