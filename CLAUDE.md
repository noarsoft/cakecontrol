# CakeControl — Frontend Guide

## Overview

React 19 + Vite 7 dynamic form builder.
Web app for **creating forms and managing data** (like Google Forms with CRUD tables).

- 44 control types matching ControlsDocs (no MUI/Ant)
- Light/Dark theme via CSS variables (40+ tokens)
- Config panels for all control types in form designer
- Multi-page form support (pagebreak)
- Share page for public form filling
- Excel export
- Netflix/Steam style business selector

### Tech Stack

- React 19, Vite 7, React Router DOM v7
- Jest 30 + Testing Library (92 tests)
- Chart.js 4 + Recharts 2
- CSS variables (no CSS-in-JS), shared UI components (`src/styles/ui.css`)
- Backend API: `http://localhost:3000` (rootidx repo) — auto-detect, fallback to localStorage

---

## Quick Start

### Frontend only (no backend needed)

```bash
cd cakecontrol
npm install
npm run dev          # http://localhost:5173
```

Go to `/dashboard` — data stored in localStorage

### Full Stack (Frontend + Backend)

```bash
# Terminal 1 — Backend
cd rootidx && npm install && npm run dev  # port 3000

# Terminal 2 — Frontend
cd cakecontrol && npm run dev  # port 5173
```

---

## Project Structure

```
src/
├── contexts/          # ToastContext (global toast notifications)
├── forms/             # FormBuilder, TemplateManager, ControlDesignerModal
│   ├── FormBuilder.jsx        # Main page (topbar + 4 modes)
│   ├── Dashboard.jsx          # Dashboard — form list + summary cards
│   ├── TemplateManager.jsx    # Template list table
│   ├── ControlDesignerModal.jsx # Modal for designing fields + config
│   ├── SchemaBuilder.jsx      # Raw schema editor with config side panel
│   ├── FormFiller.jsx         # Fill form (Google Forms style, multi-page)
│   ├── FormFillerPage.jsx     # Standalone /form/:schemaId
│   ├── FormPreview.jsx        # Preview form rendering
│   ├── BusinessSelector.jsx   # Netflix/Steam profile selector (landing page)
│   └── SchemaNameInput.jsx    # Inline schema name editor
├── lib/               # Business logic
│   ├── routes.js              # Centralized route constants (PAGES + API)
│   ├── schema.js              # Schema utilities + FIELD_TYPES
│   ├── schemaTransform.js     # schema → CRUDControl/FormControl config
│   ├── schemaService.js       # Unified service (auto-detect backend)
│   ├── apiSchemaService.js    # REST API client (uses routes.js)
│   ├── mockSchemaService.js   # localStorage fallback
│   └── __tests__/             # 5 suites, 92 tests
├── styles/
│   └── ui.css                 # Shared UI components (icon buttons, badges, toggles)
├── components/
│   ├── controls/      # 44 control types + CRUDControl + ModalControl
│   │   ├── index.js   # Central export for all controls
│   │   ├── registry.jsx # genControl() factory + lazy loading
│   │   ├── crud/      # CRUDControl extracted logic (constants, useCRUDState)
│   │   ├── charts/    # useChartJS shared hook
│   │   └── *.jsx/css  # Each control has jsx+css pair
│   └── controls_doc/  # Documentation + demo pages
│       ├── pageRegistry.js  # Lazy-loaded page registry
│       └── pages/     # Individual control demo pages
├── ThemeContext.jsx    # Theme provider
├── theme.css          # 40+ CSS custom properties
├── App.jsx            # Router (uses PAGES from routes.js)
└── main.jsx           # Entry point
```

---

## Routes — `src/lib/routes.js`

All route constants are centralized in `routes.js`. Never hardcode paths.

### Frontend Pages (`PAGES`)

| Constant | Path | Component |
|----------|------|-----------|
| `PAGES.HOME` | `/` | BusinessSelector |
| `PAGES.DASHBOARD` | `/dashboard` | Dashboard |
| `PAGES.FORM_BUILDER` | `/formbuilder` | FormBuilder |
| `PAGES.FORM_FILLER` | `/form/:schemaId` | FormFillerPage |
| `PAGES.CONTROLS_DOCS` | `/controls-docs` | ControlsDocs |

### API Endpoints (`API`)

