import { useState, useEffect, useCallback } from 'react';
import ModalControl from './ModalControl';
import ButtonControl from './ButtonControl';
import Icon from '../ui/Icon';
import { getSchemaHistory, restoreSchemaVersion } from '../../lib/schemaService';
import { computeSchemaDiff, formatTimestamp } from '../../lib/versionDiff';
import './VersionHistoryModal.css';

function SchemaHistoryModal({ isOpen, onClose, schemaRootId, onRestore }) {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [restoring, setRestoring] = useState(null);

    const fetchHistory = useCallback(async () => {
        if (!schemaRootId) return;
        setLoading(true);
        setError(null);
        try {
            const history = await getSchemaHistory(schemaRootId);
            setVersions(history || []);
            setExpandedId(null);
        } catch (err) {
            setError(err.message || 'ไม่สามารถโหลดประวัติได้');
        } finally {
            setLoading(false);
        }
    }, [schemaRootId]);

    useEffect(() => {
        if (isOpen && schemaRootId) fetchHistory();
        if (!isOpen) { setVersions([]); setExpandedId(null); setError(null); }
    }, [isOpen, schemaRootId, fetchHistory]);

    const handleRestore = async (versionId) => {
        setRestoring(versionId);
        try {
            const restored = await restoreSchemaVersion(versionId);
            if (onRestore) onRestore(restored);
        } catch (err) {
            setError('กู้คืนไม่สำเร็จ: ' + (err.message || ''));
        } finally {
            setRestoring(null);
        }
    };

    const getPayload = (v) => v.json || v.payload || {};
    const isDeleted = (v) => v._flag === 'd' || v.flag === 'deleted';
    const isCurrent = (v, idx) => idx === 0 && !isDeleted(v);

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <ModalControl isOpen={isOpen} title="ประวัติการแก้ไขฟอร์ม" onClose={onClose} size="lg">
            <div className="vh-container">
                {loading && (
                    <div className="vh-loading">
                        <div className="vh-spinner" />
                        <span>กำลังโหลดประวัติ...</span>
                    </div>
                )}

                {error && (
                    <div className="vh-error">
                        <p>{error}</p>
                        <ButtonControl
                            control={{ value: 'ลองใหม่', className: 'btn-primary btn-sm', onClick: fetchHistory }}
                            rowData={{}} rowIndex={0}
                        />
                    </div>
                )}

                {!loading && !error && versions.length === 0 && (
                    <div className="vh-empty">
                        <Icon name="clock" size="xl" className="vh-empty-icon" />
                        <p>ไม่พบประวัติการแก้ไข</p>
                    </div>
                )}

                {!loading && versions.length > 0 && (
                    <div className="vh-timeline">
                        {versions.map((version, idx) => {
                            const prevVersion = idx < versions.length - 1 ? versions[idx + 1] : null;
                            const deleted = isDeleted(version);
                            const current = isCurrent(version, idx);
                            const expanded = expandedId === version.id;
                            const diffs = expanded
                                ? computeSchemaDiff(
                                    prevVersion ? getPayload(prevVersion) : {},
                                    getPayload(version)
                                )
                                : [];

                            const fieldCount = Object.keys(getPayload(version)).filter(k => !k.startsWith('_')).length;

                            return (
                                <div
                                    key={version.id}
                                    className={`vh-card ${current ? 'vh-card--current' : ''} ${deleted ? 'vh-card--deleted' : ''}`}
                                >
                                    <div className="vh-header" onClick={() => toggleExpand(version.id)}>
                                        <div className="vh-header-left">
                                            <span className={`vh-badge ${current ? 'vh-badge--current' : ''}`}>
                                                v{version._doc_version || idx + 1}
                                            </span>
                                            {current && <span className="vh-tag--current">ปัจจุบัน</span>}
                                            {deleted && <span className="vh-tag--deleted">ลบแล้ว</span>}
                                            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                                                {fieldCount} ฟิลด์
                                            </span>
                                        </div>
                                        <div className="vh-header-right">
                                            <span className="vh-timestamp">
                                                <Icon name="clock" size="sm" />
                                                {formatTimestamp(version.modify_datetime || version._modify_datetime)}
                                            </span>
                                            <span className={`vh-expand-icon ${expanded ? 'vh-expand-icon--open' : ''}`}>
                                                ▸
                                            </span>
                                        </div>
                                    </div>

                                    {expanded && (
                                        <div className="vh-body">
                                            {diffs.length === 0 ? (
                                                <div className="vh-no-changes" style={{ textAlign: 'center', padding: 16 }}>
                                                    {!prevVersion ? 'สร้างฟอร์มใหม่' : 'ไม่มีการเปลี่ยนแปลงโครงสร้าง'}
                                                </div>
                                            ) : (
                                                <table className="vh-diff-table">
                                                    <thead>
                                                        <tr>
                                                            <th>ฟิลด์</th>
                                                            <th>สถานะ</th>
                                                            <th>รายละเอียด</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {diffs.map(d => (
                                                            <tr key={d.field} className={`vh-diff-${d.status}`}>
                                                                <td className="vh-diff-field">{d.label}</td>
                                                                <td>
                                                                    {d.status === 'added' && <span className="vh-tag--current">เพิ่ม</span>}
                                                                    {d.status === 'removed' && <span className="vh-tag--deleted">ลบ</span>}
                                                                    {d.status === 'changed' && <span className="vh-tag--migrated">แก้ไข</span>}
                                                                </td>
                                                                <td>
                                                                    {d.status === 'added' && <span style={{ color: 'var(--success)' }}>({d.type})</span>}
                                                                    {d.status === 'removed' && <span style={{ color: 'var(--error)', textDecoration: 'line-through' }}>({d.type})</span>}
                                                                    {d.status === 'changed' && <span style={{ color: 'var(--warning)' }}>{d.detail}</span>}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}

                                            {!current && !deleted && (
                                                <div className="vh-restore">
                                                    <button
                                                        className="vh-restore-btn"
                                                        onClick={(e) => { e.stopPropagation(); handleRestore(version.id); }}
                                                        disabled={restoring === version.id}
                                                    >
                                                        <Icon name="rotate-ccw" size="sm" />
                                                        {restoring === version.id ? 'กำลังกู้คืน...' : 'กู้คืนเวอร์ชันนี้'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </ModalControl>
    );
}

export default SchemaHistoryModal;
