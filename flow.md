# DB Benchmark — คู่มือทำความเข้าใจสำหรับทีม

เอกสารเดียวจบ อ่านแล้วเข้าใจว่า DB benchmark ทำงานยังไง, execution time วัดตรงไหน, โค้ดอยู่ไฟล์ไหนบรรทัดไหน

---

## 0. TL;DR — 30 วินาที

- **Real benchmark** ไม่ใช่ estimator — ยิง SQL/Mongo queries จริง ๆ วัดด้วย `performance.now()`
- **Stack**: FE (React @ Vite) → HTTP POST → Express server (port 3003) → PostgreSQL + MongoDB
- **Input**: `N` (rows), `K` (columns), `M` (% of K that are indexed), `runs` (รันกี่รอบแล้วเฉลี่ย)
- **Output**: ms ของแต่ละ operation (INSERT/SELECT no-index/SELECT indexed/UPDATE/DELETE + 3 JSONB queries) พร้อม Big O theoretical
- **Isolation**: DROP + CREATE table ทุก run → ไม่มี state ค้าง
- **ใช้เมื่อไหร่**: เปรียบเทียบ PG vs Mongo ใน workload ที่ใกล้เคียง use case ของเรา (FormBuilder flexible schema)

---

## 1. วิธีรัน (ทีมเอาไปทดลองเอง)

### 1.1 Prerequisites

| Service | Port | ต้องมีก่อน |
|---------|------|-----------|
| PostgreSQL 13+ | 5432 | installer ปกติ |
| MongoDB 6+ | 27017 | Community Edition |

### 1.2 ENV (สร้าง `server/.env`)

```env
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=1234
PG_DATABASE=cakecontrol_bench

MONGO_URL=mongodb://localhost:27017
MONGO_DB=cakecontrol_bench

BENCH_PORT=3003
```

> `cakecontrol_bench` database ใน PG สร้างอัตโนมัติตอนรันครั้งแรก (ดู `ensurePgDatabase()`)

### 1.3 รัน 2 terminal

```bash
# Terminal 1: Benchmark API server (port 3003)
cd server
npm install
npm run bench              # = node src/benchmarkServer.js

# Terminal 2: FE dev (port Vite default)
npm install
npm run dev
```

### 1.4 เปิดหน้า

1. ไปที่ `http://localhost:5173/controls-docs`
2. เลือก **Benchmark** จาก sidebar
3. กด **Check DB Status** → ถ้าขึ้น `PG: v16.x | Mongo: v7.x` = พร้อม
4. ตั้ง N, K, M → กด **Run Benchmark** → รอ chart โผล่

---

## 2. Architecture (Big Picture)

```
┌──────────────────────────────────────────────────┐
│ Browser                                          │
│                                                  │
│  BenchmarkPage.jsx (LiveBenchmarkTab)            │
│   ├─ state: N, K, M, runs, results, history     │
│   ├─ fetch POST /api/benchmark/run              │
│   └─ render Recharts + Big O table              │
└──────────────┬───────────────────────────────────┘
               │ HTTP JSON
               ▼
┌──────────────────────────────────────────────────┐
│ Express @ :3003 (benchmarkServer.js)             │
│                                                  │
│  /api/health              → liveness             │
│  /api/benchmark/status    → checkStatus()        │
│  /api/benchmark/run       → runBenchmark()       │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│ benchmarkService.js (core)                       │
│                                                  │
│  runBenchmark(n, k, m, runs)                     │
│    ├─ ensurePgDatabase()                         │
│    └─ for run in 1..runs:                        │
│         ├─ pickRandomColumns → indexedCols       │
│         ├─ generateRecords → records             │
│         ├─ benchmarkPostgres()  ─┐               │
│         ├─ benchmarkMongo()     ─┤ ← PG + Mongo │
│         ├─ benchmarkPostgresJson()               │
│         └─ benchmarkMongoJson()                  │
└──────────────┬───────────────────────────────────┘
               │ pg Pool / MongoClient
               ▼
      PostgreSQL 5432  +  MongoDB 27017
```

