// TableviewControl.example.jsx
// Example usage of TableviewControl

import React from 'react';
import TableviewControl from './TableviewControl';
import './TableviewControl.css';

// Sample data
const sampleData = [
    {
        "id": "1",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "src": "https://randomuser.me/api/portraits/men/1.jpg",
        "status": "active",
        "progress": 75,
        "age": 28,
        "verified": true,
        "role": "admin",
        "joinDate": "2024-01-15"
    },
    {
        "id": "2",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "src": "https://randomuser.me/api/portraits/women/2.jpg",
        "status": "inactive",
        "progress": 45,
        "age": 32,
        "verified": false,
        "role": "user",
        "joinDate": "2024-03-20"
    },
    {
        "id": "3",
        "name": "Bob Johnson",
        "email": "bob.j@example.com",
        "src": "https://randomuser.me/api/portraits/men/3.jpg",
        "status": "active",
        "progress": 90,
        "age": 35,
        "verified": true,
        "role": "user",
        "joinDate": "2024-02-10"
    }
];

// Example 1: Basic User Table
const userTableConfig = {
    headers: ["", "Avatar", "ID", "Name", "Email", "Status", "Role", "Verified", "Edit", "Delete"],
    colwidths: ["40px", "60px", "0", "auto", "200px", "100px", "100px", "80px", "80px", "80px"],
    data: sampleData,
    controls: [
        {
            type: "checkbox",
            value: ""
        },
        {
            type: "image",
            databind: "src",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            alt: "Profile"
        },
        {
            type: "label",
            visible: false,
            value: "",
            iskey: 1,
            databind: "id",
        },
        {
            type: "label",
            databind: "name",
        },
        {
            type: "link",
            textBind: "email",
            databind: "email",
            onClick: (rowData) => {
                window.location.href = `mailto:${rowData.email}`;
            }
        },
        {
            type: "badge",
            databind: "status",
            backgroundColor: (rowData) => rowData.status === 'active' ? '#28a745' : '#dc3545'
        },
        {
            type: "select",
            databind: "role",
            options: [
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
                { value: "guest", label: "Guest" }
            ],
            onChange: (e) => console.log('Role changed:', e.target.value)
        },
        {
            type: "toggle",
            databind: "verified",
            onChange: (e) => console.log('Verified:', e.target.checked)
        },
        {
            type: "button",
            value: "Edit",
            onClick: (rowData, rowIndex) => {
                console.log('Edit row:', rowIndex, rowData);
            }
        },
        {
            type: "button",
            value: "Delete",
            className: "btn-danger",
            onClick: (rowData, rowIndex) => {
                if (confirm(`Delete ${rowData.name}?`)) {
                    console.log('Delete row:', rowIndex, rowData);
                }
            }
        }
    ]
};

// Example 2: Editable Fields Table
const editableTableConfig = {
    headers: ["Name", "Age", "Join Date", "Progress"],
    colwidths: ["auto", "100px", "150px", "150px"],
    data: sampleData,
    controls: [
        {
            type: "textbox",
            databind: "name",
            placeholder: "Enter name",
            onChange: (e) => console.log('Name:', e.target.value)
        },
        {
            type: "number",
            databind: "age",
            min: 18,
            max: 100,
            step: 1
        },
        {
            type: "date",
            databind: "joinDate"
        },
        {
            type: "progress",
            databind: "progress",
            showValue: true,
            color: "#28a745"
        }
    ]
};

// Example 3: Custom Render
const customTableConfig = {
    headers: ["User Info", "Actions"],
    colwidths: ["auto", "200px"],
    data: sampleData,
    controls: [
        {
            type: "custom",
            render: (rowData) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                        src={rowData.src} 
                        alt={rowData.name}
                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{rowData.name}</div>
                        <div style={{ fontSize: '12px', color: '#6c757d' }}>{rowData.email}</div>
                    </div>
                </div>
            )
        },
        {
            type: "custom",
            render: (rowData, rowIndex) => (
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => console.log('View', rowData)}>View</button>
                    <button onClick={() => console.log('Edit', rowData)}>Edit</button>
                    <button onClick={() => console.log('Delete', rowData)}>Delete</button>
                </div>
            )
        }
    ]
};

// Demo Component
function TableviewExample() {
    return (
        <div style={{ padding: '20px' }}>
            <h2>TableView Examples</h2>
            
            <section style={{ marginBottom: '40px' }}>
                <h3>Example 1: User Management Table</h3>
                <TableviewControl config={userTableConfig} />
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h3>Example 2: Editable Table</h3>
                <TableviewControl config={editableTableConfig} />
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h3>Example 3: Custom Render</h3>
                <TableviewControl config={customTableConfig} />
            </section>

            <section>
                <h3>Example 4: Empty Table</h3>
                <TableviewControl config={{ 
                    headers: ["Name", "Email", "Status"],
                    data: [], 
                    controls: [] 
                }} />
            </section>
        </div>
    );
}

export default TableviewExample;
export { userTableConfig, editableTableConfig, customTableConfig };
