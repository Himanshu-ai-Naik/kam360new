# Redshift MCP: Discover schema and get insights for MID 147203

Use the [Amazon Redshift MCP Server](https://awslabs.github.io/mcp/servers/redshift-mcp-server) in a session where AWS credentials are available (e.g. `AWS_PROFILE=default` or `~/.aws/credentials`). Run the steps below in order.

---

## Step 1: List clusters

**MCP tool:** `list_clusters`  
**Parameters:** none

Copy the **cluster identifier** (e.g. `my-cluster` or a workgroup name) from the result.

---

## Step 2: List databases

**MCP tool:** `list_databases`  
**Parameters:**
- `cluster_identifier`: (from Step 1)
- `database_name`: `dev` (or the DB you use)

Copy the **database name(s)** you want to query (e.g. `dev`, `analytics`).

---

## Step 3: List schemas

**MCP tool:** `list_schemas`  
**Parameters:**
- `cluster_identifier`: (from Step 1)
- `schema_database_name`: (from Step 2)

Copy the **schema name(s)** (e.g. `public`, `tickit`, `payments`).

---

## Step 4: List tables

**MCP tool:** `list_tables`  
**Parameters:**
- `cluster_identifier`: (from Step 1)
- `table_database_name`: (from Step 2)
- `table_schema_name`: (from Step 3)

Identify the table(s) that contain **merchant / MID / transaction** data (e.g. `transactions`, `sales`, `payments`, `merchant_activity`).

---

## Step 5: List columns for the chosen table(s)

**MCP tool:** `list_columns`  
**Parameters:**
- `cluster_identifier`: (from Step 1)
- `column_database_name`: (from Step 2)
- `column_schema_name`: (from Step 3)
- `column_table_name`: (table name from Step 4)

Note the column names for: **MID/merchant id**, **amount/volume**, **status/success**, **date/time**, **failure_reason** (if any), **payment_method** (if any).

---

## Step 6: Run queries for MID 147203

**MCP tool:** `execute_query`  
**Parameters:**
- `cluster_identifier`: (from Step 1)
- `database_name`: (from Step 2)
- `sql`: (see templates below)

Replace `your_schema`, `your_table`, `mid_column`, `amount_column`, `status_column`, `date_column`, `failure_reason_column` with the actual names from Step 5.

### 6a. Summary for MID 147203

```sql
SELECT
  mid_column AS mid,
  COUNT(*) AS total_txns,
  SUM(CASE WHEN status_column = 'success' THEN 1 ELSE 0 END) AS success_txns,
  ROUND(100.0 * SUM(CASE WHEN status_column = 'success' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2) AS success_rate_pct,
  SUM(amount_column) AS total_volume,
  MIN(date_column) AS first_txn,
  MAX(date_column) AS last_txn
FROM your_schema.your_table
WHERE mid_column = 147203
GROUP BY mid_column;
```

### 6b. Top failure reasons (if column exists)

```sql
SELECT
  failure_reason_column AS failure_reason,
  COUNT(*) AS decline_count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS pct_of_declines
FROM your_schema.your_table
WHERE mid_column = 147203 AND (status_column IS NULL OR status_column <> 'success')
GROUP BY failure_reason_column
ORDER BY decline_count DESC
LIMIT 10;
```

### 6c. Volume / trend (last 12 weeks)

```sql
SELECT
  DATE_TRUNC('week', date_column) AS week_start,
  COUNT(*) AS txns,
  SUM(amount_column) AS volume,
  ROUND(100.0 * SUM(CASE WHEN status_column = 'success' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2) AS success_rate_pct
FROM your_schema.your_table
WHERE mid_column = 147203
GROUP BY 1
ORDER BY 1 DESC
LIMIT 12;
```

---

## If MCP still says "config profile (default) could not be found"

1. In Terminal: `aws configure` (set default profile) or `export AWS_PROFILE=your_profile`.
2. Ensure Cursor / the app that runs the MCP is started **after** setting credentials, or set `AWS_PROFILE` / `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in the MCP config in `~/.cursor/mcp.json` under `env` for `awslabs.redshift-mcp-server`.
3. Retry the MCP tools in a new chat so the MCP process picks up the env.

---

## After you have results

Paste the **table and column names** (from Steps 4–5) or a sample query result here, and I can:
- Give you exact SQL for your schema, and/or
- Wire a “Real insights for MID” flow in the KAM 360 app that uses this structure.
