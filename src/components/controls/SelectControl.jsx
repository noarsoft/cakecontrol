// SelectControl.jsx
import React from 'react';

function SelectControl({ control, rowData, rowIndex }) {
    const handleChange = (e) => {
        if (control.onChange) {
            control.onChange(e, rowData, rowIndex);
        }
    };

    const handleBlur = (e) => {
        if (control.onBlur) {
            control.onBlur(e, rowData, rowIndex);
        }
    };

    const handleFocus = (e) => {
        if (control.onFocus) {
            control.onFocus(e, rowData, rowIndex);
        }
    };

    return (
        <select
            defaultValue={control.databind ? rowData[control.databind] : control.value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={control.className}
            disabled={control.disabled}
            style={control.style}
        >
            {control.options?.map((opt, idx) => (
                <option key={idx} value={opt.value}>
                    {opt.label || opt.value}
                </option>
            ))}
        </select>
    );
}

export default SelectControl;
