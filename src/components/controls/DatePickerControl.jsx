// DatePickerControl.jsx
import React, { useState, useRef, useEffect } from 'react';
import CalendarGridControl from './CalendarGridControl';
import './DatePickerControl.css';

function DatePickerControl({ control, rowData, rowIndex }) {
    const value = control.databind ? rowData[control.databind] : control.value;
    const [selectedDate, setSelectedDate] = useState(value || '');
    const [showCalendar, setShowCalendar] = useState(false);
    const containerRef = useRef(null);

    // Convert Buddhist year to Christian year
    const beToCe = (beYear) => beYear - 543;
    const ceToBe = (ceYear) => ceYear + 543;

    // Format date for display (DD/MM/YYYY พ.ศ.)
    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '';
        
        // Parse YYYY-MM-DD format to avoid timezone issues
        const parts = dateStr.split('-');
        if (parts.length !== 3) return '';
        
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);
        
        if (isNaN(year) || isNaN(month) || isNaN(day)) return '';
        
        const dayStr = String(day).padStart(2, '0');
        const monthStr = String(month).padStart(2, '0');
        const yearBE = ceToBe(year);
        
        return `${dayStr}/${monthStr}/${yearBE}`;
    };

    // Parse YYYYMMDD to YYYY-MM-DD
    const parseYYYYMMDD = (dateStr) => {
        if (!dateStr || dateStr.length !== 8) return '';
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${year}-${month}-${day}`;
    };

    // Get initial date for calendar (YYYYMMDD format)
    const getInitialDate = () => {
        if (!selectedDate) {
            const today = new Date();
            const year = String(today.getFullYear());
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}${month}${day}`;
        }
        return selectedDate.replace(/-/g, '');
    };

    const handleDateClick = (dateKey, dateInfo) => {
        setSelectedDate(dateKey);
        setShowCalendar(false);

        if (control.onChange) {
            const event = { target: { value: dateKey } };
            control.onChange(event, rowData, rowIndex);
        }
    };

    const handleClear = () => {
        setSelectedDate('');
        if (control.onChange) {
            const event = { target: { value: '' } };
            control.onChange(event, rowData, rowIndex);
        }
    };

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };

        if (showCalendar) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showCalendar]);

    return (
        <div className="datepicker-control" ref={containerRef}>
            <div className="datepicker-input-wrapper">
                <input
                    type="text"
                    className="datepicker-input"
                    value={formatDisplayDate(selectedDate)}
                    onClick={() => setShowCalendar(!showCalendar)}
                    placeholder={control.placeholder || 'เลือกวันที่ (พ.ศ.)'}
                    readOnly
                />
                <div className="datepicker-buttons">
                    {selectedDate && (
                        <button
                            className="datepicker-clear-btn"
                            onClick={handleClear}
                            title="ล้างวันที่"
                        >
                            ✕
                        </button>
                    )}
                    <button
                        className="datepicker-calendar-btn"
                        onClick={() => setShowCalendar(!showCalendar)}
                        title="เปิดปฏิทิน"
                    >
                        📅
                    </button>
                </div>
            </div>

            {showCalendar && (
                <div className="datepicker-modal" onClick={() => setShowCalendar(false)}>
                    <div className="datepicker-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="datepicker-modal-header">
                            <h3 className="datepicker-modal-title">เลือกวันที่</h3>
                            <button 
                                className="datepicker-modal-close"
                                onClick={() => setShowCalendar(false)}
                                title="ปิด"
                            >
                                ✕
                            </button>
                        </div>
                        <CalendarGridControl
                            control={{
                                initialDate: getInitialDate(),
                                editable: false,
                                events: selectedDate ? { [selectedDate]: '📍 วันที่เลือก' } : {},
                                onClick: handleDateClick
                            }}
                            rowData={{}}
                            rowIndex={0}
                        />
                        <div className="datepicker-modal-footer">
                            <button 
                                className="datepicker-modal-cancel-btn"
                                onClick={() => setShowCalendar(false)}
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DatePickerControl;
