# Add "Gen-AI experience" button in Lovable (Interventions tab)

Add this button in the **Interventions** tab of your KAM 360 Lovable app so it redirects to the Gen-AI led UI.

---

## 1. Where to add it

In [Lovable](https://lovable.app), open your **KAM 360** project → go to the **Interventions** tab/screen. Add the button in the **header/toolbar** of that tab (e.g. next to "Smart Insights", "All Merchants", or the filters).

---

## 2. Button code (copy-paste)

Use one of the options below depending on how your Lovable app is built.

### Option A: React (JSX) – open in new tab

```jsx
<a
  href="https://kam360new.vercel.app"
  target="_blank"
  rel="noopener noreferrer"
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    fontWeight: 600,
    fontSize: '14px',
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
  }}
>
  ✨ Open Gen-AI experience
</a>
```

**Live Gen-AI app:** [https://kam360new.vercel.app](https://kam360new.vercel.app) (already set above). For local testing use `http://localhost:5174`.

### Option B: As a `<button>` that opens URL

```jsx
<button
  type="button"
  onClick={() => window.open('https://kam360new.vercel.app', '_blank', 'noopener,noreferrer')}
  style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
  }}
>
  ✨ Open Gen-AI experience
</button>
```

The URL above is the live app: https://kam360new.vercel.app

---

## 3. Deploy the Gen-AI app to get a URL

If you don’t have a URL yet:

1. Push the `payu-orbit-ai` code to GitHub (you already have **kam360new**).
2. Go to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) and **Import** the repo `Himanshu-ai-Naik/kam360new`.
3. Deploy with default settings (build: `npm run build`, output: `dist`).
4. The button snippets above already use **https://kam360new.vercel.app**.

---

## 4. Summary

| Step | Action |
|------|--------|
| 1 | In Lovable, open the Interventions tab view. |
| 2 | Paste the button (Option A or B) in the toolbar/header. |
| 3 | Button uses **https://kam360new.vercel.app** (or use `http://localhost:5174` for local). |
| 4 | Save and publish in Lovable. |

Result: users see **"✨ Open Gen-AI experience"** in the Interventions tab and are redirected to the Gen-AI UI in a new tab.
