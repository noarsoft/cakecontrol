import { useState, useEffect, useRef } from 'react';
import { FIELD_TYPES, addField, removeField, updateField, moveField, getFieldEntries, validateSchema } from '../lib/schema';
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

function SchemaBuilder({ schemaJson, onChange }) {
    const { showToast } = useToast();
    const [draft, setDraft] = useState(schemaJson);
    const [isDirty, setIsDirty] = useState(false);
    const [touchedFields, setTouchedFields] = useState({}); // { index: { key: bool, label: bool } }

    useEffect(() => {
        setDraft(schemaJson);
        setIsDirty(false);
        setTouchedFields({});
    }, [schemaJson]);

    const fields = getFieldEntries(draft);

    const markTouched = (idx, field) => {
        setTouchedFields(prev => ({
            ...prev,
            [idx]: { ...(prev[idx] || {}), [field]: true }
        }));
    };

    const updateDraft = (newJson) => { setDraft(newJson); setIsDirty(true); };
    
    const handleSave = () => {
        // Mark all as touched for final check
        const allTouched = {};
        fields.forEach((_, i) => {
            allTouched[i] = { key: true, label: true };
        });
        setTouchedFields(allTouched);

        const entries = getFieldEntries(draft);
        const emptyKey = entries.some(([k]) => !k.trim());
        const emptyLabel = entries.some(([_, def]) => !def.label?.trim());

        if (emptyKey) {
            showToast('กรุณาระบุชื่อ Key ให้ครบทุกฟิลด์', 'error');
            return;
        }
        if (emptyLabel) {
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

    const handleCancel = () => { setDraft(schemaJson); setIsDirty(false); };

    const handleAddField = () => {
        const idx = fields.length + 1;
        let key = `field_${idx}`;
        while (draft[key]) key = `field_${idx}_${Date.now()}`;
        updateDraft(addField(draft, key, 'string'));
    };

    const handleRemoveField = (key) => updateDraft(removeField(draft, key));

    const handleUpdateKey = (oldKey, newKey) => {
        if (!newKey.trim()) return; // Handled by visual error
        if (newKey !== oldKey && draft[newKey]) {
            showToast(`ชื่อ Key "${newKey}" มีอยู่แล้ว`, 'warning');
            return;
        }
        updateDraft(updateField(draft, oldKey, newKey, draft[oldKey]));
    };

    const handleUpdateType = (key, type) => {
        const def = { ...draft[key], type };
        if (type === 'select' && !def.enum) def.enum = [{ label: 'ตัวเลือก 1', value: 0 }, { label: 'ตัวเลือก 2', value: 1 }];
        if (type !== 'select') delete def.enum;
        updateDraft(updateField(draft, key, key, def));
    };

    const handleUpdateOptions = (key, optionsStr) => {
        const opts = optionsStr.split(',').map(s => s.trim()).filter(Boolean)
            .map((s, i) => {
                const parts = s.split(':');
                if (parts.length === 2) {
                    const val = isNaN(Number(parts[0].trim())) ? parts[0].trim() : Number(parts[0].trim());
                    return { value: val, label: parts[1].trim() };
                }
                return { label: s, value: i };
            });
        updateDraft(updateField(draft, key, key, { ...draft[key], enum: opts }));
    };

    const handleUpdateLabel = (key, label) => {
        updateDraft(updateField(draft, key, key, { ...draft[key], label }));
    };

    const handleMove = (key, dir) => updateDraft(moveField(draft, key, dir));
    const errors = validateSchema(draft);

    return (
        <div className="fb-builder">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ marginTop: 0 }}>กำหนด Fields ({fields.length} fields)</h3>
                {isDirty && <span style={{ fontSize: 12, color: 'var(--accent-primary)' }}>* มีการเปลี่ยนแปลง</span>}
            </div>

            {fields.map(([key, def], idx) => {
                const touched = touchedFields[idx] || {};
                const hasLabelError = touched.label && !def.label?.trim();
                const hasKeyError = touched.key && !key.trim();

                return (
                    <div key={idx} className="fb-field-card">
                        <span className="field-drag">⠿</span>
                        <div className="field-info">
                            <KeyInput 
                                value={key} 
                                onCommit={newKey => handleUpdateKey(key, newKey)} 
                                hasError={hasKeyError}
                                onBlur={() => markTouched(idx, 'key')}
                            />
                            <div className="cd-field-wrapper">
                                <input 
                                    className={`field-label-input ${hasLabelError ? 'error' : ''}`} 
                                    style={hasLabelError ? { borderColor: 'var(--error)', backgroundColor: 'var(--error-light)' } : {}}
                                    value={def.label || ''} 
                                    onChange={e => handleUpdateLabel(key, e.target.value)} 
                                    onBlur={() => markTouched(idx, 'label')}
                                    placeholder="label (ชื่อแสดง)" 
                                />
                                {hasLabelError && <div className="error-msg">กรุณากรอก</div>}
                            </div>
                            <select className="field-type-select" value={def.type} onChange={e => handleUpdateType(key, e.target.value)}>
                                {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                            </select>
                            {def.type === 'select' && (
                                <input className="field-options-input" value={(def.enum || []).map(v => typeof v === 'object' ? `${v.value}:${v.label}` : v).join(', ')} onChange={e => handleUpdateOptions(key, e.target.value)} placeholder="ตัวเลือก (value:label, คั่นด้วย ,)" />
                            )}
                        </div>
                        <div className="fb-field-actions">
                            <button onClick={() => handleMove(key, 'up')} title="ขึ้น" disabled={idx === 0}>↑</button>
                            <button onClick={() => handleMove(key, 'down')} title="ลง" disabled={idx === fields.length - 1}>↓</button>
                            <button onClick={() => handleRemoveField(key)} title="ลบ" style={{ color: '#e74c3c' }}>✕</button>
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
    );
}

export default SchemaBuilder;
