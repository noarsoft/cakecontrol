/**
 * benchmarkService.js
 * รัน benchmark จริงบน PostgreSQL + MongoDB
 * - ตารางหลัก: bench_test (K columns VARCHAR)
 * - ตาราง JSONB: bench_json (JSONB เพียวๆ)
 *
 * Parameters:
 *   N = จำนวน rows
 *   K = จำนวน columns (1-50)
 *   M = percent ของ K columns ที่มี index (0-100)
 *   LIMIT = hardcode 10 rows สำหรับ SELECT
 */
import pg from 'pg';
import { MongoClient } from 'mongodb';
import { performance } from 'node:perf_hooks';

const { Pool } = pg;
const SELECT_LIMIT = 10;

const pgPool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432'),
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || '1234',
    database: process.env.PG_DATABASE || 'cakecontrol_bench',
});

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const mongoDbName = process.env.MONGO_DB || 'cakecontrol_bench';

// ─── Random helpers ───
function randomStr(len) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let s = '';
    for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
}

function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

// ─── Pick `count` random distinct numbers from [1, k] ───
function pickRandomColumns(k, count) {
    const nums = Array.from({ length: k }, (_, i) => i + 1);
    // Fisher-Yates shuffle
    for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    return nums.slice(0, count).sort((a, b) => a - b);
}

// ─── Find a column that is NOT in the indexed list ───
function findUnindexedCol(k, indexedCols) {
    const set = new Set(indexedCols);
    for (let i = 1; i <= k; i++) {
        if (!set.has(i)) return i;
    }
    return k; // all indexed — fallback
}

// ─── Generate K-column records ───
//   queryColIndex column uses a pool of 5 values so SELECT can find matches
function generateRecords(n, k, queryColIndex) {
    const pool = Array.from({ length: 5 }, () => randomStr(8));

    const records = [];
    for (let i = 0; i < n; i++) {
        const row = {};
        for (let j = 1; j <= k; j++) {
            if (j === queryColIndex) {
                row[`column${j}`] = pool[randomInt(0, 4)];
            } else {
                row[`column${j}`] = randomStr(8);
            }
        }
        records.push(row);
    }

    return { records, queryVal: pool[0] };
}

// ─── Generate JSONB records ───
function generateJsonRecords(n) {
    const categoryPool = Array.from({ length: 5 }, () => randomStr(3));
    const tagPool = Array.from({ length: 10 }, () => randomStr(5));

    const records = [];
    for (let i = 0; i < n; i++) {
        records.push({
            data: {
                category: categoryPool[randomInt(0, 4)],
                tags: [tagPool[randomInt(0, 9)]],
                meta: { seq: i },
            },
        });
    }

    return { records, queryCategory: categoryPool[0] };
}

async function measureMs(fn) {
    const start = performance.now();
    await fn();
    return +(performance.now() - start).toFixed(3);
}

async function ensurePgDatabase() {
    const tempPool = new Pool({
        host: process.env.PG_HOST || 'localhost',
        port: parseInt(process.env.PG_PORT || '5432'),
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || '1234',
        database: 'postgres',
    });
    try {
        const dbName = process.env.PG_DATABASE || 'cakecontrol_bench';
        const check = await tempPool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        if (check.rows.length === 0) {
            await tempPool.query(`CREATE DATABASE ${dbName}`);
        }
    } finally {
        await tempPool.end();
    }
}

