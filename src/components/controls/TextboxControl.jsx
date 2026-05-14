// TextboxControl.jsx
import React from 'react';
import './TextboxControl.css';

function TextboxControl({ control, rowData, rowIndex }) {
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

    const handleKeyDown = (e) => {
        if (control.onKeyDown) {
            control.onKeyDown(e, rowData, rowIndex);
        }
    };

    // Check if multiline (rows property indicates textarea)
    const isMultiline = control.rows && parseInt(control.rows) > 1;

    // Common props for both input and textarea
    const commonProps = {
        defaultValue: control.databind ? rowData[control.databind] : control.value,
        placeholder: control.placeholder,
        onChange: handleChange,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onKeyDown: handleKeyDown,
        className: `textbox-control ${control.className || ''}`,
        disabled: control.disabled,
        readOnly: control.readOnly,
        maxLength: control.maxLength,
        style: control.style,
    };

    if (isMultiline) {
        // Render textarea for multiline
        return (
            <textarea
                {...commonProps}
                rows={control.rows || 4}
                cols={control.cols}
            />
        );
    }

    // Render input for single line
    return (
        <input 
            type="text"
            {...commonProps}
        />
    );
}

export default TextboxControl;
