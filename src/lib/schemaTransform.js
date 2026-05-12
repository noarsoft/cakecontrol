/**
 * schemaTransform.js — Bridge schema → existing control configs
 * แปลง data_schema, data_view, data_formcfg → CRUDControl / FormControl config
 */

/**
 * แปลง schema field type → control type ที่ genControl รู้จัก
 */
function normalizeEnumOptions(enumArr) {
    if (!enumArr) return [];
    return enumArr.map(v => typeof v === 'object' ? { label: v.label, value: v.value } : { label: v, value: v });
}

const DISPLAY_DEFAULTS = {
    label: { value: 'ตัวอย่างข้อความ' },
    link: { value: 'ตัวอย่างลิงก์', href: '#' },
    image: { value: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="120"%3E%3Crect fill="%23e2e8f0" width="200" height="120" rx="8"/%3E%3Ctext x="100" y="65" text-anchor="middle" fill="%2394a3b8" font-size="14"%3ESample Image%3C/text%3E%3C/svg%3E', width: '200px', height: '120px' },
    badge: { value: 'Badge' },
    icon: { value: '⭐' },
    button: { value: 'Button' },
};

function getDisplayProps(fieldType, fieldDef) {
    const defaults = DISPLAY_DEFAULTS[fieldType];
    if (!defaults) return {};
    const props = { ...defaults };
    if (fieldDef.value !== undefined) props.value = fieldDef.value;
    if (fieldDef.href !== undefined) props.href = fieldDef.href;
    return props;
}

const PASSTHROUGH_PROPS = {
    number: ['min', 'max', 'step'],
    password: ['showStrength', 'minLength', 'maxLength'],
    slider: ['min', 'max', 'step'],
    rating: ['max'],
    progress: ['showValue', 'color'],
    searchbox: ['multiple', 'allowCreate'],
    qrcode: ['width', 'height'],
    image: ['width', 'height', 'borderRadius', 'objectFit', 'shadow'],
    boolean: [],
    toggle: [],
};

function getFieldProps(fieldType, fieldDef) {
    const keys = PASSTHROUGH_PROPS[fieldType];
    if (!keys) return {};
    const props = {};
    for (const k of keys) {
        if (fieldDef[k] !== undefined) props[k] = fieldDef[k];
    }
    return props;
}

function sortedEntries(schemaJson) {
    return Object.entries(schemaJson || {}).sort(([keyA, a], [keyB, b]) => {
        const orderDiff = (a._order || 0) - (b._order || 0);
        if (orderDiff !== 0) return orderDiff;
        const numA = parseInt(keyA.match(/(\d+)/)?.[1] || '0', 10);
        const numB = parseInt(keyB.match(/(\d+)/)?.[1] || '0', 10);
        if (numA !== numB) return numA - numB;
        return keyA.localeCompare(keyB);
    });
}

function fieldTypeToControlType(fieldType) {
    const map = {
        // Input
        string: 'textbox',
        number: 'number',
        password: 'password',
        email: 'textbox',
        select: 'select',
        boolean: 'checkbox',
        toggle: 'toggle',
        date: 'date',
        datepicker: 'datepicker',
        slider: 'slider',
        rating: 'rating',
        file: 'textbox',
        searchbox: 'searchbox',
        multipleupload: 'multipleupload',
        // Display
        label: 'label',
        link: 'link',
        image: 'image',
        badge: 'badge',
        icon: 'icon',
        progress: 'progress',
        qrcode: 'qrcode',
        calendar: 'calendar',
        calendargrid: 'calendargrid',
        button: 'button',
        buttongroup: 'buttongroup',
        // Layout
        accordion: 'accordion',
        tab: 'tab',
        card: 'card',
        tree: 'tree',
        menu: 'menu',
        gridview: 'gridview',
        tableview: 'tableview',
        form: 'form',
        crud: 'crud',
        modal: 'modal',
        pagination: 'pagination',
        // Charts
        chart: 'chart',
        barchart: 'bar',
        linechart: 'line',
        piechart: 'pie',
        doughnutchart: 'doughnut',
        radarchart: 'radar',
        areachart: 'area',
        bubblechart: 'bubble',
        mixedchart: 'mixed',
    };
    return map[fieldType] || 'textbox';
}

/**
 * สร้าง columns config สำหรับ CRUDControl จาก data_view JSON
 * ถ้าไม่มี data_view ก็ auto-generate จาก schema
 */
export function schemaToColumnsConfig(schemaJson, viewJson = null) {
    let columns;
    if (viewJson && viewJson.columns && viewJson.columns.length > 0) {
        columns = viewJson.columns;
    } else {
        columns = sortedEntries(schemaJson).map(([key, def]) => {
            const col = { key, header: def.label || key, sortable: true, width: 'auto' };
            if (def.type === 'boolean') col.type = 'badge';
            return col;
        });
    }

    return columns.map(col => {
        const fieldDef = (schemaJson || {})[col.key];
        if (fieldDef && fieldDef.type === 'select' && fieldDef.enum) {
            const opts = normalizeEnumOptions(fieldDef.enum);
            const enumMap = Object.fromEntries(opts.map(o => [String(o.value), o.label]));
            return {
                ...col,
                type: 'custom',
                controlProps: {
                    render: (rowData) => {
                        const val = rowData[col.key];
                        return enumMap[String(val)] ?? val;
                    },
                },
            };
        }
        return col;
    });
}

/**
 * สร้าง formConfig (controls array) สำหรับ FormControl จาก data_formcfg JSON
 * ถ้าไม่มี formcfg ก็ auto-generate จาก schema
 */
export function schemaToFormConfig(schemaJson, formcfgJson = null) {
    const colnumbers = formcfgJson?.colnumbers || 6;

    if (formcfgJson && formcfgJson.controls && formcfgJson.controls.length > 0) {
        // Map formcfg controls → FormControl controls with correct type
        return {
            colnumbers,
            controls: formcfgJson.controls.map(ctrl => {
                const fieldDef = schemaJson[ctrl.key] || { type: 'string' };
                return {
                    type: fieldTypeToControlType(fieldDef.type),
                    databind: ctrl.key,
                    label: ctrl.label || ctrl.key,
                    colno: ctrl.colno || 1,
                    rowno: ctrl.rowno,
                    colspan: ctrl.colspan || colnumbers,
                    placeholder: ctrl.placeholder || '',
                    ...(fieldDef.type === 'select' && fieldDef.enum ? {
                        options: normalizeEnumOptions(fieldDef.enum),
                    } : {}),
                    ...(fieldDef.type === 'email' ? { inputType: 'email' } : {}),
                    ...getDisplayProps(fieldDef.type, fieldDef),
                    ...getFieldProps(fieldDef.type, fieldDef),
                };
            }),
        };
    }

    // Auto-generate: 1 field ต่อ 1 row, full width
    const controls = sortedEntries(schemaJson).map(([key, def], idx) => ({
        type: fieldTypeToControlType(def.type),
        databind: key,
        label: def.label || key,
        colno: 1,
        rowno: idx + 1,
        colspan: colnumbers,
        ...(def.type === 'select' && def.enum ? {
            options: normalizeEnumOptions(def.enum),
        } : {}),
        ...(def.type === 'email' ? { inputType: 'email' } : {}),
        ...getDisplayProps(def.type, def),
        ...getFieldProps(def.type, def),
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
        columns: sortedEntries(schemaJson).map(([key, def]) => {
            const col = { key, header: def.label || key, width: 'auto', sortable: true };
            if (def.type === 'boolean') col.type = 'badge';
            return col;
        }),
    };
}

/**
 * สร้าง default data_formcfg JSON จาก schema
 */
export function generateDefaultFormcfg(schemaJson, colnumbers = 6) {
    return {
        colnumbers,
        controls: sortedEntries(schemaJson).map(([key, def], idx) => ({
            key,
            label: def.label || key,
            colno: 1,
            rowno: idx + 1,
            colspan: colnumbers,
            placeholder: '',
        })),
    };
}
