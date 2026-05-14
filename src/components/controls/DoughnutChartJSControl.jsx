import { useChartJS, resolveDatabind, extractLabelsAndValues, buildBaseOptions } from './charts/useChartJS';
import './DoughnutChartJSControl.css';

function percentLabel(context) {
    const label = context.label || '';
    const value = context.parsed;
    const total = context.dataset.data.reduce((a, b) => a + b, 0);
    const percentage = ((value / total) * 100).toFixed(1);
    return `${label}: ${value} (${percentage}%)`;
}

function DoughnutChartJSControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const {
        data = [], databind, labels = [], dataset = {}, title = 'Doughnut Chart',
        width = '100%', height = 300, responsive = true, maintainAspectRatio = false,
        backgroundColor = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'],
        borderColor, borderWidth = 2,
        showLegend = true, legendPosition = 'right', showTooltip = true,
        animation = true, centerText = '', onClick, className = ''
    } = control;

    let chartLabels = labels;
    let chartData = [];

    const bound = resolveDatabind(databind, rowData);
    if (bound && bound.length > 0 && typeof bound[0] === 'object') {
        const extracted = extractLabelsAndValues(bound);
        chartLabels = extracted.labels;
        chartData = extracted.values;
    } else if (data.length > 0) {
        if (typeof data[0] === 'number') {
            chartData = data;
        } else if (typeof data[0] === 'object') {
            const extracted = extractLabelsAndValues(data);
            chartLabels = extracted.labels;
            chartData = extracted.values;
        }
    }

    const rootStyles = typeof window !== 'undefined' ? window.getComputedStyle(document.documentElement) : null;
    const themedBorderColor = rootStyles?.getPropertyValue('--bg-primary').trim() || '#ffffff';
    const themedCenterTextColor = rootStyles?.getPropertyValue('--text-secondary').trim() || '#666666';

    const textCenterPlugin = {
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

    const chartOptions = buildBaseOptions({
        responsive, maintainAspectRatio, animation, showLegend, legendPosition, title, showTooltip,
        tooltipCallbacks: { label: percentLabel },
        onClick, onClickData: (el) => chartLabels[el.index]
    });

    const { chartRef } = useChartJS({
        chartType: 'doughnut', control, rowData,
        chartData: {
            labels: chartLabels,
            datasets: [{ ...dataset, data: chartData, backgroundColor: dataset.backgroundColor || backgroundColor, borderColor: dataset.borderColor || borderColor || themedBorderColor, borderWidth: dataset.borderWidth ?? borderWidth }]
        },
        chartOptions,
        plugins: [textCenterPlugin]
    });

    return (
        <div className={`doughnut-chartjs-control ${className}`} style={{ width, height }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default DoughnutChartJSControl;
