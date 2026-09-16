// Netlify Function — POST /api/contact
// Sends the contact payload to Resend (server-side only). The RESEND_API_KEY
// lives in Netlify env vars, never in the client bundle.

const RESEND_URL = 'https://api.resend.com/emails';

const clean = (s: string) => s.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 2000);

export const handler: NetlifyHandler = async (event, _context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server not configured (missing RESEND_API_KEY)' }) };
  }

  let body: { name?: unknown; email?: unknown; message?: unknown };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const name = typeof body.name === 'string' ? clean(body.name).slice(0, 80) : '';
  const email = typeof body.email === 'string' ? clean(body.email).slice(0, 254) : '';
  const message = typeof body.message === 'string' ? clean(body.message) : '';

  if (!name || !email || !message) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'All fields required' }) };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email address' }) };
  }

  const to = process.env.CONTACT_EMAIL ?? 'vishnukannaj97@gmail.com';

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vishnu Portfolio <onboarding@resend.dev>',
        to: [to],
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Email provider rejected the request', detail }) };
    }

    return { statusCode: 202, headers, body: JSON.stringify({ status: 'accepted' }) };
  } catch {
    return { statusCode: 502, headers, body: JSON.stringify({ error: 'Email provider unreachable' }) };
  }
};

type NetlifyHandler = (event: {
  httpMethod: string;
  body: string | null;
}, _context: unknown) => Promise<{ statusCode: number; headers: Record<string, string>; body: string }>;
