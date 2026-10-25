# Khandua Looms Enterprise Kubernetes Orchestration

Production-grade, cloud-native Kubernetes architecture for the **Khandua Looms** distributed microservices platform, fully structured according to Kustomize GitOps best practices.

---

## 1. Clean Directory Structure (Base & Overlays)

The directory is split into **shared base manifests** and **environment overlays** (`dev` and `prod`) with zero code duplication:

```
microservice/backend/kubernetes/
├── base/                          # Shared Core Infrastructure & Microservices
│   ├── 01-namespace.yml          # Namespace boundary (khandualoom)
│   ├── 02-configmaps.yaml         # Observability file mounts (Prometheus, Tempo, Grafana, Nginx)
│   ├── 03-persistent-volumes.yaml # PVCs for Postgres, Kafka, Redis, Prometheus, Tempo, Grafana
│   ├── 04-infra.yaml              # Databases & brokers: postgres, redis, kafka, kafka-ui
│   ├── 05-backend.yaml            # Spring Boot microservices with startup & health probes
│   ├── 06-observability.yaml      # Telemetry: prometheus, tempo, grafana
│   ├── 07-frontend.yaml           # React Storefront UI on NodePort 30080
│   ├── 08-ingress.yaml            # Ingress controller rules
│   └── kustomization.yaml         # Base Kustomize definition
│
├── overlays/                      # Environment Configurations
│   ├── dev/
│   │   └── kustomization.yaml     # Dev overlay (single replicas, fast local dev)
│   └── prod/
│       ├── 09-hpa.yaml            # Horizontal Pod Autoscalers (1–8 replicas, CPU 70%, RAM 80%)
│       └── kustomization.yaml     # Prod overlay (enables HPA & production policies)
│
├── 00-secrets.template.yml       # Template for secrets (NO plaintext secrets in Git)
├── k8s-start.ps1                  # PowerShell dynamic launcher (.env.dev / .env.prod)
├── k8s-start.sh                   # Bash dynamic launcher (.env.dev / .env.prod)
├── kustomization.yaml             # Root Kustomize definition (defaults to overlays/dev)
└── README.md
```

---

## 2. Dynamic Secret Ingestion (Zero Plaintext Secrets)

Credentials (passwords, JWT signing keys, payment keys, SMTP logins) are **never stored in YAML files**:
- `k8s-start.ps1` and `k8s-start.sh` read credentials directly from your local `.env.dev` or `.env.prod` file.
- The Kubernetes Secret `app-secrets` is generated in memory and injected securely:
  ```bash
  kubectl create secret generic app-secrets \
    --namespace=khandualoom \
    --from-env-file=../.env.dev \
    --dry-run=client -o yaml | kubectl apply -f -
  ```

---

## 3. Quickstart Commands

### Deploy Development Mode (Reads `.env.dev`)
```powershell
.\k8s-start.ps1 dev
# Or with bash:
./k8s-start.sh dev
```

### Deploy Production Mode (Reads `.env.prod`, Enables HPA)
```powershell
.\k8s-start.ps1 prod
# Or with bash:
./k8s-start.sh prod
```

### Check Cluster Status
```powershell
.\k8s-start.ps1 status
```

### Stop (Scale Down) All Containers
```powershell
.\k8s-start.ps1 stop
```

---

## 4. Endpoints & Access

| Service | Target URL | Description |
| :--- | :--- | :--- |
| **Storefront Web UI** | `http://localhost:30080` | React Luxury E-commerce Storefront |
| **Storefront API Gateway** | `http://localhost:30080/api/products` | Public Catalog API |
| **Auth Login API** | `POST http://localhost:30080/api/auth/login` | JWT Authentication Endpoint |
| **Kafka Management UI** | Internal Service `kafka-ui:8080` | Topic Inspector & Consumer Groups |
| **Prometheus Metrics** | Internal Service `prometheus:9090` | Scrapes `/actuator/prometheus` |
| **Grafana Dashboards** | Internal Service `grafana:3000` | Pre-provisioned Microservices Dashboards |
| **Tempo Tracing** | Internal Service `tempo:3200` | Distributed Trace Visualizer |

