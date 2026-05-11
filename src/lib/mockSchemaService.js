/**
 * mockSchemaService.js — localStorage-based CRUD สำหรับ 5 tables
 * ใช้แทน backend API ตอน dev หรือเมื่อ BE ล่ม
 * append-only versioning + tombstone soft delete
 */

const STORAGE_KEYS = {
    business: 'cakecontrol_business',
    schemas: 'cakecontrol_schemas',
    views: 'cakecontrol_views',
    forms: 'cakecontrol_forms',
    data: 'cakecontrol_data',
};

function genId() {
    return crypto.randomUUID();
}

function now() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const s = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    return Number(s);
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

function nextId(key) {
    const items = getStore(key);
    const maxId = items.reduce((max, item) => Math.max(max, item.id || 0), 0);
    return maxId + 1;
}

// ─── business ───

export function getBusinesses() {
    return getStore(STORAGE_KEYS.business).filter(b => b.activate !== false);
}

export function getBusinessById(id) {
    return getStore(STORAGE_KEYS.business).find(b => b.id === id && b.activate !== false);
}

export function createBusiness(name, icon = null) {
    const items = getStore(STORAGE_KEYS.business);
    const item = {
        rootid: genId(),
        id: nextId(STORAGE_KEYS.business),
        prev_id: null,
        name,
        icon,
        flag: 'active',
        activate: true,
        modify_datetime: now(),
    };
    items.push(item);
    setStore(STORAGE_KEYS.business, items);
    return item;
}

export function updateBusiness(rootid, updates) {
    const items = getStore(STORAGE_KEYS.business);
    const idx = items.findIndex(b => b.rootid === rootid && b.activate !== false);
    if (idx < 0) return null;
    const current = items[idx];
    items[idx] = { ...current, activate: false, modify_datetime: now() };
    const { id: _id, rootid: _r, ...safeUpdates } = updates;
    const newItem = {
        ...current,
        ...safeUpdates,
        rootid: genId(),
        id: nextId(STORAGE_KEYS.business),
        prev_id: current.id,
        activate: true,
        modify_datetime: now(),
    };
    items.push(newItem);
    setStore(STORAGE_KEYS.business, items);
    return newItem;
}

export function deleteBusiness(rootid) {
    const items = getStore(STORAGE_KEYS.business);
    const idx = items.findIndex(b => b.rootid === rootid && b.activate !== false);
    if (idx < 0) return false;
    items[idx] = { ...items[idx], activate: false, modify_datetime: now() };
    setStore(STORAGE_KEYS.business, items);
    return true;
}

// ─── data_schema ───

export function getSchemas(businessId) {
    const items = getStore(STORAGE_KEYS.schemas).filter(s => s.activate !== false);
    if (businessId) return items.filter(s => String(s.business_id) === String(businessId));
    return items;
}

export function getSchemaById(id) {
    return getStore(STORAGE_KEYS.schemas).find(s => s.id === id && s.activate !== false);
}

export function createSchema(name, json = {}, business_id = null) {
    const items = getStore(STORAGE_KEYS.schemas);
    const item = {
        rootid: genId(),
        id: nextId(STORAGE_KEYS.schemas),
        prev_id: null,
        business_id,
        name,
        json,
        flag: 'draft',
        activate: true,
        modify_datetime: now(),
    };
    items.push(item);
    setStore(STORAGE_KEYS.schemas, items);
    return item;
}

export function updateSchema(rootid, updates) {
    const items = getStore(STORAGE_KEYS.schemas);
    const idx = items.findIndex(s => s.rootid === rootid && s.activate !== false);
    if (idx < 0) return null;

    const current = items[idx];
    const oldId = current.id;
    items[idx] = { ...current, activate: false, modify_datetime: now() };

    const { id: _id, rootid: _root, ...safeUpdates } = updates;
    const newItem = {
        rootid: genId(),
        id: nextId(STORAGE_KEYS.schemas),
        prev_id: oldId,
        business_id: current.business_id,
        name: current.name,
        json: current.json,
        flag: current.flag,
        activate: true,
        modify_datetime: now(),
        ...safeUpdates,
    };
    items.push(newItem);
    setStore(STORAGE_KEYS.schemas, items);

    // Cascade FK updates in localStorage
    const cascadeFk = (storeKey, field) => {
        const children = getStore(storeKey);
        let changed = false;
        children.forEach(c => {
            if (c[field] === oldId && c.activate !== false) {
                c[field] = newItem.id;
                changed = true;
            }
        });
        if (changed) setStore(storeKey, children);
    };
    cascadeFk(STORAGE_KEYS.views, 'data_schema_id');
    cascadeFk(STORAGE_KEYS.forms, 'data_id');
    cascadeFk(STORAGE_KEYS.data, 'data_schema_id');

    return newItem;
}

export function deleteSchema(rootid) {
    const items = getStore(STORAGE_KEYS.schemas);
    const idx = items.findIndex(s => s.rootid === rootid && s.activate !== false);
    if (idx < 0) return false;

    const current = items[idx];
    items[idx] = { ...current, activate: false, modify_datetime: now() };

    items.push({
        rootid: genId(),
        id: nextId(STORAGE_KEYS.schemas),
        prev_id: current.id,
        business_id: current.business_id,
        name: current.name,
        json: current.json,
        flag: 'deleted',
        activate: false,
        modify_datetime: now(),
    });
    setStore(STORAGE_KEYS.schemas, items);
    return true;
}

// ─── view ───

