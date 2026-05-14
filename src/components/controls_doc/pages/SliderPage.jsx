import React, { useState } from 'react';
import { SliderControl } from '../../controls';
import { useTheme } from '../../../ThemeContext';

function SliderPage({ addLog }) {
    const { theme } = useTheme();
    const [volume, setVolume] = useState(50);
    const [brightness, setBrightness] = useState(75);
    const [price, setPrice] = useState(500);
    const [temperature, setTemperature] = useState(20);
    const [sliderLogs, setSliderLogs] = useState([]);

    const handleChange = (name, newValue) => {
        const log = `🎚️ ${name} changed to: ${newValue}`;
        setSliderLogs([log, ...sliderLogs.slice(0, 9)]);
        if (addLog) addLog(log);
    };

    return (
        <div className="page-content">
            <h1>🎚️ Slider Control</h1>
            <p className="lead">
                Range slider for selecting numeric values with customizable range, step, and visual feedback
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    SliderControl provides an intuitive way to select values within a range. It supports custom min/max values,
                    step increments, different sizes, custom colors, and displays current value with units.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Range Selection</h3>
                        <p>Select any value between min and max</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚙️</div>
                        <h3>Custom Step</h3>
                        <p>Control precision with step increments</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Custom Colors</h3>
                        <p>Match your brand color scheme</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📏</div>
                        <h3>Size Variants</h3>
                        <p>Small, medium, and large options</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>💡 Basic Example</h2>
                <p>Simple volume slider (0-100):</p>
                <div className="example-demo">
                    <SliderControl 
                        control={{
                            label: 'Volume',
                            min: 0,
                            max: 100,
                            step: 1,
                            unit: '%',
                            color: '#3b82f6',
                            size: 'medium',
                            onChange: (val) => {
                                setVolume(val);
                                handleChange('Volume', val);
                            }
                        }}
                        value={volume}
                    />
                </div>
                <pre className="code-block">{`<SliderControl 
    control={{
        label: 'Volume',
        min: 0,
        max: 100,
        step: 1,
        unit: '%',
        color: '#3b82f6',
        onChange: (value) => console.log(value)
    }}
    value={volume}
/>`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Colors & Sizes</h2>
                <p>Different color and size combinations:</p>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Red - Small</p>
                            <SliderControl 
                                control={{
                                    label: 'Brightness',
                                    min: 0,
                                    max: 100,
                                    step: 5,
                                    unit: '%',
                                    color: '#ef4444',
                                    size: 'small',
                                    onChange: (val) => handleChange('Brightness', val)
                                }}
                                value={brightness}
                            />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Green - Medium</p>
                            <SliderControl 
                                control={{
                                    label: 'Growth',
                                    min: 0,
                                    max: 100,
                                    step: 1,
                                    unit: '%',
                                    color: '#10b981',
                                    size: 'medium',
                                    onChange: (val) => handleChange('Growth', val)
                                }}
                                value={60}
                            />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Purple - Large</p>
                            <SliderControl 
                                control={{
                                    label: 'Level',
                                    min: 0,
                                    max: 100,
                                    step: 10,
                                    unit: ' pts',
                                    color: '#a855f7',
                                    size: 'large',
                                    onChange: (val) => handleChange('Level', val)
                                }}
                                value={70}
                            />
                        </div>
                    </div>
                </div>
                <pre className="code-block">{`// Different colors and sizes
<SliderControl 
    control={{ 
        color: '#ef4444',      // Red
        size: 'small'
    }} 
/>

<SliderControl 
    control={{ 
        color: '#10b981',      // Green
        size: 'medium'
    }} 
/>

<SliderControl 
    control={{ 
        color: '#a855f7',      // Purple
        size: 'large'
    }} 
/>`}</pre>
            </section>

            <section className="content-section">
                <h2>📊 Real-World Examples</h2>
                <p>Practical use cases with different configurations:</p>
                <div className="example-demo">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div>
                            <SliderControl 
                                control={{
                                    label: 'Price Range',
                                    min: 100,
                                    max: 1000,
                                    step: 50,
                                    unit: ' ฿',
                                    color: '#06b6d4',
                                    showValue: true,
                                    onChange: (val) => {
                                        setPrice(val);
                                        handleChange('Price', val);
                                    }
                                }}
                                value={price}
                            />
                        </div>
                        <div>
                            <SliderControl 
                                control={{
                                    label: 'Temperature',
                                    min: -10,
                                    max: 40,
                                    step: 0.5,
                                    unit: '°C',
                                    color: '#f59e0b',
                                    showValue: true,
                                    onChange: (val) => {
                                        setTemperature(val);
                                        handleChange('Temperature', val);
                                    }
                                }}
                                value={temperature}
                            />
                        </div>
                    </div>
                </div>
                <pre className="code-block">{`// Price slider with ฿ unit
<SliderControl 
    control={{
        label: 'Price Range',
        min: 100,
        max: 1000,
        step: 50,
        unit: ' ฿',
        onChange: (price) => console.log(price)
    }}
/>

// Temperature with decimal steps
<SliderControl 
    control={{
        label: 'Temperature',
        min: -10,
        max: 40,
        step: 0.5,
        unit: '°C',
        onChange: (temp) => console.log(temp)
    }}
/>`}</pre>
            </section>

            <section className="content-section">
                <h2>⚙️ Ticks Display</h2>
                <p>Show scale ticks for better readability:</p>
                <div className="example-demo">
                    <SliderControl 
                        control={{
                            label: 'Opacity',
                            min: 0,
                            max: 100,
                            step: 10,
                            unit: '%',
                            color: '#8b5cf6',
                            size: 'medium',
                            showTicks: true,
                            onChange: (val) => handleChange('Opacity', val)
                        }}
                        value={50}
                    />
                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Recent Events:</div>
                        {sliderLogs.map((log, i) => (
                            <div key={i} style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
                <pre className="code-block">{`<SliderControl 
    control={{
        label: 'Opacity',
        min: 0,
        max: 100,
        step: 10,
        unit: '%',
        showTicks: true,      // Display scale ticks
        color: '#8b5cf6'
    }}
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
                            <td>Configuration object with slider options</td>
                        </tr>
                        <tr>
                            <td><code>value</code></td>
                            <td><code>number</code></td>
                            <td><code>0</code></td>
                            <td>Current slider value</td>
                        </tr>
                        <tr>
                            <td><code>onChange</code></td>
                            <td><code>function</code></td>
                            <td><code>-</code></td>
                            <td>Callback when value changes <code>(value) =&gt; {}</code></td>
                        </tr>
                        <tr>
                            <td><code>control.label</code></td>
                            <td><code>string</code></td>
                            <td><code>Value</code></td>
                            <td>Label text displayed above slider</td>
                        </tr>
                        <tr>
                            <td><code>control.min</code></td>
                            <td><code>number</code></td>
                            <td><code>0</code></td>
                            <td>Minimum value of range</td>
                        </tr>
                        <tr>
                            <td><code>control.max</code></td>
                            <td><code>number</code></td>
                            <td><code>100</code></td>
                            <td>Maximum value of range</td>
                        </tr>
                        <tr>
                            <td><code>control.step</code></td>
                            <td><code>number</code></td>
                            <td><code>1</code></td>
                            <td>Increment step (can be decimal)</td>
                        </tr>
                        <tr>
                            <td><code>control.unit</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Unit suffix (e.g., "%", "°C", " ฿")</td>
                        </tr>
                        <tr>
                            <td><code>control.color</code></td>
                            <td><code>string</code></td>
                            <td><code>#3b82f6</code></td>
                            <td>Color of slider track and thumb</td>
                        </tr>
                        <tr>
                            <td><code>control.size</code></td>
                            <td><code>string</code></td>
                            <td><code>medium</code></td>
                            <td>Size variant: <code>small</code>, <code>medium</code>, or <code>large</code></td>
                        </tr>
                        <tr>
                            <td><code>control.showLabel</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Show label and value display</td>
                        </tr>
                        <tr>
                            <td><code>control.showValue</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Show current value in header</td>
                        </tr>
                        <tr>
                            <td><code>control.showTicks</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Display scale tick marks</td>
                        </tr>
                        <tr>
                            <td><code>control.disabled</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Disable slider interaction</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="content-section">
                <h2>🎨 Styling & Theming</h2>
                <p>SliderControl supports dark theme automatically and custom colors via CSS variables.</p>
                <pre className="code-block">{`/* Customize slider appearance */
<SliderControl 
    control={{ 
        color: '#ef4444',          // Red slider
        min: 0,
        max: 100,
        step: 5,
        size: 'medium',
        unit: '%'
    }} 
/>

/* With decimal precision */
<SliderControl 
    control={{ 
        min: 0,
        max: 1,
        step: 0.01,
        color: '#10b981'
    }} 
/>`}</pre>
            </section>
        </div>
    );
}

export default SliderPage;