---

## 3. Code Map — ไฟล์ไหนทำอะไร

### Backend (`server/`)

| ไฟล์ | หน้าที่ | บรรทัดสำคัญ |
|------|---------|-------------|
| `server/package.json` | npm scripts: `bench`, `bench:dev` | `"bench": "node src/benchmarkServer.js"` |
| `server/src/benchmarkServer.js` | Express bootstrap + route mounting + long-running timeout 10 นาที | L22–30 |
| `server/src/routes/benchmark.js` | 2 endpoint + input validation (clamp N/K/M/runs) | L6–37 |
| `server/src/benchmark/benchmarkService.js` | **Core** — data gen + PG/Mongo benchmark + averaging | ดูหัวข้อ 4 |
| `server/src/benchmark/inspectDb.js` | CLI tool `node inspectDb.js [n]` — ใส่ข้อมูลจริงแล้วเก็บไว้ให้ query ด้วย psql/mongosh (debug/ตรวจสอบ) | all |

### Frontend (`src/`)

| ไฟล์ | หน้าที่ | บรรทัดสำคัญ |
|------|---------|-------------|
| `src/components/controls_doc/pages/BenchmarkPage.jsx` | UI ทั้งหน้า | ดูหัวข้อ 5 |
| → `LiveBenchmarkTab` | State + fetch + render | L21–429 |
| → `ResultCard` | การ์ดสรุป PG vs MG + Big O | L432–463 |
| → `calcBigO()` | คำนวณ Big O theoretical | L472–512 |
| → `formatMs()` | format µs/ms/s | L514–519 |

---

## 4. Backend Deep Dive — `benchmarkService.js`

### 4.1 Constants + Pools (L17–29)

```js
const SELECT_LIMIT = 10;      // hardcode — SELECT เอา 10 rows
const pgPool = new Pool({...});
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
```

> `pgPool` ถูก share ทั้งไฟล์ (persistent connections)
> `MongoClient` สร้างใหม่ทุก benchmark function แล้ว `.close()` (ป้องกัน connection leak)

### 4.2 Helper Functions (L32–107)

| Function | ไฟล์:บรรทัด | ทำอะไร |
|----------|-------------|--------|
| `randomStr(len)` | L32–37 | สุ่ม alphanumeric `len` ตัว |
| `randomInt(min, max)` | L39–41 | สุ่ม integer (inclusive) |
| `pickRandomColumns(k, count)` | L44–52 | **Fisher-Yates shuffle** เลือก column จะ index ตัวไหน |
| `findUnindexedCol(k, indexedCols)` | L55–61 | หา column ที่ **ไม่** มี index (สำหรับ full scan) |
| `generateRecords(n, k, queryColIndex)` | L65–82 | เจน K-column records (row × column loop) |
| `generateJsonRecords(n)` | L85–101 | เจน JSONB records (`{data: {category, tags, meta}}`) |
| `measureMs(fn)` | L103–107 | ครอบ `performance.now()` รอบ async fn |
| `ensurePgDatabase()` | L109–126 | สร้าง PG database ถ้ายังไม่มี |

### 4.3 Data Generation — generateRecords (L65–82)

**Row × Column double loop**:
```js
const pool = Array.from({length: 5}, () => randomStr(8));   // 5 predictable values

for (let i = 0; i < n; i++) {
  const row = {};
  for (let j = 1; j <= k; j++) {
    if (j === queryColIndex) {
      row[`column${j}`] = pool[randomInt(0, 4)];  // ← จาก pool 5 ค่า
    } else {
      row[`column${j}`] = randomStr(8);           // ← random 8 chars
    }
  }
  records.push(row);
}
return { records, queryVal: pool[0] };
```

