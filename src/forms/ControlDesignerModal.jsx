import { useState, useEffect } from 'react';
import ModalControl from '../components/controls/ModalControl';
import { useToast } from '../contexts/ToastContext';
import { FIELD_TYPES } from '../lib/schema';
import './ControlDesignerModal.css';

const CONTROL_TYPES = [
    // --- Input ---
    { value: 'textbox', label: 'Textbox' },
    { value: 'number', label: 'Number' },
    { value: 'select', label: 'Select' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'toggle', label: 'Toggle' },
    { value: 'date', label: 'Date' },
    { value: 'datepicker', label: 'Datepicker' },
    { value: 'slider', label: 'Slider' },
    { value: 'rating', label: 'Rating' },
    { value: 'fileupload', label: 'File Upload' },
    // --- Display ---
    { value: 'label', label: 'Label' },
    { value: 'link', label: 'Link' },
    { value: 'image', label: 'Image' },
    { value: 'badge', label: 'Badge' },
    { value: 'icon', label: 'Icon' },
    { value: 'progress', label: 'Progress' },
    { value: 'qrcode', label: 'QR Code' },
    { value: 'calendargrid', label: 'CalendarGrid' },
    { value: 'button', label: 'Button' },
    { value: 'buttongroup', label: 'ButtonGroup' },
    // --- Layout ---
    { value: 'form', label: 'Form' },
    { value: 'table', label: 'Table' },
    { value: 'grid', label: 'Grid' },
    { value: 'card', label: 'Card' },
    { value: 'accordion', label: 'Accordion' },
    { value: 'tabs', label: 'Tabs' },
    { value: 'tree', label: 'Tree' },
    { value: 'menu', label: 'Menu' },
    { value: 'crud', label: 'CRUD' },
    { value: 'modal', label: 'Modal' },
    { value: 'pagination', label: 'Pagination' },
    // --- Modal ---
    { value: 'alertmodal', label: 'Alert Modal' },
    { value: 'confirmmodal', label: 'Confirm Modal' },
    // --- Charts ---
    { value: 'chart', label: 'Chart' },
    { value: 'chartsbar', label: 'Bar Chart JS' },
    { value: 'chartsline', label: 'Line Chart JS' },
    { value: 'chartspie', label: 'Pie Chart JS' },
    { value: 'chartsdoughnut', label: 'Doughnut Chart JS' },
    { value: 'chartsradar', label: 'Radar Chart JS' },
    { value: 'chartsarea', label: 'Area Chart JS' },
    { value: 'chartsbubble', label: 'Bubble Chart JS' },
    { value: 'chartsmixed', label: 'Mixed Chart JS' },
];

const CONTROL_TO_FIELD_TYPE = {
    textbox: 'string',
    number: 'number',
    select: 'select',
    dropdown: 'dropdown',
    checkbox: 'boolean',
    toggle: 'toggle',
    date: 'date',
    datepicker: 'datepicker',
    slider: 'slider',
    rating: 'rating',
    fileupload: 'fileupload',
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
    alertmodal: 'alertmodal',
    confirmmodal: 'confirmmodal',
    chart: 'chart',
    chartsbar: 'chartsbar',
    chartsline: 'chartsline',
    chartspie: 'chartspie',
    chartsdoughnut: 'chartsdoughnut',
    chartsradar: 'chartsradar',
    chartsarea: 'chartsarea',
    chartsbubble: 'chartsbubble',
    chartsmixed: 'chartsmixed',
};

const DISABLED_FIELD_VALUES = new Set(
    FIELD_TYPES.filter(t => !t.enabled).map(t => t.value)
);
const ENABLED_CONTROL_TYPES = CONTROL_TYPES.filter(t => {
    const fieldValue = CONTROL_TO_FIELD_TYPE[t.value] || t.value;
    return !DISABLED_FIELD_VALUES.has(fieldValue);
});

const FIELD_TO_CONTROL_TYPE = {
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
    fileupload: 'fileupload',
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
    alertmodal: 'alertmodal',
    confirmmodal: 'confirmmodal',
    chart: 'chart',
    chartsbar: 'chartsbar',
    chartsline: 'chartsline',
    chartspie: 'chartspie',
    chartsdoughnut: 'chartsdoughnut',
    chartsradar: 'chartsradar',
    chartsarea: 'chartsarea',
    chartsbubble: 'chartsbubble',
    chartsmixed: 'chartsmixed',
};

