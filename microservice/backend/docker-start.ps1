<#
.SYNOPSIS
  Dynamically starts or stops Khandua Looms Docker Compose services in dev or prod mode.
.EXAMPLE
  .\docker-start.ps1 -env dev
  .\docker-start.ps1 -env prod
  .\docker-start.ps1 stop
#>
param(
  [Parameter(Position=0)]
  [ValidateSet('dev', 'prod', 'stop', 'restart', 'status')]
  [string]$Action = 'dev',

  [Alias('env')]
  [string]$Environment = ''
)

$targetEnv = if ($Environment) { $Environment } else { $Action }
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

if ($targetEnv -eq 'stop') {
  Write-Host "[Khandua Looms] Stopping all Docker Compose containers..." -ForegroundColor Yellow
  docker compose stop
  Write-Host "[Khandua Looms] All containers stopped." -ForegroundColor Green
  exit 0
}

if ($targetEnv -eq 'status') {
  docker compose ps
  exit 0
}

if ($targetEnv -notin @('dev', 'prod')) {
  $targetEnv = 'dev'
}

$backendEnv = ".env.$targetEnv"
$frontendEnv = "../frontend/.env.$targetEnv"

Write-Host "[Khandua Looms] Launching Docker Compose in [$targetEnv] mode..." -ForegroundColor Cyan
Write-Host "  Backend  ENV: $backendEnv" -ForegroundColor Gray
Write-Host "  Frontend ENV: $frontendEnv" -ForegroundColor Gray

$env:ENV_FILE = $backendEnv
$env:FRONTEND_ENV_FILE = $frontendEnv

docker compose --env-file $backendEnv up -d

Write-Host "[Khandua Looms] Services started successfully in [$targetEnv] mode." -ForegroundColor Green
docker compose ps
