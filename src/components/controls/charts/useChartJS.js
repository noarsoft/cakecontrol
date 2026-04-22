import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function resolveDatabind(databind, rowData) {
    if (!databind || !rowData) return undefined;
    const keys = databind.split('.');
    let value = rowData;
    for (const key of keys) {
        value = value?.[key];
    }
    return Array.isArray(value) ? value : undefined;
}

function extractLabelsAndValues(items) {
    const labels = items.map((item, idx) => item.label || item.name || `Item ${idx}`);
    const values = items.map(item => item.value || 0);
    return { labels, values };
}

function buildBaseOptions({ responsive, maintainAspectRatio, animation, showLegend, legendPosition, title, showTooltip, tooltipCallbacks, onClick, onClickData, extraOptions }) {
    return {
        responsive,
        maintainAspectRatio,
        animation: animation ? { duration: 750 } : false,
        plugins: {
            legend: {
                display: showLegend,
                position: legendPosition || 'top'
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
                ...(tooltipCallbacks ? { callbacks: tooltipCallbacks } : {})
            }
        },
        onClick: onClick ? (event, activeElements) => {
            if (activeElements.length > 0) {
                onClick(event, activeElements[0], onClickData?.(activeElements[0]) ?? null);
            }
        } : undefined,
        ...extraOptions
    };
}

export function useChartJS({ chartType, chartData, chartOptions, plugins = [], control, rowData }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
            type: chartType,
            data: chartData,
            options: chartOptions,
            plugins
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [control, rowData]);

    return { chartRef };
}

export { resolveDatabind, extractLabelsAndValues, buildBaseOptions };