const CHART_CONFIG = [
    { key: 'title', label: 'ชื่อกราฟ', inputType: 'text' },
    { key: 'xAxisKey', label: 'แกน X (key)', inputType: 'text', placeholder: 'ชื่อ field สำหรับแกน X' },
    { key: 'yAxisKey', label: 'แกน Y (key)', inputType: 'text', placeholder: 'ชื่อ field สำหรับแกน Y' },
    { key: 'nameKey', label: 'Name Key', inputType: 'text', placeholder: 'key สำหรับ label' },
    { key: 'dataKey', label: 'Data Key', inputType: 'text', placeholder: 'key สำหรับค่าข้อมูล' },
    { key: 'showLegend', label: 'แสดง Legend', inputType: 'checkbox' },
    { key: 'showGrid', label: 'แสดงเส้น Grid', inputType: 'checkbox' },
];

const CONTROL_CONFIG_FIELDS = {
    textbox: [
        { key: 'placeholder', label: 'Placeholder', inputType: 'text' },
        { key: 'maxLength', label: 'ความยาวสูงสุด', inputType: 'number' },
        { key: 'rows', label: 'บรรทัด (textarea)', inputType: 'number', placeholder: 'ปล่อยว่าง = 1 บรรทัด' },
    ],
    number: [
        { key: 'placeholder', label: 'Placeholder', inputType: 'text' },
        { key: 'min', label: 'ค่าต่ำสุด', inputType: 'number' },
        { key: 'max', label: 'ค่าสูงสุด', inputType: 'number' },
        { key: 'step', label: 'Step', inputType: 'number' },
    ],
    slider: [
        { key: 'min', label: 'ค่าต่ำสุด', inputType: 'number' },
        { key: 'max', label: 'ค่าสูงสุด', inputType: 'number' },
        { key: 'step', label: 'Step', inputType: 'number' },
        { key: 'unit', label: 'หน่วย', inputType: 'text', placeholder: 'เช่น %, kg' },
        { key: 'color', label: 'สี', inputType: 'color' },
        { key: 'size', label: 'ขนาด', inputType: 'select', selectOptions: [
            { value: 'small', label: 'เล็ก' },
            { value: 'medium', label: 'กลาง' },
            { value: 'large', label: 'ใหญ่' },
        ]},
        { key: 'showValue', label: 'แสดงค่า', inputType: 'checkbox' },
        { key: 'showTicks', label: 'แสดงขีด', inputType: 'checkbox' },
    ],
    rating: [
        { key: 'maxStars', label: 'จำนวนดาว', inputType: 'number' },
        { key: 'allowHalf', label: 'อนุญาตครึ่งดาว', inputType: 'checkbox' },
        { key: 'color', label: 'สี', inputType: 'color' },
        { key: 'size', label: 'ขนาด', inputType: 'select', selectOptions: [
            { value: 'small', label: 'เล็ก' },
            { value: 'medium', label: 'กลาง' },
            { value: 'large', label: 'ใหญ่' },
        ]},
    ],
    label: [
        { key: 'value', label: 'ข้อความ', inputType: 'text' },
        { key: 'bold', label: 'ตัวหนา', inputType: 'checkbox' },
        { key: 'italic', label: 'ตัวเอียง', inputType: 'checkbox' },
        { key: 'fontSize', label: 'ขนาดตัวอักษร', inputType: 'text', placeholder: 'เช่น 18px' },
    ],
    link: [
        { key: 'value', label: 'ข้อความลิงก์', inputType: 'text' },
        { key: 'href', label: 'URL', inputType: 'text', placeholder: 'https://...' },
        { key: 'target', label: 'เปิดในแท็บ', inputType: 'select', selectOptions: [
            { value: '_self', label: 'แท็บเดิม' },
            { value: '_blank', label: 'แท็บใหม่' },
        ]},
    ],
    image: [
        { key: 'value', label: 'URL รูปภาพ', inputType: 'text', placeholder: 'https://...' },
        { key: 'width', label: 'ความกว้าง', inputType: 'text', placeholder: 'เช่น 200px' },
        { key: 'height', label: 'ความสูง', inputType: 'text', placeholder: 'เช่น 120px' },
        { key: 'objectFit', label: 'การแสดงผล', inputType: 'select', selectOptions: [
            { value: 'cover', label: 'Cover (เติมเต็ม)' },
            { value: 'contain', label: 'Contain (พอดี)' },
            { value: 'fill', label: 'Fill (ยืด)' },
            { value: 'none', label: 'None (ขนาดจริง)' },
        ]},
    ],
    badge: [
        { key: 'value', label: 'ข้อความ', inputType: 'text' },
        { key: 'backgroundColor', label: 'สีพื้นหลัง', inputType: 'color' },
    ],
    icon: [
        { key: 'value', label: 'ไอคอน (emoji/text)', inputType: 'text', placeholder: 'เช่น ⭐ 🔥 ✅' },
        { key: 'fontSize', label: 'ขนาด', inputType: 'text', placeholder: 'เช่น 24px' },
    ],
    progress: [
        { key: 'value', label: 'ค่า (0-100)', inputType: 'number' },
        { key: 'color', label: 'สี', inputType: 'color' },
        { key: 'showValue', label: 'แสดงตัวเลข', inputType: 'checkbox' },
    ],
    qrcode: [
        { key: 'value', label: 'URL / ข้อความ', inputType: 'text', placeholder: 'https://...' },
        { key: 'width', label: 'ความกว้าง (px)', inputType: 'number' },
        { key: 'height', label: 'ความสูง (px)', inputType: 'number' },
    ],
    select: [
        { key: 'placeholder', label: 'Placeholder', inputType: 'text' },
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
    ],
    date: [
        { key: 'placeholder', label: 'Placeholder', inputType: 'text', placeholder: 'เช่น เลือกวันที่' },
        { key: 'min', label: 'วันที่ต่ำสุด', inputType: 'text', placeholder: 'เช่น 2024-01-01' },
        { key: 'max', label: 'วันที่สูงสุด', inputType: 'text', placeholder: 'เช่น 2030-12-31' },
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
    ],
    datepicker: [
        { key: 'placeholder', label: 'Placeholder', inputType: 'text', placeholder: 'เช่น เลือกวันที่' },
        { key: 'minDate', label: 'วันที่ต่ำสุด', inputType: 'text', placeholder: 'เช่น 2024-01-01' },
        { key: 'maxDate', label: 'วันที่สูงสุด', inputType: 'text', placeholder: 'เช่น 2030-12-31' },
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
    ],
    checkbox: [
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
    ],
    toggle: [
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
    ],
    dropdown: [
        { key: 'placeholder', label: 'Placeholder', inputType: 'text' },
        { key: 'searchable', label: 'ค้นหาได้', inputType: 'checkbox' },
        { key: 'clearable', label: 'ล้างค่าได้', inputType: 'checkbox' },
        { key: 'maxHeight', label: 'ความสูงสูงสุด', inputType: 'text', placeholder: 'เช่น 300px' },
    ],
    fileupload: [
        { key: 'maxFileSize', label: 'ขนาดไฟล์สูงสุด (bytes)', inputType: 'number', placeholder: 'เช่น 52428800 (50MB)' },
        { key: 'allowedTypes', label: 'ประเภทไฟล์ (comma)', inputType: 'text', placeholder: 'image/jpeg,image/png,application/pdf' },
        { key: 'buttonLabel', label: 'ข้อความปุ่ม', inputType: 'text', placeholder: 'Choose Files to Upload' },
    ],
    button: [
        { key: 'value', label: 'ข้อความปุ่ม', inputType: 'text' },
    ],
    buttongroup: [
        { key: 'orientation', label: 'ทิศทาง', inputType: 'select', selectOptions: [
            { value: 'horizontal', label: 'แนวนอน' },
            { value: 'vertical', label: 'แนวตั้ง' },
        ]},
    ],
    calendargrid: [
        { key: 'editable', label: 'แก้ไขได้', inputType: 'checkbox' },
    ],
    accordion: [
        { key: 'allowMultiple', label: 'เปิดได้หลายอันพร้อมกัน', inputType: 'checkbox' },
    ],
    tabs: [
        { key: 'tabPosition', label: 'ตำแหน่งแท็บ', inputType: 'select', selectOptions: [
            { value: 'top', label: 'บน' },
            { value: 'bottom', label: 'ล่าง' },
            { value: 'left', label: 'ซ้าย' },
            { value: 'right', label: 'ขวา' },
        ]},
    ],
    card: [
        { key: 'columns', label: 'จำนวนคอลัมน์', inputType: 'number', placeholder: 'เช่น 3' },
        { key: 'gap', label: 'ระยะห่าง', inputType: 'text', placeholder: 'เช่น 20px' },
    ],
    tree: [
        { key: 'checkable', label: 'แสดง Checkbox', inputType: 'checkbox' },
        { key: 'showLine', label: 'แสดงเส้นเชื่อม', inputType: 'checkbox' },
        { key: 'multiple', label: 'เลือกได้หลายรายการ', inputType: 'checkbox' },
    ],
    menu: [
        { key: 'orientation', label: 'ทิศทาง', inputType: 'select', selectOptions: [
            { value: 'vertical', label: 'แนวตั้ง' },
            { value: 'horizontal', label: 'แนวนอน' },
        ]},
        { key: 'collapsible', label: 'ยุบ/ขยายได้', inputType: 'checkbox' },
    ],
    form: [
        { key: 'colnumbers', label: 'จำนวนคอลัมน์', inputType: 'number', placeholder: 'เช่น 6' },
        { key: 'responsive', label: 'Responsive', inputType: 'checkbox' },
    ],
    grid: [
        { key: 'columns', label: 'คอลัมน์ (Desktop)', inputType: 'number', placeholder: 'เช่น 3' },
        { key: 'tabletColumns', label: 'คอลัมน์ (Tablet)', inputType: 'number', placeholder: 'เช่น 2' },
        { key: 'mobileColumns', label: 'คอลัมน์ (Mobile)', inputType: 'number', placeholder: 'เช่น 1' },
        { key: 'cardStyle', label: 'สไตล์การ์ด', inputType: 'select', selectOptions: [
            { value: 'default', label: 'Default' },
            { value: 'bordered', label: 'Bordered' },
            { value: 'elevated', label: 'Elevated' },
            { value: 'compact', label: 'Compact' },
        ]},
        { key: 'gap', label: 'ระยะห่าง', inputType: 'text', placeholder: 'เช่น 20px' },
    ],
    crud: [
        { key: 'selectable', label: 'เลือกแถวได้', inputType: 'checkbox' },
        { key: 'hideAdd', label: 'ซ่อนปุ่มเพิ่ม', inputType: 'checkbox' },
    ],
    modal: [
        { key: 'size', label: 'ขนาด', inputType: 'select', selectOptions: [
            { value: 'sm', label: 'เล็ก (sm)' },
            { value: 'md', label: 'กลาง (md)' },
            { value: 'lg', label: 'ใหญ่ (lg)' },
            { value: 'xl', label: 'ใหญ่มาก (xl)' },
        ]},
        { key: 'closeOnBackdropClick', label: 'ปิดเมื่อคลิกพื้นหลัง', inputType: 'checkbox' },
    ],
    pagination: [
        { key: 'maxButtons', label: 'จำนวนปุ่มหน้า', inputType: 'number', placeholder: 'เช่น 5' },
        { key: 'showPageInfo', label: 'แสดง Page X of Y', inputType: 'checkbox' },
        { key: 'showItemInfo', label: 'แสดง Showing X-Y of Z', inputType: 'checkbox' },
    ],
    alertmodal: [
        { key: 'type', label: 'ประเภท', inputType: 'select', selectOptions: [
            { value: 'info', label: 'Info' },
            { value: 'success', label: 'Success' },
            { value: 'warning', label: 'Warning' },
            { value: 'error', label: 'Error' },
        ]},
        { key: 'closeOnBackdropClick', label: 'ปิดเมื่อคลิกพื้นหลัง', inputType: 'checkbox' },
        { key: 'closeOnEscapeKey', label: 'ปิดเมื่อกด Escape', inputType: 'checkbox' },
    ],
    confirmmodal: [
        { key: 'confirmLabel', label: 'ข้อความปุ่มยืนยัน', inputType: 'text', placeholder: 'เช่น ยืนยัน' },
        { key: 'cancelLabel', label: 'ข้อความปุ่มยกเลิก', inputType: 'text', placeholder: 'เช่น ยกเลิก' },
        { key: 'isDangerous', label: 'แสดงแบบอันตราย (สีแดง)', inputType: 'checkbox' },
        { key: 'closeOnBackdropClick', label: 'ปิดเมื่อคลิกพื้นหลัง', inputType: 'checkbox' },
    ],
    chart: [
        { key: 'chartType', label: 'ประเภทกราฟ', inputType: 'select', selectOptions: [
            { value: 'bar', label: 'Bar (แท่ง)' },
            { value: 'line', label: 'Line (เส้น)' },
            { value: 'pie', label: 'Pie (วงกลม)' },
            { value: 'doughnut', label: 'Doughnut (โดนัท)' },
            { value: 'radar', label: 'Radar' },
            { value: 'area', label: 'Area (พื้นที่)' },
        ]},
        ...CHART_CONFIG,
    ],
    chartsbar: CHART_CONFIG,
    chartsline: [...CHART_CONFIG, { key: 'curved', label: 'เส้นโค้ง', inputType: 'checkbox' }],
    chartspie: CHART_CONFIG.filter(f => !['xAxisKey', 'yAxisKey', 'showGrid'].includes(f.key)),
    chartsdoughnut: [
        ...CHART_CONFIG.filter(f => !['xAxisKey', 'yAxisKey', 'showGrid'].includes(f.key)),
        { key: 'innerRadius', label: 'รัศมีวงใน (%)', inputType: 'number', placeholder: 'เช่น 60' },
    ],
    chartsradar: CHART_CONFIG,
    chartsarea: [...CHART_CONFIG, { key: 'fillOpacity', label: 'ความโปร่งใส (0-1)', inputType: 'number', placeholder: 'เช่น 0.3' }],
    chartsbubble: CHART_CONFIG,
    chartsmixed: CHART_CONFIG,
};

