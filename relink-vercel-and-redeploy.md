# Task: Relink repository to the correct Vercel project and redeploy

Context
- Team: mango's projects
- Intended Vercel project: quiet-strength-blog-plbo
- Unintended deploy went to: quiet-strength-personal-public-1068686894
- Repo root is current working directory.

Goals
1) Ensure the local repo is *linked* to Vercel project **quiet-strength-blog-plbo** (not auto-create).
2) Redeploy to the correct project (preview + production).
3) Map the custom domain `trueallyguide.com` to the correct project only.
4) Remove or archive the stray project `quiet-strength-personal-public-1068686894`.
5) Purge caches for `index.html` and verify a clean build is served.
6) Output a short post-action report.

Plan
- Detect existing Vercel link: check for `.vercel/project.json`.
- If linked to the wrong project, re-link to quiet-strength-blog-plbo via `vercel link --project quiet-strength-blog-plbo --yes`.
- If `.vercel` is missing, create it and write a `project.json` with the target project info (if API/CLI provides it).
- Confirm the Production Branch (e.g., `main` or `master`) matches the repo; set if needed.
- Run a preview deploy: `vercel --confirm --token $VERCEL_TOKEN`.
- Run a production deploy: `vercel --prod --confirm --token $VERCEL_TOKEN`.
- Attach/custom domain: ensure `trueallyguide.com` is assigned to **quiet-strength-blog-plbo** and removed from any other project.
- Purge edge cache for HTML + SW path (if any).
- Verify by fetching `/` and one inner route; ensure non-www HTTPS canonical.
- If possible via API/CLI, delete or disable the unintended project (or at least remove domain and stop autobuilds).
- Print: final production URL(s), the linked project id, and confirmation that `.vercel/project.json` points to **quiet-strength-blog-plbo**.

Concrete steps / commands (adjust for Windows shell as needed)
1) Ensure we’re in repo root. Then:

   - Check link:
     - If `.vercel/project.json` exists, print its contents.
     - If `project.json` `projectId` or `orgId` are empty/wrong, proceed to re-link.

   - Re-link (non-interactive):
     ```
     vercel link --project quiet-strength-blog-plbo --yes
     ```

   - Lock name in vercel.json (optional but helpful):
     - Ensure `vercel.json` contains:
       ```json
       {
         "project": "quiet-strength-blog-plbo"
       }
       ```
       If the file exists, merge this property without breaking other settings.

2) Deploy
   - Preview: `vercel --confirm`
   - Production: `vercel --prod --confirm`

3) Domain attach / cleanup
   - Ensure `trueallyguide.com` is assigned to **quiet-strength-blog-plbo**:
     ```
     vercel domains add trueallyguide.com --scope "mango's projects" || true
     vercel alias set quiet-strength-blog-plbo trueallyguide.com || true
     ```
   - Remove the domain from the unintended project (ignore errors if not attached there):
     ```
     vercel domains rm trueallyguide.com --safe --yes || true
     ```
     (If CLI blocks because it’s attached to another project, detach there first, then re-add to quiet-strength-blog-plbo.)

4) Purge cache (HTML + SW)
   - If supported:
     ```
     vercel cache purge /index.html || true
     vercel cache purge /service-worker.js || true
     ```
     Otherwise, bump a `BUILD_ID` env var and redeploy so clients pick up a new HTML hash.

5) Verify (basic)
   - Fetch `https://trueallyguide.com/` and one inner route.
   - Confirm redirects: HTTPS, non-www.
   - Confirm only one `<link rel="canonical">` with the non-www https URL.
   - Run Lighthouse or a quick `curl -I` to verify caching headers:
     - `index.html`: no-store or short TTL
     - assets: long immutable TTL

6) Clean-up unintended project
   - If possible: `vercel project rm quiet-strength-personal-public-1068686894 --yes` (or archive/disable auto-build).

7) Output
   - Print the contents of `.vercel/project.json`.
   - Print the production deployment URL(s) for **quiet-strength-blog-plbo**.
   - Summarize domain mapping status and cache purge result.
   - If any step failed, print actionable next steps.

Notes
- Do not change application code (the RIC fix is already in place).
- Keep environment variables unchanged; only link, deploy, and domain-map.
- If CLI prompts are required, prefer non-interactive flags; otherwise, print the exact command for me to run manually.

Report back with:
- Current `.vercel/project.json`
- Final production URL now serving the site
- Confirmation that trueallyguide.com resolves to quiet-strength-blog-plbo