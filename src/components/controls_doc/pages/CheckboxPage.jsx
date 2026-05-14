import React from 'react';
import { CheckboxControl } from '../../controls';

function CheckboxPage({ addLog }) {
    return (
        <div className="page-content">
            <h1>☑️ Checkbox Control</h1>
            <p className="lead">Boolean checkbox input</p>
            
            <section className="content-section">
                <h2>Basic Example</h2>
                <div className="example-demo">
                    <CheckboxControl control={{
                        labelText: 'I agree to terms',
                        onChange: (e) => addLog(`Checked: ${e.target.checked}`)
                    }} />
                </div>
            </section>
        </div>
    );
}

export default CheckboxPage;
