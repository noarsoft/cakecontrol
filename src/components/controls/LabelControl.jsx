// LabelControl.jsx
import React from 'react';

function LabelControl({ control, rowData, rowIndex }) {
    const labelValue = control.databind ? rowData[control.databind] : control.value;
    const disabled = control.disabled || false;
    
    if (control.visible === false) return null;
    
    // Build inline styles for bold, italic, fontSize, and multiline support
    const style = {};
    if (control.bold) style.fontWeight = 'bold';
    if (control.italic) style.fontStyle = 'italic';
    if (control.fontSize) style.fontSize = control.fontSize;
    
    // If multiline, preserve line breaks and use div instead of span
    const isMultiline = control.multiline || (typeof labelValue === 'string' && labelValue?.includes('\n'));
    if (isMultiline) {
        style.whiteSpace = 'pre-wrap';
        style.wordWrap = 'break-word';
    }
    
    // Add click-related styles
    if (control.onClick) {
        style.cursor = disabled ? 'not-allowed' : 'pointer';
        style.opacity = disabled ? 0.5 : 1;
        style.transition = 'all 0.2s ease';
        style.userSelect = 'none';
    }
    
    const handleClick = (e) => {
        if (disabled) return;
        
        if (control.onClick) {
            const event = { target: { value: labelValue } };
            control.onClick(event, rowData, rowIndex);
        }
    };
    
    const Element = isMultiline ? 'div' : 'span';
    
    return (
        <Element 
            className={control.className} 
            style={style}
            onClick={handleClick}
            role={control.onClick ? 'button' : undefined}
            tabIndex={control.onClick && !disabled ? 0 : undefined}
            onKeyPress={(e) => {
                if (control.onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
                    handleClick(e);
                }
            }}
        >
            {labelValue}
        </Element>
    );
}

export default LabelControl;
