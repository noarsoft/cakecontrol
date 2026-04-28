import { useState } from 'react';
import ThemeSwitcher from '../../ThemeSwitcher';
import { ComingSoonPage } from './shared';
import { pages, getCategories } from './pageRegistry';
import './ControlsDocs.css';

function ControlsDocs() {
    const [currentPage, setCurrentPage] = useState('overview');
    const [logs, setLogs] = useState([]);

    const addLog = (message) => {
        const timestamp = new Date().toLocaleTimeString('th-TH');
        setLogs(prev => [...prev, { time: timestamp, message }]);
    };

    const clearLogs = () => setLogs([]);
    const categories = getCategories();

    const renderPageContent = () => {
        const entry = pages[currentPage];
        if (!entry?.component) return <ComingSoonPage pageName={entry?.title || currentPage} />;
        const Component = entry.component;
        const props = { addLog };
        if (entry.passSetPage) props.setPage = setCurrentPage;
        return <Component {...props} />;
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

export default ControlsDocs;
