import { useState, useEffect, useRef } from 'react';
import { FIELD_TYPES, addField, removeField, updateField, reorderField, getFieldEntries, validateSchema } from '../lib/schema';
import { useToast } from '../contexts/ToastContext';

function KeyInput({ value, onCommit, hasError, onBlur }) {
    const [draft, setDraft] = useState(value);
    const prev = useRef(value);
    useEffect(() => { if (value !== prev.current) { setDraft(value); prev.current = value; } }, [value]);
    const commit = () => {
        const trimmed = draft.trim();
        if (trimmed && trimmed !== value) onCommit(trimmed);
        else setDraft(value);
        if (onBlur) onBlur();
    };
    return (
        <div className="cd-field-wrapper">
            <input
                className={`field-key-input ${hasError ? 'error' : ''}`}
                style={hasError ? { borderColor: 'var(--error)', backgroundColor: 'var(--error-light)' } : {}}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onBlur={commit}
                placeholder="key"
            />
            {hasError && <div className="error-msg">กรุณากรอก</div>}
        </div>
    );
}

const CONTROL_CONFIGS = {
    string: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'ข้อความแสดงตอนช่องว่าง เช่น "กรอกชื่อ"' },
        { key: 'maxLength', label: 'Max Length', type: 'number', hint: 'จำกัดตัวอักษรสูงสุดที่พิมพ์ได้' },
    ],
    number: [
        { key: 'min', label: 'Min', type: 'number', hint: 'ค่าต่ำสุดที่อนุญาต' },
        { key: 'max', label: 'Max', type: 'number', hint: 'ค่าสูงสุดที่อนุญาต' },
        { key: 'step', label: 'Step', type: 'number', hint: 'กดปุ่ม +/- เพิ่ม-ลดครั้งละเท่าไหร่ เช่น 5' },
    ],
    password: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'ข้อความแสดงตอนช่องว่าง' },
        { key: 'showStrength', label: 'Show Strength', type: 'toggle', hint: 'แสดงแถบวัดความแข็งแรงของรหัสผ่าน' },
        { key: 'minLength', label: 'Min Length', type: 'number', hint: 'จำนวนตัวอักษรขั้นต่ำ' },
    ],
    email: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'เช่น "name@example.com"' },
    ],
    select: [
        { key: 'enum', label: 'Options', type: 'options', hint: 'ตัวเลือกในดรอปดาวน์' },
    ],
    boolean: [
        { key: 'value', label: 'Default', type: 'toggle', hint: 'ค่าเริ่มต้น checked หรือไม่' },
    ],
    toggle: [
        { key: 'value', label: 'Default', type: 'toggle', hint: 'ค่าเริ่มต้น เปิด/ปิด' },
    ],
    date: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'เช่น "วว/ดด/ปปปป"' },
    ],
    datepicker: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'เช่น "เลือกวันที่"' },
    ],
    slider: [
        { key: 'min', label: 'Min', type: 'number', hint: 'ค่าต่ำสุดของแถบเลื่อน' },
        { key: 'max', label: 'Max', type: 'number', hint: 'ค่าสูงสุดของแถบเลื่อน' },
        { key: 'step', label: 'Step', type: 'number', hint: 'เลื่อนครั้งละเท่าไหร่ เช่น 10' },
        { key: 'value', label: 'Default', type: 'number', hint: 'ค่าเริ่มต้นของแถบเลื่อน' },
    ],
    rating: [
        { key: 'max', label: 'Max Stars', type: 'number', hint: 'จำนวนดาวสูงสุด (default: 5)' },
        { key: 'value', label: 'Default', type: 'number', hint: 'จำนวนดาวเริ่มต้น' },
    ],
    file: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'ข้อความแสดงตอนยังไม่เลือกไฟล์' },
    ],
    searchbox: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'เช่น "ค้นหาและเลือก..."' },
        { key: 'multiple', label: 'Multiple', type: 'toggle', hint: 'เลือกได้หลายค่า' },
        { key: 'allowCreate', label: 'Allow Create', type: 'toggle', hint: 'อนุญาตให้สร้างค่าใหม่ที่ไม่มีในรายการ' },
    ],
    multipleupload: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'ข้อความแสดงตอนยังไม่เลือกไฟล์' },
    ],
    label: [
        { key: 'value', label: 'Text', type: 'text', hint: 'ข้อความที่แสดง (ถ้าไม่ผูก databind)' },
    ],
    link: [
        { key: 'value', label: 'Text', type: 'text', hint: 'ข้อความลิงก์ที่แสดง' },
        { key: 'href', label: 'URL', type: 'text', hint: 'URL ปลายทาง เช่น "https://..."' },
    ],
    image: [
        { key: 'value', label: 'Image URL', type: 'text', hint: 'URL ของรูปภาพ' },
        { key: 'width', label: 'Width', type: 'text', hint: 'ความกว้าง เช่น "200px"' },
        { key: 'height', label: 'Height', type: 'text', hint: 'ความสูง เช่น "120px"' },
        { key: 'borderRadius', label: 'Border Radius', type: 'text', hint: 'มุมโค้ง เช่น "50%" = วงกลม' },
        { key: 'objectFit', label: 'Object Fit', type: 'text', hint: 'วิธีแสดงรูป: cover, contain, fill' },
        { key: 'shadow', label: 'Shadow', type: 'toggle', hint: 'แสดงเงาใต้รูป' },
    ],
    badge: [
        { key: 'value', label: 'Text', type: 'text', hint: 'ข้อความใน badge' },
    ],
    icon: [
        { key: 'value', label: 'Icon', type: 'text', hint: 'emoji หรือ icon เช่น "⭐"' },
    ],
    progress: [
        { key: 'value', label: 'Value (%)', type: 'number', hint: 'เปอร์เซ็นต์ 0-100' },
        { key: 'showValue', label: 'Show Value', type: 'toggle', hint: 'แสดงตัวเลข % บนแถบ' },
        { key: 'color', label: 'Color', type: 'text', hint: 'สีแถบ เช่น "#3b82f6"' },
    ],
    qrcode: [
        { key: 'value', label: 'QR Data', type: 'text', hint: 'ข้อมูลที่เข้ารหัส เช่น URL' },
        { key: 'width', label: 'Width', type: 'number', hint: 'ความกว้าง (px)' },
        { key: 'height', label: 'Height', type: 'number', hint: 'ความสูง (px)' },
    ],
    calendar: [],
    calendargrid: [],
    button: [
        { key: 'value', label: 'Button Text', type: 'text', hint: 'ข้อความบนปุ่ม' },
    ],
    buttongroup: [
        { key: 'enum', label: 'Buttons', type: 'options', hint: 'รายการปุ่ม' },
    ],
    accordion: [],
    tab:      [],
    card:     [],
    tree:     [],
    menu:     [],
    gridview: [],
    tableview: [],
    form:     [],
    crud:     [],
    modal: [
        { key: 'value', label: 'Button Text', type: 'text', hint: 'ข้อความปุ่มเปิด modal' },
    ],
    pagination: [
        { key: 'total', label: 'Total Pages', type: 'number', hint: 'จำนวนหน้าทั้งหมด' },
    ],
    chart:    [],
    barchart: [],
    linechart: [],
    piechart: [],
    doughnutchart: [],
    radarchart: [],
    areachart: [],
    bubblechart: [],
    mixedchart: [],
};

