import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import CRUDControl from '../components/controls/CRUDControl';
import ConfirmModal from '../components/controls/ConfirmModal';
import SchemaBuilder from './SchemaBuilder';
import SchemaNameInput from './SchemaNameInput';
import FormFiller from './FormFiller';
import { buildCrudConfig, generateDefaultView, generateDefaultFormcfg } from '../lib/schemaTransform';
import {
    initService,
    getBusinessById,
    getSchemas, createSchema, updateSchema, deleteSchema,
    getViewsBySchema, createView, updateView,
    getFormcfgsBySchema, createFormcfg, updateFormcfg,
    getFormDataBySchema, updateFormData, deleteFormData,
} from '../lib/schemaService';
import ThemeSwitcher from '../ThemeSwitcher';
import { useToast } from '../contexts/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './FormBuilder.css';

function FormBuilder() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const [schemas, setSchemas] = useState([]);
    const navState = location.state || {};
    const searchParams = new URLSearchParams(location.search);
    const [activeSchemaId, setActiveSchemaId] = useState(navState.activeSchemaId || searchParams.get('schema') || null);
    const [mode, setMode] = useState(navState.mode || searchParams.get('mode') || 'data');
    const [refreshKey, setRefreshKey] = useState(0);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [schemaData, setSchemaData] = useState(null);
    const [serviceMode, setServiceMode] = useState(null);
    const [builderDirty, setBuilderDirty] = useState(false);
    const [fillerDirty, setFillerDirty] = useState(false);
    const [pendingMode, setPendingMode] = useState(null);

    const createTriggered = useRef(false);

    const anyDirty = builderDirty || fillerDirty;

    useEffect(() => {
        if (!anyDirty) return;
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [anyDirty]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (activeSchemaId) {
            params.set('schema', activeSchemaId);
            params.set('mode', mode);
        } else {
            params.delete('schema');
            params.delete('mode');
        }
        const newSearch = params.toString();
        const currentSearch = location.search.replace(/^\?/, '');
        if (newSearch !== currentSearch) {
            navigate(`/formbuilder?${newSearch}`, { replace: true });
        }
    }, [activeSchemaId, mode]);

    // Init: detect backend + load schemas (+ auto-create if navigated with createNew)
    useEffect(() => {
        initService()
            .then(svcMode => {
                setServiceMode(svcMode);
                reloadSchemas().then(() => {
                    if (navState.createNew && !createTriggered.current) {
                        createTriggered.current = true;
                        window.history.replaceState({}, '');
                        handleAddSchema();
                    } else if (!navState.activeSchemaId && !navState.createNew && !searchParams.get('schema')) {
                        navigate('/dashboard', { replace: true });
                    }
                });
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

    const handleModeChange = (newMode) => {
        if (newMode === mode) return;
        if ((mode === 'builder' && builderDirty) || (mode === 'fill' && fillerDirty)) {
            setPendingMode(newMode);
            return;
        }
        if (newMode === 'dashboard') {
            navigate('/dashboard');
            return;
        }
        setMode(newMode);
        if (newMode === 'data') setRefreshKey(k => k + 1);
    };

    const handleDeleteSchema = async () => {
        if (!deleteConfirm) return;
        try {
            await deleteSchema(deleteConfirm);
            setDeleteConfirm(null);
            showToast('ลบฟอร์มเรียบร้อยแล้ว', 'success');
            navigate('/dashboard', { replace: true });
        } catch (err) {
            showToast('ลบฟอร์มไม่สำเร็จ', 'error');
        }
    };

    const handleExportExcel = () => {
        if (!schemaData?.data?.length || !activeSchema) return;
        const fields = Object.entries(activeSchema.json)
            .filter(([, def]) => def.type !== 'pagebreak')
            .map(([key, def]) => ({ key, label: def.label || key }));
        const rows = schemaData.data.map(row =>
            Object.fromEntries(fields.map(f => [f.label, row[f.key] ?? '']))
        );
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');
        XLSX.writeFile(wb, `${activeSchema.name || 'export'}.xlsx`);
        showToast('ส่งออก Excel สำเร็จ', 'success');
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
            onEdit: handleDataEdit,
            onDelete: handleDataDelete,
            hideAdd: true,
        };
    }, [activeSchema, schemaData, handleDataEdit, handleDataDelete]);

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

    return (
        <div className="formbuilder-container">
            {activeSchema ? (
                <>
                    <header className="fb-topbar">
                        <div className="fb-topbar-left">
                            <button className="fb-mode-btn fb-icon-btn" onClick={() => handleModeChange('dashboard')} title="กลับหน้า Dashboard">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                            </button>
                            <SchemaNameInput
                                value={activeSchema.name}
                                onSave={handleSchemaNameSave}
                            />
                        </div>
                        <div className="fb-topbar-center">
                            <div className="fb-mode-group">
                                <button
                                    className={`fb-mode-btn ${mode === 'data' ? 'active' : ''}`}
                                    onClick={() => handleModeChange('data')}
                                >
                                    ข้อมูล
                                </button>
                                <button
                                    className={`fb-mode-btn ${mode === 'builder' ? 'active' : ''}`}
                                    onClick={() => handleModeChange('builder')}
                                >
                                    แก้ไขฟอร์ม
                                </button>
                                <button
                                    className={`fb-mode-btn ${mode === 'fill' ? 'active' : ''}`}
                                    onClick={() => handleModeChange('fill')}
                                >
                                    เพิ่มข้อมูล
                                </button>
                                <button
                                    className="fb-mode-btn"
                                    onClick={() => {
                                        const url = `${window.location.origin}/form/${activeSchema.rootid}`;
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
                        <div className="fb-topbar-right">
                            <button
                                className="fb-delete-form-btn"
                                onClick={() => setDeleteConfirm(activeSchema.rootid)}
                                title="ลบฟอร์มนี้"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                ลบ
                            </button>
                        </div>
                    </header>
                    <main className="fb-main">
                        <div className="fb-content">
                            {mode === 'data' && crudConfig && (
                                <>
                                    <div className="fb-data-toolbar">
                                        <button
                                            className="fb-export-btn"
                                            onClick={handleExportExcel}
                                            disabled={!schemaData?.data?.length}
                                            title="ส่งออกข้อมูลเป็น Excel"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                            Export Excel
                                        </button>
                                    </div>
                                    <CRUDControl config={crudConfig} />
                                </>
                            )}
                            {mode === 'builder' && (
                                <SchemaBuilder
                                    schemaJson={activeSchema.json}
                                    onChange={handleSchemaJsonChange}
                                    onDirtyChange={setBuilderDirty}
                                />
                            )}
                            {mode === 'fill' && (
                                <FormFiller
                                    schema={activeSchema}
                                    formcfgJson={schemaData?.formcfg?.json_form_config}
                                    onSubmit={() => setRefreshKey(k => k + 1)}
                                    onDirtyChange={setFillerDirty}
                                />
                            )}
                        </div>
                    </main>
                </>
            ) : (
                <div className="fb-empty">
                    <div className="fb-empty-icon">📝</div>
                    <div>เลือกฟอร์มจาก sidebar หรือสร้างฟอร์มใหม่</div>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteConfirm !== null}
                title="ยืนยันการลบแม่แบบ"
                message="การลบแม่แบบนี้จะทำให้ข้อมูลทั้งหมดที่เคยกรอกผ่านแม่แบบนี้ถูกลบออกไปด้วย คุณแน่ใจหรือไม่?"
                variant="dangerous"
                onConfirm={handleDeleteSchema}
                onCancel={() => setDeleteConfirm(null)}
            />
            <ConfirmModal
                isOpen={pendingMode !== null}
                title="มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก"
                message={mode === 'fill' ? 'คุณกรอกข้อมูลแล้วยังไม่ได้ส่ง ต้องการออกจากหน้านี้หรือไม่?' : 'คุณแก้ไขฟอร์มแล้วยังไม่ได้บันทึก ต้องการออกจากหน้านี้หรือไม่?'}
                confirmText="ออกโดยไม่บันทึก"
                cancelText="อยู่ต่อ"
                variant="dangerous"
                onConfirm={() => {
                    const target = pendingMode;
                    setPendingMode(null);
                    setBuilderDirty(false);
                    setFillerDirty(false);
                    if (target === 'dashboard') {
                        navigate('/dashboard');
                        return;
                    }
                    setMode(target);
                    if (target === 'data') setRefreshKey(k => k + 1);
                }}
                onCancel={() => setPendingMode(null)}
            />
        </div>
    );
}

export default FormBuilder;
