import { useState, useEffect } from 'react';
import './PasswordControl.css';

function getPasswordStrength(password) {
    if (!password) return { score: 0, label: 'Very weak' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return { score, label: labels[score] || 'Very weak' };
}

function PasswordControl({ control = {}, rowData = {}, rowIndex }) {
    const databind = control.databind;
    const initial = databind ? (rowData && rowData[databind]) : control.value || '';
    const [value, setValue] = useState(initial);
    const [visible, setVisible] = useState(false);
    const [strength, setStrength] = useState({ score: 0, label: 'Very weak' });

    useEffect(() => {
        setStrength(getPasswordStrength(value));
    }, [value]);

    useEffect(() => {
        const newVal = databind ? (rowData && rowData[databind]) : control.value || '';
        setValue(newVal);
    }, [rowData, control.value, databind]);

    const onChange = (e) => {
        const v = e.target.value;
        setValue(v);

        if (control.onChange) {
            const event = { target: { value: v } };
            control.onChange(event, rowData, rowIndex);
        }
    };

    const toggleVisible = (e) => {
        e && e.preventDefault();
        setVisible(!visible);
    };

    const placeholder = control.placeholder || 'รหัสผ่าน';
    const disabled = !!control.disabled;
    const minLength = control.minLength || control.min || 0;
    const maxLength = control.maxLength || control.max || undefined;

    return (
        <div className={`password-control ${control.className || ''}`} style={control.style}>
            <div className="password-input-wrapper">
                <input
                    type={visible ? 'text' : 'password'}
                    className="password-input"
                    value={value || ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    minLength={minLength}
                    maxLength={maxLength}
                    readOnly={control.readOnly}
                />
                <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={toggleVisible}
                    title={visible ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                    {visible ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    )}
                </button>
            </div>

            {control.showStrength && (
                <div className="password-strength">
                    <div className={`strength-bar strength-${strength.score}`} style={{ ['--strength-score']: strength.score }} />
                    <div className="strength-label">{strength.label}</div>
                </div>
            )}
        </div>
    );
}

export default PasswordControl;
