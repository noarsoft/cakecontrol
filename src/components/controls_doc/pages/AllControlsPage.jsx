import {
    TableviewControl,
    LabelControl,
    TextboxControl,
    NumberControl,
    CheckboxControl,
    ToggleControl,
    DatePickerControl,
    ButtonControl,
    LinkControl,
    ImageControl,
    BadgeControl,
    IconControl,
    ProgressControl,
    CalendarControl,
    DropdownControl,
    PasswordControl,
    SearchBoxControl,
    QRCodeControl,
} from '../../controls';

function AllControlsPage({ addLog }) {
    const featuredRowData = {
        id: '1',
        name: 'สมชาย ใจดี',
        email: 'somchai@test.com',
        age: 25,
        role: 'admin',
        verified: true,
        active: true,
        birthDate: '1999-05-20',
        website: 'https://example.com',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        status: 'active',
        progress: 75,
        eventDate: '2025-01-20',
        icon: '⭐',
        department: { id: 1, name: 'IT Department' },
        qrData: 'https://example.com/user/somchai',
        secret: 'Pa$$w0rd'
    };

    const controlRows = [
        {
            name: 'label',
            render: () => <LabelControl control={{ databind: 'name', style: { fontWeight: 'bold' } }} rowData={featuredRowData} />,
            code: `{ databind: 'name' }`,
            description: 'แสดงข้อความจาก databind'
        },
        {
            name: 'textbox',
            render: () => <TextboxControl control={{ databind: 'email', placeholder: 'Email...' }} rowData={featuredRowData} />,
            code: `{ databind: 'email' }`,
            description: 'Input text จาก databind'
        },
        {
            name: 'number',
            render: () => <NumberControl control={{ databind: 'age', min: 0, max: 100 }} rowData={featuredRowData} />,
            code: `{ databind: 'age' }`,
            description: 'Number input จาก databind'
        },
        {
            name: 'checkbox',
            render: () => <CheckboxControl control={{ databind: 'verified', labelText: 'Verified' }} rowData={featuredRowData} />,
            code: `{ databind: 'verified' }`,
            description: 'Checkbox จาก databind'
        },
        {
            name: 'toggle',
            render: () => <ToggleControl control={{ databind: 'active' }} rowData={featuredRowData} />,
            code: `{ databind: 'active' }`,
            description: 'Toggle จาก databind'
        },
        {
            name: 'datepicker',
            render: () => <DatePickerControl control={{ databind: 'birthDate', placeholder: 'เลือกวันเกิด' }} rowData={featuredRowData} />,
            code: `{ databind: 'birthDate', placeholder: 'เลือกวันเกิด' }`,
            description: 'DatePicker (พ.ศ.) + databind'
        },
        {
            name: 'button',
            render: () => <ButtonControl control={{ value: 'View Profile', className: 'btn-primary', onClick: (e, rd) => addLog(`Button clicked: ${rd.name}`) }} rowData={featuredRowData} />,
            code: `{ value: 'Text', onClick: ... }`,
            description: 'Button พร้อม onClick'
        },
        {
            name: 'link',
            render: () => <LinkControl control={{ databind: 'website', value: 'Visit Website', target: '_blank', icon: '🔗', underline: 'hover' }} rowData={featuredRowData} />,
            code: `{ databind: 'website', icon: '🔗' }`,
            description: 'Link พร้อม icon และ target'
        },
        {
            name: 'image',
            render: () => <ImageControl control={{ databind: 'avatar', width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', shadow: true }} rowData={featuredRowData} />,
            code: `{ databind: 'avatar', shadow: true }`,
            description: 'Image พร้อม shadow และ objectFit'
        },
        {
            name: 'badge',
            render: () => <BadgeControl control={{ databind: 'status', color: 'white', backgroundColor: (rd) => rd.status === 'active' ? '#10b981' : '#ef4444' }} rowData={featuredRowData} />,
            code: `{ databind: 'status', backgroundColor: (rd) => ... }`,
            description: 'Badge สี dynamic'
        },
        {
            name: 'icon',
            render: () => <IconControl control={{ databind: 'icon', fontSize: '24px' }} rowData={featuredRowData} />,
            code: `{ databind: 'icon' }`,
            description: 'Icon/Emoji จาก databind'
        },
        {
            name: 'progress',
            render: () => <ProgressControl control={{ databind: 'progress', showValue: true, color: '#3b82f6' }} rowData={featuredRowData} />,
            code: `{ databind: 'progress' }`,
            description: 'Progress bar จาก databind'
        },
        {
            name: 'calendar',
            render: () => <CalendarControl control={{ databind: 'eventDate', events: { '2025-01-20': ['Meeting', 'Workshop'] } }} rowData={featuredRowData} />,
            code: `{ databind: 'eventDate' }`,
            description: 'Calendar พ.ศ. + databind'
        },
        {
            name: 'dropdown',
            render: () => <DropdownControl control={{ databind: 'department.id', data: [{ id: 1, name: 'IT Department' }, { id: 2, name: 'HR Department' }, { id: 3, name: 'Finance' }], keyField: 'id', displayField: 'name', placeholder: 'เลือกแผนก', clearable: true }} rowData={featuredRowData} />,
            code: `{ databind: 'department.id', data: [...], keyField: 'id', displayField: 'name' }`,
            description: 'Dropdown + nested databind'
        },
        {
            name: 'password',
            render: () => <PasswordControl control={{ databind: 'secret', placeholder: 'รหัสผ่าน', showStrength: true }} rowData={featuredRowData} />,
            code: `{ databind: 'secret', placeholder: 'รหัสผ่าน', showStrength: true }`,
            description: 'Password input with show/hide and strength meter'
        },
        {
            name: 'searchbox',
            render: () => <SearchBoxControl control={{ databind: 'department', data: [{ id: 1, name: 'IT Department' }, { id: 2, name: 'HR Department' }, { id: 3, name: 'Finance' }], keyField: 'id', displayField: 'name', placeholder: 'ค้นหาและเพิ่ม', multiple: true }} rowData={featuredRowData} />,
            code: `{ databind: 'department', multiple: true, placeholder: 'ค้นหาและเพิ่ม' }`,
            description: 'SearchBox multi-select with dropdown results'
        },
        {
            name: 'qrcode',
            render: () => <QRCodeControl control={{ databind: 'qrData', width: 100, height: 100 }} rowData={featuredRowData} />,
            code: `{ databind: 'qrData', width: 100 }`,
            description: 'QR Code generator จาก databind'
        },
        {
            name: 'custom',
            render: () => (
                <div style={{ padding: '6px 10px', backgroundColor: '#f3f4f6', borderRadius: '4px', border: '1px dashed #9ca3af', fontSize: '13px' }}>
                    Custom Component
                </div>
            ),
            code: `{ render: (rd) => ... }`,
            description: 'Custom render function'
        }
    ];

    return (
        <div className="page-content">
            <h1>🎯 All Control Types Demo</h1>
            <p className="lead">
                แสดง Control ทุกประเภทพร้อมการใช้งาน <strong>databind</strong> กับข้อมูลจริง (20 Controls)
            </p>

            <div className="note-box">
                <strong>📌 Note:</strong> ทุก control ใช้ <code>databind</code> ดึงข้อมูลจาก <code>rowData</code> โดยตรง
            </div>

            <TableviewControl config={{
                headers: ['Control Type', 'Live Example', 'Code', 'Description'],
                colwidths: ['130px', '250px', '300px', 'auto'],
                data: [featuredRowData],
                controls: [
                    {
                        type: 'custom',
                        render: () => (
                            <div className="control-type-column">
                                {controlRows.map((row) => (
                                    <code key={`type-${row.name}`} className="control-type-code">{row.name}</code>
                                ))}
                            </div>
                        )
                    },
                    {
                        type: 'custom',
                        render: () => (
                            <div className="control-live-column">
                                {controlRows.map((row) => (
                                    <div key={`live-${row.name}`} className="control-block">
                                        {row.render()}
                                    </div>
                                ))}
                            </div>
                        )
                    },
                    {
                        type: 'custom',
                        render: () => (
                            <div className="control-code-column">
                                {controlRows.map((row) => (
                                    <pre key={`code-${row.name}`} className="control-code-block">
                                        {row.code}
                                    </pre>
                                ))}
                            </div>
                        )
                    },
                    {
                        type: 'custom',
                        render: () => (
                            <div className="control-desc-column">
                                {controlRows.map((row) => (
                                    <div key={`desc-${row.name}`} className="control-desc-block">
                                        {row.description}
                                    </div>
                                ))}
                            </div>
                        )
                    }
                ]
            }} />
        </div>
    );
}

export default AllControlsPage;
