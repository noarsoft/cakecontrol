/**
 * controlTypeMap.js
 *
 * Single source of truth for control type ↔ field type mappings.
 * Used by: ControlDesignerModal, schemaTransform, SchemaBuilder
 *
 * genControl() in TableviewControl.jsx accepts multiple aliases per control
 * (e.g. 'bar', 'barchartjs', 'chartsbar' all render BarChartJSControl).
 * This module defines the canonical names used by each layer.
 */

// Dropdown options for ControlDesignerModal type selector
export const CONTROL_TYPES = [
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

// Control dropdown value → schema field type (for saving to data_schema)
export const CONTROL_TO_FIELD_TYPE = {
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

// Schema field type → control dropdown value (for ControlDesignerModal)
export const FIELD_TO_CONTROL_TYPE = {
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
    // Legacy types from SchemaBuilder (first-commit compat)
    password: 'password',
    email: 'textbox',
    file: 'textbox',
    searchbox: 'searchbox',
    multipleupload: 'multipleupload',
    calendar: 'calendar',
};

// Schema field type → genControl type (for schemaTransform rendering)
// Chart types map to short aliases that genControl accepts
export const FIELD_TO_GENCONTROL_TYPE = {
    ...FIELD_TO_CONTROL_TYPE,
    chartsbar: 'bar',
    chartsline: 'line',
    chartspie: 'pie',
    chartsdoughnut: 'doughnut',
    chartsradar: 'radar',
    chartsarea: 'area',
    chartsbubble: 'bubble',
    chartsmixed: 'mixed',
};

export function fieldTypeToControlType(fieldType) {
    return FIELD_TO_CONTROL_TYPE[fieldType] || 'textbox';
}

export function fieldTypeToGenControlType(fieldType) {
    return FIELD_TO_GENCONTROL_TYPE[fieldType] || 'textbox';
}
