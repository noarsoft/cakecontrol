/**
 * schema.js — Pure utility functions สำหรับ data_schema
 * จัดการ field definitions: { key: { type, enum?, required? } }
 */

export const FIELD_TYPES = [
    { value: 'string', label: 'ข้อความ (String)', icon: '✏️' },
    { value: 'number', label: 'ตัวเลข (Number)', icon: '🔢' },
    { value: 'boolean', label: 'ใช่/ไม่ใช่ (Boolean)', icon: '🔘' },
    { value: 'date', label: 'วันที่ (Date)', icon: '📅' },
    { value: 'email', label: 'อีเมล (Email)', icon: '📧' },
    { value: 'file', label: 'ไฟล์ (File)', icon: '📁' },
    { value: 'select', label: 'ตัวเลือก (Select)', icon: '📋' },
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
    }
    return errors;
}
