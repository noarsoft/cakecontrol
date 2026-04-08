# CakeControl - Claude Context

## Project Overview
React 19 + Vite 7 UI Component Library สำหรับ CAMT มช.
มี 40+ UI controls, Authentication system (JWT), Theme Light/Dark
กำลังพัฒนา Form Builder system (สร้างฟอร์มแบบ Google Forms)

## Tech Stack
- React 19, Vite 7, React Router DOM v7
- Jest 30 + Testing Library
- Chart.js 4 + Recharts 2
- Axios, CSS variables (ไม่ใช้ CSS-in-JS)
- Backend API: `http://localhost:3002` (ยังไม่มี backend repo)

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
| Auth API layer (JWT) | เขียนแล้ว รอ backend |
| User/Group/Role API layer | เขียนแล้ว รอ backend |
| File Upload API (chunked) | เขียนแล้ว รอ backend |
| Dashboard page | ว่างเปล่า ยังไม่ implement |
| Route guard | ยังไม่มี |
| Form Builder (FE) | ยังไม่เริ่ม |
| Backend repo | ยังไม่สร้าง |

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

## Data Entities (Backend API expectations)
- **User (userx)**: email, password, isPowerUser, groups, roles
- **Group (groupx)**: groupKey, name, description, members
- **Role (rolex)**: roleKey, name, description, perms_schema, perms_service
- **Application (appx)**: roles
- **File**: chunked upload (initiate → chunk → finalize)
- **Relationships**: User↔Group (M:M), User↔Role (M:M), Role↔App (M:M)

## Form Builder (Planned)
FE: หน้าสร้างฟอร์มแบบ Google Forms / Microsoft Forms มีปุ่ม +/- เพิ่ม/ลบ control
BE: แยก repo, controller + service

### DB Design (3 tables)
```
Table 1: data_schema (โครงสร้าง field)
root_id | id | previous_id | name | json | flag | activate | modified_date
- json เก็บ field definitions: [{ key, type, label, validation, options }]
- previous_id ใช้แทน version → linked list ย้อนดู schema เก่าได้
- type ที่รองรับ: textbox, number, select, checkbox, toggle, date, password, boolean, email, file, array

Table 2: data_view (การแสดงผล - 1 schema มีได้หลาย view)
root_id | id | fk_data_schema | view_type | json | modified_date
- view_type: 'table' → columns config (header, width, sortable)
- view_type: 'form' → formConfig (colno, rowno, colspan)

Table 3: data_form (ข้อมูลจริงที่กรอก)
root_id | id | fk_data_schema | data | modified_date
- data เก็บ JSON: { "name": "สมชาย", "role": "admin" }
```

### Flow
```
data_schema (กำหนด fields + types)
     ↓
data_view (กำหนดว่าแสดงยังไง)
     ↓ generate
columns config → CRUDControl → TableviewControl
formConfig     → CRUDControl → FormControl + ModalControl
     ↓
data_form (เก็บข้อมูลที่กรอก)
```

### FE Components ที่ต้องสร้างเพิ่ม
1. **SchemaBuilderControl** - หน้าสร้าง schema (กดเพิ่ม/ลบ field, กำหนด type + validation)
2. **FormPreviewControl** - preview ฟอร์มจาก schema
3. **ViewConfigControl** - ตั้งค่า columns / form layout
4. **SchemaManagerPage** - หน้า CRUD จัดการ schemas ทั้งหมด

## Known Issues
- **API URL bug**: `AUTH.BASE` ไม่มีใน config → API calls พัง (auth.jsx, user.jsx line 3)
- **Dashboard route missing**: Login navigate ไป `/dashboard` แต่ไม่มี route
- **Dashboard.jsx ว่างเปล่า**: ยังไม่ได้ implement
- **Config endpoints mismatch**: Defined endpoints (`/users`) ไม่ตรงกับ actual API paths (`/userx`, `/groupx`, `/rolex`)
- **No route guard**: ไม่มี protected routes

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
Today's date is 2026-04-08.
