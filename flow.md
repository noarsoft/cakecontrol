# DB Benchmark — Flow ทำงานทั้งหมด (Real Benchmark)

## ภาพรวม

**Benchmark จริง** — ยิง query ลง PostgreSQL + MongoDB ของจริง วัดเวลาด้วย `performance.now()` แล้ว return เป็น JSON ให้ FE แสดงเป็น chart

```
FE (BenchmarkPage.jsx)
    │  fetch POST /api/benchmark/run  { n, k, m, runs }
    ▼
Express @ :3003 (benchmarkServer.js)
    │
    ├─ routes/benchmark.js     — validate input
    └─ benchmark/benchmarkService.js
         ├─ ensurePgDatabase()       — สร้าง DB ถ้ายังไม่มี
         ├─ generateRecords()        — สุ่มข้อมูล
         ├─ benchmarkPostgres()      — ยิง PG จริง
         ├─ benchmarkMongo()         — ยิง Mongo จริง
         ├─ benchmarkPostgresJson()  — JSONB GIN + B-Tree
         ├─ benchmarkMongoJson()     — dotted path
         └─ averageResults()         — เฉลี่ยหลาย runs
    ▼
{ postgres: {...ms}, mongodb: {...ms}, meta: {...} }
```

**ไฟล์ที่เกี่ยวข้อง**
- FE: `src/components/controls_doc/pages/BenchmarkPage.jsx`
- BE: `server/src/benchmarkServer.js` (standalone Express @ port 3003)
- BE: `server/src/routes/benchmark.js` (POST /run, GET /status)
- BE: `server/src/benchmark/benchmarkService.js` (core logic)
- BE: `server/src/benchmark/inspectDb.js` (utility)

## 1. Input Parameters

| ตัวแปร | ความหมาย | ช่วง | default |
|--------|----------|------|---------|
| **N** | จำนวน rows ที่ insert | 100 – 1,000,000 | 1,000 |
| **K** | จำนวน **columns** ใน table | 1 – 50 | 5 |
| **M** | **เปอร์เซ็นต์** ของ K ที่จะสร้าง index | 0 – 100 | 40 |
| `runs` | รัน benchmark กี่รอบแล้วเฉลี่ย | 1 – 5 | 1 |
| `SELECT_LIMIT` | hardcode ใน service | — | 10 |

**สำคัญ**: `numIndexes = round(K × M / 100)` เช่น K=10, M=40 → index 4 columns

## 2. Data Generation — `generateRecords(n, k, queryColIndex)`

**จุดที่เจนข้อมูลทีละ row × column**:

```js
// Pool 5 values สำหรับ queryColIndex — ให้ SELECT เจอค่า
const pool = Array.from({ length: 5 }, () => randomStr(8));

for (let i = 0; i < n; i++) {
  const row = {};
  for (let j = 1; j <= k; j++) {
    if (j === queryColIndex) {
      row[`column${j}`] = pool[randomInt(0, 4)];   // ← จากพูล 5 ค่า
    } else {
      row[`column${j}`] = randomStr(8);            // ← สุ่ม 8 ตัวอักษร
    }
  }
  records.push(row);
}
return { records, queryVal: pool[0] };
```

**Output schema** (1 row):
```js
{ column1: 'aB3xK9z2', column2: 'P8fq...', ..., columnK: '...' }
```

- `queryColIndex` คือ column ที่จะ SELECT หา → ใส่ค่าจาก pool 5 ค่า (ไม่งั้นสุ่มเกือบเจอยาก)
- column อื่นๆ สุ่มล้วน
- `queryVal = pool[0]` → FE ใช้ค่านี้ในการ query

## 3. Random Index Selection — `pickRandomColumns(k, count)`

ใช้ **Fisher-Yates shuffle** สุ่มเลือก column ไหนจะมี index:

```js
const nums = [1, 2, ..., k];
for (let i = nums.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [nums[i], nums[j]] = [nums[j], nums[i]];
}
return nums.slice(0, count).sort((a, b) => a - b);
```

**ตัวอย่าง**: K=10, M=40 → `numIndexes=4` → เลือก `[2, 5, 7, 9]` (random แต่ sort แล้ว)

**`queryCol`** = `indexedCols[0]` (column แรกที่มี index) → ใช้เป็น target ของ SELECT indexed
**`unindexedCol`** = column ที่ไม่มี index → ใช้ SELECT full scan

