import React from 'react';
import { AccordionControl } from '../../controls';

function AccordionPage({ addLog }) {
    return (
        <div className="page-content">
            <h1>📂 Accordion Control</h1>
            <p className="lead">
                Collapsible content panels for organizing information in expandable sections
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    AccordionControl provides expandable/collapsible sections perfect for FAQs, settings,
                    or any content that benefits from progressive disclosure.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Expand/Collapse</h3>
                        <p>Smooth animations for section transitions</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Single/Multiple</h3>
                        <p>Allow one or multiple sections open</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Custom Content</h3>
                        <p>Any content in accordion items</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔔</div>
                        <h3>Events</h3>
                        <p>onChange callback for state changes</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Example</h2>
                <div className="example-demo">
                    <AccordionControl control={{
                        items: [
                            {
                                title: '📚 What is this library?',
                                content: 'A comprehensive collection of React controls for building modern web applications with seamless data binding support.'
                            },
                            {
                                title: '🚀 How do I get started?',
                                content: 'Import the controls you need and start using them with the databind property for automatic data synchronization.'
                            },
                            {
                                title: '💡 What controls are available?',
                                content: 'We offer 20+ controls including Form, Table, Card, Accordion, Tabs, Tree, DatePicker, and many more.'
                            }
                        ],
                        defaultOpen: [0],
                        onChange: (openIndices) => {
                            addLog(`Accordion state: ${openIndices.join(', ')}`);
                        }
                    }} />
                </div>

                <pre className="code-block">{`<AccordionControl control={{
    items: [
        {
            title: 'Section 1',
            content: 'Content for section 1...'
        },
        {
            title: 'Section 2',
            content: 'Content for section 2...'
        }
    ],
    defaultOpen: [0],  // First item open by default
    multiple: true,    // Allow multiple sections open
    onChange: (openIndices) => console.log(openIndices)
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Custom Content</h2>
                <p>Use JSX for rich content in accordion sections:</p>
                
                <div className="example-demo">
                    <AccordionControl control={{
                        items: [
                            {
                                title: '🎨 Custom Styled Section',
                                content: (
                                    <div style={{ padding: '10px' }}>
                                        <p style={{ margin: '0 0 10px 0', color: '#6b7280' }}>
                                            You can include any JSX content in accordion items.
                                        </p>
                                        <button 
                                            className="btn-control btn-sm btn-primary"
                                            onClick={() => addLog('Button in accordion clicked')}
                                        >
                                            Click Me
                                        </button>
                                    </div>
                                )
                            },
                            {
                                title: '📋 Form in Accordion',
                                content: (
                                    <div style={{ padding: '10px' }}>
                                        <div style={{ marginBottom: '10px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                                                Name:
                                            </label>
                                            <input 
                                                type="text" 
                                                className="login-input"
                                                placeholder="Enter name"
                                                onChange={(e) => addLog(`Name: ${e.target.value}`)}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                                                Email:
                                            </label>
                                            <input 
                                                type="email" 
                                                className="login-input"
                                                placeholder="Enter email"
                                                onChange={(e) => addLog(`Email: ${e.target.value}`)}
                                            />
                                        </div>
                                    </div>
                                )
                            }
                        ],
                        multiple: true,
                        onChange: (openIndices) => {
                            addLog(`Custom accordion: ${openIndices.length} sections open`);
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
                            <td><code>items</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Array of {`{ title, content }`} objects</td>
                        </tr>
                        <tr>
                            <td><code>defaultOpen</code></td>
                            <td><code>number[]</code></td>
                            <td><code>[]</code></td>
                            <td>Indices of initially open sections</td>
                        </tr>
                        <tr>
                            <td><code>multiple</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Allow multiple sections open simultaneously</td>
                        </tr>
                        <tr>
                            <td><code>onChange</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called with array of open indices</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default AccordionPage;
