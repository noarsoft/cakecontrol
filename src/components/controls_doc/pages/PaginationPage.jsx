import React from 'react';
import { PaginationControl, TableviewControl } from '../../controls';

function PaginationPage({ addLog }) {
    const users = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: 20 + (i % 40)
    }));

    return (
        <div className="page-content">
            <h1>📄 Pagination Control</h1>
            <p className="lead">
                Navigate through pages of data with customizable page sizes and navigation controls
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    PaginationControl provides page navigation controls that work seamlessly with
                    TableviewControl or can be used independently with any paginated data.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📄</div>
                        <h3>Page Navigation</h3>
                        <p>First, Previous, Next, Last controls</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔢</div>
                        <h3>Page Size</h3>
                        <p>Customizable items per page</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Info Display</h3>
                        <p>Shows current range and total items</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔔</div>
                        <h3>Events</h3>
                        <p>onChange callback for page changes</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Pagination</h2>
                <div className="example-demo">
                    <PaginationControl control={{
                        total: 100,
                        limit: 10,
                        page: 1,
                        onChange: (page, limit) => {
                            addLog(`Page changed to: ${page}, Limit: ${limit}`);
                        }
                    }} />
                </div>

                <pre className="code-block">{`<PaginationControl control={{
    total: 100,      // Total number of items
    limit: 10,       // Items per page
    page: 1,         // Current page (1-based)
    onChange: (page, limit) => {
        console.log('Page:', page, 'Limit:', limit);
    }
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>📊 With Table</h2>
                <p>Pagination is built into TableviewControl:</p>
                
                <div className="example-demo">
                    <TableviewControl config={{
                        headers: ['ID', 'Name', 'Email', 'Age'],
                        colwidths: ['60px', '150px', 'auto', '80px'],
                        data: users,
                        pagination: {
                            limit: 10,
                            page: 1,
                            total: users.length
                        },
                        controls: [
                            { type: 'label', databind: 'id' },
                            { type: 'label', databind: 'name' },
                            { type: 'label', databind: 'email' },
                            { type: 'label', databind: 'age' }
                        ],
                        onPageChange: (page, limit) => {
                            addLog(`Table page: ${page}, showing ${limit} items`);
                        }
                    }} />
                </div>

                <pre className="code-block">{`<TableviewControl config={{
    data: users,
    pagination: {
        limit: 10,
        page: 1,
        total: users.length
    },
    onPageChange: (page, limit) => {
        // Handle page change - fetch new data
        console.log('Page:', page);
    }
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>📊 Different Page Sizes</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>5 items per page</p>
                            <PaginationControl control={{
                                total: 100,
                                limit: 5,
                                page: 1,
                                onChange: (page, limit) => addLog(`5 per page - Page: ${page}`)
                            }} />
                        </div>

                        <div>
                            <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>25 items per page</p>
                            <PaginationControl control={{
                                total: 100,
                                limit: 25,
                                page: 1,
                                onChange: (page, limit) => addLog(`25 per page - Page: ${page}`)
                            }} />
                        </div>

                        <div>
                            <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>50 items per page</p>
                            <PaginationControl control={{
                                total: 100,
                                limit: 50,
                                page: 1,
                                onChange: (page, limit) => addLog(`50 per page - Page: ${page}`)
                            }} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>💡 Usage Tips</h2>
                <div className="note-box">
                    <strong>📌 Best Practices:</strong>
                    <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                        <li>Use pagination for datasets with more than 20-30 items</li>
                        <li>Default page size of 10-25 items works well for most cases</li>
                        <li>Allow users to change page size for flexibility</li>
                        <li>Show total count to give users context</li>
                        <li>Remember page state when navigating away and back</li>
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
                            <td><code>total</code></td>
                            <td><code>number</code></td>
                            <td><code>0</code></td>
                            <td>Total number of items</td>
                        </tr>
                        <tr>
                            <td><code>limit</code></td>
                            <td><code>number</code></td>
                            <td><code>10</code></td>
                            <td>Items per page</td>
                        </tr>
                        <tr>
                            <td><code>page</code></td>
                            <td><code>number</code></td>
                            <td><code>1</code></td>
                            <td>Current page (1-based index)</td>
                        </tr>
                        <tr>
                            <td><code>onChange</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called with (page, limit) when page changes</td>
                        </tr>
                        <tr>
                            <td><code>showInfo</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Show "Showing X-Y of Z" text</td>
                        </tr>
                        <tr>
                            <td><code>showPageSize</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Show page size selector</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default PaginationPage;
