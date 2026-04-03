import { useState } from 'react';
import { useTheme } from '../ThemeContext';
import ThemeSwitcher from '../ThemeSwitcher';
import './controls_doc/ControlsDocs.css';

function AppLayout({ children, sidebar = null }) {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="controls-docs-container" data-theme={theme}>
      {/* Sidebar */}
      {sidebar && (
        <div className={`docs-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-theme-switcher">
            <ThemeSwitcher />
          </div>
          {sidebar}
        </div>
      )}

      {/* Main Content */}
      <div className="docs-content">
        <div className="content-wrapper">
          {children}
        </div>
      </div>

      {/* Mobile Menu Toggle (optional) */}
      {sidebar && (
        <button
          className="mobile-menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 101,
            display: 'none',
          }}
        >
          ☰
        </button>
      )}
    </div>
  );
}

export default AppLayout;
