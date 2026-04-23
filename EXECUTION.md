# EXECUTION GUIDE: CakeControl Form Builder

> สำหรับทีมอื่นที่ต้องการเข้าใจว่าระบบทำงานยังไง, รันยังไง, เทสยังไง
> อัปเดต: 2026-04-23 | Branch: `dev/pee-formbuilder`

---

## 1. ภาพรวมระบบ

CakeControl เป็น React UI Component Library ที่มี **Form Builder** — ระบบสร้างฟอร์มแบบ Google Forms

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (React 19 + Vite 7)        port 5173          │
│                                                         │
│  FormBuilder.jsx ── schemaService.js ──┐                │
│  FormFillerPage.jsx ──────────────────┤                │
│  Dashboard.jsx ───────────────────────┤                │
│                                       ▼                 │
│                              ┌──────────────┐           │
│                              │ initService() │           │
│                              └──────┬───────┘           │
│                           ตรวจ /api/health               │
│                          ┌────┴─────┐                   │
│                       พร้อม       ไม่พร้อม                │
│                          ▼          ▼                    │
│                 apiSchemaService  mockSchemaService      │
│                  (fetch REST)    (localStorage)          │
└──────────────────┬──────────────────────────────────────┘
                   │ (ถ้า backend พร้อม)
                   ▼
┌─────────────────────────────────────────────────────────┐
│  Backend: rootid repo                                   │
│  (Express 5 + Prisma + PostgreSQL 16)   port 3002       │
│                                                         │
│  /api/schemax    → schemax.service   ─┐                 │
│  /api/viewx      → viewx.service     ─┤── Prisma       │
│  /api/formcfgx   → formcfgx.service  ─┤   (PostgreSQL) │
│  /api/formx      → formx.service     ─┘                 │
│  /api/health     → { status: 'ok' }                     │
└─────────────────────────────────────────────────────────┘
```

**จุดสำคัญ**: FE รันได้โดยไม่ต้องมี backend เลย — ถ้า backend ไม่ตอบภายใน 1.5 วินาที จะ fallback ไป localStorage อัตโนมัติ

---

## 2. วิธีรัน

### 2A: Frontend อย่างเดียว (ไม่ต้องมี backend)

```bash
cd cakecontrol
npm install
npm run dev          # Vite dev server → http://localhost:5173
```

เปิดเว็บ → ไปหน้า `/formbuilder` — ข้อมูลจะเก็บใน localStorage ของ browser
sidebar จะแสดง `🟡 localStorage` เป็นตัวบอกว่าใช้ mock

### 2B: Frontend + Backend (full stack)

```bash
# Terminal 1 — Backend (rootid repo)
cd rootid
npm install
npm run prisma:migrate   # สร้าง tables
npm run dev              # Express server → http://localhost:3002

# Terminal 2 — Frontend
cd cakecontrol
npm run dev              # Vite dev server → http://localhost:5173
```

เปิดเว็บ → sidebar จะแสดง `🟢 API` — ข้อมูลเก็บใน PostgreSQL

### ตรวจว่า backend พร้อม

```bash
curl http://localhost:3002/api/health
# → {"success":true,"data":{"status":"ok","timestamp":"2026-04-23T..."}}
```

---

## 3. Database 4 Tables

ทั้ง mock (localStorage) และ backend (PostgreSQL) ใช้ schema เดียวกัน:

```
data_schema     — นิยาม fields ของฟอร์ม (name=string, age=number, ...)
    ↓
view            — config สำหรับ table view (columns, width, sortable)
form            — config สำหรับ form layout (label, colno, rowno, colspan)
    ↓
data            — ข้อมูลจริงที่กรอก (JSON)
```

**ทุก table มี columns พื้นฐาน:**
- `rootid` — UUID, PK ไม่เปลี่ยน
- `id` — auto-increment, ใช้เป็น FK
- `prev_id` — versioning (linked list, ยังไม่ใช้ใน MVP)
- `activate` — soft delete (false = ลบแล้ว)
- `modify_datetime` — format `yyyymmdd_hhmmss`

ดู `rootid/DB-DESIGN.md` สำหรับ full detail

---

## 4. Data Flow — สร้างฟอร์มจนถึงกรอกข้อมูล

### Step 1: สร้าง Schema (ผ่าน Template Manager)

```
ผู้ใช้กด "+ สร้างแม่แบบ" ใน Template Manager
    → เปิด ControlDesignerModal
    → กำหนด fields (label, databind, control type)
    → กด "บันทึก"
    → controlsToSchema() → createSchema(name, json)
    → controlsToFormcfg() → createFormcfg(schemaId, config)
    → auto-generate view → createView(schemaId, viewConfig)
