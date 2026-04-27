# CakeControl — Frontend Guide

> อัปเดตล่าสุด: 2026-04-27
> รวมจาก CLAUDE.md + EXECUTION.md + OVERVIEW.md + README.md + THEME docs

---

## 1. ภาพรวม

React 19 + Vite 7 UI Component Library สำหรับ CAMT มช.
เว็บแอปสำหรับ **สร้างฟอร์มและจัดการข้อมูล** คล้าย Google Forms
ได้ทั้ง **ฟอร์มกรอกข้อมูล** + **ตารางจัดการข้อมูล** (CRUD) ในตัว

- 40+ UI controls (สร้างเอง ไม่ใช้ MUI/Ant)
- Theme Light/Dark ผ่าน CSS variables
- ไม่มี auth ใช้ฟรี

### Tech Stack

- React 19, Vite 7, React Router DOM v7
- Jest 30 + Testing Library (92 tests)
- Chart.js 4 + Recharts 2
- Axios, CSS variables (ไม่ใช้ CSS-in-JS)
- Backend API: `http://localhost:3002` (rootid repo) — FE auto-detect, fallback localStorage

---

## 2. Quick Start

### Frontend อย่างเดียว (ไม่ต้องมี backend)

```bash
cd cakecontrol
npm install
npm run dev          # → http://localhost:5173
```

ไปหน้า `/formbuilder` — ข้อมูลเก็บใน localStorage, sidebar แสดง `localStorage`

### Full Stack (Frontend + Backend)

```bash
# Terminal 1 — Backend
cd rootid
npm install
npm run prisma:migrate
npm run dev              # → http://localhost:3002

# Terminal 2 — Frontend
cd cakecontrol
npm run dev              # → http://localhost:5173
```

sidebar แสดง `API` — ข้อมูลเก็บใน PostgreSQL

---

## 3. Project Structure

```
src/
├── Apis/              # API service layer
├── config/            # api.config.js
├── forms/             # FormBuilder, TemplateManager, ControlDesignerModal
│   ├── FormBuilder.jsx        # Main page (sidebar + 5 modes)
│   ├── TemplateManager.jsx    # Template list (default mode)
│   ├── ControlDesignerModal.jsx # Modal ออกแบบ fields
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
│   │   ├── index.js   # Central export ทุก control
│   │   └── *.jsx/css  # แต่ละ control มีคู่ jsx+css
│   └── controls_doc/  # Documentation + demo pages
├── ThemeContext.jsx    # Theme provider
├── theme.css          # 40+ CSS custom properties
├── App.jsx            # Router
└── main.jsx           # Entry point
```

---

## 4. Routes

| Path | Component | คำอธิบาย |
|------|-----------|---------|
| `/` | Login | หน้า login |
| `/dashboard` | Dashboard | Dashboard + sidebar nav |
| `/formbuilder` | FormBuilder | สร้าง/จัดการฟอร์ม (default: Template Manager) |
| `/form/:schemaId` | FormFillerPage | Standalone fill page |
| `/controls` | ControlsDocs | Documentation ทุก control |

---

## 5. หน้าเว็บ — UI Wireframe

```
┌─────────────┬──────────────────────────────────────────────┐
│  Sidebar    │  Main Content (เปลี่ยนตาม mode)              │
│             │                                              │
│  จัดการแม่แบบ│  MODE 0: Template Manager (default)          │
│  ─────────  │  แม่แบบทั้งหมด [ค้นหา...] [+ สร้างแม่แบบ]    │
│  ฟอร์มทั้งหมด│  ┌──────────┬───────┬────────┬────────┐     │
│  ─────────  │  │ ชื่อแม่แบบ│ Fields│ วันที่  │ จัดการ  │     │
│  > พนักงาน  │  │พนักงาน   │ 5    │22/04/26│จัดการ..│     │
│    สินค้า   │  └──────────┴───────┴────────┴────────┘     │
│             │                                              │
│             │  MODE 1: Data Manager (กด "จัดการฟอร์ม")     │
│             │  CRUDControl: table + add/edit/delete         │
│             │                                              │
│             │  MODE 2: Form Builder (กดแก้ไขฟอร์ม)         │
│             │  ControlDesignerModal: กำหนด fields           │
│             │                                              │
│             │  MODE 3: Preview (กด Preview)                │
│             │  FormControl render จาก config                │
└─────────────┴──────────────────────────────────────────────┘
```

