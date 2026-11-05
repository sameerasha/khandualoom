#!/usr/bin/env bash
# ===================================================================
# Khandua Looms – Automated Kafka Topics Provisioning Script (KRaft)
# Enforces partition counts, retention, and DLQ topic topologies
# ===================================================================

set -e

BOOTSTRAP_SERVER="${KAFKA_BOOTSTRAP_SERVERS:-localhost:9092}"
PARTITIONS="${KAFKA_PARTITIONS:-6}"
REPLICATION="${KAFKA_REPLICATION_FACTOR:-1}"
RETENTION_MS="${KAFKA_RETENTION_MS:-604800000}" # 7 days

echo "Connecting to Kafka cluster at: ${BOOTSTRAP_SERVER}"

TOPICS=(
  "orders.order-created"
  "orders.order-confirmed"
  "orders.late-payment-reconciliation"
  "inventory.reserved"
  "inventory.reservation-failed"
  "inventory.release-reservation"
  "payment-completed"
  "payments.payment-failed"
  "payments.refund-processed"
  "payments.refund-failed"
  "notifications.send-email"
  "audit.events"
  "orders.order-created.DLT"
  "inventory.reserved.DLT"
  "payment-completed.DLT"
)

for topic in "${TOPICS[@]}"; do
  echo "Ensuring topic: ${topic}..."
  kafka-topics --bootstrap-server "${BOOTSTRAP_SERVER}" \
    --create --if-not-exists \
    --topic "${topic}" \
    --partitions "${PARTITIONS}" \
    --replication-factor "${REPLICATION}" \
    --config retention.ms="${RETENTION_MS}"
done

echo "All Khandua Looms Kafka topics successfully provisioned."
kafka-topics --bootstrap-server "${BOOTSTRAP_SERVER}" --list
