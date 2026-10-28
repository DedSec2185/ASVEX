# ASVEX Technologies — High-Performance Software Engineering & Autonomous AI

**Founder & Principal Systems Architect**: Abhayraj Singh  
**Headquarters**: Mumbai, Maharashtra, India · Operating Globally  
**Website**: [asvextech.com](https://asvextech.com) · **Direct**: `abhay@asvextech.com` · `+91 98924 69015`

---

## Overview

**ASVEX Technologies** is a bespoke software engineering and autonomous AI studio engineering concurrency-safe web platforms, domain-specific RAG pipelines, real-time hospitality/POS ecosystems, and zero-trust enterprise portals. Every engagement features direct founder engineering and **100% unencumbered intellectual property transfer**.

## Architecture & Repository Layout

```text
asvex-technologies/
├── website/                     # Public Multi-Page Web Platform (14 Pages)
│   ├── index.html               # Executive Flagship Entry
│   ├── services.html            # 7 Core Engineering Capabilities & Pricing Matrix
│   ├── system-architect.html    # Live Pipeline Stress Simulator & Cost Calculator
│   ├── case-studies.html        # Production Deployments (Reliance Jio, Shivalaya, OCTS, Sukiee)
│   ├── engineering.html         # Production Code Standards (Advisory Locks, FAISS, WireGuard)
│   ├── about.html               # Founder Profile & Studio Governance
│   ├── contact.html             # 30-Minute Architecture Audit & Project Intake
│   ├── web-applications.html    # Full-Stack React / Next.js & FastAPI SaaS
│   ├── ai-automation.html       # Enterprise RAG, QLoRA Fine-Tuning & MCP Agents
│   ├── mobile-apps.html         # Cross-Platform React Native (iOS & Android)
│   ├── backend-apis.html        # High-Throughput Distributed Backends
│   ├── system-integrations.html # Self-Hosted n8n & Playwright RPA Workflows
│   ├── architecture-scaling.html# Concurrency Rescue, Docker & Tailscale WireGuard
│   ├── feature-development.html # Dedicated Founder Engineering Retainers
│   └── assets/                  # Design System v5.0 CSS, 3D Tilt Physics JS & Brand Assets
├── api/                         # Vercel Serverless API Functions
│   ├── health.js                # GET  /api/health
│   ├── estimate.js              # POST /api/estimate
│   ├── inquiry.js               # POST /api/inquiry
│   └── audit-request.js         # POST /api/audit-request
├── server/
│   └── server.js                # Zero-Dependency Local Node.js Development Server
├── vercel.json                  # Zero-Config Vercel Static + Serverless Routing
└── package.json
```

## Local Development

Run the zero-dependency Node.js server locally on port `3001`:

```bash
npm start
```

Then visit `http://localhost:3001`.

## Deployment (Vercel)

1. Import `DedSec2185/ASVEX` directly in **Vercel**.
2. Keep default settings (`vercel.json` automatically configures `website` as the static output directory and `api/` as Node.js Serverless Functions).
3. Connect custom domain `asvextech.com` under **Settings → Domains**.
