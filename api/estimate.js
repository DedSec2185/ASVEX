/**
 * ASVEX Technologies — System Architecture & Cost Estimator API (Vercel Serverless)
 * POST /api/estimate
 */

const ARCHETYPES = {
  ai_rag: {
    id: 'ai_rag',
    name: 'Enterprise AI & Production RAG',
    subtitle: 'FAISS dense vector search, QLoRA 4-bit fine-tuned models, anti-hallucination',
    baseInr: [120000, 240000],
    baseUsd: [1800, 3500],
    timelineWeeks: '3 – 5 Weeks',
    stack: {
      frontend: 'React 18 / Next.js Enterprise Dashboard',
      api: 'Python FastAPI Asynchronous Microservices',
      vectorDb: 'FAISS 768-Dim Dense Embeddings (Cosine >= 0.30)',
      llm: 'Llama 3.2 Fine-Tuned (QLoRA 4-bit) / Ollama Serving',
      infra: 'Linux Container Fleet + Automated CI/CD'
    },
    deliverables: [
      'Custom structure-preserving document parsing engine',
      'Vector database pipeline with cosine threshold anti-hallucination',
      'Model inference endpoints with JWT OAuth2 authentication',
      'Full source code Git repository + 30-day warranty'
    ]
  },
  fullstack_saas: {
    id: 'fullstack_saas',
    name: 'Full-Stack Custom Web Platform / SaaS',
    subtitle: 'High-concurrency web apps with isolated multi-tenant schemas',
    baseInr: [95000, 210000],
    baseUsd: [1400, 3000],
    timelineWeeks: '4 – 6 Weeks',
    stack: {
      frontend: 'React 18 / Next.js / Tailwind CSS UI',
      api: 'Python FastAPI / Node.js REST API',
      database: 'PostgreSQL with Alembic Migrations & Supabase',
      security: 'JWT Authentication & Granular RBAC Role Trees',
      infra: 'Vercel Edge Network + Cloudflare CDN'
    },
    deliverables: [
      'Production-grade responsive web frontend & admin portal',
      'RESTful API backend with schema validation & rate limits',
      'Database models, migration scripts, and seed fixtures',
      'Stripe / Razorpay multi-currency checkout integration'
    ]
  },
  hospitality_os: {
    id: 'hospitality_os',
    name: 'Real-Time Hospitality OS (Shivalaya Model)',
    subtitle: '3-app ecosystem: Guest QR table ordering, Kitchen KDS, and Reception POS',
    baseInr: [115000, 250000],
    baseUsd: [1600, 3600],
    timelineWeeks: '3 – 5 Weeks',
    stack: {
      frontend: 'Guest QR Web App + Kitchen Display System (KDS)',
      realtime: 'Supabase Realtime WebSockets (<100ms sync)',
      database: 'PostgreSQL Advisory Locks (Concurrency-Safe)',
      notifications: 'WhatsApp Cloud / MSG91 Webhooks (<15s delivery)',
      infra: 'Edge CDN + Headless PDF Voucher Compiler'
    },
    deliverables: [
      'Guest table QR scanning interface with mobile payment',
      'Kitchen Display System with ticket state synchronization',
      'PostgreSQL transaction advisory locks for surge ordering',
      'Automated WhatsApp bill & receipt webhook delivery'
    ]
  },
  offshore_portal: {
    id: 'offshore_portal',
    name: 'Offshore Logistics Portal (OCTS Model)',
    subtitle: '100+ crew tracking, 11 cert types, private Tailscale VPN mesh, OpenPyXL',
    baseInr: [110000, 230000],
    baseUsd: [1500, 3200],
    timelineWeeks: '4 – 6 Weeks',
    stack: {
      frontend: 'React.js Data Grid SPA with Multi-Filter Matrices',
      api: 'Python FastAPI with Pydantic Schema Validation',
      database: 'PostgreSQL with SQLAlchemy ORM & Alembic',
      security: 'Tailscale WireGuard VPN Mesh (Zero Public Exposure)',
      infra: 'Isolated Docker Compose Containers + Nginx Reverse Proxy'
    },
    deliverables: [
      '100+ offshore personnel management & certification tracking',
      'Zero-trust Tailscale private WireGuard network setup',
      'OpenPyXL high-performance regulatory Excel report generator',
      'Audit trail logging with role-based permission tiers'
    ]
  },
  agent_workflows: {
    id: 'agent_workflows',
    name: 'Autonomous Workflow & RPA Fleet',
    subtitle: 'Self-hosted n8n workflows, Playwright headless RPA, and Voice AI agents',
    baseInr: [75000, 160000],
    baseUsd: [1100, 2400],
    timelineWeeks: '2 – 4 Weeks',
    stack: {
      orchestrator: 'n8n Self-Hosted Automation Nodes',
      rpa: 'Playwright Headless Browser Workers',
      stateMachine: 'LangGraph Directed Acyclic Graphs (DAGs)',
      webhooks: 'WhatsApp, Email & CRM Bidirectional Webhooks',
      infra: 'Docker Compose on Dedicated Linux VPS'
    },
    deliverables: [
      'Self-hosted n8n installation on your dedicated server',
      'Multi-step automated workflows across email, CRM, and WhatsApp',
      'Playwright browser automations for non-API web systems',
      'Error handling, automatic retries, and failure alerts'
    ]
  },
  mobile_app: {
    id: 'mobile_app',
    name: 'Cross-Platform Mobile Application',
    subtitle: 'Native performance iOS and Android from one unified codebase',
    baseInr: [130000, 290000],
    baseUsd: [1900, 4200],
    timelineWeeks: '5 – 7 Weeks',
    stack: {
      mobile: 'React Native / Expo iOS & Android',
      state: 'Zustand & Offline-First SQLite Sync',
      api: 'FastAPI REST / Supabase GraphQL',
      push: 'Firebase Cloud Messaging (FCM) & Apple APNs',
      infra: 'App Store & Google Play Build Pipelines'
    },
    deliverables: [
      'Complete cross-platform iOS and Android mobile app build',
      'Biometric authentication (FaceID / Fingerprint) & push notifications',
      'Offline caching layer with background database synchronization',
      'Deployment assistance for Apple App Store and Google Play'
    ]
  }
};

