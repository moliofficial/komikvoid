import { detail } from '../../lib/scraper';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { url } = req.query;
  if (!url) return res.status(400).json({ status: false, message: 'URL required' });
  const result = await detail(decodeURIComponent(url));
  res.status(result.status ? 200 : 500).json(result);
}
