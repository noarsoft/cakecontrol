import { useChartJS, resolveDatabind, buildBaseOptions } from './charts/useChartJS';
import './RadarChartJSControl.css';

function RadarChartJSControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const {
        labels = [], datasets = [], databind, title = 'Radar Chart',
        width = '100%', height = 300, responsive = true, maintainAspectRatio = false,
        borderColor = ['#3b82f6', '#ef4444', '#10b981'],
        backgroundColor = ['rgba(59, 130, 245, 0.2)', 'rgba(239, 68, 68, 0.2)', 'rgba(16, 185, 129, 0.2)'],
        borderWidth = 2, pointRadius = 4, pointHoverRadius = 6, fill = true,
        showLegend = true, showGrid = true, showTooltip = true,
        animation = true, onClick, className = ''
    } = control;

    let chartLabels = labels;
    let chartDatasets = datasets;

    const bound = resolveDatabind(databind, rowData);
    if (bound && bound.length > 0 && typeof bound[0] === 'object') {
        chartLabels = bound.map((item, idx) => item.label || item.name || `Item ${idx}`);
        chartDatasets = [{ label: 'Values', data: bound.map(item => item.value || 0), borderColor: borderColor[0], backgroundColor: backgroundColor[0], borderWidth, pointRadius, pointHoverRadius, fill }];
    }

    const colors = Array.isArray(borderColor) ? borderColor : [borderColor];
    const bgColors = Array.isArray(backgroundColor) ? backgroundColor : [backgroundColor];
    const processedDatasets = chartDatasets.map((ds, idx) => ({
        ...ds,
        borderColor: ds.borderColor || colors[idx % colors.length],
        backgroundColor: ds.backgroundColor || bgColors[idx % bgColors.length],
        borderWidth: ds.borderWidth ?? borderWidth,
        pointRadius: ds.pointRadius ?? pointRadius,
        pointHoverRadius: ds.pointHoverRadius ?? pointHoverRadius,
        fill: ds.fill ?? fill
    }));

    const chartOptions = buildBaseOptions({
        responsive, maintainAspectRatio, animation, showLegend, title, showTooltip,
        onClick, onClickData: (el) => processedDatasets[el.datasetIndex],
        extraOptions: {
            scales: { r: { grid: { display: showGrid }, beginAtZero: true } }
        }
    });

    const { chartRef } = useChartJS({
        chartType: 'radar', control, rowData,
        chartData: { labels: chartLabels, datasets: processedDatasets },
        chartOptions
    });

    return (
        <div className={`radar-chartjs-control ${className}`} style={{ width, height }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default RadarChartJSControl;
