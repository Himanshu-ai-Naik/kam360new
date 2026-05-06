#!/usr/bin/env python3
"""
Query Redshift for live MID 147203 and generate opportunities + alerts JSON for the API.

Usage:
  1. Copy redshift_config.example.json to redshift_config.json and fill in your cluster, DB, schema, and column names.
  2. pip install redshift_connector
  3. python scripts/query_mid_147203.py

Output: writes api/live-mid-147203.json (opportunities + alerts for MID 147203).
Then commit and push so https://kam360new.vercel.app/api/opportunities?mid=147203 and ?mid=147203 for alerts serve this data.
"""

import json
import os
import sys
from pathlib import Path

try:
    import redshift_connector
except ImportError:
    print("Install: pip3 install redshift_connector  (or: python3 -m pip install redshift_connector)")
    sys.exit(1)

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
CONFIG_PATH = SCRIPT_DIR / "redshift_config.json"
OUTPUT_PATH = REPO_ROOT / "api" / "live-mid-147203.json"

# Default column names if not in config (override in redshift_config.json)
DEFAULT_COLUMNS = {
    "mid": "mid",
    "amount": "amount",
    "status": "status",
    "txn_date": "txn_date",
    "failure_reason": "failure_reason",
    "payment_method": "payment_method",
    "issuer_bank": "issuer_bank",
    "created_at": "created_at",
}


def load_config():
    if not CONFIG_PATH.exists():
        print(f"Create {CONFIG_PATH} from scripts/redshift_config.example.json and set cluster, database, schema, columns.")
        sys.exit(1)
    with open(CONFIG_PATH) as f:
        return json.load(f)


def run_query(conn, sql):
    with conn.cursor() as cur:
        cur.execute(sql)
        columns = [d[0] for d in cur.description]
        rows = cur.fetchall()
    return [dict(zip(columns, row)) for row in rows]


def build_live_output(mid_value, summary, failure_reasons, payment_mix, volume_trend):
    """Build opportunities and alerts for MID from Redshift results."""
    opportunities = []
    alerts = []
    now_iso = "2026-03-10T15:00:00.000Z"

    success_rate = summary[0].get("success_rate_pct") if summary else None
    total_txns = summary[0].get("total_txns") if summary else 0
    total_volume = summary[0].get("total_volume") if summary else 0

    # Alert: Success rate drop (if < 90%)
    if success_rate is not None and success_rate < 90:
        alerts.append({
            "id": "live-alt-1",
            "priorityRank": 1,
            "category": "Success Rate Drop",
            "merchantId": f"mid-{mid_value}",
            "merchantName": f"Merchant (MID {mid_value})",
            "midId": str(mid_value),
            "mids": 1,
            "title": "Success Rate Below 90%",
            "description": f"Current success rate {success_rate}% for MID {mid_value}. Investigate bank outage or routing.",
            "triggerSignal": "Success rate below 90%",
            "recommendedAction": "Investigate bank outage or routing issue",
            "severity": "critical",
            "triggeredAt": now_iso,
            "metric": "Payment success rate",
            "threshold": "90%",
            "current": f"{success_rate}%",
            "timeWindow": "live",
            "affectedIssuer": None,
            "aiImpact": f"Restoring success rate can recover revenue at risk for MID {mid_value}.",
            "aiSuggestions": ["Check failure reasons and bank/PSP distribution.", "Consider fallback routing or retry logic."],
            "actions": ["Pick Task", "Root Cause", "Play Book", "Ignore"],
            "agentId": "sr-recovery",
        })

    # Opportunity: Payment method optimization (from payment_mix)
    if payment_mix and len(payment_mix) > 1:
        best = payment_mix[0]
        opportunities.append({
            "id": "live-opp-1",
            "priorityRank": 9,
            "category": "Payment Method Optimization",
            "merchantId": f"mid-{mid_value}",
            "merchantName": f"Merchant (MID {mid_value})",
            "midId": str(mid_value),
            "mids": 1,
            "title": "Payment Method Optimization",
            "insight": f"Best-performing method: {best.get('payment_method', 'N/A')} with {best.get('pct', 0)}% of volume.",
            "description": "Reorder checkout payment methods by success rate to improve conversion.",
            "estimatedUplift": "Varies by method mix",
            "aiImpact": "Surfacing higher-success methods first can improve overall conversion.",
            "aiSuggestions": ["Reorder payment methods by success rate.", "A/B test order on checkout."],
            "actions": ["Pick Task", "Play Book", "Ignore"],
            "agentId": "sr-recovery",
        })

    # Opportunity: Retry (if failure reasons show recoverable codes)
    if failure_reasons:
        top_reason = failure_reasons[0]
        opportunities.append({
            "id": "live-opp-2",
            "priorityRank": 8,
            "category": "Retry Optimization",
            "merchantId": f"mid-{mid_value}",
            "merchantName": f"Merchant (MID {mid_value})",
            "midId": str(mid_value),
            "mids": 1,
            "title": "Retry Optimization",
            "insight": f"Top failure: {top_reason.get('failure_reason', 'N/A')} ({top_reason.get('decline_count', 0)} declines).",
            "description": "Enable Smart Retry for recoverable failures.",
            "estimatedUplift": "Recover a share of failed volume",
            "aiImpact": "Smart retry can recover transactions that succeed on retry.",
            "aiSuggestions": ["Enable Smart Retry for failed transactions.", "Set retry window by payment method."],
            "actions": ["Pick Task", "Play Book", "Ignore"],
            "agentId": "sr-recovery",
        })

    # If no alerts from rules, add a placeholder so the feed isn’t empty
    if not alerts:
        alerts.append({
            "id": "live-alt-0",
            "priorityRank": 0,
            "category": "Live Monitoring",
            "merchantId": f"mid-{mid_value}",
            "merchantName": f"Merchant (MID {mid_value})",
            "midId": str(mid_value),
            "mids": 1,
            "title": "Live MID 147203 — No active alerts",
            "description": f"Success rate: {success_rate}% | Txns: {total_txns} | Data from Redshift.",
            "triggerSignal": "Periodic check",
            "recommendedAction": "No action required",
            "severity": "high",
            "triggeredAt": now_iso,
            "metric": "Success rate",
            "threshold": "—",
            "current": f"{success_rate}%" if success_rate is not None else "—",
            "timeWindow": "live",
            "affectedIssuer": None,
            "aiImpact": "Data is from live Redshift for this MID.",
            "aiSuggestions": [],
            "actions": ["Pick Task", "Ignore"],
            "agentId": "sr-recovery",
        })

    if not opportunities:
        opportunities.append({
            "id": "live-opp-0",
            "priorityRank": 20,
            "category": "Industry Benchmark Gap",
            "merchantId": f"mid-{mid_value}",
            "merchantName": f"Merchant (MID {mid_value})",
            "midId": str(mid_value),
            "mids": 1,
            "title": "Live MID 147203 — Opportunities",
            "insight": f"Success rate {success_rate}%, volume {total_volume}. Review failure reasons and payment mix in Redshift.",
            "description": "Use Redshift data to identify optimization levers.",
            "estimatedUplift": "See failure and mix analysis",
            "aiImpact": "Data is from live Redshift for this MID.",
            "aiSuggestions": ["Review failure_reason and payment_method in Redshift.", "Compare to industry benchmarks."],
            "actions": ["Pick Task", "Play Book", "Ignore"],
            "agentId": "orchestrator",
        })

    return {
        "mid": mid_value,
        "source": "KAM 360 Gen-AI agents (live Redshift)",
        "updatedAt": now_iso,
        "opportunities": opportunities,
        "alerts": alerts,
    }


