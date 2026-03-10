# Use KAM 360 agent output in Lovable (screens / UI / UX)

Ways to use the Gen-AI agents’ output in your Lovable app so you can build screens and UX from it.

---

## 1. **REST API (recommended)**

The Gen-AI app exposes agent data as JSON. Lovable can **fetch** it and render its own screens.

### Endpoint

| Method | URL | Description |
|--------|-----|-------------|
| GET | `https://kam360new.vercel.app/api/insights` | All interventions with AI impact and suggestions |
| GET | `https://kam360new.vercel.app/api/insights?limit=3` | Top 3 interventions |
| GET | `https://kam360new.vercel.app/api/insights?merchantId=m4` | Interventions for one merchant |
| GET | `https://kam360new.vercel.app/api/insights?category=SR Recovery` | By category |

### Response shape (for your UI)

```json
{
  "source": "KAM 360 Gen-AI agents",
  "updatedAt": "2025-02-03T12:00:00.000Z",
  "interventions": [
    {
      "id": "int-1",
      "category": "Adoption",
      "merchantId": "m5",
      "merchantName": "BigBasket (Tata)",
      "mids": 1,
      "priority": "High Priority",
      "title": "BNPL Feature Activation — Only 8% Adoption Rate",
      "description": "BNPL integration completed 3 months ago...",
      "actions": ["Pick Task", "Play Book", "Ignore"],
      "agentId": "adoption",
      "aiImpact": "Estimated +12–18% checkout conversion and ~₹2.1 Cr incremental GMV in 90 days...",
      "aiSuggestions": [
        "Surface BNPL at cart and payment step; A/B test placement.",
        "Run a 2-week BNPL promo..."
      ]
    }
  ]
}
```

### Using this in Lovable for screens/UX

1. **Interventions list screen**  
   - `GET /api/insights` (or with `?limit=5`).  
   - Map `interventions` to cards: show `title`, `merchantName`, `category`, `priority`, `aiImpact`, `aiSuggestions` (bullets), and buttons from `actions`.

2. **Merchant detail**  
   - `GET /api/insights?merchantId=m4`.  
   - One section “AI insights” with impact + suggestions for that merchant.

3. **Category / priority filters**  
   - Use `?category=Adoption` (or Cross-sell, Volume Growth, SR Recovery).  
   - Build filtered lists or tabs in Lovable.

4. **Copy for UX**  
   - Use `aiImpact` as subtext or tooltip; use `aiSuggestions` for “Suggested next steps” or checklist UI.

**Example fetch in Lovable (JavaScript):**

```javascript
const res = await fetch('https://kam360new.vercel.app/api/insights?limit=5');
const { interventions } = await res.json();
// Use interventions in your state and render cards/lists
```

---

## 2. **postMessage (when Gen-AI app is in an iframe)**

If you **embed** the Gen-AI app in Lovable (e.g. iframe to `https://kam360new.vercel.app`), the app sends each **agent reply** to the parent so Lovable can drive its own UI from it.

### Message contract

The Gen-AI app posts:

```ts
{
  type: 'KAM360_AGENT_OUTPUT',
  payload: {
    agentId: string,        // 'orchestrator' | 'adoption' | 'crosssell' | 'volume' | 'sr-recovery'
    interventionId?: string,
    content: string,        // Markdown-style text (impact + suggestions)
    actions?: { label: string, action: string }[],
    timestamp: number
  }
}
```

### In Lovable: listen and use for UI/UX

```javascript
useEffect(() => {
  const onMessage = (event) => {
    if (event.data?.type === 'KAM360_AGENT_OUTPUT') {
      const { agentId, interventionId, content, actions } = event.data.payload;
      // e.g. set state for a "Latest AI insight" panel, or open a drawer with content/actions
      setLatestAgentOutput({ agentId, interventionId, content, actions });
    }
  };
  window.addEventListener('message', onMessage);
  return () => window.removeEventListener('message', onMessage);
}, []);
```

Use `content` for a “Latest insight” block, and `actions` for buttons (Pick Task, Play Book, etc.) in your own screens.

---

## 3. **Response schema (for design system / components)**

Use this to design Lovable components that match the API.

| Field | Type | Use in UI |
|-------|------|-----------|
| `id` | string | Key, deep link |
| `category` | `"Adoption" \| "Cross-sell" \| "Volume Growth" \| "SR Recovery"` | Badge, filter, icon |
| `merchantName` | string | Card title or subtitle |
| `priority` | string | Badge color (Critical = red, High = orange, etc.) |
| `title` | string | Card heading |
| `description` | string | Body copy |
| `aiImpact` | string | Highlight or “Expected impact” section |
| `aiSuggestions` | string[] | Bullet list or checklist |
| `actions` | string[] | Buttons: “Pick Task”, “Play Book”, “Root Cause”, “Ignore” |

---

## 4. **Summary**

| Need | Approach |
|------|----------|
| Build Lovable screens from agent data | **GET** `https://kam360new.vercel.app/api/insights` (and query params), use `interventions` in your UI. |
| Use output when user is inside Gen-AI iframe | Listen for **postMessage** `KAM360_AGENT_OUTPUT` and use `payload` for panels/buttons. |
| Design components that match output | Use the **response schema** table above. |

No changes are required inside the Lovable dashboard logic beyond calling the API or listening for postMessage; all agent output is designed to be consumed by Lovable for screens and UX.
