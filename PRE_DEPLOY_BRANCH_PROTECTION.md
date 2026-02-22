# Pre-Deploy Branch Protection Requirements

This repository must satisfy the following branch protection controls before any production deployment.

## Required Settings
Enable these on `main` before deploy:
1. `Require a pull request before merging`
2. `Require approvals` (set project policy value)
3. `Require status checks to pass before merging` (at minimum: build/test pipeline)
4. `Require signed commits`

## Deployment Gate
Deployment is blocked unless all are true:
1. Branch protections are enabled on `main`
2. Release PRs are merged into protected `main`
3. Required checks are green
4. Final production readiness checklist is complete

## Temporary Relaxation Policy
If protections are temporarily relaxed for emergency throughput:
1. Record who changed the rule and why
2. Re-enable protections immediately after merge
3. Confirm protections are restored before deployment

## Scope
This requirement applies across all IC-FOODS frontend repositories and `knowbrow`.
