// TextboxPage.jsx - Textbox Control Documentation
import React, { useState } from 'react';
import { TextboxControl, FormControl } from '../../controls';

function TextboxPage({ addLog }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    return (
        <div className="page-content">
            <h1>✏️ Textbox Control</h1>
            <p className="lead">
                Single-line text input with data binding, validation, and event handling
            </p>

            <section className="content-section">
                <h2>📝 Basic Usage</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Name:</label>
                            <TextboxControl control={{ 
                                placeholder: 'Enter your name',
                                onChange: (e) => addLog(`Name: ${e.target.value}`)
                            }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Email:</label>
                            <TextboxControl control={{ 
                                placeholder: 'Enter your email',
                                onChange: (e) => addLog(`Email: ${e.target.value}`)
                            }} />
                        </div>
                    </div>
                </div>

                <pre className="code-block">{`<TextboxControl control={{ 
    placeholder: 'Enter text...',
    onChange: (e) => console.log(e.target.value)
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🔄 Data Binding</h2>
                <div className="example-demo">
                    <FormControl config={{
                        colnumbers: 6,
                        data: [formData],
                        controls: [
                            {
                                colno: 1,
                                rowno: 1,
                                colSpan: 6,
                                label: 'Full Name',
                                type: 'textbox',
                                databind: 'name',
                                placeholder: 'John Doe'
                            },
                            {
                                colno: 1,
                                rowno: 2,
                                colSpan: 6,
                                label: 'Email Address',
                                type: 'textbox',
                                databind: 'email',
                                placeholder: 'john@example.com'
                            },
                            {
                                colno: 1,
                                rowno: 3,
                                colSpan: 6,
                                label: 'Phone Number',
                                type: 'textbox',
                                databind: 'phone',
                                placeholder: '0812345678',
                                maxLength: 10
                            }
                        ]
                    }} />
                    <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                        <strong>Current Values:</strong>
                        <pre style={{ marginTop: '8px', fontSize: '13px' }}>{JSON.stringify(formData, null, 2)}</pre>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>🎨 Variants & States</h2>
                <div className="demo-grid">
                    <div className="demo-box">
                        <h3>Normal</h3>
                        <TextboxControl control={{ placeholder: 'Normal input' }} />
                    </div>
                    <div className="demo-box">
                        <h3>Disabled</h3>
                        <TextboxControl control={{ 
                            value: 'Cannot edit',
                            disabled: true 
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Read-only</h3>
                        <TextboxControl control={{ 
                            value: 'Read only value',
                            readOnly: true 
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Error State</h3>
                        <TextboxControl control={{ 
                            placeholder: 'Invalid input',
                            className: 'error'
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Success State</h3>
                        <TextboxControl control={{ 
                            value: 'Valid input',
                            className: 'success'
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Max Length</h3>
                        <TextboxControl control={{ 
                            placeholder: 'Max 10 chars',
                            maxLength: 10
                        }} />
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📄 Multiline Textarea</h2>
                <p>
                    Use the <code>rows</code> property to convert a single-line input into a multi-line textarea. 
                    When <code>rows &gt; 1</code>, the component renders a textarea instead of an input.
                </p>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Small Textarea (3 rows):</label>
                            <TextboxControl control={{ 
                                rows: 3,
                                placeholder: 'Enter short comment...',
                                onChange: (e) => addLog(`Small textarea: ${e.target.value}`)
                            }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Medium Textarea (5 rows):</label>
                            <TextboxControl control={{ 
                                rows: 5,
                                placeholder: 'Enter description...',
                                onChange: (e) => addLog(`Medium textarea: ${e.target.value}`)
                            }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Large Textarea (8 rows):</label>
                            <TextboxControl control={{ 
                                rows: 8,
                                cols: 50,
                                placeholder: 'Enter detailed message...',
                                onChange: (e) => addLog(`Large textarea: ${e.target.value}`)
                            }} />
                        </div>
                    </div>
                </div>

                <pre className="code-block">{`// Single-line (no rows or rows <= 1)
<TextboxControl control={{ 
    placeholder: 'Single line...'
}} />

// Multi-line textarea
<TextboxControl control={{ 
    rows: 4,           // Number of visible rows
    cols: 50,          // Optional: column width
    placeholder: 'Enter multiple lines...',
    onChange: (e) => console.log(e.target.value)
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>📝 Textarea in FormControl</h2>
                <p>
                    Use multiline textboxes within FormControl for complex forms:
                </p>
                <div className="example-demo">
                    <FormControl config={{
                        colnumbers: 6,
                        data: [formData],
                        controls: [
                            {
                                colno: 1,
                                rowno: 1,
                                colSpan: 6,
                                label: 'Subject',
                                type: 'textbox',
                                databind: 'subject',
                                placeholder: 'Enter subject'
                            },
                            {
                                colno: 1,
                                rowno: 2,
                                colSpan: 6,
                                label: 'Message',
                                type: 'textbox',
                                databind: 'message',
                                placeholder: 'Enter your message...',
                                rows: 5,
                                maxLength: 500
                            }
                        ]
                    }} />
                </div>

                <pre className="code-block">{`{
    colno: 1,
    rowno: 2,
    colSpan: 6,
    label: 'Comments',
    type: 'textbox',
    databind: 'comments',
    placeholder: 'Enter your comments...',
    rows: 4,              // Render as textarea
    maxLength: 500        // Character limit
}`}</pre>
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
                            <td>Static value</td>
                        </tr>
                        <tr>
                            <td><code>databind</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Bind to rowData field</td>
                        </tr>
                        <tr>
                            <td><code>placeholder</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Placeholder text</td>
                        </tr>
                        <tr>
                            <td><code>rows</code></td>
                            <td><code>number</code></td>
                            <td>-</td>
                            <td>Number of visible rows. If rows &gt; 1, renders as textarea. Default: 4 for textarea</td>
                        </tr>
                        <tr>
                            <td><code>cols</code></td>
                            <td><code>number</code></td>
                            <td>-</td>
                            <td>Number of visible columns in textarea</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Disable input</td>
                        </tr>
                        <tr>
                            <td><code>readOnly</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Make read-only</td>
                        </tr>
                        <tr>
                            <td><code>maxLength</code></td>
                            <td><code>number</code></td>
                            <td>-</td>
                            <td>Maximum character length</td>
                        </tr>
                        <tr>
                            <td><code>onChange</code></td>
                            <td><code>function</code></td>
                            <td>-</td>
                            <td>Change event handler</td>
                        </tr>
                        <tr>
                            <td><code>onBlur</code></td>
                            <td><code>function</code></td>
                            <td>-</td>
                            <td>Blur event handler</td>
                        </tr>
                        <tr>
                            <td><code>onFocus</code></td>
                            <td><code>function</code></td>
                            <td>-</td>
                            <td>Focus event handler</td>
                        </tr>
                        <tr>
                            <td><code>className</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>CSS class (e.g., 'error', 'success')</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default TextboxPage;