export function getViewsBySchema(schemaId) {
    return getStore(STORAGE_KEYS.views).filter(v => v.data_schema_id === schemaId && v.activate !== false);
}

export function createView(schemaId, viewType, json_table_config, name = '') {
    const items = getStore(STORAGE_KEYS.views);
    const item = {
        rootid: genId(),
        id: nextId(STORAGE_KEYS.views),
        prev_id: null,
        data_schema_id: schemaId,
        view_type: viewType,
        name,
        json_table_config,
        flag: 'draft',
        activate: true,
        modify_datetime: now(),
    };
    items.push(item);
    setStore(STORAGE_KEYS.views, items);
    return item;
}

export function updateView(rootid, updates) {
    const items = getStore(STORAGE_KEYS.views);
    const idx = items.findIndex(v => v.rootid === rootid && v.activate !== false);
    if (idx < 0) return null;

    const current = items[idx];
    items[idx] = { ...current, activate: false, modify_datetime: now() };

    const { id: _id, rootid: _root, ...safeUpdates } = updates;
    const newItem = {
        rootid: genId(),
        id: nextId(STORAGE_KEYS.views),
        prev_id: current.id,
        data_schema_id: current.data_schema_id,
        view_type: current.view_type,
        name: current.name,
        json_table_config: current.json_table_config,
        flag: current.flag,
        activate: true,
        modify_datetime: now(),
        ...safeUpdates,
    };
    items.push(newItem);
    setStore(STORAGE_KEYS.views, items);
    return newItem;
}

// ─── form (config) ───

export function getFormcfgsBySchema(schemaId) {
    return getStore(STORAGE_KEYS.forms).filter(f => f.data_id === schemaId && f.activate !== false);
}

export function createFormcfg(schemaId, json_form_config, name = '') {
    const items = getStore(STORAGE_KEYS.forms);
    const item = {
        rootid: genId(),
        id: nextId(STORAGE_KEYS.forms),
        prev_id: null,
        data_id: schemaId,
        name,
        json_form_config,
        flag: 'draft',
        activate: true,
        modify_datetime: now(),
    };
    items.push(item);
    setStore(STORAGE_KEYS.forms, items);
    return item;
}

export function updateFormcfg(rootid, updates) {
    const items = getStore(STORAGE_KEYS.forms);
    const idx = items.findIndex(f => f.rootid === rootid && f.activate !== false);
    if (idx < 0) return null;

    const current = items[idx];
    items[idx] = { ...current, activate: false, modify_datetime: now() };

    const { id: _id, rootid: _root, ...safeUpdates } = updates;
    const newItem = {
        rootid: genId(),
        id: nextId(STORAGE_KEYS.forms),
        prev_id: current.id,
        data_id: current.data_id,
        name: current.name,
        json_form_config: current.json_form_config,
        flag: current.flag,
        activate: true,
        modify_datetime: now(),
        ...safeUpdates,
    };
    items.push(newItem);
    setStore(STORAGE_KEYS.forms, items);
    return newItem;
}

// ─── data (ข้อมูลจริง) ───

export function getFormDataBySchema(schemaId) {
    return getStore(STORAGE_KEYS.data).filter(f => f.data_schema_id === schemaId && f.activate !== false);
}

export function createFormData(schemaId, data) {
    const items = getStore(STORAGE_KEYS.data);
    const item = {
        rootid: genId(),
        id: nextId(STORAGE_KEYS.data),
        prev_id: null,
        data_schema_id: schemaId,
        data,
        flag: 'active',
        activate: true,
        modify_datetime: now(),
    };
    items.push(item);
    setStore(STORAGE_KEYS.data, items);
    return item;
}

export function updateFormData(rootid, data) {
    const items = getStore(STORAGE_KEYS.data);
    const idx = items.findIndex(f => f.rootid === rootid && f.activate !== false);
    if (idx < 0) return null;

    const current = items[idx];
    items[idx] = { ...current, activate: false, modify_datetime: now() };

    const newItem = {
        rootid: genId(),
        id: nextId(STORAGE_KEYS.data),
        prev_id: current.id,
        data_schema_id: current.data_schema_id,
        data,
        flag: current.flag,
        activate: true,
        modify_datetime: now(),
    };
    items.push(newItem);
    setStore(STORAGE_KEYS.data, items);
    return newItem;
}

export function deleteFormData(rootid) {
    const items = getStore(STORAGE_KEYS.data);
    const idx = items.findIndex(f => f.rootid === rootid && f.activate !== false);
    if (idx < 0) return false;

    const current = items[idx];
    items[idx] = { ...current, activate: false, modify_datetime: now() };

    items.push({
        rootid: genId(),
        id: nextId(STORAGE_KEYS.data),
        prev_id: current.id,
        data_schema_id: current.data_schema_id,
        data: current.data,
        flag: 'deleted',
        activate: false,
        modify_datetime: now(),
    });
    setStore(STORAGE_KEYS.data, items);
    return true;
}

// ─── Seed: สร้าง demo data ───

export function seedDemoData() {
    if (getBusinesses().length > 0) return;

    const b = createBusiness('Demo Business', 'DB');

    const schema1 = createSchema('พนักงาน', {
        name: { type: 'string', label: 'ชื่อ' },
        age: { type: 'number', label: 'อายุ' },
        role: { type: 'select', enum: [{label: 'Admin', value: 'Admin'}, {label: 'User', value: 'User'}], label: 'สิทธิ์' },
        email: { type: 'string', label: 'อีเมล' },
    }, b.id);

    // Initial setups for views/forms can be added here if needed
}
