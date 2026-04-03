// BubbleChartJSControl.jsx - Bubble Chart using Chart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './BubbleChartJSControl.css';

function BubbleChartJSControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const {
        data = [],
        databind,
        datasets = [],
        title = 'Bubble Chart',
        width = '100%',
        height = 300,
        responsive = true,
        maintainAspectRatio = false,
        backgroundColor = ['rgba(59, 130, 245, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(16, 185, 129, 0.6)'],
        borderColor = ['#3b82f6', '#ef4444', '#10b981'],
        borderWidth = 2,
        minRadius = 5,
        maxRadius = 30,
        showLegend = true,
        showGrid = true,
        showTooltip = true,
        animation = true,
        onClick,
        className = ''
    } = control;

    useEffect(() => {
        if (!chartRef.current) return;

        // Prepare data - bubble chart needs x, y, r
        let chartDatasets = datasets;

        if (databind && rowData) {
            const keys = databind.split('.');
            let value = rowData;
            for (const key of keys) {
                value = value?.[key];
            }
            if (Array.isArray(value)) {
                if (value.length > 0 && typeof value[0] === 'object') {
                    chartDatasets = [{
                        label: 'Bubbles',
                        data: value.map(item => ({
                            x: item.x || Math.random() * 100,
                            y: item.y || Math.random() * 100,
                            r: item.r || item.value || 10
                        })),
                        backgroundColor: backgroundColor[0],
                        borderColor: borderColor[0],
                        borderWidth
                    }];
                }
            }
        }

        // Color assignment
        const bgColors = Array.isArray(backgroundColor) ? backgroundColor : [backgroundColor];
        const colors = Array.isArray(borderColor) ? borderColor : [borderColor];
        const processedDatasets = chartDatasets.map((dataset, idx) => ({
            ...dataset,
            backgroundColor: dataset.backgroundColor || bgColors[idx % bgColors.length],
            borderColor: dataset.borderColor || colors[idx % colors.length],
            borderWidth: dataset.borderWidth ?? borderWidth
        }));

        const ctx = chartRef.current.getContext('2d');

        // Destroy existing chart
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create new chart
        chartInstance.current = new Chart(ctx, {
            type: 'bubble',
            data: {
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
                        bodyFont: { size: 13 },
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const data = context.raw;
                                return `${label}: (${data.x.toFixed(1)}, ${data.y.toFixed(1)}) - Size: ${data.r}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        grid: { display: showGrid }
                    },
                    y: {
                        grid: { display: showGrid }
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
        <div className={`bubble-chartjs-control ${className}`} style={{ width, height }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default BubbleChartJSControl;
