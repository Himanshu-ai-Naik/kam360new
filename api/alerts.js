import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * GET /api/alerts
 * Returns real-time ALERTS for Lovable.
 * Query: ?limit=N, ?merchantId=, ?severity=critical|high, ?mid=147203 (live Redshift data for MID 147203)
 */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    const { limit, merchantId, severity, mid } = req.query || {};
    let list;
    let source = 'KAM 360 Gen-AI agents';
    let updatedAt = new Date().toISOString();

    if (mid === '147203') {
      try {
        const liveRaw = readFileSync(join(__dirname, 'live-mid-147203.json'), 'utf8');
        const live = JSON.parse(liveRaw);
        list = live.alerts || [];
        source = live.source || source;
        updatedAt = live.updatedAt || updatedAt;
      } catch {
        list = [];
      }
    }

    if (!list || list.length === 0) {
      const raw = readFileSync(join(__dirname, 'data-with-outputs.json'), 'utf8');
      const { alerts } = JSON.parse(raw);
      list = [...alerts];
    }

    if (merchantId) list = list.filter((i) => i.merchantId === merchantId);
    if (severity) list = list.filter((i) => i.severity === severity);
    const n = limit ? Math.min(parseInt(limit, 10) || 10, list.length) : list.length;
    list = list.slice(0, n);

    res.status(200).json({
      source,
      outputType: 'alerts',
      updatedAt,
      alerts: list,
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load alerts', message: e.message });
  }
}
