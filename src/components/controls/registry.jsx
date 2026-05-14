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

// Circular dependencies
import FormControl from './FormControl';
import GridviewControl from './GridviewControl';
import TableviewControl from './TableviewControl';
import AccordionControl from './AccordionControl';
import TabControl from './TabControl';
import CardControl from './CardControl';
import TreeControl from './TreeControl';
import CRUDControl from './CRUDControl';
import SearchBoxControl from './SearchBoxControl';
import DropdownControl from './DropdownControl';

var _CONTROL_MAP;
var _CORE_POPULATED = false;

function ensureMap() {
    if (!_CONTROL_MAP) {
        _CONTROL_MAP = {};
    }
    return _CONTROL_MAP;
}

function getControlMap() {
    const map = ensureMap();
    if (!_CORE_POPULATED) {
        const core = {
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
            // Layout
            menu: MenuControl,
            modal: ModalControl,
            pagination: PaginationControl,
            pager: PaginationControl,
            form: FormControl,
            gridview: GridviewControl,
            tableview: TableviewControl,
            accordion: AccordionControl,
            tab: TabControl,
            card: CardControl,
            tree: TreeControl,
            crud: CRUDControl,
            searchbox: SearchBoxControl,
            tabledropdown: DropdownControl,
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
        // Merge core into existing map
        for (const key in core) {
            if (!map[key]) {
                map[key] = core[key];
            }
        }
        _CORE_POPULATED = true;
    }
    return map;
}

function genControl(control, rowData, rowIndex) {
    const key = `${rowIndex}-${control.type}-${control.databind || 'default'}`;
    const props = { control, config: control, rowData, rowIndex };

    if (control.type === 'custom') {
        return control.render ? control.render(rowData, rowIndex) : null;
    }

    const Component = getControlMap()[control.type];
    if (!Component) return null;

    return <Component key={key} {...props} />;
}

function registerControl(type, Component) {
    ensureMap()[type] = Component;
}

export { genControl, getControlMap, registerControl };
