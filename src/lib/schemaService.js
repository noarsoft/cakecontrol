import * as mock from './mockSchemaService';

let strategy = mock;
let isMock = true;

export async function initService() {
    try {
        const res = await fetch('http://localhost:3002/api/health', { signal: AbortSignal.timeout(1500) });
        if (res.ok) {
            strategy = await import('./apiSchemaService');
            isMock = false;
            return 'api';
        }
    } catch (err) {
        // Backend not available
    }
    strategy = mock;
    isMock = true;
    mock.seedDemoData();
    return 'mock';
}

const promisify = (fn) => (...args) => Promise.resolve(fn(...args));

const delegate = (name) => (...args) => {
    const fn = strategy[name];
    if (!fn) {
        console.error(`Service method ${name} not found in current strategy`);
        return Promise.reject(new Error(`Method ${name} not implemented`));
    }
    return isMock ? promisify(fn)(...args) : fn(...args);
};

// ─── business ───
export const getBusinesses = delegate('getBusinesses');
export const getBusinessById = delegate('getBusinessById');
export const createBusiness = delegate('createBusiness');
export const updateBusiness = delegate('updateBusiness');
export const deleteBusiness = delegate('deleteBusiness');

// ─── data_schema ───
export const getSchemas = delegate('getSchemas');
export const getSchemaById = delegate('getSchemaById');
export const createSchema = delegate('createSchema');
export const updateSchema = delegate('updateSchema');
export const deleteSchema = delegate('deleteSchema');

// ─── view ───
export const getViewsBySchema = delegate('getViewsBySchema');
export const createView = delegate('createView');
export const updateView = delegate('updateView');

// ─── form (config) ───
export const getFormcfgsBySchema = delegate('getFormcfgsBySchema');
export const createFormcfg = delegate('createFormcfg');
export const updateFormcfg = delegate('updateFormcfg');

// ─── data (ข้อมูลจริง) ───
export const getFormDataBySchema = delegate('getFormDataBySchema');
export const createFormData = delegate('createFormData');
export const updateFormData = delegate('updateFormData');
export const deleteFormData = delegate('deleteFormData');

export const seedDemoData = delegate('seedDemoData');
