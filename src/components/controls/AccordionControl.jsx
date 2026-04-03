// AccordionControl.jsx
import React, { useState } from 'react';
import FormControl from './FormControl';
import './AccordionControl.css';

/**
 * AccordionControl - Accordion component with FormControl content
 * 
 * Props:
 * - control.data: Array of accordion items
 * - control.allowMultiple: Allow multiple panels open (default: false)
 * - control.defaultOpen: Array of indices to open by default
 * - control.onToggle: Callback when panel is toggled (event, item, index, isOpen)
 * 
 * Each item in data:
 * - title: Accordion header title (string or databind)
 * - content: FormControl config for the content
 * - icon: Optional icon (string)
 * - disabled: Disable this item (boolean)
 * 
 * Example:
 * <AccordionControl control={{
 *   data: [
 *     {
 *       title: 'Personal Info',
 *       icon: '👤',
 *       content: {
 *         colnumbers: 6,
 *         data: [{ name: 'John', email: 'john@example.com' }],
 *         controls: [
 *           { colno: 1, rowno: 1, label: 'Name', databind: 'name', type: 'textbox' }
 *         ]
 *       }
 *     }
 *   ],
 *   allowMultiple: false,
 *   defaultOpen: [0]
 * }} />
 */
function AccordionControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const {
        data = [],
        allowMultiple = false,
        defaultOpen = [],
        onToggle,
        className = ''
    } = control;

    const [openItems, setOpenItems] = useState(() => new Set(defaultOpen));

    const handleToggle = (index, item) => {
        if (item.disabled) return;

        setOpenItems(prev => {
            const newSet = new Set(prev);
            const isOpen = newSet.has(index);
            
            if (allowMultiple) {
                if (isOpen) {
                    newSet.delete(index);
                } else {
                    newSet.add(index);
                }
            } else {
                newSet.clear();
                if (!isOpen) {
                    newSet.add(index);
                }
            }

            if (onToggle) {
                const event = {
                    target: {
                        value: Array.from(newSet),
                        index: index,
                        isOpen: !isOpen
                    }
                };
                onToggle(event, item, index, !isOpen);
            }

            return newSet;
        });
    };

    return (
        <div className={`accordion-control ${className}`}>
            {data.map((item, index) => {
                const isOpen = openItems.has(index);
                const isDisabled = item.disabled || false;

                return (
                    <div
                        key={index}
                        className={`accordion-item ${isOpen ? 'open' : ''} ${isDisabled ? 'disabled' : ''}`}
                    >
                        {/* Header */}
                        <div
                            className="accordion-header"
                            onClick={() => handleToggle(index, item)}
                        >
                            <div className="accordion-header-content">
                                {item.icon && (
                                    <span className="accordion-icon">{item.icon}</span>
                                )}
                                <span className="accordion-title">{item.title}</span>
                            </div>
                            <div className="accordion-chevron">
                                {isOpen ? '▼' : '▶'}
                            </div>
                        </div>

                        {/* Content */}
                        {isOpen && (
                            <div className="accordion-content">
                                {item.content && (
                                    <FormControl
                                        config={{
                                            ...item.content,
                                            onChange: (event) => {
                                                if (item.content.onChange) {
                                                    item.content.onChange(event, item, index);
                                                }
                                            }
                                        }}
                                    />
                                )}
                                {item.customContent && item.customContent}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Empty State */}
            {data.length === 0 && (
                <div className="accordion-empty">
                    No accordion items
                </div>
            )}
        </div>
    );
}

export default AccordionControl;
