import { useState, useEffect } from 'react';
import ModalControl from '../components/controls/ModalControl';
import './ControlDesignerModal.css';

const CONTROL_TYPES = [
    { value: 'textbox', label: 'Textbox' },
    { value: 'number', label: 'Number' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'datepicker', label: 'Datepicker' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'email', label: 'Email' },
    { value: 'file', label: 'File' },
];

const CONTROL_TO_FIELD_TYPE = {
    textbox: 'string',
    number: 'number',
    dropdown: 'select',
    datepicker: 'date',
    checkbox: 'boolean',
    email: 'email',
    file: 'file',
};

const FIELD_TO_CONTROL_TYPE = {
    string: 'textbox',
    number: 'number',
    select: 'dropdown',
    date: 'datepicker',
    boolean: 'checkbox',
    email: 'email',
    file: 'file',
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
    return Object.entries(schemaJson).map(([key, def]) => {
        const fc = formControls.find(c => c.key === key);
        return {
            id: Date.now() + Math.random(),
            label: fc?.label || def.label || key,
            databind: key,
            controlType: FIELD_TO_CONTROL_TYPE[def.type] || 'textbox',
            options: def.type === 'select' && def.enum
                ? def.enum.map(v => ({ key: v, value: v }))
                : [],
            defaultSelect: '',
        };
    });
}

function controlsToSchema(controls) {
    const json = {};
    for (const ctrl of controls) {
        if (!ctrl.databind.trim()) continue;
        const fieldType = CONTROL_TO_FIELD_TYPE[ctrl.controlType] || 'string';
        const def = { type: fieldType };
        if (ctrl.label.trim()) def.label = ctrl.label.trim();
        if (ctrl.controlType === 'dropdown' && ctrl.options.length > 0) {
            def.enum = ctrl.options.map(o => o.value || o.key).filter(Boolean);
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

function ControlDesignerModal({ isOpen, onClose, onSave, schemaName, schemaJson, formcfgJson }) {
    const [name, setName] = useState('');
    const [controls, setControls] = useState([createEmptyControl()]);

    useEffect(() => {
        if (isOpen) {
            setName(schemaName || '');
            setControls(schemaToControls(schemaJson, formcfgJson));
        }
    }, [isOpen, schemaName, schemaJson, formcfgJson]);

    const updateControl = (idx, field, value) => {
        setControls(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
    };

    const addControl = () => {
        setControls(prev => [...prev, createEmptyControl()]);
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
        const validControls = controls.filter(c => c.databind.trim());
        if (validControls.length === 0) return;
        const json = controlsToSchema(validControls);
        const formcfg = controlsToFormcfg(validControls);
        onSave({ name: name.trim() || 'ฟอร์มใหม่', json, formcfg });
    };

    const hasErrors = controls.every(c => !c.databind.trim());

    return (
        <ModalControl
            isOpen={isOpen}
            title={schemaJson ? 'แก้ไขแม่แบบฟอร์ม' : 'สร้างแม่แบบฟอร์มใหม่'}
            onClose={onClose}
            size="lg"
            className="cd-modal"
            footer={
                <div className="cd-footer">
                    <button className="fb-mode-btn" onClick={onClose}>ยกเลิก</button>
                    <button className="fb-mode-btn active" onClick={handleSave} disabled={hasErrors}>บันทึก</button>
                </div>
            }
        >
            <div className="cd-body">
                <div className="cd-name-row">
                    <label className="cd-label">ชื่อแม่แบบ</label>
                    <input
                        className="cd-input cd-name-input"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="เช่น แบบสำรวจความพึงพอใจ"
                    />
                </div>

                <div className="cd-controls-header">
                    <span className="cd-col-label">ชื่อช่องกรอก</span>
                    <span className="cd-col-databind">Databind</span>
                    <span className="cd-col-type">ชนิด Control</span>
                    <span className="cd-col-actions"></span>
                </div>

                {controls.map((ctrl, idx) => (
                    <div key={ctrl.id} className="cd-control-row">
                        <div className="cd-control-main">
                            <span className="cd-row-num">{idx + 1}</span>
                            <input
                                className="cd-input cd-col-label"
                                value={ctrl.label}
                                onChange={e => updateControl(idx, 'label', e.target.value)}
                                placeholder="ชื่อที่แสดง"
                            />
                            <input
                                className="cd-input cd-col-databind"
                                value={ctrl.databind}
                                onChange={e => updateControl(idx, 'databind', e.target.value)}
                                placeholder="field_key"
                            />
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
                                <div className="cd-default-row">
                                    <label>Default:</label>
                                    <select
                                        className="cd-select cd-default-select"
                                        value={ctrl.defaultSelect}
                                        onChange={e => updateControl(idx, 'defaultSelect', e.target.value)}
                                    >
                                        <option value="">-- ไม่มี --</option>
                                        {ctrl.options.filter(o => o.key).map((o, i) => (
                                            <option key={i} value={o.key}>{o.value || o.key}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <button className="cd-btn-add-control" onClick={addControl}>+ เพิ่ม Control</button>
            </div>
        </ModalControl>
    );
}

export default ControlDesignerModal;
