import { useState, useEffect, useCallback, useMemo } from 'react';
import CRUDControl from '../components/controls/CRUDControl';
import ConfirmModal from '../components/controls/ConfirmModal';
import SchemaBuilder from './SchemaBuilder';
import SchemaNameInput from './SchemaNameInput';
import FormFiller from './FormFiller';
import TemplateManager from './TemplateManager';
import { buildCrudConfig, generateDefaultView, generateDefaultFormcfg } from '../lib/schemaTransform';
import {
    initService,
    getBusinessById,
    getSchemas, createSchema, updateSchema, deleteSchema,
    getViewsBySchema, createView, updateView,
    getFormcfgsBySchema, createFormcfg, updateFormcfg,
    getFormDataBySchema, createFormData, updateFormData, deleteFormData,
} from '../lib/schemaService';
import ThemeSwitcher from '../ThemeSwitcher';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import './FormBuilder.css';

function FormBuilder() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [schemas, setSchemas] = useState([]);
    const [activeSchemaId, setActiveSchemaId] = useState(null);
    const [mode, setMode] = useState('templates'); // 'templates' | 'data' | 'builder' | 'fill'
    const [refreshKey, setRefreshKey] = useState(0);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [schemaData, setSchemaData] = useState(null);
    const [serviceMode, setServiceMode] = useState(null);

    // Init: detect backend + load schemas
    useEffect(() => {
        initService()
            .then(mode => {
                setServiceMode(mode);
                reloadSchemas();
            });
    }, []);

    const resolveBusinessId = async () => {
        const rootid = localStorage.getItem('activeBusinessRootId');
        if (!rootid) return localStorage.getItem('activeBusinessId');
        try {
            const biz = await getBusinessById(rootid);
            if (biz) {
                localStorage.setItem('activeBusinessId', biz.id);
                return biz.id;
            }
        } catch (_) { /* fallback */ }
        return localStorage.getItem('activeBusinessId');
    };

    const reloadSchemas = async () => {
        const businessId = await resolveBusinessId();
        const list = await getSchemas(businessId);
        setSchemas(list || []);
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
        const businessId = await resolveBusinessId();
        try {
            const schema = await createSchema('ฟอร์มใหม่', {
                field_1: { type: 'string' },
            }, businessId);
            await createView(schema.id, 'table', generateDefaultView(schema.json), 'Default View');
            await createFormcfg(schema.id, generateDefaultFormcfg(schema.json), 'Default Form');
            await reloadSchemas();
            setActiveSchemaId(schema.id);
            setMode('builder');
            showToast('สร้างแม่แบบใหม่สำเร็จ', 'success');
        } catch (err) {
            showToast('สร้างแม่แบบไม่สำเร็จ: ' + err.message, 'error');
        }
    };

    const handleSelectSchema = (id) => {
        setActiveSchemaId(id);
        setMode('data');
        setRefreshKey(k => k + 1);
    };

    const handleDeleteSchema = async () => {
        if (!deleteConfirm) return;
        try {
            await deleteSchema(deleteConfirm);
            const deleted = schemas.find(s => s.rootid === deleteConfirm);
            setDeleteConfirm(null);
            if (deleted && activeSchemaId === deleted.id) setActiveSchemaId(null);
            await reloadSchemas();
            showToast('ลบแม่แบบเรียบร้อยแล้ว', 'success');
        } catch (err) {
            showToast('ลบแม่แบบไม่สำเร็จ', 'error');
        }
    };

    const handleSchemaNameSave = async (name) => {
        if (!activeSchema || !name.trim()) return;
        try {
            const updated = await updateSchema(activeSchema.rootid, { name: name.trim() });
            await reloadSchemas();
            if (updated?.id) setActiveSchemaId(updated.id);
            showToast('อัปเดตชื่อแม่แบบสำเร็จ', 'success');
        } catch (err) {
            showToast('อัปเดตชื่อไม่สำเร็จ', 'error');
        }
    };

    // ─── Data Manager: CRUDControl callbacks ───
    const handleDataAdd = useCallback(async (formData) => {
        if (!activeSchema) return;
        const clean = { ...formData };
        delete clean._formId;
        await createFormData(activeSchema.id, clean);
        setRefreshKey(k => k + 1);
        showToast('บันทึกข้อมูลสำเร็จ', 'success');
    }, [activeSchema, showToast]);

    const handleDataEdit = useCallback(async (formData, oldData) => {
        if (!oldData?._formId) return;
        const clean = { ...formData };
        delete clean._formId;
        await updateFormData(oldData._formId, clean);
        setRefreshKey(k => k + 1);
        showToast('แก้ไขข้อมูลสำเร็จ', 'success');
    }, [showToast]);

    const handleDataDelete = useCallback(async (rowData) => {
        if (!rowData?._formId) return;
        await deleteFormData(rowData._formId);
        setRefreshKey(k => k + 1);
        showToast('ลบข้อมูลสำเร็จ', 'success');
    }, [showToast]);

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
        try {
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
        } catch (err) {
            showToast('ไม่สามารถบันทึกโครงสร้างได้', 'error');
        }
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
        const businessId = await resolveBusinessId();
        try {
            const schema = await createSchema(name, json, businessId);
            await createView(schema.id, 'table', generateDefaultView(json), 'Default View');
            await createFormcfg(schema.id, formcfg, 'Default Form');
            await reloadSchemas();
            setActiveSchemaId(schema.id);
            setMode('data');
            setRefreshKey(k => k + 1);
            showToast('สร้างแม่แบบสำเร็จ', 'success');
        } catch (err) {
            showToast('สร้างแม่แบบไม่สำเร็จ', 'error');
        }
    };

    const handleTemplateUpdate = async (schema, name, json, formcfg) => {
        try {
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
            showToast('อัปเดตแม่แบบสำเร็จ', 'success');
        } catch (err) {
            showToast('อัปเดตแม่แบบไม่สำเร็จ', 'error');
        }
    };

    const handleTemplateDelete = async (rootid) => {
        try {
            await deleteSchema(rootid);
            const deleted = schemas.find(s => s.rootid === rootid);
            if (deleted && activeSchemaId === deleted.id) setActiveSchemaId(null);
            await reloadSchemas();
            showToast('ลบแม่แบบสำเร็จ', 'success');
        } catch (err) {
            showToast('ลบแม่แบบไม่สำเร็จ', 'error');
        }
    };

    const handleTemplateSelect = (schemaId) => {
        setActiveSchemaId(schemaId);
        setMode('data');
        setRefreshKey(k => k + 1);
    };

    return (
        <div className="formbuilder-container">
            {/* Sidebar */}
            <aside className="fb-sidebar">
                <div className="fb-sidebar-header">
                    <button className="fb-back-btn" onClick={() => navigate('/')} title="กลับหน้า Business">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                        <span>Business</span>
                    </button>
                    <h2>Form Builder</h2>
                    <p>สร้างและจัดการฟอร์ม</p>
                    <span style={{ fontSize: 11, opacity: 0.5, display: 'block', marginTop: 4 }}>
                        {serviceMode === 'api' ? '🟢 API Online' : '🔴 API Offline'}
                    </span>
                </div>
                <div className="fb-sidebar-list">
                    {schemas.map(s => (
                        <div key={s.id} className="fb-schema-row">
                            <button
                                className={`fb-schema-item ${activeSchemaId === s.id ? 'active' : ''}`}
                                onClick={() => handleSelectSchema(s.id)}
                            >
                                <span className="schema-name">{s.name}</span>
                                <span className="schema-count">{dataCounts[s.id] || 0} ข้อมูล</span>
                            </button>
                            <button
                                className="fb-delete-schema-btn"
                                onClick={e => { e.stopPropagation(); setDeleteConfirm(s.rootid); }}
                                title="ลบแม่แบบ"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
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
                            <div className="fb-mode-group">
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
                                            showToast('คัดลอก link แล้ว', 'success');
                                        });
                                    }}
                                    title="คัดลอก link สำหรับแชร์"
                                >
                                    แชร์
                                </button>
                            </div>
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
                title="ยืนยันการลบแม่แบบ"
                message="การลบแม่แบบนี้จะทำให้ข้อมูลทั้งหมดที่เคยกรอกผ่านแม่แบบนี้ถูกลบออกไปด้วย คุณแน่ใจหรือไม่?"
                variant="dangerous"
                onConfirm={handleDeleteSchema}
                onCancel={() => setDeleteConfirm(null)}
            />
        </div>
    );
}

export default FormBuilder;
