import React from 'react';
import { useChartJS, resolveDatabind, buildBaseOptions } from './charts/useChartJS';
import './MixedChartJSControl.css';

function MixedChartJSControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const {
        labels = [], datasets = [], databind, title = 'Mixed Chart',
        width = '100%', height = 300, responsive = true, maintainAspectRatio = false,
        barBackgroundColor = '#3b82f6', barBorderColor = '#2563eb', lineColor = '#ef4444',
        showLegend = true, showGrid = true, showTooltip = true,
        animation = true, onClick, className = ''
    } = control;

    let chartLabels = labels;
    let chartDatasets = datasets;

    const bound = resolveDatabind(databind, rowData);
    if (bound && bound.length > 0 && typeof bound[0] === 'object') {
        chartLabels = bound.map((item, idx) => item.label || item.name || `Item ${idx}`);
        chartDatasets = [
            { type: 'bar', label: 'Bar Values', data: bound.map(item => item.bar_value || 0), backgroundColor: barBackgroundColor, borderColor: barBorderColor, borderWidth: 1, borderRadius: 4 },
            { type: 'line', label: 'Line Values', data: bound.map(item => item.line_value || 0), borderColor: lineColor, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 2, pointRadius: 4, pointHoverRadius: 6, tension: 0.4 }
        ];
    }

    const chartOptions = buildBaseOptions({
        responsive, maintainAspectRatio, animation, showLegend, title, showTooltip,
        onClick, onClickData: (el) => chartDatasets[el.datasetIndex],
        extraOptions: {
            scales: {
                x: { grid: { display: showGrid } },
                y: { grid: { display: showGrid } }
            }
        }
    });

    const { chartRef } = useChartJS({
        chartType: 'bar', control, rowData,
        chartData: { labels: chartLabels, datasets: chartDatasets },
        chartOptions
    });

    return (
        <div className={`mixed-chartjs-control ${className}`} style={{ width, height }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default MixedChartJSControl;
