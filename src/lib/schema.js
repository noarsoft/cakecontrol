/**
 * schema.js — Pure utility functions สำหรับ data_schema
 * จัดการ field definitions: { key: { type, enum?, required? } }
 */

export const FIELD_TYPES = [
    // --- Input ---
    { value: 'string', label: 'ข้อความ (Textbox)', icon: '✏️' },
    { value: 'number', label: 'ตัวเลข (Number)', icon: '🔢' },
    { value: 'password', label: 'รหัสผ่าน (Password)', icon: '🔒' },
    { value: 'email', label: 'อีเมล (Email)', icon: '📧' },
    { value: 'select', label: 'ตัวเลือก (Select)', icon: '📋' },
    { value: 'boolean', label: 'ใช่/ไม่ใช่ (Checkbox)', icon: '🔘' },
    { value: 'toggle', label: 'เปิด/ปิด (Toggle)', icon: '🔀' },
    { value: 'date', label: 'วันที่ (Date)', icon: '📅' },
    { value: 'datepicker', label: 'เลือกวันที่ (DatePicker)', icon: '📆' },
    { value: 'slider', label: 'ตัวเลื่อน (Slider)', icon: '🎚️' },
    { value: 'rating', label: 'ให้คะแนน (Rating)', icon: '⭐' },
    { value: 'file', label: 'ไฟล์ (File)', icon: '📁' },
    { value: 'searchbox', label: 'ค้นหา (SearchBox)', icon: '🔍' },
    { value: 'multipleupload', label: 'อัปโหลดหลายไฟล์ (MultiUpload)', icon: '📤' },
    // --- Display ---
    { value: 'label', label: 'ข้อความแสดง (Label)', icon: '🏷️' },
    { value: 'link', label: 'ลิงก์ (Link)', icon: '🔗' },
    { value: 'image', label: 'รูปภาพ (Image)', icon: '🖼️' },
    { value: 'badge', label: 'ป้ายสถานะ (Badge)', icon: '🏅' },
    { value: 'icon', label: 'ไอคอน (Icon)', icon: '🎨' },
    { value: 'progress', label: 'แถบความคืบหน้า (Progress)', icon: '📊' },
    { value: 'qrcode', label: 'คิวอาร์โค้ด (QR Code)', icon: '📱' },
    { value: 'calendar', label: 'ปฏิทิน (Calendar)', icon: '🗓️' },
    { value: 'calendargrid', label: 'ตารางปฏิทิน (CalendarGrid)', icon: '📅' },
    { value: 'button', label: 'ปุ่มกด (Button)', icon: '🖱️' },
    { value: 'buttongroup', label: 'กลุ่มปุ่ม (ButtonGroup)', icon: '🔲' },
    // --- Layout ---
    { value: 'accordion', label: 'พับเก็บ (Accordion)', icon: '📂' },
    { value: 'tab', label: 'แท็บ (Tab)', icon: '📑' },
    { value: 'card', label: 'การ์ด (Card)', icon: '🃏' },
    { value: 'tree', label: 'โครงสร้างต้นไม้ (Tree)', icon: '🌳' },
    { value: 'menu', label: 'เมนู (Menu)', icon: '☰' },
    { value: 'gridview', label: 'ตารางกริด (GridView)', icon: '⊞' },
    { value: 'tableview', label: 'ตาราง (TableView)', icon: '📋' },
    { value: 'form', label: 'ฟอร์ม (Form)', icon: '📝' },
    { value: 'crud', label: 'จัดการข้อมูล (CRUD)', icon: '🗃️' },
    { value: 'modal', label: 'ป๊อปอัป (Modal)', icon: '🪟' },
    { value: 'pagination', label: 'แบ่งหน้า (Pagination)', icon: '📄' },
    // --- Charts ---
    { value: 'chart', label: 'กราฟ (Chart)', icon: '📈' },
    { value: 'barchart', label: 'กราฟแท่ง (Bar Chart)', icon: '📊' },
    { value: 'linechart', label: 'กราฟเส้น (Line Chart)', icon: '📉' },
    { value: 'piechart', label: 'กราฟวงกลม (Pie Chart)', icon: '🥧' },
    { value: 'doughnutchart', label: 'กราฟโดนัท (Doughnut)', icon: '🍩' },
    { value: 'radarchart', label: 'กราฟเรดาร์ (Radar)', icon: '🕸️' },
    { value: 'areachart', label: 'กราฟพื้นที่ (Area)', icon: '🏔️' },
    { value: 'bubblechart', label: 'กราฟฟองสบู่ (Bubble)', icon: '🫧' },
    { value: 'mixedchart', label: 'กราฟผสม (Mixed)', icon: '📊' },
];

export function createEmptySchema(name = 'ฟอร์มใหม่') {
    return {
        name,
        json: {},
    };
}

export function addField(schemaJson, key, type = 'string', options = {}) {
    return {
        ...schemaJson,
        [key]: { type, ...options },
    };
}

export function removeField(schemaJson, key) {
    const next = { ...schemaJson };
    delete next[key];
    return next;
}

export function updateField(schemaJson, oldKey, newKey, fieldDef) {
    const entries = Object.entries(schemaJson);
    const result = {};
    for (const [k, v] of entries) {
        if (k === oldKey) {
            result[newKey] = { ...v, ...fieldDef };
        } else {
            result[k] = v;
        }
    }
    return result;
}

export function moveField(schemaJson, key, direction) {
    const entries = Object.entries(schemaJson);
    const idx = entries.findIndex(([k]) => k === key);
    if (idx < 0) return schemaJson;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= entries.length) return schemaJson;
    const swapped = [...entries];
    [swapped[idx], swapped[newIdx]] = [swapped[newIdx], swapped[idx]];
    return Object.fromEntries(swapped);
}

export function getFieldKeys(schemaJson) {
    return Object.keys(schemaJson || {});
}

export function getFieldEntries(schemaJson) {
    return Object.entries(schemaJson || {});
}

export function validateSchema(schemaJson) {
    const errors = [];
    const keys = Object.keys(schemaJson || {});
    if (keys.length === 0) {
        errors.push('ต้องมีอย่างน้อย 1 field');
    }
    const validTypes = FIELD_TYPES.map(t => t.value);
    for (const [key, def] of Object.entries(schemaJson || {})) {
        if (!key.trim()) errors.push('field key ต้องไม่ว่าง');
        if (!validTypes.includes(def.type)) errors.push(`field "${key}": type "${def.type}" ไม่ถูกต้อง`);
        if (def.type === 'select' && (!def.enum || def.enum.length === 0)) {
            errors.push(`field "${key}": select ต้องมี options`);
        }
        if (def.type === 'select' && def.enum) {
            for (const item of def.enum) {
                if (typeof item === 'object' && (item.label == null || item.value == null)) {
                    errors.push(`field "${key}": enum object ต้องมี label และ value`);
                    break;
                }
            }
        }
    }
    return errors;
}
