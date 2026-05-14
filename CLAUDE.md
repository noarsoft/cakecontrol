# CakeControl — Frontend Guide

## Overview

React 19 + Vite 7 UI Component Library for dynamic form building.
Web app for **creating forms and managing data** (like Google Forms with CRUD tables).

- 40+ custom UI controls (no MUI/Ant)
- Light/Dark theme via CSS variables
- No auth — free to use

### Tech Stack

- React 19, Vite 7, React Router DOM v7
- Jest 30 + Testing Library (92 tests)
- Chart.js 4 + Recharts 2
- Axios, CSS variables (no CSS-in-JS)
- Backend API: `http://localhost:3002` (rootid repo) — auto-detect, fallback to localStorage

---

## Quick Start

### Frontend only (no backend needed)

```bash
cd cakecontrol
npm install
npm run dev          # http://localhost:5173
```

Go to `/formbuilder` — data stored in localStorage, sidebar shows `localStorage`

### Full Stack (Frontend + Backend)

```bash
# Terminal 1 — Backend
cd rootid && npm install && npm run prisma:migrate && npm run dev  # port 3002

# Terminal 2 — Frontend
cd cakecontrol && npm run dev  # port 5173
```

Sidebar shows `API` — data stored in PostgreSQL

---

## Project Structure

```
src/
├── Apis/              # API service layer
├── config/            # api.config.js
├── forms/             # FormBuilder, TemplateManager, ControlDesignerModal
│   ├── FormBuilder.jsx        # Main page (sidebar + 5 modes)
│   ├── TemplateManager.jsx    # Template list (default mode)
│   ├── ControlDesignerModal.jsx # Modal for designing fields
│   ├── SchemaBuilder.jsx      # Raw schema editor
│   ├── FormFillerPage.jsx     # Standalone /form/:schemaId
│   └── Dashboard.jsx          # Dashboard page
├── lib/               # Business logic
│   ├── schema.js              # Schema utilities
│   ├── schemaTransform.js     # schema → CRUDControl/FormControl config
│   ├── schemaService.js       # Unified service (auto-detect backend)
│   ├── apiSchemaService.js    # REST API client (lazy loaded)
│   ├── mockSchemaService.js   # localStorage fallback
│   └── __tests__/             # 5 suites, 92 tests
├── components/
│   ├── controls/      # 40+ UI controls + CRUDControl + ModalControl
│   │   ├── index.js   # Central export for all controls
│   │   └── *.jsx/css  # Each control has jsx+css pair
│   └── controls_doc/  # Documentation + demo pages
├── ThemeContext.jsx    # Theme provider
├── theme.css          # 40+ CSS custom properties
├── App.jsx            # Router
└── main.jsx           # Entry point
```

---

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Login | Login page |
| `/dashboard` | Dashboard | Dashboard + sidebar nav |
| `/formbuilder` | FormBuilder | Create/manage forms (default: Template Manager) |
| `/form/:schemaId` | FormFillerPage | Standalone fill page |
| `/controls` | ControlsDocs | Documentation for all controls |

---

## Page Layout

```
+---------------+----------------------------------------------+
|  Sidebar      |  Main Content (changes by mode)              |
|               |                                              |
|  Manage       |  MODE 0: Template Manager (default)          |
|  Templates    |  All templates [Search...] [+ Create]        |
|  ---------    |  +----------+-------+--------+--------+      |
|  All Forms    |  | Name     | Fields| Date   | Manage |      |
|  ---------    |  | Employee | 5     | 04/26  | ...    |      |
|  > Employee   |  +----------+-------+--------+--------+      |
|    Product    |                                              |
|               |  MODE 1: Data Manager (click "Manage Form")  |
|               |  CRUDControl: table + add/edit/delete        |
|               |                                              |
|               |  MODE 2: Form Builder (click edit form)      |
|               |  ControlDesignerModal: define fields          |
|               |                                              |
|               |  MODE 3: Preview (click Preview)             |
|               |  FormControl rendered from config             |
+---------------+----------------------------------------------+
```

---

## Feature Status

