// DoughnutChartJSPage.jsx
import React from 'react';
import { DoughnutChartJSControl } from '../../controls';

function DoughnutChartJSPage({ addLog }) {
    const data = [
        { label: 'Completed', value: 65 },
        { label: 'In Progress', value: 25 },
        { label: 'Pending', value: 10 }
    ];

    return (
        <div className="page-content">
            <h1>🍩 Doughnut Chart JS</h1>
            <p className="lead">Doughnut chart with center text and customizable colors</p>

            <section className="content-section">
                <h2>💻 Basic Usage</h2>
                <div className="demo-box" style={{ padding: '20px' }}>
                    <DoughnutChartJSControl control={{
                        labels: ['Completed', 'In Progress', 'Pending'],
                        data: [75, 15, 10],
                        title: 'Project Status',
                        centerText: '75%'
                    }} />
                </div>
                <pre className="code-block">{`import { DoughnutChartJSControl } from './controls';

// Minimal doughnut chart
<DoughnutChartJSControl control={{
    labels: ['Completed', 'In Progress', 'Pending'],
    data: [75, 15, 10],
    title: 'Project Status',
    centerText: '75%'
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>Examples</h2>
                <div className="demo-grid">
                    <div className="demo-box">
                        <h3>Progress Doughnut</h3>
                        <DoughnutChartJSControl control={{
                            labels: data.map(d => d.label),
                            data: data.map(d => d.value),
                            title: 'Task Progress',
                            centerText: '65%',
                            height: 300
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Status Overview</h3>
                        <DoughnutChartJSControl control={{
                            labels: data.map(d => d.label),
                            data: data.map(d => d.value),
                            title: 'System Status',
                            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
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
                        <tr><td>labels</td><td>array</td><td>[]</td><td>Segment labels</td></tr>
                        <tr><td>data</td><td>array</td><td>[]</td><td>Segment values</td></tr>
                        <tr><td>centerText</td><td>string</td><td>''</td><td>Text in center</td></tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default DoughnutChartJSPage;