function normalizeOption(opt) {
    if (typeof opt === 'string') return { label: opt, value: opt };
    if (typeof opt === 'number') return { label: String(opt), value: opt };
    return opt;
}

function OptionEditor({ options: rawOptions, onChange }) {
    const options = rawOptions.map(normalizeOption);
    const handleAdd = () => {
        const idx = options.length;
        onChange([...options, { label: `ตัวเลือก ${idx + 1}`, value: idx }]);
    };
    const handleRemove = (i) => onChange(options.filter((_, j) => j !== i));
    const handleChange = (i, field, val) => {
        const next = options.map((o, j) => j === i ? { ...o, [field]: val } : o);
        onChange(next);
    };

    return (
        <div className="sb-option-editor">
            {options.map((opt, i) => (
                <div key={i} className="sb-option-row">
                    <input
                        className="sb-option-input"
                        value={opt.label || ''}
                        onChange={e => handleChange(i, 'label', e.target.value)}
                        placeholder="Label"
                    />
                    <input
                        className="sb-option-input sb-option-value"
                        value={opt.value ?? ''}
                        onChange={e => {
                            const v = e.target.value;
                            handleChange(i, 'value', isNaN(Number(v)) ? v : Number(v));
                        }}
                        placeholder="Value"
                    />
                    <button className="sb-option-remove" onClick={() => handleRemove(i)} title="ลบ">✕</button>
                </div>
            ))}
            <button className="sb-option-add" onClick={handleAdd}>+ เพิ่มตัวเลือก</button>
        </div>
    );
}

