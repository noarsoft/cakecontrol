import React, { useState } from 'react';
import AlertModal from '../../controls/AlertModal';
import { useTheme } from '../../../ThemeContext';

function AlertModalPage({ addLog }) {
    const { theme } = useTheme();
    const [modals, setModals] = useState({
        info: false,
        success: false,
        warning: false,
        error: false,
        custom: false,
        confirm: false
    });

    const openModal = (type) => {
        setModals(prev => ({ ...prev, [type]: true }));
        if (addLog) addLog(`📭 ${type.charAt(0).toUpperCase() + type.slice(1)} modal opened`);
    };

    const closeModal = (type) => {
        setModals(prev => ({ ...prev, [type]: false }));
    };

    return (
        <div className="page-content">
            <h1>📭 Alert Modal</h1>
            <p className="lead">
                Flexible modal dialog component for displaying alerts, confirmations, and user notifications
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    AlertModal is a reusable modal component for displaying important messages, alerts, and confirmations.
                    It supports multiple types (info, success, warning, error), custom buttons, keyboard shortcuts, and full dark theme support.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>4 Alert Types</h3>
                        <p>Info, Success, Warning, and Error variants</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎛️</div>
                        <h3>Custom Buttons</h3>
                        <p>Define any number of action buttons</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⌨️</div>
                        <h3>Keyboard Support</h3>
                        <p>Close with ESC key, backdrop click support</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🌙</div>
                        <h3>Dark Theme</h3>
                        <p>Automatic dark mode support</p>
                    </div>
                </div>
            </section>

            {/* Info Modal */}
            <AlertModal
                isOpen={modals.info}
                type="info"
                title="Information"
                message="This is an informational message. You can use this modal to display important information to users."
                onClose={() => closeModal('info')}
                closeOnBackdropClick
                closeOnEscapeKey
            />

            {/* Success Modal */}
            <AlertModal
                isOpen={modals.success}
                type="success"
                title="Success!"
                message="Your action completed successfully. The operation went smoothly without any issues."
                onClose={() => closeModal('success')}
            />

            {/* Warning Modal */}
            <AlertModal
                isOpen={modals.warning}
                type="warning"
                title="Warning"
                message="Please be careful before proceeding. This action might have important consequences."
                onClose={() => closeModal('warning')}
            />

            {/* Error Modal */}
            <AlertModal
                isOpen={modals.error}
                type="error"
                title="Error Occurred"
                message="Something went wrong. Please try again or contact support if the problem persists."
                onClose={() => closeModal('error')}
            />

            {/* Custom Buttons Modal */}
            <AlertModal
                isOpen={modals.custom}
                type="warning"
                title="Custom Actions"
                message="This modal has custom button configurations with different actions."
                buttons={[
                    {
                        label: 'Cancel',
                        variant: 'secondary',
                        onClick: () => {
                            if (addLog) addLog('❌ Cancel button clicked');
                            closeModal('custom');
                        }
                    },
                    {
                        label: 'Delete',
                        variant: 'danger',
                        onClick: () => {
                            if (addLog) addLog('🗑️ Delete button clicked');
                            closeModal('custom');
                        }
                    }
                ]}
                onClose={() => closeModal('custom')}
            />

            {/* Confirm Modal */}
            <AlertModal
                isOpen={modals.confirm}
                type="success"
                title="Confirm Action"
                message="Are you sure you want to proceed with this action?"
                buttons={[
                    {
                        label: 'No',
                        variant: 'secondary',
                        onClick: () => {
                            if (addLog) addLog('👎 No - action cancelled');
                            closeModal('confirm');
                        }
                    },
                    {
                        label: 'Yes',
                        variant: 'success',
                        onClick: () => {
                            if (addLog) addLog('👍 Yes - action confirmed');
                            closeModal('confirm');
                        }
                    }
                ]}
                onClose={() => closeModal('confirm')}
            />

            <section className="content-section">
                <h2>💡 Alert Types</h2>
                <p>Four distinct modal types for different message purposes:</p>
                <div className="example-demo">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        <button 
                            className="demo-button"
                            onClick={() => openModal('info')}
                            style={{ backgroundColor: '#3b82f6', color: 'white' }}
                        >
                            ℹ️ Info Modal
                        </button>
                        <button 
                            className="demo-button"
                            onClick={() => openModal('success')}
                            style={{ backgroundColor: '#10b981', color: 'white' }}
                        >
                            ✅ Success Modal
                        </button>
                        <button 
                            className="demo-button"
                            onClick={() => openModal('warning')}
                            style={{ backgroundColor: '#f59e0b', color: 'white' }}
                        >
                            ⚠️ Warning Modal
                        </button>
                        <button 
                            className="demo-button"
                            onClick={() => openModal('error')}
                            style={{ backgroundColor: '#ef4444', color: 'white' }}
                        >
                            ❌ Error Modal
                        </button>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>🎛️ Custom Buttons & Actions</h2>
                <p>Define custom buttons with different actions and variants:</p>
                <div className="example-demo">
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button 
                            className="demo-button"
                            onClick={() => openModal('custom')}
                            style={{ backgroundColor: '#f59e0b', color: 'white' }}
                        >
                            Delete Confirmation
                        </button>
                        <button 
                            className="demo-button"
                            onClick={() => openModal('confirm')}
                            style={{ backgroundColor: '#10b981', color: 'white' }}
                        >
                            Action Confirmation
                        </button>
                    </div>
                </div>
                <pre className="code-block">{`<AlertModal
    isOpen={isOpen}
    type="warning"
    title="Confirm Delete"
    message="Are you sure?"
    buttons={[
        {
            label: 'Cancel',
            variant: 'secondary',
            onClick: () => handleCancel()
        },
        {
            label: 'Delete',
            variant: 'danger',
            onClick: () => handleDelete()
        }
    ]}
    onClose={() => setIsOpen(false)}
/>`}</pre>
            </section>

            <section className="content-section">
                <h2>📖 Basic Usage</h2>
                <p>Simple info alert with default OK button:</p>
                <pre className="code-block">{`import AlertModal from './AlertModal';

function MyComponent() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsOpen(true)}>
                Show Alert
            </button>

            <AlertModal
                isOpen={isOpen}
                type="info"
                title="Information"
                message="This is an informational message."
                onClose={() => setIsOpen(false)}
                closeOnBackdropClick={true}
                closeOnEscapeKey={true}
            />
        </>
    );
}`}</pre>
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
                            <td><code>type</code></td>
                            <td><code>string</code></td>
                            <td><code>info</code></td>
                            <td>Modal type: <code>info</code>, <code>success</code>, <code>warning</code>, <code>error</code></td>
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
                            <td><code>buttons</code></td>
                            <td><code>array</code></td>
                            <td><code>-</code></td>
                            <td>Array of button objects with label, variant, onClick</td>
                        </tr>
                        <tr>
                            <td><code>onClose</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Callback when modal closes</td>
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
                <h2>🎨 Button Variants</h2>
                <p>Available button style variants:</p>
                <pre className="code-block">{`// Button variants available
const variants = [
    'primary',    // Blue (default)
    'success',    // Green
    'warning',    // Orange
    'danger',     // Red
    'secondary'   // Gray
];

// Example with different variants
buttons={[
    { label: 'Cancel', variant: 'secondary' },
    { label: 'Delete', variant: 'danger' },
    { label: 'Confirm', variant: 'success' }
]}`}</pre>
            </section>

            <section className="content-section">
                <h2>🌙 Dark Theme</h2>
                <p>AlertModal automatically adapts to dark theme with appropriate colors for each type.</p>
                <pre className="code-block">{`/* Dark theme is automatically applied based on 
   the root[data-theme="dark"] selector */

// Type-specific colors in dark mode:
// - info: Blue tones
// - success: Green tones  
// - warning: Orange tones
// - error: Red tones
// 
// All buttons and text colors adjust automatically`}</pre>
            </section>
        </div>
    );
}

export default AlertModalPage;