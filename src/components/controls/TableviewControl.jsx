
let data = [
    {
        "id": "1",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "src": "https://randomuser.me/api/portraits/men/1.jpg",
        "status": "active",
        "progress": 75,
        "age": 28,
        "verified": true,
        "role": "admin",
        "joinDate": "2024-01-15"
    },
    {
        "id": "2",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "src": "https://randomuser.me/api/portraits/women/2.jpg",
        "status": "inactive",
        "progress": 45,
        "age": 32,
        "verified": false,
        "role": "user",
        "joinDate": "2024-03-20"
    }
]


let controls = {
    type: "TableView",
    colwidths: ["40", "60", "auto", "150", "100", "80", "100", "80", "80"],
    data: data,
    controls: [
        {
            type: "checkbox",
            value: ""
        },
        {
            type: "image",
            databind: "src",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            alt: "Profile"
        },
        {
            type: "label",
            visible: false,
            value: "",
            iskey: 1,
            databind: "id",
        },
        {
            type: "label",
            value: "",
            databind: "name",
        },
        {
            type: "link",
            textBind: "email",
            databind: "email",
            onClick: (rowData) => {
                window.location.href = `mailto:${rowData.email}`;
            }
        },
        {
            type: "badge",
            databind: "status",
            backgroundColor: (rowData) => rowData.status === 'active' ? '#28a745' : '#dc3545'
        },
        {
            type: "select",
            databind: "role",
            options: [
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
                { value: "guest", label: "Guest" }
            ],
            onChange: (e) => console.log('Role changed:', e.target.value)
        },
        {
            type: "toggle",
            databind: "verified",
            onChange: (e) => console.log('Verified:', e.target.checked)
        },
        {
            type: "button",
            value: "edit",
            onClick: (rowData, rowIndex) => {
                console.log('Edit row:', rowIndex, rowData);
            }
        },
        {
            type: "button",
            value: "delete",
            className: "btn-danger",
            onClick: (rowData, rowIndex) => {
                console.log('Delete row:', rowIndex, rowData);
            }
        }
    ]
}

// Example: Using onHeaderClick to handle column sorting
/*
<TableviewControl config={{
    ...controls,
    headers: ['Checkbox', 'Photo', 'ID', 'Name', 'Email', 'Status', 'Role', 'Verified', 'Actions'],
    onHeaderClick: (event) => {
        console.log('Header clicked:', event);
        // event contains:
        // - columnIndex: index of clicked column (0, 1, 2, ...)
        // - columnName: header text ('Name', 'Email', etc.)
        // - columnControl: the control definition for this column
        
        // Example: Sort table by column
        // const { columnIndex, columnName } = event;
        // sortData(columnIndex);
    }
}} />
*/

// Example with more control types
let advancedControls = {
    type: "TableView",
    colwidths: ["auto", "100", "120", "80"],
    data: data,
    controls: [
        {
            type: "textbox",
            databind: "name",
            placeholder: "Enter name",
            onChange: (e) => console.log('Name:', e.target.value)
        },
        {
            type: "number",
            databind: "age",
            min: 18,
            max: 100,
            step: 1
        },
        {
            type: "date",
            databind: "joinDate"
        },
        {
            type: "progress",
            databind: "progress",
            showValue: true,
            color: "#28a745"
        }
    ]
}

// TableviewControl.jsx
import React from 'react';
import './TableviewControl.css';
import CheckboxControl from './CheckboxControl';
import LabelControl from './LabelControl';
import ButtonControl from './ButtonControl';
import TextboxControl from './TextboxControl';
import NumberControl from './NumberControl';
import SelectControl from './SelectControl';
import ImageControl from './ImageControl';
import LinkControl from './LinkControl';
import BadgeControl from './BadgeControl';
import IconControl from './IconControl';
import DateControl from './DateControl';
import ToggleControl from './ToggleControl';
import ProgressControl from './ProgressControl';
import CalendarControl from './CalendarControl';
import DatePickerControl from './DatePickerControl';
import DropdownControl from './DropdownControl';
import PasswordControl from './PasswordControl';
import QRCodeControl from './QRCodeControl';
import PaginationControl from './PaginationControl';
import RatingControl from './RatingControl';
import SliderControl from './SliderControl';
import BarChartJSControl from './BarChartJSControl';
import LineChartJSControl from './LineChartJSControl';
import PieChartJSControl from './PieChartJSControl';
import DoughnutChartJSControl from './DoughnutChartJSControl';
import RadarChartJSControl from './RadarChartJSControl';
import AreaChartJSControl from './AreaChartJSControl';
import BubbleChartJSControl from './BubbleChartJSControl';
import MixedChartJSControl from './MixedChartJSControl';

/**
 * Generate control component based on control type
 */
