// ConfirmModal.jsx
import React from 'react';
import './ConfirmModal.css';

function ConfirmModal({ 
    isOpen, 
    title, 
    message, 
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    confirmVariant = 'danger',  // primary, success, warning, danger
    cancelVariant = 'secondary',
    isDangerous = false,         // Shows warning styling if true
    closeOnBackdropClick = true,
    closeOnEscapeKey = true
}) {
    React.useEffect(() => {
        const handleEscapeKey = (e) => {
            if (closeOnEscapeKey && e.key === 'Escape' && isOpen) {
                onCancel?.();
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
    }, [isOpen, closeOnEscapeKey, onCancel]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) {
            onCancel?.();
        }
    };

    const getIcon = () => {
        return isDangerous ? '⚠️' : '❓';
    };

    return (
        <div 
            className={`confirm-modal-backdrop ${isDangerous ? 'confirm-modal-dangerous' : 'confirm-modal-normal'}`} 
            onClick={handleBackdropClick}
        >
            <div className="confirm-modal">
                <div className="confirm-modal-header">
                    <span className="confirm-modal-icon">{getIcon()}</span>
                    <h2 className="confirm-modal-title">{title}</h2>
                </div>

                <div className="confirm-modal-content">
                    <p className="confirm-modal-message">{message}</p>
                </div>

                <div className="confirm-modal-footer">
                    <button
                        className={`confirm-modal-button btn-${cancelVariant}`}
                        onClick={() => onCancel?.()}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        className={`confirm-modal-button btn-${confirmVariant}`}
                        onClick={() => onConfirm?.()}
                        autoFocus
                    >
                        {confirmLabel}
                    </button>
                </div>

                {closeOnEscapeKey && (
                    <button 
                        className="confirm-modal-close"
                        onClick={onCancel}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
}

export default ConfirmModal;
