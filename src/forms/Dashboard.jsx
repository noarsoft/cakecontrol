import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../ThemeSwitcher';
import './Dashboard.css';

const MENU_ITEMS = [
    { id: 'home', label: 'หน้าแรก', icon: '🏠' },
    { id: 'schemas', label: 'จัดการ Schema', icon: '📋' },
    { id: 'forms', label: 'กรอกฟอร์ม', icon: '📝' },
    { id: 'data', label: 'ดูข้อมูล', icon: '📊' },
    { id: 'settings', label: 'ตั้งค่า', icon: '⚙️' },
];

function Dashboard() {
    const navigate = useNavigate();
    const [activePage, setActivePage] = useState('home');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userxRootId');
        localStorage.removeItem('expiresAt');
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
                <div className="sidebar-header">
                    <h3>{sidebarOpen ? 'CakeControl' : 'CC'}</h3>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(prev => !prev)}
                    >
                        {sidebarOpen ? '◀' : '▶'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {MENU_ITEMS.map(item => (
                        <button
                            key={item.id}
                            className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
                            onClick={() => setActivePage(item.id)}
                            title={item.label}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button
                        className="sidebar-item"
                        onClick={() => navigate('/controls-docs')}
                        title="Controls Docs"
                    >
                        <span className="sidebar-icon">📖</span>
                        {sidebarOpen && <span className="sidebar-label">Controls Docs</span>}
                    </button>
                    <button
                        className="sidebar-item"
                        onClick={() => navigate('/formbuilder')}
                        title="Form Builder"
                    >
                        <span className="sidebar-icon">🛠️</span>
                        {sidebarOpen && <span className="sidebar-label">Form Builder</span>}
                    </button>
                    <button className="sidebar-item logout" onClick={handleLogout} title="ออกจากระบบ">
                        <span className="sidebar-icon">🚪</span>
                        {sidebarOpen && <span className="sidebar-label">ออกจากระบบ</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h2>{MENU_ITEMS.find(m => m.id === activePage)?.label || 'Dashboard'}</h2>
                    <ThemeSwitcher />
                </header>

                <div className="dashboard-content">
                    {activePage === 'home' && <HomePage />}
                    {activePage === 'schemas' && <PlaceholderPage title="จัดการ Schema" desc="จะเชื่อมกับ Form Builder ในอนาคต" />}
                    {activePage === 'forms' && <PlaceholderPage title="กรอกฟอร์ม" desc="เลือก schema แล้วกรอกข้อมูล" />}
                    {activePage === 'data' && <PlaceholderPage title="ดูข้อมูล" desc="ดูข้อมูลที่กรอกแล้วในรูปแบบตาราง" />}
                    {activePage === 'settings' && <PlaceholderPage title="ตั้งค่า" desc="ตั้งค่าระบบ" />}
                </div>
            </main>
        </div>
    );
}

function HomePage() {
    return (
        <div className="home-page">
            <div className="welcome-card">
                <h2>ยินดีต้อนรับสู่ CakeControl</h2>
                <p>ระบบจัดการฟอร์มและข้อมูล สำหรับ CAMT มช.</p>
            </div>

            <div className="stats-grid">
                <StatCard icon="📋" label="Schemas" value="—" sub="ยังไม่เชื่อม backend" />
                <StatCard icon="📝" label="Forms" value="—" sub="ยังไม่เชื่อม backend" />
                <StatCard icon="📊" label="Records" value="—" sub="ยังไม่เชื่อม backend" />
                <StatCard icon="🎨" label="Controls" value="40+" sub="พร้อมใช้งาน" />
            </div>

            <div className="quick-links">
                <h3>เข้าถึงด่วน</h3>
                <div className="link-grid">
                    <QuickLink href="/formbuilder" icon="🛠️" label="Form Builder" />
                    <QuickLink href="/controls-docs" icon="📖" label="Controls Docs" />
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, sub }) {
    return (
        <div className="stat-card">
            <span className="stat-icon">{icon}</span>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
            {sub && <div className="stat-sub">{sub}</div>}
        </div>
    );
}

function QuickLink({ href, icon, label }) {
    const navigate = useNavigate();
    return (
        <button className="quick-link-btn" onClick={() => navigate(href)}>
            <span>{icon}</span>
            <span>{label}</span>
        </button>
    );
}

function PlaceholderPage({ title, desc }) {
    return (
        <div className="placeholder-page">
            <h3>{title}</h3>
            <p>{desc}</p>
            <div className="placeholder-box">
                <span>🚧</span>
                <p>อยู่ระหว่างพัฒนา — จะเชื่อมกับ backend ใน Phase 4</p>
            </div>
        </div>
    );
}

export default Dashboard;
