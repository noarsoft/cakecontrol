import React, { useState } from 'react';
import { MenuControl } from '../../controls';

function MenuPage({ addLog }) {
    const [activeMenu, setActiveMenu] = useState('home');
    const [menuColorTone, setMenuColorTone] = useState('default');

    const menuData = [
        {
            icon_src: '',
            menu_name: 'home',
            text: 'Home',
            link: '/',
            submenu: [
                { icon_src: '', menu_name: 'Dashboard', text: 'Dashboard', link: '/dashboard' },
                { icon_src: '', menu_name: 'Overview', text: 'Overview', link: '/overview' }
            ]
        },
        {
            icon_src: '',
            menu_name: 'Products',
            text: 'Products',
            link: '/products',
            submenu: [
                { icon_src: '', menu_name: 'All Products', text: 'All Products', link: '/products/all' },
                { icon_src: '', menu_name: 'Categories', text: 'Categories', link: '/products/categories' },
                { icon_src: '', menu_name: 'Add Product', text: 'Add Product', link: '/products/add' }
            ]
        },
        {
            icon_src: '',
            menu_name: 'Users',
            text: 'Users',
            link: '/users',
            submenu: [
                { icon_src: '', menu_name: 'User List', text: 'User List', link: '/users/list' },
                { icon_src: '', menu_name: 'Roles', text: 'Roles', link: '/users/roles' },
                { icon_src: '', menu_name: 'Permissions', text: 'Permissions', link: '/users/permissions' }
            ]
        },
        {
            icon_src: '',
            menu_name: 'Reports',
            text: 'Reports',
            link: '/reports'
        },
        {
            icon_src: '',
            menu_name: 'Settings',
            text: 'Settings',
            link: '/settings',
            submenu: [
                { icon_src: '', menu_name: 'General', text: 'General', link: '/settings/general' },
                { icon_src: '', menu_name: 'Security', text: 'Security', link: '/settings/security' },
                { icon_src: '', menu_name: 'Notifications', text: 'Notifications', link: '/settings/notifications' }
            ]
        }
    ];

    const handleMenuClick = (item) => {
        setActiveMenu(item.menu_name);
        addLog(`📍 Menu clicked: ${item.menu_name} → ${item.link}`);
    };

    return (
        <div className="page-content">
            <h1>🔗 Menu Control</h1>
            <p className="lead">
                A flexible, hierarchical menu control with support for nested submenus, icons, and responsive design
            </p>

            <section className="content-section">
                <h2>✨ Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Hierarchical Structure</h3>
                        <p>Support for nested submenus at multiple levels</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🖼️</div>
                        <h3>Icon Support</h3>
                        <p>Display icons alongside menu items</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⬅️➡️</div>
                        <h3>Dual Orientation</h3>
                        <p>Vertical and horizontal layout modes</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Responsive Design</h3>
                        <p>Mobile-friendly with adaptive styling</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📋 Props</h2>
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
                            <td>Array</td>
                            <td><code>[]</code></td>
                            <td>Menu items array with icon_src, menu_name, text, link, and optional submenu</td>
                        </tr>
                        <tr>
                            <td><code>orientation</code></td>
                            <td>string</td>
                            <td><code>'vertical'</code></td>
                            <td>Menu layout: 'vertical' or 'horizontal'</td>
                        </tr>
                        <tr>
                            <td><code>onMenuClick</code></td>
                            <td>function</td>
                            <td>-</td>
                            <td>Callback function when menu item is clicked</td>
                        </tr>
                        <tr>
                            <td><code>activeMenu</code></td>
                            <td>string</td>
                            <td>-</td>
                            <td>Currently active menu item name</td>
                        </tr>
                        <tr>
                            <td><code>collapsible</code></td>
                            <td>boolean</td>
                            <td><code>true</code></td>
                            <td>Allow submenus to be collapsible</td>
                        </tr>
                        <tr>
                            <td><code>invisible_menu_name</code></td>
                            <td>Array</td>
                            <td><code>[]</code></td>
                            <td>Array of menu_name values to hide (e.g., ['subsubhome'])</td>
                        </tr>
                        <tr>
                            <td><code>className</code></td>
                            <td>string</td>
                            <td>-</td>
                            <td>Additional CSS classes</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="content-section">
                <h2>📝 Menu Item Structure</h2>
                <table className="props-table">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Type</th>
                            <th>Required</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>menu_name</code></td>
                            <td>string</td>
                            <td>✓</td>
                            <td>Unique identifier for the menu item</td>
                        </tr>
                        <tr>
                            <td><code>text</code></td>
                            <td>string</td>
                            <td>-</td>
                            <td>Display text (falls back to menu_name if not provided)</td>
                        </tr>
                        <tr>
                            <td><code>link</code></td>
                            <td>string</td>
                            <td>✓</td>
                            <td>URL or link path for navigation</td>
                        </tr>
                        <tr>
                            <td><code>icon_src</code></td>
                            <td>string</td>
                            <td>-</td>
                            <td>Image URL for menu icon</td>
                        </tr>
                        <tr>
                            <td><code>submenu</code></td>
                            <td>Array</td>
                            <td>-</td>
                            <td>Array of submenu items with same structure (unlimited nesting)</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="content-section">
                <h2>🎯 Live Demo - Vertical Menu</h2>
                <div className="demo-section">
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <strong>Color Tone:</strong>
                            {[
                                { value: 'default', label: 'Default (Blue)', color: '#0d6efd' },
                                { value: 'green', label: 'Green', color: '#198754' },
                                { value: 'red', label: 'Red', color: '#dc3545' },
                                { value: 'purple', label: 'Purple', color: '#6f42c1' },
                                { value: 'orange', label: 'Orange', color: '#fd7e14' }
                            ].map(tone => (
                                <button
                                    key={tone.value}
                                    onClick={() => setMenuColorTone(tone.value)}
                                    className={`color-tone-btn ${menuColorTone === tone.value ? 'active' : ''}`}
                                    style={{
                                        '--tone-color': tone.color
                                    }}
                                >
                                    {tone.label}
                                </button>
                            ))}
                        </label>
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h3>Vertical Menu</h3>
                            <MenuControl
                                data={menuData}
                                orientation="vertical"
                                activeMenu={activeMenu}
                                onMenuClick={handleMenuClick}
                                collapsible={true}
                                className={`menu-tone-${menuColorTone}`}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3>Menu Structure</h3>
                            <pre className="code-block">{JSON.stringify(menuData, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>🎯 Live Demo - Hidden Menu Items</h2>
                <div className="demo-section">
                    <h3>Menu with invisible_menu_name={['Settings', 'Notifications']}</h3>
                    <MenuControl
                        data={menuData}
                        orientation="vertical"
                        activeMenu={activeMenu}
                        onMenuClick={handleMenuClick}
                        invisible_menu_name={['Settings', 'Notifications']}
                        collapsible={true}
                    />
                </div>
            </section>

            <section className="content-section">
                <h2>🎯 Live Demo - Horizontal Menu</h2>
                <div className="demo-section">
                    <h3>Horizontal Menu</h3>
                    <MenuControl
                        data={menuData}
                        orientation="horizontal"
                        activeMenu={activeMenu}
                        onMenuClick={handleMenuClick}
                        collapsible={true}
                    />
                </div>
            </section>

            <section className="content-section">
                <h2>💡 Usage Examples</h2>

                <h3>Basic Vertical Menu</h3>
                <pre className="code-block">{`import { MenuControl } from './controls';

function Navigation() {
    const menuData = [
        {
            icon_src: '/icons/home.svg',
            menu_name: 'Home',
            link: '/',
            submenu: [
                { menu_name: 'Dashboard', link: '/dashboard' },
                { menu_name: 'Overview', link: '/overview' }
            ]
        },
        {
            icon_src: '/icons/products.svg',
            menu_name: 'Products',
            link: '/products'
        }
    ];

    const [activeMenu, setActiveMenu] = useState('Home');

    return (
        <MenuControl
            data={menuData}
            orientation="vertical"
            activeMenu={activeMenu}
            onMenuClick={(item) => setActiveMenu(item.menu_name)}
            collapsible={true}
        />
    );
}`}
                </pre>

                <h3>Horizontal Menu with Icons</h3>
                <pre className="code-block">{`const menuData = [
    {
        icon_src: '/icons/home.svg',
        menu_name: 'Home',
        link: '/'
    },
    {
        icon_src: '/icons/products.svg',
        menu_name: 'Products',
        link: '/products',
        submenu: [
            { menu_name: 'All Products', link: '/products/all' },
            { menu_name: 'Categories', link: '/products/categories' }
        ]
    }
];

<MenuControl
    data={menuData}
    orientation="horizontal"
    onMenuClick={(item) => navigate(item.link)}
/>`}
                </pre>

                <h3>Non-Collapsible Menu</h3>
                <pre className="code-block">{`<MenuControl
    data={menuData}
    orientation="vertical"
    collapsible={false}
    className="sidebar-menu"
/>`}
                </pre>

                <h3>Menu with Hidden Items</h3>
                <pre className="code-block">{`// Hide specific menu items using invisible_menu_name
<MenuControl
    data={menuData}
    orientation="vertical"
    invisible_menu_name={['subsubhome', 'Permissions']}
    onMenuClick={(item) => navigate(item.link)}
/>`}
                </pre>

                <h3>Menu with Custom Display Text</h3>
                <pre className="code-block">{`const menuData = [
    {
        menu_name: 'home',
        text: 'Home',  // Display text different from menu_name
        link: '/',
        submenu: [
            { 
                menu_name: 'dashboard', 
                text: 'Dashboard Panel',  // Custom display text
                link: '/dashboard' 
            }
        ]
    }
];

<MenuControl
    data={menuData}
    onMenuClick={(item) => console.log(item.menu_name)}
/>`}
                </pre>
            </section>

            <section className="content-section">
                <h2>🎨 Styling & Customization</h2>
                <pre className="code-block">{`/* Custom styling for menu */
.menu-control {
    --menu-color: #374151;
    --menu-hover-bg: #f3f4f6;
    --menu-active-color: #0d6efd;
    --menu-active-bg: #f0f4ff;
}

/* Apply custom class */
<MenuControl
    data={menuData}
    className="custom-menu"
/>

/* In CSS */
.custom-menu .menu-link {
    font-weight: 500;
    padding: 14px 18px;
}

.custom-menu .menu-item.active > .menu-link {
    background: linear-gradient(90deg, #0d6efd, #0b5ed7);
    color: white;
}`}
                </pre>
            </section>

            <section className="content-section">
                <h2>📌 Key Features</h2>
                <ul className="feature-list">
                    <li><strong>Unlimited Nesting:</strong> Support for deeply nested submenus at any level</li>
                    <li><strong>Icon Support:</strong> Display images/icons for each menu item</li>
                    <li><strong>Custom Display Text:</strong> Use 'text' field for display while 'menu_name' is the identifier</li>
                    <li><strong>Flexible Navigation:</strong> Works with custom routing or standard links</li>
                    <li><strong>Hidden Menu Items:</strong> Hide specific menu items using invisible_menu_name prop</li>
                    <li><strong>Responsive:</strong> Adapts to mobile and desktop screens</li>
                    <li><strong>Keyboard Navigation:</strong> Accessible menu interactions</li>
                    <li><strong>Active State:</strong> Highlight current active menu item</li>
                    <li><strong>Collapsible Submenus:</strong> Toggle submenu visibility</li>
                    <li><strong>Smooth Animations:</strong> Slide and rotate animations for submenus</li>
                    <li><strong>Two Orientations:</strong> Vertical sidebar or horizontal navbar</li>
                    <li><strong>Dark Theme Support:</strong> Built-in dark mode styling</li>
                </ul>
            </section>

            <style jsx>{`
                .demo-section {
                    padding: 20px;
                    background: #f9fafb;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                    margin: 20px 0;
                }

                /* Dark theme for demo-section */
                :root[data-theme="dark"] .demo-section {
                    background: #1f2937;
                    border-color: #374151;
                }

                .feature-list {
                    list-style: none;
                    padding: 0;
                }

                .feature-list li {
                    padding: 12px 0;
                    border-bottom: 1px solid #e5e7eb;
                }

                :root[data-theme="dark"] .feature-list li {
                    border-bottom-color: #374151;
                }

                .feature-list li:last-child {
                    border-bottom: none;
                }

                .feature-list strong {
                    color: #0d6efd;
                }

                /* Menu Color Tone Styles */
                .menu-tone-default .menu-item.active > .menu-link {
                    color: #0d6efd;
                    background-color: #f0f4ff;
                    border-left-color: #0d6efd;
                }

                .menu-tone-default .submenu-arrow.expanded {
                    color: #0d6efd;
                }

                .menu-tone-green .menu-item.active > .menu-link {
                    color: #198754;
                    background-color: #f0fdf4;
                    border-left-color: #198754;
                }

                .menu-tone-green .submenu-arrow.expanded {
                    color: #198754;
                }

                .menu-tone-red .menu-item.active > .menu-link {
                    color: #dc3545;
                    background-color: #fef2f2;
                    border-left-color: #dc3545;
                }

                .menu-tone-red .submenu-arrow.expanded {
                    color: #dc3545;
                }

                .menu-tone-purple .menu-item.active > .menu-link {
                    color: #6f42c1;
                    background-color: #faf5ff;
                    border-left-color: #6f42c1;
                }

                .menu-tone-purple .submenu-arrow.expanded {
                    color: #6f42c1;
                }

                .menu-tone-orange .menu-item.active > .menu-link {
                    color: #fd7e14;
                    background-color: #fff7ed;
                    border-left-color: #fd7e14;
                }

                .menu-tone-orange .submenu-arrow.expanded {
                    color: #fd7e14;
                }

                /* Dark theme color tones - keep colors but adjust backgrounds */
                :root[data-theme="dark"] .menu-tone-default .menu-item.active > .menu-link {
                    background-color: rgba(13, 110, 253, 0.15);
                }

                :root[data-theme="dark"] .menu-tone-green .menu-item.active > .menu-link {
                    background-color: rgba(25, 135, 84, 0.15);
                }

                :root[data-theme="dark"] .menu-tone-red .menu-item.active > .menu-link {
                    background-color: rgba(220, 53, 69, 0.15);
                }

                :root[data-theme="dark"] .menu-tone-purple .menu-item.active > .menu-link {
                    background-color: rgba(111, 66, 193, 0.15);
                }

                :root[data-theme="dark"] .menu-tone-orange .menu-item.active > .menu-link {
                    background-color: rgba(253, 126, 20, 0.15);
                }

                /* Color Tone Button Styles */
                .color-tone-btn {
                    padding: 6px 12px;
                    border: 2px solid #d1d5db;
                    background-color: transparent;
                    color: currentColor;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: normal;
                    transition: all 0.2s ease;
                }

                .color-tone-btn:hover {
                    border-color: var(--tone-color);
                    opacity: 0.8;
                }

                .color-tone-btn.active {
                    background-color: var(--tone-color);
                    border-color: var(--tone-color);
                    color: white;
                    font-weight: bold;
                }

                /* Dark theme for color tone buttons */
                :root[data-theme="dark"] .color-tone-btn {
                    border-color: #4b5563;
                    color: #d1d5db;
                }

                :root[data-theme="dark"] .color-tone-btn:hover {
                    border-color: var(--tone-color);
                    background-color: rgba(209, 213, 219, 0.1);
                }

                :root[data-theme="dark"] .color-tone-btn.active {
                    background-color: var(--tone-color);
                    border-color: var(--tone-color);
                    color: white;
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
}

export default MenuPage;
