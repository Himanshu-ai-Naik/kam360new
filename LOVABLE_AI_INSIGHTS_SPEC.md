# AI-led interventions tab — spec for Lovable (kam-360.lovable.app)

**Goal:** Show insights **without KAMs asking**. Gen-AI establishes **impact** and **suggestions** for each intervention; the experience is **AI-led**, not KAM-led.

**Reference:** [Interventions tab](https://kam-360.lovable.app/interventions)

---

## 1. What to add on each intervention card

For **every intervention** in the Interventions tab, show two blocks **proactively** (no KAM action required):

### A. AI impact (one short paragraph)

- **Label:** e.g. **"AI impact"** or **"Expected impact"**
- **Content:** One sentence stating what will likely happen if the intervention is acted on. Include:
  - Business outcome (revenue, GMV, SR lift, volume, etc.)
  - Rough magnitude (%, range, or timeframe)
  - When relevant, timeframe (e.g. "in 90 days", "within 5–7 days")

**Example (BNPL adoption):**  
*"Estimated +12–18% checkout conversion and ~₹2.1 Cr incremental GMV in 90 days if BNPL is surfaced at cart and in promos."*

**Example (UPI SR recovery):**  
*"Restoring UPI SR to 96% can recover ~₹1.2 Cr revenue-at-risk weekly; routing fix typically shows effect within 5–7 days."*

### B. AI suggestions (short bullet list)

- **Label:** e.g. **"AI suggestions"** or **"Suggested actions"**
- **Content:** 2–4 concrete, actionable bullets (what to do first, what to measure, what to try next). Not generic; specific to the intervention and merchant/context.

**Example (BNPL adoption):**  
- Surface BNPL at cart and payment step; A/B test placement.  
- Run a 2-week BNPL promo and measure adoption.  
- Benchmark to industry 22% adoption and close gap in 60 days.

**Example (UPI SR recovery):**  
- Run root-cause on Razorpay failures (timeouts vs bank declines).  
- Add fallback PSP for UPI or adjust timeout/retry policy.  
- Set alert if UPI SR drops below 94% for same-day response.

---

## 2. UX placement

- **Where:** On the **same card** as the existing intervention (title, description, merchant, priority, actions).
- **Order:** Title → Description → **AI impact** → **AI suggestions** → Action buttons (Pick Task, Play Book, Root Cause, Ignore).
- **Visual:** Clearly separate from description (e.g. a subtle background or border, and a small label like "AI impact" / "AI suggestions") so it’s obvious this is **AI-generated**, not static copy.

---

## 3. Data source for impact and suggestions

**Option A — Static (quick):**  
Store one `aiImpact` string and one `aiSuggestions` array (2–4 items) per intervention in your data/API. Use the examples in the table below for each intervention type.

**Option B — Dynamic (later):**  
Call an AI/LLM API with intervention context (category, merchant, title, description) and get one impact sentence + 2–4 suggestion bullets. Same structure as above.

---

## 4. Example copy per intervention (for Option A)

Use this as reference when building the interventions data or API. You can paste these into Lovable or your backend.

| Intervention focus | AI impact (example) | AI suggestions (examples) |
|--------------------|----------------------|---------------------------|
| **BNPL / Pay Later adoption** | Estimated +12–18% checkout conversion and ~₹2.1 Cr incremental GMV in 90 days if BNPL is surfaced at cart and in promos. | Surface BNPL at cart and payment step; A/B test placement. Run a 2-week BNPL promo and measure adoption. Benchmark to industry 22% and close gap in 60 days. |
| **Instant refunds / Loyalty** | Instant refunds can reduce support tickets by ~25% and improve NPS; loyalty can lift repeat order rate by 15–20% and LTV. | Enable instant refunds for failed TXNs first. Pilot loyalty with top 10% repeat users, then roll out. Measure ticket volume and repeat rate before/after. |
| **Subscription / e-mandate** | E-mandate/SI could add ~8–12% stable volume and improve retention; recurring revenue impact in range of ₹1.5–2 Cr/month. | Enable e-mandate for renewals on primary flow. Default to auto-debit with clear consent. Track mandate success rate and churn after go-live. |
| **EMI at checkout** | Surfacing no-cost EMI for orders ₹5K+ could recover ~20–25% of high-value abandonments; estimated +₹8–12 Cr GMV in 60 days. | Show EMI eligibility and monthly amount on PDP and cart for ₹5K+. A/B test EMI placement. Monitor conversion and EMI mix for high-AOV segments. |
| **UPI SR / routing** | Restoring UPI SR to 96% can recover ~₹1.2 Cr revenue-at-risk weekly; routing fix typically shows effect within 5–7 days. | Run root-cause on PSP failures. Add fallback PSP or adjust timeout/retry. Set alert if UPI SR drops below 94% for same-day response. |
| **3DS / gateway issues** | Fixing 3DS timeouts can recover most of the card declines; expect ~2–4% overall SR lift and lower drop-off at payment. | Check gateway timeout config. Consider failover for 3DS. Monitor 3DS completion rate by bank and gateway. |
| **Tokenization adoption** | Moving tokenization from 28% to 60% can improve card SR by ~3–5% and reduce repeat-checkout friction; expect 8–12 weeks to reach target. | Prompt for save card after successful payment. Pre-check “Save for next time” for returning users. Track tokenization rate and card SR by cohort. |
| **Net banking SR** | Restoring SBI net banking SR can recover ~0.5–1% overall payment SR and reduce support load from net-banking failures. | Confirm with bank/aggregator for outage or config change. Temporarily route part of volume to backup path. Monitor SBI SR daily until baseline. |
| **International cards** | Enabling international cards can capture inbound/NRI orders; potential +2–5% volume from international card segment. | Enable multi-currency and international Visa/MC. Show “Pay in INR” where relevant. Track international card volume and decline reasons post go-live. |

---

## 5. Summary for Lovable

- **Add to each intervention card:**  
  - **AI impact** (one sentence, outcome + magnitude/timeframe).  
  - **AI suggestions** (2–4 short bullets).
- **No KAM ask:** These blocks are always visible; Gen-AI establishes impact and suggestions by default.
- **Same structure** as in the Gen-AI app (payu-orbit-ai): see `Intervention` type with `aiImpact` and `aiSuggestions` and the InterventionBoard component for reference.

Once this is in place, the interventions experience at https://kam-360.lovable.app will be **AI-led** with impact and suggestions shown upfront.
