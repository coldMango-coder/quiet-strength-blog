Root cause: requestIdleCallback misuse caused runtime TypeError in production

Summary
- Symptom: After initial render (~2–5s), the UI blanked to white in production.
- Console: TypeError: Failed to execute 'requestIdleCallback' on 'Window': The provided value is not of type 'IdleRequestOptions'.
- Location: Effect in src/App.js scheduling a deferred background task.

Details
- Code used a generic `defer = window.requestIdleCallback || window.setTimeout` and then called `defer(cb, 2000)`.
- In browsers supporting `requestIdleCallback`, the second parameter must be an object `{ timeout: number }`, not a number.
- Passing a number threw a runtime error a couple seconds after mount, which could crash rendering in production, presenting as a white screen.

Fix
- Gate the call properly:
  - If `requestIdleCallback` exists, call `requestIdleCallback(cb, { timeout: 2000 })` and cancel via `cancelIdleCallback`.
  - Otherwise, fall back to `setTimeout(cb, 2000)` and `clearTimeout`.
- Added try/catch and safe cleanup to prevent unhandled errors.

Prevention
- Added a RootErrorBoundary around the app to prevent total blanking on unexpected errors and log them.
- Added Playwright e2e guard (tests/white-screen.spec.js) that fails if DOM empties within ~12s after load.
- Global error/rejection listeners already present in src/index.js continue to log issues in production.

Artifacts
- debug/console.log: browser console during reproduction.
- debug/network.json: requests/responses during reproduction.

