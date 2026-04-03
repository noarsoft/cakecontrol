// IconControl.jsx
import React from 'react';
import './IconControl.css';

function IconControl({ control = {}, rowData = {}, rowIndex }) {
    // Determine the source of icon info
    const boundValue = control.databind ? rowData[control.databind] : control.value;
    const className = control.iconClass || (typeof boundValue === 'string' && boundValue.match(/\s/)? boundValue : undefined);
    const value = boundValue && !className ? boundValue : control.value;

    const style = {
        cursor: control.onClick ? 'pointer' : 'default',
        fontSize: control.fontSize || control.size || undefined,
        color: control.color || 'inherit',
        ...control.style
    };

    // Material icons expect text content inside the <i>
    if (className === 'material-icons') {
        return (
            <i className="icon-control material-icons" style={style} onClick={() => control.onClick?.(rowData, rowIndex)}>
                {value || boundValue}
            </i>
        );
    }

    // If we have a classname (FontAwesome / Bootstrap Icons), render it
    if (className) {
        return (
            <i className={`icon-control ${className}`} style={style} onClick={() => control.onClick?.(rowData, rowIndex)} />
        );
    }

    // If value looks like an emoji or simple text, render it
    if (typeof value === 'string' && value.trim().length > 0) {
        return (
            <span className="icon-control icon-value" style={style} onClick={() => control.onClick?.(rowData, rowIndex)}>
                {value}
            </span>
        );
    }

    // Nothing to render
    return null;
}

export default IconControl;
