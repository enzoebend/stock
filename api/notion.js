export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Notion-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint } = req.query;
  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });

  const token = req.headers['authorization'];
  const notionVersion = req.headers['notion-version'] || '2022-06-28';

  try {
    const notionRes = await fetch(`https://api.notion.com/v1/${endpoint}`, {
      method: req.method,
      headers: {
        'Authorization': token,
        'Notion-Version': notionVersion,
        'Content-Type': 'application/json'
      },
      body: ['POST', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined
    });

    const data = await notionRes.json();
    return res.status(notionRes.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
