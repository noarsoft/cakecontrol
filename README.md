# CakeControl — Dynamic Form Builder

ระบบสร้างฟอร์มแบบ Dynamic (คล้าย Google Forms + CRUD Table) พัฒนาด้วย React 19 + Vite 7

## Features

- **44 Control Types** — Input, Display, Chart, Layout (ไม่ใช้ MUI/Ant)
- **Form Builder** — ออกแบบฟอร์มด้วย Drag & Drop, กำหนด Config ต่อ Control
- **CRUD Data Manager** — ตาราง + ค้นหา + เพิ่ม/แก้ไข/ลบ + Export Excel
- **Multi-Page Form** — รองรับ Page Break, แบ่งฟอร์มหลายหน้า
- **Share Page** — แชร์ลิงก์ให้กรอกฟอร์มได้ (`/form/:schemaId`)
- **Light/Dark Theme** — 40+ CSS Variables, สลับธีมอัตโนมัติ
- **Column Toggle** — ซ่อน/แสดงคอลัมน์ รองรับ 100+ fields
- **Field Pagination** — แบ่งหน้า 20 fields พร้อม Search
- **Conditional Visibility** — showWhen กำหนดเงื่อนไขแสดง/ซ่อน field
- **Netflix/Steam Business Selector** — เลือกโปรไฟล์ธุรกิจ
- **Toast Notifications** — แจ้งเตือนทุก async action
- **Auto-Detect Backend** — เชื่อมต่อ API อัตโนมัติ, fallback เป็น localStorage

## Tech Stack

| Technology | Version |
|------------|---------|
| React | 19 |
| Vite | 7 |
| React Router DOM | v7 |
| Chart.js | 4 |
| Recharts | 2 |
| Jest + Testing Library | 30 (92 tests) |
| CSS | Custom Properties (no CSS-in-JS) |

## Quick Start

### Frontend only (ไม่ต้องใช้ Backend)

```bash
npm install
npm run dev          # http://localhost:5173
```

ไปที่ `/dashboard` — ข้อมูลเก็บใน localStorage

### Full Stack (Frontend + Backend)

```bash
# Terminal 1 — Backend (rootidx repo)
cd ../rootidx && npm install && npm run dev  # port 3000

# Terminal 2 — Frontend
npm run dev  # port 5173
```

## 44 Control Types

| Category | Controls |
|----------|----------|
| **Input** | Textbox, Number, Select, Dropdown, Checkbox, Toggle, Password, DatePicker, Slider, Rating, FileUpload |
| **Display** | Label, Badge/Tag, Icon, Image, Link, Progress, QRCode |
| **Chart** | Bar, Line, Pie, Doughnut, Radar, Area, Bubble, Mixed (Chart.js), Recharts |
| **Layout** | Accordion, Tab, Tree, Menu, Card, Grid, Table, Form, Modal, AlertModal, ConfirmModal |
| **Composite** | CRUD, ButtonGroup, CalendarGrid, Calendar, Pagination |

## Testing

```bash
npm test              # Run all 92 tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Architecture

```
Browser (React 19)
  → schemaService.js (auto-detect backend)
    → API online?  → REST API (port 3000) → PostgreSQL
    → API offline? → localStorage (fallback)
```

### Data Flow

```
BusinessSelector → Dashboard → FormBuilder → ControlDesignerModal → Save
    ↓
data_schema (JSON: { field: {type, label, required, ...} })
    ↓ auto-generate
view (table config) + form (form config)
    ↓ schemaTransform.js
CRUDControl (table + modal) + FormControl (form)
    ↓
data (actual records)
```

## Project Structure

```
src/
├── components/
│   ├── controls/        # 44 control types (*.jsx + *.css)
│   ├── controls_doc/    # Documentation + demo pages
│   └── ui/              # Shared components (Icon, EmptyState)
├── forms/               # FormBuilder, Dashboard, SchemaBuilder, FormFiller
├── lib/                 # Business logic (schema, schemaTransform, services)
├── styles/              # Shared UI classes (ui.css)
├── contexts/            # ToastContext
├── theme.css            # 40+ CSS custom properties
└── App.jsx              # Router
```

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** — Developer guide (architecture, patterns, conventions)
- **[docs/TEST-CASES.md](./docs/TEST-CASES.md)** — 300+ test scenarios
- **Controls Docs** — `/controls-docs` route in the app (live demo)
