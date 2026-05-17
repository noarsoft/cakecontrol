export const CONTROL_CONFIGS = {
    string: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'ข้อความแสดงตอนช่องว่าง เช่น "กรอกชื่อ"' },
        { key: 'maxLength', label: 'Max Length', type: 'number', hint: 'จำกัดตัวอักษรสูงสุดที่พิมพ์ได้' },
    ],
    number: [
        { key: 'min', label: 'Min', type: 'number', hint: 'ค่าต่ำสุดที่อนุญาต' },
        { key: 'max', label: 'Max', type: 'number', hint: 'ค่าสูงสุดที่อนุญาต' },
        { key: 'step', label: 'Step', type: 'number', hint: 'กดปุ่ม +/- เพิ่ม-ลดครั้งละเท่าไหร่ เช่น 5' },
    ],
    password: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'ข้อความแสดงตอนช่องว่าง' },
        { key: 'showStrength', label: 'Show Strength', type: 'toggle', hint: 'แสดงแถบวัดความแข็งแรงของรหัสผ่าน' },
        { key: 'minLength', label: 'Min Length', type: 'number', hint: 'จำนวนตัวอักษรขั้นต่ำ' },
    ],
    email: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'เช่น "name@example.com"' },
    ],
    select: [
        { key: 'enum', label: 'Options', type: 'options', hint: 'ตัวเลือกในดรอปดาวน์' },
    ],
    dropdown: [
        { key: 'enum', label: 'Options', type: 'options', hint: 'ตัวเลือกในดรอปดาวน์' },
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'ข้อความแสดงตอนยังไม่เลือก เช่น "เลือกรายการ..."' },
        { key: 'searchable', label: 'ค้นหาได้', type: 'toggle', hint: 'เปิดให้พิมพ์ค้นหาตัวเลือกได้' },
        { key: 'clearable', label: 'ล้างค่าได้', type: 'toggle', hint: 'แสดงปุ่มล้างค่าที่เลือก' },
        { key: 'maxHeight', label: 'ความสูงสูงสุด', type: 'text', hint: 'เช่น "300px"' },
    ],
    boolean: [
        { key: 'value', label: 'Default', type: 'toggle', hint: 'ค่าเริ่มต้น checked หรือไม่' },
    ],
    toggle: [
        { key: 'value', label: 'Default', type: 'toggle', hint: 'ค่าเริ่มต้น เปิด/ปิด' },
    ],
    date: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'เช่น "วว/ดด/ปปปป"' },
    ],
    datepicker: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'เช่น "เลือกวันที่"' },
    ],
    slider: [
        { key: 'min', label: 'Min', type: 'number', hint: 'ค่าต่ำสุดของแถบเลื่อน' },
        { key: 'max', label: 'Max', type: 'number', hint: 'ค่าสูงสุดของแถบเลื่อน' },
        { key: 'step', label: 'Step', type: 'number', hint: 'เลื่อนครั้งละเท่าไหร่ เช่น 10' },
        { key: 'value', label: 'Default', type: 'number', hint: 'ค่าเริ่มต้นของแถบเลื่อน' },
    ],
    rating: [
        { key: 'maxStars', label: 'Max Stars', type: 'number', hint: 'จำนวนดาวสูงสุด (default: 5)' },
        { key: 'value', label: 'Default', type: 'number', hint: 'จำนวนดาวเริ่มต้น' },
        { key: 'allowHalf', label: 'ครึ่งดาว', type: 'toggle', hint: 'อนุญาตให้เลือกครึ่งดาว (0.5)' },
        { key: 'showLabel', label: 'แสดงค่า', type: 'toggle', hint: 'แสดงตัวเลขคะแนน เช่น 3.5/5' },
        { key: 'color', label: 'สี', type: 'text', hint: 'สีดาว เช่น "#ffc107", "#ef4444"' },
        { key: 'size', label: 'ขนาด', type: 'text', hint: 'small, medium, large' },
    ],
    fileupload: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'ข้อความแสดงตอนยังไม่เลือกไฟล์' },
        { key: 'maxFileSize', label: 'ขนาดไฟล์สูงสุด (bytes)', type: 'number', hint: 'เช่น 52428800 = 50MB' },
        { key: 'allowedTypes', label: 'ประเภทไฟล์', type: 'text', hint: 'เช่น "image/jpeg,image/png,application/pdf"' },
        { key: 'buttonLabel', label: 'ข้อความปุ่ม', type: 'text', hint: 'เช่น "Choose Files to Upload"' },
    ],
    searchbox: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'เช่น "ค้นหาและเลือก..."' },
        { key: 'multiple', label: 'Multiple', type: 'toggle', hint: 'เลือกได้หลายค่า' },
        { key: 'allowCreate', label: 'Allow Create', type: 'toggle', hint: 'อนุญาตให้สร้างค่าใหม่ที่ไม่มีในรายการ' },
    ],
    multipleupload: [
        { key: 'placeholder', label: 'Placeholder', type: 'text', hint: 'ข้อความแสดงตอนยังไม่เลือกไฟล์' },
    ],
    label: [
        { key: 'value', label: 'Text', type: 'text', hint: 'ข้อความที่แสดง (ถ้าไม่ผูก databind)' },
    ],
    link: [
        { key: 'value', label: 'Text', type: 'text', hint: 'ข้อความลิงก์ที่แสดง' },
        { key: 'href', label: 'URL', type: 'text', hint: 'URL ปลายทาง เช่น "https://..."' },
    ],
    image: [
        { key: 'value', label: 'Image URL', type: 'text', hint: 'URL ของรูปภาพ' },
        { key: 'width', label: 'Width', type: 'text', hint: 'ความกว้าง เช่น "200px"' },
        { key: 'height', label: 'Height', type: 'text', hint: 'ความสูง เช่น "120px"' },
        { key: 'borderRadius', label: 'Border Radius', type: 'text', hint: 'มุมโค้ง เช่น "50%" = วงกลม' },
        { key: 'objectFit', label: 'Object Fit', type: 'text', hint: 'วิธีแสดงรูป: cover, contain, fill' },
        { key: 'shadow', label: 'Shadow', type: 'toggle', hint: 'แสดงเงาใต้รูป' },
    ],
    badge: [
        { key: 'value', label: 'Text', type: 'text', hint: 'ข้อความใน badge' },
    ],
    icon: [
        { key: 'value', label: 'Icon', type: 'text', hint: 'emoji หรือ icon เช่น "⭐"' },
    ],
    progress: [
        { key: 'value', label: 'Value (%)', type: 'number', hint: 'เปอร์เซ็นต์ 0-100' },
        { key: 'showValue', label: 'Show Value', type: 'toggle', hint: 'แสดงตัวเลข % บนแถบ' },
        { key: 'color', label: 'Color', type: 'text', hint: 'สีแถบ เช่น "#3b82f6"' },
    ],
    qrcode: [
        { key: 'value', label: 'QR Data', type: 'text', hint: 'ข้อมูลที่เข้ารหัส เช่น URL' },
        { key: 'width', label: 'Width', type: 'number', hint: 'ความกว้าง (px)' },
        { key: 'height', label: 'Height', type: 'number', hint: 'ความสูง (px)' },
    ],
    pagebreak: [],
    calendar: [],
    calendargrid: [],
    button: [
        { key: 'value', label: 'Button Text', type: 'text', hint: 'ข้อความบนปุ่ม' },
    ],
    buttongroup: [
        { key: 'enum', label: 'Buttons', type: 'options', hint: 'รายการปุ่ม' },
    ],
    accordion: [],
    tabs:     [],
    card:     [],
    tree:     [],
    menu:     [],
    grid:     [],
    table:    [],
    form:     [],
    crud:     [],
    alertmodal: [
        { key: 'title', label: 'Title', type: 'text', hint: 'หัวข้อ alert' },
        { key: 'message', label: 'Message', type: 'text', hint: 'ข้อความใน alert' },
    ],
    confirmmodal: [
        { key: 'title', label: 'Title', type: 'text', hint: 'หัวข้อ confirm' },
        { key: 'message', label: 'Message', type: 'text', hint: 'ข้อความใน confirm' },
    ],
    modal: [
        { key: 'value', label: 'Button Text', type: 'text', hint: 'ข้อความปุ่มเปิด modal' },
    ],
    pagination: [
        { key: 'total', label: 'Total Pages', type: 'number', hint: 'จำนวนหน้าทั้งหมด' },
    ],
    chart: [
        { key: 'chartType', label: 'Chart Type', type: 'text', hint: 'ประเภทกราฟ: bar, line, pie, doughnut, radar, area' },
        { key: 'title', label: 'Title', type: 'text', hint: 'ชื่อกราฟ' },
        { key: 'xAxisKey', label: 'X Axis Key', type: 'text', hint: 'ชื่อ field สำหรับแกน X' },
        { key: 'yAxisKey', label: 'Y Axis Key', type: 'text', hint: 'ชื่อ field สำหรับแกน Y' },
        { key: 'nameKey', label: 'Name Key', type: 'text', hint: 'key สำหรับ label ของข้อมูล' },
        { key: 'dataKey', label: 'Data Key', type: 'text', hint: 'key สำหรับค่าข้อมูล' },
        { key: 'showLegend', label: 'Show Legend', type: 'toggle', hint: 'แสดง Legend' },
        { key: 'showGrid', label: 'Show Grid', type: 'toggle', hint: 'แสดงเส้น Grid' },
    ],
    chartsbar: [
        { key: 'title', label: 'Title', type: 'text', hint: 'ชื่อกราฟ' },
        { key: 'xAxisKey', label: 'X Axis Key', type: 'text', hint: 'ชื่อ field สำหรับแกน X' },
        { key: 'yAxisKey', label: 'Y Axis Key', type: 'text', hint: 'ชื่อ field สำหรับแกน Y' },
        { key: 'showLegend', label: 'Show Legend', type: 'toggle', hint: 'แสดง Legend' },
        { key: 'showGrid', label: 'Show Grid', type: 'toggle', hint: 'แสดงเส้น Grid' },
    ],
    chartsline: [
        { key: 'title', label: 'Title', type: 'text', hint: 'ชื่อกราฟ' },
        { key: 'xAxisKey', label: 'X Axis Key', type: 'text', hint: 'ชื่อ field สำหรับแกน X' },
        { key: 'yAxisKey', label: 'Y Axis Key', type: 'text', hint: 'ชื่อ field สำหรับแกน Y' },
        { key: 'curved', label: 'Curved', type: 'toggle', hint: 'เส้นโค้ง' },
        { key: 'showLegend', label: 'Show Legend', type: 'toggle', hint: 'แสดง Legend' },
        { key: 'showGrid', label: 'Show Grid', type: 'toggle', hint: 'แสดงเส้น Grid' },
    ],
    chartspie: [
        { key: 'title', label: 'Title', type: 'text', hint: 'ชื่อกราฟ' },
        { key: 'nameKey', label: 'Name Key', type: 'text', hint: 'key สำหรับ label' },
        { key: 'dataKey', label: 'Data Key', type: 'text', hint: 'key สำหรับค่า' },
        { key: 'showLegend', label: 'Show Legend', type: 'toggle', hint: 'แสดง Legend' },
    ],
    chartsdoughnut: [
        { key: 'title', label: 'Title', type: 'text', hint: 'ชื่อกราฟ' },
        { key: 'nameKey', label: 'Name Key', type: 'text', hint: 'key สำหรับ label' },
        { key: 'dataKey', label: 'Data Key', type: 'text', hint: 'key สำหรับค่า' },
        { key: 'innerRadius', label: 'Inner Radius (%)', type: 'number', hint: 'รัศมีวงใน เช่น 60' },
        { key: 'showLegend', label: 'Show Legend', type: 'toggle', hint: 'แสดง Legend' },
    ],
    chartsradar: [
        { key: 'title', label: 'Title', type: 'text', hint: 'ชื่อกราฟ' },
        { key: 'showLegend', label: 'Show Legend', type: 'toggle', hint: 'แสดง Legend' },
    ],
    chartsarea: [
        { key: 'title', label: 'Title', type: 'text', hint: 'ชื่อกราฟ' },
        { key: 'xAxisKey', label: 'X Axis Key', type: 'text', hint: 'ชื่อ field สำหรับแกน X' },
        { key: 'yAxisKey', label: 'Y Axis Key', type: 'text', hint: 'ชื่อ field สำหรับแกน Y' },
        { key: 'fillOpacity', label: 'Fill Opacity', type: 'number', hint: 'ความโปร่งใส 0-1 เช่น 0.3' },
        { key: 'showLegend', label: 'Show Legend', type: 'toggle', hint: 'แสดง Legend' },
        { key: 'showGrid', label: 'Show Grid', type: 'toggle', hint: 'แสดงเส้น Grid' },
    ],
    chartsbubble: [
        { key: 'title', label: 'Title', type: 'text', hint: 'ชื่อกราฟ' },
        { key: 'showLegend', label: 'Show Legend', type: 'toggle', hint: 'แสดง Legend' },
    ],
    chartsmixed: [
        { key: 'title', label: 'Title', type: 'text', hint: 'ชื่อกราฟ' },
        { key: 'showLegend', label: 'Show Legend', type: 'toggle', hint: 'แสดง Legend' },
        { key: 'showGrid', label: 'Show Grid', type: 'toggle', hint: 'แสดงเส้น Grid' },
    ],
};
