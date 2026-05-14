// LineChartJSPage.jsx
import React from 'react';
import { LineChartJSControl } from '../../controls';

function LineChartJSPage({ addLog }) {
    const data = [
        { month: 'Jan', sales: 100, revenue: 150 },
        { month: 'Feb', sales: 150, revenue: 200 },
        { month: 'Mar', sales: 120, revenue: 180 },
        { month: 'Apr', sales: 200, revenue: 280 },
        { month: 'May', sales: 180, revenue: 250 },
        { month: 'Jun', sales: 220, revenue: 320 }
    ];

    return (
        <div className="page-content">
            <h1>📈 Line Chart JS</h1>
            <p className="lead">Interactive line chart using Chart.js with smooth curves, multiple series, and area fill support</p>

            <section className="content-section">
                <h2>💻 Basic Usage</h2>
                <div className="demo-box" style={{ padding: '20px' }}>
                    <LineChartJSControl control={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                        datasets: [{ label: 'Visitors', data: [120, 140, 125, 160, 180], borderColor: '#3b82f6', tension: 0.4 }],
                        title: 'Website Visitors'
                    }} />
                </div>
                <pre className="code-block">{`import { LineChartJSControl } from './controls';

// Minimal line chart
<LineChartJSControl control={{
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
        label: 'Visitors',
        data: [120, 140, 125, 160, 180],
        borderColor: '#3b82f6',
        tension: 0.4
    }],
    title: 'Website Visitors'
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>Examples</h2>
                <div className="demo-grid">
                    <div className="demo-box">
                        <h3>Single Line</h3>
                        <LineChartJSControl control={{
                            labels: data.map(d => d.month),
                            datasets: [{ label: 'Sales', data: data.map(d => d.sales), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 245, 0.1)', tension: 0.4 }],
                            title: 'Monthly Sales',
                            height: 300
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Multi-Line</h3>
                        <LineChartJSControl control={{
                            labels: data.map(d => d.month),
                            datasets: [
                                { label: 'Sales', data: data.map(d => d.sales), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 245, 0.1)' },
                                { label: 'Revenue', data: data.map(d => d.revenue), borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }
                            ],
                            title: 'Sales vs Revenue',
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
                        <tr><td>datasets</td><td>array</td><td>[]</td><td>Data series</td></tr>
                        <tr><td>tension</td><td>number</td><td>0.4</td><td>Line curve (0-1)</td></tr>
                        <tr><td>fill</td><td>boolean</td><td>false</td><td>Fill area under line</td></tr>
                        <tr><td>pointRadius</td><td>number</td><td>4</td><td>Point size</td></tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default LineChartJSPage;
