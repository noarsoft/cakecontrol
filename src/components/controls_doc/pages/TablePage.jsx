import React, { useState } from 'react';
import { TableviewControl } from '../../controls';

function TablePage({ addLog }) {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    
    const users = Array.from({ length: 20 }, (_, i) => ({
        id: String(i + 1),
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${(i % 70) + 1}.jpg`,
        age: 20 + (i % 40),
        role: i % 5 === 0 ? "admin" : "user",
        status: i % 3 === 0 ? "inactive" : "active",
        verified: i % 2 === 0
    }));

    return (
        <div className="page-content">
            <h1>📊 Table Control</h1>
            <p className="lead">
                Display data in rows and columns with sorting, pagination, and inline controls
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    TableviewControl is a powerful data table component that supports various control types in each cell,
                    automatic pagination, sorting, and responsive design.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📋</div>
                        <h3>Inline Controls</h3>
                        <p>Any control type can be used in table cells</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📄</div>
                        <h3>Pagination</h3>
                        <p>Built-in pagination with customizable page sizes</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Data Binding</h3>
                        <p>Each control binds to row data automatically</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Responsive</h3>
                        <p>Mobile-friendly table layouts</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Example</h2>
                <div className="example-demo">
                    <TableviewControl config={{
                        headers: ['Name', 'Email', 'Role', 'Status'],
                        colwidths: ['200px', 'auto', '100px', '100px'],
                        data: users.slice(0, 5),
                        controls: [
                            {
                                type: 'label',
                                databind: 'name'
                            },
                            {
                                type: 'label',
                                databind: 'email'
                            },
                            {
                                type: 'select',
                                databind: 'role',
                                options: [
                                    { label: 'Admin', value: 'admin' },
                                    { label: 'User', value: 'user' }
                                ],
                                onChange: (e, rowData) => {
                                    addLog(`Role changed to ${e.target.value} for ${rowData.name}`);
                                }
                            },
                            {
                                type: 'toggle',
                                databind: 'verified',
                                onChange: (e, rowData) => {
                                    addLog(`${rowData.name} verified: ${e.target.checked}`);
                                }
                            }
                        ]
                    }} />
                </div>

                <pre className="code-block">{`<TableviewControl config={{
    headers: ['Name', 'Email', 'Role', 'Status'],
    colwidths: ['200px', 'auto', '100px', '100px'],
    data: users,
    controls: [
        { type: 'label', databind: 'name' },
        { type: 'label', databind: 'email' },
        { 
            type: 'select', 
            databind: 'role',
            options: [...],
            onChange: (e, rowData) => {...}
        },
        { type: 'toggle', databind: 'verified' }
    ]
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>📄 With Pagination</h2>
                <div className="example-demo">
                    <TableviewControl config={{
                        headers: ['Avatar', 'User Info', 'Age', 'Actions'],
                        colwidths: ['80px', 'auto', '80px', '150px'],
                        data: users,
                        pagination: {
                            limit: pageSize,
                            page: currentPage,
                            total: users.length
                        },
                        controls: [
                            {
                                type: 'custom',
                                render: (rowData) => (
                                    <img 
                                        src={rowData.avatar} 
                                        alt={rowData.name}
                                        style={{ 
                                            width: '50px', 
                                            height: '50px', 
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                )
                            },
                            {
                                type: 'custom',
                                render: (rowData) => (
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{rowData.name}</div>
                                        <div style={{ fontSize: '12px', color: '#6c757d' }}>{rowData.email}</div>
                                    </div>
                                )
                            },
                            {
                                type: 'label',
                                databind: 'age'
                            },
                            {
                                type: 'custom',
                                render: (rowData) => (
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button 
                                            className="btn-control btn-sm btn-primary"
                                            onClick={() => addLog(`View: ${rowData.name}`)}
                                        >
                                            View
                                        </button>
                                        <button 
                                            className="btn-control btn-sm btn-outline"
                                            onClick={() => addLog(`Edit: ${rowData.name}`)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                )
                            }
                        ],
                        onPageChange: (page, limit) => {
                            setCurrentPage(page);
                            addLog(`📄 Page changed to: ${page}, Limit: ${limit}`);
                        }
                    }} />
                </div>
            </section>

            <section className="content-section">
                <h2>🔀 Header Click Events (Sorting)</h2>
                <p>Handle header clicks to implement sorting, filtering, or other column-specific actions:</p>
                <div className="example-demo">
                    <TableviewControl config={{
                        headers: ['Name', 'Email', 'Role', 'Status', 'Verified'],
                        colwidths: ['200px', 'auto', '100px', '100px', '100px'],
                        data: users.slice(0, 5),
                        controls: [
                            { type: 'label', databind: 'name' },
                            { type: 'label', databind: 'email' },
                            {
                                type: 'select',
                                databind: 'role',
                                options: [
                                    { label: 'Admin', value: 'admin' },
                                    { label: 'User', value: 'user' }
                                ]
                            },
                            {
                                type: 'badge',
                                databind: 'status',
                                backgroundColor: (rowData) => rowData.status === 'active' ? '#28a745' : '#dc3545'
                            },
                            {
                                type: 'toggle',
                                databind: 'verified'
                            }
                        ],
                        onHeaderClick: (event) => {
                            const { columnIndex, columnName } = event;
                            addLog(`📊 Header clicked: "${columnName}" (column ${columnIndex})`);
                        }
                    }} />
                </div>

                <pre className="code-block">{`<TableviewControl config={{
    headers: ['Name', 'Email', 'Role', 'Status'],
    data: users,
    controls: [...],
    onHeaderClick: (event) => {
        const { columnIndex, columnName, columnControl } = event;
        console.log('Clicked column:', columnName);
        // Implement sorting logic
        // sortByColumn(columnIndex);
    }
}} />`}</pre>
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
                            <td><code>headers</code></td>
                            <td><code>string[]</code></td>
                            <td><code>[]</code></td>
                            <td>Column header labels</td>
                        </tr>
                        <tr>
                            <td><code>colwidths</code></td>
                            <td><code>string[]</code></td>
                            <td><code>[]</code></td>
                            <td>Column widths (px, %, auto)</td>
                        </tr>
                        <tr>
                            <td><code>data</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Array of data objects</td>
                        </tr>
                        <tr>
                            <td><code>controls</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Control configuration for each column</td>
                        </tr>
                        <tr>
                            <td><code>pagination</code></td>
                            <td><code>object</code></td>
                            <td><code>null</code></td>
                            <td>Pagination config {`{ limit, page, total }`}</td>
                        </tr>
                        <tr>
                            <td><code>onPageChange</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called when page changes (page, limit)</td>
                        </tr>
                        <tr>
                            <td><code>onHeaderClick</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called when header is clicked {`{ columnIndex, columnName, columnControl }`}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default TablePage;
