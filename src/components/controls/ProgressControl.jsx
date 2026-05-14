// ProgressControl.jsx
import React from 'react';
import './ProgressControl.css';

function ProgressControl({ control, rowData, rowIndex }) {
    const progressValue = control.databind ? rowData[control.databind] : control.value;
    const disabled = control.disabled || false;
    
    const handleClick = (e) => {
        if (disabled) return;
        
        if (control.onClick) {
            const event = { target: { value: progressValue } };
            control.onClick(event, rowData, rowIndex);
        }
    };
    
    return (
        <div 
            className="progress" 
            style={{ 
                width: '100%', 
                height: '20px',
                cursor: control.onClick && !disabled ? 'pointer' : 'default',
                opacity: disabled ? 0.5 : 1,
                transition: 'all 0.2s ease'
            }}
            onClick={handleClick}
            role={control.onClick ? 'button' : undefined}
            tabIndex={control.onClick && !disabled ? 0 : undefined}
            onKeyPress={(e) => {
                if (control.onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
                    handleClick(e);
                }
            }}
        >
            <div 
                className="progress-bar"
                style={{ 
                    width: `${progressValue}%`,
                    backgroundColor: control.color || '#007bff'
                }}
            >
                {control.showValue ? `${progressValue}%` : ''}
            </div>
        </div>
    );
}

export default ProgressControl;
