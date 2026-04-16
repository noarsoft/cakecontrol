# ULTRAPLAN: CakeControl - Full Remaining Work

> สร้างเมื่อ: 2026-04-08 | อัปเดต: 2026-04-16
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

## Phase 0: Bug Fixes + Config Cleanup ✅ DONE

**Priority**: CRITICAL | **Effort**: S (1-2 ชม.)

| Bug | สถานะ |
|-----|-------|
| Dashboard route missing | ✅ เพิ่ม `/dashboard` route + Dashboard.jsx |
| Register import bug | ✅ ไม่ใช่ bug (Login.css มีอยู่จริง) |

---

## Phase 1: Dashboard Page ✅ DONE

**Priority**: HIGH | **Effort**: M (4-6 ชม.) | **Dependencies**: Phase 0

- ✅ `src/forms/Dashboard.jsx` — sidebar + header + 5 sub-pages (home, schemas, forms, data, settings)
- ✅ `src/forms/Dashboard.css` — full layout styles
- ✅ Route `/dashboard` registered in App.jsx
- ✅ Quick links ไป Form Builder + Controls Docs
- ✅ Logout ลบ token + navigate กลับ login
- Sub-pages ยังเป็น placeholder — จะเชื่อม backend ใน Phase 4

---

## Phase 2: Form Builder (FE) 🔧 IN PROGRESS

**Priority**: HIGH — core feature | **Effort**: XL (15-25 ชม.) | **Dependencies**: None

### 2A: Schema Utilities + Builder ✅ DONE

1. ✅ **`src/lib/schema.js`** — createEmptySchema, addField, removeField, moveField, updateField, validateSchema
2. ✅ **SchemaBuilder** component ใน FormBuilder.jsx — field list, reorder, add/delete, local draft + save
3. ✅ FIELD_TYPES: string, number, boolean, date, email, file, select

### 2B: Preview + Transform ✅ DONE

4. ✅ **`src/lib/schemaTransform.js`** — schemaToFormConfig, schemaToColumnsConfig, buildCrudConfig, generateDefaultView, generateDefaultFormcfg
5. ✅ **FormPreview** component — preview form จาก schema + live JSON output

### 2C: View Config (DEFERRED)

6. ⏸️ **ViewConfigControl** — deferred to Phase 4 (auto-generate view/formcfg ใช้งานได้แล้ว)

### 2D: Manager Pages ✅ DONE

7. ✅ **`src/lib/mockSchemaService.js`** — localStorage CRUD 4 tables, seedDemoData (พนักงาน + สินค้า)
8. ✅ **FormBuilder.jsx** — sidebar schema list + 4 modes (data/builder/fill/preview)
9. ✅ **FormFiller** mode — Google Forms-like fill + submit
10. ✅ **`src/forms/FormFillerPage.jsx`** — standalone route `/form/:schemaId` สำหรับแชร์ link
11. ✅ **Data** mode — CRUDControl สำหรับจัดการข้อมูล (= FormDataPage)
12. ✅ Share button — copy link `/form/:schemaId`

---

## Phase 3: Backend ✅ DONE (local SQLite)

**Priority**: HIGH | **Effort**: L | **Location**: `server/` folder

### Tech Stack: Express 5 + better-sqlite3 (local dev, swap to PG later)

- ✅ `server/src/db/database.js` — SQLite DB, 4 tables, repository pattern
- ✅ `server/src/db/seed.js` — demo data (พนักงาน + สินค้า)
- ✅ `server/src/routes/schemas.js` — CRUD /api/schemas
- ✅ `server/src/routes/views.js` — CRUD /api/views?schemaId=X
- ✅ `server/src/routes/formcfgs.js` — CRUD /api/formcfgs?schemaId=X
- ✅ `server/src/routes/forms.js` — CRUD /api/forms?schemaId=X
- ✅ `server/src/index.js` — Express server port 3002
- ✅ Health check: GET /api/health

### Run
```bash
cd server && npm install && npm run seed && npm run dev
```

---

## Phase 4: FE-BE Integration ✅ DONE

**Priority**: HIGH | **Effort**: L (8-12 ชม.) | **Dependencies**: Phase 1-3

