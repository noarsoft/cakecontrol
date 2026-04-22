import * as mock from './mockSchemaService';

let useApi = false;
let strategy = mock;

export async function initService() {
    try {
        const res = await fetch('http://localhost:3002/api/health', { signal: AbortSignal.timeout(1500) });
        if (res.ok) {
            strategy = await import('./apiSchemaService');
            useApi = true;
            return 'api';
        }
    } catch {
        // Backend not available
    }
    useApi = false;
    strategy = mock;
    mock.seedDemoData();
    return 'mock';
}

const promisify = (fn) => (...args) => Promise.resolve(fn(...args));
const delegate = (name) => (...args) => {
    const fn = strategy[name];
    return useApi ? fn(...args) : promisify(fn)(...args);
};

export const getSchemas = delegate('getSchemas');
export const getSchemaById = delegate('getSchemaById');
export const createSchema = delegate('createSchema');
export const updateSchema = delegate('updateSchema');
export const deleteSchema = delegate('deleteSchema');

export const getViewsBySchema = delegate('getViewsBySchema');
export const createView = delegate('createView');
export const updateView = delegate('updateView');

export const getFormcfgsBySchema = delegate('getFormcfgsBySchema');
export const createFormcfg = delegate('createFormcfg');
export const updateFormcfg = delegate('updateFormcfg');

export const getFormDataBySchema = delegate('getFormDataBySchema');
export const createFormData = delegate('createFormData');
export const updateFormData = delegate('updateFormData');
export const deleteFormData = delegate('deleteFormData');

export const seedDemoData = delegate('seedDemoData');

export function isApiMode() {
    return useApi;
}
