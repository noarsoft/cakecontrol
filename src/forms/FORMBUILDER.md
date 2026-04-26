# Form Builder — Developer Guide

สำหรับคนที่เพิ่งมาอ่านโค้ดครั้งแรก — อธิบายว่าแต่ละไฟล์ทำอะไร ทำไมถึงออกแบบแบบนี้ และ flow ทำงานยังไงตั้งแต่ต้นจนจบ

---

## 1. ระบบนี้คืออะไร

Form Builder คือระบบสร้างฟอร์มแบบ Google Forms — User สร้าง "แม่แบบ" กำหนด fields (ชื่อ, อายุ, สิทธิ์) แล้วระบบ auto-generate ทั้งตาราง + ฟอร์ม + CRUD ให้อัตโนมัติ โดยไม่ต้องเขียนโค้ดเพิ่ม

---

## 2. DB มี 4 tables — ทำไมถึงแยก?

```
data_schema ──┬──> view    (ตารางโชว์ยังไง)
              ├──> form    (ฟอร์มหน้าตายังไง)
              └──> data    (ข้อมูลจริงที่ user กรอก)
```

| Table | เก็บอะไร | ตัวอย่าง JSON | ทำไมต้องแยก |
|-------|---------|--------------|------------|
| `data_schema` | โครงสร้าง field | `{name: {type:"string"}, age: {type:"number"}}` | เป็น "แบบพิมพ์" ที่ทุก table อ้างอิง |
| `view` | config ตาราง | `{columns: [{key:"name", header:"ชื่อ", width:"auto"}]}` | แยกเพราะ 1 schema มีได้หลาย view (ตอนนี้ใช้แค่ 1) |
| `form` | config ฟอร์ม | `{colnumbers:6, controls: [{key:"name", label:"ชื่อ-นามสกุล", rowno:1}]}` | แยกเพราะ layout ฟอร์มเปลี่ยนได้โดยไม่กระทบ schema |
| `data` | ข้อมูลจริง | `{name:"สมชาย", age:28, role:"Admin"}` | 1 schema มีหลาย rows |

**ทำไม `view` กับ `form` ไม่รวมอยู่ใน `data_schema`?**
เพราะ schema คือ "โครงสร้าง" (มี field อะไร, type อะไร) แต่ view คือ "แสดงผลยังไง" (header ชื่ออะไร, กว้างเท่าไหร่) และ form คือ "กรอกยังไง" (label อะไร, อยู่ row ไหน) — แยกกันเพื่อให้เปลี่ยน UI ได้โดยไม่ต้องแก้โครงสร้าง

---

## 3. ไฟล์ทั้งหมด — อ่านไฟล์ไหนก่อน?

### Frontend Components (อ่านตาม flow)

| ลำดับ | ไฟล์ | หน้าที่ | อ่านเมื่อ |
|------|------|--------|----------|
| 1 | `FormBuilder.jsx` | **Main container** — เก็บ state ทั้งหมด, routing ระหว่าง mode, callbacks ทุกตัว | อ่านก่อนเลย ไฟล์นี้เป็นจุดเริ่มต้น |
| 2 | `TemplateManager.jsx` | ตาราง schema ทั้งหมด + search + pagination | อ่านตอนดูหน้า "จัดการแม่แบบ" |
| 3 | `ControlDesignerModal.jsx` | Modal ออกแบบ fields (กำหนด label + databind + type) | อ่านตอนดูการสร้าง/แก้ไข แม่แบบ |
| 4 | `SchemaBuilder.jsx` | แก้ไข fields แบบ raw (key + type dropdown) | mode "แก้ไขฟอร์ม" |
| 5 | `FormFiller.jsx` | กรอกฟอร์มแบบ Google Forms — **กรอกแล้วบันทึกลง DB จริง** | mode "กรอกฟอร์ม" |
| 6 | `FormPreview.jsx` | Preview ฟอร์ม — **กรอกทดลอง ไม่บันทึก** แสดง Form Data JSON ให้ดู real-time | mode "Preview" |
| 7 | `FormFillerPage.jsx` | Standalone page สำหรับ share link `/form/:id` | หน้าแยก ไม่ผ่าน FormBuilder |
| 8 | `SchemaNameInput.jsx` | Inline editable schema name ที่ toolbar | component เล็ก |

### Service Layer (อ่านตอนอยากรู้ว่าข้อมูลไปไหน)

| ไฟล์ | หน้าที่ | ทำไมถึงออกแบบแบบนี้ |
|------|--------|-------------------|
| `../lib/schemaService.js` | **Strategy pattern** — auto-detect ว่าใช้ API หรือ localStorage | เพราะ dev อาจไม่ได้เปิด backend ก็ใช้งานได้ |
| `../lib/apiSchemaService.js` | API mode — fetch ไป Express backend | production path |
| `../lib/mockSchemaService.js` | Mock mode — localStorage + demo seed | dev/demo path |

