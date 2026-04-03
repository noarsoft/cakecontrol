import React from 'react';
import { FormControl } from '../../controls';

function FormPage({ addLog }) {
    return (
        <div className="page-content">
            <h1>📝 Form Control</h1>
            <p className="lead">
                Build complex forms with automatic layout management, responsive design, and full data binding support
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    FormControl provides a powerful grid-based layout system for creating forms with automatic positioning,
                    responsive breakpoints, and seamless data binding.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📐</div>
                        <h3>Grid Layout</h3>
                        <p>Automatic column-based positioning with colno, rowno, colSpan</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Responsive</h3>
                        <p>Automatic mobile adaptation with responsive prop</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Data Binding</h3>
                        <p>Direct binding to nested object properties</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>All Controls</h3>
                        <p>Supports 20+ control types in one form</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Example</h2>
                <div className="example-demo">
                    <FormControl config={{
                        colnumbers: 6,
                        responsive: true,
                        data: [{
                            name: 'สมชาย ใจดี',
                            email: 'somchai@test.com',
                            age: 25,
                            role: 'admin',
                            active: true
                        }],
                        controls: [
                            {
                                colno: 1,
                                rowno: 1,
                                colSpan: 3,
                                label: 'ชื่อ',
                                databind: 'name',
                                type: 'textbox',
                                placeholder: 'กรอกชื่อ'
                            },
                            {
                                colno: 4,
                                rowno: 1,
                                colSpan: 3,
                                label: 'อีเมล',
                                databind: 'email',
                                type: 'textbox',
                                placeholder: 'กรอกอีเมล'
                            },
                            {
                                colno: 1,
                                rowno: 2,
                                colSpan: 2,
                                label: 'อายุ',
                                databind: 'age',
                                type: 'number',
                                min: 0,
                                max: 100
                            },
                            {
                                colno: 3,
                                rowno: 2,
                                colSpan: 2,
                                label: 'บทบาท',
                                databind: 'role',
                                type: 'select',
                                options: [
                                    { label: 'Admin', value: 'admin' },
                                    { label: 'User', value: 'user' },
                                    { label: 'Guest', value: 'guest' }
                                ]
                            },
                            {
                                colno: 5,
                                rowno: 2,
                                colSpan: 2,
                                label: 'สถานะ',
                                databind: 'active',
                                type: 'toggle'
                            }
                        ],
                        onChange: (event) => {
                            addLog(`📝 Form updated: ${JSON.stringify(event.target.value).substring(0, 100)}`);
                        }
                    }} />
                </div>

                <pre className="code-block">{`<FormControl config={{
    colnumbers: 6,
    responsive: true,
    data: [{ name: 'สมชาย', email: 'test@test.com', ... }],
    controls: [
        {
            colno: 1,      // Column position (1-6)
            rowno: 1,      // Row position
            colSpan: 3,    // Spans 3 columns
            label: 'ชื่อ',
            databind: 'name',
            type: 'textbox'
        },
        // ... more controls
    ],
    onChange: (event) => console.log(event.target.value)
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🔗 Nested Data Binding</h2>
                <p>Access deeply nested properties using dot notation:</p>
                
                <div className="example-demo">
                    <FormControl config={{
                        colnumbers: 4,
                        responsive: true,
                        data: [{
                            user: {
                                profile: {
                                    firstName: 'สมชาย',
                                    lastName: 'ใจดี',
                                    email: 'somchai@example.com'
                                },
                                settings: {
                                    role: 'admin',
                                    active: true
                                }
                            }
                        }],
                        controls: [
                            {
                                colno: 1,
                                rowno: 1,
                                label: 'ชื่อ',
                                databind: 'user.profile.firstName',
                                type: 'textbox'
                            },
                            {
                                colno: 2,
                                rowno: 1,
                                label: 'นามสกุล',
                                databind: 'user.profile.lastName',
                                type: 'textbox'
                            },
                            {
                                colno: 1,
                                rowno: 2,
                                colSpan: 2,
                                label: 'อีเมล',
                                databind: 'user.profile.email',
                                type: 'textbox'
                            },
                            {
                                colno: 1,
                                rowno: 3,
                                label: 'บทบาท',
                                databind: 'user.settings.role',
                                type: 'select',
                                options: [
                                    { label: 'Admin', value: 'admin' },
                                    { label: 'User', value: 'user' }
                                ]
                            },
                            {
                                colno: 2,
                                rowno: 3,
                                label: 'สถานะ',
                                databind: 'user.settings.active',
                                type: 'toggle'
                            }
                        ],
                        onChange: (event) => {
                            addLog(`📝 Nested form updated: ${JSON.stringify(event.target.value).substring(0, 100)}`);
                        }
                    }} />
                </div>

                <pre className="code-block">{`databind: 'user.profile.firstName'  // user.profile.firstName
databind: 'user.settings.role'       // user.settings.role`}</pre>
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
                            <td><code>colnumbers</code></td>
                            <td><code>number</code></td>
                            <td><code>6</code></td>
                            <td>Number of columns in the grid (1-12)</td>
                        </tr>
                        <tr>
                            <td><code>responsive</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Enable responsive mobile layout</td>
                        </tr>
                        <tr>
                            <td><code>data</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Data array (usually single object)</td>
                        </tr>
                        <tr>
                            <td><code>controls</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Array of control configurations</td>
                        </tr>
                        <tr>
                            <td><code>onChange</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called when any control value changes</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Control Configuration Props</h3>
                <table className="props-table">
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>colno</code></td>
                            <td><code>number</code></td>
                            <td>Starting column position (1-based)</td>
                        </tr>
                        <tr>
                            <td><code>rowno</code></td>
                            <td><code>number</code></td>
                            <td>Row position (1-based)</td>
                        </tr>
                        <tr>
                            <td><code>colSpan</code></td>
                            <td><code>number</code></td>
                            <td>Number of columns to span (default: 1)</td>
                        </tr>
                        <tr>
                            <td><code>label</code></td>
                            <td><code>string | object</code></td>
                            <td>Label text or {`{ databind: 'path' }`}</td>
                        </tr>
                        <tr>
                            <td><code>databind</code></td>
                            <td><code>string</code></td>
                            <td>Property path for data binding</td>
                        </tr>
                        <tr>
                            <td><code>type</code></td>
                            <td><code>string</code></td>
                            <td>Control type (textbox, select, toggle, etc.)</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default FormPage;
