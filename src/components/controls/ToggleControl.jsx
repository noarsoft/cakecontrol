// ToggleControl.jsx
import React from 'react';
import './ToggleControl.css';

function ToggleControl({ control, rowData, rowIndex }) {
    const toggleValue = control.databind ? rowData[control.databind] : control.value;
    
    return (
        <label className="toggle-switch">
            <input 
                type="checkbox"
                defaultChecked={toggleValue}
                onChange={control.onChange}
                disabled={control.disabled}
            />
            <span className="slider"></span>
        </label>
    );
}

export default ToggleControl;
