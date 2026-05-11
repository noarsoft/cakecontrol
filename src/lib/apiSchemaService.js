/**
 * apiSchemaService.js — API-based CRUD สำหรับ 4 tables
 * ใช้แทน mockSchemaService เมื่อมี backend
 */
const BASE = 'http://localhost:3002/api';

async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'API Error');
    return json.data;
}

// ─── business ───

export async function getBusinesses() {
    return request('/businessx');
}

export async function getBusinessById(rootid) {
    return request(`/businessx/${rootid}`);
}

export async function createBusiness(name, icon = null) {
    return request('/businessx', {
        method: 'POST',
        body: JSON.stringify({ name, icon }),
    });
}

export async function updateBusiness(rootid, updates) {
    return request(`/businessx/${rootid}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

export async function deleteBusiness(rootid) {
    return request(`/businessx/${rootid}`, { method: 'DELETE' });
}

// ─── data_schema ───

export async function getSchemas(businessId = null) {
    const url = businessId ? `/schemax?business_id=${businessId}` : '/schemax';
    return request(url);
}

export async function getSchemaById(rootid) {
    return request(`/schemax/${rootid}`);
}

export async function createSchema(name, json = {}, business_id = null) {
    return request('/schemax', {
        method: 'POST',
        body: JSON.stringify({ name, json, business_id: business_id ? Number(business_id) : null }),
    });
}

export async function updateSchema(rootid, updates) {
    return request(`/schemax/${rootid}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

export async function deleteSchema(rootid) {
    return request(`/schemax/${rootid}`, { method: 'DELETE' });
}

// ─── view ───

export async function getViewsBySchema(schemaId) {
    return request(`/viewx?data_schema_id=${schemaId}`);
}

export async function createView(schemaId, viewType, json_table_config, name = '') {
    return request('/viewx', {
        method: 'POST',
        body: JSON.stringify({ data_schema_id: schemaId, view_type: viewType, json_table_config, name }),
    });
}

export async function updateView(rootid, updates) {
    return request(`/viewx/${rootid}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

// ─── form (config) ───

export async function getFormcfgsBySchema(schemaId) {
    return request(`/formcfgx?data_id=${schemaId}`);
}

export async function createFormcfg(schemaId, json_form_config, name = '') {
    return request('/formcfgx', {
        method: 'POST',
        body: JSON.stringify({ data_id: schemaId, json_form_config, name }),
    });
}

export async function updateFormcfg(rootid, updates) {
    return request(`/formcfgx/${rootid}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

// ─── data (ข้อมูลจริง) ───

export async function getFormDataBySchema(schemaId) {
    return request(`/formx?data_schema_id=${schemaId}`);
}

export async function createFormData(schemaId, data) {
    return request('/formx', {
        method: 'POST',
        body: JSON.stringify({ data_schema_id: schemaId, data }),
    });
}

export async function updateFormData(rootid, data) {
    return request(`/formx/${rootid}`, {
        method: 'PUT',
        body: JSON.stringify({ data }),
    });
}

export async function deleteFormData(rootid) {
    return request(`/formx/${rootid}`, { method: 'DELETE' });
}

export async function seedDemoData() {
    // Server handles its own seeding
}