| Constant | Pattern |
|----------|---------|
| `API.HEALTH` | `GET /api/health` |
| `API.BUSINESS` | `GET/POST /api/business` |
| `API.BUSINESS_ROOT(rootid)` | `PATCH/DELETE /api/business/root/:rootid` |
| `API.SCHEMA` | `GET/POST /api/schema` |
| `API.SCHEMA_BY_BUSINESS(bizId)` | `GET /api/schema?business_id=:bizId` |
| `API.SCHEMA_ROOT(rootid)` | `PATCH/DELETE /api/schema/root/:rootid` |
| `API.SCHEMA_LATEST(rootid)` | `GET /api/schema/root/:rootid/latest` |
| `API.VIEW` | `POST /api/view` |
| `API.VIEW_BY_SCHEMA(id)` | `GET /api/view/schema/:id` |
| `API.VIEW_ROOT(rootid)` | `PATCH /api/view/root/:rootid` |
| `API.FORM` | `POST /api/form` |
| `API.FORM_BY_SCHEMA(id)` | `GET /api/form/schema/:id` |
| `API.FORM_ROOT(rootid)` | `PATCH /api/form/root/:rootid` |
| `API.DATA` | `POST /api/data` |
| `API.DATA_BY_SCHEMA(id)` | `GET /api/data/schema/:id` |
| `API.DATA_BY_SCHEMA_ROOT(rootid)` | `GET /api/data/schema-root/:rootid` |
| `API.DATA_ROOT(rootid)` | `PATCH/DELETE /api/data/root/:rootid` |
| `API.DATA_MIGRATE(rootid)` | `POST /api/data/root/:rootid/migrate-latest-schema` |

Usage:
```js
import { PAGES, API } from './lib/routes';
navigate(PAGES.DASHBOARD);
fetch(API.SCHEMA_LATEST(rootid));
```

---

## Page Layout

FormBuilder is the main workspace with a topbar and 4 modes:

```
+------------------------------------------------------------------+
|  ← Dashboard  |  [Form Name]  | ข้อมูล | แก้ไขฟอร์ม | เพิ่มข้อมูล | แชร์ |  ลบ  |
+------------------------------------------------------------------+
|                                                                    |
|  MODE: ข้อมูล (Data)                                               |
|  CRUDControl: table + search + add/edit/delete + Export Excel      |
|                                                                    |
|  MODE: แก้ไขฟอร์ม (Edit Form)                                      |
|  ControlDesignerModal: define fields + config per control type     |
|                                                                    |
|  MODE: เพิ่มข้อมูล (Fill)                                           |
|  FormFiller: Google Forms style, multi-page with pagebreak         |
|                                                                    |
|  MODE: แชร์ (Share)                                                |
|  Copy share link → /form/:schemaId                                 |
|                                                                    |
+------------------------------------------------------------------+
```

---

## Feature Status

| Feature | Status |
|---------|--------|
| 44 Control Types (input + display + chart + layout) | Done |
| CRUDControl (composite) | Done |
| ModalControl | Done |
| Theme Light/Dark | Done |
| Controls Docs + Demo pages | Done |
| Form Builder | Done |
| Template Manager | Done |
| Control Designer Modal + config panels | Done |
| Multi-page forms (pagebreak) | Done |
| Share page (/form/:schemaId) | Done |
| Excel export | Done |
| Dashboard (form list + summary) | Done |
| Backend (rootidx) | Done |
| FE-BE Integration | Done |
| Toast notifications | Done |
| Netflix/Steam business selector | Done |
| Centralized routes (routes.js) | Done |
| Shared UI components (ui.css) | Done |

---

## Control Architecture Pattern

Every control follows the same pattern:

1. **Files**: `XxxControl.jsx` + `XxxControl.css`
2. **Props**: Simple controls take `{ control, rowData, rowIndex }`, Composite controls take `{ config }`
3. **CSS**: Uses CSS variables from `theme.css` — never hardcode colors
4. **Export**: `export default` then add to `controls/index.js`
5. **Data binding**: `rowData[control.databind]` or `control.value`
6. **Prop sync**: Always add `useEffect` to sync state when `value`/`rowData` changes
7. **Events**: callback pattern e.g. `control.onClick(e, rowData, rowIndex)`
8. **genControl()**: factory function in `registry.jsx` (lazy loading pattern)

### Adding a New Control

1. Create `XxxControl.jsx` + `XxxControl.css` in `src/components/controls/`
2. Add export in `controls/index.js`
3. Add case in `genControl()` at `registry.jsx`
4. Create demo page `XxxPage.jsx` in `controls_doc/pages/`
5. Register in `pageRegistry.js`

---

## ControlDesignerModal

Modal for form creators to design fields. Each control row has:
- **Label** — display name
- **Databind** — field key in data
- **Type** — control type selector (44 types: input, display, chart, layout)
- **Config panel** — type-specific settings (e.g. placeholder, min/max, chart axes, image URL)
- **Options panel** — for dropdown/buttongroup (key/value pairs + default)

