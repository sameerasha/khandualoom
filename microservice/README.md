# Khandua Looms Enterprise AI Microservices Platform

A cloud-native, event-driven luxury handloom e-commerce platform built with Spring Boot 3.3.x, Java 17/21, Apache Kafka, PostgreSQL with pgvector, Redis, and React 18+ TypeScript with Redux Toolkit and Motion.

---

## Architecture Overview

```
                      ┌──────────────────────────────────────────┐
                      │    Vite + React 18 TS + Redux Toolkit    │
                      │         (Frontend Port: 5173)            │
                      └────────────────────┬─────────────────────┘
                                           │ HTTP / WebSocket
                                           ▼
                      ┌──────────────────────────────────────────┐
                      │        Spring Cloud API Gateway          │
                      │               (Port: 8080)               │
                      └────┬───────────┬───────────┬─────────┬───┘
                           │           │           │         │
            ┌──────────────┘           │           │         └──────────────┐
            ▼                          ▼           ▼                        ▼
 ┌────────────────────┐   ┌────────────────┐  ┌───────────────┐   ┌────────────────────┐
 │    Auth Service    │   │Product Service │  │ Order Service │   │Notification Service│
 │    (Port: 8081)    │   │  (Port: 8082)  │  │ (Port: 8083)  │   │    (Port: 8084)    │
 └─────────┬──────────┘   └────────┬───────┘  └───────┬───────┘   └─────────▲──────────┘
           │                       │                  │                     │
           │ JWT                   │ pgvector/Redis   │ Transactional Outbox│
           ▼                       ▼                  ▼                     │
     ┌───────────┐         ┌───────────────┐     ┌─────────┐                │
     │ PostgreSQL│         │PostgreSQL 16  │     │  Kafka  ├────────────────┘
     │   (DB)    │         │  + Redis 7    │     │ Cluster │  order-created-events
     └───────────┘         └───────────────┘     └─────────┘
```

---

## Directory Structure

```
microservice/
├── docker-compose.yml              # Local infra (PostgreSQL + pgvector, Redis, Kafka, Kafka UI)
├── backend/
│   ├── pom.xml                     # Parent multi-module POM
│   ├── .agent/skills/              # 10 Antigravity backend architect skills
│   ├── common-library/             # Shared contracts, events, ProblemDetail (RFC 7807)
│   ├── api-gateway/                # Spring Cloud Gateway (:8080) with route filters & CORS
│   ├── auth-service/               # Spring Security, JWT, OTP verification, Users (:8081)
│   ├── product-service/            # Saree catalog, Redis Cache-Aside, pgvector search (:8082)
│   ├── order-service/              # Checkout, Razorpay, Transactional Outbox pattern (:8083)
│   └── notification-service/       # Kafka listener, email/SMS dispatch (:8084)
└── frontend/
    ├── package.json                # Vite, React 18, Redux Toolkit, Motion, Tailwind
    ├── .agent/skills/              # Frontend & cinematic animation skills
    ├── src/
    │   ├── app/                    # Redux store & typed hooks
    │   ├── features/               # Auth, Cart, Products, Orders slices & RTK Query APIs
    │   ├── components/             # Luxury UI (Navbar, Hero, ProductGrid, Cart, Checkout, Admin)
    │   └── types/                  # Strict TypeScript domain interfaces
    └── dist/                       # Optimized production build artifacts
```

---

## Service Port Allocation

| Service | Port | Description |
|---|---|---|
| **API Gateway** | `8080` | Single entrypoint, reverse proxy, token relay |
| **Auth Service** | `8081` | Authentication, registration, JWT tokens, OTP |
| **Product Service** | `8082` | Product catalog, pgvector semantic search, Redis cache |
| **Order Service** | `8083` | Orders, Razorpay payments, Transactional Outbox publisher |
| **Notification Service** | `8084` | Kafka consumer, customer order confirmations |
| **PostgreSQL 16** | `5432` | Relational storage with `pgvector` extension |
| **Redis 7** | `6379` | Cache-aside & active session store |
| **Apache Kafka** | `9092` | Distributed event streaming broker (KRaft mode) |
| **Kafka UI** | `8085` | Web dashboard for monitoring Kafka topics |
| **Vite Frontend Dev** | `5173` | React 18 TypeScript luxury storefront |

---

## Quick Start Guide

### 1. Launch Local Infrastructure
```bash
cd microservice
docker-compose up -d
```

### 2. Build Backend Services
```bash
cd microservice/backend
./mvnw clean compile -DskipTests
```

### 3. Run Frontend Development Server
```bash
cd microservice/frontend
npm run dev
```

### 4. Run Frontend Automated Test Suite
```bash
cd microservice/frontend
npm test
```
