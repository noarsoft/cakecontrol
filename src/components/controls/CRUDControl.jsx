// CRUDControl.jsx
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import TableviewControl from './TableviewControl';
import FormControl from './FormControl';
import ConfirmModal from './ConfirmModal';
import ButtonControl from './ButtonControl';
import TextboxControl from './TextboxControl';
import './CRUDControl.css';

const DEFAULT_LABELS = {
    addButton: 'เพิ่มข้อมูล',
    editButton: 'แก้ไข',
    deleteButton: 'ลบ',
    bulkDeleteButton: 'ลบที่เลือก',
    searchPlaceholder: 'ค้นหา...',
    modalAddTitle: 'เพิ่มข้อมูลใหม่',
    modalEditTitle: 'แก้ไขข้อมูล',
    saveButton: 'บันทึก',
    cancelButton: 'ยกเลิก',
    confirmDeleteTitle: 'ยืนยันการลบ',
    confirmDeleteMessage: 'คุณต้องการลบข้อมูลนี้หรือไม่?',
    confirmBulkDeleteMessage: 'คุณต้องการลบข้อมูลที่เลือกหรือไม่?',
    emptyMessage: 'ไม่มีข้อมูล',
    actionsHeader: '',
    selectedCount: 'รายการที่เลือก',
    selectAllHeader: '',
    bulkEditButton: 'เลือกรายการ',
    bulkEditCancelButton: 'ยกเลิกเลือก',
};