**ทำไมต้อง pool**: ถ้า random ล้วน SELECT เกือบไม่เจอ row → วัด performance ไม่ได้ pool 5 ค่าทำให้ **คาดเดาได้ว่า `queryVal = pool[0]` จะเจออย่างน้อย N/5 rows** → SELECT LIMIT 10 กลับมาครบ

### 4.4 PostgreSQL Benchmark — benchmarkPostgres (L131–193)

Flow ต่อเนื่อง 8 ขั้น:

| # | Step | Line | SQL ตัวอย่าง | วัด? |
|---|------|------|-------------|------|
| 1 | DROP table เก่า | L135 | `DROP TABLE IF EXISTS bench_test` | ❌ |
| 2 | CREATE K-col table | L136–137 | `CREATE TABLE bench_test (id SERIAL PRIMARY KEY, column1 VARCHAR(50), ..., columnK VARCHAR(50))` | ❌ |
| 3 | **INSERT** (chunked) | L141–161 | `INSERT INTO bench_test (...) VALUES ($1,...), ($K+1,...)` batch | ✅ `results.insert` |
| 4 | CREATE indexes | L164–166 | `CREATE INDEX idx_bench_colX ON bench_test (columnX)` × numIndexes | ❌ |
| 5 | **SELECT no-index** | L170–173 | `SELECT * FROM bench_test WHERE column{unindexed} LIKE 'a%'` | ✅ `results.selectNoIndex` |
| 6 | **SELECT indexed** | L176–178 | `SELECT * FROM bench_test WHERE column{queryCol} = $1 LIMIT 10` | ✅ `results.selectIndexed` |
| 7 | **UPDATE** by PK | L181–184 | `UPDATE bench_test SET column{queryCol} = 'updated' WHERE id = $mid` | ✅ `results.update` |
| 8 | **DELETE** by PK | L187–189 | `DELETE FROM bench_test WHERE id = $last` | ✅ `results.delete` |
| end | DROP cleanup | L191 | `DROP TABLE IF EXISTS bench_test` | ❌ |

**Chunked INSERT ละเอียด** (L141–161):
```js
const chunkSize = Math.max(1, Math.floor(500 / k));   // ปรับตาม K
// ถ้า K=5 → chunk=100 rows/query
// ถ้า K=50 → chunk=10 rows/query (ป้องกัน $32767 placeholder limit)
```
เหตุผล: PG มี limit 32,767 parameters ต่อ query → ถ้า K=50 และใส่ทีเดียว 1000 rows = 50,000 params → overflow

### 4.5 MongoDB Benchmark — benchmarkMongo (L245–294)

Mirror โครงเดียวกับ PG ใช้ `_seqId` แทน SERIAL:

| Operation | MongoDB API |
|-----------|-------------|
| INSERT | `col.insertMany(records.map((r, i) => ({...r, _seqId: i+1})))` |
| CREATE INDEX | `col.createIndex({ [`column${i}`]: 1 })` |
| SELECT no-index | `col.find({ [`column${u}`]: { $regex: '^a' } }).toArray()` |
| SELECT indexed | `col.find({ [`column${q}`]: val }).limit(10).toArray()` |
| UPDATE | `col.updateOne({ _seqId: mid }, { $set: { ... } })` |
| DELETE | `col.deleteOne({ _seqId: last })` |

**Connection**: สร้าง `new MongoClient(mongoUrl)` ทุกครั้ง, `try/finally` → `client.close()` (L249, L291)

### 4.6 JSONB Benchmark (3-way) — L198–322

**ตาราง JSONB แยก** (`bench_json`):
```sql
CREATE TABLE bench_json (id SERIAL PRIMARY KEY, data JSONB);
CREATE INDEX idx_json_gin  ON bench_json USING GIN (data);          -- ← index แบบ 1
CREATE INDEX idx_json_expr ON bench_json ((data->>'category'));     -- ← index แบบ 2
```

