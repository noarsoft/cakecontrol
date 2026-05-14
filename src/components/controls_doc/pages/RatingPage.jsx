import React, { useState } from 'react';
import { RatingControl } from '../../controls';
import { useTheme } from '../../../ThemeContext';

function RatingPage({ addLog }) {
    const { theme } = useTheme();
    const [demoRating, setDemoRating] = useState(3.5);
    const [starCount, setStarCount] = useState(5);
    const [allowHalf, setAllowHalf] = useState(true);
    const [showLabel, setShowLabel] = useState(true);
    const [ratingLogs, setRatingLogs] = useState([]);

    const handleRatingChange = (newRating) => {
        setDemoRating(newRating);
        const log = `⭐ Rating changed to: ${newRating}`;
        setRatingLogs([log, ...ratingLogs.slice(0, 9)]);
        if (addLog) addLog(log);
    };

    const products = [
        { id: 1, name: 'Product A', rating: 4.5 },
        { id: 2, name: 'Product B', rating: 3.0 },
        { id: 3, name: 'Product C', rating: 5.0 },
        { id: 4, name: 'Product D', rating: 2.5 },
        { id: 5, name: 'Product E', rating: 4.0 },
    ];

    return (
        <div className="page-content">
            <h1>⭐ Rating Control</h1>
            <p className="lead">
                Interactive star rating component with half-star support, customizable colors, and sizes
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    RatingControl provides an interactive star-based rating system. Users can rate items by clicking on stars,
                    with support for half-star ratings, custom colors, multiple sizes, and read-only mode.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">⭐</div>
                        <h3>Half-Star Support</h3>
                        <p>Rate with 0.5 increments for precise ratings</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Custom Colors</h3>
                        <p>Change star color with any valid CSS color</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📏</div>
                        <h3>Size Variants</h3>
                        <p>Small, medium, and large star sizes</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Read-Only Mode</h3>
                        <p>Display ratings without allowing changes</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>💡 Basic Example</h2>
                <p>Simple 5-star rating with default settings:</p>
                <div className="example-demo">
                    <RatingControl 
                        control={{
                            maxStars: 5,
                            color: '#ffc107',
                            size: 'medium',
                            onChange: handleRatingChange
                        }}
                        value={demoRating}
                    />
                </div>
                <pre className="code-block">{`<RatingControl 
    control={{
        maxStars: 5,
        color: '#ffc107',
        size: 'medium',
        onChange: (rating) => console.log(rating)
    }}
    value={demoRating}
/>`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Custom Colors & Sizes</h2>
                <p>Configure colors and sizes for different use cases:</p>
                <div className="example-demo">
                    <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                        <div>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Red (Small)</p>
                            <RatingControl 
                                control={{
                                    maxStars: 5,
                                    color: '#ef4444',
                                    size: 'small',
                                    onChange: handleRatingChange
                                }}
                                value={3}
                            />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Green (Medium)</p>
                            <RatingControl 
                                control={{
                                    maxStars: 5,
                                    color: '#10b981',
                                    size: 'medium',
                                    onChange: handleRatingChange
                                }}
                                value={4}
                            />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Blue (Large)</p>
                            <RatingControl 
                                control={{
                                    maxStars: 5,
                                    color: '#3b82f6',
                                    size: 'large',
                                    onChange: handleRatingChange
                                }}
                                value={5}
                            />
                        </div>
                    </div>
                </div>
                <pre className="code-block">{`// Different colors
<RatingControl control={{ color: '#ef4444', maxStars: 5 }} />
<RatingControl control={{ color: '#10b981', maxStars: 5 }} />
<RatingControl control={{ color: '#3b82f6', maxStars: 5 }} />

// Different sizes
<RatingControl control={{ size: 'small', maxStars: 5 }} />
<RatingControl control={{ size: 'medium', maxStars: 5 }} />
<RatingControl control={{ size: 'large', maxStars: 5 }} />`}</pre>
            </section>

            <section className="content-section">
                <h2>⚙️ Configurable Options</h2>
                <p>Customize the number of stars and behavior:</p>
                <div className="example-demo">
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>
                            <input 
                                type="checkbox" 
                                checked={allowHalf}
                                onChange={(e) => setAllowHalf(e.target.checked)}
                            /> Allow Half-Star Ratings
                        </label>
                        <label style={{ display: 'block', marginBottom: '8px' }}>
                            <input 
                                type="checkbox" 
                                checked={showLabel}
                                onChange={(e) => setShowLabel(e.target.checked)}
                            /> Show Label
                        </label>
                        <label style={{ display: 'block', marginBottom: '15px' }}>
                            Star Count:
                            <input 
                                type="number" 
                                min="3" 
                                max="10"
                                value={starCount}
                                onChange={(e) => setStarCount(parseInt(e.target.value))}
                                style={{ marginLeft: '8px', width: '60px', padding: '4px' }}
                            />
                        </label>
                    </div>
                    <RatingControl 
                        control={{
                            maxStars: starCount,
                            color: '#ffc107',
                            size: 'medium',
                            allowHalf: allowHalf,
                            showLabel: showLabel,
                            onChange: handleRatingChange
                        }}
                        value={demoRating}
                    />
                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                        <div style={{ fontSize: '12px', color: '#666' }}>Recent Events:</div>
                        {ratingLogs.map((log, i) => (
                            <div key={i} style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
                <pre className="code-block">{`<RatingControl 
    control={{
        maxStars: 5,
        color: '#ffc107',
        size: 'medium',
        allowHalf: true,      // Enable 0.5 increments
        showLabel: true,      // Show rating value
        disabled: false,      // Disable interaction
        readOnly: false,      // Read-only mode
        onChange: (rating) => console.log(rating)
    }}
    value={currentRating}
/>`}</pre>
            </section>

            <section className="content-section">
                <h2>📊 In Table (Read-Only)</h2>
                <p>Display product ratings in a read-only table:</p>
                <div className="example-demo">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ddd' }}>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Product</th>
                                <th style={{ textAlign: 'center', padding: '10px' }}>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>{product.name}</td>
                                    <td style={{ padding: '10px', textAlign: 'center' }}>
                                        <RatingControl 
                                            control={{
                                                maxStars: 5,
                                                color: '#ffc107',
                                                size: 'small',
                                                readOnly: true,
                                                showLabel: true
                                            }}
                                            value={product.rating}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <pre className="code-block">{`// Table cell with read-only rating
<RatingControl 
    control={{
        maxStars: 5,
        readOnly: true,
        showLabel: true,
        size: 'small'
    }}
    value={rowData.rating}
/>`}</pre>
            </section>

            <section className="content-section">
                <h2>📋 Props Reference</h2>
                <table className="props-table">
                    <thead>
                        <tr>
                            <th>Prop</th>
                            <th>Type</th>
                            <th>Default</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>control</code></td>
                            <td><code>object</code></td>
                            <td><code>-</code></td>
                            <td>Configuration object with rating options</td>
                        </tr>
                        <tr>
                            <td><code>value</code></td>
                            <td><code>number</code></td>
                            <td><code>0</code></td>
                            <td>Current rating value (0 to maxStars)</td>
                        </tr>
                        <tr>
                            <td><code>onChange</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Callback when rating changes <code>(rating) =&gt; {}</code></td>
                        </tr>
                        <tr>
                            <td><code>control.maxStars</code></td>
                            <td><code>number</code></td>
                            <td><code>5</code></td>
                            <td>Maximum number of stars to display</td>
                        </tr>
                        <tr>
                            <td><code>control.color</code></td>
                            <td><code>string</code></td>
                            <td><code>#ffc107</code></td>
                            <td>Color of filled stars (any CSS color)</td>
                        </tr>
                        <tr>
                            <td><code>control.size</code></td>
                            <td><code>string</code></td>
                            <td><code>medium</code></td>
                            <td>Size variant: <code>small</code>, <code>medium</code>, or <code>large</code></td>
                        </tr>
                        <tr>
                            <td><code>control.allowHalf</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Allow half-star (0.5) ratings</td>
                        </tr>
                        <tr>
                            <td><code>control.showLabel</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Show rating value label (e.g., "3.5 / 5")</td>
                        </tr>
                        <tr>
                            <td><code>control.disabled</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Disable interaction (grayed out)</td>
                        </tr>
                        <tr>
                            <td><code>control.readOnly</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Display only mode without interaction</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="content-section">
                <h2>🎨 Styling & Theming</h2>
                <p>RatingControl supports dark theme automatically through CSS variables.</p>
                <pre className="code-block">{`/* Customize star color */
<RatingControl 
    control={{ 
        color: '#ef4444',    // Red stars
        maxStars: 5,
        size: 'medium'
    }} 
/>

/* Different sizes */
<RatingControl control={{ size: 'small' }} />    /* 18px stars */
<RatingControl control={{ size: 'medium' }} />   /* 24px stars */
<RatingControl control={{ size: 'large' }} />    /* 32px stars */`}</pre>
            </section>
        </div>
    );
}

export default RatingPage;
