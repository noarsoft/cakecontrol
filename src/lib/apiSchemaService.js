/**
 * apiSchemaService.js — API-based CRUD สำหรับ 4 tables
 * ใช้แทน mockSchemaService เมื่อมี backend
 * API signatures เหมือน mockSchemaService เพื่อ swap ง่าย
 */
import { getApiUrl } from '../config/api.config';

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

// ─── data_schema ───

export async function getSchemas() {
    return request('/schemas');
}

export async function getSchemaById(id) {
    return request(`/schemas/${id}`);
}

export async function createSchema(name, json = {}) {
    return request('/schemas', {
        method: 'POST',
        body: JSON.stringify({ name, json }),
    });
}

export async function updateSchema(id, updates) {
    return request(`/schemas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

export async function deleteSchema(id) {
    return request(`/schemas/${id}`, { method: 'DELETE' });
}

// ─── data_view ───

export async function getViewsBySchema(schemaId) {
    return request(`/views?schemaId=${schemaId}`);
}

export async function createView(schemaId, viewType, json, name = '') {
    return request('/views', {
        method: 'POST',
        body: JSON.stringify({ schemaId, viewType, json, name }),
    });
}

export async function updateView(id, updates) {
    return request(`/views/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

// ─── data_formcfg ───

export async function getFormcfgsBySchema(schemaId) {
    return request(`/formcfgs?schemaId=${schemaId}`);
}

export async function createFormcfg(schemaId, json, name = '') {
    return request('/formcfgs', {
        method: 'POST',
        body: JSON.stringify({ schemaId, json, name }),
    });
}

export async function updateFormcfg(id, updates) {
    return request(`/formcfgs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

// ─── data_form ───

export async function getFormDataBySchema(schemaId) {
    return request(`/forms?schemaId=${schemaId}`);
}

export async function createFormData(schemaId, data) {
    return request('/forms', {
        method: 'POST',
        body: JSON.stringify({ schemaId, data }),
    });
}

export async function updateFormData(id, data) {
    return request(`/forms/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ data }),
    });
}

export async function deleteFormData(id) {
    return request(`/forms/${id}`, { method: 'DELETE' });
}

// No-op for API mode (seed is done on server side)
export async function seedDemoData() {
    // Server handles its own seeding
}
