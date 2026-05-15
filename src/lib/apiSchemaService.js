/**
 * apiSchemaService.js — API-based CRUD for rootidx backend
 *
 * rootidx API conventions:
 * - Response: { ok: true, data: ... }
 * - Versioned objects use _rootid (not rootid)
 * - All JSON data stored in `payload` column
 * - Routes: /business, /schema, /view, /form, /data
 * - Get latest: GET /root/:rootid/latest
 * - Update: PATCH /root/:rootid
 * - Delete: DELETE /root/:rootid
 */
const BASE = 'http://localhost:3000/api';

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
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
    const rows = await request('/business');
    return rows.map(mapBusinessRow);
}

export async function getBusinessById(rootid) {
    const row = await request(`/business/root/${rootid}/latest`);
    return mapBusinessRow(row);
}

export async function createBusiness(name, icon = null) {
    const row = await request('/business', {
        method: 'POST',
        body: JSON.stringify({ name, icon }),
    });
    return mapBusinessRow(row);
}

export async function updateBusiness(rootid, updates) {
    const row = await request(`/business/root/${rootid}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
    });
    return mapBusinessRow(row);
}

export async function deleteBusiness(rootid) {
    const row = await request(`/business/root/${rootid}`, { method: 'DELETE' });
    return mapBusinessRow(row);
}

// ─── data_schema ───

export async function getSchemas(businessId = null) {
    const url = businessId ? `/schema?business_id=${businessId}` : '/schema';
    const rows = await request(url);
    return rows.map(mapSchemaRow);
}

export async function getSchemaById(rootid) {
    const row = await request(`/schema/root/${rootid}/latest`);
    return mapSchemaRow(row);
}

export async function createSchema(name, json = {}, business_id = null) {
    const row = await request('/schema', {
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

    const row = await request(`/schema/root/${rootid}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
    });
    return mapSchemaRow(row);
}

export async function deleteSchema(rootid) {
    const row = await request(`/schema/root/${rootid}`, { method: 'DELETE' });
    return mapSchemaRow(row);
}

// ─── view ───

export async function getViewsBySchema(schemaId) {
    const rows = await request(`/view/schema/${schemaId}`);
    return rows.map(mapViewRow);
}

export async function createView(schemaId, viewType, json_table_config, name = '') {
    const row = await request('/view', {
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

    const row = await request(`/view/root/${rootid}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
    });
    return mapViewRow(row);
}

// ─── form (config) ───

export async function getFormcfgsBySchema(schemaId) {
    const rows = await request(`/form/schema/${schemaId}`);
    return rows.map(mapFormcfgRow);
}

export async function createFormcfg(schemaId, json_form_config, name = '') {
    const row = await request('/form', {
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

    const row = await request(`/form/root/${rootid}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
    });
    return mapFormcfgRow(row);
}

// ─── data ───

export async function getFormDataBySchema(schemaId) {
    const rows = await request(`/data/schema/${schemaId}`);
    return rows.map(mapDataRow);
}

export async function getFormDataBySchemaFamily(schemaRootId) {
    const rows = await request(`/data/schema-root/${schemaRootId}`);
    return rows.map(mapDataRow);
}

export async function migrateFormData(dataRootId, force = true) {
    const row = await request(`/data/root/${dataRootId}/migrate-latest-schema`, {
        method: 'POST',
        body: JSON.stringify({ force }),
    });
    return mapDataRow(row);
}

export async function getSchemaVersionById(id) {
    const row = await request(`/schema/${id}`);
    return mapSchemaRow(row);
}

export async function createFormData(schemaId, data) {
    const row = await request('/data', {
        method: 'POST',
        body: JSON.stringify({ data_schema_id: schemaId, payload: data }),
    });
    return mapDataRow(row);
}

export async function updateFormData(rootid, data) {
    const row = await request(`/data/root/${rootid}`, {
        method: 'PATCH',
        body: JSON.stringify({ payload: data }),
    });
    return mapDataRow(row);
}

export async function deleteFormData(rootid) {
    const row = await request(`/data/root/${rootid}`, { method: 'DELETE' });
    return mapDataRow(row);
}

export async function seedDemoData() {
    // rootidx handles its own seeding
}
