<#
.SYNOPSIS
  Root launcher for Khandua Looms Docker Compose services.
  Delegates to microservice/backend/docker-start.ps1
.EXAMPLE
  .\docker-start.ps1 dev
  .\docker-start.ps1 prod
  .\docker-start.ps1 stop
  .\docker-start.ps1 status
#>
param(
  [Parameter(Position=0)]
  [ValidateSet('dev', 'prod', 'stop', 'status', 'ps', 'down')]
  [string]$Action = 'dev',

  [Alias('env')]
  [string]$Environment = ''
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$targetScript = Join-Path $scriptDir "microservice\backend\docker-start.ps1"

if (Test-Path $targetScript) {
  & $targetScript -Action $Action -Environment $Environment
} else {
  Write-Host "[ERROR] Could not find Docker launcher at: $targetScript" -ForegroundColor Red
  exit 1
}
