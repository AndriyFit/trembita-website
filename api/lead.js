export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://trembita.group');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, phone } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  const phoneClean = phone.replace(/[^\d+\-() ]/g, '');
  if (phoneClean.length < 10) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const text = [
    '📋 Нова заявка з trembita.group',
    '',
    `👤 Ім'я: ${name}`,
    `📞 Телефон: ${phoneClean}`,
    `🕐 ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}`,
  ].join('\n');

  const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!tgRes.ok) {
    return res.status(500).json({ error: 'Failed to send notification' });
  }

  return res.status(200).json({ ok: true });
}