```

สร้าง 3 records ทีเดียว: schema + view + formcfg

### Step 2: แก้ไข Fields (ControlDesignerModal)

```
ผู้ใช้กด "แก้ไข" ที่ row ใน Template Manager
    → เปิด ControlDesignerModal (edit mode)
    → schemaToControls() แปลง schema → controls array
    → แก้ไข label, databind, type, เพิ่ม/ลบ field
    → กด "บันทึก"
    → updateSchema + updateFormcfg + updateView
```

### Step 3: กรอกข้อมูล (mode: fill หรือ /form/:schemaId)

```
schema.json ──→ schemaToFormConfig() ──→ FormControl config
    ↓
FormControl แสดงฟอร์ม → ผู้ใช้กรอก → กด "บันทึก"
    → createFormData(schemaId, formData)
    → เก็บลง data table
```

### Step 4: ดูข้อมูล (mode: data)

```
schema.json ──→ buildCrudConfig() ──→ CRUDControl config
    ↓
CRUDControl แสดงตาราง + Add/Edit/Delete ได้
    → onAdd/onEdit/onDelete ──→ createFormData/updateFormData/deleteFormData
```

---

## 5. Service Layer — Auto-Detect Backend

ไฟล์หลัก: `src/lib/schemaService.js`

```
initService()
    │
    ├── fetch('http://localhost:3002/api/health', timeout 1.5s)
    │
    ├── ตอบ OK → import('./apiSchemaService') → useApi = true
    │             (dynamic import — โหลดเฉพาะเมื่อต้องใช้)
    │
    └── ไม่ตอบ / error → useApi = false → mock.seedDemoData()
                          (ใช้ localStorage + seed demo data)
```

**ทุกฟังก์ชัน** (getSchemas, createSchema, ...) ถูก wrap ให้ return Promise:
- ถ้า `useApi = true` → เรียก `apiSchemaService.functionName(...)`
- ถ้า `useApi = false` → เรียก `mockSchemaService.functionName(...)` แล้ว wrap ด้วย `Promise.resolve()`

**หมายความว่า**: code ที่เรียกใช้ไม่ต้องรู้เลยว่า data มาจากไหน — API signatures เหมือนกันหมด

---

## 6. Backend API

Backend อยู่ที่ repo `rootid/` — ดู `rootid/backend.md` สำหรับ full detail

### Endpoints ทั้งหมด

| Method | Path | Body | ทำอะไร |
|--------|------|------|--------|
| GET | `/api/schemax` | - | List schemas ที่ activate=true |
| GET | `/api/schemax/:rootid` | - | Get schema by rootid (UUID) |
| POST | `/api/schemax` | `{ name, json }` | สร้าง schema ใหม่ |
| PUT | `/api/schemax/:rootid` | `{ name?, json?, flag? }` | แก้ไข schema |
| DELETE | `/api/schemax/:rootid` | - | Soft delete (activate=false) |
| GET | `/api/viewx?data_schema_id=X` | - | List views ของ schema |
| POST | `/api/viewx` | `{ data_schema_id, view_type, json_table_config }` | สร้าง view |
| PUT | `/api/viewx/:rootid` | `{ json_table_config? }` | แก้ไข view |
| GET | `/api/formcfgx?data_id=X` | - | List formcfgs ของ schema |
| POST | `/api/formcfgx` | `{ data_id, json_form_config }` | สร้าง formcfg |
| PUT | `/api/formcfgx/:rootid` | `{ json_form_config? }` | แก้ไข formcfg |
| GET | `/api/formx?data_schema_id=X` | - | List form data ของ schema |
| POST | `/api/formx` | `{ data_schema_id, data }` | สร้าง form record |
| PUT | `/api/formx/:rootid` | `{ data }` | แก้ไข form data |
| DELETE | `/api/formx/:rootid` | - | Soft delete |
| GET | `/api/health` | - | Health check |

### Response Format

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "Validation failed", "details": [...] }
```

---

## 7. Transform Layer — schema → UI config

ไฟล์: `src/lib/schemaTransform.js`

```
schemaToFormConfig(schemaJson, formcfgJson)
    → สร้าง FormControl config (controls array + layout grid)

schemaToColumnsConfig(schemaJson, viewJson)
    → สร้าง column config สำหรับ TableviewControl

buildCrudConfig({ schemaJson, viewJson, formcfgJson, data, keyField })
    → รวม columns + formConfig + data → CRUDControl config พร้อมใช้

generateDefaultView(schemaJson)
    → Auto-generate view config จาก schema fields

generateDefaultFormcfg(schemaJson)
    → Auto-generate form layout config จาก schema fields
```

