import React, { useState } from 'react';
import { DropdownControl, TableviewControl } from '../../controls';

function DropdownPage({ addLog }) {
    const [selectedDept, setSelectedDept] = useState('');
    const [selectedUser, setSelectedUser] = useState('');

    const departments = [
        { id: 1, code: 'IT', name: 'Information Technology', location: 'Building A' },
        { id: 2, code: 'HR', name: 'Human Resources', location: 'Building B' },
        { id: 3, code: 'FIN', name: 'Finance', location: 'Building C' },
        { id: 4, code: 'MKT', name: 'Marketing', location: 'Building D' },
        { id: 5, code: 'OPS', name: 'Operations', location: 'Building E' }
    ];

    const users = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        firstName: `User${i + 1}`,
        lastName: `Lastname${i + 1}`,
        email: `user${i + 1}@example.com`,
        department: departments[i % 5].name
    }));

    return (
        <div className="page-content">
            <h1>⬇️ Dropdown Control</h1>
            <p className="lead">
                Advanced dropdown with table view, search, and data binding
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    DropdownControl is a powerful dropdown component that displays data in a table format.
                    Features include search, keyboard navigation, and complex data selection.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Table View</h3>
                        <p>Display options in TableviewControl</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Searchable</h3>
                        <p>Filter options by typing</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Data Binding</h3>
                        <p>Bind to nested data fields</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">✕</div>
                        <h3>Clearable</h3>
                        <p>Clear button to reset selection</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚙️</div>
                        <h3>Configurable</h3>
                        <p>Custom table config and display fields</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Responsive</h3>
                        <p>Works on all screen sizes</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Example</h2>
                <div className="example-demo">
                    <div style={{ maxWidth: '400px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Select Department:
                        </label>
                        <DropdownControl control={{
                            data: departments,
                            keyField: 'id',
                            displayField: 'name',
                            placeholder: 'เลือก Department...',
                            searchable: true,
                            tableConfig: {
                                headers: ['Code', 'Department', 'Location'],
                                controls: [
                                    { type: 'label', databind: 'code' },
                                    { type: 'label', databind: 'name' },
                                    { type: 'label', databind: 'location' }
                                ]
                            },
                            onChange: (e, rowData) => {
                                setSelectedDept(e.target.value);
                                addLog(`Department selected: ${e.target.selectedRow?.name}`);
                            }
                        }} />
                        
                        {selectedDept && (
                            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '4px' }}>
                                Selected ID: <strong>{selectedDept}</strong>
                            </div>
                        )}
                    </div>
                </div>

                <pre className="code-block">{`<DropdownControl control={{
    data: departments,
    keyField: 'id',
    displayField: 'name',
    placeholder: 'เลือก Department...',
    searchable: true,
    tableConfig: {
        headers: ['Code', 'Department', 'Location'],
        controls: [
            { type: 'label', databind: 'code' },
            { type: 'label', databind: 'name' },
            { type: 'label', databind: 'location' }
        ]
    },
    onChange: (e, rowData) => {
        console.log('Selected:', e.target.selectedRow);
    }
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🔍 Searchable Dropdown</h2>
                <div className="example-demo">
                    <div style={{ maxWidth: '500px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Search Users (Type to filter):
                        </label>
                        <DropdownControl control={{
                            data: users,
                            keyField: 'id',
                            displayFields: ['firstName', 'lastName'],
                            searchFields: ['firstName', 'lastName', 'email'],
                            placeholder: 'ค้นหาชื่อหรืออีเมล...',
                            searchable: true,
                            clearable: true,
                            maxHeight: '400px',
                            tableConfig: {
                                headers: ['ID', 'First Name', 'Last Name', 'Email'],
                                colwidths: ['50px', '120px', '120px', 'auto'],
                                controls: [
                                    { type: 'label', databind: 'id' },
                                    { type: 'label', databind: 'firstName' },
                                    { type: 'label', databind: 'lastName' },
                                    { type: 'label', databind: 'email' }
                                ]
                            },
                            onChange: (e) => {
                                setSelectedUser(e.target.value);
                                addLog(`User selected: ${e.target.selectedRow?.email}`);
                            },
                            onSelect: (selectedRow) => {
                                addLog(`Full user data: ${JSON.stringify(selectedRow)}`);
                            }
                        }} />
                        
                        {selectedUser && (
                            <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '4px' }}>
                                Selected User ID: <strong>{selectedUser}</strong>
                            </div>
                        )}
                    </div>
                </div>

                <pre className="code-block">{`<DropdownControl control={{
    data: users,
    keyField: 'id',
    displayFields: ['firstName', 'lastName'], // Multiple fields
    searchFields: ['firstName', 'lastName', 'email'], // Search in these fields
    searchable: true,
    clearable: true,
    onChange: (e) => {
        console.log('Selected ID:', e.target.value);
        console.log('Selected Row:', e.target.selectedRow);
    }
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🔄 With Data Binding</h2>
                <div className="example-demo">
                    <TableviewControl config={{
                        data: [
                            { id: 1, name: 'John Doe', departmentId: 1 },
                            { id: 2, name: 'Jane Smith', departmentId: 2 }
                        ],
                        headers: ['Name', 'Department'],
                        controls: [
                            { type: 'label', databind: 'name' },
                            {
                                type: 'dropdown',
                                databind: 'departmentId',
                                data: departments,
                                keyField: 'id',
                                displayField: 'name',
                                searchable: true,
                                tableConfig: {
                                    headers: ['Code', 'Department'],
                                    controls: [
                                        { type: 'label', databind: 'code' },
                                        { type: 'label', databind: 'name' }
                                    ]
                                },
                                onChange: (e, rowData) => {
                                    addLog(`${rowData.name} department changed to ${e.target.selectedRow?.name}`);
                                }
                            }
                        ]
                    }} />
                </div>

                <pre className="code-block">{`// In TableviewControl
{
    type: 'dropdown',
    databind: 'departmentId',
    data: departments,
    keyField: 'id',
    displayField: 'name',
    searchable: true,
    onChange: (e, rowData) => {
        console.log('Changed for:', rowData);
    }
}`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Custom Table Configuration</h2>
                <div className="example-demo">
                    <div style={{ maxWidth: '600px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                            Rich Dropdown with Custom Table:
                        </label>
                        <DropdownControl control={{
                            data: users.slice(0, 10),
                            keyField: 'id',
                            displayFields: ['firstName', 'lastName'],
                            searchable: true,
                            tableConfig: {
                                headers: ['#', 'Name', 'Email', 'Department'],
                                colwidths: ['50px', '150px', '200px', 'auto'],
                                controls: [
                                    { type: 'label', databind: 'id' },
                                    {
                                        type: 'custom',
                                        render: (rd) => (
                                            <strong>{rd.firstName} {rd.lastName}</strong>
                                        )
                                    },
                                    { 
                                        type: 'label', 
                                        databind: 'email',
                                        style: { color: '#6b7280', fontSize: '13px' }
                                    },
                                    { 
                                        type: 'badge', 
                                        databind: 'department',
                                        backgroundColor: '#3b82f6',
                                        color: '#fff'
                                    }
                                ]
                            },
                            onChange: (e) => {
                                addLog(`Rich dropdown selected: ${e.target.selectedRow?.email}`);
                            }
                        }} />
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
                            <td><code>data</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Array of options to display</td>
                        </tr>
                        <tr>
                            <td><code>keyField</code></td>
                            <td><code>string</code></td>
                            <td><code>'id'</code></td>
                            <td>Field name for unique key</td>
                        </tr>
                        <tr>
                            <td><code>displayField</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Single field to display</td>
                        </tr>
                        <tr>
                            <td><code>displayFields</code></td>
                            <td><code>string[]</code></td>
                            <td><code>-</code></td>
                            <td>Multiple fields to display (joined with ' - ')</td>
                        </tr>
                        <tr>
                            <td><code>searchFields</code></td>
                            <td><code>string[]</code></td>
                            <td><code>displayFields</code></td>
                            <td>Fields to search in</td>
                        </tr>
                        <tr>
                            <td><code>searchable</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Enable search functionality</td>
                        </tr>
                        <tr>
                            <td><code>clearable</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Show clear button</td>
                        </tr>
                        <tr>
                            <td><code>placeholder</code></td>
                            <td><code>string</code></td>
                            <td><code>'เลือกรายการ...'</code></td>
                            <td>Input placeholder text</td>
                        </tr>
                        <tr>
                            <td><code>maxHeight</code></td>
                            <td><code>string</code></td>
                            <td><code>'300px'</code></td>
                            <td>Maximum dropdown height</td>
                        </tr>
                        <tr>
                            <td><code>tableConfig</code></td>
                            <td><code>object</code></td>
                            <td><code>{}</code></td>
                            <td>TableviewControl configuration</td>
                        </tr>
                        <tr>
                            <td><code>databind</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Field name to bind value</td>
                        </tr>
                        <tr>
                            <td><code>onChange</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called when selection changes (event, rowData, rowIndex)</td>
                        </tr>
                        <tr>
                            <td><code>onSelect</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called with full selected row (selectedRow, rowData, rowIndex)</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="content-section">
                <h2>💡 Tips & Best Practices</h2>
                <div className="note-box">
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li><strong>searchable:</strong> Always enable for large datasets (&gt;10 items)</li>
                        <li><strong>searchFields:</strong> Include all relevant searchable fields</li>
                        <li><strong>displayFields:</strong> Show enough info to distinguish items</li>
                        <li><strong>tableConfig:</strong> Customize columns to show relevant data</li>
                        <li><strong>maxHeight:</strong> Limit height for long lists (300px recommended)</li>
                        <li><strong>onChange vs onSelect:</strong> Use onChange for value, onSelect for full row data</li>
                        <li><strong>Performance:</strong> For very large datasets, consider pagination</li>
                        <li><strong>Accessibility:</strong> Ensure keyboard navigation works</li>
                    </ul>
                </div>
            </section>

            <section className="content-section">
                <h2>⚙️ Advanced: Nested Data Binding</h2>
                <pre className="code-block">{`const employee = {
    name: 'John Doe',
    department: {
        id: 1,
        name: 'IT'
    }
};

// Bind to nested field
<DropdownControl control={{
    databind: 'department.id', // Nested binding
    data: departments,
    keyField: 'id',
    displayField: 'name'
}} rowData={employee} />`}</pre>
            </section>
        </div>
    );
}

export default DropdownPage;
