# Fix: "Repository not found"

That error means GitHub doesn’t have a repo at that URL yet, or the username/repo name is wrong. Do this in order.

---

## 1. Create the repository on GitHub

1. Open: **https://github.com/new**
2. **Repository name:** type exactly: **kam360**
3. **Description (optional):** e.g. `KAM 360 Gen-AI dashboard`
4. Choose **Public**
5. **Do not** check "Add a README", ".gitignore", or "License" (this project already has them)
6. Click **Create repository**

---

## 2. Set the remote to YOUR username

GitHub will show your repo URL. It will look like:

`https://github.com/YOUR_USERNAME/kam360.git`

Use **your real GitHub username** (the one you see in the top‑right when logged in). In Terminal run (replace `YOUR_USERNAME` with that username):

```bash
cd /Users/himanshu.naik/Cursor/payu-orbit-ai
git remote set-url origin https://github.com/YOUR_USERNAME/kam360.git
git remote -v
```

Example: if your username is **Himanshu-ai-Naik**:

```bash
git remote set-url origin https://github.com/Himanshu-ai-Naik/kam360.git
```

---

## 3. Push

```bash
git push -u origin main
```

When asked for **Password**, paste your **Personal Access Token** (not your GitHub account password).

---

## If you already created a repo with a different name

If you created e.g. `kam360-genai` or `KAM360` instead of `kam360`, either:

- **Rename it to `kam360`:** Repo → Settings → Repository name → rename → Save, then use `https://github.com/YOUR_USERNAME/kam360.git` in step 2, or  
- **Point your local repo at the existing one:** in step 2 use the URL GitHub shows for that repo (e.g. `https://github.com/YOUR_USERNAME/kam360-genai.git`).