### Transform Layer (อ่านตอนอยากรู้ว่า schema แปลงเป็น UI ยังไง)

| ไฟล์ | หน้าที่ | ทำไมต้องมี |
|------|--------|----------|
| `../lib/schemaTransform.js` | แปลง DB data → CRUDControl config | เพราะ DB เก็บแบบ normalize แต่ CRUDControl ต้องการ config format เฉพาะ |

---

## 4. Flow ทีละ Step

### Step 0: เปิดหน้า `/formbuilder` — เกิดอะไรขึ้น?

**โค้ดที่ทำงาน:** `FormBuilder.jsx:29-34`

```jsx
useEffect(() => {
    initService().then(mode => {   // เช็คว่ามี backend มั้ย
        setServiceMode(mode);       // 'api' หรือ 'mock'
        reloadSchemas();            // โหลด schema ทั้งหมด
    });
}, []);
```

**เกิดอะไร:**
1. `schemaService.js:7` — fetch `localhost:3002/api/health` timeout 1.5 วิ
2. ถ้า backend ตอบ → ใช้ `apiSchemaService.js` (แสดง 🟢 API)
3. ถ้า backend ไม่ตอบ → ใช้ `mockSchemaService.js` (แสดง 🟡 localStorage)
4. ถ้าเป็น mock + ไม่มีข้อมูล → `mockSchemaService.js:203` `seedDemoData()` สร้าง "พนักงาน" + "สินค้า"
5. `reloadSchemas()` ดึง schema ทั้งหมด → render sidebar

**ทำไมต้องมี `initService()`?**
เพราะคนในทีมไม่จำเป็นต้องเปิด backend ก็ทดสอบ UI ได้ — ระบบ fallback ไป localStorage อัตโนมัติ ไม่ต้อง config อะไร

---

### Step 1: กดเลือก schema จาก sidebar (เช่น "พนักงาน")

**โค้ดที่ทำงาน:** `FormBuilder.jsx:80-84`

```jsx
const handleSelectSchema = (id) => {
    setActiveSchemaId(id);         // เก็บ schema ที่เลือก
    setMode('data');               // สลับไป data mode
    setRefreshKey(k => k + 1);     // trigger โหลดข้อมูลใหม่
};
```

**แล้วข้อมูลมาจากไหน?** `FormBuilder.jsx:48-66`

```jsx
useEffect(() => {
    // useEffect นี้ fire ทุกครั้งที่ activeSchema หรือ refreshKey เปลี่ยน
    const [views, formcfgs, formData] = await Promise.all([
        getViewsBySchema(activeSchema.id),      // ดึง view config
        getFormcfgsBySchema(activeSchema.id),    // ดึง form config
        getFormDataBySchema(activeSchema.id),    // ดึง data จริง
    ]);
    setSchemaData({
        view: views[0],
        formcfg: formcfgs[0],
        data: formData.map(f => ({ _formId: f.id, ...f.data })),
        //                        ↑ inject _formId เข้าไปใน data object
        //                          เพื่อให้ CRUDControl รู้ว่า row ไหนเป็น record ไหนใน DB
    });
}, [activeSchema, refreshKey]);
```

**ทำไมต้อง `_formId`?**
เพราะ `data` table เก็บข้อมูลจริงเป็น JSON (`{name:"สมชาย", age:28}`) ซึ่งไม่มี id — แต่ตอนแก้ไข/ลบต้องรู้ว่าจะอัพเดต record ไหนใน DB ก็เลย inject `_formId` (= `data.id`) เข้าไป แล้วใช้เป็น `keyField` ของ CRUDControl

**ทำไมต้อง `refreshKey`?**
เพราะหลัง add/edit/delete ต้อง reload ข้อมูลใหม่ — แค่เปลี่ยน `refreshKey` ก็ trigger useEffect ให้ fetch ใหม่ ไม่ต้อง manual re-fetch

---

### Step 2: Databinding — โค้ดส่วนไหนแปลง DB → UI

**โค้ดที่ทำงาน:** `FormBuilder.jsx:124-139` → `schemaTransform.js:90-104`

```jsx
// FormBuilder.jsx:124-139
const crudConfig = useMemo(() => {
    const cfg = buildCrudConfig({
        schemaJson: activeSchema.json,           // {name: {type:"string"}, ...}
        viewJson: schemaData.view?.json_table_config,  // {columns: [...]}
        formcfgJson: schemaData.formcfg?.json_form_config, // {controls: [...]}
        data: schemaData.data,                   // [{_formId:1, name:"สมชาย", ...}]
        keyField: '_formId',
    });
    return { ...cfg, onAdd: handleDataAdd, onEdit: handleDataEdit, onDelete: handleDataDelete };
}, [activeSchema, schemaData, ...]);
```

