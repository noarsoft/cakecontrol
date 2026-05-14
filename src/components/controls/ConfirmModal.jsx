import React from 'react';
import './ConfirmModal.css';

/**
 * ConfirmModal — ป๊อปอัปยืนยันการทำงาน
 * @param {boolean} isOpen - เปิด/ปิด
 * @param {string} title - หัวข้อ
 * @param {string} message - ข้อความรายละเอียด
 * @param {string} variant - 'normal' | 'dangerous' (สี icon และอารมณ์ modal)
 * @param {string} confirmText - ข้อความปุ่มตกลง
 * @param {string} cancelText - ข้อความปุ่มยกเลิก
 * @param {function} onConfirm - callback เมื่อกดตกลง
 * @param {function} onCancel - callback เมื่อกดยกเลิก
 */
function ConfirmModal({ 
    isOpen, 
    title, 
    message, 
    variant = 'normal', 
    confirmText = 'ยืนยัน', 
    cancelText = 'ยกเลิก',
    onConfirm, 
    onCancel 
}) {
    if (!isOpen) return null;

    const icon = variant === 'dangerous' ? '⚠️' : '❓';
    const confirmClass = variant === 'dangerous' ? 'btn-danger' : 'btn-primary';

    return (
        <div className="confirm-modal-backdrop" onClick={onCancel}>
            <div className={`confirm-modal confirm-modal-${variant}`} onClick={e => e.stopPropagation()}>
                <div className="confirm-modal-header">
                    <span className="confirm-modal-icon">{icon}</span>
                    <h2 className="confirm-modal-title">{title}</h2>
                </div>
                <div className="confirm-modal-content">
                    <p className="confirm-modal-message">{message}</p>
                </div>
                <div className="confirm-modal-footer">
                    <button className="confirm-modal-button btn-secondary" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className={`confirm-modal-button ${confirmClass}`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;
