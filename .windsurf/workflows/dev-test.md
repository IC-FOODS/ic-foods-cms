---
description: How to run dev, build, and test commands for ic-foods-cms
---

# Container-Only Dev/Test Policy

**NEVER run npm commands directly on the host machine.** Always use containers.

## Run Tests

```bash
// turbo
docker run --rm -v "$PWD":/app -w /app node:20-alpine sh -lc "npm ci && npm run test:ci"
```

## Run Build

```bash
// turbo
docker run --rm -v "$PWD":/app -w /app node:20-alpine sh -lc "npm ci && npm run build"
```

## Why Containers?

- Consistent behavior across all team members
- Matches CI/CD environment exactly
- Avoids host-specific node_modules issues
- Required by project policy
