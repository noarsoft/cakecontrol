// LinkControl.jsx
import React from 'react';

/**
 * LinkControl Component
 * แสดงลิงก์พร้อม features เพิ่มเติม
 * 
 * Features:
 * - Icon support (left/right)
 * - Badge/counter display
 * - External link indicator
 * - Underline modes
 * - Button style mode
 * - Download attribute support
 */
function LinkControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const {
        databind,
        href,
        textBind,
        value,
        target = '_self',
        className = '',
        style = {},
        onClick,
        icon,
        iconPosition = 'left', // left | right
        badge,
        badgeColor = '#ef4444',
        showExternalIcon = true,
        underline = 'hover', // always | hover | none
        buttonStyle = false,
        download,
        disabled = false,
        rel
    } = control;

    const linkHref = databind ? rowData[databind] : href;
    const linkText = textBind ? rowData[textBind] : value;
    const isExternal = target === '_blank';
    
    const handleClick = (e) => {
        if (disabled) {
            e.preventDefault();
            return;
        }
        
        if (onClick) {
            e.preventDefault();
            const event = { target: { value: linkHref, text: linkText } };
            onClick(event, rowData, rowIndex);
        }
    };

    // Base styles
    const linkStyles = {
        color: disabled ? 'var(--text-disabled)' : (buttonStyle ? 'var(--text-on-accent)' : 'var(--accent-primary)'),
        textDecoration: underline === 'always' ? 'underline' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s ease',
        pointerEvents: disabled ? 'none' : 'auto',
        ...(buttonStyle && {
            backgroundColor: disabled ? 'var(--text-disabled)' : 'var(--accent-primary)',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: '500',
            textDecoration: 'none'
        }),
        ...style
    };

    const hoverStyles = `
        .link-control:hover {
            ${underline === 'hover' ? 'text-decoration: underline;' : ''}
            ${buttonStyle ? 'background-color: var(--accent-primary-hover); transform: translateY(-1px);' : 'color: var(--accent-primary-hover);'}
        }
    `;

    return (
        <>
            <style>{hoverStyles}</style>
            <a 
                href={linkHref || '#'}
                target={target}
                rel={rel || (isExternal ? 'noopener noreferrer' : undefined)}
                className={`link-control ${className} ${disabled ? 'disabled' : ''}`}
                onClick={handleClick}
                style={linkStyles}
                download={download}
            >
                {/* Left Icon */}
                {icon && iconPosition === 'left' && (
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>{icon}</span>
                )}

                {/* Link Text */}
                <span>{linkText}</span>

                {/* Badge */}
                {badge && (
                    <span style={{
                        backgroundColor: badgeColor,
                        color: 'var(--text-on-accent)',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        lineHeight: 1
                    }}>
                        {badge}
                    </span>
                )}

                {/* Right Icon */}
                {icon && iconPosition === 'right' && (
                    <span style={{ fontSize: '16px', lineHeight: 1 }}>{icon}</span>
                )}

                {/* External Link Indicator */}
                {isExternal && showExternalIcon && !icon && (
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>↗</span>
                )}

                {/* Download Indicator */}
                {download && (
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>⬇</span>
                )}
            </a>
        </>
    );
}

export default LinkControl;
