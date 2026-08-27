/**
 * ============================================================================
 * Ashish Rewaskar — Graphic Designer Portfolio
 * Backend Server: Express + Resend (Email) + Twilio (SMS)
 * ============================================================================
 * Serves all static portfolio files AND handles secure form submissions.
 * API keys live here on the server — NEVER in the browser.
 * ============================================================================
 */

'use strict';

const path    = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const { Resend } = require('resend');
const twilio  = require('twilio');

// Load environment variables from .env
require('dotenv').config();

// ─── Validate required environment variables ──────────────────────────────────
const REQUIRED_ENV = [
  'RESEND_API_KEY',
  'TO_EMAIL',
  'FROM_EMAIL',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'TO_PHONE',
];

const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key] || process.env[key].includes('REPLACE'));
if (missingEnv.length) {
  console.warn('\n⚠️  WARNING: The following .env variables are not configured:');
  missingEnv.forEach((k) => console.warn(`   → ${k}`));
  console.warn('   Email/SMS will be SKIPPED until keys are filled in.\n');
}

// ─── Service Clients ──────────────────────────────────────────────────────────
const resend = new Resend(process.env.RESEND_API_KEY || 'dummy');

const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && !process.env.TWILIO_ACCOUNT_SID.includes('REPLACE')
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

// ─── Express App Setup ────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request bodies
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
// Max 5 contact form submissions per IP per 15 minutes
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many messages sent. Please wait 15 minutes before trying again.',
  },
  // Use X-Forwarded-For only when behind a trusted proxy (e.g. Nginx/Vercel)
  // For local dev, use the default (req.ip)
});

// ─── Static Files ─────────────────────────────────────────────────────────────
// Serve all portfolio files (HTML, CSS, JS, assets) from the project root
app.use(express.static(path.join(__dirname)));