---

## 6. Feature Status

| ส่วน | สถานะ |
|------|-------|
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
| Dashboard page | ว่างเปล่า ยังไม่ implement |

---

## 7. Control Architecture Pattern

ทุก control ทำตาม pattern เดียวกัน:

1. **Files**: `XxxControl.jsx` + `XxxControl.css`
2. **Props**: Simple controls รับ `{ control, rowData, rowIndex }`, Composite controls รับ `{ config }`
3. **CSS**: ใช้ CSS variables จาก `theme.css`
4. **Export**: `export default` แล้วเพิ่มใน `controls/index.js`
5. **Data binding**: `rowData[control.databind]` หรือ `control.value`
6. **Events**: callback pattern เช่น `control.onClick(e, rowData, rowIndex)`
7. **genControl()**: factory function ใน `TableviewControl.jsx`

### Adding a New Control

1. สร้าง `XxxControl.jsx` + `XxxControl.css` ใน `src/components/controls/`
2. เพิ่ม export ใน `controls/index.js`
3. (table) เพิ่ม case ใน `genControl()` ที่ `TableviewControl.jsx`
4. สร้าง demo page `XxxPage.jsx` ใน `controls_doc/pages/`
5. Register ใน `ControlsDocs.jsx`

---

## 8. CRUDControl

Composite control สำหรับจัดการข้อมูล CRUD:
- TableviewControl + FormControl + ModalControl + ConfirmModal + pagination
- Toolbar: search + bulk edit + add
- Dual-mode: client-side (auto) / server-side (callbacks)
- `keyField` prop ระบุ key field → selection ใช้ key value แทน index
- ถ้าส่ง `keyField` + ไม่ส่ง callbacks → Auto CRUD Mode (จัดการภายในเอง)
- Callbacks: `onAdd`, `onEdit`, `onDelete`, `onBulkDelete`, `onSearch`, `onSort`, `onPageChange`, `onChange`

---

## 9. Form Builder

### Modes

| Mode | Component | Description |
|------|-----------|-------------|
| `templates` | TemplateManager | ตารางแม่แบบทั้งหมด (default) |
| `data` | CRUDControl | จัดการข้อมูลของ schema |
| `builder` | SchemaBuilder | แก้ไข fields แบบ raw |
| `fill` | FormFiller | กรอกฟอร์มแบบ Google Forms |
| `preview` | FormPreview | Preview ฟอร์ม |

### Data Flow

```
TemplateManager → ControlDesignerModal → บันทึก
    ↓
data_schema (format: name=string, age=number)
    ↓ auto-generate
view (json_table_config) + form (json_form_config)
    ↓ transform
CRUDControl (table + modal) + FormControl
    ↓
data (ข้อมูลจริง)
```

### Service Layer — Auto-Detect Backend

`schemaService.js` → `initService()` → fetch `/api/health` (timeout 1.5s)
- ตอบ OK → `apiSchemaService` (REST API)
- ไม่ตอบ → `mockSchemaService` (localStorage + seed demo data)

API signatures เหมือนกัน — code ที่เรียกใช้ไม่ต้องรู้ว่า data มาจากไหน

### Transform Layer

`schemaTransform.js`:
- `schemaToFormConfig()` → FormControl config
- `schemaToColumnsConfig()` → TableviewControl columns
- `buildCrudConfig()` → CRUDControl config พร้อมใช้
- `generateDefaultView()` / `generateDefaultFormcfg()` → auto-generate config

