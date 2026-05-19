import { useState, useEffect, useRef } from 'react';
import { FIELD_TYPES } from '../lib/schema';
import { FIELD_TO_CONTROL_TYPE } from '../lib/controlTypeMap';
import { genControl } from '../components/controls/TableviewControl';
import { CONTROL_CONFIGS } from './schemaBuilderConfigs';
import { SHOW_WHEN_OPERATORS } from './controlConfigFields';
import Icon from '../components/ui/Icon';

export function KeyInput({ value, onCommit, hasError, onBlur }) {
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

function normalizeOption(opt) {
    if (typeof opt === 'string') return { label: opt, value: opt };
    if (typeof opt === 'number') return { label: String(opt), value: opt };
    return opt;
}

export function OptionEditor({ options: rawOptions, onChange }) {
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

function ControlPreview({ fieldKey, fieldDef }) {
    if (!fieldKey || !fieldDef) return null;

    const controlType = FIELD_TO_CONTROL_TYPE[fieldDef.type] || 'textbox';
    const control = {
        type: controlType,
        databind: fieldKey,
        label: fieldDef.label || fieldKey,
        value: fieldDef.value ?? '',
        placeholder: fieldDef.placeholder || '',
        ...(fieldDef.type === 'select' && fieldDef.enum ? {
            options: fieldDef.enum.map(v => typeof v === 'object' ? v : { label: v, value: v }),
        } : {}),
        ...(fieldDef.type === 'dropdown' && fieldDef.enum ? {
            data: fieldDef.enum.map(v => typeof v === 'object' ? { id: v.value, label: v.label } : { id: v, label: String(v) }),
            keyField: 'id',
            displayField: 'label',
        } : {}),
        ...(fieldDef.type === 'email' ? { inputType: 'email' } : {}),
    };

    const passthroughKeys = ['min', 'max', 'step', 'showStrength', 'minLength', 'maxLength',
        'showValue', 'color', 'multiple', 'allowCreate', 'width', 'height',
        'borderRadius', 'objectFit', 'shadow', 'href',
        'maxStars', 'allowHalf', 'showLabel', 'size'];
    for (const k of passthroughKeys) {
        if (fieldDef[k] !== undefined) control[k] = fieldDef[k];
    }

    const rowData = { [fieldKey]: fieldDef.value ?? '' };

    return (
        <div className="sb-preview-box">
            <div className="sb-preview-label">Preview</div>
            <div className="sb-preview-content">
                {genControl(control, rowData, 0)}
            </div>
        </div>
    );
}

function ShowWhenEditor({ fieldKey, fieldDef, allFields, onUpdate }) {
    const sw = fieldDef.showWhen;
    const otherFields = allFields.filter(([k, def]) => k !== fieldKey && def.type !== 'pagebreak');
    const targetField = sw ? otherFields.find(([k]) => k === sw.field) : null;
    const isBooleanTarget = targetField && (targetField[1].type === 'boolean');
    const needsValue = sw && sw.op !== 'empty' && sw.op !== 'notEmpty';

    const handleToggle = (checked) => {
        if (checked) {
            const defaultField = otherFields[0]?.[0] || '';
            const defaultIsBool = otherFields[0]?.[1]?.type === 'boolean';
            onUpdate({ ...fieldDef, showWhen: { field: defaultField, op: 'eq', value: defaultIsBool ? true : '' } });
        } else {
            onUpdate({ ...fieldDef, showWhen: undefined });
        }
    };

    const handleChange = (patch) => {
        const next = { ...sw, ...patch };
        if (patch.field) {
            const newTarget = otherFields.find(([k]) => k === patch.field);
            const newIsBool = newTarget?.[1]?.type === 'boolean';
            if (newIsBool && typeof next.value !== 'boolean') next.value = true;
            if (!newIsBool && typeof next.value === 'boolean') next.value = '';
        }
        onUpdate({ ...fieldDef, showWhen: next });
    };

    return (
        <div className="sb-showwhen-section">
            <div className="sb-config-row">
                <label className="sb-config-label">แสดงตามเงื่อนไข</label>
                <label className="sb-config-toggle">
                    <input type="checkbox" checked={!!sw} onChange={e => handleToggle(e.target.checked)} />
                    <span className="sb-toggle-slider"></span>
                </label>
            </div>

            {sw && (
                <div className="sb-showwhen-fields">
                    <div className="sb-config-row">
                        <label className="sb-config-label">เมื่อช่อง</label>
                        <select
                            className="sb-config-input"
                            value={sw.field || ''}
                            onChange={e => handleChange({ field: e.target.value })}
                        >
                            <option value="">-- เลือก --</option>
                            {otherFields.map(([k, def]) => (
                                <option key={k} value={k}>{def.label || k}</option>
                            ))}
                        </select>
                    </div>
                    <div className="sb-config-row">
                        <label className="sb-config-label">เงื่อนไข</label>
                        <select
                            className="sb-config-input"
                            value={sw.op || 'eq'}
                            onChange={e => handleChange({ op: e.target.value })}
                        >
                            {SHOW_WHEN_OPERATORS.map(op => (
                                <option key={op.value} value={op.value}>{op.label}</option>
                            ))}
                        </select>
                    </div>
                    {needsValue && (
                        <div className="sb-config-row">
                            <label className="sb-config-label">ค่า</label>
                            {isBooleanTarget ? (
                                <select
                                    className="sb-config-input"
                                    value={String(sw.value ?? '')}
                                    onChange={e => handleChange({ value: e.target.value === 'true' })}
                                >
                                    <option value="true">เปิด (true)</option>
                                    <option value="false">ปิด (false)</option>
                                </select>
                            ) : (
                                <input
                                    className="sb-config-input"
                                    value={sw.value ?? ''}
                                    onChange={e => handleChange({ value: e.target.value })}
                                    placeholder="ค่าที่ต้องเปรียบเทียบ"
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export function FieldConfigPanel({ fieldKey, fieldDef, allFields = [], onUpdate }) {
    const [locked, setLocked] = useState(true);
    const [pos, setPos] = useState(null);
    const dragRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (locked) return;
        offsetRef.current = {
            x: e.clientX - (pos?.x ?? dragRef.current.getBoundingClientRect().left),
            y: e.clientY - (pos?.y ?? dragRef.current.getBoundingClientRect().top),
        };
        const handleMouseMove = (ev) => {
            setPos({
                x: ev.clientX - offsetRef.current.x,
                y: ev.clientY - offsetRef.current.y,
            });
        };
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleToggleLock = () => {
        setLocked(prev => {
            if (!prev) setPos(null);
            return !prev;
        });
    };

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

    const panelStyle = !locked && pos ? { position: 'fixed', left: pos.x, top: pos.y, right: 'auto' } : {};

    return (
        <div className={`sb-config-panel ${!locked ? 'unlocked' : ''}`} ref={dragRef} style={panelStyle}>
            <div className="sb-config-toolbar" onMouseDown={handleMouseDown} style={{ cursor: locked ? 'default' : 'grab' }}>
                <button className="sb-lock-btn" onClick={handleToggleLock} title={locked ? 'ปลดล็อกเพื่อย้ายได้' : 'ล็อกตำแหน่ง'}>
                    <Icon name={locked ? 'lock' : 'unlock'} size="sm" />
                </button>
            </div>
            <ControlPreview fieldKey={fieldKey} fieldDef={fieldDef} />

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

            <ShowWhenEditor
                fieldKey={fieldKey}
                fieldDef={fieldDef}
                allFields={allFields}
                onUpdate={(newDef) => onUpdate(fieldKey, newDef)}
            />
        </div>
    );
}
