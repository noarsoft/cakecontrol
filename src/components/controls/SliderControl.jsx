// SliderControl.jsx
import React, { useState } from 'react';
import './SliderControl.css';

function SliderControl({ 
    control, 
    rowData, 
    rowIndex,
    value,
    onChange 
}) {
    const initialValue = value !== undefined ? value : (control.databind ? rowData?.[control.databind] : control.value) || 0;
    const [sliderValue, setSliderValue] = useState(initialValue);

    const min = control.min !== undefined ? control.min : 0;
    const max = control.max !== undefined ? control.max : 100;
    const step = control.step !== undefined ? control.step : 1;
    const disabled = control.disabled || false;
    const showLabel = control.showLabel !== false; // default true
    const showValue = control.showValue !== false; // default true
    const showTicks = control.showTicks || false;
    const size = control.size || 'medium'; // small, medium, large
    const color = control.color || '#3b82f6';
    const onChangeCallback = onChange || control.onChange;

    const handleChange = (e) => {
        const newValue = parseFloat(e.target.value);
        setSliderValue(newValue);
        
        if (onChangeCallback) {
            onChangeCallback(newValue);
        }
    };

    const percentage = ((sliderValue - min) / (max - min)) * 100;
    const sizeClass = `slider-${size}`;
    const classes = `slider-control ${sizeClass} ${disabled ? 'disabled' : ''}`;

    const label = control.label || 'Value';

    return (
        <div className={classes}>
            {showLabel && (
                <div className="slider-header">
                    <label className="slider-label">{label}</label>
                    {showValue && (
                        <span className="slider-value-display">
                            {sliderValue.toFixed(step < 1 ? 2 : 0)}
                            {control.unit ? ` ${control.unit}` : ''}
                        </span>
                    )}
                </div>
            )}
            
            <div className="slider-container">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={sliderValue}
                    onChange={handleChange}
                    disabled={disabled}
                    className="slider-input"
                    style={{ '--slider-color': color, '--slider-percentage': `${percentage}%` }}
                />
                
                <div className="slider-track" style={{ '--slider-color': color }}>
                    <div className="slider-progress" style={{ width: `${percentage}%`, backgroundColor: color }} />
                </div>

                {showTicks && (
                    <div className="slider-ticks">
                        {Array.from({ length: Math.min(11, Math.ceil((max - min) / step) + 1) }).map((_, i) => (
                            <div key={i} className="slider-tick" style={{ left: `${(i / 10) * 100}%` }} />
                        ))}
                    </div>
                )}
            </div>

            <div className="slider-range">
                <span className="slider-min">{min}</span>
                <span className="slider-max">{max}</span>
            </div>
        </div>
    );
}

export default SliderControl;
