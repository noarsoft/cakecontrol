import { useState, useEffect, useRef } from 'react';
import { ENABLED_FIELD_TYPES, addField, removeField, updateField, reorderField, getFieldEntries, validateSchema } from '../lib/schema';
import { useToast } from '../contexts/ToastContext';
import { KeyInput, FieldConfigPanel } from './SchemaBuilderPanels';
import Icon from '../components/ui/Icon';

function SchemaBuilder({ schemaJson, onChange, onSaveAndTest, onDirtyChange }) {
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

    useEffect(() => {
        onDirtyChange?.(isDirty);
    }, [isDirty, onDirtyChange]);

    const fields = getFieldEntries(draft);
    const selectedDef = selectedKey ? draft[selectedKey] : null;

    const markTouched = (idx, field) => {
        setTouchedFields(prev => ({
            ...prev,
            [idx]: { ...(prev[idx] || {}), [field]: true }
        }));
    };

    const updateDraft = (newJson) => { setDraft(newJson); setIsDirty(true); };

    const validateAndGetDraft = () => {
        const allTouched = {};
        fields.forEach((_, i) => { allTouched[i] = { key: true, label: true }; });
        setTouchedFields(allTouched);

        const entries = getFieldEntries(draft);
        if (entries.some(([k]) => !k.trim())) {
            showToast('กรุณาระบุชื่อ Key ให้ครบทุกฟิลด์', 'error');
            return null;
        }
        if (entries.some(([_, def]) => def.type !== 'pagebreak' && !def.label?.trim())) {
            showToast('กรุณาระบุชื่อ Label ให้ครบทุกฟิลด์', 'error');
            return null;
        }
        const internalErrors = validateSchema(draft);
        if (internalErrors.length > 0) {
            showToast(internalErrors[0], 'error');
            return null;
        }
        return draft;
    };

    const handleSave = () => {
        const validated = validateAndGetDraft();
        if (!validated) return;
        onChange(validated);
        setIsDirty(false);
        showToast('บันทึกโครงสร้างแม่แบบเรียบร้อยแล้ว', 'success');
    };

    const handleSaveAndTest = () => {
        const validated = validateAndGetDraft();
        if (!validated) return;
        onSaveAndTest(validated);
        setIsDirty(false);
    };

    const handleCancel = () => { setDraft(schemaJson); setIsDirty(false); setSelectedKey(null); };

    const handleAddField = () => {
        const idx = fields.length + 1;
        let key = `field_${idx}`;
        while (draft[key]) key = `field_${idx}_${Date.now()}`;
        updateDraft(addField(draft, key, 'string'));
        setSelectedKey(key);
    };

    const handleAddPageBreak = () => {
        const idx = fields.length + 1;
        let key = `pagebreak_${idx}`;
        while (draft[key]) key = `pagebreak_${idx}_${Date.now()}`;
        updateDraft(addField(draft, key, 'pagebreak'));
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
        if (type === 'dropdown' && !def.enum) def.enum = [{ label: 'ตัวเลือก 1', value: 0 }, { label: 'ตัวเลือก 2', value: 1 }];
        if (type === 'buttongroup' && !def.enum) def.enum = [{ label: 'Option A', value: 0 }, { label: 'Option B', value: 1 }];
        if (type !== 'select' && type !== 'dropdown' && type !== 'buttongroup') delete def.enum;
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

    const handleMoveField = (idx, direction) => {
        const target = direction === 'up' ? idx - 1 : idx + 1;
        if (target < 0 || target >= fields.length) return;
        updateDraft(reorderField(draft, idx, target));
    };

    const errors = validateSchema(draft);

    return (
        <div className="sb-layout">
            <div className="sb-field-list">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ margin: 0 }}>กำหนด Fields ({fields.length} fields)</h3>
                    {isDirty && <span style={{ fontSize: 12, color: 'var(--accent-primary)' }}>* มีการเปลี่ยนแปลง</span>}
                </div>

                {fields.map(([key, def], idx) => {
                    const touched = touchedFields[idx] || {};
                    const hasLabelError = touched.label && !def.label?.trim();
                    const hasKeyError = touched.key && !key.trim();
                    const isDragging = dragIdx === idx;
                    const isOver = dragOverIdx === idx && dragIdx !== idx;
                    const isSelected = selectedKey === key;

                    if (def.type === 'pagebreak') {
                        return (
                            <div
                                key={idx}
                                className={`fb-field-card fb-pagebreak-card ${isDragging ? 'dragging' : ''} ${isOver ? 'drag-over' : ''}`}
                                onDragEnter={() => handleDragEnter(idx)}
                                onDragOver={e => e.preventDefault()}
                            >
                                <span
                                    className="field-drag"
                                    draggable
                                    onDragStart={() => handleDragStart(idx)}
                                    onDragEnd={handleDragEnd}
                                >⠿</span>
                                <div className="fb-pagebreak-line" />
                                <span className="fb-pagebreak-label">📄 Page Break</span>
                                <input
                                    className="fb-pagebreak-title"
                                    value={def.label || ''}
                                    onChange={e => handleUpdateLabel(key, e.target.value)}
                                    placeholder="พิมพ์ชื่อหน้า เช่น ข้อมูลส่วนตัว, ที่อยู่ (ไม่บังคับ)"
                                    onClick={e => e.stopPropagation()}
                                />
                                <div className="fb-pagebreak-line" />
                                <div className="fb-field-actions">
                                    <button onClick={(e) => { e.stopPropagation(); handleMoveField(idx, 'up'); }} disabled={idx === 0} title="ขึ้น" className="fb-move-btn">&#8593;</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleMoveField(idx, 'down'); }} disabled={idx === fields.length - 1} title="ลง" className="fb-move-btn">&#8595;</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRemoveField(key); }} title="ลบ" className="fb-delete-btn">✕</button>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={idx}
                            className={`fb-field-card ${isDragging ? 'dragging' : ''} ${isOver ? 'drag-over' : ''} ${isSelected ? 'selected' : ''}`}
                            onDragEnter={() => handleDragEnter(idx)}
                            onDragOver={e => e.preventDefault()}
                        >
                            <span className="fb-field-number">{idx + 1}</span>
                            <span
                                className="field-drag"
                                draggable
                                onDragStart={() => handleDragStart(idx)}
                                onDragEnd={handleDragEnd}
                            >⠿</span>
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
                                        {ENABLED_FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="fb-field-actions">
                                <button onClick={() => setSelectedKey(k => k === key ? null : key)} title="ตั้งค่า" className={`fb-config-btn ${isSelected ? 'active' : ''}`}>
                                    <Icon name="settings" size="sm" />
                                </button>
                                <button onClick={() => handleMoveField(idx, 'up')} disabled={idx === 0} title="ขึ้น" className="fb-move-btn">&#8593;</button>
                                <button onClick={() => handleMoveField(idx, 'down')} disabled={idx === fields.length - 1} title="ลง" className="fb-move-btn">&#8595;</button>
                                <button onClick={() => handleRemoveField(key)} title="ลบ" className="fb-delete-btn">✕</button>
                            </div>
                        </div>
                    );
                })}

                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="fb-add-field-btn" onClick={handleAddField}>+ เพิ่ม Field</button>
                    <button className="fb-add-field-btn fb-add-pagebreak-btn" onClick={handleAddPageBreak}>+ Page Break</button>
                </div>

                {errors.length > 0 && (
                    <div style={{ marginTop: 12, padding: 12, borderRadius: 6, background: '#e74c3c15', border: '1px solid #e74c3c40', fontSize: 13 }}>
                        {errors.map((e, i) => <div key={i} style={{ color: '#e74c3c' }}>{e}</div>)}
                    </div>
                )}

                <div className="fb-builder-actions">
                    <button className="fb-mode-btn active" onClick={handleSave} disabled={!isDirty || errors.length > 0}>บันทึก</button>
                    <div className="fb-builder-actions-spacer" />
                    <button className="fb-mode-btn" onClick={handleCancel} disabled={!isDirty}>ยกเลิก</button>
                    <button className="fb-mode-btn active fb-save-test-btn" onClick={handleSaveAndTest} disabled={!isDirty || errors.length > 0}>บันทึกและทดสอบ</button>
                </div>
            </div>

            {selectedKey && (
                <FieldConfigPanel
                    fieldKey={selectedKey}
                    fieldDef={selectedDef}
                    onUpdate={handleConfigUpdate}
                />
            )}
        </div>
    );
}

export default SchemaBuilder;
