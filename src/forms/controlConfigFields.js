/**
 * controlConfigFields.js
 *
 * Static configuration metadata for each control type's config panel
 * in ControlDesignerModal. Pure data — no React, no side effects.
 *
 * Used by: ControlDesignerModal (config panel rendering)
 */

export const CHART_CONFIG = [
    { key: 'title', label: 'ชื่อกราฟ', inputType: 'text' },
    { key: 'xAxisKey', label: 'แกน X (key)', inputType: 'text', placeholder: 'ชื่อ field สำหรับแกน X' },
    { key: 'yAxisKey', label: 'แกน Y (key)', inputType: 'text', placeholder: 'ชื่อ field สำหรับแกน Y' },
    { key: 'nameKey', label: 'Name Key', inputType: 'text', placeholder: 'key สำหรับ label' },
    { key: 'dataKey', label: 'Data Key', inputType: 'text', placeholder: 'key สำหรับค่าข้อมูล' },
    { key: 'showLegend', label: 'แสดง Legend', inputType: 'checkbox' },
    { key: 'showGrid', label: 'แสดงเส้น Grid', inputType: 'checkbox' },
];

export const CONTROL_CONFIG_FIELDS = {
    textbox: [
        { key: 'required', label: 'จำเป็น', inputType: 'checkbox' },
        { key: 'placeholder', label: 'Placeholder', inputType: 'text' },
        { key: 'maxLength', label: 'ความยาวสูงสุด', inputType: 'number' },
        { key: 'rows', label: 'บรรทัด (textarea)', inputType: 'number', placeholder: 'ปล่อยว่าง = 1 บรรทัด' },
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
        { key: 'readOnly', label: 'อ่านอย่างเดียว', inputType: 'checkbox' },
    ],
    number: [
        { key: 'required', label: 'จำเป็น', inputType: 'checkbox' },
        { key: 'placeholder', label: 'Placeholder', inputType: 'text' },
        { key: 'min', label: 'ค่าต่ำสุด', inputType: 'number' },
        { key: 'max', label: 'ค่าสูงสุด', inputType: 'number' },
        { key: 'step', label: 'Step', inputType: 'number' },
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
        { key: 'readOnly', label: 'อ่านอย่างเดียว', inputType: 'checkbox' },
    ],
    slider: [
        { key: 'required', label: 'จำเป็น', inputType: 'checkbox' },
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
        { key: 'showLabel', label: 'แสดง Label', inputType: 'checkbox' },
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
    ],
    rating: [
        { key: 'required', label: 'จำเป็น', inputType: 'checkbox' },
        { key: 'maxStars', label: 'จำนวนดาว', inputType: 'number' },
        { key: 'allowHalf', label: 'อนุญาตครึ่งดาว', inputType: 'checkbox' },
        { key: 'color', label: 'สี', inputType: 'color' },
        { key: 'size', label: 'ขนาด', inputType: 'select', selectOptions: [
            { value: 'small', label: 'เล็ก' },
            { value: 'medium', label: 'กลาง' },
            { value: 'large', label: 'ใหญ่' },
        ]},
        { key: 'showLabel', label: 'แสดง Label', inputType: 'checkbox' },
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
        { key: 'readOnly', label: 'อ่านอย่างเดียว', inputType: 'checkbox' },
    ],
    label: [
        { key: 'value', label: 'ข้อความ', inputType: 'text' },
        { key: 'bold', label: 'ตัวหนา', inputType: 'checkbox' },
        { key: 'italic', label: 'ตัวเอียง', inputType: 'checkbox' },
        { key: 'fontSize', label: 'ขนาดตัวอักษร', inputType: 'text', placeholder: 'เช่น 18px' },
        { key: 'multiline', label: 'หลายบรรทัด', inputType: 'checkbox' },
    ],
    link: [
        { key: 'value', label: 'ข้อความลิงก์', inputType: 'text' },
        { key: 'href', label: 'URL', inputType: 'text', placeholder: 'https://...' },
        { key: 'target', label: 'เปิดในแท็บ', inputType: 'select', selectOptions: [
            { value: '_self', label: 'แท็บเดิม' },
            { value: '_blank', label: 'แท็บใหม่' },
        ]},
        { key: 'underline', label: 'ขีดเส้นใต้', inputType: 'checkbox' },
        { key: 'buttonStyle', label: 'แสดงแบบปุ่ม', inputType: 'checkbox' },
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
    ],
    image: [
        { key: 'value', label: 'URL รูปภาพ', inputType: 'text', placeholder: 'https://...' },
        { key: 'alt', label: 'Alt text', inputType: 'text', placeholder: 'คำอธิบายรูป' },
        { key: 'width', label: 'ความกว้าง', inputType: 'text', placeholder: 'เช่น 200px' },
        { key: 'height', label: 'ความสูง', inputType: 'text', placeholder: 'เช่น 120px' },
        { key: 'objectFit', label: 'การแสดงผล', inputType: 'select', selectOptions: [
            { value: 'cover', label: 'Cover (เติมเต็ม)' },
            { value: 'contain', label: 'Contain (พอดี)' },
            { value: 'fill', label: 'Fill (ยืด)' },
            { value: 'none', label: 'None (ขนาดจริง)' },
        ]},
        { key: 'borderRadius', label: 'มุมโค้ง', inputType: 'text', placeholder: 'เช่น 8px, 50%' },
        { key: 'shadow', label: 'เงา', inputType: 'checkbox' },
        { key: 'grayscale', label: 'ขาวดำ', inputType: 'checkbox' },
        { key: 'lazy', label: 'โหลดแบบ Lazy', inputType: 'checkbox' },
        { key: 'enlargeable', label: 'ขยายได้เมื่อคลิก', inputType: 'checkbox' },
    ],
    badge: [
        { key: 'value', label: 'ข้อความ', inputType: 'text' },
        { key: 'backgroundColor', label: 'สีพื้นหลัง', inputType: 'color' },
        { key: 'color', label: 'สีตัวอักษร', inputType: 'color' },
    ],
    icon: [
        { key: 'value', label: 'ไอคอน (emoji/text)', inputType: 'text', placeholder: 'เช่น ⭐ 🔥 ✅' },
        { key: 'fontSize', label: 'ขนาด', inputType: 'text', placeholder: 'เช่น 24px' },
        { key: 'color', label: 'สี', inputType: 'color' },
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
        { key: 'errorCorrectionLevel', label: 'ระดับ Error Correction', inputType: 'select', selectOptions: [
            { value: 'L', label: 'L (7%)' },
            { value: 'M', label: 'M (15%)' },
            { value: 'Q', label: 'Q (25%)' },
            { value: 'H', label: 'H (30%)' },
        ]},
        { key: 'margin', label: 'ขอบ (px)', inputType: 'number', placeholder: 'เช่น 4' },
    ],
    select: [
        { key: 'required', label: 'จำเป็น', inputType: 'checkbox' },
        { key: 'placeholder', label: 'Placeholder', inputType: 'text' },
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
    ],
    date: [
        { key: 'required', label: 'จำเป็น', inputType: 'checkbox' },
        { key: 'placeholder', label: 'Placeholder', inputType: 'text', placeholder: 'เช่น เลือกวันที่' },
        { key: 'min', label: 'วันที่ต่ำสุด', inputType: 'text', placeholder: 'เช่น 2024-01-01' },
        { key: 'max', label: 'วันที่สูงสุด', inputType: 'text', placeholder: 'เช่น 2030-12-31' },
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
        { key: 'readOnly', label: 'อ่านอย่างเดียว', inputType: 'checkbox' },
    ],
    datepicker: [
        { key: 'required', label: 'จำเป็น', inputType: 'checkbox' },
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
        { key: 'required', label: 'จำเป็น', inputType: 'checkbox' },
        { key: 'placeholder', label: 'Placeholder', inputType: 'text' },
        { key: 'searchable', label: 'ค้นหาได้', inputType: 'checkbox' },
        { key: 'clearable', label: 'ล้างค่าได้', inputType: 'checkbox' },
        { key: 'maxHeight', label: 'ความสูงสูงสุด', inputType: 'text', placeholder: 'เช่น 300px' },
        { key: 'displayField', label: 'แสดงผลจาก field', inputType: 'text', placeholder: 'เช่น label' },
    ],
    fileupload: [
        { key: 'required', label: 'จำเป็น', inputType: 'checkbox' },
        { key: 'maxFileSize', label: 'ขนาดไฟล์สูงสุด (bytes)', inputType: 'number', placeholder: 'เช่น 52428800 (50MB)' },
        { key: 'allowedTypes', label: 'ประเภทไฟล์ (comma)', inputType: 'text', placeholder: 'image/jpeg,image/png,application/pdf' },
        { key: 'buttonLabel', label: 'ข้อความปุ่ม', inputType: 'text', placeholder: 'Choose Files to Upload' },
        { key: 'chunkSize', label: 'ขนาด Chunk (bytes)', inputType: 'number', placeholder: 'เช่น 1048576 (1MB)' },
        { key: 'apiUrl', label: 'Upload API URL', inputType: 'text', placeholder: 'https://...' },
    ],
    button: [
        { key: 'value', label: 'ข้อความปุ่ม', inputType: 'text' },
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
    ],
    buttongroup: [
        { key: 'required', label: 'จำเป็น', inputType: 'checkbox' },
        { key: 'orientation', label: 'ทิศทาง', inputType: 'select', selectOptions: [
            { value: 'horizontal', label: 'แนวนอน' },
            { value: 'vertical', label: 'แนวตั้ง' },
        ]},
        { key: 'multiple', label: 'เลือกได้หลายปุ่ม', inputType: 'checkbox' },
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
    ],
    calendargrid: [
        { key: 'editable', label: 'แก้ไขได้', inputType: 'checkbox' },
    ],
    accordion: [
        { key: 'allowMultiple', label: 'เปิดได้หลายอันพร้อมกัน', inputType: 'checkbox' },
        { key: 'defaultOpen', label: 'เปิดอันแรกเป็นค่าเริ่มต้น', inputType: 'checkbox' },
    ],
    tabs: [
        { key: 'tabPosition', label: 'ตำแหน่งแท็บ', inputType: 'select', selectOptions: [
            { value: 'top', label: 'บน' },
            { value: 'bottom', label: 'ล่าง' },
            { value: 'left', label: 'ซ้าย' },
            { value: 'right', label: 'ขวา' },
        ]},
        { key: 'activeTab', label: 'แท็บที่เลือกเริ่มต้น', inputType: 'number', placeholder: 'เช่น 0' },
    ],
    card: [
        { key: 'columns', label: 'จำนวนคอลัมน์', inputType: 'number', placeholder: 'เช่น 3' },
        { key: 'gap', label: 'ระยะห่าง', inputType: 'text', placeholder: 'เช่น 20px' },
    ],
    tree: [
        { key: 'checkable', label: 'แสดง Checkbox', inputType: 'checkbox' },
        { key: 'showLine', label: 'แสดงเส้นเชื่อม', inputType: 'checkbox' },
        { key: 'multiple', label: 'เลือกได้หลายรายการ', inputType: 'checkbox' },
        { key: 'defaultExpanded', label: 'ขยายทั้งหมดเริ่มต้น', inputType: 'checkbox' },
        { key: 'disabled', label: 'ปิดใช้งาน', inputType: 'checkbox' },
    ],
    menu: [
        { key: 'orientation', label: 'ทิศทาง', inputType: 'select', selectOptions: [
            { value: 'vertical', label: 'แนวตั้ง' },
            { value: 'horizontal', label: 'แนวนอน' },
        ]},
        { key: 'collapsible', label: 'ยุบ/ขยายได้', inputType: 'checkbox' },
        { key: 'activeMenu', label: 'เมนูที่เลือกเริ่มต้น', inputType: 'text', placeholder: 'เช่น menu-1' },
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

export function getConfigKeys(controlType) {
    const fields = CONTROL_CONFIG_FIELDS[controlType];
    return fields ? fields.map(f => f.key) : [];
}

export function extractConfig(def, controlType) {
    const keys = getConfigKeys(controlType);
    const config = {};
    for (const k of keys) {
        if (def[k] !== undefined) config[k] = def[k];
    }
    if (def.showWhen) config.showWhen = def.showWhen;
    return config;
}

export const SHOW_WHEN_OPERATORS = [
    { value: 'eq', label: 'เท่ากับ' },
    { value: 'neq', label: 'ไม่เท่ากับ' },
    { value: 'notEmpty', label: 'มีค่า' },
    { value: 'empty', label: 'ว่าง' },
    { value: 'contains', label: 'มีคำว่า' },
    { value: 'gt', label: 'มากกว่า' },
    { value: 'lt', label: 'น้อยกว่า' },
];
