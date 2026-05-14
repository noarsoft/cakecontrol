import { useState, useMemo, useEffect, useCallback, useRef } from 'react';

const EMPTY_ARRAY = [];

export function useCRUDState(config) {
    const {
        data: dataProp = EMPTY_ARRAY,
        columns = EMPTY_ARRAY,
        keyField,
        pagination,
        searchFields = EMPTY_ARRAY,
        selectable = true,
        onAdd, onEdit, onDelete, onBulkDelete,
        onChange, onPageChange, onSearch, onSort,
    } = config;

    const getRowKey = useCallback((row, index) => keyField ? row[keyField] : index, [keyField]);

    const isAutoAdd = keyField && !onAdd;
    const isAutoEdit = keyField && !onEdit;
    const isAutoDelete = keyField && !onDelete;
    const isAutoBulkDelete = keyField && !onBulkDelete;
    const isAutoMode = isAutoAdd || isAutoEdit || isAutoDelete || isAutoBulkDelete;

    const [internalData, setInternalData] = useState(dataProp);
    const autoKeyRef = useRef(0);

    useEffect(() => { setInternalData(dataProp); }, [dataProp]);

    const data = isAutoMode ? internalData : dataProp;

    const updateData = useCallback((newData) => {
        setInternalData(newData);
        if (onChange) onChange(newData);
    }, [onChange]);

    // UI State
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [showModal, setShowModal] = useState(false);
    const [editingRow, setEditingRow] = useState(null);
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

    useEffect(() => { setSelectedRows(new Set()); }, [data.length]);
    useEffect(() => { setInternalPage(1); }, [searchQuery]);

    // Data Pipeline
    const filteredData = useMemo(() => {
        if (onSearch || !searchQuery.trim()) return data;
        const q = searchQuery.toLowerCase();
        const fields = searchFields.length > 0 ? searchFields : columns.map(c => c.key);
        return data.filter(row => fields.some(field => {
            const val = row[field];
            return val != null && String(val).toLowerCase().includes(q);
        }));
    }, [data, searchQuery, searchFields, columns, onSearch]);

    const sortedData = useMemo(() => {
        if (onSort || !sortKey) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[sortKey], bVal = b[sortKey];
            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            const cmp = (typeof aVal === 'number' && typeof bVal === 'number')
                ? aVal - bVal
                : String(aVal).localeCompare(String(bVal));
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

    // Handlers
    const handleSearch = useCallback((e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearch) {
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
            searchTimerRef.current = setTimeout(() => onSearch(query), 300);
        }
    }, [onSearch]);

    const handleSort = useCallback((columnIndex) => {
        const offset = (selectable && bulkEditMode) ? 1 : 0;
        const colIdx = columnIndex - offset;
        if (colIdx < 0 || colIdx >= columns.length) return;
        const col = columns[colIdx];
        if (!col.sortable) return;
        const newDirection = (sortKey === col.key && sortDirection === 'asc') ? 'desc' : 'asc';
        setSortKey(col.key);
        setSortDirection(newDirection);
        if (onSort) onSort(col.key, newDirection);
    }, [columns, selectable, bulkEditMode, sortKey, sortDirection, onSort]);

    const handlePageChange = useCallback((page) => {
        if (isClientPagination) setInternalPage(page);
        if (onPageChange) onPageChange(page);
    }, [isClientPagination, onPageChange]);

    const handleRowSelect = useCallback((rowIndex, checked) => {
        setSelectedRows(prev => {
            const next = new Set(prev);
            const row = paginatedData[rowIndex];
            if (!row) return prev;
            if (keyField) {
                const key = row[keyField];
                checked ? next.add(key) : next.delete(key);
            } else {
                const offset = isClientPagination ? (internalPage - 1) * pageLimit : 0;
                const dataIndex = offset + rowIndex;
                checked ? next.add(dataIndex) : next.delete(dataIndex);
            }
            return next;
        });
    }, [paginatedData, keyField, isClientPagination, internalPage, pageLimit]);

    const handleSelectAll = useCallback(() => {
        const pageKeys = keyField
            ? paginatedData.map(row => row[keyField])
            : paginatedData.map((_, i) => (isClientPagination ? (internalPage - 1) * pageLimit : 0) + i);
        const allSelected = pageKeys.every(k => selectedRows.has(k));
        if (allSelected) {
            setSelectedRows(prev => { const next = new Set(prev); pageKeys.forEach(k => next.delete(k)); return next; });
        } else {
            setSelectedRows(prev => { const next = new Set(prev); pageKeys.forEach(k => next.add(k)); return next; });
        }
    }, [paginatedData, selectedRows, keyField, isClientPagination, internalPage, pageLimit]);

    const openAddModal = useCallback(() => {
        setEditingRow(null); setModalFormData({}); setModalKey(k => k + 1); setShowModal(true);
    }, []);

    const openEditModal = useCallback((rowData, rowIndex) => {
        setEditingRow({ data: rowData, index: rowIndex }); setModalFormData({ ...rowData }); setModalKey(k => k + 1); setShowModal(true);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false); setEditingRow(null); setModalFormData({});
    }, []);

    const handleSave = useCallback(() => {
        if (editingRow) {
            const rowKey = keyField ? editingRow.data[keyField] : editingRow.index;
            if (onEdit) { onEdit(modalFormData, editingRow.data, rowKey, editingRow.index); }
            else if (isAutoEdit) { updateData(data.map(row => row[keyField] === rowKey ? { ...row, ...modalFormData } : row)); }
        } else {
            if (onAdd) { onAdd(modalFormData); }
            else if (isAutoAdd) { updateData([...data, { ...modalFormData, [keyField]: `__auto_${++autoKeyRef.current}` }]); }
        }
        closeModal();
    }, [editingRow, modalFormData, onAdd, onEdit, closeModal, keyField, isAutoEdit, isAutoAdd, data, updateData]);

    const openDeleteConfirm = useCallback((rowData, rowIndex) => {
        setDeletingRow({ data: rowData, index: rowIndex }); setShowDeleteConfirm(true);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        if (deletingRow) {
            const rowKey = keyField ? deletingRow.data[keyField] : deletingRow.index;
            if (onDelete) { onDelete(deletingRow.data, rowKey, deletingRow.index); }
            else if (isAutoDelete) { updateData(data.filter(row => row[keyField] !== rowKey)); }
        }
        setShowDeleteConfirm(false); setDeletingRow(null);
    }, [deletingRow, onDelete, keyField, isAutoDelete, data, updateData]);

    const openBulkDeleteConfirm = useCallback(() => { setShowBulkDeleteConfirm(true); }, []);

    const handleBulkDeleteConfirm = useCallback(() => {
        let selectedItems;
        if (keyField) { selectedItems = data.filter(row => selectedRows.has(row[keyField])); }
        else { selectedItems = Array.from(selectedRows).map(i => data[i]).filter(Boolean); }
        const selectedKeys = keyField ? selectedItems.map(row => row[keyField]) : Array.from(selectedRows);
        if (onBulkDelete) { onBulkDelete(selectedItems, selectedKeys); }
        else if (isAutoBulkDelete) { updateData(data.filter(row => !new Set(selectedKeys).has(row[keyField]))); }
        setSelectedRows(new Set()); setShowBulkDeleteConfirm(false);
    }, [selectedRows, data, onBulkDelete, keyField, isAutoBulkDelete, updateData]);

    return {
        data, paginatedData, columns, keyField, selectable,
        isAutoAdd, isAutoEdit, isAutoDelete, isAutoBulkDelete,
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
    };
}
