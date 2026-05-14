// RadarChartJSControl.jsx - Radar Chart using Chart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './RadarChartJSControl.css';

function RadarChartJSControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const {
        data = [],
        databind,
        labels = [],
        datasets = [],
        title = 'Radar Chart',
        width = '100%',
        height = 300,
        responsive = true,
        maintainAspectRatio = false,
        borderColor = ['#3b82f6', '#ef4444', '#10b981'],
        backgroundColor = [
            'rgba(59, 130, 245, 0.2)',
            'rgba(239, 68, 68, 0.2)',
            'rgba(16, 185, 129, 0.2)'
        ],
        borderWidth = 2,
        pointRadius = 4,
        pointHoverRadius = 6,
        fill = true,
        showLegend = true,
        showGrid = true,
        showTooltip = true,
        animation = true,
        onClick,
        className = ''
    } = control;

    useEffect(() => {
        if (!chartRef.current) return;

        // Prepare data
        let chartLabels = labels;
        let chartDatasets = datasets;

        if (databind && rowData) {
            const keys = databind.split('.');
            let value = rowData;
            for (const key of keys) {
                value = value?.[key];
            }
            if (Array.isArray(value)) {
                if (value.length > 0 && typeof value[0] === 'object') {
                    chartLabels = value.map((item, idx) => item.label || item.name || `Item ${idx}`);
                    chartDatasets = [{
                        label: 'Values',
                        data: value.map(item => item.value || 0),
                        borderColor: borderColor[0],
                        backgroundColor: backgroundColor[0],
                        borderWidth,
                        pointRadius,
                        pointHoverRadius,
                        fill
                    }];
                }
            }
        }

        // Color assignment
        const colors = Array.isArray(borderColor) ? borderColor : [borderColor];
        const bgColors = Array.isArray(backgroundColor) ? backgroundColor : [backgroundColor];
        const processedDatasets = chartDatasets.map((dataset, idx) => ({
            ...dataset,
            borderColor: dataset.borderColor || colors[idx % colors.length],
            backgroundColor: dataset.backgroundColor || bgColors[idx % bgColors.length],
            borderWidth: dataset.borderWidth ?? borderWidth,
            pointRadius: dataset.pointRadius ?? pointRadius,
            pointHoverRadius: dataset.pointHoverRadius ?? pointHoverRadius,
            fill: dataset.fill ?? fill
        }));

        const ctx = chartRef.current.getContext('2d');

        // Destroy existing chart
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create new chart
        chartInstance.current = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: chartLabels,
                datasets: processedDatasets
            },
            options: {
                responsive,
                maintainAspectRatio,
                animation: animation ? { duration: 750 } : false,
                plugins: {
                    legend: {
                        display: showLegend,
                        position: 'top'
                    },
                    title: title ? {
                        display: true,
                        text: title,
                        font: { size: 16, weight: 'bold' }
                    } : undefined,
                    tooltip: {
                        enabled: showTooltip,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: { size: 14 },
                        bodyFont: { size: 13 }
                    }
                },
                scales: {
                    r: {
                        grid: { display: showGrid },
                        beginAtZero: true
                    }
                },
                onClick: onClick ? (event, activeElements) => {
                    if (activeElements.length > 0) {
                        onClick(event, activeElements[0], processedDatasets[activeElements[0].datasetIndex]);
                    }
                } : undefined
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [control, rowData]);

    return (
        <div className={`radar-chartjs-control ${className}`} style={{ width, height }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default RadarChartJSControl;
