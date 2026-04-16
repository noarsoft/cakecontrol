import { useState, useEffect, useCallback, useMemo } from 'react';
import CRUDControl from '../components/controls/CRUDControl';
import FormControl from '../components/controls/FormControl';
import ConfirmModal from '../components/controls/ConfirmModal';
import { FIELD_TYPES, addField, removeField, updateField, moveField, getFieldEntries, validateSchema } from '../lib/schema';
import { buildCrudConfig, schemaToFormConfig, generateDefaultView, generateDefaultFormcfg } from '../lib/schemaTransform';
import {
    initService, isApiMode,
    getSchemas, createSchema, updateSchema, deleteSchema,
    getViewsBySchema, createView, updateView,
    getFormcfgsBySchema, createFormcfg, updateFormcfg,
    getFormDataBySchema, createFormData, updateFormData, deleteFormData,
} from '../lib/schemaService';
import './FormBuilder.css';

function FormBuilder() {
    const [schemas, setSchemas] = useState([]);
    const [activeSchemaId, setActiveSchemaId] = useState(null);
    const [mode, setMode] = useState('data'); // 'data' | 'builder' | 'preview' | 'fill'
    const [refreshKey, setRefreshKey] = useState(0);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [schemaData, setSchemaData] = useState(null);
    const [serviceMode, setServiceMode] = useState(null);

    // Init: detect backend + load schemas
    useEffect(() => {
        initService().then(mode => {
            setServiceMode(mode);
            reloadSchemas();
        });
    }, []);

    const reloadSchemas = async () => {
        const list = await getSchemas();
        setSchemas(list);
        return list;
    };

    const activeSchema = useMemo(
        () => schemas.find(s => s.id === activeSchemaId),
        [schemas, activeSchemaId]
    );

    // Load related data for active schema
    useEffect(() => {
        if (!activeSchema) { setSchemaData(null); return; }
        let cancelled = false;
        (async () => {
            const [views, formcfgs, formData] = await Promise.all([
                getViewsBySchema(activeSchema.id),
                getFormcfgsBySchema(activeSchema.id),
                getFormDataBySchema(activeSchema.id),
            ]);
            if (cancelled) return;
            setSchemaData({
                view: views[0] || null,
                formcfg: formcfgs[0] || null,
                data: formData.map(f => ({ _formId: f.id, ...f.data })),
                rawData: formData,
            });
        })();
        return () => { cancelled = true; };
    }, [activeSchema, refreshKey]);

    // ─── Sidebar Actions ───
    const handleAddSchema = async () => {
        const schema = await createSchema('ฟอร์มใหม่', {
            field_1: { type: 'string' },
        });
        await createView(schema.id, 'table', generateDefaultView(schema.json), 'Default View');
        await createFormcfg(schema.id, generateDefaultFormcfg(schema.json), 'Default Form');
        await reloadSchemas();
        setActiveSchemaId(schema.id);
        setMode('builder');
    };

    const handleSelectSchema = (id) => {
        setActiveSchemaId(id);
        setMode('data');
        setRefreshKey(k => k + 1);
    };

    const handleDeleteSchema = async () => {
        if (!deleteConfirm) return;
        await deleteSchema(deleteConfirm);
        setDeleteConfirm(null);
        if (activeSchemaId === deleteConfirm) setActiveSchemaId(null);
        await reloadSchemas();
    };

    const handleSchemaNameSave = async (name) => {
        if (!activeSchema || !name.trim()) return;
        await updateSchema(activeSchema.id, { name: name.trim() });
        await reloadSchemas();
    };

    // ─── Data Manager: CRUDControl callbacks ───
    const handleDataAdd = useCallback(async (formData) => {
        if (!activeSchema) return;
        const clean = { ...formData };
        delete clean._formId;
        await createFormData(activeSchema.id, clean);
        setRefreshKey(k => k + 1);
    }, [activeSchema]);

    const handleDataEdit = useCallback(async (formData, oldData) => {
        if (!oldData?._formId) return;
        const clean = { ...formData };
        delete clean._formId;
        await updateFormData(oldData._formId, clean);
        setRefreshKey(k => k + 1);
    }, []);

    const handleDataDelete = useCallback(async (rowData) => {
        if (!rowData?._formId) return;
        await deleteFormData(rowData._formId);
        setRefreshKey(k => k + 1);
    }, []);

    // Build CRUDControl config
    const crudConfig = useMemo(() => {
        if (!activeSchema || !schemaData) return null;
        const cfg = buildCrudConfig({
            schemaJson: activeSchema.json,
            viewJson: schemaData.view?.json,
            formcfgJson: schemaData.formcfg?.json,
            data: schemaData.data,
            keyField: '_formId',
        });
        return {
            ...cfg,
            onAdd: handleDataAdd,
            onEdit: handleDataEdit,
            onDelete: handleDataDelete,
        };
    }, [activeSchema, schemaData, handleDataAdd, handleDataEdit, handleDataDelete]);

    // ─── Form Builder: Schema editing ───
    const handleSchemaJsonChange = async (newJson) => {
        if (!activeSchema) return;
        await updateSchema(activeSchema.id, { json: newJson });

        // Auto-update view + formcfg
        const [views, formcfgs] = await Promise.all([
            getViewsBySchema(activeSchema.id),
            getFormcfgsBySchema(activeSchema.id),
        ]);
        const viewUpdate = views[0]
            ? updateView(views[0].id, { json: generateDefaultView(newJson) })
            : createView(activeSchema.id, 'table', generateDefaultView(newJson), 'Default View');
        const cfgUpdate = formcfgs[0]
            ? updateFormcfg(formcfgs[0].id, { json: generateDefaultFormcfg(newJson) })
            : createFormcfg(activeSchema.id, generateDefaultFormcfg(newJson), 'Default Form');
        await Promise.all([viewUpdate, cfgUpdate]);

        await reloadSchemas();
        setRefreshKey(k => k + 1);
    };

    // Form data counts per schema
    const [dataCounts, setDataCounts] = useState({});
    useEffect(() => {
        (async () => {
            const counts = {};
            await Promise.all(schemas.map(async s => {
                const data = await getFormDataBySchema(s.id);
                counts[s.id] = data.length;
            }));
            setDataCounts(counts);
        })();
    }, [schemas, refreshKey]);

    return (
        <div className="formbuilder-container">
            {/* Sidebar */}
            <aside className="fb-sidebar">
                <div className="fb-sidebar-header">
                    <h2>Form Builder</h2>
                    <p>สร้างและจัดการฟอร์ม</p>
                    {serviceMode && (
                        <span style={{ fontSize: 11, opacity: 0.5, display: 'block', marginTop: 4 }}>
                            {serviceMode === 'api' ? '🟢 API' : '🟡 localStorage'}
                        </span>
                    )}
                </div>
                <div className="fb-sidebar-list">
                    {schemas.map(s => (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <button
                                className={`fb-schema-item ${activeSchemaId === s.id ? 'active' : ''}`}
                                onClick={() => handleSelectSchema(s.id)}
                            >
                                <span className="schema-name">{s.name}</span>
                                <span className="schema-count">{dataCounts[s.id] || 0} รายการ</span>
                            </button>
                            <button
                                className="fb-delete-schema-btn"
                                onClick={e => { e.stopPropagation(); setDeleteConfirm(s.id); }}
                                title="ลบ schema"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <button className="fb-add-schema-btn" onClick={handleAddSchema}>
                    + สร้างฟอร์มใหม่
                </button>
            </aside>

            {/* Main */}
            <main className="fb-main">
                {activeSchema ? (
                    <>
                        <div className="fb-toolbar">
                            <SchemaNameInput
                                value={activeSchema.name}
                                onSave={handleSchemaNameSave}
                            />
                            <div style={{ flex: 1 }} />
                            <button
                                className={`fb-mode-btn ${mode === 'data' ? 'active' : ''}`}
                                onClick={() => { setMode('data'); setRefreshKey(k => k + 1); }}
                            >
                                ข้อมูล
                            </button>
                            <button
                                className={`fb-mode-btn ${mode === 'builder' ? 'active' : ''}`}
                                onClick={() => setMode('builder')}
                            >
                                แก้ไขฟอร์ม
                            </button>
                            <button
                                className={`fb-mode-btn ${mode === 'fill' ? 'active' : ''}`}
                                onClick={() => setMode('fill')}
                            >
                                กรอกฟอร์ม
                            </button>
                            <button
                                className="fb-mode-btn"
                                onClick={() => {
                                    const url = `${window.location.origin}/form/${activeSchema.id}`;
                                    navigator.clipboard.writeText(url).then(() => {
                                        alert(`คัดลอก link แล้ว:\n${url}`);
                                    });
                                }}
                                title="คัดลอก link สำหรับแชร์"
                            >
                                🔗 แชร์
                            </button>
                            <button
                                className={`fb-mode-btn ${mode === 'preview' ? 'active' : ''}`}
                                onClick={() => setMode('preview')}
                            >
                                Preview
                            </button>
                        </div>
                        <div className="fb-content">
                            {mode === 'data' && crudConfig && (
                                <CRUDControl config={crudConfig} />
                            )}
                            {mode === 'builder' && (
                                <SchemaBuilder
                                    schemaJson={activeSchema.json}
                                    onChange={handleSchemaJsonChange}
                                />
                            )}
                            {mode === 'fill' && (
                                <FormFiller
                                    schema={activeSchema}
                                    formcfgJson={schemaData?.formcfg?.json}
                                    onSubmit={() => setRefreshKey(k => k + 1)}
                                />
                            )}
                            {mode === 'preview' && (
                                <FormPreview
                                    schemaJson={activeSchema.json}
                                    formcfgJson={schemaData?.formcfg?.json}
                                    schemaName={activeSchema.name}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    <div className="fb-empty">
                        <div className="fb-empty-icon">📝</div>
                        <div>เลือกฟอร์มจาก sidebar หรือสร้างฟอร์มใหม่</div>
                    </div>
                )}
            </main>

            {/* Delete Confirm */}
            <ConfirmModal
                isOpen={deleteConfirm !== null}
                title="ยืนยันการลบ"
                message="ลบ schema นี้จะลบข้อมูลทั้งหมดที่เกี่ยวข้อง ต้องการลบหรือไม่?"
                onConfirm={handleDeleteSchema}
                onCancel={() => setDeleteConfirm(null)}
            />
        </div>
    );
}

/* ─── Schema Builder Component ─── */
function SchemaBuilder({ schemaJson, onChange }) {
    // Local buffer — edit locally, save explicitly
    const [draft, setDraft] = useState(schemaJson);
    const [isDirty, setIsDirty] = useState(false);

    // Sync draft when parent schema changes (e.g. switching schemas)
    useEffect(() => {
        setDraft(schemaJson);
        setIsDirty(false);
    }, [schemaJson]);

    const fields = getFieldEntries(draft);

    const updateDraft = (newJson) => {
        setDraft(newJson);
        setIsDirty(true);
    };

    const handleSave = () => {
        onChange(draft);
        setIsDirty(false);
    };

    const handleCancel = () => {
        setDraft(schemaJson);
        setIsDirty(false);
    };

    const handleAddField = () => {
        const idx = fields.length + 1;
        let key = `field_${idx}`;
        while (draft[key]) key = `field_${idx}_${Date.now()}`;
        updateDraft(addField(draft, key, 'string'));
    };

    const handleRemoveField = (key) => {
        updateDraft(removeField(draft, key));
    };

    const handleUpdateKey = (oldKey, newKey) => {
        if (!newKey.trim() || (newKey !== oldKey && draft[newKey])) return;
        updateDraft(updateField(draft, oldKey, newKey, draft[oldKey]));
    };

    const handleUpdateType = (key, type) => {
        const def = { ...draft[key], type };
        if (type === 'select' && !def.enum) def.enum = ['ตัวเลือก 1', 'ตัวเลือก 2'];
        if (type !== 'select') delete def.enum;
        updateDraft(updateField(draft, key, key, def));
    };

    const handleUpdateOptions = (key, optionsStr) => {
        const opts = optionsStr.split(',').map(s => s.trim()).filter(Boolean);
        updateDraft(updateField(draft, key, key, { ...draft[key], enum: opts }));
    };

    const handleUpdateLabel = (key, label) => {
        updateDraft(updateField(draft, key, key, { ...draft[key], label }));
    };

    const handleMove = (key, dir) => {
        updateDraft(moveField(draft, key, dir));
    };

    const errors = validateSchema(draft);

    return (
        <div className="fb-builder">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ marginTop: 0 }}>กำหนด Fields ({fields.length} fields)</h3>
                {isDirty && <span style={{ fontSize: 12, color: 'var(--accent-primary)' }}>* มีการเปลี่ยนแปลง</span>}
            </div>

            {fields.map(([key, def], idx) => (
                <div key={idx} className="fb-field-card">
                    <span className="field-drag">⠿</span>
                    <div className="field-info">
                        <input
                            className="field-key-input"
                            value={key}
                            onChange={e => handleUpdateKey(key, e.target.value)}
                            placeholder="key"
                        />
                        <input
                            className="field-label-input"
                            value={def.label || ''}
                            onChange={e => handleUpdateLabel(key, e.target.value)}
                            placeholder="label (ชื่อแสดง)"
                        />
                        <select
                            className="field-type-select"
                            value={def.type}
                            onChange={e => handleUpdateType(key, e.target.value)}
                        >
                            {FIELD_TYPES.map(t => (
                                <option key={t.value} value={t.value}>
                                    {t.icon} {t.label}
                                </option>
                            ))}
                        </select>
                        {def.type === 'select' && (
                            <input
                                className="field-options-input"
                                value={(def.enum || []).join(', ')}
                                onChange={e => handleUpdateOptions(key, e.target.value)}
                                placeholder="ตัวเลือก (คั่นด้วย ,)"
                            />
                        )}
                    </div>
                    <div className="fb-field-actions">
                        <button onClick={() => handleMove(key, 'up')} title="ขึ้น" disabled={idx === 0}>↑</button>
                        <button onClick={() => handleMove(key, 'down')} title="ลง" disabled={idx === fields.length - 1}>↓</button>
                        <button onClick={() => handleRemoveField(key)} title="ลบ" style={{ color: '#e74c3c' }}>✕</button>
                    </div>
                </div>
            ))}

            <button className="fb-add-field-btn" onClick={handleAddField}>
                + เพิ่ม Field
            </button>

            {errors.length > 0 && (
                <div style={{ marginTop: 12, padding: 12, borderRadius: 6, background: '#e74c3c15', border: '1px solid #e74c3c40', fontSize: 13 }}>
                    {errors.map((e, i) => <div key={i} style={{ color: '#e74c3c' }}>{e}</div>)}
                </div>
            )}

            <div className="fb-builder-actions">
                <button
                    className="fb-mode-btn"
                    onClick={handleCancel}
                    disabled={!isDirty}
                >
                    ยกเลิก
                </button>
                <button
                    className="fb-mode-btn active"
                    onClick={handleSave}
                    disabled={!isDirty || errors.length > 0}
                >
                    บันทึก
                </button>
            </div>
        </div>
    );
}

/* ─── Schema Name Input (local state + save on blur/enter) ─── */
function SchemaNameInput({ value, onSave }) {
    const [draft, setDraft] = useState(value);

    useEffect(() => {
        setDraft(value);
    }, [value]);

    const save = () => {
        if (draft.trim() && draft !== value) {
            onSave(draft);
        }
    };

    return (
        <input
            className="fb-schema-name-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={e => { if (e.key === 'Enter') { e.target.blur(); } }}
        />
    );
}

/* ─── Form Preview Component ─── */
function FormPreview({ schemaJson, formcfgJson, schemaName }) {
    const [formData, setFormData] = useState({});

    const formConfig = useMemo(
        () => schemaToFormConfig(schemaJson, formcfgJson),
        [schemaJson, formcfgJson]
    );

    const config = useMemo(() => ({
        ...formConfig,
        data: [formData],
        onChange: (e) => {
            const val = e?.target?.value;
            if (val && typeof val === 'object') {
                setFormData(val);
            }
        },
    }), [formConfig, formData]);

    return (
        <div className="fb-preview">
            <h3>{schemaName} — Preview</h3>
            <FormControl config={config} />
            <div style={{ marginTop: 20, padding: 12, borderRadius: 6, background: 'var(--bg-primary)', fontSize: 13, fontFamily: 'monospace' }}>
                <strong>Form Data:</strong>
                <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(formData, null, 2)}
                </pre>
            </div>
        </div>
    );
}

/* ─── Form Filler — Google Forms-like fill + submit ─── */
function FormFiller({ schema, formcfgJson, onSubmit }) {
    const [formData, setFormData] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const formConfig = useMemo(
        () => schemaToFormConfig(schema.json, formcfgJson),
        [schema.json, formcfgJson]
    );

    const config = useMemo(() => ({
        ...formConfig,
        data: [formData],
        onChange: (e) => {
            const val = e?.target?.value;
            if (val && typeof val === 'object') {
                setFormData(val);
            }
        },
    }), [formConfig, formData]);

    const handleSubmit = async () => {
        await createFormData(schema.id, formData);
        setSubmitted(true);
        onSubmit?.();
    };

    const handleReset = () => {
        setFormData({});
        setSubmitted(false);
    };

    if (submitted) {
        return (
            <div className="fb-filler">
                <div className="fb-filler-header">
                    <h2>{schema.name}</h2>
                </div>
                <div className="fb-filler-success">
                    <span className="fb-filler-success-icon">✓</span>
                    <h3>บันทึกสำเร็จ!</h3>
                    <p>ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว</p>
                    <button className="fb-mode-btn active" onClick={handleReset}>
                        กรอกอีกครั้ง
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fb-filler">
            <div className="fb-filler-header">
                <h2>{schema.name}</h2>
                <p>กรอกข้อมูลแล้วกดบันทึก</p>
            </div>
            <div className="fb-filler-body">
                <FormControl config={config} />
            </div>
            <div className="fb-filler-footer">
                <button className="fb-mode-btn" onClick={handleReset}>
                    ล้างข้อมูล
                </button>
                <button className="fb-mode-btn active" onClick={handleSubmit}>
                    บันทึก
                </button>
            </div>
        </div>
    );
}

export default FormBuilder;
