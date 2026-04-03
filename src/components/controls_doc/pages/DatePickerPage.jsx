import React from 'react';
import { DatePickerControl } from '../../controls';

function DatePickerPage({ addLog }) {
    return (
        <div className="page-content">
            <h1>📅 DatePicker Control</h1>
            <p className="lead">
                Thai Buddhist Era (พ.ศ.) date picker with calendar popup and keyboard input
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    DatePickerControl provides a Thai-localized date picker that displays dates in Buddhist Era (พ.ศ.)
                    with both calendar popup and direct text input support.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🇹🇭</div>
                        <h3>Thai Buddhist Era</h3>
                        <p>Automatic พ.ศ. conversion (+543 years)</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📆</div>
                        <h3>Calendar Popup</h3>
                        <p>Visual date selection with calendar</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⌨️</div>
                        <h3>Keyboard Input</h3>
                        <p>Direct date entry support</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Data Binding</h3>
                        <p>Works with databind property</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Example</h2>
                <div className="example-demo">
                    <div className="datepicker-form-stack">
                        <div className="datepicker-form-field">
                            <label className="datepicker-label">
                                วันเกิด:
                            </label>
                            <DatePickerControl control={{
                                placeholder: 'เลือกวันเกิด',
                                onChange: (e) => {
                                    addLog(`Birth date selected: ${e.target.value}`);
                                }
                            }} />
                        </div>

                        <div className="datepicker-form-field">
                            <label className="datepicker-label">
                                วันเริ่มงาน:
                            </label>
                            <DatePickerControl control={{
                                value: '1999-05-20',
                                onChange: (e) => {
                                    addLog(`Start date: ${e.target.value}`);
                                }
                            }} />
                        </div>
                    </div>
                </div>

                <pre className="code-block">{`<DatePickerControl control={{
    placeholder: 'เลือกวันที่',
    onChange: (e) => {
        console.log('Selected:', e.target.value);  // YYYY-MM-DD format
    }
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🔗 With Data Binding</h2>
                <p>Use <code>databind</code> to automatically sync with data:</p>
                
                <div className="example-demo">
                    <div className="datepicker-card">
                        <h4>User Profile</h4>
                        <div className="datepicker-form-field">
                            <label className="datepicker-label">
                                วันเกิด:
                            </label>
                            <DatePickerControl control={{
                                databind: 'birthDate',
                                placeholder: 'เลือกวันเกิด',
                                onChange: (e, rowData) => {
                                    addLog(`Birth date: ${e.target.value} (Age: ${new Date().getFullYear() - new Date(e.target.value).getFullYear()})`);
                                }
                            }} rowData={{ birthDate: '1995-03-15' }} />
                        </div>

                        <div className="datepicker-form-field">
                            <label className="datepicker-label">
                                วันเริ่มงาน:
                            </label>
                            <DatePickerControl control={{
                                databind: 'joinDate',
                                placeholder: 'เลือกวันเริ่มงาน',
                                onChange: (e, rowData) => {
                                    addLog(`Join date: ${e.target.value}`);
                                }
                            }} rowData={{ joinDate: '2020-01-15' }} />
                        </div>
                    </div>
                </div>

                <pre className="code-block">{`const user = { birthDate: '1995-03-15' };

<DatePickerControl control={{
    databind: 'birthDate',
    onChange: (e, rowData) => {
        console.log(rowData.birthDate);
    }
}} rowData={user} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🇹🇭 Buddhist Era (พ.ศ.) Display</h2>
                <div className="note-box">
                    <strong>📌 Important:</strong>
                    <ul className="note-list">
                        <li><strong>Display:</strong> Shows dates in Buddhist Era (พ.ศ.) - adds 543 years</li>
                        <li><strong>Storage:</strong> Stores in ISO format (YYYY-MM-DD) using Gregorian year (ค.ศ.)</li>
                        <li><strong>Example:</strong> User sees "20 พฤษภาคม 2542", stored as "1999-05-20"</li>
                        <li><strong>Conversion:</strong> Automatic - no manual conversion needed</li>
                    </ul>
                </div>

                <div className="example-demo" style={{ marginTop: '15px' }}>
                    <div className="buddhist-display-row">
                        <div className="buddhist-display-box">
                            <div className="buddhist-display-meta">User sees:</div>
                            <div className="buddhist-display-value">20 พฤษภาคม 2542</div>
                            <div className="buddhist-display-sub">(Buddhist Era พ.ศ.)</div>
                        </div>

                        <div className="buddhist-stored-box">
                            <div className="buddhist-display-meta">Stored as:</div>
                            <div className="buddhist-stored-value">1999-05-20</div>
                            <div className="buddhist-display-sub">(ISO format ค.ศ.)</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>💡 Usage Tips</h2>
                <div className="note-box">
                    <strong>📌 Best Practices:</strong>
                    <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                        <li>Always use <code>placeholder</code> to guide users on expected format</li>
                        <li>Store dates in ISO format (YYYY-MM-DD) for database compatibility</li>
                        <li>Display is automatically in พ.ศ. - no conversion code needed</li>
                        <li>Use <code>onChange</code> to validate or process selected dates</li>
                        <li>Works seamlessly with FormControl and data binding</li>
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
                            <td><code>value</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Date value in YYYY-MM-DD format</td>
                        </tr>
                        <tr>
                            <td><code>databind</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Property path for data binding</td>
                        </tr>
                        <tr>
                            <td><code>placeholder</code></td>
                            <td><code>string</code></td>
                            <td><code>'เลือกวันที่'</code></td>
                            <td>Placeholder text</td>
                        </tr>
                        <tr>
                            <td><code>onChange</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called when date changes (event, rowData, rowIndex)</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Disable date selection</td>
                        </tr>
                        <tr>
                            <td><code>minDate</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Minimum allowed date (YYYY-MM-DD)</td>
                        </tr>
                        <tr>
                            <td><code>maxDate</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Maximum allowed date (YYYY-MM-DD)</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default DatePickerPage;
