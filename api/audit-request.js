/**
 * ASVEX Technologies — 30-Minute Architecture Audit Request API (Vercel Serverless)
 * POST /api/audit-request
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body);
  } catch (_) {
    return {};
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = parseBody(req);
  if (!body.name || !body.contact) {
    return res.status(400).json({ error: 'Name and email/phone contact are required.' });
  }

  const newAudit = {
    id: 'AUD-' + Date.now().toString(36).toUpperCase(),
    name: String(body.name).trim(),
    contact: String(body.contact).trim(),
    bottleneck: String(body.bottleneck || 'General Architecture & Automation Review').trim(),
    preferredSlot: String(body.preferredSlot || 'Flexible').trim(),
    createdAt: new Date().toISOString()
  };

  // Structured log visible in Vercel Runtime Logs
  console.log('[ASVEX_AUDIT_REQUEST]', JSON.stringify(newAudit));

  // Ephemeral serverless /tmp storage
  try {
    const tmpFile = path.join(os.tmpdir(), 'asvex-audits.json');
    let existing = [];
    if (fs.existsSync(tmpFile)) {
      existing = JSON.parse(fs.readFileSync(tmpFile, 'utf8'));
    }
    existing.unshift(newAudit);
    fs.writeFileSync(tmpFile, JSON.stringify(existing, null, 2));
  } catch (_) {
    // Safe fallback on serverless cold container
  }

  // Optional webhook forwarding (e.g. n8n / Slack / Discord / Telegram if configured in Vercel Env)
  if (process.env.WEBHOOK_URL && typeof fetch === 'function') {
    try {
      await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'audit_request', data: newAudit })
      });
    } catch (err) {
      console.error('[ASVEX_WEBHOOK_ERR]', err.message);
    }
  }

  return res.status(201).json({
    success: true,
    auditId: newAudit.id,
    message: '30-Minute Architecture Audit requested. Direct calendar invite incoming.'
  });
};