function getConfigKeys(controlType) {
    const fields = CONTROL_CONFIG_FIELDS[controlType];
    return fields ? fields.map(f => f.key) : [];
}

function extractConfig(def, controlType) {
    const keys = getConfigKeys(controlType);
    const config = {};
    for (const k of keys) {
        if (def[k] !== undefined) config[k] = def[k];
    }
    return config;
}

function createEmptyControl() {
    return {
        id: Date.now() + Math.random(),
        label: '',
        databind: '',
        controlType: 'textbox',
        options: [],
        defaultSelect: '',
        config: {},
    };
}

function schemaToControls(schemaJson, formcfgJson) {
    if (!schemaJson || Object.keys(schemaJson).length === 0) return [createEmptyControl()];

    const formControls = formcfgJson?.controls || [];
    const sortedSchema = Object.entries(schemaJson).sort(([keyA, a], [keyB, b]) => {
        const orderDiff = (a._order || 0) - (b._order || 0);
        if (orderDiff !== 0) return orderDiff;
        const numA = parseInt(keyA.match(/(\d+)/)?.[1] || '0', 10);
        const numB = parseInt(keyB.match(/(\d+)/)?.[1] || '0', 10);
        if (numA !== numB) return numA - numB;
        return keyA.localeCompare(keyB);
    });
    const controls = sortedSchema.map(([key, def]) => {
        const fc = formControls.find(c => c.key === key);
        const controlType = FIELD_TO_CONTROL_TYPE[def.type] || 'textbox';
        const hasOptions = (def.type === 'select' || def.type === 'dropdown' || def.type === 'buttongroup') && def.enum;
        return {
            id: Date.now() + Math.random(),
            label: fc?.label || def.label || key,
            databind: key,
            controlType,
            options: hasOptions
                ? def.enum.map(v => typeof v === 'object' ? { key: String(v.value), value: v.label } : { key: v, value: v })
                : [],
            defaultSelect: '',
            config: extractConfig(def, controlType),
        };
    });

    const schemaKeys = new Set(Object.keys(schemaJson));
    formControls.forEach(fc => {
        if (!schemaKeys.has(fc.key)) {
            controls.push({
                id: Date.now() + Math.random(),
                label: fc.label || fc.key,
                databind: fc.key,
                controlType: fc.type || 'textbox',
                options: [],
                defaultSelect: '',
                config: {},
            });
        }
    });

    return controls.length > 0 ? controls : [createEmptyControl()];
}