// Backwards-compatible aliases
ARCHETYPES.enterprise_portal = ARCHETYPES.offshore_portal;
ARCHETYPES.workflow_automation = ARCHETYPES.agent_workflows;

const FEATURE_ADDONS = {
  postgres_lock: { inr: 25000, usd: 350, name: 'PostgreSQL Advisory Locks (Concurrency-Safe)' },
  vector_guard: { inr: 35000, usd: 500, name: 'FAISS Vector Anti-Hallucination Guardrail' },
  wireguard_vpn: { inr: 20000, usd: 300, name: 'Tailscale Zero-Trust WireGuard VPN Mesh' },
  whatsapp_webhook: { inr: 15000, usd: 200, name: 'Real-Time WhatsApp MSG91 / Gupshup Webhooks' },
  payment_gateway: { inr: 18000, usd: 250, name: 'Stripe / Razorpay Multi-Currency Gateway' },
  // Aliases
  advisory_locks: { inr: 25000, usd: 350, name: 'PostgreSQL Concurrency Advisory Locks' },
  vector_search: { inr: 35000, usd: 500, name: '768-Dim FAISS Vector Indexing & Thresholding' },
  vpn_mesh: { inr: 20000, usd: 300, name: 'Tailscale Zero-Trust WireGuard VPN Mesh' },
  whatsapp_api: { inr: 15000, usd: 200, name: 'Meta WhatsApp Cloud API Automation (<15s)' },
  websockets: { inr: 15000, usd: 200, name: 'Realtime WebSocket Sync (<100ms)' },
  qlora_tuning: { inr: 45000, usd: 600, name: 'QLoRA Parameter-Efficient Model Fine-Tuning' },
  excel_reporter: { inr: 15000, usd: 200, name: 'OpenPyXL Regulatory Excel Report Engine' }
};

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body);
  } catch (_) {
    return {};
  }
}

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ archetypes: ARCHETYPES, addons: FEATURE_ADDONS });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = parseBody(req);
  const archetypeKey = body.archetype || 'ai_rag';
  const selectedFeatures = Array.isArray(body.features) ? body.features : [];
  const currency = body.currency === 'USD' ? 'USD' : 'INR';

  const base = ARCHETYPES[archetypeKey] || ARCHETYPES.ai_rag;
  let minCost = currency === 'INR' ? base.baseInr[0] : base.baseUsd[0];
  let maxCost = currency === 'INR' ? base.baseInr[1] : base.baseUsd[1];

  const appliedFeatures = [];
  selectedFeatures.forEach((featKey) => {
    if (FEATURE_ADDONS[featKey]) {
      const addon = FEATURE_ADDONS[featKey];
      const addVal = currency === 'INR' ? addon.inr : addon.usd;
      minCost += addVal;
      maxCost += addVal;
      appliedFeatures.push({ key: featKey, name: addon.name, cost: addVal });
    }
  });

  const formattedPrice =
    currency === 'INR'
      ? `₹${minCost.toLocaleString('en-IN')} – ₹${maxCost.toLocaleString('en-IN')}`
      : `$${minCost.toLocaleString('en-US')} – $${maxCost.toLocaleString('en-US')}`;

  return res.status(200).json({
    success: true,
    archetype: base,
    currency,
    minCost,
    maxCost,
    formattedPrice,
    timeline: base.timelineWeeks,
    appliedFeatures,
    ownership: '100% Full Intellectual Property & Source Code Transfer',
    paymentSchedule: '40% Architecture Kickoff / 30% Midpoint Staging / 30% Production Handover'
  });
};
