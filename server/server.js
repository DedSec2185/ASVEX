/**
 * ASVEX Technologies — Local Development & Production API Server
 * Lightweight, zero-dependency Node.js HTTP/JSON Server
 * Serves public website/ static files + /api/* endpoints locally on Port 3001
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const AUDITS_FILE = path.join(DATA_DIR, 'audits.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(AUDITS_FILE)) {
  fs.writeFileSync(AUDITS_FILE, JSON.stringify([], null, 2));
}

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

ARCHETYPES.enterprise_portal = ARCHETYPES.offshore_portal;
ARCHETYPES.workflow_automation = ARCHETYPES.agent_workflows;

const FEATURE_ADDONS = {
  postgres_lock: { inr: 25000, usd: 350, name: 'PostgreSQL Advisory Locks (Concurrency-Safe)' },
  vector_guard: { inr: 35000, usd: 500, name: 'FAISS Vector Anti-Hallucination Guardrail' },
  wireguard_vpn: { inr: 20000, usd: 300, name: 'Tailscale Zero-Trust WireGuard VPN Mesh' },
  whatsapp_webhook: { inr: 15000, usd: 200, name: 'Real-Time WhatsApp MSG91 / Gupshup Webhooks' },
  payment_gateway: { inr: 18000, usd: 250, name: 'Stripe / Razorpay Multi-Currency Gateway' },
  advisory_locks: { inr: 25000, usd: 350, name: 'PostgreSQL Concurrency Advisory Locks' },
  vector_search: { inr: 35000, usd: 500, name: '768-Dim FAISS Vector Indexing & Thresholding' },
  vpn_mesh: { inr: 20000, usd: 300, name: 'Tailscale Zero-Trust WireGuard VPN Mesh' },
  whatsapp_api: { inr: 15000, usd: 200, name: 'Meta WhatsApp Cloud API Automation (<15s)' },
  websockets: { inr: 15000, usd: 200, name: 'Realtime WebSocket Sync (<100ms)' },
  qlora_tuning: { inr: 45000, usd: 600, name: 'QLoRA Parameter-Efficient Model Fine-Tuning' },
  excel_reporter: { inr: 15000, usd: 200, name: 'OpenPyXL Regulatory Excel Report Engine' }
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const WEBSITE_DIR = path.resolve(__dirname, '..', 'website');

function serveStatic(res, pathname) {
  let decodedPath = decodeURIComponent(pathname);
  if (decodedPath === '/' || decodedPath === '') {
    decodedPath = '/index.html';
  }
  if (decodedPath.startsWith('/website/')) {
    decodedPath = decodedPath.replace(/^\/website/, '');
  }

  // Prevent path traversal outside WEBSITE_DIR
  const safePath = path.normalize(path.join(WEBSITE_DIR, decodedPath));
  if (!safePath.startsWith(WEBSITE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden');
  }

  let targetFile = safePath;
  if (!fs.existsSync(targetFile) && !path.extname(targetFile)) {
    if (fs.existsSync(targetFile + '.html')) {
      targetFile = targetFile + '.html';
    }
  }

  try {
    if (fs.existsSync(targetFile)) {
      let stats = fs.statSync(targetFile);
      if (stats.isDirectory()) {
        const indexFile = path.join(targetFile, 'index.html');
        if (fs.existsSync(indexFile)) {
          targetFile = indexFile;
          stats = fs.statSync(targetFile);
        }
      }
      if (stats.isFile()) {
        const ext = path.extname(targetFile).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const content = fs.readFileSync(targetFile);
        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': content.length,
          'Access-Control-Allow-Origin': '*'
        });
        return res.end(content);
      }
    }
  } catch (_) {
    // Fall through to 404
  }

  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px;text-align:center;background:#030508;color:#fff;">
    <h2>404 — Resource Not Found</h2>
    <p style="color:#888;">The requested path <code>${pathname}</code> was not found.</p>
    <p><a href="/" style="color:#00D4FF;">← Return to ASVEX Technologies</a></p>
  </body></html>`);
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJSON(res, 200, {
      status: 'OPERATIONAL',
      agency: 'ASVEX Technologies',
      founder: 'Abhayraj Singh',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST' && pathname === '/api/estimate') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const archetypeKey = payload.archetype || 'ai_rag';
        const features = Array.isArray(payload.features) ? payload.features : [];
        const currency = (payload.currency || 'INR').toUpperCase() === 'USD' ? 'USD' : 'INR';

        const arch = ARCHETYPES[archetypeKey] || ARCHETYPES.ai_rag;
        let minPrice = currency === 'USD' ? arch.baseUsd[0] : arch.baseInr[0];
        let maxPrice = currency === 'USD' ? arch.baseUsd[1] : arch.baseInr[1];

        const selectedAddons = [];
        features.forEach((fKey) => {
          if (FEATURE_ADDONS[fKey]) {
            selectedAddons.push(FEATURE_ADDONS[fKey].name);
            minPrice += currency === 'USD' ? FEATURE_ADDONS[fKey].usd : FEATURE_ADDONS[fKey].inr;
            maxPrice += currency === 'USD' ? FEATURE_ADDONS[fKey].usd : FEATURE_ADDONS[fKey].inr;
          }
        });

        return sendJSON(res, 200, {
          success: true,
          archetype: arch.name,
          subtitle: arch.subtitle,
          timeline: arch.timelineWeeks,
          currency,
          estimateMin: minPrice,
          estimateMax: maxPrice,
          formattedPrice:
            currency === 'USD'
              ? `$${minPrice.toLocaleString('en-US')} – $${maxPrice.toLocaleString('en-US')}`
              : `₹${minPrice.toLocaleString('en-IN')} – ₹${maxPrice.toLocaleString('en-IN')}`,
          stack: arch.stack,
          selectedAddons,
          deliverables: arch.deliverables
        });
      } catch (_) {
        return sendJSON(res, 400, { success: false, error: 'Invalid JSON payload' });
      }
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/inquiry') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const lead = JSON.parse(body || '{}');
        if (!lead.name || (!lead.email && !lead.phone)) {
          return sendJSON(res, 400, { success: false, error: 'Name and at least Email or Phone are required.' });
        }

        const leadEntry = {
          id: 'LD-' + Date.now().toString(36).toUpperCase(),
          timestamp: new Date().toISOString(),
          name: lead.name,
          company: lead.company || 'Not specified',
          email: lead.email || 'Not specified',
          phone: lead.phone || 'Not specified',
          service: lead.service || 'General Inquiry',
          budget: lead.budget || 'Not specified',
          details: lead.details || lead.message || '',
          status: 'NEW'
        };

        const existing = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8') || '[]');
        existing.unshift(leadEntry);
        fs.writeFileSync(LEADS_FILE, JSON.stringify(existing, null, 2));

        console.log(`[LEAD RECEIVED] ${leadEntry.name} (${leadEntry.company}) - ${leadEntry.service}`);

        return sendJSON(res, 201, {
          success: true,
          leadId: leadEntry.id,
          message: 'Inquiry received successfully. Founder Abhayraj Singh will respond within 24 hours.'
        });
      } catch (_) {
        return sendJSON(res, 400, { success: false, error: 'Invalid JSON payload' });
      }
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/audit-request') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const audit = JSON.parse(body || '{}');
        if (!audit.name || !(audit.contact || audit.email || audit.phone)) {
          return sendJSON(res, 400, { success: false, error: 'Name and contact are required.' });
        }

        const auditEntry = {
          id: 'AUD-' + Date.now().toString(36).toUpperCase(),
          timestamp: new Date().toISOString(),
          name: audit.name,
          contact: audit.contact || audit.email || audit.phone || '',
          bottleneck: audit.bottleneck || audit.process || '',
          status: 'PENDING_SCHEDULE'
        };

        const existing = JSON.parse(fs.readFileSync(AUDITS_FILE, 'utf8') || '[]');
        existing.unshift(auditEntry);
        fs.writeFileSync(AUDITS_FILE, JSON.stringify(existing, null, 2));

        console.log(`[AUDIT REQUEST] ${auditEntry.name} - ${auditEntry.contact}`);

        return sendJSON(res, 201, {
          success: true,
          auditId: auditEntry.id,
          message: 'Free 30-Minute Architecture Audit request logged.'
        });
      } catch (_) {
        return sendJSON(res, 400, { success: false, error: 'Invalid JSON payload' });
      }
    });
    return;
  }

  if (pathname.startsWith('/api/')) {
    return sendJSON(res, 404, { error: 'API route not found' });
  }

  return serveStatic(res, pathname);
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`ASVEX Technologies Server running on http://localhost:${PORT}`);
  console.log(`Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
