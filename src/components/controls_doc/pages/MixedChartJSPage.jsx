// MixedChartJSPage.jsx
import React from 'react';
import { MixedChartJSControl } from '../../controls';

function MixedChartJSPage({ addLog }) {
    const data = [
        { label: 'Jan', bar: 80, line: 100 },
        { label: 'Feb', bar: 100, line: 120 },
        { label: 'Mar', bar: 120, line: 110 },
        { label: 'Apr', bar: 140, line: 130 }
    ];

    return (
        <div className="page-content">
            <h1>📊 Mixed Chart JS</h1>
            <p className="lead">Combined bar and line chart for comparing different data types</p>

            <section className="content-section">
                <h2>💻 Basic Usage</h2>
                <div className="demo-box" style={{ padding: '20px' }}>
                    <MixedChartJSControl control={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                        datasets: [
                            { type: 'bar', label: 'Sales', data: [100, 120, 140, 160, 180], backgroundColor: '#3b82f6' },
                            { type: 'line', label: 'Profit', data: [30, 35, 40, 45, 50], borderColor: '#10b981', tension: 0.4 }
                        ],
                        title: 'Sales vs Profit'
                    }} />
                </div>
                <pre className="code-block">{`import { MixedChartJSControl } from './controls';

// Minimal mixed chart
<MixedChartJSControl control={{
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
        {
            type: 'bar',
            label: 'Sales',
            data: [100, 120, 140, 160, 180],
            backgroundColor: '#3b82f6'
        },
        {
            type: 'line',
            label: 'Profit',
            data: [30, 35, 40, 45, 50],
            borderColor: '#10b981',
            tension: 0.4
        }
    ],
    title: 'Sales vs Profit'
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>Examples</h2>
                <div className="demo-grid">
                    <div className="demo-box">
                        <h3>Bar + Line</h3>
                        <MixedChartJSControl control={{
                            labels: data.map(d => d.label),
                            datasets: [
                                { type: 'bar', label: 'Volume', data: data.map(d => d.bar), backgroundColor: '#3b82f6' },
                                { type: 'line', label: 'Average', data: data.map(d => d.line), borderColor: '#ef4444' }
                            ],
                            title: 'Volume vs Average',
                            height: 300
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Custom Colors</h3>
                        <MixedChartJSControl control={{
                            labels: data.map(d => d.label),
                            datasets: [
                                { type: 'bar', label: 'Sales', data: data.map(d => d.bar), backgroundColor: '#10b981' },
                                { type: 'line', label: 'Target', data: data.map(d => d.line), borderColor: '#f59e0b' }
                            ],
                            title: 'Sales vs Target',
                            height: 300
                        }} />
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>⚙️ Props</h2>
                <table className="props-table">
                    <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
                    <tbody>
                        <tr><td>labels</td><td>array</td><td>[]</td><td>X-axis labels</td></tr>
                        <tr><td>datasets</td><td>array</td><td>[]</td><td>Data with type: 'bar'|'line'</td></tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default MixedChartJSPage;
