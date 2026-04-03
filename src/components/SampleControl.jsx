// SampleControl.jsx
import React, { useState } from 'react';
import { 
    TableviewControl, 
    CalendarGridControl, 
    FormControl, 
    DatePickerControl, 
    DropdownControl,
    CardControl,
    AccordionControl,
    ButtonGroupControl,
    TabControl,
    TreeControl,
    LabelControl,
    TextboxControl,
    NumberControl,
    SelectControl,
    CheckboxControl,
    ToggleControl,
    DateControl,
    ButtonControl,
    LinkControl,
    ImageControl,
    BadgeControl,
    IconControl,
    ProgressControl,
    CalendarControl,
    QRCodeControl
} from './controls';




function SampleControl() {
    const [logs, setLogs] = useState([]);

    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
        console.log(message);
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '10px' }}>🎨 Control Components Demo</h1>
            <p style={{ color: '#6c757d', marginBottom: '40px', fontSize: '16px' }}>
                ตัวอย่างการใช้งาน Control Components ต่างๆ พร้อมคำอธิบายและ Code Examples
            </p>

            {/* Usage Guide */}
            <section style={{ 
                marginBottom: '40px', 
                backgroundColor: '#f0f9ff', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #bfdbfe'
            }}>
                <h2 style={{ marginTop: 0 }}>📖 วิธีการใช้งาน</h2>
                <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                    <p><strong>1. Import Components:</strong></p>
                    <pre style={{ 
                        backgroundColor: '#1e1e1e', 
                        color: '#d4d4d4', 
                        padding: '12px', 
                        borderRadius: '6px',
                        overflow: 'auto'
                    }}>{`import { 
    TableviewControl, 
    FormControl, 
    CalendarGridControl,
    DatePickerControl 
} from './components/controls';`}</pre>

                    <p style={{ marginTop: '20px' }}><strong>2. ใช้งาน TableviewControl:</strong></p>
                    <pre style={{ 
                        backgroundColor: '#1e1e1e', 
                        color: '#d4d4d4', 
                        padding: '12px', 
                        borderRadius: '6px',
                        overflow: 'auto'
                    }}>{`<TableviewControl config={{
    headers: ["ชื่อ", "อีเมล", "สถานะ"],
    data: users,
    controls: [
        { type: "label", databind: "name" },
        { type: "textbox", databind: "email" },
        { type: "badge", databind: "status" }
    ]
}} />`}</pre>

                    <p style={{ marginTop: '20px' }}><strong>3. ใช้งาน FormControl:</strong></p>
                    <pre style={{ 
                        backgroundColor: '#1e1e1e', 
                        color: '#d4d4d4', 
                        padding: '12px', 
                        borderRadius: '6px',
                        overflow: 'auto'
                    }}>{`<FormControl config={{
    colnumbers: 6,
    responsive: true,
    data: [{ user: { name: "สมชาย" } }],
    controls: [
        {
            colno: 1,
            rowno: 1,
            label: "ชื่อ",
            databind: "user.name",
            type: "textbox"
        }
    ]
}} />`}</pre>

                    <p style={{ marginTop: '20px' }}><strong>4. ใช้งาน DatePickerControl:</strong></p>
                    <pre style={{ 
                        backgroundColor: '#1e1e1e', 
                        color: '#d4d4d4', 
                        padding: '12px', 
                        borderRadius: '6px',
                        overflow: 'auto'
                    }}>{`<DatePickerControl control={{
    value: '2025-01-15',
    placeholder: 'เลือกวันที่',
    onChange: (event) => console.log(event.target.value)
}} />`}</pre>

                    <p style={{ marginTop: '20px' }}><strong>5. ใช้งาน CalendarGridControl:</strong></p>
                    <pre style={{ 
                        backgroundColor: '#1e1e1e', 
                        color: '#d4d4d4', 
                        padding: '12px', 
                        borderRadius: '6px',
                        overflow: 'auto'
                    }}>{`<CalendarGridControl control={{
    initialDate: '20250115', // YYYYMMDD
    editable: true,
    events: { '2025-01-15': 'ประชุมทีม' },
    onChange: (event) => console.log(event.target.value)
}} />`}</pre>

                    <p style={{ marginTop: '20px' }}><strong>6. วิธี Bind Data ทุก Control Type:</strong></p>
                    <pre style={{ 
                        backgroundColor: '#1e1e1e', 
                        color: '#d4d4d4', 
                        padding: '12px', 
                        borderRadius: '6px',
                        overflow: 'auto',
                        maxHeight: '400px'
                    }}>{`// 1. Label - แสดงข้อความ
{ type: "label", databind: "name" }
{ type: "label", value: "Static Text" }

// 2. Textbox - Input text
{ type: "textbox", databind: "email", placeholder: "Email..." }

// 3. Number - Input ตัวเลข
{ type: "number", databind: "age", min: 0, max: 100, step: 1 }

// 4. Select - Dropdown ปกติ
{ 
  type: "select", 
  databind: "role",
  options: [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" }
  ]
}

// 5. Checkbox - Checkbox (SVG)
{ type: "checkbox", databind: "verified", labelText: "ยืนยันแล้ว" }

// 6. Toggle - Toggle switch
{ type: "toggle", databind: "active" }

// 7. Date - Date picker ปกติ
{ type: "date", databind: "joinDate" }

// 8. DatePicker - Buddhist calendar modal
{ type: "datepicker", databind: "birthDate", placeholder: "เลือกวันเกิด" }

// 9. Button - ปุ่ม (8 variants)
{ 
  type: "button", 
  value: "Save",                  // Static text
  className: "btn-primary",       // primary, danger, success, warning, etc.
  onClick: (event, rowData, rowIndex) => console.log(rowData)
}
// Button with databind
{ 
  type: "button", 
  databind: "buttonLabel",        // Dynamic text from databind
  className: "btn-success",
  onClick: (event, rowData, rowIndex) => console.log(rowData)
}

// 10. Link - Hyperlink
{ 
  type: "link", 
  textBind: "linkText",    // ข้อความที่แสดง
  databind: "url",          // URL
  onClick: (event, rowData, rowIndex) => {}
}

// 11. Image - แสดงรูป
{ 
  type: "image", 
  databind: "avatar",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  alt: "Avatar"
}

// 12. Badge - Badge/Tag
{ 
  type: "badge", 
  databind: "status",
  backgroundColor: (rowData) => rowData.status === 'active' ? '#10b981' : '#ef4444'
}

// 13. Icon - Icon/Emoji
{ type: "icon", databind: "iconName", fontSize: "24px" }

// 14. Progress - Progress bar
{ 
  type: "progress", 
  databind: "progress",
  showValue: true,
  color: "#3b82f6"
}

// 15. Calendar - Calendar dropdown (Buddhist)
{ 
  type: "calendar", 
  databind: "eventDate",
  events: {
    '2024-01-15': ['Meeting', 'Workshop']
  },
  eventColors: {
    'Meeting': '#3b82f6',
    'Workshop': '#10b981'
  }
}

// 16. Dropdown - Table dropdown
{ 
  type: "dropdown", 
  databind: "selectedUserId",
  data: users,
  keyField: "id",
  displayField: "name",
  displayFields: ["name", "email"],  // แสดงหลายฟิลด์
  searchable: true,
  searchFields: ["name", "email"],
  clearable: true,
  tableConfig: {
    headers: ["Name", "Email", "Role"],
    controls: [
      { type: "label", databind: "name" },
      { type: "label", databind: "email" },
      { type: "badge", databind: "role" }
    ]
  },
  onChange: (event, rowData, rowIndex) => {
    console.log(event.target.value);        // selected ID
    console.log(event.target.selectedRow);  // full row data
  }
}

// 17. QRCode - QR Code generator
{ 
  type: "qrcode", 
  databind: "qrData",              // Text/URL to encode
  width: 200,                       // QR code width (default: 200)
  height: 200,                      // QR code height (default: 200)
  errorCorrectionLevel: "M",        // L | M | Q | H (default: M)
  margin: 1,                        // Margin (default: 1)
  color: {
    dark: "#000000",                // Dark color (default: black)
    light: "#ffffff"                // Light color (default: white)
  }
}
// Example: Generate QR code for URL
{ type: "qrcode", databind: "website", width: 150, height: 150 }
// Example: Generate QR code for user ID
{ type: "qrcode", value: "USER-12345", width: 100, height: 100 }

// 18. Custom - Custom render
{ 
  type: "custom",
  render: (rowData, rowIndex) => (
    <div>
      <strong>{rowData.name}</strong>
      <span>{rowData.email}</span>
    </div>
  )
}

// ============================================
// Nested Data Binding (ใช้ได้กับทุก control)
// ============================================
{ type: "textbox", databind: "user.profile.firstName" }
{ type: "label", databind: "company.address.city" }
{ type: "badge", databind: "settings.preferences.theme" }

// ============================================
// Form Control - Data Binding
// ============================================
<FormControl config={{
  colnumbers: 6,
  data: [{
    user: { name: "สมชาย", email: "somchai@test.com" },
    labels: { nameLabel: "ชื่อ", emailLabel: "อีเมล" }
  }],
  controls: [
    {
      colno: 1,
      rowno: 1,
      label: { databind: "labels.nameLabel" },  // Dynamic label
      databind: "user.name",                     // Dynamic value
      type: "textbox"
    },
    {
      colno: 2,
      rowno: 1,
      label: { databind: "labels.emailLabel" },
      databind: "user.email",
      type: "textbox"
    }
  ]
}} />

// ============================================
// TableView - Data Binding
// ============================================
<TableviewControl config={{
  data: users,
  headers: ["Name", "Email", "Status"],
  controls: [
    { type: "label", databind: "name" },
    { type: "textbox", databind: "email" },
    { type: "badge", databind: "status" }
  ]
}} />`}</pre>

                    <p style={{ marginTop: '20px' }}><strong>Control Types ที่รองรับ (18 types):</strong></p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px', marginTop: '10px' }}>
                        <div><code>label</code> - Text label</div>
                        <div><code>textbox</code> - Text input</div>
                        <div><code>number</code> - Number input</div>
                        <div><code>select</code> - Dropdown select</div>
                        <div><code>checkbox</code> - Checkbox (SVG)</div>
                        <div><code>toggle</code> - Toggle switch</div>
                        <div><code>date</code> - Date input (native)</div>
                        <div><code>datepicker</code> - Date picker (Buddhist)</div>
                        <div><code>button</code> - Button (8 variants)</div>
                        <div><code>link</code> - Hyperlink</div>
                        <div><code>image</code> - Image display</div>
                        <div><code>badge</code> - Badge/Tag</div>
                        <div><code>icon</code> - Icon display</div>
                        <div><code>progress</code> - Progress bar</div>
                        <div><code>calendar</code> - Calendar dropdown</div>
                        <div><code>dropdown</code> - Table dropdown</div>
                        <div><code>qrcode</code> - QR Code generator</div>
                        <div><code>custom</code> - Custom render</div>
                    </div>
                </div>
            </section>

            {/* Examples below */}
            {renderExamples()}
        </div>
    );

    function renderExamples() {
        // Sample data - Generate 50 users for pagination testing
        const users = Array.from({ length: 50 }, (_, i) => ({
            id: String(i + 1),
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${(i % 70) + 1}.jpg`,
            age: 20 + (i % 40),
            role: i % 5 === 0 ? "admin" : "user",
            status: i % 3 === 0 ? "inactive" : "active",
            verified: i % 2 === 0,
            progress: (i % 10) * 10 + 10,
            joinDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
            salary: 40000 + (i * 1000)
        }));

        // Table 4: Buddhist Calendar Demo
        const calendarConfig = {
            headers: ["ชื่อ", "วันที่เข้าร่วม (พ.ศ.)", "วันเกิด (พ.ศ.)", "วันหมดอายุ (พ.ศ.)"],
            colwidths: ["auto", "180px", "180px", "180px"],
            data: users,
            controls: [
            {
                type: "label",
                databind: "name",
                className: "font-bold"
            },
            {
                type: "calendar",
                databind: "joinDate",
                placeholder: "เลือกวันที่",
                events: {
                    '2024-01-15': ['ประชุม', 'วันหยุด'],
                    '2024-01-20': ['Training'],
                    '2024-02-14': ['Valentine'],
                    '2024-03-20': ['Workshop', 'Meeting', 'Review'],
                },
                eventColors: {
                    'ประชุม': '#3b82f6',
                    'วันหยุด': '#ef4444',
                    'Training': '#10b981',
                    'Valentine': '#ec4899',
                    'Workshop': '#f59e0b'
                },
                maxEventsDisplay: 2,
                onChange: (e, rowData, rowIndex) => {
                    addLog(`Join date changed: ${e.target.value} - ${rowData.name}`);
                }
            },
            {
                type: "calendar",
                placeholder: "เลือกวันเกิด",
                events: {
                    '2024-01-01': ['วันขึ้นปีใหม่'],
                    '2024-12-25': ['Christmas'],
                },
                onChange: (e, rowData, rowIndex) => {
                    addLog(`Birthday selected: ${e.target.value} - ${rowData.name}`);
                }
            },
            {
                type: "calendar",
                placeholder: "เลือกวันหมดอายุ",
                onChange: (e, rowData, rowIndex) => {
                    addLog(`Expiry date: ${e.target.value} - ${rowData.name}`);
                }
            }
        ]
    };

        // Table 1: All Controls Demo
        const allControlsConfig = {
        headers: ["Select", "Avatar", "Name", "Email", "Age", "Role", "Status", "Verified", "Progress", "Actions"],
        colwidths: ["50px", "60px", "auto", "200px", "80px", "120px", "100px", "80px", "120px", "160px"],
        data: users,
        className: "sample-table",
        controls: [
            {
                type: "checkbox",
                databind: "verified",
                onChange: (e, rowData, rowIndex) => {
                    addLog(`Checkbox ${rowIndex}: ${e.target.checked} - ${rowData.name}`);
                }
            },
            {
                type: "image",
                databind: "avatar",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                alt: "Avatar"
            },
            {
                type: "label",
                databind: "name",
                className: "font-bold"
            },
            {
                type: "link",
                textBind: "email",
                databind: "email",
                onClick: (e, rowData, rowIndex) => {
                    addLog(`Link clicked: ${rowData.email} (Row ${rowIndex})`);
                }
            },
            {
                type: "number",
                databind: "age",
                min: 18,
                max: 100,
                onChange: (e, rowData, rowIndex) => {
                    addLog(`Age changed: ${e.target.value} - ${rowData.name}`);
                }
            },
            {
                type: "select",
                databind: "role",
                options: [
                    { value: "admin", label: "Admin" },
                    { value: "user", label: "User" },
                    { value: "guest", label: "Guest" }
                ],
                onChange: (e, rowData, rowIndex) => {
                    addLog(`Role changed: ${e.target.value} - ${rowData.name}`);
                }
            },
            {
                type: "badge",
                databind: "status",
                backgroundColor: (rowData) => rowData.status === 'active' ? '#28a745' : '#dc3545',
                color: '#fff'
            },
            {
                type: "toggle",
                databind: "verified",
                onChange: (e, rowData, rowIndex) => {
                    addLog(`Verified toggle: ${e.target.checked} - ${rowData.name}`);
                }
            },
            {
                type: "progress",
                databind: "progress",
                showValue: true,
                color: "#007bff"
            },
            {
                type: "custom",
                render: (rowData, rowIndex) => (
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <a 
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                addLog(`View: ${rowData.name}`);
                            }}
                            className="btn-control btn-sm"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                            View
                        </a>
                        <a 
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                addLog(`Edit: ${rowData.name}`);
                            }}
                            className="btn-control btn-sm btn-warning"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                            Edit
                        </a>
                        <a 
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (confirm(`Delete ${rowData.name}?`)) {
                                    addLog(`Delete: ${rowData.name}`);
                                }
                            }}
                            className="btn-control btn-sm btn-danger"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                            Delete
                        </a>
                    </div>
                )
            }
        ]
    };

    // Table 2: Editable Form
    const editableFormConfig = {
        headers: ["Name", "Email", "Age", "Join Date", "Salary"],
        colwidths: ["auto", "200px", "100px", "150px", "120px"],
        data: users,
        controls: [
            {
                type: "textbox",
                databind: "name",
                placeholder: "Enter name",
                onChange: (e, rowData, rowIndex) => {
                    addLog(`Name input: "${e.target.value}" (Row ${rowIndex})`);
                },
                onBlur: (e, rowData, rowIndex) => {
                    addLog(`Name saved: "${e.target.value}" - ${rowData.email}`);
                }
            },
            {
                type: "textbox",
                databind: "email",
                placeholder: "email@example.com",
                onChange: (e, rowData, rowIndex) => {
                    addLog(`Email input: ${e.target.value}`);
                }
            },
            {
                type: "number",
                databind: "age",
                min: 18,
                max: 100,
                step: 1,
                onChange: (e, rowData, rowIndex) => {
                    addLog(`Age: ${e.target.value}`);
                }
            },
            {
                type: "date",
                databind: "joinDate",
                onChange: (e, rowData, rowIndex) => {
                    addLog(`Date selected: ${e.target.value} for ${rowData.name}`);
                }
            },
            {
                type: "number",
                databind: "salary",
                min: 0,
                step: 1000,
                onChange: (e, rowData, rowIndex) => {
                    addLog(`Salary: $${e.target.value}`);
                }
            }
        ]
    };

    // Table 3: Simple Button Actions
    const buttonActionsConfig = {
        headers: ["User Info", "Quick Actions", "More Actions"],
        colwidths: ["auto", "200px", "150px"],
        data: users,
        controls: [
            {
                type: "custom",
                render: (rowData) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                            src={rowData.avatar} 
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
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        <a 
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                addLog(`Email sent to ${rowData.email}`);
                            }}
                            className="btn-control btn-sm btn-primary"
                        >
                            📧 Email
                        </a>
                        <a 
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                addLog(`Message sent to ${rowData.name}`);
                            }}
                            className="btn-control btn-sm btn-success"
                        >
                            💬 Message
                        </a>
                        <a 
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                addLog(`Called ${rowData.name}`);
                            }}
                            className="btn-control btn-sm btn-secondary"
                        >
                            📞 Call
                        </a>
                    </div>
                )
            },
            {
                type: "custom",
                render: (rowData, rowIndex) => (
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <a 
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                addLog(`Viewing profile: ${rowData.name}`);
                            }}
                            className="btn-control btn-sm btn-outline"
                        >
                            Profile
                        </a>
                        <a 
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                addLog(`Settings for: ${rowData.name}`);
                            }}
                            className="btn-control btn-sm btn-outline"
                        >
                            Settings
                        </a>
                    </div>
                )
            }
        ]
    };

        return (
            <div>
            {/* Example 0 - All Control Types Demo with DataBind */}
            <section style={{ marginBottom: '40px' }}>
                <h2>🎯 Example 0: All Control Types with DataBind (20 Controls)</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    แสดง Control ทุกประเภทพร้อมการใช้งาน <strong>databind</strong> กับข้อมูลจริง
                </p>
                
                <div style={{
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fbbf24',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '20px'
                }}>
                    <strong>📌 Note:</strong> ทุก control ใช้ <code>databind</code> ดึงข้อมูลจาก <code>rowData</code> โดยตรง ไม่ใช่ค่าคงที่
                </div>

                <TableviewControl config={{
                    headers: ['Control Type', 'Example (databind)', 'Code', 'Description'],
                    colwidths: ['130px', '250px', '300px', 'auto'],
                    data: [
                        {
                            id: 1,
                            name: 'สมชาย ใจดี',
                            email: 'somchai@test.com',
                            age: 25,
                            role: 'admin',
                            verified: true,
                            active: true,
                            joinDate: '2024-01-15',
                            birthDate: '1999-05-20',
                            website: 'https://example.com',
                            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                            status: 'active',
                            icon: '⭐',
                            progress: 75,
                            eventDate: '2025-01-20',
                            department: { id: 1, name: 'IT Department' },
                            qrData: 'https://example.com/user/somchai',
                            note: 'Custom component example'
                        }
                    ],
                    controls: [
                        // Column 1: Control Type
                        {
                            type: 'custom',
                            render: () => {
                                const types = [
                                    'label', 'textbox', 'number', 'select', 'checkbox', 'toggle',
                                    'date', 'datepicker', 'button', 'link', 'image', 'badge',
                                    'icon', 'progress', 'calendar', 'dropdown', 'qrcode', 'custom'
                                ];
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {types.map((type, idx) => (
                                            <code key={idx} style={{
                                                backgroundColor: '#f3f4f6',
                                                padding: '6px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                height: '100px',
                                                justifyContent: 'center'
                                            }}>
                                                {type}
                                            </code>
                                        ))}
                                    </div>
                                );
                            }
                        },
                        // Column 2: Live Example with databind
                        {
                            type: 'custom',
                            render: (rowData) => (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <LabelControl control={{ databind: 'name', style: { fontWeight: 'bold' } }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <TextboxControl control={{ databind: 'email', placeholder: 'Email...' }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <NumberControl control={{ databind: 'age', min: 0, max: 100 }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <SelectControl control={{
                                            databind: 'role',
                                            options: [
                                                { label: 'Admin', value: 'admin' },
                                                { label: 'User', value: 'user' },
                                                { label: 'Guest', value: 'guest' }
                                            ]
                                        }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckboxControl control={{ databind: 'verified', labelText: 'Verified' }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ToggleControl control={{ databind: 'active' }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <DateControl control={{ databind: 'joinDate' }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <DatePickerControl control={{ databind: 'birthDate', placeholder: 'เลือกวันเกิด' }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ButtonControl control={{
                                            value: 'View Profile',
                                            className: 'btn-primary',
                                            onClick: (e, rd) => handleEvent('Button clicked', { name: rd.name })
                                        }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <LinkControl control={{
                                            databind: 'website',
                                            value: 'Visit Website',
                                            target: '_blank',
                                            icon: '🔗',
                                            underline: 'hover'
                                        }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ImageControl control={{
                                            databind: 'avatar',
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            shadow: true
                                        }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <BadgeControl control={{
                                            databind: 'status',
                                            backgroundColor: (rd) => rd.status === 'active' ? '#10b981' : '#ef4444',
                                            color: 'white'
                                        }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconControl control={{ databind: 'icon', fontSize: '24px' }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                        <ProgressControl control={{
                                            databind: 'progress',
                                            showValue: true,
                                            color: '#3b82f6'
                                        }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CalendarControl control={{
                                            databind: 'eventDate',
                                            events: { '2025-01-20': ['Meeting', 'Workshop'] }
                                        }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <DropdownControl control={{
                                            databind: 'department.id',
                                            data: [
                                                { id: 1, name: 'IT Department' },
                                                { id: 2, name: 'HR Department' },
                                                { id: 3, name: 'Finance' }
                                            ],
                                            keyField: 'id',
                                            displayField: 'name',
                                            placeholder: 'Select...'
                                        }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <QRCodeControl control={{
                                            databind: 'qrData',
                                            width: 100,
                                            height: 100
                                        }} rowData={rowData} />
                                    </div>
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{
                                            padding: '6px 10px',
                                            backgroundColor: '#f3f4f6',
                                            borderRadius: '4px',
                                            border: '1px dashed #9ca3af',
                                            fontSize: '13px'
                                        }}>
                                            {rowData.note}
                                        </div>
                                    </div>
                                </div>
                            )
                        },
                        // Column 3: Code
                        {
                            type: 'custom',
                            render: () => (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {[
                                        `{ databind: 'name' }`,
                                        `{ databind: 'email' }`,
                                        `{ databind: 'age' }`,
                                        `{ databind: 'role', options: [...] }`,
                                        `{ databind: 'verified' }`,
                                        `{ databind: 'active' }`,
                                        `{ databind: 'joinDate' }`,
                                        `{ databind: 'birthDate' }`,
                                        `{ value: 'Text', onClick: ... }`,
                                        `{ databind: 'website', icon: '🔗' }`,
                                        `{ databind: 'avatar', shadow: true }`,
                                        `{ databind: 'status', backgroundColor: (rd) => ... }`,
                                        `{ databind: 'icon' }`,
                                        `{ databind: 'progress' }`,
                                        `{ databind: 'eventDate' }`,
                                        `{ databind: 'department.id' }`,
                                        `{ databind: 'qrData', width: 100 }`,
                                        `{ render: (rd) => ... }`
                                    ].map((code, idx) => (
                                        <pre key={idx} style={{
                                            backgroundColor: '#1e1e1e',
                                            color: '#d4d4d4',
                                            padding: '6px 8px',
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            margin: 0,
                                            height: '100px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            overflow: 'auto'
                                        }}>{code}</pre>
                                    ))}
                                </div>
                            )
                        },
                        // Column 4: Description
                        {
                            type: 'custom',
                            render: () => {
                                const descriptions = [
                                    'แสดงข้อความจาก databind',
                                    'Input text จาก databind',
                                    'Number input จาก databind',
                                    'Select จาก databind',
                                    'Checkbox จาก databind',
                                    'Toggle จาก databind',
                                    'Date picker จาก databind',
                                    'DatePicker พ.ศ. + databind',
                                    'Button พร้อม onClick',
                                    'Link พร้อม icon และ target',
                                    'Image พร้อม shadow และ objectFit',
                                    'Badge สี dynamic',
                                    'Icon/Emoji จาก databind',
                                    'Progress bar จาก databind',
                                    'Calendar พ.ศ. + databind',
                                    'Dropdown + nested databind',
                                    'QR Code generator จาก databind',
                                    'Custom render function'
                                ];
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {descriptions.map((desc, idx) => (
                                            <div key={idx} style={{
                                                fontSize: '13px',
                                                height: '100px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '4px'
                                            }}>
                                                {desc}
                                            </div>
                                        ))}
                                    </div>
                                );
                            }
                        }
                    ]
                }} />
            </section>

            {/* Example 0.5 - Data Binding Demo */}
            <section style={{ marginBottom: '40px' }}>
                <h2>🔗 Example 0.5: Data Binding Examples</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    ตัวอย่างการ bind ข้อมูลเข้า controls ต่างๆ - แสดงวิธีการใช้ databind
                </p>
                <div style={{ 
                    backgroundColor: '#f0f9ff', 
                    padding: '15px', 
                    borderRadius: '8px',
                    marginBottom: '20px',
                    border: '1px solid #bfdbfe'
                }}>
                    <h4 style={{ marginTop: 0 }}>💡 Data Binding Patterns:</h4>
                    <div style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                        <p><strong>1. Simple Binding:</strong></p>
                        <pre style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>{`{ type: "label", databind: "name" }
// จะแสดงค่าจาก rowData.name`}</pre>

                        <p><strong>2. Nested Binding:</strong></p>
                        <pre style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>{`{ type: "textbox", databind: "user.profile.fullName" }
// จะแสดงค่าจาก rowData.user.profile.fullName`}</pre>

                        <p><strong>3. Value vs DataBind:</strong></p>
                        <pre style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>{`{ type: "label", value: "Static Text" }           // ค่าคงที่
{ type: "label", databind: "dynamicField" }     // ค่าจาก data
{ type: "label", value: { databind: "field" } } // ใน Form Control`}</pre>

                        <p><strong>4. Function Binding:</strong></p>
                        <pre style={{ backgroundColor: '#1e1e1e', color: '#d4d4d4', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>{`{ 
  type: "badge", 
  databind: "status",
  backgroundColor: (rowData) => rowData.status === 'active' ? 'green' : 'red'
}`}</pre>
                    </div>
                </div>

                <h3>ตัวอย่าง: ข้อมูลจริงที่ bind เข้า Table</h3>
                <TableviewControl config={{
                    headers: ['Field', 'Control', 'DataBind', 'Result'],
                    colwidths: ['120px', '120px', '200px', 'auto'],
                    data: users.slice(0, 10),
                    controls: [
                        {
                            type: 'custom',
                            render: (rd, ri) => <code>users[{ri}]</code>
                        },
                        {
                            type: 'label',
                            value: 'Label'
                        },
                        {
                            type: 'custom',
                            render: () => <code style={{ fontSize: '12px' }}>databind: "name"</code>
                        },
                        {
                            type: 'label',
                            databind: 'name',
                            style: { fontWeight: '600', color: '#3b82f6' }
                        },
                        {
                            type: 'label',
                            value: 'Image'
                        },
                        {
                            type: 'custom',
                            render: () => <code style={{ fontSize: '12px' }}>databind: "avatar"</code>
                        },
                        {
                            type: 'image',
                            databind: 'avatar',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%'
                        },
                        {
                            type: 'label',
                            value: 'Badge'
                        },
                        {
                            type: 'custom',
                            render: () => <code style={{ fontSize: '12px' }}>databind: "status"</code>
                        },
                        {
                            type: 'badge',
                            databind: 'status',
                            backgroundColor: (rd) => rd.status === 'active' ? '#10b981' : '#ef4444'
                        },
                        {
                            type: 'label',
                            value: 'Progress'
                        },
                        {
                            type: 'custom',
                            render: () => <code style={{ fontSize: '12px' }}>databind: "progress"</code>
                        },
                        {
                            type: 'progress',
                            databind: 'progress',
                            showValue: true,
                            color: '#3b82f6'
                        },
                        {
                            type: 'label',
                            value: 'Toggle'
                        },
                        {
                            type: 'custom',
                            render: () => <code style={{ fontSize: '12px' }}>databind: "verified"</code>
                        },
                        {
                            type: 'toggle',
                            databind: 'verified'
                        },
                        {
                            type: 'label',
                            value: 'Number'
                        },
                        {
                            type: 'custom',
                            render: () => <code style={{ fontSize: '12px' }}>databind: "age"</code>
                        },
                        {
                            type: 'number',
                            databind: 'age',
                            min: 18,
                            max: 100
                        },
                        {
                            type: 'label',
                            value: 'Date'
                        },
                        {
                            type: 'custom',
                            render: () => <code style={{ fontSize: '12px' }}>databind: "joinDate"</code>
                        },
                        {
                            type: 'date',
                            databind: 'joinDate'
                        }
                    ]
                }} />

                <h3 style={{ marginTop: '30px' }}>Form Control: Nested Data Binding</h3>
                <FormControl config={{
                    colnumbers: 4,
                    responsive: true,
                    data: [{
                        user: {
                            profile: {
                                firstName: 'สมชาย',
                                lastName: 'ใจดี',
                                email: 'somchai@example.com'
                            },
                            settings: {
                                role: 'admin',
                                active: true
                            }
                        },
                        labels: {
                            firstNameLabel: 'ชื่อ',
                            lastNameLabel: 'นามสกุล',
                            emailLabel: 'อีเมล',
                            roleLabel: 'บทบาท',
                            activeLabel: 'สถานะ'
                        }
                    }],
                    controls: [
                        {
                            colno: 1,
                            rowno: 1,
                            label: { databind: 'labels.firstNameLabel' },
                            databind: 'user.profile.firstName',
                            type: 'textbox'
                        },
                        {
                            colno: 2,
                            rowno: 1,
                            label: { databind: 'labels.lastNameLabel' },
                            databind: 'user.profile.lastName',
                            type: 'textbox'
                        },
                        {
                            colno: 1,
                            rowno: 2,
                            label: { databind: 'labels.emailLabel' },
                            databind: 'user.profile.email',
                            type: 'textbox'
                        },
                        {
                            colno: 2,
                            rowno: 2,
                            label: { databind: 'labels.roleLabel' },
                            databind: 'user.settings.role',
                            type: 'select',
                            options: [
                                { label: 'Admin', value: 'admin' },
                                { label: 'User', value: 'user' }
                            ]
                        },
                        {
                            colno: 1,
                            rowno: 3,
                            label: { databind: 'labels.activeLabel' },
                            databind: 'user.settings.active',
                            type: 'toggle'
                        }
                    ],
                    onChange: (event) => {
                        addLog(`📝 Form updated (nested): ${JSON.stringify(event.target.value).substring(0, 100)}...`);
                    }
                }} />

                <div style={{ 
                    marginTop: '20px',
                    padding: '15px', 
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    border: '1px solid #fbbf24'
                }}>
                    <strong>⚡ Key Points:</strong>
                    <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                        <li><code>databind: "field"</code> → Simple binding (ดึงจาก rowData.field)</li>
                        <li><code>databind: "user.name"</code> → Nested binding (ดึงจาก rowData.user.name)</li>
                        <li><code>value: "text"</code> → Static value (ค่าคงที่)</li>
                        <li><code>backgroundColor: (rowData) =&gt; ...</code> → Dynamic function</li>
                        <li>Form Control ใช้ <code>label: &#123; databind: "path" &#125;</code> สำหรับ dynamic label</li>
                    </ul>
                </div>
            </section>

            {/* Example 1 */}
            <section style={{ marginBottom: '40px' }}>
                <h2>📊 Example 1: All Controls Showcase</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    แสดง controls ทุกประเภท: Checkbox, Image, Label, Link, Number, Select, Badge, Toggle, Progress, Custom
                </p>
                <TableviewControl config={{
                    ...allControlsConfig,
                    pagination: {
                        limit: 10,
                        page: 1,
                        total: users.length
                    },
                    onPageChange: (page, limit) => {
                        addLog(`📄 Page changed: ${page}, Limit: ${limit}`);
                    }
                }} />
            </section>

            {/* Example 5 */}
            <section style={{ marginBottom: '40px' }}>
                <h2>📅 Example 5: Calendar Grid (Read-only Mode - Default)</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    ตารางปฏิทินแบบ Read-only (Default) - แสดงข้อความ + คลิกได้
                </p>
                <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '10px 15px', 
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '13px'
                }}>
                    <strong>Features:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li><code>editable: false</code> (Default) - แสดงอย่างเดียว ไม่แก้ไข</li>
                        <li>แสดงข้อความ/Events ในแต่ละวัน</li>
                        <li>คลิกวันได้ → trigger onClick event</li>
                        <li><code>initialDate: '20250214'</code> - รูปแบบ YYYYMMDD (ค.ศ.)</li>
                    </ul>
                </div>
                <CalendarGridControl 
                    control={{
                        initialDate: '20250214', // วาเลนไทน์
                        events: {
                            '2025-02-14': '💝 วันวาเลนไทน์',
                            '2025-02-16': 'วันมาฆบูชา',
                            '2025-02-19': 'วันพระราชทานธงชาติไทย'
                        },
                        onClick: (dateKey, dateInfo, rowData, rowIndex) => {
                            addLog(`📅 Clicked: ${dateKey} | Event: ${dateInfo.events || 'ไม่มี event'}`);
                        }
                    }}
                    rowData={{}}
                    rowIndex={0}
                />
            </section>

            {/* Example 6 */}
            <section style={{ marginBottom: '40px' }}>
                <h2>📆 Example 6: Calendar Grid (Editable Mode)</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    ตารางปฏิทินแบบแก้ไขได้ - คลิกที่วันเพื่อเพิ่ม/แก้ไขข้อความ
                </p>
                <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '10px 15px', 
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '13px'
                }}>
                    <strong>วิธีใช้งาน:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li><code>editable: true</code> - เปิดโหมดแก้ไข</li>
                        <li>คลิกที่วันเพื่อเพิ่ม/แก้ไขข้อความ</li>
                        <li>กด Enter เพื่อบันทึก (Shift+Enter เพื่อขึ้นบรรทัดใหม่)</li>
                        <li>กด Esc เพื่อยกเลิก</li>
                        <li>ลบข้อความทั้งหมดแล้วบันทึกเพื่อลบ Event</li>
                    </ul>
                </div>
                <CalendarGridControl 
                    control={{
                        initialDate: '20250115', // YYYYMMDD format
                        editable: true, // เปิดโหมดแก้ไข
                        events: {
                            '2025-01-15': 'ประชุมทีม\nห้องประชุม A',
                            '2025-01-20': 'Training Workshop\n09:00 - 16:00',
                            '2025-01-25': 'สัมมนาประจำเดือน',
                            '2025-01-31': 'ส่งรายงาน\nสรุปผลงานเดือนมกราคม'
                        },
                        onChange: (event, rowData, rowIndex) => {
                            addLog(`✏️ Calendar events updated: ${JSON.stringify(event.target.value).substring(0, 100)}...`);
                        },
                        onClick: (dateKey, dateInfo, rowData, rowIndex) => {
                            addLog(`📅 Editing: ${dateKey}`);
                        }
                    }}
                    rowData={{}}
                    rowIndex={0}
                />
            </section>

            {/* Example 7 */}
            <section style={{ marginBottom: '40px' }}>
                <h2>📋 Example 7: Form Control with Grid Layout</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    Form control แบบ Grid Layout - วาง controls ตำแหน่งได้ตามต้องการ
                </p>
                <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '10px 15px', 
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '13px'
                }}>
                    <strong>Features:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li><code>colnumbers/rownumbers</code> - กำหนดจำนวน columns/rows</li>
                        <li><code>colno/rowno</code> - กำหนดตำแหน่งของแต่ละ control</li>
                        <li><code>databind</code> - ผูกข้อมูลแบบ nested (เช่น "user.name")</li>
                        <li><code>label.databind</code> - Label ที่ดึงจาก data</li>
                        <li><code>value.databind</code> - Value ที่ดึงจาก data</li>
                        <li>Auto-update form data เมื่อแก้ไข</li>
                    </ul>
                </div>
                <FormControl 
                    config={{
                        type: "form",
                        colnumbers: 6,
                        rownumbers: 10,
                        data: [
                            {
                                user: {
                                    name: "สมชาย ใจดี",
                                    email: "somchai@example.com",
                                    age: 28,
                                    role: "admin"
                                },
                                labels: {
                                    nameLabel: "ชื่อ-นามสกุล",
                                    emailLabel: "อีเมล",
                                    ageLabel: "อายุ",
                                    roleLabel: "บทบาท"
                                }
                            }
                        ],
                        controls: [
                            {
                                colno: 1,
                                rowno: 1,
                                label: { databind: "labels.nameLabel" },
                                databind: "user.name",
                                type: "textbox",
                            },
                            {
                                colno: 4,
                                rowno: 1,
                                label: { databind: "labels.emailLabel" },
                                databind: "user.email",
                                type: "textbox",
                            },
                            {
                                colno: 1,
                                rowno: 2,
                                label: { databind: "labels.ageLabel" },
                                databind: "user.age",
                                type: "number",
                                min: 1,
                                max: 100
                            },
                            {
                                colno: 3,
                                rowno: 2,
                                label: { databind: "labels.roleLabel" },
                                databind: "user.role",
                                type: "select",
                                options: [
                                    { label: "Admin", value: "admin" },
                                    { label: "User", value: "user" },
                                    { label: "Guest", value: "guest" }
                                ]
                            },
                            {
                                colno: 1,
                                rowno: 3,
                                label: "สถานะ",
                                databind: "user.verified",
                                type: "checkbox",
                                labelText: "ยืนยันตัวตนแล้ว"
                            },
                            {
                                colno: 3,
                                rowno: 3,
                                label: "วันที่เข้าร่วม",
                                databind: "user.joinDate",
                                type: "datepicker",
                            }
                        ],
                        onChange: (event) => {
                            addLog(`📝 Form data updated: ${JSON.stringify(event.target.value).substring(0, 150)}...`);
                        }
                    }}
                />
            </section>

            {/* Example 8 */}
            <section style={{ marginBottom: '40px' }}>
                <h2>📅 Example 8: Date Picker (Buddhist Calendar)</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    Date Picker พร้อมปฏิทินพุทธศักราช - เปิด Calendar Grid Modal
                </p>
                <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '10px 15px', 
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '13px'
                }}>
                    <strong>Features:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>แสดงวันที่เป็นรูปแบบ DD/MM/YYYY (พ.ศ.)</li>
                        <li>คลิกเพื่อเปิด Calendar Grid Modal</li>
                        <li>เลือกวันที่จากปฏิทิน</li>
                        <li>ปุ่มล้างวันที่ (✕)</li>
                        <li>ค่าที่ส่งกลับเป็น YYYY-MM-DD (ค.ศ.)</li>
                        <li>ใช้งานใน Form/Table ได้</li>
                    </ul>
                </div>
                <div style={{ maxWidth: '400px' }}>
                    <DatePickerControl
                        control={{
                            value: '2025-01-15',
                            placeholder: 'เลือกวันที่',
                            onChange: (event, rowData, rowIndex) => {
                                addLog(`📅 Date selected: ${event.target.value} (Display: ${
                                    event.target.value ? new Date(event.target.value).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    }) : 'ไม่มี'
                                })`);
                            }
                        }}
                        rowData={{}}
                        rowIndex={0}
                    />
                </div>
            </section>

            {/* Example 9 */}
            <section style={{ marginBottom: '40px' }}>
                <h2>📋 Example 9: Dropdown with TableView</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    Dropdown ที่แสดงข้อมูลเป็นตาราง - รองรับการค้นหา
                </p>
                <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '10px 15px', 
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '13px'
                }}>
                    <strong>Features:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>แสดงข้อมูลเป็นตารางใน dropdown</li>
                        <li>รองรับการค้นหา (searchable: true)</li>
                        <li>กำหนด key field และ display field</li>
                        <li>คลิกแถวเพื่อเลือก</li>
                        <li>ปุ่มล้างค่า (clearable)</li>
                        <li>Custom table config (headers, controls, etc.)</li>
                    </ul>
                </div>
                <div style={{ maxWidth: '500px' }}>
                    <DropdownControl
                        control={{
                            data: users,
                            keyField: 'id',
                            displayField: 'name',
                            displayFields: ['name', 'email'],
                            searchable: true,
                            searchFields: ['name', 'email', 'role'],
                            clearable: true,
                            placeholder: 'เลือกผู้ใช้...',
                            maxHeight: '400px',
                            tableConfig: {
                                headers: ['รูป', 'ชื่อ', 'อีเมล', 'บทบาท', 'สถานะ'],
                                colwidths: ['60px', 'auto', 'auto', '100px', '80px'],
                                controls: [
                                    {
                                        type: 'image',
                                        databind: 'avatar',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%'
                                    },
                                    {
                                        type: 'label',
                                        databind: 'name'
                                    },
                                    {
                                        type: 'label',
                                        databind: 'email'
                                    },
                                    {
                                        type: 'badge',
                                        databind: 'role',
                                        backgroundColor: (rd) => rd.role === 'admin' ? '#3b82f6' : '#6b7280'
                                    },
                                    {
                                        type: 'badge',
                                        databind: 'status',
                                        backgroundColor: (rd) => rd.status === 'active' ? '#10b981' : '#ef4444'
                                    }
                                ]
                            },
                            onChange: (event, rowData, rowIndex) => {
                                addLog(`🔽 Dropdown selected: ${event.target.selectedRow?.name} (ID: ${event.target.value})`);
                            }
                        }}
                        rowData={{}}
                        rowIndex={0}
                    />
                </div>
            </section>

            {/* Example 10 - Card Control */}
            <section style={{ marginBottom: '40px' }}>
                <h2>🃏 Example 10: Card Control with Form</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    Card Control - แสดงข้อมูลแบบการ์ดโดยใช้ FormControl ภายใน
                </p>
                <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '10px 15px', 
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '13px'
                }}>
                    <strong>Features:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>แสดงข้อมูลเป็น Grid of Cards</li>
                        <li>แต่ละ Card ใช้ FormControl แสดงข้อมูล</li>
                        <li>รองรับ databind array</li>
                        <li>กำหนดจำนวน columns ได้</li>
                        <li>Responsive (auto-adjust columns)</li>
                        <li>Card clickable (optional)</li>
                    </ul>
                </div>

                <h3>ตัวอย่าง: User Cards (3 columns)</h3>
                <CardControl
                    control={{
                        data: users.slice(0, 12),
                        columns: 3,
                        gap: '20px',
                        cardConfig: {
                            colnumbers: 6,
                            controls: [
                                {
                                    colno: 1,
                                    rowno: 1,
                                    colSpan: 6,
                                    type: 'custom',
                                    render: (rowData) => (
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '15px',
                                            marginBottom: '15px',
                                            paddingBottom: '15px',
                                            borderBottom: '1px solid #e5e7eb'
                                        }}>
                                            <img 
                                                src={rowData.avatar} 
                                                alt={rowData.name}
                                                style={{ 
                                                    width: '60px', 
                                                    height: '60px', 
                                                    borderRadius: '50%',
                                                    border: '3px solid #3b82f6'
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ 
                                                    fontWeight: 'bold', 
                                                    fontSize: '16px',
                                                    color: '#1f2937'
                                                }}>
                                                    {rowData.name}
                                                </div>
                                                <div style={{ 
                                                    fontSize: '13px', 
                                                    color: '#6b7280',
                                                    marginTop: '2px'
                                                }}>
                                                    {rowData.email}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    colno: 1,
                                    rowno: 2,
                                    label: 'บทบาท',
                                    databind: 'role',
                                    type: 'badge',
                                    backgroundColor: (rd) => rd.role === 'admin' ? '#3b82f6' : '#6b7280',
                                    color: 'white'
                                },
                                {
                                    colno: 4,
                                    rowno: 2,
                                    label: 'สถานะ',
                                    databind: 'status',
                                    type: 'badge',
                                    backgroundColor: (rd) => rd.status === 'active' ? '#10b981' : '#ef4444',
                                    color: 'white'
                                },
                                {
                                    colno: 1,
                                    rowno: 3,
                                    label: 'อายุ',
                                    databind: 'age',
                                    type: 'label',
                                    style: { fontSize: '14px', color: '#374151' }
                                },
                                {
                                    colno: 4,
                                    rowno: 3,
                                    label: 'ยืนยัน',
                                    databind: 'verified',
                                    type: 'toggle'
                                },
                                {
                                    colno: 1,
                                    rowno: 4,
                                    colSpan: 6,
                                    label: 'ความคืบหน้า',
                                    databind: 'progress',
                                    type: 'progress',
                                    showValue: true,
                                    color: '#3b82f6'
                                }
                            ]
                        },
                        onCardClick: (event, cardData, index) => {
                            addLog(`🃏 Card clicked: ${cardData.name} (Index: ${index})`);
                        }
                    }}
                />

                <h3 style={{ marginTop: '40px' }}>ตัวอย่าง: Product Cards (4 columns)</h3>
                <CardControl
                    control={{
                        data: [
                            {
                                id: 1,
                                name: 'MacBook Pro 16"',
                                price: 89900,
                                stock: 15,
                                category: 'Laptop',
                                rating: 4.8,
                                image: 'https://via.placeholder.com/200/3b82f6/ffffff?text=MacBook'
                            },
                            {
                                id: 2,
                                name: 'iPhone 15 Pro',
                                price: 44900,
                                stock: 25,
                                category: 'Phone',
                                rating: 4.9,
                                image: 'https://via.placeholder.com/200/10b981/ffffff?text=iPhone'
                            },
                            {
                                id: 3,
                                name: 'iPad Air',
                                price: 24900,
                                stock: 8,
                                category: 'Tablet',
                                rating: 4.7,
                                image: 'https://via.placeholder.com/200/f59e0b/ffffff?text=iPad'
                            },
                            {
                                id: 4,
                                name: 'AirPods Pro',
                                price: 8900,
                                stock: 50,
                                category: 'Audio',
                                rating: 4.6,
                                image: 'https://via.placeholder.com/200/8b5cf6/ffffff?text=AirPods'
                            }
                        ],
                        columns: 4,
                        gap: '15px',
                        cardConfig: {
                            colnumbers: 4,
                            controls: [
                                {
                                    colno: 1,
                                    rowno: 1,
                                    colSpan: 4,
                                    type: 'custom',
                                    render: (rowData) => (
                                        <img 
                                            src={rowData.image} 
                                            alt={rowData.name}
                                            style={{ 
                                                width: '100%', 
                                                height: '150px',
                                                objectFit: 'cover',
                                                borderRadius: '6px',
                                                marginBottom: '15px'
                                            }}
                                        />
                                    )
                                },
                                {
                                    colno: 1,
                                    rowno: 2,
                                    colSpan: 4,
                                    type: 'custom',
                                    render: (rowData) => (
                                        <div style={{ 
                                            fontSize: '16px', 
                                            fontWeight: 'bold',
                                            color: '#1f2937',
                                            marginBottom: '8px'
                                        }}>
                                            {rowData.name}
                                        </div>
                                    )
                                },
                                {
                                    colno: 1,
                                    rowno: 3,
                                    colSpan: 2,
                                    type: 'custom',
                                    render: (rowData) => (
                                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                                            ฿ {rowData.price.toLocaleString()}
                                        </div>
                                    )
                                },
                                {
                                    colno: 3,
                                    rowno: 3,
                                    colSpan: 2,
                                    type: 'custom',
                                    render: (rowData) => (
                                        <div style={{ 
                                            fontSize: '13px', 
                                            color: rowData.stock > 10 ? '#10b981' : '#ef4444',
                                            textAlign: 'right'
                                        }}>
                                            คงเหลือ: {rowData.stock}
                                        </div>
                                    )
                                },
                                {
                                    colno: 1,
                                    rowno: 4,
                                    colSpan: 4,
                                    databind: 'category',
                                    type: 'badge',
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151'
                                }
                            ]
                        },
                        onCardClick: (event, cardData, index) => {
                            addLog(`🛒 Product clicked: ${cardData.name} - ฿${cardData.price.toLocaleString()}`);
                        }
                    }}
                />

                <div style={{ 
                    marginTop: '20px',
                    padding: '15px', 
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe'
                }}>
                    <strong>💡 Code Example:</strong>
                    <pre style={{ 
                        backgroundColor: '#1e1e1e', 
                        color: '#d4d4d4', 
                        padding: '15px', 
                        borderRadius: '6px',
                        overflow: 'auto',
                        marginTop: '10px'
                    }}>{`<CardControl control={{
  data: users,
  columns: 3,
  gap: '20px',
  cardConfig: {
    colnumbers: 6,
    controls: [
      {
        colno: 1,
        rowno: 1,
        label: 'ชื่อ',
        databind: 'name',
        type: 'label'
      },
      {
        colno: 1,
        rowno: 2,
        label: 'อีเมล',
        databind: 'email',
        type: 'textbox'
      }
    ]
  },
  onCardClick: (event, data, index) => {
    console.log('Clicked:', data);
  }
}} />`}</pre>
                </div>
            </section>

            {/* Example 11 - Accordion Control */}
            <section style={{ marginBottom: '40px' }}>
                <h2>📂 Example 11: Accordion Control with Form</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    Accordion Control - แสดงข้อมูลแบบพับเก็บได้ โดยใช้ FormControl ภายใน
                </p>
                <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '10px 15px', 
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '13px'
                }}>
                    <strong>Features:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>แสดงข้อมูลแบบ Accordion (พับเก็บได้)</li>
                        <li>แต่ละ Panel ใช้ FormControl แสดงข้อมูล</li>
                        <li>เปิด/ปิดทีละ Panel หรือหลาย Panel พร้อมกัน</li>
                        <li>รองรับ Icon และ Custom Content</li>
                        <li>Smooth animation</li>
                        <li>Disabled state support</li>
                    </ul>
                </div>

                <h3>ตัวอย่าง: User Information Accordion (Single Open)</h3>
                <AccordionControl
                    control={{
                        data: [
                            {
                                title: 'ข้อมูลส่วนตัว',
                                icon: '👤',
                                content: {
                                    colnumbers: 6,
                                    data: [{
                                        firstName: 'สมชาย',
                                        lastName: 'ใจดี',
                                        email: 'somchai@example.com',
                                        phone: '081-234-5678',
                                        birthDate: '1990-05-15'
                                    }],
                                    controls: [
                                        {
                                            colno: 1,
                                            rowno: 1,
                                            colSpan: 3,
                                            label: 'ชื่อ',
                                            databind: 'firstName',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 4,
                                            rowno: 1,
                                            colSpan: 3,
                                            label: 'นามสกุล',
                                            databind: 'lastName',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 2,
                                            colSpan: 3,
                                            label: 'อีเมล',
                                            databind: 'email',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 4,
                                            rowno: 2,
                                            colSpan: 3,
                                            label: 'เบอร์โทร',
                                            databind: 'phone',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 3,
                                            colSpan: 3,
                                            label: 'วันเกิด',
                                            databind: 'birthDate',
                                            type: 'datepicker'
                                        }
                                    ]
                                }
                            },
                            {
                                title: 'ที่อยู่',
                                icon: '📍',
                                content: {
                                    colnumbers: 6,
                                    data: [{
                                        address: '123 ถนนสุขุมวิท',
                                        district: 'คลองเตย',
                                        province: 'กรุงเทพมหานคร',
                                        zipcode: '10110'
                                    }],
                                    controls: [
                                        {
                                            colno: 1,
                                            rowno: 1,
                                            colSpan: 6,
                                            label: 'ที่อยู่',
                                            databind: 'address',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 2,
                                            colSpan: 3,
                                            label: 'แขวง/ตำบล',
                                            databind: 'district',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 4,
                                            rowno: 2,
                                            colSpan: 3,
                                            label: 'จังหวัด',
                                            databind: 'province',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 3,
                                            colSpan: 2,
                                            label: 'รหัสไปรษณีย์',
                                            databind: 'zipcode',
                                            type: 'textbox'
                                        }
                                    ]
                                }
                            },
                            {
                                title: 'การทำงาน',
                                icon: '💼',
                                content: {
                                    colnumbers: 6,
                                    data: [{
                                        company: 'ABC Company Ltd.',
                                        position: 'Senior Developer',
                                        department: 'IT',
                                        salary: 50000,
                                        startDate: '2020-01-15'
                                    }],
                                    controls: [
                                        {
                                            colno: 1,
                                            rowno: 1,
                                            colSpan: 3,
                                            label: 'บริษัท',
                                            databind: 'company',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 4,
                                            rowno: 1,
                                            colSpan: 3,
                                            label: 'ตำแหน่ง',
                                            databind: 'position',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 2,
                                            colSpan: 3,
                                            label: 'แผนก',
                                            databind: 'department',
                                            type: 'select',
                                            options: [
                                                { label: 'IT', value: 'IT' },
                                                { label: 'HR', value: 'HR' },
                                                { label: 'Finance', value: 'Finance' }
                                            ]
                                        },
                                        {
                                            colno: 4,
                                            rowno: 2,
                                            colSpan: 3,
                                            label: 'เงินเดือน',
                                            databind: 'salary',
                                            type: 'number',
                                            min: 0,
                                            step: 1000
                                        },
                                        {
                                            colno: 1,
                                            rowno: 3,
                                            colSpan: 3,
                                            label: 'วันที่เริ่มงาน',
                                            databind: 'startDate',
                                            type: 'datepicker'
                                        }
                                    ]
                                }
                            },
                            {
                                title: 'การตั้งค่า (Disabled)',
                                icon: '⚙️',
                                disabled: true,
                                content: {
                                    colnumbers: 6,
                                    data: [{}],
                                    controls: []
                                }
                            }
                        ],
                        allowMultiple: false,
                        defaultOpen: [0],
                        onToggle: (event, item, index, isOpen) => {
                            addLog(`📂 Accordion toggled: ${item.title} - ${isOpen ? 'Opened' : 'Closed'}`);
                        }
                    }}
                />

                <h3 style={{ marginTop: '40px' }}>ตัวอย่าง: FAQ Accordion (Multiple Open)</h3>
                <AccordionControl
                    control={{
                        data: [
                            {
                                title: 'CardControl คืออะไร?',
                                icon: '❓',
                                customContent: (
                                    <div style={{ padding: '10px', fontSize: '14px', lineHeight: '1.6' }}>
                                        <p style={{ margin: 0 }}>
                                            CardControl เป็น Component ที่ใช้แสดงข้อมูลแบบการ์ด (Grid Layout) 
                                            โดยรับ array data และใช้ FormControl แสดงข้อมูลในแต่ละการ์ด 
                                            รองรับ responsive และ clickable cards
                                        </p>
                                    </div>
                                )
                            },
                            {
                                title: 'วิธีใช้งาน AccordionControl',
                                icon: '📖',
                                customContent: (
                                    <div style={{ padding: '10px' }}>
                                        <pre style={{ 
                                            backgroundColor: '#1e1e1e', 
                                            color: '#d4d4d4', 
                                            padding: '15px', 
                                            borderRadius: '6px',
                                            overflow: 'auto',
                                            fontSize: '13px'
                                        }}>{`<AccordionControl control={{
  data: [
    {
      title: 'Panel 1',
      icon: '📌',
      content: {
        colnumbers: 6,
        controls: [...]
      }
    }
  ],
  allowMultiple: true,
  defaultOpen: [0]
}} />`}</pre>
                                    </div>
                                )
                            },
                            {
                                title: 'Control Types ที่รองรับ',
                                icon: '🎨',
                                customContent: (
                                    <div style={{ padding: '10px', fontSize: '14px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                            {[
                                                'Label', 'Textbox', 'Number', 'Select', 'Checkbox', 'Toggle',
                                                'Date', 'DatePicker', 'Button', 'Link', 'Image', 'Badge',
                                                'Icon', 'Progress', 'Calendar', 'Dropdown', 'QRCode', 'Custom'
                                            ].map((type, idx) => (
                                                <div key={idx} style={{ 
                                                    padding: '8px', 
                                                    backgroundColor: '#f3f4f6', 
                                                    borderRadius: '4px',
                                                    textAlign: 'center',
                                                    fontSize: '13px'
                                                }}>
                                                    {type}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }
                        ],
                        allowMultiple: true,
                        defaultOpen: [0, 1],
                        onToggle: (event, item, index, isOpen) => {
                            addLog(`❓ FAQ toggled: ${item.title}`);
                        }
                    }}
                />

                <div style={{ 
                    marginTop: '20px',
                    padding: '15px', 
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe'
                }}>
                    <strong>💡 Code Example:</strong>
                    <pre style={{ 
                        backgroundColor: '#1e1e1e', 
                        color: '#d4d4d4', 
                        padding: '15px', 
                        borderRadius: '6px',
                        overflow: 'auto',
                        marginTop: '10px'
                    }}>{`<AccordionControl control={{
  data: [
    {
      title: 'Personal Info',
      icon: '👤',
      content: {
        colnumbers: 6,
        data: [{ name: 'John', email: 'john@test.com' }],
        controls: [
          {
            colno: 1,
            rowno: 1,
            label: 'Name',
            databind: 'name',
            type: 'textbox'
          }
        ]
      }
    }
  ],
  allowMultiple: false,  // Single panel open
  defaultOpen: [0],      // First panel open by default
  onToggle: (event, item, index, isOpen) => {
    console.log('Toggled:', item.title, isOpen);
  }
}} />`}</pre>
                </div>
            </section>

            {/* Example 12 - Button Group Control */}
            <section style={{ marginBottom: '40px' }}>
                <h2>🔘 Example 12: Button Group Selection</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    Button Group Control - เลือกตัวเลือกแบบปุ่ม (Single/Multiple Selection)
                </p>
                <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '10px 15px', 
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '13px'
                }}>
                    <strong>Features:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>Single selection (radio-like)</li>
                        <li>Multiple selection (checkbox-like)</li>
                        <li>Horizontal/Vertical orientation</li>
                        <li>Icon support</li>
                        <li>Custom button styles</li>
                        <li>Disabled state</li>
                    </ul>
                </div>

                <h3>Single Selection (Radio-like)</h3>
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '500' }}>เลือกขนาด:</div>
                    <ButtonGroupControl
                        control={{
                            options: [
                                { label: 'Small', value: 'S' },
                                { label: 'Medium', value: 'M' },
                                { label: 'Large', value: 'L' },
                                { label: 'X-Large', value: 'XL' }
                            ],
                            value: 'M',
                            multiple: false,
                            buttonClassName: 'btn-outline',
                            selectedClassName: 'btn-primary',
                            orientation: 'horizontal',
                            onChange: (event) => {
                                addLog(`👕 Size selected: ${event.target.value}`);
                            }
                        }}
                    />
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '500' }}>เลือกสี:</div>
                    <ButtonGroupControl
                        control={{
                            options: [
                                { label: '🔴 Red', value: 'red' },
                                { label: '🔵 Blue', value: 'blue' },
                                { label: '🟢 Green', value: 'green' },
                                { label: '🟡 Yellow', value: 'yellow' }
                            ],
                            value: 'blue',
                            multiple: false,
                            buttonClassName: 'btn-outline',
                            selectedClassName: 'btn-success',
                            orientation: 'horizontal',
                            onChange: (event) => {
                                addLog(`🎨 Color selected: ${event.target.value}`);
                            }
                        }}
                    />
                </div>

                <h3 style={{ marginTop: '30px' }}>Multiple Selection (Checkbox-like)</h3>
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '500' }}>เลือกทักษะ (เลือกได้หลายตัว):</div>
                    <ButtonGroupControl
                        control={{
                            options: [
                                { label: 'JavaScript', value: 'js', icon: '📜' },
                                { label: 'Python', value: 'py', icon: '🐍' },
                                { label: 'Java', value: 'java', icon: '☕' },
                                { label: 'C++', value: 'cpp', icon: '⚙️' },
                                { label: 'Go', value: 'go', icon: '🔷' },
                                { label: 'Rust', value: 'rust', icon: '🦀' }
                            ],
                            value: ['js', 'py'],
                            multiple: true,
                            buttonClassName: 'btn-outline',
                            selectedClassName: 'btn-primary',
                            orientation: 'horizontal',
                            onChange: (event) => {
                                addLog(`💻 Skills selected: ${event.target.value.join(', ')}`);
                            }
                        }}
                    />
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '500' }}>เลือกวันทำงาน:</div>
                    <ButtonGroupControl
                        control={{
                            options: [
                                { label: 'จ', value: 'mon' },
                                { label: 'อ', value: 'tue' },
                                { label: 'พ', value: 'wed' },
                                { label: 'พฤ', value: 'thu' },
                                { label: 'ศ', value: 'fri' },
                                { label: 'ส', value: 'sat', disabled: true },
                                { label: 'อา', value: 'sun', disabled: true }
                            ],
                            value: ['mon', 'tue', 'wed', 'thu', 'fri'],
                            multiple: true,
                            buttonClassName: 'btn-outline',
                            selectedClassName: 'btn-success',
                            orientation: 'horizontal',
                            onChange: (event) => {
                                addLog(`📅 Work days: ${event.target.value.join(', ')}`);
                            }
                        }}
                    />
                </div>

                <h3 style={{ marginTop: '30px' }}>Vertical Orientation</h3>
                <div style={{ maxWidth: '300px', marginBottom: '30px' }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '500' }}>เลือกระดับ:</div>
                    <ButtonGroupControl
                        control={{
                            options: [
                                { label: '⭐ Beginner', value: '1' },
                                { label: '⭐⭐ Intermediate', value: '2' },
                                { label: '⭐⭐⭐ Advanced', value: '3' },
                                { label: '⭐⭐⭐⭐ Expert', value: '4' }
                            ],
                            value: '2',
                            multiple: false,
                            buttonClassName: 'btn-outline',
                            selectedClassName: 'btn-warning',
                            orientation: 'vertical',
                            onChange: (event) => {
                                addLog(`🎯 Level selected: ${event.target.value}`);
                            }
                        }}
                    />
                </div>

                <h3 style={{ marginTop: '30px' }}>Custom Styles</h3>
                <div style={{ marginBottom: '30px' }}>
                    <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '500' }}>เลือกธีม:</div>
                    <ButtonGroupControl
                        control={{
                            options: [
                                { label: '☀️ Light', value: 'light' },
                                { label: '🌙 Dark', value: 'dark' },
                                { label: '🌈 Auto', value: 'auto' }
                            ],
                            value: 'light',
                            multiple: false,
                            buttonClassName: 'btn-secondary',
                            selectedClassName: 'btn-primary',
                            buttonStyle: {
                                minWidth: '120px',
                                fontSize: '15px',
                                padding: '10px 20px'
                            },
                            orientation: 'horizontal',
                            onChange: (event) => {
                                addLog(`🎨 Theme: ${event.target.value}`);
                            }
                        }}
                    />
                </div>

                <div style={{ 
                    marginTop: '20px',
                    padding: '15px', 
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe'
                }}>
                    <strong>💡 Code Example:</strong>
                    <pre style={{ 
                        backgroundColor: '#1e1e1e', 
                        color: '#d4d4d4', 
                        padding: '15px', 
                        borderRadius: '6px',
                        overflow: 'auto',
                        marginTop: '10px'
                    }}>{`// Single Selection
<ButtonGroupControl control={{
  options: [
    { label: 'Small', value: 'S' },
    { label: 'Medium', value: 'M' },
    { label: 'Large', value: 'L' }
  ],
  value: 'M',
  multiple: false,
  buttonClassName: 'btn-outline',
  selectedClassName: 'btn-primary',
  onChange: (event) => {
    console.log(event.target.value); // 'M'
  }
}} />

// Multiple Selection
<ButtonGroupControl control={{
  options: [
    { label: 'JS', value: 'js', icon: '📜' },
    { label: 'Python', value: 'py', icon: '🐍' }
  ],
  value: ['js', 'py'],
  multiple: true,
  onChange: (event) => {
    console.log(event.target.value); // ['js', 'py']
  }
}} />

// Vertical Orientation
<ButtonGroupControl control={{
  options: [...],
  orientation: 'vertical',
  buttonStyle: {
    minWidth: '200px'
  }
}} />`}</pre>
                </div>
            </section>

            {/* Example 13 - Tab Control */}
            <section style={{ marginBottom: '40px' }}>
                <h2>📑 Example 13: Tab Control with Forms</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    Tab Control - แสดงข้อมูลแบบแท็บ (Tabs) โดยใช้ FormControl ภายใน
                </p>
                <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '10px 15px', 
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '13px'
                }}>
                    <strong>Features:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>Tab navigation (top/bottom/left/right)</li>
                        <li>แต่ละ Tab ใช้ FormControl แสดงข้อมูล</li>
                        <li>Icon support</li>
                        <li>Disabled tabs</li>
                        <li>Smooth animation</li>
                        <li>Responsive (vertical tabs → horizontal บนมือถือ)</li>
                    </ul>
                </div>

                <h3>ตัวอย่าง: User Profile Tabs (Top)</h3>
                <TabControl
                    control={{
                        tabs: [
                            {
                                label: 'ข้อมูลส่วนตัว',
                                value: 'personal',
                                icon: '👤',
                                content: {
                                    colnumbers: 6,
                                    data: [{
                                        firstName: 'สมชาย',
                                        lastName: 'ใจดี',
                                        email: 'somchai@example.com',
                                        phone: '081-234-5678',
                                        birthDate: '1990-05-15',
                                        gender: 'male'
                                    }],
                                    controls: [
                                        {
                                            colno: 1,
                                            rowno: 1,
                                            colSpan: 3,
                                            label: 'ชื่อ',
                                            databind: 'firstName',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 4,
                                            rowno: 1,
                                            colSpan: 3,
                                            label: 'นามสกุล',
                                            databind: 'lastName',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 2,
                                            colSpan: 3,
                                            label: 'อีเมล',
                                            databind: 'email',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 4,
                                            rowno: 2,
                                            colSpan: 3,
                                            label: 'เบอร์โทร',
                                            databind: 'phone',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 3,
                                            colSpan: 3,
                                            label: 'วันเกิด',
                                            databind: 'birthDate',
                                            type: 'datepicker'
                                        },
                                        {
                                            colno: 4,
                                            rowno: 3,
                                            colSpan: 3,
                                            label: 'เพศ',
                                            databind: 'gender',
                                            type: 'select',
                                            options: [
                                                { label: 'ชาย', value: 'male' },
                                                { label: 'หญิง', value: 'female' },
                                                { label: 'ไม่ระบุ', value: 'other' }
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                label: 'ที่อยู่',
                                value: 'address',
                                icon: '📍',
                                content: {
                                    colnumbers: 6,
                                    data: [{
                                        address: '123 ถนนสุขุมวิท',
                                        district: 'คลองเตย',
                                        subDistrict: 'คลองตัน',
                                        province: 'กรุงเทพมหานคร',
                                        zipcode: '10110',
                                        country: 'ไทย'
                                    }],
                                    controls: [
                                        {
                                            colno: 1,
                                            rowno: 1,
                                            colSpan: 6,
                                            label: 'ที่อยู่',
                                            databind: 'address',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 2,
                                            colSpan: 3,
                                            label: 'แขวง/ตำบล',
                                            databind: 'subDistrict',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 4,
                                            rowno: 2,
                                            colSpan: 3,
                                            label: 'เขต/อำเภอ',
                                            databind: 'district',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 3,
                                            colSpan: 3,
                                            label: 'จังหวัด',
                                            databind: 'province',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 4,
                                            rowno: 3,
                                            colSpan: 2,
                                            label: 'รหัสไปรษณีย์',
                                            databind: 'zipcode',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 4,
                                            colSpan: 3,
                                            label: 'ประเทศ',
                                            databind: 'country',
                                            type: 'textbox'
                                        }
                                    ]
                                }
                            },
                            {
                                label: 'การทำงาน',
                                value: 'work',
                                icon: '💼',
                                content: {
                                    colnumbers: 6,
                                    data: [{
                                        company: 'ABC Company Ltd.',
                                        position: 'Senior Developer',
                                        department: 'IT',
                                        salary: 50000,
                                        startDate: '2020-01-15',
                                        employeeType: 'full-time'
                                    }],
                                    controls: [
                                        {
                                            colno: 1,
                                            rowno: 1,
                                            colSpan: 4,
                                            label: 'บริษัท',
                                            databind: 'company',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 5,
                                            rowno: 1,
                                            colSpan: 2,
                                            label: 'ประเภท',
                                            databind: 'employeeType',
                                            type: 'select',
                                            options: [
                                                { label: 'Full-time', value: 'full-time' },
                                                { label: 'Part-time', value: 'part-time' },
                                                { label: 'Contract', value: 'contract' }
                                            ]
                                        },
                                        {
                                            colno: 1,
                                            rowno: 2,
                                            colSpan: 3,
                                            label: 'ตำแหน่ง',
                                            databind: 'position',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 4,
                                            rowno: 2,
                                            colSpan: 3,
                                            label: 'แผนก',
                                            databind: 'department',
                                            type: 'select',
                                            options: [
                                                { label: 'IT', value: 'IT' },
                                                { label: 'HR', value: 'HR' },
                                                { label: 'Finance', value: 'Finance' },
                                                { label: 'Marketing', value: 'Marketing' }
                                            ]
                                        },
                                        {
                                            colno: 1,
                                            rowno: 3,
                                            colSpan: 3,
                                            label: 'เงินเดือน',
                                            databind: 'salary',
                                            type: 'number',
                                            min: 0,
                                            step: 1000
                                        },
                                        {
                                            colno: 4,
                                            rowno: 3,
                                            colSpan: 3,
                                            label: 'วันที่เริ่มงาน',
                                            databind: 'startDate',
                                            type: 'datepicker'
                                        }
                                    ]
                                }
                            },
                            {
                                label: 'การตั้งค่า',
                                value: 'settings',
                                icon: '⚙️',
                                disabled: true,
                                customContent: (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af' }}>
                                        การตั้งค่าไม่พร้อมใช้งานในขณะนี้
                                    </div>
                                )
                            }
                        ],
                        activeTab: 'personal',
                        tabPosition: 'top',
                        onTabChange: (event, tab) => {
                            addLog(`📑 Tab changed: ${tab.label}`);
                        }
                    }}
                />

                <h3 style={{ marginTop: '40px' }}>ตัวอย่าง: Settings Tabs (Left)</h3>
                <TabControl
                    control={{
                        tabs: [
                            {
                                label: 'ทั่วไป',
                                value: 'general',
                                icon: '🔧',
                                content: {
                                    colnumbers: 4,
                                    data: [{
                                        siteName: 'My Website',
                                        siteUrl: 'https://example.com',
                                        language: 'th',
                                        timezone: 'Asia/Bangkok'
                                    }],
                                    controls: [
                                        {
                                            colno: 1,
                                            rowno: 1,
                                            colSpan: 4,
                                            label: 'ชื่อเว็บไซต์',
                                            databind: 'siteName',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 2,
                                            colSpan: 4,
                                            label: 'URL',
                                            databind: 'siteUrl',
                                            type: 'textbox'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 3,
                                            colSpan: 2,
                                            label: 'ภาษา',
                                            databind: 'language',
                                            type: 'select',
                                            options: [
                                                { label: 'ไทย', value: 'th' },
                                                { label: 'English', value: 'en' }
                                            ]
                                        },
                                        {
                                            colno: 3,
                                            rowno: 3,
                                            colSpan: 2,
                                            label: 'Timezone',
                                            databind: 'timezone',
                                            type: 'select',
                                            options: [
                                                { label: 'Bangkok', value: 'Asia/Bangkok' },
                                                { label: 'Tokyo', value: 'Asia/Tokyo' }
                                            ]
                                        }
                                    ]
                                }
                            },
                            {
                                label: 'ความปลอดภัย',
                                value: 'security',
                                icon: '🔒',
                                content: {
                                    colnumbers: 4,
                                    data: [{
                                        twoFactor: true,
                                        sessionTimeout: 30,
                                        passwordExpiry: 90
                                    }],
                                    controls: [
                                        {
                                            colno: 1,
                                            rowno: 1,
                                            colSpan: 4,
                                            label: 'Two-Factor Authentication',
                                            databind: 'twoFactor',
                                            type: 'toggle'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 2,
                                            colSpan: 2,
                                            label: 'Session Timeout (นาที)',
                                            databind: 'sessionTimeout',
                                            type: 'number',
                                            min: 5,
                                            max: 120
                                        },
                                        {
                                            colno: 3,
                                            rowno: 2,
                                            colSpan: 2,
                                            label: 'Password Expiry (วัน)',
                                            databind: 'passwordExpiry',
                                            type: 'number',
                                            min: 30,
                                            max: 365
                                        }
                                    ]
                                }
                            },
                            {
                                label: 'การแจ้งเตือน',
                                value: 'notifications',
                                icon: '🔔',
                                content: {
                                    colnumbers: 4,
                                    data: [{
                                        emailNotif: true,
                                        smsNotif: false,
                                        pushNotif: true
                                    }],
                                    controls: [
                                        {
                                            colno: 1,
                                            rowno: 1,
                                            colSpan: 4,
                                            label: 'Email Notifications',
                                            databind: 'emailNotif',
                                            type: 'toggle'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 2,
                                            colSpan: 4,
                                            label: 'SMS Notifications',
                                            databind: 'smsNotif',
                                            type: 'toggle'
                                        },
                                        {
                                            colno: 1,
                                            rowno: 3,
                                            colSpan: 4,
                                            label: 'Push Notifications',
                                            databind: 'pushNotif',
                                            type: 'toggle'
                                        }
                                    ]
                                }
                            }
                        ],
                        activeTab: 'general',
                        tabPosition: 'left',
                        onTabChange: (event, tab) => {
                            addLog(`⚙️ Settings tab: ${tab.label}`);
                        }
                    }}
                />

                <div style={{ 
                    marginTop: '20px',
                    padding: '15px', 
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe'
                }}>
                    <strong>💡 Code Example:</strong>
                    <pre style={{ 
                        backgroundColor: '#1e1e1e', 
                        color: '#d4d4d4', 
                        padding: '15px', 
                        borderRadius: '6px',
                        overflow: 'auto',
                        marginTop: '10px'
                    }}>{`<TabControl control={{
  tabs: [
    {
      label: 'Personal Info',
      value: 'personal',
      icon: '👤',
      content: {
        colnumbers: 6,
        data: [{ name: 'John', email: 'john@test.com' }],
        controls: [
          {
            colno: 1,
            rowno: 1,
            label: 'Name',
            databind: 'name',
            type: 'textbox'
          }
        ]
      }
    },
    {
      label: 'Settings',
      value: 'settings',
      icon: '⚙️',
      disabled: true
    }
  ],
  activeTab: 'personal',
  tabPosition: 'top',  // top | bottom | left | right
  onTabChange: (event, tab) => {
    console.log('Tab changed:', tab.label);
  }
}} />`}</pre>
                </div>
            </section>

            {/* Example 14 - Tree Control */}
            <section style={{ marginBottom: '40px' }}>
                <h2>🌳 Example 14: Tree Control</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    Tree Control - แสดงข้อมูลแบบ Hierarchical Tree Structure พร้อม expand/collapse และ checkbox selection
                </p>
                <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '10px 15px', 
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '13px'
                }}>
                    <strong>Features:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>Expandable/Collapsible nodes</li>
                        <li>Checkbox selection (single/multiple)</li>
                        <li>Custom icons for nodes</li>
                        <li>FormControl integration</li>
                        <li>Search/filter support</li>
                        <li>Parent-child relationship</li>
                    </ul>
                </div>

                <h3>ตัวอย่าง: File System Tree</h3>
                <TreeControl
                    control={{
                        data: [
                            {
                                label: 'Documents',
                                value: 'documents',
                                icon: '📁',
                                children: [
                                    {
                                        label: 'Work',
                                        value: 'work',
                                        icon: '💼',
                                        children: [
                                            { label: 'Project_A.docx', value: 'project_a', icon: '📄' },
                                            { label: 'Report_2024.xlsx', value: 'report_2024', icon: '📊' },
                                            { label: 'Presentation.pptx', value: 'presentation', icon: '📽️' }
                                        ]
                                    },
                                    {
                                        label: 'Personal',
                                        value: 'personal',
                                        icon: '🏠',
                                        children: [
                                            { label: 'Resume.pdf', value: 'resume', icon: '📃' },
                                            { label: 'Photos', value: 'photos', icon: '🖼️', children: [
                                                { label: 'Vacation_2024.jpg', value: 'vacation', icon: '🏖️' },
                                                { label: 'Family.jpg', value: 'family', icon: '👨‍👩‍👧‍👦' }
                                            ]}
                                        ]
                                    }
                                ]
                            },
                            {
                                label: 'Downloads',
                                value: 'downloads',
                                icon: '⬇️',
                                children: [
                                    { label: 'setup.exe', value: 'setup', icon: '⚙️' },
                                    { label: 'document.pdf', value: 'document', icon: '📕' }
                                ]
                            },
                            {
                                label: 'Projects',
                                value: 'projects',
                                icon: '🚀',
                                children: [
                                    {
                                        label: 'React App',
                                        value: 'react_app',
                                        icon: '⚛️',
                                        children: [
                                            { label: 'src', value: 'src', icon: '📂', children: [
                                                { label: 'App.jsx', value: 'app_jsx', icon: '📄' },
                                                { label: 'index.js', value: 'index_js', icon: '📄' }
                                            ]},
                                            { label: 'package.json', value: 'package_json', icon: '📦' },
                                            { label: 'README.md', value: 'readme', icon: '📖' }
                                        ]
                                    }
                                ]
                            }
                        ],
                        checkable: true,
                        multiple: true,
                        defaultExpanded: ['documents', 'work', 'projects'],
                        defaultChecked: ['project_a'],
                        showLine: true,
                        onSelect: (event, node) => {
                            addLog(`📂 Selected: ${node.label}`);
                        },
                        onCheck: (event, node, checked) => {
                            addLog(`${checked ? '☑️' : '⬜'} ${checked ? 'Checked' : 'Unchecked'}: ${node.label}`);
                        },
                        onExpand: (event, node, expanded) => {
                            addLog(`${expanded ? '📂' : '📁'} ${expanded ? 'Expanded' : 'Collapsed'}: ${node.label}`);
                        }
                    }}
                />

                <h3 style={{ marginTop: '40px' }}>ตัวอย่าง: Organization Tree (No Checkboxes)</h3>
                <TreeControl
                    control={{
                        data: [
                            {
                                label: 'CEO - สมชาย ใจดี',
                                value: 'ceo',
                                icon: '👔',
                                children: [
                                    {
                                        label: 'CTO - วิชัย เทคโนโลยี',
                                        value: 'cto',
                                        icon: '💻',
                                        children: [
                                            {
                                                label: 'Development Team',
                                                value: 'dev_team',
                                                icon: '👨‍💻',
                                                children: [
                                                    { label: 'Frontend Dev - อนุชา', value: 'frontend_dev', icon: '🎨' },
                                                    { label: 'Backend Dev - สุชาติ', value: 'backend_dev', icon: '⚙️' },
                                                    { label: 'Mobile Dev - ปรีชา', value: 'mobile_dev', icon: '📱' }
                                                ]
                                            },
                                            {
                                                label: 'QA Team',
                                                value: 'qa_team',
                                                icon: '🔍',
                                                children: [
                                                    { label: 'QA Lead - สมหญิง', value: 'qa_lead', icon: '✅' },
                                                    { label: 'Tester - วิไล', value: 'tester', icon: '🧪' }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        label: 'CFO - มานี การเงิน',
                                        value: 'cfo',
                                        icon: '💰',
                                        children: [
                                            { label: 'Accounting - บัญชี', value: 'accounting', icon: '📊' },
                                            { label: 'Finance - การเงิน', value: 'finance', icon: '💵' }
                                        ]
                                    },
                                    {
                                        label: 'CMO - สมศรี การตลาด',
                                        value: 'cmo',
                                        icon: '📢',
                                        children: [
                                            { label: 'Marketing Team', value: 'marketing', icon: '📱' },
                                            { label: 'Sales Team', value: 'sales', icon: '💼' }
                                        ]
                                    }
                                ]
                            }
                        ],
                        checkable: false,
                        defaultExpanded: ['ceo', 'cto'],
                        showLine: true,
                        onSelect: (event, node) => {
                            addLog(`👤 Selected employee: ${node.label}`);
                        },
                        onExpand: (event, node, expanded) => {
                            addLog(`${expanded ? '➕' : '➖'} ${node.label}`);
                        }
                    }}
                />

                <h3 style={{ marginTop: '40px' }}>ตัวอย่าง: Menu Tree with FormControl</h3>
                <TreeControl
                    control={{
                        data: [
                            {
                                label: 'Dashboard',
                                value: 'dashboard',
                                icon: '📊',
                                path: '/dashboard',
                                description: 'แดชบอร์ดหลัก'
                            },
                            {
                                label: 'Users',
                                value: 'users',
                                icon: '👥',
                                path: '/users',
                                description: 'จัดการผู้ใช้งาน',
                                children: [
                                    { 
                                        label: 'User List', 
                                        value: 'user_list', 
                                        icon: '📋',
                                        path: '/users/list',
                                        description: 'รายการผู้ใช้ทั้งหมด'
                                    },
                                    { 
                                        label: 'Add User', 
                                        value: 'user_add', 
                                        icon: '➕',
                                        path: '/users/add',
                                        description: 'เพิ่มผู้ใช้ใหม่'
                                    },
                                    { 
                                        label: 'User Roles', 
                                        value: 'user_roles', 
                                        icon: '🎭',
                                        path: '/users/roles',
                                        description: 'จัดการบทบาทผู้ใช้'
                                    }
                                ]
                            },
                            {
                                label: 'Settings',
                                value: 'settings',
                                icon: '⚙️',
                                path: '/settings',
                                description: 'ตั้งค่าระบบ',
                                children: [
                                    { 
                                        label: 'General', 
                                        value: 'settings_general', 
                                        icon: '🔧',
                                        path: '/settings/general',
                                        description: 'ตั้งค่าทั่วไป'
                                    },
                                    { 
                                        label: 'Security', 
                                        value: 'settings_security', 
                                        icon: '🔒',
                                        path: '/settings/security',
                                        description: 'ตั้งค่าความปลอดภัย',
                                        disabled: true
                                    }
                                ]
                            }
                        ],
                        nodeConfig: {
                            colnumbers: 12,
                            controls: [
                                {
                                    colno: 1,
                                    rowno: 1,
                                    colSpan: 6,
                                    databind: 'label',
                                    type: 'label',
                                    style: { fontWeight: '600', fontSize: '14px' }
                                },
                                {
                                    colno: 7,
                                    rowno: 1,
                                    colSpan: 6,
                                    databind: 'path',
                                    type: 'label',
                                    style: { color: '#6b7280', fontSize: '12px' }
                                },
                                {
                                    colno: 1,
                                    rowno: 2,
                                    colSpan: 12,
                                    databind: 'description',
                                    type: 'label',
                                    style: { color: '#9ca3af', fontSize: '11px', fontStyle: 'italic' }
                                }
                            ]
                        },
                        checkable: true,
                        multiple: true,
                        defaultExpanded: ['users', 'settings'],
                        defaultChecked: ['dashboard', 'user_list'],
                        showLine: true,
                        onSelect: (event, node) => {
                            addLog(`🔗 Navigate to: ${node.path || 'N/A'}`);
                        },
                        onCheck: (event, node, checked) => {
                            addLog(`${checked ? '✅' : '❌'} Menu ${checked ? 'enabled' : 'disabled'}: ${node.label}`);
                        }
                    }}
                />

                <div style={{ 
                    marginTop: '20px',
                    padding: '15px', 
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe'
                }}>
                    <strong>💡 Code Example:</strong>
                    <pre style={{ 
                        backgroundColor: '#1e1e1e', 
                        color: '#d4d4d4', 
                        padding: '15px', 
                        borderRadius: '6px',
                        overflow: 'auto',
                        marginTop: '10px'
                    }}>{`<TreeControl control={{
  data: [
    {
      label: 'Documents',
      value: 'documents',
      icon: '📁',
      children: [
        {
          label: 'Work',
          value: 'work',
          children: [
            { label: 'Project.docx', value: 'project', icon: '📄' }
          ]
        }
      ]
    }
  ],
  checkable: true,           // Show checkboxes
  multiple: true,            // Multiple selection
  defaultExpanded: ['documents'],
  defaultChecked: ['project'],
  showLine: true,            // Show tree lines
  childrenKey: 'children',   // Default
  labelKey: 'label',         // Default
  valueKey: 'value',         // Default
  onSelect: (event, node) => {
    console.log('Selected:', node.label);
  },
  onCheck: (event, node, checked) => {
    console.log('Checked:', node.label, checked);
  },
  onExpand: (event, node, expanded) => {
    console.log('Expanded:', node.label, expanded);
  }
}} />`}</pre>
                </div>
            </section>

            {/* Example 15 - Image Control */}
            <section style={{ marginBottom: '40px' }}>
                <h2>🖼️ Example 15: Image Control</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    Image Control - แสดงรูปภาพพร้อม features เพิ่มเติม เช่น lazy loading, lightbox, error handling
                </p>
                <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '10px 15px', 
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '13px'
                }}>
                    <strong>Features:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>Lazy loading</li>
                        <li>Error handling with fallback image</li>
                        <li>Click to enlarge (lightbox)</li>
                        <li>Object fit modes (cover, contain, etc.)</li>
                        <li>Border radius, shadow, grayscale</li>
                        <li>Loading placeholder</li>
                    </ul>
                </div>

                <h3>ตัวอย่าง: Image Gallery</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
                    {[
                        { url: 'https://picsum.photos/300/200?random=1', title: 'Landscape' },
                        { url: 'https://picsum.photos/300/200?random=2', title: 'Nature' },
                        { url: 'https://picsum.photos/300/200?random=3', title: 'City' },
                        { url: 'https://picsum.photos/300/200?random=4', title: 'Ocean' }
                    ].map((img, idx) => (
                        <div key={idx} style={{ textAlign: 'center' }}>
                            <ImageControl control={{
                                value: img.url,
                                alt: img.title,
                                width: '100%',
                                height: '150px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                shadow: true,
                                enlargeable: true,
                                lazy: true,
                                onClick: (event) => addLog(`🖼️ Clicked: ${img.title}`)
                            }} />
                            <p style={{ marginTop: '8px', fontSize: '13px', color: '#6b7280' }}>{img.title}</p>
                        </div>
                    ))}
                </div>

                <h3>ตัวอย่าง: Avatar Images with Fallback</h3>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <ImageControl control={{
                            value: 'https://randomuser.me/api/portraits/men/32.jpg',
                            alt: 'User Avatar',
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            shadow: true
                        }} />
                        <p style={{ marginTop: '8px', fontSize: '12px' }}>Valid Image</p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <ImageControl control={{
                            value: 'https://invalid-url.com/broken.jpg',
                            alt: 'Broken Image',
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            shadow: true
                        }} />
                        <p style={{ marginTop: '8px', fontSize: '12px' }}>Fallback Image</p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <ImageControl control={{
                            value: 'https://randomuser.me/api/portraits/women/44.jpg',
                            alt: 'Grayscale Avatar',
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            grayscale: true,
                            shadow: true
                        }} />
                        <p style={{ marginTop: '8px', fontSize: '12px' }}>Grayscale</p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <ImageControl control={{
                            value: 'https://randomuser.me/api/portraits/men/67.jpg',
                            alt: 'Disabled Avatar',
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            disabled: true
                        }} />
                        <p style={{ marginTop: '8px', fontSize: '12px' }}>Disabled</p>
                    </div>
                </div>

                <h3>ตัวอย่าง: Product Images (Different Object Fit)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
                        <ImageControl control={{
                            value: 'https://picsum.photos/400/300?random=10',
                            alt: 'Cover Mode',
                            width: '100%',
                            height: '200px',
                            borderRadius: '6px',
                            objectFit: 'cover',
                            enlargeable: true
                        }} />
                        <p style={{ marginTop: '10px', fontWeight: '600' }}>Object Fit: Cover</p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>รูปจะเต็มพื้นที่ แต่อาจถูกครอบ</p>
                    </div>

                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
                        <ImageControl control={{
                            value: 'https://picsum.photos/400/300?random=11',
                            alt: 'Contain Mode',
                            width: '100%',
                            height: '200px',
                            borderRadius: '6px',
                            objectFit: 'contain',
                            enlargeable: true,
                            style: { backgroundColor: '#f3f4f6' }
                        }} />
                        <p style={{ marginTop: '10px', fontWeight: '600' }}>Object Fit: Contain</p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>รูปจะไม่ถูกครอบ แต่อาจมีพื้นที่ว่าง</p>
                    </div>

                    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
                        <ImageControl control={{
                            value: 'https://picsum.photos/400/300?random=12',
                            alt: 'Fill Mode',
                            width: '100%',
                            height: '200px',
                            borderRadius: '6px',
                            objectFit: 'fill',
                            enlargeable: true
                        }} />
                        <p style={{ marginTop: '10px', fontWeight: '600' }}>Object Fit: Fill</p>
                        <p style={{ fontSize: '12px', color: '#6b7280' }}>รูปจะยืดเต็มพื้นที่</p>
                    </div>
                </div>

                <div style={{ 
                    marginTop: '20px',
                    padding: '15px', 
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe'
                }}>
                    <strong>💡 Code Example:</strong>
                    <pre style={{ 
                        backgroundColor: '#1e1e1e', 
                        color: '#d4d4d4', 
                        padding: '15px', 
                        borderRadius: '6px',
                        overflow: 'auto',
                        marginTop: '10px'
                    }}>{`<ImageControl control={{
  value: 'https://example.com/image.jpg',
  databind: 'avatar',        // or use value
  alt: 'User Avatar',
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  objectFit: 'cover',        // cover | contain | fill | none
  shadow: true,              // Add box shadow
  grayscale: false,          // Convert to grayscale
  enlargeable: true,         // Click to view fullscreen
  lazy: true,                // Lazy loading
  disabled: false,
  onClick: (event, rowData, rowIndex) => {
    console.log('Image clicked');
  }
}} />`}</pre>
                </div>
            </section>

            {/* Example 16 - Link Control */}
            <section style={{ marginBottom: '40px' }}>
                <h2>🔗 Example 16: Link Control</h2>
                <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                    Link Control - แสดงลิงก์พร้อม features เพิ่มเติม เช่น icon, badge, external indicator
                </p>
                <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '10px 15px', 
                    borderRadius: '5px',
                    marginBottom: '15px',
                    fontSize: '13px'
                }}>
                    <strong>Features:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>Icon support (left/right)</li>
                        <li>Badge/counter display</li>
                        <li>External link indicator</li>
                        <li>Underline modes (always, hover, none)</li>
                        <li>Button style mode</li>
                        <li>Download attribute support</li>
                    </ul>
                </div>

                <h3>ตัวอย่าง: Basic Links</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                    <div>
                        <LinkControl control={{
                            value: 'Visit Google',
                            href: 'https://google.com',
                            target: '_blank',
                            onClick: (event) => addLog('🔗 Clicked: Google Link')
                        }} />
                    </div>

                    <div>
                        <LinkControl control={{
                            value: 'Internal Link',
                            href: '/dashboard',
                            underline: 'always',
                            onClick: (event) => addLog('🔗 Clicked: Internal Link')
                        }} />
                    </div>

                    <div>
                        <LinkControl control={{
                            value: 'No Underline Link',
                            href: '/settings',
                            underline: 'none',
                            onClick: (event) => addLog('🔗 Clicked: No Underline')
                        }} />
                    </div>

                    <div>
                        <LinkControl control={{
                            value: 'Disabled Link',
                            href: '/disabled',
                            disabled: true,
                            onClick: (event) => addLog('🔗 This should not appear')
                        }} />
                    </div>
                </div>

                <h3>ตัวอย่าง: Links with Icons</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
                    <LinkControl control={{
                        value: 'Home',
                        href: '/',
                        icon: '🏠',
                        iconPosition: 'left',
                        onClick: (event) => addLog('🏠 Home clicked')
                    }} />

                    <LinkControl control={{
                        value: 'Settings',
                        href: '/settings',
                        icon: '⚙️',
                        iconPosition: 'left',
                        onClick: (event) => addLog('⚙️ Settings clicked')
                    }} />

                    <LinkControl control={{
                        value: 'External Link',
                        href: 'https://github.com',
                        target: '_blank',
                        icon: '↗️',
                        iconPosition: 'right',
                        onClick: (event) => addLog('↗️ External link clicked')
                    }} />

                    <LinkControl control={{
                        value: 'Download',
                        href: '/files/document.pdf',
                        download: 'document.pdf',
                        icon: '📥',
                        iconPosition: 'left',
                        onClick: (event) => addLog('📥 Download clicked')
                    }} />
                </div>

                <h3>ตัวอย่าง: Links with Badges</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                    <LinkControl control={{
                        value: 'Inbox',
                        href: '/inbox',
                        icon: '📧',
                        badge: '5',
                        badgeColor: '#ef4444',
                        onClick: (event) => addLog('📧 Inbox clicked - 5 new messages')
                    }} />

                    <LinkControl control={{
                        value: 'Notifications',
                        href: '/notifications',
                        icon: '🔔',
                        badge: '23',
                        badgeColor: '#f59e0b',
                        onClick: (event) => addLog('🔔 Notifications clicked')
                    }} />

                    <LinkControl control={{
                        value: 'New Features',
                        href: '/features',
                        icon: '✨',
                        badge: 'NEW',
                        badgeColor: '#10b981',
                        onClick: (event) => addLog('✨ New Features clicked')
                    }} />

                    <LinkControl control={{
                        value: 'Premium',
                        href: '/premium',
                        icon: '👑',
                        badge: 'PRO',
                        badgeColor: '#8b5cf6',
                        onClick: (event) => addLog('👑 Premium clicked')
                    }} />
                </div>

                <h3>ตัวอย่าง: Button Style Links</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    <LinkControl control={{
                        value: 'Primary Button',
                        href: '/action',
                        buttonStyle: true,
                        onClick: (event) => addLog('🔘 Primary Button clicked')
                    }} />

                    <LinkControl control={{
                        value: 'Get Started',
                        href: '/signup',
                        buttonStyle: true,
                        icon: '🚀',
                        onClick: (event) => addLog('🚀 Get Started clicked')
                    }} />

                    <LinkControl control={{
                        value: 'Download App',
                        href: '/download',
                        buttonStyle: true,
                        icon: '📱',
                        iconPosition: 'right',
                        onClick: (event) => addLog('📱 Download App clicked')
                    }} />

                    <LinkControl control={{
                        value: 'Disabled Button',
                        href: '/disabled',
                        buttonStyle: true,
                        disabled: true,
                        onClick: (event) => addLog('Should not appear')
                    }} />
                </div>

                <div style={{ 
                    marginTop: '20px',
                    padding: '15px', 
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe'
                }}>
                    <strong>💡 Code Example:</strong>
                    <pre style={{ 
                        backgroundColor: '#1e1e1e', 
                        color: '#d4d4d4', 
                        padding: '15px', 
                        borderRadius: '6px',
                        overflow: 'auto',
                        marginTop: '10px'
                    }}>{`<LinkControl control={{
  value: 'Click Me',
  href: '/page',
  databind: 'url',           // or use href
  textBind: 'linkText',      // or use value
  target: '_blank',          // _self | _blank
  icon: '🔗',
  iconPosition: 'left',      // left | right
  badge: '5',
  badgeColor: '#ef4444',
  underline: 'hover',        // always | hover | none
  buttonStyle: false,        // Button appearance
  download: 'file.pdf',      // Download attribute
  showExternalIcon: true,    // Show ↗ for external
  disabled: false,
  onClick: (event, rowData, rowIndex) => {
    console.log('Link clicked');
  }
}} />`}</pre>
                </div>
            </section>

            {/* Event Logs */}
            <section style={{ marginTop: '40px' }}>
                <h2>📝 Event Logs</h2>
                <div 
                    style={{ 
                        backgroundColor: '#1e1e1e', 
                        color: '#d4d4d4', 
                        padding: '15px', 
                        borderRadius: '5px',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        fontFamily: 'monospace',
                        fontSize: '13px'
                    }}
                >
                    {logs.length === 0 ? (
                        <div style={{ color: '#858585' }}>Waiting for events...</div>
                    ) : (
                        logs.map((log, idx) => (
                            <div key={idx} style={{ marginBottom: '5px' }}>
                                {log}
                            </div>
                        ))
                    )}
                </div>
                <button 
                    onClick={() => setLogs([])}
                    style={{
                        marginTop: '10px',
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Clear Logs
                </button>
            </section>
            </div>
        );
    }
}

export default SampleControl;
