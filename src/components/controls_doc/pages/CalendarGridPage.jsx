import React from 'react';
import { CalendarGridControl } from '../../controls';

function CalendarGridPage({ addLog }) {
    return (
        <div className="page-content">
            <h1>📆 Calendar Grid Control</h1>
            <p className="lead">
                Interactive calendar grid with Thai Buddhist Era (พ.ศ.), events, and editable mode
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    CalendarGridControl displays a full month calendar grid in Thai Buddhist Era format
                    with support for events, read-only or editable modes, and click interactions.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🇹🇭</div>
                        <h3>Buddhist Era</h3>
                        <p>Month/year in Thai พ.ศ. format</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📅</div>
                        <h3>Events</h3>
                        <p>Display text/events on specific dates</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">✏️</div>
                        <h3>Editable Mode</h3>
                        <p>Click to add/edit event text</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔔</div>
                        <h3>Click Events</h3>
                        <p>onClick callback for date interaction</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Read-Only Calendar (Default)</h2>
                <p>Display events without editing capability:</p>
                
                <div className="example-demo">
                    <CalendarGridControl control={{
                        initialDate: '20250214', // Valentine's Day (YYYYMMDD)
                        events: {
                            '2025-02-14': '💝 วันวาเลนไทน์',
                            '2025-02-16': 'วันมาฆบูชา',
                            '2025-02-19': 'วันพระราชทานธงชาติไทย'
                        },
                        onClick: (dateKey, dateInfo) => {
                            addLog(`Clicked: ${dateKey} | Event: ${dateInfo.events || 'ไม่มี event'}`);
                        }
                    }} />
                </div>

                <pre className="code-block">{`<CalendarGridControl control={{
    initialDate: '20250214',  // YYYYMMDD format (ค.ศ.)
    events: {
        '2025-02-14': '💝 วันวาเลนไทน์',
        '2025-02-16': 'วันมาฆบูชา'
    },
    onClick: (dateKey, dateInfo) => {
        console.log('Clicked:', dateKey);
        console.log('Event:', dateInfo.events);
    }
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>✏️ Editable Calendar</h2>
                <p>Enable editing mode to add/modify event text:</p>
                
                <div className="note-box" style={{ marginBottom: '15px' }}>
                    <strong>📌 How to Use:</strong>
                    <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                        <li>Click on any date to add/edit text</li>
                        <li>Press <kbd>Enter</kbd> to save (or <kbd>Shift+Enter</kbd> for new line)</li>
                        <li>Press <kbd>Esc</kbd> to cancel</li>
                        <li>Delete all text and save to remove event</li>
                    </ul>
                </div>

                <div className="example-demo">
                    <CalendarGridControl control={{
                        initialDate: '20250115',
                        editable: true,
                        events: {
                            '2025-01-15': 'วันครู',
                            '2025-01-16': 'วันครูโลก',
                            '2025-01-20': 'ประชุมทีม 14:00'
                        },
                        onClick: (dateKey, dateInfo) => {
                            addLog(`Editable calendar - Clicked: ${dateKey}`);
                        },
                        onEventChange: (dateKey, newText, allEvents) => {
                            addLog(`Event updated: ${dateKey} = "${newText}"`);
                        }
                    }} />
                </div>

                <pre className="code-block">{`<CalendarGridControl control={{
    initialDate: '20250115',
    editable: true,  // Enable edit mode
    events: {
        '2025-01-15': 'วันครู'
    },
    onClick: (dateKey, dateInfo) => {
        console.log('Clicked:', dateKey);
    },
    onEventChange: (dateKey, newText, allEvents) => {
        console.log('Updated:', dateKey, '=', newText);
        // Save to database or state
    }
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Custom Styled Events</h2>
                <p>Events can include emojis and multi-line text:</p>
                
                <div className="example-demo">
                    <CalendarGridControl control={{
                        initialDate: '20250301',
                        events: {
                            '2025-03-01': '🎂 วันเกิดพี่ชาย',
                            '2025-03-08': '👩 วันสตรีสากล',
                            '2025-03-15': '📊 Presentation\n14:00 - 16:00',
                            '2025-03-20': '✈️ เดินทาง\nกรุงเทพ → เชียงใหม่',
                            '2025-03-25': '🎉 งานเลี้ยงบริษัท'
                        },
                        onClick: (dateKey, dateInfo) => {
                            addLog(`Event: ${dateInfo.events || 'None'}`);
                        }
                    }} />
                </div>
            </section>

            <section className="content-section">
                <h2>🇹🇭 Date Format</h2>
                <div className="note-box">
                    <strong>📌 Date Formats:</strong>
                    <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                        <li><strong>initialDate:</strong> Use YYYYMMDD format in Gregorian year (ค.ศ.)</li>
                        <li><strong>events keys:</strong> Use YYYY-MM-DD format (with dashes)</li>
                        <li><strong>Display:</strong> Automatically shown in Buddhist Era (พ.ศ.)</li>
                        <li><strong>Example:</strong> <code>initialDate: '20250120'</code> displays as "มกราคม 2568"</li>
                    </ul>
                </div>

                <div style={{ marginTop: '15px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ 
                        padding: '15px', 
                        backgroundColor: '#fef3c7', 
                        borderRadius: '8px',
                        border: '1px solid #f59e0b',
                        flex: '1',
                        minWidth: '250px'
                    }}>
                        <div style={{ fontSize: '12px', color: '#78350f', marginBottom: '8px', fontWeight: 'bold' }}>
                            ✏️ In Code:
                        </div>
                        <code style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>
                            initialDate: '20250120'
                        </code>
                        <code style={{ fontSize: '13px', display: 'block' }}>
                            events: &#123; '2025-01-20': 'Event' &#125;
                        </code>
                    </div>

                    <div style={{ 
                        padding: '15px', 
                        backgroundColor: '#dbeafe', 
                        borderRadius: '8px',
                        border: '1px solid #3b82f6',
                        flex: '1',
                        minWidth: '250px'
                    }}>
                        <div style={{ fontSize: '12px', color: '#1e40af', marginBottom: '8px', fontWeight: 'bold' }}>
                            👀 User Sees:
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e40af' }}>
                            มกราคม 2568
                        </div>
                        <div style={{ fontSize: '13px', color: '#1e40af', marginTop: '5px' }}>
                            (20 Jan 2025 ค.ศ. = 20 ม.ค. 2568 พ.ศ.)
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>💡 Usage Tips</h2>
                <div className="note-box">
                    <strong>📌 Best Practices:</strong>
                    <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                        <li>Use read-only mode for displaying holidays/events</li>
                        <li>Use editable mode for note-taking or event planning</li>
                        <li>Store events in your database with YYYY-MM-DD keys</li>
                        <li>Handle <code>onEventChange</code> to persist changes</li>
                        <li>Use emojis (💝 🎂 📅) to make events visually appealing</li>
                        <li>Multi-line events work great for time ranges</li>
                    </ul>
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
                            <td><code>initialDate</code></td>
                            <td><code>string</code></td>
                            <td><code>today</code></td>
                            <td>Initial month to display (YYYYMMDD format, ค.ศ.)</td>
                        </tr>
                        <tr>
                            <td><code>events</code></td>
                            <td><code>object</code></td>
                            <td><code>{`{}`}</code></td>
                            <td>Event map: {`{ 'YYYY-MM-DD': 'text' }`}</td>
                        </tr>
                        <tr>
                            <td><code>editable</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Enable editing mode</td>
                        </tr>
                        <tr>
                            <td><code>onClick</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called when date is clicked (dateKey, dateInfo, rowData, rowIndex)</td>
                        </tr>
                        <tr>
                            <td><code>onEventChange</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called when event text changes (dateKey, newText, allEvents)</td>
                        </tr>
                        <tr>
                            <td><code>highlightToday</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Highlight current date</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default CalendarGridPage;
