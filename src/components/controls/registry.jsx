import CheckboxControl from './CheckboxControl';
import LabelControl from './LabelControl';
import ButtonControl from './ButtonControl';
import TextboxControl from './TextboxControl';
import NumberControl from './NumberControl';
import SelectControl from './SelectControl';
import ImageControl from './ImageControl';
import LinkControl from './LinkControl';
import BadgeControl from './BadgeControl';
import IconControl from './IconControl';
import DateControl from './DateControl';
import DatePickerControl from './DatePickerControl';
import PasswordControl from './PasswordControl';
import ToggleControl from './ToggleControl';
import ProgressControl from './ProgressControl';
import CalendarControl from './CalendarControl';
import CalendarGridControl from './CalendarGridControl';
import QRCodeControl from './QRCodeControl';
import PaginationControl from './PaginationControl';
import RatingControl from './RatingControl';
import SliderControl from './SliderControl';
import MultipleUploadControl from './MultipleUploadControl';
import ButtonGroupControl from './ButtonGroupControl';
import MenuControl from './MenuControl';
import ModalControl from './ModalControl';
import ChartControl from './ChartControl';
import BarChartJSControl from './BarChartJSControl';
import LineChartJSControl from './LineChartJSControl';
import PieChartJSControl from './PieChartJSControl';
import DoughnutChartJSControl from './DoughnutChartJSControl';
import RadarChartJSControl from './RadarChartJSControl';
import AreaChartJSControl from './AreaChartJSControl';
import BubbleChartJSControl from './BubbleChartJSControl';
import MixedChartJSControl from './MixedChartJSControl';

// Lazy imports — these controls import registry (circular dependency)
let _FormControl, _GridviewControl, _TableviewControl;
let _AccordionControl, _TabControl, _CardControl, _TreeControl;
let _CRUDControl, _SearchBoxControl, _DropdownControl;

function lazyLoad(type) {
    switch (type) {
        case 'form': return _FormControl || (_FormControl = require('./FormControl').default);
        case 'gridview': return _GridviewControl || (_GridviewControl = require('./GridviewControl').default);
        case 'tableview': return _TableviewControl || (_TableviewControl = require('./TableviewControl').default);
        case 'accordion': return _AccordionControl || (_AccordionControl = require('./AccordionControl').default);
        case 'tab': return _TabControl || (_TabControl = require('./TabControl').default);
        case 'card': return _CardControl || (_CardControl = require('./CardControl').default);
        case 'tree': return _TreeControl || (_TreeControl = require('./TreeControl').default);
        case 'crud': return _CRUDControl || (_CRUDControl = require('./CRUDControl').default);
        case 'searchbox': return _SearchBoxControl || (_SearchBoxControl = require('./SearchBoxControl').default);
        case 'tabledropdown': return _DropdownControl || (_DropdownControl = require('./DropdownControl').default);
        default: return null;
    }
}

const LAZY_TYPES = new Set([
    'form', 'gridview', 'tableview', 'accordion', 'tab',
    'card', 'tree', 'crud', 'searchbox', 'tabledropdown',
]);

const CONTROL_MAP = {
    // Input
    checkbox: CheckboxControl,
    textbox: TextboxControl,
    input: TextboxControl,
    number: NumberControl,
    password: PasswordControl,
    select: SelectControl,
    dropdown: SelectControl,
    toggle: ToggleControl,
    switch: ToggleControl,
    date: DateControl,
    datepicker: DatePickerControl,
    slider: SliderControl,
    range: SliderControl,
    rating: RatingControl,
    star: RatingControl,
    multipleupload: MultipleUploadControl,
    // Display
    label: LabelControl,
    link: LinkControl,
    image: ImageControl,
    badge: BadgeControl,
    tag: BadgeControl,
    icon: IconControl,
    progress: ProgressControl,
    progressbar: ProgressControl,
    calendar: CalendarControl,
    calendargrid: CalendarGridControl,
    qrcode: QRCodeControl,
    qr: QRCodeControl,
    button: ButtonControl,
    buttongroup: ButtonGroupControl,
    // Layout (non-circular)
    menu: MenuControl,
    modal: ModalControl,
    pagination: PaginationControl,
    pager: PaginationControl,
    // Charts
    chart: ChartControl,
    barchartjs: BarChartJSControl,
    bar: BarChartJSControl,
    linechartjs: LineChartJSControl,
    line: LineChartJSControl,
    piechartjs: PieChartJSControl,
    pie: PieChartJSControl,
    doughnenchartjs: DoughnutChartJSControl,
    doughnut: DoughnutChartJSControl,
    radarchartjs: RadarChartJSControl,
    radar: RadarChartJSControl,
    areachartjs: AreaChartJSControl,
    area: AreaChartJSControl,
    bubblechartjs: BubbleChartJSControl,
    bubble: BubbleChartJSControl,
    mixedchartjs: MixedChartJSControl,
    mixed: MixedChartJSControl,
};

function genControl(control, rowData, rowIndex) {
    const key = `${rowIndex}-${control.type}-${control.databind || Math.random()}`;
    const props = { control, rowData, rowIndex };

    if (control.type === 'custom') {
        return control.render ? control.render(rowData, rowIndex) : null;
    }

    let Component = CONTROL_MAP[control.type];
    if (!Component && LAZY_TYPES.has(control.type)) {
        Component = lazyLoad(control.type);
    }
    if (!Component) return null;

    return <Component key={key} {...props} />;
}

export { genControl, CONTROL_MAP };