**`buildCrudConfig()` ข้างในทำ 2 อย่าง:**

#### 2a. สร้าง columns สำหรับตาราง

`schemaTransform.js:26-38` — `schemaToColumnsConfig()`

```
viewJson.columns = [
  { key: "name",  header: "ชื่อ",   width: "auto", sortable: true }
  { key: "age",   header: "อายุ",  width: "80",   sortable: true }
  ...
]

key    → ใช้เป็น databind ของ column (อ่านค่าจาก rowData[key])
header → ข้อความที่แสดงบน table header
```

#### 2b. สร้าง form controls สำหรับ add/edit modal

`schemaTransform.js:44-85` — `schemaToFormConfig()`

```
input:
  formcfgJson.controls = [{key:"name", label:"ชื่อ-นามสกุล", rowno:1, colspan:6}]
  schemaJson = {name: {type:"string"}, role: {type:"select", enum:["Admin","User"]}}

output:
  controls = [
    {type:"textbox", databind:"name", label:"ชื่อ-นามสกุล", ...}
    {type:"number",  databind:"age",  label:"อายุ", ...}
    {type:"select",  databind:"role", label:"สิทธิ์", options:[{label:"Admin",value:"Admin"},...]}
  ]
```

**สังเกต:**
- `controls[].key` จาก DB → กลายเป็น `control.databind` ใน UI
- `schemaJson[key].type` → แปลงผ่าน `fieldTypeToControlType()` (line 9-19) เป็น control type ที่ genControl() รู้จัก
- ถ้า type = `select` → ดึง `enum` จาก schema มาสร้าง `options[]` ให้ dropdown

**ทำไมต้องมี `schemaTransform.js`?**
เพราะ DB เก็บข้อมูลแบบ normalize (schema, view, form แยกกัน) แต่ CRUDControl ต้องการ config object ก้อนเดียว — ไฟล์นี้เป็น "สะพาน" ที่แปลงให้

---

### Step 3: CRUDControl render ข้อมูลบนหน้าจอ

**โค้ดที่ทำงาน:** `CRUDControl.jsx:103-126` + `TableviewControl.jsx`

```
CRUDControl ได้รับ config:
  config.data     = [{_formId:1, name:"สมชาย", age:28, ...}]
  config.columns  = [{key:"name", header:"ชื่อ"}, ...]
  config.formConfig = {controls: [{databind:"name", type:"textbox", ...}]}

TableviewControl render:
  แต่ละ column → genControl(col.type, rowData[col.key])
                                       ↑ databind ตรงนี้
                                       rowData["name"] → "สมชาย"
                                       rowData["age"]  → 28

  แต่ละ row → ปุ่ม "แก้ไข" + "ลบ" (CRUDControl.jsx:66-67)
```

---

### Step 4-5: กด "+ เพิ่มข้อมูล" → กรอก → บันทึก

**โค้ดที่ทำงาน:**

| Step | โค้ด | ทำอะไร |
|------|------|--------|
| กดปุ่ม | `CRUDControl.jsx:122-124` | `openAddModal()` → เปิด ModalControl |
| render ฟอร์ม | `CRUDControl.jsx:139-146` | `<FormControl config={formConfig}>` → render controls ตาม databind |
| user กรอก | `FormControl` → `onChange` | `setModalFormData({name:"ใหม่", age:30, ...})` |
| กดบันทึก | `CRUDControl.jsx:142` | `handleSave()` → เรียก `config.onAdd(modalFormData)` |
| callback | `FormBuilder.jsx:101-107` | `handleDataAdd(formData)` |
| save DB | `FormBuilder.jsx:104` | `createFormData(activeSchema.id, clean)` |
| refresh | `FormBuilder.jsx:106` | `setRefreshKey(k+1)` → trigger useEffect → reload data |

**`createFormData()` ทำอะไรใน DB?** `mockSchemaService.js:166-181`

```jsx
function createFormData(schemaId, data) {
    const item = {
        rootid: crypto.randomUUID(),   // PK ถาวร
        id: nextId('cakecontrol_data'),// SERIAL สำหรับ FK
        data_schema_id: schemaId,      // FK → data_schema
        data,                          // {name:"ใหม่", age:30, ...}
        activate: true,
    };
    items.push(item);
    setStore('cakecontrol_data', items);  // save ลง localStorage
}
```

---

### Step 6: กด "แก้ไข" row

**โค้ดที่ทำงาน:**

| Step | โค้ด | ทำอะไร |
|------|------|--------|
| กดปุ่ม | `CRUDControl.jsx:66` | `openEditModal(rowData, rowIndex)` |
| pre-fill | `useCRUDState.js` | `modalFormData = {...rowData}` → ฟอร์มมีค่าเดิม |
| กดบันทึก | callback chain | `config.onEdit(formData, oldData)` |
| callback | `FormBuilder.jsx:109-115` | `handleDataEdit(formData, oldData)` |
| save DB | `FormBuilder.jsx:112` | `updateFormData(oldData._formId, clean)` |

