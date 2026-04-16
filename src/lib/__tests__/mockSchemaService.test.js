import {
    getSchemas, getSchemaById, createSchema, updateSchema, deleteSchema,
    getViewsBySchema, createView, updateView,
    getFormcfgsBySchema, createFormcfg, updateFormcfg,
    getFormDataBySchema, createFormData, updateFormData, deleteFormData,
    seedDemoData
} from '../mockSchemaService';

// In-memory localStorage mock — must replace BEFORE module loads
let store = {};
const localStorageMock = {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] ?? null,
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock, writable: true });

beforeEach(() => {
    store = {};
});

describe('mockSchemaService.js', () => {
    describe('data_schema CRUD', () => {
        test('getSchemas returns empty initially', () => {
            expect(getSchemas()).toEqual([]);
        });

        test('createSchema creates a schema', () => {
            const schema = createSchema('Test Schema', { name: { type: 'string' } });
            expect(schema.name).toBe('Test Schema');
            expect(schema.root_id).toBeDefined();
            expect(schema.id).toBe(1);
            expect(schema.activate).toBe(true);
            expect(schema.json).toEqual({ name: { type: 'string' } });
        });

        test('getSchemas returns created schemas', () => {
            createSchema('A', {});
            createSchema('B', {});
            const list = getSchemas();
            expect(list).toHaveLength(2);
        });

        test('getSchemaById finds by id', () => {
            const s = createSchema('Find Me', {});
            const found = getSchemaById(s.id);
            expect(found.name).toBe('Find Me');
        });

        test('updateSchema updates fields but protects id/root_id', () => {
            const s = createSchema('Original', {});
            const updated = updateSchema(s.id, { name: 'Updated', id: 999, root_id: 'hack' });
            expect(updated.name).toBe('Updated');
            expect(updated.id).toBe(s.id); // protected
            expect(updated.root_id).toBe(s.root_id); // protected
        });

        test('deleteSchema soft-deletes', () => {
            const s = createSchema('To Delete', {});
            expect(getSchemas()).toHaveLength(1);
            deleteSchema(s.id);
            expect(getSchemas()).toHaveLength(0); // filtered by activate
        });
    });

    describe('data_view CRUD', () => {
        test('createView + getViewsBySchema', () => {
            const schema = createSchema('S', {});
            createView(schema.id, 'table', { columns: [] }, 'My View');
            const views = getViewsBySchema(schema.id);
            expect(views).toHaveLength(1);
            expect(views[0].name).toBe('My View');
            expect(views[0].fk_data_schema).toBe(schema.id);
        });

        test('updateView protects id/root_id', () => {
            const schema = createSchema('S', {});
            const view = createView(schema.id, 'table', {}, '');
            const updated = updateView(view.id, { name: 'New Name', id: 999 });
            expect(updated.name).toBe('New Name');
            expect(updated.id).toBe(view.id);
        });
    });

    describe('data_formcfg CRUD', () => {
        test('createFormcfg + getFormcfgsBySchema', () => {
            const schema = createSchema('S', {});
            createFormcfg(schema.id, { colnumbers: 6, controls: [] }, 'Form Config');
            const cfgs = getFormcfgsBySchema(schema.id);
            expect(cfgs).toHaveLength(1);
            expect(cfgs[0].json.colnumbers).toBe(6);
        });

        test('updateFormcfg protects id/root_id', () => {
            const schema = createSchema('S', {});
            const cfg = createFormcfg(schema.id, {}, '');
            const updated = updateFormcfg(cfg.id, { name: 'Updated', root_id: 'hack' });
            expect(updated.name).toBe('Updated');
            expect(updated.root_id).toBe(cfg.root_id);
        });
    });

    describe('data_form CRUD', () => {
        test('createFormData + getFormDataBySchema', () => {
            const schema = createSchema('S', {});
            createFormData(schema.id, { name: 'John', age: 30 });
            createFormData(schema.id, { name: 'Jane', age: 25 });
            const data = getFormDataBySchema(schema.id);
            expect(data).toHaveLength(2);
            expect(data[0].data.name).toBe('John');
        });

        test('updateFormData updates data field', () => {
            const schema = createSchema('S', {});
            const record = createFormData(schema.id, { name: 'Old' });
            updateFormData(record.id, { name: 'New' });
            const data = getFormDataBySchema(schema.id);
            expect(data[0].data.name).toBe('New');
        });

        test('deleteFormData soft-deletes', () => {
            const schema = createSchema('S', {});
            const record = createFormData(schema.id, { x: 1 });
            expect(getFormDataBySchema(schema.id)).toHaveLength(1);
            deleteFormData(record.id);
            expect(getFormDataBySchema(schema.id)).toHaveLength(0);
        });
    });

    describe('seedDemoData', () => {
        test('seeds demo data when empty', () => {
            seedDemoData();
            const schemas = getSchemas();
            expect(schemas.length).toBeGreaterThanOrEqual(2);
        });

        test('does not re-seed when data exists', () => {
            createSchema('Existing', {});
            const countBefore = getSchemas().length;
            seedDemoData();
            const countAfter = getSchemas().length;
            expect(countAfter).toBe(countBefore);
        });
    });

    describe('auto-increment IDs', () => {
        test('IDs increment correctly', () => {
            const s1 = createSchema('First', {});
            const s2 = createSchema('Second', {});
            expect(s2.id).toBe(s1.id + 1);
        });
    });

    describe('date format', () => {
        test('modified_date_time follows yyyymmdd_hhmmss format', () => {
            const s = createSchema('Test', {});
            expect(s.modified_date_time).toMatch(/^\d{8}_\d{6}$/);
        });
    });
});
