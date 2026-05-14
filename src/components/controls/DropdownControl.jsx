// DropdownControl.jsx
import React, { useState, useRef, useEffect } from 'react';
import TableviewControl from './TableviewControl';
import './DropdownControl.css';

function DropdownControl({ control, rowData, rowIndex }) {
    const value = control.databind ? rowData[control.databind] : control.value;
    const [selectedValue, setSelectedValue] = useState(value || '');
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchText, setSearchText] = useState('');
    const containerRef = useRef(null);

    // Get display text for selected value
    const getDisplayText = () => {
        if (!selectedValue) return '';
        
        const selectedRow = control.data?.find(row => {
            const keyField = control.keyField || 'id';
            return String(row[keyField]) === String(selectedValue);
        });

        if (!selectedRow) return selectedValue;

        // Use displayField or multiple fields
        if (control.displayField) {
            return selectedRow[control.displayField];
        }

        if (control.displayFields && Array.isArray(control.displayFields)) {
            return control.displayFields.map(field => selectedRow[field]).join(' - ');
        }

        return selectedValue;
    };

    // Filter data based on search text
    const getFilteredData = () => {
        if (!control.data || !Array.isArray(control.data)) return [];
        
        if (!searchText || !control.searchable) return control.data;

        return control.data.filter(row => {
            const searchFields = control.searchFields || control.displayFields || [control.displayField];
            
            return searchFields.some(field => {
                const fieldValue = String(row[field] || '').toLowerCase();
                return fieldValue.includes(searchText.toLowerCase());
            });
        });
    };

    const handleRowClick = (selectedRow) => {
        const keyField = control.keyField || 'id';
        const newValue = selectedRow[keyField];
        
        setSelectedValue(newValue);
        setShowDropdown(false);
        setSearchText('');

        if (control.onChange) {
            const event = { 
                target: { 
                    value: newValue,
                    selectedRow: selectedRow
                } 
            };
            control.onChange(event, rowData, rowIndex);
        }

        if (control.onSelect) {
            control.onSelect(selectedRow, rowData, rowIndex);
        }
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setSelectedValue('');
        setSearchText('');
        
        if (control.onChange) {
            const event = { 
                target: { 
                    value: '',
                    selectedRow: null
                } 
            };
            control.onChange(event, rowData, rowIndex);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowDropdown(false);
                setSearchText('');
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showDropdown]);

    // Create TableviewControl config
    const tableConfig = {
        ...control.tableConfig,
        data: getFilteredData()
    };

    const handleTableClick = (e) => {
        // Find the clicked row
        const row = e.target.closest('tr');
        if (!row || !row.parentElement || row.parentElement.tagName !== 'TBODY') return;
        
        const rowIndex = Array.from(row.parentElement.children).indexOf(row);
        const rowData = getFilteredData()[rowIndex];
        
        if (rowData) {
            handleRowClick(rowData);
        }
    };

    return (
        <div className="dropdown-control" ref={containerRef}>
            <div className="dropdown-input-wrapper">
                <input
                    type="text"
                    className="dropdown-input"
                    value={showDropdown && control.searchable ? searchText : getDisplayText()}
                    onChange={(e) => {
                        if (control.searchable) {
                            setSearchText(e.target.value);
                        }
                    }}
                    onClick={() => setShowDropdown(!showDropdown)}
                    onFocus={() => {
                        if (control.searchable) {
                            setShowDropdown(true);
                        }
                    }}
                    placeholder={control.placeholder || 'เลือกรายการ...'}
                    readOnly={!control.searchable}
                />
                <div className="dropdown-buttons">
                    {selectedValue && control.clearable !== false && (
                        <button
                            className="dropdown-clear-btn"
                            onClick={handleClear}
                            title="ล้าง"
                        >
                            ✕
                        </button>
                    )}
                    <button
                        className="dropdown-toggle-btn"
                        onClick={() => setShowDropdown(!showDropdown)}
                        title={showDropdown ? 'ปิด' : 'เปิด'}
                    >
                        {showDropdown ? '▲' : '▼'}
                    </button>
                </div>
            </div>

            {showDropdown && (
                <div className="dropdown-menu">
                    {getFilteredData().length === 0 ? (
                        <div className="dropdown-empty">
                            {searchText ? 'ไม่พบข้อมูลที่ค้นหา' : 'ไม่มีข้อมูล'}
                        </div>
                    ) : (
                        // If a tableConfig is provided, prefer TableviewControl.
                        // Otherwise render a simple list fallback so items are always visible.
                        control.tableConfig ? (
                            <div 
                                className="dropdown-table-wrapper"
                                style={{
                                    maxHeight: control.maxHeight || '300px',
                                    overflowY: 'auto'
                                }}
                                onClick={handleTableClick}
                            >
                                <TableviewControl config={tableConfig} />
                            </div>
                        ) : (
                            <div
                                className="dropdown-list-wrapper"
                                style={{ maxHeight: control.maxHeight || '300px', overflowY: 'auto' }}
                            >
                                <ul className="dropdown-list">
                                    {getFilteredData().map((row, idx) => {
                                        const keyField = control.keyField || 'id';
                                        const value = row[keyField];
                                        let label = '';
                                        if (control.displayField) label = row[control.displayField];
                                        else if (control.displayFields && Array.isArray(control.displayFields)) label = control.displayFields.map(f => row[f]).join(' - ');
                                        else label = String(value);

                                        return (
                                            <li
                                                key={idx}
                                                className="dropdown-list-item"
                                                onClick={() => handleRowClick(row)}
                                            >
                                                <div className="dropdown-list-item-label">{label}</div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default DropdownControl;
