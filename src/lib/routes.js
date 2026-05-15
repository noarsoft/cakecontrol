const BASE = 'http://localhost:3000/api';

// ─── Frontend Routes ───
export const PAGES = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    FORM_BUILDER: '/formbuilder',
    FORM_FILLER: '/form/:schemaId',
    CONTROLS_DOCS: '/controls-docs',
};

// ─── API Endpoints ───
export const API = {
    BASE,
    HEALTH: `${BASE}/health`,

    // business
    BUSINESS: `${BASE}/business`,
    BUSINESS_ROOT: (rootid) => `${BASE}/business/root/${rootid}`,
    BUSINESS_LATEST: (rootid) => `${BASE}/business/root/${rootid}/latest`,

    // data_schema
    SCHEMA: `${BASE}/schema`,
    SCHEMA_BY_ID: (id) => `${BASE}/schema/${id}`,
    SCHEMA_BY_BUSINESS: (bizId) => `${BASE}/schema?business_id=${bizId}`,
    SCHEMA_ROOT: (rootid) => `${BASE}/schema/root/${rootid}`,
    SCHEMA_LATEST: (rootid) => `${BASE}/schema/root/${rootid}/latest`,

    // view
    VIEW: `${BASE}/view`,
    VIEW_BY_SCHEMA: (schemaId) => `${BASE}/view/schema/${schemaId}`,
    VIEW_ROOT: (rootid) => `${BASE}/view/root/${rootid}`,

    // form config
    FORM: `${BASE}/form`,
    FORM_BY_SCHEMA: (schemaId) => `${BASE}/form/schema/${schemaId}`,
    FORM_ROOT: (rootid) => `${BASE}/form/root/${rootid}`,

    // data (records)
    DATA: `${BASE}/data`,
    DATA_BY_SCHEMA: (schemaId) => `${BASE}/data/schema/${schemaId}`,
    DATA_BY_SCHEMA_ROOT: (schemaRootId) => `${BASE}/data/schema-root/${schemaRootId}`,
    DATA_ROOT: (rootid) => `${BASE}/data/root/${rootid}`,
    DATA_MIGRATE: (dataRootId) => `${BASE}/data/root/${dataRootId}/migrate-latest-schema`,
};
