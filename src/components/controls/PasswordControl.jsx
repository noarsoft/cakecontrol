import React, { useState, useEffect } from 'react';
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
                    {visible ? '🙈' : '👁️'}
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
