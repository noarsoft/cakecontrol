# DB Benchmark — Flow ทำงานทั้งหมด

## ภาพรวม

**ไม่ใช่ benchmark จริง** — เป็น **estimator** ที่คำนวณจากสูตรอ้างอิงใน `research_mongo_vs_postgres.md` แล้วเอามาแสดงเป็น chart + table แบบ interactive

```
User Input (N, K, M)  →  Pure Functions (lib/)  →  UI Tabs (BenchmarkPage)
                           ├─ benchmarkCalc.js     ├─ CRUD Compare
                           └─ storageCalc.js       ├─ Big O Table
                                                   ├─ JSONB vs BSON
                                                   ├─ Index Impact
                                                   ├─ Storage Size
                                                   └─ Growth Projector
```

ไฟล์ที่เกี่ยวข้อง:
- `src/lib/benchmarkCalc.js` — pure math functions คำนวณเวลา
- `src/lib/storageCalc.js` — pure math functions ประมาณ storage + วัด localStorage จริง
- `src/components/controls_doc/pages/BenchmarkPage.jsx` — UI (6 tabs)

## 1. Input Parameters

| ตัวแปร | ความหมาย | default | max |
|--------|----------|---------|-----|
| **N** | จำนวน records ใน table | 10,000 | 1,000,000 |
| **K** | จำนวน rows ที่ query ดึงออกมา (result size) | 10 | 10,000 |
| **M** | จำนวน indexes | 2 | 20 |
| `avgBytes` | ขนาดเฉลี่ย/record (Storage tab) | 200 | 10,000 |
| `growthPerMonth` | records เพิ่ม/เดือน (Growth tab) | 500 | 100,000 |

## 2. Core Calculation — `benchmarkCalc.js`

### 2.1 Reference data (จุดตั้งต้น)

```js
REFERENCE = {
  insert:        { postgres: 65ms/1000,  mongodb: 45ms/1000 },
  selectNoIndex: { postgres: 2ms/1000,   mongodb: 2ms/1000 },
  selectIndexed: { postgres: 0.3ms,      mongodb: 0.3ms },
  update:        { postgres: 0.35ms,     mongodb: 0.25ms },
  delete:        { postgres: 0.35ms,     mongodb: 0.25ms },
}
```

### 2.2 สูตร 5 ตัวหลัก

| Function | สูตร | Big O |
|----------|------|-------|
| `calcInsertTime(n, m)` | `(n/1000) × baseMs × (1 + m×0.15)` | O(N × M × log N) |
| `calcSelectNoIndex(n)` | `n × baseMs` (linear scan) | O(N) |
| `calcSelectIndexed(n, k)` | `0.02 × log₂N + k × 0.005` | O(log N + K) |
| `calcUpdateTime(n, m)` | `0.025 × log₂N + m×0.02×log₂N + 0.1` | O(log N + M×log N) |
| `calcDeleteTime(n, m)` | เหมือน update แต่ overhead น้อยกว่า | O(log N + M×log N) |

**จุดสำคัญ**:
- MongoDB insert เร็วกว่า ~30% (ไม่มี MVCC overhead)
- PostgreSQL update ช้ากว่าเพราะ `+0.1ms` = MVCC overhead (สร้าง row version ใหม่)
- Index มากขึ้น → insert/update/delete ช้าขึ้น (ต้อง update index ด้วย)

## 3. Chart Data Generation — `generateChartData()`

**จุดที่เจน row ต่อ row**:

```js
function generateChartData(nValues, k, indexCount) {
  return nValues.map(n => {
    const insert = calcInsertTime(n, indexCount);
    const selectNo = calcSelectNoIndex(n);
    const selectIdx = calcSelectIndexed(n, k);
    const update = calcUpdateTime(n, indexCount);
    const del = calcDeleteTime(n, indexCount);

    return {
      n, label: '10K',       // ← X-axis
      insertPg, insertMg,    // ← Bar chart columns
      selectNoPg, selectNoMg,
      selectIdxPg, selectIdxMg,
      updatePg, updateMg,
      deletePg, deleteMg,
    };
  });
}
```

**Input**: `nValues = [100, 500, 1000, 2500, 5000, 7500, 10000, ...]`
**Output**: 1 row ต่อ 1 N value (= 1 จุดบน chart)

Columns แต่ละ row:

| Column | ใช้ที่ไหน |
|--------|-----------|
| `n`, `label` | X-axis (`100`, `500`, `1K`, ...) |
| `insertPg`, `insertMg` | INSERT BarChart (2 bar/row) |
| `selectNoPg/Mg` | SELECT LineChart |
| `selectIdxPg/Mg` | Index Impact BarChart |
| `updatePg/Mg`, `deletePg/Mg` | UPDATE/DELETE BarChart |

## 4. 6 Tabs ใน UI

