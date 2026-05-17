import CRUDControl from '../components/controls/CRUDControl';
import ConfirmModal from '../components/controls/ConfirmModal';
import ModalControl from '../components/controls/ModalControl';
import SchemaBuilder from './SchemaBuilder';
import SchemaNameInput from './SchemaNameInput';
import FormFiller from './FormFiller';
import ThemeSwitcher from '../ThemeSwitcher';
import { useFormBuilder } from './useFormBuilder';
import './FormBuilder.css';

function FormBuilder() {
    const {
        activeSchema, mode, schemaData, crudConfig,
        oldSchemaInfo, showLogModal, setShowLogModal, migrating,
        deleteConfirm, setDeleteConfirm,
        pendingMode, setPendingMode,
        handleModeChange, handleSchemaNameSave, handleExportExcel,
        handleMigrateData, handleDeleteSchema, handleSchemaJsonChange,
        handleShare, handleConfirmPending,
        setBuilderDirty, setFillerDirty,
    } = useFormBuilder();

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
                                <button className={`fb-mode-btn ${mode === 'data' ? 'active' : ''}`} onClick={() => handleModeChange('data')}>ข้อมูล</button>
                                <button className={`fb-mode-btn ${mode === 'builder' ? 'active' : ''}`} onClick={() => handleModeChange('builder')}>แก้ไขฟอร์ม</button>
                                <button className={`fb-mode-btn ${mode === 'fill' ? 'active' : ''}`} onClick={() => handleModeChange('fill')}>เพิ่มข้อมูล</button>
                            </div>
                        </div>
                        <div className="fb-topbar-right">
                            <ThemeSwitcher />
                            <button className="fb-share-btn" onClick={handleShare} title="คัดลอก link สำหรับแชร์">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                            </button>
                            <button className="fb-delete-form-btn" onClick={() => setDeleteConfirm(activeSchema.rootid)} title="ลบฟอร์มนี้">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
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
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                                    <span>โครงสร้างเปลี่ยน — มีข้อมูล {oldSchemaInfo.oldDataCount} รายการ ที่ใช้โครงสร้างเก่า</span>
                                                </div>
                                                <div className="fb-schema-change-actions">
                                                    <button className="fb-log-btn" onClick={() => setShowLogModal(true)}>log</button>
                                                    <button className="fb-migrate-btn" onClick={handleMigrateData} disabled={migrating}>
                                                        {migrating ? 'กำลังอัพเดต...' : 'อัพเดตข้อมูล'}
                                                    </button>
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
                                        <button className="fb-add-data-btn" onClick={() => handleModeChange('fill')}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                            เพิ่มข้อมูล
                                        </button>
                                        <button className="fb-export-btn" onClick={handleExportExcel} disabled={!schemaData?.data?.length} title="ส่งออกข้อมูลเป็น Excel">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                            Export Excel
                                        </button>
                                    </div>
                                    {schemaData?.data?.length === 0 ? (
                                        <div className="fb-data-empty">
                                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}>
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>
                                            </svg>
                                            <p className="fb-data-empty-title">ยังไม่มีข้อมูล</p>
                                            <p className="fb-data-empty-sub">เริ่มเก็บข้อมูลโดยกรอกฟอร์มแรกของคุณ</p>
                                            <button className="fb-data-empty-cta" onClick={() => handleModeChange('fill')}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                                เพิ่มข้อมูลแรก
                                            </button>
                                        </div>
                                    ) : (
                                        <CRUDControl config={crudConfig} />
                                    )}

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
                                    onSubmit={() => handleModeChange('data')}
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
                onConfirm={handleConfirmPending}
                onCancel={() => setPendingMode(null)}
            />
        </div>
    );
}

export default FormBuilder;
