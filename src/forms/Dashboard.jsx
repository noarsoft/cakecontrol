import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initService, getSchemas, getFormDataBySchema, deleteSchema } from '../lib/schemaService';
import { PAGES } from '../lib/routes';
import ConfirmModal from '../components/controls/ConfirmModal';
import BulkEditToolbar from '../components/controls/BulkEditToolbar';
import Icon from '../components/ui/Icon';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../contexts/ToastContext';
import ThemeSwitcher from '../ThemeSwitcher';
import '../components/controls/CRUDControl.css';
import './Dashboard.css';

function formatModifyDate(dt) {
    if (!dt) return '—';
    const s = String(dt);
    if (s.length < 12) return '—';
    const y = s.slice(0, 4);
    const m = s.slice(4, 6);
    const d = s.slice(6, 8);
    const h = s.slice(8, 10);
    const min = s.slice(10, 12);
    return `${d}/${m}/${y} ${h}:${min}`;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [schemas, setSchemas] = useState([]);
    const [dataCounts, setDataCounts] = useState({});
    const [serviceMode, setServiceMode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [selected, setSelected] = useState(new Set());
    const [bulkEditMode, setBulkEditMode] = useState(false);
    const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

    const businessName = localStorage.getItem('activeBusinessName') || 'ไม่ระบุ';
    const businessId = localStorage.getItem('activeBusinessId');

    useEffect(() => {
        if (!businessId) {
            navigate(PAGES.HOME);
            return;
        }
    }, [businessId, navigate]);

    useEffect(() => {
        (async () => {
            try {
                const mode = await initService();
                setServiceMode(mode);
                const businessId = localStorage.getItem('activeBusinessId');
                const list = await getSchemas(businessId);
                setSchemas(list || []);

                const counts = {};
                await Promise.all((list || []).map(async s => {
                    const data = await getFormDataBySchema(s.id);
                    counts[s.id] = data.length;
                }));
                setDataCounts(counts);
            } catch {
                showToast('ไม่สามารถโหลดข้อมูลได้', 'error');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const reloadSchemas = async () => {
        const businessId = localStorage.getItem('activeBusinessId');
        const list = await getSchemas(businessId);
        setSchemas(list || []);
        const counts = {};
        await Promise.all((list || []).map(async s => {
            const data = await getFormDataBySchema(s.id);
            counts[s.id] = data.length;
        }));
        setDataCounts(counts);
    };

    const handleDeleteSchema = async () => {
        if (!deleteConfirm) return;
        try {
            await deleteSchema(deleteConfirm);
            setDeleteConfirm(null);
            await reloadSchemas();
            showToast('ลบฟอร์มเรียบร้อยแล้ว', 'success');
        } catch {
            showToast('ลบฟอร์มไม่สำเร็จ', 'error');
        }
    };

    const toggleSelect = (rootid) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(rootid)) next.delete(rootid);
            else next.add(rootid);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selected.size === schemas.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(schemas.map(s => s.rootid)));
        }
    };

    const exitBulkMode = () => {
        setBulkEditMode(false);
        setSelected(new Set());
    };

    const handleBulkDelete = async () => {
        const count = selected.size;
        try {
            await Promise.all([...selected].map(rootid => deleteSchema(rootid)));
            setBulkDeleteConfirm(false);
            exitBulkMode();
            await reloadSchemas();
            showToast(`ลบ ${count} ฟอร์มเรียบร้อยแล้ว`, 'success');
        } catch {
            showToast('ลบฟอร์มไม่สำเร็จบางรายการ', 'error');
        }
    };

    const totalForms = schemas.length;
    const totalRecords = Object.values(dataCounts).reduce((a, b) => a + b, 0);
    const totalFields = schemas.reduce((sum, s) => {
        const json = s.json || {};
        return sum + Object.keys(json).length;
    }, 0);

    if (loading) {
        return (
            <div className="dash-loading">
                <div className="dash-spinner" />
                <p>กำลังโหลด...</p>
            </div>
        );
    }

    return (
        <div className="dash-container">
            <header className="dash-header">
                <div className="dash-header-left">
                    <button className="dash-back-btn" onClick={() => navigate(PAGES.HOME)} title="กลับหน้า Business">
                        <span className="dash-back-arrow">←</span>
                        <span>กลับ</span>
                    </button>
                    <div>
                        <h1 className="dash-title">{businessName}</h1>
                        <span className="dash-service-badge" data-mode={serviceMode}>
                            {serviceMode === 'api' ? 'API Online' : 'localStorage'}
                        </span>
                    </div>
                </div>
                <div className="dash-header-right">
                    <ThemeSwitcher />
                    <button className="dash-new-form-btn" onClick={() => navigate(PAGES.FORM_BUILDER, { state: { createNew: true } })}>
                        + สร้างฟอร์มใหม่
                    </button>
                </div>
            </header>

            <div className="dash-stats">
                <div className="dash-stat-card" data-accent="blue">
                    <div className="dash-stat-icon"><Icon name="file" size="xl" /></div>
                    <div className="dash-stat-value">{totalForms}</div>
                    <div className="dash-stat-label">ฟอร์มทั้งหมด</div>
                </div>
                <div className="dash-stat-card" data-accent="green">
                    <div className="dash-stat-icon"><Icon name="message-circle" size="xl" /></div>
                    <div className="dash-stat-value">{totalRecords}</div>
                    <div className="dash-stat-label">ข้อมูลทั้งหมด</div>
                </div>
                <div className="dash-stat-card" data-accent="purple">
                    <div className="dash-stat-icon"><Icon name="grid" size="xl" /></div>
                    <div className="dash-stat-value">{totalFields}</div>
                    <div className="dash-stat-label">ฟิลด์ทั้งหมด</div>
                </div>
            </div>

            <section className="dash-forms-section">
                {schemas.length > 0 && (
                    <BulkEditToolbar
                        bulkEditMode={bulkEditMode}
                        selectedCount={selected.size}
                        onEnterBulkMode={() => setBulkEditMode(true)}
                        onExitBulkMode={exitBulkMode}
                        onBulkDelete={() => setBulkDeleteConfirm(true)}
                        rightContent={<h2 className="dash-toolbar-title">รายการฟอร์ม</h2>}
                    />
                )}

                {schemas.length === 0 ? (
                    <EmptyState
                        icon="file-text"
                        title="ยังไม่มีฟอร์ม"
                        ctaLabel="สร้างฟอร์มแรก"
                        onAction={() => navigate(PAGES.FORM_BUILDER, { state: { createNew: true } })}
                    />
                ) : (
                    <table className="dash-table">
                        <thead>
                            <tr>
                                <th className="dash-th-check"></th>
                                <th>ชื่อฟอร์ม</th>
                                <th>ฟิลด์</th>
                                <th>ข้อมูล</th>
                                <th>แก้ไขล่าสุด</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {schemas.map(s => {
                                const fieldCount = Object.keys(s.json || {}).length;
                                const dataCount = dataCounts[s.id] || 0;
                                const isSelected = selected.has(s.rootid);
                                return (
                                    <tr
                                        key={s.id}
                                        className={`dash-table-row${isSelected ? ' dash-row-selected' : ''}`}
                                        onClick={() => {
                                            if (bulkEditMode) { toggleSelect(s.rootid); return; }
                                            navigate(PAGES.FORM_BUILDER, { state: { activeSchemaId: s.id, mode: 'data' } });
                                        }}
                                    >
                                        <td className="dash-td-check" onClick={e => e.stopPropagation()}>
                                            {bulkEditMode && (
                                                <input
                                                    type="checkbox"
                                                    className="dash-checkbox"
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(s.rootid)}
                                                />
                                            )}
                                        </td>
                                        <td className="dash-table-name">{s.name}</td>
                                        <td>{fieldCount}</td>
                                        <td>{dataCount}</td>
                                        <td className="dash-table-date">{formatModifyDate(s.modify_datetime)}</td>
                                        <td className="dash-table-actions">
                                            <button
                                                className="dash-action-btn"
                                                title="แก้ไขฟอร์ม"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(PAGES.FORM_BUILDER, { state: { activeSchemaId: s.id, mode: 'builder' } });
                                                }}
                                            >
                                                <Icon name="edit" size="sm" />
                                            </button>
                                            <button
                                                className="dash-action-btn dash-action-share"
                                                title="คัดลอก link แชร์"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const url = `${window.location.origin}/form/${s.rootid}`;
                                                    navigator.clipboard.writeText(url).then(() => {
                                                        showToast('คัดลอก link แล้ว', 'success');
                                                    });
                                                }}
                                            >
                                                <Icon name="share" size="sm" />
                                            </button>
                                            <button
                                                className="dash-action-btn dash-action-delete"
                                                title="ลบฟอร์ม"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteConfirm(s.rootid);
                                                }}
                                            >
                                                <Icon name="trash" size="sm" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </section>

            <ConfirmModal
                isOpen={deleteConfirm !== null}
                title="ยืนยันการลบฟอร์ม"
                message="การลบฟอร์มนี้จะทำให้ข้อมูลทั้งหมดที่เคยกรอกผ่านฟอร์มนี้ถูกลบออกไปด้วย คุณแน่ใจหรือไม่?"
                variant="dangerous"
                onConfirm={handleDeleteSchema}
                onCancel={() => setDeleteConfirm(null)}
            />
            <ConfirmModal
                isOpen={bulkDeleteConfirm}
                title="ยืนยันการลบ"
                message={`ข้อมูลทั้งหมดในฟอร์มที่เลือกจะถูกลบออกไปด้วย (${selected.size} รายการที่เลือก)`}
                variant="dangerous"
                onConfirm={handleBulkDelete}
                onCancel={() => setBulkDeleteConfirm(false)}
            />
        </div>
    );
}
