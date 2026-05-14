// PaginationControl.jsx
import React from 'react';
import './PaginationControl.css';

/**
 * PaginationControl - Pagination component
 * 
 * Props:
 * - control.currentPage: Current page number (1-based)
 * - control.totalPages: Total number of pages
 * - control.totalItems: Total number of items (optional)
 * - control.pageSize: Items per page (optional)
 * - control.maxButtons: Maximum number of page buttons to show (default: 5)
 * - control.showFirstLast: Show first/last buttons (default: true)
 * - control.showPrevNext: Show previous/next buttons (default: true)
 * - control.showPageInfo: Show "Page X of Y" text (default: true)
 * - control.showItemInfo: Show "Showing X-Y of Z items" (default: true)
 * - control.onChange: Callback function (event, newPage)
 * - control.disabled: Disable all buttons (default: false)
 */
function PaginationControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const {
        currentPage = 1,
        totalPages = 1,
        totalItems = 0,
        pageSize = 10,
        maxButtons = 5,
        showFirstLast = true,
        showPrevNext = true,
        showPageInfo = true,
        showItemInfo = true,
        onChange,
        disabled = false
    } = control;

    const handlePageChange = (newPage) => {
        if (disabled || !onChange || newPage < 1 || newPage > totalPages || newPage === currentPage) {
            return;
        }
        
        const event = {
            target: {
                value: newPage,
                currentPage: newPage,
                totalPages,
                pageSize
            }
        };
        
        onChange(event, rowData, rowIndex);
    };

    // Calculate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const half = Math.floor(maxButtons / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + maxButtons - 1);
        
        // Adjust start if we're near the end
        if (end - start + 1 < maxButtons) {
            start = Math.max(1, end - maxButtons + 1);
        }
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    // Calculate item range for current page
    const getItemRange = () => {
        if (!totalItems || !pageSize) return null;
        const start = (currentPage - 1) * pageSize + 1;
        const end = Math.min(currentPage * pageSize, totalItems);
        return { start, end };
    };

    const pageNumbers = getPageNumbers();
    const itemRange = getItemRange();

    return (
        <div className="pagination-control">
            {/* Item info */}
            {showItemInfo && itemRange && (
                <div className="pagination-info">
                    Showing {itemRange.start}-{itemRange.end} of {totalItems} items
                </div>
            )}

            {/* Pagination buttons */}
            <div className="pagination-buttons">
                {/* First button */}
                {showFirstLast && (
                    <button
                        className={`pagination-btn ${currentPage === 1 || disabled ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1 || disabled}
                        title="First page"
                    >
                        ««
                    </button>
                )}

                {/* Previous button */}
                {showPrevNext && (
                    <button
                        className={`pagination-btn ${currentPage === 1 || disabled ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || disabled}
                        title="Previous page"
                    >
                        ‹
                    </button>
                )}

                {/* Page number buttons */}
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        className={`pagination-btn ${page === currentPage ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(page)}
                        disabled={disabled}
                    >
                        {page}
                    </button>
                ))}

                {/* Next button */}
                {showPrevNext && (
                    <button
                        className={`pagination-btn ${currentPage === totalPages || disabled ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || disabled}
                        title="Next page"
                    >
                        ›
                    </button>
                )}

                {/* Last button */}
                {showFirstLast && (
                    <button
                        className={`pagination-btn ${currentPage === totalPages || disabled ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages || disabled}
                        title="Last page"
                    >
                        »»
                    </button>
                )}
            </div>

            {/* Page info */}
            {showPageInfo && (
                <div className="pagination-info">
                    Page {currentPage} of {totalPages}
                </div>
            )}
        </div>
    );
}

export default PaginationControl;