// ══════════════════════════════════
//  PostgreSQL Benchmark — K columns
// ══════════════════════════════════
async function benchmarkPostgres(records, k, indexedCols, queryCol, queryVal) {
    const results = {};

    // DROP + CREATE
    await pgPool.query(`DROP TABLE IF EXISTS bench_test`);
    const cols = Array.from({ length: k }, (_, i) => `column${i + 1} VARCHAR(50)`).join(', ');
    await pgPool.query(`CREATE TABLE bench_test (id SERIAL PRIMARY KEY, ${cols})`);

    // INSERT
    const colNames = Array.from({ length: k }, (_, i) => `column${i + 1}`).join(', ');
    results.insert = await measureMs(async () => {
        const chunkSize = Math.max(1, Math.floor(500 / k));
        for (let i = 0; i < records.length; i += chunkSize) {
            const chunk = records.slice(i, i + chunkSize);
            const chunkValues = [];
            const chunkParams = [];
            let ci = 1;
            for (const r of chunk) {
                const placeholders = [];
                for (let j = 1; j <= k; j++) {
                    placeholders.push(`$${ci++}`);
                    chunkParams.push(r[`column${j}`]);
                }
                chunkValues.push(`(${placeholders.join(',')})`);
            }
            await pgPool.query(
                `INSERT INTO bench_test (${colNames}) VALUES ${chunkValues.join(',')}`,
                chunkParams
            );
        }
    });

    // CREATE INDEXES on the randomly-selected columns
    for (const colIdx of indexedCols) {
        await pgPool.query(`CREATE INDEX idx_bench_col${colIdx} ON bench_test (column${colIdx})`);
    }

    // SELECT full scan — pick a column that is NOT indexed
    // ถ้าทุก column ถูก index, fall back ไป column k
    const unindexedCol = findUnindexedCol(k, indexedCols);
    results.selectNoIndex = await measureMs(async () => {
        await pgPool.query(`SELECT * FROM bench_test WHERE column${unindexedCol} LIKE 'a%'`);
    });

    // SELECT indexed — query the first indexed column (ถ้าไม่มี index เลยก็ full scan)
    results.selectIndexed = await measureMs(async () => {
        await pgPool.query(`SELECT * FROM bench_test WHERE column${queryCol} = $1 LIMIT $2`, [queryVal, SELECT_LIMIT]);
    });

    // UPDATE (by PK)
    results.update = await measureMs(async () => {
        const mid = Math.floor(records.length / 2);
        await pgPool.query(`UPDATE bench_test SET column${queryCol} = 'updated' WHERE id = $1`, [mid]);
    });

    // DELETE (by PK)
    results.delete = await measureMs(async () => {
        await pgPool.query(`DELETE FROM bench_test WHERE id = $1`, [records.length]);
    });

    await pgPool.query(`DROP TABLE IF EXISTS bench_test`);
    return results;
}

// ══════════════════════════════════
//  PostgreSQL JSONB Benchmark — 3-way comparison
// ══════════════════════════════════
async function benchmarkPostgresJson(records, queryCategory) {
    const results = {};

    await pgPool.query(`DROP TABLE IF EXISTS bench_json`);
    await pgPool.query(`CREATE TABLE bench_json (id SERIAL PRIMARY KEY, data JSONB)`);

    // INSERT
    const chunkSize = 500;
    for (let i = 0; i < records.length; i += chunkSize) {
        const chunk = records.slice(i, i + chunkSize);
        const values = [];
        const params = [];
        let ci = 1;
        for (const r of chunk) {
            values.push(`($${ci++})`);
            params.push(JSON.stringify(r.data));
        }
        await pgPool.query(`INSERT INTO bench_json (data) VALUES ${values.join(',')}`, params);
    }

    // Indexes: GIN + Expression B-Tree
    await pgPool.query(`CREATE INDEX idx_json_gin ON bench_json USING GIN (data)`);
    await pgPool.query(`CREATE INDEX idx_json_expr ON bench_json ((data->>'category'))`);

    // JSONB GIN query
    results.selectJsonGin = await measureMs(async () => {
        await pgPool.query(
            `SELECT * FROM bench_json WHERE data @> $1::jsonb LIMIT $2`,
            [JSON.stringify({ category: queryCategory }), SELECT_LIMIT]
        );
    });

    // JSONB Expression B-Tree query
    results.selectJsonBtree = await measureMs(async () => {
        await pgPool.query(
            `SELECT * FROM bench_json WHERE data->>'category' = $1 LIMIT $2`,
            [queryCategory, SELECT_LIMIT]
        );
    });

    await pgPool.query(`DROP TABLE IF EXISTS bench_json`);
    return results;
}

// ══════════════════════════════════
//  MongoDB Benchmark — K columns
// ══════════════════════════════════
async function benchmarkMongo(records, k, indexedCols, queryCol, queryVal) {
    const results = {};
    const client = new MongoClient(mongoUrl);

    try {
        await client.connect();
        const db = client.db(mongoDbName);
        const col = db.collection('bench_test');

        await col.drop().catch(() => {});

        // INSERT
        results.insert = await measureMs(async () => {
            await col.insertMany(records.map((r, i) => ({ ...r, _seqId: i + 1 })));
        });

        // CREATE INDEXES on the same random columns
        for (const colIdx of indexedCols) {
            await col.createIndex({ [`column${colIdx}`]: 1 });
        }

        // SELECT full scan — column that is NOT indexed
        const unindexedCol = findUnindexedCol(k, indexedCols);
        results.selectNoIndex = await measureMs(async () => {
            await col.find({ [`column${unindexedCol}`]: { $regex: '^a' } }).toArray();
        });

        // SELECT indexed — same queryCol as PG
        results.selectIndexed = await measureMs(async () => {
            await col.find({ [`column${queryCol}`]: queryVal }).limit(SELECT_LIMIT).toArray();
        });

        // UPDATE (by _seqId)
        results.update = await measureMs(async () => {
            const mid = Math.floor(records.length / 2);
            await col.updateOne({ _seqId: mid }, { $set: { [`column${queryCol}`]: 'updated' } });
        });

        // DELETE (by _seqId)
        results.delete = await measureMs(async () => {
            await col.deleteOne({ _seqId: records.length });
        });

        await col.drop().catch(() => {});
    } finally {
        await client.close();
    }

    return results;
}

