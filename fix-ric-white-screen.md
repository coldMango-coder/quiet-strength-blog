# Fix prod white-screen caused by invalid requestIdleCallback options

Context
- Team: mango's projects
- Project: quiet-strength-blog-plbo
- Prod-only white screen after a few seconds. Browser console shows:
  "Failed to execute 'requestIdleCallback' on 'Window': The provided value is not of type 'IdleRequestOptions'."
- Also seeing non-fatal srcset warnings.

Objectives
1) Eliminate the crash by sanitizing all uses of requestIdleCallback (RIC).
2) Provide a safe wrapper + fallback so unsupported browsers or bad inputs never crash.
3) Add a regression test that fails if the app blanks after load.
4) (Nice-to-have) Clean obvious srcset descriptor mistakes.
5) Ship a small PR with root-cause notes.

Scope of work
- Search codebase for: requestIdleCallback, cancelIdleCallback, 'RIC', 'idleCallback'.
- Replace direct calls with a shared utility that accepts only `{ timeout?: number }`.
- Remove any non-standard options being passed (e.g., { signal }, { immediate }, booleans, strings, etc.).
- Keep functionality the same otherwise.

Implementation
1) Create a utility:

   File: src/utils/idle.ts (or .js if project is JS)
   -----------------------------------------------
   export type IdleDeadline = { didTimeout: boolean; timeRemaining: () => number };
   export type IdleHandle = number;

   export function requestIdle(
     cb: (d: IdleDeadline) => void,
     opts?: { timeout?: number }
   ): IdleHandle {
     const hasRIC = typeof window !== 'undefined' && 'requestIdleCallback' in window;
     const timeoutOpt =
       opts && typeof opts.timeout === 'number' ? { timeout: opts.timeout } : undefined;

     if (hasRIC) {
       // @ts-ignore allow on browsers that implement it
       return window.requestIdleCallback(cb, timeoutOpt);
     }

     // Fallback: emulate with setTimeout so we never crash
     const start = Date.now();
     return window.setTimeout(() => {
       cb({
         didTimeout:
           typeof opts?.timeout === 'number' ? Date.now() - start > opts.timeout! : false,
         timeRemaining: () => 0,
       });
     }, 1);
   }

   export function cancelIdle(id: IdleHandle) {
     const hasCIC = typeof window !== 'undefined' && 'cancelIdleCallback' in window;
     if (hasCIC) {
       // @ts-ignore
       window.cancelIdleCallback(id);
     } else {
       clearTimeout(id);
     }
   }
   -----------------------------------------------

2) Refactor all usages:
   - Import { requestIdle, cancelIdle } from 'src/utils/idle'.
   - Replace `window.requestIdleCallback(fn, anything)` with `requestIdle(fn, { timeout: N })`
     or just `requestIdle(fn)`; do NOT pass any keys other than 'timeout'.
   - Replace `window.cancelIdleCallback(id)` with `cancelIdle(id)`.
   - Remove any custom "idle" helpers that forward non-standard options to RIC.

3) Defensive guard at the call sites:
   - If previous code passed objects with extra fields, strip them.
   - Ensure callbacks handle being called once and are idempotent.

4) (Optional) srcset cleanups (non-fatal):
   - Find <img> or <source> with malformed `srcset` descriptors (e.g., missing "w" or "x").
   - Replace with valid forms like:
     srcset="/images/foo-640.jpg 640w, /images/foo-1280.jpg 1280w"
     sizes="(max-width: 640px) 100vw, 640px"
   - Remove unknown descriptors that cause "unknown descriptor" warnings.

Testing
1) Unit smoke (if present): run `npm ci && npm run build`.
2) Add/ensure an e2e test that fails if the DOM goes empty after load:

   File: tests/white-screen.spec.ts
   --------------------------------
   import { test, expect } from '@playwright/test';

   test('app does not blank after load for 60s', async ({ page }) => {
     await page.goto('/');
     await page.waitForLoadState('networkidle');
     // capture body HTML snapshot
     const before = await page.content();
     await page.waitForTimeout(60000);
     const after = await page.content();
     expect(after.length).toBeGreaterThan(0);
     expect(after).toContain('<body');
     // ensure no global fatal error was thrown
     const errors = [];
     page.on('pageerror', e => errors.push(String(e)));
     expect(errors.length).toBe(0);
   });
   --------------------------------

3) Run:
   - npx playwright test tests/white-screen.spec.ts --project=chromium

Deliverables
- PR: "Fix: guard requestIdleCallback usage to prevent white-screen"
  - Adds src/utils/idle.(ts|js), refactors all RIC call sites, and updates tests.
  - ROOT_CAUSE.md describing the invalid IdleRequestOptions crash and the wrapper approach.
  - Notes whether any srcset descriptors were corrected.

Acceptance criteria
- No console error "Failed to execute 'requestIdleCallback'…" in prod build.
- Page stays visible >60s on `/` and a sample inner route.
- Playwright test passes locally in prod build.
- No change to functional behavior besides stability.

Runbook
- Build: npm ci && npm run build
- Test: npx playwright test tests/white-screen.spec.ts --project=chromium
- If green: open PR and request review.