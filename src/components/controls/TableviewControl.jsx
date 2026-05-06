import './TableviewControl.css';
import { genControl } from './registry';
import PaginationControl from './PaginationControl';

function TableviewControl({ config }) {
    const {
        data = [],
        controls = [],
        colwidths = [],
        headers = [],
        className = '',
        pagination,
        onPageChange,
        onHeaderClick,
        responsive = false,
        caption = '',
        summary = '',
        ariaLabel = '',
        schemaType = '',
        id = ''
    } = config;

    const currentPage = pagination?.page || 1;
    const limit = pagination?.limit || data.length;
    const total = pagination?.total || data.length;
    const totalPages = Math.ceil(total / limit);

    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = pagination ? data.slice(startIndex, endIndex) : data;

    return (
        <div className={`tableview-container ${responsive ? 'responsive' : ''} ${className}`}>
            <table
                className="tableview"
                id={id}
                aria-label={ariaLabel || caption || 'Data table'}
                summary={summary}
                itemScope={schemaType ? true : false}
                itemType={schemaType ? `https://schema.org/${schemaType}` : undefined}
            >
                {caption && <caption style={{
                    padding: '12px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textAlign: 'left',
                    color: '#374151',
                    captionSide: 'top'
                }}>{caption}</caption>}
                {headers.length > 0 && (
                    <thead>
                        <tr>
                            {headers.map((header, idx) => (
                                <th
                                    key={idx}
                                    scope="col"
                                    style={{ width: colwidths[idx] || 'auto', cursor: onHeaderClick ? 'pointer' : 'auto' }}
                                    aria-label={typeof header === 'string' ? header : `Column ${idx + 1}`}
                                    onClick={() => onHeaderClick && onHeaderClick({
                                        columnIndex: idx,
                                        columnName: header,
                                        columnControl: controls[idx]
                                    })}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}

                <tbody>
                    {paginatedData.map((rowData, rowIndex) => (
                        <tr
                            key={rowIndex}
                            itemProp={schemaType === 'ItemList' ? 'itemListElement' : undefined}
                            itemScope={schemaType === 'ItemList' ? true : false}
                            itemType={schemaType === 'ItemList' ? 'https://schema.org/ListItem' : undefined}
                        >
                            {controls.map((control, colIndex) => {
                                const isRowHeader = colIndex === 0 && control.type === 'label';
                                const TagName = isRowHeader ? 'th' : 'td';

                                return (
                                    <TagName
                                        key={`${rowIndex}-${colIndex}`}
                                        scope={isRowHeader ? 'row' : undefined}
                                        style={{ width: colwidths[colIndex] || 'auto' }}
                                        headers={!isRowHeader && headers[colIndex] ? headers[colIndex] : undefined}
                                    >
                                        {genControl(control, rowData, rowIndex)}
                                    </TagName>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            {responsive && (
                <div
                    className="tableview-cards"
                    role="list"
                    aria-label={ariaLabel || caption || 'Data cards'}
                >
                    {paginatedData.map((rowData, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="tableview-card"
                            role="listitem"
                            itemProp={schemaType === 'ItemList' ? 'itemListElement' : undefined}
                            itemScope={schemaType === 'ItemList' ? true : false}
                            itemType={schemaType === 'ItemList' ? 'https://schema.org/ListItem' : undefined}
                        >
                            {controls.map((control, colIndex) => {
                                if (control.visible === false) return null;

                                const header = headers[colIndex] || `Field ${colIndex + 1}`;
                                const controlElement = genControl(control, rowData, rowIndex);

                                if (control.type === 'button') {
                                    return null;
                                }

                                return (
                                    <div key={`card-${rowIndex}-${colIndex}`} className="tableview-card-row">
                                        <div className="tableview-card-label">{header}</div>
                                        <div className="tableview-card-value">
                                            {controlElement}
                                        </div>
                                    </div>
                                );
                            })}

                            {controls.some(c => c.type === 'button') && (
                                <div className="tableview-card-row">
                                    <div className="tableview-card-label">Actions</div>
                                    <div className="tableview-card-actions">
                                        {controls.map((control, colIndex) =>
                                            control.type === 'button'
                                                ? genControl(control, rowData, rowIndex)
                                                : null
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {data.length === 0 && (
                <div className="tableview-empty">
                    <p>No data available</p>
                </div>
            )}

            {pagination && totalPages > 1 && (
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px' }}>
                    <PaginationControl
                        control={{
                            currentPage: currentPage,
                            totalPages: totalPages,
                            totalItems: total,
                            pageSize: limit,
                            maxButtons: 5,
                            showFirstLast: true,
                            showPrevNext: true,
                            showPageInfo: true,
                            showItemInfo: true,
                            onChange: (event) => {
                                if (onPageChange) {
                                    onPageChange(event.target.value, limit);
                                }
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default TableviewControl;
export { genControl };