// ══════════════════════════════════
//  MongoDB JSONB Benchmark
// ══════════════════════════════════
async function benchmarkMongoJson(records, queryCategory) {
    const results = {};
    const client = new MongoClient(mongoUrl);

    try {
        await client.connect();
        const db = client.db(mongoDbName);
        const col = db.collection('bench_json');

        await col.drop().catch(() => {});
        await col.insertMany(records.map((r, i) => ({ ...r, _seqId: i + 1 })));
        await col.createIndex({ 'data.category': 1 });

        results.selectJsonMongo = await measureMs(async () => {
            await col.find({ 'data.category': queryCategory }).limit(SELECT_LIMIT).toArray();
        });

        await col.drop().catch(() => {});
    } finally {
        await client.close();
    }

    return results;
}

// ══════════════════════════════════
//  Public API
// ══════════════════════════════════

/**
 * @param {number} n - จำนวน rows
 * @param {number} k - จำนวน columns (1-50)
 * @param {number} m - percent ของ columns ที่มี index (0-100)
 * @param {number} runs - จำนวนรอบ
 */
export async function runBenchmark(n = 1000, k = 5, m = 40, runs = 1) {
    await ensurePgDatabase();

    const allPg = [];
    const allMg = [];
    const allIndexedCols = [];

    for (let run = 0; run < runs; run++) {
        // ─── Pick random columns to index (SAME for PG + Mongo in this run) ───
        const numIndexes = Math.round(k * m / 100);
        const indexedCols = pickRandomColumns(k, numIndexes);
        const queryCol = indexedCols[0] ?? 1;  // first indexed col (or col1 if M=0%)

        // Generate records — queryCol uses pool for predictable SELECT match
        const { records, queryVal } = generateRecords(n, k, queryCol);

        const pgMain = await benchmarkPostgres(records, k, indexedCols, queryCol, queryVal);
        const mgMain = await benchmarkMongo(records, k, indexedCols, queryCol, queryVal);

        // JSONB table (separate)
        const { records: jsonRecords, queryCategory } = generateJsonRecords(n);
        const pgJson = await benchmarkPostgresJson(jsonRecords, queryCategory);
        const mgJson = await benchmarkMongoJson(jsonRecords, queryCategory);

        allPg.push({ ...pgMain, ...pgJson });
        allMg.push({ ...mgMain, ...mgJson });
        allIndexedCols.push(indexedCols);
    }

    return {
        postgres: averageResults(allPg),
        mongodb: averageResults(allMg),
        meta: {
            n,
            k,
            m,
            numIndexes: Math.round(k * m / 100),
            indexedColumns: allIndexedCols[0],  // from first run (other runs = same pattern)
            indexedColumnsAllRuns: allIndexedCols,
            runs,
            selectLimit: SELECT_LIMIT,
            timestamp: new Date().toISOString(),
            pgVersion: await getPgVersion(),
            mongoVersion: await getMongoVersion(),
        },
    };
}

export async function checkStatus() {
    const status = { postgres: false, mongodb: false };

    try {
        await ensurePgDatabase();
        const res = await pgPool.query('SELECT version()');
        status.postgres = true;
        status.pgVersion = res.rows[0].version;
    } catch (e) {
        status.pgError = e.message;
    }

    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
        const info = await client.db('admin').command({ buildInfo: 1 });
        status.mongodb = true;
        status.mongoVersion = info.version;
        await client.close();
    } catch (e) {
        status.mongoError = e.message;
    }

    return status;
}

function averageResults(resultArr) {
    if (resultArr.length === 1) return resultArr[0];
    const keys = Object.keys(resultArr[0]);
    const avg = {};
    for (const key of keys) {
        avg[key] = +(resultArr.reduce((sum, r) => sum + (r[key] ?? 0), 0) / resultArr.length).toFixed(3);
    }
    return avg;
}

async function getPgVersion() {
    try {
        const res = await pgPool.query('SHOW server_version');
        return res.rows[0].server_version;
    } catch { return 'unknown'; }
}

async function getMongoVersion() {
    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
        const info = await client.db('admin').command({ buildInfo: 1 });
        await client.close();
        return info.version;
    } catch { return 'unknown'; }
}
