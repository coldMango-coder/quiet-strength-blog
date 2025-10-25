Follow-up task: verify, purge caches, canary deploy

Context

Team: mango’s projects

Project: quiet-strength-blog-plbo

Local tests pass; white-screen not reproduced. Suspect prod cache / service worker.

Do this in order

Run full Playwright suite

npm ci && npm run build

npx playwright test --project=chromium,firefox,webkit

Prod-mode smoke test (local)

npm run start (prod build)

Run a 60s stability check (ensure DOM doesn’t blank). Record logs to debug/local-prod-smoke.log.

Service worker & caching hardening

If a service worker is registered, ship a one-time cleanup:

Add a small bootstrap that (a) unregisters existing SW registrations and (b) clears caches once.

Guard so it runs only once (e.g., localStorage.setItem('sw-flushed','1')).

In the SW (if we keep it), during activate, delete old caches with a versioned CACHE_NAME.

Ensure index.html sent with Cache-Control: no-store (or very low TTL) and that hashed assets carry long TTL.

Add a tiny banner console log like BUILD_ID: <git sha> to confirm clients load the new build.

Canary deploy

Deploy to staging or a canary prod slot (small traffic slice).

Purge CDN for index.html and the SW path (if any).

Visit the canary URL in a fresh browser profile. Confirm:

No infinite redirects

No uncaught exceptions

No white-out after 60s idle on / and one inner route

Rollout + monitoring

If canary is clean, roll out to 100%.

Monitor for 15 minutes; capture console/network logs in debug/prod-smoke-<timestamp>.log.

If any issue: rollback immediately and attach logs to this task.

Deliverables

PR: “Ops: purge caches + SW hygiene; canary deploy for white-screen regression”

Changes (if any) for SW cleanup

CI: add the 60s “no-blank” Playwright test

ROOT_CAUSE.md updated (prod cache hypothesis + verification steps)

Comment back with:

Playwright summary

Canary URL and confirmation that the site stays visible >60s

Whether SW was present and what was flushed

Final deployment URL

Proceed with the above. If all checks pass, complete full deploy.