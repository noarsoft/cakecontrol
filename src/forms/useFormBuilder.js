import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { buildCrudConfig, generateDefaultView, generateDefaultFormcfg } from '../lib/schemaTransform';
import {
    initService,
    getBusinessById,
    getSchemas, createSchema, updateSchema, deleteSchema,
    getViewsBySchema, createView, updateView,
    getFormcfgsBySchema, createFormcfg, updateFormcfg,
    getFormDataBySchema, getFormDataBySchemaFamily,
    updateFormData, deleteFormData,
    migrateFormData, getSchemaVersionById,
} from '../lib/schemaService';
import { PAGES } from '../lib/routes';
import { useToast } from '../contexts/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';

export function useFormBuilder() {
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
    const [oldSchemaInfo, setOldSchemaInfo] = useState(null);
    const [showLogModal, setShowLogModal] = useState(false);
    const [migrating, setMigrating] = useState(false);
    const [dataCounts, setDataCounts] = useState({});

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
                        navigate(PAGES.DASHBOARD, { replace: true });
                    }
                });
            });
    }, []);

    const activeSchema = useMemo(
        () => schemas.find(s => s.id === activeSchemaId),
        [schemas, activeSchemaId]
    );

    useEffect(() => {
        if (!activeSchema) { setSchemaData(null); setOldSchemaInfo(null); return; }
        let cancelled = false;
        (async () => {
            const [views, formcfgs, allData] = await Promise.all([
                getViewsBySchema(activeSchema.id),
                getFormcfgsBySchema(activeSchema.id),
                getFormDataBySchemaFamily(activeSchema.rootid).catch(() => getFormDataBySchema(activeSchema.id)),
            ]);
            if (cancelled) return;

            const currentData = [];
            const oldData = [];
            for (const row of allData) {
                if (Number(row.data_schema_id) === Number(activeSchema.id)) {
                    currentData.push(row);
                } else {
                    oldData.push(row);
                }
            }

            setSchemaData({
                view: views[0] || null,
                formcfg: formcfgs[0] || null,
                data: currentData.map(f => ({ _formId: f.rootid, ...(f.data || f.payload || {}) })),
                rawData: currentData,
                oldData,
            });

            if (oldData.length > 0) {
                const oldSchemaId = oldData[0].data_schema_id;
                try {
                    const oldSchema = await getSchemaVersionById(oldSchemaId);
                    if (cancelled) return;
                    const oldFields = oldSchema?.payload || oldSchema?.json || {};
                    const newFields = activeSchema.json || {};
                    const changes = [];
                    const allKeys = new Set([...Object.keys(oldFields), ...Object.keys(newFields)]);
                    for (const key of allKeys) {
                        const oldDef = oldFields[key];
                        const newDef = newFields[key];
                        if (oldDef && !newDef) {
                            changes.push({ field: key, status: 'removed', oldType: oldDef.type, label: oldDef.label || key });
                        } else if (!oldDef && newDef) {
                            changes.push({ field: key, status: 'added', newType: newDef.type, label: newDef.label || key });
                        } else if (oldDef && newDef && oldDef.type !== newDef.type) {
                            changes.push({ field: key, status: 'type_changed', oldType: oldDef.type, newType: newDef.type, label: newDef.label || oldDef.label || key });
                        }
                    }
                    setOldSchemaInfo({ oldSchema, changes, oldDataCount: oldData.length });
                } catch (_) {
                    setOldSchemaInfo(null);
                }
            } else {
                setOldSchemaInfo(null);
            }
        })();
        return () => { cancelled = true; };
    }, [activeSchema, refreshKey]);

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
            navigate(PAGES.DASHBOARD);
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
            navigate(PAGES.DASHBOARD, { replace: true });
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

    const handleMigrateData = async () => {
        if (!schemaData?.oldData?.length) return;
        setMigrating(true);
        try {
            for (const row of schemaData.oldData) {
                await migrateFormData(row.rootid);
            }
            setRefreshKey(k => k + 1);
            showToast(`อัพเดตข้อมูล ${schemaData.oldData.length} รายการสำเร็จ`, 'success');
        } catch (err) {
            showToast('อัพเดตข้อมูลไม่สำเร็จ: ' + err.message, 'error');
        }
        setMigrating(false);
    };

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

    const handleShare = () => {
        if (!activeSchema) return;
        const url = `${window.location.origin}/form/${activeSchema.rootid}`;
        navigator.clipboard.writeText(url).then(() => {
            showToast('คัดลอก link แล้ว', 'success');
        });
    };

    const handleConfirmPending = () => {
        const target = pendingMode;
        setPendingMode(null);
        setBuilderDirty(false);
        setFillerDirty(false);
        if (target === 'dashboard') {
            navigate(PAGES.DASHBOARD);
            return;
        }
        setMode(target);
        if (target === 'data') setRefreshKey(k => k + 1);
    };

    return {
        activeSchema, activeSchemaId, mode, schemaData,
        deleteConfirm, setDeleteConfirm,
        oldSchemaInfo, showLogModal, setShowLogModal, migrating,
        anyDirty, pendingMode, setPendingMode, crudConfig,

        handleModeChange, handleSchemaNameSave, handleExportExcel,
        handleMigrateData, handleDeleteSchema, handleSchemaJsonChange,
        handleShare, handleConfirmPending, handleAddSchema,
        setBuilderDirty, setFillerDirty,
        showToast,
    };
}
