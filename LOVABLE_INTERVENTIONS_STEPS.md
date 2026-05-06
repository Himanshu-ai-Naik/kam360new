# Interventions tab in Lovable, data from KAM 360 API — step by step

You build the **Interventions tab** in Lovable. The **data** comes from our API. There are **two outputs**: **Opportunities** and **Alerts (real time)**. Follow these steps in order.

---

## Step 1: Know where the data comes from (two outputs)

**1. Opportunities** (growth, adoption, cross-sell, volume):
- **URL:** `https://kam360new.vercel.app/api/opportunities`
- Use for the “Opportunities” section or main list on the Interventions tab.

**2. Alerts (real time)** (SR drops, failures, need immediate attention):
- **URL:** `https://kam360new.vercel.app/api/alerts`
- Use for an “Alerts” section (e.g. at the top or a separate list). Each alert has **severity**, **triggeredAt**, **metric**, **threshold**, **current** in addition to title, aiImpact, aiSuggestions, actions.

**Legacy (all in one):** `https://kam360new.vercel.app/api/insights` still returns a single combined list if you prefer one feed.

You do **not** type this data in Lovable. You only **fetch** from these URLs and **show** it.

---

## Step 2: In Lovable, add or open the Interventions tab/screen

- In your KAM 360 Lovable project, go to the place where you want the **Interventions** tab (or page).
- If it already exists, open that screen. If not, create a new screen and name it something like “Interventions” or “AI Insights”.

---

## Step 3: Fetch the data when the Interventions screen loads

- On that screen, you need to **call our API once** when the screen loads (or when the user opens the Interventions tab).
- In simple terms:
  1. When the Interventions screen is shown, run a request to:  
     `https://kam360new.vercel.app/api/insights`
  2. Read the **JSON** that comes back.
  3. From that JSON, take the part called **`interventions`**. That is your list of intervention cards.

**Example (you can tell Lovable to do something like this):**

- “When this screen loads, fetch from `https://kam360new.vercel.app/api/insights`. Store the result in state (e.g. `interventions`). Use the `interventions` array from the response.”

**Optional:** If you only want the top 5, use:  
`https://kam360new.vercel.app/api/insights?limit=5`

---

## Step 4: Show one card per intervention

- For **each** item in the `interventions` list, show **one card** (or one row) on the Interventions tab.
- On each card, show at least:
  - **Title** → use `item.title`
  - **Merchant name** → use `item.merchantName`
  - **Category** → use `item.category` (e.g. Adoption, Cross-sell, SR Recovery)
  - **Priority** → use `item.priority` (e.g. High Priority, Critical)
  - **Description** → use `item.description`
  - **AI impact** → use `item.aiImpact` (this is the input from “our side”)
  - **AI suggestions** → use `item.aiSuggestions` (show as a short bullet list)
  - **Buttons** → use `item.actions` (e.g. “Pick Task”, “Play Book”, “Root Cause”, “Ignore”)

So: **Lovable builds the card layout and styling; the text and buttons come from the API (our inputs).**

---

## Step 5: Handle loading and errors

- **While the request is running:** Show a loading state (e.g. “Loading interventions…” or a spinner).
- **If the request fails:** Show a short message like “Could not load interventions. Try again.” and maybe a “Retry” button that fetches again from the same URL.

---

## Step 6: (Optional) Add filters

- If you want filters on the Interventions tab:
  - **By category:** Call  
    `https://kam360new.vercel.app/api/insights?category=Adoption`  
    (or `Cross-sell`, `Volume Growth`, `SR Recovery`).
  - **By merchant:** Call  
    `https://kam360new.vercel.app/api/insights?merchantId=m4`  
    (use the merchant id you want).
- When the user changes a filter, run the request again with the right URL and show the new `interventions` list.

---

## Step 7: (Optional) Link to the Gen-AI experience

- You can add a button like “Open Gen-AI experience” that opens:  
  `https://kam360new.vercel.app`  
  in a new tab. That way users can go from the Lovable Interventions tab to the full Gen-AI app if they want.

---

## Short checklist for Lovable

1. Create or open the **Interventions** tab/screen.
2. On load, **fetch** `https://kam360new.vercel.app/api/insights` and store **`interventions`** from the response.
3. For each item in **`interventions`**, show a **card** with: title, merchant, category, priority, description, **aiImpact**, **aiSuggestions** (bullets), and **actions** (buttons).
4. Show **loading** while fetching and a simple **error** message if the fetch fails.
5. (Optional) Add **filters** using `?category=...` or `?merchantId=...`.
6. (Optional) Add a button to open **https://kam360new.vercel.app** in a new tab.

---

## One-sentence summary

**Lovable builds the Interventions tab (layout and UI); the inputs (all intervention text, impact, suggestions, and actions) are taken from the API at `https://kam360new.vercel.app/api/insights`.**
