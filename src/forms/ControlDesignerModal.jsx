import { useState, useEffect } from 'react';
import ModalControl from '../components/controls/ModalControl';
import Button from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';
import { FIELD_TYPES } from '../lib/schema';
import { CONTROL_TYPES, CONTROL_TO_FIELD_TYPE, FIELD_TO_CONTROL_TYPE } from '../lib/controlTypeMap';
import { CONTROL_CONFIG_FIELDS, getConfigKeys, extractConfig, SHOW_WHEN_OPERATORS } from './controlConfigFields';
import './ControlDesignerModal.css';

const DISABLED_FIELD_VALUES = new Set(
    FIELD_TYPES.filter(t => !t.enabled).map(t => t.value)
);
const ENABLED_CONTROL_TYPES = CONTROL_TYPES.filter(t => {
    const fieldValue = CONTROL_TO_FIELD_TYPE[t.value] || t.value;
    return !DISABLED_FIELD_VALUES.has(fieldValue);
});

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
    const sortedSchema = Object.entries(schemaJson).filter(([k]) => !k.startsWith('_')).sort(([keyA, a], [keyB, b]) => {
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

    const updateShowWhen = (idx, showWhenOrNull) => {
        setControls(prev => prev.map((c, i) => {
            if (i !== idx) return c;
            if (showWhenOrNull) {
                return { ...c, config: { ...c.config, showWhen: showWhenOrNull } };
            }
            const { showWhen: _, ...restConfig } = c.config;
            return { ...c, config: restConfig };
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
                    <Button variant="secondary" onClick={onClose}>ยกเลิก</Button>
                    <Button variant="primary" onClick={handleSave}>บันทึก</Button>
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
                    const showWhen = ctrl.config?.showWhen;
                    const otherControls = controls.filter((c, i) => i !== idx && c.databind.trim());
                    const targetCtrl = showWhen ? controls.find(c => c.databind === showWhen.field) : null;
                    const isBooleanTarget = targetCtrl && (targetCtrl.controlType === 'checkbox' || targetCtrl.controlType === 'toggle');
                    const needsValue = showWhen && showWhen.op !== 'empty' && showWhen.op !== 'notEmpty';

                    return (
                        <div key={ctrl.id} className={`cd-control-row ${labelError || keyError ? 'has-error' : ''}`}>
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

                            {!isLayoutMode && (
                                <div className="cd-showwhen-panel">
                                    <div className="cd-showwhen-toggle">
                                        <input
                                            type="checkbox"
                                            checked={!!showWhen}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    const firstOther = otherControls[0];
                                                    const firstIsBool = firstOther && (firstOther.controlType === 'checkbox' || firstOther.controlType === 'toggle');
                                                    updateShowWhen(idx, { field: firstOther?.databind || '', op: 'eq', value: firstIsBool ? true : '' });
                                                } else {
                                                    updateShowWhen(idx, null);
                                                }
                                            }}
                                        />
                                        <span className="cd-showwhen-text">แสดงตามเงื่อนไข (showWhen)</span>
                                    </div>

                                    {showWhen && (
                                        <div className="cd-showwhen-fields">
                                            <div className="cd-showwhen-field">
                                                <label className="cd-config-label">เมื่อช่อง</label>
                                                <select
                                                    className="cd-select"
                                                    value={showWhen.field || ''}
                                                    onChange={e => {
                                                        const newField = e.target.value;
                                                        const newTarget = controls.find(c => c.databind === newField);
                                                        const newIsBool = newTarget && (newTarget.controlType === 'checkbox' || newTarget.controlType === 'toggle');
                                                        const val = newIsBool && typeof showWhen.value !== 'boolean' ? true
                                                            : !newIsBool && typeof showWhen.value === 'boolean' ? ''
                                                            : showWhen.value;
                                                        updateShowWhen(idx, { ...showWhen, field: newField, value: val });
                                                    }}
                                                >
                                                    <option value="">-- เลือกช่อง --</option>
                                                    {otherControls.map(c => (
                                                        <option key={c.databind} value={c.databind}>
                                                            {c.label || c.databind}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="cd-showwhen-field">
                                                <label className="cd-config-label">เงื่อนไข</label>
                                                <select
                                                    className="cd-select"
                                                    value={showWhen.op || 'eq'}
                                                    onChange={e => updateShowWhen(idx, { ...showWhen, op: e.target.value })}
                                                >
                                                    {SHOW_WHEN_OPERATORS.map(op => (
                                                        <option key={op.value} value={op.value}>{op.label}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {needsValue && (
                                                <div className="cd-showwhen-field">
                                                    <label className="cd-config-label">ค่า</label>
                                                    {isBooleanTarget ? (
                                                        <select
                                                            className="cd-select"
                                                            value={String(showWhen.value ?? '')}
                                                            onChange={e => updateShowWhen(idx, { ...showWhen, value: e.target.value === 'true' })}
                                                        >
                                                            <option value="true">เปิด (true)</option>
                                                            <option value="false">ปิด (false)</option>
                                                        </select>
                                                    ) : (
                                                        <input
                                                            className="cd-input"
                                                            value={showWhen.value ?? ''}
                                                            onChange={e => updateShowWhen(idx, { ...showWhen, value: e.target.value })}
                                                            placeholder="ค่าที่ต้องเปรียบเทียบ"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
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
