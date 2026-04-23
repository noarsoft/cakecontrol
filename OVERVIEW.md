# CakeControl — Project Overview

> สำหรับทีมที่มาอ่านแล้วเข้าใจว่าจะทำอะไร

---

## มันคืออะไร?

เว็บแอปสำหรับ **สร้างฟอร์มและจัดการข้อมูล** คล้าย Google Forms / Microsoft Forms
แต่ผลลัพธ์ไม่ใช่แค่ฟอร์ม — ได้ทั้ง **ฟอร์มกรอกข้อมูล** + **ตารางจัดการข้อมูล** (CRUD) ในตัว

ไม่มี login ใช้ฟรี

---

## หน้าเว็บ

**หน้าเดียว** — sidebar ซ้ายเลือก schema, ขวาแสดงตาม mode

```
┌─────────────┬──────────────────────────────────────────────┐
│  Sidebar    │  Main Content (เปลี่ยนตาม mode)              │
│             │                                              │
│  จัดการแม่แบบ│  MODE 0: Template Manager (default)          │
│  ─────────  │  ┌────────────────────────────────────────┐  │
│  ฟอร์มทั้งหมด│  │ แม่แบบทั้งหมด                           │  │
│  ─────────  │  │ [ค้นหา...]  [+ สร้างแม่แบบ]             │  │
│  > พนักงาน  │  │ ┌──────────┬───────┬────────┬────────┐│  │
│    สินค้า   │  │ │ ชื่อแม่แบบ│ Fields│ วันที่  │ จัดการ  ││  │
│    ใบสมัคร  │  │ │พนักงาน   │ 5    │22/04/26│จัดการ..││  │
│             │  │ │สินค้า    │ 3    │22/04/26│จัดการ..││  │
│             │  │ └──────────┴───────┴────────┴────────┘│  │
│             │  │           < 1  2  3  4  5 >            │  │
│             │  └────────────────────────────────────────┘  │
│             │  ↑ TemplateManager: ใช้ TableviewControl     │
│             │    "สร้าง/แก้ไข" เปิด ControlDesignerModal    │
│             │                                              │
│             │──────────────────────────────────────────────│
│             │                                              │
│             │  MODE 1: Data Manager (กด "จัดการฟอร์ม")     │
│             │  ┌────────────────────────────────────────┐  │
│             │  │ ข้อมูล: พนักงาน                         │  │
│             │  │ [เลือกรายการ] [ค้นหา...] [+ เพิ่มข้อมูล]│  │
│             │  │ ┌──────┬─────┬───────┬────────┬───────┐│  │
│             │  │ │ ชื่อ  │ อายุ│ สิทธิ์ │ สถานะ  │Actions││  │
│             │  │ │สมชาย│ 28 │Admin  │Active │แก้ ลบ ││  │
│             │  │ │สมหญิง│ 25 │User  │Active │แก้ ลบ ││  │
│             │  │ └──────┴─────┴───────┴────────┴───────┘│  │
│             │  │           < 1  2  3  4  5 >            │  │
│             │  └────────────────────────────────────────┘  │
│             │  ↑ CRUDControl: columns จาก view              │
│             │    form จาก form, data จาก data table          │
│             │                                              │
│             │──────────────────────────────────────────────│
│             │                                              │
│             │  MODE 2: Form Builder (กดแก้ไขฟอร์ม)         │
│             │  ┌────────────────────────────────────────┐  │
│             │  │ ┌─ Textbox ──────────────── [x ลบ]──┐ │  │
│             │  │ │ label: ชื่อ-นามสกุล                 │ │  │
│             │  │ │ [___________________________]      │ │  │
│             │  │ └────────────────────────────────────┘ │  │
│             │  │ ┌─ Number ───────────────── [x ลบ]──┐ │  │
│             │  │ │ label: อายุ                         │ │  │
│             │  │ │ [- 0 +]                            │ │  │
│             │  │ └────────────────────────────────────┘ │  │
│             │  │                                        │  │
│             │  │          [บันทึก] [ยกเลิก]              │  │
│             │  └────────────────────────────────────────┘  │
│             │                                              │
│             │──────────────────────────────────────────────│
│             │                                              │
│             │  MODE 3: Preview (กด Preview)                │
│             │  ┌────────────────────────────────────────┐  │
│             │  │ ชื่อ-นามสกุล:                           │  │
│             │  │ [___________________________]          │  │
│             │  │                                        │  │
│             │  │ อายุ:              สิทธิ์:               │  │
│             │  │ [- 0 +]           [Admin ▼]            │  │
│             │  │              [บันทึก]                    │  │
│             │  └────────────────────────────────────────┘  │
│             │  ↑ render จาก form.json_form_config → FormControl │
└─────────────┴──────────────────────────────────────────────┘
```

