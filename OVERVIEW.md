# CakeControl — Project Overview

> สำหรับทีมที่มาอ่านแล้วเข้าใจว่าจะทำอะไร

---

## มันคืออะไร?

เว็บแอปสำหรับ **สร้างฟอร์มและจัดการข้อมูล** คล้าย Google Forms / Microsoft Forms
แต่ผลลัพธ์ไม่ใช่แค่ฟอร์ม — ได้ทั้ง **ฟอร์มกรอกข้อมูล** + **ตารางจัดการข้อมูล** (CRUD) ในตัว

ไม่มี login ใช้ฟรี

---

## หน้าเว็บ

**หน้าเดียว** (เหมือน `/controls-docs`) — sidebar ซ้ายเลือก schema, ขวาแสดงตาม mode

```
┌─────────────┬──────────────────────────────────────────────┐
│  Sidebar    │  Main Content (เปลี่ยนตาม mode)              │
│             │                                              │
│  ฟอร์มทั้งหมด│                                              │
│  ─────────  │  MODE 1: Data Manager (default)              │
│  > พนักงาน  │  ┌────────────────────────────────────────┐  │
│    สินค้า   │  │ ข้อมูล: พนักงาน                         │  │
│    ใบสมัคร  │  │ [เลือกรายการ] [ค้นหา...] [+ เพิ่มข้อมูล]│  │
│             │  │ ┌──────┬─────┬───────┬────────┬───────┐│  │
│  ─────────  │  │ │ ชื่อ  │ อายุ│ สิทธิ์ │ สถานะ  │Actions││  │
│  [+ สร้าง   │  │ │สมชาย│ 28 │Admin  │Active │แก้ ลบ ││  │
│   ฟอร์มใหม่]│  │ │สมหญิง│ 25 │User  │Active │แก้ ลบ ││  │
│             │  │ └──────┴─────┴───────┴────────┴───────┘│  │
│             │  │           < 1  2  3  4  5 >            │  │
│             │  └────────────────────────────────────────┘  │
│             │  ↑ CRUDControl: columns จาก data_view        │
│             │    form จาก data_formcfg, data จาก data_form  │
│             │                                              │
│             │  [แก้ไขฟอร์ม] [Preview]                       │
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
│             │  │ ┌─ Select ───────────────── [x ลบ]──┐ │  │
│             │  │ │ label: สิทธิ์                       │ │  │
│             │  │ │ options: Admin, User, Guest        │ │  │
│             │  │ │ [Admin ▼]                          │ │  │
│             │  │ └────────────────────────────────────┘ │  │
│             │  │                                        │  │
│             │  │ [+ เพิ่ม Control]                       │  │
│             │  │ Textbox|Number|Select|Checkbox|Toggle  │  │
│             │  │ Date|Password|Badge|Rating|Chart ...   │  │
│             │  │ (40+ controls)                         │  │
│             │  │                                        │  │
│             │  │          [บันทึก] [ยกเลิก]              │  │
│             │  └────────────────────────────────────────┘  │
│             │  ↑ แต่ละ control มี json config              │
│             │    เก็บลง data_schema + data_formcfg         │
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
│             │  │                                        │  │
│             │  │ สถานะ:                                  │  │
│             │  │ [====○]                                │  │
│             │  │              [บันทึก]                    │  │
│             │  └────────────────────────────────────────┘  │
│             │  ↑ render จาก data_formcfg → FormControl     │
└─────────────┴──────────────────────────────────────────────┘
```

---

## Flow การใช้งาน

```
1. เลือก schema จาก sidebar (หรือกด + สร้างใหม่)
       ↓
2. Mode: Data Manager (default)
   ดูข้อมูลที่กรอกแล้ว / เพิ่ม / แก้ไข / ลบ ผ่าน CRUDControl
       ↓
3. กด "แก้ไขฟอร์ม" → Mode: Form Builder
   กด + เลือก control (40+ ตัว) ตั้งค่า label, options ฯลฯ
   แต่ละ control มี json config → บันทึกลง DB
       ↓
4. กด "Preview" → Mode: Preview
   ดูตัวอย่างฟอร์มที่สร้าง render จาก config จริง
```

---

## Database (4 tables)

```
┌─────────────┐
│ data_schema │  "มี field อะไร + type อะไร"
│             │  { username: {type:string}, age: {type:number} }
└──────┬──────┘
       │
       ├──→ data_view      "ตารางโชว์ยังไง" (columns, width, sortable)
       │
       ├──→ data_formcfg   "ฟอร์มหน้าตายังไง" (label, layout, colno, rowno)
       │
       └──→ data_form      "ข้อมูลจริง" { name:"สมชาย", age:28, role:"admin" }
```

| Table | เก็บอะไร | ตัวอย่าง |
|-------|---------|---------|
| data_schema | โครงสร้าง field (key + type) | `{ "name": {"type":"string"}, "age": {"type":"number"} }` |
| data_view | config ตาราง (โชว์อย่างเดียว) | `{ "columns": [{"key":"name","header":"ชื่อ","width":"auto"}] }` |
| data_formcfg | config ฟอร์ม (label, layout) | `{ "colnumbers":6, "controls": [{"key":"name","label":"ชื่อ","colno":1}] }` |
| data_form | ข้อมูลจริงที่กรอก | `{ "name": "สมชาย", "age": 28 }` |

ทุก record มี default columns: `root_id`, `id`, `previous_id`, `activate`, `flag`, `modified_date_time`

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|----------|
| Frontend | React 19 + Vite 7 |
| UI Controls | 40+ controls สร้างเอง (ไม่ใช้ MUI/Ant) |
| CRUD | CRUDControl (composite control) |
| Modal | ModalControl |
| Theme | Light/Dark ผ่าน CSS variables |
| Backend | Express + PostgreSQL 16 + Prisma (ยังไม่สร้าง) |

---

## สิ่งที่ทำเสร็จแล้ว

- 40+ UI Controls (textbox, select, table, form, chart, modal, etc.)
- CRUDControl — ตาราง + ฟอร์ม + search + sort + pagination + bulk edit
- ModalControl — modal ใส่ content อะไรก็ได้
- Theme Light/Dark
- Controls Documentation + Demo pages

---

## สิ่งที่ต้องทำ

| ลำดับ | งาน | รายละเอียด |
|-------|-----|-----------|
| 1 | Schema Builder | หน้าสร้าง schema กดเพิ่ม/ลบ field กำหนด type |
| 2 | Form Preview | preview ฟอร์มจาก schema |
| 3 | View Config | ตั้งค่าตาราง + ฟอร์ม layout |
| 4 | Schema Manager | หน้า CRUD จัดการ schemas ทั้งหมด |
| 5 | Form Filler | หน้ากรอกฟอร์ม (เหมือน Google Forms) |
| 6 | Data Manager | หน้าดูข้อมูลที่กรอกแล้ว (ใช้ CRUDControl) |
| 7 | Backend | Express + PostgreSQL + Prisma, API สำหรับ 4 tables |
| 8 | FE-BE Integration | เชื่อม frontend กับ backend |
