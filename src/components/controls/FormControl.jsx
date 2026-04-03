// FormControl.jsx
import React, { useState } from 'react';
import { genControl } from './TableviewControl';
import './FormControl.css';

function FormControl({ config }) {
    const [formData, setFormData] = useState(() => {
        // Initialize form data from config.data
        const initialData = {};
        if (config.data) {
            config.data.forEach((dataObj, index) => {
                Object.assign(initialData, dataObj);
            });
        }
        return initialData;
    });

    // Helper function to resolve databind path
    const resolveDataBind = (databind, data) => {
        if (!databind) return undefined;
        const keys = databind.split('.');
        let value = data;
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return undefined;
            }
        }
        return value;
    };

    // Helper function to set nested value
    const setNestedValue = (obj, path, value) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let current = obj;
        
        for (const key of keys) {
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[lastKey] = value;
        return obj;
    };

    const handleControlChange = (databind, value) => {
        if (!databind) return;
        
        setFormData(prevData => {
            const newData = { ...prevData };
            setNestedValue(newData, databind, value);
            
            if (config.onChange) {
                config.onChange({ target: { value: newData } });
            }
            
            return newData;
        });
    };

    const renderControl = (controlConfig, index) => {
        // Resolve label
        let label = controlConfig.label;
        if (label && typeof label === 'object' && label.databind) {
            label = resolveDataBind(label.databind, formData) || '';
        }

        // Resolve value
        let value = controlConfig.value;
        if (value && typeof value === 'object' && value.databind) {
            value = resolveDataBind(value.databind, formData);
        } else if (controlConfig.databind) {
            value = resolveDataBind(controlConfig.databind, formData);
        }

        // Create control configuration for genControl
        const control = {
            ...controlConfig,
            value: value,
            onChange: (event) => {
                const newValue = event.target ? event.target.value : event;
                handleControlChange(controlConfig.databind, newValue);
                
                if (controlConfig.onChange) {
                    controlConfig.onChange(event, formData, index);
                }
            }
        };

        const colno = controlConfig.colno ? Number(controlConfig.colno) : null;
        const colspan = Number(controlConfig.colspan || controlConfig.colSpan || 1);
        const rowno = controlConfig.rowno ? Number(controlConfig.rowno) : null;
        const gridColumn = colno
            ? (colspan > 1 ? `${colno} / span ${colspan}` : String(colno))
            : (colspan > 1 ? `span ${colspan}` : 'auto');
        const gridRow = rowno ? String(rowno) : 'auto';

        return (
            <div
                key={index}
                className="form-grid-item"
                style={{
                    gridColumn,
                    gridRow,
                }}
            >
                {label && (
                    <label 
                        className="form-grid-label"
                        style={{
                            fontWeight: controlConfig.labelBold ? 'bold' : 'inherit',
                            fontStyle: controlConfig.labelItalic ? 'italic' : 'inherit',
                            fontSize: controlConfig.labelFontSize || 'inherit',
                            color: controlConfig.labelColor || 'inherit',
                        }}
                    >
                        {label}
                    </label>
                )}
                <div className="form-grid-wrapper">
                    {genControl(control, formData, index)}
                </div>
            </div>
        );
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${config.colnumbers || 10}, 1fr)`,
        gridTemplateRows: `repeat(${config.rownumbers || 10}, auto)`,
        gap: '16px',
        padding: '20px',
    };

    return (
        <div className="form-grid">
            <div className={`form-grid-grid ${config.responsive !== false ? 'responsive' : ''}`} style={gridStyle}>
                {config.controls && config.controls.map((controlConfig, index) => 
                    renderControl(controlConfig, index)
                )}
            </div>
        </div>
    );
}

export default FormControl;
