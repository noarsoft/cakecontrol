import React, { useState } from 'react';
import { TabControl, ButtonControl, TextboxControl, SelectControl } from '../../controls';

function TabsPage({ addLog }) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="page-content">
            <h1>📑 Tab Control</h1>
            <p className="lead">
                Organize content into tabbed sections with smooth transitions and flexible content
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    TabControl provides a tab interface for organizing content into separate views that can be
                    switched by clicking tab headers.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📑</div>
                        <h3>Multiple Tabs</h3>
                        <p>Support unlimited number of tabs</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Custom Content</h3>
                        <p>Any JSX content in tab panels</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔔</div>
                        <h3>Events</h3>
                        <p>onChange callback when tab switches</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Controlled/Uncontrolled</h3>
                        <p>Works in both modes</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Example</h2>
                <div className="example-demo">
                    <TabControl control={{
                        tabs: [
                            {
                                label: '🏠 Home',
                                value: 'home',
                                customContent: (
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{ margin: '0 0 10px 0' }}>Welcome</h3>
                                        <p style={{ margin: 0, color: '#6b7280' }}>
                                            This is the home tab content.
                                        </p>
                                    </div>
                                )
                            },
                            {
                                label: '⚙️ Settings',
                                value: 'settings',
                                customContent: (
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{ margin: '0 0 15px 0' }}>Settings</h3>
                                        <div style={{ marginBottom: '10px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                                            <TextboxControl 
                                                control={{ placeholder: 'Enter username' }}
                                                rowData={{}}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '5px' }}>Role:</label>
                                            <SelectControl 
                                                control={{
                                                    options: [
                                                        { label: 'Admin', value: 'admin' },
                                                        { label: 'User', value: 'user' }
                                                    ]
                                                }}
                                                rowData={{}}
                                            />
                                        </div>
                                    </div>
                                )
                            },
                            {
                                label: 'ℹ️ About',
                                value: 'about',
                                customContent: (
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{ margin: '0 0 10px 0' }}>About This App</h3>
                                        <p style={{ margin: '0 0 10px 0', color: '#6b7280' }}>
                                            Version 1.0.0
                                        </p>
                                        <ButtonControl 
                                            control={{
                                                value: 'Learn More',
                                                className: 'btn-primary',
                                                onClick: () => addLog('Learn More clicked')
                                            }}
                                            rowData={{}}
                                        />
                                    </div>
                                )
                            }
                        ],
                        onTabChange: (event) => {
                            addLog(`Tab changed to: ${event.target.value}`);
                        }
                    }} />
                </div>

                <pre className="code-block">{`<TabControl control={{
    tabs: [
        {
            label: 'Tab 1',
            content: <div>Content 1</div>
        },
        {
            label: 'Tab 2',
            content: <div>Content 2</div>
        }
    ],
    defaultActive: 0,
    onChange: (index) => console.log('Active tab:', index)
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🎮 Controlled Tabs</h2>
                <p>Control tab state externally:</p>
                
                <div className="example-demo">
                    <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                        <button 
                            className="btn-control btn-sm btn-primary"
                            onClick={() => {
                                setActiveTab(0);
                                addLog('Switched to Info tab');
                            }}
                        >
                            Go to Info
                        </button>
                        <button 
                            className="btn-control btn-sm btn-success"
                            onClick={() => {
                                setActiveTab(1);
                                addLog('Switched to Stats tab');
                            }}
                        >
                            Go to Stats
                        </button>
                        <button 
                            className="btn-control btn-sm btn-secondary"
                            onClick={() => {
                                setActiveTab(2);
                                addLog('Switched to Help tab');
                            }}
                        >
                            Go to Help
                        </button>
                    </div>

                    <TabControl control={{
                        tabs: [
                            {
                                label: 'ℹ️ Info',
                                value: 'info',
                                customContent: <div style={{ padding: '20px' }}>Information content</div>
                            },
                            {
                                label: '📊 Stats',
                                value: 'stats',
                                customContent: <div style={{ padding: '20px' }}>Statistics content</div>
                            },
                            {
                                label: '❓ Help',
                                value: 'help',
                                customContent: <div style={{ padding: '20px' }}>Help content</div>
                            }
                        ],
                        activeTab: ['info', 'stats', 'help'][activeTab],
                        onTabChange: (event) => {
                            const newIndex = ['info', 'stats', 'help'].indexOf(event.target.value);
                            setActiveTab(newIndex);
                            addLog(`Tab changed to: ${event.target.value}`);
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
                            <td><code>tabs</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Array of {`{ label, content }`} objects</td>
                        </tr>
                        <tr>
                            <td><code>defaultActive</code></td>
                            <td><code>number</code></td>
                            <td><code>0</code></td>
                            <td>Initially active tab index (uncontrolled)</td>
                        </tr>
                        <tr>
                            <td><code>active</code></td>
                            <td><code>number</code></td>
                            <td><code>-</code></td>
                            <td>Active tab index (controlled mode)</td>
                        </tr>
                        <tr>
                            <td><code>onChange</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called when tab changes (index)</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default TabsPage;
