import React from 'react';
import './GridviewControl.css';
import { genControl } from './TableviewControl';
import PaginationControl from './PaginationControl';

function GridviewControl({ config }) {
    const { 
        data = [], 
        controls = [], 
        className = '',
        pagination,
        onPageChange,
        onLimitChange,
        columns = 3, // Number of columns (desktop)
        tabletColumns = 2, // Number of columns (tablet)
        mobileColumns = 1, // Number of columns (mobile)
        cardStyle = 'default', // 'default', 'bordered', 'elevated', 'compact'
        showHeader = true, // Show field labels in cards
        caption = '', // Grid caption for SEO
        ariaLabel = '', // ARIA label for accessibility
        schemaType = 'ItemList', // Schema.org type
        id = '',
        gap = '20px', // Gap between cards
        onCardClick // Optional card click handler
    } = config;

    // Handle pagination
    const currentPage = pagination?.page || 1;
    const limit = pagination?.limit || data.length;
    const total = pagination?.total || data.length;
    const totalPages = Math.ceil(total / limit);

    console.log('GridviewControl pagination:', { 
        currentPage, 
        limit, 
        total, 
        totalPages,
        dataLength: data.length 
    });

    // Paginated data
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = pagination ? data.slice(startIndex, endIndex) : data;

    // Generate card content
    const renderCardContent = (rowData, rowIndex) => {
        return controls.map((control, colIndex) => {
            // Skip invisible controls
            if (control.visible === false) return null;

            // Handle buttons separately
            if (control.type === 'button') {
                return null; // Will render in actions section
            }

            return (
                <div key={colIndex} className="gridview-card-field">
                    {showHeader && control.label && (
                        <div className="gridview-card-label">{control.label}</div>
                    )}
                    <div className="gridview-card-value">
                        {genControl(control, rowData, rowIndex)}
                    </div>
                </div>
            );
        });
    };

    // Render action buttons
    const renderCardActions = (rowData, rowIndex) => {
        const buttonControls = controls.filter(c => c.type === 'button');
        if (buttonControls.length === 0) return null;

        return (
            <div className="gridview-card-actions">
                {buttonControls.map((control, colIndex) => (
                    <div key={colIndex}>
                        {genControl(control, rowData, rowIndex)}
                    </div>
                ))}
            </div>
        );
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (onPageChange) {
            onPageChange(newPage);
        }
    };

    // Handle limit change
    const handleLimitChange = (newLimit) => {
        if (onLimitChange) {
            onLimitChange(newLimit);
        }
    };

    return (
        <div 
            className={`gridview-container ${className}`}
            id={id}
            role="region"
            aria-label={ariaLabel || caption || 'Grid view'}
            itemScope={schemaType ? true : false}
            itemType={schemaType ? `https://schema.org/${schemaType}` : undefined}
        >
            {/* Caption (SEO friendly) */}
            {caption && (
                <div className="gridview-caption" role="heading" aria-level="2">
                    {caption}
                </div>
            )}

            {/* Grid Cards */}
            <div 
                className={`gridview-grid gridview-style-${cardStyle}`}
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: gap,
                    '--tablet-columns': tabletColumns,
                    '--mobile-columns': mobileColumns
                }}
                role="list"
            >
                {paginatedData.length === 0 ? (
                    <div className="gridview-empty" role="status">
                        <p>No data available</p>
                    </div>
                ) : (
                    paginatedData.map((rowData, rowIndex) => (
                        <div
                            key={rowIndex}
                            className={`gridview-card ${onCardClick ? 'clickable' : ''}`}
                            onClick={() => onCardClick && onCardClick(rowData, rowIndex)}
                            role="listitem"
                            tabIndex={onCardClick ? 0 : undefined}
                            onKeyPress={(e) => {
                                if (onCardClick && (e.key === 'Enter' || e.key === ' ')) {
                                    e.preventDefault();
                                    onCardClick(rowData, rowIndex);
                                }
                            }}
                            itemProp={schemaType === 'ItemList' ? 'itemListElement' : undefined}
                            itemScope={schemaType === 'ItemList' ? true : false}
                            itemType={schemaType === 'ItemList' ? 'https://schema.org/ListItem' : undefined}
                        >
                            {/* Card Content */}
                            <div className="gridview-card-content">
                                {renderCardContent(rowData, rowIndex)}
                            </div>

                            {/* Card Actions */}
                            {renderCardActions(rowData, rowIndex)}
                        </div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {pagination && totalPages > 1 && (
                <div className="gridview-pagination">
                    <div className="gridview-pagination-info">
                        Showing {startIndex + 1}-{Math.min(endIndex, total)} of {total}
                    </div>
                    
                    <PaginationControl
                        control={{
                            currentPage: currentPage,
                            totalPages: totalPages,
                            onChange: (event) => handlePageChange(event.target.value),
                            showFirstLast: true,
                            maxVisible: 5
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default GridviewControl;
