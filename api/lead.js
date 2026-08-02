export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, phone, city, message } = req.body || {}

  if (!name || !phone || !city) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const token = process.env.TG_BOT_TOKEN
  const chatId = process.env.TG_CHAT_ID

  if (!token || !chatId) {
    return res.status(500).json({ error: 'Server is not configured' })
  }

  const text =
    `Новая заявка с сайта\n\n` +
    `Имя: ${name}\n` +
    `Телефон: ${phone}\n` +
    `Город: ${city}\n` +
    `Комментарий: ${message || '—'}`

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })

    if (!tgRes.ok) {
      const err = await tgRes.text()
      console.error('Telegram error:', err)
      return res.status(502).json({ error: 'Telegram request failed' })
    }

    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error('Lead handler error:', e)
    return res.status(500).json({ error: 'Internal error' })
  }
}
