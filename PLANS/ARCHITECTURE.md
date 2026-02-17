# IC-FOODS CMS — Architecture

> Last updated: 2026-02-09

## Runtime Contract Authority (Important)

This repository is not the runtime contract authority for embed behavior.
Canonical runtime authority is in `knowbrow`:
1. `backend/django/graphs/models.py` (`VisualizationEmbedPage`)
2. `backend/django/graphs/templates/graphs/visualization_embed_page.html`
3. `backend/django/graphs/tests/test_visualization_embed_page.py`
4. `docs/PLUGIN_CONTRACT.md`
5. `docs/plugin-contract/EMBED_EVENT_PROTOCOL.md`

All embed URL params, postMessage payloads, token semantics, and event protocol rules must align to those KnowBrow files first. This document is architectural guidance only.

## Test Execution Policy (Mandatory)

All CMS validation must run in the CMS container context. Do not treat host-local Node or Python runs as authoritative.

Required commands:
1. Frontend component/integration tests:
   `docker compose -f docker-compose.cms.yml run --rm cms-test`
2. CMS app local runtime:
   `docker compose -f docker-compose.cms.yml up cms-dev`
3. Wagtail/Django checks for KnowBrow-integrated CMS:
   `docker compose -f ../knowbrow/docker-compose.yml exec -T django python manage.py check`
4. Wagtail/Django tests for KnowBrow-integrated CMS:
   `docker compose -f ../knowbrow/docker-compose.yml exec -T django python manage.py test --keepdb`

Reason: containerized execution prevents environment drift and avoids false green results from host-specific toolchains.

## Role in the Ecosystem

