# Install AWS CLI (macOS)

You need the AWS CLI to run `aws sso login` and connect to Redshift. Choose **one** of these:

---

## Option 1: Official installer (no Homebrew)

1. **Download** the AWS CLI v2 package for macOS:
   - **Apple Silicon (M1/M2/M3):**  
     https://awscli.amazonaws.com/AWSCLIV2.pkg
   - **Intel:**  
     https://awscli.amazonaws.com/AWSCLIV2.pkg  
     (same URL; it detects your Mac)

2. **Run the installer:** double‑click `AWSCLIV2.pkg` and follow the steps.

3. **Open a new terminal** and check:
   ```bash
   aws --version
   ```

4. **Configure SSO** (your org may use a specific profile name):
   ```bash
   aws configure sso
   ```
   You’ll be asked for:
   - SSO start URL (e.g. `https://your-org.awsapps.com/start`)
   - SSO region
   - Then it opens the browser to log in.

   If your team gave you a profile name (e.g. `my-sso-profile`), use:
   ```bash
   aws sso login --profile my-sso-profile
   ```

---

## Option 2: Homebrew (if you use it)

1. **Install Homebrew** (if you don’t have it):  
   https://brew.sh  
   (copy the one-line install command from that page and run it in Terminal.)

2. **Install AWS CLI:**
   ```bash
   brew update
   brew install awscli
   ```

3. **Check and configure:**
   ```bash
   aws --version
   aws configure sso
   ```
   Then use `aws sso login` (or `aws sso login --profile your-profile`).

---

## After AWS CLI is installed

- Run **`aws sso login`** (or with `--profile ...` if your team uses one) before running the Redshift script or using any AWS/Redshift tools.
- Get the **SSO start URL** and any **profile name** from your team or your company’s internal docs.
