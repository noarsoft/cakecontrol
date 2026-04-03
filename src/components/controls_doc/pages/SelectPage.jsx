// SelectPage, CheckboxPage, TogglePage, DatePage, ButtonPage
import React from 'react';
import { SelectControl } from '../../controls';

function SelectPage({ addLog }) {
    return (
        <div className="page-content">
            <h1>📋 Select Control</h1>
            <p className="lead">Dropdown selection with options</p>
            
            <section className="content-section">
                <h2>Basic Example</h2>
                <div className="example-demo">
                    <SelectControl control={{
                        options: [
                            { label: 'Option 1', value: '1' },
                            { label: 'Option 2', value: '2' },
                            { label: 'Option 3', value: '3' }
                        ],
                        onChange: (e) => addLog(`Selected: ${e.target.value}`)
                    }} />
                </div>
            </section>
        </div>
    );
}

export default SelectPage;
