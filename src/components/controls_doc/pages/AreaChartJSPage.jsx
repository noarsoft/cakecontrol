// AreaChartJSPage.jsx
import React from 'react';
import { AreaChartJSControl } from '../../controls';

function AreaChartJSPage({ addLog }) {
    const data = [
        { month: 'Jan', value1: 30, value2: 40 },
        { month: 'Feb', value1: 40, value2: 45 },
        { month: 'Mar', value1: 35, value2: 50 },
        { month: 'Apr', value1: 50, value2: 55 },
        { month: 'May', value1: 45, value2: 60 },
        { month: 'Jun', value1: 60, value2: 65 }
    ];

    return (
        <div className="page-content">
            <h1>📊 Area Chart JS</h1>
            <p className="lead">Area chart with stacking support and gradient fill</p>

            <section className="content-section">
                <h2>💻 Basic Usage</h2>
                <div className="demo-box" style={{ padding: '20px' }}>
                    <AreaChartJSControl control={{
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                        datasets: [{
                            label: 'Temperature',
                            data: [22, 24, 23, 25, 26],
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            tension: 0.4
                        }],
                        title: 'Daily Temperature'
                    }} />
                </div>
                <pre className="code-block">{`import { AreaChartJSControl } from './controls';

// Minimal area chart
<AreaChartJSControl control={{
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{
        label: 'Temperature',
        data: [22, 24, 23, 25, 26],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
    }],
    title: 'Daily Temperature'
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>Examples</h2>
                <div className="demo-grid">
                    <div className="demo-box">
                        <h3>Single Area</h3>
                        <AreaChartJSControl control={{
                            labels: data.map(d => d.month),
                            datasets: [{ label: 'Value', data: data.map(d => d.value1), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 245, 0.3)' }],
                            title: 'Monthly Trend',
                            height: 300
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Stacked Areas</h3>
                        <AreaChartJSControl control={{
                            labels: data.map(d => d.month),
                            datasets: [
                                { label: 'Series A', data: data.map(d => d.value1), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 245, 0.3)' },
                                { label: 'Series B', data: data.map(d => d.value2), borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.3)' }
                            ],
                            title: 'Stacked Trend',
                            stacked: true,
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
                        <tr><td>stacked</td><td>boolean</td><td>false</td><td>Stack areas</td></tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default AreaChartJSPage;