## 4. PostgreSQL Benchmark — `benchmarkPostgres()`

### 4.1 Setup
```sql
DROP TABLE IF EXISTS bench_test;
CREATE TABLE bench_test (
  id SERIAL PRIMARY KEY,
  column1 VARCHAR(50), column2 VARCHAR(50), ..., columnK VARCHAR(50)
);
```

### 4.2 INSERT — chunked
```js
const chunkSize = Math.max(1, Math.floor(500 / k));  // adapt ตาม K
// batch insert ด้วย placeholders $1, $2, ...
INSERT INTO bench_test (column1, ..., columnK)
VALUES ($1,$2,...), ($n+1,...), ...
```
**วัด**: `performance.now()` ครอบ loop ทั้งหมด → `results.insert`

### 4.3 CREATE INDEXES
```sql
CREATE INDEX idx_bench_col2 ON bench_test (column2);
CREATE INDEX idx_bench_col5 ON bench_test (column5);
-- ... เฉพาะ indexedCols
```

### 4.4 SELECT (no index) — `LIKE 'a%'`
```sql
SELECT * FROM bench_test WHERE column{unindexedCol} LIKE 'a%'
```
Full scan เพราะ column นี้ไม่มี index → `results.selectNoIndex`

### 4.5 SELECT (indexed) — equality + LIMIT
```sql
SELECT * FROM bench_test WHERE column{queryCol} = $1 LIMIT 10
```
Target: `queryVal` ที่อยู่ใน pool → เจอแน่ 10 rows → `results.selectIndexed`

### 4.6 UPDATE & DELETE — by PK
```sql
UPDATE bench_test SET column{queryCol} = 'updated' WHERE id = $mid;
DELETE FROM bench_test WHERE id = $last;
```

### 4.7 Cleanup
```sql
DROP TABLE IF EXISTS bench_test;
```

## 5. MongoDB Benchmark — `benchmarkMongo()`

Mirror กับ PG แต่ใช้ MongoDB API — ใช้ `_seqId` field เป็น PK แทน SERIAL:

| Operation | PostgreSQL | MongoDB |
|-----------|------------|---------|
| INSERT | `INSERT INTO ... VALUES (...)` | `col.insertMany(docs)` |
| Index | `CREATE INDEX idx ON t(col)` | `col.createIndex({ col: 1 })` |
| No-index scan | `LIKE 'a%'` | `$regex: '^a'` |
| Indexed eq | `WHERE col = $1 LIMIT 10` | `.find({col:v}).limit(10)` |
| UPDATE | `WHERE id = $mid` | `.updateOne({_seqId:mid},...)` |
| DELETE | `WHERE id = $last` | `.deleteOne({_seqId:last})` |

## 6. JSONB Benchmark — 3-way Comparison

### 6.1 Data (separate from main)
```js
{
  data: {
    category: 'xyz',      // from pool of 5
    tags: ['abc'],        // from pool of 10
    meta: { seq: i }
  }
}
```

### 6.2 PostgreSQL JSONB — 2 index types
```sql
CREATE TABLE bench_json (id SERIAL PRIMARY KEY, data JSONB);
CREATE INDEX idx_json_gin  ON bench_json USING GIN (data);
CREATE INDEX idx_json_expr ON bench_json ((data->>'category'));
```

**2 queries** (same result, different plans):
```sql
-- GIN containment
SELECT * FROM bench_json WHERE data @> '{"category":"xyz"}'::jsonb LIMIT 10;
-- Expression B-Tree
SELECT * FROM bench_json WHERE data->>'category' = 'xyz' LIMIT 10;
```

### 6.3 MongoDB — dotted path + single index
```js
col.createIndex({ 'data.category': 1 });
col.find({ 'data.category': queryCategory }).limit(10).toArray();
```

**Output**: `selectJsonGin`, `selectJsonBtree`, `selectJsonMongo`

## 7. Timing & Averaging

### 7.1 Wrapper
```js
async function measureMs(fn) {
  const start = performance.now();
  await fn();
  return +(performance.now() - start).toFixed(3);   // ms to 3 decimals
}
```

