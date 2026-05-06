import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * GET /api/opportunities
 * Returns intervention OPPORTUNITIES for Lovable.
 * Query: ?limit=N, ?merchantId=, ?category=, ?mid=147203 (live Redshift data for MID 147203)
 */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    const { limit, merchantId, category, mid } = req.query || {};
    let list;
    let source = 'KAM 360 Gen-AI agents';
    let updatedAt = new Date().toISOString();

    if (mid === '147203') {
      try {
        const liveRaw = readFileSync(join(__dirname, 'live-mid-147203.json'), 'utf8');
        const live = JSON.parse(liveRaw);
        list = live.opportunities || [];
        source = live.source || source;
        updatedAt = live.updatedAt || updatedAt;
      } catch {
        list = [];
      }
    }

    if (!list || list.length === 0) {
      const raw = readFileSync(join(__dirname, 'data-with-outputs.json'), 'utf8');
      const { opportunities } = JSON.parse(raw);
      list = [...opportunities];
    }

    if (merchantId) list = list.filter((i) => i.merchantId === merchantId);
    if (category) list = list.filter((i) => i.category === category);
    const n = limit ? Math.min(parseInt(limit, 10) || 10, list.length) : list.length;
    list = list.slice(0, n);

    res.status(200).json({
      source,
      outputType: 'opportunities',
      updatedAt,
      opportunities: list,
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load opportunities', message: e.message });
  }
}
