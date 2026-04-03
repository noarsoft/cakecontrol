// DoughnutChartJSControl.jsx - Doughnut Chart using Chart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './DoughnutChartJSControl.css';

function DoughnutChartJSControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const {
        data = [],
        databind,
        labels = [],
        dataset = {},
        title = 'Doughnut Chart',
        width = '100%',
        height = 300,
        responsive = true,
        maintainAspectRatio = false,
        backgroundColor = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
            '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
        ],
        borderColor,
        borderWidth = 2,
        showLegend = true,
        legendPosition = 'right',
        showTooltip = true,
        animation = true,
        centerText = '', // Text to show in the center of the doughnut
        onClick,
        className = ''
    } = control;

    useEffect(() => {
        if (!chartRef.current) return;

        // Prepare data
        let chartLabels = labels;
        let chartData = [];

        if (databind && rowData) {
            const keys = databind.split('.');
            let value = rowData;
            for (const key of keys) {
                value = value?.[key];
            }
            if (Array.isArray(value)) {
                if (value.length > 0 && typeof value[0] === 'object') {
                    chartLabels = value.map((item, idx) => item.label || item.name || `Item ${idx}`);
                    chartData = value.map(item => item.value || 0);
                }
            }
        } else if (data.length > 0) {
            if (typeof data[0] === 'number') {
                chartData = data;
            } else if (typeof data[0] === 'object') {
                chartLabels = data.map((item, idx) => item.label || item.name || `Item ${idx}`);
                chartData = data.map(item => item.value || 0);
            }
        }

        const ctx = chartRef.current.getContext('2d');
        const rootStyles = window.getComputedStyle(document.documentElement);
        const themedBorderColor = rootStyles.getPropertyValue('--bg-primary').trim() || '#ffffff';
        const themedCenterTextColor = rootStyles.getPropertyValue('--text-secondary').trim() || '#666666';

        // Destroy existing chart
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Plugin for center text
        const textCenter = {
            id: 'textCenter',
            beforeDatasetsDraw(chart) {
                if (!centerText) return;
                
                const { width, height } = chart;
                const ctx = chart.ctx;

                ctx.save();
                ctx.font = 'bold 20px sans-serif';
                ctx.fillStyle = themedCenterTextColor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(centerText, width / 2, height / 2);
                ctx.restore();
            }
        };

        // Create new chart
        chartInstance.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartLabels,
                datasets: [{
                    ...dataset,
                    data: chartData,
                    backgroundColor: dataset.backgroundColor || backgroundColor,
                    borderColor: dataset.borderColor || borderColor || themedBorderColor,
                    borderWidth: dataset.borderWidth ?? borderWidth
                }]
            },
            options: {
                responsive,
                maintainAspectRatio,
                animation: animation ? { duration: 750 } : false,
                plugins: {
                    legend: {
                        display: showLegend,
                        position: legendPosition
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
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                onClick: onClick ? (event, activeElements) => {
                    if (activeElements.length > 0) {
                        onClick(event, activeElements[0], chartLabels[activeElements[0].index]);
                    }
                } : undefined
            },
            plugins: [textCenter]
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [control, rowData]);

    return (
        <div className={`doughnut-chartjs-control ${className}`} style={{ width, height }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default DoughnutChartJSControl;
