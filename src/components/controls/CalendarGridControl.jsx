// CalendarGridControl.jsx
import React, { useState } from 'react';
import './CalendarGridControl.css';

function CalendarGridControl({ control, rowData, rowIndex }) {
    const initialEvents = control.databind ? (rowData[control.databind] || {}) : (control.events || {});
    const editable = control.editable === true; // Default: false (readonly)
    
    // Parse initial date from YYYYMMDD format
    const parseYYYYMMDD = (dateStr) => {
        if (!dateStr || dateStr.length !== 8) return new Date();
        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1; // JS months are 0-indexed
        const day = parseInt(dateStr.substring(6, 8));
        return new Date(year, month, day);
    };

    const initialDate = control.initialDate ? parseYYYYMMDD(control.initialDate) : new Date();
    
    const [events, setEvents] = useState(initialEvents);
    const [currentMonth, setCurrentMonth] = useState(initialDate);
    const [editingDate, setEditingDate] = useState(null);
    const [editText, setEditText] = useState('');
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    // Convert Buddhist year to Christian year
    const ceToBe = (ceYear) => ceYear + 543;

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        // Previous month days
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const changeMonth = (offset) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
        setShowMonthPicker(false);
    };

    const changeYear = (offset) => {
        setCurrentMonth(new Date(currentMonth.getFullYear() + offset, currentMonth.getMonth(), 1));
        setShowYearPicker(false);
    };

    const setMonth = (monthIndex) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
        setShowMonthPicker(false);
    };

    const setYear = (year) => {
        setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
        setShowYearPicker(false);
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
        setShowMonthPicker(false);
        setShowYearPicker(false);
    };

    const isToday = (date) => {
        const today = new Date();
        return date && 
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const getDateKey = (date) => {
        if (!date) return null;
        // Format as YYYY-MM-DD without timezone conversion
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleCellClick = (date) => {
        if (!date) return;
        
        // Call onClick callback if provided
        if (control.onClick) {
            const dateKey = getDateKey(date);
            control.onClick(dateKey, { date, events: events[dateKey] }, rowData, rowIndex);
        }

        // Only allow editing if editable mode is enabled
        if (!editable) return;
        
        const dateKey = getDateKey(date);
        setEditingDate(dateKey);
        setEditText(events[dateKey] || '');
    };

    const handleTextChange = (e) => {
        setEditText(e.target.value);
    };

    const handleTextSave = () => {
        if (editingDate) {
            const newEvents = { ...events };
            if (editText.trim()) {
                newEvents[editingDate] = editText.trim();
            } else {
                delete newEvents[editingDate];
            }
            setEvents(newEvents);
            setEditingDate(null);
            setEditText('');

            if (control.onChange) {
                const event = { target: { value: newEvents } };
                control.onChange(event, rowData, rowIndex);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleTextSave();
        } else if (e.key === 'Escape') {
            setEditingDate(null);
            setEditText('');
        }
    };

    const monthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

    const days = getDaysInMonth(currentMonth);

    // Generate year range (current year - 10 to current year + 10)
    const currentYear = currentMonth.getFullYear();
    const yearRange = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

    return (
        <div className="calendar-grid-control">
            {/* Header */}
            <div className="calendar-grid-header">
                <button onClick={() => changeYear(-1)} className="calendar-grid-nav" title="ปีก่อนหน้า">«</button>
                <button onClick={() => changeMonth(-1)} className="calendar-grid-nav" title="เดือนก่อนหน้า">‹</button>
                
                <div className="calendar-grid-title-container">
                    <div className="calendar-grid-title">
                        <span 
                            className="calendar-grid-month-selector"
                            onClick={() => {
                                setShowMonthPicker(!showMonthPicker);
                                setShowYearPicker(false);
                            }}
                        >
                            {monthNames[currentMonth.getMonth()]}
                        </span>
                        {' '}
                        <span 
                            className="calendar-grid-year-selector"
                            onClick={() => {
                                setShowYearPicker(!showYearPicker);
                                setShowMonthPicker(false);
                            }}
                        >
                            {ceToBe(currentMonth.getFullYear())}
                        </span>
                    </div>

                    {/* Month Picker Dropdown */}
                    {showMonthPicker && (
                        <div className="calendar-grid-picker month-picker">
                            <div className="calendar-grid-picker-grid">
                                {monthNames.map((month, idx) => (
                                    <button
                                        key={idx}
                                        className={`calendar-grid-picker-item ${currentMonth.getMonth() === idx ? 'selected' : ''}`}
                                        onClick={() => setMonth(idx)}
                                    >
                                        {month}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Year Picker Dropdown */}
                    {showYearPicker && (
                        <div className="calendar-grid-picker year-picker">
                            <div className="calendar-grid-picker-grid">
                                {yearRange.map((year) => (
                                    <button
                                        key={year}
                                        className={`calendar-grid-picker-item ${currentMonth.getFullYear() === year ? 'selected' : ''}`}
                                        onClick={() => setYear(year)}
                                    >
                                        {ceToBe(year)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={() => changeMonth(1)} className="calendar-grid-nav" title="เดือนถัดไป">›</button>
                <button onClick={() => changeYear(1)} className="calendar-grid-nav" title="ปีถัดไป">»</button>
                <button onClick={goToToday} className="calendar-grid-today-btn" title="วันนี้">วันนี้</button>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid-table">
                {/* Day headers */}
                <div className="calendar-grid-row header-row">
                    {dayNames.map((day, idx) => (
                        <div key={idx} className="calendar-grid-cell header-cell">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days */}
                {Array.from({ length: Math.ceil(days.length / 7) }, (_, weekIdx) => (
                    <div key={weekIdx} className="calendar-grid-row">
                        {days.slice(weekIdx * 7, weekIdx * 7 + 7).map((day, dayIdx) => {
                            const dateKey = getDateKey(day);
                            const isEditing = dateKey === editingDate;
                            const hasEvent = dateKey && events[dateKey];

                            return (
                                <div
                                    key={dayIdx}
                                    className={`calendar-grid-cell ${!day ? 'empty' : ''} ${isToday(day) ? 'today' : ''} ${hasEvent ? 'has-event' : ''} ${!editable ? 'readonly' : ''}`}
                                    onClick={() => handleCellClick(day)}
                                >
                                    {day && (
                                        <>
                                            <div className="calendar-grid-date">
                                                {day.getDate()}
                                            </div>
                                            <div className="calendar-grid-content">
                                                {isEditing ? (
                                                    <textarea
                                                        value={editText}
                                                        onChange={handleTextChange}
                                                        onBlur={handleTextSave}
                                                        onKeyDown={handleKeyDown}
                                                        placeholder="เพิ่มข้อความ..."
                                                        autoFocus
                                                        className="calendar-grid-textarea"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                ) : (
                                                    <div className="calendar-grid-text">
                                                        {events[dateKey] || ''}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            {editable && (
                <div className="calendar-grid-footer">
                    <small>คลิกที่วันเพื่อเพิ่ม/แก้ไขข้อความ | Enter = บันทึก | Esc = ยกเลิก</small>
                </div>
            )}
        </div>
    );
}

export default CalendarGridControl;
