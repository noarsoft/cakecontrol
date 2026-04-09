/**
 * benchmarkCalc.js
 * Pure functions คำนวณ estimated execution time
 * สำหรับเปรียบเทียบ PostgreSQL vs MongoDB
 * ข้อมูลอ้างอิงจาก research_mongo_vs_postgres.md
 */

// Reference data points (ms) จาก research
const REFERENCE = {
    insert: {
        postgres: { n: 1000, ms: 65 },   // ~50-80ms per 1000
        mongodb:  { n: 1000, ms: 45 },   // ~30-60ms per 1000
    },
    selectNoIndex: {
        postgres: { n: 1000, ms: 2 },    // ~1-3ms per 1000
        mongodb:  { n: 1000, ms: 2 },    // ~1-3ms per 1000
    },
    selectIndexed: {
        postgres: { n: 1000, ms: 0.3 },  // ~0.1-0.5ms
        mongodb:  { n: 1000, ms: 0.3 },  // ~0.1-0.5ms
    },
    update: {
        postgres: { n: 1000, ms: 0.35 }, // ~0.2-0.5ms
        mongodb:  { n: 1000, ms: 0.25 }, // ~0.1-0.4ms
    },
    delete: {
        postgres: { n: 1000, ms: 0.35 }, // ~0.2-0.5ms
        mongodb:  { n: 1000, ms: 0.25 }, // ~0.1-0.4ms
    },
};

// Index write overhead multipliers
const INDEX_OVERHEAD = {
    postgres: {
        btree: 0.15,    // ~10-20% slower
        hash: 0.10,     // less than B-Tree
        gin: 0.40,      // ~30-50% slower
    },
    mongodb: {
        single: 0.125,  // ~10-15% slower
        compound: 0.20,  // higher
        text: 0.50,      // ~50%+ slower
    },
};

/**
 * คำนวณ INSERT time สำหรับ N records
 * Big O: O(m * log n) per record เมื่อมี m indexes
 */
export function calcInsertTime(n, indexCount = 0) {
    const basePostgres = (n / REFERENCE.insert.postgres.n) * REFERENCE.insert.postgres.ms;
    const baseMongodb = (n / REFERENCE.insert.mongodb.n) * REFERENCE.insert.mongodb.ms;

    const overhead = indexCount * 0.15;
    return {
        postgres: basePostgres * (1 + overhead),
        mongodb: baseMongodb * (1 + overhead * 0.85),
        complexity: indexCount > 0 ? `O(N × ${indexCount} × log N)` : 'O(N)',
    };
}

/**
 * คำนวณ SELECT time — full scan (ไม่มี index)
 * Big O: O(n)
 */
export function calcSelectNoIndex(n) {
    const scale = n / REFERENCE.selectNoIndex.postgres.n;
    return {
        postgres: REFERENCE.selectNoIndex.postgres.ms * scale,
        mongodb: REFERENCE.selectNoIndex.mongodb.ms * scale * 1.3,
        complexity: 'O(N) full scan',
    };
}

/**
 * คำนวณ SELECT time — มี B-Tree index
 * Big O: O(log n + k)
 */
export function calcSelectIndexed(n, k = 1) {
    const logN = Math.log2(Math.max(n, 1));
    const base = 0.02;
    return {
        postgres: base * logN + k * 0.005,
        mongodb: base * logN + k * 0.006,
        complexity: `O(log N + K) = O(${logN.toFixed(1)} + ${k})`,
    };
}

/**
 * คำนวณ UPDATE time — by primary key
 * Big O: O(log n) + O(m * log n) สำหรับ index update
 */
export function calcUpdateTime(n, indexCount = 0) {
    const logN = Math.log2(Math.max(n, 1));
    const base = 0.025;
    const indexCost = indexCount * 0.02 * logN;
    return {
        postgres: base * logN + indexCost + 0.1,  // MVCC overhead
        mongodb: base * logN * 0.8 + indexCost,
        complexity: indexCount > 0 ? `O(log N + ${indexCount} × log N)` : 'O(log N)',
    };
}

