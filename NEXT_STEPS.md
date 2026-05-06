# What to do next

You ran `pip3 install redshift_connector` and the script. Follow these steps in order.

---

## Step 1: Check if the script created the live file

Run:

```bash
ls -la /Users/himanshu.naik/Cursor/payu-orbit-ai/api/live-mid-147203.json
```

- **If the file exists** → Go to **Step 3** (commit and push).
- **If "No such file"** → The script likely didn’t reach the part that writes the file. Do **Step 2** first.

---

## Step 2: If the file doesn’t exist — set Redshift config and re-run

1. **Create config from the example:**
   ```bash
   cd /Users/himanshu.naik/Cursor/payu-orbit-ai
   cp scripts/redshift_config.example.json scripts/redshift_config.json
   ```

2. **Edit `scripts/redshift_config.json`** and set:
   - Your Redshift **cluster endpoint** (host)
   - **database**, **user**, **password**
   - **schema_name** and **transactions_table** (the table that has MID and transaction data)
   - **columns** — the real column names for: mid, amount, status, date, failure_reason, payment_method (match your Redshift table)

3. **Run the script from the repo root:**
   ```bash
   cd /Users/himanshu.naik/Cursor/payu-orbit-ai
   python3 scripts/query_mid_147203.py
   ```
   - If you see an error (e.g. connection failed, table not found), fix the config and run again.
   - If it prints something like `Wrote api/live-mid-147203.json`, the file is ready.

---

## Step 3: Commit and push so Lovable can use live MID 147203

From the repo root:

```bash
cd /Users/himanshu.naik/Cursor/payu-orbit-ai
git add api/opportunities.js api/alerts.js api/live-mid-147203.json .gitignore scripts/ scripts/README_LIVE_MID.md scripts/query_mid_147203.py scripts/redshift_config.example.json
git status
```

- If `api/live-mid-147203.json` is still missing, run the script again (Step 2) until it’s created, or skip adding that file and just commit the API + scripts (then `?mid=147203` will use static data until you add the file later).

Then:

```bash
git commit -m "Live MID 147203: API supports ?mid=147203, Redshift script, docs"
git push origin main
```

---

## Step 4: Use it in Lovable

After Vercel finishes deploying (1–2 minutes), Lovable can call:

- **Opportunities for MID 147203:**  
  `https://kam360new.vercel.app/api/opportunities?mid=147203`

- **Alerts for MID 147203:**  
  `https://kam360new.vercel.app/api/alerts?mid=147203`

If you pushed `api/live-mid-147203.json`, these return **live Redshift–based** data for MID 147203. If you didn’t push that file yet, they return the default (static) opportunities/alerts.

---

## Step 5: Refresh live data later

Whenever you want to refresh from Redshift:

```bash
cd /Users/himanshu.naik/Cursor/payu-orbit-ai
python3 scripts/query_mid_147203.py
git add api/live-mid-147203.json
git commit -m "Refresh live MID 147203 from Redshift"
git push origin main
```

---

**Summary:**  
1) Confirm `api/live-mid-147203.json` exists; if not, set `redshift_config.json` and re-run the script.  
2) Commit and push (API + script + live file if present).  
3) Use the two URLs above in Lovable for live MID 147203.
