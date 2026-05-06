# Live MID 147203 from Redshift

Run interventions (opportunities + alerts) for **MID 147203** using your Redshift tables.

---

## 1. Configure Redshift connection and schema

1. Copy the example config:
   ```bash
   cp scripts/redshift_config.example.json scripts/redshift_config.json
   ```

2. Edit `scripts/redshift_config.json`:
   - **cluster_endpoint** — Redshift cluster host (e.g. `my-cluster.xxxxx.ap-south-1.redshift.amazonaws.com`)
   - **port** — usually `5439`
   - **database** — your database name
   - **user** / **password** — DB credentials (or use IAM auth if you change the script)
   - **mid_value** — `147203` (or another MID)
   - **schema** — your **schema name**, **transactions table name**, and **column names** (mid, amount, status, txn_date, failure_reason, payment_method, issuer_bank, created_at). Use the exact column names from your Redshift table.

---

## 2. Install Python dependency

Use **pip3** (or **pip** if you have it):

```bash
pip3 install redshift_connector
```

If that fails, try: `python3 -m pip install redshift_connector`

---

## 3. Run the script

From the repo root, use **python3** (or **python** if you have it):

```bash
python3 scripts/query_mid_147203.py
```

- The script connects to Redshift, runs queries for MID 147203 (summary, failure reasons, payment mix, volume trend), and builds **opportunities** and **alerts** from the results.
- It writes **api/live-mid-147203.json** (so the API can serve this data).

---

## 4. Deploy so Lovable can use it

```bash
git add api/live-mid-147203.json
git commit -m "Live MID 147203 data from Redshift"
git push origin main
```

After deploy, Lovable can call:

- **Opportunities for MID 147203:**  
  `GET https://kam360new.vercel.app/api/opportunities?mid=147203`

- **Alerts for MID 147203:**  
  `GET https://kam360new.vercel.app/api/alerts?mid=147203`

If `live-mid-147203.json` is not in the repo yet, these URLs still work and return the static opportunities/alerts (no MID filter). Once the file is committed and pushed, they return **live Redshift-derived data** for MID 147203.

---

## 5. Refreshing live data

Re-run the script whenever you want to refresh (e.g. daily cron or on-demand):

```bash
python3 scripts/query_mid_147203.py
git add api/live-mid-147203.json && git commit -m "Refresh live MID 147203" && git push origin main
```

---

## 6. Finding your table and column names in Redshift

If you’re not sure of schema/table/columns:

1. Use **Redshift MCP** in Cursor (with AWS credentials configured): run `list_clusters` → `list_databases` → `list_schemas` → `list_tables` → `list_columns` for the table that has transaction/MID data.
2. Or in Redshift Query Editor:  
   `SELECT * FROM information_schema.columns WHERE table_schema = 'your_schema' AND table_name = 'your_table';`  
   Then set the same names in `redshift_config.json`.
