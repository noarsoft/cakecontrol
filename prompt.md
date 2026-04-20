# Live Benchmark — Methodology & Experimental Setup

> เอกสารอธิบายหลักการทำงานของ Live Benchmark สำหรับตอบงานวิจัย

## คำถามที่ต้องการตอบ

1. มันทำยังไง ยิง DB ทีละตัวหรอ
2. อันนี้คือผลลัพธ์ DB จริงใช่มั้ย แล้วเอาขึ้น FE ใช่มั้ย
3. FE มีหน้าที่แค่โชว์หรอ รู้ได้ไงว่าที่โชว์คือเทสจริงแล้ว
4. Experimental setup อะไรยังไง

---

## 1. หลักการทำงาน — ยิง DB ทีละตัวแบบ Sequential

```
กดปุ่ม Run Benchmark
    │
    ▼
FE ส่ง POST /api/benchmark/run { n, k, indexCount, runs }
    │
    ▼
BE (benchmarkService.js) ทำงาน:
    │
    ├─ Step 1: สร้าง test data N records (ข้อมูลเดียวกันทั้ง 2 DBs)
    │
    ├─ Step 2: ยิง PostgreSQL ก่อน
    │   ├─ CREATE TABLE bench_test
    │   ├─ INSERT N rows ──────────────── วัดเวลา
    │   ├─ CREATE INDEX (city, age, GIN data)
    │   ├─ SELECT WHERE score > 50 ────── วัดเวลา (full scan)
    │   ├─ SELECT WHERE city = ... LIMIT K → วัดเวลา (indexed)
    │   ├─ UPDATE SET score WHERE id = N/2 → วัดเวลา
    │   ├─ DELETE WHERE id = N ─────────── วัดเวลา
    │   └─ DROP TABLE bench_test (cleanup)
    │
    ├─ Step 3: ยิง MongoDB ต่อ (หลัง PG เสร็จแล้ว)
    │   ├─ insertMany N docs ──────────── วัดเวลา
    │   ├─ createIndex (city, age, data.tags)
    │   ├─ find({ score: { $gt: 50 }}) ── วัดเวลา
    │   ├─ find({ city }).limit(K) ────── วัดเวลา
    │   ├─ updateOne({ _seqId: N/2 }) ─── วัดเวลา
    │   ├─ deleteOne({ _seqId: N }) ───── วัดเวลา
    │   └─ drop collection (cleanup)
    │
    └─ Step 4: ส่งผลกลับ FE เป็น JSON
```

### ทำไมต้องยิงทีละตัว?

- ไม่ให้แย่ง CPU / RAM / Disk I/O กัน
- ผลจะ fair และเปรียบเทียบได้
- เลียนแบบ single-tenant production workload

---

## 2. ผลลัพธ์คือ DB จริง — ใช่ 100%

Backend ใช้ `performance.now()` (high-resolution timer ระดับ microsecond) จับเวลาจริง:

```js
const start = performance.now();
await pgPool.query('INSERT INTO bench_test ...'); // ← ยิง DB จริง
const elapsed = performance.now() - start;        // ← เวลาจริง (ms)
```

**ไม่มีสูตร ไม่มีการประมาณ** — เป็นเวลาที่ DB ใช้ทำงานจริงบนเครื่องนี้

จากนั้น BE ส่ง JSON กลับ FE:

```json
{
  "postgres": {
    "insert": 314.3,
    "selectNoIndex": 34.4,
    "selectIndexed": 1.2,
    "update": 9.8,
    "delete": 0.6
  },
  "mongodb": {
    "insert": 208.5,
    "selectNoIndex": 62.5,
    "selectIndexed": 11.4,
    "update": 9.0,
    "delete": 24.9
  },
  "meta": {
    "n": 10000,
    "k": 10,
    "indexCount": 2,
    "runs": 1,
    "pgVersion": "18.3",
    "mongoVersion": "8.2.6",
    "timestamp": "2026-04-20T03:45:11.000Z"
  }
}
```