**Field type mapping**:
| Schema Type | Control Type |
|-------------|-------------|
| string | textbox |
| number | number |
| boolean | toggle |
| date | date |
| email | textbox |
| file | file |
| select | dropdown |

---

## 8. Testing

### รันเทส

```bash
# รันทุก test suite
npm test

# รันเฉพาะไฟล์
npx jest src/lib/__tests__/schema.test.js

# รันแบบ watch
npm run test:watch

# รัน + coverage report
npm run test:coverage
```

### Test Suites (92 tests)

| Suite | ไฟล์ | จำนวน test | ทดสอบอะไร |
|-------|------|-----------|-----------|
| schema | `schema.test.js` | 28 | FIELD_TYPES, createEmptySchema, addField, removeField, updateField, moveField, getFieldKeys, getFieldEntries, validateSchema |
| schemaTransform | `schemaTransform.test.js` | ~15 | schemaToColumnsConfig, schemaToFormConfig, buildCrudConfig, generateDefaultView, generateDefaultFormcfg |
| mockSchemaService | `mockSchemaService.test.js` | ~20 | CRUD 4 tables, seedDemoData, auto-increment, date format, soft delete |
| benchmarkCalc | `benchmarkCalc.test.js` | ~15 | DB benchmark calculation functions, chart data generation |
| storageCalc | `storageCalc.test.js` | ~14 | Storage estimation (PG/Mongo), growth projection, formatBytes |

### Jest Config

- Framework: **Jest 30** + jsdom environment
- CSS/images: mock ด้วย `identity-obj-proxy`
- localStorage: mock ด้วย in-memory object (รีเซ็ตทุก test ใน `beforeEach`)
- fetch: mock ด้วย `whatwg-fetch`
- Babel: `@babel/preset-env` + `@babel/preset-react`

---

## 9. File Map

### Frontend — Form Builder Core

```
src/lib/
├── schema.js              ← Schema utilities (addField, removeField, validate...)
├── schemaTransform.js     ← แปลง schema → CRUDControl/FormControl config
├── schemaService.js       ← Unified service layer (auto-detect backend)
├── apiSchemaService.js    ← REST API client (lazy loaded)
├── mockSchemaService.js   ← localStorage CRUD (fallback)
├── benchmarkCalc.js       ← DB benchmark calculations
├── storageCalc.js         ← Storage estimation functions
└── __tests__/             ← Test files (5 suites, 92 tests)

src/forms/
├── FormBuilder.jsx        ← Main form builder page (sidebar + 5 modes)
├── FormBuilder.css        ← Styles
├── TemplateManager.jsx    ← Template list (default mode)
├── ControlDesignerModal.jsx ← Modal ออกแบบ fields
├── SchemaBuilder.jsx      ← Raw schema editor
├── SchemaNameInput.jsx    ← Schema name input component
├── FormFillerPage.jsx     ← Standalone /form/:schemaId page
├── Dashboard.jsx          ← Dashboard page with sidebar nav
└── Dashboard.css
```

### Backend — rootid repo

```
rootid/
├── prisma/schema.prisma   ← DB schema (4 tables)
├── src/
│   ├── app.js             ← Express app setup
│   ├── server.js          ← Entry point (port 3002)
│   ├── config/db.prisma.js
│   ├── controllers/       ← Factory pattern (base + 4 tables)
│   ├── services/          ← Factory pattern (base + 4 tables)
│   ├── routes/            ← 4 CRUD route files
│   ├── validators/        ← Zod schemas
│   ├── middlewares/       ← error handler, validate
│   └── __tests__/         ← 95 tests (unit + integration)
```

---

## 10. Routes (Frontend)

| Path | Component | คำอธิบาย |
|------|-----------|---------|
| `/` | Login | หน้า login |
| `/dashboard` | Dashboard | Dashboard + sidebar nav |
| `/formbuilder` | FormBuilder | สร้าง/จัดการฟอร์ม (default: Template Manager) |
| `/form/:schemaId` | FormFillerPage | Standalone fill page (แชร์ link ได้) |
| `/controls` | ControlsDocs | Documentation ทุก control |

---

## 11. สิ่งที่ยังไม่ทำ (Deferred)

| รายการ | เหตุผล |
|--------|--------|
| ViewConfigControl | Auto-generate ใช้งานได้แล้ว ยังไม่ต้องแก้ manual |
| Component tests | ใช้ unit tests ของ lib ก่อน |
| E2E tests (Playwright) | Optional สำหรับ MVP |
| Auth | ไม่มี — ใช้ฟรี |
