import React, { useState } from 'react';
import './MenuControl.css';

/**
 * MenuControl Component
 * A hierarchical menu control with support for nested submenus
 * 
 * @param {Array} data - Menu items array with structure:
 *   [
 *     {
 *       icon_src: string (optional),
 *       menu_name: string,
 *       text: string (optional, display text - falls back to menu_name),
 *       link: string,
 *       submenu: Array (optional)
 *     },
 *     ...
 *   ]
 * @param {string} orientation - 'vertical' or 'horizontal' (default: 'vertical')
 * @param {function} onMenuClick - Callback when menu item is clicked
 * @param {string} activeMenu - Currently active menu item key
 * @param {boolean} collapsible - Allow menu collapse/expand (default: true)
 * @param {Array} invisible_menu_name - Array of menu_name values to hide (default: [])
 * @param {string} className - Additional CSS classes
 */
function MenuControl({
  data = [],
  orientation = 'vertical',
  onMenuClick,
  activeMenu,
  collapsible = true,
  invisible_menu_name = [],
  className = ''
}) {
  const [expanded, setExpanded] = useState({});

  const toggleSubmenu = (menuName, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (collapsible) {
      setExpanded(prev => ({
        ...prev,
        [menuName]: !prev[menuName]
      }));
    }
  };

  const handleMenuClick = (item, e) => {
    e?.preventDefault();
    
    if (item.submenu && item.submenu.length > 0 && collapsible) {
      toggleSubmenu(item.menu_name, e);
    }
    
    if (onMenuClick) {
      onMenuClick(item);
    }
  };

  const renderMenuItem = (item, level = 0) => {
    // Check if this menu item is invisible
    if (invisible_menu_name.includes(item.menu_name)) {
      return null;
    }

    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isExpanded = expanded[item.menu_name];
    const isActive = activeMenu === item.menu_name;
    
    // Display text falls back to menu_name if text is not provided
    const displayText = item.text || item.menu_name;

    return (
      <li
        key={item.menu_name}
        className={`menu-item level-${level} ${hasSubmenu ? 'has-submenu' : ''} ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}
      >
        <a
          href={item.link || '#'}
          className={`menu-link ${hasSubmenu ? 'submenu-toggle' : ''}`}
          onClick={(e) => handleMenuClick(item, e)}
        >
          {item.icon_src && (
            <span className="menu-icon">
              <img src={item.icon_src} alt={item.menu_name} />
            </span>
          )}
          <span className="menu-text">{displayText}</span>
          {hasSubmenu && (
            <span className={`submenu-arrow ${isExpanded ? 'expanded' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 5L10 9L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </a>

        {hasSubmenu && isExpanded && (
          <ul className="submenu">
            {item.submenu.map(submenuItem => renderMenuItem(submenuItem, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className={`menu-control ${orientation} ${className}`}>
      <ul className="menu-list">
        {data.map(item => renderMenuItem(item))}
      </ul>
    </nav>
  );
}

export default MenuControl;