**3 Queries** (ผลลัพธ์เหมือนกัน แต่ใช้ index ต่างกัน):
| # | Line | Query | Field |
|---|------|-------|-------|
| 1 | L223–228 | `SELECT * FROM bench_json WHERE data @> '{"category":"xyz"}'::jsonb LIMIT 10` | `selectJsonGin` |
| 2 | L231–236 | `SELECT * FROM bench_json WHERE data->>'category' = 'xyz' LIMIT 10` | `selectJsonBtree` |
| 3 | L312–314 | `col.find({ 'data.category': 'xyz' }).limit(10)` | `selectJsonMongo` |

### 4.7 Orchestration — runBenchmark (L334–380)

```js
export async function runBenchmark(n = 1000, k = 5, m = 40, runs = 1) {
  await ensurePgDatabase();

  const allPg = [], allMg = [], allIndexedCols = [];

  for (let run = 0; run < runs; run++) {
    const numIndexes = Math.round(k * m / 100);
    const indexedCols = pickRandomColumns(k, numIndexes);   // resample ทุกรอบ
    const queryCol = indexedCols[0] ?? 1;

    const { records, queryVal } = generateRecords(n, k, queryCol);

    const pgMain = await benchmarkPostgres(records, k, indexedCols, queryCol, queryVal);
    const mgMain = await benchmarkMongo(records, k, indexedCols, queryCol, queryVal);

    const { records: jsonRecords, queryCategory } = generateJsonRecords(n);
    const pgJson = await benchmarkPostgresJson(jsonRecords, queryCategory);
    const mgJson = await benchmarkMongoJson(jsonRecords, queryCategory);

    allPg.push({ ...pgMain, ...pgJson });
    allMg.push({ ...mgMain, ...mgJson });
    allIndexedCols.push(indexedCols);
  }

  return { postgres: averageResults(allPg), mongodb: averageResults(allMg), meta: {...} };
}
```

**Sequential ไม่ parallel**: รัน PG ก่อน → Mongo → ไม่ให้แย่ง CPU/IO (ปัจจัยร่วมที่ทำให้ผลเพี้ยน)

### 4.8 Averaging — averageResults (L408–416)

```js
avg[key] = sum(runs) / runs.length  // เฉลี่ยง่าย ๆ ทุก key
```

---

## 5. Frontend Deep Dive — `BenchmarkPage.jsx`

### 5.1 State (L22–30)

```jsx
const [status, setStatus] = useState(null);         // PG/Mongo version + online
const [loading, setLoading] = useState(false);
const [results, setResults] = useState(null);       // latest run
const [history, setHistory] = useState([]);        // last 10 runs
const [runs, setRuns] = useState(1);
const [liveN, setLiveN] = useState(1000);
const [liveK, setLiveK] = useState(5);
const [liveM, setLiveM] = useState(40);
const [error, setError] = useState(null);
```

### 5.2 Fetch Flow (L32–64)

