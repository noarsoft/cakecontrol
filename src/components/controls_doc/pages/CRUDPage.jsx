import React, { useState } from 'react';
import { CRUDControl } from '../../controls';

function CRUDPage({ addLog }) {
    const [users, setUsers] = useState([
        { id: '1', name: 'สมชาย ใจดี', email: 'somchai@example.com', role: 'admin', status: 'active', age: 28 },
        { id: '2', name: 'สมหญิง สวยงาม', email: 'somying@example.com', role: 'user', status: 'active', age: 25 },
        { id: '3', name: 'ประยุทธ์ ทำงาน', email: 'prayut@example.com', role: 'user', status: 'inactive', age: 35 },
        { id: '4', name: 'วิชัย รักเรียน', email: 'wichai@example.com', role: 'editor', status: 'active', age: 30 },
        { id: '5', name: 'นารี มีสุข', email: 'naree@example.com', role: 'admin', status: 'active', age: 27 },
        { id: '6', name: 'กานดา ใจดี', email: 'kanda@example.com', role: 'user', status: 'inactive', age: 22 },
        { id: '7', name: 'ธนพล สุขใจ', email: 'thanapol@example.com', role: 'editor', status: 'active', age: 33 },
        { id: '8', name: 'ปรียา งามตา', email: 'preeya@example.com', role: 'user', status: 'active', age: 29 },
        { id: '9', name: 'อนุชา เก่งกาจ', email: 'anucha@example.com', role: 'admin', status: 'active', age: 40 },
        { id: '10', name: 'จันทร์จิรา สดใส', email: 'janjira@example.com', role: 'user', status: 'inactive', age: 24 },
        { id: '11', name: 'พิชัย รุ่งเรือง', email: 'pichai@example.com', role: 'user', status: 'active', age: 31 },
        { id: '12', name: 'ดวงใจ แสนสุข', email: 'duangjai@example.com', role: 'editor', status: 'active', age: 26 },
    ]);

    let nextId = users.length + 1;

    return (
        <div className="page-content">
            <h1>CRUD Control</h1>
            <p className="lead">
                Composite control สำเร็จรูปแบบ dashboard สำหรับจัดการข้อมูล CRUD พร้อม Search, Sort, Pagination, Add/Edit Modal, Delete
            </p>

            <section className="content-section">
                <h2>Overview</h2>
                <p>
                    CRUDControl รวม TableviewControl, FormControl, ConfirmModal และ PaginationControl เข้าด้วยกัน
                    เพื่อให้สามารถจัดการข้อมูลได้ครบวงจร ผ่าน config object เดียว
                </p>
            </section>

            <section className="content-section">
                <h2>Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">+</div>
                        <h3>Add / Edit</h3>
                        <p>Modal form สำหรับเพิ่มและแก้ไขข้อมูล</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">x</div>
                        <h3>Delete / Bulk Delete</h3>
                        <p>ลบทีละรายการหรือเลือกลบหลายรายการ</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">?</div>
                        <h3>Search & Filter</h3>
                        <p>ค้นหาข้อมูลแบบ client-side หรือ server-side</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">^</div>
                        <h3>Sort & Pagination</h3>
                        <p>เรียงลำดับตามคอลัมน์ พร้อม pagination</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>Live Demo</h2>
                <div className="example-demo">
                    <CRUDControl config={{
                        data: users,
                        keyField: 'id',
                        columns: [
                            { key: 'name', header: 'ชื่อ', type: 'label', sortable: true, width: 'auto' },
                            { key: 'email', header: 'อีเมล', type: 'label', sortable: true, width: 'auto' },
                            { key: 'role', header: 'สิทธิ์', type: 'badge', sortable: true, width: '100' },
                            { key: 'status', header: 'สถานะ', type: 'badge', sortable: true, width: '100',
                                controlProps: {
                                    backgroundColor: (rowData) => rowData.status === 'active' ? '#10b981' : '#ef4444'
                                }
                            },
                            { key: 'age', header: 'อายุ', type: 'label', sortable: true, width: '80' },
                        ],
                        formConfig: {
                            colnumbers: 6,
                            controls: [
                                { colno: 1, rowno: 1, colspan: 6, type: 'textbox', databind: 'name', label: 'ชื่อ-นามสกุล', placeholder: 'กรอกชื่อ-นามสกุล' },
                                { colno: 1, rowno: 2, colspan: 6, type: 'textbox', databind: 'email', label: 'อีเมล', placeholder: 'กรอกอีเมล' },
                                { colno: 1, rowno: 3, colspan: 3, type: 'select', databind: 'role', label: 'สิทธิ์',
                                    options: [
                                        { value: 'admin', label: 'Admin' },
                                        { value: 'editor', label: 'Editor' },
                                        { value: 'user', label: 'User' },
                                    ]
                                },
                                { colno: 4, rowno: 3, colspan: 3, type: 'select', databind: 'status', label: 'สถานะ',
                                    options: [
                                        { value: 'active', label: 'Active' },
                                        { value: 'inactive', label: 'Inactive' },
                                    ]
                                },
                                { colno: 1, rowno: 4, colspan: 3, type: 'number', databind: 'age', label: 'อายุ' },
                            ]
                        },
                        pagination: { limit: 5 },
                        searchFields: ['name', 'email', 'role'],
                        selectable: true,
                        onAdd: (formData) => {
                            const newUser = { ...formData, id: String(nextId++) };
                            setUsers(prev => [...prev, newUser]);
                            addLog(`Added: ${formData.name || 'New user'}`);
                        },
                        onEdit: (formData, oldData, rowKey) => {
                            setUsers(prev => prev.map(u =>
                                u.id === rowKey ? { ...u, ...formData } : u
                            ));
                            addLog(`Edited: ${oldData.name} -> ${formData.name || oldData.name}`);
                        },
                        onDelete: (rowData, rowKey) => {
                            setUsers(prev => prev.filter(u => u.id !== rowKey));
                            addLog(`Deleted: ${rowData.name}`);
                        },
                        onBulkDelete: (selectedItems) => {
                            const ids = new Set(selectedItems.map(item => item.id));
                            setUsers(prev => prev.filter(u => !ids.has(u.id)));
                            addLog(`Bulk deleted: ${selectedItems.length} items`);
                        },
                    }} />
                </div>
            </section>

            <section className="content-section">
                <h2>Auto CRUD Mode</h2>
                <p>
                    ถ้าส่ง <code>keyField</code> โดยไม่ส่ง callback (onAdd, onEdit, onDelete, onBulkDelete)
                    — CRUDControl จะจัดการ data ภายในเอง ใช้ <code>onChange</code> เพื่อ sync กลับ
                </p>
                <div className="example-demo">
                    <CRUDControl config={{
                        data: [
                            { id: '1', name: 'Auto Item 1', category: 'A' },
                            { id: '2', name: 'Auto Item 2', category: 'B' },
                            { id: '3', name: 'Auto Item 3', category: 'A' },
                        ],
                        keyField: 'id',
                        columns: [
                            { key: 'name', header: 'ชื่อ', type: 'label', sortable: true, width: 'auto' },
                            { key: 'category', header: 'หมวด', type: 'badge', sortable: true, width: '100' },
                        ],
                        formConfig: {
                            colnumbers: 6,
                            controls: [
                                { colno: 1, rowno: 1, colspan: 6, type: 'textbox', databind: 'name', label: 'ชื่อ', placeholder: 'กรอกชื่อ' },
                                { colno: 1, rowno: 2, colspan: 6, type: 'select', databind: 'category', label: 'หมวด',
                                    options: [
                                        { value: 'A', label: 'หมวด A' },
                                        { value: 'B', label: 'หมวด B' },
                                    ]
                                },
                            ]
                        },
                        searchFields: ['name', 'category'],
                        selectable: true,
                        onChange: (newData) => {
                            addLog(`Auto mode: data changed (${newData.length} items)`);
                        },
                    }} />
                </div>
            </section>

            <section className="content-section">
                <h2>Props Reference</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table className="props-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-secondary)', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Prop</th>
                                <th style={{ padding: '10px' }}>Type</th>
                                <th style={{ padding: '10px' }}>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>data</code></td>
                                <td style={{ padding: '10px' }}>Array</td>
                                <td style={{ padding: '10px' }}>ข้อมูลที่จะแสดงในตาราง</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>keyField</code></td>
                                <td style={{ padding: '10px' }}>string</td>
                                <td style={{ padding: '10px' }}>ชื่อ field ที่เป็น key เช่น 'id', 'userId' — ใช้สำหรับ selection + auto CRUD mode</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>columns</code></td>
                                <td style={{ padding: '10px' }}>Array</td>
                                <td style={{ padding: '10px' }}>กำหนดคอลัมน์ {'{'} key, header, type, sortable, width, controlProps {'}'}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>formConfig</code></td>
                                <td style={{ padding: '10px' }}>Object</td>
                                <td style={{ padding: '10px' }}>FormControl config สำหรับ Add/Edit modal</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>pagination</code></td>
                                <td style={{ padding: '10px' }}>Object</td>
                                <td style={{ padding: '10px' }}>{'{'} page, limit, total {'}'} - ถ้าไม่ส่ง onPageChange จะ paginate client-side</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>searchFields</code></td>
                                <td style={{ padding: '10px' }}>Array</td>
                                <td style={{ padding: '10px' }}>ฟิลด์ที่จะใช้ค้นหา เช่น ['name', 'email']</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>selectable</code></td>
                                <td style={{ padding: '10px' }}>boolean</td>
                                <td style={{ padding: '10px' }}>แสดง checkbox สำหรับเลือกแถว (default: true)</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>onAdd</code></td>
                                <td style={{ padding: '10px' }}>Function</td>
                                <td style={{ padding: '10px' }}>(formData) - เมื่อกดบันทึกในโหมดเพิ่ม</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>onEdit</code></td>
                                <td style={{ padding: '10px' }}>Function</td>
                                <td style={{ padding: '10px' }}>(formData, oldData, rowIndex) - เมื่อกดบันทึกในโหมดแก้ไข</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>onDelete</code></td>
                                <td style={{ padding: '10px' }}>Function</td>
                                <td style={{ padding: '10px' }}>(rowData, rowIndex) - เมื่อยืนยันลบ</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>onBulkDelete</code></td>
                                <td style={{ padding: '10px' }}>Function</td>
                                <td style={{ padding: '10px' }}>(selectedItems[]) - เมื่อยืนยันลบหลายรายการ</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>onSearch</code></td>
                                <td style={{ padding: '10px' }}>Function</td>
                                <td style={{ padding: '10px' }}>(query) - server-side search (ถ้าไม่ส่งจะ filter client-side)</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>onSort</code></td>
                                <td style={{ padding: '10px' }}>Function</td>
                                <td style={{ padding: '10px' }}>(key, direction) - server-side sort (ถ้าไม่ส่งจะ sort client-side)</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>onPageChange</code></td>
                                <td style={{ padding: '10px' }}>Function</td>
                                <td style={{ padding: '10px' }}>(page) - server-side pagination (ถ้าไม่ส่งจะ paginate client-side)</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                                <td style={{ padding: '10px' }}><code>onChange</code></td>
                                <td style={{ padding: '10px' }}>Function</td>
                                <td style={{ padding: '10px' }}>(newData) — เรียกเมื่อ data เปลี่ยนใน auto CRUD mode</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '10px' }}><code>labels</code></td>
                                <td style={{ padding: '10px' }}>Object</td>
                                <td style={{ padding: '10px' }}>ปรับแต่ง label ต่างๆ (default เป็นภาษาไทย)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default CRUDPage;
