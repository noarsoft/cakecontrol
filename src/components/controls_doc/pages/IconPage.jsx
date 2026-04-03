import React from 'react';
import { IconControl } from '../../controls';

function IconPage({ addLog }) {
    const sampleData = [
        { id: 1, icon: '⭐', name: 'Star' },
        { id: 2, icon: '❤️', name: 'Heart' },
        { id: 3, icon: '🔔', name: 'Bell' },
        { id: 4, icon: '✓', name: 'Check' }
    ];

    return (
        <div className="page-content">
            <h1>⭐ Icon Control</h1>
            <p className="lead">
                Display icons and emojis with optional click handlers
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    IconControl is a lightweight component for displaying icons using icon classes or emojis.
                    Supports Font Awesome, Bootstrap Icons, or any CSS icon library.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Any Icon Library</h3>
                        <p>Works with Font Awesome, Bootstrap Icons, etc.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🖱️</div>
                        <h3>Clickable</h3>
                        <p>Optional onClick handler</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Data Binding</h3>
                        <p>Bind icon classes from data</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">😊</div>
                        <h3>Emoji Support</h3>
                        <p>Use emojis as icons</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Using Icon Classes</h2>
                <div className="note-box" style={{ marginBottom: '20px' }}>
                    <strong>Note:</strong> This example assumes Font Awesome or Bootstrap Icons are loaded.
                    Replace with your icon library classes.
                </div>

                <pre className="code-block">{`// Font Awesome Example
<IconControl control={{
    iconClass: 'fas fa-home'
}} />

// Bootstrap Icons Example
<IconControl control={{
    iconClass: 'bi bi-house-fill'
}} />

// Material Icons Example
<IconControl control={{
    iconClass: 'material-icons',
    value: 'home'
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>😊 Using Emojis (Recommended)</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', gap: '20px', fontSize: '32px', flexWrap: 'wrap' }}>
                        {['⭐', '❤️', '🔔', '✓', '✕', '⚙️', '🏠', '📧', '📱', '🔍'].map((emoji, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{emoji}</div>
                                <code style={{ fontSize: '12px' }}>{emoji}</code>
                            </div>
                        ))}
                    </div>
                </div>

                <pre className="code-block">{`// Simple emoji icon
<span style={{ fontSize: '24px' }}>⭐</span>

// Or use in custom render
{
    type: 'custom',
    render: () => <span style={{ fontSize: '24px' }}>⭐</span>
}`}</pre>
            </section>

            <section className="content-section">
                <h2>🖱️ Clickable Icons</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', gap: '15px', fontSize: '32px', alignItems: 'center' }}>
                        {sampleData.map(item => (
                            <div 
                                key={item.id}
                                onClick={() => addLog(`Clicked: ${item.name} ${item.icon}`)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    backgroundColor: '#f3f4f6',
                                    transition: 'all 0.2s',
                                    textAlign: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <div>{item.icon}</div>
                                <div style={{ fontSize: '12px', marginTop: '5px' }}>{item.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <pre className="code-block">{`<IconControl 
    control={{
        iconClass: 'fas fa-trash',
        onClick: (rowData, rowIndex) => {
            console.log('Delete clicked:', rowData);
        }
    }}
    rowData={rowData}
    rowIndex={rowIndex}
/>`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Icon Sizes & Colors</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: '16px', color: '#3b82f6' }}>⭐ 16px</div>
                        <div style={{ fontSize: '24px', color: '#10b981' }}>⭐ 24px</div>
                        <div style={{ fontSize: '32px', color: '#f59e0b' }}>⭐ 32px</div>
                        <div style={{ fontSize: '48px', color: '#ef4444' }}>⭐ 48px</div>
                        <div style={{ fontSize: '64px', color: '#8b5cf6' }}>⭐ 64px</div>
                    </div>
                </div>

                <pre className="code-block">{`<span style={{ 
    fontSize: '32px',
    color: '#3b82f6'
}}>
    ⭐
</span>`}</pre>
            </section>

            <section className="content-section">
                <h2>🔄 Common Use Cases</h2>
                
                <h3>Action Icons in Tables</h3>
                <div className="example-demo">
                    <div style={{ display: 'flex', gap: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <button 
                            onClick={() => addLog('Edit clicked')}
                            style={{ 
                                border: 'none', 
                                background: 'none', 
                                cursor: 'pointer',
                                fontSize: '20px',
                                padding: '5px 10px',
                                borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Edit"
                        >
                            ✏️
                        </button>
                        <button 
                            onClick={() => addLog('Delete clicked')}
                            style={{ 
                                border: 'none', 
                                background: 'none', 
                                cursor: 'pointer',
                                fontSize: '20px',
                                padding: '5px 10px',
                                borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="Delete"
                        >
                            🗑️
                        </button>
                        <button 
                            onClick={() => addLog('View clicked')}
                            style={{ 
                                border: 'none', 
                                background: 'none', 
                                cursor: 'pointer',
                                fontSize: '20px',
                                padding: '5px 10px',
                                borderRadius: '4px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            title="View"
                        >
                            👁️
                        </button>
                    </div>
                </div>

                <h3>Status Icons</h3>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '24px', color: '#10b981' }}>✓</span>
                            <span>Success / Verified</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '24px', color: '#ef4444' }}>✕</span>
                            <span>Error / Failed</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '24px', color: '#f59e0b' }}>⚠</span>
                            <span>Warning</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '24px', color: '#3b82f6' }}>ℹ</span>
                            <span>Information</span>
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
                            <td><code>iconClass</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>CSS class for icon (e.g., 'fas fa-home')</td>
                        </tr>
                        <tr>
                            <td><code>onClick</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Click handler (rowData, rowIndex)</td>
                        </tr>
                        <tr>
                            <td><code>databind</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Field name for icon class from rowData</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="content-section">
                <h2>💡 Tips & Best Practices</h2>
                <div className="note-box">
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li><strong>Emojis:</strong> Simpler than loading icon libraries, works everywhere</li>
                        <li><strong>Accessibility:</strong> Add title/aria-label for screen readers</li>
                        <li><strong>Size:</strong> Use consistent sizes (16px, 24px, 32px)</li>
                        <li><strong>Color:</strong> Use meaningful colors (green=success, red=error)</li>
                        <li><strong>Hover:</strong> Add hover effects for clickable icons</li>
                        <li><strong>Loading:</strong> Ensure icon fonts are loaded before use</li>
                    </ul>
                </div>
            </section>

            <section className="content-section">
                <h2>😊 Popular Emojis for UI</h2>
                <div className="example-demo">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' }}>
                        {[
                            ['⭐', 'Star'], ['❤️', 'Heart'], ['🔔', 'Bell'], ['✓', 'Check'],
                            ['✕', 'Close'], ['⚙️', 'Settings'], ['🏠', 'Home'], ['📧', 'Email'],
                            ['📱', 'Phone'], ['🔍', 'Search'], ['📁', 'Folder'], ['📄', 'File'],
                            ['👤', 'User'], ['🗑️', 'Delete'], ['✏️', 'Edit'], ['👁️', 'View'],
                            ['⬆️', 'Up'], ['⬇️', 'Down'], ['➡️', 'Right'], ['⬅️', 'Left'],
                            ['💾', 'Save'], ['🔒', 'Lock'], ['🔓', 'Unlock'], ['⚠', 'Warning']
                        ].map(([emoji, label], idx) => (
                            <div key={idx} style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                                <div style={{ fontSize: '32px', marginBottom: '5px' }}>{emoji}</div>
                                <div style={{ fontSize: '11px', color: '#6b7280' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default IconPage;
