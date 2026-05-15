/**
 * schema.js — Pure utility functions สำหรับ data_schema
 * จัดการ field definitions: { key: { type, enum?, required? } }
 */

export const FIELD_TYPES = [
    // --- Input ---
    { value: 'string', label: 'Textbox Control', icon: '✏️' },
    { value: 'number', label: 'Number Control', icon: '🔢' },
    { value: 'select', label: 'Select Control', icon: '📋' },
    { value: 'dropdown', label: 'Dropdown Control', icon: '⬇️' },
    { value: 'boolean', label: 'Checkbox Control', icon: '☑️' },
    { value: 'toggle', label: 'Toggle Control', icon: '🔘' },
    { value: 'date', label: 'Date Control', icon: '📅' },
    { value: 'datepicker', label: 'DatePicker', icon: '📅' },
    { value: 'slider', label: 'Slider Control', icon: '🎚️' },
    { value: 'rating', label: 'Rating Control', icon: '⭐' },
    { value: 'fileupload', label: 'File Upload', icon: '📁' },
    // --- Layout ---
    { value: 'pagebreak', label: 'Page Break', icon: '📄' },
    // --- Display ---
    { value: 'label', label: 'Label Control', icon: '🏷️' },
    { value: 'link', label: 'Link Control', icon: '🔗' },
    { value: 'image', label: 'Image Control', icon: '🖼️' },
    { value: 'badge', label: 'Badge Control', icon: '🏅' },
    { value: 'icon', label: 'Icon Control', icon: '⭐' },
    { value: 'progress', label: 'Progress Bar', icon: '📊' },
    { value: 'qrcode', label: 'QR Code', icon: '📱' },
    { value: 'calendargrid', label: 'Calendar Grid', icon: '📆' },
    { value: 'button', label: 'Button Control', icon: '🔲' },
    { value: 'buttongroup', label: 'Button Group', icon: '🔲' },
    // --- Layout ---
    { value: 'form', label: 'Form Control', icon: '📝' },
    { value: 'table', label: 'Table Control', icon: '📊' },
    { value: 'grid', label: 'Grid Control', icon: '▦' },
    { value: 'card', label: 'Card Control', icon: '🃏' },
    { value: 'accordion', label: 'Accordion Control', icon: '📂' },
    { value: 'tabs', label: 'Tab Control', icon: '📑' },
    { value: 'tree', label: 'Tree Control', icon: '🌳' },
    { value: 'menu', label: 'Menu Control', icon: '📋' },
    { value: 'crud', label: 'CRUD Control', icon: '🗂️' },
    { value: 'modal', label: 'Modal Control', icon: '🪟' },
    { value: 'pagination', label: 'Pagination', icon: '📄' },
    // --- Modal ---
    { value: 'alertmodal', label: 'Alert Modal', icon: '🚭' },
    { value: 'confirmmodal', label: 'Confirm Modal', icon: '✅' },
    // --- Charts ---
    { value: 'chart', label: 'Chart', icon: '📈' },
    { value: 'chartsbar', label: 'Bar Chart JS', icon: '📊' },
    { value: 'chartsline', label: 'Line Chart JS', icon: '📈' },
    { value: 'chartspie', label: 'Pie Chart JS', icon: '🥧' },
    { value: 'chartsdoughnut', label: 'Doughnut Chart JS', icon: '🍩' },
    { value: 'chartsradar', label: 'Radar Chart JS', icon: '🎯' },
    { value: 'chartsarea', label: 'Area Chart JS', icon: '📊' },
    { value: 'chartsbubble', label: 'Bubble Chart JS', icon: '🫧' },
    { value: 'chartsmixed', label: 'Mixed Chart JS', icon: '📊' },
];

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
            result[newKey] = { ...v, ...fieldDef };
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

export function getFieldKeys(schemaJson) {
    return Object.keys(schemaJson || {});
}

export function getFieldEntries(schemaJson) {
    return Object.entries(schemaJson || {}).sort(([keyA, a], [keyB, b]) => {
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
    const hasOrder = Object.values(schemaJson).some(f => f._order);
    if (hasOrder) return schemaJson;
    const result = {};
    Object.entries(schemaJson).forEach(([key, def], idx) => {
        result[key] = { ...def, _order: idx + 1 };
    });
    return result;
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
