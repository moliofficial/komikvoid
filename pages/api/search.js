import { search } from '../../lib/scraper';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { q, page = 1 } = req.query;
  if (!q) return res.status(400).json({ status: false, message: 'Query required' });
  const result = await search(q, Number(page));
  res.status(result.status ? 200 : 500).json(result);
}
