import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * GET /api/insights
 * Returns agent-generated interventions with aiImpact and aiSuggestions for Lovable to consume.
 * Query: ?limit=3 for top N, ?merchantId=m1 to filter by merchant, ?category=Adoption|Cross-sell|Volume Growth|SR Recovery
 */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    const raw = readFileSync(join(__dirname, 'data.json'), 'utf8');
    let interventions = JSON.parse(raw);

    const { limit, merchantId, category } = req.query || {};
    if (merchantId) interventions = interventions.filter((i) => i.merchantId === merchantId);
    if (category) interventions = interventions.filter((i) => i.category === category);
    const n = limit ? Math.min(parseInt(limit, 10) || 10, interventions.length) : interventions.length;
    interventions = interventions.slice(0, n);

    res.status(200).json({
      source: 'KAM 360 Gen-AI agents',
      updatedAt: new Date().toISOString(),
      interventions,
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load insights', message: e.message });
  }
}