**ทำไมต้องส่ง `oldData`?**
เพราะต้องรู้ `oldData._formId` เพื่อบอก DB ว่าจะอัพเดต record ไหน — ตัว formData ใหม่ไม่มี id

---

### Step 7: กด "ลบ" row

**โค้ดที่ทำงาน:**

| Step | โค้ด | ทำอะไร |
|------|------|--------|
| กดปุ่ม | `CRUDControl.jsx:67` | `openDeleteConfirm(rowData)` |
| แสดง modal | `CRUDControl.jsx:148-150` | `<ConfirmModal title="ยืนยันการลบ">` |
| กดยืนยัน | callback chain | `config.onDelete(rowData)` |
| callback | `FormBuilder.jsx:117-121` | `handleDataDelete(rowData)` |
| soft delete | `mockSchemaService.js:192-199` | `items[idx].activate = false` |

**ทำไมเป็น soft delete?**
เพราะระบบใช้ `activate` flag — ไม่ลบ record จริง แค่ mark เป็น false แล้ว filter ออกตอน query (`getSchemas()` filter `activate !== false`)

---

### Step 8: สร้าง/แก้ไข แม่แบบ (ControlDesignerModal)

**นี่คือจุดที่ databind ถูกกำหนดครั้งแรก**

**โค้ดที่ทำงาน:** `ControlDesignerModal.jsx`

#### เปิด modal

```
กด "+ สร้างแม่แบบ"  → TemplateManager.jsx:26-29  → setDesignerOpen(true), editingSchema=null
กด "แก้ไข" (row)    → TemplateManager.jsx:31-34  → setDesignerOpen(true), editingSchema=schema
```

#### โหลด controls จาก schema

`ControlDesignerModal.jsx:46-63` — `schemaToControls()`

```
input:  schemaJson = {name: {type:"string"}, role: {type:"select", enum:[...]}}
        formcfgJson = {controls: [{key:"name", label:"ชื่อ-นามสกุล"}]}

output: controls = [
  { label:"ชื่อ-นามสกุล", databind:"name", controlType:"textbox" },
  { label:"สิทธิ์",      databind:"role", controlType:"dropdown", options:[...] },
]
```

#### User กำหนด fields

แต่ละ row ใน modal (line 196-269):
```
[1] label: "ชื่อ-นามสกุล"  |  databind: "name"  |  type: Textbox   |  ↑ ↓ ✕
[2] label: "อายุ"          |  databind: "age"   |  type: Number    |  ↑ ↓ ✕
[3] label: "สิทธิ์"        |  databind: "role"  |  type: Dropdown  |  ↑ ↓ ✕
                                                    └─ options: Admin, User, Guest
```

- **databind** = ชื่อ field ที่จะเป็น key ใน data object — User พิมพ์เอง
- **controlType** = ชนิด UI control ที่จะ render
- ถ้าเลือก Dropdown → โผล่ panel ให้กำหนด key/value pairs (line 233-268)

#### กดบันทึก

`ControlDesignerModal.jsx:154-160` — `handleSave()`

```jsx
const json = controlsToSchema(validControls);      // สร้าง data_schema.json
const formcfg = controlsToFormcfg(validControls);   // สร้าง form.json_form_config
onSave({ name, json, formcfg });                    // ส่งกลับ parent
```

**`controlsToSchema()` (line 65-78):** แปลง controls → schema JSON

```
input:  [{databind:"name", controlType:"textbox", label:"ชื่อ"}, ...]
output: {name: {type:"string", label:"ชื่อ"}, age: {type:"number"}, ...}
```

**`controlsToFormcfg()` (line 80-94):** แปลง controls → form config JSON

```
input:  [{databind:"name", label:"ชื่อ-นามสกุล"}, ...]
output: {colnumbers:6, controls: [{key:"name", label:"ชื่อ-นามสกุล", rowno:1, colspan:6}]}
```

#### Parent รับแล้วทำอะไร?

`FormBuilder.jsx:190-215` — `handleTemplateCreate()` หรือ `handleTemplateUpdate()`

```
1. createSchema(name, json)                          → save schema ลง DB
2. generateDefaultView(json) → createView(...)       → auto-gen view config ลง DB
3. formcfg → createFormcfg(...)                      → save form config ลง DB
4. reloadSchemas()                                   → refresh UI
```

**ทำไม `generateDefaultView()` ต้อง auto-gen?**
เพราะ ControlDesignerModal ให้ User กำหนดแค่ "มี field อะไร" กับ "ฟอร์มหน้าตายังไง" — ส่วน "ตารางโชว์ยังไง" ระบบ gen ให้อัตโนมัติจาก schema (ใช้ key เป็น header, width: auto ทุก column)

