import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * GET /api/opportunities
 * Returns intervention OPPORTUNITIES (growth, adoption, cross-sell, volume) for Lovable.
 * Query: ?limit=N, ?merchantId=, ?category=
 */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    const raw = readFileSync(join(__dirname, 'data-with-outputs.json'), 'utf8');
    const { opportunities } = JSON.parse(raw);
    let list = [...opportunities];

    const { limit, merchantId, category } = req.query || {};
    if (merchantId) list = list.filter((i) => i.merchantId === merchantId);
    if (category) list = list.filter((i) => i.category === category);
    const n = limit ? Math.min(parseInt(limit, 10) || 10, list.length) : list.length;
    list = list.slice(0, n);

    res.status(200).json({
      source: 'KAM 360 Gen-AI agents',
      outputType: 'opportunities',
      updatedAt: new Date().toISOString(),
      opportunities: list,
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load opportunities', message: e.message });
  }
}
