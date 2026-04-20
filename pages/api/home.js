import { home } from '../../lib/scraper';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const result = await home();
  res.status(result.status ? 200 : 500).json(result);
}
