import React from 'react';
import { ProgressControl, TableviewControl } from '../../controls';

function ProgressPage({ addLog }) {
    const tasks = [
        { id: 1, task: 'Database Migration', progress: 100, status: 'completed' },
        { id: 2, task: 'UI Development', progress: 75, status: 'in-progress' },
        { id: 3, task: 'API Integration', progress: 45, status: 'in-progress' },
        { id: 4, task: 'Testing', progress: 20, status: 'in-progress' },
        { id: 5, task: 'Documentation', progress: 0, status: 'pending' }
    ];

    return (
        <div className="page-content">
            <h1>📊 Progress Bar Control</h1>
            <p className="lead">
                Visual progress indicators with customizable colors and value display
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    ProgressControl displays progress as a horizontal bar, perfect for showing
                    completion status, loading states, or any percentage-based metrics.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Custom Colors</h3>
                        <p>Set any color for the progress bar</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Value Display</h3>
                        <p>Optional percentage text overlay</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Data Binding</h3>
                        <p>Bind to numeric data fields</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Lightweight</h3>
                        <p>Pure CSS, no external dependencies</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Examples</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                25% Progress
                            </label>
                            <ProgressControl control={{
                                value: 25,
                                color: '#007bff',
                                showValue: true
                            }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                50% Progress
                            </label>
                            <ProgressControl control={{
                                value: 50,
                                color: '#28a745',
                                showValue: true
                            }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                75% Progress
                            </label>
                            <ProgressControl control={{
                                value: 75,
                                color: '#ffc107',
                                showValue: true
                            }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                100% Progress
                            </label>
                            <ProgressControl control={{
                                value: 100,
                                color: '#28a745',
                                showValue: true
                            }} />
                        </div>
                    </div>
                </div>

                <pre className="code-block">{`<ProgressControl control={{
    value: 75,
    color: '#ffc107',
    showValue: true
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Color Variations</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Primary Blue</span>
                            <ProgressControl control={{ value: 60, color: '#007bff', showValue: true }} />
                        </div>
                        <div>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Success Green</span>
                            <ProgressControl control={{ value: 60, color: '#28a745', showValue: true }} />
                        </div>
                        <div>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Warning Yellow</span>
                            <ProgressControl control={{ value: 60, color: '#ffc107', showValue: true }} />
                        </div>
                        <div>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Danger Red</span>
                            <ProgressControl control={{ value: 60, color: '#dc3545', showValue: true }} />
                        </div>
                        <div>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Info Cyan</span>
                            <ProgressControl control={{ value: 60, color: '#17a2b8', showValue: true }} />
                        </div>
                        <div>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>Purple</span>
                            <ProgressControl control={{ value: 60, color: '#8b5cf6', showValue: true }} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>🔄 With Data Binding</h2>
                <div className="example-demo">
                    <TableviewControl config={{
                        data: tasks,
                        headers: ['Task', 'Progress', 'Status'],
                        colwidths: ['auto', '300px', '120px'],
                        controls: [
                            { type: 'label', databind: 'task' },
                            {
                                type: 'progress',
                                databind: 'progress',
                                showValue: true,
                                color: '#3b82f6'
                            },
                            {
                                type: 'badge',
                                databind: 'status',
                                backgroundColor: (rd) => {
                                    switch(rd.status) {
                                        case 'completed': return '#10b981';
                                        case 'in-progress': return '#3b82f6';
                                        case 'pending': return '#6b7280';
                                        default: return '#6b7280';
                                    }
                                },
                                color: '#fff'
                            }
                        ]
                    }} />
                </div>

                <pre className="code-block">{`// In TableviewControl
{
    type: 'progress',
    databind: 'progress',
    showValue: true,
    color: '#3b82f6'
}`}</pre>
            </section>

            <section className="content-section">
                <h2>🎯 Dynamic Colors Based on Value</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {[10, 25, 50, 75, 90, 100].map(value => {
                            let color = '#dc3545'; // Red for low
                            if (value >= 75) color = '#28a745'; // Green for high
                            else if (value >= 50) color = '#ffc107'; // Yellow for medium
                            else if (value >= 25) color = '#17a2b8'; // Cyan for low-medium
                            
                            return (
                                <div key={value}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        marginBottom: '5px'
                                    }}>
                                        <span style={{ fontSize: '13px', fontWeight: 'bold' }}>
                                            Progress: {value}%
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                            {value < 25 ? 'Low' : value < 50 ? 'Medium-Low' : value < 75 ? 'Medium' : value < 90 ? 'High' : 'Complete'}
                                        </span>
                                    </div>
                                    <ProgressControl control={{
                                        value: value,
                                        color: color,
                                        showValue: true
                                    }} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <pre className="code-block">{`// Dynamic color logic
let color = '#dc3545'; // Red for low
if (value >= 75) color = '#28a745'; // Green for high
else if (value >= 50) color = '#ffc107'; // Yellow for medium
else if (value >= 25) color = '#17a2b8'; // Cyan for low-medium

<ProgressControl control={{
    value: value,
    color: color,
    showValue: true
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>📏 Without Value Display</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <span style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px', display: 'block' }}>
                                Loading...
                            </span>
                            <ProgressControl control={{
                                value: 30,
                                color: '#3b82f6',
                                showValue: false
                            }} />
                        </div>
                        <div>
                            <span style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px', display: 'block' }}>
                                Processing...
                            </span>
                            <ProgressControl control={{
                                value: 65,
                                color: '#8b5cf6',
                                showValue: false
                            }} />
                        </div>
                        <div>
                            <span style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px', display: 'block' }}>
                                Almost done...
                            </span>
                            <ProgressControl control={{
                                value: 95,
                                color: '#10b981',
                                showValue: false
                            }} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📊 Multiple Progress Bars</h2>
                <div className="example-demo">
                    <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '20px'
                    }}>
                        <div style={{ 
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px'
                        }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Project A</h4>
                            <div style={{ marginBottom: '10px' }}>
                                <span style={{ fontSize: '12px' }}>Design</span>
                                <ProgressControl control={{ value: 100, color: '#10b981' }} />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <span style={{ fontSize: '12px' }}>Development</span>
                                <ProgressControl control={{ value: 70, color: '#3b82f6' }} />
                            </div>
                            <div>
                                <span style={{ fontSize: '12px' }}>Testing</span>
                                <ProgressControl control={{ value: 30, color: '#f59e0b' }} />
                            </div>
                        </div>

                        <div style={{ 
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px'
                        }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Project B</h4>
                            <div style={{ marginBottom: '10px' }}>
                                <span style={{ fontSize: '12px' }}>Planning</span>
                                <ProgressControl control={{ value: 100, color: '#10b981' }} />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <span style={{ fontSize: '12px' }}>Execution</span>
                                <ProgressControl control={{ value: 50, color: '#3b82f6' }} />
                            </div>
                            <div>
                                <span style={{ fontSize: '12px' }}>Review</span>
                                <ProgressControl control={{ value: 0, color: '#6b7280' }} />
                            </div>
                        </div>
                    </div>
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
                            <td><code>0</code></td>
                            <td>Progress value (0-100)</td>
                        </tr>
                        <tr>
                            <td><code>databind</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Field name to bind from rowData</td>
                        </tr>
                        <tr>
                            <td><code>color</code></td>
                            <td><code>string</code></td>
                            <td><code>'#007bff'</code></td>
                            <td>Progress bar color</td>
                        </tr>
                        <tr>
                            <td><code>showValue</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Display percentage text</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="content-section">
                <h2>💡 Tips & Best Practices</h2>
                <div className="note-box">
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li><strong>Value Range:</strong> Always use values between 0-100</li>
                        <li><strong>Color Coding:</strong> Use green for complete, yellow for in-progress, red for critical</li>
                        <li><strong>Show Value:</strong> Enable <code>showValue</code> for precise metrics</li>
                        <li><strong>Labels:</strong> Add descriptive labels above progress bars</li>
                        <li><strong>Accessibility:</strong> Use aria-labels for screen readers</li>
                        <li><strong>Animation:</strong> Consider adding CSS transitions for smooth updates</li>
                        <li><strong>Context:</strong> Provide context (e.g., "75% complete" vs just "75%")</li>
                    </ul>
                </div>
            </section>

            <section className="content-section">
                <h2>🎨 CSS Customization</h2>
                <pre className="code-block">{`/* Custom progress bar styles */
.progress {
    background-color: #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

.progress-bar {
    transition: width 0.5s ease;
    font-size: 12px;
    text-align: center;
    line-height: 20px;
}

/* Animated stripes (optional) */
.progress-bar.animated {
    background-image: linear-gradient(
        45deg,
        rgba(255,255,255,.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255,255,255,.15) 50%,
        rgba(255,255,255,.15) 75%,
        transparent 75%,
        transparent
    );
    background-size: 1rem 1rem;
    animation: progress-bar-stripes 1s linear infinite;
}

@keyframes progress-bar-stripes {
    0% { background-position: 1rem 0; }
    100% { background-position: 0 0; }
}`}</pre>
            </section>
        </div>
    );
}

export default ProgressPage;