function FieldConfigPanel({ fieldKey, fieldDef, onUpdate }) {
    if (!fieldKey) {
        return (
            <div className="sb-config-panel sb-config-empty">
                <div className="sb-config-empty-icon">←</div>
                <p>เลือก Field เพื่อแก้ไขคุณสมบัติ</p>
            </div>
        );
    }

    const typeInfo = FIELD_TYPES.find(t => t.value === fieldDef.type) || {};
    const configs = CONTROL_CONFIGS[fieldDef.type] || [];

    const handlePropChange = (propKey, value) => {
        onUpdate(fieldKey, { ...fieldDef, [propKey]: value });
    };

    return (
        <div className="sb-config-panel">
            <div className="sb-config-header">
                <span className="sb-config-icon">{typeInfo.icon}</span>
                <span className="sb-config-title">{typeInfo.label || fieldDef.type}</span>
            </div>
            <div className="sb-config-field-name">
                <span className="sb-config-label">Key</span>
                <code className="sb-config-key">{fieldKey}</code>
            </div>

            {configs.length === 0 && (
                <div className="sb-config-no-props">ไม่มีคุณสมบัติเพิ่มเติม</div>
            )}

            {configs.map(cfg => (
                <div key={cfg.key} className="sb-config-row">
                    <label className="sb-config-label">{cfg.label}</label>
                    {cfg.type === 'text' && (
                        <input
                            className="sb-config-input"
                            value={fieldDef[cfg.key] || ''}
                            onChange={e => handlePropChange(cfg.key, e.target.value)}
                            placeholder={cfg.label}
                        />
                    )}
                    {cfg.type === 'number' && (
                        <input
                            className="sb-config-input"
                            type="number"
                            value={fieldDef[cfg.key] ?? ''}
                            onChange={e => {
                                const v = e.target.value;
                                handlePropChange(cfg.key, v === '' ? undefined : Number(v));
                            }}
                            placeholder={cfg.label}
                        />
                    )}
                    {cfg.type === 'toggle' && (
                        <label className="sb-config-toggle">
                            <input
                                type="checkbox"
                                checked={!!fieldDef[cfg.key]}
                                onChange={e => handlePropChange(cfg.key, e.target.checked)}
                            />
                            <span className="sb-toggle-slider"></span>
                        </label>
                    )}
                    {cfg.type === 'options' && (
                        <OptionEditor
                            options={fieldDef.enum || []}
                            onChange={opts => handlePropChange('enum', opts)}
                        />
                    )}
                    {cfg.hint && <div className="sb-config-hint">{cfg.hint}</div>}
                </div>
            ))}
        </div>
    );
}

