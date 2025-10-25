Fix white-screen regression in production

Workspace / Scope

Team: mango's projects

Project: quiet-strength-blog-plbo

Environment: production deployment (latest)

Symptom: Page renders correctly for the first ~2–5 seconds, then the entire app goes blank white. Previous deployment did not have this issue.

Objectives

Identify the root cause of the white screen that appears a few seconds after load.

Implement the minimal, correct fix.

Prevent recurrence with automated checks.

Ship a new deployment that no longer blanks out.

Repro & Triage (do these first)

Pull latest main and install deps.

Build and run locally in prod mode, then reproduce:

npm ci

npm run build

npm run start

Hit / and let it sit for 30 seconds.

Capture browser console and network logs while reproducing (headless ok). Save logs in debug/:

Log uncaught exceptions and unhandled rejections.

Note any route changes/redirects occurring after initial render.

Check production deploy logs and any runtime error logs.

Clear caches and disable/unregister any service worker, then retry. Note if behavior changes.

Likeliest culprits to check

(Inspect the codebase for each; confirm or rule out.)

Uncaught runtime error after hydration (e.g., accessing window/document without guards, null deref, JSON.parse on undefined, etc.).

Look for errors in console right before the whiteout.

Verify effects run safely in production build.

Redirect or router loop (client navigation after a timer/effect that lands on a blank route).

Grep for router.push|replace|navigate|window.location in effects. Ensure guards stop re-entrancy.

Service Worker / PWA cache bug serving an empty shell or stale bundle.

If SW exists, confirm it isn’t caching an empty index.html or blocking new assets. Consider unregistering on next boot (see Fixes section).

Global CSS hiding content after a feature-flag/class toggles (e.g., body { display:none } or full-screen overlay).

Search for [hidden], opacity:0, visibility:hidden, display:none, or full-viewport overlays.

Missing/changed environment variable in prod causing a late-throw inside an effect or data fetch.

Compare .env.production* vars with the last good deploy.

StrictMode double-effect side effects not idempotent (React) causing teardown that clears UI.

Make effects resilient/idempotent.

Required fixes (implement what’s applicable)

Fix the specific runtime error(s) found. Add null checks and guard against server-only/browser-only usage.

Stop accidental redirects/loops. Ensure any auth/feature gating is stable and doesn’t navigate repeatedly.

Harden the app against total blanking:

Add a top-level Error Boundary around the app root with a friendly fallback UI.

Add global listeners to log runtime errors to console in production builds (remove later if we have Sentry).

If a Service Worker exists:

Temporarily ship an unregister-once routine to flush stale caches:

// src/sw-unregister.ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then(regs => Promise.all(regs.map(r => r.unregister())))
    .then(() => caches?.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))))
    .catch(() => {});
}


Import this at the app entry so it runs once after load, guarded to no-op if we later restore SW.

If CSS/overlay is the cause: remove/adjust the rule or ensure the toggling class is applied/removed correctly.

Add safety nets (prevent regression)

Error Boundary (TypeScript example):

// src/components/RootErrorBoundary.tsx
import React from 'react';

export class RootErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props:any){ super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(){ return { hasError: true }; }
  componentDidCatch(err: any, info: any){ console.error('Root error boundary caught:', err, info); }
  render(){ return this.state.hasError ? <div style={{padding:16}}>Oops, something crashed. Please refresh.</div> : this.props.children; }
}


Wrap the app root:

// src/main.tsx or _app.tsx
<RootErrorBoundary>
  <App />
</RootErrorBoundary>


Simple e2e white-screen guard using Playwright (fails if the DOM empties within 30s):

test('app does not blank out after load', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const initial = await page.content();
  await page.waitForTimeout(10000);
  const after = await page.content();
  expect(after.length).toBeGreaterThan(0);
  expect(after).not.toEqual('<html><head></head><body></body></html>');
});


CI step: run the test in prod build before deployment.

Deliverables

A PR titled “Fix: white screen after a few seconds (prod)” that includes:

The root-cause explanation in the PR description.

Code fixes (and SW unregister snippet if used).

The Root Error Boundary.

The Playwright test.

Artifacts in debug/ folder: console.log, network.json, and a brief ROOT_CAUSE.md.

A successful deployment link where:

The app remains visible for at least 30 seconds post-load.

Browser console shows no uncaught exceptions.

No infinite redirects.

Remove any temporary SW unregister code in a follow-up PR if we re-enable PWA.

Notes

Prioritize minimal fix + guardrails.

If multiple issues exist, fix the one causing render blanking first.

Keep changes scoped; do not refactor unrelated code.

Start now and post findings from the initial repro + logs within the PR description.