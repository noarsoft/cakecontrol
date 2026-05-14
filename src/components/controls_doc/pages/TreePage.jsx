import React, { useState } from 'react';
import { TreeControl, FormControl } from '../../controls';

function TreePage({ addLog }) {
    const [selected, setSelected] = useState([]);

    const fileSystem = [
        {
            id: '1',
            label: '📁 src',
            children: [
                {
                    id: '1-1',
                    label: '📁 components',
                    children: [
                        { id: '1-1-1', label: '📄 Header.jsx' },
                        { id: '1-1-2', label: '📄 Footer.jsx' },
                        { id: '1-1-3', label: '📄 Sidebar.jsx' }
                    ]
                },
                {
                    id: '1-2',
                    label: '📁 utils',
                    children: [
                        { id: '1-2-1', label: '📄 helpers.js' },
                        { id: '1-2-2', label: '📄 validators.js' }
                    ]
                },
                { id: '1-3', label: '📄 App.jsx' },
                { id: '1-4', label: '📄 index.js' }
            ]
        },
        {
            id: '2',
            label: '📁 public',
            children: [
                { id: '2-1', label: '📄 index.html' },
                { id: '2-2', label: '🖼️ favicon.ico' }
            ]
        },
        { id: '3', label: '📄 package.json' },
        { id: '4', label: '📄 README.md' }
    ];

    const organizationTree = [
        {
            id: 'ceo',
            name: 'CEO',
            position: 'Chief Executive Officer',
            children: [
                {
                    id: 'cto',
                    name: 'CTO',
                    position: 'Chief Technology Officer',
                    children: [
                        { id: 'dev1', name: 'Dev Team Lead', position: 'Team Lead' },
                        { id: 'dev2', name: 'Frontend Dev', position: 'Developer' },
                        { id: 'dev3', name: 'Backend Dev', position: 'Developer' }
                    ]
                },
                {
                    id: 'cfo',
                    name: 'CFO',
                    position: 'Chief Financial Officer',
                    children: [
                        { id: 'acc1', name: 'Accountant 1', position: 'Senior Accountant' },
                        { id: 'acc2', name: 'Accountant 2', position: 'Junior Accountant' }
                    ]
                }
            ]
        }
    ];

    return (
        <div className="page-content">
            <h1>🌳 Tree Control</h1>
            <p className="lead">
                Display hierarchical data with expand/collapse functionality, checkboxes, and search
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    TreeControl provides a hierarchical tree view perfect for file systems, organization charts,
                    navigation menus, or any nested data structure.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔽</div>
                        <h3>Expand/Collapse</h3>
                        <p>Interactive expand/collapse with icons</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">☑️</div>
                        <h3>Checkboxes</h3>
                        <p>Optional checkboxes with parent-child cascade</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Search</h3>
                        <p>Filter tree nodes by search text</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Custom Icons</h3>
                        <p>Customizable icons for different states</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 File System Example</h2>
                <div className="example-demo">
                    <TreeControl 
                        data={fileSystem}
                        childrenKey="children"
                        labelKey="label"
                        valueKey="id"
                        defaultExpanded={['1', '1-1']}
                        showLine={true}
                        onSelect={(node) => {
                            addLog(`Selected: ${node.label}`);
                        }}
                    />
                </div>

                <pre className="code-block">{`const fileSystem = [
    {
        id: '1',
        label: '📁 src',
        children: [
            { id: '1-1', label: '📄 App.jsx' },
            // ...
        ]
    }
];

<TreeControl 
    data={fileSystem}
    childrenKey="children"
    labelKey="label"
    valueKey="id"
    defaultExpanded={['1']}
    onSelect={(node) => console.log(node)}
/>`}</pre>
            </section>

            <section className="content-section">
                <h2>☑️ Checkable Tree</h2>
                <p>Enable checkboxes with parent-child relationship:</p>
                
                <div className="example-demo">
                    <TreeControl 
                        data={fileSystem}
                        childrenKey="children"
                        labelKey="label"
                        valueKey="id"
                        checkable={true}
                        multiple={true}
                        defaultExpanded={['1']}
                        defaultChecked={['1-3', '1-4']}
                        onCheck={(checkedNodes) => {
                            addLog(`Checked: ${checkedNodes.length} items`);
                        }}
                    />
                </div>

                <pre className="code-block">{`<TreeControl 
    data={data}
    checkable={true}
    multiple={true}
    defaultChecked={['item1', 'item2']}
    onCheck={(checkedNodes) => console.log(checkedNodes)}
/>`}</pre>
            </section>

            <section className="content-section">
                <h2>🏢 Organization Chart with FormControl</h2>
                <p>Use <code>nodeConfig</code> to render custom content with FormControl:</p>
                
                <div className="example-demo">
                    <TreeControl 
                        data={organizationTree}
                        childrenKey="children"
                        labelKey="name"
                        valueKey="id"
                        defaultExpanded={['ceo', 'cto']}
                        showLine={true}
                        nodeConfig={{
                            colnumbers: 2,
                            controls: [
                                {
                                    colno: 1,
                                    rowno: 1,
                                    type: 'label',
                                    databind: 'name',
                                    style: { fontWeight: 'bold', fontSize: '14px' }
                                },
                                {
                                    colno: 1,
                                    rowno: 2,
                                    type: 'label',
                                    databind: 'position',
                                    style: { fontSize: '12px', color: '#6b7280' }
                                }
                            ]
                        }}
                        onSelect={(node) => {
                            addLog(`Selected: ${node.name} (${node.position})`);
                        }}
                    />
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
                            <td>Tree data array</td>
                        </tr>
                        <tr>
                            <td><code>childrenKey</code></td>
                            <td><code>string</code></td>
                            <td><code>'children'</code></td>
                            <td>Property name for children array</td>
                        </tr>
                        <tr>
                            <td><code>labelKey</code></td>
                            <td><code>string</code></td>
                            <td><code>'label'</code></td>
                            <td>Property name for node label</td>
                        </tr>
                        <tr>
                            <td><code>valueKey</code></td>
                            <td><code>string</code></td>
                            <td><code>'value'</code></td>
                            <td>Property name for node unique ID</td>
                        </tr>
                        <tr>
                            <td><code>checkable</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Show checkboxes</td>
                        </tr>
                        <tr>
                            <td><code>multiple</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Allow multiple checkbox selection</td>
                        </tr>
                        <tr>
                            <td><code>defaultExpanded</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Initially expanded node IDs</td>
                        </tr>
                        <tr>
                            <td><code>defaultChecked</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Initially checked node IDs</td>
                        </tr>
                        <tr>
                            <td><code>showLine</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Show connecting lines</td>
                        </tr>
                        <tr>
                            <td><code>searchText</code></td>
                            <td><code>string</code></td>
                            <td><code>''</code></td>
                            <td>Filter nodes by text</td>
                        </tr>
                        <tr>
                            <td><code>nodeConfig</code></td>
                            <td><code>object</code></td>
                            <td><code>null</code></td>
                            <td>FormControl config for custom node rendering</td>
                        </tr>
                        <tr>
                            <td><code>onSelect</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called when node is selected</td>
                        </tr>
                        <tr>
                            <td><code>onCheck</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called when checkboxes change</td>
                        </tr>
                        <tr>
                            <td><code>onExpand</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Called when node expands/collapses</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default TreePage;
