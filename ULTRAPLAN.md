# ULTRAPLAN: CakeControl - Full Remaining Work

> สร้างเมื่อ: 2026-04-08 | อัปเดต: 2026-04-09
> Branch: `dev/pee-formbuilder`
> สถานะ: งานที่เสร็จแล้ว 40+ Controls, CRUDControl, ModalControl, Theme, Docs
> ไม่มี auth ใช้ฟรี

---

## Dependency Graph

```
Phase 0 (Bug Fixes) ─────────────────────────────────┐
Phase 1 (Dashboard) ─── standalone ──────────────────┤
Phase 2 (Form Builder FE) ─── standalone ─────────────┤── รวมเป็น product
Phase 3 (Backend) ─── standalone ─────────────────────┤
Phase 4 (FE-BE Integration) ─── ต้องการ Phase 1-3 ────┤
Phase 5 (Testing) ─── ทำคู่ขนานกับทุก phase ───────────┤
Phase 6 (DB Benchmark Viz) ─── standalone ─────────────┤
Phase 7 (Storage Analytics) ─── standalone ────────────┘
```

---

## Phase 0: Bug Fixes + Config Cleanup

**Priority**: CRITICAL | **Effort**: S (1-2 ชม.)

| Bug | ตำแหน่ง | สาเหตุ |
|-----|---------|--------|
| Dashboard route missing | `src/App.jsx` | Login navigate ไป `/dashboard` แต่ไม่มี route |
| Register import bug | `src/forms/Register.jsx:10` | import CSS file ที่อาจไม่มี |

### ไฟล์ที่แก้
- `src/App.jsx`
- `src/forms/Register.jsx`

---

## Phase 1: Dashboard Page

**Priority**: HIGH | **Effort**: M (4-6 ชม.) | **Dependencies**: Phase 0

1. Implement `src/forms/Dashboard.jsx` — sidebar menu, main content area, header
2. สร้าง Dashboard sub-pages (shell ด้วย mock data):
   - `src/forms/dashboard/SchemaManagerPage.jsx` — CRUDControl + mock schema data
   - `src/forms/dashboard/SettingsPage.jsx` — placeholder
3. อัพเดท `src/App.jsx` — เพิ่ม `/dashboard` route

---

## Phase 2: Form Builder (FE)

**Priority**: HIGH — core feature | **Effort**: XL (15-25 ชม.) | **Dependencies**: None

### 2A: Schema Utilities + Builder (L, 6-8 ชม.)

1. **`src/lib/schema.js`** — pure utility functions:
   - `createEmptySchema()`, `addField()`, `removeField()`, `moveField()`, `updateField()`, `validateSchema()`
   - Supported types: string, number, boolean, date, email, file, array
2. **`src/components/controls/FieldConfigPanel.jsx`** — panel config ต่าง type
3. **`src/components/controls/SchemaBuilderControl.jsx`** — composite control หลัก: field list, reorder, add/delete

### 2B: Preview + Transform (M, 4-5 ชม.)

4. **`src/lib/schemaTransform.js`** — bridge schema → existing controls:
   - `schemaToFormConfig()`, `schemaToColumnsConfig()`, `schemaToFormControls()`
5. **`src/components/controls/FormPreviewControl.jsx`** — preview form จาก schema

### 2C: View Config (M, 3-4 ชม.)

6. **`src/components/controls/ViewConfigControl.jsx`** — config columns/form layout ด้วย TabControl

### 2D: Manager Pages (M, 4-6 ชม.)

7. **`src/lib/mockSchemaService.js`** — mock CRUD ด้วย localStorage
8. **`src/forms/formbuilder/SchemaManagerPage.jsx`** — CRUD schemas
9. **`src/forms/formbuilder/FormFillerPage.jsx`** — กรอกฟอร์ม (เหมือน Google Forms)
10. **`src/forms/formbuilder/FormDataPage.jsx`** — ดูข้อมูลที่กรอกแล้ว
11. Register routes + demo page

---

## Phase 3: Backend

**Priority**: HIGH | **Effort**: L (15-20 ชม.) | **Dependencies**: None (แยก repo)

### Tech Stack: Express 5 + PostgreSQL 16 + Prisma ORM

### Database Tables (4 tables — ดู DB-DESIGN.md)
```
data_schema    — เช็ค format ของ data (key + type)
data_view      — โชว์ตาราง (columns config)
data_formcfg   — form config (label, layout)
data_form      — ข้อมูลจริงที่กรอก
```

### Design Principles
- `root_id` = UUID PK, `id` = SERIAL ใช้เป็น FK
- `previous_id` อิง `id` (versioning)
- Date format: VARCHAR `yyyymmdd_hhmmss`
- ไม่มี auth ใช้ฟรี

### Sub-phases
- **3A**: Setup — repo init, Prisma schema, migrations, Express skeleton (M)
- **3B**: Schema API — data_schema CRUD + versioning (M)
- **3C**: View + FormCfg API — data_view, data_formcfg CRUD (M)
- **3D**: Form Data API — data_form CRUD + JSONB query (M)

---

## Phase 4: FE-BE Integration

**Priority**: HIGH | **Effort**: L (8-12 ชม.) | **Dependencies**: Phase 1-3

1. สร้าง `src/Apis/schema.jsx` — API service สำหรับ form builder
2. เปลี่ยน mockSchemaService → API จริง
3. Dashboard sub-pages ใช้ CRUDControl server-side mode
4. เพิ่ม error handling + loading states

---

## Phase 5: Testing