---

## 5. Databind สรุป — เกิดที่ไหน ไหลยังไง

```
User พิมพ์ databind ใน ControlDesignerModal
  ↓
controlsToSchema()    → data_schema.json  → key ของ object
controlsToFormcfg()   → form.json_form_config → controls[].key
generateDefaultView() → view.json_table_config → columns[].key
  ↓
Save ลง DB (3 tables)
  ↓
User กดเลือก schema
  ↓
buildCrudConfig()
  schemaToColumnsConfig() → columns[].key       → table column databind
  schemaToFormConfig()    → controls[].databind  → form field databind
  ↓
CRUDControl render
  TableviewControl: rowData[column.key]           → แสดงค่าใน cell
  FormControl:      formData[control.databind]    → อ่าน/เขียนค่าใน form field
```

**ตัวอย่างจริง:**
```
User พิมพ์ databind = "name"
  → schema: {name: {type:"string"}}
  → view:   columns[0].key = "name" → table header "name"
  → form:   controls[0].key = "name" → databind = "name"
  → data:   {name: "สมชาย"} → table cell แสดง "สมชาย"
  → add form: textbox databind="name" → user กรอก → formData.name = "ค่าใหม่"
```

---

## 6. Service Layer — API vs localStorage

**โค้ด:** `schemaService.js`

```
schemaService.js ใช้ strategy pattern:
  ├── initService() เช็ค backend → เลือก strategy
  ├── delegate(name) สร้าง function ที่เรียก strategy[name]
  └── export ทุก function: getSchemas, createSchema, ...

ทั้ง apiSchemaService + mockSchemaService implement interface เดียวกัน:
  getSchemas, createSchema, updateSchema, deleteSchema,
  getViewsBySchema, createView, updateView,
  getFormcfgsBySchema, createFormcfg, updateFormcfg,
  getFormDataBySchema, createFormData, updateFormData, deleteFormData
```

**ทำไมถึงออกแบบแบบนี้?**
เพราะ component layer (FormBuilder, TemplateManager) ไม่ต้องรู้ว่าข้อมูลมาจากไหน — แค่เรียก `getSchemas()` ได้เลย ไม่ว่าจะเป็น API หรือ localStorage

---

## 7. refreshKey pattern — ทำไมไม่ fetch ตรงๆ?

ทุกครั้งที่ add/edit/delete สำเร็จ จะทำ `setRefreshKey(k => k + 1)` แทนที่จะเรียก fetch เอง

```
setRefreshKey(k+1)
  → useEffect [activeSchema, refreshKey] fire
  → Promise.all([getViews, getFormcfgs, getFormData])
  → setSchemaData(...)
  → useMemo → buildCrudConfig → re-render
```

**ทำไมถึงใช้ pattern นี้?**
เพราะ data ต้อง reload ทั้ง 3 tables พร้อมกัน (view + formcfg + data) — ถ้า fetch ทีละตัวจะ render กลางๆ ได้ state ไม่ consistent ใช้ refreshKey ทำให้ useEffect เดียว fetch ทุกอย่างพร้อมกัน

---

## 8. Quick Reference — อยากแก้อะไร ดูไฟล์ไหน?

| อยากแก้ | ดูไฟล์ | บรรทัดประมาณ |
|---------|--------|-------------|
| เพิ่ม control type ใหม่ (เช่น Textarea) | `ControlDesignerModal.jsx` | line 5-13 `CONTROL_TYPES` + line 15-23 `CONTROL_TO_FIELD_TYPE` |
| แก้ mapping type → control | `schemaTransform.js` | line 9-19 `fieldTypeToControlType()` |
| แก้ default view ที่ auto-gen | `schemaTransform.js` | line 109-119 `generateDefaultView()` |
| แก้ default form layout ที่ auto-gen | `schemaTransform.js` | line 124-136 `generateDefaultFormcfg()` |
| แก้ CRUD labels (ภาษาไทย) | `crud/constants.js` | `DEFAULT_LABELS` object |
| แก้ sidebar layout | `FormBuilder.jsx` + `FormBuilder.css` | jsx line 231-271, css `.fb-sidebar` |
| แก้ toolbar buttons | `FormBuilder.jsx` + `FormBuilder.css` | jsx line 288-330, css `.fb-mode-btn` |
| แก้ demo data | `mockSchemaService.js` | line 203-267 `seedDemoData()` |
| เพิ่ม API endpoint ใหม่ | `apiSchemaService.js` + `schemaService.js` | เพิ่ม function + delegate |

---

## 9. คำ/Pattern ที่อาจสงสัย

### สำหรับ Junior Developer