function CRUDControl({ config = {} }) {
    const {
        data = [],
        columns = [],
        formConfig = {},
        pagination,
        searchFields = [],
        selectable = true,
        onAdd,
        onEdit,
        onDelete,
        onBulkDelete,
        onPageChange,
        onSearch,
        onSort,
        className = '',
    } = config;

    const labels = { ...DEFAULT_LABELS, ...config.labels };

    // State
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [showModal, setShowModal] = useState(false);
    const [editingRow, setEditingRow] = useState(null); // null = add mode, { data, index } = edit mode
    const [modalFormData, setModalFormData] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingRow, setDeletingRow] = useState(null);
    const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
    const [bulkEditMode, setBulkEditMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [internalPage, setInternalPage] = useState(1);
    const [modalKey, setModalKey] = useState(0);

    const searchTimerRef = useRef(null);

    // Clear selection when data changes
    useEffect(() => {
        setSelectedRows(new Set());
    }, [data.length]);

    // Reset internal page when search changes
    useEffect(() => {
        setInternalPage(1);
    }, [searchQuery]);

    // Close modal on Escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && showModal) {
                closeModal();
            }
        };
        if (showModal) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEsc);
        }
        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEsc);
        };
    }, [showModal]);

    // ========== Data Pipeline ==========
    const filteredData = useMemo(() => {
        if (onSearch || !searchQuery.trim()) return data;

        const q = searchQuery.toLowerCase();
        const fields = searchFields.length > 0
            ? searchFields
            : columns.map(c => c.key);

        return data.filter(row =>
            fields.some(field => {
                const val = row[field];
                if (val == null) return false;
                return String(val).toLowerCase().includes(q);
            })
        );
    }, [data, searchQuery, searchFields, columns, onSearch]);

    const sortedData = useMemo(() => {
        if (onSort || !sortKey) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];

            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;

            let cmp;
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                cmp = aVal - bVal;
            } else {
                cmp = String(aVal).localeCompare(String(bVal));
            }

            return sortDirection === 'asc' ? cmp : -cmp;
        });
    }, [filteredData, sortKey, sortDirection, onSort]);

    const pageLimit = pagination?.limit || 10;
    const isClientPagination = !onPageChange;
    const currentPage = isClientPagination ? internalPage : (pagination?.page || 1);
    const totalItems = isClientPagination ? sortedData.length : (pagination?.total || data.length);
    const totalPages = Math.ceil(totalItems / pageLimit);

    const paginatedData = useMemo(() => {
        if (!isClientPagination) return sortedData;
        const start = (internalPage - 1) * pageLimit;
        return sortedData.slice(start, start + pageLimit);
    }, [sortedData, internalPage, pageLimit, isClientPagination]);

    // ========== Handlers ==========
    const handleSearch = useCallback((e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (onSearch) {
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
            searchTimerRef.current = setTimeout(() => {
                onSearch(query);
            }, 300);
        }
    }, [onSearch]);

    const handleSort = useCallback((columnIndex) => {
        const offset = selectable ? 1 : 0;
        const colIdx = columnIndex - offset;

        // Ignore checkbox column and actions column
        if (colIdx < 0 || colIdx >= columns.length) return;

        const col = columns[colIdx];
        if (!col.sortable) return;

        const newDirection = (sortKey === col.key && sortDirection === 'asc') ? 'desc' : 'asc';
        setSortKey(col.key);
        setSortDirection(newDirection);

        if (onSort) {
            onSort(col.key, newDirection);
        }
    }, [columns, selectable, sortKey, sortDirection, onSort]);

    const handlePageChange = useCallback((page) => {
        if (isClientPagination) {
            setInternalPage(page);
        }
        if (onPageChange) {
            onPageChange(page);
        }
    }, [isClientPagination, onPageChange]);

    // Row selection
    const handleRowSelect = useCallback((rowIndex, checked) => {
        setSelectedRows(prev => {
            const next = new Set(prev);
            // Map paginated index back to original data index
            const offset = isClientPagination ? (internalPage - 1) * pageLimit : 0;
            const dataIndex = offset + rowIndex;
            if (checked) {
                next.add(dataIndex);
            } else {
                next.delete(dataIndex);
            }
            return next;
        });
    }, [isClientPagination, internalPage, pageLimit]);

    const handleSelectAll = useCallback(() => {
        const offset = isClientPagination ? (internalPage - 1) * pageLimit : 0;
        const pageIndices = paginatedData.map((_, i) => offset + i);
        const allSelected = pageIndices.every(i => selectedRows.has(i));

        if (allSelected) {
            setSelectedRows(prev => {
                const next = new Set(prev);
                pageIndices.forEach(i => next.delete(i));
                return next;
            });
        } else {
            setSelectedRows(prev => {
                const next = new Set(prev);
                pageIndices.forEach(i => next.add(i));
                return next;
            });
        }
    }, [paginatedData, selectedRows, isClientPagination, internalPage, pageLimit]);

    // Modal
    const openAddModal = useCallback(() => {
        setEditingRow(null);
        setModalFormData({});
        setModalKey(k => k + 1);
        setShowModal(true);
    }, []);

    const openEditModal = useCallback((rowData, rowIndex) => {
        setEditingRow({ data: rowData, index: rowIndex });
        setModalFormData({ ...rowData });
        setModalKey(k => k + 1);
        setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setEditingRow(null);
        setModalFormData({});
    }, []);

    const handleSave = useCallback(() => {
        if (editingRow) {
            if (onEdit) onEdit(modalFormData, editingRow.data, editingRow.index);
        } else {
            if (onAdd) onAdd(modalFormData);
        }
        closeModal();
    }, [editingRow, modalFormData, onAdd, onEdit, closeModal]);

    // Delete
    const openDeleteConfirm = useCallback((rowData, rowIndex) => {
        setDeletingRow({ data: rowData, index: rowIndex });
        setShowDeleteConfirm(true);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        if (deletingRow && onDelete) {
            onDelete(deletingRow.data, deletingRow.index);
        }
        setShowDeleteConfirm(false);
        setDeletingRow(null);
    }, [deletingRow, onDelete]);

    // Bulk delete
    const openBulkDeleteConfirm = useCallback(() => {
        setShowBulkDeleteConfirm(true);
    }, []);

    const handleBulkDeleteConfirm = useCallback(() => {
        if (onBulkDelete) {
            const selectedItems = Array.from(selectedRows).map(i => data[i]).filter(Boolean);
            onBulkDelete(selectedItems);
        }
        setSelectedRows(new Set());
        setShowBulkDeleteConfirm(false);
    }, [selectedRows, data, onBulkDelete]);

    // ========== Build TableviewControl Config ==========
    const tableConfig = useMemo(() => {
        const headers = [];
        const colwidths = [];
        const controls = [];

        // Checkbox column (only in bulk edit mode)
        if (selectable && bulkEditMode) {
            const offset = isClientPagination ? (internalPage - 1) * pageLimit : 0;
            const pageIndices = paginatedData.map((_, i) => offset + i);
            const allSelected = pageIndices.length > 0 && pageIndices.every(i => selectedRows.has(i));
            headers.push(allSelected ? '[ x ]' : '[   ]');
            colwidths.push('50');
            controls.push({
                type: 'checkbox',
                value: '',
                onChange: (e, rowData, rowIndex) => handleRowSelect(rowIndex, e.target.checked),
            });
        }

        // Data columns
        columns.forEach(col => {
            let headerText = col.header || col.key;
            if (col.sortable) {
                if (sortKey === col.key) {
                    headerText += sortDirection === 'asc' ? ' ▲' : ' ▼';
                }
            }
            headers.push(headerText);
            colwidths.push(col.width || 'auto');
            controls.push({
                type: col.type || 'label',
                databind: col.key,
                ...(col.controlProps || {}),
            });
        });

        // Actions column
        headers.push(labels.actionsHeader);
        colwidths.push('140');
        controls.push({
            type: 'custom',
            render: (rowData, rowIndex) => (
                <div className="crud-row-actions">
                    <ButtonControl control={{
                        value: labels.editButton,
                        className: 'btn-primary btn-sm',
                        onClick: (e) => { openEditModal(rowData, rowIndex); },
                    }} rowData={rowData} rowIndex={rowIndex} />
                    <ButtonControl control={{
                        value: labels.deleteButton,
                        className: 'btn-danger btn-sm',
                        onClick: (e) => { openDeleteConfirm(rowData, rowIndex); },
                    }} rowData={rowData} rowIndex={rowIndex} />
                </div>
            ),
        });

        return {
            data: paginatedData,
            headers,
            colwidths,
            controls,
            onHeaderClick: (event) => {
                const { columnIndex } = event;
                // If clicking checkbox header, toggle select all
                if (selectable && columnIndex === 0) {
                    handleSelectAll();
                    return;
                }
                handleSort(columnIndex);
            },
            ...(totalPages > 1 ? {
                pagination: {
                    page: currentPage,
                    limit: pageLimit,
                    total: totalItems,
                },
                onPageChange: handlePageChange,
            } : {}),
        };
    }, [
        paginatedData, columns, selectable, bulkEditMode, selectedRows, sortKey, sortDirection,
        labels, currentPage, pageLimit, totalItems, totalPages,
        handleRowSelect, handleSelectAll, handleSort, handlePageChange,
        openEditModal, openDeleteConfirm, internalPage, isClientPagination,
    ]);

    // Sync checkbox checked state per row
    const tableConfigWithSelection = useMemo(() => {
        if (!selectable || !bulkEditMode) return tableConfig;

        const offset = isClientPagination ? (internalPage - 1) * pageLimit : 0;

        return {
            ...tableConfig,
            controls: tableConfig.controls.map((ctrl, idx) => {
                if (idx === 0 && ctrl.type === 'checkbox') {
                    return {
                        ...ctrl,
                        // Use a function-style value to check per-row
                        _getChecked: (rowIndex) => selectedRows.has(offset + rowIndex),
                    };
                }
                return ctrl;
            }),
            // Override data to inject checked state into each row
            data: paginatedData.map((row, i) => ({
                ...row,
                __crud_selected: selectedRows.has(offset + i),
            })),
        };
    }, [tableConfig, selectable, bulkEditMode, selectedRows, paginatedData, isClientPagination, internalPage, pageLimit]);

    // Final config: set checkbox databind to __crud_selected
    const finalTableConfig = useMemo(() => {
        if (!selectable || !bulkEditMode) return tableConfig;
        return {
            ...tableConfigWithSelection,
            controls: tableConfigWithSelection.controls.map((ctrl, idx) => {
                if (idx === 0 && ctrl.type === 'checkbox') {
                    return { ...ctrl, databind: '__crud_selected' };
                }
                return ctrl;
            }),
        };
    }, [tableConfigWithSelection, selectable, tableConfig]);

    // ========== Render ==========
    return (
        <div className={`crud-control ${className}`}>
            {/* Toolbar */}
            <div className="crud-toolbar">
                <div className="crud-toolbar-left">
                    {selectable && !bulkEditMode && (
                        <ButtonControl control={{
                            value: labels.bulkEditButton,
                            className: 'btn-secondary btn-sm',
                            onClick: (e) => { setBulkEditMode(true); },
                        }} rowData={{}} rowIndex={0} />
                    )}
                    {selectable && bulkEditMode && (
                        <>
                            <ButtonControl control={{
                                value: labels.bulkEditCancelButton,
                                className: 'btn-secondary btn-sm',
                                onClick: (e) => { setBulkEditMode(false); setSelectedRows(new Set()); },
                            }} rowData={{}} rowIndex={0} />
                            {onBulkDelete && selectedRows.size > 0 && (
                                <ButtonControl control={{
                                    value: labels.bulkDeleteButton,
                                    className: 'btn-danger btn-sm',
                                    onClick: (e) => { openBulkDeleteConfirm(); },
                                }} rowData={{}} rowIndex={0} />
                            )}
                            {selectedRows.size > 0 && (
                                <span className="crud-selected-count">
                                    {selectedRows.size} {labels.selectedCount}
                                </span>
                            )}
                        </>
                    )}
                    <TextboxControl control={{
                        value: searchQuery,
                        placeholder: labels.searchPlaceholder,
                        className: 'crud-search',
                        onChange: handleSearch,
                    }} rowData={{}} rowIndex={0} />
                </div>
                <div className="crud-toolbar-right">
                    {onAdd && (
                        <ButtonControl control={{
                            value: '+ ' + labels.addButton,
                            className: 'btn-primary',
                            onClick: (e) => { openAddModal(); },
                        }} rowData={{}} rowIndex={0} />
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="crud-table-wrapper">
                {(paginatedData.length > 0 || data.length > 0) ? (
                    <TableviewControl config={finalTableConfig} />
                ) : (
                    <div className="crud-empty">
                        <div className="crud-empty-icon">-</div>
                        <p className="crud-empty-text">{labels.emptyMessage}</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="crud-modal-backdrop" onClick={(e) => {
                    if (e.target === e.currentTarget) closeModal();
                }}>
                    <div className="crud-modal">
                        <div className="crud-modal-header">
                            <h2 className="crud-modal-title">
                                {editingRow ? labels.modalEditTitle : labels.modalAddTitle}
                            </h2>
                            <button className="crud-modal-close" onClick={closeModal}>
                                &times;
                            </button>
                        </div>
                        <div className="crud-modal-body">
                            <FormControl
                                key={modalKey}
                                config={{
                                    ...formConfig,
                                    data: [modalFormData],
                                    onChange: (event) => {
                                        setModalFormData(event.target.value);
                                    },
                                }}
                            />
                        </div>
                        <div className="crud-modal-footer">
                            <ButtonControl control={{
                                value: labels.cancelButton,
                                className: 'btn-secondary',
                                onClick: (e) => { closeModal(); },
                            }} rowData={{}} rowIndex={0} />
                            <ButtonControl control={{
                                value: labels.saveButton,
                                className: 'btn-primary',
                                onClick: (e) => { handleSave(); },
                            }} rowData={{}} rowIndex={0} />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title={labels.confirmDeleteTitle}
                message={labels.confirmDeleteMessage}
                confirmLabel={labels.deleteButton}
                cancelLabel={labels.cancelButton}
                confirmVariant="danger"
                isDangerous={true}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteConfirm(false)}
            />

            {/* Bulk Delete Confirm */}
            <ConfirmModal
                isOpen={showBulkDeleteConfirm}
                title={labels.confirmDeleteTitle}
                message={`${labels.confirmBulkDeleteMessage} (${selectedRows.size} ${labels.selectedCount})`}
                confirmLabel={labels.bulkDeleteButton}
                cancelLabel={labels.cancelButton}
                confirmVariant="danger"
                isDangerous={true}
                onConfirm={handleBulkDeleteConfirm}
                onCancel={() => setShowBulkDeleteConfirm(false)}
            />
        </div>
    );
}

export default CRUDControl;
