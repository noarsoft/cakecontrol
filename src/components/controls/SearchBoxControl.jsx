import React, { useState, useRef, useEffect } from 'react';
import TableviewControl from './TableviewControl';
import './SearchBoxControl.css';

function SearchBoxControl({ control = {}, rowData = {}, rowIndex }) {
    const data = Array.isArray(control.data)
        ? control.data
        : Array.isArray(control.options)
            ? control.options
            : Array.isArray(control.tableConfig?.data)
                ? control.tableConfig.data
                : [];
    const keyField = control.keyField || 'id';
    const displayField = control.displayField;
    const displayFields = control.displayFields;
    const multiple = control.multiple !== false; // default true
    const placeholder = control.placeholder || 'ค้นหาและเลือก...';
    const maxSelected = control.maxSelected || null;
    const allowCreate = control.allowCreate !== false; // default true - when false, prevent adding items not in `data`

    const initialRaw = control.databind ? (rowData && rowData[control.databind]) : (control.value !== undefined ? control.value : (multiple ? [] : null));
    const normalizedInitial = multiple
        ? (Array.isArray(initialRaw) ? initialRaw : (initialRaw ? [initialRaw] : []))
        : (initialRaw === undefined ? null : initialRaw);
    const [selected, setSelected] = useState(normalizedInitial);
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [filtered, setFiltered] = useState(data);
    const [highlightIndex, setHighlightIndex] = useState(0);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        setFiltered(getFilteredData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, data]);

    useEffect(() => {
        const outside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowDropdown(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', outside);
        return () => document.removeEventListener('mousedown', outside);
    }, []);

    useEffect(() => {
        // sync from external changes and normalize to array when multiple
        const val = control.databind ? (rowData && rowData[control.databind]) : control.value;
        if (val !== undefined) {
            if (multiple) {
                setSelected(Array.isArray(val) ? val : (val ? [val] : []));
            } else {
                setSelected(val);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowData, control.value]);

    function getDisplayForRow(r) {
        if (r === undefined || r === null) return '';
        if (typeof r !== 'object') return String(r);
        if (displayField) return r[displayField];
        if (displayFields && Array.isArray(displayFields)) return displayFields.map(f => r[f]).join(' - ');
        // fallback to show object or key
        return String(r[keyField] || r.value || JSON.stringify(r));
    }

    function getFilteredData() {
        if (!query) return data;
        const q = String(query).toLowerCase();
        return data.filter(row => {
            if (row === null || row === undefined) return false;
            const fields = control.searchFields || displayFields || (displayField ? [displayField] : Object.keys(Object(row)));
            return fields.some(f => String(row[f] || '').toLowerCase().includes(q));
        });
    }

    const addItem = (row) => {
        if (!row) return;
        const key = row[keyField];
        // if creation from free text is disabled, only allow adding rows that exist in `data`
        const existsInData = data && Array.isArray(data) && data.some(d => String(d[keyField]) === String(key));
        if (!existsInData && !allowCreate) return;
        if (multiple) {
            const exists = (selected || []).some(s => String(s) === String(key) || (s && s[keyField] && String(s[keyField]) === String(key)));
            if (exists) return;
            if (maxSelected && selected.length >= maxSelected) return;
            const newSel = [...(selected || []), row];
            setSelected(newSel);
            emitChange(newSel);
        } else {
            setSelected(row);
            emitChange(row);
            setShowDropdown(false);
        }
        setQuery('');
    };

    const removeItem = (indexOrKey) => {
        if (multiple) {
            const newSel = (selected || []).filter((s, i) => {
                if (typeof indexOrKey === 'number') return i !== indexOrKey;
                const key = (s && s[keyField]) || s;
                return String(key) !== String(indexOrKey);
            });
            setSelected(newSel);
            emitChange(newSel);
            // refocus input and reopen dropdown so user can continue typing/searching
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    setShowDropdown(true);
                }
            }, 0);
        } else {
            setSelected(null);
            emitChange(null);
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    setShowDropdown(true);
                }
            }, 0);
        }
    };

    const emitChange = (value) => {
        if (control.onChange) {
            control.onChange({ target: { value } }, rowData, rowIndex);
        }
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightIndex(i => Math.min(i + 1, (filtered.length || 1) - 1));
            setShowDropdown(true);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filtered[highlightIndex]) {
                addItem(filtered[highlightIndex]);
            } else if (query && String(query).trim()) {
                // Create a lightweight row object from the typed query so it can be added
                const q = String(query).trim();
                const newRow = {};
                // ensure keyField present
                newRow[keyField] = q;
                if (displayField) newRow[displayField] = q;
                else newRow.value = q;
                addItem(newRow);
            }
        } else if (e.key === 'Backspace' && !query && multiple && (selected || []).length) {
            // remove last chip
            removeItem((selected || []).length - 1);
        }
    };

    const handleRowClick = (e) => {
        const rowEl = e.target.closest('tr');
        if (!rowEl) return;
        const rowIndex = Array.from(rowEl.parentElement.children).indexOf(rowEl);
        const row = filtered[rowIndex];
        if (row) addItem(row);
    };

    const tableConfig = {
        ...(control.tableConfig || {}),
        data: filtered
    };

    return (
        <div className={`searchbox-control ${control.className || ''}`} ref={containerRef} style={control.style}>
            <div className={`searchbox-input ${control.disabled ? 'disabled' : ''}`} onClick={() => inputRef.current && inputRef.current.focus()}>
                {/* chips */}
                {multiple && (selected || []).map((s, idx) => (
                    <div key={`chip-${idx}`} className="searchbox-chip">
                        <span className="searchbox-chip-label">{getDisplayForRow(s)}</span>
                        <button type="button" className="searchbox-chip-remove" onClick={() => removeItem(idx)} aria-label="ลบ">✕</button>
                    </div>
                ))}

                {!multiple && selected && (
                    <div className="searchbox-single">
                        <span>{getDisplayForRow(selected)}</span>
                        <button type="button" className="searchbox-chip-remove" onClick={() => removeItem()} aria-label="ลบ">✕</button>
                    </div>
                )}

                <input
                    ref={inputRef}
                    className="searchbox-text"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); setHighlightIndex(0); }}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={handleInputKeyDown}
                    placeholder={placeholder}
                    disabled={control.disabled}
                />
                <div className="searchbox-actions">
                    { (selected && !multiple) && (
                        <button type="button" className="searchbox-clear" onClick={() => removeItem()} title="ล้าง">✕</button>
                    )}
                </div>
            </div>

            {showDropdown && (
                <div className="searchbox-dropdown">
                        {filtered.length === 0 ? (
                            <div className="searchbox-empty">{control.emptyText || 'ไม่พบข้อมูล'}</div>
                        ) : (
                            // If a tableConfig with controls is provided, use TableviewControl, otherwise render a simple list
                            (control.tableConfig && Array.isArray(control.tableConfig.controls) && control.tableConfig.controls.length > 0) ? (
                                <div className="searchbox-table-wrapper" onClick={handleRowClick} style={{ maxHeight: control.maxHeight || '300px', overflowY: 'auto' }}>
                                    <TableviewControl config={tableConfig} />
                                </div>
                            ) : (
                                <ul className="searchbox-simple-list" style={{ maxHeight: control.maxHeight || '300px', overflowY: 'auto' }}>
                                    {filtered.map((row, i) => (
                                        <li key={`srow-${i}`} className="searchbox-simple-item" onClick={() => addItem(row)}>
                                            {getDisplayForRow(row)}
                                        </li>
                                    ))}
                                </ul>
                            )
                        )}
                </div>
            )}
        </div>
    );
}

export default SearchBoxControl;