| Feature | Status |
|---------|--------|
| 40+ UI Controls | Done |
| CRUDControl (composite) | Done |
| ModalControl | Done |
| Theme Light/Dark | Done |
| Controls Docs + Demo pages | Done |
| Form Builder (FE) | Done |
| Template Manager | Done |
| Control Designer Modal | Done |
| Backend (rootid) | Done |
| FE-BE Integration | Done |
| Dashboard page | Empty — not implemented |

---

## Control Architecture Pattern

Every control follows the same pattern:

1. **Files**: `XxxControl.jsx` + `XxxControl.css`
2. **Props**: Simple controls take `{ control, rowData, rowIndex }`, Composite controls take `{ config }`
3. **CSS**: Uses CSS variables from `theme.css`
4. **Export**: `export default` then add to `controls/index.js`
5. **Data binding**: `rowData[control.databind]` or `control.value`
6. **Events**: callback pattern e.g. `control.onClick(e, rowData, rowIndex)`
7. **genControl()**: factory function in `TableviewControl.jsx`

### Adding a New Control

1. Create `XxxControl.jsx` + `XxxControl.css` in `src/components/controls/`
2. Add export in `controls/index.js`
3. (table) Add case in `genControl()` at `TableviewControl.jsx`
4. Create demo page `XxxPage.jsx` in `controls_doc/pages/`
5. Register in `ControlsDocs.jsx`

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

### Modes

| Mode | Component | Description |
|------|-----------|-------------|
| `templates` | TemplateManager | All templates table (default) |
| `data` | CRUDControl | Manage data for a schema |
| `builder` | SchemaBuilder | Edit fields (raw) |
| `fill` | FormFiller | Fill form (Google Forms style) |
| `preview` | FormPreview | Preview form |

### Data Flow

```
TemplateManager → ControlDesignerModal → Save
    ↓
data_schema (format: name=string, age=number)
    ↓ auto-generate
view (json_table_config) + form (json_form_config)
    ↓ transform
CRUDControl (table + modal) + FormControl
    ↓
data (actual records)
```

### Service Layer — Auto-Detect Backend

`schemaService.js` → `initService()` → fetch `/api/health` (timeout 1.5s)
- Responds OK → `apiSchemaService` (REST API)
- No response → `mockSchemaService` (localStorage + seed demo data)

API signatures are identical — calling code doesn't need to know the data source.

### Transform Layer

`schemaTransform.js`:
- `schemaToFormConfig()` → FormControl config
- `schemaToColumnsConfig()` → TableviewControl columns
- `buildCrudConfig()` → CRUDControl config ready to use
- `generateDefaultView()` / `generateDefaultFormcfg()` → auto-generate config

---

## Theme System

Light/Dark theme via CSS custom properties (40+ variables)

### Usage

```jsx
const { theme, toggleTheme } = useTheme();
// ThemeSwitcher component — in Dashboard navbar + ControlsDocs sidebar
```

### Key CSS Variables

```css
/* Backgrounds */  --bg-primary, --bg-secondary, --bg-hover
/* Text */         --text-primary, --text-secondary, --text-tertiary
/* Borders */      --border-primary, --border-focus
/* Accent */       --accent-primary, --accent-primary-hover
/* Status */       --success, --error, --warning, --info
/* Spacing */      --spacing-sm (8px), --spacing-md (12px), --spacing-lg (16px)
/* Radius */       --radius-sm (4px), --radius-md (6px), --radius-lg (8px)
/* Shadows */      --shadow-sm, --shadow-md, --shadow-lg
```

### Dark Mode

`data-theme="dark"` on `<html>` — all variables switch automatically

### Auto Detection

1. Check localStorage
2. Check system `prefers-color-scheme`
3. Default: light

### Creating New Controls — always use theme variables

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

## Known Issues

- **Dashboard route missing**: Login navigates to `/dashboard` but route doesn't exist
- **Dashboard.jsx empty**: Not implemented yet

---

## Naming Conventions

- Controls: PascalCase + `Control` suffix
- CSS classes: kebab-case
- Demo pages: `XxxPage.jsx`
- Backend API: suffix `x` e.g. `schemax`, `viewx`
- UI uses Thai language for labels
