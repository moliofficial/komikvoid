import { getByGenre } from '../../lib/scraper';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { slug, page = 1 } = req.query;
  if (!slug) return res.status(400).json({ status: false, message: 'Slug required' });
  const result = await getByGenre(slug, Number(page));
  res.status(result.status ? 200 : 500).json(result);
}
