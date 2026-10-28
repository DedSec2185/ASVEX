/**
 * ASVEX Technologies — Project Inquiry Capture API (Vercel Serverless)
 * POST /api/inquiry
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
  if (!body.name || (!body.email && !body.phone)) {
    return res.status(400).json({ error: 'Name and contact email/phone are required.' });
  }

  const newLead = {
    id: 'LD-' + Date.now().toString(36).toUpperCase(),
    name: String(body.name).trim(),
    email: String(body.email || '').trim(),
    phone: String(body.phone || '').trim(),
    company: String(body.company || 'Not specified').trim(),
    service: String(body.service || 'Custom Software Architecture').trim(),
    budget: String(body.budget || 'To be scoped').trim(),
    details: String(body.details || '').trim(),
    createdAt: new Date().toISOString(),
    status: 'NEW_INQUIRY'
  };

  // Structured log visible in Vercel Runtime Logs
  console.log('[ASVEX_NEW_INQUIRY]', JSON.stringify(newLead));

  // Ephemeral serverless /tmp storage (never throws on read-only root fs)
  try {
    const tmpFile = path.join(os.tmpdir(), 'asvex-leads.json');
    let existing = [];
    if (fs.existsSync(tmpFile)) {
      existing = JSON.parse(fs.readFileSync(tmpFile, 'utf8'));
    }
    existing.unshift(newLead);
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
        body: JSON.stringify({ event: 'project_inquiry', data: newLead })
      });
    } catch (err) {
      console.error('[ASVEX_WEBHOOK_ERR]', err.message);
    }
  }

  return res.status(201).json({
    success: true,
    leadId: newLead.id,
    message: 'Project specification logged. Abhayraj Singh responds personally within 24 hours.'
  });
};
