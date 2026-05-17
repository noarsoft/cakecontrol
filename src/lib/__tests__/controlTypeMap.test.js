import {
    CONTROL_TYPES,
    CONTROL_TO_FIELD_TYPE,
    FIELD_TO_CONTROL_TYPE,
    FIELD_TO_GENCONTROL_TYPE,
    fieldTypeToControlType,
    fieldTypeToGenControlType,
} from '../controlTypeMap';

describe('controlTypeMap', () => {
    describe('CONTROL_TYPES', () => {
        it('has 43 entries', () => {
            expect(CONTROL_TYPES).toHaveLength(43);
        });

        it('every entry has value and label', () => {
            for (const ct of CONTROL_TYPES) {
                expect(ct).toHaveProperty('value');
                expect(ct).toHaveProperty('label');
                expect(typeof ct.value).toBe('string');
                expect(typeof ct.label).toBe('string');
            }
        });

        it('has no duplicate values', () => {
            const values = CONTROL_TYPES.map(ct => ct.value);
            expect(new Set(values).size).toBe(values.length);
        });
    });

    describe('CONTROL_TO_FIELD_TYPE', () => {
        it('maps textbox to string', () => {
            expect(CONTROL_TO_FIELD_TYPE.textbox).toBe('string');
        });

        it('maps checkbox to boolean', () => {
            expect(CONTROL_TO_FIELD_TYPE.checkbox).toBe('boolean');
        });

        it('maps all chart types', () => {
            expect(CONTROL_TO_FIELD_TYPE.chartsbar).toBe('chartsbar');
            expect(CONTROL_TO_FIELD_TYPE.chartsline).toBe('chartsline');
            expect(CONTROL_TO_FIELD_TYPE.chartspie).toBe('chartspie');
        });

        it('every CONTROL_TYPES value has a mapping', () => {
            for (const ct of CONTROL_TYPES) {
                expect(CONTROL_TO_FIELD_TYPE).toHaveProperty(ct.value);
            }
        });
    });

    describe('FIELD_TO_CONTROL_TYPE', () => {
        it('maps string to textbox', () => {
            expect(FIELD_TO_CONTROL_TYPE.string).toBe('textbox');
        });

        it('maps boolean to checkbox', () => {
            expect(FIELD_TO_CONTROL_TYPE.boolean).toBe('checkbox');
        });

        it('handles legacy types', () => {
            expect(FIELD_TO_CONTROL_TYPE.email).toBe('textbox');
            expect(FIELD_TO_CONTROL_TYPE.password).toBe('password');
        });
    });

    describe('FIELD_TO_GENCONTROL_TYPE', () => {
        it('inherits non-chart mappings from FIELD_TO_CONTROL_TYPE', () => {
            expect(FIELD_TO_GENCONTROL_TYPE.string).toBe('textbox');
            expect(FIELD_TO_GENCONTROL_TYPE.boolean).toBe('checkbox');
            expect(FIELD_TO_GENCONTROL_TYPE.slider).toBe('slider');
        });

        it('overrides chart types with short aliases', () => {
            expect(FIELD_TO_GENCONTROL_TYPE.chartsbar).toBe('bar');
            expect(FIELD_TO_GENCONTROL_TYPE.chartsline).toBe('line');
            expect(FIELD_TO_GENCONTROL_TYPE.chartspie).toBe('pie');
            expect(FIELD_TO_GENCONTROL_TYPE.chartsdoughnut).toBe('doughnut');
            expect(FIELD_TO_GENCONTROL_TYPE.chartsradar).toBe('radar');
            expect(FIELD_TO_GENCONTROL_TYPE.chartsarea).toBe('area');
            expect(FIELD_TO_GENCONTROL_TYPE.chartsbubble).toBe('bubble');
            expect(FIELD_TO_GENCONTROL_TYPE.chartsmixed).toBe('mixed');
        });
    });

    describe('fieldTypeToControlType()', () => {
        it('returns mapped value for known type', () => {
            expect(fieldTypeToControlType('string')).toBe('textbox');
            expect(fieldTypeToControlType('number')).toBe('number');
            expect(fieldTypeToControlType('select')).toBe('select');
        });

        it('returns textbox for unknown type', () => {
            expect(fieldTypeToControlType('unknown_xyz')).toBe('textbox');
            expect(fieldTypeToControlType('')).toBe('textbox');
        });
    });

    describe('fieldTypeToGenControlType()', () => {
        it('returns short alias for chart types', () => {
            expect(fieldTypeToGenControlType('chartsbar')).toBe('bar');
            expect(fieldTypeToGenControlType('chartsline')).toBe('line');
        });

        it('returns same as fieldTypeToControlType for non-chart types', () => {
            expect(fieldTypeToGenControlType('string')).toBe('textbox');
            expect(fieldTypeToGenControlType('boolean')).toBe('checkbox');
        });

        it('returns textbox for unknown type', () => {
            expect(fieldTypeToGenControlType('nonexistent')).toBe('textbox');
        });
    });
});
