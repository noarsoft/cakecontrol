import React from 'react';
import { CardControl } from '../../controls';

function CardPage({ addLog }) {
    return (
        <div className="page-content">
            <h1>🃏 Card Control</h1>
            <p className="lead">
                Display content in card containers with headers, footers, images, and actions
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    CardControl provides a flexible container for displaying content in a card format with
                    optional headers, footers, images, and action buttons.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🖼️</div>
                        <h3>Image Support</h3>
                        <p>Optional card image with positioning</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h3>Header/Footer</h3>
                        <p>Customizable header and footer sections</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Flexible Content</h3>
                        <p>Render any content in card body</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔘</div>
                        <h3>Action Buttons</h3>
                        <p>Built-in action button support</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Example</h2>
                <div className="example-demo">
                    <CardControl control={{
                        data: [
                            { id: 1, title: 'Card 1', description: 'This is the first card with some content.' },
                            { id: 2, title: 'Card 2', description: 'This is the second card with different content.' },
                            { id: 3, title: 'Card 3', description: 'This is the third card example.' }
                        ],
                        columns: 3,
                        gap: '20px',
                        cardConfig: {
                            colnumbers: 6,
                            controls: [
                                {
                                    colno: 1,
                                    rowno: 1,
                                    colSpan: 6,
                                    type: 'label',
                                    databind: 'title',
                                    style: { fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }
                                },
                                {
                                    colno: 1,
                                    rowno: 2,
                                    colSpan: 6,
                                    type: 'label',
                                    databind: 'description',
                                    style: { color: '#6b7280' }
                                }
                            ]
                        },
                        onCardClick: (event, data) => addLog(`Card clicked: ${data.title}`)
                    }} />
                </div>

                <pre className="code-block">{`<CardControl control={{
    data: users,
    columns: 3,
    gap: '20px',
    cardConfig: {
        colnumbers: 6,
        controls: [
            { colno: 1, rowno: 1, type: 'label', databind: 'name' },
            { colno: 1, rowno: 2, type: 'textbox', databind: 'email' }
        ]
    },
    onCardClick: (event, data) => console.log('Clicked:', data)
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 User Cards with Images & Actions</h2>
                <p>Display user information in attractive cards with images and interactive buttons:</p>
                
                <div className="example-demo">
                    <CardControl control={{
                        data: [
                            { 
                                id: 1, 
                                name: 'John Doe', 
                                email: 'john@example.com', 
                                avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                                role: 'Admin'
                            },
                            { 
                                id: 2, 
                                name: 'Jane Smith', 
                                email: 'jane@example.com', 
                                avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
                                role: 'User'
                            },
                            { 
                                id: 3, 
                                name: 'Bob Johnson', 
                                email: 'bob@example.com', 
                                avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
                                role: 'User'
                            }
                        ],
                        columns: 3,
                        gap: '20px',
                        cardConfig: {
                            colnumbers: 6,
                            controls: [
                                {
                                    colno: 1,
                                    rowno: 1,
                                    colSpan: 6,
                                    type: 'image',
                                    databind: 'avatar',
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    style: { display: 'block', margin: '0 auto 12px' }
                                },
                                {
                                    colno: 1,
                                    rowno: 2,
                                    colSpan: 6,
                                    type: 'label',
                                    databind: 'name',
                                    style: { fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }
                                },
                                {
                                    colno: 1,
                                    rowno: 3,
                                    colSpan: 6,
                                    type: 'label',
                                    databind: 'email',
                                    style: { color: '#6b7280', fontSize: '14px', textAlign: 'center' }
                                },
                                {
                                    colno: 1,
                                    rowno: 4,
                                    colSpan: 6,
                                    type: 'badge',
                                    databind: 'role',
                                    backgroundColor: (rd) => rd.role === 'Admin' ? '#8b5cf6' : '#3b82f6',
                                    color: 'white',
                                    style: { display: 'block', textAlign: 'center', marginTop: '8px' }
                                },
                                {
                                    colno: 1,
                                    rowno: 5,
                                    colSpan: 6,
                                    type: 'button',
                                    value: 'View Profile',
                                    className: 'btn-primary',
                                    style: { marginTop: '12px', width: '100%' },
                                    onClick: (e, rd) => addLog(`View profile: ${rd.name}`)
                                }
                            ]
                        }
                    }} />
                </div>

                <pre className="code-block">{`<CardControl control={{
    data: users,
    columns: 3,
    cardConfig: {
        colnumbers: 6,
        controls: [
            { colno: 1, rowno: 1, type: 'image', databind: 'avatar' },
            { colno: 1, rowno: 2, type: 'label', databind: 'name' },
            { colno: 1, rowno: 3, type: 'button', value: 'View', onClick: ... }
        ]
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
                            <td><code>data</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Array of data objects for cards</td>
                        </tr>
                        <tr>
                            <td><code>cardConfig</code></td>
                            <td><code>object</code></td>
                            <td><code>{'{}'}</code></td>
                            <td>FormControl configuration for each card</td>
                        </tr>
                        <tr>
                            <td><code>columns</code></td>
                            <td><code>number</code></td>
                            <td><code>3</code></td>
                            <td>Number of columns in grid</td>
                        </tr>
                        <tr>
                            <td><code>gap</code></td>
                            <td><code>string</code></td>
                            <td><code>'20px'</code></td>
                            <td>Gap between cards</td>
                        </tr>
                        <tr>
                            <td><code>cardStyle</code></td>
                            <td><code>object</code></td>
                            <td><code>{'{}'}</code></td>
                            <td>Additional CSS styles for cards</td>
                        </tr>
                        <tr>
                            <td><code>onCardClick</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Callback when card is clicked (event, data, index)</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default CardPage;
