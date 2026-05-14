// NumberControl.jsx
import React, { useRef, useState, useEffect } from 'react';
import './NumberControl.css';

function NumberControl({ control = {}, rowData, rowIndex }) {
    const inputRef = useRef(null);
    const boundValue = control.databind ? rowData?.[control.databind] : control.value;
    const step = Number(control.step ?? 1);
    const min = control.min != null ? Number(control.min) : null;
    const max = control.max != null ? Number(control.max) : null;

    const [value, setValue] = useState(boundValue ?? '');

    useEffect(() => {
        setValue(boundValue ?? '');
    }, [boundValue]);

    const emitChange = (v) => {
        if (control.onChange) {
            const parsed = v === '' ? '' : Number(v);
            control.onChange({ target: { value: parsed } }, rowData, rowIndex);
        }
    };

    const handleChange = (e) => {
        const input = e.target.value;
        // allow only digits, decimal point and optional leading minus if min < 0
        const allowMinus = min != null && min < 0;
        const regex = allowMinus ? /[^0-9.\-]/g : /[^0-9.]/g;
        let cleaned = input.replace(regex, '');
        // only allow one minus at start
        if (allowMinus) {
            const minusCount = (cleaned.match(/-/g) || []).length;
            if (minusCount > 1) cleaned = cleaned.replace(/-/g, '');
            if (cleaned.includes('-') && cleaned.indexOf('-') !== 0) cleaned = cleaned.replace(/-/g, '');
        } else {
            cleaned = cleaned.replace(/-/g, '');
        }
        // allow only one decimal point
        const parts = cleaned.split('.');
        if (parts.length > 2) cleaned = parts[0] + '.' + parts.slice(1).join('');

        setValue(cleaned);
        // if it's a valid number, emit numeric value, else emit empty
        const asNum = cleaned === '' || cleaned === '-' || cleaned === '.' || cleaned === '-.' ? '' : Number(cleaned);
        emitChange(asNum);
    };

    const handleBlur = (e) => {
        // on blur, enforce min/max and snap to step if provided
        let v = value === '' ? '' : Number(value);
        if (v !== '' && Number.isFinite(v)) {
            if (min != null) v = Math.max(v, min);
            if (max != null) v = Math.min(v, max);
            if (step && step > 0) {
                const base = (min != null) ? min : 0;
                // snap to nearest step increment from base
                const snapped = Math.round((v - base) / step) * step + base;
                // reduce floating point issues
                const decimals = Math.max((step.toString().split('.')[1] || '').length, 0);
                v = Number(parseFloat(snapped).toFixed(decimals));
            }
            setValue(String(v));
            emitChange(v);
        }

        if (control.onBlur) {
            control.onBlur(e, rowData, rowIndex);
        }
    };

    const handleFocus = (e) => {
        if (control.onFocus) {
            control.onFocus(e, rowData, rowIndex);
        }
    };

    const adjustValue = (direction) => {
        if (control.disabled) return;
        const current = value === '' ? 0 : Number(value);
        const base = Number.isFinite(current) ? current : 0;
        let next = base + direction * step;
        if (min != null) next = Math.max(next, min);
        if (max != null) next = Math.min(next, max);
        // fix decimals
        const decimals = Math.max((step.toString().split('.')[1] || '').length, 0);
        next = Number(parseFloat(next).toFixed(decimals));
        setValue(String(next));
        emitChange(next);
    };

    const inputClassNames = ['number-control', control.className].filter(Boolean).join(' ');
    const wrapperClasses = ['number-control-wrapper', control.disabled ? 'disabled' : null, control.className].filter(Boolean).join(' ');

    // handle arrow keys for increment/decrement
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            adjustValue(1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            adjustValue(-1);
        }
    };

    return (
        <div className={wrapperClasses}>
            <button
                type="button"
                className="number-control-btn"
                onClick={() => adjustValue(-1)}
                disabled={control.disabled}
                aria-label="ลดค่า"
            >
                −
            </button>
            <input
                ref={inputRef}
                type="text"
                value={value ?? ''}
                placeholder={control.placeholder}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                className={inputClassNames}
                disabled={control.disabled}
                readOnly={control.readOnly}
                style={control.style}
                inputMode="numeric"
                pattern="[0-9]*"
            />
            <button
                type="button"
                className="number-control-btn"
                onClick={() => adjustValue(1)}
                disabled={control.disabled}
                aria-label="เพิ่มค่า"
            >
                +
            </button>
        </div>
    );
}

export default NumberControl;
