import { CONTROL_CONFIGS } from '../schemaBuilderConfigs';

function getKeys(type) {
    return CONTROL_CONFIGS[type].map(f => f.key);
}

describe('schemaBuilderConfigs.js', () => {
    describe('structure', () => {
        test('CONTROL_CONFIGS has entries for all expected control types', () => {
            expect(Object.keys(CONTROL_CONFIGS).length).toBe(49);
        });

        test('every CONTROL_CONFIGS value is an array', () => {
            for (const [type, fields] of Object.entries(CONTROL_CONFIGS)) {
                expect(Array.isArray(fields)).toBe(true);
            }
        });

        test('layout-only types have empty config arrays', () => {
            const emptyTypes = ['pagebreak', 'calendar', 'accordion', 'tabs', 'card', 'tree', 'menu', 'grid', 'table', 'form', 'crud'];
            for (const type of emptyTypes) {
                expect(CONTROL_CONFIGS[type]).toEqual([]);
            }
        });
    });

    describe('new types', () => {
        test('password has placeholder, showStrength, minLength', () => {
            expect(CONTROL_CONFIGS.password).toHaveLength(3);
            expect(getKeys('password')).toEqual(['placeholder', 'showStrength', 'minLength']);
        });

        test('email has placeholder', () => {
            expect(CONTROL_CONFIGS.email).toHaveLength(1);
            expect(getKeys('email')).toEqual(['placeholder']);
        });

        test('searchbox has placeholder, multiple, allowCreate', () => {
            expect(CONTROL_CONFIGS.searchbox).toHaveLength(3);
            expect(getKeys('searchbox')).toEqual(['placeholder', 'multiple', 'allowCreate']);
        });

        test('multipleupload has placeholder, allowedTypes, maxFileSize', () => {
            expect(CONTROL_CONFIGS.multipleupload).toHaveLength(3);
            expect(getKeys('multipleupload')).toEqual(['placeholder', 'allowedTypes', 'maxFileSize']);
        });
    });

    describe('input controls — field counts and keys', () => {
        test('string has 5 fields: placeholder, maxLength, rows, disabled, readOnly', () => {
            expect(CONTROL_CONFIGS.string).toHaveLength(5);
            expect(getKeys('string')).toEqual(['placeholder', 'maxLength', 'rows', 'disabled', 'readOnly']);
        });

        test('number has 6 fields: placeholder, min, max, step, disabled, readOnly', () => {
            expect(CONTROL_CONFIGS.number).toHaveLength(6);
            expect(getKeys('number')).toEqual(['placeholder', 'min', 'max', 'step', 'disabled', 'readOnly']);
        });

        test('select has 3 fields: enum, placeholder, disabled', () => {
            expect(CONTROL_CONFIGS.select).toHaveLength(3);
            expect(getKeys('select')).toEqual(['enum', 'placeholder', 'disabled']);
        });

        test('dropdown has 5 fields', () => {
            expect(CONTROL_CONFIGS.dropdown).toHaveLength(5);
            expect(getKeys('dropdown')).toContain('searchable');
            expect(getKeys('dropdown')).toContain('clearable');
        });

        test('boolean has 2 fields: value, disabled', () => {
            expect(CONTROL_CONFIGS.boolean).toHaveLength(2);
            expect(getKeys('boolean')).toEqual(['value', 'disabled']);
        });

        test('toggle has 2 fields: value, disabled', () => {
            expect(CONTROL_CONFIGS.toggle).toHaveLength(2);
            expect(getKeys('toggle')).toEqual(['value', 'disabled']);
        });

        test('date has 5 fields: placeholder, min, max, disabled, readOnly', () => {
            expect(CONTROL_CONFIGS.date).toHaveLength(5);
            expect(getKeys('date')).toEqual(['placeholder', 'min', 'max', 'disabled', 'readOnly']);
        });

        test('datepicker has 4 fields: placeholder, minDate, maxDate, disabled', () => {
            expect(CONTROL_CONFIGS.datepicker).toHaveLength(4);
            expect(getKeys('datepicker')).toEqual(['placeholder', 'minDate', 'maxDate', 'disabled']);
        });

        test('slider has 11 fields including unit, showValue, showTicks, color, disabled', () => {
            expect(CONTROL_CONFIGS.slider).toHaveLength(11);
            const keys = getKeys('slider');
            expect(keys).toContain('unit');
            expect(keys).toContain('showValue');
            expect(keys).toContain('showTicks');
            expect(keys).toContain('showLabel');
            expect(keys).toContain('color');
            expect(keys).toContain('disabled');
        });

        test('rating has 8 fields: maxStars, value, allowHalf, showLabel, color, size, disabled, readOnly', () => {
            expect(CONTROL_CONFIGS.rating).toHaveLength(8);
            expect(getKeys('rating')).toEqual(['maxStars', 'value', 'allowHalf', 'showLabel', 'color', 'size', 'disabled', 'readOnly']);
        });

        test('fileupload has 4 fields', () => {
            expect(CONTROL_CONFIGS.fileupload).toHaveLength(4);
            expect(getKeys('fileupload')).toContain('maxFileSize');
            expect(getKeys('fileupload')).toContain('allowedTypes');
        });
    });

    describe('display controls — field counts and keys', () => {
        test('label has 5 fields: value, bold, italic, fontSize, multiline', () => {
            expect(CONTROL_CONFIGS.label).toHaveLength(5);
            expect(getKeys('label')).toEqual(['value', 'bold', 'italic', 'fontSize', 'multiline']);
        });

        test('link has 8 fields including target, underline, buttonStyle, disabled', () => {
            expect(CONTROL_CONFIGS.link).toHaveLength(8);
            const keys = getKeys('link');
            expect(keys).toContain('target');
            expect(keys).toContain('icon');
            expect(keys).toContain('iconPosition');
            expect(keys).toContain('underline');
            expect(keys).toContain('buttonStyle');
            expect(keys).toContain('disabled');
        });

        test('image has 11 fields including alt, lazy, enlargeable, grayscale, fallback', () => {
            expect(CONTROL_CONFIGS.image).toHaveLength(11);
            const keys = getKeys('image');
            expect(keys).toContain('alt');
            expect(keys).toContain('lazy');
            expect(keys).toContain('enlargeable');
            expect(keys).toContain('grayscale');
            expect(keys).toContain('fallback');
        });

        test('badge has 3 fields: value, backgroundColor, color', () => {
            expect(CONTROL_CONFIGS.badge).toHaveLength(3);
            expect(getKeys('badge')).toEqual(['value', 'backgroundColor', 'color']);
        });

        test('icon has 4 fields: value, fontSize, color, size', () => {
            expect(CONTROL_CONFIGS.icon).toHaveLength(4);
            expect(getKeys('icon')).toEqual(['value', 'fontSize', 'color', 'size']);
        });

        test('progress has 3 fields: value, showValue, color', () => {
            expect(CONTROL_CONFIGS.progress).toHaveLength(3);
            expect(getKeys('progress')).toEqual(['value', 'showValue', 'color']);
        });

        test('qrcode has 6 fields including errorCorrectionLevel, margin, color', () => {
            expect(CONTROL_CONFIGS.qrcode).toHaveLength(6);
            const keys = getKeys('qrcode');
            expect(keys).toContain('errorCorrectionLevel');
            expect(keys).toContain('margin');
            expect(keys).toContain('color');
        });

        test('button has 2 fields: value, disabled', () => {
            expect(CONTROL_CONFIGS.button).toHaveLength(2);
            expect(getKeys('button')).toEqual(['value', 'disabled']);
        });

        test('buttongroup has 4 fields: enum, orientation, multiple, disabled', () => {
            expect(CONTROL_CONFIGS.buttongroup).toHaveLength(4);
            expect(getKeys('buttongroup')).toEqual(['enum', 'orientation', 'multiple', 'disabled']);
        });

        test('calendargrid has 1 field: editable', () => {
            expect(CONTROL_CONFIGS.calendargrid).toHaveLength(1);
            expect(getKeys('calendargrid')).toEqual(['editable']);
        });

        test('pagination has 4 fields: total, maxButtons, showPageInfo, showItemInfo', () => {
            expect(CONTROL_CONFIGS.pagination).toHaveLength(4);
            expect(getKeys('pagination')).toEqual(['total', 'maxButtons', 'showPageInfo', 'showItemInfo']);
        });
    });

    describe('modal controls', () => {
        test('alertmodal has 2 fields: title, message', () => {
            expect(CONTROL_CONFIGS.alertmodal).toHaveLength(2);
            expect(getKeys('alertmodal')).toEqual(['title', 'message']);
        });

        test('confirmmodal has 2 fields: title, message', () => {
            expect(CONTROL_CONFIGS.confirmmodal).toHaveLength(2);
            expect(getKeys('confirmmodal')).toEqual(['title', 'message']);
        });

        test('modal has 1 field: value', () => {
            expect(CONTROL_CONFIGS.modal).toHaveLength(1);
            expect(getKeys('modal')).toEqual(['value']);
        });
    });

    describe('chart controls', () => {
        test('chart has 8 fields', () => {
            expect(CONTROL_CONFIGS.chart).toHaveLength(8);
            expect(getKeys('chart')).toContain('chartType');
            expect(getKeys('chart')).toContain('xAxisKey');
            expect(getKeys('chart')).toContain('yAxisKey');
        });

        test('chartsline includes curved field', () => {
            expect(getKeys('chartsline')).toContain('curved');
        });

        test('chartsdoughnut includes innerRadius field', () => {
            expect(getKeys('chartsdoughnut')).toContain('innerRadius');
        });

        test('chartsarea includes fillOpacity field', () => {
            expect(getKeys('chartsarea')).toContain('fillOpacity');
        });

        test('chartsbar has 5 fields', () => {
            expect(CONTROL_CONFIGS.chartsbar).toHaveLength(5);
        });

        test('chartspie has 4 fields', () => {
            expect(CONTROL_CONFIGS.chartspie).toHaveLength(4);
        });

        test('chartsradar has 2 fields', () => {
            expect(CONTROL_CONFIGS.chartsradar).toHaveLength(2);
        });

        test('chartsbubble has 2 fields', () => {
            expect(CONTROL_CONFIGS.chartsbubble).toHaveLength(2);
        });

        test('chartsmixed has 3 fields', () => {
            expect(CONTROL_CONFIGS.chartsmixed).toHaveLength(3);
        });
    });
});