```jsx
const checkStatus = useCallback(async () => {
  const res = await fetch(`${BENCH_API}/status`);
  setStatus((await res.json()).data);
}, []);

const runBenchmark = useCallback(async () => {
  setLoading(true);
  const res = await fetch(`${BENCH_API}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ n: liveN, k: liveK, m: liveM, runs }),
  });
  const data = await res.json();
  setResults(data.data);
  setHistory(prev => [data.data, ...prev].slice(0, 10));
}, [liveN, liveK, liveM, runs]);
```

### 5.3 Render Blocks (ใน JSX L88–420)

| ส่วน UI | บรรทัด | อ่านค่าจาก |
|---------|--------|-----------|
| Status indicator | L96–108 | `status.postgres`, `status.mongodb` |
| Error banner | L110–114 | `error` |
| Input controls (N/K/M/runs) + preset buttons | L116–177 | `liveN/K/M/runs` |
| Loading progress bar | L180–195 | `loading` |
| Meta summary (ก่อน cards) | L201–217 | `results.meta` |
| 5 Result Cards | L220–229 | `results.postgres/mongodb[op]` |
| Big O Analysis Table | L232–294 | `bigO[op]` จาก `calcBigO()` |
| PG vs Mongo BarChart | L297–309 | `comparisonData` |
| Detail Table (winner, diff%) | L312–343 | `results.postgres/mongodb[op]` |
| JSONB 3-way cards | L346–382 | `results.*.selectJson*` |
| JSONB BarChart | L384–395 | `jsonbData` |
| History Table (last 10) | L400–420 | `history[]` |

### 5.4 Big O Client-side — calcBigO (L472–512)

**ไม่เรียก backend** — คำนวณบน FE จาก N, K, numIndexes, LIMIT:

```js
function calcBigO(n, k, m, limit = 10) {
  const logN = Math.log2(Math.max(n, 1));
  return {
    insert: {
      formula: m > 0 ? 'O(N × (K + M × log N))' : 'O(N × K)',
      estimate: `${n} × (${k} + ${m} × ${logN.toFixed(1)}) ≈ ...`,
    },
    selectNoIndex:   { formula: 'O(N)',              estimate: '...' },
    selectIndexed:   { formula: 'O(log N + L)',      estimate: '...' },
    update:          { formula: 'O((1+M) × log N)',  estimate: '...' },
    delete:          { formula: 'O((1+M) × log N)',  estimate: '...' },
    selectJsonGin:   { formula: 'O(log N + L)',      estimate: '...' },
    selectJsonBtree: { formula: 'O(log N + L)',      estimate: '...' },
    selectJsonMongo: { formula: 'O(log N + L)',      estimate: '...' },
  };
}
```

---

## 6. Execution Time — วัดตรงไหน, แปลผลยังไง

### 6.1 จุดที่วัด

ทุกตัวเลข ms ที่เห็นใน UI มาจาก **`measureMs()` ใน server** (L103–107):

```js
async function measureMs(fn) {
  const start = performance.now();
  await fn();
  return +(performance.now() - start).toFixed(3);  // ms ความละเอียด 3 ตำแหน่ง
}
```

**วัดเฉพาะ query execution** — **ไม่รวม**:
- DROP/CREATE TABLE
- CREATE INDEX
- Network latency FE → BE (แต่ BE → DB รวมเพราะ query กระทำผ่าน network)
- Setup/teardown

**รวม** (ต้อง aware):
- Driver serialization (`pg` แปลง params → wire protocol, `mongodb` แปลง BSON)
- Connection acquisition จาก pool
- Network hop server ↔ DB (ถ้า DB คนละเครื่อง)

### 6.2 Time Budget ตัวอย่าง (N=10,000, K=5, M=40%)

| Operation | PG เห็น | Mongo เห็น | หมายเหตุ |
|-----------|---------|-----------|---------|
| INSERT | 200–400ms | 80–200ms | Mongo เร็วกว่า (ไม่มี MVCC overhead, batch insert เร็ว) |
| SELECT no-index | 20–50ms | 15–40ms | ทั้งคู่ full scan, I/O-bound |
| SELECT indexed LIMIT 10 | < 2ms | < 1ms | B-Tree walk + 10 fetches |
| UPDATE by PK | < 2ms | < 1ms | 1 row only |
| DELETE by PK | < 2ms | < 1ms | 1 row only |
| JSONB GIN | < 3ms | — | GIN search + 10 fetches |
| JSONB Expr B-Tree | < 2ms | — | B-Tree equality |
| JSONB Mongo (dotted) | — | < 1ms | single field index |

> ตัวเลขจริงขึ้นกับเครื่อง; ทดสอบหลาย ๆ รอบแล้วเฉลี่ย

### 6.3 N=1M จะรอนานแค่ไหน

- INSERT: 30–90 วินาที (chunked)
- SELECT no-index: 1–5 วินาที
- SELECT indexed/UPDATE/DELETE: ยังเร็ว (< 10ms)
- **รวม 1 run** ≈ 1–3 นาที
- **Server timeout** ตั้งไว้ 10 นาที (benchmarkServer.js L29)

### 6.4 อ่านผลยังไง ให้ไม่โดนหลอก

| Warning | สาเหตุ |
|---------|-------|
| Run แรก PG ช้ากว่าปกติ 2–3 เท่า | Cold cache — รัน 2–3 รอบแล้วเฉลี่ย (ใช้ `runs=3`) |
| SELECT no-index กระโดดไปมา | OS page cache — รีสตาร์ท DB ก่อนวัด หรือ increase N ให้เกิน RAM |
| Mongo insert ช้ากว่า PG | ตรวจว่า `insertMany` ไม่โดน validate schema หรือ write concern สูง |
| Update/Delete ออกมา 0.000ms | < `performance.now()` resolution — เพิ่ม operations หรือ batch |

---

## 7. API Contract

### GET `/api/benchmark/status`

**Response**:
```json
{
  "success": true,
  "data": {
    "postgres": true,
    "pgVersion": "16.3",
    "mongodb": true,
    "mongoVersion": "7.0.12"
  }
}
```

### POST `/api/benchmark/run`

**Request**:
```json
{ "n": 1000, "k": 5, "m": 40, "runs": 1 }
```

**Clamping** (routes/benchmark.js L27–30):
| Field | min | max | default |
|-------|-----|-----|---------|
| n | 100 | 1,000,000 | 1000 |
| k | 1 | 50 | 5 |
| m | 0 | 100 | 0 |
| runs | 1 | 5 | 1 |

**Response**:
```json
{
  "success": true,
  "data": {
    "postgres": { "insert": 245.123, "selectNoIndex": 12.456, "selectIndexed": 0.234, "update": 0.891, "delete": 0.456, "selectJsonGin": 0.512, "selectJsonBtree": 0.389 },
    "mongodb":  { "insert": 178.234, "selectNoIndex": 15.123, "selectIndexed": 0.198, "update": 0.645, "delete": 0.234, "selectJsonMongo": 0.412 },
    "meta": {
      "n": 1000, "k": 5, "m": 40,
      "numIndexes": 2,
      "indexedColumns": [2, 5],
      "indexedColumnsAllRuns": [[2, 5]],
      "runs": 1,
      "selectLimit": 10,
      "timestamp": "2026-04-20T08:55:12.345Z",
      "pgVersion": "16.3",
      "mongoVersion": "7.0.12"
    }
  }
}
```

---

## 8. Troubleshooting

| อาการ | เช็คอะไร |
|-------|----------|
| FE ขึ้น "ต่อ Benchmark API ไม่ได้" | `npm run bench` ใน `server/` ยังรันอยู่หรือเปล่า? port 3003 เปิดไหม? |
| Status → PG offline | `pg_isready -h localhost -p 5432` / ตรวจ PG_PASSWORD ใน `.env` |
| Status → Mongo offline | `mongosh --eval 'db.runCommand({ping:1})'` / ตรวจ MONGO_URL |
| Timeout 10 นาที | N ใหญ่เกิน (> 1M) หรือ DB ไม่ response — ลดค่า N หรือ `runs` |
| Error `relation "bench_test" already exists` | ครั้งก่อน crash กลางรัน — ลบด้วย `DROP TABLE bench_test` ใน psql |
| ผลไม่เสถียร | ใช้ `runs=3` ขึ้นไป + ปิดโปรแกรมอื่นในเครื่อง |

---

## 9. การปรับแต่ง / Extension

### 9.1 เพิ่ม operation ใหม่ (เช่น JOIN / Aggregate)

1. เพิ่มใน `benchmarkService.js` → `benchmarkPostgres()` / `benchmarkMongo()`
2. Wrap ด้วย `measureMs()` → push key ใหม่เข้า `results`
3. FE: เพิ่มใน `ops[]` array (BenchmarkPage.jsx L66) + `opLabels` (L67–73)
4. FE: เพิ่ม `calcBigO()` case (L472)

### 9.2 เปลี่ยน column type (VARCHAR → TEXT / INT)

- ที่ `benchmarkPostgres()` L136–137 แก้ `VARCHAR(50)`
- อย่าลืมปรับ `randomStr(8)` ให้ match type (เช่น ใช้ `randomInt` แทน)

### 9.3 เพิ่ม DB ตัวที่ 3 (เช่น MySQL)

1. สร้าง `benchmarkMysql.js` ตามแพทเทิร์นเดียวกับ `benchmarkPostgres`
2. เพิ่ม `results.mysql = ...` ใน `runBenchmark()`
3. FE: เพิ่มสีใน `COLORS` + bar ใน chart

---

## 10. สรุปกลไกสำคัญ

1. **เป็น benchmark จริง** ไม่ใช่สูตร — ตัวเลขสะท้อน workload จริงบนเครื่องที่รัน
2. **Drop + Create ทุก run** → ไม่มี state ค้างจาก run ก่อน
3. **Random index selection ทุกรอบ** → ลด bias จาก column ordering
4. **Pool 5 values บน queryCol** → SELECT LIMIT 10 เจอผลเสมอ
5. **Chunked INSERT** → หลบ param limit ของ PG (32,767)
6. **Sequential PG → Mongo** → ไม่แย่ง resource กัน
7. **Multi-run averaging** → ลด noise
8. **Big O คำนวณฝั่ง FE** → เทียบกับ measured ms ได้ทันที
9. **Separate JSONB table** → เทียบ 3 flavors (GIN / Expression B-Tree / Mongo dotted)
10. **Server timeout 10 นาที** → รองรับ N ใหญ่

---

## 11. Quick Reference — แต่ละ Flow

### Flow 1: Status Check
```
FE: กด "Check DB Status"
  → GET /api/benchmark/status
    → checkStatus() [benchmarkService.js:382]
      → pgPool.query('SELECT version()')
      → MongoClient.connect + buildInfo
  ← {postgres: true/false, mongodb: true/false, versions}
