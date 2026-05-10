import { useState, useEffect, useCallback, useMemo } from 'react';
import CRUDControl from '../components/controls/CRUDControl';
import ConfirmModal from '../components/controls/ConfirmModal';
import SchemaBuilder from './SchemaBuilder';
import SchemaNameInput from './SchemaNameInput';
import FormPreview from './FormPreview';
import FormFiller from './FormFiller';
import TemplateManager from './TemplateManager';
import { buildCrudConfig, generateDefaultView, generateDefaultFormcfg } from '../lib/schemaTransform';
import {
    initService,
    getSchemas, createSchema, updateSchema, deleteSchema,
    getViewsBySchema, createView, updateView,
    getFormcfgsBySchema, createFormcfg, updateFormcfg,
    getFormDataBySchema, createFormData, updateFormData, deleteFormData,
} from '../lib/schemaService';
import ThemeSwitcher from '../ThemeSwitcher';
import './FormBuilder.css';

function FormBuilder() {
    const [schemas, setSchemas] = useState([]);
    const [activeSchemaId, setActiveSchemaId] = useState(null);
    const [mode, setMode] = useState('templates'); // 'templates' | 'data' | 'builder' | 'preview' | 'fill'
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
                data: formData.map(f => ({ _formId: f.rootid, ...f.data })),
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
        const deleted = schemas.find(s => s.rootid === deleteConfirm);
        setDeleteConfirm(null);
        if (deleted && activeSchemaId === deleted.id) setActiveSchemaId(null);
        await reloadSchemas();
    };

    const handleSchemaNameSave = async (name) => {
        if (!activeSchema || !name.trim()) return;
        const updated = await updateSchema(activeSchema.rootid, { name: name.trim() });
        await reloadSchemas();
        if (updated?.id) setActiveSchemaId(updated.id);
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
            viewJson: schemaData.view?.json_table_config,
            formcfgJson: schemaData.formcfg?.json_form_config,
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
        const updated = await updateSchema(activeSchema.rootid, { json: newJson });
        const newSchemaId = updated?.id ?? activeSchema.id;

        const [views, formcfgs] = await Promise.all([
            getViewsBySchema(newSchemaId),
            getFormcfgsBySchema(newSchemaId),
        ]);
        const viewUpdate = views[0]
            ? updateView(views[0].rootid, { json_table_config: generateDefaultView(newJson) })
            : createView(newSchemaId, 'table', generateDefaultView(newJson), 'Default View');
        const cfgUpdate = formcfgs[0]
            ? updateFormcfg(formcfgs[0].rootid, { json_form_config: generateDefaultFormcfg(newJson) })
            : createFormcfg(newSchemaId, generateDefaultFormcfg(newJson), 'Default Form');
        await Promise.all([viewUpdate, cfgUpdate]);

        await reloadSchemas();
        setActiveSchemaId(newSchemaId);
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

    // Formcfgs cache for template manager
    const [formcfgsCache, setFormcfgsCache] = useState({});
    useEffect(() => {
        (async () => {
            const cache = {};
            await Promise.all(schemas.map(async s => {
                const cfgs = await getFormcfgsBySchema(s.id);
                if (cfgs[0]) cache[s.id] = cfgs[0];
            }));
            setFormcfgsCache(cache);
        })();
    }, [schemas, refreshKey]);

    // ─── Template Manager Callbacks ───
    const handleTemplateCreate = async (name, json, formcfg) => {
        const schema = await createSchema(name, json);
        await createView(schema.id, 'table', generateDefaultView(json), 'Default View');
        await createFormcfg(schema.id, formcfg, 'Default Form');
        await reloadSchemas();
        setActiveSchemaId(schema.id);
        setMode('data');
        setRefreshKey(k => k + 1);
    };

    const handleTemplateUpdate = async (schema, name, json, formcfg) => {
        const updated = await updateSchema(schema.rootid, { name, json });
        const newSchemaId = updated?.id ?? schema.id;
        const [views, formcfgs] = await Promise.all([
            getViewsBySchema(newSchemaId),
            getFormcfgsBySchema(newSchemaId),
        ]);
        const viewUpdate = views[0]
            ? updateView(views[0].rootid, { json_table_config: generateDefaultView(json) })
            : createView(newSchemaId, 'table', generateDefaultView(json), 'Default View');
        const cfgUpdate = formcfgs[0]
            ? updateFormcfg(formcfgs[0].rootid, { json_form_config: formcfg })
            : createFormcfg(newSchemaId, formcfg, 'Default Form');
        await Promise.all([viewUpdate, cfgUpdate]);
        await reloadSchemas();
        setRefreshKey(k => k + 1);
    };

    const handleTemplateDelete = async (rootid) => {
        await deleteSchema(rootid);
        const deleted = schemas.find(s => s.rootid === rootid);
        if (deleted && activeSchemaId === deleted.id) setActiveSchemaId(null);
        await reloadSchemas();
    };

    const handleTemplateSelect = (schemaId) => {
        setActiveSchemaId(schemaId);
        setMode('data');
        setRefreshKey(k => k + 1);
    };

    return (
        <div className="formbuilder-container">
            {/* Theme Toggle */}
            <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }}>
                <ThemeSwitcher />
            </div>
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
                                onClick={e => { e.stopPropagation(); setDeleteConfirm(s.rootid); }}
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
                <button
                    className={`fb-template-btn ${mode === 'templates' ? 'active' : ''}`}
                    onClick={() => { setMode('templates'); setActiveSchemaId(null); }}
                >
                    จัดการแม่แบบ
                </button>
            </aside>

            {/* Main */}
            <main className="fb-main">
                {mode === 'templates' ? (
                    <div className="fb-content">
                        <TemplateManager
                            schemas={schemas}
                            formcfgs={formcfgsCache}
                            onSelectSchema={handleTemplateSelect}
                            onCreateSchema={handleTemplateCreate}
                            onUpdateSchema={handleTemplateUpdate}
                            onDeleteSchema={handleTemplateDelete}
                        />
                    </div>
                ) : activeSchema ? (
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
                                    formcfgJson={schemaData?.formcfg?.json_form_config}
                                    onSubmit={() => setRefreshKey(k => k + 1)}
                                />
                            )}
                            {mode === 'preview' && (
                                <FormPreview
                                    schemaJson={activeSchema.json}
                                    formcfgJson={schemaData?.formcfg?.json_form_config}
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

export default FormBuilder;
