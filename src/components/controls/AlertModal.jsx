// AlertModal.jsx
import React from 'react';
import './AlertModal.css';

function AlertModal({ 
    isOpen, 
    type = 'info',  // info, success, warning, error
    title, 
    message, 
    buttons,
    onClose,
    closeOnBackdropClick = true,
    closeOnEscapeKey = true
}) {
    React.useEffect(() => {
        const handleEscapeKey = (e) => {
            if (closeOnEscapeKey && e.key === 'Escape' && isOpen) {
                onClose?.();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, closeOnEscapeKey, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
            onClose?.();
        }
    };

    const getTypeIcon = () => {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || icons.info;
    };

    const defaultButtons = [
        {
            label: 'OK',
            variant: type === 'error' ? 'danger' : type === 'success' ? 'success' : 'primary',
            onClick: onClose
        }
    ];

    const finalButtons = buttons || defaultButtons;

    return (
        <div className={`alert-modal-backdrop alert-modal-${type}`} onClick={handleBackdropClick}>
            <div className="alert-modal">
                <div className="alert-modal-header">
                    <span className="alert-modal-icon">{getTypeIcon()}</span>
                    <h2 className="alert-modal-title">{title}</h2>
                </div>

                <div className="alert-modal-content">
                    <p className="alert-modal-message">{message}</p>
                </div>

                <div className="alert-modal-footer">
                    {finalButtons.map((button, index) => (
                        <button
                            key={index}
                            className={`alert-modal-button btn-${button.variant || 'primary'}`}
                            onClick={() => {
                                button.onClick?.();
                            }}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>

                {closeOnEscapeKey && (
                    <button 
                        className="alert-modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
}

export default AlertModal;
