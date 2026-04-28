import React, { useMemo } from 'react';
import TableviewControl from './TableviewControl';
import FormControl from './FormControl';
import ConfirmModal from './ConfirmModal';
import ModalControl from './ModalControl';
import ButtonControl from './ButtonControl';
import TextboxControl from './TextboxControl';
import { DEFAULT_LABELS } from './crud/constants';
import { useCRUDState } from './crud/useCRUDState';
import './CRUDControl.css';

function CRUDControl({ config = {} }) {
    const state = useCRUDState(config);
    const labels = { ...DEFAULT_LABELS, ...config.labels };
    const { formConfig = {} } = config;

    const {
        data, paginatedData, columns, keyField, selectable,
        isAutoAdd, isAutoBulkDelete,
        selectedRows, setSelectedRows, bulkEditMode, setBulkEditMode,
        showModal, editingRow, modalFormData, setModalFormData, modalKey,
        showDeleteConfirm, setShowDeleteConfirm,
        showBulkDeleteConfirm, setShowBulkDeleteConfirm,
        searchQuery, sortKey, sortDirection,
        currentPage, pageLimit, totalItems, totalPages,
        isClientPagination, internalPage,
        handleSearch, handleSort, handlePageChange,
        handleRowSelect, handleSelectAll,
        openAddModal, openEditModal, closeModal, handleSave,
        openDeleteConfirm, handleDeleteConfirm,
        openBulkDeleteConfirm, handleBulkDeleteConfirm,
    } = state;

    // Build table config
    const tableConfig = useMemo(() => {
        const headers = [];
        const colwidths = [];
        const controls = [];

        if (selectable && bulkEditMode) {
            const pageKeys = keyField
                ? paginatedData.map(row => row[keyField])
                : paginatedData.map((_, i) => (isClientPagination ? (internalPage - 1) * pageLimit : 0) + i);
            const allSelected = pageKeys.length > 0 && pageKeys.every(k => selectedRows.has(k));
            headers.push(allSelected ? '[ x ]' : '[   ]');
            colwidths.push('50');
            controls.push({ type: 'checkbox', value: '', onChange: (e, rowData, rowIndex) => handleRowSelect(rowIndex, e.target.checked) });
        }

        columns.forEach(col => {
            let headerText = col.header || col.key;
            if (col.sortable && sortKey === col.key) {
                headerText += sortDirection === 'asc' ? ' ▲' : ' ▼';
            }
            headers.push(headerText);
            colwidths.push(col.width || 'auto');
            controls.push({ type: col.type || 'label', databind: col.key, ...(col.controlProps || {}) });
        });

        headers.push(labels.actionsHeader);
        colwidths.push('140');
        controls.push({
            type: 'custom',
            render: (rowData, rowIndex) => (
                <div className="crud-row-actions">
                    <ButtonControl control={{ value: labels.editButton, className: 'btn-primary btn-sm', onClick: () => openEditModal(rowData, rowIndex) }} rowData={rowData} rowIndex={rowIndex} />
                    <ButtonControl control={{ value: labels.deleteButton, className: 'btn-danger btn-sm', onClick: () => openDeleteConfirm(rowData, rowIndex) }} rowData={rowData} rowIndex={rowIndex} />
                </div>
            ),
        });

        const cfg = { data: paginatedData, headers, colwidths, controls, onHeaderClick: (event) => {
            if (selectable && event.columnIndex === 0) { handleSelectAll(); return; }
            handleSort(event.columnIndex);
        }};

        if (totalPages > 1) {
            cfg.pagination = { page: currentPage, limit: pageLimit, total: totalItems };
            cfg.onPageChange = handlePageChange;
        }
        return cfg;
    }, [paginatedData, columns, selectable, bulkEditMode, selectedRows, sortKey, sortDirection,
        labels, currentPage, pageLimit, totalItems, totalPages, handleRowSelect, handleSelectAll,
        handleSort, handlePageChange, openEditModal, openDeleteConfirm, internalPage, isClientPagination, keyField]);

    // Inject checkbox selection state
    const finalTableConfig = useMemo(() => {
        if (!selectable || !bulkEditMode) return tableConfig;
        const offset = isClientPagination ? (internalPage - 1) * pageLimit : 0;
        return {
            ...tableConfig,
            controls: tableConfig.controls.map((ctrl, idx) => {
                if (idx === 0 && ctrl.type === 'checkbox') return { ...ctrl, databind: '__crud_selected' };
                return ctrl;
            }),
            data: paginatedData.map((row, i) => ({
                ...row,
                __crud_selected: keyField ? selectedRows.has(row[keyField]) : selectedRows.has(offset + i),
            })),
        };
    }, [tableConfig, selectable, bulkEditMode, selectedRows, paginatedData, isClientPagination, internalPage, pageLimit, keyField]);

    return (
        <div className={`crud-control ${config.className || ''}`}>
            <div className="crud-toolbar">
                <div className="crud-toolbar-left">
                    {selectable && !bulkEditMode && (
                        <ButtonControl control={{ value: labels.bulkEditButton, className: 'btn-outline', onClick: () => setBulkEditMode(true) }} rowData={{}} rowIndex={0} />
                    )}
                    {selectable && bulkEditMode && (
                        <>
                            <ButtonControl control={{ value: labels.bulkEditCancelButton, className: 'btn-warning', onClick: () => { setBulkEditMode(false); setSelectedRows(new Set()); } }} rowData={{}} rowIndex={0} />
                            {(config.onBulkDelete || isAutoBulkDelete) && selectedRows.size > 0 && (
                                <ButtonControl control={{ value: labels.bulkDeleteButton, className: 'btn-danger', onClick: () => openBulkDeleteConfirm() }} rowData={{}} rowIndex={0} />
                            )}
                            {selectedRows.size > 0 && <span className="crud-selected-count">{selectedRows.size} {labels.selectedCount}</span>}
                        </>
                    )}
                    <TextboxControl control={{ value: searchQuery, placeholder: labels.searchPlaceholder, className: 'crud-search', onChange: handleSearch }} rowData={{}} rowIndex={0} />
                </div>
                <div className="crud-toolbar-right">
                    {(config.onAdd || isAutoAdd) && (
                        <ButtonControl control={{ value: '+ ' + labels.addButton, className: 'btn-primary', onClick: () => openAddModal() }} rowData={{}} rowIndex={0} />
                    )}
                </div>
            </div>

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

            <ModalControl isOpen={showModal} title={editingRow ? labels.modalEditTitle : labels.modalAddTitle} onClose={closeModal} size="md"
                footer={<>
                    <ButtonControl control={{ value: labels.cancelButton, className: 'btn-secondary', onClick: () => closeModal() }} rowData={{}} rowIndex={0} />
                    <ButtonControl control={{ value: labels.saveButton, className: 'btn-primary', onClick: () => handleSave() }} rowData={{}} rowIndex={0} />
                </>}
            >
                <FormControl key={modalKey} config={{ ...formConfig, data: [modalFormData], onChange: (event) => setModalFormData(event.target.value) }} />
            </ModalControl>

            <ConfirmModal isOpen={showDeleteConfirm} title={labels.confirmDeleteTitle} message={labels.confirmDeleteMessage}
                confirmLabel={labels.deleteButton} cancelLabel={labels.cancelButton} confirmVariant="danger" isDangerous={true}
                onConfirm={handleDeleteConfirm} onCancel={() => setShowDeleteConfirm(false)} />

            <ConfirmModal isOpen={showBulkDeleteConfirm} title={labels.confirmDeleteTitle}
                message={`${labels.confirmBulkDeleteMessage} (${selectedRows.size} ${labels.selectedCount})`}
                confirmLabel={labels.bulkDeleteButton} cancelLabel={labels.cancelButton} confirmVariant="danger" isDangerous={true}
                onConfirm={handleBulkDeleteConfirm} onCancel={() => setShowBulkDeleteConfirm(false)} />
        </div>
    );
}

export default CRUDControl;
