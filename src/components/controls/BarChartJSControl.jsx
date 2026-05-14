// BarChartJSControl.jsx - Bar Chart using Chart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './BarChartJSControl.css';

function BarChartJSControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const {
        data = [],
        databind,
        labels = [],
        datasets = [],
        title = 'Bar Chart',
        width = '100%',
        height = 300,
        indexAxis = 'x', // 'x' for vertical bars, 'y' for horizontal
        stacked = false,
        responsive = true,
        maintainAspectRatio = false,
        backgroundColor = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
        borderColor = '#666',
        borderWidth = 1,
        borderRadius = 4,
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
                        backgroundColor,
                        borderColor,
                        borderWidth,
                        borderRadius
                    }];
                }
            }
        }

        // Color assignment
        const colors = Array.isArray(backgroundColor) ? backgroundColor : [backgroundColor];
        const processedDatasets = chartDatasets.map((dataset, idx) => ({
            ...dataset,
            backgroundColor: dataset.backgroundColor || colors[idx % colors.length],
            borderColor: dataset.borderColor || borderColor,
            borderWidth: dataset.borderWidth ?? borderWidth,
            borderRadius: dataset.borderRadius ?? borderRadius
        }));

        const ctx = chartRef.current.getContext('2d');

        // Destroy existing chart
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create new chart
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: processedDatasets
            },
            options: {
                indexAxis,
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
                    x: {
                        stacked,
                        grid: { display: showGrid }
                    },
                    y: {
                        stacked,
                        grid: { display: showGrid }
                    }
                },
                onClick: onClick ? (event, activeElements) => {
                    if (activeElements.length > 0) {
                        onClick(event, activeElements[0], chartDatasets[activeElements[0].datasetIndex]);
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
        <div className={`bar-chartjs-control ${className}`} style={{ width, height }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default BarChartJSControl;
