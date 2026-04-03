// NumberPage.jsx - Number Control Documentation
import React from 'react';
import { NumberControl, FormControl } from '../../controls';

function NumberPage({ addLog }) {
    return (
        <div className="page-content">
            <h1>🔢 Number Control</h1>
            <p className="lead">
                Numeric input with min/max validation and step increments
            </p>

            <section className="content-section">
                <h2>📝 Basic Usage</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Age:</label>
                            <NumberControl control={{ 
                                placeholder: 'Enter age',
                                min: 0,
                                max: 150,
                                onChange: (e) => addLog(`Age: ${e.target.value}`)
                            }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Price:</label>
                            <NumberControl control={{ 
                                placeholder: 'Enter price',
                                min: 0,
                                step: 0.01,
                                onChange: (e) => addLog(`Price: ${e.target.value}`)
                            }} />
                        </div>
                    </div>
                </div>

                <pre className="code-block">{`<NumberControl control={{ 
    min: 0,
    max: 100,
    step: 1,
    onChange: (e) => console.log(e.target.value)
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>📊 Examples</h2>
                <div className="example-demo">
                    <FormControl config={{
                        colnumbers: 6,
                        data: [{ age: 25, quantity: 5, price: 99.99, discount: 10 }],
                        controls: [
                            {
                                colno: 1,
                                rowno: 1,
                                colSpan: 3,
                                label: 'Age',
                                type: 'number',
                                databind: 'age',
                                min: 0,
                                max: 150
                            },
                            {
                                colno: 4,
                                rowno: 1,
                                colSpan: 3,
                                label: 'Quantity',
                                type: 'number',
                                databind: 'quantity',
                                min: 1,
                                max: 100
                            },
                            {
                                colno: 1,
                                rowno: 2,
                                colSpan: 3,
                                label: 'Price',
                                type: 'number',
                                databind: 'price',
                                min: 0,
                                step: 0.01
                            },
                            {
                                colno: 4,
                                rowno: 2,
                                colSpan: 3,
                                label: 'Discount (%)',
                                type: 'number',
                                databind: 'discount',
                                min: 0,
                                max: 100
                            }
                        ]
                    }} />
                </div>
            </section>

            <section className="content-section">
                <h2>📋 Props Reference</h2>
                <table className="props-table">
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>value</code></td>
                            <td><code>number</code></td>
                            <td>-</td>
                            <td>Initial value</td>
                        </tr>
                        <tr>
                            <td><code>databind</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Bind to rowData field</td>
                        </tr>
                        <tr>
                            <td><code>min</code></td>
                            <td><code>number</code></td>
                            <td>-</td>
                            <td>Minimum value</td>
                        </tr>
                        <tr>
                            <td><code>max</code></td>
                            <td><code>number</code></td>
                            <td>-</td>
                            <td>Maximum value</td>
                        </tr>
                        <tr>
                            <td><code>step</code></td>
                            <td><code>number</code></td>
                            <td><code>1</code></td>
                            <td>Increment/decrement step</td>
                        </tr>
                        <tr>
                            <td><code>placeholder</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Placeholder text</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Disable input</td>
                        </tr>
                        <tr>
                            <td><code>onChange</code></td>
                            <td><code>function</code></td>
                            <td>-</td>
                            <td>Change event handler</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default NumberPage;
