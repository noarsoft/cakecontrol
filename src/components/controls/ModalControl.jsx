// ModalControl.jsx
import React, { useEffect } from 'react';
import './ModalControl.css';

function ModalControl({
    isOpen,
    title,
    onClose,
    size = 'md',        // sm, md, lg, xl
    children,
    footer,
    closeOnBackdropClick = true,
    closeOnEscapeKey = true,
    className = '',
}) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (closeOnEscapeKey && e.key === 'Escape' && isOpen) {
                onClose?.();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, closeOnEscapeKey, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div className="modal-control-backdrop" onClick={handleBackdropClick}>
            <div className={`modal-control modal-control-${size} ${className}`}>
                {title != null && (
                    <div className="modal-control-header">
                        <h2 className="modal-control-title">{title}</h2>
                        <button className="modal-control-close" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                )}
                <div className="modal-control-body">
                    {children}
                </div>
                {footer && (
                    <div className="modal-control-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ModalControl;
