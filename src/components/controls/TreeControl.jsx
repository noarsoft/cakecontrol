import React, { useState, useEffect } from 'react';
import FormControl from './FormControl';
import './TreeControl.css';

/**
 * TreeControl Component
 * แสดงข้อมูลแบบ Tree Structure (Hierarchical)
 * 
 * Features:
 * - Expandable/Collapsible nodes
 * - Checkbox selection (single/multiple)
 * - Custom icons for expanded/collapsed states
 * - FormControl integration for node content
 * - Search/filter support
 * - Drag & drop support (optional)
 * 
 * @param {Object} control - Configuration object
 * @param {Array} control.data - Tree data array
 * @param {string} control.childrenKey - Key for children nodes (default: 'children')
 * @param {string} control.labelKey - Key for node label (default: 'label')
 * @param {string} control.valueKey - Key for node value (default: 'value')
 * @param {boolean} control.checkable - Show checkboxes (default: false)
 * @param {boolean} control.multiple - Allow multiple selection (default: true if checkable)
 * @param {Array} control.defaultExpanded - Array of node values to expand by default
 * @param {Array} control.defaultChecked - Array of node values to check by default
 * @param {Object} control.icons - Custom icons { expanded, collapsed, leaf }
 * @param {Object} control.nodeConfig - FormControl config for node content
 * @param {Function} control.onSelect - Callback when node is selected
 * @param {Function} control.onCheck - Callback when checkbox is checked
 * @param {Function} control.onExpand - Callback when node is expanded/collapsed
 * @param {boolean} control.showLine - Show connecting lines (default: true)
 * @param {boolean} control.disabled - Disable all interactions
 * @param {string} control.searchText - Filter nodes by text
 */
