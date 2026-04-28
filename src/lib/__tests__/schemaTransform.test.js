import {
    schemaToColumnsConfig, schemaToFormConfig, buildCrudConfig,
    generateDefaultView, generateDefaultFormcfg
} from '../schemaTransform';

describe('schemaTransform.js', () => {
    const sampleSchema = {
        name: { type: 'string', label: 'ชื่อ' },
        age: { type: 'number' },
        role: { type: 'select', enum: ['Admin', 'User'] },
        is_active: { type: 'boolean' },
        email: { type: 'email' },
    };

    describe('schemaToColumnsConfig', () => {
        test('auto-generates from schema when no viewJson', () => {
            const cols = schemaToColumnsConfig(sampleSchema);
            expect(cols).toHaveLength(5);
            expect(cols[0].key).toBe('name');
            expect(cols[0].header).toBe('name');
            expect(cols[0].sortable).toBe(true);
        });

        test('boolean field gets badge type', () => {
            const cols = schemaToColumnsConfig(sampleSchema);
            const boolCol = cols.find(c => c.key === 'is_active');
            expect(boolCol.type).toBe('badge');
        });

        test('uses viewJson columns when provided', () => {
            const viewJson = {
                columns: [
                    { key: 'name', header: 'Full Name', width: '200' },
                ],
            };
            const cols = schemaToColumnsConfig(sampleSchema, viewJson);
            expect(cols).toHaveLength(1);
            expect(cols[0].header).toBe('Full Name');
        });

        test('falls back to auto-generate when viewJson has empty columns', () => {
            const cols = schemaToColumnsConfig(sampleSchema, { columns: [] });
            expect(cols).toHaveLength(5);
        });
    });

    describe('schemaToFormConfig', () => {
        test('auto-generates controls from schema', () => {
            const config = schemaToFormConfig(sampleSchema);
            expect(config.colnumbers).toBe(6);
            expect(config.controls).toHaveLength(5);
        });

        test('maps field types to control types correctly', () => {
            const config = schemaToFormConfig(sampleSchema);
            const nameCtrl = config.controls.find(c => c.databind === 'name');
            const ageCtrl = config.controls.find(c => c.databind === 'age');
            const roleCtrl = config.controls.find(c => c.databind === 'role');
            const activeCtrl = config.controls.find(c => c.databind === 'is_active');
            const emailCtrl = config.controls.find(c => c.databind === 'email');

            expect(nameCtrl.type).toBe('textbox');
            expect(ageCtrl.type).toBe('number');
            expect(roleCtrl.type).toBe('select');
            expect(activeCtrl.type).toBe('toggle');
            expect(emailCtrl.type).toBe('textbox');
        });

        test('uses label from schema definition', () => {
            const config = schemaToFormConfig(sampleSchema);
            const nameCtrl = config.controls.find(c => c.databind === 'name');
            expect(nameCtrl.label).toBe('ชื่อ');
        });

        test('falls back to key as label', () => {
            const config = schemaToFormConfig(sampleSchema);
            const ageCtrl = config.controls.find(c => c.databind === 'age');
            expect(ageCtrl.label).toBe('age');
        });

        test('select field gets options', () => {
            const config = schemaToFormConfig(sampleSchema);
            const roleCtrl = config.controls.find(c => c.databind === 'role');
            expect(roleCtrl.options).toEqual([
                { label: 'Admin', value: 'Admin' },
                { label: 'User', value: 'User' },
            ]);
        });

        test('email field gets inputType', () => {
            const config = schemaToFormConfig(sampleSchema);
            const emailCtrl = config.controls.find(c => c.databind === 'email');
            expect(emailCtrl.inputType).toBe('email');
        });

        test('uses formcfgJson when provided', () => {
            const formcfgJson = {
                colnumbers: 4,
                controls: [
                    { key: 'name', label: 'Full Name', colno: 1, rowno: 1, colspan: 4 },
                ],
            };
            const config = schemaToFormConfig(sampleSchema, formcfgJson);
            expect(config.colnumbers).toBe(4);
            expect(config.controls).toHaveLength(1);
            expect(config.controls[0].label).toBe('Full Name');
        });
    });

    describe('buildCrudConfig', () => {
        test('returns complete CRUD config', () => {
            const data = [{ name: 'Test', age: 25 }];
            const config = buildCrudConfig({
                schemaJson: sampleSchema,
                data,
                keyField: 'name',
            });

            expect(config.data).toBe(data);
            expect(config.columns).toHaveLength(5);
            expect(config.keyField).toBe('name');
            expect(config.formConfig).toBeDefined();
            expect(config.formConfig.controls).toHaveLength(5);
            expect(config.searchFields).toEqual(['name', 'age', 'role', 'is_active', 'email']);
        });
    });

    describe('generateDefaultView', () => {
        test('generates columns from schema', () => {
            const view = generateDefaultView(sampleSchema);
            expect(view.columns).toHaveLength(5);
            expect(view.columns[0].key).toBe('name');
            expect(view.columns[0].sortable).toBe(true);
        });

        test('handles null schema', () => {
            const view = generateDefaultView(null);
            expect(view.columns).toEqual([]);
        });
    });

    describe('generateDefaultFormcfg', () => {
        test('generates controls from schema', () => {
            const cfg = generateDefaultFormcfg(sampleSchema);
            expect(cfg.colnumbers).toBe(6);
            expect(cfg.controls).toHaveLength(5);
            expect(cfg.controls[0].key).toBe('name');
            expect(cfg.controls[0].label).toBe('ชื่อ');
            expect(cfg.controls[0].rowno).toBe(1);
        });

        test('accepts custom colnumbers', () => {
            const cfg = generateDefaultFormcfg(sampleSchema, 4);
            expect(cfg.colnumbers).toBe(4);
            expect(cfg.controls[0].colspan).toBe(4);
        });
    });
});
