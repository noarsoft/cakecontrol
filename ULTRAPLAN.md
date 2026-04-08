# ULTRAPLAN: CakeControl - Full Remaining Work

> สร้างเมื่อ: 2026-04-08
> Branch: `dev/pee-formbuilder`
> สถานะ: งานที่เสร็จแล้ว 40+ Controls, CRUDControl, ModalControl, Theme, Docs, API layers

---

## Dependency Graph

```
Phase 0 (Bug Fixes) ─────────────────────────────────┐
Phase 1 (Auth Context + Route Guard) ─────────────────┤
Phase 2 (Dashboard) ─── ต้องการ Phase 1 ──────────────┤
Phase 3 (Form Builder FE) ─── standalone ─────────────┤── รวมเป็น product
Phase 4 (Backend) ─── standalone ─────────────────────┤
Phase 5 (FE-BE Integration) ─── ต้องการ Phase 1-4 ────┤
Phase 6 (Testing) ─── ทำคู่ขนานกับทุก phase ───────────┘
```

---

## Phase 0: Bug Fixes + Config Cleanup

**Priority**: CRITICAL | **Effort**: S (1-2 ชม.)

| Bug | ตำแหน่ง | สาเหตุ |
|-----|---------|--------|
| `AUTH.BASE` undefined | `src/Apis/auth.jsx:3`, `src/Apis/user.jsx:3` | `API_CONFIG.ENDPOINTS.AUTH` ไม่มี `BASE` key |
| Endpoint mismatch | `src/config/api.config.js` | config ใช้ `/users` แต่ API จริงใช้ `/userx` |
| Dashboard route missing | `src/App.jsx` | Login navigate ไป `/dashboard` แต่ไม่มี route |
| Register import bug | `src/forms/Register.jsx:10` | import CSS file ที่อาจไม่มี |

### ไฟล์ที่แก้
- `src/config/api.config.js`
- `src/Apis/auth.jsx`
- `src/Apis/user.jsx`
- `src/forms/Register.jsx`

---

## Phase 1: Auth Context + Route Guard

**Priority**: HIGH | **Effort**: M (3-5 ชม.) | **Dependencies**: Phase 0

1. สร้าง `src/contexts/AuthContext.jsx` — React Context เก็บ `{ user, token, isAuthenticated, login, logout, loading }`
2. สร้าง `src/components/ProtectedRoute.jsx` — check auth, redirect `/login`
3. อัพเดท `src/App.jsx` — wrap AuthProvider, เพิ่ม `/dashboard` route
4. อัพเดท `src/forms/Login.jsx` + `Register.jsx` — ใช้ AuthContext

### ไฟล์ใหม่
- `src/contexts/AuthContext.jsx`
- `src/components/ProtectedRoute.jsx`

---

## Phase 2: Dashboard Page

**Priority**: HIGH | **Effort**: M (4-6 ชม.) | **Dependencies**: Phase 1

1. Implement `src/forms/Dashboard.jsx` — sidebar menu, main content area, header + logout
2. สร้าง Dashboard sub-pages (shell ด้วย mock data):
   - `src/forms/dashboard/UsersPage.jsx` — CRUDControl + mock user data
   - `src/forms/dashboard/GroupsPage.jsx` — CRUDControl + mock group data
   - `src/forms/dashboard/RolesPage.jsx` — CRUDControl + mock role data
   - `src/forms/dashboard/SettingsPage.jsx` — placeholder

---

## Phase 3: Form Builder (FE)

**Priority**: HIGH — core feature | **Effort**: XL (15-25 ชม.) | **Dependencies**: None

### 3A: Schema Utilities + Builder (L, 6-8 ชม.)

1. **`src/lib/schema.js`** — pure utility functions:
   - `createEmptySchema()`, `addField()`, `removeField()`, `moveField()`, `updateField()`, `validateSchema()`
   - Supported types: textbox, number, select, checkbox, toggle, date, password, boolean, email, file, array
2. **`src/components/controls/FieldConfigPanel.jsx`** — panel config ต่าง type
3. **`src/components/controls/SchemaBuilderControl.jsx`** — composite control หลัก: field list, reorder, add/delete

### 3B: Preview + Transform (M, 4-5 ชม.)

4. **`src/lib/schemaTransform.js`** — bridge schema → existing controls:
   - `schemaToFormConfig()`, `schemaToColumnsConfig()`, `schemaToFormControls()`
5. **`src/components/controls/FormPreviewControl.jsx`** — preview form จาก schema

### 3C: View Config (M, 3-4 ชม.)

6. **`src/components/controls/ViewConfigControl.jsx`** — config columns/form layout ด้วย TabControl

### 3D: Manager Pages (M, 4-6 ชม.)

7. **`src/lib/mockSchemaService.js`** — mock CRUD ด้วย localStorage
8. **`src/forms/formbuilder/SchemaManagerPage.jsx`** — CRUD schemas
9. **`src/forms/formbuilder/FormFillerPage.jsx`** — กรอกฟอร์ม (เหมือน Google Forms)
10. **`src/forms/formbuilder/FormDataPage.jsx`** — ดูข้อมูลที่กรอกแล้ว
11. Register routes + demo page