function TreeControl({ control = {}, rowData = {}, rowIndex = 0, ...propOverrides }) {
    const merged = { ...control, ...propOverrides };
    const {
        data = [],
        childrenKey = 'children',
        labelKey = 'label',
        valueKey = 'value',
        checkable = false,
        multiple = true,
        defaultExpanded = [],
        defaultChecked = [],
        icons = {},
        nodeConfig = null,
        onSelect,
        onCheck,
        onExpand,
        showLine = true,
        disabled = false,
        searchText = '',
        className = ''
    } = merged;

    const [expandedNodes, setExpandedNodes] = useState(() => new Set(defaultExpanded));
    const [checkedNodes, setCheckedNodes] = useState(() => 
        checkable ? new Set(defaultChecked) : new Set()
    );
    const [selectedNode, setSelectedNode] = useState(null);

    // Default icons
    const defaultIcons = {
        expanded: '📂',
        collapsed: '📁',
        leaf: '📄',
        ...icons
    };

    // Utility: Get node value
    const getNodeValue = (node) => {
        return typeof node === 'object' ? (node[valueKey] || node[labelKey]) : node;
    };

    // Utility: Get node label
    const getNodeLabel = (node) => {
        return typeof node === 'object' ? (node[labelKey] || node[valueKey]) : node;
    };

    // Utility: Check if node has children
    const hasChildren = (node) => {
        return node[childrenKey] && Array.isArray(node[childrenKey]) && node[childrenKey].length > 0;
    };

    // Utility: Filter nodes by search text
    const filterNode = (node, searchLower) => {
        if (!searchLower) return true;
        
        const label = getNodeLabel(node).toString().toLowerCase();
        if (label.includes(searchLower)) return true;
        
        if (hasChildren(node)) {
            return node[childrenKey].some(child => filterNode(child, searchLower));
        }
        
        return false;
    };

    // Handle node expand/collapse
    const handleToggleExpand = (node, event) => {
        event.stopPropagation();
        
        if (disabled || node.disabled) return;
        
        const nodeValue = getNodeValue(node);
        const newExpanded = new Set(expandedNodes);
        const isExpanded = newExpanded.has(nodeValue);
        
        if (isExpanded) {
            newExpanded.delete(nodeValue);
        } else {
            newExpanded.add(nodeValue);
        }
        
        setExpandedNodes(newExpanded);
        
        if (onExpand) {
            const expandEvent = {
                target: { 
                    value: nodeValue, 
                    expanded: !isExpanded,
                    node: node 
                }
            };
            onExpand(expandEvent, node, !isExpanded, rowData, rowIndex);
        }
    };

    // Handle node selection (click)
    const handleNodeSelect = (node, event) => {
        event.stopPropagation();
        
        if (disabled || node.disabled) return;
        
        const nodeValue = getNodeValue(node);
        setSelectedNode(nodeValue);
        
        if (onSelect) {
            const selectEvent = {
                target: { 
                    value: nodeValue, 
                    node: node 
                }
            };
            onSelect(selectEvent, node, rowData, rowIndex);
        }
    };

    // Handle checkbox change
    const handleCheckboxChange = (node, event) => {
        event.stopPropagation();
        
        if (disabled || node.disabled) return;
        
        const nodeValue = getNodeValue(node);
        const newChecked = new Set(checkedNodes);
        
        if (newChecked.has(nodeValue)) {
            newChecked.delete(nodeValue);
            // Uncheck all children
            uncheckChildren(node, newChecked);
        } else {
            if (!multiple) {
                newChecked.clear();
            }
            newChecked.add(nodeValue);
            // Check all children
            checkChildren(node, newChecked);
        }
        
        setCheckedNodes(newChecked);
        
        if (onCheck) {
            const checkEvent = {
                target: { 
                    value: multiple ? Array.from(newChecked) : nodeValue,
                    checked: newChecked.has(nodeValue),
                    node: node 
                }
            };
            onCheck(checkEvent, node, newChecked.has(nodeValue), rowData, rowIndex);
        }
    };

    // Check all children recursively
    const checkChildren = (node, checkedSet) => {
        if (hasChildren(node)) {
            node[childrenKey].forEach(child => {
                if (!child.disabled) {
                    checkedSet.add(getNodeValue(child));
                    checkChildren(child, checkedSet);
                }
            });
        }
    };

    // Uncheck all children recursively
    const uncheckChildren = (node, checkedSet) => {
        if (hasChildren(node)) {
            node[childrenKey].forEach(child => {
                checkedSet.delete(getNodeValue(child));
                uncheckChildren(child, checkedSet);
            });
        }
    };

    // Render a single tree node
    const renderNode = (node, level = 0) => {
        const nodeValue = getNodeValue(node);
        const nodeLabel = getNodeLabel(node);
        const isExpanded = expandedNodes.has(nodeValue);
        const isChecked = checkedNodes.has(nodeValue);
        const isSelected = selectedNode === nodeValue;
        const isLeaf = !hasChildren(node);
        const isDisabled = disabled || node.disabled;
        
        // Filter check
        const searchLower = searchText.toLowerCase();
        if (searchText && !filterNode(node, searchLower)) {
            return null;
        }

        // Icon selection
        let icon = isLeaf ? defaultIcons.leaf : 
                   (isExpanded ? defaultIcons.expanded : defaultIcons.collapsed);
        
        if (node.icon) {
            icon = typeof node.icon === 'function' ? node.icon(node, isExpanded) : node.icon;
        }

        return (
            <div 
                key={nodeValue} 
                className={`tree-control-node ${isDisabled ? 'disabled' : ''}`}
            >
                <div 
                    className={`tree-control-node-content ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                    style={{ paddingLeft: `${level * 24}px` }}
                    onClick={(e) => handleNodeSelect(node, e)}
                >
                    {/* Expand/Collapse button */}
                    {!isLeaf && (
                        <span 
                            className="tree-control-toggle"
                            onClick={(e) => handleToggleExpand(node, e)}
                        >
                            {isExpanded ? '▼' : '▶'}
                        </span>
                    )}
                    {isLeaf && showLine && (
                        <span className="tree-control-toggle tree-control-leaf-spacer"></span>
                    )}

                    {/* Checkbox */}
                    {checkable && (
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => handleCheckboxChange(node, e)}
                            disabled={isDisabled}
                            className="tree-control-checkbox"
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}

                    {/* Icon */}
                    {icon && (
                        <span className="tree-control-icon">{icon}</span>
                    )}

                    {/* Label or FormControl */}
                    {nodeConfig ? (
                        <div className="tree-control-form-content">
                            <FormControl 
                                config={{
                                    ...nodeConfig,
                                    data: [node]
                                }}
                            />
                        </div>
                    ) : (
                        <span className="tree-control-label">{nodeLabel}</span>
                    )}
                </div>

                {/* Children */}
                {!isLeaf && isExpanded && (
                    <div className={`tree-control-children ${showLine ? 'with-line' : ''}`}>
                        {node[childrenKey].map(child => renderNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    // Empty state
    if (!data || data.length === 0) {
        return (
            <div className={`tree-control tree-control-empty ${className}`}>
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                    <div style={{ fontSize: '48px', marginBottom: '10px' }}>🌳</div>
                    <div>No data available</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`tree-control ${className} ${disabled ? 'disabled' : ''} ${showLine ? 'show-line' : ''}`}>
            {data.map(node => renderNode(node, 0))}
        </div>
    );
}

export default TreeControl;
