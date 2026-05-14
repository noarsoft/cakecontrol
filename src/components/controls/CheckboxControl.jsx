// CheckboxControl.jsx
import React, { useState } from 'react';
import './CheckboxControl.css';

function CheckboxControl({ control, rowData, rowIndex }) {
    const initialChecked = control.databind ? rowData[control.databind] : control.value;
    const [isChecked, setIsChecked] = useState(initialChecked);

    const handleToggle = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        
        if (control.onChange) {
            control.onChange({ target: { checked: newValue } }, rowData, rowIndex);
        }
    };

    return (
        <div 
            className={`checkbox-control ${control.className || ''} ${control.disabled ? 'disabled' : ''}`}
            onClick={!control.disabled ? handleToggle : undefined}
            style={{ cursor: control.disabled ? 'not-allowed' : 'pointer' }}
        >
            {isChecked ? (
                // Checked icon
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="20" height="20" rx="4" fill="#007bff"/>
                    <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ) : (
                // Unchecked icon
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill="white" stroke="#d1d5db"/>
                </svg>
            )}
        </div>
    );
}

export default CheckboxControl;