#### `useMemo` กับ `useCallback` คืออะไร ทำไมต้องใช้?

```jsx
// FormBuilder.jsx:124
const crudConfig = useMemo(() => {
    return buildCrudConfig({...});
}, [activeSchema, schemaData, ...]);
```

`useMemo` = **จำผลลัพธ์ไว้** ไม่คำนวณใหม่ถ้า dependencies ไม่เปลี่ยน

ถ้าไม่ใช้ `useMemo` → ทุกครั้งที่ FormBuilder re-render (เช่น พิมพ์ search) จะเรียก `buildCrudConfig()` ใหม่ทุกครั้ง → สร้าง object ใหม่ → CRUDControl เห็นว่า config เปลี่ยน → re-render table ทั้งหมดโดยไม่จำเป็น

```jsx
// FormBuilder.jsx:101
const handleDataAdd = useCallback(async (formData) => {
    await createFormData(activeSchema.id, clean);
    setRefreshKey(k => k + 1);
}, [activeSchema]);
```

`useCallback` = **จำ function ไว้** ไม่สร้าง function ใหม่ถ้า dependencies ไม่เปลี่ยน

ใช้เพราะ `handleDataAdd` ถูกส่งเข้า `useMemo` ของ `crudConfig` — ถ้า function เปลี่ยนทุก render → `crudConfig` ก็จะถูกคำนวณใหม่ทุกครั้ง → เสีย performance

**กฎง่ายๆ:** ถ้า function/object จะส่งเป็น prop หรือ dependency ให้ component/hook อื่น → ใช้ `useCallback`/`useMemo`

---

#### `Promise.all([...])` ทำไมไม่ fetch ทีละตัว?

```jsx
// FormBuilder.jsx:52-56
const [views, formcfgs, formData] = await Promise.all([
    getViewsBySchema(activeSchema.id),
    getFormcfgsBySchema(activeSchema.id),
    getFormDataBySchema(activeSchema.id),
]);
```

`Promise.all` = **ยิง request พร้อมกัน 3 ตัว** แล้วรอจนครบ

ถ้าเขียนแบบนี้แทน:
```jsx
const views = await getViewsBySchema(id);       // รอ 100ms
const formcfgs = await getFormcfgsBySchema(id);  // รอ 100ms
const formData = await getFormDataBySchema(id);  // รอ 100ms
// รวม 300ms
```

`Promise.all` ทำให้ 3 requests วิ่งพร้อมกัน → รอแค่ตัวที่ช้าสุด (100ms แทน 300ms)

**ข้อควรระวัง:** ถ้า request ตัวใดตัวหนึ่ง fail → `Promise.all` จะ throw error ทั้งก้อน — ในโค้ดนี้ไม่มี try-catch เพราะ service layer จัดการ error ไว้แล้ว

---

#### `delegate(name)` ใน `schemaService.js` ทำอะไร?

```jsx
// schemaService.js:24-27
const delegate = (name) => (...args) => {
    const fn = strategy[name];
    return useApi ? fn(...args) : promisify(fn)(...args);
};

export const getSchemas = delegate('getSchemas');
```

อ่านแบบนี้:
1. `delegate('getSchemas')` → return function ใหม่
2. function ใหม่เมื่อถูกเรียก → ไปดู `strategy` ปัจจุบัน (api หรือ mock)
3. เรียก `strategy.getSchemas(...args)`

**ทำไมไม่เขียน if/else ธรรมดา?**
เพราะมี 16 functions ที่ต้อง delegate — ถ้าเขียน if/else ทุกตัวจะได้โค้ดซ้ำ 16 ชุด `delegate()` ทำให้เขียนบรรทัดเดียวต่อ function

**`promisify` คืออะไร?**
```jsx
const promisify = (fn) => (...args) => Promise.resolve(fn(...args));
```
mock functions return ค่าตรงๆ (synchronous) แต่ API functions return Promise — `promisify` หุ้ม sync function ให้เป็น Promise เพื่อให้ component เรียก `await` ได้ทั้ง 2 mode

---

#### `{ _formId: f.id, ...f.data }` spread operator ทำอะไร?

```jsx
// FormBuilder.jsx:61
data: formData.map(f => ({ _formId: f.id, ...f.data })),
```

DB เก็บแบบนี้:
```json
{ "id": 1, "data": {"name": "สมชาย", "age": 28} }
```

Spread ออกมาเป็น:
```json
{ "_formId": 1, "name": "สมชาย", "age": 28 }
```

- `_formId: f.id` → inject id ของ record เข้าไป (ขึ้นต้น `_` เพื่อไม่ชนกับ field ที่ user สร้าง)
- `...f.data` → กระจาย data object ออกมาเป็น flat object

