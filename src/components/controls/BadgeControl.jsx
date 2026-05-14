// BadgeControl.jsx
import React from 'react';

function BadgeControl({ control, rowData, rowIndex }) {
    const badgeValue = control.databind ? rowData[control.databind] : control.value;
    const disabled = control.disabled || false;
    
    // Handle backgroundColor as function or value
    const bgColor = typeof control.backgroundColor === 'function' 
        ? control.backgroundColor(rowData) 
        : control.backgroundColor || '#007bff';
    
    const handleClick = (e) => {
        if (disabled) return;
        
        if (control.onClick) {
            const event = { target: { value: badgeValue } };
            control.onClick(event, rowData, rowIndex);
        }
    };
    
    return (
        <span 
            className={`badge ${control.className || ''}`}
            style={{
                backgroundColor: bgColor,
                color: control.color || 'var(--text-on-accent)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: control.onClick && !disabled ? 'pointer' : 'default',
                opacity: disabled ? 0.5 : 1,
                transition: 'all 0.2s ease',
                userSelect: 'none'
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
            {badgeValue}
        </span>
    );
}

export default BadgeControl;
