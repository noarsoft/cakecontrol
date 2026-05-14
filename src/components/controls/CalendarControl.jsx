// CalendarControl.jsx
import React, { useState, useRef, useEffect } from 'react';
import './CalendarControl.css';

function CalendarControl({ control, rowData, rowIndex }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
        control.databind ? rowData[control.databind] : control.value || ''
    );
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState(control.events || {}); // { 'YYYY-MM-DD': ['event1', 'event2'] }
    const calendarRef = useRef(null);

    // Convert Buddhist year to Christian year
    const beToCe = (beYear) => beYear - 543;
    const ceToBe = (ceYear) => ceYear + 543;

    // Format date to Buddhist format
    const formatBuddhistDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = ceToBe(date.getFullYear());
        return `${day}/${month}/${year}`;
    };

    // Parse Buddhist date to ISO format (YYYY-MM-DD)
    const parseBuddhistDate = (buddhistDateStr) => {
        if (!buddhistDateStr) return '';
        const [day, month, year] = buddhistDateStr.split('/');
        const ceYear = beToCe(parseInt(year));
        return `${ceYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleDateSelect = (date) => {
        const isoDate = date.toISOString().split('T')[0];
        setSelectedDate(isoDate);
        setIsOpen(false);

        if (control.onChange) {
            const event = { target: { value: isoDate } };
            control.onChange(event, rowData, rowIndex);
        }
    };

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
    };

    const changeYear = (offset) => {
        setCurrentMonth(new Date(currentMonth.getFullYear() + offset, currentMonth.getMonth(), 1));
    };

    const isToday = (date) => {
        const today = new Date();
        return date && 
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date) => {
        if (!date || !selectedDate) return false;
        const selected = new Date(selectedDate);
        return date.getDate() === selected.getDate() &&
            date.getMonth() === selected.getMonth() &&
            date.getFullYear() === selected.getFullYear();
    };

    const hasEvents = (date) => {
        if (!date) return false;
        const dateKey = date.toISOString().split('T')[0];
        return events[dateKey] && events[dateKey].length > 0;
    };

    const getEventsForDate = (date) => {
        if (!date) return [];
        const dateKey = date.toISOString().split('T')[0];
        return events[dateKey] || [];
    };

    const getEventColor = (eventText) => {
        // Color based on event type or custom logic
        if (control.eventColors && control.eventColors[eventText]) {
            return control.eventColors[eventText];
        }
        // Default colors
        const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
        let hash = 0;
        for (let i = 0; i < eventText.length; i++) {
            hash = eventText.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const monthNames = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

    const days = getDaysInMonth(currentMonth);
    const displayValue = selectedDate ? formatBuddhistDate(selectedDate) : control.placeholder || 'เลือกวันที่';

    return (
        <div className="calendar-control" ref={calendarRef}>
            <input
                type="text"
                value={displayValue}
                onClick={() => !control.disabled && setIsOpen(!isOpen)}
                readOnly
                placeholder={control.placeholder || 'เลือกวันที่'}
                className={`calendar-input ${control.className || ''}`}
                disabled={control.disabled}
                style={control.style}
            />

            {isOpen && !control.disabled && (
                <div className="calendar-dropdown">
                    {/* Header */}
                    <div className="calendar-header">
                        <button onClick={() => changeYear(-1)} className="calendar-nav-btn">«</button>
                        <button onClick={() => changeMonth(-1)} className="calendar-nav-btn">‹</button>
                        <div className="calendar-title">
                            {monthNames[currentMonth.getMonth()]} {ceToBe(currentMonth.getFullYear())}
                        </div>
                        <button onClick={() => changeMonth(1)} className="calendar-nav-btn">›</button>
                        <button onClick={() => changeYear(1)} className="calendar-nav-btn">»</button>
                    </div>

                    {/* Day names */}
                    <div className="calendar-weekdays">
                        {dayNames.map((day, idx) => (
                            <div key={idx} className="calendar-weekday">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days grid */}
                    <div className="calendar-days">
                        {days.map((day, idx) => {
                            const dayEvents = day ? getEventsForDate(day) : [];
                            const hasEvent = hasEvents(day);
                            
                            return (
                                <div
                                    key={idx}
                                    className={`calendar-day ${!day ? 'empty' : ''} ${isToday(day) ? 'today' : ''} ${isSelected(day) ? 'selected' : ''} ${hasEvent ? 'has-events' : ''}`}
                                    onClick={() => day && handleDateSelect(day)}
                                    title={dayEvents.length > 0 ? dayEvents.join(', ') : ''}
                                >
                                    <div className="calendar-day-number">
                                        {day ? day.getDate() : ''}
                                    </div>
                                    {hasEvent && (
                                        <div className="calendar-day-events">
                                            {dayEvents.slice(0, control.maxEventsDisplay || 2).map((event, eventIdx) => (
                                                <div 
                                                    key={eventIdx}
                                                    className="calendar-event-dot"
                                                    style={{ backgroundColor: getEventColor(event) }}
                                                />
                                            ))}
                                            {dayEvents.length > (control.maxEventsDisplay || 2) && (
                                                <div className="calendar-event-more">
                                                    +{dayEvents.length - (control.maxEventsDisplay || 2)}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick actions */}
                    <div className="calendar-footer">
                        <button
                            className="calendar-today-btn"
                            onClick={() => handleDateSelect(new Date())}
                        >
                            วันนี้
                        </button>
                        <button
                            className="calendar-clear-btn"
                            onClick={() => {
                                setSelectedDate('');
                                setIsOpen(false);
                                if (control.onChange) {
                                    const event = { target: { value: '' } };
                                    control.onChange(event, rowData, rowIndex);
                                }
                            }}
                        >
                            ล้าง
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CalendarControl;
