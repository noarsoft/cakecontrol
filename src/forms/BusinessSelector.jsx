import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initService, getBusinesses, createBusiness, deleteBusiness } from '../lib/schemaService';
import ConfirmModal from '../components/controls/ConfirmModal';
import { useToast } from '../contexts/ToastContext';
import './BusinessSelector.css';

export default function BusinessSelector() {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBusinessName, setNewBusinessName] = useState('');
    const [nameTouched, setNameTouched] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        initService().then(() => loadBusinesses());
    }, []);

    const loadBusinesses = async () => {
        try {
            const data = await getBusinesses();
            setBusinesses(data || []);
        } catch (error) {
            showToast('ไม่สามารถโหลดข้อมูลโครงการได้', 'error');
        }
    };

    const handleSelect = (business) => {
        localStorage.setItem('activeBusinessId', business.id);
        localStorage.setItem('activeBusinessRootId', business.rootid);
        localStorage.setItem('activeBusinessName', business.name);
        navigate('/dashboard');
    };

    const handleAddBusiness = async () => {
        setNameTouched(true);
        const name = newBusinessName.trim();
        if (!name) {
            showToast('กรุณาระบุชื่อโครงการหรือธุรกิจ', 'warning');
            return;
        }

        if (businesses.some(b => b.name.toLowerCase() === name.toLowerCase())) {
            showToast('ชื่อโครงการนี้มีอยู่แล้วในระบบ', 'warning');
            return;
        }

        const words = name.split(/\s+/);
        let icon = name.substring(0, 2).toUpperCase();
        if (words.length >= 2) {
            icon = (words[0][0] + words[1][0]).toUpperCase();
        }

        try {
            await createBusiness(name, icon);
            setNewBusinessName('');
            setNameTouched(false);
            setShowAddModal(false);
            loadBusinesses();
            showToast('สร้างโครงการใหม่เรียบร้อยแล้ว', 'success');
        } catch (error) {
            showToast('เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถสร้างได้'), 'error');
        }
    };

    const handleDeleteBusiness = async () => {
        if (!deleteConfirm) return;
        try {
            await deleteBusiness(deleteConfirm.rootid);
            setDeleteConfirm(null);
            loadBusinesses();
            showToast('ลบโครงการเรียบร้อยแล้ว', 'success');
        } catch (error) {
            showToast('เกิดข้อผิดพลาด: ' + error.message, 'error');
        }
    };

    const isNameInvalid = nameTouched && !newBusinessName.trim();
    const nameErrorMessage = isNameInvalid ? 'กรุณาระบุชื่อโครงการ' : (nameTouched && businesses.some(b => b.name.toLowerCase() === newBusinessName.trim().toLowerCase()) ? 'ชื่อนี้มีอยู่แล้ว' : '');

    return (
        <div className="bs-container">
            <h1 className="bs-title">เลือกโครงการหรือธุรกิจ</h1>
            <p className="bs-subtitle">เลือกพื้นที่ทำงานที่คุณต้องการจัดการข้อมูลและฟอร์ม</p>

            <div className="bs-list">
                {businesses.map(b => (
                    <div key={b.id} className="bs-card-wrapper">
                        <button className="bs-card" onClick={() => handleSelect(b)}>
                            <div className="bs-avatar" style={{ backgroundColor: getColor(b.name) }}>
                                {b.icon || b.name.substring(0, 2).toUpperCase()}
                            </div>
                        </button>
                        <span className="bs-name">{b.name}</span>
                        <button
                            className="bs-delete-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirm(b);
                            }}
                            title="ลบโครงการ"
                        >
                            <span style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1 }}>✕</span>
                        </button>
                    </div>
                ))}

                <div className="bs-card-wrapper add-new">
                    <button className="bs-card" onClick={() => { setShowAddModal(true); setNameTouched(false); }}>
                        <div className="bs-avatar">
                            <div className="bs-add-btn">+</div>
                        </div>
                    </button>
                    <span className="bs-name">สร้างโครงการใหม่</span>
                </div>
            </div>

            {/* Add Business Modal (Netflix style) */}
            {showAddModal && (
                <div className="confirm-modal-backdrop netflix-style" onClick={() => { setShowAddModal(false); setNameTouched(false); }}>
                    <div className="confirm-modal netflix-style" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">สร้างโครงการใหม่</h2>
                        <p className="modal-subtitle">ระบุชื่อโครงการหรือหน่วยงานของคุณเพื่อเริ่มต้นจัดการฟอร์ม</p>
                        
                        <input
                            type="text"
                            className={`netflix-input ${isNameInvalid || (nameTouched && nameErrorMessage) ? 'error' : ''}`}
                            style={(isNameInvalid || (nameTouched && nameErrorMessage)) ? { borderColor: 'var(--error)' } : {}}
                            value={newBusinessName}
                            onChange={(e) => setNewBusinessName(e.target.value)}
                            onBlur={() => setNameTouched(true)}
                            placeholder="ชื่อโครงการ เช่น ระบบคลังสินค้า..."
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddBusiness();
                            }}
                        />
                        {nameErrorMessage && <div style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px' }}>{nameErrorMessage}</div>}
                        
                        <div className="modal-actions">
                            <button className="netflix-btn-secondary" onClick={() => { setShowAddModal(false); setNameTouched(false); }}>ยกเลิก</button>
                            <button className="netflix-btn-primary" onClick={handleAddBusiness}>บันทึก</button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={deleteConfirm !== null}
                title="ยืนยันการลบโครงการ"
                message={`คุณแน่ใจหรือไม่ว่าต้องการลบโครงการ "${deleteConfirm?.name}"? ข้อมูล แม่แบบ และเลย์เอาต์ทั้งหมดในโครงการนี้จะถูกลบอย่างถาวร`}
                variant="dangerous"
                onConfirm={handleDeleteBusiness}
                onCancel={() => setDeleteConfirm(null)}
            />
        </div>
    );
}

function getColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    // Netflix-ish vibrant colors
    return `hsl(${hue}, 60%, 45%)`;
}
