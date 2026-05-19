/**
 * schema.js — Pure utility functions สำหรับ data_schema
 * จัดการ field definitions: { key: { type, enum?, required? } }
 */

export const FIELD_TYPES = [
    // --- Input ---
    { value: 'string', label: 'Textbox Control', icon: '✏️', enabled: true },
    { value: 'number', label: 'Number Control', icon: '🔢', enabled: true },
    { value: 'select', label: 'Select Control', icon: '📋', enabled: true },
    { value: 'dropdown', label: 'Dropdown Control', icon: '⬇️', enabled: true },
    { value: 'boolean', label: 'Checkbox Control', icon: '☑️', enabled: true },
    { value: 'toggle', label: 'Toggle Control', icon: '🔘', enabled: true },
    { value: 'date', label: 'Date Control', icon: '📅', enabled: true },
    { value: 'datepicker', label: 'DatePicker', icon: '📅', enabled: false },
    { value: 'slider', label: 'Slider Control', icon: '🎚️', enabled: true },
    { value: 'rating', label: 'Rating Control', icon: '⭐', enabled: true },
    { value: 'fileupload', label: 'File Upload', icon: '📁', enabled: true },
    // --- Layout ---
    { value: 'pagebreak', label: 'Page Break', icon: '📄', enabled: true },
    // --- Display ---
    { value: 'label', label: 'Label Control', icon: '🏷️', enabled: true },
    { value: 'link', label: 'Link Control', icon: '🔗', enabled: true },
    { value: 'image', label: 'Image Control', icon: '🖼️', enabled: true },
    { value: 'badge', label: 'Badge Control', icon: '🏅', enabled: true },
    { value: 'icon', label: 'Icon Control', icon: '⭐', enabled: true },
    { value: 'progress', label: 'Progress Bar', icon: '📊', enabled: true },
    { value: 'qrcode', label: 'QR Code', icon: '📱', enabled: true },
    { value: 'calendargrid', label: 'Calendar Grid', icon: '📆', enabled: true },
    { value: 'button', label: 'Button Control', icon: '🔲', enabled: true },
    { value: 'buttongroup', label: 'Button Group', icon: '🔲', enabled: true },
    // --- Layout ---
    { value: 'form', label: 'Form Control', icon: '📝', enabled: true },
    { value: 'table', label: 'Table Control', icon: '📊', enabled: true },
    { value: 'grid', label: 'Grid Control', icon: '▦', enabled: true },
    { value: 'card', label: 'Card Control', icon: '🃏', enabled: true },
    { value: 'accordion', label: 'Accordion Control', icon: '📂', enabled: true },
    { value: 'tabs', label: 'Tab Control', icon: '📑', enabled: true },
    { value: 'tree', label: 'Tree Control', icon: '🌳', enabled: true },
    { value: 'menu', label: 'Menu Control', icon: '📋', enabled: true },
    { value: 'crud', label: 'CRUD Control', icon: '🗂️', enabled: true },
    { value: 'modal', label: 'Modal Control', icon: '🪟', enabled: true },
    { value: 'pagination', label: 'Pagination', icon: '📄', enabled: true },
    // --- Modal ---
    { value: 'alertmodal', label: 'Alert Modal', icon: '🚭', enabled: true },
    { value: 'confirmmodal', label: 'Confirm Modal', icon: '✅', enabled: true },
    // --- Charts ---
    { value: 'chart', label: 'Chart', icon: '📈', enabled: true },
    { value: 'chartsbar', label: 'Bar Chart JS', icon: '📊', enabled: true },
    { value: 'chartsline', label: 'Line Chart JS', icon: '📈', enabled: true },
    { value: 'chartspie', label: 'Pie Chart JS', icon: '🥧', enabled: true },
    { value: 'chartsdoughnut', label: 'Doughnut Chart JS', icon: '🍩', enabled: true },
    { value: 'chartsradar', label: 'Radar Chart JS', icon: '🎯', enabled: true },
    { value: 'chartsarea', label: 'Area Chart JS', icon: '📊', enabled: true },
    { value: 'chartsbubble', label: 'Bubble Chart JS', icon: '🫧', enabled: true },
    { value: 'chartsmixed', label: 'Mixed Chart JS', icon: '📊', enabled: true },
];

