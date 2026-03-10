# Do this next — then check

Everything that can be done without your login is already done. Follow **only the steps below**, then check the app and GitHub.

---

## Step 1: Push to GitHub (one time)

Open **Terminal** and run these commands **in order**:

```bash
cd /Users/himanshu.naik/Cursor/payu-orbit-ai
git push -u origin main
```

- If you’re asked for **username**: your GitHub username (e.g. `Himanshi-ai-Naik`).
- If you’re asked for **password**: use a **Personal Access Token**, not your GitHub password.  
  - Create one: GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Generate new token**; enable `repo`.
- If you use **GitHub CLI** and are logged in, the push may work without prompts.

**Check:** Open https://github.com/Himanshi-ai-Naik/kam360 — you should see the latest code and commits.

---

## Step 2: Run the app locally

In Terminal:

```bash
cd /Users/himanshu.naik/Cursor/payu-orbit-ai
npm install
npm run dev
```

- If you see **"command not found: npm"**: install Node.js from https://nodejs.org (LTS), then run the commands again.
- When the dev server starts, open the URL it prints (e.g. **http://localhost:5174**) in your browser.

**Check:** The KAM 360 Gen-AI dashboard loads with Agent Hub, Copilot panel, Interventions, and Manage Merchants.

---

## Summary

| Done already | You do once |
|--------------|-------------|
| Git repo initialized | **Step 1:** `git push -u origin main` |
| All files committed (2 commits) | **Step 2:** `npm install` then `npm run dev` |
| Remote set: `github.com/Himanshi-ai-Naik/kam360` | Open the app URL in the browser |
| `.gitignore`, README, project code | |

After Step 1 and Step 2, you can check: repo on GitHub + app running in the browser.