FE: render badge "PG: v16.3 | Mongo: v7.0.12"
```

### Flow 2: Run Benchmark
```
FE: setState loading=true
  → POST /api/benchmark/run {n, k, m, runs}
    → routes/benchmark.js:23 validate + clamp
      → runBenchmark(n, k, m, runs) [benchmarkService.js:334]
        for run in 1..runs:
          → pickRandomColumns(k, numIndexes)
          → generateRecords(n, k, queryCol)
          → benchmarkPostgres()  → measureMs × 5 ops
          → benchmarkMongo()     → measureMs × 5 ops
          → benchmarkPostgresJson()  → 2 JSONB queries
          → benchmarkMongoJson()     → 1 Mongo query
        → averageResults(allPg, allMg)
  ← {postgres: {...ms}, mongodb: {...ms}, meta: {...}}
FE: setResults + push history[10] + render Recharts + Big O table
```

### Flow 3: Big O Analysis (FE only)
```
User เปลี่ยน N/K/M
  → useState re-render
    → calcBigO(N, K, numIndexes, 10) [BenchmarkPage.jsx:472]
      สำหรับแต่ละ op: return { formula, estimate }
  → render ใน ResultCard + Big O table
```

---

**อ่านจบแล้ว?**
- เปิด `server/src/benchmark/benchmarkService.js` ทั้งไฟล์ดูของจริง ↑ มี comment ไทยครบ
- หรือรัน `node server/src/benchmark/inspectDb.js 20` → ใส่ 20 rows จริง แล้วเปิด psql/mongosh ดู