export const ENABLED_FIELD_TYPES = FIELD_TYPES.filter(t => t.enabled);

export function createEmptySchema(name = 'ฟอร์มใหม่') {
    return {
        name,
        json: {},
    };
}

export function addField(schemaJson, key, type = 'string', options = {}) {
    const maxOrder = Object.values(schemaJson || {}).reduce((max, f) => Math.max(max, f._order || 0), 0);
    return {
        ...schemaJson,
        [key]: { type, _order: maxOrder + 1, ...options },
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
            const merged = { ...v, ...fieldDef };
            const cleaned = {};
            for (const [mk, mv] of Object.entries(merged)) {
                if (mv !== undefined) cleaned[mk] = mv;
            }
            result[newKey] = cleaned;
        } else {
            result[k] = v;
        }
    }
    return result;
}

export function moveField(schemaJson, key, direction) {
    const sorted = getFieldEntries(schemaJson);
    const idx = sorted.findIndex(([k]) => k === key);
    if (idx < 0) return schemaJson;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= sorted.length) return schemaJson;
    const orderA = sorted[idx][1]._order || 0;
    const orderB = sorted[newIdx][1]._order || 0;
    return {
        ...schemaJson,
        [sorted[idx][0]]: { ...sorted[idx][1], _order: orderB },
        [sorted[newIdx][0]]: { ...sorted[newIdx][1], _order: orderA },
    };
}

export function reorderField(schemaJson, fromIndex, toIndex) {
    const sorted = getFieldEntries(schemaJson);
    if (fromIndex < 0 || fromIndex >= sorted.length || toIndex < 0 || toIndex >= sorted.length) return schemaJson;
    if (fromIndex === toIndex) return schemaJson;
    const [moved] = sorted.splice(fromIndex, 1);
    sorted.splice(toIndex, 0, moved);
    const result = { ...schemaJson };
    sorted.forEach(([key, def], i) => {
        result[key] = { ...def, _order: i + 1 };
    });
    return result;
}

function isMetaKey(key, val) {
    return key.startsWith('_') && (typeof val !== 'object' || val === null || !val.type);
}

export function getFieldKeys(schemaJson) {
    return Object.entries(schemaJson || {}).filter(([k, v]) => !isMetaKey(k, v)).map(([k]) => k);
}

export function getFieldEntries(schemaJson) {
    return Object.entries(schemaJson || {}).filter(([k, v]) => !isMetaKey(k, v)).sort(([keyA, a], [keyB, b]) => {
        const orderDiff = (a._order || 0) - (b._order || 0);
        if (orderDiff !== 0) return orderDiff;
        const numA = parseInt(keyA.match(/(\d+)/)?.[1] || '0', 10);
        const numB = parseInt(keyB.match(/(\d+)/)?.[1] || '0', 10);
        if (numA !== numB) return numA - numB;
        return keyA.localeCompare(keyB);
    });
}

export function normalizeOrder(schemaJson) {
    if (!schemaJson) return schemaJson;
    const hasOrder = Object.values(schemaJson).some(f => f && typeof f === 'object' && f._order);
    if (hasOrder) return schemaJson;
    const result = {};
    let idx = 0;
    for (const [key, def] of Object.entries(schemaJson)) {
        if (key.startsWith('_')) { result[key] = def; continue; }
        result[key] = { ...def, _order: ++idx };
    }
    return result;
}

export function validateSchema(schemaJson) {
    const errors = [];
    const entries = getFieldEntries(schemaJson);
    if (entries.length === 0) {
        errors.push('ต้องมีอย่างน้อย 1 field');
    }
    const validTypes = FIELD_TYPES.map(t => t.value);
    for (const [key, def] of entries) {
        if (!key.trim()) errors.push('field key ต้องไม่ว่าง');
        if (def.type !== 'pagebreak' && !def.label?.trim()) errors.push(`field "${key}": กรุณาระบุ Label`);
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
