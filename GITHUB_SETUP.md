# Create the GitHub project for KAM 360

**Repo already exists and remote is set?** Use **[DO_THIS_NEXT.md](./DO_THIS_NEXT.md)** — you only need to run `git push -u origin main`.

Otherwise, follow these steps to put this project on GitHub.

## 1. Set your Git identity (one-time)

If you haven’t already:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 2. Commit (if not done yet)

From the project root:

```bash
cd /Users/himanshu.naik/Cursor/payu-orbit-ai
git add -A
git commit -m "Initial commit: KAM 360 Gen-AI dashboard with agents and copilot"
```

## 3. Create the repo on GitHub

1. Open **https://github.com/new**
2. Set **Repository name** (e.g. `kam360` or `kam360-genai`)
3. Add a **Description** (e.g. `KAM 360 Gen-AI dashboard – agents and copilot for KAMs`)
4. Choose **Public**
5. Do **not** add a README, .gitignore, or license (this project already has them)
6. Click **Create repository**

## 4. Connect and push

GitHub will show “push an existing repository from the command line”. Run (replace `YOUR_USERNAME` and `REPO_NAME` with your values):

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

Example:

```bash
git remote add origin https://github.com/himanshunaik/kam360.git
git branch -M main
git push -u origin main
```

## 5. Optional: GitHub CLI

To create the repo from the terminal:

```bash
brew install gh
gh auth login
cd /Users/himanshu.naik/Cursor/payu-orbit-ai
gh repo create kam360 --public --source=. --remote=origin --push
```

After this, your KAM 360 project will be on GitHub and you can share the repo URL or clone it elsewhere.
