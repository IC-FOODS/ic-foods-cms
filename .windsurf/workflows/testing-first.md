---
description: Testing-first development workflow - MANDATORY for all changes
---

# Testing-First Development Workflow

**This workflow is MANDATORY for all code changes across all repos in this workspace.**

## Core Principle

> **Always test first, iterate until tests pass, then commit.**

No code changes should be committed without:
1. Running unit tests
2. Running E2E tests (if applicable)
3. Iterating on failures until all tests pass

---

## Workflow Steps

### 1. Before Making Changes

Run existing tests to establish baseline:

```bash
// turbo
docker run --rm -v "$PWD":/app -w /app node:20-alpine sh -lc "npm ci && npm run test:ci"
```

### 2. Make Code Changes

Implement your feature or fix.

### 3. Run Unit Tests

```bash
// turbo
docker run --rm -v "$PWD":/app -w /app node:20-alpine sh -lc "npm ci && npm run test:ci"
```

**If tests fail:** Fix the code and re-run. Do NOT proceed until all tests pass.

### 4. Run E2E Tests (if applicable)

**Requires dev server running:**
```bash
cd ~/Library/Mobile\ Documents/com~apple~CloudDocs/Documents/GitHub/knowbrow
docker compose up <service> --build
```

**Then run Playwright:**
```bash
docker run --rm -v "$PWD":/app -w /app node:20-alpine sh -lc "apk add --no-cache chromium nss freetype harfbuzz ttf-freefont >/dev/null && PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium E2E_BASE_URL=http://host.docker.internal:<PORT> npx playwright test --config=playwright.config.mjs"
```

**Ports by service:**
- food-omics-explorer: 3004
- graphmap: 3003
- ic-foods-cms: 3002
- knowmapviz: 3005

**If E2E tests fail:** Fix the code and re-run. Do NOT proceed until all tests pass.

### 5. Run Lint

```bash
// turbo
docker run --rm -v "$PWD":/app -w /app node:20-alpine sh -lc "npm ci && npm run lint"
```

### 6. Commit Only After All Tests Pass

```bash
git add -A
git commit -m "feat: description of change"
git push
```

---

## Test Types

### Unit Tests (Vitest)
- Location: `src/**/*.test.ts`
- Run: `npm run test:ci`
- Purpose: Test individual functions, hooks, utilities

### E2E Tests (Playwright)
- Location: `e2e/*.spec.ts`
- Run: `npx playwright test`
- Purpose: Test user flows, URL params, navigation, UI interactions

---

## Adding New Tests

### When to Add Tests

- **New feature:** Add unit tests for logic, E2E tests for user flows
- **Bug fix:** Add regression test that would have caught the bug
- **Refactor:** Ensure existing tests still pass, add coverage for edge cases

### Test File Naming

- Unit tests: `<module>.test.ts` next to the source file
- E2E tests: `<feature>.spec.ts` in `e2e/` directory

---

## CI/CD Integration

All repos should have GitHub Actions that:
1. Run unit tests on every push
2. Run E2E tests on every push to main
3. Block merge if tests fail

---

## CRITICAL RULES

1. **NEVER** commit without running tests first
2. **NEVER** skip failing tests - fix them
3. **NEVER** delete tests to make CI pass
4. **ALWAYS** add regression tests for bug fixes
5. **ALWAYS** iterate until all tests pass before committing
