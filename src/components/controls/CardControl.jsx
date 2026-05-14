// CardControl.jsx
import React from 'react';
import FormControl from './FormControl';
import './CardControl.css';

/**
 * CardControl - Renders cards based on array data
 * 
 * Props:
 * - control.data: Array of data objects
 * - control.cardConfig: Configuration for each card (FormControl config)
 * - control.columns: Number of columns (default: 3)
 * - control.gap: Gap between cards (default: '20px')
 * - control.cardStyle: Additional card style
 * - control.onCardClick: Callback when card is clicked
 * 
 * Example:
 * <CardControl control={{
 *   data: users,
 *   columns: 3,
 *   gap: '20px',
 *   cardConfig: {
 *     colnumbers: 6,
 *     controls: [
 *       { colno: 1, rowno: 1, type: 'label', databind: 'name' },
 *       { colno: 1, rowno: 2, type: 'textbox', databind: 'email' }
 *     ]
 *   },
 *   onCardClick: (data, index) => console.log('Clicked:', data)
 * }} />
 */
function CardControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const {
        data = [],
        cardConfig = {},
        columns = 3,
        gap = '20px',
        cardStyle = {},
        onCardClick,
        className = ''
    } = control;

    const handleCardClick = (cardData, index) => {
        if (onCardClick) {
            const event = {
                target: {
                    value: cardData,
                    index: index
                }
            };
            onCardClick(event, cardData, index);
        }
    };

    return (
        <div 
            className={`card-control-container ${className}`}
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: gap,
                width: '100%'
            }}
        >
            {data.map((cardData, index) => (
                <div
                    key={index}
                    className={`card-control-item ${onCardClick ? 'clickable' : ''}`}
                    style={{
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-secondary)',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.2s',
                        cursor: onCardClick ? 'pointer' : 'default',
                        ...cardStyle
                    }}
                    onClick={() => handleCardClick(cardData, index)}
                >
                    <FormControl
                        config={{
                            ...cardConfig,
                            data: [cardData],
                            onChange: (event) => {
                                if (cardConfig.onChange) {
                                    cardConfig.onChange(event, cardData, index);
                                }
                            }
                        }}
                    />
                </div>
            ))}

            {/* Empty State */}
            {data.length === 0 && (
                <div
                    style={{
                        gridColumn: `1 / -1`,
                        textAlign: 'center',
                        padding: '40px',
                        color: 'var(--text-disabled)',
                        fontSize: '14px'
                    }}
                >
                    No cards to display
                </div>
            )}
        </div>
    );
}

export default CardControl;
