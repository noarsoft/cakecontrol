/**
 * mockSchemaService.js — localStorage-based CRUD สำหรับ 4 tables
 * ใช้แทน backend API ตอน dev
 */

const STORAGE_KEYS = {
    schemas: 'cakecontrol_schemas',
    views: 'cakecontrol_views',
    formcfgs: 'cakecontrol_formcfgs',
    forms: 'cakecontrol_forms',
};

function genId() {
    return crypto.randomUUID();
}

function now() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function getStore(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
        return [];
    }
}

function setStore(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Auto-increment ID counter per table
function nextId(key) {
    const items = getStore(key);
    const maxId = items.reduce((max, item) => Math.max(max, item.id || 0), 0);
    return maxId + 1;
}

// ─── data_schema ───

export function getSchemas() {
    return getStore(STORAGE_KEYS.schemas).filter(s => s.activate !== false);
}

export function getSchemaById(id) {
    return getStore(STORAGE_KEYS.schemas).find(s => s.id === id && s.activate !== false);
}

export function getSchemaByRootId(rootId) {
    return getStore(STORAGE_KEYS.schemas).find(s => s.root_id === rootId && s.activate !== false);
}

export function createSchema(name, json = {}) {
    const items = getStore(STORAGE_KEYS.schemas);
    const item = {
        root_id: genId(),
        id: nextId(STORAGE_KEYS.schemas),
        previous_id: null,
        name,
        json,
        flag: 'draft',
        activate: true,
        modified_date_time: now(),
    };
    items.push(item);
    setStore(STORAGE_KEYS.schemas, items);
    return item;
}

export function updateSchema(id, updates) {
    const items = getStore(STORAGE_KEYS.schemas);
    const idx = items.findIndex(s => s.id === id);
    if (idx < 0) return null;
    const { id: _id, root_id: _root, ...safeUpdates } = updates;
    items[idx] = { ...items[idx], ...safeUpdates, modified_date_time: now() };
    setStore(STORAGE_KEYS.schemas, items);
    return items[idx];
}

export function deleteSchema(id) {
    const items = getStore(STORAGE_KEYS.schemas);
    const idx = items.findIndex(s => s.id === id);
    if (idx < 0) return false;
    items[idx].activate = false;
    setStore(STORAGE_KEYS.schemas, items);
    return true;
}

// ─── data_view ───

export function getViewsBySchema(schemaId) {
    return getStore(STORAGE_KEYS.views).filter(v => v.fk_data_schema === schemaId && v.activate !== false);
}

export function createView(schemaId, viewType, json, name = '') {
    const items = getStore(STORAGE_KEYS.views);
    const item = {
        root_id: genId(),
        id: nextId(STORAGE_KEYS.views),
        previous_id: null,
        fk_data_schema: schemaId,
        view_type: viewType,
        name,
        json,
        flag: 'draft',
        activate: true,
        modified_date_time: now(),
    };
    items.push(item);
    setStore(STORAGE_KEYS.views, items);
    return item;
}

export function updateView(id, updates) {
    const items = getStore(STORAGE_KEYS.views);
    const idx = items.findIndex(v => v.id === id);
    if (idx < 0) return null;
    const { id: _id, root_id: _root, ...safeUpdates } = updates;
    items[idx] = { ...items[idx], ...safeUpdates, modified_date_time: now() };
    setStore(STORAGE_KEYS.views, items);
    return items[idx];
}

// ─── data_formcfg ───

export function getFormcfgsBySchema(schemaId) {
    return getStore(STORAGE_KEYS.formcfgs).filter(f => f.fk_data_schema === schemaId && f.activate !== false);
}

export function createFormcfg(schemaId, json, name = '') {
    const items = getStore(STORAGE_KEYS.formcfgs);
    const item = {
        root_id: genId(),
        id: nextId(STORAGE_KEYS.formcfgs),
        previous_id: null,
        fk_data_schema: schemaId,
        name,
        json,
        flag: 'draft',
        activate: true,
        modified_date_time: now(),
    };
    items.push(item);
    setStore(STORAGE_KEYS.formcfgs, items);
    return item;
}

export function updateFormcfg(id, updates) {
    const items = getStore(STORAGE_KEYS.formcfgs);
    const idx = items.findIndex(f => f.id === id);
    if (idx < 0) return null;
    const { id: _id, root_id: _root, ...safeUpdates } = updates;
    items[idx] = { ...items[idx], ...safeUpdates, modified_date_time: now() };
    setStore(STORAGE_KEYS.formcfgs, items);
    return items[idx];
}

// ─── data_form (ข้อมูลจริง) ───

export function getFormDataBySchema(schemaId) {
    return getStore(STORAGE_KEYS.forms).filter(f => f.fk_data_schema === schemaId && f.activate !== false);
}

export function createFormData(schemaId, data) {
    const items = getStore(STORAGE_KEYS.forms);
    const item = {
        root_id: genId(),
        id: nextId(STORAGE_KEYS.forms),
        previous_id: null,
        fk_data_schema: schemaId,
        data,
        flag: 'active',
        activate: true,
        modified_date_time: now(),
    };
    items.push(item);
    setStore(STORAGE_KEYS.forms, items);
    return item;
}

export function updateFormData(id, data) {
    const items = getStore(STORAGE_KEYS.forms);
    const idx = items.findIndex(f => f.id === id);
    if (idx < 0) return null;
    items[idx] = { ...items[idx], data, modified_date_time: now() };
    setStore(STORAGE_KEYS.forms, items);
    return items[idx];
}

export function deleteFormData(id) {
    const items = getStore(STORAGE_KEYS.forms);
    const idx = items.findIndex(f => f.id === id);
    if (idx < 0) return false;
    items[idx].activate = false;
    setStore(STORAGE_KEYS.forms, items);
    return true;
}

// ─── Seed: สร้าง demo data ───

export function seedDemoData() {
    if (getSchemas().length > 0) return; // มี data แล้วไม่ seed

    // Schema: พนักงาน
    const schema1 = createSchema('พนักงาน', {
        name: { type: 'string' },
        age: { type: 'number' },
        role: { type: 'select', enum: ['Admin', 'User', 'Guest'] },
        email: { type: 'email' },
        is_active: { type: 'boolean' },
    });

    // View สำหรับ พนักงาน
    createView(schema1.id, 'table', {
        columns: [
            { key: 'name', header: 'ชื่อ', width: 'auto', sortable: true },
            { key: 'age', header: 'อายุ', width: '80', sortable: true },
            { key: 'role', header: 'สิทธิ์', width: '100', sortable: true },
            { key: 'email', header: 'อีเมล', width: 'auto', sortable: true },
            { key: 'is_active', header: 'สถานะ', width: '80', sortable: false, type: 'badge' },
        ],
    }, 'ตารางพนักงาน');

    // Formcfg สำหรับ พนักงาน
    createFormcfg(schema1.id, {
        colnumbers: 6,
        controls: [
            { key: 'name', label: 'ชื่อ-นามสกุล', colno: 1, rowno: 1, colspan: 6, placeholder: 'กรอกชื่อ' },
            { key: 'email', label: 'อีเมล', colno: 1, rowno: 2, colspan: 6, placeholder: 'กรอกอีเมล' },
            { key: 'age', label: 'อายุ', colno: 1, rowno: 3, colspan: 3 },
            { key: 'role', label: 'สิทธิ์', colno: 4, rowno: 3, colspan: 3 },
            { key: 'is_active', label: 'สถานะใช้งาน', colno: 1, rowno: 4, colspan: 3 },
        ],
    }, 'ฟอร์มพนักงาน');

    // Demo data
    createFormData(schema1.id, { name: 'สมชาย ใจดี', age: 28, role: 'Admin', email: 'somchai@example.com', is_active: true });
    createFormData(schema1.id, { name: 'สมหญิง รักงาน', age: 25, role: 'User', email: 'somying@example.com', is_active: true });
    createFormData(schema1.id, { name: 'สมศักดิ์ มานะ', age: 32, role: 'User', email: 'somsak@example.com', is_active: false });

    // Schema: สินค้า
    const schema2 = createSchema('สินค้า', {
        product_name: { type: 'string' },
        price: { type: 'number' },
        category: { type: 'select', enum: ['อาหาร', 'เครื่องดื่ม', 'ของใช้', 'อื่นๆ'] },
        in_stock: { type: 'boolean' },
    });

    createView(schema2.id, 'table', {
        columns: [
            { key: 'product_name', header: 'ชื่อสินค้า', width: 'auto', sortable: true },
            { key: 'price', header: 'ราคา', width: '100', sortable: true },
            { key: 'category', header: 'หมวดหมู่', width: '120', sortable: true },
            { key: 'in_stock', header: 'มีสต็อก', width: '80', sortable: false, type: 'badge' },
        ],
    }, 'ตารางสินค้า');

    createFormcfg(schema2.id, {
        colnumbers: 6,
        controls: [
            { key: 'product_name', label: 'ชื่อสินค้า', colno: 1, rowno: 1, colspan: 6, placeholder: 'กรอกชื่อสินค้า' },
            { key: 'price', label: 'ราคา (บาท)', colno: 1, rowno: 2, colspan: 3 },
            { key: 'category', label: 'หมวดหมู่', colno: 4, rowno: 2, colspan: 3 },
            { key: 'in_stock', label: 'มีสต็อก', colno: 1, rowno: 3, colspan: 3 },
        ],
    }, 'ฟอร์มสินค้า');

    createFormData(schema2.id, { product_name: 'ข้าวผัด', price: 50, category: 'อาหาร', in_stock: true });
    createFormData(schema2.id, { product_name: 'น้ำส้ม', price: 25, category: 'เครื่องดื่ม', in_stock: true });
}
