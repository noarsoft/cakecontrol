// DateControl.jsx
import React from 'react';

function DateControl({ control, rowData, rowIndex }) {
    const dateValue = control.databind ? rowData[control.databind] : control.value;
    
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
        <input 
            type="date"
            defaultValue={dateValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={control.className}
            disabled={control.disabled}
            readOnly={control.readOnly}
            min={control.min}
            max={control.max}
            style={control.style}
        />
    );
}

export default DateControl;
