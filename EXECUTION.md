# EXECUTION GUIDE: CakeControl Form Builder

> สำหรับทีมอื่นที่ต้องการเข้าใจว่าระบบทำงานยังไง, รันยังไง, เทสยังไง
> อัปเดต: 2026-04-16 | Branch: `dev/pee-formbuilder`

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
│  Backend (Express 5 + better-sqlite3)   port 3002       │
│                                                         │
│  /api/schemas    → schemaRepo   ─┐                      │
│  /api/views      → viewRepo     ─┤── database.js        │
│  /api/formcfgs   → formcfgRepo  ─┤   (SQLite file)      │
│  /api/forms      → formRepo     ─┘                      │
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
# Terminal 1 — Backend
cd cakecontrol/server
npm install
npm run seed         # สร้าง demo data (พนักงาน + สินค้า)
npm run dev          # Express server → http://localhost:3002

# Terminal 2 — Frontend
cd cakecontrol
npm run dev          # Vite dev server → http://localhost:5173
```

เปิดเว็บ → sidebar จะแสดง `🟢 API` — ข้อมูลเก็บใน SQLite file (`server/cakecontrol.db`)

### ตรวจว่า backend พร้อม

```bash
curl http://localhost:3002/api/health
# → {"status":"ok","timestamp":"2026-04-16T..."}
```

---

## 3. Database 4 Tables

ทั้ง mock (localStorage) และ backend (SQLite) ใช้ schema เดียวกัน:

```
data_schema     — นิยาม fields ของฟอร์ม (name=string, age=number, ...)
    ↓
data_view       — config สำหรับ table view (columns, width, sortable)
data_formcfg    — config สำหรับ form layout (label, colno, rowno, colspan)
    ↓
data_form       — ข้อมูลจริงที่กรอก (JSON)
```

**ทุก table มี columns พื้นฐาน:**
- `root_id` — UUID, PK ไม่เปลี่ยน
- `id` — auto-increment, ใช้เป็น FK
- `previous_id` — versioning (linked list, ยังไม่ใช้ใน MVP)
- `activate` — soft delete (0 = ลบแล้ว)
- `modified_date_time` — format `yyyymmdd_hhmmss`

**ตัวอย่าง schema JSON** ของ "พนักงาน":
```json
{
  "name": { "type": "string", "label": "ชื่อ-นามสกุล" },
  "age": { "type": "number", "label": "อายุ" },
  "role": { "type": "select", "label": "สิทธิ์", "enum": ["Admin", "User", "Guest"] },
  "email": { "type": "email", "label": "อีเมล" },
  "is_active": { "type": "boolean", "label": "สถานะ" }
}
```

---

## 4. Data Flow — สร้างฟอร์มจนถึงกรอกข้อมูล

### Step 1: สร้าง Schema

```
ผู้ใช้กด "+ สร้างฟอร์มใหม่" ใน sidebar
    → FormBuilder.handleAddSchema()
    → createSchema('ฟอร์มใหม่', { field_1: { type: 'string' } })
    → createView(schemaId, 'table', generateDefaultView(...))
    → createFormcfg(schemaId, generateDefaultFormcfg(...))
```

สร้าง 3 records ทีเดียว: schema + view + formcfg
view กับ formcfg สร้างอัตโนมัติจาก schema ด้วย `schemaTransform.js`

### Step 2: แก้ไข Fields (mode: builder)

```
ผู้ใช้เพิ่ม/ลบ/ย้าย field ใน SchemaBuilder
    → ทำงานกับ local draft (ยังไม่ save)
    → กด "บันทึก"
    → handleSchemaJsonChange(newJson)
    → updateSchema(id, { json: newJson })
    → auto-update view + formcfg ให้ตรงกับ fields ใหม่
```

### Step 3: กรอกข้อมูล (mode: fill หรือ /form/:schemaId)

```
schema.json ──→ schemaToFormConfig() ──→ FormControl config
    ↓
FormControl แสดงฟอร์ม → ผู้ใช้กรอก → กด "บันทึก"
    → createFormData(schemaId, formData)
    → เก็บลง data_form table
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

### Endpoints ทั้งหมด

| Method | Path | Body | ทำอะไร |
|--------|------|------|--------|
| GET | `/api/schemas` | - | List schemas ที่ activate=1 |
| GET | `/api/schemas/:id` | - | Get schema by id |
| POST | `/api/schemas` | `{ name, json }` | สร้าง schema ใหม่ |
| PUT | `/api/schemas/:id` | `{ name?, json?, flag? }` | แก้ไข schema |
| DELETE | `/api/schemas/:id` | - | Soft delete (activate=0) |
| GET | `/api/views?schemaId=X` | - | List views ของ schema |
| POST | `/api/views` | `{ schemaId, viewType, json, name }` | สร้าง view |
| PUT | `/api/views/:id` | `{ json?, name? }` | แก้ไข view |
| GET | `/api/formcfgs?schemaId=X` | - | List formcfgs ของ schema |
| POST | `/api/formcfgs` | `{ schemaId, json, name }` | สร้าง formcfg |
| PUT | `/api/formcfgs/:id` | `{ json?, name? }` | แก้ไข formcfg |
| GET | `/api/forms?schemaId=X` | - | List form data ของ schema |
| POST | `/api/forms` | `{ schemaId, data }` | สร้าง form record |
| PUT | `/api/forms/:id` | `{ data }` | แก้ไข form data |
| DELETE | `/api/forms/:id` | - | Soft delete |
| GET | `/api/health` | - | Health check |

