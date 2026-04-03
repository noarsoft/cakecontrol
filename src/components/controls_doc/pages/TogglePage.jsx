import React from 'react';
import { ToggleControl } from '../../controls';

function TogglePage({ addLog }) {
    return (
        <div className="page-content">
            <h1>🔘 Toggle Control</h1>
            <p className="lead">Toggle switch for boolean values</p>
            
            <section className="content-section">
                <h2>Basic Example</h2>
                <div className="example-demo">
                    <ToggleControl control={{
                        onChange: (e) => addLog(`Toggle: ${e.target.checked}`)
                    }} />
                </div>
            </section>
        </div>
    );
}

export default TogglePage;
