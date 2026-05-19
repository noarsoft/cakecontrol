import { useState, useEffect, useRef } from 'react';
import { ENABLED_FIELD_TYPES, addField, removeField, updateField, reorderField, getFieldEntries, validateSchema } from '../lib/schema';
import { useToast } from '../contexts/ToastContext';
import { KeyInput, FieldConfigPanel } from './SchemaBuilderPanels';
import Icon from '../components/ui/Icon';

const FIELDS_PER_PAGE = 20;

function getPageWindow(current, total, windowSize = 5) {
    if (total <= windowSize + 2) {
        const pages = [];
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
    }
    const half = Math.floor(windowSize / 2);
    let start = Math.max(2, current - half);
    let end = Math.min(total - 1, current + half);
    if (current - half < 2) end = Math.min(total - 1, windowSize + 1);
    if (current + half > total - 1) start = Math.max(2, total - windowSize);
    const pages = [1];
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push('...');
    pages.push(total);
    return pages;
}

function FieldPagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    const pages = getPageWindow(currentPage, totalPages);
    return (
        <div className="sb-field-pagination">
            <button
                className="sb-field-page-btn"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="หน้าก่อนหน้า"
            >&#8249;</button>
            {pages.map((p, i) =>
                p === '...' ? (
                    <span key={`ellipsis-${i}`} className="sb-field-page-ellipsis">...</span>
                ) : (
                    <button
                        key={p}
                        className={`sb-field-page-btn ${p === currentPage ? 'active' : ''}`}
                        onClick={() => onPageChange(p)}
                        aria-label={`หน้า ${p}`}
                        aria-current={p === currentPage ? 'page' : undefined}
                    >{p}</button>
                )
            )}
            <button
                className="sb-field-page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="หน้าถัดไป"
            >&#8250;</button>
        </div>
    );
}

