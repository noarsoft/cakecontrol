/**
 * schemaTransform.js — Bridge schema → existing control configs
 * แปลง data_schema, data_view, data_formcfg → CRUDControl / FormControl config
 */

/**
 * แปลง schema field def → control type ที่ genControl รู้จัก
 * ใช้ controlType ตรง ๆ ถ้ามี, fallback ไปเดาจาก type
 */
const FIELD_TYPE_FALLBACK = {
    string: 'textbox',
    number: 'number',
    boolean: 'toggle',
    date: 'date',
    email: 'textbox',
    file: 'textbox',
    select: 'select',
};

function fieldTypeToControlType(fieldType, fieldDef) {
    if (fieldDef?.controlType) return fieldDef.controlType;
    return FIELD_TYPE_FALLBACK[fieldType] || 'textbox';
}

/**
 * สร้าง columns config สำหรับ CRUDControl จาก data_view JSON
 * ถ้าไม่มี data_view ก็ auto-generate จาก schema
 */
export function schemaToColumnsConfig(schemaJson, viewJson = null) {
    if (viewJson && viewJson.columns && viewJson.columns.length > 0) {
        return viewJson.columns;
    }
    return Object.entries(schemaJson || {}).map(([key, def]) => ({
        key,
        header: def.label || key,
        sortable: true,
        width: 'auto',
        type: def.controlType === 'badge' ? 'badge'
            : def.controlType === 'toggle' ? 'badge'
            : def.type === 'boolean' ? 'badge'
            : undefined,
    }));
}

/**
 * สร้าง formConfig (controls array) สำหรับ FormControl จาก data_formcfg JSON
 * ถ้าไม่มี formcfg ก็ auto-generate จาก schema
 */
export function schemaToFormConfig(schemaJson, formcfgJson = null) {
    const colnumbers = formcfgJson?.colnumbers || 6;

    if (formcfgJson && formcfgJson.controls && formcfgJson.controls.length > 0) {
        return {
            colnumbers,
            controls: formcfgJson.controls.map(ctrl => {
                const fieldDef = schemaJson[ctrl.key] || { type: 'string' };
                return {
                    type: fieldTypeToControlType(fieldDef.type, fieldDef),
                    databind: ctrl.key,
                    label: ctrl.label || ctrl.key,
                    colno: ctrl.colno || 1,
                    rowno: ctrl.rowno,
                    colspan: ctrl.colspan || colnumbers,
                    placeholder: ctrl.placeholder || '',
                    ...(fieldDef.enum ? {
                        options: fieldDef.enum.map(v => ({ label: v, value: v })),
                    } : {}),
                    ...(fieldDef.type === 'email' ? { inputType: 'email' } : {}),
                };
            }),
        };
    }

    const controls = Object.entries(schemaJson || {}).map(([key, def], idx) => ({
        type: fieldTypeToControlType(def.type, def),
        databind: key,
        label: def.label || key,
        colno: 1,
        rowno: idx + 1,
        colspan: colnumbers,
        ...(def.enum ? {
            options: def.enum.map(v => ({ label: v, value: v })),
        } : {}),
        ...(def.type === 'email' ? { inputType: 'email' } : {}),
    }));

    return { colnumbers, controls };
}

/**
 * สร้าง CRUDControl full config จาก schema + view + formcfg + data
 */
export function buildCrudConfig({ schemaJson, viewJson, formcfgJson, data, keyField = 'id' }) {
    const columns = schemaToColumnsConfig(schemaJson, viewJson);
    const formConfig = schemaToFormConfig(schemaJson, formcfgJson);

    return {
        data,
        columns,
        keyField,
        formConfig: {
            colnumbers: formConfig.colnumbers,
            controls: formConfig.controls,
        },
        searchFields: Object.keys(schemaJson || {}),
    };
}

/**
 * สร้าง default data_view JSON จาก schema
 */
export function generateDefaultView(schemaJson) {
    return {
        columns: Object.entries(schemaJson || {}).map(([key, def]) => ({
            key,
            header: key,
            width: 'auto',
            sortable: true,
            type: def.type === 'boolean' ? 'badge' : undefined,
        })),
    };
}

/**
 * สร้าง default data_formcfg JSON จาก schema
 */
export function generateDefaultFormcfg(schemaJson, colnumbers = 6) {
    return {
        colnumbers,
        controls: Object.entries(schemaJson || {}).map(([key, def], idx) => ({
            key,
            label: def.label || key,
            colno: 1,
            rowno: idx + 1,
            colspan: colnumbers,
            placeholder: '',
        })),
    };
}