function SchemaBuilder({ schemaJson, onChange }) {
    const { showToast } = useToast();
    const [draft, setDraft] = useState(schemaJson);
    const [isDirty, setIsDirty] = useState(false);
    const [touchedFields, setTouchedFields] = useState({});
    const [selectedKey, setSelectedKey] = useState(null);

    useEffect(() => {
        setDraft(schemaJson);
        setIsDirty(false);
        setTouchedFields({});
        setSelectedKey(null);
    }, [schemaJson]);

    const fields = getFieldEntries(draft);
    const selectedDef = selectedKey ? draft[selectedKey] : null;

    const markTouched = (idx, field) => {
        setTouchedFields(prev => ({
            ...prev,
            [idx]: { ...(prev[idx] || {}), [field]: true }
        }));
    };

    const updateDraft = (newJson) => { setDraft(newJson); setIsDirty(true); };

    const handleSave = () => {
        const allTouched = {};
        fields.forEach((_, i) => { allTouched[i] = { key: true, label: true }; });
        setTouchedFields(allTouched);

        const entries = getFieldEntries(draft);
        if (entries.some(([k]) => !k.trim())) {
            showToast('กรุณาระบุชื่อ Key ให้ครบทุกฟิลด์', 'error');
            return;
        }
        if (entries.some(([_, def]) => !def.label?.trim())) {
            showToast('กรุณาระบุชื่อ Label ให้ครบทุกฟิลด์', 'error');
            return;
        }
        const internalErrors = validateSchema(draft);
        if (internalErrors.length > 0) {
            showToast(internalErrors[0], 'error');
            return;
        }
        onChange(draft);
        setIsDirty(false);
        showToast('บันทึกโครงสร้างแม่แบบเรียบร้อยแล้ว', 'success');
    };

    const handleCancel = () => { setDraft(schemaJson); setIsDirty(false); setSelectedKey(null); };

    const handleAddField = () => {
        const idx = fields.length + 1;
        let key = `field_${idx}`;
        while (draft[key]) key = `field_${idx}_${Date.now()}`;
        updateDraft(addField(draft, key, 'string'));
        setSelectedKey(key);
    };

    const handleRemoveField = (key) => {
        if (selectedKey === key) setSelectedKey(null);
        updateDraft(removeField(draft, key));
    };

    const handleUpdateKey = (oldKey, newKey) => {
        if (!newKey.trim()) return;
        if (newKey !== oldKey && draft[newKey]) {
            showToast(`ชื่อ Key "${newKey}" มีอยู่แล้ว`, 'warning');
            return;
        }
        updateDraft(updateField(draft, oldKey, newKey, draft[oldKey]));
        if (selectedKey === oldKey) setSelectedKey(newKey);
    };

    const handleUpdateType = (key, type) => {
        const def = { ...draft[key], type };
        if (type === 'select' && !def.enum) def.enum = [{ label: 'ตัวเลือก 1', value: 0 }, { label: 'ตัวเลือก 2', value: 1 }];
        if (type === 'buttongroup' && !def.enum) def.enum = [{ label: 'Option A', value: 0 }, { label: 'Option B', value: 1 }];
        if (type !== 'select' && type !== 'buttongroup') delete def.enum;
        updateDraft(updateField(draft, key, key, def));
    };

    const handleUpdateLabel = (key, label) => {
        updateDraft(updateField(draft, key, key, { ...draft[key], label }));
    };

    const handleConfigUpdate = (key, newDef) => {
        updateDraft(updateField(draft, key, key, newDef));
    };

    const dragItem = useRef(null);
    const dragOverItem = useRef(null);
    const [dragIdx, setDragIdx] = useState(null);
    const [dragOverIdx, setDragOverIdx] = useState(null);

    const handleDragStart = (idx) => { dragItem.current = idx; setDragIdx(idx); };
    const handleDragEnter = (idx) => { dragOverItem.current = idx; setDragOverIdx(idx); };
    const handleDragEnd = () => {
        if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
            updateDraft(reorderField(draft, dragItem.current, dragOverItem.current));
        }
        dragItem.current = null; dragOverItem.current = null;
        setDragIdx(null); setDragOverIdx(null);
    };

    const errors = validateSchema(draft);

    return (
        <div className="sb-layout">
            <div className="sb-field-list">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ marginTop: 0 }}>กำหนด Fields ({fields.length} fields)</h3>
                    {isDirty && <span style={{ fontSize: 12, color: 'var(--accent-primary)' }}>* มีการเปลี่ยนแปลง</span>}
                </div>

                {fields.map(([key, def], idx) => {
                    const touched = touchedFields[idx] || {};
                    const hasLabelError = touched.label && !def.label?.trim();
                    const hasKeyError = touched.key && !key.trim();
                    const isDragging = dragIdx === idx;
                    const isOver = dragOverIdx === idx && dragIdx !== idx;
                    const isSelected = selectedKey === key;

                    return (
                        <div
                            key={idx}
                            className={`fb-field-card ${isDragging ? 'dragging' : ''} ${isOver ? 'drag-over' : ''} ${isSelected ? 'selected' : ''}`}
                            draggable
                            onDragStart={() => handleDragStart(idx)}
                            onDragEnter={() => handleDragEnter(idx)}
                            onDragOver={e => e.preventDefault()}
                            onDragEnd={handleDragEnd}
                            onClick={() => setSelectedKey(key)}
                        >
                            <span className="field-drag">⠿</span>
                            <div className="field-info">
                                <div className="cd-field-wrapper">
                                    <label className="sb-field-label">ชื่อช่องกรอก (Label)</label>
                                    <input
                                        className={`field-label-input ${hasLabelError ? 'error' : ''}`}
                                        style={hasLabelError ? { borderColor: 'var(--error)', backgroundColor: 'var(--error-light)' } : {}}
                                        value={def.label || ''}
                                        onChange={e => handleUpdateLabel(key, e.target.value)}
                                        onBlur={() => markTouched(idx, 'label')}
                                        placeholder="เช่น ชื่อ-นามสกุล"
                                    />
                                    {hasLabelError && <div className="error-msg">กรุณากรอก</div>}
                                </div>
                                <div className="cd-field-wrapper">
                                    <label className="sb-field-label">ผูกข้อมูล (Key)</label>
                                    <KeyInput
                                        value={key}
                                        onCommit={newKey => handleUpdateKey(key, newKey)}
                                        hasError={hasKeyError}
                                        onBlur={() => markTouched(idx, 'key')}
                                    />
                                </div>
                                <div className="cd-field-wrapper">
                                    <label className="sb-field-label">ชนิด Control</label>
                                    <select className="field-type-select" value={def.type} onChange={e => handleUpdateType(key, e.target.value)}>
                                        {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="fb-field-actions">
                                <button onClick={(e) => { e.stopPropagation(); handleRemoveField(key); }} title="ลบ" className="fb-delete-btn">✕</button>
                            </div>
                        </div>
                    );
                })}

                <button className="fb-add-field-btn" onClick={handleAddField}>+ เพิ่ม Field</button>

                {errors.length > 0 && (
                    <div style={{ marginTop: 12, padding: 12, borderRadius: 6, background: '#e74c3c15', border: '1px solid #e74c3c40', fontSize: 13 }}>
                        {errors.map((e, i) => <div key={i} style={{ color: '#e74c3c' }}>{e}</div>)}
                    </div>
                )}

                <div className="fb-builder-actions">
                    <button className="fb-mode-btn" onClick={handleCancel} disabled={!isDirty}>ยกเลิก</button>
                    <button className="fb-mode-btn active" onClick={handleSave} disabled={!isDirty || errors.length > 0}>บันทึก</button>
                </div>
            </div>

            <FieldConfigPanel
                fieldKey={selectedKey}
                fieldDef={selectedDef}
                onUpdate={handleConfigUpdate}
            />
        </div>
    );
}

export default SchemaBuilder;