**Priority**: MEDIUM | **Effort**: L (10-15 ชม.) | ทำคู่ขนานกับทุก phase

| ประเภท | Framework | ไฟล์ที่ test |
|--------|-----------|-------------|
| Unit | Jest 30 | schema.js, schemaTransform.js |
| Component | Jest + Testing Library | SchemaBuilderControl, FormPreviewControl |
| Integration | Jest + Testing Library | CRUD flow, Form Builder flow |
| E2E | Playwright (optional) | Full form builder flow |

Target: 80% coverage

---

## Phase 6: DB Benchmark Visualizer

**Priority**: LOW | **Effort**: M (3-5 ชม.) | **Dependencies**: None (standalone)

> ข้อมูลจาก `research_mongo_vs_postgres.md`

### หน้าที่
FE page ใน controls_doc สำหรับเปรียบเทียบ PostgreSQL vs MongoDB แบบ interactive

### Features
1. **Input**: ใส่ค่า N (จำนวน records), K (result count), M (จำนวน indexes)
2. **Big O Calculator**: คำนวณ complexity ตาม N → แสดงค่าประมาณเวลา
3. **Chart เปรียบเทียบ**: Recharts bar/line chart — INSERT, SELECT, UPDATE, DELETE
4. **Index comparison**: B-Tree vs Hash vs GIN (PostgreSQL) vs MongoDB indexes
5. **JSONB vs BSON**: nested query performance ตาม depth

### ไฟล์
- `src/components/controls_doc/pages/BenchmarkPage.jsx` — demo page หลัก
- `src/lib/benchmarkCalc.js` — pure functions คำนวณ estimated time จาก N, K, M
- Register ใน `ControlsDocs.jsx`

### ใช้ library ที่มีอยู่แล้ว
- Recharts 2 (chart)
- CSS variables (theme)

---

## Phase 7: Storage Analytics

**Priority**: LOW | **Effort**: M (3-5 ชม.) | **Dependencies**: None (standalone)

### Features
1. **Live Storage Monitor** — วัดพื้นที่ localStorage จริง (bytes per table, total, % ของ limit ~5MB)
2. **Record Size Analysis** — avg/min/max record size ต่อ schema, field ไหนกิน space สุด
3. **PG vs Mongo Size Estimator** — ใส่ N records → ประมาณพื้นที่ PostgreSQL (row + TOAST + indexes) vs MongoDB (BSON + indexes)
4. **Growth Projector** — N records ในอนาคต → storage เท่าไหร่
5. **Index Overhead Calculator** — จำนวน indexes × record count → overhead

### ไฟล์
- `src/lib/storageCalc.js` — pure functions คำนวณ storage estimates
- `src/components/controls_doc/pages/StoragePage.jsx` — demo page
- Register ใน `ControlsDocs.jsx`

---

## Effort Matrix

| Phase | งาน | Priority | Effort | Dependencies |
|-------|------|----------|--------|-------------|
| **0** | Bug Fixes | CRITICAL | S | None |
| **1** | Dashboard | HIGH | M | Phase 0 |
| **2** | Form Builder FE | HIGH | XL | None |
| **3** | Backend | HIGH | L | None |
| **4** | FE-BE Integration | HIGH | L | Phase 1-3 |
| **5** | Testing | MEDIUM | L | คู่ขนาน |
| **6** | DB Benchmark Viz | LOW | M | None |
| **7** | Storage Analytics | LOW | M | None |

**รวม: ~56-80 ชม.**

---

## Recommended Execution Order

```
สัปดาห์ 1:  Phase 0 → Phase 1 → เริ่ม Phase 2A (schema.js + tests)
สัปดาห์ 2:  Phase 2B-2C (preview, view config) + เริ่ม Phase 3A (backend setup)
สัปดาห์ 3:  Phase 2D (schema manager pages) + Phase 3B-3C (backend API)
สัปดาห์ 4:  Phase 3D (form data API) + Phase 4 (integration)
สัปดาห์ 5:  Phase 5 (testing เพิ่มเติม) + polish + bug fixes
```

Phase 2 และ Phase 3 ทำคู่ขนานได้ | Phase 5 ควรเริ่มตั้งแต่สัปดาห์ 1 (TDD)

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Schema versioning complexity (previous_id linked list) | HIGH | เริ่มด้วย simple overwrite, เพิ่ม versioning ทีหลัง |
| Dynamic form validation complexity | MEDIUM | เริ่มด้วย required + min/max, ขยายทีหลัง |
| Backend ยังไม่มี, FE dev ติดขัด | HIGH | mockSchemaService + localStorage (Phase 2) |
| Field type `array` ซับซ้อน (nested) | MEDIUM | ข้าม array ใน MVP, เพิ่มทีหลัง |

---

## Success Criteria

- [ ] Phase 0: ไม่มี bug, routes ทำงาน
- [ ] Phase 1: Dashboard แสดง sidebar + sub-pages + mock data
- [ ] Phase 2: สร้าง schema, preview form, กรอกข้อมูล, ดูข้อมูล (client-side)
- [ ] Phase 3: Backend API ทำงาน, test ผ่านทุก endpoint (4 tables)
- [ ] Phase 4: FE เชื่อมต่อ BE สำเร็จ
- [ ] Phase 5: Test coverage >= 80% สำหรับ core modules
- [ ] Phase 6: ใส่ N, K, M แล้วเห็น chart เปรียบเทียบ Postgres vs MongoDB
- [ ] Phase 7: Live storage monitor + PG/Mongo size estimator + growth projector