function genControl(control, rowData, rowIndex) {
    const key = `${rowIndex}-${control.type}-${control.databind || Math.random()}`;
    const props = { control, rowData, rowIndex };
    
    switch(control.type) {
        case "checkbox":
            return <CheckboxControl key={key} {...props} />;
        
        case "label":
            return <LabelControl key={key} {...props} />;
        
        case "button":
            return <ButtonControl key={key} {...props} />;
        
        case "textbox":
        case "input":
            return <TextboxControl key={key} {...props} />;
        
        case "number":
            return <NumberControl key={key} {...props} />;
        
        case "select":
        case "dropdown":
            return <SelectControl key={key} {...props} />;
        
        case "image":
            return <ImageControl key={key} {...props} />;
        
        case "link":
            return <LinkControl key={key} {...props} />;
        
        case "badge":
        case "tag":
            return <BadgeControl key={key} {...props} />;
        
        case "icon":
            return <IconControl key={key} {...props} />;
        
        case "date":
            return <DateControl key={key} {...props} />;
        
        case "datepicker":
            return <DatePickerControl key={key} {...props} />;
        
        case "tabledropdown":
            return <DropdownControl key={key} {...props} />;

        case "password":
            return <PasswordControl key={key} {...props} />;
        
        case "toggle":
        case "switch":
            return <ToggleControl key={key} {...props} />;
        
        case "progress":
        case "progressbar":
            return <ProgressControl key={key} {...props} />;
        
        case "calendar":
            return <CalendarControl key={key} {...props} />;
        
        case "qrcode":
        case "qr":
            return <QRCodeControl key={key} {...props} />;
        
        case "pagination":
        case "pager":
            return <PaginationControl key={key} {...props} />;
        
        case "rating":
        case "star":
            return <RatingControl key={key} {...props} />;
        
        case "slider":
        case "range":
            return <SliderControl key={key} {...props} />;
        
        case "barchartjs":
        case "bar":
            return <BarChartJSControl key={key} {...props} />;
        
        case "linechartjs":
        case "line":
            return <LineChartJSControl key={key} {...props} />;
        
        case "piechartjs":
        case "pie":
            return <PieChartJSControl key={key} {...props} />;
        
        case "doughnenchartjs":
        case "doughnut":
            return <DoughnutChartJSControl key={key} {...props} />;
        
        case "radarchartjs":
        case "radar":
            return <RadarChartJSControl key={key} {...props} />;
        
        case "areachartjs":
        case "area":
            return <AreaChartJSControl key={key} {...props} />;
        
        case "bubblechartjs":
        case "bubble":
            return <BubbleChartJSControl key={key} {...props} />;
        
        case "mixedchartjs":
        case "mixed":
            return <MixedChartJSControl key={key} {...props} />;
        
        case "custom":
            return control.render ? control.render(rowData, rowIndex) : null;
        
        default:
            return null;
    }
}

/**
 * TableView Component
 * Renders a table with dynamic controls for each cell
 */
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
        responsive = false, // Enable responsive card mode on mobile
        caption = '', // Table caption for SEO
        summary = '', // Table summary/description
        ariaLabel = '', // ARIA label for accessibility
        schemaType = '', // Schema.org type (e.g., 'Table', 'ItemList')
        id = '' // Unique table ID
    } = config;

    // Handle pagination
    const currentPage = pagination?.page || 1;
    const limit = pagination?.limit || data.length;
    const total = pagination?.total || data.length;
    const totalPages = Math.ceil(total / limit);

    // Paginated data
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = pagination ? data.slice(startIndex, endIndex) : data;

    return (
        <div className={`tableview-container ${responsive ? 'responsive' : ''} ${className}`}>
            {/* Desktop Table View */}
            <table 
                className="tableview"
                id={id}
                aria-label={ariaLabel || caption || 'Data table'}
                summary={summary}
                itemScope={schemaType ? true : false}
                itemType={schemaType ? `https://schema.org/${schemaType}` : undefined}
            >
                {/* Table Caption (SEO friendly) */}
                {caption && <caption style={{ 
                    padding: '12px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textAlign: 'left',
                    color: '#374151',
                    captionSide: 'top'
                }}>{caption}</caption>}
                {/* Header Row (optional) */}
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
                
                {/* Data Rows */}
                <tbody>
                    {paginatedData.map((rowData, rowIndex) => (
                        <tr 
                            key={rowIndex}
                            itemProp={schemaType === 'ItemList' ? 'itemListElement' : undefined}
                            itemScope={schemaType === 'ItemList' ? true : false}
                            itemType={schemaType === 'ItemList' ? 'https://schema.org/ListItem' : undefined}
                        >
                            {controls.map((control, colIndex) => {
                                // First column with data could be row header
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

            {/* Mobile Card View (only shown when responsive=true and on mobile) */}
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
                                // Skip hidden controls or controls without headers
                                if (control.visible === false) return null;
                                
                                const header = headers[colIndex] || `Field ${colIndex + 1}`;
                                const controlElement = genControl(control, rowData, rowIndex);
                                
                                // Special handling for buttons - group them together
                                if (control.type === 'button') {
                                    return null; // Handle buttons separately below
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
                            
                            {/* Group all buttons at the bottom */}
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
            
            {/* Empty State */}
            {data.length === 0 && (
                <div className="tableview-empty">
                    <p>No data available</p>
                </div>
            )}

            {/* Pagination Controls - Footer (outside table) */}
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





