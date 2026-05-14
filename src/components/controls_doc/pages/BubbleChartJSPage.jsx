// BubbleChartJSPage.jsx
import React from 'react';
import { BubbleChartJSControl } from '../../controls';

function BubbleChartJSPage({ addLog }) {
    const data = [
        { x: 20, y: 30, r: 15 },
        { x: 40, y: 60, r: 25 },
        { x: 60, y: 50, r: 20 },
        { x: 80, y: 40, r: 30 },
        { x: 50, y: 80, r: 22 }
    ];

    return (
        <div className="page-content">
            <h1>🫧 Bubble Chart JS</h1>
            <p className="lead">Bubble chart for three-dimensional data visualization</p>

            <section className="content-section">
                <h2>💻 Basic Usage</h2>
                <div className="demo-box" style={{ padding: '20px' }}>
                    <BubbleChartJSControl control={{
                        datasets: [{
                            label: 'Product Lines',
                            data: [
                                { x: 10, y: 20, r: 15 },
                                { x: 15, y: 25, r: 20 },
                                { x: 20, y: 15, r: 18 }
                            ],
                            backgroundColor: 'rgba(59, 130, 246, 0.6)'
                        }],
                        title: 'Sales Analysis'
                    }} />
                </div>
                <pre className="code-block">{`import { BubbleChartJSControl } from './controls';

// Minimal bubble chart
<BubbleChartJSControl control={{
    datasets: [{
        label: 'Product Lines',
        data: [
            { x: 10, y: 20, r: 15 },
            { x: 15, y: 25, r: 20 },
            { x: 20, y: 15, r: 18 }
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.6)'
    }],
    title: 'Sales Analysis'
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>Examples</h2>
                <div className="demo-grid">
                    <div className="demo-box">
                        <h3>Single Series</h3>
                        <BubbleChartJSControl control={{
                            datasets: [{ label: 'Data', data: data, backgroundColor: 'rgba(59, 130, 245, 0.6)', borderColor: '#3b82f6' }],
                            title: 'Bubble Chart',
                            height: 300
                        }} />
                    </div>
                    <div className="demo-box">
                        <h3>Multiple Series</h3>
                        <BubbleChartJSControl control={{
                            datasets: [
                                { label: 'Group A', data: data.slice(0, 3), backgroundColor: 'rgba(59, 130, 245, 0.6)', borderColor: '#3b82f6' },
                                { label: 'Group B', data: data.slice(3), backgroundColor: 'rgba(16, 185, 129, 0.6)', borderColor: '#10b981' }
                            ],
                            title: 'Multi Series',
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
                        <tr><td>datasets</td><td>array</td><td>[]</td><td>Bubbles with x, y, r</td></tr>
                        <tr><td>title</td><td>string</td><td>'Bubble Chart'</td><td>Chart title</td></tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default BubbleChartJSPage;
