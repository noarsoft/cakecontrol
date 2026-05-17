import {
    FIELD_TYPES, createEmptySchema, addField, removeField,
    updateField, moveField, getFieldKeys, getFieldEntries, validateSchema
} from '../schema';

describe('schema.js', () => {
    describe('FIELD_TYPES', () => {
        test('has 44 types', () => {
            expect(FIELD_TYPES).toHaveLength(44);
        });

        test('each type has value, label, icon, enabled', () => {
            for (const ft of FIELD_TYPES) {
                expect(ft).toHaveProperty('value');
                expect(ft).toHaveProperty('label');
                expect(ft).toHaveProperty('icon');
                expect(ft).toHaveProperty('enabled');
            }
        });
    });

    describe('createEmptySchema', () => {
        test('returns schema with default name', () => {
            const result = createEmptySchema();
            expect(result.name).toBe('ฟอร์มใหม่');
            expect(result.json).toEqual({});
        });

        test('accepts custom name', () => {
            const result = createEmptySchema('Test');
            expect(result.name).toBe('Test');
        });
    });

    describe('addField', () => {
        test('adds a new field with default type', () => {
            const schema = {};
            const result = addField(schema, 'name');
            expect(result.name.type).toBe('string');
            expect(result.name._order).toBe(1);
        });

        test('adds field with custom type and options', () => {
            const schema = { existing: { type: 'string', _order: 1 } };
            const result = addField(schema, 'role', 'select', { enum: ['A', 'B'] });
            expect(result.role.type).toBe('select');
            expect(result.role.enum).toEqual(['A', 'B']);
            expect(result.existing.type).toBe('string');
        });

        test('does not mutate original', () => {
            const original = { a: { type: 'string' } };
            const result = addField(original, 'b', 'number');
            expect(original).not.toHaveProperty('b');
            expect(result).toHaveProperty('b');
        });
    });

    describe('removeField', () => {
        test('removes existing field', () => {
            const schema = { a: { type: 'string' }, b: { type: 'number' } };
            const result = removeField(schema, 'a');
            expect(result).toEqual({ b: { type: 'number' } });
        });

        test('does not mutate original', () => {
            const original = { a: { type: 'string' }, b: { type: 'number' } };
            removeField(original, 'a');
            expect(original).toHaveProperty('a');
        });

        test('returns copy when key not found', () => {
            const schema = { a: { type: 'string' } };
            const result = removeField(schema, 'nonexistent');
            expect(result).toEqual({ a: { type: 'string' } });
        });
    });

    describe('updateField', () => {
        test('updates field definition', () => {
            const schema = { name: { type: 'string' } };
            const result = updateField(schema, 'name', 'name', { type: 'email' });
            expect(result.name.type).toBe('email');
        });

        test('renames field key', () => {
            const schema = { old_name: { type: 'string' }, age: { type: 'number' } };
            const result = updateField(schema, 'old_name', 'new_name', { type: 'string' });
            expect(result).not.toHaveProperty('old_name');
            expect(result).toHaveProperty('new_name');
            expect(result.new_name.type).toBe('string');
        });

        test('preserves field order', () => {
            const schema = { a: { type: 'string' }, b: { type: 'number' }, c: { type: 'boolean' } };
            const result = updateField(schema, 'b', 'b_renamed', { type: 'number' });
            const keys = Object.keys(result);
            expect(keys).toEqual(['a', 'b_renamed', 'c']);
        });
    });

    describe('moveField', () => {
        const schema = {
            first: { type: 'string', _order: 1 },
            second: { type: 'number', _order: 2 },
            third: { type: 'boolean', _order: 3 },
        };

        test('moves field up', () => {
            const result = moveField(schema, 'second', 'up');
            const sorted = getFieldEntries(result).map(([k]) => k);
            expect(sorted).toEqual(['second', 'first', 'third']);
        });

        test('moves field down', () => {
            const result = moveField(schema, 'second', 'down');
            const sorted = getFieldEntries(result).map(([k]) => k);
            expect(sorted).toEqual(['first', 'third', 'second']);
        });

        test('does nothing when moving first up', () => {
            const result = moveField(schema, 'first', 'up');
            const sorted = getFieldEntries(result).map(([k]) => k);
            expect(sorted).toEqual(['first', 'second', 'third']);
        });

        test('does nothing when moving last down', () => {
            const result = moveField(schema, 'third', 'down');
            const sorted = getFieldEntries(result).map(([k]) => k);
            expect(sorted).toEqual(['first', 'second', 'third']);
        });

        test('does not mutate original', () => {
            const original = { a: { type: 'string', _order: 1 }, b: { type: 'number', _order: 2 } };
            moveField(original, 'b', 'up');
            expect(original.a._order).toBe(1);
            expect(original.b._order).toBe(2);
        });
    });

    describe('getFieldKeys / getFieldEntries', () => {
        test('returns keys', () => {
            expect(getFieldKeys({ a: {}, b: {} })).toEqual(['a', 'b']);
        });

        test('handles null', () => {
            expect(getFieldKeys(null)).toEqual([]);
            expect(getFieldEntries(null)).toEqual([]);
        });

        test('returns entries', () => {
            const schema = { name: { type: 'string' } };
            const entries = getFieldEntries(schema);
            expect(entries).toEqual([['name', { type: 'string' }]]);
        });
    });

    describe('validateSchema', () => {
        test('returns error for empty schema', () => {
            const errors = validateSchema({});
            expect(errors).toContain('ต้องมีอย่างน้อย 1 field');
        });

        test('returns no errors for valid schema', () => {
            const errors = validateSchema({
                name: { type: 'string', label: 'ชื่อ' },
                age: { type: 'number', label: 'อายุ' },
            });
            expect(errors).toHaveLength(0);
        });

        test('detects invalid type', () => {
            const errors = validateSchema({ x: { type: 'invalid_type', label: 'X' } });
            expect(errors.some(e => e.includes('ไม่ถูกต้อง'))).toBe(true);
        });

        test('detects missing label', () => {
            const errors = validateSchema({ name: { type: 'string' } });
            expect(errors.some(e => e.includes('Label'))).toBe(true);
        });

        test('detects select without enum', () => {
            const errors = validateSchema({ role: { type: 'select', label: 'สิทธิ์' } });
            expect(errors.some(e => e.includes('options'))).toBe(true);
        });

        test('select with enum is valid', () => {
            const errors = validateSchema({
                role: { type: 'select', label: 'สิทธิ์', enum: ['A', 'B'] },
            });
            expect(errors).toHaveLength(0);
        });
    });
});