### Tab 1: CRUD Compare
- **Cards สรุป 5 operations** ที่ N ปัจจุบัน (INSERT/SELECT×2/UPDATE/DELETE)
- **3 charts**: INSERT (Bar), SELECT no-index (Line), UPDATE+DELETE (Bar 4 สี)
- Card ระบุ winner: `PG < MG` = PostgreSQL เร็วกว่า X%

### Tab 2: Big O Table
- 2 ตาราง: ไม่มี index vs มี B-Tree index
- `getBigOTable(n, k, m)` คำนวณ log₂N แล้วแทนค่าใน string template
- เช่น `O(log N + K) ≈ 13.3 + 10`

### Tab 3: JSONB vs BSON
- `calcJsonQuery(n, hasIndex)`:
  - ไม่มี index: `14ms × (n/10000)` (O(N))
  - มี index: `0.02 × log₂N` (O(log N))
- 3 cards: PG GIN, PG Expression B-Tree, MongoDB
- + checkbox toggle "มี Index"
- + guideline table "เมื่อไหร่ใช้อะไร"

### Tab 4: Index Impact
- 2 ตาราง reference: PG indexes (B-Tree/Hash/GIN) vs Mongo (Single/Compound/Text)
- 1 bar chart: SELECT indexed vs no-index (4 bars/N)

### Tab 5: Storage Size — `estimatePostgresSize()` + `estimateMongoSize()`

**PostgreSQL row structure**:
```
Row = ROW_OVERHEAD(27) + fixedCols(56) + JSONB(avgBytes + 4)
    = 27 + 56 + 204 = 287 bytes
RowsPerPage = floor(8192 / (rowSize + 4))
DataBytes = ceil(N / RowsPerPage) × 8192
```

**MongoDB document**:
```
BSON = 32 overhead + avgBytes × 1.1
DataBytes = ceil(N × BSON × 0.6)   // WiredTiger compress 60%
```

**Index sizes**:
- PG B-Tree: `N × 24 / 0.7` per index (fill factor 70%)
- PG GIN (JSONB): `N × avgBytes × 0.4`
- Mongo _id: `N × 28 / 0.7`
- Mongo additional: `indexCount × N × 24 / 0.7`

**UI**:
- 3 summary cards (PG / Mongo / localStorage)
- Breakdown BarChart (Data / Indexes / Overhead)
- Total comparison BarChart (horizontal)
- Detail table

### Tab 6: Growth Projector — `projectGrowth()`

```js
for (m = 0; m <= 12; m++) {
  n = currentCount + growthPerMonth × m;
  push({ month: m, records: n, pgBytes, mongoBytes, localBytes });
}
```

- Output 13 rows (เดือน 0-12)
- LineChart 3 เส้น: PG, Mongo, localStorage
- Table แสดงทุก 3 เดือน + เดือนสุดท้าย
- เตือน **localStorage limit 5MB จะเต็มเมื่อไหร่** (หารเอา)

## 5. Reactive Flow (useMemo)

```
User เปลี่ยน N/K/M
  ↓
useMemo recompute:
  ├─ nValues         (array of N values)
  ├─ chartData       = generateChartData(nValues, k, m)  ← เจนทุก row
  ├─ bigO            = getBigOTable(n, k, m)
  └─ currentResults  = { insert, selectNo, selectIdx, update, del, json }
  ↓
React re-render tabs
  ↓
Recharts วาด chart ใหม่ (animate)
```

## 6. Live localStorage Analysis — `measureLocalStorage()`

นอกจาก estimator ยังมีฟังก์ชันวัด **localStorage จริง** (ไม่ใช่ประมาณ):

```js
STORAGE_KEYS = {
  schemas:  'cakecontrol_schemas',
  views:    'cakecontrol_views',
  formcfgs: 'cakecontrol_formcfgs',
  forms:    'cakecontrol_forms',
}
```

สำหรับแต่ละ key:
- `new Blob([raw]).size` → byte count จริง
- Parse records แล้วหา avg/min/max record size
- รวม total + usage % เทียบ 5MB limit

## 7. สรุปกลไก

1. **ไม่มี DB จริง** — ทุกอย่างคือ math บน reference numbers จาก research
2. **Pure functions** → unit test ง่าย (test 92 ทั้งหมด ใน `src/lib/__tests__/`)
3. **Row-by-row generation**: map `nValues[]` เป็น array of `{n, label, pg*, mg*}`
4. **Column-by-column**: แต่ละ column ใน output row = 1 operation × 1 DB
5. **3 tunable inputs** (N, K, M) ควบคุมทุก tab พร้อมกันด้วย useMemo
6. **Storage tab** มี `avgBytes` แยกต่างหาก เพราะขึ้นกับ schema
7. **Growth tab** เดินลูปเดือน 0-12 → chart line 3 เส้น
