// ControlsDocs.jsx - Interactive Controls Documentation with Sidebar Navigation
import React, { useState } from 'react';
import ThemeSwitcher from '../../ThemeSwitcher';
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
    CheckboxControl,
    ToggleControl,
    ButtonControl,
    LinkControl,
    ImageControl,
    BadgeControl,
    IconControl,
    ProgressControl,
    CalendarControl,
    QRCodeControl,
    PaginationControl,
    ChartControl,
    PasswordControl,
    SearchBoxControl,
    MultipleUploadControl,
    MenuControl
} from '../controls';
import './ControlsDocs.css';

function PropsTable({ props }) {
    return (
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
                {props.map((prop, idx) => (
                    <tr key={idx}>
                        <td><code>{prop.name}</code></td>
                        <td><code>{prop.type}</code></td>
                        <td><code>{prop.default || '-'}</code></td>
                        <td>{prop.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function CodeBlock({ children, language = 'javascript' }) {
    return (
        <pre className="code-block">
            <code className={`language-${language}`}>{children}</code>
        </pre>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="feature-card">
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

function CategoryOverview({ title, icon, description, controls }) {
    return (
        <div className="category-box">
            <h3>{icon} {title}</h3>
            <p>{description}</p>
            <div className="control-list">
                {controls.map((control, idx) => (
                    <span key={idx} className="control-tag">{control}</span>
                ))}
            </div>
        </div>
    );
}

function ComingSoonPage({ pageName }) {
    return (
        <div className="page-content coming-soon">
            <div className="coming-soon-content">
                <div className="coming-soon-icon">🚧</div>
                <h1>{pageName}</h1>
                <p>Documentation coming soon...</p>
            </div>
        </div>
    );
}

// ==================== PAGE COMPONENTS ====================

function OverviewPage({ setPage }) {
    return (
        <div className="page-content">
            <h1>📚 Control Components Library</h1>
            <p className="lead">
                A comprehensive collection of React controls for building modern web applications with seamless data binding support
            </p>

            <section className="content-section">
                <h2>✨ Key Features</h2>
                <div className="feature-grid">
                    <FeatureCard icon="🎯" title="30+ Controls" description="From basic inputs to advanced layouts" />
                    <FeatureCard icon="🔄" title="Data Binding" description="Seamless databind integration" />
                    <FeatureCard icon="📱" title="Responsive" description="Works on all devices" />
                    <FeatureCard icon="🎨" title="Customizable" description="Easy styling options" />
                    <FeatureCard icon="⚡" title="Performance" description="Optimized rendering" />
                    <FeatureCard icon="♿" title="Accessible" description="ARIA compliant" />
                </div>
            </section>

            <section className="content-section">
                <h2>📦 Control Categories</h2>
                <div className="category-overview">
                    <CategoryOverview
                        title="Layout Controls"
                        icon="📝"
                        description="Complex layouts and structures for organizing content"
                        controls={['Form', 'Table', 'Grid', 'Card', 'Accordion', 'Tabs', 'Tree', 'Button Group', 'Pagination']}
                    />
                    <CategoryOverview
                        title="Display Controls"
                        icon="🖼️"
                        description="Visual elements for displaying content and media"
                        controls={['Link', 'Image', 'Badge', 'Icon']}
                    />
                    <CategoryOverview
                        title="Date/Time Controls"
                        icon="📅"
                        description="Date and calendar selection components"
                        controls={['DatePicker', 'Calendar Grid']}
                    />
                    <CategoryOverview
                        title="Other Controls"
                        icon="🔧"
                        description="Additional utility controls"
                        controls={['Dropdown', 'Progress Bar', 'QR Code']}
                    />
                </div>
            </section>

            <section className="content-section">
                <h2>🚀 Quick Start</h2>
                <CodeBlock language="javascript">{`// 1. Import controls
import { TextboxControl, ButtonControl } from './controls';

// 2. Use in your component
function MyForm() {
    const [user, setUser] = useState({ name: '', email: '' });
    
    return (
        <div>
            <TextboxControl 
                control={{ 
                    databind: 'name', 
                    placeholder: 'Enter name' 
                }}
                rowData={user}
            />
            <TextboxControl 
                control={{ 
                    databind: 'email', 
                    placeholder: 'Enter email' 
                }}
                rowData={user}
            />
            <ButtonControl 
                control={{ 
                    value: 'Submit',
                    onClick: () => console.log(user)
                }}
            />
        </div>
    );
}`}</CodeBlock>
            </section>

            <section className="content-section">
                <h2>📖 Next Steps</h2>
                <div className="quick-links">
                    <button className="quick-link-card" onClick={() => setPage('allcontrols')}>
                        <span className="quick-link-icon">🎯</span>
                        <div>
                            <h4>View All Controls</h4>
                            <p>See all available controls in action</p>
                        </div>
                    </button>
                    <button className="quick-link-card" onClick={() => setPage('databinding')}>
                        <span className="quick-link-icon">🔄</span>
                        <div>
                            <h4>Learn Data Binding</h4>
                            <p>Master data binding techniques</p>
                        </div>
                    </button>
                    <button className="quick-link-card" onClick={() => setPage('form')}>
                        <span className="quick-link-icon">📝</span>
                        <div>
                            <h4>Form Control</h4>
                            <p>Build complex forms easily</p>
                        </div>
                    </button>
                </div>
            </section>
        </div>
    );
}

function ControlsDocs() {
    const [currentPage, setCurrentPage] = useState('overview');
    const [logs, setLogs] = useState([]);

    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString('th-TH');
        setLogs(prev => [...prev, { time: timestamp, message }]);
    };

    const clearLogs = () => setLogs([]);

    const pages = {
        overview: { title: '📚 Overview', category: 'Getting Started', icon: '🏠' },
        allcontrols: { title: '🎯 All Controls', category: 'Getting Started', icon: '🎨' },
        databinding: { title: '🔄 Data Binding', category: 'Getting Started', icon: '🔗' },
        form: { title: 'Form Control', category: 'Layout Controls', icon: '📝' },
        table: { title: 'Table Control', category: 'Layout Controls', icon: '📊' },
        grid: { title: 'Grid Control', category: 'Layout Controls', icon: '▦' },
        card: { title: 'Card Control', category: 'Layout Controls', icon: '🃏' },
        accordion: { title: 'Accordion Control', category: 'Layout Controls', icon: '📂' },
        tabs: { title: 'Tab Control', category: 'Layout Controls', icon: '📑' },
        tree: { title: 'Tree Control', category: 'Layout Controls', icon: '🌳' },
        buttongroup: { title: 'Button Group', category: 'Layout Controls', icon: '🔲' },
        pagination: { title: 'Pagination', category: 'Layout Controls', icon: '📄' },
        label: { title: 'Label Control', category: 'Input Controls', icon: '🏷️' },
        textbox: { title: 'Textbox Control', category: 'Input Controls', icon: '✏️' },
        number: { title: 'Number Control', category: 'Input Controls', icon: '🔢' },
        select: { title: 'Select Control', category: 'Input Controls', icon: '📋' },
        checkbox: { title: 'Checkbox Control', category: 'Input Controls', icon: '☑️' },
        toggle: { title: 'Toggle Control', category: 'Input Controls', icon: '🔘' },
        date: { title: 'Date Control', category: 'Input Controls', icon: '📅' },
        button: { title: 'Button Control', category: 'Input Controls', icon: '🔲' },
        link: { title: 'Link Control', category: 'Display Controls', icon: '🔗' },
        image: { title: 'Image Control', category: 'Display Controls', icon: '🖼️' },
        badge: { title: 'Badge Control', category: 'Display Controls', icon: '🏅' },
        icon: { title: 'Icon Control', category: 'Display Controls', icon: '⭐' },
        datepicker: { title: 'DatePicker', category: 'Date/Time Controls', icon: '📅' },
        calendargrid: { title: 'Calendar Grid', category: 'Date/Time Controls', icon: '📆' },
        dropdown: { title: 'Dropdown', category: 'Other Controls', icon: '⬇️' },
        progress: { title: 'Progress Bar', category: 'Other Controls', icon: '📊' },
        qrcode: { title: 'QR Code', category: 'Other Controls', icon: '📱' },
        chart: { title: 'Chart', category: 'Other Controls', icon: '📈' },
        fileupload: { title: 'File Upload', category: 'Other Controls', icon: '📁' },
        menu: { title: 'Menu Control', category: 'Layout Controls', icon: '📋' },
        rating: { title: 'Rating Control', category: 'Other Controls', icon: '⭐' },
        slider: { title: 'Slider Control', category: 'Input Controls', icon: '🎚️' },
        alertmodal: { title: 'Alert Modal', category: 'Other Controls', icon: '🚭' },
        confirmmodal: { title: 'Confirm Modal', category: 'Other Controls', icon: '✅' },
        chartsbar: { title: 'Bar Chart JS', category: 'Chart Controls', icon: '📊' },
        chartsline: { title: 'Line Chart JS', category: 'Chart Controls', icon: '📈' },
        chartspie: { title: 'Pie Chart JS', category: 'Chart Controls', icon: '🥧' },
        chartsdoughnut: { title: 'Doughnut Chart JS', category: 'Chart Controls', icon: '🍩' },
        chartsradar: { title: 'Radar Chart JS', category: 'Chart Controls', icon: '🎯' },
        chartsarea: { title: 'Area Chart JS', category: 'Chart Controls', icon: '📊' },
        chartsbubble: { title: 'Bubble Chart JS', category: 'Chart Controls', icon: '🫧' },
        chartsmixed: { title: 'Mixed Chart JS', category: 'Chart Controls', icon: '📊' },
        crud: { title: 'CRUD Control', category: 'Layout Controls', icon: '🗂️' }
    };

    const categories = {};
    Object.entries(pages).forEach(([key, page]) => {
        if (!categories[page.category]) categories[page.category] = [];
        categories[page.category].push({ key, ...page });
    });

    const renderPageContent = () => {
        switch (currentPage) {
            case 'overview': return <OverviewPage setPage={setCurrentPage} />;
            case 'allcontrols': return <AllControlsPage addLog={addLog} />;
            case 'databinding': return <DataBindingPage addLog={addLog} />;
            case 'form': return <FormPage addLog={addLog} />;
            case 'table': return <TablePage addLog={addLog} />;
            case 'grid': return <GridPage addLog={addLog} />;
            case 'card': return <CardPage addLog={addLog} />;
            case 'accordion': return <AccordionPage addLog={addLog} />;
            case 'tabs': return <TabsPage addLog={addLog} />;
            case 'tree': return <TreePage addLog={addLog} />;
            case 'buttongroup': return <ButtonGroupPage addLog={addLog} />;
            case 'link': return <LinkPage addLog={addLog} />;
            case 'image': return <ImagePage addLog={addLog} />;
            case 'pagination': return <PaginationPage addLog={addLog} />;
            case 'datepicker': return <DatePickerPage addLog={addLog} />;
            case 'calendargrid': return <CalendarGridPage addLog={addLog} />;
            case 'badge': return <BadgePage addLog={addLog} />;
            case 'icon': return <IconPage addLog={addLog} />;
            case 'dropdown': return <DropdownPage addLog={addLog} />;
            case 'progress': return <ProgressPage addLog={addLog} />;
            case 'qrcode': return <QRCodePage addLog={addLog} />;
            case 'chart': return <ChartPage addLog={addLog} />;
            case 'fileupload': return <FileUploadPage addLog={addLog} />;
            case 'menu': return <MenuPage addLog={addLog} />;
            case 'rating': return <RatingPage addLog={addLog} />;
            case 'slider': return <SliderPage addLog={addLog} />;
            case 'alertmodal': return <AlertModalPage addLog={addLog} />;
            case 'confirmmodal': return <ConfirmModalPage addLog={addLog} />;
            case 'label': return <LabelPage addLog={addLog} />;
            case 'textbox': return <TextboxPage addLog={addLog} />;
            case 'number': return <NumberPage addLog={addLog} />;
            case 'select': return <SelectPage addLog={addLog} />;
            case 'checkbox': return <CheckboxPage addLog={addLog} />;
            case 'toggle': return <TogglePage addLog={addLog} />;
            case 'date': return <DatePage addLog={addLog} />;
            case 'button': return <ButtonPage addLog={addLog} />;
            case 'chartsbar': return <BarChartJSPage addLog={addLog} />;
            case 'chartsline': return <LineChartJSPage addLog={addLog} />;
            case 'chartspie': return <PieChartJSPage addLog={addLog} />;
            case 'chartsdoughnut': return <DoughnutChartJSPage addLog={addLog} />;
            case 'chartsradar': return <RadarChartJSPage addLog={addLog} />;
            case 'chartsarea': return <AreaChartJSPage addLog={addLog} />;
            case 'chartsbubble': return <BubbleChartJSPage addLog={addLog} />;
            case 'chartsmixed': return <MixedChartJSPage addLog={addLog} />;
            case 'crud': return <CRUDPage addLog={addLog} />;
            default: return <ComingSoonPage pageName={pages[currentPage]?.title || currentPage} />;
        }
    };

    return (
        <div className="controls-docs-container">
            <aside className="docs-sidebar">
                <div className="docs-header">
                    <h1>🎨 Controls</h1>
                    <p>Interactive Documentation</p>
                </div>
                <div className="sidebar-theme-switcher"><ThemeSwitcher /></div>
                <nav className="docs-nav">
                    {Object.entries(categories).map(([category, items]) => (
                        <div key={category} className="nav-category">
                            <h3 className="category-title">{category}</h3>
                            {items.map(item => (
                                <button key={item.key} className={`nav-item ${currentPage === item.key ? 'active' : ''}`} onClick={() => setCurrentPage(item.key)}>
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-text">{item.title}</span>
                                </button>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>

            <main className="docs-content">
                <div className="content-wrapper">{renderPageContent()}</div>
                {logs.length > 0 && (
                    <div className="event-logs">
                        <div className="logs-header">
                            <h3>📋 Event Logs</h3>
                            <button onClick={clearLogs} className="clear-btn">Clear</button>
                        </div>
                        <div className="logs-content">
                            {logs.slice(-15).reverse().map((log, idx) => (
                                <div key={idx} className="log-entry"><span className="log-time">{log.time}</span><span className="log-message">{log.message}</span></div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

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
        qrData: 'https://example.com/user/somchai'
        ,
        secret: 'Pa$$w0rd'
    };

    const controlRows = [
        {
            name: 'label',
            render: () => (
                <LabelControl control={{ databind: 'name', style: { fontWeight: 'bold' } }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'name' }`,
            description: 'แสดงข้อความจาก databind'
        },
        {
            name: 'textbox',
            render: () => (
                <TextboxControl control={{ databind: 'email', placeholder: 'Email...' }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'email' }`,
            description: 'Input text จาก databind'
        },
        {
            name: 'number',
            render: () => (
                <NumberControl control={{ databind: 'age', min: 0, max: 100 }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'age' }`,
            description: 'Number input จาก databind'
        },
        {
            name: 'checkbox',
            render: () => (
                <CheckboxControl control={{ databind: 'verified', labelText: 'Verified' }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'verified' }`,
            description: 'Checkbox จาก databind'
        },
        {
            name: 'toggle',
            render: () => (
                <ToggleControl control={{ databind: 'active' }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'active' }`,
            description: 'Toggle จาก databind'
        },
        {
            name: 'datepicker',
            render: () => (
                <DatePickerControl control={{ databind: 'birthDate', placeholder: 'เลือกวันเกิด' }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'birthDate', placeholder: 'เลือกวันเกิด' }`,
            description: 'DatePicker (พ.ศ.) + databind'
        },
        {
            name: 'button',
            render: () => (
                <ButtonControl control={{
                    value: 'View Profile',
                    className: 'btn-primary',
                    onClick: (e, rd) => addLog(`Button clicked: ${rd.name}`)
                }} rowData={featuredRowData} />
            ),
            code: `{ value: 'Text', onClick: ... }`,
            description: 'Button พร้อม onClick'
        },
        {
            name: 'link',
            render: () => (
                <LinkControl control={{
                    databind: 'website',
                    value: 'Visit Website',
                    target: '_blank',
                    icon: '🔗',
                    underline: 'hover'
                }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'website', icon: '🔗' }`,
            description: 'Link พร้อม icon และ target'
        },
        {
            name: 'image',
            render: () => (
                <ImageControl control={{
                    databind: 'avatar',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    shadow: true
                }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'avatar', shadow: true }`,
            description: 'Image พร้อม shadow และ objectFit'
        },
        {
            name: 'badge',
            render: () => (
                <BadgeControl control={{
                    databind: 'status',
                    color: 'white',
                    backgroundColor: (rd) => rd.status === 'active' ? '#10b981' : '#ef4444'
                }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'status', backgroundColor: (rd) => ... }`,
            description: 'Badge สี dynamic'
        },
        {
            name: 'icon',
            render: () => (
                <IconControl control={{ databind: 'icon', fontSize: '24px' }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'icon' }`,
            description: 'Icon/Emoji จาก databind'
        },
        {
            name: 'progress',
            render: () => (
                <ProgressControl control={{
                    databind: 'progress',
                    showValue: true,
                    color: '#3b82f6'
                }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'progress' }`,
            description: 'Progress bar จาก databind'
        },
        {
            name: 'calendar',
            render: () => (
                <CalendarControl control={{
                    databind: 'eventDate',
                    events: { '2025-01-20': ['Meeting', 'Workshop'] }
                }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'eventDate' }`,
            description: 'Calendar พ.ศ. + databind'
        },
        {
            name: 'dropdown',
            render: () => (
                <DropdownControl control={{
                    databind: 'department.id',
                    data: [
                        { id: 1, name: 'IT Department' },
                        { id: 2, name: 'HR Department' },
                        { id: 3, name: 'Finance' }
                    ],
                    keyField: 'id',
                    displayField: 'name',
                    placeholder: 'เลือกแผนก',
                    clearable: true
                }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'department.id', data: [...], keyField: 'id', displayField: 'name' }`,
            description: 'Dropdown + nested databind'
        },
        {
            name: 'password',
            render: () => (
                <PasswordControl control={{
                    databind: 'secret',
                    placeholder: 'รหัสผ่าน',
                    showStrength: true
                }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'secret', placeholder: 'รหัสผ่าน', showStrength: true }`,
            description: 'Password input with show/hide and strength meter'
        },
        {
            name: 'searchbox',
            render: () => (
                <SearchBoxControl control={{
                    databind: 'department',
                    data: [
                        { id: 1, name: 'IT Department' },
                        { id: 2, name: 'HR Department' },
                        { id: 3, name: 'Finance' }
                    ],
                    keyField: 'id',
                    displayField: 'name',
                    placeholder: 'ค้นหาและเพิ่ม',
                    multiple: true
                }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'department', multiple: true, placeholder: 'ค้นหาและเพิ่ม' }`,
            description: 'SearchBox multi-select with dropdown results'
        },
        {
            name: 'qrcode',
            render: () => (
                <QRCodeControl control={{
                    databind: 'qrData',
                    width: 100,
                    height: 100
                }} rowData={featuredRowData} />
            ),
            code: `{ databind: 'qrData', width: 100 }`,
            description: 'QR Code generator จาก databind'
        },
        {
            name: 'custom',
            render: () => (
                <div style={{
                    padding: '6px 10px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    border: '1px dashed #9ca3af',
                    fontSize: '13px'
                }}>
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

function DataBindingPage({ addLog }) {
    return (
        <div className="page-content">
            <h1>🔄 Data Binding Guide</h1>
            <p className="lead">
                Learn how to bind data to controls using the <code>databind</code> property
            </p>

            <section className="content-section">
                <h2>📖 Basic Concept</h2>
                <p>
                    All controls support the <code>databind</code> property to automatically bind to data fields.
                    This eliminates the need to manually manage value and onChange handlers.
                </p>

                <CodeBlock>{`// Without databind - Manual handling
<TextboxControl 
    control={{
        value: user.name,
        onChange: (e) => setUser({...user, name: e.target.value})
    }}
/>

// With databind - Automatic binding
<TextboxControl 
    control={{ databind: 'name' }}
    rowData={user}
/>`}</CodeBlock>
            </section>

            <section className="content-section">
                <h2>🎯 Nested Data Binding</h2>
                <p>Use dot notation to access nested properties:</p>

                <CodeBlock>{`const user = {
    profile: {
        firstName: 'John',
        lastName: 'Doe',
        address: {
            city: 'Bangkok'
        }
    }
};

// Bind to nested properties
<TextboxControl 
    control={{ databind: 'profile.firstName' }}
    rowData={user}
/>
<TextboxControl 
    control={{ databind: 'profile.address.city' }}
    rowData={user}
/>`}</CodeBlock>
            </section>

            <section className="content-section">
                <h2>📝 Live Example</h2>
                <div className="example-demo">
                    <FormControl config={{
                        colnumbers: 6,
                        data: [{
                            user: {
                                name: 'สมชาย ใจดี',
                                email: 'somchai@test.com',
                                age: 25,
                                verified: true
                            }
                        }],
                        controls: [
                            {
                                colno: 1,
                                rowno: 1,
                                colSpan: 3,
                                label: 'ชื่อ',
                                databind: 'user.name',
                                type: 'textbox'
                            },
                            {
                                colno: 4,
                                rowno: 1,
                                colSpan: 3,
                                label: 'อีเมล',
                                databind: 'user.email',
                                type: 'textbox'
                            },
                            {
                                colno: 1,
                                rowno: 2,
                                colSpan: 2,
                                label: 'อายุ',
                                databind: 'user.age',
                                type: 'number'
                            },
                            {
                                colno: 3,
                                rowno: 2,
                                colSpan: 2,
                                label: 'ยืนยันแล้ว',
                                databind: 'user.verified',
                                type: 'toggle'
                            }
                        ]
                    }} />
                </div>
            </section>
        </div>
    );
}

// Import page components from separate files
import FormPage from './pages/FormPage';
import TablePage from './pages/TablePage';
import GridPage from './pages/GridPage';
import CardPage from './pages/CardPage';
import AccordionPage from './pages/AccordionPage';
import TabsPage from './pages/TabsPage';
import TreePage from './pages/TreePage';
import ButtonGroupPage from './pages/ButtonGroupPage';
import LinkPage from './pages/LinkPage';
import ImagePage from './pages/ImagePage';
import PaginationPage from './pages/PaginationPage';
import DatePickerPage from './pages/DatePickerPage';
import CalendarGridPage from './pages/CalendarGridPage';
import BadgePage from './pages/BadgePage';
import IconPage from './pages/IconPage';
import DropdownPage from './pages/DropdownPage';
import ProgressPage from './pages/ProgressPage';
import QRCodePage from './pages/QRCodePage';
import ChartPage from './pages/ChartPage';
import FileUploadPage from './pages/FileUploadPage';
import MenuPage from './pages/MenuPage';
import RatingPage from './pages/RatingPage';
import SliderPage from './pages/SliderPage';
import AlertModalPage from './pages/AlertModalPage';
import ConfirmModalPage from './pages/ConfirmModalPage';
import LabelPage from './pages/LabelPage';
import TextboxPage from './pages/TextboxPage';
import NumberPage from './pages/NumberPage';
import SelectPage from './pages/SelectPage';
import CheckboxPage from './pages/CheckboxPage';
import TogglePage from './pages/TogglePage';
import DatePage from './pages/DatePage';
import ButtonPage from './pages/ButtonPage';
import BarChartJSPage from './pages/BarChartJSPage';
import LineChartJSPage from './pages/LineChartJSPage';
import PieChartJSPage from './pages/PieChartJSPage';
import DoughnutChartJSPage from './pages/DoughnutChartJSPage';
import RadarChartJSPage from './pages/RadarChartJSPage';
import AreaChartJSPage from './pages/AreaChartJSPage';
import BubbleChartJSPage from './pages/BubbleChartJSPage';
import MixedChartJSPage from './pages/MixedChartJSPage';
import CRUDPage from './pages/CRUDPage';

export default ControlsDocs;