function SchemaBuilder({ schemaJson, onChange, onSaveAndTest, onDirtyChange }) {
    const { showToast } = useToast();
    const [draft, setDraft] = useState(schemaJson);
    const [isDirty, setIsDirty] = useState(false);
    const [touchedFields, setTouchedFields] = useState({});
    const [selectedKey, setSelectedKey] = useState(null);
    const [fieldPage, setFieldPage] = useState(1);
    const [fieldSearch, setFieldSearch] = useState('');

    useEffect(() => {
        setDraft(schemaJson);
        setIsDirty(false);
        setTouchedFields({});
        setSelectedKey(null);
        setFieldPage(1);
        setFieldSearch('');
    }, [schemaJson]);

    useEffect(() => {
        onDirtyChange?.(isDirty);
    }, [isDirty, onDirtyChange]);

    const allFields = getFieldEntries(draft);
    const selectedDef = selectedKey ? draft[selectedKey] : null;

    const isSearching = fieldSearch.trim().length > 0;
    const searchLower = fieldSearch.toLowerCase();
    const fields = isSearching
        ? allFields.filter(([key, def]) =>
            key.toLowerCase().includes(searchLower) ||
            (def.label || '').toLowerCase().includes(searchLower)
        )
        : allFields;

    const totalFieldPages = isSearching ? 1 : Math.ceil(allFields.length / FIELDS_PER_PAGE);
    const safeFieldPage = isSearching ? 1 : Math.min(fieldPage, Math.max(totalFieldPages, 1));
    const fieldPageStart = isSearching ? 0 : (safeFieldPage - 1) * FIELDS_PER_PAGE;
    const fieldPageEnd = isSearching ? fields.length : fieldPageStart + FIELDS_PER_PAGE;
    const pagedFields = fields.slice(fieldPageStart, fieldPageEnd);

    const markTouched = (idx, field) => {
        setTouchedFields(prev => ({
            ...prev,
            [idx]: { ...(prev[idx] || {}), [field]: true }
        }));
    };

    const updateDraft = (newJson) => { setDraft(newJson); setIsDirty(true); };

    const navigateToFieldIndex = (globalIdx) => {
        const page = Math.ceil((globalIdx + 1) / FIELDS_PER_PAGE);
        if (page !== safeFieldPage) setFieldPage(page);
    };

    const validateAndGetDraft = () => {
        const allTouched = {};
        allFields.forEach((_, i) => { allTouched[i] = { key: true, label: true }; });
        setTouchedFields(allTouched);
        setFieldSearch('');

        const entries = getFieldEntries(draft);
        const emptyKeyIdx = entries.findIndex(([k]) => !k.trim());
        if (emptyKeyIdx >= 0) {
            navigateToFieldIndex(emptyKeyIdx);
            showToast('กรุณาระบุชื่อ Key ให้ครบทุกฟิลด์', 'error');
            return null;
        }
        const emptyLabelIdx = entries.findIndex(([_, def]) => def.type !== 'pagebreak' && !def.label?.trim());
        if (emptyLabelIdx >= 0) {
            navigateToFieldIndex(emptyLabelIdx);
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
        if (!isDirty) { onSaveAndTest(null); return; }
        const validated = validateAndGetDraft();
        if (!validated) return;
        onSaveAndTest(validated);
        setIsDirty(false);
    };

    const handleCancel = () => { setDraft(schemaJson); setIsDirty(false); setSelectedKey(null); };

    const handleAddField = () => {
        const idx = allFields.length + 1;
        let key = `field_${idx}`;
        while (draft[key]) key = `field_${idx}_${Date.now()}`;
        updateDraft(addField(draft, key, 'string'));
        setSelectedKey(key);
        setFieldSearch('');
        const newTotal = allFields.length + 1;
        setFieldPage(Math.ceil(newTotal / FIELDS_PER_PAGE));
    };

    const handleAddPageBreak = () => {
        const idx = allFields.length + 1;
        let key = `pagebreak_${idx}`;
        while (draft[key]) key = `pagebreak_${idx}_${Date.now()}`;
        updateDraft(addField(draft, key, 'pagebreak'));
        setFieldSearch('');
        const newTotal = allFields.length + 1;
        setFieldPage(Math.ceil(newTotal / FIELDS_PER_PAGE));
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
        if (target < 0 || target >= allFields.length) return;
        updateDraft(reorderField(draft, idx, target));
        const targetPage = Math.ceil((target + 1) / FIELDS_PER_PAGE);
        if (targetPage !== safeFieldPage) setFieldPage(targetPage);
    };

    const errors = validateSchema(draft);

    const description = draft._description || '';

    const globalIndexOf = (key) => allFields.findIndex(([k]) => k === key);

    return (
        <div className="sb-layout">
            <div className="sb-field-list">
                <div className="sb-description-section">
                    <label className="sb-field-label">คำอธิบายฟอร์ม</label>
                    <textarea
                        className="sb-description-input"
                        value={description}
                        onChange={e => updateDraft({ ...draft, _description: e.target.value })}
                        placeholder="เพิ่มคำอธิบายให้ผู้กรอกเข้าใจฟอร์มนี้ (ไม่บังคับ)"
                        rows={2}
                    />
                </div>
                <div className="sb-field-header">
                    <h3 className="sb-field-header-title">กำหนด Fields ({allFields.length} fields)</h3>
                    {isDirty && <span className="sb-field-dirty-indicator">* มีการเปลี่ยนแปลง</span>}
                </div>

                <div className="sb-field-search">
                    <input
                        type="text"
                        value={fieldSearch}
                        onChange={e => { setFieldSearch(e.target.value); setFieldPage(1); }}
                        placeholder="ค้นหา field ด้วย key หรือ label..."
                        className="sb-field-search-input"
                    />
                    {fieldSearch && (
                        <button className="sb-field-search-clear" onClick={() => setFieldSearch('')} type="button">&#10005;</button>
                    )}
                </div>

                {isSearching && (
                    <div className="sb-field-page-info">
                        พบ {fields.length} จาก {allFields.length} fields
                    </div>
                )}

                {!isSearching && (
                    <FieldPagination
                        currentPage={safeFieldPage}
                        totalPages={totalFieldPages}
                        onPageChange={setFieldPage}
                    />
                )}

                {!isSearching && allFields.length > FIELDS_PER_PAGE && (
                    <div className="sb-field-page-info">
                        แสดง {fieldPageStart + 1}-{Math.min(fieldPageEnd, allFields.length)} จาก {allFields.length} fields
                    </div>
                )}

                {pagedFields.map(([key, def], localIdx) => {
                    const idx = isSearching ? globalIndexOf(key) : fieldPageStart + localIdx;
                    const touched = touchedFields[idx] || {};
                    const hasLabelError = touched.label && !def.label?.trim();
                    const hasKeyError = touched.key && !key.trim();
                    const isDragging = dragIdx === idx;
                    const isOver = dragOverIdx === idx && dragIdx !== idx;
                    const isSelected = selectedKey === key;

                    if (def.type === 'pagebreak') {
                        return (
                            <div
                                key={key}
                                className={`fb-field-card fb-pagebreak-card ${isDragging ? 'dragging' : ''} ${isOver ? 'drag-over' : ''}`}
                                onDragEnter={() => handleDragEnter(idx)}
                                onDragOver={e => e.preventDefault()}
                            >
                                <span
                                    className="field-drag"
                                    draggable={!isSearching}
                                    onDragStart={() => handleDragStart(idx)}
                                    onDragEnd={handleDragEnd}
                                >⠿</span>
                                <div className="fb-pagebreak-line" />
                                <span className="fb-pagebreak-label">Page Break</span>
                                <input
                                    className="fb-pagebreak-title"
                                    value={def.label || ''}
                                    onChange={e => handleUpdateLabel(key, e.target.value)}
                                    placeholder="พิมพ์ชื่อหน้า เช่น ข้อมูลส่วนตัว, ที่อยู่ (ไม่บังคับ)"
                                    onClick={e => e.stopPropagation()}
                                />
                                <div className="fb-pagebreak-line" />
                                <div className="fb-field-actions">
                                    <button onClick={(e) => { e.stopPropagation(); handleMoveField(idx, 'up'); }} disabled={idx === 0 || isSearching} title="ขึ้น" className="fb-move-btn">&#8593;</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleMoveField(idx, 'down'); }} disabled={idx === allFields.length - 1 || isSearching} title="ลง" className="fb-move-btn">&#8595;</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleRemoveField(key); }} title="ลบ" className="fb-delete-btn">&#10005;</button>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={key}
                            className={`fb-field-card ${isDragging ? 'dragging' : ''} ${isOver ? 'drag-over' : ''} ${isSelected ? 'selected' : ''} ${hasLabelError || hasKeyError ? 'has-error' : ''}`}
                            onDragEnter={() => handleDragEnter(idx)}
                            onDragOver={e => e.preventDefault()}
                        >
                            <span className="fb-field-number">{idx + 1}</span>
                            <span
                                className="field-drag"
                                draggable={!isSearching}
                                onDragStart={() => handleDragStart(idx)}
                                onDragEnd={handleDragEnd}
                            >⠿</span>
                            <div className="field-info">
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
                                <button onClick={() => handleMoveField(idx, 'up')} disabled={idx === 0 || isSearching} title="ขึ้น" className="fb-move-btn">&#8593;</button>
                                <button onClick={() => handleMoveField(idx, 'down')} disabled={idx === allFields.length - 1 || isSearching} title="ลง" className="fb-move-btn">&#8595;</button>
                                <button onClick={() => handleRemoveField(key)} title="ลบ" className="fb-delete-btn">&#10005;</button>
                            </div>
                        </div>
                    );
                })}

                {!isSearching && (
                    <FieldPagination
                        currentPage={safeFieldPage}
                        totalPages={totalFieldPages}
                        onPageChange={setFieldPage}
                    />
                )}

                <div className="sb-field-add-buttons">
                    <button className="fb-add-field-btn" onClick={handleAddField}>+ เพิ่ม Field</button>
                    <button className="fb-add-field-btn fb-add-pagebreak-btn" onClick={handleAddPageBreak}>+ Page Break</button>
                </div>

                {errors.length > 0 && (
                    <div className="sb-validation-errors">
                        {errors.map((e, i) => <div key={i} className="sb-validation-error">{e}</div>)}
                    </div>
                )}

                <div className="fb-builder-actions">
                    <button className="fb-mode-btn active" onClick={handleSave} disabled={!isDirty || errors.length > 0}>บันทึก</button>
                    <div className="fb-builder-actions-spacer" />
                    <button className="fb-mode-btn" onClick={handleCancel} disabled={!isDirty}>ยกเลิก</button>
                    <button className="fb-mode-btn active fb-save-test-btn" onClick={handleSaveAndTest} disabled={isDirty && errors.length > 0}>บันทึกและทดสอบ</button>
                </div>
            </div>

            {selectedKey && (
                <FieldConfigPanel
                    fieldKey={selectedKey}
                    fieldDef={selectedDef}
                    allFields={allFields}
                    onUpdate={handleConfigUpdate}
                />
            )}
        </div>
    );
}

export default SchemaBuilder;
