// QRCodeControl.jsx
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

/**
 * QRCodeControl - Generate QR Code from text/URL
 * 
 * Props:
 * - control.value: Static value to encode
 * - control.databind: Field name to get value from rowData
 * - control.width: QR code width (default: 200)
 * - control.height: QR code height (default: 200)
 * - control.errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' (default: 'M')
 * - control.margin: Margin around QR code (default: 1)
 * - control.color.dark: Dark color (default: '#000000')
 * - control.color.light: Light color (default: '#ffffff')
 * - control.style: Additional CSS styles
 * - control.className: Additional CSS classes
 * - rowData: Data object containing field values
 */
function QRCodeControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const canvasRef = useRef(null);
    
    const {
        value,
        databind,
        width = 200,
        height = 200,
        errorCorrectionLevel = 'M',
        margin = 1,
        color = {},
        style = {},
        className = '',
        onClick,
        disabled = false
    } = control;

    // Get value from databind or use static value
    const qrValue = databind ? rowData[databind] : value;
    
    const handleClick = (e) => {
        if (disabled) return;
        
        if (onClick) {
            const event = { target: { value: qrValue } };
            onClick(event, rowData, rowIndex);
        }
    };

    useEffect(() => {
        if (canvasRef.current && qrValue) {
            const options = {
                errorCorrectionLevel,
                margin,
                width,
                height,
                color: {
                    dark: color.dark || '#000000',
                    light: color.light || '#ffffff'
                }
            };

            QRCode.toCanvas(canvasRef.current, String(qrValue), options, (error) => {
                if (error) {
                    console.error('QRCode generation error:', error);
                }
            });
        }
    }, [qrValue, width, height, errorCorrectionLevel, margin, color]);

    if (!qrValue) {
        return (
            <div 
                style={{ 
                    width: `${width}px`, 
                    height: `${height}px`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#f3f4f6',
                    border: '1px dashed #d1d5db',
                    borderRadius: '4px',
                    color: '#6b7280',
                    fontSize: '14px',
                    cursor: onClick && !disabled ? 'pointer' : 'default',
                    opacity: disabled ? 0.5 : 1,
                    transition: 'all 0.2s ease',
                    ...style
                }}
                className={className}
                onClick={handleClick}
                role={onClick ? 'button' : undefined}
                tabIndex={onClick && !disabled ? 0 : undefined}
                onKeyPress={(e) => {
                    if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
                        handleClick(e);
                    }
                }}
            >
                No QR Data
            </div>
        );
    }

    return (
        <canvas 
            ref={canvasRef} 
            style={{ 
                display: 'block',
                cursor: onClick && !disabled ? 'pointer' : 'default',
                opacity: disabled ? 0.5 : 1,
                transition: 'all 0.2s ease',
                ...style 
            }}
            className={className}
            onClick={handleClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick && !disabled ? 0 : undefined}
            onKeyPress={(e) => {
                if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
                    handleClick(e);
                }
            }}
        />
    );
}

export default QRCodeControl;
