# KAM 360 · Gen-AI Dashboard

Gen-AI led UI experience for the KAM 360 dashboard. Provides **multiple agents** that map to the use cases in the [Interventions tab](https://insight-payer.lovable.app/interventions), plus **create & manage merchants** for KAMs.

## Get started

```bash
git clone https://github.com/YOUR_USERNAME/kam360.git
cd kam360
npm install
npm run dev
```

Open http://localhost:5174 (or the port Vite prints).

## What’s included

- **KAM 360 Copilot** — Right-hand panel: natural-language input, agent selector chips, and simulated AI replies with actions (Pick Task, Play Book, Root Cause).
- **Agent Hub** — Cards for each agent with use cases and suggested prompts. Click to focus the copilot on that agent.
- **Interventions** — List of interventions (mirroring insight-payer.lovable.app) with category/priority filters and action buttons that open the copilot with the right agent.
- **Manage Merchants** — KAM flow: search merchants, **Add merchant** (name, industry, contact, notes). “Manage” per row is ready for your backend.

## Agents (aligned to Interventions tab)

| Agent | Use cases |
|-------|-----------|
| **KAM 360 Assistant** | Create/manage merchants, portfolio, prioritize interventions, SLA triage |
| **Adoption** | BNPL activation, card tokenization, Pay Later penetration, UI optimization |
| **Cross-sell** | Instant refunds, loyalty suite, EMI at checkout, offer engine |
| **Volume Growth** | Subscriptions, e-mandate/SI, international cards, multi-currency |
| **SR Recovery** | UPI/PSP routing, 3DS failures, net banking SR, root cause analysis |

## Integrating with your Lovable dashboard

- **Option A:** Deploy this app and link from the main dashboard (e.g. “Open Gen-AI experience”).
- **Option B:** Copy `src/agents/`, `src/components/CopilotPanel.tsx`, `AgentHub.tsx`, `InterventionBoard.tsx`, `MerchantManage.tsx`, and the App routes into your Lovable project and wire your API/auth.

## Next steps (for production)

1. Replace simulated copilot replies with your LLM/backend (e.g. Bedrock, OpenAI) and pass `activeAgentId` / intervention context.
2. Connect **Create merchant** and **Manage** to your APIs.
3. Optionally add real-time data from the same source as https://insight-payer.lovable.app/.
