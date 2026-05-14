import { useChartJS, resolveDatabind, buildBaseOptions } from './charts/useChartJS';
import './LineChartJSControl.css';

function LineChartJSControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const {
        labels = [], datasets = [], databind, title = 'Line Chart',
        width = '100%', height = 300, responsive = true, maintainAspectRatio = false,
        borderColor = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
        backgroundColor = 'rgba(59, 130, 245, 0.1)', borderWidth = 2,
        pointRadius = 4, pointHoverRadius = 6, tension = 0.4, fill = false,
        showLegend = true, showGrid = true, showTooltip = true,
        animation = true, onClick, className = ''
    } = control;

    let chartLabels = labels;
    let chartDatasets = datasets;

    const bound = resolveDatabind(databind, rowData);
    if (bound && bound.length > 0 && typeof bound[0] === 'object') {
        chartLabels = bound.map((item, idx) => item.label || item.name || `Item ${idx}`);
        chartDatasets = [{ label: 'Values', data: bound.map(item => item.value || 0), borderColor: borderColor[0], backgroundColor, borderWidth, pointRadius, pointHoverRadius, tension, fill }];
    }

    const colors = Array.isArray(borderColor) ? borderColor : [borderColor];
    const processedDatasets = chartDatasets.map((ds, idx) => ({
        ...ds,
        borderColor: ds.borderColor || colors[idx % colors.length],
        backgroundColor: ds.backgroundColor || backgroundColor,
        borderWidth: ds.borderWidth ?? borderWidth,
        pointRadius: ds.pointRadius ?? pointRadius,
        pointHoverRadius: ds.pointHoverRadius ?? pointHoverRadius,
        tension: ds.tension ?? tension,
        fill: ds.fill ?? fill
    }));

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
        chartType: 'line', control, rowData,
        chartData: { labels: chartLabels, datasets: processedDatasets },
        chartOptions
    });

    return (
        <div className={`line-chartjs-control ${className}`} style={{ width, height }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default LineChartJSControl;
