import OverviewPage from './pages/OverviewPage';
import AllControlsPage from './pages/AllControlsPage';
import DataBindingPage from './pages/DataBindingPage';
import FormPage from './pages/FormPage';
import TablePage from './pages/TablePage';
import GridPage from './pages/GridPage';
import CardPage from './pages/CardPage';
import AccordionPage from './pages/AccordionPage';
import TabsPage from './pages/TabsPage';
import TreePage from './pages/TreePage';
import ButtonGroupPage from './pages/ButtonGroupPage';
import LinkPage from './pages/LinkPage';
import ImagePage from './pages/ImagePage';
import PaginationPage from './pages/PaginationPage';
import DatePickerPage from './pages/DatePickerPage';
import CalendarGridPage from './pages/CalendarGridPage';
import BadgePage from './pages/BadgePage';
import IconPage from './pages/IconPage';
import DropdownPage from './pages/DropdownPage';
import ProgressPage from './pages/ProgressPage';
import QRCodePage from './pages/QRCodePage';
import ChartPage from './pages/ChartPage';
import FileUploadPage from './pages/FileUploadPage';
import MenuPage from './pages/MenuPage';
import RatingPage from './pages/RatingPage';
import SliderPage from './pages/SliderPage';
import AlertModalPage from './pages/AlertModalPage';
import ConfirmModalPage from './pages/ConfirmModalPage';
import LabelPage from './pages/LabelPage';
import TextboxPage from './pages/TextboxPage';
import NumberPage from './pages/NumberPage';
import SelectPage from './pages/SelectPage';
import CheckboxPage from './pages/CheckboxPage';
import TogglePage from './pages/TogglePage';
import DatePage from './pages/DatePage';
import ButtonPage from './pages/ButtonPage';
import BarChartJSPage from './pages/BarChartJSPage';
import LineChartJSPage from './pages/LineChartJSPage';
import PieChartJSPage from './pages/PieChartJSPage';
import DoughnutChartJSPage from './pages/DoughnutChartJSPage';
import RadarChartJSPage from './pages/RadarChartJSPage';
import AreaChartJSPage from './pages/AreaChartJSPage';
import BubbleChartJSPage from './pages/BubbleChartJSPage';
import MixedChartJSPage from './pages/MixedChartJSPage';
import CRUDPage from './pages/CRUDPage';
import ModalPage from './pages/ModalPage';
import BenchmarkPage from './pages/BenchmarkPage';

