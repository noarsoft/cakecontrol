import React from 'react';
import { BadgeControl } from '../../controls';

function BadgePage({ addLog }) {
    const sampleData = [
        { id: 1, status: 'active', role: 'admin', level: 'gold', count: 5 },
        { id: 2, status: 'inactive', role: 'user', level: 'silver', count: 12 },
        { id: 3, status: 'pending', role: 'moderator', level: 'bronze', count: 3 }
    ];

    return (
        <div className="page-content">
            <h1>🏅 Badge Control</h1>
            <p className="lead">
                Display status, labels, or counts with colored badges
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    BadgeControl is a simple component for displaying status indicators, labels, or counts
                    with customizable colors and styles.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Custom Colors</h3>
                        <p>Set background and text colors</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Data Binding</h3>
                        <p>Bind to data fields automatically</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Dynamic Colors</h3>
                        <p>Colors based on data values</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📦</div>
                        <h3>Simple & Light</h3>
                        <p>Minimal styling, easy to customize</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Examples</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <BadgeControl control={{
                            value: 'Default',
                            backgroundColor: '#007bff',
                            color: '#fff'
                        }} />
                        
                        <BadgeControl control={{
                            value: 'Success',
                            backgroundColor: '#28a745',
                            color: '#fff'
                        }} />
                        
                        <BadgeControl control={{
                            value: 'Warning',
                            backgroundColor: '#ffc107',
                            color: '#000'
                        }} />
                        
                        <BadgeControl control={{
                            value: 'Danger',
                            backgroundColor: '#dc3545',
                            color: '#fff'
                        }} />
                        
                        <BadgeControl control={{
                            value: 'Info',
                            backgroundColor: '#17a2b8',
                            color: '#fff'
                        }} />
                        
                        <BadgeControl control={{
                            value: 'Dark',
                            backgroundColor: '#343a40',
                            color: '#fff'
                        }} />
                    </div>
                </div>

                <pre className="code-block">{`<BadgeControl control={{
    value: 'Success',
    backgroundColor: '#28a745',
    color: '#fff'
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🔄 With Data Binding</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {sampleData.map(data => (
                            <div key={data.id} style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center',
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px'
                            }}>
                                <span style={{ fontWeight: 'bold', width: '80px' }}>ID: {data.id}</span>
                                
                                <BadgeControl 
                                    control={{
                                        databind: 'status',
                                        backgroundColor: '#6c757d',
                                        color: '#fff'
                                    }}
                                    rowData={data}
                                />
                                
                                <BadgeControl 
                                    control={{
                                        databind: 'role',
                                        backgroundColor: '#007bff',
                                        color: '#fff'
                                    }}
                                    rowData={data}
                                />
                                
                                <BadgeControl 
                                    control={{
                                        databind: 'level',
                                        backgroundColor: '#28a745',
                                        color: '#fff'
                                    }}
                                    rowData={data}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <pre className="code-block">{`<BadgeControl 
    control={{
        databind: 'status',
        backgroundColor: '#6c757d',
        color: '#fff'
    }}
    rowData={data}
/>`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Dynamic Colors (Function)</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {sampleData.map(data => (
                            <div key={data.id} style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center',
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px'
                            }}>
                                <span style={{ fontWeight: 'bold', width: '120px' }}>
                                    Status: {data.status}
                                </span>
                                
                                <BadgeControl 
                                    control={{
                                        databind: 'status',
                                        backgroundColor: (rowData) => {
                                            switch(rowData.status) {
                                                case 'active': return '#10b981';
                                                case 'inactive': return '#ef4444';
                                                case 'pending': return '#f59e0b';
                                                default: return '#6b7280';
                                            }
                                        },
                                        color: '#fff'
                                    }}
                                    rowData={data}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <pre className="code-block">{`<BadgeControl 
    control={{
        databind: 'status',
        backgroundColor: (rowData) => {
            switch(rowData.status) {
                case 'active': return '#10b981';
                case 'inactive': return '#ef4444';
                case 'pending': return '#f59e0b';
                default: return '#6b7280';
            }
        },
        color: '#fff'
    }}
    rowData={data}
/>`}</pre>
            </section>

            <section className="content-section">
                <h2>🔢 Count Badges</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {sampleData.map(data => (
                            <div key={data.id} style={{ 
                                display: 'flex', 
                                gap: '10px', 
                                alignItems: 'center',
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '4px'
                            }}>
                                <span style={{ fontWeight: 'bold', width: '150px' }}>
                                    {data.role}
                                </span>
                                
                                <span>Notifications:</span>
                                
                                <BadgeControl 
                                    control={{
                                        databind: 'count',
                                        backgroundColor: (rowData) => 
                                            rowData.count > 10 ? '#ef4444' : '#3b82f6',
                                        color: '#fff'
                                    }}
                                    rowData={data}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <pre className="code-block">{`<BadgeControl 
    control={{
        databind: 'count',
        backgroundColor: (rowData) => 
            rowData.count > 10 ? '#ef4444' : '#3b82f6',
        color: '#fff'
    }}
    rowData={data}
/>`}</pre>
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
                            <td><code>string|number</code></td>
                            <td><code>-</code></td>
                            <td>Static value to display</td>
                        </tr>
                        <tr>
                            <td><code>databind</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Field name to bind from rowData</td>
                        </tr>
                        <tr>
                            <td><code>backgroundColor</code></td>
                            <td><code>string|function</code></td>
                            <td><code>'#007bff'</code></td>
                            <td>Background color (or function returning color)</td>
                        </tr>
                        <tr>
                            <td><code>color</code></td>
                            <td><code>string</code></td>
                            <td><code>'#fff'</code></td>
                            <td>Text color</td>
                        </tr>
                        <tr>
                            <td><code>className</code></td>
                            <td><code>string</code></td>
                            <td><code>''</code></td>
                            <td>Additional CSS classes</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="content-section">
                <h2>💡 Tips & Best Practices</h2>
                <div className="note-box">
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li><strong>Color Consistency:</strong> Use consistent color schemes across your app</li>
                        <li><strong>Contrast:</strong> Ensure text color has good contrast with background</li>
                        <li><strong>Dynamic Colors:</strong> Use functions for status-based colors</li>
                        <li><strong>Accessibility:</strong> Don't rely on color alone to convey meaning</li>
                        <li><strong>Size:</strong> Keep badges small and concise (1-2 words or numbers)</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default BadgePage;
