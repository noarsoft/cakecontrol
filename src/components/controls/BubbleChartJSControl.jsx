import { useChartJS, resolveDatabind, buildBaseOptions } from './charts/useChartJS';
import './BubbleChartJSControl.css';

function bubbleTooltipLabel(context) {
    const label = context.dataset.label || '';
    const data = context.raw;
    return `${label}: (${data.x.toFixed(1)}, ${data.y.toFixed(1)}) - Size: ${data.r}`;
}

function BubbleChartJSControl({ control = {}, rowData = {}, rowIndex = 0 }) {
    const {
        datasets = [], databind, title = 'Bubble Chart',
        width = '100%', height = 300, responsive = true, maintainAspectRatio = false,
        backgroundColor = ['rgba(59, 130, 245, 0.6)', 'rgba(239, 68, 68, 0.6)', 'rgba(16, 185, 129, 0.6)'],
        borderColor = ['#3b82f6', '#ef4444', '#10b981'], borderWidth = 2,
        showLegend = true, showGrid = true, showTooltip = true,
        animation = true, onClick, className = ''
    } = control;

    let chartDatasets = datasets;

    const bound = resolveDatabind(databind, rowData);
    if (bound && bound.length > 0 && typeof bound[0] === 'object') {
        chartDatasets = [{
            label: 'Bubbles',
            data: bound.map(item => ({ x: item.x || Math.random() * 100, y: item.y || Math.random() * 100, r: item.r || item.value || 10 })),
            backgroundColor: backgroundColor[0], borderColor: borderColor[0], borderWidth
        }];
    }

    const bgColors = Array.isArray(backgroundColor) ? backgroundColor : [backgroundColor];
    const colors = Array.isArray(borderColor) ? borderColor : [borderColor];
    const processedDatasets = chartDatasets.map((ds, idx) => ({
        ...ds,
        backgroundColor: ds.backgroundColor || bgColors[idx % bgColors.length],
        borderColor: ds.borderColor || colors[idx % colors.length],
        borderWidth: ds.borderWidth ?? borderWidth
    }));

    const chartOptions = buildBaseOptions({
        responsive, maintainAspectRatio, animation, showLegend, title, showTooltip,
        tooltipCallbacks: { label: bubbleTooltipLabel },
        onClick, onClickData: (el) => processedDatasets[el.datasetIndex],
        extraOptions: {
            scales: {
                x: { type: 'linear', position: 'bottom', grid: { display: showGrid } },
                y: { grid: { display: showGrid } }
            }
        }
    });

    const { chartRef } = useChartJS({
        chartType: 'bubble', control, rowData,
        chartData: { datasets: processedDatasets },
        chartOptions
    });

    return (
        <div className={`bubble-chartjs-control ${className}`} style={{ width, height }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}

export default BubbleChartJSControl;
