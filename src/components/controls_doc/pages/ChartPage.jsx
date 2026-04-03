// ChartPage.jsx - Chart Control Documentation
import React, { useState } from 'react';
import { ChartControl } from '../../controls';

function ChartPage({ addLog }) {
    const [selectedMonth, setSelectedMonth] = useState('all');

    // Sample data for different chart types
    const salesData = [
        { month: 'Jan', sales: 4000, expenses: 2400, profit: 1600 },
        { month: 'Feb', sales: 3000, expenses: 1398, profit: 1602 },
        { month: 'Mar', sales: 2000, expenses: 9800, profit: -7800 },
        { month: 'Apr', sales: 2780, expenses: 3908, profit: -1128 },
        { month: 'May', sales: 1890, expenses: 4800, profit: -2910 },
        { month: 'Jun', sales: 2390, expenses: 3800, profit: -1410 },
        { month: 'Jul', sales: 3490, expenses: 4300, profit: -810 }
    ];

    const categoryData = [
        { name: 'Electronics', value: 400, color: '#3b82f6' },
        { name: 'Clothing', value: 300, color: '#ef4444' },
        { name: 'Food', value: 300, color: '#10b981' },
        { name: 'Books', value: 200, color: '#f59e0b' },
        { name: 'Toys', value: 150, color: '#8b5cf6' }
    ];

    const trafficData = [
        { time: '00:00', users: 120 },
        { time: '04:00', users: 80 },
        { time: '08:00', users: 340 },
        { time: '12:00', users: 520 },
        { time: '16:00', users: 480 },
        { time: '20:00', users: 280 },
        { time: '24:00', users: 160 }
    ];

    const departmentData = [
        { dept: 'IT', budget: 50000, spent: 35000, remaining: 15000 },
        { dept: 'HR', budget: 30000, spent: 28000, remaining: 2000 },
        { dept: 'Marketing', budget: 40000, spent: 32000, remaining: 8000 },
        { dept: 'Sales', budget: 35000, spent: 30000, remaining: 5000 }
    ];

    const performanceData = [
        { quarter: 'Q1', target: 100, actual: 95 },
        { quarter: 'Q2', target: 100, actual: 110 },
        { quarter: 'Q3', target: 100, actual: 98 },
        { quarter: 'Q4', target: 100, actual: 115 }
    ];

    return (
        <div className="page-content">
            <h1>📊 Chart Control</h1>
            <p className="lead">
                Powerful chart component supporting pie, donut, bar, line, area charts with data binding and customization
            </p>

            {/* Chart Types Overview */}
            <section className="content-section">
                <h2>📈 Chart Types</h2>
                
                <div className="demo-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                    {/* Pie Chart */}
                    <div className="demo-box">
                        <h3>🥧 Pie Chart</h3>
                        <ChartControl control={{
                            type: 'pie',
                            data: categoryData,
                            dataKey: 'value',
                            nameKey: 'name',
                            title: 'Sales by Category',
                            showValues: true,
                            showPercentage: true,
                            height: 300,
                            onClick: (data) => addLog(`Clicked: ${data.data.name} - ${data.data.value}`)
                        }} />
                    </div>

                    {/* Donut Chart */}
                    <div className="demo-box">
                        <h3>🍩 Donut Chart</h3>
                        <ChartControl control={{
                            type: 'donut',
                            data: categoryData,
                            dataKey: 'value',
                            nameKey: 'name',
                            title: 'Market Share',
                            innerRadius: 60,
                            outerRadius: 90,
                            showValues: true,
                            height: 300
                        }} />
                    </div>

                    {/* Bar Chart */}
                    <div className="demo-box">
                        <h3>📊 Bar Chart</h3>
                        <ChartControl control={{
                            type: 'bar',
                            data: salesData,
                            xAxisKey: 'month',
                            yAxisKey: 'sales',
                            title: 'Monthly Sales',
                            height: 300,
                            showGrid: true,
                            colors: ['#3b82f6']
                        }} />
                    </div>

                    {/* Multi-Series Bar Chart */}
                    <div className="demo-box">
                        <h3>📊 Multi-Series Bar</h3>
                        <ChartControl control={{
                            type: 'bar',
                            data: salesData,
                            xAxisKey: 'month',
                            title: 'Sales vs Expenses',
                            height: 300,
                            series: [
                                { dataKey: 'sales', name: 'Sales', color: '#10b981' },
                                { dataKey: 'expenses', name: 'Expenses', color: '#ef4444' }
                            ]
                        }} />
                    </div>

                    {/* Line Chart */}
                    <div className="demo-box">
                        <h3>📈 Line Chart</h3>
                        <ChartControl control={{
                            type: 'line',
                            data: trafficData,
                            xAxisKey: 'time',
                            yAxisKey: 'users',
                            title: 'Website Traffic',
                            height: 300,
                            curved: true,
                            showGrid: true,
                            colors: ['#8b5cf6']
                        }} />
                    </div>

                    {/* Area Chart */}
                    <div className="demo-box">
                        <h3>📊 Area Chart</h3>
                        <ChartControl control={{
                            type: 'area',
                            data: trafficData,
                            xAxisKey: 'time',
                            yAxisKey: 'users',
                            title: 'User Activity',
                            height: 300,
                            fillOpacity: 0.4,
                            colors: ['#ec4899']
                        }} />
                    </div>

                    {/* Stacked Bar Chart */}
                    <div className="demo-box">
                        <h3>📊 Stacked Bar</h3>
                        <ChartControl control={{
                            type: 'bar',
                            data: departmentData,
                            xAxisKey: 'dept',
                            title: 'Budget Allocation',
                            height: 300,
                            stacked: true,
                            series: [
                                { dataKey: 'spent', name: 'Spent', color: '#ef4444' },
                                { dataKey: 'remaining', name: 'Remaining', color: '#10b981' }
                            ]
                        }} />
                    </div>

                    {/* Stacked Area Chart */}
                    <div className="demo-box">
                        <h3>📊 Stacked Area</h3>
                        <ChartControl control={{
                            type: 'area',
                            data: salesData,
                            xAxisKey: 'month',
                            title: 'Revenue Breakdown',
                            height: 300,
                            stacked: true,
                            series: [
                                { dataKey: 'sales', name: 'Sales', color: '#3b82f6' },
                                { dataKey: 'expenses', name: 'Expenses', color: '#f59e0b' }
                            ]
                        }} />
                    </div>
                </div>
            </section>

            {/* Data Binding Example */}
            <section className="content-section">
                <h2>🔄 Data Binding</h2>
                <p>Charts automatically bind to data from <code>rowData</code> using <code>databind</code></p>
                
                <div className="demo-box">
                    <ChartControl control={{
                        type: 'bar',
                        databind: 'analytics.monthlyData',
                        xAxisKey: 'month',
                        yAxisKey: 'sales',
                        title: 'Data from rowData.analytics.monthlyData',
                        height: 300
                    }} rowData={{
                        analytics: {
                            monthlyData: salesData
                        }
                    }} />
                </div>

                <pre className="code-block">{`<ChartControl control={{
    type: 'bar',
    databind: 'analytics.monthlyData',  // ดึงจาก rowData
    xAxisKey: 'month',
    yAxisKey: 'sales',
    title: 'Monthly Sales'
}} rowData={dashboardData} />`}</pre>
            </section>

            {/* Interactive Example */}
            <section className="content-section">
                <h2>🎯 Interactive Chart</h2>
                
                <div className="demo-box">
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ marginRight: '12px', fontWeight: 500 }}>Filter by Performance:</label>
                        <select 
                            value={selectedMonth}
                            onChange={(e) => {
                                setSelectedMonth(e.target.value);
                                addLog(`Filter changed to: ${e.target.value}`);
                            }}
                            style={{ 
                                padding: '6px 12px', 
                                borderRadius: '6px',
                                border: '1px solid #d1d5db'
                            }}
                        >
                            <option value="all">All Quarters</option>
                            <option value="high">Above Target (≥100)</option>
                            <option value="low">Below Target (&lt;100)</option>
                        </select>
                    </div>

                    <ChartControl control={{
                        type: 'line',
                        data: performanceData.filter(d => {
                            if (selectedMonth === 'high') return d.actual >= 100;
                            if (selectedMonth === 'low') return d.actual < 100;
                            return true;
                        }),
                        xAxisKey: 'quarter',
                        title: 'Performance vs Target',
                        height: 300,
                        series: [
                            { dataKey: 'target', name: 'Target', color: '#9ca3af' },
                            { dataKey: 'actual', name: 'Actual', color: '#3b82f6' }
                        ],
                        onClick: (data) => addLog(`Clicked: ${data.data.quarter} - Actual: ${data.data.actual}`)
                    }} />
                </div>
            </section>

            {/* Customization */}
            <section className="content-section">
                <h2>🎨 Customization Options</h2>
                
                <div className="demo-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
                    {/* Custom Colors */}
                    <div className="demo-box">
                        <h3>Custom Colors</h3>
                        <ChartControl control={{
                            type: 'pie',
                            data: [
                                { name: 'Red', value: 25 },
                                { name: 'Blue', value: 35 },
                                { name: 'Green', value: 40 }
                            ],
                            colors: ['#dc2626', '#2563eb', '#16a34a'],
                            height: 250
                        }} />
                    </div>

                    {/* No Legend */}
                    <div className="demo-box">
                        <h3>No Legend/Grid</h3>
                        <ChartControl control={{
                            type: 'bar',
                            data: salesData.slice(0, 4),
                            xAxisKey: 'month',
                            yAxisKey: 'profit',
                            showLegend: false,
                            showGrid: false,
                            height: 250
                        }} />
                    </div>

                    {/* Custom Bar Size */}
                    <div className="demo-box">
                        <h3>Custom Bar Size</h3>
                        <ChartControl control={{
                            type: 'bar',
                            data: departmentData,
                            xAxisKey: 'dept',
                            yAxisKey: 'budget',
                            barSize: 40,
                            height: 250,
                            colors: ['#f59e0b']
                        }} />
                    </div>
                </div>
            </section>

            {/* Props Reference */}
            <section className="content-section">
                <h2>⚙️ Props Reference</h2>
                
                <h3>Common Props</h3>
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
                            <td><code>type</code></td>
                            <td><code>string</code></td>
                            <td><code>'bar'</code></td>
                            <td>Chart type: 'pie', 'donut', 'bar', 'line', 'area'</td>
                        </tr>
                        <tr>
                            <td><code>data</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Chart data array</td>
                        </tr>
                        <tr>
                            <td><code>databind</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Bind to rowData field (e.g., 'sales.monthly')</td>
                        </tr>
                        <tr>
                            <td><code>width</code></td>
                            <td><code>string|number</code></td>
                            <td><code>'100%'</code></td>
                            <td>Chart width</td>
                        </tr>
                        <tr>
                            <td><code>height</code></td>
                            <td><code>number</code></td>
                            <td><code>300</code></td>
                            <td>Chart height in pixels</td>
                        </tr>
                        <tr>
                            <td><code>title</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Chart title</td>
                        </tr>
                        <tr>
                            <td><code>colors</code></td>
                            <td><code>array</code></td>
                            <td>Default palette</td>
                            <td>Array of color codes</td>
                        </tr>
                        <tr>
                            <td><code>showLegend</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Show/hide legend</td>
                        </tr>
                        <tr>
                            <td><code>showTooltip</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Show/hide tooltip on hover</td>
                        </tr>
                        <tr>
                            <td><code>onClick</code></td>
                            <td><code>function</code></td>
                            <td>-</td>
                            <td>Click handler: (data, rowData, rowIndex)</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Pie/Donut Specific</h3>
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
                            <td><code>dataKey</code></td>
                            <td><code>string</code></td>
                            <td>-</td>
                            <td>Field name for values</td>
                        </tr>
                        <tr>
                            <td><code>nameKey</code></td>
                            <td><code>string</code></td>
                            <td><code>'name'</code></td>
                            <td>Field name for labels</td>
                        </tr>
                        <tr>
                            <td><code>innerRadius</code></td>
                            <td><code>number</code></td>
                            <td><code>0</code></td>
                            <td>Inner radius (use 60 for donut)</td>
                        </tr>
                        <tr>
                            <td><code>outerRadius</code></td>
                            <td><code>number</code></td>
                            <td><code>80</code></td>
                            <td>Outer radius</td>
                        </tr>
                        <tr>
                            <td><code>showPercentage</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Show percentage in tooltip</td>
                        </tr>
                        <tr>
                            <td><code>showValues</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Show values on chart</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Bar/Line/Area Specific</h3>
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
                            <td><code>xAxisKey</code></td>
                            <td><code>string</code></td>
                            <td><code>'name'</code></td>
                            <td>Field for X-axis</td>
                        </tr>
                        <tr>
                            <td><code>yAxisKey</code></td>
                            <td><code>string</code></td>
                            <td><code>'value'</code></td>
                            <td>Field for Y-axis (single series)</td>
                        </tr>
                        <tr>
                            <td><code>series</code></td>
                            <td><code>array</code></td>
                            <td><code>[]</code></td>
                            <td>Multi-series: [&#123;dataKey, name, color&#125;]</td>
                        </tr>
                        <tr>
                            <td><code>stacked</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Stack multiple series</td>
                        </tr>
                        <tr>
                            <td><code>showGrid</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Show grid lines</td>
                        </tr>
                        <tr>
                            <td><code>barSize</code></td>
                            <td><code>number</code></td>
                            <td>Auto</td>
                            <td>Bar width</td>
                        </tr>
                        <tr>
                            <td><code>curved</code></td>
                            <td><code>boolean</code></td>
                            <td><code>true</code></td>
                            <td>Smooth curves (line/area)</td>
                        </tr>
                        <tr>
                            <td><code>fillOpacity</code></td>
                            <td><code>number</code></td>
                            <td><code>0.6</code></td>
                            <td>Area fill opacity (0-1)</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Code Examples */}
            <section className="content-section">
                <h2>💻 Code Examples</h2>

                <h3>Pie Chart</h3>
                <pre className="code-block">{`<ChartControl control={{
    type: 'pie',
    data: [
        { name: 'Product A', value: 400 },
        { name: 'Product B', value: 300 },
        { name: 'Product C', value: 200 }
    ],
    dataKey: 'value',
    nameKey: 'name',
    title: 'Product Sales',
    showValues: true
}} />`}</pre>

                <h3>Multi-Series Bar Chart</h3>
                <pre className="code-block">{`<ChartControl control={{
    type: 'bar',
    data: monthlyData,
    xAxisKey: 'month',
    title: 'Revenue Analysis',
    series: [
        { dataKey: 'sales', name: 'Sales', color: '#10b981' },
        { dataKey: 'expenses', name: 'Expenses', color: '#ef4444' },
        { dataKey: 'profit', name: 'Profit', color: '#3b82f6' }
    ]
}} />`}</pre>

                <h3>Interactive Line Chart</h3>
                <pre className="code-block">{`<ChartControl control={{
    type: 'line',
    databind: 'analytics.traffic',
    xAxisKey: 'time',
    yAxisKey: 'users',
    title: 'Website Traffic',
    curved: true,
    onClick: (data) => {
        console.log('Clicked:', data);
    }
}} rowData={dashboardData} />`}</pre>

                <h3>Stacked Area Chart</h3>
                <pre className="code-block">{`<ChartControl control={{
    type: 'area',
    data: timeSeriesData,
    xAxisKey: 'date',
    stacked: true,
    series: [
        { dataKey: 'desktop', name: 'Desktop', color: '#3b82f6' },
        { dataKey: 'mobile', name: 'Mobile', color: '#10b981' },
        { dataKey: 'tablet', name: 'Tablet', color: '#f59e0b' }
    ],
    fillOpacity: 0.7
}} />`}</pre>
            </section>

            {/* Tips */}
            <section className="content-section">
                <h2>💡 Tips & Best Practices</h2>
                <div className="tip-box">
                    <strong>📊 Choosing Chart Types:</strong>
                    <ul>
                        <li><strong>Pie/Donut:</strong> Parts of a whole, percentages</li>
                        <li><strong>Bar:</strong> Comparing categories, rankings</li>
                        <li><strong>Line:</strong> Trends over time, continuous data</li>
                        <li><strong>Area:</strong> Volume over time, cumulative data</li>
                        <li><strong>Stacked:</strong> Composition + comparison</li>
                    </ul>
                </div>
                <div className="tip-box">
                    <strong>🎨 Color Guidelines:</strong>
                    <ul>
                        <li>Use consistent color scheme across dashboard</li>
                        <li>Limit to 5-7 colors for clarity</li>
                        <li>Use color to highlight important data</li>
                        <li>Consider colorblind-friendly palettes</li>
                    </ul>
                </div>
                <div className="tip-box">
                    <strong>⚡ Performance:</strong>
                    <ul>
                        <li>Limit data points (max 50-100 for smooth animation)</li>
                        <li>Use pagination for large datasets</li>
                        <li>Disable animation for real-time updates</li>
                        <li>Optimize data structure before passing to chart</li>
                    </ul>
                </div>
                <div className="tip-box">
                    <strong>📱 Responsive Design:</strong>
                    <ul>
                        <li>Charts automatically adjust to container width</li>
                        <li>Reduce height on mobile devices</li>
                        <li>Consider simpler chart types for small screens</li>
                        <li>Test legend positioning on different sizes</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}

export default ChartPage;
