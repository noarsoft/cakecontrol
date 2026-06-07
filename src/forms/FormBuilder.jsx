import { useState, useEffect, useRef } from 'react';
import CRUDControl from '../components/controls/CRUDControl';
import ConfirmModal from '../components/controls/ConfirmModal';
import ModalControl from '../components/controls/ModalControl';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import IconButton from '../components/ui/IconButton';
import EmptyState from '../components/ui/EmptyState';
import VersionHistoryModal from '../components/controls/VersionHistoryModal';
import SchemaHistoryModal from '../components/controls/SchemaHistoryModal';
import SchemaBuilder from './SchemaBuilder';
import SchemaNameInput from './SchemaNameInput';
import FormFiller from './FormFiller';
import ThemeSwitcher from '../ThemeSwitcher';
import { useFormBuilder } from './useFormBuilder';
import './FormBuilder.css';

function ColumnToggle({ columns, visibleKeys, onChange }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);

    useEffect(() => {
        if (!open) { setSearch(''); return; }
        const handler = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, [open]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') setOpen(false);
    };

    const handleSelectAll = () => {
        onChange(new Set(columns.map(c => c.key)));
    };

    const handleResetDefault = () => {
        onChange(null);
    };

    const handleToggle = (key, checked) => {
        const next = new Set(visibleKeys);
        if (checked) {
            next.add(key);
        } else {
            next.delete(key);
        }
        if (next.size === 0) { onChange(null); return; }
        onChange(next);
    };

    const filtered = search
        ? columns.filter(c => c.header.toLowerCase().includes(search.toLowerCase()))
        : columns;

    return (
        <div className="fb-col-toggle" ref={ref} onKeyDown={handleKeyDown}>
            <Button
                variant="secondary"
                size="sm"
                icon="columns"
                onClick={() => setOpen(prev => !prev)}
                aria-expanded={open}
                aria-haspopup="true"
            >
                คอลัมน์ ({visibleKeys.size}/{columns.length})
            </Button>
            {open && (
                <div className="fb-col-toggle-dropdown" role="group" aria-label="เลือกคอลัมน์ที่จะแสดง">
                    <div className="fb-col-toggle-search">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="ค้นหาคอลัมน์..."
                            autoFocus
                            className="fb-col-toggle-search-input"
                        />
                    </div>
                    <div className="fb-col-toggle-actions">
                        <button type="button" onClick={handleSelectAll}>เลือกทั้งหมด</button>
                        <button type="button" onClick={handleResetDefault}>คืนค่าเริ่มต้น</button>
                    </div>
                    <div className="fb-col-toggle-list">
                        {filtered.map(col => (
                            <label key={col.key} className="fb-col-toggle-item">
                                <input
                                    type="checkbox"
                                    checked={visibleKeys.has(col.key)}
                                    onChange={(e) => handleToggle(col.key, e.target.checked)}
                                />
                                {col.header}
                            </label>
                        ))}
                        {filtered.length === 0 && (
                            <div className="fb-col-toggle-empty">ไม่พบคอลัมน์</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function FormBuilder() {
    const {
        activeSchema, mode, schemaData, crudConfig,
        allDataColumns, visibleColumns, setVisibleColumns,
        historyRootId, handleCloseHistory, handleRestoreVersion,
        showSchemaHistory, setShowSchemaHistory, handleRestoreSchemaVersion,
        oldSchemaInfo, showLogModal, setShowLogModal, migrating,
        deleteConfirm, setDeleteConfirm,
        pendingMode, setPendingMode,
        handleModeChange, handleSchemaNameSave, handleExportExcel,
        handleMigrateData, handleDeleteSchema, handleSchemaJsonChange,
        handleShare, handleConfirmPending, handleFillerSubmit,
        handleSaveAndTest,
        setBuilderDirty, setFillerDirty,
    } = useFormBuilder();

    return (
        <div className="formbuilder-container">
            {activeSchema ? (
                <>
                    <header className="fb-topbar">
                        <div className="fb-topbar-left">
                            <IconButton icon="arrow-left" label="กลับหน้า Dashboard" onClick={() => handleModeChange('dashboard')} />
                            <SchemaNameInput
                                value={activeSchema.name}
                                onSave={handleSchemaNameSave}
                            />
                        </div>
                        <div className="fb-topbar-center">
                            <div className="fb-mode-group">
                                <button className={`fb-mode-btn ${mode === 'data' ? 'active' : ''}`} onClick={() => handleModeChange('data')}>ข้อมูลฟอร์ม</button>
                                <button className={`fb-mode-btn ${mode === 'builder' ? 'active' : ''}`} onClick={() => handleModeChange('builder')}>แก้ไขฟอร์ม</button>
                                <button className={`fb-mode-btn ${mode === 'fill' ? 'active' : ''}`} onClick={() => handleModeChange('fill')}>จำลองฟอร์ม</button>
                            </div>
                        </div>
                        <div className="fb-topbar-right">
                            <Button variant="secondary" size="sm" icon="clock" onClick={() => setShowSchemaHistory(true)}>
                                ประวัติแก้ไขฟอร์ม
                            </Button>
                            <IconButton icon="share" label="คัดลอก link สำหรับแชร์" onClick={handleShare} />
                            <ThemeSwitcher />
                            <IconButton icon="trash" variant="danger" label="ลบฟอร์มนี้" onClick={() => setDeleteConfirm(activeSchema.rootid)} />
                        </div>
                    </header>
                    <main className="fb-main">
                        <div className="fb-content">
                            {mode === 'data' && crudConfig && (
                                <>
                                    {oldSchemaInfo && oldSchemaInfo.changes.length > 0 && (
                                        <div className="fb-schema-change-banner">
                                            <div className="fb-schema-change-header">
                                                <div className="fb-schema-change-title">
                                                    <Icon name="warning" />
                                                    <span>โครงสร้างเปลี่ยน — มีข้อมูล {oldSchemaInfo.oldDataCount} รายการ ที่ใช้โครงสร้างเก่า</span>
                                                </div>
                                                <div className="fb-schema-change-actions">
                                                    <Button variant="secondary" size="sm" onClick={() => setShowLogModal(true)}>log</Button>
                                                    <Button variant="primary" size="sm" loading={migrating} onClick={handleMigrateData}>
                                                        {migrating ? 'กำลังอัพเดต...' : 'อัพเดตข้อมูล'}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="fb-schema-change-fields">
                                                {oldSchemaInfo.changes.map(c => (
                                                    <span key={c.field} className={`fb-field-change fb-field-${c.status}`}>
                                                        {c.status === 'removed' && <><s>{c.label}</s> <small>({c.oldType})</small></>}
                                                        {c.status === 'added' && <><strong>{c.label}</strong> <small>({c.newType})</small></>}
                                                        {c.status === 'type_changed' && <><s>{c.oldType}</s> → {c.newType} <small>({c.label})</small></>}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="fb-data-toolbar">
                                        <Button variant="primary" icon="plus" className="fb-toolbar-lead" onClick={() => handleModeChange('fill')}>
                                            เพิ่มข้อมูล
                                        </Button>
                                        {allDataColumns.length > 0 && (
                                            <ColumnToggle
                                                columns={allDataColumns}
                                                visibleKeys={visibleColumns}
                                                onChange={setVisibleColumns}
                                            />
                                        )}
                                        <Button variant="secondary" icon="download" onClick={handleExportExcel} disabled={!schemaData?.data?.length} title="ส่งออกข้อมูลเป็น Excel">
                                            Export Excel
                                        </Button>
                                    </div>
                                    <CRUDControl config={crudConfig} />

                                    <ModalControl
                                        isOpen={showLogModal}
                                        title="Log การเปลี่ยนแปลงโครงสร้าง"
                                        onClose={() => setShowLogModal(false)}
                                        size="md"
                                    >
                                        {oldSchemaInfo && (
                                            <div className="fb-log-content">
                                                <p style={{ marginBottom: 12, color: 'var(--text-secondary)' }}>
                                                    ข้อมูลเก่า {oldSchemaInfo.oldDataCount} รายการ ยังใช้โครงสร้างเดิม
                                                </p>
                                                <table className="fb-log-table">
                                                    <thead>
                                                        <tr><th>Field</th><th>สถานะ</th><th>รายละเอียด</th></tr>
                                                    </thead>
                                                    <tbody>
                                                        {oldSchemaInfo.changes.map(c => (
                                                            <tr key={c.field} className={`fb-log-row-${c.status}`}>
                                                                <td><code>{c.field}</code></td>
                                                                <td>
                                                                    {c.status === 'removed' && <span className="fb-badge-removed">ลบ</span>}
                                                                    {c.status === 'added' && <span className="fb-badge-added">เพิ่ม</span>}
                                                                    {c.status === 'type_changed' && <span className="fb-badge-changed">เปลี่ยน</span>}
                                                                </td>
                                                                <td>
                                                                    {c.status === 'removed' && `${c.oldType} → ถูกลบ`}
                                                                    {c.status === 'added' && `เพิ่มใหม่ (${c.newType})`}
                                                                    {c.status === 'type_changed' && `${c.oldType} → ${c.newType}`}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </ModalControl>

                                    <VersionHistoryModal
                                        isOpen={historyRootId !== null}
                                        onClose={handleCloseHistory}
                                        rootid={historyRootId}
                                        schemaJson={activeSchema?.json}
                                        onRestore={handleRestoreVersion}
                                    />
                                </>
                            )}
                            {mode === 'builder' && (
                                <SchemaBuilder
                                    schemaJson={activeSchema.json}
                                    onChange={handleSchemaJsonChange}
                                    onSaveAndTest={handleSaveAndTest}
                                    onDirtyChange={setBuilderDirty}
                                />
                            )}
                            {mode === 'fill' && (
                                <FormFiller
                                    schema={activeSchema}
                                    formcfgJson={schemaData?.formcfg?.json_form_config}
                                    onSubmit={handleFillerSubmit}
                                    onDirtyChange={setFillerDirty}
                                />
                            )}
                        </div>
                    </main>
                </>
            ) : (
                <div className="fb-empty">
                    <EmptyState
                        icon="file-text"
                        title="ยังไม่ได้เลือกฟอร์ม"
                        subtitle="เลือกฟอร์มจาก Dashboard หรือสร้างฟอร์มใหม่เพื่อเริ่มต้น"
                    />
                </div>
            )}

            <SchemaHistoryModal
                isOpen={showSchemaHistory}
                onClose={() => setShowSchemaHistory(false)}
                schemaRootId={activeSchema?.rootid}
                onRestore={handleRestoreSchemaVersion}
            />
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
                onConfirm={handleConfirmPending}
                onCancel={() => setPendingMode(null)}
            />
        </div>
    );
}

export default FormBuilder;
