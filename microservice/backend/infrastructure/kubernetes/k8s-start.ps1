<#
.SYNOPSIS
  Dynamically deploys or manages Khandua Looms Kubernetes microservices.
  Automatically reads secrets from .env.dev or .env.prod and applies Kustomize overlays.
.EXAMPLE
  .\k8s-start.ps1 -env dev
  .\k8s-start.ps1 -env staging
  .\k8s-start.ps1 -env prod
  .\k8s-start.ps1 stop
  .\k8s-start.ps1 status
#>
param(
  [Parameter(Position=0)]
  [ValidateSet('dev', 'staging', 'prod', 'production', 'stop', 'status', 'ps', 'restart')]
  [string]$Action = 'dev',

  [Alias('env')]
  [string]$Environment = ''
)

$targetEnv = if ($Environment) { $Environment } else { $Action }
if ($targetEnv -eq 'prod') { $targetEnv = 'production' }
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
  kubectl get pods -n $namespace -o custom-columns="CONTAINER:.spec.containers[0].name,STATUS:.status.phase,RESTARTS:.status.containerStatuses[0].restartCount,POD:.metadata.name"
  Write-Host ""
  Write-Host "[Khandua Looms K8s] Services & Endpoints:" -ForegroundColor Cyan
  kubectl get svc -n $namespace
  Write-Host ""
  Write-Host "[Khandua Looms K8s] Ingress Routing:" -ForegroundColor Cyan
  kubectl get ingress -n $namespace
  exit 0
}

if ($targetEnv -notin @('dev', 'staging', 'production')) {
  $targetEnv = 'dev'
}

$envLookup = if ($targetEnv -eq 'production') { 'prod' } else { $targetEnv }
$backendEnvFile = Join-Path $scriptDir "..\..\.env.$envLookup"

Write-Host "[Khandua Looms K8s] ===============================================" -ForegroundColor Cyan
Write-Host "[Khandua Looms K8s] Deploying Kubernetes cluster in [$targetEnv] mode" -ForegroundColor Cyan
Write-Host "[Khandua Looms K8s] Canonical Kustomize Directory: infrastructure/kubernetes/overlays/$targetEnv" -ForegroundColor Gray
Write-Host "[Khandua Looms K8s] ===============================================" -ForegroundColor Cyan

# 1. Apply Namespace
kubectl apply -f base/namespace.yaml | Out-Null

# 2. Inject Secrets if env file exists
if (Test-Path $backendEnvFile) {
  Write-Host "[1/3] Injecting cluster secrets dynamically from $backendEnvFile..." -ForegroundColor Yellow
  kubectl create secret generic khandualoom-secrets `
    --namespace=$namespace `
    --from-env-file=$backendEnvFile `
    --dry-run=client -o yaml | kubectl apply -f -
} else {
  Write-Host "[1/3] Using default secret template from base..." -ForegroundColor Yellow
}

# 3. Apply environment overlay via Kustomize
Write-Host "[2/3] Applying Kustomize overlay for environment [$targetEnv]..." -ForegroundColor Yellow
kubectl apply -k "overlays/$targetEnv"

# 4. Display status
Write-Host "[3/3] Verifying pod rollout..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
kubectl get pods -n $namespace -o custom-columns="CONTAINER:.spec.containers[0].name,STATUS:.status.phase,RESTARTS:.status.containerStatuses[0].restartCount,POD:.metadata.name"
Write-Host ""
Write-Host "[Khandua Looms K8s] Deployment successfully applied!" -ForegroundColor Green
