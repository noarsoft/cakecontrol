import React from 'react';
import { DatePickerControl } from '../../controls';

function DatePage({ addLog }) {
    return (
        <div className="page-content">
            <h1>📅 Thai Date Picker</h1>
            <p className="lead">
                Custom date picker that formats the value as DD/MM/YYYY (พ.ศ.) and
                adapts its palette to the light/dark theme.
            </p>
            
            <section className="content-section">
                <h2>Theme-friendly picker</h2>
                <div className="example-demo">
                    <DatePickerControl control={{
                        placeholder: 'เลือกวันเกิด',
                        value: '1999-05-20',
                        onChange: (e) => addLog(`เลือกวันที่: ${e.target.value}`)
                    }} />
                </div>
            </section>
        </div>
    );
}

export default DatePage;
