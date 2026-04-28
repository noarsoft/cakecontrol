import React from 'react';
import { useChartJS, resolveDatabind, buildBaseOptions } from './charts/useChartJS';
import './BarChartJSControl.css';

function BarChartJSControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const {
        labels = [], datasets = [], databind, title = 'Bar Chart',
        width = '100%', height = 300, indexAxis = 'x', stacked = false,
        responsive = true, maintainAspectRatio = false,
        backgroundColor = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
        borderColor = '#666', borderWidth = 1, borderRadius = 4,
        showLegend = true, showGrid = true, showTooltip = true,
        animation = true, onClick, className = ''
    } = control;

    let chartLabels = labels;
    let chartDatasets = datasets;

    const bound = resolveDatabind(databind, rowData);
    if (bound && bound.length > 0 && typeof bound[0] === 'object') {
        chartLabels = bound.map((item, idx) => item.label || item.name || `Item ${idx}`);
        chartDatasets = [{ label: 'Values', data: bound.map(item => item.value || 0), backgroundColor, borderColor, borderWidth, borderRadius }];
    }

    const colors = Array.isArray(backgroundColor) ? backgroundColor : [backgroundColor];
    const processedDatasets = chartDatasets.map((ds, idx) => ({
        ...ds,
        backgroundColor: ds.backgroundColor || colors[idx % colors.length],
        borderColor: ds.borderColor || borderColor,
        borderWidth: ds.borderWidth ?? borderWidth,
        borderRadius: ds.borderRadius ?? borderRadius
    }));

    const chartOptions = buildBaseOptions({
        responsive, maintainAspectRatio, animation, showLegend, title, showTooltip,
        onClick, onClickData: (el) => chartDatasets[el.datasetIndex],
        extraOptions: {
            indexAxis,
            scales: {
                x: { stacked, grid: { display: showGrid } },
                y: { stacked, grid: { display: showGrid } }
            }
        }
    });

    const { chartRef } = useChartJS({
        chartType: 'bar', control, rowData,
        chartData: { labels: chartLabels, datasets: processedDatasets },
        chartOptions
    });

    return (
        <div className={`bar-chartjs-control ${className}`} style={{ width, height }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default BarChartJSControl;