def main():
    config = load_config()
    mid_value = config.get("mid_value", 147203)
    schema_name = config["schema"]["schema_name"]
    table = config["schema"]["transactions_table"]
    cols = {**DEFAULT_COLUMNS, **config["schema"].get("columns", {})}

    mid_col = cols["mid"]
    amount_col = cols["amount"]
    status_col = cols["status"]
    date_col = cols.get("txn_date") or cols.get("created_at")
    failure_col = cols.get("failure_reason")
    method_col = cols.get("payment_method")
    issuer_col = cols.get("issuer_bank")

    conn = redshift_connector.connect(
        host=config["cluster_endpoint"],
        port=config.get("port", 5439),
        database=config["database"],
        user=config["user"],
        password=config["password"],
    )

    try:
        # Summary for MID
        summary_sql = f"""
        SELECT
          {mid_col} AS mid,
          COUNT(*) AS total_txns,
          SUM(CASE WHEN LOWER(CAST({status_col} AS VARCHAR)) IN ('success','approved','completed') THEN 1 ELSE 0 END) AS success_txns,
          ROUND(100.0 * SUM(CASE WHEN LOWER(CAST({status_col} AS VARCHAR)) IN ('success','approved','completed') THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2) AS success_rate_pct,
          SUM(CAST({amount_col} AS FLOAT)) AS total_volume,
          MIN({date_col}) AS first_txn,
          MAX({date_col}) AS last_txn
        FROM {schema_name}.{table}
        WHERE {mid_col} = {mid_value}
        GROUP BY {mid_col}
        """
        summary = run_query(conn, summary_sql)

        # Failure reasons
        failure_reasons = []
        if failure_col:
            fr_sql = f"""
            SELECT {failure_col} AS failure_reason, COUNT(*) AS decline_count
            FROM {schema_name}.{table}
            WHERE {mid_col} = {mid_value} AND LOWER(CAST({status_col} AS VARCHAR)) NOT IN ('success','approved','completed')
            GROUP BY {failure_col}
            ORDER BY decline_count DESC
            LIMIT 10
            """
            failure_reasons = run_query(conn, fr_sql)

        # Payment method mix
        payment_mix = []
        if method_col:
            pm_sql = f"""
            SELECT {method_col} AS payment_method, COUNT(*) AS txns,
                   ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS pct
            FROM {schema_name}.{table}
            WHERE {mid_col} = {mid_value}
            GROUP BY {method_col}
            ORDER BY txns DESC
            LIMIT 10
            """
            payment_mix = run_query(conn, pm_sql)

        # Volume trend (last 12 weeks)
        volume_trend = []
        if date_col:
            vt_sql = f"""
            SELECT DATE_TRUNC('week', {date_col}) AS week_start, COUNT(*) AS txns, SUM(CAST({amount_col} AS FLOAT)) AS volume
            FROM {schema_name}.{table}
            WHERE {mid_col} = {mid_value}
            GROUP BY 1
            ORDER BY 1 DESC
            LIMIT 12
            """
            volume_trend = run_query(conn, vt_sql)

        out = build_live_output(mid_value, summary, failure_reasons, payment_mix, volume_trend)
        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(OUTPUT_PATH, "w") as f:
            json.dump(out, f, indent=2)
        print(f"Wrote {OUTPUT_PATH} (opportunities: {len(out['opportunities'])}, alerts: {len(out['alerts'])}).")
        print("Commit and push so /api/opportunities?mid=147203 and /api/alerts?mid=147203 serve this data.")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
