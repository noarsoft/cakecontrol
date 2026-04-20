/**
 * Inspect DB — ใส่ข้อมูลทดสอบแล้วโชว์ใน PG + Mongo จริงๆ
 * ไม่ลบข้อมูลหลังรัน เพื่อให้เช็คได้ด้วย psql / mongosh
 *
 * usage: node src/benchmark/inspectDb.js [n]
 */
import 'dotenv/config';
import pg from 'pg';
import { MongoClient } from 'mongodb';

const { Pool } = pg;
const N = parseInt(process.argv[2] || '20');

const pgPool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432'),
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || '1234',
    database: process.env.PG_DATABASE || 'cakecontrol_bench',
});

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const mongoDbName = process.env.MONGO_DB || 'cakecontrol_bench';

function randomStr(len) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let s = '';
    for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
}

function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

function generateRecords(n) {
    const col1Pool = Array.from({ length: 5 }, () => randomStr(8));
    const categoryPool = Array.from({ length: 5 }, () => randomStr(3));
    const tagPool = Array.from({ length: 10 }, () => randomStr(5));

    const records = [];
    for (let i = 0; i < n; i++) {
        records.push({
            column1: col1Pool[randomInt(0, 4)],
            column2: randomInt(18, 77),
            column3: randomStr(randomInt(6, 10)),
            column4: Math.round(Math.random() * 10000) / 100,
            column5: {
                tags: [tagPool[randomInt(0, 9)]],
                category: categoryPool[randomInt(0, 4)],
                meta: { seq: i },
            },
        });
    }
    return records;
}

async function ensurePgDb() {
    const tempPool = new Pool({
        host: process.env.PG_HOST || 'localhost',
        port: parseInt(process.env.PG_PORT || '5432'),
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || '1234',
        database: 'postgres',
    });
    try {
        const dbName = process.env.PG_DATABASE || 'cakecontrol_bench';
        const check = await tempPool.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]
        );
        if (check.rows.length === 0) {
            await tempPool.query(`CREATE DATABASE ${dbName}`);
        }
    } finally {
        await tempPool.end();
    }
}

async function inspectPostgres(records) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  PostgreSQL');
    console.log('═══════════════════════════════════════════════════════════');

    const verRes = await pgPool.query(`SELECT version()`);
    console.log(`Version: ${verRes.rows[0].version.split(',')[0]}`);

    const curDb = await pgPool.query(`SELECT current_database() as db, current_user as usr`);
    console.log(`Database: ${curDb.rows[0].db}`);
    console.log(`Connected as: ${curDb.rows[0].usr}`);
    console.log(`Host: ${process.env.PG_HOST || 'localhost'}:${process.env.PG_PORT || 5432}`);

    // Drop + create
    await pgPool.query(`DROP TABLE IF EXISTS bench_inspect`);
    await pgPool.query(`
        CREATE TABLE bench_inspect (
            id SERIAL PRIMARY KEY,
            column1 VARCHAR(50),
            column2 INTEGER,
            column3 VARCHAR(100),
            column4 NUMERIC(7,2),
            column5 JSONB
        )
    `);

    // Insert
    const values = [];
    const params = [];
    let idx = 1;
    for (const r of records) {
        values.push(`($${idx},$${idx + 1},$${idx + 2},$${idx + 3},$${idx + 4})`);
        params.push(r.column1, r.column2, r.column3, r.column4, JSON.stringify(r.column5));
        idx += 5;
    }
    await pgPool.query(
        `INSERT INTO bench_inspect (column1, column2, column3, column4, column5) VALUES ${values.join(',')}`,
        params
    );

    // Create indexes
    await pgPool.query(`CREATE INDEX idx_insp_col1 ON bench_inspect (column1)`);
    await pgPool.query(`CREATE INDEX idx_insp_gin ON bench_inspect USING GIN (column5)`);
    await pgPool.query(`CREATE INDEX idx_insp_expr ON bench_inspect ((column5->>'category'))`);

    // Show row count + size
    const cnt = await pgPool.query(`SELECT COUNT(*) FROM bench_inspect`);
    const sz = await pgPool.query(`
        SELECT pg_size_pretty(pg_total_relation_size('bench_inspect')) as total_size,
               pg_size_pretty(pg_relation_size('bench_inspect')) as table_size,
               pg_size_pretty(pg_indexes_size('bench_inspect')) as index_size
    `);
    console.log(`\nTable: bench_inspect`);
    console.log(`Rows: ${cnt.rows[0].count}`);
    console.log(`Total size: ${sz.rows[0].total_size} (table: ${sz.rows[0].table_size}, indexes: ${sz.rows[0].index_size})`);

    // Show indexes
    const idxs = await pgPool.query(`
        SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'bench_inspect'
    `);
    console.log('\nIndexes:');
    idxs.rows.forEach(r => console.log(`  - ${r.indexname}: ${r.indexdef}`));

    // Show sample rows
    const sample = await pgPool.query(`SELECT * FROM bench_inspect ORDER BY id LIMIT 5`);
    console.log('\nSample rows (first 5):');
    sample.rows.forEach(r => {
        console.log(`  id=${r.id} | col1=${r.column1} | col2=${r.column2} | col3=${r.column3} | col4=${r.column4} | col5=${JSON.stringify(r.column5)}`);
    });

    // Demo query with EXPLAIN — use first column1 value so query finds matches
    const firstCol1 = sample.rows[0]?.column1;
    console.log(`\nDemo query: SELECT * WHERE column1 = '${firstCol1}' LIMIT 3`);
    const explain = await pgPool.query(
        `EXPLAIN (ANALYZE, FORMAT TEXT) SELECT * FROM bench_inspect WHERE column1 = $1 LIMIT 3`,
        [firstCol1]
    );
    explain.rows.forEach(r => console.log(`  ${r['QUERY PLAN']}`));

    console.log('\n✔ PG data kept — เช็คด้วย psql ได้:');
    console.log(`  PGPASSWORD=1234 psql -U postgres -d cakecontrol_bench -c "SELECT * FROM bench_inspect LIMIT 10;"`);
}