function controlsToSchema(controls) {
    const json = {};
    for (const ctrl of controls) {
        if (!ctrl.databind.trim()) continue;
        const fieldType = CONTROL_TO_FIELD_TYPE[ctrl.controlType] || 'string';
        const def = { type: fieldType };
        if (ctrl.label.trim()) def.label = ctrl.label.trim();
        const hasOptions = ctrl.controlType === 'select' || ctrl.controlType === 'dropdown' || ctrl.controlType === 'buttongroup';
        if (hasOptions && ctrl.options.length > 0) {
            def.enum = ctrl.options
                .filter(o => o.key || o.value)
                .map(o => ({ label: o.value || o.key, value: isNaN(Number(o.key)) ? o.key : Number(o.key) }));
        }
        if (ctrl.config) {
            for (const [k, v] of Object.entries(ctrl.config)) {
                if (v !== '' && v !== undefined && v !== null) def[k] = v;
            }
        }
        json[ctrl.databind.trim()] = def;
    }
    return json;
}

function controlsToFormcfg(controls, colnumbers = 6) {
    return {
        colnumbers,
        controls: controls
            .filter(c => c.databind.trim())
            .map((ctrl, idx) => ({
                key: ctrl.databind.trim(),
                label: ctrl.label.trim() || ctrl.databind.trim(),
                colno: 1,
                rowno: idx + 1,
                colspan: colnumbers,
                placeholder: ctrl.config?.placeholder || '',
            })),
    };
}

