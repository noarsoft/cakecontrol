import React, { useState } from 'react';
import ConfirmModal from '../../controls/ConfirmModal';
import { useTheme } from '../../../ThemeContext';

function ConfirmModalPage({ addLog }) {
    const { theme } = useTheme();
    const [modals, setModals] = useState({
        simple: false,
        dangerous: false,
        custom: false,
        delete: false
    });

    const openModal = (type) => {
        setModals(prev => ({ ...prev, [type]: true }));
        if (addLog) addLog(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} confirm modal opened`);
    };

    const closeModal = (type) => {
        setModals(prev => ({ ...prev, [type]: false }));
    };

    return (
        <div className="page-content">
            <h1>✅ Confirm Modal</h1>
            <p className="lead">
                Simple confirmation dialog for user actions with customizable buttons, labels, and styling
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    ConfirmModal is a lightweight confirmation dialog for obtaining user consent before performing actions.
                    It features two-button layout, customizable labels, variants for different action types, and full dark theme support.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎛️</div>
                        <h3>Custom Labels</h3>
                        <p>Customize button text for your use case</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Variants</h3>
                        <p>Different styles for normal and dangerous actions</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⌨️</div>
                        <h3>Keyboard Support</h3>
                        <p>Close with ESC, backdrop click support</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🌙</div>
                        <h3>Dark Theme</h3>
                        <p>Automatic dark mode support</p>
                    </div>
                </div>
            </section>

            {/* Simple Confirmation */}
            <ConfirmModal
                isOpen={modals.simple}
                title="Confirm Action"
                message="Are you sure you want to proceed with this action?"
                confirmLabel="Yes, Proceed"
                cancelLabel="Cancel"
                confirmVariant="primary"
                isDangerous={false}
                onConfirm={() => {
                    if (addLog) addLog('✅ Action confirmed');
                    closeModal('simple');
                }}
                onCancel={() => closeModal('simple')}
            />

            {/* Dangerous Action */}
            <ConfirmModal
                isOpen={modals.dangerous}
                title="Delete Permanently"
                message="This action cannot be undone. Are you sure you want to delete?"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                confirmVariant="danger"
                isDangerous={true}
                onConfirm={() => {
                    if (addLog) addLog('🗑️ Item deleted permanently');
                    closeModal('dangerous');
                }}
                onCancel={() => closeModal('dangerous')}
            />

            {/* Custom Labels */}
            <ConfirmModal
                isOpen={modals.custom}
                title="Save Changes"
                message="Do you want to save your changes before leaving?"
                confirmLabel="Save"
                cancelLabel="Don't Save"
                confirmVariant="success"
                isDangerous={false}
                onConfirm={() => {
                    if (addLog) addLog('💾 Changes saved');
                    closeModal('custom');
                }}
                onCancel={() => {
                    if (addLog) addLog('⏭️ Changes discarded');
                    closeModal('custom');
                }}
            />

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={modals.delete}
                title="Remove User"
                message="This will permanently remove the user from the system. This action cannot be reversed."
                confirmLabel="Remove"
                cancelLabel="Keep User"
                confirmVariant="danger"
                isDangerous={true}
                onConfirm={() => {
                    if (addLog) addLog('👤 User removed from system');
                    closeModal('delete');
                }}
                onCancel={() => closeModal('delete')}
            />

            <section className="content-section">
                <h2>💡 Examples</h2>
                <p>Different confirmation scenarios:</p>
                <div className="example-demo">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        <button 
                            className="demo-button"
                            onClick={() => openModal('simple')}
                            style={{ backgroundColor: '#3b82f6', color: 'white' }}
                        >
                            Simple Confirm
                        </button>
                        <button 
                            className="demo-button"
                            onClick={() => openModal('custom')}
                            style={{ backgroundColor: '#10b981', color: 'white' }}
                        >
                            Save Changes
                        </button>
                        <button 
                            className="demo-button"
                            onClick={() => openModal('dangerous')}
                            style={{ backgroundColor: '#f59e0b', color: 'white' }}
                        >
                            Dangerous Delete
                        </button>
                        <button 
                            className="demo-button"
                            onClick={() => openModal('delete')}
                            style={{ backgroundColor: '#ef4444', color: 'white' }}
                        >
                            Remove User
                        </button>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📖 Basic Usage</h2>
                <p>Simple confirmation with custom labels:</p>
                <pre className="code-block">{`import ConfirmModal from './ConfirmModal';

function MyComponent() {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = () => {
        // Perform deletion
        console.log('Deleted!');
        setIsOpen(false);
    };

    return (
        <>
            <button onClick={() => setIsOpen(true)}>
                Delete Item
            </button>

            <ConfirmModal
                isOpen={isOpen}
                title="Delete Item"
                message="Are you sure you want to delete this item?"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                confirmVariant="danger"
                isDangerous={true}
                onConfirm={handleDelete}
                onCancel={() => setIsOpen(false)}
            />
        </>
    );
}`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Styling & Variants</h2>
                <p>Different button and header styles for various scenarios:</p>
                <pre className="code-block">{`// Normal confirmation (info icon)
<ConfirmModal
    isDangerous={false}
    confirmVariant="primary"    // Blue button
    // Header: Light blue background
/>

// Dangerous action (warning icon)
<ConfirmModal
    isDangerous={true}
    confirmVariant="danger"     // Red button
    // Header: Light orange background
/>

// Custom variants
const variants = [
    'primary',    // Blue
    'success',    // Green
    'warning',    // Orange
    'danger',     // Red
    'secondary'   // Gray
];`}</pre>
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
                            <td><code>isOpen</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Controls modal visibility</td>
                        </tr>
                        <tr>
                            <td><code>title</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Modal header title</td>
                        </tr>
                        <tr>
                            <td><code>message</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Modal body message text</td>
                        </tr>
                        <tr>
                            <td><code>onConfirm</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Callback when confirm button clicked</td>
                        </tr>
                        <tr>
                            <td><code>onCancel</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Callback when cancel button clicked or modal closed</td>
                        </tr>
                        <tr>
                            <td><code>confirmLabel</code></td>
                            <td><code>string</code></td>
                            <td><code>Confirm</code></td>
                            <td>Text for confirm button</td>
                        </tr>
                        <tr>
                            <td><code>cancelLabel</code></td>
                            <td><code>string</code></td>
                            <td><code>Cancel</code></td>
                            <td>Text for cancel button</td>
                        </tr>
                        <tr>
                            <td><code>confirmVariant</code></td>
                            <td><code>string</code></td>
                            <td><code>danger</code></td>
                            <td>Confirm button style: primary, success, warning, danger, secondary</td>
                        </tr>
                        <tr>
                            <td><code>cancelVariant</code></td>
                            <td><code>string</code></td>
                            <td><code>secondary</code></td>
                            <td>Cancel button style variant</td>
                        </tr>
                        <tr>
                            <td><code>isDangerous</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Shows warning icon and styling for destructive actions</td>
                        </tr>
                        <tr>
                            <td><code>closeOnBackdropClick</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Close modal when backdrop is clicked</td>
                        </tr>
                        <tr>
                            <td><code>closeOnEscapeKey</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Close modal when ESC key is pressed</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="content-section">
                <h2>🌙 Dark Theme</h2>
                <p>ConfirmModal automatically adapts to dark theme with appropriate colors for each type.</p>
                <pre className="code-block">{`/* Dark theme is automatically applied based on 
   the root[data-theme="dark"] selector */

// Normal confirmation: Blue tones
// Dangerous action: Orange/Red tones
// 
// All buttons and text colors adjust automatically`}</pre>
            </section>
        </div>
    );
}

export default ConfirmModalPage;
