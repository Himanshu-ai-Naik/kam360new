import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * GET /api/alerts
 * Returns real-time ALERTS (SR recovery, critical/high priority) for Lovable.
 * Query: ?limit=N, ?merchantId=, ?severity=critical|high
 */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    const raw = readFileSync(join(__dirname, 'data-with-outputs.json'), 'utf8');
    const { alerts } = JSON.parse(raw);
    let list = [...alerts];

    const { limit, merchantId, severity } = req.query || {};
    if (merchantId) list = list.filter((i) => i.merchantId === merchantId);
    if (severity) list = list.filter((i) => i.severity === severity);
    const n = limit ? Math.min(parseInt(limit, 10) || 10, list.length) : list.length;
    list = list.slice(0, n);

    res.status(200).json({
      source: 'KAM 360 Gen-AI agents',
      outputType: 'alerts',
      updatedAt: new Date().toISOString(),
      alerts: list,
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load alerts', message: e.message });
  }
}
