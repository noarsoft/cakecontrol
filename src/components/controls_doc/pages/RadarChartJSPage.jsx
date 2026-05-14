// RadarChartJSPage.jsx
import React from 'react';
import { RadarChartJSControl } from '../../controls';

function RadarChartJSPage({ addLog }) {
    const data = [
        { label: 'Speed', value: 70 },
        { label: 'Reliability', value: 85 },
        { label: 'Security', value: 80 },
        { label: 'Performance', value: 75 },
        { label: 'Usability', value: 90 }
    ];

    return (
        <div className="page-content">
            <h1>🎯 Radar Chart JS</h1>
            <p className="lead">Radar/Spider chart for multi-axis comparison</p>

            <section className="content-section">
                <h2>💻 Basic Usage</h2>
                <div className="demo-box" style={{ padding: '20px' }}>
                    <RadarChartJSControl control={{
                        labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
                        datasets: [{
                            label: 'Car Model A',
                            data: [85, 90, 80, 95, 88],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)'
                        }],
                        title: 'Vehicle Features'
                    }} />
                </div>
                <pre className="code-block">{`import { RadarChartJSControl } from './controls';

// Minimal radar chart
<RadarChartJSControl control={{
    labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
    datasets: [{
        label: 'Car Model A',
        data: [85, 90, 80, 95, 88],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
    }],
    title: 'Vehicle Features'
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>Examples</h2>
                <div className="demo-grid">
                    <div className="demo-box">
                        <h3>Single Series</h3>
                        <RadarChartJSControl control={{
                            labels: data.map(d => d.label),
                            datasets: [{ label: 'Product', data: data.map(d => d.value), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 245, 0.2)' }],
                            title: 'Product Features',
                            height: 300
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Comparison</h3>
                        <RadarChartJSControl control={{
                            labels: data.map(d => d.label),
                            datasets: [
                                { label: 'Product A', data: data.map(d => d.value), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 245, 0.2)' },
                                { label: 'Product B', data: [65, 75, 70, 85, 80], borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.2)' }
                            ],
                            title: 'Product Comparison',
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
                        <tr><td>labels</td><td>array</td><td>[]</td><td>Axis labels</td></tr>
                        <tr><td>datasets</td><td>array</td><td>[]</td><td>Data series</td></tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default RadarChartJSPage;
