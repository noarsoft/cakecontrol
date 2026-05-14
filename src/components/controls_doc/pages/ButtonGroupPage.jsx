import React from 'react';
import { ButtonGroupControl } from '../../controls';

function ButtonGroupPage({ addLog }) {
    return (
        <div className="page-content">
            <h1>🔲 Button Group Control</h1>
            <p className="lead">
                Group related buttons together for actions, filters, or navigation
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    ButtonGroupControl provides a way to group related buttons together, perfect for
                    toolbars, filters, view switchers, or any set of related actions.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔘</div>
                        <h3>Single/Multiple</h3>
                        <p>Radio or checkbox behavior</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Custom Styles</h3>
                        <p>Flexible styling options</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Responsive</h3>
                        <p>Works well on all screen sizes</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔔</div>
                        <h3>Events</h3>
                        <p>onChange callback for selections</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Example (Radio Mode)</h2>
                <p>Single selection mode - only one button active at a time:</p>
                
                <div className="example-demo">
                    <ButtonGroupControl control={{
                        options: [
                            { label: '📋 List', value: 'list' },
                            { label: '📊 Grid', value: 'grid' },
                            { label: '📑 Table', value: 'table' }
                        ],
                        value: 'list',
                        multiple: false,
                        onChange: (event) => {
                            addLog(`View mode: ${event.target.value}`);
                        }
                    }} />
                </div>

                <pre className="code-block">{`<ButtonGroupControl control={{
    options: [
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' },
        { label: 'Option 3', value: 'opt3' }
    ],
    value: 'opt1',
    multiple: false,  // Radio mode - single selection
    onChange: (event) => console.log(event.target.value)
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>☑️ Multiple Selection Mode</h2>
                <p>Allow multiple buttons to be selected simultaneously:</p>
                
                <div className="example-demo">
                    <div style={{ marginBottom: '15px' }}>
                        <strong>Filter by status:</strong>
                    </div>
                    <ButtonGroupControl control={{
                        options: [
                            { label: '✅ Active', value: 'active' },
                            { label: '⏸️ Pending', value: 'pending' },
                            { label: '❌ Inactive', value: 'inactive' }
                        ],
                        value: ['active', 'pending'],
                        multiple: true,
                        onChange: (event) => {
                            addLog(`Selected filters: ${event.target.value.join(', ')}`);
                        }
                    }} />
                </div>

                <pre className="code-block">{`<ButtonGroupControl control={{
    options: [
        { label: 'Filter 1', value: 'f1' },
        { label: 'Filter 2', value: 'f2' },
        { label: 'Filter 3', value: 'f3' }
    ],
    value: ['f1', 'f2'],  // Multiple defaults
    multiple: true,        // Allow multiple selections
    onChange: (event) => console.log(event.target.value)  // Returns array
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Custom Styled Buttons</h2>
                <p>Customize button appearance with className:</p>
                
                <div className="example-demo">
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ marginBottom: '10px' }}><strong>Priority Level:</strong></div>
                        <ButtonGroupControl control={{
                            options: [
                                { label: '🔴 High', value: 'high' },
                                { label: '🟡 Medium', value: 'medium' },
                                { label: '🟢 Low', value: 'low' }
                            ],
                            value: 'medium',
                            multiple: false,
                            selectedClassName: 'btn-primary',
                            onChange: (event) => {
                                addLog(`Priority set to: ${event.target.value}`);
                            }
                        }} />
                    </div>

                    <div>
                        <div style={{ marginBottom: '10px' }}><strong>Text Formatting:</strong></div>
                        <ButtonGroupControl control={{
                            options: [
                                { label: 'B', value: 'bold' },
                                { label: 'I', value: 'italic' },
                                { label: 'U', value: 'underline' }
                            ],
                            value: [],
                            multiple: true,
                            buttonClassName: 'btn-sm',
                            onChange: (event) => {
                                addLog(`Formatting: ${event.target.value.join(' + ')}`);
                            }
                        }} />
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>🔧 Icon Buttons</h2>
                <p>Create compact button groups with icons only:</p>
                
                <div className="example-demo">
                    <ButtonGroupControl control={{
                        options: [
                            { label: '👈', value: 'left' },
                            { label: '👆', value: 'center' },
                            { label: '👉', value: 'right' }
                        ],
                        value: 'left',
                        multiple: false,
                        onChange: (event) => {
                            addLog(`Alignment: ${event.target.value}`);
                        }
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
                            <td><code>options</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Array of {`{ label, value, icon, disabled }`}</td>
                        </tr>
                        <tr>
                            <td><code>value</code></td>
                            <td><code>string | array</code></td>
                            <td><code>-</code></td>
                            <td>Selected value(s)</td>
                        </tr>
                        <tr>
                            <td><code>multiple</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Allow multiple selections (checkbox mode)</td>
                        </tr>
                        <tr>
                            <td><code>onChange</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called with selected value (or array if multiple)</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Disable all buttons</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Button Object Props</h3>
                <table className="props-table">
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>label</code></td>
                            <td><code>string | JSX</code></td>
                            <td>Button label text or icon</td>
                        </tr>
                        <tr>
                            <td><code>value</code></td>
                            <td><code>string</code></td>
                            <td>Unique value for this button</td>
                        </tr>
                        <tr>
                            <td><code>className</code></td>
                            <td><code>string</code></td>
                            <td>Optional CSS class for styling</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default ButtonGroupPage;