/**
 * คำนวณ DELETE time — by primary key
 * Big O: O(log n) + O(m * log n)
 */
export function calcDeleteTime(n, indexCount = 0) {
    const logN = Math.log2(Math.max(n, 1));
    const base = 0.025;
    const indexCost = indexCount * 0.02 * logN;
    return {
        postgres: base * logN + indexCost + 0.08,
        mongodb: base * logN * 0.8 + indexCost,
        complexity: indexCount > 0 ? `O(log N + ${indexCount} × log N)` : 'O(log N)',
    };
}

/**
 * คำนวณ JSONB nested query
 * ไม่มี index: O(n), มี GIN: O(log n)
 */
export function calcJsonQuery(n, hasIndex = false) {
    if (hasIndex) {
        const logN = Math.log2(Math.max(n, 1));
        return {
            postgresGin: 0.03 * logN,
            postgresExpr: 0.02 * logN,
            mongodb: 0.02 * logN,
            complexity: 'O(log N) indexed',
        };
    }
    const scale = n / 10000;
    return {
        postgresGin: 14 * scale,
        postgresExpr: 14 * scale,
        mongodb: 10 * scale,
        complexity: 'O(N) full scan',
    };
}

/**
 * สร้างข้อมูล chart สำหรับหลาย N values
 */
export function generateChartData(nValues, k = 1, indexCount = 0) {
    return nValues.map(n => {
        const insert = calcInsertTime(n, indexCount);
        const selectNo = calcSelectNoIndex(n);
        const selectIdx = calcSelectIndexed(n, k);
        const update = calcUpdateTime(n, indexCount);
        const del = calcDeleteTime(n, indexCount);

        return {
            n,
            label: n >= 1000 ? `${(n / 1000).toFixed(0)}K` : `${n}`,
            insertPg: +insert.postgres.toFixed(2),
            insertMg: +insert.mongodb.toFixed(2),
            selectNoPg: +selectNo.postgres.toFixed(2),
            selectNoMg: +selectNo.mongodb.toFixed(2),
            selectIdxPg: +selectIdx.postgres.toFixed(3),
            selectIdxMg: +selectIdx.mongodb.toFixed(3),
            updatePg: +update.postgres.toFixed(3),
            updateMg: +update.mongodb.toFixed(3),
            deletePg: +del.postgres.toFixed(3),
            deleteMg: +del.mongodb.toFixed(3),
        };
    });
}

/**
 * สร้าง Big O comparison table
 */
export function getBigOTable(n, k, m) {
    const logN = Math.log2(Math.max(n, 1)).toFixed(1);
    return {
        noIndex: [
            { op: 'INSERT', postgres: 'O(1)', mongodb: 'O(1)' },
            { op: 'SELECT (filter)', postgres: `O(N) = O(${n})`, mongodb: `O(N) = O(${n})` },
            { op: 'UPDATE (by field)', postgres: `O(N)`, mongodb: `O(N)` },
            { op: 'DELETE (by field)', postgres: `O(N)`, mongodb: `O(N)` },
            { op: 'Sort', postgres: 'O(N log N)', mongodb: 'O(N log N)*' },
            { op: 'JOIN / $lookup', postgres: 'O(N+M) hash', mongodb: 'O(N×M) nested' },
        ],
        withIndex: [
            { op: 'SELECT (eq, indexed)', postgres: `O(log N) ≈ ${logN}`, mongodb: `O(log N) ≈ ${logN}` },
            { op: 'SELECT (range)', postgres: `O(log N + K) ≈ ${logN}+${k}`, mongodb: `O(log N + K) ≈ ${logN}+${k}` },
            { op: `INSERT (${m} indexes)`, postgres: `O(${m} × log N)`, mongodb: `O(${m} × log N)` },
            { op: 'UPDATE (by PK)', postgres: `O(log N + ${m}×log N)`, mongodb: `O(log N + ${m}×log N)` },
            { op: 'Hash index (eq)', postgres: 'O(1)', mongodb: '-' },
        ],
    };
}
