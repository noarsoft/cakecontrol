import React from 'react';
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
import DropdownControl from './DropdownControl';
import PasswordControl from './PasswordControl';
import ToggleControl from './ToggleControl';
import ProgressControl from './ProgressControl';
import CalendarControl from './CalendarControl';
import QRCodeControl from './QRCodeControl';
import PaginationControl from './PaginationControl';
import RatingControl from './RatingControl';
import SliderControl from './SliderControl';
import BarChartJSControl from './BarChartJSControl';
import LineChartJSControl from './LineChartJSControl';
import PieChartJSControl from './PieChartJSControl';
import DoughnutChartJSControl from './DoughnutChartJSControl';
import RadarChartJSControl from './RadarChartJSControl';
import AreaChartJSControl from './AreaChartJSControl';
import BubbleChartJSControl from './BubbleChartJSControl';
import MixedChartJSControl from './MixedChartJSControl';

const CONTROL_MAP = {
    checkbox: CheckboxControl,
    label: LabelControl,
    button: ButtonControl,
    textbox: TextboxControl,
    input: TextboxControl,
    number: NumberControl,
    select: SelectControl,
    dropdown: SelectControl,
    image: ImageControl,
    link: LinkControl,
    badge: BadgeControl,
    tag: BadgeControl,
    icon: IconControl,
    date: DateControl,
    datepicker: DatePickerControl,
    tabledropdown: DropdownControl,
    password: PasswordControl,
    toggle: ToggleControl,
    switch: ToggleControl,
    progress: ProgressControl,
    progressbar: ProgressControl,
    calendar: CalendarControl,
    qrcode: QRCodeControl,
    qr: QRCodeControl,
    pagination: PaginationControl,
    pager: PaginationControl,
    rating: RatingControl,
    star: RatingControl,
    slider: SliderControl,
    range: SliderControl,
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

    const Component = CONTROL_MAP[control.type];
    if (!Component) return null;

    return <Component key={key} {...props} />;
}

export { genControl, CONTROL_MAP };
