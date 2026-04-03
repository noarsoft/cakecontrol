// ButtonControl.jsx
import React from 'react';
import './ButtonControl.css';

function ButtonControl({ control, rowData, rowIndex }) {
    const handleClick = (e) => {
        e.preventDefault();
        if (!control.disabled && control.onClick) {
            control.onClick(e, rowData, rowIndex);
        }
    };

    // Get button text from databind or value
    const buttonText = control.databind ? rowData[control.databind] : control.value;

    return (
        <a 
            href="#"
            onClick={handleClick}
            className={`btn-control ${control.className || ''} ${control.disabled ? 'disabled' : ''}`}
            style={control.disabled ? { pointerEvents: 'none', opacity: 0.5 } : {}}
        >
            {buttonText}
        </a>
    );
}

export default ButtonControl;
