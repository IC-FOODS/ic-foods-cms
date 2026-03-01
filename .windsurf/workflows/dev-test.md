---
description: How to run dev, build, and test commands for ic-foods-cms
---

# Container-Only Dev/Test Policy

**NEVER run npm commands directly on the host machine.** Always use containers.
**NEVER assume GitHub Codespaces.** Always test locally first.

## Local Development (PREFERRED)

All frontends run from the **knowbrow master docker-compose**:

```bash
cd ~/Library/Mobile\ Documents/com~apple~CloudDocs/Documents/GitHub/knowbrow
docker compose up ic-foods-cms --build
```

Access at: **http://localhost:3002**

### All Frontend Ports (from knowbrow/docker-compose.override.yml)
- **ic-foods-cms: 3002**
- graphmap: 3003
- food-omics-explorer: 3004
- knowmapviz: 3005

### Backend Ports
- django: 8010
- fastapi: 8001
- postgres: 5432
- oxigraph: 7878

## Run Tests (standalone)

```bash
// turbo
docker run --rm -v "$PWD":/app -w /app node:20-alpine sh -lc "npm ci && npm run test:ci"
```

## Run Build (standalone)

```bash
// turbo
docker run --rm -v "$PWD":/app -w /app node:20-alpine sh -lc "npm ci && npm run build"
```

## Why Containers?

- Consistent behavior across all team members
- Matches CI/CD environment exactly
- Avoids host-specific node_modules issues
- Required by project policy

## iCloud Setup (REQUIRED for macOS)

Repos in iCloud Drive need `nosync-icloud` to prevent sync conflicts with node_modules:

```bash
# One-time global install
npm i -g nosync-icloud

# Run in each frontend repo
cd ~/Library/Mobile\ Documents/com~apple~CloudDocs/Documents/GitHub/ic-foods-cms
nosync node_modules
```

This creates `node_modules.nosync/` (excluded from iCloud sync) and symlinks `node_modules` → `node_modules.nosync`.

**Why?** iCloud syncs node_modules and creates duplicate files (`file 2.js`) causing lint/build failures.

## CRITICAL RULES

1. **NEVER** use individual repo docker-compose.dev.yml for dev server
2. **ALWAYS** use knowbrow/docker-compose.override.yml master file
3. **NEVER** run npm on host machine
4. **NEVER** assume Codespaces - test locally first
5. **ALWAYS** check docker-compose.override.yml for correct ports
6. **ALWAYS** run `nosync node_modules` in iCloud repos before first use
