import { useState, useEffect } from 'react';
import ModalControl from '../components/controls/ModalControl';
import { useToast } from '../contexts/ToastContext';
import './ControlDesignerModal.css';

const CONTROL_TYPES = [
    // --- Input ---
    { value: 'textbox', label: 'Textbox' },
    { value: 'number', label: 'Number' },
    { value: 'password', label: 'Password' },
    { value: 'email', label: 'Email' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'toggle', label: 'Toggle' },
    { value: 'datepicker', label: 'Datepicker' },
    { value: 'slider', label: 'Slider' },
    { value: 'rating', label: 'Rating' },
    { value: 'file', label: 'File' },
    { value: 'searchbox', label: 'SearchBox' },
    { value: 'multipleupload', label: 'MultiUpload' },
    // --- Display ---
    { value: 'label', label: 'Label' },
    { value: 'link', label: 'Link' },
    { value: 'image', label: 'Image' },
    { value: 'badge', label: 'Badge' },
    { value: 'icon', label: 'Icon' },
    { value: 'progress', label: 'Progress' },
    { value: 'qrcode', label: 'QR Code' },
    { value: 'calendar', label: 'Calendar' },
    { value: 'calendargrid', label: 'CalendarGrid' },
    { value: 'button', label: 'Button' },
    { value: 'buttongroup', label: 'ButtonGroup' },
    // --- Layout ---
    { value: 'accordion', label: 'Accordion' },
    { value: 'tab', label: 'Tab' },
    { value: 'card', label: 'Card' },
    { value: 'tree', label: 'Tree' },
    { value: 'menu', label: 'Menu' },
    { value: 'gridview', label: 'GridView' },
    { value: 'tableview', label: 'TableView' },
    { value: 'form', label: 'Form' },
    { value: 'crud', label: 'CRUD' },
    { value: 'modal', label: 'Modal' },
    { value: 'pagination', label: 'Pagination' },
    // --- Charts ---
    { value: 'chart', label: 'Chart' },
    { value: 'barchart', label: 'Bar Chart' },
    { value: 'linechart', label: 'Line Chart' },
    { value: 'piechart', label: 'Pie Chart' },
    { value: 'doughnutchart', label: 'Doughnut' },
    { value: 'radarchart', label: 'Radar' },
    { value: 'areachart', label: 'Area Chart' },
    { value: 'bubblechart', label: 'Bubble Chart' },
    { value: 'mixedchart', label: 'Mixed Chart' },
];

const CONTROL_TO_FIELD_TYPE = {
    textbox: 'string',
    number: 'number',
    password: 'password',
    email: 'email',
    dropdown: 'select',
    checkbox: 'boolean',
    toggle: 'toggle',
    datepicker: 'datepicker',
    slider: 'slider',
    rating: 'rating',
    file: 'file',
    searchbox: 'searchbox',
    multipleupload: 'multipleupload',
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
    chart: 'chart',
    barchart: 'barchart',
    linechart: 'linechart',
    piechart: 'piechart',
    doughnutchart: 'doughnutchart',
    radarchart: 'radarchart',
    areachart: 'areachart',
    bubblechart: 'bubblechart',
    mixedchart: 'mixedchart',
};

const FIELD_TO_CONTROL_TYPE = {
    string: 'textbox',
    number: 'number',
    password: 'password',
    email: 'email',
    select: 'dropdown',
    boolean: 'checkbox',
    toggle: 'toggle',
    date: 'datepicker',
    datepicker: 'datepicker',
    slider: 'slider',
    rating: 'rating',
    file: 'file',
    searchbox: 'searchbox',
    multipleupload: 'multipleupload',
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
    chart: 'chart',
    barchart: 'barchart',
    linechart: 'linechart',
    piechart: 'piechart',
    doughnutchart: 'doughnutchart',
    radarchart: 'radarchart',
    areachart: 'areachart',
    bubblechart: 'bubblechart',
    mixedchart: 'mixedchart',
};

function createEmptyControl() {
    return {
        id: Date.now() + Math.random(),
        label: '',
        databind: '',
        controlType: 'textbox',
        options: [],
        defaultSelect: '',
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
        return {
            id: Date.now() + Math.random(),
            label: fc?.label || def.label || key,
            databind: key,
            controlType: FIELD_TO_CONTROL_TYPE[def.type] || 'textbox',
            options: def.type === 'select' && def.enum
                ? def.enum.map(v => typeof v === 'object' ? { key: String(v.value), value: v.label } : { key: v, value: v })
                : [],
            defaultSelect: '',
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
        if (ctrl.controlType === 'dropdown' && ctrl.options.length > 0) {
            def.enum = ctrl.options
                .filter(o => o.key || o.value)
                .map(o => ({ label: o.value || o.key, value: isNaN(Number(o.key)) ? o.key : Number(o.key) }));
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
                placeholder: '',
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
                                        if (e.target.value === 'dropdown' && ctrl.options.length === 0) {
                                            addOption(idx);
                                        }
                                    }}
                                >
                                    {CONTROL_TYPES.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                                <div className="cd-row-actions">
                                    <button onClick={() => moveControl(idx, 'up')} disabled={idx === 0} title="ขึ้น">&#8593;</button>
                                    <button onClick={() => moveControl(idx, 'down')} disabled={idx === controls.length - 1} title="ลง">&#8595;</button>
                                    <button onClick={() => removeControl(idx)} disabled={controls.length <= 1} className="cd-btn-remove" title="ลบ">&#10005;</button>
                                </div>
                            </div>

                            {ctrl.controlType === 'dropdown' && (
                                <div className="cd-options-panel">
                                    <div className="cd-options-title">ตัวเลือก Dropdown</div>
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
                        </div>
                    );
                })}

                <button className="cd-btn-add-control" onClick={addControl}>+ เพิ่ม Control</button>
            </div>
        </ModalControl>
    );
}

export default ControlDesignerModal;