---

## Phase 4: Backend

**Priority**: HIGH | **Effort**: XL (20-30 ชม.) | **Dependencies**: None (แยก repo)

### Tech Stack: Express 5 + PostgreSQL 16 + Prisma ORM

### Database Tables
```
userx, groupx, rolex, appx              — entity tables
groupx_userx, userx_rolex               — junction tables (M:M)
registerx                               — registration requests
data_schema, data_view, data_form       — form builder tables
file_upload                             — chunked upload
```

### Sub-phases
- **4A**: Setup — repo init, Prisma schema, migrations, Express skeleton (M)
- **4B**: Auth — JWT login/register/refresh, bcrypt, middleware (M)
- **4C**: Entity CRUD — userx, groupx, rolex, appx, junctions (L)
- **4D**: Form Builder API — data_schema (versioning), data_view, data_form (L)
- **4E**: File Upload — chunked upload flow (M)

---

## Phase 5: FE-BE Integration

**Priority**: HIGH | **Effort**: L (8-12 ชม.) | **Dependencies**: Phase 1-4

1. สร้าง `src/Apis/schema.jsx` — API service สำหรับ form builder
2. เปลี่ยน mockSchemaService → API จริง
3. Dashboard sub-pages ใช้ CRUDControl server-side mode
4. เพิ่ม error handling + loading states
5. Split `user.jsx` (752 lines) → user.jsx, group.jsx, role.jsx, file.jsx

---

## Phase 6: Testing

**Priority**: MEDIUM | **Effort**: L (10-15 ชม.) | ทำคู่ขนานกับทุก phase

| ประเภท | Framework | ไฟล์ที่ test |
|--------|-----------|-------------|
| Unit | Jest 30 | schema.js, schemaTransform.js |
| Component | Jest + Testing Library | SchemaBuilderControl, FormPreviewControl, ProtectedRoute |
| Integration | Jest + Testing Library | Login flow, CRUD flow |
| E2E | Playwright (optional) | Full form builder flow |

Target: 80% coverage

---

## Effort Matrix

| Phase | งาน | Priority | Effort | Dependencies |
|-------|------|----------|--------|-------------|
| **0** | Bug Fixes | CRITICAL | S | None |
| **1** | Auth + Route Guard | HIGH | M | Phase 0 |
| **2** | Dashboard | HIGH | M | Phase 1 |
| **3** | Form Builder FE | HIGH | XL | None |
| **4** | Backend | HIGH | XL | None |
| **5** | FE-BE Integration | HIGH | L | Phase 1-4 |
| **6** | Testing | MEDIUM | L | คู่ขนาน |

**รวม: ~60-80 ชม.**

---

## Recommended Execution Order

```
สัปดาห์ 1:  Phase 0 → Phase 1 → เริ่ม Phase 3A (schema.js + tests)
สัปดาห์ 2:  Phase 2 + Phase 3B-3C (preview, view config)
สัปดาห์ 3:  Phase 3D (schema manager pages) + เริ่ม Phase 4A-4B (backend setup + auth)
สัปดาห์ 4:  Phase 4C-4D (backend CRUD + form builder API)
สัปดาห์ 5:  Phase 4E (file upload) + Phase 5 (integration)
สัปดาห์ 6:  Phase 6 (testing เพิ่มเติม) + polish + bug fixes
```

Phase 3 และ Phase 4 ทำคู่ขนานได้ | Phase 6 ควรเริ่มตั้งแต่สัปดาห์ 1 (TDD)

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Schema versioning complexity (previous_id linked list) | HIGH | เริ่มด้วย simple overwrite, เพิ่ม versioning ทีหลัง |
| Dynamic form validation complexity | MEDIUM | เริ่มด้วย required + min/max, ขยายทีหลัง |
| Backend ยังไม่มี, FE dev ติดขัด | HIGH | mockSchemaService + localStorage (Phase 3) |
| Field type `array` ซับซ้อน (nested) | MEDIUM | ข้าม array ใน MVP, เพิ่มทีหลัง |
| user.jsx 752 lines เกินมาตรฐาน | LOW | Split ใน Phase 5 |

---

## Success Criteria

- [ ] Phase 0: ไม่มี bug `AUTH.BASE` undefined, endpoints ตรงกับ backend
- [ ] Phase 1: Login → Dashboard, unauthorized → /login
- [ ] Phase 2: Dashboard แสดง sidebar + sub-pages + mock data
- [ ] Phase 3: สร้าง schema, preview form, กรอกข้อมูล, ดูข้อมูล (client-side)
- [ ] Phase 4: Backend API ทำงาน, test ผ่านทุก endpoint
- [ ] Phase 5: FE เชื่อมต่อ BE สำเร็จ
- [ ] Phase 6: Test coverage >= 80% สำหรับ core modules
