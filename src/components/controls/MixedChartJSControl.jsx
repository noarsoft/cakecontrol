// MixedChartJSControl.jsx - Mixed Chart using Chart.js (Bar + Line)
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './MixedChartJSControl.css';

function MixedChartJSControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const {
        data = [],
        databind,
        labels = [],
        datasets = [],
        title = 'Mixed Chart',
        width = '100%',
        height = 300,
        responsive = true,
        maintainAspectRatio = false,
        barBackgroundColor = '#3b82f6',
        barBorderColor = '#2563eb',
        lineColor = '#ef4444',
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
                    chartDatasets = [
                        {
                            type: 'bar',
                            label: 'Bar Values',
                            data: value.map(item => item.bar_value || 0),
                            backgroundColor: barBackgroundColor,
                            borderColor: barBorderColor,
                            borderWidth: 1,
                            borderRadius: 4
                        },
                        {
                            type: 'line',
                            label: 'Line Values',
                            data: value.map(item => item.line_value || 0),
                            borderColor: lineColor,
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            borderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            tension: 0.4
                        }
                    ];
                }
            }
        }

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
                datasets: chartDatasets
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
                    x: {
                        grid: { display: showGrid }
                    },
                    y: {
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
        <div className={`mixed-chartjs-control ${className}`} style={{ width, height }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default MixedChartJSControl;
