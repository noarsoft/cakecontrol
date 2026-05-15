# CakeControl — Agent Instructions

## Quick Context

React 19 + Vite 7 form builder. 44 control types, light/dark theme, Netflix-style business selector.
Read `CLAUDE.md` for full architecture and project structure.

## Critical Rules

1. **Never modify** files in `controls-docs/` or `rootidx/` — client-provided, read-only
2. **Never hardcode** URLs or paths — use `PAGES.*` and `API.*` from `src/lib/routes.js`
3. **Never hardcode** colors — use CSS variables from `theme.css`
4. **Never use** `:root[data-theme="dark"]` overrides — use CSS variables that auto-switch
5. **Always add** `useEffect` prop sync when a control uses `useState` from props
6. **Business isolation** — never query without `business_id` from `localStorage`
7. **Service layer** — all data calls go through `schemaService.js` (dual-mode: API vs localStorage)

## File Conventions

| Type | Location | Pattern |
|------|----------|---------|
| Control | `src/components/controls/` | `XxxControl.jsx` + `XxxControl.css` |
| Page | `src/forms/` | `XxxPage.jsx` or `Xxx.jsx` |
| Service | `src/lib/` | `xxxService.js` |
| Shared CSS | `src/styles/` | `xxx.css` (imported in `main.jsx`) |
| Demo page | `src/components/controls_doc/pages/` | `XxxPage.jsx` |
| Routes | `src/lib/routes.js` | `PAGES.*` (frontend) + `API.*` (backend) |

## Control Pattern

```jsx
import React, { useState, useEffect } from 'react';
import './XxxControl.css';

function XxxControl({ control, rowData, rowIndex, value, onChange }) {
    const resolved = value !== undefined ? value : (control.databind ? rowData?.[control.databind] : control.value);
    const [state, setState] = useState(resolved);

    useEffect(() => { setState(resolved); }, [resolved]);  // REQUIRED: prop sync

    const handleChange = (newVal) => {
        setState(newVal);
        const cb = onChange || control.onChange;
        if (cb) cb(newVal);
    };

    return <div className="xxx-control">...</div>;
}
export default XxxControl;
```

## CSS Pattern

```css
/* Always use theme variables, never hex colors */
.xxx-control {
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    transition: border-color 0.15s;
}
.xxx-control:hover { border-color: var(--border-hover); }
.xxx-control:focus { border-color: var(--accent-primary); }
.xxx-control.disabled { opacity: 0.5; cursor: not-allowed; }
```

## Navigation Pattern

```jsx
import { PAGES } from '../lib/routes';
navigate(PAGES.DASHBOARD);
navigate(PAGES.FORM_BUILDER, { state: { activeSchemaId: id } });
```

## API Pattern

```jsx
import { API } from '../lib/routes';
fetch(API.SCHEMA_LATEST(rootid));
fetch(API.DATA, { method: 'POST', body: JSON.stringify({ ... }) });
```

## Adding a New Route

1. Add constant to `PAGES` or `API` in `src/lib/routes.js`
2. For frontend: add `<Route>` in `App.jsx` using `PAGES.XXX`
3. For API: use `API.XXX` in `apiSchemaService.js`
4. Never use string literals for paths

## Service Layer

`schemaService.js` delegates to `apiSchemaService.js` (REST) or `mockSchemaService.js` (localStorage).
Auto-detects backend via `API.HEALTH`. Both share identical function signatures.
Add new service methods: implement in both files, export via `delegate()` in `schemaService.js`.

## UI & UX Mandates

- **Terminology**: Use "ข้อมูล" (Data) not "รายการ" (Items) — counters, buttons, toasts, placeholders
- **Icons**: Professional SVG (Heroicons/Lucide style) over emojis for actions
- **Delete buttons**: ghost style — subtle on default, solid red on hover, use `var(--error)` / `var(--error-light)`
- **Validation**: On-blur — red borders only after field is touched
- **Feedback**: Every async action must show `showToast` (success/error)
- **Lazy registry**: Never import control registry at top level if it causes circular deps — use `registry.jsx` pattern
- **Stringified deps**: Use `JSON.stringify(obj)` for complex objects in `useEffect` deps

## Theme Variables Cheatsheet

| Purpose | Variable |
|---------|----------|
| Background | `--bg-primary`, `--bg-secondary`, `--bg-hover`, `--bg-tertiary` |
| Text | `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-on-accent` |
| Border | `--border-primary`, `--border-secondary`, `--border-hover`, `--border-focus` |
| Accent | `--accent-primary`, `--accent-primary-hover`, `--accent-primary-light` |
| Status | `--success` / `--error` / `--warning` / `--info` + `-light` variants |
| Radius | `--radius-sm` (4) / `--radius-md` (6) / `--radius-lg` (8) / `--radius-xl` (12) |
| Shadow | `--shadow-sm` / `--shadow-md` / `--shadow-lg` |

## Shared UI Classes (`src/styles/ui.css`)

- `.ui-icon-btn` — 34x34 icon button (add `.danger` or `.success` variant)
- `.ui-btn-primary` / `.ui-btn-secondary` — standard buttons
- `.ui-badge` — pill badge with `data-variant="success|warning|error|info"`
- `.ui-toggle` — toggle switch
- `.ui-color-input` — themed color picker
- `.ui-empty-state` — empty state container with CTA

## Verification

For UI/alignment changes, verify via Playwright screenshot before finalizing.
Group logical changes into descriptive commits. Never force push unless explicitly directed.
