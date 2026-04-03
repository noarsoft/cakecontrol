// ButtonGroupControl.jsx
import React, { useState } from 'react';
import ButtonControl from './ButtonControl';
import './ButtonGroupControl.css';

/**
 * ButtonGroupControl - Button selection group control
 * 
 * Props:
 * - control.options: Array of button options
 * - control.value: Selected value (single) or array (multiple)
 * - control.multiple: Allow multiple selection (default: false)
 * - control.required: Require at least one selection (default: false)
 * - control.buttonStyle: Style for buttons
 * - control.buttonClassName: Class name for buttons (btn-primary, btn-success, etc.)
 * - control.selectedClassName: Class name for selected buttons (default: btn-primary)
 * - control.orientation: 'horizontal' or 'vertical' (default: horizontal)
 * - control.onChange: Callback when selection changes
 * - control.disabled: Disable all buttons
 * 
 * Each option:
 * - label: Button text
 * - value: Button value
 * - icon: Optional icon
 * - disabled: Disable this button
 * 
 * Example:
 * <ButtonGroupControl control={{
 *   options: [
 *     { label: 'Option 1', value: '1', icon: '✓' },
 *     { label: 'Option 2', value: '2' }
 *   ],
 *   value: '1',
 *   multiple: false,
 *   required: true,
 *   buttonClassName: 'btn-outline',
 *   selectedClassName: 'btn-primary',
 *   orientation: 'horizontal',
 *   onChange: (event) => console.log(event.target.value)
 * }} />
 */
function ButtonGroupControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const {
        options = [],
        multiple = false,
        required = false,
        buttonStyle = {},
        buttonClassName = 'btn-outline',
        selectedClassName = 'btn-primary',
        orientation = 'horizontal',
        onChange,
        disabled = false,
        className = ''
    } = control;

    // Initialize state based on control.value
    const [selectedValues, setSelectedValues] = useState(() => {
        if (multiple) {
            return Array.isArray(control.value) ? control.value : (control.value ? [control.value] : []);
        }
        return control.value || null;
    });

    // Helper to resolve databind
    const resolveValue = (option) => {
        if (option.databind && rowData) {
            const keys = option.databind.split('.');
            let value = rowData;
            for (const key of keys) {
                if (value && typeof value === 'object' && key in value) {
                    value = value[key];
                } else {
                    return option.value;
                }
            }
            return value;
        }
        return option.value;
    };

    const handleButtonClick = (option) => {
        if (disabled || option.disabled) return;

        const optionValue = resolveValue(option);
        let newValue;

        if (multiple) {
            // Multiple selection
            const currentSelected = Array.isArray(selectedValues) ? selectedValues : [];
            if (currentSelected.includes(optionValue)) {
                newValue = currentSelected.filter(v => v !== optionValue);
            } else {
                newValue = [...currentSelected, optionValue];
            }
            setSelectedValues(newValue);
        } else {
            // Single selection
            newValue = selectedValues === optionValue ? null : optionValue;
            setSelectedValues(newValue);
        }

        if (onChange) {
            const event = {
                target: {
                    value: newValue,
                    selectedOptions: multiple 
                        ? options.filter(opt => (Array.isArray(newValue) ? newValue : []).includes(resolveValue(opt)))
                        : options.find(opt => resolveValue(opt) === newValue)
                }
            };
            onChange(event, rowData, rowIndex);
        }
    };

    const isSelected = (option) => {
        const optionValue = resolveValue(option);
        if (multiple) {
            return Array.isArray(selectedValues) && selectedValues.includes(optionValue);
        }
        return selectedValues === optionValue;
    };

    return (
        <div 
            className={`button-group-control ${orientation} ${className}`}
            style={{
                display: 'flex',
                flexDirection: orientation === 'vertical' ? 'column' : 'row',
                gap: '8px',
                flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap'
            }}
        >
            {options.map((option, index) => {
                const selected = isSelected(option);
                const isDisabled = disabled || option.disabled;

                return (
                    <button
                        key={index}
                        className={`btn-control ${selected ? selectedClassName : buttonClassName} ${isDisabled ? 'disabled' : ''}`}
                        onClick={() => handleButtonClick(option)}
                        disabled={isDisabled}
                        style={{
                            ...buttonStyle,
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            opacity: isDisabled ? 0.5 : 1
                        }}
                    >
                        {option.icon && (
                            <span style={{ marginRight: option.label ? '8px' : '0' }}>
                                {option.icon}
                            </span>
                        )}
                        {option.label}
                    </button>
                );
            })}

            {/* Empty State */}
            {options.length === 0 && (
                <div style={{ 
                    padding: '10px', 
                    color: '#9ca3af', 
                    fontSize: '14px',
                    fontStyle: 'italic'
                }}>
                    No options available
                </div>
            )}
        </div>
    );
}

export default ButtonGroupControl;
