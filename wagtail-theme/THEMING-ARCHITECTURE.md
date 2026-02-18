# Wagtail Admin Theming Architecture

## Goal
Create a reusable tenant theming system so each tenant changes tokens/assets, not core templates.

## Layers
1. `admin-foundation.css`
Generic readability, spacing, table/forms, accessibility, and icon normalization.
2. `admin-layout.css`
Header/sidebar/account placement and reusable structural classes.
3. `tenant-<name>.css`
Tenant tokens (colors, accents, Wagtail CSS vars).

`icfoods-wagtail.css` is now only a composition file importing those layers.

## Template Contract
- `base_tenant.html`: shared shell for all tenants.
- `base.html`: tenant adapter (logo, favicon, account label/icon).
- `login.html`: can stay tenant-specific copy/text, but style should be CSS-first.

## Migration Rules
- No inline style blocks for visual design in page templates.
- No page-level theme overrides unless functionally required.
- Prefer CSS variables and semantic classes.
- Keep `public/wagtail-theme` synced from `wagtail-theme` source.

## Tenant Onboarding
1. Copy `tenant-icfoods.css` to `tenant-<tenant>.css`.
2. Set logo/favicon in tenant `base.html` adapter.
3. Point composed CSS to the new tenant file.
4. Validate in containerized tests/build only.
