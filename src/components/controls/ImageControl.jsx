// ImageControl.jsx
import React, { useState } from 'react';

/**
 * ImageControl Component
 * แสดงรูปภาพพร้อม features เพิ่มเติม
 * 
 * Features:
 * - Lazy loading
 * - Error handling with fallback image
 * - Click to enlarge (lightbox)
 * - Loading placeholder
 * - Object fit modes
 * - Border radius, shadow
 */
function ImageControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const {
        databind,
        value,
        alt = '',
        width = 'auto',
        height = 'auto',
        borderRadius = '0',
        className = '',
        style = {},
        objectFit = 'cover', // cover | contain | fill | none | scale-down
        lazy = true,
        fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E',
        placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23ccc"%3ELoading...%3C/text%3E%3C/svg%3E',
        onClick,
        enlargeable = false,
        shadow = false,
        grayscale = false,
        disabled = false
    } = control;

    const imgSrc = databind ? rowData[databind] : value;
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isEnlarged, setIsEnlarged] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const handleClick = (e) => {
        if (disabled) return;
        
        if (enlargeable) {
            setIsEnlarged(true);
        }
        
        if (onClick) {
            const event = { target: { value: imgSrc } };
            onClick(event, rowData, rowIndex);
        }
    };

    const handleCloseLightbox = () => {
        setIsEnlarged(false);
    };

    const imageStyle = {
        width,
        height,
        borderRadius,
        objectFit,
        transition: 'all 0.3s ease',
        cursor: (enlargeable || onClick) && !disabled ? 'pointer' : 'default',
        opacity: disabled ? 0.5 : 1,
        filter: grayscale ? 'grayscale(100%)' : 'none',
        boxShadow: shadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
        ...style
    };

    const displaySrc = hasError ? fallback : (isLoading ? placeholder : imgSrc);

    return (
        <>
            <img 
                src={displaySrc}
                alt={alt}
                loading={lazy ? 'lazy' : 'eager'}
                style={imageStyle}
                className={`image-control ${className} ${disabled ? 'disabled' : ''}`}
                onClick={handleClick}
                onLoad={handleLoad}
                onError={handleError}
            />

            {/* Lightbox for enlarged image */}
            {isEnlarged && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'zoom-out',
                        animation: 'fadeIn 0.3s ease'
                    }}
                    onClick={handleCloseLightbox}
                >
                    <img 
                        src={imgSrc}
                        alt={alt}
                        style={{
                            maxWidth: '90%',
                            maxHeight: '90%',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            color: 'white',
                            fontSize: '24px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s'
                        }}
                        onClick={handleCloseLightbox}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                    >
                        ✕
                    </button>
                </div>
            )}
        </>
    );
}

export default ImageControl;
