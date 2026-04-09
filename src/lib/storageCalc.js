/**
 * storageCalc.js — Storage analysis + estimation functions
 * วัดพื้นที่จริงจาก localStorage + ประมาณ PG/Mongo storage
 */

const STORAGE_KEYS = {
    schemas: 'cakecontrol_schemas',
    views: 'cakecontrol_views',
    formcfgs: 'cakecontrol_formcfgs',
    forms: 'cakecontrol_forms',
};

const TABLE_LABELS = {
    schemas: 'data_schema',
    views: 'data_view',
    formcfgs: 'data_formcfg',
    forms: 'data_form',
};

// ─── Live localStorage Analysis ───

/**
 * วัดพื้นที่ localStorage จริงทั้ง 4 tables
 */
export function measureLocalStorage() {
    const results = {};
    let totalBytes = 0;

    for (const [key, storageKey] of Object.entries(STORAGE_KEYS)) {
        const raw = localStorage.getItem(storageKey) || '[]';
        const bytes = new Blob([raw]).size;
        let records = [];
        try { records = JSON.parse(raw); } catch { /* empty */ }

        const recordSizes = records.map(r => new Blob([JSON.stringify(r)]).size);
        const avg = recordSizes.length > 0
            ? recordSizes.reduce((a, b) => a + b, 0) / recordSizes.length
            : 0;
        const min = recordSizes.length > 0 ? Math.min(...recordSizes) : 0;
        const max = recordSizes.length > 0 ? Math.max(...recordSizes) : 0;

        results[key] = {
            label: TABLE_LABELS[key],
            bytes,
            count: records.length,
            avgRecordBytes: Math.round(avg),
            minRecordBytes: min,
            maxRecordBytes: max,
            records,
        };
        totalBytes += bytes;
    }

    // Estimate total localStorage usage (all keys)
    let allStorageBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        const v = localStorage.getItem(k);
        allStorageBytes += new Blob([k + v]).size;
    }

    return {
        tables: results,
        totalProjectBytes: totalBytes,
        totalAllBytes: allStorageBytes,
        limitBytes: 5 * 1024 * 1024, // ~5MB typical limit
        usagePercent: +((allStorageBytes / (5 * 1024 * 1024)) * 100).toFixed(2),
    };
}

/**
 * วิเคราะห์ field sizes ของ data_form records สำหรับ schema ที่เลือก
 */
export function analyzeFieldSizes(formRecords) {
    if (!formRecords || formRecords.length === 0) return [];

    const fieldTotals = {};
    const fieldCounts = {};

    for (const record of formRecords) {
        const data = record.data || record;
        for (const [key, value] of Object.entries(data)) {
            const size = new Blob([JSON.stringify(value)]).size;
            fieldTotals[key] = (fieldTotals[key] || 0) + size;
            fieldCounts[key] = (fieldCounts[key] || 0) + 1;
        }
    }

    return Object.entries(fieldTotals)
        .map(([key, total]) => ({
            key,
            totalBytes: total,
            avgBytes: Math.round(total / (fieldCounts[key] || 1)),
            count: fieldCounts[key] || 0,
        }))
        .sort((a, b) => b.totalBytes - a.totalBytes);
}

// ─── PostgreSQL Size Estimation ───

// PostgreSQL row overhead: 23 bytes header + 4 bytes item pointer
const PG_ROW_OVERHEAD = 27;
// Page size: 8KB, fill factor default 100%
const PG_PAGE_SIZE = 8192;
// TOAST threshold: values > 2KB get compressed/out-of-line
const PG_TOAST_THRESHOLD = 2048;

/**
 * ประมาณ PostgreSQL storage สำหรับ N records
 */
