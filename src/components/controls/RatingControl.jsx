// RatingControl.jsx
import React, { useState } from 'react';
import './RatingControl.css';

function RatingControl({ 
    control, 
    rowData, 
    rowIndex,
    value,
    onChange 
}) {
    const initialValue = value !== undefined ? value : (control.databind ? rowData?.[control.databind] : control.value) || 0;
    const [rating, setRating] = useState(initialValue);
    const [hoveredRating, setHoveredRating] = useState(0);

    const maxStars = control.maxStars || 5;
    const color = control.color || '#ffc107';
    const size = control.size || 'medium'; // small, medium, large
    const disabled = control.disabled || false;
    const readOnly = control.readOnly || false;
    const allowHalf = control.allowHalf !== false; // default true
    const showLabel = control.showLabel !== false; // default true
    const onChangeCallback = onChange || control.onChange;

    const handleClick = (index, isHalf) => {
        if (disabled || readOnly) return;
        
        const newRating = allowHalf && isHalf ? index + 0.5 : index + 1;
        setRating(newRating);
        
        if (onChangeCallback) {
            onChangeCallback(newRating);
        }
    };

    const handleMouseMove = (index, event) => {
        if (disabled || readOnly) return;
        
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const isHalf = x < rect.width / 2;
        
        setHoveredRating(allowHalf && isHalf ? index + 0.5 : index + 1);
    };

    const handleMouseLeave = () => {
        setHoveredRating(0);
    };

    const displayRating = hoveredRating || rating;

    const sizeClass = `rating-${size}`;
    const classes = `rating-control ${sizeClass} ${disabled ? 'disabled' : ''} ${readOnly ? 'read-only' : ''}`;

    return (
        <div className={classes}>
            <div className="rating-stars" style={{ '--rating-color': color }}>
                {Array.from({ length: maxStars }).map((_, index) => {
                    const isFilled = displayRating >= index + 1;
                    const isHalf = displayRating > index && displayRating < index + 1;
                    let starClass = 'star';
                    
                    if (isFilled) {
                        starClass += ' filled';
                    } else if (isHalf) {
                        starClass += ' half-filled';
                    }
                    
                    return (
                        <span
                            key={index}
                            className={starClass}
                            onClick={() => handleClick(index, false)}
                            onMouseMove={(e) => handleMouseMove(index, e)}
                            onMouseLeave={handleMouseLeave}
                        >
                            ★
                        </span>
                    );
                })}
            </div>
            {showLabel && (
                <div className="rating-label">
                    <span className="rating-value">{displayRating.toFixed(1)}</span>
                    <span className="rating-max">/ {maxStars}</span>
                </div>
            )}
        </div>
    );
}

export default RatingControl;