async function inspectMongo(records) {
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  MongoDB');
    console.log('═══════════════════════════════════════════════════════════');

    const client = new MongoClient(mongoUrl);
    try {
        await client.connect();
        const info = await client.db('admin').command({ buildInfo: 1 });
        console.log(`Version: ${info.version}`);
        console.log(`URL: ${mongoUrl}`);
        console.log(`Database: ${mongoDbName}`);

        const db = client.db(mongoDbName);
        const col = db.collection('bench_inspect');

        await col.drop().catch(() => {});
        await col.insertMany(records.map((r, i) => ({ ...r, _seqId: i + 1 })));

        await col.createIndex({ column1: 1 });
        await col.createIndex({ 'column5.category': 1 });

        const stats = await db.command({ collStats: 'bench_inspect' });
        const cnt = await col.countDocuments();
        console.log(`\nCollection: bench_inspect`);
        console.log(`Documents: ${cnt}`);
        console.log(`Storage size: ${stats.storageSize} bytes (${(stats.storageSize / 1024).toFixed(1)} KB)`);
        console.log(`Index total: ${stats.totalIndexSize} bytes`);

        const idxs = await col.indexes();
        console.log('\nIndexes:');
        idxs.forEach(i => console.log(`  - ${i.name}: ${JSON.stringify(i.key)}`));

        const sample = await col.find({}).limit(5).toArray();
        console.log('\nSample documents (first 5):');
        sample.forEach(d => {
            console.log(`  _id=${d._id} | seq=${d._seqId} | col1=${d.column1} | col2=${d.column2} | col3=${d.column3} | col5=${JSON.stringify(d.column5)}`);
        });

        const firstCol1 = sample[0]?.column1;
        console.log(`\nDemo query: find({ column1: '${firstCol1}' }).limit(3)`);
        const queryResult = await col.find({ column1: firstCol1 }).limit(3).toArray();
        queryResult.forEach(d => {
            console.log(`  seq=${d._seqId} | col1=${d.column1} | col2=${d.column2}`);
        });

        const explain = await col.find({ column1: firstCol1 }).limit(3).explain('executionStats');
        console.log(`\nExecution plan: ${explain.queryPlanner?.winningPlan?.inputStage?.stage || explain.queryPlanner?.winningPlan?.stage}`);
        console.log(`  keysExamined: ${explain.executionStats?.totalKeysExamined}, docsExamined: ${explain.executionStats?.totalDocsExamined}`);

        console.log('\n✔ Mongo data kept — เช็คด้วย mongosh หรือ driver ได้:');
        console.log(`  use cakecontrol_bench; db.bench_inspect.find().limit(10)`);
    } finally {
        await client.close();
    }
}

async function main() {
    await ensurePgDb();
    const records = generateRecords(N);
    console.log(`\n🔍 Inserting ${N} test records into both databases...\n`);
    await inspectPostgres(records);
    await inspectMongo(records);
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('Done — ข้อมูลยังอยู่ทั้ง 2 DBs ลองไปเช็คดูได้');
    console.log('═══════════════════════════════════════════════════════════');
    await pgPool.end();
    process.exit(0);
}

main().catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
