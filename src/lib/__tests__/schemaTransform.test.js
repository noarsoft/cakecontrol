import {
    schemaToColumnsConfig, schemaToFormConfig, buildCrudConfig,
    generateDefaultView, generateDefaultFormcfg,
    getFieldProps, PASSTHROUGH_PROPS
} from '../schemaTransform';

describe('schemaTransform.js', () => {
    const sampleSchema = {
        name: { type: 'string', label: 'ชื่อ', _order: 1 },
        age: { type: 'number', _order: 2 },
        role: { type: 'select', enum: ['Admin', 'User'], _order: 3 },
        is_active: { type: 'boolean', _order: 4 },
        email: { type: 'email', _order: 5 },
    };

    describe('schemaToColumnsConfig', () => {
        test('auto-generates from schema when no viewJson', () => {
            const cols = schemaToColumnsConfig(sampleSchema);
            expect(cols).toHaveLength(5);
            expect(cols[0].key).toBe('name');
            expect(cols[0].header).toBe('ชื่อ');
            expect(cols[0].sortable).toBe(true);
        });

        test('boolean field gets custom type with render', () => {
            const cols = schemaToColumnsConfig(sampleSchema);
            const boolCol = cols.find(c => c.key === 'is_active');
            expect(boolCol.type).toBe('custom');
            expect(boolCol.controlProps.render).toBeDefined();
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
            expect(activeCtrl.type).toBe('checkbox');
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

    describe('getFieldProps', () => {
        test('returns {} for unknown field type', () => {
            expect(getFieldProps('unknown_type', { foo: 'bar' })).toEqual({});
        });

        test('returns {} when field definition has no passthrough keys', () => {
            expect(getFieldProps('string', {})).toEqual({});
        });

        test('extracts only matching props for string type', () => {
            const result = getFieldProps('string', { placeholder: 'Enter name', maxLength: 100, unrelated: true });
            expect(result).toEqual({ placeholder: 'Enter name', maxLength: 100 });
            expect(result).not.toHaveProperty('unrelated');
        });

        test('preserves falsy values (false, 0, empty string)', () => {
            const result = getFieldProps('string', { placeholder: '', maxLength: 0, disabled: false });
            expect(result).toEqual({ placeholder: '', maxLength: 0, disabled: false });
        });

        test('extracts props for password type', () => {
            expect(getFieldProps('password', { placeholder: 'Enter password', showStrength: true, minLength: 8 }))
                .toEqual({ placeholder: 'Enter password', showStrength: true, minLength: 8 });
        });

        test('extracts props for email type', () => {
            expect(getFieldProps('email', { placeholder: 'name@example.com', unrelated: 'x' }))
                .toEqual({ placeholder: 'name@example.com' });
        });

        test('extracts props for searchbox type', () => {
            expect(getFieldProps('searchbox', { placeholder: 'Search...', multiple: true, allowCreate: false }))
                .toEqual({ placeholder: 'Search...', multiple: true, allowCreate: false });
        });

        test('extracts props for multipleupload type', () => {
            expect(getFieldProps('multipleupload', { placeholder: 'Drop files', allowedTypes: 'image/*', maxFileSize: 10485760 }))
                .toEqual({ placeholder: 'Drop files', allowedTypes: 'image/*', maxFileSize: 10485760 });
        });

        test('extracts updated slider props', () => {
            const result = getFieldProps('slider', { min: 0, max: 100, step: 5, unit: '%', showValue: true, showTicks: true, color: '#3b82f6' });
            expect(result).toEqual({ min: 0, max: 100, step: 5, unit: '%', showValue: true, showTicks: true, color: '#3b82f6' });
        });

        test('extracts updated image props', () => {
            const result = getFieldProps('image', { width: '200px', height: '120px', alt: 'Test', lazy: true, enlargeable: true, grayscale: false, fallback: '/ph.png' });
            expect(result).toEqual({ width: '200px', height: '120px', alt: 'Test', lazy: true, enlargeable: true, grayscale: false, fallback: '/ph.png' });
        });

        test('extracts updated label props', () => {
            expect(getFieldProps('label', { value: 'Hello', bold: true, italic: false, fontSize: '18px', multiline: true }))
                .toEqual({ value: 'Hello', bold: true, italic: false, fontSize: '18px', multiline: true });
        });

        test('extracts updated link props', () => {
            const result = getFieldProps('link', { value: 'Click', href: '#', target: '_blank', icon: '🔗', iconPosition: 'left', underline: true, buttonStyle: false, disabled: false });
            expect(result).toEqual({ value: 'Click', href: '#', target: '_blank', icon: '🔗', iconPosition: 'left', underline: true, buttonStyle: false, disabled: false });
        });

        test('extracts updated badge props', () => {
            expect(getFieldProps('badge', { value: 'New', backgroundColor: '#3b82f6', color: '#fff' }))
                .toEqual({ value: 'New', backgroundColor: '#3b82f6', color: '#fff' });
        });

        test('extracts updated icon props', () => {
            expect(getFieldProps('icon', { value: '⭐', fontSize: '24px', color: '#ffc107', size: 'large' }))
                .toEqual({ value: '⭐', fontSize: '24px', color: '#ffc107', size: 'large' });
        });

        test('extracts updated qrcode props', () => {
            expect(getFieldProps('qrcode', { value: 'https://x.com', width: 200, height: 200, errorCorrectionLevel: 'H', margin: 2, color: '#000' }))
                .toEqual({ value: 'https://x.com', width: 200, height: 200, errorCorrectionLevel: 'H', margin: 2, color: '#000' });
        });

        test('extracts updated date props', () => {
            expect(getFieldProps('date', { placeholder: 'dd/mm/yyyy', min: '2024-01-01', max: '2026-12-31', disabled: false, readOnly: false }))
                .toEqual({ placeholder: 'dd/mm/yyyy', min: '2024-01-01', max: '2026-12-31', disabled: false, readOnly: false });
        });

        test('extracts updated datepicker props', () => {
            expect(getFieldProps('datepicker', { placeholder: 'Pick', minDate: '2024-01-01', maxDate: '2026-12-31', disabled: true }))
                .toEqual({ placeholder: 'Pick', minDate: '2024-01-01', maxDate: '2026-12-31', disabled: true });
        });

        test('extracts updated buttongroup props', () => {
            expect(getFieldProps('buttongroup', { orientation: 'vertical', multiple: true, disabled: false }))
                .toEqual({ orientation: 'vertical', multiple: true, disabled: false });
        });

        test('extracts updated calendargrid props', () => {
            expect(getFieldProps('calendargrid', { editable: true }))
                .toEqual({ editable: true });
        });

        test('extracts updated pagination props', () => {
            expect(getFieldProps('pagination', { maxButtons: 7, showPageInfo: true, showItemInfo: true }))
                .toEqual({ maxButtons: 7, showPageInfo: true, showItemInfo: true });
        });

        test('extracts updated button props', () => {
            expect(getFieldProps('button', { value: 'Submit', disabled: true }))
                .toEqual({ value: 'Submit', disabled: true });
        });

        test('extracts rating props', () => {
            expect(getFieldProps('rating', { maxStars: 5, allowHalf: true, color: '#ffc107', size: 'large', showLabel: true }))
                .toEqual({ maxStars: 5, allowHalf: true, color: '#ffc107', size: 'large', showLabel: true });
        });
    });

    describe('schemaToFormConfig — passthrough props', () => {
        test('password field gets passthrough props in auto-generate', () => {
            const schema = { pw: { type: 'password', label: 'Password', showStrength: true, minLength: 8, _order: 1 } };
            const config = schemaToFormConfig(schema);
            const ctrl = config.controls.find(c => c.databind === 'pw');
            expect(ctrl.showStrength).toBe(true);
            expect(ctrl.minLength).toBe(8);
        });

        test('email field gets passthrough props + inputType in auto-generate', () => {
            const schema = { mail: { type: 'email', label: 'Email', placeholder: 'name@example.com', _order: 1 } };
            const config = schemaToFormConfig(schema);
            const ctrl = config.controls.find(c => c.databind === 'mail');
            expect(ctrl.inputType).toBe('email');
            expect(ctrl.placeholder).toBe('name@example.com');
        });

        test('searchbox field gets passthrough props in auto-generate', () => {
            const schema = { search: { type: 'searchbox', label: 'Search', multiple: true, allowCreate: true, _order: 1 } };
            const config = schemaToFormConfig(schema);
            const ctrl = config.controls.find(c => c.databind === 'search');
            expect(ctrl.multiple).toBe(true);
            expect(ctrl.allowCreate).toBe(true);
        });

        test('multipleupload field gets passthrough props in auto-generate', () => {
            const schema = { files: { type: 'multipleupload', label: 'Files', allowedTypes: 'image/*', maxFileSize: 10485760, _order: 1 } };
            const config = schemaToFormConfig(schema);
            const ctrl = config.controls.find(c => c.databind === 'files');
            expect(ctrl.allowedTypes).toBe('image/*');
            expect(ctrl.maxFileSize).toBe(10485760);
        });

        test('slider field gets updated passthrough props via formcfgJson', () => {
            const schema = { vol: { type: 'slider', label: 'Volume', min: 0, max: 100, unit: '%', showValue: true, _order: 1 } };
            const formcfg = { colnumbers: 6, controls: [{ key: 'vol', label: 'Volume', colno: 1, rowno: 1, colspan: 6 }] };
            const config = schemaToFormConfig(schema, formcfg);
            const ctrl = config.controls.find(c => c.databind === 'vol');
            expect(ctrl.unit).toBe('%');
            expect(ctrl.showValue).toBe(true);
        });

        test('does not leak non-passthrough schema keys into control output', () => {
            const schema = { name: { type: 'string', label: 'Name', _order: 1, customMeta: 'should_not_appear' } };
            const config = schemaToFormConfig(schema);
            const ctrl = config.controls.find(c => c.databind === 'name');
            expect(ctrl).not.toHaveProperty('customMeta');
            expect(ctrl).not.toHaveProperty('_order');
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