export const pages = {
    overview:       { title: '📚 Overview',       category: 'Getting Started',   icon: '🏠', component: OverviewPage, passSetPage: true },
    allcontrols:    { title: '🎯 All Controls',   category: 'Getting Started',   icon: '🎨', component: AllControlsPage },
    databinding:    { title: '🔄 Data Binding',   category: 'Getting Started',   icon: '🔗', component: DataBindingPage },
    form:           { title: 'Form Control',       category: 'Layout Controls',   icon: '📝', component: FormPage },
    table:          { title: 'Table Control',      category: 'Layout Controls',   icon: '📊', component: TablePage },
    grid:           { title: 'Grid Control',       category: 'Layout Controls',   icon: '▦',  component: GridPage },
    card:           { title: 'Card Control',       category: 'Layout Controls',   icon: '🃏', component: CardPage },
    accordion:      { title: 'Accordion Control',  category: 'Layout Controls',   icon: '📂', component: AccordionPage },
    tabs:           { title: 'Tab Control',        category: 'Layout Controls',   icon: '📑', component: TabsPage },
    tree:           { title: 'Tree Control',       category: 'Layout Controls',   icon: '🌳', component: TreePage },
    buttongroup:    { title: 'Button Group',       category: 'Layout Controls',   icon: '🔲', component: ButtonGroupPage },
    pagination:     { title: 'Pagination',         category: 'Layout Controls',   icon: '📄', component: PaginationPage },
    menu:           { title: 'Menu Control',       category: 'Layout Controls',   icon: '📋', component: MenuPage },
    crud:           { title: 'CRUD Control',       category: 'Layout Controls',   icon: '🗂️', component: CRUDPage },
    label:          { title: 'Label Control',      category: 'Input Controls',    icon: '🏷️', component: LabelPage },
    textbox:        { title: 'Textbox Control',    category: 'Input Controls',    icon: '✏️', component: TextboxPage },
    number:         { title: 'Number Control',     category: 'Input Controls',    icon: '🔢', component: NumberPage },
    select:         { title: 'Select Control',     category: 'Input Controls',    icon: '📋', component: SelectPage },
    checkbox:       { title: 'Checkbox Control',   category: 'Input Controls',    icon: '☑️', component: CheckboxPage },
    toggle:         { title: 'Toggle Control',     category: 'Input Controls',    icon: '🔘', component: TogglePage },
    date:           { title: 'Date Control',       category: 'Input Controls',    icon: '📅', component: DatePage },
    button:         { title: 'Button Control',     category: 'Input Controls',    icon: '🔲', component: ButtonPage },
    slider:         { title: 'Slider Control',     category: 'Input Controls',    icon: '🎚️', component: SliderPage },
    link:           { title: 'Link Control',       category: 'Display Controls',  icon: '🔗', component: LinkPage },
    image:          { title: 'Image Control',      category: 'Display Controls',  icon: '🖼️', component: ImagePage },
    badge:          { title: 'Badge Control',      category: 'Display Controls',  icon: '🏅', component: BadgePage },
    icon:           { title: 'Icon Control',       category: 'Display Controls',  icon: '⭐', component: IconPage },
    datepicker:     { title: 'DatePicker',         category: 'Date/Time Controls', icon: '📅', component: DatePickerPage },
    calendargrid:   { title: 'Calendar Grid',      category: 'Date/Time Controls', icon: '📆', component: CalendarGridPage },
    dropdown:       { title: 'Dropdown',           category: 'Other Controls',    icon: '⬇️', component: DropdownPage },
    progress:       { title: 'Progress Bar',       category: 'Other Controls',    icon: '📊', component: ProgressPage },
    qrcode:         { title: 'QR Code',            category: 'Other Controls',    icon: '📱', component: QRCodePage },
    chart:          { title: 'Chart',              category: 'Other Controls',    icon: '📈', component: ChartPage },
    fileupload:     { title: 'File Upload',        category: 'Other Controls',    icon: '📁', component: FileUploadPage },
    rating:         { title: 'Rating Control',     category: 'Other Controls',    icon: '⭐', component: RatingPage },
    modal:          { title: 'Modal Control',      category: 'Feedback Controls', icon: '🪟', component: ModalPage },
    alertmodal:     { title: 'Alert Modal',        category: 'Feedback Controls', icon: '🚭', component: AlertModalPage },
    confirmmodal:   { title: 'Confirm Modal',      category: 'Feedback Controls', icon: '✅', component: ConfirmModalPage },
    chartsbar:      { title: 'Bar Chart JS',       category: 'Chart Controls',    icon: '📊', component: BarChartJSPage },
    chartsline:     { title: 'Line Chart JS',      category: 'Chart Controls',    icon: '📈', component: LineChartJSPage },
    chartspie:      { title: 'Pie Chart JS',       category: 'Chart Controls',    icon: '🥧', component: PieChartJSPage },
    chartsdoughnut: { title: 'Doughnut Chart JS',  category: 'Chart Controls',    icon: '🍩', component: DoughnutChartJSPage },
    chartsradar:    { title: 'Radar Chart JS',     category: 'Chart Controls',    icon: '🎯', component: RadarChartJSPage },
    chartsarea:     { title: 'Area Chart JS',      category: 'Chart Controls',    icon: '📊', component: AreaChartJSPage },
    chartsbubble:   { title: 'Bubble Chart JS',    category: 'Chart Controls',    icon: '🫧', component: BubbleChartJSPage },
    chartsmixed:    { title: 'Mixed Chart JS',     category: 'Chart Controls',    icon: '📊', component: MixedChartJSPage },
    benchmark:      { title: 'DB Benchmark',       category: 'Research',          icon: '🔬', component: BenchmarkPage },
};

export function getCategories() {
    const categories = {};
    Object.entries(pages).forEach(([key, page]) => {
        if (!categories[page.category]) categories[page.category] = [];
        categories[page.category].push({ key, ...page });
    });
    return categories;
}
