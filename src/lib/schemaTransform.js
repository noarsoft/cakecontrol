/**
 * schemaTransform.js — Bridge schema → existing control configs
 * แปลง data_schema, data_view, data_formcfg → CRUDControl / FormControl config
 */
import { createElement } from 'react';

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
    progress: { value: 50 },
    qrcode: { value: 'https://example.com' },
};

function getDisplayProps(fieldType, fieldDef) {
    const defaults = DISPLAY_DEFAULTS[fieldType];
    if (!defaults) return {};
    const props = { ...defaults };
    for (const key of Object.keys(props)) {
        if (fieldDef[key] !== undefined) props[key] = fieldDef[key];
    }
    return props;
}

const CHART_PROPS = ['chartType', 'title', 'xAxisKey', 'yAxisKey', 'nameKey', 'dataKey', 'showLegend', 'showGrid', 'colors'];

const PASSTHROUGH_PROPS = {
    string: ['placeholder', 'maxLength', 'rows'],
    number: ['min', 'max', 'step', 'placeholder'],
    select: ['placeholder', 'disabled'],
    dropdown: ['placeholder', 'searchable', 'clearable', 'displayField', 'maxHeight'],
    date: ['min', 'max'],
    datepicker: ['placeholder'],
    slider: ['min', 'max', 'step', 'unit', 'showValue'],
    rating: ['max', 'allowHalf'],
    progress: ['showValue', 'color', 'value'],
    fileupload: ['maxFileSize', 'allowedTypes', 'buttonLabel'],
    qrcode: ['width', 'height', 'value'],
    image: ['width', 'height', 'borderRadius', 'objectFit', 'shadow'],
    boolean: ['disabled'],
    toggle: ['disabled'],
    label: ['value', 'bold', 'italic', 'fontSize'],
    link: ['value', 'href', 'target'],
    badge: ['value', 'backgroundColor'],
    icon: ['value', 'fontSize'],
    button: ['value'],
    buttongroup: ['orientation'],
    calendargrid: ['editable'],
    accordion: ['allowMultiple'],
    tabs: ['tabPosition'],
    card: ['columns', 'gap'],
    tree: ['checkable', 'showLine', 'multiple'],
    menu: ['orientation', 'collapsible'],
    form: ['colnumbers', 'responsive'],
    grid: ['columns', 'tabletColumns', 'mobileColumns', 'cardStyle', 'gap'],
    crud: ['selectable', 'hideAdd'],
    modal: ['size', 'closeOnBackdropClick'],
    pagination: ['maxButtons', 'showPageInfo', 'showItemInfo'],
    alertmodal: ['type', 'closeOnBackdropClick', 'closeOnEscapeKey'],
    confirmmodal: ['confirmLabel', 'cancelLabel', 'isDangerous', 'closeOnBackdropClick'],
    chart: CHART_PROPS,
    chartsbar: CHART_PROPS,
    chartsline: [...CHART_PROPS, 'curved'],
    chartspie: CHART_PROPS,
    chartsdoughnut: [...CHART_PROPS, 'innerRadius'],
    chartsradar: CHART_PROPS,
    chartsarea: [...CHART_PROPS, 'fillOpacity'],
    chartsbubble: CHART_PROPS,
    chartsmixed: CHART_PROPS,
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
        select: 'select',
        dropdown: 'dropdown',
        boolean: 'checkbox',
        toggle: 'toggle',
        date: 'date',
        datepicker: 'datepicker',
        slider: 'slider',
        rating: 'rating',
        fileupload: 'textbox',
        // Display
        label: 'label',
        link: 'link',
        image: 'image',
        badge: 'badge',
        icon: 'icon',
        progress: 'progress',
        qrcode: 'qrcode',
        calendargrid: 'calendargrid',
        button: 'button',
        buttongroup: 'buttongroup',
        // Layout
        form: 'form',
        table: 'table',
        grid: 'grid',
        card: 'card',
        accordion: 'accordion',
        tabs: 'tabs',
        tree: 'tree',
        menu: 'menu',
        crud: 'crud',
        modal: 'modal',
        pagination: 'pagination',
        // Modal
        alertmodal: 'alertmodal',
        confirmmodal: 'confirmmodal',
        // Charts
        chart: 'chart',
        chartsbar: 'bar',
        chartsline: 'line',
        chartspie: 'pie',
        chartsdoughnut: 'doughnut',
        chartsradar: 'radar',
        chartsarea: 'area',
        chartsbubble: 'bubble',
        chartsmixed: 'mixed',
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
        columns = sortedEntries(schemaJson)
            .filter(([, def]) => def.type !== 'pagebreak')
            .map(([key, def]) => {
                const col = { key, header: def.label || key, sortable: true, width: 'auto' };
                if (def.type === 'boolean') col.type = 'badge';
                return col;
            });
    }

    return columns.map(col => {
        const fieldDef = (schemaJson || {})[col.key];
        if (fieldDef && (fieldDef.type === 'boolean' || fieldDef.type === 'toggle')) {
            return {
                ...col,
                type: 'custom',
                controlProps: {
                    render: (rowData) => {
                        const val = rowData[col.key];
                        const isTrue = val === true || val === 'true';
                        return createElement('span', {
                            className: `bool-badge bool-badge--${isTrue ? 'true' : 'false'}`,
                        }, isTrue ? 'true' : 'false');
                    },
                },
            };
        }
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
                    ...getDisplayProps(fieldDef.type, fieldDef),
                    ...getFieldProps(fieldDef.type, fieldDef),
                };
            }),
        };
    }

    // Auto-generate: 1 field ต่อ 1 row, full width (skip pagebreak)
    const controls = sortedEntries(schemaJson)
        .filter(([, def]) => def.type !== 'pagebreak')
        .map(([key, def], idx) => ({
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
/**
 * สร้าง pages array จาก schema โดยแบ่งตาม pagebreak fields
 * คืน array ของ { label, fieldKeys } แต่ละ page
 */
export function getSchemaPages(schemaJson) {
    const entries = sortedEntries(schemaJson);
    const pages = [];
    let current = { label: null, fieldKeys: [] };

    for (const [key, def] of entries) {
        if (def.type === 'pagebreak') {
            if (current.fieldKeys.length > 0) pages.push(current);
            current = { label: def.label || null, fieldKeys: [] };
        } else {
            current.fieldKeys.push(key);
        }
    }
    if (current.fieldKeys.length > 0) pages.push(current);
    return pages;
}

export function generateDefaultView(schemaJson) {
    return {
        columns: sortedEntries(schemaJson)
            .filter(([, def]) => def.type !== 'pagebreak')
            .map(([key, def]) => {
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
        controls: sortedEntries(schemaJson)
            .filter(([, def]) => def.type !== 'pagebreak')
            .map(([key, def], idx) => ({
                key,
                label: def.label || key,
                colno: 1,
                rowno: idx + 1,
                colspan: colnumbers,
                placeholder: '',
            })),
    };
}
