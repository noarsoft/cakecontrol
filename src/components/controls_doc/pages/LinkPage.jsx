import React from 'react';
import { LinkControl, TableviewControl } from '../../controls';

function LinkPage({ addLog }) {
    return (
        <div className="page-content">
            <h1>🔗 Link Control</h1>
            <p className="lead">
                Create clickable links with icons, badges, and various styling options
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    LinkControl provides enhanced link functionality with support for icons, badges,
                    external link indicators, and button-style appearance.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Icons</h3>
                        <p>Add icons before or after link text</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🏅</div>
                        <h3>Badges</h3>
                        <p>Show notification counts or status</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">↗️</div>
                        <h3>External Indicator</h3>
                        <p>Automatic external link icon</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔘</div>
                        <h3>Button Style</h3>
                        <p>Transform link to button appearance</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Links</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <LinkControl control={{
                            value: 'Simple Link',
                            href: 'https://example.com',
                            onClick: () => addLog('Simple link clicked')
                        }} />

                        <LinkControl control={{
                            value: 'Link with Hover Underline',
                            href: '#',
                            underline: 'hover',
                            onClick: () => addLog('Hover underline link clicked')
                        }} />

                        <LinkControl control={{
                            value: 'Always Underlined',
                            href: '#',
                            underline: 'always',
                            onClick: () => addLog('Always underline link clicked')
                        }} />

                        <LinkControl control={{
                            value: 'No Underline',
                            href: '#',
                            underline: 'none',
                            onClick: () => addLog('No underline link clicked')
                        }} />
                    </div>
                </div>

                <pre className="code-block">{`<LinkControl control={{
    value: 'Click Me',
    href: 'https://example.com',
    underline: 'hover',  // 'always' | 'hover' | 'none'
    onClick: () => console.log('clicked')
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Links with Icons</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <LinkControl control={{
                            value: 'Icon on Left',
                            icon: '🏠',
                            iconPosition: 'left',
                            href: '#',
                            onClick: () => addLog('Left icon link')
                        }} />

                        <LinkControl control={{
                            value: 'Icon on Right',
                            icon: '➡️',
                            iconPosition: 'right',
                            href: '#',
                            onClick: () => addLog('Right icon link')
                        }} />

                        <LinkControl control={{
                            value: 'Download File',
                            icon: '📥',
                            iconPosition: 'left',
                            download: true,
                            href: '#',
                            onClick: () => addLog('Download link')
                        }} />

                        <LinkControl control={{
                            value: 'External Link',
                            target: '_blank',
                            showExternalIcon: true,
                            href: 'https://example.com',
                            onClick: () => addLog('External link')
                        }} />
                    </div>
                </div>

                <pre className="code-block">{`<LinkControl control={{
    value: 'Link Text',
    icon: '🎯',
    iconPosition: 'left',  // or 'right'
    href: '#'
}} />

// External link with indicator
<LinkControl control={{
    value: 'Visit Site',
    target: '_blank',
    showExternalIcon: true,
    href: 'https://example.com'
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🏅 Links with Badges</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <LinkControl control={{
                            value: 'Notifications',
                            badge: '5',
                            badgeColor: '#ef4444',
                            href: '#',
                            onClick: () => addLog('Notifications clicked')
                        }} />

                        <LinkControl control={{
                            value: 'Messages',
                            badge: '12',
                            badgeColor: '#3b82f6',
                            href: '#',
                            onClick: () => addLog('Messages clicked')
                        }} />

                        <LinkControl control={{
                            value: 'New Items',
                            badge: 'NEW',
                            badgeColor: '#10b981',
                            href: '#',
                            onClick: () => addLog('New items clicked')
                        }} />
                    </div>
                </div>

                <pre className="code-block">{`<LinkControl control={{
    value: 'Link Text',
    badge: '5',
    badgeColor: '#ef4444',
    href: '#'
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🔘 Button Style Links</h2>
                <p>Transform links into button appearance:</p>
                
                <div className="example-demo">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <LinkControl control={{
                            value: 'Primary Button',
                            buttonStyle: true,
                            href: '#',
                            onClick: () => addLog('Primary button link')
                        }} />

                        <LinkControl control={{
                            value: 'With Icon',
                            icon: '🚀',
                            iconPosition: 'left',
                            buttonStyle: true,
                            href: '#',
                            onClick: () => addLog('Button with icon')
                        }} />

                        <LinkControl control={{
                            value: 'Get Started',
                            icon: '➡️',
                            iconPosition: 'right',
                            buttonStyle: true,
                            href: '#',
                            onClick: () => addLog('Get started button')
                        }} />
                    </div>
                </div>

                <pre className="code-block">{`<LinkControl control={{
    value: 'Button Link',
    buttonStyle: true,
    icon: '🚀',
    href: '#'
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🎯 Complete Example</h2>
                <div className="example-demo">
                    <TableviewControl config={{
                        headers: ['Type', 'Example'],
                        colwidths: ['200px', 'auto'],
                        data: [
                            { type: 'Basic Link', url: 'https://example.com', text: 'Example Website' },
                            { type: 'Icon Left', url: 'https://docs.com', text: 'Documentation' },
                            { type: 'With Badge', url: '#notifications', text: 'Alerts', count: '3' },
                            { type: 'Button Style', url: '#action', text: 'Take Action' }
                        ],
                        controls: [
                            {
                                type: 'label',
                                databind: 'type'
                            },
                            {
                                type: 'custom',
                                render: (rowData) => {
                                    if (rowData.type === 'Basic Link') {
                                        return <LinkControl control={{
                                            databind: 'text',
                                            href: rowData.url,
                                            target: '_blank',
                                            showExternalIcon: true,
                                            onClick: () => addLog(`Clicked: ${rowData.text}`)
                                        }} rowData={rowData} />;
                                    }
                                    if (rowData.type === 'Icon Left') {
                                        return <LinkControl control={{
                                            databind: 'text',
                                            icon: '📚',
                                            iconPosition: 'left',
                                            href: rowData.url,
                                            onClick: () => addLog(`Clicked: ${rowData.text}`)
                                        }} rowData={rowData} />;
                                    }
                                    if (rowData.type === 'With Badge') {
                                        return <LinkControl control={{
                                            databind: 'text',
                                            badge: rowData.count,
                                            badgeColor: '#ef4444',
                                            href: rowData.url,
                                            onClick: () => addLog(`Clicked: ${rowData.text}`)
                                        }} rowData={rowData} />;
                                    }
                                    if (rowData.type === 'Button Style') {
                                        return <LinkControl control={{
                                            databind: 'text',
                                            buttonStyle: true,
                                            icon: '⚡',
                                            iconPosition: 'left',
                                            href: rowData.url,
                                            onClick: () => addLog(`Clicked: ${rowData.text}`)
                                        }} rowData={rowData} />;
                                    }
                                }
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
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Link text (or use databind)</td>
                        </tr>
                        <tr>
                            <td><code>databind</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Property path for href or text</td>
                        </tr>
                        <tr>
                            <td><code>href</code></td>
                            <td><code>string</code></td>
                            <td><code>'#'</code></td>
                            <td>Link destination URL</td>
                        </tr>
                        <tr>
                            <td><code>target</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Link target (_blank, _self, etc.)</td>
                        </tr>
                        <tr>
                            <td><code>icon</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Icon or emoji to display</td>
                        </tr>
                        <tr>
                            <td><code>iconPosition</code></td>
                            <td><code>string</code></td>
                            <td><code>'left'</code></td>
                            <td>'left' or 'right'</td>
                        </tr>
                        <tr>
                            <td><code>badge</code></td>
                            <td><code>string | number</code></td>
                            <td><code>-</code></td>
                            <td>Badge content (count or text)</td>
                        </tr>
                        <tr>
                            <td><code>badgeColor</code></td>
                            <td><code>string</code></td>
                            <td><code>'#ef4444'</code></td>
                            <td>Badge background color</td>
                        </tr>
                        <tr>
                            <td><code>showExternalIcon</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Show ↗ icon for external links</td>
                        </tr>
                        <tr>
                            <td><code>underline</code></td>
                            <td><code>string</code></td>
                            <td><code>'hover'</code></td>
                            <td>'always' | 'hover' | 'none'</td>
                        </tr>
                        <tr>
                            <td><code>buttonStyle</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Style as button instead of link</td>
                        </tr>
                        <tr>
                            <td><code>download</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Enable download mode (shows ⬇)</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Disable link interaction</td>
                        </tr>
                        <tr>
                            <td><code>onClick</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Click event handler</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default LinkPage;
