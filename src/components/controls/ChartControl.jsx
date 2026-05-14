// ChartControl.jsx - Chart Control with Pie, Bar, Line, Area, Donut support
import React from 'react';
import {
    PieChart, Pie, BarChart, Bar, LineChart, Line, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import './ChartControl.css';

function ChartControl({ control, rowData, rowIndex }) {
    const {
        type = 'bar', // 'pie', 'donut', 'bar', 'line', 'area', 'stacked-bar', 'stacked-area'
        databind,
        data = [],
        width = '100%',
        height = 300,
        
        // Data configuration
        dataKey, // For pie/donut: field to use as value
        nameKey = 'name', // For pie/donut: field to use as label
        xAxisKey = 'name', // For bar/line/area: x-axis field
        yAxisKey = 'value', // For bar/line/area: y-axis field
        series = [], // For multiple series: [{ dataKey, name, color }]
        
        // Styling
        colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
            '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
        ],
        gradient = false,
        
        // Labels & Legend
        title,
        showLegend = true,
        legendPosition = 'bottom', // 'top', 'bottom', 'left', 'right'
        showTooltip = true,
        showGrid = true,
        showValues = false, // Show values on chart
        
        // Pie/Donut specific
        innerRadius = 0, // 0 for pie, >0 for donut (e.g., 60 for donut)
        outerRadius = 80,
        showPercentage = true,
        
        // Bar/Line/Area specific
        stacked = false,
        curved = true, // For line/area charts
        fillOpacity = 0.6, // For area charts
        barSize = undefined, // Bar width
        
        // Interactions
        onClick,
        onHover,
        
        // Advanced
        customTooltip,
        customLabel,
        animated = true,
        
        className = ''
    } = control;

    // Get data from databind or use provided data
    let chartData = data;
    if (databind && rowData) {
        const keys = databind.split('.');
        let value = rowData;
        for (const key of keys) {
            value = value?.[key];
        }
        if (Array.isArray(value)) {
            chartData = value;
        }
    }

    // Ensure we have valid data
    if (!Array.isArray(chartData) || chartData.length === 0) {
        return (
            <div className={`chart-control chart-empty ${className}`}>
                <div className="chart-empty-state">
                    <span className="chart-empty-icon">📊</span>
                    <p>No data available</p>
                </div>
            </div>
        );
    }

    // Custom tooltip renderer
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;

        if (customTooltip) {
            return customTooltip({ active, payload, label });
        }

        return (
            <div className="chart-tooltip">
                <p className="chart-tooltip-label">{label || payload[0].name}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="chart-tooltip-value" style={{ color: entry.color }}>
                        {entry.name}: <strong>{entry.value}</strong>
                        {showPercentage && type === 'pie' && ` (${((entry.value / payload.reduce((sum, p) => sum + p.value, 0)) * 100).toFixed(1)}%)`}
                    </p>
                ))}
            </div>
        );
    };

    // Custom label for pie/donut
    const renderCustomLabel = (entry) => {
        if (customLabel) {
            return customLabel(entry);
        }
        if (!showValues) return null;
        
        const percent = entry.percent * 100;
        return `${percent.toFixed(0)}%`;
    };

    // Handle chart click
    const handleClick = (data, index) => {
        if (onClick) {
            onClick({ data, index }, rowData, rowIndex);
        }
    };

    // Render legend
    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <ul className={`chart-legend chart-legend-${legendPosition}`}>
                {payload.map((entry, index) => (
                    <li key={`legend-${index}`} className="chart-legend-item">
                        <span 
                            className="chart-legend-icon" 
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="chart-legend-text">{entry.value}</span>
                    </li>
                ))}
            </ul>
        );
    };

    // Render Pie or Donut Chart
    const renderPieChart = () => {
        const isDonut = innerRadius > 0 || type === 'donut';
        const radius = isDonut ? (innerRadius || 60) : 0;

        return (
            <ResponsiveContainer width={width} height={height}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey={dataKey || yAxisKey}
                        nameKey={nameKey}
                        cx="50%"
                        cy="50%"
                        innerRadius={radius}
                        outerRadius={outerRadius}
                        label={showValues ? renderCustomLabel : false}
                        labelLine={showValues}
                        onClick={handleClick}
                        animationBegin={0}
                        animationDuration={animated ? 800 : 0}
                    >
                        {chartData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color || colors[index % colors.length]}
                                className="chart-cell"
                            />
                        ))}
                    </Pie>
                    {showTooltip && <Tooltip content={<CustomTooltip />} />}
                    {showLegend && <Legend content={renderLegend} />}
                </PieChart>
            </ResponsiveContainer>
        );
    };

    // Render Bar Chart
    const renderBarChart = () => {
        return (
            <ResponsiveContainer width={width} height={height}>
                <BarChart data={chartData}>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
                    <XAxis 
                        dataKey={xAxisKey} 
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis 
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    {showTooltip && <Tooltip content={<CustomTooltip />} />}
                    {showLegend && <Legend content={renderLegend} />}
                    
                    {series.length > 0 ? (
                        series.map((s, index) => (
                            <Bar
                                key={s.dataKey}
                                dataKey={s.dataKey}
                                name={s.name || s.dataKey}
                                fill={s.color || colors[index % colors.length]}
                                stackId={stacked ? 'stack' : undefined}
                                barSize={barSize}
                                onClick={handleClick}
                                animationBegin={0}
                                animationDuration={animated ? 800 : 0}
                            />
                        ))
                    ) : (
                        <Bar
                            dataKey={yAxisKey}
                            fill={colors[0]}
                            barSize={barSize}
                            onClick={handleClick}
                            animationBegin={0}
                            animationDuration={animated ? 800 : 0}
                        >
                            {chartData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.color || colors[index % colors.length]}
                                />
                            ))}
                        </Bar>
                    )}
                </BarChart>
            </ResponsiveContainer>
        );
    };

    // Render Line Chart
    const renderLineChart = () => {
        return (
            <ResponsiveContainer width={width} height={height}>
                <LineChart data={chartData}>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
                    <XAxis 
                        dataKey={xAxisKey}
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis 
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    {showTooltip && <Tooltip content={<CustomTooltip />} />}
                    {showLegend && <Legend content={renderLegend} />}
                    
                    {series.length > 0 ? (
                        series.map((s, index) => (
                            <Line
                                key={s.dataKey}
                                type={curved ? 'monotone' : 'linear'}
                                dataKey={s.dataKey}
                                name={s.name || s.dataKey}
                                stroke={s.color || colors[index % colors.length]}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                onClick={handleClick}
                                animationBegin={0}
                                animationDuration={animated ? 800 : 0}
                            />
                        ))
                    ) : (
                        <Line
                            type={curved ? 'monotone' : 'linear'}
                            dataKey={yAxisKey}
                            stroke={colors[0]}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            onClick={handleClick}
                            animationBegin={0}
                            animationDuration={animated ? 800 : 0}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
        );
    };

    // Render Area Chart
    const renderAreaChart = () => {
        return (
            <ResponsiveContainer width={width} height={height}>
                <AreaChart data={chartData}>
                    {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
                    <XAxis 
                        dataKey={xAxisKey}
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis 
                        stroke="#6b7280"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    {showTooltip && <Tooltip content={<CustomTooltip />} />}
                    {showLegend && <Legend content={renderLegend} />}
                    
                    {series.length > 0 ? (
                        series.map((s, index) => (
                            <Area
                                key={s.dataKey}
                                type={curved ? 'monotone' : 'linear'}
                                dataKey={s.dataKey}
                                name={s.name || s.dataKey}
                                stroke={s.color || colors[index % colors.length]}
                                fill={s.color || colors[index % colors.length]}
                                fillOpacity={fillOpacity}
                                stackId={stacked ? 'stack' : undefined}
                                onClick={handleClick}
                                animationBegin={0}
                                animationDuration={animated ? 800 : 0}
                            />
                        ))
                    ) : (
                        <Area
                            type={curved ? 'monotone' : 'linear'}
                            dataKey={yAxisKey}
                            stroke={colors[0]}
                            fill={colors[0]}
                            fillOpacity={fillOpacity}
                            onClick={handleClick}
                            animationBegin={0}
                            animationDuration={animated ? 800 : 0}
                        />
                    )}
                </AreaChart>
            </ResponsiveContainer>
        );
    };

    // Select chart renderer based on type
    const renderChart = () => {
        switch (type) {
            case 'pie':
            case 'donut':
                return renderPieChart();
            case 'bar':
            case 'stacked-bar':
                return renderBarChart();
            case 'line':
                return renderLineChart();
            case 'area':
            case 'stacked-area':
                return renderAreaChart();
            default:
                return renderBarChart();
        }
    };

    return (
        <div className={`chart-control chart-${type} ${className}`}>
            {title && <div className="chart-title">{title}</div>}
            <div className="chart-container">
                {renderChart()}
            </div>
        </div>
    );
}

export default ChartControl;
