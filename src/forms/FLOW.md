# Form Builder — Data Flow

> อัปเดตล่าสุด: 2026-04-28
> อธิบาย flow ตั้งแต่กดปุ่ม → data ไหลผ่าน 4 tables ยังไง พร้อมตัวอย่างจริง

---

## ภาพรวม 4 Tables

```
data_schema (มี field อะไร, type อะไร)
     │
     ├── auto-generate ──→ view (ตารางโชว์ยังไง)
     ├── auto-generate ──→ form (ฟอร์มหน้าตายังไง)
     │
     └── กรอกข้อมูล ────→ data (ข้อมูลจริง)
```

| Table | เก็บอะไร | สร้างเมื่อ |
|-------|---------|-----------|
| **data_schema** | format (field + type) | สร้างแม่แบบ |
| **view** | ตาราง columns config | auto-generate จาก schema |
| **form** | ฟอร์ม layout config | auto-generate จาก schema |
| **data** | ข้อมูลจริง | กรอกฟอร์ม / เพิ่มใน CRUD |

---

## Service Layer — Auto-Detect Backend

```
schemaService.js → initService()
     │
     ├── fetch /api/health (timeout 1.5s)
     │      │
     │      ├── ตอบ OK → apiSchemaService (REST API → PostgreSQL)
     │      │              sidebar แสดง 🟢 API
     │      │
     │      └── ไม่ตอบ → mockSchemaService (localStorage)
     │                     sidebar แสดง 💾 localStorage
     │
     └── ทั้ง 2 mode ใช้ function signatures เดียวกัน
         code ที่เรียกใช้ไม่ต้องรู้ว่า data มาจากไหน
```

---

## Flow 1: สร้างแม่แบบ

**ปุ่ม**: "+ สร้างแม่แบบ" หรือ "แก้ไข" ใน TemplateManager

```
[ผู้ใช้] กด "+ สร้างแม่แบบ"
    │
    ▼
ControlDesignerModal เปิดขึ้น
    │  ผู้ใช้ตั้งชื่อ + เพิ่ม fields (เลือก type, ตั้ง label)
    │
    ▼  กด "บันทึก"
    │
    ├── POST /api/schemax ──────────────────────→ Table 1: data_schema
    │   body: { name: "พนักงาน", json: {...} }
    │
    ├── POST /api/viewx ────────────────────────→ Table 2: view
    │   body: { data_schema_id: 2,               (auto-generate จาก schema)
    │           view_type: "table",
    │           json_table_config: {...} }
    │
    └── POST /api/formcfgx ─────────────────────→ Table 3: form
        body: { data_id: 2,                       (auto-generate จาก schema)
                json_form_config: {...} }
```

### ตัวอย่าง data จริง — Table 1: data_schema

```json
{
  "rootid": "a79ae53a-7b4a-4571-bf21-c7070e0c5d3e",
  "id": 2,
  "name": "พนักงาน",
  "json": {
    "name": { "type": "string", "label": "ชื่อ-นามสกุล" },
    "age":  { "type": "number", "label": "อายุ" },
    "role": { "type": "select", "label": "สิทธิ์",
              "enum": ["Admin", "User", "Guest"] }
  },
  "flag": "draft",
  "activate": true
}
```

### ตัวอย่าง data จริง — Table 2: view

```json
{
  "rootid": "1658c35f-2806-4b06-84f9-04cdf3a1fe03",
  "data_schema_id": 2,
  "view_type": "table",
  "json_table_config": {
    "columns": [
      { "key": "name", "header": "ชื่อ-นามสกุล", "width": "auto", "sortable": true },
      { "key": "age",  "header": "อายุ",         "width": "80",   "sortable": true },
      { "key": "role", "header": "สิทธิ์",        "width": "120",  "sortable": true }
    ]
  }
}
```

### ตัวอย่าง data จริง — Table 3: form

```json
{
  "rootid": "e8e3e2fc-2c52-491f-99ae-089a1c14c3c2",
  "data_id": 2,
  "json_form_config": {
    "colnumbers": 6,
    "controls": [
      { "key": "name", "label": "ชื่อ-นามสกุล", "rowno": 1, "colspan": 6 },
      { "key": "age",  "label": "อายุ",         "rowno": 2, "colspan": 3 },
      { "key": "role", "label": "สิทธิ์",        "rowno": 2, "colspan": 3 }
    ]
  }
}
```

---

## Flow 2: จัดการฟอร์ม (CRUD ข้อมูลจริง)

**ปุ่ม**: "จัดการฟอร์ม" ใน TemplateManager หรือกดชื่อ schema ที่ sidebar