- ✅ `src/lib/schemaService.js` — Unified service layer, auto-detect backend via /api/health
- ✅ `src/lib/apiSchemaService.js` — Async fetch-based API client (lazy import)
- ✅ FormBuilder.jsx refactored: sync mock → async service calls
- ✅ FormFillerPage.jsx uses initService() + async loading
- ✅ Service mode indicator in sidebar (🟢 API / 🟡 localStorage)
- ✅ Fallback: ถ้า backend ไม่พร้อม → localStorage mock อัตโนมัติ

---

## Phase 5: Testing ✅ DONE

**Priority**: MEDIUM | **Effort**: L (10-15 ชม.) | ทำคู่ขนานกับทุก phase

- ✅ 92 tests ผ่านทั้งหมด (5 test suites)
- ✅ `src/lib/__tests__/schema.test.js` — 28 tests (FIELD_TYPES, CRUD, validate)
- ✅ `src/lib/__tests__/schemaTransform.test.js` — transform functions
- ✅ `src/lib/__tests__/mockSchemaService.test.js` — 4-table CRUD + seed
- ✅ `src/lib/__tests__/benchmarkCalc.test.js` — calc functions + chart data
- ✅ `src/lib/__tests__/storageCalc.test.js` — PG/Mongo estimation + growth

| ประเภท | Framework | สถานะ |
|--------|-----------|-------|
| Unit | Jest 30 | ✅ 92 tests passed |
| Component | Jest + Testing Library | ⏸️ deferred |
| E2E | Playwright | ⏸️ deferred |

---

## Phase 6: DB Benchmark Visualizer ✅ DONE

**Priority**: LOW | **Effort**: M (3-5 ชม.) | **Dependencies**: None (standalone)

- ✅ `src/lib/benchmarkCalc.js` — pure functions (INSERT, SELECT, UPDATE, DELETE, JSON query)
- ✅ `src/lib/storageCalc.js` — storage estimation functions (PG vs Mongo vs localStorage)
- ✅ `src/components/controls_doc/pages/BenchmarkPage.jsx` — 6 tabs:
  1. CRUD Compare, 2. Big O Table, 3. JSONB vs BSON, 4. Index Impact, 5. Storage Size, 6. Growth Projector
- ✅ Storage Analytics merged into BenchmarkPage (ไม่แยก StoragePage)

---

## Phase 7: Storage Analytics ✅ DONE (merged into Phase 6)

Merged into BenchmarkPage tabs 5-6 (Storage Size + Growth Projector)

---

## Effort Matrix

| Phase | งาน | Priority | Effort | Status |
|-------|------|----------|--------|--------|
| **0** | Bug Fixes | CRITICAL | S | ✅ DONE |
| **1** | Dashboard | HIGH | M | ✅ DONE |
| **2** | Form Builder FE | HIGH | XL | ✅ DONE (ViewConfig deferred) |
| **3** | Backend | HIGH | L | ✅ DONE |
| **4** | FE-BE Integration | HIGH | L | ✅ DONE |
| **5** | Testing | MEDIUM | L | ✅ DONE (92 tests, 5 suites) |
| **6** | DB Benchmark Viz | LOW | M | ✅ DONE |
| **7** | Storage Analytics | LOW | M | ✅ DONE (merged into 6) |

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

- [x] Phase 0: ไม่มี bug, routes ทำงาน
- [x] Phase 1: Dashboard แสดง sidebar + sub-pages + mock data
- [x] Phase 2: สร้าง schema, preview form, กรอกข้อมูล, ดูข้อมูล (client-side)
- [x] Phase 3: Backend API ทำงาน (Express 5 + better-sqlite3, 4 tables, port 3002)
- [x] Phase 4: FE เชื่อมต่อ BE สำเร็จ (auto-detect + fallback to localStorage)
- [x] Phase 5: 92 tests ผ่าน (schema, schemaTransform, mockSchemaService, benchmarkCalc, storageCalc)
- [x] Phase 6: ใส่ N, K, M แล้วเห็น chart เปรียบเทียบ Postgres vs MongoDB
- [x] Phase 7: Storage Size + Growth Projector (merged into Phase 6)
