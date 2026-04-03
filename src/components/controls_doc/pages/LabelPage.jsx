// LabelPage.jsx - Label Control Documentation
import React from 'react';
import { LabelControl } from '../../controls';

function LabelPage({ addLog }) {
    const sampleData = { 
        name: 'John Doe', 
        email: 'john@example.com',
        status: 'Active',
        score: 95.5
    };

    return (
        <div className="page-content">
            <h1>🏷️ Label Control</h1>
            <p className="lead">
                Display static text or data-bound values with customizable styling
            </p>

            <section className="content-section">
                <h2>📝 Basic Usage</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <LabelControl control={{ value: 'Simple Label' }} />
                        <LabelControl control={{ 
                            databind: 'name',
                            style: { fontWeight: 'bold', color: '#3b82f6' }
                        }} rowData={sampleData} />
                        <LabelControl control={{ 
                            databind: 'email',
                            style: { fontSize: '14px', color: '#6b7280' }
                        }} rowData={sampleData} />
                    </div>
                </div>

                <pre className="code-block">{`<LabelControl control={{ value: 'Hello World' }} />

// With data binding
<LabelControl control={{ 
    databind: 'name',
    style: { fontWeight: 'bold' }
}} rowData={user} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Styling Examples</h2>
                <div className="demo-grid">
                    <div className="demo-box">
                        <h3>Bold Text</h3>
                        <LabelControl control={{ 
                            value: 'Bold Label',
                            style: { fontWeight: 'bold', fontSize: '16px' }
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Colored Text</h3>
                        <LabelControl control={{ 
                            value: 'Success Message',
                            style: { color: '#10b981', fontWeight: '500' }
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Custom Style</h3>
                        <LabelControl control={{ 
                            value: 'Custom Label',
                            style: { 
                                fontSize: '18px',
                                color: '#8b5cf6',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }
                        }} />
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📄 Multiline Text</h2>
                <p>
                    LabelControl automatically detects newline characters and preserves line breaks. 
                    Use the <code>multiline</code> property or include <code>\n</code> in your text.
                </p>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <h4>With Newline Characters:</h4>
                            <LabelControl control={{ 
                                value: 'Line 1\nLine 2\nLine 3',
                                style: { 
                                    color: '#374151',
                                    fontSize: '14px',
                                    lineHeight: '1.6'
                                }
                            }} />
                        </div>
                        <div>
                            <h4>Multiline Paragraph:</h4>
                            <LabelControl control={{ 
                                multiline: true,
                                value: 'This is a paragraph\nthat spans multiple lines\nwith proper formatting',
                                style: { 
                                    color: '#555',
                                    lineHeight: '1.8',
                                    maxWidth: '400px'
                                }
                            }} />
                        </div>
                        <div>
                            <h4>Data-bound Multiline:</h4>
                            <LabelControl control={{ 
                                databind: 'description',
                                multiline: true,
                                bold: true,
                                style: { 
                                    color: '#1f2937',
                                    lineHeight: '1.7'
                                }
                            }} rowData={{ 
                                description: 'First line of description\nSecond line with more info\nThird line to complete it' 
                            }} />
                        </div>
                    </div>
                </div>

                <pre className="code-block">{`// Text with newline characters
<LabelControl control={{ 
    value: 'Line 1\\nLine 2\\nLine 3',
    multiline: true,
    style: { lineHeight: '1.6' }
}} />

// Multiline from data
<LabelControl control={{ 
    databind: 'notes',
    multiline: true,
    bold: true,
    italic: true,
    fontSize: '14px'
}} rowData={data} />`}</pre>
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
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Static text to display</td>
                        </tr>
                        <tr>
                            <td><code>databind</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Bind to rowData field</td>
                        </tr>
                        <tr>
                            <td><code>multiline</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Enable multiline rendering (renders as &lt;div&gt; and preserves newlines with pre-wrap)</td>
                        </tr>
                        <tr>
                            <td><code>bold</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Apply bold font weight</td>
                        </tr>
                        <tr>
                            <td><code>italic</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Apply italic font style</td>
                        </tr>
                        <tr>
                            <td><code>fontSize</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Font size (e.g., '16px', '1.2em')</td>
                        </tr>
                        <tr>
                            <td><code>style</code></td>
                            <td><code>object</code></td>
                            <td>-</td>
                            <td>CSS styles for the label</td>
                        </tr>
                        <tr>
                            <td><code>className</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>CSS class name</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default LabelPage;