**ทำไมต้อง flat?**
เพราะ CRUDControl/TableviewControl อ่านค่าจาก `rowData["name"]` ตรงๆ — ถ้า data ซ้อนอยู่ใน `rowData.data.name` จะต้องแก้ control ทุกตัว

---

#### `const { id: _id, rootid: _root, ...safeUpdates } = updates` คืออะไร?

```jsx
// mockSchemaService.js:76
const { id: _id, rootid: _root, ...safeUpdates } = updates;
items[idx] = { ...items[idx], ...safeUpdates, modify_datetime: now() };
```

= **ดึง `id` กับ `rootid` ออก** (ตั้งชื่อใหม่เป็น `_id`, `_root` แต่ไม่ได้ใช้) แล้ว**เก็บที่เหลือ**ใน `safeUpdates`

**ทำไมต้องทำ?**
เพราะ `id` กับ `rootid` เป็น PK — ห้ามให้ client แก้ ถ้า client ส่ง `{id: 999, name: "ใหม่"}` มา ต้องตัด id ออกก่อน update

ตัว `_id` ขึ้นต้น `_` เป็น convention บอกว่า "ตั้งใจไม่ใช้ค่านี้" — ถ้าไม่ตั้งชื่อ JavaScript จะ error เพราะ `id` ถูก destructure แต่ไม่ได้ใช้

---

#### `activate` flag คืออะไร ทำไมไม่ลบจริง?

```jsx
// mockSchemaService.js:86-88 (delete)
items[idx].activate = false;

// mockSchemaService.js:44 (query)
return getStore(key).filter(s => s.activate !== false);
```

= **Soft delete** — mark ว่า "ลบแล้ว" แต่ข้อมูลยังอยู่

**ทำไมไม่ลบจริง?**
1. กู้คืนได้ (ถ้าลบผิด)
2. Audit trail — ดูย้อนหลังได้ว่าเคยมีอะไร
3. ไม่ต้องจัดการ cascade delete (ลบ schema → ต้องลบ view, form, data ที่เกี่ยวข้อง)

**filter `!== false` แทน `=== true`?**
เพราะ record เก่าอาจไม่มี field `activate` เลย (undefined) → `undefined !== false` = true → แสดงปกติ ไม่พัง backward compatible

---

#### `let cancelled = false` ใน useEffect คืออะไร?

```jsx
// FormBuilder.jsx:48-66
useEffect(() => {
    let cancelled = false;
    (async () => {
        const [views, formcfgs, formData] = await Promise.all([...]);
        if (cancelled) return;      // ← ถ้า component unmount ไปแล้ว ไม่ต้อง setState
        setSchemaData({...});
    })();
    return () => { cancelled = true; };  // ← cleanup function
}, [activeSchema, refreshKey]);
```

= **Race condition guard** — ป้องกัน setState หลัง component unmount

**สถานการณ์ที่เกิด:**
1. User กด schema A → useEffect fire → fetch data ของ A (ใช้เวลา 200ms)
2. User กด schema B ทันที (ก่อน A fetch เสร็จ) → useEffect fire อีกรอบ → cleanup ของรอบ A ทำงาน → `cancelled = true`
3. Fetch ของ A กลับมา → เจอ `if (cancelled) return` → ไม่ setState ด้วย data ของ A
4. Fetch ของ B กลับมา → setState ด้วย data ของ B ถูกต้อง

ถ้าไม่มี → setState ด้วย data ของ A ทับ B → UI แสดงข้อมูลผิด schema

---

### สำหรับ Team Lead

#### ทำไม 4 tables แทนที่จะเป็น 2 (schema + data)?

**เหตุผลหลัก: Separation of Concerns**

`view` (ตารางโชว์ยังไง) กับ `form` (ฟอร์มกรอกยังไง) เป็น **presentation layer** — ไม่ใช่ส่วนหนึ่งของ data model

ตัวอย่างที่ได้ประโยชน์:
- อยากแสดง table แบบ compact (ซ่อนบาง column) → แก้ `view` ไม่ต้องแก้ schema
- อยากเรียง field ในฟอร์มใหม่ → แก้ `form` ไม่ต้องแก้ schema
- ในอนาคตอาจมีหลาย view ต่อ 1 schema (table view, card view, kanban view)

**ตอนนี้ใช้แค่ 1 view + 1 form ต่อ schema** — แต่ DB รองรับหลายตัวอยู่แล้ว (`getViewsBySchema` return array)

---

#### Strategy pattern ใน service layer — over-engineering มั้ย?

ตอนนี้มีแค่ 2 strategies (API + localStorage) — อาจดู overkill

**แต่ได้ประโยชน์จริง:**
1. Dev ไม่ต้องเปิด backend → ทดสอบ UI ได้ทันที
2. Demo ให้ลูกค้า → ไม่ต้อง setup DB
3. Test → mock service ง่าย
4. ถ้าจะเพิ่ม strategy ใหม่ (เช่น IndexedDB, Firebase) → เพิ่มไฟล์เดียว ไม่ต้องแก้ component