---

## 3. FE โชว์อย่างเดียว — ไม่คำนวณ

FE แค่รับ JSON แล้ว render เป็น chart + table. รู้ได้ว่าเทสจริงจาก 4 หลักฐาน:

| หลักฐาน | เหตุผล |
|---------|--------|
| **ค่าไม่เท่ากันทุกรอบ** | กด Run ซ้ำ ค่าเปลี่ยนเล็กน้อย (variance) — สูตรจะได้ค่าเดิมตลอด |
| **Real ≠ Estimated** | ค่าจริงต่างจากสูตรชัดเจน เช่น INSERT Est=845ms แต่ Real=314ms |
| **มี metadata** | แสดง timestamp, DB version, N, K ที่ใช้จริง |
| **Run History** | เก็บผลทุกรอบ เห็น deviation ระหว่างรอบ |

---

## 4. Experimental Setup

### 4.1 Environment

| รายการ | ค่า |
|--------|-----|
| OS | Windows 10 Home 10.0.19045 |
| Runtime | Node.js v25.9.0 |
| PostgreSQL | v18.3, localhost:5432, default config |
| MongoDB | v8.2.6, localhost:27017, WiredTiger engine |
| Driver | `pg` v8.20.0 (node-postgres), `mongodb` v7.1.1 (native driver) |
| Measurement | `performance.now()` — high-resolution timer (microsecond precision) |
| Hardware | User's local machine (ไม่มี network latency) |

### 4.2 Test Data

| รายการ | ค่า |
|--------|-----|
| Schema | `{ name, email, age, city, score, data(JSONB/nested) }` |
| Generation | Synthetic — deterministic per N (same data ทั้ง 2 DBs) |
| City values | 5 ค่า rotate: Bangkok, Chiang Mai, Phuket, Khon Kaen, Hat Yai |
| Nested data | `{ tags: [...], meta: { created, seq } }` |
| Record size | ~200-300 bytes average |

### 4.3 Operations Tested

| Operation | PostgreSQL SQL | MongoDB Query |
|-----------|---------------|---------------|
| INSERT | Batch INSERT (500/chunk) | `insertMany` |
| SELECT (scan) | `WHERE score > 50` | `find({ score: { $gt: 50 } })` |
| SELECT (indexed) | `WHERE city = 'Bangkok' LIMIT K` | `find({ city }).limit(K)` |
| UPDATE | `UPDATE ... WHERE id = N/2` | `updateOne({ _seqId: N/2 })` |
| DELETE | `DELETE ... WHERE id = N` | `deleteOne({ _seqId: N })` |

### 4.4 Indexes Created (ตาม M parameter)

| M | PostgreSQL | MongoDB |
|---|-----------|---------|
| 0 | ไม่มี index | ไม่มี index (มีแค่ `_id` default) |
| 1 | `B-Tree ON (city)` | `{ city: 1 }` |
| 2 | `+ B-Tree ON (age)` | `+ { age: 1 }` |
| 3 | `+ GIN ON (data)` | `+ { 'data.tags': 1 }` |

### 4.5 Tunable Parameters

| Parameter | Range | ความหมาย |
|-----------|-------|---------|
| **N** | 100 - 100,000 | จำนวน records ใน table/collection |
| **K** | 1 - 10,000 | LIMIT ใน SELECT indexed query |
| **M** | 0 - 3 | จำนวน indexes ที่สร้าง |
| **Runs** | 1 - 5 | รันกี่รอบแล้วเอาค่าเฉลี่ย |

### 4.6 Controls (ตัวแปรควบคุม)

