import { useState, useEffect, useCallback } from 'react';
import ModalControl from './ModalControl';
import ButtonControl from './ButtonControl';
import Icon from '../ui/Icon';
import { getDataHistory, restoreDataVersion } from '../../lib/schemaService';
import { computeFieldDiff, formatTimestamp, getFlagLabel, formatValue } from '../../lib/versionDiff';
import './VersionHistoryModal.css';

function VersionHistoryModal({ isOpen, onClose, rootid, schemaJson, onRestore }) {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [restoring, setRestoring] = useState(null);

    const fetchHistory = useCallback(async () => {
        if (!rootid) return;
        setLoading(true);
        setError(null);
        try {
            const history = await getDataHistory(rootid);
            setVersions(history || []);
            setExpandedId(null);
        } catch (err) {
            setError(err.message || 'ไม่สามารถโหลดประวัติได้');
        } finally {
            setLoading(false);
        }
    }, [rootid]);

    useEffect(() => {
        if (isOpen && rootid) fetchHistory();
        if (!isOpen) { setVersions([]); setExpandedId(null); setError(null); }
    }, [isOpen, rootid, fetchHistory]);

    const handleRestore = async (versionId) => {
        setRestoring(versionId);
        try {
            const restored = await restoreDataVersion(versionId);
            if (onRestore) onRestore(restored);
        } catch (err) {
            setError('กู้คืนไม่สำเร็จ: ' + (err.message || ''));
        } finally {
            setRestoring(null);
        }
    };

    const getPayload = (v) => v.data || v.payload || {};
    const isDeleted = (v) => v._flag === 'd' || v.flag === 'deleted';
    const isCurrent = (v, idx) => idx === 0 && !isDeleted(v);

    const getFieldLabel = (key) => {
        if (!schemaJson || !schemaJson[key]) return key;
        return schemaJson[key].label || key;
    };

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    return (
        <ModalControl isOpen={isOpen} title="ประวัติการแก้ไขข้อมูล" onClose={onClose} size="lg">
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
                                ? computeFieldDiff(
                                    prevVersion ? getPayload(prevVersion) : {},
                                    getPayload(version)
                                )
                                : [];

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
                                            {!current && !deleted && version._flag === 'u' && (
                                                <span className="vh-tag--migrated">อัพเดต schema</span>
                                            )}
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
                                            <table className="vh-diff-table">
                                                <thead>
                                                    <tr>
                                                        <th>ฟิลด์</th>
                                                        <th>ค่าเก่า</th>
                                                        <th>ค่าใหม่</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {diffs.filter(d => d.status !== 'unchanged').length === 0 ? (
                                                        <tr>
                                                            <td colSpan={3} className="vh-no-changes">
                                                                {!prevVersion ? 'สร้างรายการใหม่' : 'ไม่มีการเปลี่ยนแปลง'}
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        diffs.filter(d => d.status !== 'unchanged').map(d => (
                                                            <tr key={d.field} className={`vh-diff-${d.status}`}>
                                                                <td className="vh-diff-field">{getFieldLabel(d.field)}</td>
                                                                <td className="vh-diff-old">
                                                                    {d.status === 'added' ? '-' : formatValue(d.oldValue)}
                                                                </td>
                                                                <td className="vh-diff-new">
                                                                    {d.status === 'removed' ? '-' : formatValue(d.newValue)}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>

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

export default VersionHistoryModal;