**trade-off:** `delegate()` + `promisify()` อาจ confuse junior ที่เพิ่งอ่าน — แต่ทุก function มี interface เหมือนกัน เข้าใจตัวเดียวก็เข้าใจหมด

---

#### `refreshKey` pattern — ทำไมไม่ใช้ state management (Redux, Zustand)?

**เหตุผล: scope เล็กพอที่ไม่ต้อง**

Form Builder มี state owner ตัวเดียว (FormBuilder.jsx) — ทุก child component ได้ data ผ่าน props ไม่มี deeply nested state passing

`refreshKey` ทำหน้าที่เหมือน "กดปุ่ม reload" สำหรับ useEffect — เรียบง่าย ไม่มี side effect ไม่ต้อง import library

**ถ้าจะ scale:**
- ถ้า Form Builder ซับซ้อนขึ้น (หลาย view, collaboration, real-time) → ควรพิจารณา Zustand หรือ context
- ถ้ามี WebSocket push update → ต้องเปลี่ยนจาก refreshKey เป็น event-driven

---

#### `_formId` injection — ทำไมไม่เก็บ id ไว้ใน data object ตั้งแต่แรก?

เพราะ `data` column ใน DB เก็บ **เฉพาะข้อมูลที่ user กรอก** — เช่น `{name:"สมชาย", age:28}`

ถ้าเอา id ใส่ใน data object:
- User อาจตั้ง field ชื่อ `id` เอง → ชนกัน
- Data ไม่ pure — มี metadata ปนกับ user data
- Export/Import ยุ่ง — ต้อง strip id ออกก่อน

`_formId` ขึ้นต้น `_` เป็น convention ว่า "นี่คือ internal field ไม่ใช่ user data" — inject ตอน query แล้ว strip ออกตอน save (`delete clean._formId`)

---

#### `genControl()` คืออะไร ทำไม table ถึง render control ได้หลายแบบ?

`TableviewControl.jsx` มี function `genControl(type, value)` ที่ map string → React component:

```
type = "textbox"  → <LabelControl />    (แสดงข้อความ)
type = "number"   → <LabelControl />    (แสดงตัวเลข)
type = "badge"    → <BadgeControl />    (แสดง true/false เป็นสี)
type = "select"   → <LabelControl />    (แสดงค่าที่เลือก)
type = "custom"   → control.render()    (render function จาก config)
```

**ทำไมต้องมี?**
เพราะ table column อาจแสดงข้อมูลต่างชนิดกัน — บาง column แสดงข้อความ บางอันแสดง badge สี บางอันมีปุ่มกด — `genControl()` เป็น factory ที่เลือก component ให้อัตโนมัติตาม type

**ถ้าอยากเพิ่ม type ใหม่ใน table:**
เพิ่ม case ใน `genControl()` ที่ `TableviewControl.jsx`

---

#### `controlsToSchema` กับ `schemaToControls` — ทำไมต้องแปลงไปแปลงกลับ?

```
User ออกแบบ → controls[] → controlsToSchema() → schema JSON → save DB
User เปิดแก้ → schema JSON → schemaToControls() → controls[] → render modal
```

**ทำไมไม่เก็บ controls[] ลง DB ตรงๆ?**
เพราะ `controls[]` เป็น UI state (มี id, options array, defaultSelect) — ไม่เหมาะเก็บใน DB

`schema JSON` เป็น **canonical format** ที่ไม่ผูกกับ UI — ใช้ validate data, auto-gen view, auto-gen form ได้ ไม่ว่า UI จะเปลี่ยนยังไง schema ยังใช้ได้

---

#### `rootid` vs `id` — ทำไมมี 2 ตัว?

```jsx
const item = {
    rootid: crypto.randomUUID(),   // UUID — ไม่เปลี่ยนตลอดชีวิต
    id: nextId(...),               // SERIAL — auto-increment ใช้เป็น FK
};
```

- `rootid` = **identity** ของ record — ไม่เปลี่ยนแม้จะมี versioning (prev_id)
- `id` = **reference number** สำหรับ FK — ง่ายกว่า UUID ตอน JOIN

**ทำไมไม่ใช้ UUID ตัวเดียว?**
เพราะ `id` (integer) ใช้เป็น FK ง่ายกว่า — index เร็ว, อ่านง่าย, ส่งใน URL สั้นกว่า UUID

**`prev_id` คืออะไร?**
สำหรับ versioning — ถ้าแก้ไข schema จะสร้าง record ใหม่ที่ `prev_id` ชี้ไปหาตัวเก่า (linked list) — ตอนนี้ยังไม่ได้ใช้ versioning แต่ DB รองรับไว้แล้ว
