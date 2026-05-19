# Test Cases — CakeControl (Full Coverage)

> เอกสาร TC สำหรับทดสอบทุกฟีเจอร์ของ CakeControl  
> วันที่: 2026-05-19  
> Total: **300+ Test Scenarios**

---

## สารบัญ

1. [Business Selector](#1-business-selector) (15 TC)
2. [Dashboard](#2-dashboard) (22 TC)
3. [Form Builder — Topbar & Navigation](#3-form-builder--topbar--navigation) (18 TC)
4. [Schema Builder — ออกแบบฟอร์ม](#4-schema-builder--ออกแบบฟอร์ม) (30 TC)
5. [Control Designer Modal](#5-control-designer-modal) (16 TC)
6. [Field Config Panel & Preview](#6-field-config-panel--preview) (12 TC)
7. [Option Editor](#7-option-editor) (10 TC)
8. [showWhen — Conditional Visibility](#8-showwhen--conditional-visibility) (22 TC)
9. [FormFiller — กรอกฟอร์ม](#9-formfiller--กรอกฟอร์ม) (18 TC)
10. [Multi-Page Form (Page Break)](#10-multi-page-form-page-break) (16 TC)
11. [Share Page (FormFillerPage)](#11-share-page-formfillerpage) (10 TC)
12. [CRUD — จัดการข้อมูล](#12-crud--จัดการข้อมูล) (22 TC)
13. [44 Control Types — รายละเอียด](#13-44-control-types--รายละเอียด) (90+ TC)
14. [Theme System](#14-theme-system) (14 TC)
15. [Service Layer (Auto-Detect)](#15-service-layer-auto-detect) (16 TC)
16. [Toast Notifications](#16-toast-notifications) (8 TC)
17. [Excel Export](#17-excel-export) (6 TC)
18. [404 & Routing](#18-404--routing) (6 TC)
19. [Controls Docs](#19-controls-docs) (6 TC)
20. [End-to-End Flows](#20-end-to-end-flows) (15 TC)
21. [Cross-Feature & Edge Cases](#21-cross-feature--edge-cases) (18 TC)

---

## 1. Business Selector

**หน้า:** `/` (Landing Page, Netflix/Steam style)

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 1.1 | เปิดหน้า `/` | แสดง business cards แบบ grid + ปุ่ม "+" สร้างใหม่ |
| 1.2 | ดูแต่ละ card | แสดงอักษรย่อ (initials จาก hash ชื่อ) + สีพื้นหลังไม่ซ้ำ + ชื่อ business |
| 1.3 | มีปุ่ม ThemeSwitcher มุมขวาบน | กด toggle ได้ (light↔dark) |
| 1.4 | กดปุ่ม "+" | เปิด modal สร้าง business, input ได้ focus อัตโนมัติ (autoFocus) |
| 1.5 | Modal: ไม่กรอกชื่อ → blur | แสดง error "กรุณากรอก" (on-blur validation) |
| 1.6 | Modal: กรอกชื่อซ้ำ → blur | แสดง error ชื่อซ้ำ |
| 1.7 | Modal: กรอกชื่อใหม่ถูกต้อง → Enter | สร้างสำเร็จ, toast "สร้างโครงการใหม่เรียบร้อยแล้ว", modal ปิด, card ใหม่แสดง |
| 1.8 | Modal: กดปุ่ม Cancel | modal ปิด, ไม่สร้าง, touched state เคลียร์ |
| 1.9 | Modal: กด backdrop (นอก modal) | modal ปิด, ไม่สร้าง |
| 1.10 | กดปุ่ม "✕" บน card | เปิด ConfirmModal (destructive) แสดงชื่อ business |
| 1.11 | ConfirmModal: ยืนยันลบ | ลบสำเร็จ, toast "ลบโครงการเรียบร้อยแล้ว", card หายไป |
| 1.12 | ConfirmModal: กด Cancel | modal ปิด, ไม่ลบ |
| 1.13 | กดปุ่ม "✕" ที่ card | click event ไม่ bubble ไปเลือก business (stopPropagation) |
| 1.14 | กด card business ใดๆ | บันทึก localStorage (`activeBusinessId`, `activeBusinessRootId`, `activeBusinessName`) + navigate ไป `/dashboard` |
| 1.15 | ไม่มี business ใดๆ (empty state) | แสดงเฉพาะ "+" card เท่านั้น |

---

## 2. Dashboard

**หน้า:** `/dashboard`

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 2.1 | เข้า `/dashboard` จาก Business Selector | แสดง header: ปุ่มกลับ, ชื่อ business, badge mode ("API Online" / "localStorage"), ThemeSwitcher |
| 2.2 | ดู Stats row | แสดง 3 summary cards: จำนวนฟอร์ม, จำนวนข้อมูลรวม, จำนวน fields รวม |
| 2.3 | ดูตาราง | แสดง columns: ชื่อฟอร์ม, Fields, Data, แก้ไขล่าสุด, Actions |
| 2.4 | กด "+ สร้างฟอร์มใหม่" | Navigate ไป FormBuilder + สร้าง schema ใหม่ |
| 2.5 | กดที่แถวของฟอร์ม | Navigate ไป FormBuilder (`mode=data`) ของฟอร์มนั้น |
| 2.6 | กดปุ่ม Share icon ที่แถว | คัดลอก URL `/form/:rootid` ไปยัง clipboard, toast "คัดลอก link แล้ว" |
| 2.7 | กดปุ่ม Trash ที่แถว | เปิด ConfirmModal |
| 2.8 | ConfirmModal: ยืนยันลบ | ลบสำเร็จ, toast success, ฟอร์มหายจากตาราง, stats อัปเดต |
| 2.9 | เปิด Bulk Edit Mode | แสดง checkboxes ทุกแถว + toolbar (select all, bulk delete) |
| 2.10 | Bulk: ติ๊ก checkbox หลายแถว | แสดงจำนวนที่เลือก ในtoolbar |
| 2.11 | Bulk: กด Select All | ติ๊กทุกแถว |
| 2.12 | Bulk: กด Deselect All | เคลียร์ทั้งหมด |
| 2.13 | Bulk: กด Bulk Delete → ยืนยัน | ลบทุกรายการที่เลือก, toast success |
| 2.14 | Bulk: ลบบางรายการ fail (partial error) | toast "ลบฟอร์มไม่สำเร็จบางรายการ" |
| 2.15 | Bulk: ออก Bulk Mode | checkboxes หายไป, selection เคลียร์ |
| 2.16 | Bulk: กดแถวใน bulk mode | toggle checkbox (ไม่ navigate) |
| 2.17 | ไม่มีฟอร์ม (empty state) | แสดง EmptyState: "ยังไม่มีฟอร์ม" + ปุ่ม "สร้างฟอร์มแรก" |
| 2.18 | กดปุ่ม "สร้างฟอร์มแรก" | Navigate ไปสร้างฟอร์มใหม่ |
| 2.19 | รอโหลดข้อมูล (loading state) | แสดง spinner + "กำลังโหลด..." |
| 2.20 | โหลดข้อมูลล้มเหลว | toast error |
| 2.21 | กดปุ่ม "← กลับ" | Navigate กลับ `/` |
| 2.22 | เข้า `/dashboard` โดยตรง (ไม่มี `activeBusinessId`) | Redirect กลับ `/` |

---

## 3. Form Builder — Topbar & Navigation

**หน้า:** `/formbuilder?schema=:id`

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 3.1 | เปิด FormBuilder ที่มี schema | แสดง: ปุ่มกลับ, SchemaNameInput, 3 mode tabs, Share icon, ThemeSwitcher, Delete icon |
| 3.2 | ดู mode tabs | "ข้อมูลฟอร์ม", "แก้ไขฟอร์ม", "จำลองฟอร์ม" |
| 3.3 | SchemaNameInput: คลิกแล้วพิมพ์ชื่อใหม่ → blur | บันทึกชื่อใหม่ |
| 3.4 | SchemaNameInput: ลบชื่อให้ว่าง → blur | revert กลับเป็นชื่อเดิม |
| 3.5 | SchemaNameInput: พิมพ์ชื่อเดิม → blur | ไม่เรียก save (unchanged) |
| 3.6 | SchemaNameInput: พิมพ์ชื่อใหม่ → Enter | trigger blur → บันทึก |
| 3.7 | กด "ข้อมูลฟอร์ม" | แสดง CRUDControl (ตารางข้อมูล) |
| 3.8 | กด "แก้ไขฟอร์ม" | แสดง SchemaBuilder |
| 3.9 | กด "จำลองฟอร์ม" | แสดง FormFiller |
| 3.10 | Builder dirty → กด tab อื่น | ConfirmModal: "คุณแก้ไขฟอร์มแล้วยังไม่ได้บันทึก..." |
| 3.11 | ConfirmModal → "ออกโดยไม่บันทึก" | ทิ้งการเปลี่ยนแปลง, switch mode |
| 3.12 | ConfirmModal → "อยู่ต่อ" | กลับไปหน้า builder |
| 3.13 | Filler dirty → กด tab อื่น | ConfirmModal: "คุณกรอกข้อมูลแล้วยังไม่ได้ส่ง..." |
| 3.14 | Builder dirty → กดกลับ dashboard | ConfirmModal เดียวกัน |
| 3.15 | กด Trash icon ใน topbar | ConfirmModal แจ้งว่าข้อมูลทั้งหมดจะถูกลบถาวร |
| 3.16 | Trash ConfirmModal → ยืนยัน | ลบฟอร์ม + navigate กลับ dashboard |
| 3.17 | กด Share icon ใน topbar | คัดลอก URL `/form/:rootid`, toast "คัดลอก link แล้ว" |
| 3.18 | เปิด `/formbuilder` โดยไม่มี schema param | แสดง "เลือกฟอร์มจาก sidebar หรือสร้างฟอร์มใหม่" |

---

## 4. Schema Builder — ออกแบบฟอร์ม

**Mode:** แก้ไขฟอร์ม

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 4.1 | เปิด mode แก้ไขฟอร์ม | แสดง: คำอธิบายฟอร์ม textarea + field list + ปุ่ม actions |
| 4.2 | พิมพ์คำอธิบายใน textarea | dirty state เปิด, บันทึกเป็น `_description` |
| 4.3 | ปล่อยคำอธิบายว่าง | FormFiller แสดง default: "กรอกข้อมูลแล้วกดบันทึก" |
| 4.4 | กด "+ เพิ่ม Field" | เพิ่ม field: key=`field_N`, type=`string`, เปิด config panel อัตโนมัติ |
| 4.5 | กด "+ เพิ่ม Field" ซ้ำ เมื่อ key ซ้ำ | สร้าง key ไม่ซ้ำ (`field_N_<timestamp>`) |
| 4.6 | กด "+ Page Break" | เพิ่ม pagebreak card: เส้นคั่น + 📄 + input ชื่อหน้า |
| 4.7 | Pagebreak: พิมพ์ชื่อหน้า | แสดงเป็นชื่อ page ใน FormFiller stepper |
| 4.8 | Pagebreak: ปล่อยว่าง | FormFiller แสดง "หน้า N จาก N" |
| 4.9 | แก้ key → blur | บันทึก key ใหม่ (commit on blur เท่านั้น) |
| 4.10 | แก้ key เป็นค่าว่าง → blur | revert กลับเป็น key เดิม, ไม่บันทึก |
| 4.11 | แก้ key ซ้ำกับ key อื่น → blur | toast warning: `ชื่อ Key "xxx" มีอยู่แล้ว`, revert |
| 4.12 | พิมพ์ label | อัปเดตทันที (onChange) |
| 4.13 | ปล่อย label ว่าง → blur (touched) | error: "กรุณากรอก" + border แดง + bg สีชมพู |
| 4.14 | เปลี่ยน type → Select | เพิ่ม enum อัตโนมัติ: 2 ตัวเลือก default |
| 4.15 | เปลี่ยน type → Dropdown | เพิ่ม enum อัตโนมัติ |
| 4.16 | เปลี่ยน type → Button Group | เพิ่ม enum อัตโนมัติ |
| 4.17 | เปลี่ยนจาก Select → String | ลบ enum ออกอัตโนมัติ |
| 4.18 | กด "✕" ลบ field | field หายจาก list |
| 4.19 | ลบ field ที่กำลัง selected | ลบ + ปิด config panel |
| 4.20 | ลาก handle ⠿ ไปวางตำแหน่งอื่น | field สลับลำดับ, `_order` อัปเดต |
| 4.21 | ระหว่างลาก | source มี class `dragging`, target มี class `drag-over` |
| 4.22 | กด ↑ ที่ field แรก | ปุ่ม disabled |
| 4.23 | กด ↓ ที่ field สุดท้าย | ปุ่ม disabled |
| 4.24 | กด ↑/↓ ที่ field ตรงกลาง | สลับกับ field ด้านบน/ล่าง |
| 4.25 | กดเฟือง ⚙️ | เปิด config panel ด้านขวา |
| 4.26 | กดเฟืองซ้ำที่ field เดิม | ปิด config panel (toggle) |
| 4.27 | Dirty → กด "บันทึก" | validate → บันทึก, toast "บันทึกโครงสร้างแม่แบบเรียบร้อยแล้ว" |
| 4.28 | Not dirty → ปุ่ม "บันทึก" | disabled |
| 4.29 | กด "บันทึกและทดสอบ" (dirty) | บันทึก → สลับไป fill mode |
| 4.30 | กด "บันทึกและทดสอบ" (not dirty) | ข้ามบันทึก → สลับไป fill mode |
| 4.31 | Dirty → กด "ยกเลิก" | revert ทุกอย่างกลับเป็นค่าเดิม + ปิด config panel |
| 4.32 | Validation: ไม่มี field เลย | error box: "ต้องมีอย่างน้อย 1 field", ปุ่มบันทึก disabled |
| 4.33 | Validation: Key ว่าง | toast error: "กรุณาระบุชื่อ Key ให้ครบทุกฟิลด์" |
| 4.34 | Validation: Label ว่าง (non-pagebreak) | toast error: "กรุณาระบุชื่อ Label ให้ครบทุกฟิลด์" |
| 4.35 | Validation: Pagebreak ไม่มี label | ไม่ error (label ไม่บังคับสำหรับ pagebreak) |
| 4.36 | Validation: Type ไม่ถูกต้อง | error box: `field "xxx": type "yyy" ไม่ถูกต้อง` |
| 4.37 | Validation: Select ไม่มี options | error box: `field "xxx": select ต้องมี options` |
| 4.38 | Validation: Enum object ไม่ครบ label/value | error box: `field "xxx": enum object ต้องมี label และ value` |
| 4.39 | มี errors → error box แสดงด้านล่าง | แสดงทุก error message ในกล่องสีแดงอ่อน |
| 4.40 | Dirty indicator | แสดง "* มีการเปลี่ยนแปลง" ข้าง title เมื่อ dirty |

---

## 5. Control Designer Modal

**เปิดจาก:** TemplateManager (modal)

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 5.1 | กดสร้าง/แก้ไข template | เปิด modal: schema name input + control rows |
| 5.2 | Schema name: ปล่อยว่าง → blur | error "กรุณาระบุชื่อแม่แบบ" + border แดง |
| 5.3 | Schema name: กรอก → blur | error หายไป |
| 5.4 | กด "+ เพิ่ม Control" | เพิ่ม control row ใหม่ |
| 5.5 | มี 1 control → กด "✕" | ปุ่มลบ disabled (ต้องมีอย่างน้อย 1) |
| 5.6 | มี 2+ controls → กด "✕" | ลบ control ได้ |
| 5.7 | กด ↑ / ↓ | สลับลำดับ control |
| 5.8 | เลือก type = Select/Dropdown/ButtonGroup | เปิด Options panel: key-value rows |
| 5.9 | เปลี่ยนจาก Select → String | Options panel หายไป |
| 5.10 | กรอก Label/Key ว่าง → blur | แสดง error "กรุณากรอก" + border แดง |
| 5.11 | Schema Mode: แสดง showWhen toggle | visible ทุก control row |
| 5.12 | Layout Mode (availableKeys != null): key เป็น dropdown | เลือกจาก available keys แทน free text |
| 5.13 | Layout Mode: ไม่แสดง showWhen panel | ซ่อน showWhen section |
| 5.14 | Save: name ว่าง | toast "กรุณาระบุชื่อแม่แบบ" |
| 5.15 | Save: ไม่มี control ที่มี key | toast "กรุณาเพิ่มอย่างน้อย 1 Control และระบุ Key ให้ถูกต้อง" |
| 5.16 | Save: Label ว่าง | toast "กรุณาระบุชื่อ Label ให้ครบทุกช่อง" |

---

## 6. Field Config Panel & Preview

**เปิดจาก:** กดเฟือง ⚙️ ใน SchemaBuilder

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 6.1 | ไม่มี field ถูกเลือก | empty state: "← เลือก Field เพื่อแก้ไขคุณสมบัติ" |
| 6.2 | เลือก field | แสดง: Preview + icon/label ของ type + key + config rows |
| 6.3 | Preview: type = string | แสดง textbox control ใน preview box |
| 6.4 | Preview: เปลี่ยน type | Preview อัปเดตตาม type ใหม่ทันที |
| 6.5 | Preview: แก้ placeholder ใน config | Preview แสดง placeholder ใหม่ทันที |
| 6.6 | Preview: แก้ label | Preview แสดง label ใหม่ |
| 6.7 | Preview: select type + แก้ options | Preview แสดง options ใหม่ |
| 6.8 | Lock/Unlock: default = locked | Panel อยู่กับที่, icon = lock, cursor = default |
| 6.9 | กด Unlock | icon เปลี่ยนเป็น unlock, cursor = grab, ลาก title bar ย้ายได้ (fixed position) |
| 6.10 | ลาก panel ที่ unlock แล้ว | panel ย้ายตาม mouse |
| 6.11 | กด Lock อีกครั้ง | panel กลับตำแหน่งเดิม (position reset), icon = lock |
| 6.12 | Config type = toggle | แสดง checkbox/toggle switch |
| 6.13 | Config type = text | แสดง text input |
| 6.14 | Config type = number | แสดง number input, ค่าว่าง → set undefined |
| 6.15 | Config type = options | แสดง OptionEditor |
| 6.16 | Config hint | แสดง hint text ใต้ config row |
| 6.17 | Type ไม่มี config (เช่น pagebreak) | แสดง "ไม่มีคุณสมบัติเพิ่มเติม" |

---

## 7. Option Editor

**ใช้ใน:** Field Config Panel (select/dropdown/buttongroup)

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 7.1 | เปิด config ของ select field | แสดง options ที่มีอยู่: label + value ต่อ row |
| 7.2 | กด "+ เพิ่มตัวเลือก" | เพิ่ม option: label = "ตัวเลือก N", value = N (auto-increment) |
| 7.3 | แก้ label | อัปเดตทันที |
| 7.4 | แก้ value เป็นข้อความ | เก็บเป็น string |
| 7.5 | แก้ value เป็นตัวเลข (เช่น "42") | auto-convert เป็น Number(42) |
| 7.6 | กด "✕" ลบ option | ลบ option, รายการที่เหลืออัปเดต |
| 7.7 | ลบ option ทั้งหมด | options = [], validation error ถ้าเป็น select |
| 7.8 | Option เป็น string เดิม (legacy) | normalize เป็น { label: str, value: str } |
| 7.9 | Option เป็น number เดิม (legacy) | normalize เป็น { label: String(n), value: n } |
| 7.10 | ControlDesignerModal: options มี key + value (reversed naming) | save แปลงเป็น { label: value, value: key } ถูกต้อง |

---

## 8. showWhen — Conditional Visibility

### 8A. ตั้งค่า showWhen ใน SchemaBuilder

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 8.1 | เปิด config panel → toggle "แสดงตามเงื่อนไข" ON | แสดง: dropdown เมื่อช่อง, dropdown เงื่อนไข, input ค่า |
| 8.2 | Toggle OFF | ลบ showWhen ออกจาก field (undefined → clean via updateField) |
| 8.3 | Toggle OFF แล้ว ON อีกครั้ง | ค่า default: field=first other, op=eq, value=auto |
| 8.4 | Dropdown "เมื่อช่อง": แสดง field อื่น | ยกเว้นตัวเอง + ยกเว้น pagebreak |
| 8.5 | เลือก field ที่เป็น boolean/toggle | ช่อง "ค่า" เปลี่ยนเป็น dropdown: "เปิด (true)" / "ปิด (false)" |
| 8.6 | เลือก field ที่ไม่ใช่ boolean | ช่อง "ค่า" เปลี่ยนเป็น text input |
| 8.7 | สลับ boolean → non-boolean field | value auto-convert จาก true/false → empty string |
| 8.8 | สลับ non-boolean → boolean field | value auto-convert → true |

### 8B. ตั้งค่า showWhen ใน ControlDesignerModal

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 8.9 | Toggle showWhen ON ใน modal | แสดง field/operator/value เหมือน SchemaBuilder |
| 8.10 | เลือก checkbox/toggle target | value เป็น dropdown true/false |
| 8.11 | Layout mode | ไม่แสดง showWhen section |

### 8C. Operators ทั้ง 7 ตัว (ทดสอบใน FormFiller)

| TC | Operator | Setup | ทดสอบ | ผลที่คาดหวัง |
|----|----------|-------|--------|-------------|
| 8.12 | eq | field_1 eq "hello" | กรอก field_1 = "hello" | field_2 แสดง |
| 8.13 | eq | field_1 eq "hello" | กรอก field_1 = "world" | field_2 ซ่อน |
| 8.14 | neq | field_1 neq "hello" | กรอก field_1 = "world" | field_2 แสดง |
| 8.15 | neq | field_1 neq "hello" | กรอก field_1 = "hello" | field_2 ซ่อน |
| 8.16 | notEmpty | field_1 notEmpty | กรอก field_1 มีค่า | field_2 แสดง |
| 8.17 | notEmpty | field_1 notEmpty | field_1 ว่าง | field_2 ซ่อน |
| 8.18 | empty | field_1 empty | field_1 ว่าง | field_2 แสดง |
| 8.19 | empty | field_1 empty | กรอก field_1 มีค่า | field_2 ซ่อน |
| 8.20 | contains | field_1 contains "test" | กรอก "my test data" | field_2 แสดง |
| 8.21 | gt | field_1 gt 10 | กรอก 15 | field_2 แสดง |
| 8.22 | lt | field_1 lt 10 | กรอก 5 | field_2 แสดง |

### 8D. Operator ไม่ต้องกรอกค่า

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 8.23 | เลือก op = "empty" | ช่อง "ค่า" ซ่อน |
| 8.24 | เลือก op = "notEmpty" | ช่อง "ค่า" ซ่อน |
| 8.25 | เปลี่ยนจาก "empty" → "eq" | ช่อง "ค่า" แสดง |

### 8E. Boolean Coercion

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 8.26 | Checkbox + showWhen value=true → ติ๊ก | field แสดง (boolean true == true) |
| 8.27 | Checkbox + showWhen value=true → ไม่ติ๊ก | field ซ่อน |
| 8.28 | Checkbox + showWhen value=false → ไม่ติ๊ก | field แสดง |
| 8.29 | showWhen value เก็บเป็น string "true" (API) | ยังเทียบได้ถูกต้อง (coercion) |

### 8F. Validation กับ showWhen

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 8.30 | field_2 (required) ถูกซ่อน → กด submit | ไม่ error (ข้าม validation ของ field ที่ซ่อน) |
| 8.31 | field_2 (required) ถูกแสดง → ไม่กรอก → submit | error "กรุณากรอกข้อมูล" |
| 8.32 | Multi-page: showWhen ข้าม page → ฟอร์มบันทึก | field ที่ซ่อนไม่ block "ถัดไป" |

---

## 9. FormFiller — กรอกฟอร์ม

**Mode:** จำลองฟอร์ม (embedded ใน FormBuilder)

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 9.1 | เปิด mode จำลองฟอร์ม | แสดงชื่อฟอร์ม + subtitle + fields ทั้งหมด |
| 9.2 | ฟอร์มมี `_description` | แสดง description แทน "กรอกข้อมูลแล้วกดบันทึก" |
| 9.3 | กรอก textbox | ค่าอัปเดตใน form data |
| 9.4 | กรอก number | รับเฉพาะตัวเลข, ค่าอัปเดต |
| 9.5 | เลือก select option | ค่าที่เลือกอัปเดต |
| 9.6 | เลือก dropdown option | ค่าอัปเดต |
| 9.7 | ติ๊ก checkbox | ค่า boolean = true |
| 9.8 | เปิด toggle | ค่า boolean = true |
| 9.9 | เลือก date | ค่าวันที่อัปเดต |
| 9.10 | ลาก slider | ค่าอัปเดตตาม position |
| 9.11 | กด rating stars | ค่าอัปเดตตามจำนวนดาว |
| 9.12 | Required field ไม่กรอก → "บันทึก" | error "กรุณากรอกข้อมูล" ที่ field นั้น |
| 9.13 | กรอกครบ required → "บันทึก" | error หายไป, บันทึกสำเร็จ |
| 9.14 | กด "แสดง JSON" | แสดง raw JSON ของข้อมูลที่กรอก |
| 9.15 | กด "ซ่อน JSON" | ซ่อน JSON panel |
| 9.16 | กรอกข้อมูล → กด "ล้างข้อมูล" | form reset เป็นค่าว่าง |
| 9.17 | กรอกถูกต้อง → "บันทึก" | success view: "บันทึกสำเร็จ!" + ✓ icon |
| 9.18 | Success → กด "กรอกอีกครั้ง" | reset form กลับหน้าที่ 1 |
| 9.19 | กรอก → บันทึก (embedded) | auto-switch ไป mode ข้อมูลฟอร์ม + refresh data |
| 9.20 | Dirty tracking | กรอกอะไรก็ตาม → dirty = true → ถ้า switch tab จะ prompt |

---

## 10. Multi-Page Form (Page Break)

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 10.1 | ฟอร์มมี pagebreak 1 ตัว (2 pages) | แสดง stepper: 2 dots + connecting line + progress bar |
| 10.2 | ฟอร์มมี pagebreak 2 ตัว (3 pages) | stepper แสดง 3 dots |
| 10.3 | หน้าที่ผ่านแล้ว | dot แสดง "✓" แทนตัวเลข |
| 10.4 | กดตัวเลขหน้าอื่นใน stepper | กระโดดไปหน้านั้นได้ |
| 10.5 | Progress bar: หน้าแรก (1/3) | progress = 0% |
| 10.6 | Progress bar: หน้า 2 (2/3) | progress = 50% |
| 10.7 | Progress bar: หน้าสุดท้าย (3/3) | progress = 100% |
| 10.8 | กด "ถัดไป" (ไม่มี required) | ไปหน้าถัดไป |
| 10.9 | กด "ถัดไป" (มี required ไม่ได้กรอก) | block + error ที่ fields ในหน้านี้เท่านั้น |
| 10.10 | กด "ย้อนกลับ" | กลับหน้าก่อน (ไม่ validate) |
| 10.11 | อยู่หน้าแรก | ไม่มีปุ่ม "ย้อนกลับ" |
| 10.12 | อยู่หน้าสุดท้าย | แสดงปุ่ม "บันทึก" แทน "ถัดไป" |
| 10.13 | กด "บันทึก" ที่หน้าสุดท้าย | validate ทุกหน้า → บันทึก |
| 10.14 | Pagebreak มี label "ข้อมูลส่วนตัว" | stepper แสดงชื่อ "ข้อมูลส่วนตัว" |
| 10.15 | Pagebreak ไม่มี label | แสดง "หน้า N จาก N" |
| 10.16 | ฟอร์มไม่มี pagebreak | ไม่แสดง stepper, single page, แสดง "ล้างข้อมูล" + "บันทึก" |

---

## 11. Share Page (FormFillerPage)

**หน้า:** `/form/:schemaId` (Standalone public form)

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 11.1 | เปิด URL `/form/:rootid` | แสดงฟอร์ม standalone + ThemeSwitcher มุมขวาบน |
| 11.2 | ฟอร์มมี multi-page | แสดง stepper เหมือน embedded FormFiller |
| 11.3 | กรอกข้อมูล + บันทึก | success: "บันทึกสำเร็จ!" + "กรอกอีกครั้ง" + "กลับ Form Builder" |
| 11.4 | Success → "กรอกอีกครั้ง" | reset form |
| 11.5 | Success → "กลับ Form Builder" | navigate ไป FormBuilder |
| 11.6 | ระหว่างโหลด | แสดง "กำลังโหลด..." |
| 11.7 | schemaId ไม่มีอยู่ | แสดง "ไม่พบฟอร์ม" + แสดง schema ID + ปุ่ม "กลับ Form Builder" |
| 11.8 | ไม่กรอกอะไร → "บันทึก" | ปุ่ม disabled (hasData = false) |
| 11.9 | ThemeSwitcher | toggle light/dark ได้ในหน้า share |
| 11.10 | ไม่มี debug JSON toggle | ไม่แสดงปุ่ม "แสดง JSON" (standalone mode) |

---

## 12. CRUD — จัดการข้อมูล

**Mode:** ข้อมูลฟอร์ม

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 12.1 | มีข้อมูล | แสดงตาราง columns ตาม schema fields |
| 12.2 | ไม่มีข้อมูล (empty) | EmptyState + ปุ่ม "เพิ่มข้อมูลแรก" |
| 12.3 | Boolean column | แสดง badge สี (true = เขียว, false = แดง) |
| 12.4 | Select/Dropdown column | แสดง label แทน raw value (enumMap lookup) |
| 12.5 | กด "+ เพิ่มข้อมูล" | สลับไป fill mode |
| 12.6 | กด Edit ที่แถว | เปิด modal + pre-populate ข้อมูลเดิม |
| 12.7 | Edit modal: แก้ไข → บันทึก | อัปเดตข้อมูล, toast success, modal ปิด, ตารางอัปเดต |
| 12.8 | Edit modal: กด Cancel | ไม่แก้ไข, modal ปิด |
| 12.9 | กด Delete ที่แถว | เปิด ConfirmModal |
| 12.10 | Delete ConfirmModal → ยืนยัน | ลบข้อมูล, toast success, แถวหายจากตาราง |
| 12.11 | Delete ConfirmModal → Cancel | ไม่ลบ |
| 12.12 | Search: พิมพ์คำค้น | กรองข้อมูลทันที (filter ทุก column ด้วย includes) |
| 12.13 | Search: ลบคำค้น | แสดงข้อมูลทั้งหมด |
| 12.14 | Search: คำค้นไม่ match | ตารางว่าง |
| 12.15 | Sort: กดหัว column | เรียง ascending |
| 12.16 | Sort: กดอีกครั้ง | เรียง descending |
| 12.17 | Sort: string column | localeCompare sort |
| 12.18 | Sort: number column | numeric sort |
| 12.19 | Pagination: > 10 rows | แสดง pagination (default 10/page) |
| 12.20 | Pagination: กดหน้าถัดไป | แสดงข้อมูลหน้าถัดไป |
| 12.21 | Bulk Edit: เปิด → เลือก → Bulk Delete → ยืนยัน | ลบทั้งหมดที่เลือก |
| 12.22 | Bulk Edit: Select All → Bulk Delete | ลบข้อมูลทุกแถวในหน้า |
| 12.23 | Schema Migration Banner: แก้ schema + มีข้อมูลเก่า | warning banner: field diff (badges: เพิ่ม/ลบ/เปลี่ยน) |
| 12.24 | Migration: กดปุ่ม "log" | modal แสดงรายละเอียดการเปลี่ยนแปลง |
| 12.25 | Migration: กด "อัพเดตข้อมูล" | migrate, ปุ่มแสดง "กำลังอัพเดต...", เสร็จ → banner หายไป |
| 12.26 | Export Excel: มีข้อมูล → กด | ดาวน์โหลดไฟล์ .xlsx |
| 12.27 | Export Excel: ไม่มีข้อมูล | ปุ่ม disabled |

---

## 13. 44 Control Types — รายละเอียด

### 13A. Input Controls

#### TC-13.1 Textbox Control (string)
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.1.1 | กรอกข้อความ | ค่าอัปเดตทันที |
| 13.1.2 | placeholder ตั้งค่าไว้ | แสดง placeholder ใน input |
| 13.1.3 | maxLength = 10 → กรอกเกิน | ตัดที่ 10 ตัวอักษร |
| 13.1.4 | rows = 1 (default) | แสดง `<input>` บรรทัดเดียว |
| 13.1.5 | rows > 1 (เช่น 3) | แสดง `<textarea>` หลายบรรทัด |
| 13.1.6 | required = true → ไม่กรอก → submit | error validation |
| 13.1.7 | disabled = true | input disabled, ไม่กรอกได้ |
| 13.1.8 | readOnly = true | แสดงค่าแต่แก้ไม่ได้ |

#### TC-13.2 Number Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.2.1 | กรอกตัวเลข | ค่าอัปเดต |
| 13.2.2 | min = 0 → กรอก -1 | ค่าถูก clamp หรือ validation error |
| 13.2.3 | max = 100 → กรอก 150 | ค่าถูก clamp หรือ validation error |
| 13.2.4 | step = 5 | input step ทำงาน (arrow up/down ทีละ 5) |
| 13.2.5 | placeholder | แสดง placeholder |
| 13.2.6 | disabled = true | input disabled |

#### TC-13.3 Select Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.3.1 | แสดง options | แสดง label ของแต่ละ option |
| 13.3.2 | เลือก option | ค่า = option.value (อาจเป็น number หรือ string) |
| 13.3.3 | placeholder ตั้งค่าไว้ | แสดง placeholder เมื่อยังไม่เลือก |
| 13.3.4 | required + ไม่เลือก → submit | error validation |
| 13.3.5 | disabled = true | select disabled |

#### TC-13.4 Dropdown Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.4.1 | กดเปิด dropdown | แสดงรายการ options |
| 13.4.2 | searchable = true → พิมพ์ค้นหา | กรองรายการตามข้อความ |
| 13.4.3 | clearable = true → กดเคลียร์ | ค่ากลับเป็นว่าง |
| 13.4.4 | เลือก option | ค่าอัปเดต, dropdown ปิด |
| 13.4.5 | maxHeight ตั้งค่าไว้ | dropdown list มี max height + scroll |

#### TC-13.5 Checkbox Control (boolean)
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.5.1 | ไม่ติ๊ก | ค่า = false |
| 13.5.2 | ติ๊ก | ค่า = true |
| 13.5.3 | ติ๊กแล้วติ๊กอีกครั้ง | ค่ากลับเป็น false |
| 13.5.4 | disabled = true | checkbox disabled |
| 13.5.5 | default value = true (config) | checkbox เปิดตั้งแต่แรก |

#### TC-13.6 Toggle Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.6.1 | สลับ OFF → ON | ค่า = true, toggle UI เปลี่ยนสี |
| 13.6.2 | สลับ ON → OFF | ค่า = false |
| 13.6.3 | disabled = true | toggle disabled |
| 13.6.4 | default value = true | toggle เปิดตั้งแต่แรก |

#### TC-13.7 Date Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.7.1 | กดเลือกวันที่ | ค่าอัปเดตเป็น date string |
| 13.7.2 | min date ตั้งค่าไว้ | เลือกวันก่อน min ไม่ได้ |
| 13.7.3 | max date ตั้งค่าไว้ | เลือกวันหลัง max ไม่ได้ |
| 13.7.4 | placeholder | แสดง placeholder |
| 13.7.5 | disabled / readOnly | input ไม่ทำงาน |

#### TC-13.8 Slider Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.8.1 | ลากไปค่าต่างๆ | ค่าอัปเดตตาม position |
| 13.8.2 | min = 0, max = 100 | ค่าอยู่ในช่วง 0-100 |
| 13.8.3 | step = 10 | ค่าเปลี่ยนทีละ 10 |
| 13.8.4 | showValue = true | แสดงตัวเลขค่าปัจจุบัน |
| 13.8.5 | showTicks = true | แสดง tick marks |
| 13.8.6 | showLabel = true | แสดง label |
| 13.8.7 | unit = "%" | แสดงหน่วย "%" ข้างค่า |
| 13.8.8 | size = small/medium/large | ขนาด slider เปลี่ยนตาม |
| 13.8.9 | color ตั้งค่า | สีของ track เปลี่ยน |
| 13.8.10 | disabled = true | ลากไม่ได้ |

#### TC-13.9 Rating Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.9.1 | กดดาวที่ 3 | ค่า = 3 |
| 13.9.2 | maxStars = 10 | แสดง 10 ดาว (default 5) |
| 13.9.3 | allowHalf = true → กดครึ่งดาว | ค่า = 2.5 |
| 13.9.4 | showLabel = true | แสดง label ข้างดาว |
| 13.9.5 | color ตั้งค่า | สีดาวเปลี่ยน |
| 13.9.6 | size = small/medium/large | ขนาดดาวเปลี่ยน |
| 13.9.7 | disabled = true / readOnly = true | กดดาวไม่ได้ |

#### TC-13.10 File Upload Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.10.1 | กดปุ่ม upload → เลือกไฟล์ | แสดงชื่อไฟล์ที่เลือก |
| 13.10.2 | maxFileSize ตั้งค่า → เลือกไฟล์ใหญ่เกิน | แจ้งเตือน / ไม่รับไฟล์ |
| 13.10.3 | allowedTypes = "image/*" → เลือกไฟล์ .pdf | ไม่รับ / แจ้งเตือน |
| 13.10.4 | buttonLabel ตั้งค่า | ปุ่มแสดง label ที่กำหนด |

### 13B. Display Controls

#### TC-13.11 Label Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.11.1 | value = "Hello" | แสดงข้อความ "Hello" |
| 13.11.2 | bold = true | ข้อความหนา |
| 13.11.3 | italic = true | ข้อความเอียง |
| 13.11.4 | fontSize = 24 | ขนาดตัวอักษร 24px |
| 13.11.5 | multiline = true + ข้อความหลายบรรทัด | แสดงหลายบรรทัด |

#### TC-13.12 Link Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.12.1 | href ตั้งค่า → กด link | navigate ไป URL ที่กำหนด |
| 13.12.2 | target = "_blank" → กด | เปิดแท็บใหม่ |
| 13.12.3 | target = "_self" → กด | เปิดในแท็บเดิม |
| 13.12.4 | underline = true | ข้อความมีขีดเส้นใต้ |
| 13.12.5 | buttonStyle = true | แสดงเป็นปุ่มแทน link text |
| 13.12.6 | disabled = true | กดไม่ได้ |

#### TC-13.13 Image Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.13.1 | URL ถูกต้อง | แสดงรูปภาพ |
| 13.13.2 | width/height ตั้งค่า | รูปขนาดตามที่กำหนด |
| 13.13.3 | objectFit = cover / contain | รูปปรับตาม fit mode |
| 13.13.4 | borderRadius ตั้งค่า | รูปมีมุมโค้ง |
| 13.13.5 | shadow = true | รูปมีเงา |
| 13.13.6 | grayscale = true | รูปเป็นขาวดำ |
| 13.13.7 | lazy = true | loading="lazy" attribute |
| 13.13.8 | enlargeable = true → กด | ขยายรูปเต็มจอ |
| 13.13.9 | URL ไม่ถูกต้อง + fallback URL | แสดงรูป fallback |
| 13.13.10 | alt ตั้งค่า | img alt text |

#### TC-13.14 Badge Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.14.1 | value = "Active" | แสดงข้อความ "Active" ใน pill badge |
| 13.14.2 | backgroundColor ตั้งค่า | badge พื้นสีตามกำหนด |
| 13.14.3 | color ตั้งค่า | ตัวอักษรสีตามกำหนด |

#### TC-13.15 Icon Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.15.1 | value = "⭐" | แสดง emoji |
| 13.15.2 | fontSize ตั้งค่า | ขนาด icon เปลี่ยน |
| 13.15.3 | color ตั้งค่า | สี icon เปลี่ยน |
| 13.15.4 | size preset (small/medium/large) | ขนาดเปลี่ยนตาม preset |

#### TC-13.16 Progress Bar Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.16.1 | value = 50 | progress bar เติม 50% |
| 13.16.2 | value = 0 | progress bar ว่าง |
| 13.16.3 | value = 100 | progress bar เต็ม |
| 13.16.4 | showValue = true | แสดง "50%" ข้อความ |
| 13.16.5 | color ตั้งค่า | สี bar เปลี่ยน |

#### TC-13.17 QR Code Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.17.1 | value = "https://example.com" | แสดง QR code สำหรับ URL นี้ |
| 13.17.2 | width/height ตั้งค่า | ขนาด QR เปลี่ยน |
| 13.17.3 | errorCorrectionLevel = L/M/Q/H | QR density เปลี่ยน |
| 13.17.4 | margin ตั้งค่า | ระยะขอบรอบ QR |
| 13.17.5 | color ตั้งค่า | สี QR เปลี่ยน |

#### TC-13.18 Button Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.18.1 | value = "Click me" | แสดงปุ่มข้อความ "Click me" |
| 13.18.2 | กดปุ่ม | onClick event fires |
| 13.18.3 | disabled = true | ปุ่ม disabled, กดไม่ได้ |

#### TC-13.19 Button Group Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.19.1 | แสดง options เป็นกลุ่มปุ่ม | ปุ่มแสดงถูกต้องตาม enum |
| 13.19.2 | กดเลือกปุ่ม | ค่าอัปเดต, ปุ่มเป็น active state |
| 13.19.3 | orientation = horizontal | ปุ่มเรียงแนวนอน |
| 13.19.4 | orientation = vertical | ปุ่มเรียงแนวตั้ง |
| 13.19.5 | multiple = true → เลือกหลายปุ่ม | ค่าเป็น array |
| 13.19.6 | disabled = true | ทุกปุ่ม disabled |

#### TC-13.20 Calendar Grid Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.20.1 | แสดงปฏิทิน | แสดงเดือน/ปี + grid วันที่ |
| 13.20.2 | editable = true → กดวันที่ | เลือกวันได้ |
| 13.20.3 | เปลี่ยนเดือน | แสดงเดือนถัดไป/ก่อน |

### 13C. Layout Controls

#### TC-13.21 Form Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.21.1 | colnumbers = 2 | controls จัดเป็น 2 columns |
| 13.21.2 | colnumbers = 3 | controls จัดเป็น 3 columns |
| 13.21.3 | responsive = true | ลดขนาดจอ → columns ลดลงอัตโนมัติ |

#### TC-13.22 Table Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.22.1 | มี columns + data | แสดงตาราง headers + rows |
| 13.22.2 | ไม่มี data | ตารางว่าง |
| 13.22.3 | custom renderer | column แสดง custom content |

#### TC-13.23 Grid Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.23.1 | columns = 3 (desktop) | แสดง 3 columns |
| 13.23.2 | tabletColumns = 2 | tablet width → 2 columns |
| 13.23.3 | mobileColumns = 1 | mobile width → 1 column |
| 13.23.4 | cardStyle = bordered/elevated/compact | สไตล์ card เปลี่ยนตาม |
| 13.23.5 | gap ตั้งค่า | ระยะห่างระหว่าง cards |

#### TC-13.24 Card Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.24.1 | columns = 2 | cards จัดเป็น 2 columns |
| 13.24.2 | gap ตั้งค่า | ระยะห่างเปลี่ยน |

#### TC-13.25 Accordion Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.25.1 | กด section header | เปิด/ปิด section content |
| 13.25.2 | allowMultiple = false | เปิดได้ทีละ 1 (ปิดตัวก่อนอัตโนมัติ) |
| 13.25.3 | allowMultiple = true | เปิดได้หลายตัวพร้อมกัน |
| 13.25.4 | defaultOpen ตั้งค่า | section เปิดอยู่ตั้งแต่แรก |

#### TC-13.26 Tabs Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.26.1 | กด tab | สลับ content ตาม tab ที่เลือก |
| 13.26.2 | tabPosition = top | tabs อยู่ด้านบน |
| 13.26.3 | tabPosition = bottom | tabs อยู่ด้านล่าง |
| 13.26.4 | tabPosition = left | tabs อยู่ด้านซ้าย (vertical) |
| 13.26.5 | tabPosition = right | tabs อยู่ด้านขวา (vertical) |
| 13.26.6 | activeTab ตั้งค่า | tab ที่กำหนดเปิดตั้งแต่แรก |

#### TC-13.27 Tree Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.27.1 | แสดง tree structure | แสดง parent/child nodes |
| 13.27.2 | กด expand/collapse | ซ่อน/แสดง child nodes |
| 13.27.3 | checkable = true | แสดง checkboxes, ติ๊กได้ |
| 13.27.4 | showLine = true | แสดงเส้นเชื่อม nodes |
| 13.27.5 | multiple = true | เลือกหลาย nodes ได้ |
| 13.27.6 | defaultExpanded ตั้งค่า | nodes เปิดอยู่ตั้งแต่แรก |
| 13.27.7 | disabled = true | ทุก node disabled |

#### TC-13.28 Menu Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.28.1 | แสดง menu items | items แสดงถูกต้อง |
| 13.28.2 | กดเลือก item | item เป็น active state |
| 13.28.3 | orientation = vertical | menu เรียงแนวตั้ง |
| 13.28.4 | orientation = horizontal | menu เรียงแนวนอน |
| 13.28.5 | collapsible = true | ย่อ/ขยาย menu ได้ |
| 13.28.6 | activeMenu ตั้งค่า | item ที่กำหนดเป็น active ตั้งแต่แรก |

#### TC-13.29 CRUD Control (Composite)
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.29.1 | แสดง table + toolbar | ตาราง + search + ปุ่ม add |
| 13.29.2 | selectable = true | แสดง checkboxes ที่แถว |
| 13.29.3 | hideAdd = true | ซ่อนปุ่ม add |
| 13.29.4 | Auto CRUD (keyField set, no callbacks) | add/edit/delete จัดการ internal state |

#### TC-13.30 Modal Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.30.1 | เปิด modal | แสดง overlay + content |
| 13.30.2 | size = sm/md/lg/xl | ขนาด modal เปลี่ยนตาม |
| 13.30.3 | closeOnBackdropClick = true → กด backdrop | modal ปิด |
| 13.30.4 | closeOnBackdropClick = false → กด backdrop | modal ไม่ปิด |
| 13.30.5 | กดปุ่ม close | modal ปิด |

#### TC-13.31 Pagination Control
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.31.1 | แสดง pagination buttons | ปุ่มหน้า + prev/next |
| 13.31.2 | maxButtons ตั้งค่า | จำกัดจำนวนปุ่มที่แสดง |
| 13.31.3 | showPageInfo = true | แสดง "หน้า X จาก Y" |
| 13.31.4 | showItemInfo = true | แสดง "แสดง N-M จาก Total" |

### 13D. Modal Controls

#### TC-13.32 Alert Modal
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.32.1 | type = info | แสดง alert สีฟ้า |
| 13.32.2 | type = success | แสดง alert สีเขียว |
| 13.32.3 | type = warning | แสดง alert สีเหลือง |
| 13.32.4 | type = error | แสดง alert สีแดง |
| 13.32.5 | closeOnBackdropClick = true → กด backdrop | alert ปิด |
| 13.32.6 | closeOnEscapeKey = true → กด ESC | alert ปิด |

#### TC-13.33 Confirm Modal
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.33.1 | แสดง confirm + cancel buttons | ปุ่มตาม labels ที่กำหนด |
| 13.33.2 | confirmLabel ตั้งค่า | ปุ่ม confirm แสดง label ที่กำหนด |
| 13.33.3 | cancelLabel ตั้งค่า | ปุ่ม cancel แสดง label ที่กำหนด |
| 13.33.4 | isDangerous = true | ปุ่ม confirm เป็นสีแดง |
| 13.33.5 | กด confirm | onConfirm callback fires |
| 13.33.6 | กด cancel | onCancel callback fires, modal ปิด |

### 13E. Chart Controls

#### TC-13.34 Chart (Recharts)
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.34.1 | chartType = bar | แสดง bar chart |
| 13.34.2 | chartType = line | แสดง line chart |
| 13.34.3 | chartType = pie | แสดง pie chart |
| 13.34.4 | title ตั้งค่า | แสดง title ด้านบน |
| 13.34.5 | showLegend = true | แสดง legend |
| 13.34.6 | showGrid = true | แสดง grid lines |

#### TC-13.35 Bar Chart JS
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.35.1 | xAxisKey + yAxisKey ตั้งค่า | แสดง bars ตาม data |
| 13.35.2 | title | แสดง title |
| 13.35.3 | showLegend/showGrid | legend/grid ทำงาน |

#### TC-13.36 Line Chart JS
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.36.1 | แสดง line chart | เส้นแสดง data points |
| 13.36.2 | curved = true | เส้นโค้ง (smooth) |
| 13.36.3 | curved = false | เส้นตรง (straight) |

#### TC-13.37 Pie Chart JS
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.37.1 | nameKey + dataKey ตั้งค่า | แสดง pie slices ตาม data |
| 13.37.2 | showLegend = true | แสดง legend |

#### TC-13.38 Doughnut Chart JS
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.38.1 | แสดง doughnut | เหมือน pie แต่มีรูตรงกลาง |
| 13.38.2 | innerRadius ตั้งค่า | ขนาดรูตรงกลางเปลี่ยน |

#### TC-13.39 Radar Chart JS
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.39.1 | แสดง radar chart | แสดง radar polygon ตาม data |
| 13.39.2 | showGrid = true | grid lines แสดง |

#### TC-13.40 Area Chart JS
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.40.1 | แสดง area chart | พื้นที่ใต้เส้นถูกเติมสี |
| 13.40.2 | fillOpacity ตั้งค่า | ความโปร่งใสของพื้นที่เปลี่ยน |

#### TC-13.41 Bubble Chart JS
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.41.1 | แสดง bubble chart | bubbles แสดงตาม x/y/size data |

#### TC-13.42 Mixed Chart JS
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 13.42.1 | แสดง mixed chart | หลาย type (bar+line) ใน chart เดียว |

---

## 14. Theme System

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 14.1 | กด ThemeSwitcher | สลับ light ↔ dark |
| 14.2 | ตรวจ `<html data-theme>` | attribute = "light" หรือ "dark" |
| 14.3 | Refresh หน้า | theme คงเดิม (localStorage persist) |
| 14.4 | ลบ localStorage('theme') + system = dark | เปิดเว็บ → dark theme |
| 14.5 | ลบ localStorage('theme') + system = light | เปิดเว็บ → light theme |
| 14.6 | Light: `--bg-primary` | สีอ่อน |
| 14.7 | Dark: `--bg-primary` | สีเข้ม |
| 14.8 | Dark mode: Business Selector | แสดงถูกต้อง, อ่านได้ |
| 14.9 | Dark mode: Dashboard | ตาราง + stats cards สีถูกต้อง |
| 14.10 | Dark mode: Form Builder | topbar + SchemaBuilder สีถูกต้อง |
| 14.11 | Dark mode: FormFiller | ฟอร์ม + stepper สีถูกต้อง |
| 14.12 | Dark mode: Share Page | standalone form สีถูกต้อง |
| 14.13 | Dark mode: Controls Docs | ทุก demo page สีถูกต้อง |
| 14.14 | ตรวจทุก control | ไม่มี hardcoded color, ใช้ CSS variables |

---

## 15. Service Layer (Auto-Detect)

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 15.1 | Backend online → เปิด frontend | Dashboard badge = "API Online" |
| 15.2 | API mode: สร้างข้อมูล | บันทึก PostgreSQL ผ่าน REST API |
| 15.3 | API mode: แก้ไขข้อมูล | อัปเดต PostgreSQL |
| 15.4 | API mode: ลบข้อมูล | soft delete (flag='d') ใน PostgreSQL |
| 15.5 | API mode: Refresh | ข้อมูลยังอยู่ (persistent) |
| 15.6 | Backend offline → เปิด frontend | รอ 1.5s timeout → badge = "localStorage" |
| 15.7 | Fallback: สร้าง/แก้ไข/ลบ | ข้อมูลบันทึกใน localStorage |
| 15.8 | Fallback: seedDemoData | Business + schema + view + form + 2 data records สร้างอัตโนมัติ |
| 15.9 | API: getBusinesses() | ดึงรายการ business |
| 15.10 | API: createBusiness() | สร้าง business |
| 15.11 | API: deleteBusiness() | ลบ business |
| 15.12 | API: getSchemas(business_id) | ดึง schemas ตาม business |
| 15.13 | API: createSchema() / updateSchema() | สร้าง/อัปเดต schema (version ใหม่) |
| 15.14 | API: createFormData() / updateFormData() | บันทึก/แก้ไขข้อมูลฟอร์ม |
| 15.15 | API: deleteFormData() | ลบข้อมูล |
| 15.16 | API: migrateFormData() | migrate data เมื่อ schema เปลี่ยน |

---

## 16. Toast Notifications

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 16.1 | Success toast | สีเขียว, ข้อความถูกต้อง |
| 16.2 | Error toast | สีแดง |
| 16.3 | Warning toast | สีเหลือง |
| 16.4 | Info toast (default) | สีฟ้า |
| 16.5 | Auto-dismiss | หายไปหลัง 3 วินาที |
| 16.6 | หลาย toast พร้อมกัน | ซ้อนกันใน container |
| 16.7 | สร้าง business สำเร็จ | toast "สร้างโครงการใหม่เรียบร้อยแล้ว" (success) |
| 16.8 | Key ซ้ำ | toast `ชื่อ Key "xxx" มีอยู่แล้ว` (warning) |

---

## 17. Excel Export

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 17.1 | มีข้อมูล → กด "Export Excel" | ดาวน์โหลดไฟล์ .xlsx |
| 17.2 | ไม่มีข้อมูล | ปุ่ม disabled |
| 17.3 | ตรวจ columns ในไฟล์ | ตรงกับ schema fields |
| 17.4 | ตรวจ data ในไฟล์ | ข้อมูลครบถ้วน |
| 17.5 | Boolean data ใน Excel | แสดง true/false |
| 17.6 | Select data ใน Excel | แสดง label (ไม่ใช่ raw value) |

---

## 18. 404 & Routing

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 18.1 | เปิด URL ที่ไม่มี เช่น `/xyz` | แสดง NotFound page + ข้อความภาษาไทย |
| 18.2 | กด "กลับหน้าหลัก" | Navigate กลับ `/` |
| 18.3 | Lazy-loaded page (FormBuilder) | แสดง PageLoader ("Loading...") ระหว่างโหลด |
| 18.4 | Lazy-loaded page (Controls Docs) | แสดง PageLoader ระหว่างโหลด |
| 18.5 | Navigate `/` → card → `/dashboard` → form → `/formbuilder` | flow ทำงานถูกต้อง |
| 18.6 | ใช้ PAGES constants | ทุก navigation ใช้ routes.js ไม่ hardcode |

---

## 19. Controls Docs

**หน้า:** `/controls-docs`

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 19.1 | เปิด `/controls-docs` | แสดง sidebar menu + demo pages |
| 19.2 | กดเลือก control ใน menu | แสดง demo page ของ control นั้น |
| 19.3 | ทุก demo page | แสดง live interactive control |
| 19.4 | Sidebar: ทุก control type มี link | 44 links ใน sidebar |
| 19.5 | Dark mode | ทุก demo page แสดงถูกต้อง |
| 19.6 | Lazy loading | pages โหลดเมื่อเลือก (pageRegistry) |

---

## 20. End-to-End Flows

### E2E-1: สร้างฟอร์มใหม่ + กรอกข้อมูล + ดูในตาราง
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 20.1 | เลือก business → Dashboard → สร้างฟอร์ม | เปิด FormBuilder mode แก้ไข |
| 20.2 | เพิ่ม 3 fields: string, number, select | fields แสดงใน list |
| 20.3 | ตั้ง label ให้ทุก field | ไม่มี validation error |
| 20.4 | กด "บันทึกและทดสอบ" | สลับไป fill mode |
| 20.5 | กรอกข้อมูลครบ → บันทึก | success → auto-switch ไป data mode |
| 20.6 | ดูตาราง | แถวใหม่แสดงข้อมูลที่กรอก |

### E2E-2: แก้ไข schema + migrate data
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 20.7 | มีข้อมูลในตาราง → แก้ไขฟอร์ม: เพิ่ม field, ลบ field | บันทึก schema |
| 20.8 | กลับ mode ข้อมูล | migration banner แสดง |
| 20.9 | กด "อัพเดตข้อมูล" | ข้อมูลมี field ใหม่ (ค่าว่าง), field ที่ลบหายไป |

### E2E-3: Multi-page form + showWhen
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 20.10 | สร้างฟอร์ม: checkbox + pagebreak + textbox (showWhen checkbox=true) | บันทึก |
| 20.11 | Fill mode: หน้า 1 ไม่ติ๊ก checkbox → ถัดไป | หน้า 2 ไม่แสดง textbox |
| 20.12 | กลับหน้า 1 → ติ๊ก checkbox → ถัดไป | หน้า 2 แสดง textbox |

### E2E-4: Share link flow
| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 20.13 | สร้างฟอร์ม → กด Share → copy link | link อยู่ใน clipboard |
| 20.14 | เปิด link ใน browser ใหม่ (incognito) | แสดง standalone form |
| 20.15 | กรอก + บันทึก | success → กลับ dashboard → ข้อมูลใหม่แสดงในตาราง |

---

## 21. Cross-Feature & Edge Cases

| TC | ขั้นตอน | ผลที่คาดหวัง |
|----|---------|-------------|
| 21.1 | showWhen + Multi-page: field ซ่อนข้าม page | ไม่ block validation ของหน้าอื่น |
| 21.2 | showWhen + CRUD table: boolean column | ตารางแสดง badge true/false ถูกต้อง |
| 21.3 | Select field + CRUD table | ตารางแสดง label (ไม่ใช่ raw value) |
| 21.4 | Drag reorder + showWhen | showWhen ยังอ้างอิง field ถูกต้องหลัง reorder |
| 21.5 | เปลี่ยน key ของ field ที่ถูกอ้างใน showWhen | showWhen.field ยังเป็นค่าเดิม (อาจ broken — edge case) |
| 21.6 | ลบ field ที่ถูกอ้างใน showWhen | field ที่มี showWhen ไม่ crash (graceful) |
| 21.7 | Schema ไม่มี _order → เปิด builder | normalizeOrder เพิ่ม _order ให้อัตโนมัติ |
| 21.8 | สร้าง 50+ fields ใน schema | performance ไม่ lag, scroll ทำงาน |
| 21.9 | ชื่อ business ยาวมาก (100+ chars) | card แสดงไม่ overflow |
| 21.10 | ชื่อฟอร์มมีอักขระพิเศษ (emoji, unicode) | แสดงและบันทึกถูกต้อง |
| 21.11 | API error ระหว่าง save | toast error, ไม่สูญเสียข้อมูลที่กรอก |
| 21.12 | Refresh ระหว่างกรอกฟอร์ม | ข้อมูลหาย (expected — ไม่มี auto-save) |
| 21.13 | เปิด 2 tabs → แก้ schema ใน tab 1 → refresh tab 2 | tab 2 โหลด schema ใหม่ |
| 21.14 | Backend ล่มกลาง session | frontend fallback ไม่ crash, toast error |
| 21.15 | Field type ที่ disabled (datepicker) | ไม่แสดงใน dropdown เลือก type |
| 21.16 | showWhen: ฟอร์มมีแค่ 1 field → เปิด showWhen | dropdown "เมื่อช่อง" ว่าง (ไม่มี field อื่น) |
| 21.17 | Export Excel + multi-page form | export ข้อมูลทุก field (ไม่แยก page) |
| 21.18 | Dark mode + QR Code | QR code อ่านได้ (contrast เพียงพอ) |

---

> **Grand Total: 300+ Test Scenarios**  
> ครอบคลุม 21 หมวด: Business Selector, Dashboard, FormBuilder, SchemaBuilder, ControlDesigner, Config Panel, Option Editor, showWhen (7 operators), FormFiller, Multi-Page, Share Page, CRUD, 44 Controls (ทุก config), Theme, Service Layer, Toast, Excel, Routing, Controls Docs, E2E Flows, Cross-Feature Edge Cases