IC-FOODS CMS is a **Wagtail site skin** that plugs into the [KnowBrow](https://github.com/UKnowGrow/knowbrow) platform. It provides IC-FOODS-specific pages, templates, theming, and content while inheriting platform primitives (data sources, permissions, adapters, graph configurations) from KnowBrow's Django app.

### Ecosystem Map

```
KnowBrow Platform Core (UKnowGrow/knowbrow)
    │
    ├── Django/Wagtail primitives (models, permissions, adapters)
    │       │
    │       ▼
    │   ┌──────────────────────┐
    │   │  IC-FOODS CMS        │  ◄── THIS REPO
    │   │  (IC-FOODS/           │
    │   │   ic-foods-cms)       │
    │   │                      │
    │   │  - Aggie Blue/Gold   │
    │   │    theming            │
    │   │  - HomePage           │
    │   │  - ProjectPage        │
    │   │  - AboutPage          │
    │   │  - Publications       │
    │   │  - Partners           │
    │   │  - Contact form       │
    │   └──────────────────────┘
    │
    ├── GraphMap (UKnowGrow/graphmap)         ← embeddable viz
    └── Food Omics Explorer (IC-FOODS/...)    ← embeddable viz
```

See [KnowBrow ARCHITECTURE.md](https://github.com/UKnowGrow/knowbrow/blob/main/PLANS/ARCHITECTURE.md) for the full platform architecture.

## Current State (Phase A — Submodule)

### What This Repo Is Today

A **static React/Vite SPA** — a copy of [ic-foods-website](https://github.com/IC-FOODS/ic-foods-website) with additional team photos and partner logos. It has:

- 7 pages: Home, Projects, Publications, Conferences, AboutUs, Partners, Connect
- UC Davis Aggie Blue/Gold theming (TailwindCSS via CDN)
- CSV-driven content (publications, team, partners, R&D data)
- Interactive ontology background animation on the homepage
- No Django, no Wagtail, no CMS backend

### How It Connects to KnowBrow

KnowBrow's `.gitmodules` mounts this repo at `backend/django/sites/icfoods`. However, the actual Wagtail page models (HomePage, ProjectPage, etc.) currently live in KnowBrow's `graphs/models.py`, not here. The `seed_icfoods.py` management command in KnowBrow populates Wagtail with IC-FOODS content.

### What Needs to Change

This repo needs to transform from a static SPA into a **Wagtail site app** that:

1. Owns its Wagtail page models (or inherits/extends KnowBrow's base models)
2. Owns its templates with IC-FOODS theming (Aggie Blue/Gold)
3. Owns its static assets (logos, team photos, partner logos)
4. Inherits platform primitives from KnowBrow (DataSource, permissions, adapters)
5. Can embed visualization tools (GraphMap, Food Omics Explorer) in its pages

## Target State (Phase C — Standalone Wagtail Project)

```
ic-foods-cms/
├── icfoods/
│   ├── pages/
│   │   ├── models.py          ← IC-FOODS Wagtail page models
│   │   ├── templates/
│   │   │   ├── base.html      ← extends knowbrow base, adds Aggie theming
│   │   │   ├── home_page.html
│   │   │   ├── project_page.html
│   │   │   ├── about_page.html
│   │   │   ├── publications_page.html
│   │   │   └── contact_page.html
│   │   └── static/
│   │       ├── css/icfoods.css ← Aggie Blue/Gold theme overrides
│   │       └── images/         ← logos, team photos, partner logos
│   ├── theme/
│   │   └── templatetags/      ← IC-FOODS-specific template tags
│   └── management/
│       └── commands/
│           └── seed_content.py ← seeds IC-FOODS content into Wagtail
├── requirements.txt            ← wagtail, knowbrow-django
├── manage.py
├── settings.py
└── PLANS/
```

### Integration with KnowBrow

```python
# requirements.txt (Phase C)
wagtail==6.0
knowbrow-django>=0.4.0    # platform primitives via pip

# settings.py
INSTALLED_APPS = [
    'knowbrow.graphs',        # DataSource, GraphMapConfig, permissions, adapters
    'knowbrow.auth',          # ACL, write-back workflows
    'icfoods.pages',          # IC-FOODS-specific Wagtail pages
    'icfoods.theme',          # IC-FOODS templates and static assets
    'wagtail.contrib.forms',
    'wagtail.admin',
    ...
]
```

### Embedding Visualization Tools

IC-FOODS pages can embed GraphMap and Food Omics Explorer:

```html
<!-- In a Wagtail template -->
{% block content %}
  <h1>{{ page.title }}</h1>
  <div id="graphmap-widget"
       data-api-endpoint="/api"
       data-node-id="{{ page.initial_node_id }}"
       data-adapters="fuseki,wikidata">
  </div>
  <script src="{% static 'graphmap/graphmap.umd.js' %}"></script>
{% endblock %}
```

## Theming

### Design Reference

The [ic-foods-website](https://github.com/IC-FOODS/ic-foods-website) repo is the **design reference** for all IC-FOODS theming. Key design tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `aggie-blue` | `#022851` | Primary backgrounds, headings |
| `aggie-gold` | `#FFBF00` | Accents, CTAs, highlights |
| `aggie-blueLight` | `#1b4a7a` | Secondary backgrounds |
| `aggie-gray` | `#f5f5f5` | Section backgrounds |
| `ucd-gradient` | `linear-gradient(135deg, #022851, #1b4a7a)` | Hero sections |
| Font | Inter (300–700) | All text |

### Theming Strategy

- Base Wagtail templates from KnowBrow provide layout structure
- IC-FOODS templates extend the base and apply Aggie theming via CSS overrides
- Other CMS sites (future) would provide their own theme overrides
- Viz tools receive theme name via iframe URL params and `postMessage`, and apply matching styles internally

## Developer Workflow

### CMS Dev (sandboxed — Phase A)
```bash
git clone https://github.com/IC-FOODS/ic-foods-cms.git
cd ic-foods-cms
# Edit templates, theming, page models
# Test against KnowBrow's Django via docker-compose or staging API
```

### CMS Dev (standalone — Phase C)
```bash
git clone https://github.com/IC-FOODS/ic-foods-cms.git
cd ic-foods-cms
pip install -r requirements.txt   # installs knowbrow-django
python manage.py migrate
python manage.py seed_content
python manage.py runserver
# Full Wagtail CMS running locally with IC-FOODS content
```

## Migration Plan

### Step 1: Create Wagtail App Structure
- Add `icfoods/pages/models.py` with IC-FOODS page models (move from knowbrow `graphs/models.py`)
- Add `icfoods/pages/templates/` with Aggie-themed Wagtail templates
- Move static assets (logos, photos) into `icfoods/theme/static/`

### Step 2: Template Migration
- Convert the 7 React pages into Wagtail templates
- Preserve the Aggie Blue/Gold theming and interactive elements
- Use Wagtail StreamField for flexible content blocks

### Step 3: Content Migration
- Move `seed_icfoods.py` from knowbrow into this repo
- Convert CSV data into Wagtail-managed content
- Set up Wagtail snippets for reusable content (partners, publications)

### Step 4: Viz Tool Embedding (iframe)
- Embed GraphMap and Food Omics Explorer as iframes in relevant Wagtail templates
- Pass theme (`aggie`), API endpoint, and initial context via iframe URL params
- Implement `postMessage` bridge for auth token injection and selection events
- Example:

```html
<!-- In a Wagtail template -->
{% load wagtailcore_tags %}
<iframe
  src="https://graphmap.uknowgrow.org?api={{ api_endpoint }}&theme=aggie&node={{ page.initial_node_id }}"
  width="100%" height="600"
  allow="clipboard-write"
></iframe>
```

Runtime contract source of truth:
1. [KnowBrow PLUGIN_CONTRACT.md](https://github.com/UKnowGrow/knowbrow/blob/main/docs/PLUGIN_CONTRACT.md)
2. [KnowBrow EMBED_EVENT_PROTOCOL.md](https://github.com/UKnowGrow/knowbrow/blob/main/docs/plugin-contract/EMBED_EVENT_PROTOCOL.md)
3. [KnowBrow VisualizationEmbedPage model/template/tests](https://github.com/UKnowGrow/knowbrow/tree/main/backend/django/graphs)
