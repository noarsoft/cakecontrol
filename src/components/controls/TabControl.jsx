// TabControl.jsx
import React, { useState } from 'react';
import FormControl from './FormControl';
import './TabControl.css';

/**
 * TabControl - Tab navigation with FormControl content
 * 
 * Props:
 * - control.tabs: Array of tab items
 * - control.activeTab: Active tab value
 * - control.tabPosition: 'top', 'bottom', 'left', 'right' (default: 'top')
 * - control.onTabChange: Callback when tab changes
 * - control.tabStyle: Additional tab style
 * - control.contentStyle: Additional content style
 * 
 * Each tab:
 * - label: Tab label
 * - value: Tab value
 * - icon: Optional icon
 * - disabled: Disable this tab
 * - content: FormControl config or custom content
 * 
 * Example:
 * <TabControl control={{
 *   tabs: [
 *     {
 *       label: 'Personal',
 *       value: 'personal',
 *       icon: '👤',
 *       content: {
 *         colnumbers: 6,
 *         data: [{ name: 'John' }],
 *         controls: [...]
 *       }
 *     }
 *   ],
 *   activeTab: 'personal',
 *   onTabChange: (event, tab) => console.log(tab)
 * }} />
 */
function TabControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const {
        tabs = [],
        tabPosition = 'top',
        onTabChange,
        tabStyle = {},
        contentStyle = {},
        className = ''
    } = control;

    const [activeTab, setActiveTab] = useState(control.activeTab || (tabs.length > 0 ? tabs[0].value : null));

    const handleTabClick = (tab) => {
        if (tab.disabled) return;

        setActiveTab(tab.value);

        if (onTabChange) {
            const event = {
                target: {
                    value: tab.value,
                    tab: tab
                }
            };
            onTabChange(event, tab, rowData, rowIndex);
        }
    };

    const activeTabData = tabs.find(tab => tab.value === activeTab);

    const isVertical = tabPosition === 'left' || tabPosition === 'right';

    return (
        <div 
            className={`tab-control tab-${tabPosition} ${className}`}
            style={{
                display: 'flex',
                flexDirection: isVertical ? 'row' : 'column',
                width: '100%'
            }}
        >
            {/* Tab Navigation */}
            <div
                className="tab-navigation"
                style={{
                    display: 'flex',
                    flexDirection: isVertical ? 'column' : 'row',
                    gap: '5px',
                    order: tabPosition === 'bottom' || tabPosition === 'right' ? 2 : 1,
                    flexShrink: 0,
                    ...tabStyle
                }}
            >
                {tabs.map((tab, index) => {
                    const isActive = activeTab === tab.value;
                    const isDisabled = tab.disabled || false;

                    return (
                        <button
                            key={index}
                            className={`tab-button ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                            onClick={() => handleTabClick(tab)}
                            disabled={isDisabled}
                        >
                            {tab.icon && <span>{tab.icon}</span>}
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div
                className="tab-content"
                style={{
                    flex: 1,
                    order: tabPosition === 'bottom' || tabPosition === 'right' ? 1 : 2,
                    ...contentStyle
                }}
            >
                {activeTabData ? (
                    <>
                        {activeTabData.content && (
                            <FormControl
                                config={{
                                    ...activeTabData.content,
                                    onChange: (event) => {
                                        if (activeTabData.content.onChange) {
                                            activeTabData.content.onChange(event, activeTabData, rowData, rowIndex);
                                        }
                                    }
                                }}
                            />
                        )}
                        {activeTabData.customContent && activeTabData.customContent}
                    </>
                ) : (
                    <div style={{ 
                        padding: '40px', 
                        textAlign: 'center', 
                        color: 'var(--text-tertiary)',
                        fontSize: '14px'
                    }}>
                        No content available
                    </div>
                )}
            </div>

            {/* Empty State */}
            {tabs.length === 0 && (
                <div style={{ 
                    padding: '40px', 
                    textAlign: 'center', 
                    color: 'var(--text-tertiary)',
                    fontSize: '14px',
                    border: '1px dashed var(--border-secondary)',
                    borderRadius: '8px'
                }}>
                    No tabs available
                </div>
            )}
        </div>
    );
}

export default TabControl;