- **Isolation**: ยิง PG ก่อน cleanup แล้วค่อยยิง Mongo — ไม่แย่ง resource
- **Fresh state**: สร้าง table/collection ใหม่ทุกรอบ DROP ทิ้งหลังเสร็จ
- **Same data**: ข้อมูลเดียวกันทุกประการทั้ง 2 DBs
- **Same query semantics**: filter/limit/where เทียบเท่ากันระหว่าง SQL กับ MongoDB
- **Averaging**: รันหลายรอบแล้วเฉลี่ย เพื่อลด variance

---

## 5. ตัวอย่างผลการทดลอง (N=10,000, K=10, M=2, Runs=1)

| Operation | PG Real | PG Est | MG Real | MG Est |
|-----------|---------|--------|---------|--------|
| INSERT 10K | 314ms | 845ms | 209ms | 565ms |
| SELECT (scan) | 34ms | 20ms | 63ms | 26ms |
| SELECT (indexed) | 1.2ms | 0.3ms | 11ms | 0.3ms |
| UPDATE (PK) | 9.8ms | 0.96ms | 9.0ms | 0.80ms |
| DELETE (PK) | 0.6ms | 0.94ms | 25ms | 0.80ms |

### Observations

- **ค่า Real ≠ Estimated** ชัดเจน → ยืนยันว่าเป็นการวัดจริง
- **INSERT**: ทั้งคู่เร็วกว่าที่สูตรทำนาย (batch optimization)
- **SELECT indexed**: ทั้งคู่ช้ากว่าสูตร (overhead ของ network/driver)
- **DELETE PG**: เร็วมาก (0.6ms) — MVCC mark-as-dead ไม่ต้องลบจริง
- **DELETE Mongo**: ช้ากว่า (25ms) — ต้อง update index + actual removal

---

## 6. สถาปัตยกรรม

```
┌─────────────────────┐         ┌──────────────────────────┐
│  Frontend (React)   │  HTTP   │  Backend (Express)       │
│  port 5173          │ ──────► │  port 3003               │
│                     │  POST   │                          │
│  BenchmarkPage.jsx  │  JSON   │  benchmarkService.js     │
│  └─ LiveBenchmark   │ ◄────── │  └─ runBenchmark()       │
│     tab             │         │     ├─ benchmarkPostgres │
└─────────────────────┘         │     └─ benchmarkMongo    │
        โชว์ผล                   └──────────┬───────────────┘
                                            │
                                 ┌──────────┴──────────┐
                                 ▼                     ▼
                          ┌─────────────┐       ┌─────────────┐
                          │ PostgreSQL  │       │  MongoDB    │
                          │   v18.3     │       │   v8.2.6    │
                          │ localhost   │       │ localhost   │
                          │   :5432     │       │   :27017    │
                          └─────────────┘       └─────────────┘
```

### ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | หน้าที่ |
|------|--------|
| `server/src/benchmark/benchmarkService.js` | Core — ยิง DB จริง วัดเวลาด้วย `performance.now()` |
| `server/src/routes/benchmark.js` | API routes: `GET /status`, `POST /run` |
| `server/src/benchmarkServer.js` | Standalone Express server บน port 3003 |
| `server/.env` | PG/Mongo connection config |
| `src/components/controls_doc/pages/BenchmarkPage.jsx` | UI — tab "Live Benchmark" |

---

## 7. วิธีรัน

```bash
# Terminal 1: Benchmark API
cd server && npm run bench

# Terminal 2: Frontend
npm run dev

# เปิด browser → http://localhost:5173
# DB Benchmark → tab "Live Benchmark"
# กด Check DB Status → กด Run Benchmark
```

---

## 8. References

- benchANT (2023-2024): MongoDB vs PostgreSQL benchmark
- YCSB (Yahoo Cloud Serving Benchmark)
- EnterpriseDB Benchmark (2024): PostgreSQL JSONB vs MongoDB
- Percona (2023): MongoDB vs PostgreSQL JSONB comparison
- `research_mongo_vs_postgres.md` — reference numbers สำหรับสูตร Estimated
