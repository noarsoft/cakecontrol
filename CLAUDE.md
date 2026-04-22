# CakeControl - Claude Context

## Project Overview
React 19 + Vite 7 UI Component Library สำหรับ CAMT มช.
มี 40+ UI controls, Theme Light/Dark, ไม่มี auth ใช้ฟรี
กำลังพัฒนา Form Builder system (สร้างฟอร์มแบบ Google Forms)

## Tech Stack
- React 19, Vite 7, React Router DOM v7
- Jest 30 + Testing Library
- Chart.js 4 + Recharts 2
- Axios, CSS variables (ไม่ใช้ CSS-in-JS)
- Backend API: `http://localhost:3002` (rootid repo)

## Project Structure
```
src/
├── Apis/              # API service layer (auth.jsx, user.jsx)
├── config/            # api.config.js
├── forms/             # Login, Register, Dashboard (ว่าง)
├── components/
│   ├── controls/      # 40+ UI controls + CRUDControl + ModalControl
│   │   ├── index.js   # Central export ทุก control
│   │   └── *.jsx/css  # แต่ละ control มีคู่ jsx+css
│   └── controls_doc/  # Documentation + demo pages
│       ├── ControlsDocs.jsx  # Main hub (state-based nav)
│       └── pages/     # 1 demo page ต่อ 1 control
├── ThemeContext.jsx    # Theme provider
├── App.jsx            # Router
└── main.jsx           # Entry point
```

## Feature Status

| ส่วน | สถานะ |
|------|-------|
| 40+ UI Controls | Done |
| CRUDControl (composite) | Done |
| ModalControl | Done |
| Theme Light/Dark | Done |
| Controls Docs + Demo pages | Done |
| Dashboard page | ว่างเปล่า ยังไม่ implement |
| Form Builder (FE) | Done |
| Backend repo (rootid) | Done — Express 5 + Prisma |

## Control Architecture Pattern
ทุก control ทำตาม pattern เดียวกัน:
1. **Files**: `XxxControl.jsx` + `XxxControl.css` (คู่กัน)
2. **Props**: Simple controls รับ `{ control, rowData, rowIndex }`, Composite controls รับ `{ config }`
3. **CSS**: ใช้ CSS variables จาก `theme.css` เช่น `--bg-primary`, `--accent-primary`
4. **Export**: `export default` แล้วเพิ่มใน `controls/index.js`
5. **Data binding**: `rowData[control.databind]` หรือ `control.value`
6. **Events**: callback pattern เช่น `control.onClick(e, rowData, rowIndex)`
7. **genControl()**: factory function ใน `TableviewControl.jsx` ที่ map type string → React component

## Adding a New Control (Checklist)
1. สร้าง `XxxControl.jsx` + `XxxControl.css` ใน `src/components/controls/`
2. เพิ่ม export ใน `controls/index.js`
3. (ถ้าต้องใช้ใน table) เพิ่ม case ใน `genControl()` ที่ `TableviewControl.jsx`
4. สร้าง demo page `XxxPage.jsx` ใน `controls_doc/pages/`
5. Register ใน `ControlsDocs.jsx`: pages object + switch case + import

## CRUDControl
Composite control แบบ dashboard สำหรับจัดการข้อมูล CRUD
- ประกอบจาก controls ที่มีอยู่: TableviewControl, FormControl, ModalControl, ConfirmModal, ButtonControl, TextboxControl, CheckboxControl, PaginationControl
- มี: Toolbar (search + bulk edit + add), Table, Pagination, Add/Edit Modal, Delete Confirm
- Bulk edit mode: กดปุ่มแล้ว checkbox ค่อยโผล่
- Dual-mode: client-side (auto) / server-side (ถ้าส่ง callback)
- Callbacks: `onAdd`, `onEdit`, `onDelete`, `onBulkDelete`, `onSearch`, `onSort`, `onPageChange`, `onChange`
- Thai labels เป็น default

### keyField
- `keyField` prop ระบุชื่อ field ที่เป็น key เช่น `'id'`, `'userId'`
- Selection (checkbox) ใช้ key value แทน array index → data เปลี่ยนก็ไม่พัง
- Callback signatures: `onEdit(formData, oldData, rowKey, rowIndex)`, `onDelete(rowData, rowKey, rowIndex)`, `onBulkDelete(selectedItems, selectedKeys)`
- ถ้าไม่ส่ง keyField → fallback ใช้ index เหมือนเดิม (backward compatible)

### Auto CRUD Mode
- ถ้าส่ง `keyField` + ไม่ส่ง callbacks → CRUDControl จัดการ add/edit/delete ภายในเอง
- ใช้ `onChange(newData)` เพื่อ sync data กลับ parent

## ModalControl
- Generic modal component รองรับ custom content (children)
- Props: `isOpen`, `title`, `onClose`, `size` (sm/md/lg/xl), `children`, `footer`
- CRUDControl ใช้ ModalControl สำหรับ Add/Edit modal

## Form Builder
FE: หน้าสร้างฟอร์มแบบ Google Forms / Microsoft Forms
BE: rootid repo (Express 5 + Prisma + PostgreSQL)
ไม่มี auth ใช้ฟรี

### DB Design (4 tables) — ดู DB-DESIGN.md สำหรับ full detail

**Design Principles**:
- `rootid` = UUID PK ไม่เปลี่ยน, `id` = SERIAL ใช้เป็น FK
- `prev_id` อิง `id` (versioning via linked list)
- Date format: VARCHAR `yyyymmdd_hhmmss`
- Default columns ทุก table: `rootid`, `id`, `prev_id`, `activate`, `flag`, `modify_datetime`

```
Table 1: data_schema — เช็ค format ของ data (key + type), json column: `json`
Table 2: view — โชว์ตาราง, FK: `data_schema_id`, json column: `json_table_config`
Table 3: form — form config, FK: `data_id` → data_schema, json column: `json_form_config`
Table 4: data — ข้อมูลจริง, FK: `data_schema_id`, json column: `data`
```

**Supported types**: string, number, yymmdd, hhmm, yymmddhhmmhh

### Flow
```
data_schema (เช็ค format: name=string, age=number)
     ↓
view (โชว์ตารางยังไง: json_table_config)
form (ฟอร์มหน้าตายังไง: json_form_config)
     ↓ generate
json_table_config → CRUDControl → TableviewControl
json_form_config  → CRUDControl → FormControl + ModalControl
     ↓
data (เก็บข้อมูลจริง)
```

### FE Service Layer
- `schemaService.js` — strategy pattern: auto-detect API vs localStorage
- `apiSchemaService.js` — API CRUD (expects `{ success, data }` response)
- `mockSchemaService.js` — localStorage fallback

## Known Issues
- **Dashboard route missing**: Login navigate ไป `/dashboard` แต่ไม่มี route
- **Dashboard.jsx ว่างเปล่า**: ยังไม่ได้ implement

## Communication Rules
- ตอบตรงๆ ไม่อวย
- สงสัยก็ถาม
- แนะนำ 3 ข้อ
- ไม่มีก็บอกไม่มี

## Naming Conventions
- Backend API: suffix `x` เช่น `userx`, `groupx`, `rolex`, `appx`
- Controls: PascalCase + `Control` suffix เช่น `ButtonControl`, `CRUDControl`
- CSS classes: kebab-case เช่น `crud-toolbar`, `btn-control`
- Demo pages: `XxxPage.jsx`
- UI ใช้ภาษาไทยเป็นหลัก

# currentDate
Today's date is 2026-04-22.
