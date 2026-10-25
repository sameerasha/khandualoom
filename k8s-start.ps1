<#
.SYNOPSIS
  Root launcher for Khandua Looms Kubernetes microservices.
  Delegates to microservice/backend/kubernetes/k8s-start.ps1
.EXAMPLE
  .\k8s-start.ps1 dev
  .\k8s-start.ps1 prod
  .\k8s-start.ps1 status
  .\k8s-start.ps1 stop
#>
param(
  [Parameter(Position=0)]
  [ValidateSet('dev', 'prod', 'stop', 'status', 'ps', 'restart')]
  [string]$Action = 'dev',

  [Alias('env')]
  [string]$Environment = ''
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$targetScript = Join-Path $scriptDir "microservice\backend\kubernetes\k8s-start.ps1"

if (Test-Path $targetScript) {
  & $targetScript -Action $Action -Environment $Environment
} else {
  Write-Host "[ERROR] Could not find Kubernetes launcher at: $targetScript" -ForegroundColor Red
  exit 1
}
