import { useState, useMemo } from 'react';
import TableviewControl from '../components/controls/TableviewControl';
import ButtonControl from '../components/controls/ButtonControl';
import ConfirmModal from '../components/controls/ConfirmModal';
import ControlDesignerModal from './ControlDesignerModal';
import './TemplateManager.css';

function TemplateManager({ schemas, onSelectSchema, onCreateSchema, onUpdateSchema, onDeleteSchema, formcfgs }) {
    const [designerOpen, setDesignerOpen] = useState(false);
    const [editingSchema, setEditingSchema] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const PAGE_SIZE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = useMemo(() => {
        if (!searchQuery.trim()) return schemas;
        const q = searchQuery.toLowerCase();
        return schemas.filter(s => (s.name || '').toLowerCase().includes(q));
    }, [schemas, searchQuery]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleCreate = () => {
        setEditingSchema(null);
        setDesignerOpen(true);
    };

    const handleEdit = (schema) => {
        setEditingSchema(schema);
        setDesignerOpen(true);
    };

    const handleDesignerSave = async ({ name, json, formcfg }) => {
        if (editingSchema) {
            await onUpdateSchema(editingSchema, name, json, formcfg);
        } else {
            await onCreateSchema(name, json, formcfg);
        }
        setDesignerOpen(false);
        setEditingSchema(null);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm) return;
        await onDeleteSchema(deleteConfirm);
        setDeleteConfirm(null);
    };

    const formatDate = (dt) => {
        if (!dt) return '-';
        if (dt.length >= 15) {
            return `${dt.slice(6, 8)}/${dt.slice(4, 6)}/${dt.slice(0, 4)} ${dt.slice(9, 11)}:${dt.slice(11, 13)}`;
        }
        return dt;
    };

    const tableConfig = useMemo(() => ({
        data: paged.map(s => ({
            ...s,
            _displayDate: formatDate(s.modify_datetime),
            _fieldCount: s.json ? Object.keys(s.json).length : 0,
        })),
        headers: ['ชื่อแม่แบบ', 'Fields', 'วันที่แก้ไข', 'จัดการ'],
        colwidths: ['auto', '80', '160', '220'],
        controls: [
            { type: 'label', databind: 'name' },
            { type: 'label', databind: '_fieldCount' },
            { type: 'label', databind: '_displayDate' },
            {
                type: 'custom',
                render: (rowData) => (
                    <div className="tm-row-actions">
                        <ButtonControl
                            control={{
                                value: 'จัดการฟอร์ม',
                                className: 'btn-outline btn-sm',
                                onClick: () => onSelectSchema(rowData.id),
                            }}
                            rowData={rowData}
                            rowIndex={0}
                        />
                        <ButtonControl
                            control={{
                                value: 'แก้ไข',
                                className: 'btn-primary btn-sm',
                                onClick: () => handleEdit(rowData),
                            }}
                            rowData={rowData}
                            rowIndex={0}
                        />
                        <ButtonControl
                            control={{
                                value: 'ลบ',
                                className: 'btn-danger btn-sm',
                                onClick: () => setDeleteConfirm(rowData.rootid),
                            }}
                            rowData={rowData}
                            rowIndex={0}
                        />
                    </div>
                ),
            },
        ],
        ...(totalPages > 1 ? {
            pagination: { page: currentPage, limit: PAGE_SIZE, total: filtered.length },
            onPageChange: (page) => setCurrentPage(page),
        } : {}),
    }), [paged, currentPage, totalPages, filtered.length, onSelectSchema]);

    const editingFormcfg = editingSchema
        ? formcfgs[editingSchema.id]?.json_form_config
        : null;

    return (
        <div className="tm-container">
            <div className="tm-toolbar">
                <input
                    className="tm-search"
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    placeholder="ค้นหาแม่แบบ..."
                />
                <button className="fb-mode-btn active" onClick={handleCreate}>
                    + สร้างแม่แบบ
                </button>
            </div>

            {paged.length > 0 ? (
                <TableviewControl config={tableConfig} />
            ) : (
                <div className="tm-empty">
                    <div className="tm-empty-icon">&#128196;</div>
                    <p>{searchQuery ? 'ไม่พบแม่แบบที่ค้นหา' : 'ยังไม่มีแม่แบบ กดสร้างเพื่อเริ่มต้น'}</p>
                </div>
            )}

            <ControlDesignerModal
                isOpen={designerOpen}
                onClose={() => { setDesignerOpen(false); setEditingSchema(null); }}
                onSave={handleDesignerSave}
                schemaName={editingSchema?.name}
                schemaJson={editingSchema?.json}
                formcfgJson={editingFormcfg}
            />

            <ConfirmModal
                isOpen={deleteConfirm !== null}
                title="ยืนยันการลบ"
                message="ลบแม่แบบนี้จะลบข้อมูลทั้งหมดที่เกี่ยวข้อง ต้องการลบหรือไม่?"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteConfirm(null)}
            />
        </div>
    );
}

export default TemplateManager;