### 7.2 Multi-run average
```js
// runs รอบ
for (let run = 0; run < runs; run++) {
  const indexedCols = pickRandomColumns(k, numIndexes);  // resample ทุกรอบ
  // ... run pg + mongo + json
  allPg.push(pgResults);
  allMg.push(mgResults);
}
// เฉลี่ยทุก operation
avg[key] = sum(runs) / runs.length
```

## 8. API Contract

### POST `/api/benchmark/run`
**Request**:
```json
{ "n": 1000, "k": 5, "m": 40, "runs": 1 }
```

**Response**:
```json
{
  "success": true,
  "data": {
    "postgres": {
      "insert": 245.123,
      "selectNoIndex": 12.456,
      "selectIndexed": 0.234,
      "update": 0.891,
      "delete": 0.456,
      "selectJsonGin": 0.512,
      "selectJsonBtree": 0.389
    },
    "mongodb": {
      "insert": 178.234,
      "selectNoIndex": 15.123,
      "selectIndexed": 0.198,
      "update": 0.645,
      "delete": 0.234,
      "selectJsonMongo": 0.412
    },
    "meta": {
      "n": 1000, "k": 5, "m": 40,
      "numIndexes": 2,
      "indexedColumns": [2, 5],
      "indexedColumnsAllRuns": [[2, 5]],
      "runs": 1,
      "selectLimit": 10,
      "timestamp": "2026-04-20T...",
      "pgVersion": "16.3",
      "mongoVersion": "7.0.12"
    }
  }
}
```

### GET `/api/benchmark/status`
Returns version + connection status ของ PG และ Mongo

## 9. Environment Variables (server/.env)

| var | default | |
|-----|---------|---|
| `PG_HOST` | `localhost` | |
| `PG_PORT` | `5432` | |
| `PG_USER` | `postgres` | |
| `PG_PASSWORD` | `1234` | ⚠️ dev default |
| `PG_DATABASE` | `cakecontrol_bench` | |
| `MONGO_URL` | `mongodb://localhost:27017` | |
| `MONGO_DB` | `cakecontrol_bench` | |
| `BENCH_PORT` | `3003` | |

Server timeout ตั้งไว้ **10 นาที** (N=1M ใช้เวลานาน)

## 10. FE Flow — `LiveBenchmarkTab`

```
User กดปุ่ม "Run Benchmark"
    ↓
fetch POST /api/benchmark/run { n, k, m, runs }
    ↓ (loading = true, ~5s – 2min)
ได้ result → setResults + push เข้า history (เก็บล่าสุด 10)
    ↓
Render:
  ├─ Comparison BarChart: 5 operations × 2 DBs
  ├─ JSONB BarChart: 3 bars (PG GIN, PG B-Tree, MG)
  ├─ Meta info: index columns, versions, timestamp
  └─ History table: run ล่าสุด 10 รายการ
```

**Status check** ก่อนรัน: กด "Check DB Status" → GET `/status` → แสดง PG/Mongo version หรือ offline

## 11. สรุปกลไก

1. **เป็น benchmark จริง** — INSERT/SELECT/UPDATE/DELETE ของจริง ไม่ใช่สูตรประมาณ
2. **`performance.now()`** วัดแต่ละ operation แยก → ความแม่น < 1ms
3. **Drop + Create** ทุกรอบ → ไม่มี state หลงเหลือระหว่าง run
4. **Random index selection** → แต่ละรอบเลือก column ที่ index ไม่เหมือนกัน (ลด bias จาก column order)
5. **Pool pattern** → column ที่ query มีค่าซ้ำ 5 แบบ รับประกัน SELECT เจอ rows
6. **Chunked INSERT** → หลีกเลี่ยง query size limit (`chunkSize = 500/K`)
7. **Parallel PG + Mongo** ใช้ dataset เดียวกัน → เทียบได้ fair
8. **Multi-run averaging** → ลด noise, resample index columns ทุกรอบ
9. **Separate JSONB table** → เทียบ 3 วิธี (PG GIN vs PG Expression vs Mongo dotted path)
10. **10-min timeout** → รองรับ N=1M

## 12. การรัน (local)

```bash
# 1. ต้องมี PostgreSQL + MongoDB ทำงานอยู่
# 2. รัน benchmark server (port 3003)
cd server
npm run bench       # หรือ node src/benchmarkServer.js

# 3. รัน FE dev (port ปกติ Vite)
npm run dev

# 4. เปิด /controls-docs → หา Benchmark page → กด Run
```
