/**
 * apiSchemaService.js — API-based CRUD for rootidx backend
 *
 * rootidx API conventions:
 * - Response: { ok: true, data: ... }
 * - Versioned objects use _rootid (not rootid)
 * - All JSON data stored in `payload` column
 * - Routes defined in routes.js
 */
import { API } from './routes';

async function request(url, options = {}) {
    const res = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error?.message || 'API Error');
    return json.data;
}

function mapBase(row) {
    if (!row) return row;
    return { ...row, rootid: row._rootid, modify_datetime: row._modify_datetime };
}

function mapSchemaRow(row) {
    if (!row) return row;
    return { ...mapBase(row), json: row.payload };
}

function mapBusinessRow(row) {
    return mapBase(row);
}

function mapViewRow(row) {
    if (!row) return row;
    return { ...mapBase(row), json_table_config: row.payload };
}

function mapFormcfgRow(row) {
    if (!row) return row;
    return { ...mapBase(row), json_form_config: row.payload };
}

function mapDataRow(row) {
    if (!row) return row;
    return { ...mapBase(row), data: row.payload };
}

// ─── business ───

export async function getBusinesses() {
    const rows = await request(API.BUSINESS);
    return rows.map(mapBusinessRow);
}

export async function getBusinessById(rootid) {
    const row = await request(API.BUSINESS_LATEST(rootid));
    return mapBusinessRow(row);
}

export async function createBusiness(name, icon = null) {
    const row = await request(API.BUSINESS, {
        method: 'POST',
        body: JSON.stringify({ name, icon }),
    });
    return mapBusinessRow(row);
}

export async function updateBusiness(rootid, updates) {
    const row = await request(API.BUSINESS_ROOT(rootid), {
        method: 'PATCH',
        body: JSON.stringify(updates),
    });
    return mapBusinessRow(row);
}

export async function deleteBusiness(rootid) {
    const row = await request(API.BUSINESS_ROOT(rootid), { method: 'DELETE' });
    return mapBusinessRow(row);
}

// ─── data_schema ───

export async function getSchemas(businessId = null) {
    const url = businessId ? API.SCHEMA_BY_BUSINESS(businessId) : API.SCHEMA;
    const rows = await request(url);
    return rows.map(mapSchemaRow);
}

export async function getSchemaById(rootid) {
    const row = await request(API.SCHEMA_LATEST(rootid));
    return mapSchemaRow(row);
}

export async function createSchema(name, json = {}, business_id = null) {
    const row = await request(API.SCHEMA, {
        method: 'POST',
        body: JSON.stringify({
            name,
            payload: json,
            business_id: business_id ? Number(business_id) : null,
        }),
    });
    return mapSchemaRow(row);
}

export async function updateSchema(rootid, updates) {
    const body = {};
    if (updates.name !== undefined) body.name = updates.name;
    if (updates.json !== undefined) body.payload = updates.json;
    if (updates.payload !== undefined) body.payload = updates.payload;

    const row = await request(API.SCHEMA_ROOT(rootid), {
        method: 'PATCH',
        body: JSON.stringify(body),
    });
    return mapSchemaRow(row);
}

export async function deleteSchema(rootid) {
    const row = await request(API.SCHEMA_ROOT(rootid), { method: 'DELETE' });
    return mapSchemaRow(row);
}

// ─── view ───

export async function getViewsBySchema(schemaId) {
    const rows = await request(API.VIEW_BY_SCHEMA(schemaId));
    return rows.map(mapViewRow);
}

export async function createView(schemaId, viewType, json_table_config, name = '') {
    const row = await request(API.VIEW, {
        method: 'POST',
        body: JSON.stringify({
            data_schema_id: schemaId,
            payload: json_table_config,
            name,
        }),
    });
    return mapViewRow(row);
}

export async function updateView(rootid, updates) {
    const body = {};
    if (updates.json_table_config !== undefined) body.payload = updates.json_table_config;
    if (updates.payload !== undefined) body.payload = updates.payload;
    if (updates.name !== undefined) body.name = updates.name;

    const row = await request(API.VIEW_ROOT(rootid), {
        method: 'PATCH',
        body: JSON.stringify(body),
    });
    return mapViewRow(row);
}

// ─── form (config) ───

export async function getFormcfgsBySchema(schemaId) {
    const rows = await request(API.FORM_BY_SCHEMA(schemaId));
    return rows.map(mapFormcfgRow);
}

export async function createFormcfg(schemaId, json_form_config, name = '') {
    const row = await request(API.FORM, {
        method: 'POST',
        body: JSON.stringify({
            data_schema_id: schemaId,
            payload: json_form_config,
            name,
        }),
    });
    return mapFormcfgRow(row);
}

export async function updateFormcfg(rootid, updates) {
    const body = {};
    if (updates.json_form_config !== undefined) body.payload = updates.json_form_config;
    if (updates.payload !== undefined) body.payload = updates.payload;
    if (updates.name !== undefined) body.name = updates.name;

    const row = await request(API.FORM_ROOT(rootid), {
        method: 'PATCH',
        body: JSON.stringify(body),
    });
    return mapFormcfgRow(row);
}

// ─── data ───

export async function getFormDataBySchema(schemaId) {
    const rows = await request(API.DATA_BY_SCHEMA(schemaId));
    return rows.map(mapDataRow);
}

export async function getFormDataBySchemaFamily(schemaRootId) {
    const rows = await request(API.DATA_BY_SCHEMA_ROOT(schemaRootId));
    return rows.map(mapDataRow);
}

export async function migrateFormData(dataRootId, force = true) {
    const row = await request(API.DATA_MIGRATE(dataRootId), {
        method: 'POST',
        body: JSON.stringify({ force }),
    });
    return mapDataRow(row);
}

export async function getSchemaVersionById(id) {
    const row = await request(API.SCHEMA_BY_ID(id));
    return mapSchemaRow(row);
}

export async function getSchemaHistory(rootid) {
    const rows = await request(API.SCHEMA_HISTORY(rootid));
    return rows.map(mapSchemaRow).sort((a, b) => (b._doc_version || 0) - (a._doc_version || 0));
}

export async function restoreSchemaVersion(id) {
    const row = await request(API.SCHEMA_RESTORE(id), { method: 'POST' });
    return mapSchemaRow(row);
}

export async function createFormData(schemaId, data) {
    const row = await request(API.DATA, {
        method: 'POST',
        body: JSON.stringify({ data_schema_id: schemaId, payload: data }),
    });
    return mapDataRow(row);
}

export async function updateFormData(rootid, data) {
    const row = await request(API.DATA_ROOT(rootid), {
        method: 'PATCH',
        body: JSON.stringify({ payload: data }),
    });
    return mapDataRow(row);
}

export async function deleteFormData(rootid) {
    const row = await request(API.DATA_ROOT(rootid), { method: 'DELETE' });
    return mapDataRow(row);
}

export async function getDataHistory(rootid) {
    const rows = await request(API.DATA_HISTORY(rootid));
    return rows.map(mapDataRow).sort((a, b) => (b._doc_version || 0) - (a._doc_version || 0));
}

export async function getDataById(id) {
    const row = await request(API.DATA_BY_ID(id));
    return mapDataRow(row);
}

export async function restoreDataVersion(id) {
    const row = await request(API.DATA_RESTORE(id), { method: 'POST' });
    return mapDataRow(row);
}

export async function seedDemoData() {
    // rootidx handles its own seeding
}
