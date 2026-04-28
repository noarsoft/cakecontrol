// ToggleControl.jsx
import React from 'react';
import './ToggleControl.css';

function ToggleControl({ control, rowData, rowIndex }) {
    const initialValue = control.databind ? rowData?.[control.databind] : control.value;
    const [isOn, setIsOn] = React.useState(!!initialValue);

    const handleToggle = () => {
        const newValue = !isOn;
        setIsOn(newValue);
        if (control.onChange) {
            control.onChange({ target: { checked: newValue } }, rowData, rowIndex);
        }
    };

    return (
        <label className="toggle-switch">
            <input
                type="checkbox"
                checked={isOn}
                onChange={handleToggle}
                disabled={control.disabled}
            />
            <span className="slider"></span>
        </label>
    );
}

export default ToggleControl;