// ─── Helper: Build Email HTML ─────────────────────────────────────────────────
function buildEmailHtml({ name, email, service, message, receivedAt }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project Inquiry</title>
  <style>
    body { margin: 0; padding: 0; background: #0f0f17; font-family: 'Segoe UI', Arial, sans-serif; color: #e2e8f0; }
    .wrapper { max-width: 620px; margin: 40px auto; background: #13141f; border-radius: 16px; overflow: hidden; border: 1px solid rgba(139,92,246,0.25); }
    .header  { background: linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #06b6d4 100%); padding: 32px 36px; }
    .header h1 { margin: 0; font-size: 1.5rem; font-weight: 700; color: #fff; }
    .header p  { margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 0.9rem; }
    .body { padding: 32px 36px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 0.78rem; font-weight: 600; color: #8b5cf6; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
    .value { font-size: 1rem; color: #f1f5f9; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 14px; }
    .message-box { white-space: pre-wrap; line-height: 1.6; }
    .divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0; }
    .footer { padding: 20px 36px; background: rgba(255,255,255,0.02); font-size: 0.8rem; color: #64748b; border-top: 1px solid rgba(255,255,255,0.06); }
    .reply-hint { margin-top: 24px; padding: 14px 16px; background: rgba(139,92,246,0.1); border: 1px solid rgba(139,92,246,0.25); border-radius: 8px; font-size: 0.88rem; color: #c084fc; }
    a { color: #8b5cf6; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🎨 New Project Inquiry</h1>
      <p>Someone submitted a message on your portfolio website</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">👤 Client Name</div>
        <div class="value">${escapeHtml(name)}</div>
      </div>
      <div class="field">
        <div class="label">📧 Client Email</div>
        <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
      </div>
      <div class="field">
        <div class="label">🎨 Design Category</div>
        <div class="value">${escapeHtml(service || 'General Inquiry')}</div>
      </div>
      <div class="field">
        <div class="label">📅 Received At</div>
        <div class="value">${escapeHtml(receivedAt)}</div>
      </div>
      <hr class="divider">
      <div class="field">
        <div class="label">📝 Project Details</div>
        <div class="value message-box">${escapeHtml(message)}</div>
      </div>
      <div class="reply-hint">
        💡 <strong>Tip:</strong> Hit "Reply" in your email client to respond directly to <strong>${escapeHtml(email)}</strong>
      </div>
    </div>
    <div class="footer">
      This email was generated automatically from your portfolio contact form at ashishrewasakar.portfolio · Do not share this email externally.
    </div>
  </div>
</body>
</html>
`.trim();
}

// ─── Helper: Escape HTML ──────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── Helper: Format Date for India ───────────────────────────────────────────
function formatIST() {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day:    '2-digit',
    month:  'short',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// ─── POST /api/contact ────────────────────────────────────────────────────────
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, service, message, _honeypot } = req.body;

    // ── Honeypot bot check ────────────────────────────────────────────────────
    // Real users never see or fill _honeypot. If it has a value, it's a bot.
    if (_honeypot && _honeypot.trim() !== '') {
      // Silently accept to not reveal detection to bots
      return res.json({ success: true, message: "Message sent successfully! I'll get back to you soon." });
    }

    // ── Server-side validation ────────────────────────────────────────────────
    const errors = [];

    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters.');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push('A valid email address is required.');
    }
    if (!message || message.trim().length < 10) {
      errors.push('Project details must be at least 10 characters.');
    }
    if (name && name.trim().length > 100) {
      errors.push('Name is too long (max 100 characters).');
    }
    if (message && message.trim().length > 5000) {
      errors.push('Message is too long (max 5000 characters).');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    const cleanName    = name.trim();
    const cleanEmail   = email.trim().toLowerCase();
    const cleanService = (service || 'General Inquiry').trim();
    const cleanMessage = message.trim();
    const receivedAt   = formatIST();

    // ── Send Email via Resend ─────────────────────────────────────────────────
    let emailSent = false;
    const resendConfigured =
      process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('REPLACE');

    if (resendConfigured) {
      try {
        const emailResult = await resend.emails.send({
          from:     `${process.env.FROM_NAME || 'Ashish Portfolio'} <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
          to:       [process.env.TO_EMAIL],
          reply_to: cleanEmail,
          subject:  `🎨 New Project Inquiry — ${cleanService} from ${cleanName}`,
          html:     buildEmailHtml({ name: cleanName, email: cleanEmail, service: cleanService, message: cleanMessage, receivedAt }),
        });
        emailSent = true;
        console.log(`✅ Email sent | id: ${emailResult?.data?.id} | to: ${process.env.TO_EMAIL}`);
      } catch (emailErr) {
        console.error('❌ Email send failed:', emailErr.message);
        // Don't crash — attempt SMS even if email fails
      }
    } else {
      console.log('⚠️  Resend not configured — skipping email. Fill RESEND_API_KEY in .env');
    }

    // ── Send SMS via Twilio ───────────────────────────────────────────────────
    let smsSent = false;
    const twilioConfigured =
      process.env.TWILIO_ACCOUNT_SID &&
      !process.env.TWILIO_ACCOUNT_SID.includes('REPLACE') &&
      twilioClient;

    if (twilioConfigured) {
      try {
        const smsResult = await twilioClient.messages.create({
          body: `New project inquiry received from ${cleanName}. Check your email for the complete project details.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to:   process.env.TO_PHONE,
        });
        smsSent = true;
        console.log(`✅ SMS sent | sid: ${smsResult.sid} | to: ${process.env.TO_PHONE}`);
      } catch (smsErr) {
        console.error('❌ SMS send failed:', smsErr.message);
        // Don't crash — email was already sent
      }
    } else {
      console.log('⚠️  Twilio not configured — skipping SMS. Fill TWILIO_* vars in .env');
    }

    // ── Log submission to console (always) ────────────────────────────────────
    console.log(`\n📬 Form Submission [${receivedAt}]`);
    console.log(`   Name   : ${cleanName}`);
    console.log(`   Email  : ${cleanEmail}`);
    console.log(`   Service: ${cleanService}`);
    console.log(`   Email Sent: ${emailSent} | SMS Sent: ${smsSent}\n`);

    // ── Always return success to the client ───────────────────────────────────
    // (even if email/SMS not configured yet — don't confuse visitors)
    return res.json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
    });

  } catch (err) {
    console.error('🔥 /api/contact unexpected error:', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
});

// ─── Fallback: serve index.html for all other routes ─────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n🚀 Ashish Rewaskar Portfolio Server');
  console.log(`   Local:  http://localhost:${PORT}`);
  console.log(`   API:    http://localhost:${PORT}/api/contact`);
  console.log('\n📧 Email (Resend):',  process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('REPLACE') ? '✅ Configured' : '⚠️  Not configured');
  console.log('📱 SMS   (Twilio):',  process.env.TWILIO_ACCOUNT_SID && !process.env.TWILIO_ACCOUNT_SID.includes('REPLACE') ? '✅ Configured' : '⚠️  Not configured');
  console.log('\nFill in .env keys to enable real email & SMS delivery.\n');
});
