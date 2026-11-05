# ===================================================================
# Khandua Looms – Automated Kafka Topics Provisioning Script (PowerShell)
# ===================================================================

param(
    [string]$BootstrapServer = "localhost:9092",
    [int]$Partitions = 6,
    [int]$Replication = 1,
    [string]$RetentionMs = "604800000" # 7 days
)

Write-Host "Connecting to Kafka cluster at: $BootstrapServer" -ForegroundColor Cyan

$topics = @(
    "orders.order-created",
    "orders.order-confirmed",
    "orders.late-payment-reconciliation",
    "inventory.reserved",
    "inventory.reservation-failed",
    "inventory.release-reservation",
    "payment-completed",
    "payments.payment-failed",
    "payments.refund-processed",
    "payments.refund-failed",
    "notifications.send-email",
    "audit.events",
    "orders.order-created.DLT",
    "inventory.reserved.DLT",
    "payment-completed.DLT"
)

foreach ($topic in $topics) {
    Write-Host "Ensuring topic: $topic..." -ForegroundColor Yellow
    docker exec kafka kafka-topics --bootstrap-server localhost:9092 `
        --create --if-not-exists `
        --topic $topic `
        --partitions $Partitions `
        --replication-factor $Replication `
        --config retention.ms=$RetentionMs
}

Write-Host "All Kafka topics provisioned successfully!" -ForegroundColor Green
docker exec kafka kafka-topics --bootstrap-server localhost:9092 --list