---

## 10. Backend API (rootid repo)

| Method | Path | ทำอะไร |
|--------|------|--------|
| GET | `/api/schemax` | List schemas (activate=true) |
| GET/POST/PUT/DELETE | `/api/schemax/:rootid` | CRUD data_schema |
| GET/POST/PUT | `/api/viewx` | CRUD view (filter: `data_schema_id`) |
| GET/POST/PUT | `/api/formcfgx` | CRUD form (filter: `data_id`) |
| GET/POST/PUT/DELETE | `/api/formx` | CRUD data (filter: `data_schema_id`) |
| GET | `/api/health` | Health check |

Response: `{ success: true, data: {...} }` / `{ success: false, error: "...", details: [...] }`

ดู `rootid/CLAUDE.md` สำหรับ full backend detail

---

## 11. Database (4 tables)

```
data_schema  →  view (json_table_config)
             →  form (json_form_config)
             →  data (ข้อมูลจริง)
```

Default columns ทุก table: `rootid` (UUID PK), `id` (SERIAL FK), `prev_id`, `activate`, `flag`, `modify_datetime`

Supported types: string, number, yymmdd, hhmm, yymmddhhmmhh

---

## 12. Theme System

Light/Dark theme ผ่าน CSS custom properties (40+ variables)

### ใช้งาน

```jsx
// ThemeContext
const { theme, toggleTheme } = useTheme();

// ThemeSwitcher component — อยู่ใน Dashboard navbar + ControlsDocs sidebar
```

### CSS Variables (สำคัญ)

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

`data-theme="dark"` บน `<html>` → ทุก variable สลับค่าอัตโนมัติ

### Auto Detection

1. Check localStorage
2. Check system `prefers-color-scheme`
3. Default: light

### Controls ที่รองรับ Theme (27+)

Layout: FormControl, TableviewControl, GridviewControl, CardControl, AccordionControl, TabControl, TreeControl, ButtonGroupControl, PaginationControl
Input: TextboxControl, NumberControl, SelectControl, CheckboxControl, ToggleControl, DateControl, ButtonControl, LabelControl
Display: LinkControl, ImageControl, BadgeControl, IconControl, ProgressControl, ChartControl, QRCodeControl
Date/Time: DatePickerControl, CalendarControl, CalendarGridControl
Other: DropdownControl

### สร้าง Control ใหม่ — ใช้ theme variables เสมอ

```css
.new-control {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border-primary);
}
```

---

## 13. Testing

```bash
npm test              # รันทุก test
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```

### Test Suites (92 tests)

| Suite | จำนวน | ทดสอบอะไร |
|-------|-------|-----------|
| schema | 28 | FIELD_TYPES, CRUD fields, validate |
| schemaTransform | ~15 | columns config, form config, buildCrudConfig |
| mockSchemaService | ~20 | CRUD 4 tables, seedDemoData, soft delete |
| benchmarkCalc | ~15 | benchmark calculations, chart data |
| storageCalc | ~14 | storage estimation, formatBytes |

Jest 30 + jsdom, CSS mock: identity-obj-proxy, localStorage: in-memory

---

## 14. Known Issues

- **Dashboard route missing**: Login navigate ไป `/dashboard` แต่ไม่มี route
- **Dashboard.jsx ว่างเปล่า**: ยังไม่ได้ implement

---

## 15. Naming Conventions

- Controls: PascalCase + `Control` suffix
- CSS classes: kebab-case
- Demo pages: `XxxPage.jsx`
- Backend API: suffix `x` เช่น `schemax`, `viewx`
- UI ใช้ภาษาไทยเป็นหลัก

---

## Communication Rules
- ตอบตรงๆ ไม่อวย
- สงสัยก็ถาม
- แนะนำ 3 ข้อ
- ไม่มีก็บอกไม่มี