Config values are stored in `data_schema.json` and passed through via `schemaTransform.js` PASSTHROUGH_PROPS.

---

## CRUDControl

Composite control for CRUD data management:
- TableviewControl + FormControl + ModalControl + ConfirmModal + pagination
- Toolbar: search + bulk edit + add
- Dual-mode: client-side (auto) / server-side (callbacks)
- `keyField` prop specifies key field — selection uses key value instead of index
- If `keyField` set + no callbacks → Auto CRUD Mode (managed internally)
- Callbacks: `onAdd`, `onEdit`, `onDelete`, `onBulkDelete`, `onSearch`, `onSort`, `onPageChange`, `onChange`

---

## Form Builder

### Data Flow

```
BusinessSelector → Dashboard → FormBuilder → ControlDesignerModal → Save
    ↓
data_schema (JSON: { name: {type:"string"}, age: {type:"number"}, ...})
    ↓ auto-generate
view (json_table_config) + form (json_form_config)
    ↓ schemaTransform.js
CRUDControl (table + modal) + FormControl (form grid)
    ↓
data (actual records as JSON)
```

### Service Layer — Auto-Detect Backend

`schemaService.js` → `initService()` → fetch `API.HEALTH` (timeout 1.5s)
- Responds OK → `apiSchemaService` (REST API via `routes.js`)
- No response → `mockSchemaService` (localStorage + seed demo data)

API signatures are identical — calling code doesn't need to know the data source.

### Transform Layer

`schemaTransform.js`:
- `schemaToFormConfig()` → FormControl config (with PASSTHROUGH_PROPS per type)
- `schemaToColumnsConfig()` → TableviewControl columns
- `buildCrudConfig()` → CRUDControl config ready to use
- `generateDefaultView()` / `generateDefaultFormcfg()` → auto-generate config
- `getSchemaPages()` → split schema by pagebreak fields into pages

---

## Theme System

Light/Dark theme via CSS custom properties (40+ variables)

### Key CSS Variables

```css
/* Backgrounds */  --bg-primary, --bg-secondary, --bg-hover, --bg-tertiary
/* Text */         --text-primary, --text-secondary, --text-tertiary
/* Borders */      --border-primary, --border-secondary, --border-hover, --border-focus
/* Accent */       --accent-primary, --accent-primary-hover, --accent-primary-light
/* Status */       --success, --success-light, --error, --error-light, --warning, --warning-light, --info
/* Spacing */      --spacing-sm (8px), --spacing-md (12px), --spacing-lg (16px)
/* Radius */       --radius-sm (4px), --radius-md (6px), --radius-lg (8px), --radius-xl (12px)
/* Shadows */      --shadow-sm, --shadow-md, --shadow-lg
/* Text on accent */ --text-on-accent
```

### Dark Mode

`data-theme="dark"` on `<html>` — all variables switch automatically.
Auto-detection: localStorage → system `prefers-color-scheme` → default light.

### CSS Rules

- Always use CSS variables — never hardcode hex colors
- Never use `:root[data-theme="dark"]` overrides — if you need one, the base style should use a variable instead
- Shared reusable classes go in `src/styles/ui.css`

```css
.new-control {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
}
```

---

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Test Suites (92 tests)

| Suite | Count | Tests |
|-------|-------|-------|
| schema | 28 | FIELD_TYPES, CRUD fields, validate |
| schemaTransform | ~15 | columns config, form config, buildCrudConfig |
| mockSchemaService | ~20 | CRUD 4 tables, seedDemoData, soft delete |
| benchmarkCalc | ~15 | benchmark calculations, chart data |

Jest 30 + jsdom, CSS mock: identity-obj-proxy, localStorage: in-memory

---

## Naming Conventions

- Controls: PascalCase + `Control` suffix
- CSS classes: kebab-case
- Demo pages: `XxxPage.jsx`
- Route constants: UPPER_SNAKE_CASE (`PAGES.DASHBOARD`, `API.SCHEMA_ROOT`)
- Backend API: rootidx routes defined in `src/lib/routes.js`
- UI uses Thai language for labels

---

## Constraints

- **Never modify** `controls-docs/` or `rootidx/` — client-provided from initial commit
- **Never hardcode** API URLs — use `API.*` from `routes.js`
- **Never hardcode** page paths — use `PAGES.*` from `routes.js`
- **Never hardcode** colors — use CSS variables from `theme.css`
- Controls from `controls-docs` are reference only — use but don't modify
