# Khandua Looms Enterprise Kubernetes Orchestration

Production-grade, cloud-native Kubernetes architecture for the **Khandua Looms** distributed microservices platform.

---

## 1. Architecture Overview

```
                                  [ Client / Browser ]
                                           │
                                ┌──────────▼──────────┐
                                │ Kubernetes Ingress  │
                                │   (:80 / :443)      │
                                └────┬───────────┬────┘
                                     │           │
                 ┌───────────────────┘           └──────────────────┐
                 │                                                  │
                 ▼                                                  ▼
     ┌───────────────────────┐                          ┌───────────────────────┐
     │  Frontend Service     │                          │  API Gateway Service  │
     │  (React 19 / Nginx)   │                          │  (Spring Cloud :8080) │
     │  NodePort :30080      │                          └───────────┬───────────┘
     └───────────────────────┘                                      │
                                         ┌──────────────┬───────────┴──┬──────────────┐
                                         │              │              │              │
                                         ▼              ▼              ▼              ▼
                                  ┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐
                                  │Auth Service ││Product Svc  ││Order Service││Notification │
                                  │   (:8081)   ││   (:8082)   ││   (:8083)   ││   (:8084)   │
                                  └──────┬──────┘└──────┬──────┘└──────┬──────┘└──────┬──────┘
                                         │              │              │              │
                 ┌───────────────────────┴──────────────┴──────────────┴──────────────┘
                 │
                 ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                        Data & Messaging Plane                          │
 │  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
 │  │  PostgreSQL 16   │    │     Redis 7      │    │  Apache Kafka    │  │
 │  │ (pgvector :5432) │    │  (Cache :6379)   │    │  (KRaft :29092)  │  │
 │  └──────────────────┘    └──────────────────┘    └──────────────────┘  │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

| File | Purpose |
| :--- | :--- |
| `00-namespace.yaml` | Namespace isolation (`khandualoom-micro`) with metadata labels |
| `01-secrets.yaml` | Application secrets: Database credentials, JWT 256-bit secret, Brevo SMTP credentials, OAuth IDs, Razorpay keys |
| `02-configmaps.yaml` | ConfigMaps: `app-config` for microservice network coordinates & `observability-config` for Prometheus/Tempo/Grafana |
| `03-persistent-volumes.yaml` | PVCs for PostgreSQL, Redis, Kafka, Prometheus, Tempo, and Grafana |
| `04-infra.yaml` | Infrastructure services: PostgreSQL 16 (pgvector), Redis 7, Apache Kafka (KRaft mode), Kafka UI |
| `05-backend.yaml` | Spring Boot 3.3.x Microservices: Auth, Product, Order, Notification, and API Gateway |
| `06-observability.yaml` | Observability stack: Prometheus (:9090), Grafana Tempo (:3200, :4318), Grafana Dashboards (:3000) |
| `07-frontend.yaml` | Storefront: High-performance Nginx reverse-proxy & React app (NodePort :30080) |
| `08-ingress.yaml` | Ingress resource with Nginx annotations for `/` (Frontend) and `/api` (API Gateway) |
| `09-hpa.yaml` | Horizontal Pod Autoscalers (HPA v2) for API Gateway, Auth, Product, and Order microservices |
| `kustomization.yaml` | Kustomize manifest for single-command declarative deployment |
| `manifest.yaml` | Generated all-in-one manifest for standard `kubectl apply -f manifest.yaml` |

---

## 3. Quickstart Deployment

### Option A: Declarative Kustomize Deployment (Recommended)
```bash
cd microservice/backend/kubernetes
kubectl apply -k .
```

### Option B: Single-File Manifest Deployment
```bash
kubectl apply -f microservice/backend/kubernetes/manifest.yaml
```

---

## 4. Verification and Health Checks

### Check All Resources
```bash
kubectl get all -n khandualoom-micro
```

### Check Horizontal Pod Autoscaling (HPA)
```bash
kubectl get hpa -n khandualoom-micro
```

### Verify Spring Boot Actuator Probes
All Spring Boot microservices feature dual Actuator probes:
- **Liveness Probe**: `/actuator/health/liveness` (Detects deadlocks and initiates safe restarts)
- **Readiness Probe**: `/actuator/health/readiness` (Verifies datastore and broker availability before routing traffic)

---

## 5. Local Access & Port-Forwarding

| Service | Protocol / Access | Port | Description |
| :--- | :--- | :--- | :--- |
| **Storefront** | HTTP NodePort | `http://localhost:30080` | Production React Storefront & Admin Portal |
| **API Gateway** | Port Forward | `kubectl port-forward svc/api-gateway 8080:8080 -n khandualoom-micro` | Direct Spring Cloud Gateway route |
| **Kafka UI** | Port Forward | `kubectl port-forward svc/kafka-ui 8085:8080 -n khandualoom-micro` | Kafka topics, consumer groups & broker monitor |
| **Grafana** | Port Forward | `kubectl port-forward svc/grafana 3001:3000 -n khandualoom-micro` | Observability dashboards (admin / admin) |
| **Prometheus** | Port Forward | `kubectl port-forward svc/prometheus 9090:9090 -n khandualoom-micro` | Prometheus time-series metric browser |

---

## 6. Teardown
```bash
kubectl delete -k microservice/backend/kubernetes
```