```
[ผู้ใช้] กด "จัดการฟอร์ม"
    │
    ▼
อ่าน config จาก Table 2 + 3
    │
    ├── view.json_table_config  → columns ของตาราง
    ├── form.json_form_config   → fields ของ modal เพิ่ม/แก้ไข
    │
    ▼  schemaTransform.js → buildCrudConfig()
    │
    สร้าง CRUDControl (ตาราง + toolbar + modal)
    │
    ▼
┌──────────────────────────────────────────────────────┐
│  CRUDControl                                         │
│  ┌────────────────────────────────────────────────┐  │
│  │  Toolbar: [ค้นหา...] [+ เพิ่ม]                 │  │
│  ├────────────────────────────────────────────────┤  │
│  │  ชื่อ-นามสกุล     │ อายุ │ สิทธิ์ │ จัดการ     │  │
│  │  สมชาย ใจดี       │  28  │ Admin │ [แก้][ลบ]  │  │
│  │  สมหญิง รักเรียน  │  25  │ User  │ [แก้][ลบ]  │  │
│  │  วิชัย สุขใจ       │  32  │ Guest │ [แก้][ลบ]  │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  กด [+ เพิ่ม] หรือ [แก้] → ModalControl              │
│  ┌────────────────────────────────────────────────┐  │
│  │  ชื่อ-นามสกุล: [_______________]               │  │
│  │  อายุ: [___]    สิทธิ์: [Admin ▾]              │  │
│  │                          [บันทึก] [ยกเลิก]     │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
    │
    ▼  CRUD operations → Table 4: data
    │
    ├── เพิ่ม  → POST   /api/formx         { data_schema_id: 2, data: {...} }
    ├── แก้ไข → PUT    /api/formx/:rootid  { data: {...} }
    └── ลบ    → DELETE /api/formx/:rootid  (soft delete)
```

### ตัวอย่าง data จริง — Table 4: data

```json
[
  {
    "rootid": "7c4e8f0e-3e91-4111-b8ec-346bbf7ed8d9",
    "id": 1,
    "data_schema_id": 2,
    "data": { "name": "สมชาย ใจดี", "age": 28, "role": "Admin" },
    "flag": "active",
    "activate": true
  },
  {
    "rootid": "f8e74143-94b4-4485-9b48-c094f1c05726",
    "id": 2,
    "data_schema_id": 2,
    "data": { "name": "สมหญิง รักเรียน", "age": 25, "role": "User" },
    "flag": "active",
    "activate": true
  },
  {
    "rootid": "dbf028f6-c4cc-4bf8-9278-2852f4a979cd",
    "id": 3,
    "data_schema_id": 2,
    "data": { "name": "วิชัย สุขใจ", "age": 32, "role": "Guest" },
    "flag": "active",
    "activate": true
  }
]
```

---

## Flow 3: แก้ไขแม่แบบ

**ปุ่ม**: "แก้ไข" ใน TemplateManager

```
[ผู้ใช้] กด "แก้ไข"
    │
    ▼
ControlDesignerModal เปิด (โหลด fields เดิม)
    │  แก้ไข: เพิ่ม/ลบ/เปลี่ยน field
    │
    ▼  กด "บันทึก"
    │
    ├── PUT /api/schemax/:rootid ─────→ อัพเดต Table 1 (schema)
    │
    ├── auto-update ─────────────────→ อัพเดต Table 2 (view)
    │   PUT /api/viewx/:rootid         สร้าง columns ใหม่จาก schema
    │
    └── auto-update ─────────────────→ อัพเดต Table 3 (form)
        PUT /api/formcfgx/:rootid      สร้าง controls ใหม่จาก schema
```

> **สำคัญ**: แก้ schema แล้ว view + form จะถูก regenerate อัตโนมัติ
> ข้อมูลใน Table 4 (data) ไม่หาย — แค่ field ที่ลบจะไม่แสดง

---

## Flow 4: ลบแม่แบบ

**ปุ่ม**: "ลบ" ใน TemplateManager (มี ConfirmModal ยืนยัน)

```
[ผู้ใช้] กด "ลบ" → ConfirmModal "ยืนยันลบ?"
    │
    ▼  กด "ยืนยัน"
    │
    └── DELETE /api/schemax/:rootid
        → soft delete (activate = false)
        → record ยังอยู่ใน DB แต่ไม่แสดงใน UI
```

> **Soft delete**: ไม่ลบจริง แค่ set activate=false
> GET ทุก endpoint filter activate=true อัตโนมัติ

---

## Flow 5: กรอกฟอร์ม (FormFiller)

**ปุ่ม**: "จัดการฟอร์ม" → กด "+ เพิ่ม" ใน CRUDControl หรือเปิด `/form/:schemaId`