function ControlDesignerModal({ isOpen, onClose, onSave, schemaName, schemaJson, formcfgJson, availableKeys = null }) {
    const { showToast } = useToast();
    const [name, setName] = useState('');
    const [nameTouched, setNameTouched] = useState(false);
    const [controls, setControls] = useState([createEmptyControl()]);
    const [touchedFields, setTouchedControls] = useState({}); // { ctrlId: { label: bool, databind: bool } }
    
    const isLayoutMode = availableKeys !== null;

    useEffect(() => {
        if (isOpen) {
            setName(schemaName || '');
            setNameTouched(false);
            setControls(schemaToControls(schemaJson, formcfgJson));
            setTouchedControls({});
        }
    }, [isOpen, schemaName, schemaJson, formcfgJson]);

    const markTouched = (ctrlId, field) => {
        setTouchedControls(prev => ({
            ...prev,
            [ctrlId]: { ...(prev[ctrlId] || {}), [field]: true }
        }));
    };

    const updateControl = (idx, field, value) => {
        setControls(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
    };

    const updateConfig = (idx, key, value) => {
        setControls(prev => prev.map((c, i) => {
            if (i !== idx) return c;
            return { ...c, config: { ...c.config, [key]: value } };
        }));
    };

    const addControl = () => {
        const newCtrl = createEmptyControl();
        setControls(prev => [...prev, {
            ...newCtrl,
            databind: isLayoutMode && availableKeys.length > 0 ? availableKeys[0] : ''
        }]);
    };

    const removeControl = (idx) => {
        if (controls.length <= 1) return;
        setControls(prev => prev.filter((_, i) => i !== idx));
    };

    const moveControl = (idx, dir) => {
        const newIdx = dir === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= controls.length) return;
        setControls(prev => {
            const next = [...prev];
            [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
            return next;
        });
    };

    const addOption = (ctrlIdx) => {
        setControls(prev => prev.map((c, i) => {
            if (i !== ctrlIdx) return c;
            return { ...c, options: [...c.options, { key: '', value: '' }] };
        }));
    };

    const updateOption = (ctrlIdx, optIdx, field, value) => {
        setControls(prev => prev.map((c, i) => {
            if (i !== ctrlIdx) return c;
            return {
                ...c,
                options: c.options.map((o, j) => j === optIdx ? { ...o, [field]: value } : o),
            };
        }));
    };

    const removeOption = (ctrlIdx, optIdx) => {
        setControls(prev => prev.map((c, i) => {
            if (i !== ctrlIdx) return c;
            return { ...c, options: c.options.filter((_, j) => j !== optIdx) };
        }));
    };

    const handleSave = () => {
        setNameTouched(true);
        // Mark all as touched
        const allTouched = {};
        controls.forEach(c => {
            allTouched[c.id] = { label: true, databind: true };
        });
        setTouchedControls(allTouched);

        if (!name.trim()) {
            showToast('กรุณาระบุชื่อแม่แบบ', 'error');
            return;
        }

        const validControls = controls.filter(c => c.databind.trim());
        if (validControls.length === 0) {
            showToast('กรุณาเพิ่มอย่างน้อย 1 Control และระบุ Key ให้ถูกต้อง', 'error');
            return;
        }

        if (controls.some(c => !c.label.trim())) {
            showToast('กรุณาระบุชื่อ Label ให้ครบทุกช่อง', 'error');
            return;
        }

        if (controls.some(c => !c.databind.trim())) {
            showToast('กรุณาระบุ Key ให้ครบทุกช่อง', 'error');
            return;
        }
        
        const json = isLayoutMode ? schemaJson : controlsToSchema(validControls);
        const formcfg = controlsToFormcfg(validControls, formcfgJson?.colnumbers || 6);
        
        onSave({ name: name.trim() || 'ฟอร์มใหม่', json, formcfg });
    };

    return (
        <ModalControl
            isOpen={isOpen}
            title={isLayoutMode ? `ตั้งค่า Layout: ${name}` : (schemaJson ? 'แก้ไขแม่แบบฟอร์ม' : 'สร้างแม่แบบฟอร์มใหม่')}
            onClose={onClose}
            size="lg"
            className="cd-modal"
            footer={
                <div className="cd-footer">
                    <button className="fb-mode-btn" onClick={onClose}>ยกเลิก</button>
                    <button className="fb-mode-btn active" onClick={handleSave}>บันทึก</button>
                </div>
            }
        >
            <div className="cd-body">
                {!isLayoutMode && (
                    <div className="cd-name-row">
                        <label className="cd-label">ชื่อแม่แบบ</label>
                        <input
                            className={`cd-input cd-name-input ${nameTouched && !name.trim() ? 'error' : ''}`}
                            style={nameTouched && !name.trim() ? { borderColor: 'var(--error)' } : {}}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onBlur={() => setNameTouched(true)}
                            placeholder="เช่น แบบสำรวจความพึงพอใจ"
                        />
                        {nameTouched && !name.trim() && <div className="error-msg">กรุณาระบุชื่อแม่แบบ</div>}
                    </div>
                )}

                <div className="cd-controls-header">
                    <span className="cd-col-label">ชื่อช่องกรอก (Label)</span>
                    <span className="cd-col-databind">ผูกข้อมูล (Key)</span>
                    <span className="cd-col-type">ชนิด Control</span>
                    <span className="cd-col-actions"></span>
                </div>

                {controls.map((ctrl, idx) => {
                    const touched = touchedFields[ctrl.id] || {};
                    const labelError = touched.label && !ctrl.label.trim();
                    const keyError = touched.databind && !ctrl.databind.trim();

                    return (
                        <div key={ctrl.id} className="cd-control-row">
                            <div className="cd-control-main">
                                <span className="cd-row-num">{idx + 1}</span>
                                <div className="cd-field-wrapper cd-col-label">
                                    <input
                                        className={`cd-input ${labelError ? 'error' : ''}`}
                                        style={labelError ? { borderColor: 'var(--error)', backgroundColor: 'var(--error-light)' } : {}}
                                        value={ctrl.label}
                                        onChange={e => updateControl(idx, 'label', e.target.value)}
                                        onBlur={() => markTouched(ctrl.id, 'label')}
                                        placeholder="ชื่อที่แสดงให้คนกรอกเห็น"
                                    />
                                    {labelError && <div className="error-msg">กรุณากรอก</div>}
                                </div>
                                
                                <div className="cd-field-wrapper cd-col-databind">
                                    {isLayoutMode ? (
                                        <select 
                                            className={`cd-select ${keyError ? 'error' : ''}`}
                                            style={keyError ? { borderColor: 'var(--error)', backgroundColor: 'var(--error-light)' } : {}}
                                            value={ctrl.databind}
                                            onChange={e => updateControl(idx, 'databind', e.target.value)}
                                            onBlur={() => markTouched(ctrl.id, 'databind')}
                                        >
                                            <option value="">-- เลือก Key --</option>
                                            {availableKeys.map(k => (
                                                <option key={k} value={k}>{k}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            className={`cd-input ${keyError ? 'error' : ''}`}
                                            style={keyError ? { borderColor: 'var(--error)', backgroundColor: 'var(--error-light)' } : {}}
                                            value={ctrl.databind}
                                            onChange={e => updateControl(idx, 'databind', e.target.value)}
                                            onBlur={() => markTouched(ctrl.id, 'databind')}
                                            placeholder="field_key"
                                        />
                                    )}
                                    {keyError && <div className="error-msg">กรุณากรอก</div>}
                                </div>

                                <select
                                    className="cd-select cd-col-type"
                                    value={ctrl.controlType}
                                    onChange={e => {
                                        updateControl(idx, 'controlType', e.target.value);
                                        const needsOptions = e.target.value === 'select' || e.target.value === 'dropdown' || e.target.value === 'buttongroup';
                                        if (needsOptions && ctrl.options.length === 0) {
                                            addOption(idx);
                                        }
                                    }}
                                >
                                    {ENABLED_CONTROL_TYPES.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                                <div className="cd-row-actions">
                                    <button onClick={() => moveControl(idx, 'up')} disabled={idx === 0} title="ขึ้น">&#8593;</button>
                                    <button onClick={() => moveControl(idx, 'down')} disabled={idx === controls.length - 1} title="ลง">&#8595;</button>
                                    <button onClick={() => removeControl(idx)} disabled={controls.length <= 1} className="cd-btn-remove" title="ลบ">&#10005;</button>
                                </div>
                            </div>

                            {(ctrl.controlType === 'select' || ctrl.controlType === 'dropdown' || ctrl.controlType === 'buttongroup') && (
                                <div className="cd-options-panel">
                                    <div className="cd-options-title">
                                        {ctrl.controlType === 'dropdown' ? 'ตัวเลือก Dropdown' : ctrl.controlType === 'select' ? 'ตัวเลือก Select' : 'ตัวเลือก ButtonGroup'}
                                    </div>
                                    {ctrl.options.map((opt, optIdx) => (
                                        <div key={optIdx} className="cd-option-row">
                                            <input
                                                className="cd-input cd-opt-key"
                                                value={opt.key}
                                                onChange={e => updateOption(idx, optIdx, 'key', e.target.value)}
                                                placeholder="key"
                                            />
                                            <input
                                                className="cd-input cd-opt-value"
                                                value={opt.value}
                                                onChange={e => updateOption(idx, optIdx, 'value', e.target.value)}
                                                placeholder="value (แสดง)"
                                            />
                                            <button className="cd-btn-remove-opt" onClick={() => removeOption(idx, optIdx)}>&#10005;</button>
                                        </div>
                                    ))}
                                    <button className="cd-btn-add-opt" onClick={() => addOption(idx)}>+ เพิ่มตัวเลือก</button>
                                </div>
                            )}

                            {CONTROL_CONFIG_FIELDS[ctrl.controlType] && (
                                <div className="cd-config-panel">
                                    <div className="cd-config-title">ตั้งค่า {CONTROL_TYPES.find(t => t.value === ctrl.controlType)?.label || ctrl.controlType}</div>
                                    <div className="cd-config-fields">
                                        {CONTROL_CONFIG_FIELDS[ctrl.controlType].map(field => (
                                            <div key={field.key} className={`cd-config-field ${field.inputType === 'checkbox' ? 'cd-config-checkbox' : ''}`}>
                                                <label className="cd-config-label">{field.label}</label>
                                                {field.inputType === 'text' && (
                                                    <input
                                                        className="cd-input"
                                                        type="text"
                                                        value={ctrl.config?.[field.key] ?? ''}
                                                        onChange={e => updateConfig(idx, field.key, e.target.value)}
                                                        placeholder={field.placeholder || ''}
                                                    />
                                                )}
                                                {field.inputType === 'number' && (
                                                    <input
                                                        className="cd-input"
                                                        type="number"
                                                        value={ctrl.config?.[field.key] ?? ''}
                                                        onChange={e => updateConfig(idx, field.key, e.target.value === '' ? '' : Number(e.target.value))}
                                                        placeholder={field.placeholder || ''}
                                                    />
                                                )}
                                                {field.inputType === 'checkbox' && (
                                                    <input
                                                        type="checkbox"
                                                        checked={!!ctrl.config?.[field.key]}
                                                        onChange={e => updateConfig(idx, field.key, e.target.checked)}
                                                    />
                                                )}
                                                {field.inputType === 'color' && (
                                                    <input
                                                        type="color"
                                                        value={ctrl.config?.[field.key] || '#3b82f6'}
                                                        onChange={e => updateConfig(idx, field.key, e.target.value)}
                                                    />
                                                )}
                                                {field.inputType === 'select' && (
                                                    <select
                                                        className="cd-select"
                                                        value={ctrl.config?.[field.key] ?? ''}
                                                        onChange={e => updateConfig(idx, field.key, e.target.value)}
                                                    >
                                                        <option value="">-- เลือก --</option>
                                                        {field.selectOptions?.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                <button className="cd-btn-add-control" onClick={addControl}>+ เพิ่ม Control</button>
            </div>
        </ModalControl>
    );
}

export default ControlDesignerModal;
