import React, { useState } from 'react';
import GridviewControl from '../../controls/GridviewControl';

function GridPage({ addLog }) {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(9);

    const users = Array.from({ length: 51 }, (_, i) => ({
        id: String(i + 1),
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${(i % 70) + 1}.jpg`,
        age: 20 + (i % 40),
        role: i % 5 === 0 ? "admin" : "user",
        status: i % 3 === 0 ? "inactive" : "active",
        verified: i % 2 === 0,
        bio: `This is a bio for user ${i + 1}. Lorem ipsum dolor sit amet.`,
        joinDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`
    }));

    return (
        <div className="page-content">
            <h1>▦ Grid Control</h1>
            <p className="lead">
                Display data in responsive grid cards with automatic layout and pagination
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    GridviewControl displays data as a grid of cards, perfect for visual data like products, users, or media.
                    Automatically adjusts columns based on screen size for optimal viewing.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Fully Responsive</h3>
                        <p>Auto-adjusts columns: Desktop (3), Tablet (2), Mobile (1)</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>4 Card Styles</h3>
                        <p>Default, Bordered, Elevated, Compact designs</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Data Binding</h3>
                        <p>Each field binds to row data automatically</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📄</div>
                        <h3>Pagination</h3>
                        <p>Built-in pagination with page size selector</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">♿</div>
                        <h3>SEO & A11y</h3>
                        <p>Schema.org markup and ARIA labels</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🖱️</div>
                        <h3>Clickable Cards</h3>
                        <p>Optional card click handler with keyboard support</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Example - Default Style</h2>
                <div className="example-demo">
                    <GridviewControl config={{
                        data: users.slice(0, 6),
                        controls: [
                            {
                                label: 'Avatar',
                                type: 'custom',
                                render: (rowData) => (
                                    <img 
                                        src={rowData.avatar} 
                                        alt={rowData.name}
                                        style={{ 
                                            width: '80px', 
                                            height: '80px', 
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            margin: '0 auto',
                                            display: 'block'
                                        }}
                                    />
                                )
                            },
                            {
                                label: 'Name',
                                type: 'label',
                                databind: 'name'
                            },
                            {
                                label: 'Email',
                                type: 'label',
                                databind: 'email'
                            },
                            {
                                label: 'Role',
                                type: 'badge',
                                databind: 'role',
                                backgroundColor: (rd) => rd.role === 'admin' ? '#3b82f6' : '#6b7280',
                                color: 'white'
                            },
                            {
                                type: 'button',
                                value: 'View Profile',
                                className: 'btn-primary btn-sm',
                                onClick: (e, rowData) => addLog(`View profile: ${rowData.name}`)
                            },
                            {
                                type: 'button',
                                value: 'Edit',
                                className: 'btn-outline btn-sm',
                                onClick: (e, rowData) => addLog(`Edit: ${rowData.name}`)
                            }
                        ],
                        columns: 3,
                        tabletColumns: 2,
                        mobileColumns: 1,
                        cardStyle: 'default',
                        showHeader: true,
                        caption: 'User Directory',
                        ariaLabel: 'User grid'
                    }} />
                </div>

                <pre className="code-block">{`<GridviewControl config={{
    data: users,
    controls: [
        { label: 'Name', type: 'label', databind: 'name' },
        { label: 'Email', type: 'label', databind: 'email' },
        { 
            label: 'Role', 
            type: 'badge', 
            databind: 'role',
            backgroundColor: (rd) => rd.role === 'admin' ? '#3b82f6' : '#6b7280'
        },
        { 
            type: 'button', 
            value: 'View', 
            onClick: (e, rd) => console.log(rd) 
        }
    ],
    columns: 3,        // Desktop
    tabletColumns: 2,  // Tablet
    mobileColumns: 1,  // Mobile
    cardStyle: 'default',
    showHeader: true
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Card Style: Bordered</h2>
                <div className="example-demo">
                    <GridviewControl config={{
                        data: users.slice(6, 12),
                        controls: [
                            {
                                label: 'Name',
                                type: 'custom',
                                render: (rowData) => (
                                    <div style={{ textAlign: 'center' }}>
                                        <img 
                                            src={rowData.avatar} 
                                            alt={rowData.name}
                                            style={{ 
                                                width: '60px', 
                                                height: '60px', 
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                                marginBottom: '8px'
                                            }}
                                        />
                                        <div style={{ fontWeight: 'bold' }}>{rowData.name}</div>
                                    </div>
                                )
                            },
                            {
                                label: 'Email',
                                type: 'label',
                                databind: 'email'
                            },
                            {
                                label: 'Age',
                                type: 'label',
                                databind: 'age'
                            },
                            {
                                type: 'button',
                                value: 'Contact',
                                className: 'btn-primary btn-sm',
                                onClick: (e, rowData) => addLog(`Contact: ${rowData.email}`)
                            }
                        ],
                        columns: 3,
                        cardStyle: 'bordered',
                        showHeader: true
                    }} />
                </div>
            </section>

            <section className="content-section">
                <h2>💎 Card Style: Elevated</h2>
                <div className="example-demo">
                    <GridviewControl config={{
                        data: users.slice(12, 18),
                        controls: [
                            {
                                label: 'User',
                                type: 'custom',
                                render: (rowData) => (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img 
                                            src={rowData.avatar} 
                                            alt={rowData.name}
                                            style={{ 
                                                width: '50px', 
                                                height: '50px', 
                                                borderRadius: '8px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{rowData.name}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{rowData.email}</div>
                                        </div>
                                    </div>
                                )
                            },
                            {
                                label: 'Status',
                                type: 'badge',
                                databind: 'status',
                                backgroundColor: (rd) => rd.status === 'active' ? '#10b981' : '#ef4444',
                                color: 'white'
                            },
                            {
                                label: 'Verified',
                                type: 'toggle',
                                databind: 'verified',
                                onChange: (e, rowData) => {
                                    addLog(`${rowData.name} verified: ${e.target.checked}`);
                                }
                            }
                        ],
                        columns: 2,
                        cardStyle: 'elevated',
                        showHeader: true,
                        gap: '24px'
                    }} />
                </div>
            </section>

            <section className="content-section">
                <h2>📦 Card Style: Compact</h2>
                <div className="example-demo">
                    <GridviewControl config={{
                        data: users.slice(18, 27),
                        controls: [
                            {
                                label: 'Name',
                                type: 'label',
                                databind: 'name'
                            },
                            {
                                label: 'Email',
                                type: 'label',
                                databind: 'email'
                            },
                            {
                                label: 'Role',
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
                                type: 'button',
                                value: 'View',
                                className: 'btn-sm',
                                onClick: (e, rowData) => addLog(`View: ${rowData.name}`)
                            }
                        ],
                        columns: 3,
                        cardStyle: 'compact',
                        showHeader: true
                    }} />
                </div>
            </section>

            <section className="content-section">
                <h2>📄 With Pagination & Clickable Cards</h2>
                <p style={{ fontSize: '14px', color: '#666' }}>
                    Total users: {users.length} | Limit: 10 | Expected pages: {Math.ceil(users.length / 10)} | Current page: {page}
                </p>
                <div className="example-demo">
                    <GridviewControl config={{
                        data: users,
                        controls: [
                            {
                                label: 'Avatar',
                                type: 'custom',
                                render: (rowData) => (
                                    <img 
                                        src={rowData.avatar} 
                                        alt={rowData.name}
                                        style={{ 
                                            width: 'calc(100% + 40px)',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderRadius: '8px 8px 0 0',
                                            margin: '-20px -20px 12px -20px'
                                        }}
                                    />
                                )
                            },
                            {
                                label: 'Name',
                                type: 'custom',
                                render: (rowData) => (
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{rowData.name}</div>
                                )
                            },
                            {
                                label: 'Email',
                                type: 'label',
                                databind: 'email'
                            },
                            {
                                label: 'Bio',
                                type: 'label',
                                databind: 'bio'
                            },
                            {
                                label: 'Role',
                                type: 'badge',
                                databind: 'role',
                                backgroundColor: (rd) => rd.role === 'admin' ? '#8b5cf6' : '#3b82f6',
                                color: 'white'
                            },
                            {
                                type: 'button',
                                value: 'View Details',
                                className: 'btn-primary btn-sm',
                                onClick: (e, rowData) => {
                                    e.stopPropagation(); // Prevent card click
                                    addLog(`Button: View details for ${rowData.name}`);
                                }
                            }
                        ],
                        columns: 3,
                        tabletColumns: 2,
                        mobileColumns: 1,
                        cardStyle: 'elevated',
                        showHeader: false, // Hide field labels for cleaner look
                        gap: '20px',
                        pagination: {
                            page: page,
                            limit: 10,
                            total: users.length
                        },
                        onPageChange: (newPage) => {
                            setPage(newPage);
                            addLog(`Page changed to ${newPage}`);
                        },
                        onLimitChange: (newLimit) => {
                            setLimit(newLimit);
                            setPage(1);
                            addLog(`Limit changed to ${newLimit}`);
                        },
                        onCardClick: (rowData, index) => {
                            addLog(`Card clicked: ${rowData.name} (index: ${index})`);
                        },
                        caption: 'User Cards with Pagination',
                        id: 'user-grid',
                        schemaType: 'ItemList'
                    }} />
                </div>

                <pre className="code-block">{`<GridviewControl config={{
    data: users,
    controls: [...],
    
    // Pagination
    pagination: {
        page: page,
        limit: limit,
        total: users.length,
        onLimitChange: (newLimit) => setLimit(newLimit)
    },
    onPageChange: (newPage) => setPage(newPage),
    
    // Clickable cards
    onCardClick: (rowData, index) => {
        console.log('Card clicked:', rowData);
    },
    
    // SEO
    caption: 'User Cards',
    id: 'user-grid',
    schemaType: 'ItemList'
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
                            <td><code>data</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Array of data objects to display</td>
                        </tr>
                        <tr>
                            <td><code>controls</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Field configurations with labels and types</td>
                        </tr>
                        <tr>
                            <td><code>columns</code></td>
                            <td><code>number</code></td>
                            <td><code>3</code></td>
                            <td>Number of columns on desktop</td>
                        </tr>
                        <tr>
                            <td><code>tabletColumns</code></td>
                            <td><code>number</code></td>
                            <td><code>2</code></td>
                            <td>Number of columns on tablet (768-1024px)</td>
                        </tr>
                        <tr>
                            <td><code>mobileColumns</code></td>
                            <td><code>number</code></td>
                            <td><code>1</code></td>
                            <td>Number of columns on mobile (&lt;768px)</td>
                        </tr>
                        <tr>
                            <td><code>cardStyle</code></td>
                            <td><code>string</code></td>
                            <td><code>'default'</code></td>
                            <td>'default', 'bordered', 'elevated', 'compact'</td>
                        </tr>
                        <tr>
                            <td><code>showHeader</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Show field labels in cards</td>
                        </tr>
                        <tr>
                            <td><code>gap</code></td>
                            <td><code>string</code></td>
                            <td><code>'20px'</code></td>
                            <td>Gap between cards</td>
                        </tr>
                        <tr>
                            <td><code>pagination</code></td>
                            <td><code>object</code></td>
                            <td><code>null</code></td>
                            <td>Pagination config {`{ page, limit, total, onLimitChange }`}</td>
                        </tr>
                        <tr>
                            <td><code>onPageChange</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called when page changes (newPage)</td>
                        </tr>
                        <tr>
                            <td><code>onCardClick</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called when card is clicked (rowData, index)</td>
                        </tr>
                        <tr>
                            <td><code>caption</code></td>
                            <td><code>string</code></td>
                            <td><code>''</code></td>
                            <td>Grid caption for SEO</td>
                        </tr>
                        <tr>
                            <td><code>ariaLabel</code></td>
                            <td><code>string</code></td>
                            <td><code>''</code></td>
                            <td>ARIA label for accessibility</td>
                        </tr>
                        <tr>
                            <td><code>schemaType</code></td>
                            <td><code>string</code></td>
                            <td><code>'ItemList'</code></td>
                            <td>Schema.org type (ItemList, etc.)</td>
                        </tr>
                        <tr>
                            <td><code>id</code></td>
                            <td><code>string</code></td>
                            <td><code>''</code></td>
                            <td>Unique grid ID</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="content-section">
                <h2>💡 Tips & Best Practices</h2>
                <div className="note-box">
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li><strong>Responsive:</strong> Grid automatically adjusts columns based on screen size</li>
                        <li><strong>Card Styles:</strong> Use 'elevated' for prominent content, 'compact' for lists</li>
                        <li><strong>Field Labels:</strong> Set <code>showHeader: false</code> for image-heavy cards</li>
                        <li><strong>Buttons:</strong> Automatically grouped at bottom of each card</li>
                        <li><strong>Clickable Cards:</strong> Use <code>onCardClick</code> for navigation, buttons for actions</li>
                        <li><strong>SEO:</strong> Always set <code>caption</code> and <code>schemaType</code> for better indexing</li>
                        <li><strong>Performance:</strong> Use pagination for large datasets (&gt;50 items)</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default GridPage;
