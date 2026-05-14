// BarChartJSPage.jsx - Bar Chart JS Documentation
import React, { useState } from 'react';
import { BarChartJSControl } from '../../controls';

function BarChartJSPage({ addLog }) {
    const sampleData = [
        { label: 'Jan', value: 120 },
        { label: 'Feb', value: 190 },
        { label: 'Mar', value: 150 },
        { label: 'Apr', value: 220 },
        { label: 'May', value: 180 },
        { label: 'Jun', value: 250 }
    ];

    const multiSeriesData = [
        { label: 'Q1', v1: 80, v2: 120, v3: 90 },
        { label: 'Q2', v1: 100, v2: 140, v3: 110 },
        { label: 'Q3', v1: 120, v2: 160, v3: 130 },
        { label: 'Q4', v1: 140, v2: 180, v3: 150 }
    ];

    return (
        <div className="page-content">
            <h1>📊 Bar Chart JS</h1>
            <p className="lead">Interactive bar chart using Chart.js with vertical/horizontal bars, stacked data, and multiple datasets</p>

            <section className="content-section">
                <h2>� Basic Usage</h2>
                <div className="demo-box" style={{ padding: '20px' }}>
                    <BarChartJSControl control={{
                        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                        datasets: [{ label: 'Revenue', data: [100, 150, 120, 200], backgroundColor: '#3b82f6' }],
                        title: 'Quarterly Revenue'
                    }} />
                </div>
                <pre className="code-block">{`import { BarChartJSControl } from './controls';

// Minimal bar chart
<BarChartJSControl control={{
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
        label: 'Revenue',
        data: [100, 150, 120, 200],
        backgroundColor: '#3b82f6'
    }],
    title: 'Quarterly Revenue'
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>�📈 Basic Examples</h2>
                <div className="demo-grid">
                    <div className="demo-box">
                        <h3>Vertical Bars</h3>
                        <BarChartJSControl control={{
                            labels: sampleData.map(d => d.label),
                            datasets: [{ label: 'Sales', data: sampleData.map(d => d.value), backgroundColor: '#3b82f6' }],
                            title: 'Monthly Sales',
                            height: 300
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Horizontal Bars</h3>
                        <BarChartJSControl control={{
                            labels: sampleData.map(d => d.label),
                            datasets: [{ label: 'Sales', data: sampleData.map(d => d.value), backgroundColor: '#ef4444' }],
                            title: 'Monthly Sales',
                            indexAxis: 'y',
                            height: 300
                        }} />
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📊 Multi-Series</h2>
                <div className="demo-grid">
                    <div className="demo-box">
                        <h3>Grouped</h3>
                        <BarChartJSControl control={{
                            labels: multiSeriesData.map(d => d.label),
                            datasets: [
                                { label: 'A', data: multiSeriesData.map(d => d.v1), backgroundColor: '#3b82f6' },
                                { label: 'B', data: multiSeriesData.map(d => d.v2), backgroundColor: '#10b981' },
                                { label: 'C', data: multiSeriesData.map(d => d.v3), backgroundColor: '#f59e0b' }
                            ],
                            title: 'Quarterly Sales',
                            stacked: false,
                            height: 300
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Stacked</h3>
                        <BarChartJSControl control={{
                            labels: multiSeriesData.map(d => d.label),
                            datasets: [
                                { label: 'A', data: multiSeriesData.map(d => d.v1), backgroundColor: '#3b82f6' },
                                { label: 'B', data: multiSeriesData.map(d => d.v2), backgroundColor: '#10b981' },
                                { label: 'C', data: multiSeriesData.map(d => d.v3), backgroundColor: '#f59e0b' }
                            ],
                            title: 'Quarterly Sales',
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
                        <tr><td>title</td><td>string</td><td>'Bar Chart'</td><td>Chart title</td></tr>
                        <tr><td>stacked</td><td>boolean</td><td>false</td><td>Stack bars</td></tr>
                        <tr><td>indexAxis</td><td>string</td><td>'x'</td><td>'x' or 'y'</td></tr>
                        <tr><td>height</td><td>number</td><td>300</td><td>Height in pixels</td></tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default BarChartJSPage;
