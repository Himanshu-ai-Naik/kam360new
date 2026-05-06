# Agent Roles & Responsibilities — Interventions MVP

This document defines the **roles, use cases, data needs, and guardrails** for the three Gen-AI agents that power the KAM 360 Interventions tab and Playbooks. Payment options are limited to **UPI, netbanking, and Cards** only. Each agent has **7 use cases** (SR Increase, Cross-Sell/Upsell, Playbooks). Use cases that require **no KAM or merchant action** (or only ack) are in a separate section at the end; **routing improvements** are information-only and **not shown to KAMs**.

**Reference design:** Intervention cards with peer view — when a feature is **enabled for peers but not for the merchant**, show **SR and revenue variance** (e.g. “Merchants already benefiting” with current vs projected SR and revenue uplift; “Merchant’s gap” with potential recovery). See [KAM 360 Interventions](https://kam-360.lovable.app/interventions).

---

## 1. Interventions Tab MVP — Primary view and peer view as justification

The Interventions tab is driven by the **existing API output**. Peer view is an **additional justification**, not the only view.

### 1.1 Primary view (existing API output)

The tab must **first** show the current intervention feed from the APIs:

- **Opportunities:** `GET /api/opportunities` (and optionally `?mid=...`, `?limit=...`, `?category=...`). Each item includes: `id`, `title`, `category`, `merchantName`, `merchantId`, `midId`, `insight`, `description`, `estimatedUplift`, `aiImpact`, `aiSuggestions`, `actions`, `agentId`, `priorityRank`, etc.
- **Alerts:** `GET /api/alerts` (same query params). Each item includes: `id`, `title`, `category`, `merchantName`, `triggerSignal`, `recommendedAction`, `severity`, `triggeredAt`, `description`, `metric`, `threshold`, `current`, `timeWindow`, `affectedIssuer`, etc.

The UI renders **intervention cards** from this output (title, insight, recommended action, estimated uplift, severity, action buttons like Create Task, Acknowledge, Snooze, etc.). This remains the **primary** content of the Interventions tab.

### 1.2 Peer view as justification

**Peer view** is a **supporting justification** for an intervention, not a replacement for the API payload. When data is available, the card can show an expandable or inline “Why this?” section that includes:

- **Peer benchmark:** Adoption rate for the recommended feature among comparable merchants and average SR lift / revenue uplift for adopters.
- **Merchants already benefiting:** 1–3 peer merchants who have the feature enabled, with current SR, projected SR, uplift %, and estimated revenue benefit (e.g. ₹X L/mo).
- **Target merchant’s gap:** Current SR vs projected SR if they adopt, the specific gap (e.g. “UPI timeouts during lunch rush not being retried”), and potential recovery (e.g. ₹X L/mo).
- **Also not using:** Optional list of other merchants who could benefit (for prioritisation).

If peer data is missing, the card still shows the full **existing API output**; only the peer-justification block is omitted or marked “Peer data not available”. All numeric claims in the peer block must be **derived from or validated against data**; the AI must not invent peer names or figures (see Guardrails below).

### 1.3 Example: interventions tab table view

The interventions tab can also be shown as a **table** (e.g. for export or list view). Example structure and sample rows:

| Segment   | Company                                                                 | MIDs | Cause                                      | Actionables                                                                                                                                 | SR Delta caused compared to Benchmark |
|-----------|-------------------------------------------------------------------------|------|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| Ecommerce | Flipkart Internet Pvt Ltd.                                              |      | Drops after redirection to ACS page        | Increase Native OTP Adoption (Currently at 32% V/s >80% on segment), enable PayU hosted OTP page in the meantime                            | 8.0%                                 |
| Ecommerce | PHONEPE PRIVATE LIMITED (Pincode/Travel/tickets/offers)                 |      | Drops before redirection to ACS page       | Low native OTP adoption (9%)                                                                                                                 | 3.8%                                 |
|           |                                                                        |      | Drops after redirection to ACS page        |                                                                                                                                             | 1.50%                                |
|           |                                                                        |      | Pincode has no desktop site anymore, have reached out to the KAM, MID has ~10% SRT | Block traffic                                                                                                                               | ~3.5%                                |

- **Segment** — Merchant segment (e.g. Ecommerce). Used for peer benchmark and filtering.
- **Company** — Merchant / company name.
- **MIDs** — Affected MID(s); can be blank if intervention is at merchant level.
- **Cause** — Root cause or observation (e.g. drops after/before ACS, low native OTP, no desktop site).
- **Actionables** — Recommended actions (e.g. increase native OTP adoption, enable hosted OTP page, block traffic).
- **SR Delta caused compared to Benchmark** — Success-rate gap vs segment/benchmark (e.g. 8.0%, 3.8%). Drives prioritisation and peer justification.

Gen-AI output (from APIs or agents) should be mappable to these columns: e.g. `insight` / `triggerSignal` → **Cause**; `recommendedAction` / `aiSuggestions` → **Actionables**; `estimatedUplift` or a dedicated field → **SR Delta caused compared to Benchmark**; `merchantName` → **Company**; `midId` → **MIDs**; segment from peer/segment data → **Segment**.

---

## 2. Agent 1 — SR Increase Agent

### 2.1 Role and responsibility

- **Purpose:** Help KAMs understand **payment method failures** and **Success Rate (SR) improvement opportunities** so they can act on operational issues and enable/optimise payment methods.
- **Outputs:**  
  - **Alerts** — critical, time-sensitive (e.g. PG down, method failure spike).  
  - **Opportunities** — growth/optimisation where **KAM or merchant has a clear action** (e.g. enable another PG). Use cases with no actionable ask (e.g. payment method reordering) appear in Section 7 (done / ack-only). Routing improvements are not shown to KAMs (Section 7.2).
- **Scope:** Payment methods limited to **UPI, netbanking, Cards** only. No wallets, EMI, BNPL, or international in MVP.

### 2.2 Prioritised use cases (7 — all require KAM/merchant action)

| # | Type       | Use case                         | Brief description |
|---|------------|----------------------------------|-------------------|
| 1 | **Alert**  | PG / payment method down         | One or more of UPI, netbanking, or Cards shows sudden, sustained failure (e.g. SR drop >X% in last 30–60 min). Critical; KAM must investigate (PSP/network outage). |
| 2 | **Alert**  | Bank/issuer failure spike        | Failures concentrated in one issuer or bank within a payment method. Notify merchant and suggest reroute or fallback. |
| 3 | **Alert**  | Success rate drop (overall)      | Overall SR drops materially (e.g. >10%) in a short window. Possible routing or systemic issue. |
| 4 | **Alert**  | Transaction volume drop          | Sudden decline in transaction volume (e.g. vs same period yesterday). Possible checkout or integration issue; KAM to check with merchant. |
| 5 | **Alert**  | Recurring payment failure spike  | Recurring failure rate spikes (e.g. token expiry, mandate issues). KAM to notify merchant and suggest token/mandate check or consent flow. |
| 6 | **Opportunity** | Additional PG/method enablement | Evidence of demand or drop-off for a payment method (UPI/netbanking/Cards) that is **disabled** for the merchant. Recommend enabling it; support with peer adoption and typical SR/revenue uplift. |
| 7 | **Opportunity** | Checkout / authentication drop  | Drops after redirection to ACS page or low native OTP adoption vs segment. Recommend increasing native OTP adoption, enabling PayU hosted OTP page, or optimising 3DS flow; support with peer benchmark (e.g. segment >80% native OTP). |

*Payment method order/optimisation* (no direct KAM action; can be executed by system or ack-only) is in **Section 7**. *Routing improvements* are **not shown to KAMs** (Section 7.2).

**Examples (SR Increase):**

| Use case | Example cause | Example actionable |
|----------|----------------|---------------------|
| PG / payment method down | UPI SR dropped to 91% vs 96% benchmark in last 2h; PSP routing failures. | Investigate PSP or network outage; enable fallback routing. |
| Bank/issuer failure spike | 28% of card declines from HDFC in last 72h. | Notify merchant and reroute transactions. |
| Transaction volume drop | Volume down 40% vs same hour yesterday. | Check checkout/integration; possible gateway or redirect issue. |
| Recurring payment failure spike | Recurring failure rate +8% in last 5 days; net banking affected. | Check token expiry or mandate issues; improve consent flow. |
| Additional PG/method enablement | 60% of customers attempt UPI but only Collect enabled. | Enable UPI Intent; keep Collect as fallback. |
| Checkout / authentication drop | Drops after redirection to ACS page; native OTP at 32% vs >80% segment. | Increase native OTP adoption; enable PayU hosted OTP page in the meantime. |

### 2.3 Work the Gen-AI agent performs

- Ingest and interpret **time-series transaction data** (volume, success/failure, method, issuer) at MID level.
- **Detect anomalies:** Compare current SR and failure rates to recent baseline (e.g. same hour yesterday, last 7 days) to flag alerts.
- **Identify gaps:** Compare enabled vs disabled payment methods and failure reasons (e.g. “method not available”) to suggest enablement.
- **Peer view:** For each recommendation, look up peer adoption and aggregate SR/revenue impact for that feature; compute “merchant’s gap” and potential recovery using allowed data only. (Method-order insights that need no KAM action are handled in Section 7.)

### 2.4 Datasets the agent needs (English descriptions)

- **Transaction-level or aggregated payment data:** Per MID: transaction count, success/failure, payment method (UPI, netbanking, Cards), timestamp (at least date and hour), optional issuer/bank.
- **Failure reason / decline reason:** To distinguish “method unavailable”, “bank decline”, “timeout”, etc.
- **Merchant/MID configuration:** Which payment methods (UPI, netbanking, Cards) are enabled per MID.
- **Peer/segment definitions:** How peers are defined (e.g. same industry/MCC, similar volume band) and which MIDs belong to which segment.
- **Peer feature adoption and outcomes:** For features in scope (e.g. “has UPI enabled”, “has Smart Retry”), adoption flag per MID/merchant; and aggregate SR and revenue (or GMV) before/after or for adopters vs non-adopters, for peer view and variance.

### 2.5 Guardrails (see Section 5 for shared rules)

- Alert thresholds (e.g. SR drop %, time window) must be **configurable and documented**; the model must not invent new thresholds.
- **Peer names and numbers** only from the peer/segment and adoption/outcome datasets; no free-form invention of merchant names or revenue figures.
- **Recommendations** must map to one of the seven use cases above and stay within UPI, netbanking, Cards.

---

## 3. Agent 2 — Cross-Sell / Upsell Agent

### 3.1 Role and responsibility

- **Purpose:** Surface **opportunities** to sell or enable additional **product features** that improve retention, revenue, or operations. Core five: **Offers**, **Priority settlements**, **Subscriptions** (recurring), **Tokenisation**, and **UPI autopay/mandate**. Mostly **opportunities**; alerts are secondary and can be added later.
- **Scope:** Payment methods **UPI, netbanking, Cards** only. Features must be real product capabilities (offers, priority settlement, subscription/recurring, tokenisation, UPI autopay, etc.).

### 3.2 Prioritised use cases (7 — all require KAM/merchant action)

| # | Type        | Use case                              | Brief description |
|---|-------------|----------------------------------------|-------------------|
| 1 | Opportunity | **Subscriptions / recurring enablement** | Merchant has or could have recurring revenue (e.g. subscriptions); e-mandate/SI or recurring flow not active or underperforming. Recommend enabling subscriptions/recurring, improving consent flow, or UPI autopay; support with peer benchmarks. |
| 2 | Opportunity | **Offers**                             | Bank/PG or platform offers (e.g. cashback, discount at checkout) not enabled or underused for this merchant. Recommend enabling or promoting relevant offers to increase conversion and volume; show adoption and impact among peers. |
| 3 | Opportunity | **Priority settlements**               | Merchant could benefit from faster settlement (e.g. T+0 or priority settlement). Feature not enabled. Recommend priority settlement; support with peer adoption and typical working-capital/UX benefit. |
| 4 | Opportunity | **Tokenisation / saved cards**         | Repeat customers but low or no token usage; high card failure or drop-off. Recommend enabling tokenisation for Cards; show adoption and impact among peers (peer view as justification). |
| 5 | Opportunity | **UPI autopay / mandate for subscriptions** | Subscription or recurring flow with low mandate creation or high mandate failure. Recommend improving consent flow or enabling UPI autopay; support with peer benchmarks. |
| 6 | Opportunity | **Cost optimisation (method mix)**     | Heavy use of a costlier method (e.g. Cards) where UPI or netbanking could be promoted. KAM/merchant promotes lower-cost methods; support with peer adoption and MDR impact. |
| 7 | Opportunity | **Industry / segment benchmark gap**   | Merchant’s adoption of paid features (offers, priority settlement, tokenisation, subscriptions) below segment benchmark. KAM closes gap with top 1–2 features; peer view as justification. |

*Smart Retry on subscriptions* and *retry optimisation (one-time)*, where the system can execute or only ack is needed, are in **Section 7**.

**Examples (Cross-Sell/Upsell):**

| Use case | Example insight | Example actionable |
|----------|-----------------|---------------------|
| Subscriptions / recurring | Swiggy One has recurring billing potential; no e-mandate/SI active. | Enable e-mandate for renewals; improve consent flow; consider UPI autopay. |
| Offers | Bank cashback at checkout not enabled; segment adoption 65%. | Enable relevant bank/PG offers; show adoption and conversion lift among peers. |
| Priority settlements | Merchant on T+2; similar merchants use T+0 for working capital. | Pitch T+0 or priority settlement; share peer adoption and benefit. |
| Tokenisation | Repeat customers but only 28% have tokenised cards; segment target 60%. | Prompt save card after success; pre-check “Save for next time” for returning users. |
| UPI autopay / mandate | Mandate creation success 62% vs segment 85%; recurring failures high. | Improve consent flow; enable UPI autopay; track mandate creation and recurring SR. |
| Cost optimisation (method mix) | 48% volume on Cards; UPI and netbanking underused and lower MDR. | Promote UPI/netbanking at checkout; share peer mix and cost saving. |
| Industry benchmark gap | Authorization rate 6% lower than segment; 2 paid features not adopted. | Recommend top 2 features (e.g. offers + priority settlement); peer view as justification. |

### 3.3 Work the Gen-AI agent performs

- Identify **recurring vs one-time** and **subscription** flows; **mandate creation success** where data exists.
- Check **offers** and **priority settlement** eligibility and current enablement per MID/merchant.
- Analyse **token usage** (saved card, token-based txns) vs repeat customer base to spot tokenisation opportunity.
- **Peer view (justification):** For each recommendation, pull peer adoption and aggregate SR/revenue variance when data exists; compute “merchant’s gap” and potential recovery; no invented peer names or numbers. (Smart Retry–related insights that can be executed without KAM action are in Section 7.)

### 3.4 Datasets the agent needs (English descriptions)

- **Transaction-level or aggregated data:** Payment method, success/failure, recurring vs one-time flag, subscription/recurring indicator, failure/decline reason, MID, timestamp.
- **Feature flags / product configuration:** Per MID or merchant: Smart Retry (recurring and/or one-time), UPI autopay/mandate, tokenisation, offers enabled, priority settlement enabled, subscription/recurring capability.
- **Mandate and recurring metrics:** Mandate creation attempts and success rate; recurring payment volume and success rate.
- **Offers and settlement:** Which offer programmes and settlement tiers exist; which merchants/MIDs use them; adoption and volume or conversion impact where available.
- **Token usage:** Count or share of transactions using tokens/saved cards vs new card entry.
- **Cost or MDR by method:** Relative cost (e.g. MDR) for UPI, netbanking, Cards for peer comparison and cost-optimisation messaging.
- **Peer/segment and adoption/outcomes:** Segment definition, feature adoption per MID/merchant (offers, priority settlement, Smart Retry, subscriptions, UPI autopay, tokenisation), and aggregate SR/revenue (or GMV) for peer view and variance.

### 3.5 Guardrails (see Section 5 for shared rules)

- All **peer names and metrics** from datasets only.
- **Feature recommendations** only for capabilities that exist in product config (e.g. offers, priority settlement, UPI autopay, tokenisation); no unsupported features.
- Stay within the seven use cases above and UPI, netbanking, Cards.

---

## 4. Agent 3 — Playbooks Agent

### 4.1 Role and responsibility

- **Purpose:** Support the **Playbooks** section of [KAM 360 Interventions](https://kam-360.lovable.app/interventions) in two ways:  
  - **Segment pitch deck:** Generate a pitch deck for a **segment of merchants** (e.g. by industry, size, or behaviour).  
  - **On-demand playbook:** KAM describes a **problem** they want to solve and **pain points/challenges**; the agent generates a playbook (narrative + recommended actions) to pitch the solution to the merchant.
- **Scope:** Content limited to **UPI, netbanking, Cards** and to problems/solutions that align with the SR and Cross-Sell use cases where applicable. No invented data in slides or playbook body.

### 4.2 Prioritised use cases (7)

| # | Use case                     | Brief description |
|---|------------------------------|-------------------|
| 1 | Segment pitch deck — SR      | Generate a short pitch deck for a merchant segment (e.g. “Food delivery”, “Subscriptions”) focused on **SR improvement**: typical failure patterns (UPI/netbanking/Cards), recommended actions (e.g. enable method, Smart Retry), and peer benchmarks. Content must be driven by segment-level aggregates, not single-merchant data. |
| 2 | Segment pitch deck — cross-sell | Same as above but focused on **cross-sell/upsell**: offers, priority settlement, UPI autopay, tokenisation, method mix. Use segment-level adoption and outcome data only. |
| 3 | On-demand playbook — “Low SR” | KAM inputs: pain point = “low success rate” (and optional details, e.g. “UPI timeouts”). Agent produces a playbook: problem summary, 2–4 recommended actions (from SR/Cross-Sell use cases), talking points, and optional peer benchmarks. No metrics that are not from data or explicitly marked as illustrative. |
| 4 | On-demand playbook — “Recurring failures” | KAM inputs: pain point = “recurring payment failures” or “mandate issues”. Agent produces a playbook: root cause options, recommended actions (Smart Retry, UPI autopay, consent flow), talking points, and peer view where data exists. |
| 5 | On-demand playbook — “Cost or method mix” | KAM inputs: pain point = “high payment cost” or “wrong method mix”. Agent produces a playbook: method mix analysis (UPI, netbanking, Cards), recommendations to promote lower-cost methods, and peer benchmarks. All numbers from data or labelled as example. |
| 6 | On-demand playbook — “Offers / conversion” | KAM inputs: pain point = “low conversion” or “want to push offers”. Agent produces a playbook: offer adoption in segment, which offers to enable, placement and messaging, and peer conversion uplift. Data-driven only. |
| 7 | On-demand playbook — “Settlement / working capital” | KAM inputs: pain point = “need faster settlement” or “working capital”. Agent produces a playbook: priority settlement (T+0) benefit, peer adoption, eligibility, and next steps. No invented figures. |

**Examples (Playbooks):**

| Use case | Example KAM input | Example output |
|----------|-------------------|----------------|
| Segment pitch deck — SR | Segment = Ecommerce, focus = SR | Slides: typical UPI/card failure reasons, enable UPI Intent + hosted OTP, segment SR benchmark, next steps. |
| Segment pitch deck — cross-sell | Segment = Subscriptions | Slides: tokenisation and UPI autopay adoption, mandate success benchmarks, top 2 features to pitch. |
| On-demand — Low SR | “Merchant has low SR, UPI timeouts at peak” | Playbook: problem summary, enable Smart Retry + fallback routing, native OTP adoption, talking points. |
| On-demand — Recurring failures | “Recurring payments failing; mandate creation low” | Playbook: root causes (token expiry, consent), enable UPI autopay, improve consent flow, peer benchmarks. |
| On-demand — Cost or method mix | “High MDR; want to reduce cost” | Playbook: current mix vs segment, promote UPI/netbanking, peer cost saving, actions. |
| On-demand — Offers / conversion | “Want to improve conversion; open to offers” | Playbook: segment offer adoption, which offers to enable, placement, peer conversion uplift. |
| On-demand — Settlement / working capital | “Merchant asking for faster settlement” | Playbook: T+0 benefit, eligibility, peer adoption, implementation steps. |

### 4.3 Work the Gen-AI agent performs

- **Segment deck:** Accept segment definition (e.g. industry/MCC, volume band). Query or receive **aggregate** metrics for that segment (SR by method, failure reasons, feature adoption, peer uplift). Generate slides: problem, recommended actions, peer benchmark, next steps. No merchant-specific PII in the deck.
- **On-demand playbook:** Accept KAM free-text input (problem + pain points/challenges). Map to one or more of the seven playbook use cases (and underlying SR/Cross-Sell use cases). Generate structured playbook: problem statement, root cause options, 2–4 recommended actions, talking points, optional peer view. Pull numbers and peer names only from provided or allowed datasets; otherwise use placeholders or “Example” labels.
- **Tone:** Professional, KAM-ready, suitable to present to merchants. No hallucinated case studies or revenue figures.

### 4.4 Datasets the agent needs (English descriptions)

- **Segment-level aggregates:** By segment (e.g. industry, MCC, volume band): average SR, failure reason mix, payment method mix (UPI, netbanking, Cards), feature adoption rates, and optionally average revenue uplift or SR lift for adopters. No PII.
- **Pre-approved messaging and templates:** Approved wording for “Smart Retry”, “UPI autopay”, “tokenisation”, method reorder, etc., so the agent stays on-brand and within product reality.
- **Peer benchmark text or numbers:** Same peer adoption and outcome aggregates as for SR and Cross-Sell agents, for use in “Peer benchmark” or “Typical impact” sections; no free-form invention.
- **Playbook structure template:** Standard sections (problem, root cause, actions, talking points, appendix) so output is consistent and auditable.

### 4.5 Guardrails (see Section 5 for shared rules)

- **No invented merchant names, revenue, or SR** in decks or playbooks. Use segment/peer aggregates or clearly mark “Example” or “Illustrative”.
- **Recommended actions** must map to real product capabilities (UPI, netbanking, Cards; Smart Retry, UPI autopay, tokenisation, method optimisation) and to the seven playbook use cases.
- KAM input (pain points) is used only to **select** playbook type and tailor narrative; the agent must not treat KAM input as factual data to be quoted as statistics.

---

## 5. Guardrails, checks and balances (all agents)

These apply to **SR Increase**, **Cross-Sell/Upsell**, and **Playbooks** agents to reduce hallucination and keep output trustworthy.

### 5.1 Data provenance

- **Every numeric claim** (SR %, revenue uplift, adoption %, “X% of failures”) must be traceable to a defined dataset or aggregate. Prefer pre-computed aggregates or structured queries over free-form LLM inference on raw numbers.
- **Peer names and “Merchants already benefiting”** must come only from the peer/segment and adoption datasets. If no peer data is available for a feature, say “Peer data not available” or omit the peer block; do not invent names or figures.
- **Revenue or GMV figures** (e.g. “₹X L/mo”) must come from approved revenue/volume data or from documented uplift models; document assumptions (e.g. “based on last 30 days volume and X% uplift”).

### 5.2 Output constraints

- **Structured output:** Where possible, interventions and playbooks use fixed schemas (e.g. trigger signal, recommended action, severity, peer list, actions). The model fills slots from data; it does not add new intervention types or actions outside the allowed list.
- **Allowed use cases:** SR Increase has **7 use cases** that require KAM/merchant action (Section 2.2); payment method reordering and routing are in Section 7. Cross-Sell/Upsell and Playbooks each have **7 use cases**; recommendations must map to one of the defined use cases. Use cases that need no KAM action or are information-only must not appear as primary interventions (Section 7).
- **Payment methods:** Only **UPI, netbanking, Cards**. No recommendations for wallets, EMI, BNPL, or international unless explicitly added later.

### 5.3 Thresholds and triggers

- **Alerts:** Thresholds (e.g. “SR drop >10%”, “last 30 min”) must be **configurable** (e.g. in config or feature flags) and **documented**. The model must not invent new thresholds; it may only use configured values.
- **Opportunities:** Criteria for “high recoverable failures”, “low mandate creation”, “heavy card usage” must be defined (e.g. percentiles or absolute thresholds) and sourced from config or data; the model applies them, not invents them.

### 5.4 Human-in-the-loop and safety

- **Sensitive data:** No PII or merchant-specific identifiers in playbook text or pitch decks unless explicitly allowed and redaction rules are applied.
- **Escalation:** Alerts (especially critical ones like “PG down”) can trigger notifications or tickets; ensure severity and routing are set from data and config, not from model wording.
- **Review:** Consider a light review step for playbooks or segment decks before KAMs share with merchants (e.g. “Generated playbook — verify numbers before use”).

### 5.5 Operational checks

- **Logging:** Log which dataset or aggregate was used for each key number in an intervention or playbook (e.g. “peer_sr_lift from table X, filter segment Y”).
- **Fallbacks:** If a required dataset is missing or query fails, return a safe message (“Data temporarily unavailable” or “Peer view not available for this feature”) and do not fill with plausible-looking invented numbers.
- **Versioning:** Version prompt and config (thresholds, use case list, payment method list) so that outputs can be reproduced and audited.

---

## 6. Summary table

| Agent              | Primary output     | Use cases (7 each, KAM/merchant action)                                                                 | Peer view |
|--------------------|--------------------|--------------------------------------------------------------------------------------------------------|-----------|
| SR Increase        | Alerts + Opportunities | 7: PG down, issuer spike, SR drop, volume drop, recurring failure (alerts); method enablement, checkout/auth drop (opportunities). Reorder → Section 7. Routing → Section 7.2 (not shown to KAMs). | Justification only |
| Cross-Sell/Upsell  | Mostly opportunities   | 7: Subscriptions/recurring, offers, priority settlements, tokenisation, UPI autopay/mandate, cost/mix, benchmark gap. Smart Retry → Section 7 (done/ack). | Justification only |
| Playbooks          | Pitch decks + on-demand playbooks | 7: Segment deck (SR), segment deck (cross-sell), on-demand (low SR, recurring, cost/mix, offers/conversion, settlement/working capital) | Segment/peer aggregates only |

**Interventions tab:** Primary view = **existing API output** (`/api/opportunities`, `/api/alerts`) with full item fields. **Peer view** is an **additional justification** section on the card (e.g. “Why this?” / “Peer benchmark”); if peer data is missing, the card still shows the API output and omits or softens the peer block.

Payment options for MVP: **UPI, netbanking, Cards** only. All agents share the same guardrails (Section 5); actual table names and query patterns can be added in a later, technical data-spec document.

---

## 7. Use cases without KAM action (done / ack-only) and information-only

These items are **not** part of the main intervention feed that demands KAM or merchant action. They are kept in a separate section so they can be executed or surfaced without blocking KAM workflow.

### 7.1 Executed without KAM intervention — show as “Done” or “Needs ack”

Use cases that the **system can execute** (or that require only a **KAM ack**, no merchant change) should appear in a dedicated area — e.g. “Done tasks” or “Tasks needing ack” — **not** as primary intervention cards.

| Use case | Brief description | How to surface |
|----------|-------------------|----------------|
| **Payment method order / optimisation** | One of UPI, netbanking, or Cards performs better for this merchant; reordering or emphasis can be applied by system or config. | Show as **done** (if already applied) or as a task that **only needs KAM ack** (e.g. “Optimisation applied — please acknowledge”). Do not show as a standard “Opportunity” requiring merchant/KAM action. |
| **Smart Retry on subscriptions** | Recurring payments have recoverable failures; Smart Retry for recurring can be enabled by system or ops. | Same: **done** or **needs ack only**. Not a primary cross-sell card. |
| **Retry optimisation (one-time)** | One-time payment failures are retryable; Smart Retry can be enabled. | Same: **done** or **needs ack only**. |

**Implementation note:** The APIs or UI can expose these with a flag (e.g. `requiresKamAction: false` or `displayAs: "done" | "ack_only"`) so the Interventions tab shows them in a separate list/section and does not mix them with actions that need KAM or merchant follow-up.

### 7.2 Information-only — do not show to KAMs

These are **internal/operational** insights. They must **not** appear on the KAM-facing Interventions tab. Use them for ops dashboards, routing logic, or internal reports only.

| Use case | Brief description | Handling |
|----------|-------------------|----------|
| **Routing improvements / MID routing optimisation** | One MID performs better than another; traffic could be routed to the higher-success MID. | **Do not show to KAMs.** Consume only in internal tools (e.g. ops dashboard, routing engine, or analytics). No card, no ack, no “done” in the KAM Interventions tab. |
| **Other system-driven optimisations** | Any insight that is applied automatically by the platform with no KAM or merchant decision. | Same: information-only; not in the KAM intervention feed. |

**Implementation note:** Filter these out from the payload that powers the KAM Interventions tab (e.g. exclude by `category` or `displayToKam: false`), or never emit them to the opportunities/alerts API used by the tab.