export function estimatePostgresSize(n, avgRecordBytes, indexCount = 1) {
    // Column sizes (fixed per row)
    const fixedCols = {
        root_id: 16,        // UUID
        id: 4,              // SERIAL (int4)
        previous_id: 4,     // INT nullable
        flag: 12,           // VARCHAR avg
        activate: 1,        // BOOLEAN
        modified_date_time: 15, // VARCHAR(15)
        fk_data_schema: 4,  // INT (for child tables)
    };
    const fixedSize = Object.values(fixedCols).reduce((a, b) => a + b, 0); // ~56 bytes

    // JSONB column: avgRecordBytes + 4 bytes JSONB header
    const jsonbSize = avgRecordBytes + 4;

    // Row total
    const rowSize = PG_ROW_OVERHEAD + fixedSize + jsonbSize;

    // Rows per page (with alignment)
    const rowsPerPage = Math.floor(PG_PAGE_SIZE / (rowSize + 4)); // +4 for line pointer
    const dataPages = Math.ceil(n / Math.max(rowsPerPage, 1));
    const dataBytes = dataPages * PG_PAGE_SIZE;

    // TOAST storage for large JSONB values
    const toastBytes = jsonbSize > PG_TOAST_THRESHOLD
        ? Math.ceil(n * jsonbSize * 0.7) // ~30% compression
        : 0;

    // B-Tree index: ~3x key size per entry, ~70% fill factor
    const btreeEntrySize = 16 + 8; // key + pointer
    const indexBytes = indexCount * Math.ceil((n * btreeEntrySize) / 0.7);

    // GIN index on JSONB: ~2-3x the JSONB data
    const ginBytes = Math.ceil(n * avgRecordBytes * 0.4); // keys only, compressed

    const totalBytes = dataBytes + toastBytes + indexBytes + ginBytes;

    return {
        dataBytes,
        toastBytes,
        indexBytes,
        ginBytes,
        totalBytes,
        rowSize,
        rowsPerPage,
    };
}

// ─── MongoDB Size Estimation ───

// MongoDB document overhead: _id (12) + BSON overhead (~20 bytes)
const MONGO_DOC_OVERHEAD = 32;
// WiredTiger compression ratio: ~50-70%
const MONGO_COMPRESSION = 0.6;

/**
 * ประมาณ MongoDB storage สำหรับ N records
 */
export function estimateMongoSize(n, avgRecordBytes, indexCount = 1) {
    // Document size (BSON)
    const bsonSize = MONGO_DOC_OVERHEAD + avgRecordBytes * 1.1; // BSON ~10% larger than JSON

    // Data uncompressed
    const rawDataBytes = n * bsonSize;
    // WiredTiger compressed
    const dataBytes = Math.ceil(rawDataBytes * MONGO_COMPRESSION);

    // _id index (always present): B-Tree on ObjectId (12 bytes)
    const idIndexBytes = Math.ceil(n * 28 / 0.7); // key + pointer + fill factor

    // Additional indexes
    const additionalIndexBytes = indexCount * Math.ceil(n * 24 / 0.7);

    const totalBytes = dataBytes + idIndexBytes + additionalIndexBytes;

    return {
        dataBytes,
        rawDataBytes,
        idIndexBytes,
        additionalIndexBytes,
        totalBytes,
        bsonSize,
        compressionRatio: MONGO_COMPRESSION,
    };
}

/**
 * สร้างข้อมูล growth projection
 */
export function projectGrowth(currentCount, avgRecordBytes, months = 12, growthPerMonth = 100) {
    const projections = [];
    for (let m = 0; m <= months; m++) {
        const n = currentCount + (growthPerMonth * m);
        const pg = estimatePostgresSize(n, avgRecordBytes, 2);
        const mongo = estimateMongoSize(n, avgRecordBytes, 2);
        projections.push({
            month: m,
            label: m === 0 ? 'ตอนนี้' : `${m} เดือน`,
            records: n,
            pgBytes: pg.totalBytes,
            mongoBytes: mongo.totalBytes,
            localBytes: n * (avgRecordBytes + 100), // localStorage overhead
        });
    }
    return projections;
}

/**
 * Format bytes เป็น human readable
 */
export function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 2 : 0)} ${units[i]}`;
}
