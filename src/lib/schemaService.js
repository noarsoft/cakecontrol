/**
 * schemaService.js — Unified service layer
 * ตรวจจับ backend availability แล้ว switch ระหว่าง API / localStorage mock
 *
 * ทุกฟังก์ชัน return Promise เพื่อ API compatibility
 * เมื่อใช้ mock จะ wrap ด้วย Promise.resolve()
 */
import * as mock from './mockSchemaService';

let useApi = false;
let apiModule = null;

/**
 * ตรวจว่า backend พร้อมใช้หรือไม่
 */
export async function initService() {
    try {
        const res = await fetch('http://localhost:3002/api/health', { signal: AbortSignal.timeout(1500) });
        if (res.ok) {
            apiModule = await import('./apiSchemaService');
            useApi = true;
            console.log('[SchemaService] Using API backend');
            return 'api';
        }
    } catch {
        // Backend not available
    }
    useApi = false;
    mock.seedDemoData();
    console.log('[SchemaService] Using localStorage mock');
    return 'mock';
}

function wrap(fn) {
    return (...args) => {
        if (useApi && apiModule) {
            return apiModule[fn.name](...args);
        }
        return Promise.resolve(fn(...args));
    };
}

// ─── Exported service functions (all return Promise) ───

export const getSchemas = wrap(mock.getSchemas);
export const getSchemaById = wrap(mock.getSchemaById);
export const createSchema = wrap(mock.createSchema);
export const updateSchema = wrap(mock.updateSchema);
export const deleteSchema = wrap(mock.deleteSchema);

export const getViewsBySchema = wrap(mock.getViewsBySchema);
export const createView = wrap(mock.createView);
export const updateView = wrap(mock.updateView);

export const getFormcfgsBySchema = wrap(mock.getFormcfgsBySchema);
export const createFormcfg = wrap(mock.createFormcfg);
export const updateFormcfg = wrap(mock.updateFormcfg);

export const getFormDataBySchema = wrap(mock.getFormDataBySchema);
export const createFormData = wrap(mock.createFormData);
export const updateFormData = wrap(mock.updateFormData);
export const deleteFormData = wrap(mock.deleteFormData);

export const seedDemoData = wrap(mock.seedDemoData);

export function isApiMode() {
    return useApi;
}
