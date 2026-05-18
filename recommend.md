# CakeControl — Recommendations

## Overview

CakeControl = **Form Designer** (คล้าย Google Forms)
- โหลด schema จาก Excel → สร้าง JSON schema → ใช้ต่อยอดได้
- 44 control types, metadata-driven, Root-ID versioning
- Dual-mode: API (PostgreSQL) + localStorage fallback

---

## 1. Form Response Collector (Impact: สูงมาก)

**ปัญหา:** ตอนนี้มีแค่ "ออกแบบฟอร์ม" ยังไม่มี "กรอกฟอร์ม + เก็บคำตอบ"

**แนวทาง:**
- เพิ่ม route `/fill/:schemaId` → render form จาก JSON schema ให้ผู้ใช้กรอก
- เก็บ response ใน rootidx (table `form_response` with `schema_id`, `business_id`, `data JSONB`, `submitted_at`)
- รองรับ anonymous submit (ไม่ต้อง login) และ authenticated submit
- Validation ตาม schema rules (required, min/max, pattern)
- แสดง "ขอบคุณที่กรอกฟอร์ม" หลัง submit สำเร็จ

**ไฟล์ที่เกี่ยวข้อง:**
- `cakecontrol/src/` — เพิ่ม FormFiller component
- `rootidx/src/` — เพิ่ม response API routes
- `rootidx/sql/schema.sql` — เพิ่ม form_response table

**Priority:** ทำก่อนข้ออื่น — จะทำให้ cakecontrol ใช้งานจริงได้ ไม่ใช่แค่ designer

---

## 2. Schema Versioning UI (Impact: สูง)

**ปัญหา:** Root-ID versioning มีใน backend (`_prev_id`, `_doc_version`) แต่ UI ไม่โชว์

**แนวทาง:**
- เพิ่มหน้า "ประวัติ Schema" แสดง timeline ของทุก version
- Diff view: เปรียบเทียบ 2 versions → แสดง field ที่เพิ่ม/ลบ/แก้ไข
- Rollback: กดคืนค่าไป version เก่าได้ (สร้าง new version ที่ copy จาก old)
- Badge แสดง version number ใน Schema list

**ไฟล์ที่เกี่ยวข้อง:**
- `cakecontrol/src/components/` — เพิ่ม VersionHistory component
- `rootidx/src/core/rootid-engine.js` — มี versioning logic อยู่แล้ว
- `rootidx/src/services/schema.service.js` — เพิ่ม getVersionHistory()

---

## 3. Conditional Logic Builder (Impact: สูง)

**ปัญหา:** ยังไม่มี show/hide field ตามเงื่อนไข (Google Forms มี)

**แนวทาง:**
- เพิ่ม `conditions` property ใน schema field:
  ```json
  {
    "conditions": {
      "visible_when": { "field": "type", "operator": "equals", "value": "other" },
      "required_when": { "field": "age", "operator": "gte", "value": 18 }
    }
  }
  ```
- Visual builder ใน SchemaBuilder: "แสดงเมื่อ [field] [operator] [value]"
- Operators: equals, not_equals, contains, gt, gte, lt, lte, in, not_in, is_empty, is_not_empty
- FormControl runtime: evaluate conditions → toggle visibility/required

**ไฟล์ที่เกี่ยวข้อง:**
- `cakecontrol/src/lib/schema.js` — เพิ่ม condition schema
- `cakecontrol/src/forms/SchemaBuilder.jsx` — เพิ่ม condition UI
- `cakecontrol/src/components/controls/FormControl.jsx` — evaluate conditions at render

---

## 4. Schema Template Gallery (Impact: กลาง)

**ปัญหา:** ผู้ใช้ต้องสร้าง form ตั้งแต่ศูนย์ทุกครั้ง

**แนวทาง:**
- สร้าง template สำเร็จรูป 5-10 แบบ:
  - แบบฟอร์มลงทะเบียนงาน (ชื่อ, email, เบอร์, dropdown เลือก session)
  - แบบสำรวจความพึงพอใจ (rating, radio, textarea)
  - แบบสมัครงาน (ข้อมูลส่วนตัว, upload resume, dropdown ตำแหน่ง)
  - แบบแจ้งปัญหา/Bug report (title, description, priority dropdown, screenshot upload)
  - แบบสั่งซื้อสินค้า (รายการ, จำนวน, ที่อยู่จัดส่ง)
- หน้า Template Gallery: แสดง preview + "ใช้ template นี้" → clone schema + เปิด editor
- ผู้ใช้สร้าง template เองได้ (save current schema as template)

**ไฟล์ที่เกี่ยวข้อง:**
- `cakecontrol/src/` — เพิ่ม TemplateGallery page
- `cakecontrol/src/data/templates/` — JSON template files
- `rootidx/` — optional: store templates ใน DB

---

## 5. Dashboard / Analytics (Impact: กลาง — ต้องทำข้อ 1 ก่อน)

**ปัญหา:** ไม่มีหน้าสรุปคำตอบที่กรอกมา

**แนวทาง:**
- Summary view แบบ Google Forms: แสดง % ของแต่ละ choice, bar chart, pie chart
- Table view: ดูคำตอบทั้งหมดเป็นตาราง (sortable, filterable)
- Export: ดาวน์โหลดคำตอบเป็น Excel/CSV
- Real-time count: "มีผู้ตอบ X คน"
- Chart library: ใช้ Chart.js (มีใน benchmark แล้ว)

**ไฟล์ที่เกี่ยวข้อง:**
- `cakecontrol/src/` — เพิ่ม ResponseDashboard page
- `rootidx/src/` — เพิ่ม response aggregation API

---

## Recommended Order

```
1. Response Collector  ← ทำให้ใช้งานจริงได้
2. Conditional Logic    ← เพิ่มความสามารถของ form
3. Schema Versioning UI ← ใช้ feature ที่มีอยู่แล้วให้คุ้ม
4. Template Gallery     ← ลด friction สำหรับผู้ใช้ใหม่
5. Dashboard/Analytics  ← ต่อยอดจากข้อ 1
```
