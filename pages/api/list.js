import * as scraper from '../../lib/scraper';

const VALID = ['latest', 'colored', 'manga', 'manhwa', 'manhua', 'mangaList'];

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  const { type, page = 1 } = req.query;
  if (!VALID.includes(type)) return res.status(400).json({ status: false, message: 'Invalid type' });
  const fn = scraper[type];
  if (typeof fn !== 'function') return res.status(400).json({ status: false, message: 'Not a function' });
  const result = await fn(Number(page));
  res.status(result.status ? 200 : 500).json(result);
}
