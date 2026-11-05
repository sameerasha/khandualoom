# Service Mesh Evaluation: Istio vs Linkerd vs Cilium eBPF

## Context & Objectives

As Khandua Looms scales toward 100,000+ daily orders and 10,000 req/s flash sales, securing inter-service east-west traffic, standardizing observability, and enforcing zero-trust service identity becomes critical. This document evaluates three primary service mesh architectures for our Kubernetes infrastructure.

---

## 1. Architectural Matrix Comparison

| Evaluation Dimension | Istio (Envoy Sidecars) | Linkerd (Rust Micro-Proxy) | Cilium Service Mesh (eBPF) |
| :--- | :--- | :--- | :--- |
| **Proxy Architecture** | Sidecar per Pod (Envoy C++) | Sidecar per Pod (Linkerd2-proxy Rust) | Node-level eBPF kernel bypass (Sidecarless) |
| **Memory Overhead** | ~50MB–120MB per pod replica | ~15MB–30MB per pod replica | Fixed per node (~200MB); 0MB per application pod |
| **P99 Latency Added** | +2.5ms to +4.0ms per hop | +1.0ms to +1.8ms per hop | +0.2ms to +0.6ms (kernel fastpath) |
| **mTLS Support** | Automatic SPIFFE/SPIRE with rotation | Automatic zero-config mTLS | WireGuard / IPsec node encryption + Envoy gateway |
| **Layer 7 Traffic Routing** | Industry-leading (VirtualService, DestinationRule) | Clean, pragmatic (HTTP route splitting) | Excellent (eBPF L4/L7 with Envoy filters) |
| **Operational Complexity** | High (Pilot, EnvoyFilter CRDs, complex debugging) | Low (Simplicity-first philosophy) | Medium-High (Requires modern Linux kernel >= 5.10) |
| **W3C Trace Propagation** | Automatic B3/W3C header injection | Native OpenTelemetry integration | Native OpenTelemetry via Hubble |

---

## 2. Deep-Dive Analysis for Khandua Looms

### 2.1 Istio
- **Strengths**: Most mature ecosystem, rich Canary routing policies, fine-grained RBAC authorization policies natively mapping to Kubernetes identities.
- **Risks**: Heavy footprint. In our 9 microservices running 3-5 replicas each (35+ pods), Envoy sidecars alone consume ~3.5GB of RAM and add 5-8ms of round-trip latency to synchronous checkout calls.
- **Verdict**: Over-engineered for our current 9-service scale.

### 2.2 Linkerd
- **Strengths**: Ultralight Rust proxy (`linkerd2-proxy`) provides instantaneous startup, exceptionally low memory consumption (~20MB/pod), and zero-configuration mutual TLS.
- **Risks**: Less granular advanced traffic rewriting than Istio; fewer enterprise extensions.
- **Verdict**: Superior choice if traditional sidecar mTLS is mandated immediately without kernel dependencies.

### 2.3 Cilium eBPF (Sidecarless)
- **Strengths**: Revolutionary performance. Operates inside the Linux kernel socket layer (`sockops`), bypassing the TCP/IP stack overhead entirely for pods on the same node. Zero sidecar memory injection into our application pods. Native network policies with cryptographic WireGuard node-to-node encryption.
- **Risks**: Requires modern Linux kernel (>= 5.10, Amazon Linux 2023 / Ubuntu 22.04+).
- **Verdict**: **Recommended target for Khandua Looms Production.**

---

## 3. Architecture Recommendation & Migration Plan

### Decision
Adopt **Cilium with eBPF** as the primary CNI and Service Mesh for Khandua Looms on Amazon EKS:
1. **Phase 1 (Current Baseline)**: Application-layer cryptographic assertion tokens (`X-Gateway-Identity` with HMAC-SHA256) + Kubernetes `NetworkPolicy` ingress whitelisting. This provides zero-trust security today without operational mesh complexity.
2. **Phase 2 (Scale Phase at 50,000 orders/day)**: Deploy Cilium CNI on EKS with WireGuard transparent encryption enabled. Eliminates sidecar maintenance while providing hardware-accelerated node-to-node encryption.
3. **Phase 3 (Enterprise Multi-Region)**: Enable Hubble metrics integration for real-time L4/L7 golden signals into Grafana Tempo and Prometheus.