### Response Format

ทุก endpoint ตอบ format เดียวกัน:

```json
// สำเร็จ
{ "success": true, "data": { ... } }

// ไม่สำเร็จ
{ "success": false, "error": "Schema not found" }
```

### ทดสอบ API ด้วย curl

```bash
# List schemas
curl http://localhost:3002/api/schemas

# สร้าง schema ใหม่
curl -X POST http://localhost:3002/api/schemas \
  -H "Content-Type: application/json" \
  -d '{"name":"ทดสอบ","json":{"field1":{"type":"string"}}}'

# กรอกข้อมูล
curl -X POST http://localhost:3002/api/forms \
  -H "Content-Type: application/json" \
  -d '{"schemaId":1,"data":{"field1":"hello"}}'

# ดูข้อมูลของ schema 1
curl "http://localhost:3002/api/forms?schemaId=1"

# ลบ (soft delete)
curl -X DELETE http://localhost:3002/api/forms/1
```

---

## 7. Transform Layer — schema → UI config

ไฟล์: `src/lib/schemaTransform.js`

ทำหน้าที่แปลง schema JSON ไปเป็น config ที่ controls เข้าใจ:

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

# รันแบบ watch (auto-rerun เมื่อไฟล์เปลี่ยน)
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

### วิธีเทส — ยิงทีเดียวทั้งหมด

```bash
npm test
```

**ผลลัพธ์ที่ควรได้:**
```
Test Suites: 5 passed, 5 total
Tests:       92 passed, 92 total
```

> หมายเหตุ: จะเห็น 2 suites failed จาก `src/Apis_test/` — เป็นของเดิมที่ config ไม่ตรง ไม่เกี่ยวกับ Form Builder

### วิธีเทส — ยิงทีละตัว

```bash
# ทดสอบเฉพาะ schema utilities
npx jest schema.test.js

# ทดสอบเฉพาะ transform
npx jest schemaTransform.test.js

# ทดสอบเฉพาะ mock service
npx jest mockSchemaService.test.js

# ทดสอบเฉพาะ benchmark
npx jest benchmarkCalc.test.js

# ทดสอบเฉพาะ storage
npx jest storageCalc.test.js
```

### Jest Config

- Framework: **Jest 30** + jsdom environment
- CSS/images: mock ด้วย `identity-obj-proxy`
- localStorage: mock ด้วย in-memory object (รีเซ็ตทุก test ใน `beforeEach`)
- fetch: mock ด้วย `whatwg-fetch`
- Babel: `@babel/preset-env` + `@babel/preset-react`

### Test Pattern

ทุก test ใช้ AAA (Arrange-Act-Assert):

```javascript
test('addField adds a new field', () => {
    // Arrange
    const schema = {};

    // Act
    const result = addField(schema, 'name', 'string');

    // Assert
    expect(result.name).toEqual({ type: 'string' });
});
```

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
├── FormBuilder.jsx        ← Main form builder page (sidebar + 4 modes)
├── FormBuilder.css        ← Styles
├── FormFillerPage.jsx     ← Standalone /form/:schemaId page
├── Dashboard.jsx          ← Dashboard page with sidebar nav
└── Dashboard.css
```

### Backend

```
server/
├── package.json           ← Express 5 + better-sqlite3
├── cakecontrol.db         ← SQLite database file (auto-created)
└── src/
    ├── index.js           ← Express server entry (port 3002)
    ├── db/
    │   ├── database.js    ← DB setup + repository pattern (4 repos)
    │   └── seed.js        ← Demo data (พนักงาน + สินค้า)
    └── routes/
        ├── schemas.js     ← /api/schemas CRUD
        ├── views.js       ← /api/views CRUD
        ├── formcfgs.js    ← /api/formcfgs CRUD
        └── forms.js       ← /api/forms CRUD
```

---

## 10. Routes (Frontend)

| Path | Component | คำอธิบาย |
|------|-----------|---------|
| `/` | Login | หน้า login |
| `/dashboard` | Dashboard | Dashboard + sidebar nav |
| `/formbuilder` | FormBuilder | สร้าง/จัดการฟอร์ม |
| `/form/:schemaId` | FormFillerPage | Standalone fill page (แชร์ link ได้) |
| `/controls` | ControlsDocs | Documentation ทุก control |

---

## 11. สิ่งที่ยังไม่ทำ (Deferred)

| รายการ | เหตุผล |
|--------|--------|
| ViewConfigControl | Auto-generate ใช้งานได้แล้ว ยังไม่ต้องแก้ manual |
| Component tests | ใช้ unit tests ของ lib ก่อน |
| E2E tests (Playwright) | Optional สำหรับ MVP |
| PostgreSQL migration | ใช้ SQLite local ก่อน, swap ทีหลังแค่เปลี่ยน database.js |
| Auth | ไม่มี — ใช้ฟรี |
