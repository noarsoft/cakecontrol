import { FIELD_TYPES } from '../schema';
import { PASSTHROUGH_PROPS } from '../schemaTransform';
import { CONTROL_CONFIGS } from '../../forms/schemaBuilderConfigs';

const FIELD_TYPE_VALUES = FIELD_TYPES.map(t => t.value);
const LEGACY_TYPES = ['password', 'email', 'searchbox', 'multipleupload'];
const NO_PASSTHROUGH_TYPES = ['pagebreak', 'table', 'calendar'];
const VALID_CONFIG_FIELD_TYPES = ['text', 'number', 'toggle', 'options'];
const SPECIAL_CONFIG_KEYS = ['enum', 'value', 'total', 'title', 'message'];

// Types with intentionally empty CONTROL_CONFIGS (composite/layout — configured via sub-controls)
const COMPOSITE_TYPES = ['accordion', 'tabs', 'card', 'tree', 'menu', 'form', 'grid', 'crud', 'modal', 'alertmodal', 'confirmmodal'];

// Props intentionally not exposed in designer panel
const INTERNAL_PROPS = ['chunkSize', 'apiUrl', 'colors'];

// Chart sub-types share CHART_PROPS array but only expose relevant subset in config
const CHART_SUB_TYPES = ['chartsbar', 'chartsline', 'chartspie', 'chartsdoughnut', 'chartsradar', 'chartsarea', 'chartsbubble', 'chartsmixed'];

describe('Control config completeness', () => {
    describe('PASSTHROUGH_PROPS coverage', () => {
        test('every FIELD_TYPES entry (except pagebreak/table/calendar) has a PASSTHROUGH_PROPS entry', () => {
            const missing = FIELD_TYPE_VALUES.filter(
                t => !NO_PASSTHROUGH_TYPES.includes(t) && !PASSTHROUGH_PROPS[t]
            );
            expect(missing).toEqual([]);
        });

        test('every PASSTHROUGH_PROPS key is a valid field type or known legacy type', () => {
            const allValid = [...FIELD_TYPE_VALUES, ...LEGACY_TYPES];
            const orphans = Object.keys(PASSTHROUGH_PROPS).filter(k => !allValid.includes(k));
            expect(orphans).toEqual([]);
        });

        test('every PASSTHROUGH_PROPS entry is a non-empty array of strings', () => {
            for (const [type, props] of Object.entries(PASSTHROUGH_PROPS)) {
                expect(Array.isArray(props)).toBe(true);
                expect(props.length).toBeGreaterThan(0);
                for (const p of props) {
                    expect(typeof p).toBe('string');
                }
            }
        });

        test('no PASSTHROUGH_PROPS entry has duplicate keys', () => {
            for (const [type, props] of Object.entries(PASSTHROUGH_PROPS)) {
                expect(new Set(props).size).toBe(props.length);
            }
        });
    });

    describe('CONTROL_CONFIGS coverage', () => {
        test('every FIELD_TYPES entry has a CONTROL_CONFIGS entry', () => {
            const missing = FIELD_TYPE_VALUES.filter(t => !CONTROL_CONFIGS.hasOwnProperty(t));
            expect(missing).toEqual([]);
        });

        test('legacy types (password, email, searchbox, multipleupload) have CONTROL_CONFIGS entries', () => {
            for (const type of LEGACY_TYPES) {
                expect(CONTROL_CONFIGS).toHaveProperty(type);
                expect(CONTROL_CONFIGS[type].length).toBeGreaterThan(0);
            }
        });

        test('every CONTROL_CONFIGS field has key, label, type, and hint', () => {
            for (const [type, fields] of Object.entries(CONTROL_CONFIGS)) {
                for (const field of fields) {
                    expect(typeof field.key).toBe('string');
                    expect(field.key.length).toBeGreaterThan(0);
                    expect(typeof field.label).toBe('string');
                    expect(field.label.length).toBeGreaterThan(0);
                    expect(typeof field.type).toBe('string');
                    expect(typeof field.hint).toBe('string');
                }
            }
        });

        test('CONTROL_CONFIGS field types use only valid config panel types', () => {
            for (const [type, fields] of Object.entries(CONTROL_CONFIGS)) {
                for (const field of fields) {
                    expect(VALID_CONFIG_FIELD_TYPES).toContain(field.type);
                }
            }
        });

        test('no CONTROL_CONFIGS entry has duplicate field keys', () => {
            for (const [type, fields] of Object.entries(CONTROL_CONFIGS)) {
                const keys = fields.map(f => f.key);
                expect(new Set(keys).size).toBe(keys.length);
            }
        });
    });

    describe('PASSTHROUGH_PROPS ↔ CONTROL_CONFIGS alignment', () => {
        test('input/display types: every PASSTHROUGH_PROPS key has a CONTROL_CONFIGS field', () => {
            const mismatches = [];
            for (const [type, props] of Object.entries(PASSTHROUGH_PROPS)) {
                if (COMPOSITE_TYPES.includes(type)) continue;
                if (CHART_SUB_TYPES.includes(type)) continue;
                if (!CONTROL_CONFIGS[type]) continue;
                const configKeys = CONTROL_CONFIGS[type].map(f => f.key);
                for (const prop of props) {
                    if (SPECIAL_CONFIG_KEYS.includes(prop)) continue;
                    if (INTERNAL_PROPS.includes(prop)) continue;
                    if (!configKeys.includes(prop)) {
                        mismatches.push(`${type}.${prop}`);
                    }
                }
            }
            expect(mismatches).toEqual([]);
        });

        test('chart sub-types: config fields are a subset of PASSTHROUGH_PROPS', () => {
            const mismatches = [];
            for (const type of CHART_SUB_TYPES) {
                if (!CONTROL_CONFIGS[type]) continue;
                const passthroughKeys = PASSTHROUGH_PROPS[type] || [];
                for (const field of CONTROL_CONFIGS[type]) {
                    if (!passthroughKeys.includes(field.key)) {
                        mismatches.push(`${type}.${field.key}`);
                    }
                }
            }
            expect(mismatches).toEqual([]);
        });

        test('every CONTROL_CONFIGS field key maps back to PASSTHROUGH_PROPS or is special', () => {
            const mismatches = [];
            for (const [type, fields] of Object.entries(CONTROL_CONFIGS)) {
                if (COMPOSITE_TYPES.includes(type)) continue;
                const passthroughKeys = PASSTHROUGH_PROPS[type] || [];
                for (const field of fields) {
                    if (SPECIAL_CONFIG_KEYS.includes(field.key)) continue;
                    if (field.key === 'placeholder' && !passthroughKeys.includes('placeholder')) continue;
                    if (!passthroughKeys.includes(field.key)) {
                        mismatches.push(`${type}.${field.key}`);
                    }
                }
            }
            expect(mismatches).toEqual([]);
        });
    });
});
