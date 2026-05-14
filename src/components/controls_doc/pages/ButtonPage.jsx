import React from 'react';
import { ButtonControl } from '../../controls';

function ButtonPage({ addLog }) {
    return (
        <div className="page-content">
            <h1>🔲 Button Control</h1>
            <p className="lead">Interactive button with click handlers</p>
            
            <section className="content-section">
                <h2>Basic Example</h2>
                <div className="example-demo" style={{ display: 'flex', gap: '12px' }}>
                    <ButtonControl control={{
                        value: 'Primary',
                        className: 'btn-primary',
                        onClick: () => addLog('Primary clicked')
                    }} />
                    <ButtonControl control={{
                        value: 'Secondary',
                        className: 'btn-outline',
                        onClick: () => addLog('Secondary clicked')
                    }} />
                    <ButtonControl control={{
                        value: 'Danger',
                        className: 'btn-danger',
                        onClick: () => addLog('Danger clicked')
                    }} />
                </div>
            </section>
        </div>
    );
}

export default ButtonPage;