---

## Flow การใช้งาน

```
1. เปิดหน้า /formbuilder → Mode: Template Manager (default)
   ดูแม่แบบทั้งหมด / สร้างใหม่ / แก้ไข / ลบ
       ↓
2. กด "+ สร้างแม่แบบ" หรือ "แก้ไข" → เปิด ControlDesignerModal
   เพิ่ม/ลบ field, กำหนด label, databind, control type
   บันทึก → สร้าง schema + view + formcfg อัตโนมัติ
       ↓
3. กด "จัดการฟอร์ม" → Mode: Data Manager
   ดูข้อมูลที่กรอกแล้ว / เพิ่ม / แก้ไข / ลบ ผ่าน CRUDControl
       ↓
4. กด "Preview" → Mode: Preview
   ดูตัวอย่างฟอร์มที่สร้าง render จาก config จริง
```

---

## Database (4 tables)

Backend อยู่ที่ repo `rootid/` (Express 5 + Prisma + PostgreSQL 16)

```
┌─────────────┐
│ data_schema │  "มี field อะไร + type อะไร"
│             │  { username: {type:string}, age: {type:number} }
└──────┬──────┘
       │
       ├──→ view            "ตารางโชว์ยังไง" (columns, width, sortable)
       │
       ├──→ form            "ฟอร์มหน้าตายังไง" (label, layout, colno, rowno)
       │
       └──→ data            "ข้อมูลจริง" { name:"สมชาย", age:28, role:"admin" }
```

| Table | เก็บอะไร | JSON Column |
|-------|---------|-------------|
| data_schema | โครงสร้าง field (key + type) | `json` |
| view | config ตาราง | `json_table_config` |
| form | config ฟอร์ม (label, layout) | `json_form_config` |
| data | ข้อมูลจริงที่กรอก | `data` |

ทุก record มี default columns: `rootid` (UUID PK), `id` (SERIAL FK), `prev_id`, `activate`, `flag`, `modify_datetime`

ดู `rootid/DB-DESIGN.md` สำหรับ full detail

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|----------|
| Frontend | React 19 + Vite 7 |
| UI Controls | 40+ controls สร้างเอง (ไม่ใช้ MUI/Ant) |
| CRUD | CRUDControl (composite control) |
| Modal | ModalControl |
| Theme | Light/Dark ผ่าน CSS variables |
| Backend | Express 5 + Prisma + PostgreSQL 16 (repo `rootid/`) |

---

## สิ่งที่ทำเสร็จแล้ว

- 40+ UI Controls (textbox, select, table, form, chart, modal, etc.)
- CRUDControl — ตาราง + ฟอร์ม + search + sort + pagination + bulk edit
- ModalControl — modal ใส่ content อะไรก็ได้
- Theme Light/Dark
- Controls Documentation + Demo pages
- Template Manager — จัดการแม่แบบทั้งหมด (list, create, edit, delete)
- Control Designer Modal — ออกแบบ fields ของฟอร์ม (label, databind, control type)
- Schema Builder — แก้ไข schema fields แบบ raw
- Form Preview — preview ฟอร์มจาก config
- Data Manager — CRUD ข้อมูลจริงผ่าน CRUDControl
- Backend API — Express 5 + Prisma + PostgreSQL (repo `rootid/`)
- FE-BE Integration — schemaService auto-detect API vs localStorage