```
[ผู้ใช้] กรอกข้อมูลในฟอร์ม
    │
    ▼
FormControl render จาก form.json_form_config
    │  แต่ละ field → control ตาม type
    │  string → TextboxControl
    │  number → NumberControl
    │  select → SelectControl
    │
    ▼  กด "บันทึก"
    │
    └── POST /api/formx
        body: {
          data_schema_id: 2,
          data: { "name": "คนใหม่", "age": 30, "role": "User" }
        }
        → บันทึกลง Table 4: data
```

---

## End-to-End Flow (สรุปรวม)

```
[ผู้ใช้]
   │
   ├─ 1. สร้างแม่แบบ ───→ ControlDesignerModal
   │     │                  ออกแบบ fields (ชื่อ, type, label)
   │     ▼
   │     บันทึก → data_schema (Table 1)
   │            → view         (Table 2) ← auto-generate
   │            → form         (Table 3) ← auto-generate
   │
   ├─ 2. จัดการฟอร์ม ───→ CRUDControl
   │     │                  ตาราง: อ่าน view config → columns
   │     │                  modal: อ่าน form config → fields
   │     ▼
   │     เพิ่ม/แก้/ลบ → data (Table 4)
   │
   ├─ 3. แก้ไขแม่แบบ ───→ ControlDesignerModal
   │     │                  แก้ fields → update Table 1
   │     ▼                  auto-update Table 2, 3
   │
   └─ 4. ลบแม่แบบ ─────→ soft delete Table 1
                           (activate = false)
```

---

## Transform Layer — schema → UI config

`schemaTransform.js` แปลง schema JSON เป็น config สำหรับ controls:

```
schema.json ─────→ generateDefaultView()  → json_table_config
             │
             └──→ generateDefaultFormcfg() → json_form_config
             │
             └──→ buildCrudConfig()        → CRUDControl config พร้อมใช้
                   ├── tableConfig  (columns + pagination)
                   ├── formConfig   (controls + layout)
                   └── data         (ข้อมูลจริง)
```

### ตัวอย่าง: schema → table columns

```
schema.json                          json_table_config.columns
─────────────                        ──────────────────────────
"name": {                     →      { "key": "name",
  "type": "string",                    "header": "ชื่อ-นามสกุล",
  "label": "ชื่อ-นามสกุล"              "width": "auto",
}                                      "sortable": true }
```

### ตัวอย่าง: schema → form controls

```
schema.json                          json_form_config.controls
─────────────                        ─────────────────────────
"age": {                       →     { "key": "age",
  "type": "number",                    "label": "อายุ",
  "label": "อายุ"                       "rowno": 2,
}                                       "colspan": 3 }
```

---

## API Endpoints ที่ใช้

| Action | Method | Endpoint | Table |
|--------|--------|----------|-------|
| ดึง schemas ทั้งหมด | GET | `/api/schemax` | data_schema |
| สร้าง schema | POST | `/api/schemax` | data_schema |
| แก้ไข schema | PUT | `/api/schemax/:rootid` | data_schema |
| ลบ schema | DELETE | `/api/schemax/:rootid` | data_schema |
| ดึง view ของ schema | GET | `/api/viewx?data_schema_id=N` | view |
| สร้าง/แก้ view | POST/PUT | `/api/viewx` | view |
| ดึง form config | GET | `/api/formcfgx?data_id=N` | form |
| สร้าง/แก้ form config | POST/PUT | `/api/formcfgx` | form |
| ดึง data ของ schema | GET | `/api/formx?data_schema_id=N` | data |
| เพิ่ม data | POST | `/api/formx` | data |
| แก้ data | PUT | `/api/formx/:rootid` | data |
| ลบ data | DELETE | `/api/formx/:rootid` | data |

---

## Code Map

| ไฟล์ | หน้าที่ |
|------|--------|
| `FormBuilder.jsx` | Main page — sidebar + 5 modes (templates/data/builder/preview/fill) |
| `TemplateManager.jsx` | ตารางแม่แบบ + ControlDesignerModal |
| `ControlDesignerModal.jsx` | Modal ออกแบบ fields (เพิ่ม/ลบ/แก้ field) |
| `SchemaBuilder.jsx` | Raw schema JSON editor |
| `FormPreview.jsx` | Preview ฟอร์มจาก config |
| `FormFiller.jsx` | กรอกฟอร์มแบบ Google Forms |
| `FormFillerPage.jsx` | Standalone fill page (`/form/:schemaId`) |
| `schemaService.js` | Unified service — auto-detect backend/localStorage |
| `apiSchemaService.js` | REST API client (ต่อ rootid backend) |
| `mockSchemaService.js` | localStorage fallback + seed demo data |
| `schemaTransform.js` | schema → CRUDControl/FormControl config |
| `schema.js` | Schema utilities (FIELD_TYPES, validate, CRUD) |
