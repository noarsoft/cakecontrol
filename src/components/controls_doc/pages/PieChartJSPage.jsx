// PieChartJSPage.jsx
import React from 'react';
import { PieChartJSControl } from '../../controls';

function PieChartJSPage({ addLog }) {
    const data = [
        { label: 'Product A', value: 300 },
        { label: 'Product B', value: 200 },
        { label: 'Product C', value: 150 },
        { label: 'Product D', value: 100 },
        { label: 'Product E', value: 80 }
    ];

    return (
        <div className="page-content">
            <h1>🥧 Pie Chart JS</h1>
            <p className="lead">Interactive pie chart with percentage display and legend</p>

            <section className="content-section">
                <h2>💻 Basic Usage</h2>
                <div className="demo-box" style={{ padding: '20px' }}>
                    <PieChartJSControl control={{
                        labels: ['Chrome', 'Firefox', 'Safari'],
                        data: [65, 20, 15],
                        title: 'Browser Usage'
                    }} />
                </div>
                <pre className="code-block">{`import { PieChartJSControl } from './controls';

// Minimal pie chart
<PieChartJSControl control={{
    labels: ['Chrome', 'Firefox', 'Safari'],
    data: [65, 20, 15],
    title: 'Browser Usage'
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>Examples</h2>
                <div className="demo-grid">
                    <div className="demo-box">
                        <h3>Basic Pie</h3>
                        <PieChartJSControl control={{
                            labels: data.map(d => d.label),
                            data: data.map(d => d.value),
                            title: 'Sales Distribution',
                            height: 300
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Custom Colors</h3>
                        <PieChartJSControl control={{
                            labels: data.map(d => d.label),
                            data: data.map(d => d.value),
                            title: 'Market Share',
                            backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
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
                        <tr><td>labels</td><td>array</td><td>[]</td><td>Pie slice labels</td></tr>
                        <tr><td>data</td><td>array</td><td>[]</td><td>Values for each slice</td></tr>
                        <tr><td>backgroundColor</td><td>array</td><td>colors</td><td>Slice colors</td></tr>
                        <tr><td>legendPosition</td><td>string</td><td>'right'</td><td>Legend placement</td></tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default PieChartJSPage;
