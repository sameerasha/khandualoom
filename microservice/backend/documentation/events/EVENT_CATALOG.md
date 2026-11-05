# Khandua Looms — Integration Event Catalog

## 1. Event Streaming Architecture

All asynchronous communications across microservices are delivered via **Apache Kafka (KRaft Mode)**. Events adhere to a strict versioned contract schema wrapped in a standardized generic envelope `EventEnvelope<T>`.

### Envelope Structure: `EventEnvelope<T>`
```json
{
  "eventId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "eventType": "OrderCreatedEvent",
  "aggregateId": "101",
  "timestamp": "2026-11-05T22:00:00Z",
  "version": 1,
  "payload": { ... }
}
```

---

## 2. Event Specification Matrix

| Topic Name | Event Class | Producer Service | Consumer Service(s) | Business Trigger & Intent |
| :--- | :--- | :--- | :--- | :--- |
| `orders.order-created` | `OrderCreatedEvent` | `order-service` | `inventory-service`, `audit-service` | User places an order. Triggers stock reservation. |
| `inventory.reserved` | `InventoryReservedEvent` | `inventory-service` | `order-service`, `audit-service` | Stock successfully reserved for 15 minutes. Advances Saga to payment. |
| `inventory.reservation-failed` | `InventoryReservationFailedEvent` | `inventory-service` | `order-service`, `audit-service` | Insufficient stock. Saga cancels order. |
| `payments.payment-completed` / `payment-completed` | `PaymentCompletedEvent` | `payment-service` | `order-service`, `audit-service` | Razorpay signature verified and funds captured. Advances order to CONFIRMED. |
| `payments.payment-failed` | `PaymentFailedEvent` | `payment-service` | `order-service`, `audit-service` | Razorpay payment cancelled/failed. Triggers compensation. |
| `inventory.release-reservation` | `OrderItemEvent` / `Map` | `order-service` | `inventory-service`, `audit-service` | Saga compensation: cancels stock lock when payment fails. |
| `orders.order-confirmed` | `PaymentCompletedEvent` / `OrderCreatedEvent` | `order-service` | `notification-service`, `audit-service` | Order is fully confirmed. Dispatches Brevo confirmation email. |

---

## 3. Event Payloads

### 3.1 `OrderCreatedEvent`
```json
{
  "orderId": 101,
  "orderNumber": "ORD-20261105-00101",
  "customerEmail": "priya.patel@example.com",
  "totalAmount": 18500.00,
  "items": [
    {
      "productId": 3,
      "productName": "Khandua Pata Traditional Silk Saree",
      "quantity": 1,
      "unitPrice": 18500.00
    }
  ],
  "createdAt": "2026-11-05T22:00:00Z"
}
```

### 3.2 `InventoryReservedEvent`
```json
{
  "orderId": 101,
  "reservedAt": "2026-11-05T22:00:01Z",
  "expiresAt": "2026-11-05T22:15:01Z"
}
```

### 3.3 `PaymentCompletedEvent`
```json
{
  "orderId": 101,
  "paymentId": "pay_O7TqL9182xyz",
  "razorpayOrderId": "order_O7TqA0182abc",
  "amount": 18500.00,
  "currency": "INR",
  "paymentMethod": "UPI",
  "paidAt": "2026-11-05T22:02:15Z"
}
```

---

## 4. Idempotency & Delivery Guarantees

1. **Transactional Outbox**:
   - Outbox tables (`outbox_events`) in each service ensure database writes and Kafka event generation commit atomically within local database transactions.
2. **Consumer Idempotency**:
   - Consumers log processed event IDs in `processed_events` (`eventId`, `consumerGroup`, `processedAt`) using primary key conflict ignore / duplicate checking to eliminate duplicate side effects.
