# MongoDB vs PostgreSQL - Performance Research

## 1. Execution Time Comparison

### INSERT (single row/document)

| Records | PostgreSQL | MongoDB | Winner |
|---------|-----------|---------|--------|
| 1,000 | ~50-80ms | ~30-60ms | MongoDB |
| 5,000 | ~250-400ms | ~150-300ms | MongoDB |
| 10,000 | ~500-800ms | ~300-600ms | MongoDB |

> MongoDB เร็วกว่าเพราะไม่มี schema validation, ไม่ check constraints, เขียนลง journal ใน memory ก่อน (WiredTiger)
> PostgreSQL ต้อง maintain MVCC tuples, check constraints, update indexes แบบ transactional

### SELECT (full scan, ไม่มี index)

| Records | PostgreSQL | MongoDB | Winner |
|---------|-----------|---------|--------|
| 1,000 | ~1-3ms | ~1-3ms | เสมอ |
| 5,000 | ~3-8ms | ~5-12ms | PostgreSQL |
| 10,000 | ~6-15ms | ~10-25ms | PostgreSQL |

> PostgreSQL sequential scan บน row-based storage เร็วกว่า MongoDB ที่ต้อง deserialize BSON ทุก document

### SELECT with filter (มี index)

| Records | PostgreSQL (B-Tree) | MongoDB (Single field index) | Winner |
|---------|-------------------|---------------------------|--------|
| 1,000 | ~0.1-0.5ms | ~0.1-0.5ms | เสมอ |
| 5,000 | ~0.2-0.8ms | ~0.2-0.8ms | เสมอ |
| 10,000 | ~0.3-1.0ms | ~0.3-1.2ms | เสมอ |

> ทั้งคู่ใช้ B-Tree index → O(log n) เหมือนกัน

### UPDATE (by primary key / _id)

| Records | PostgreSQL | MongoDB | Winner |
|---------|-----------|---------|--------|
| 1,000 | ~0.2-0.5ms | ~0.1-0.4ms | MongoDB |
| 5,000 | ~0.2-0.6ms | ~0.1-0.5ms | MongoDB |
| 10,000 | ~0.3-0.7ms | ~0.2-0.5ms | MongoDB |

> MongoDB ทำ in-place update (ถ้า document size ไม่เปลี่ยน) ไม่มี MVCC overhead
> PostgreSQL สร้าง tuple version ใหม่ทุกครั้งที่ update

### DELETE (by primary key / _id)

| Records | PostgreSQL | MongoDB | Winner |
|---------|-----------|---------|--------|
| 1,000 | ~0.2-0.5ms | ~0.1-0.4ms | MongoDB |
| 5,000 | ~0.2-0.6ms | ~0.1-0.5ms | MongoDB |
| 10,000 | ~0.3-0.7ms | ~0.2-0.5ms | MongoDB |

> PostgreSQL แค่ mark tuples as dead (ต้อง VACUUM ทีหลัง), MongoDB ลบ document ตรงๆ

---

## 2. Index Strategies

### PostgreSQL Indexes

| Index Type | ใช้ทำอะไร | Write Overhead | หมายเหตุ |
|-----------|----------|----------------|----------|
| **B-Tree** (default) | Equality, range, sort, ORDER BY | ~10-20% insert ช้าลง | รองรับ `<`, `>`, `BETWEEN`, `LIKE 'prefix%'` อเนกประสงค์ที่สุด |
| **Hash** | Equality เท่านั้น (`=`) | น้อยกว่า B-Tree | ทำ range query ไม่ได้ เล็กกว่าบน disk |
| **GIN on JSONB** | Containment (`@>`), existence (`?`), key search | ~30-50% insert ช้าลง | 2 แบบ: `jsonb_ops` (ครบ) กับ `jsonb_path_ops` (เล็กกว่า 40-60% เร็วกว่า 20-40%) |

```sql
-- B-Tree index
CREATE INDEX idx_name ON users (name);

-- Hash index
CREATE INDEX idx_email_hash ON users USING HASH (email);

-- GIN on JSONB (default ops - รองรับ @>, ?, ?&, ?|)
CREATE INDEX idx_gin ON users USING GIN (data);

-- GIN on JSONB (path ops - เล็กกว่า เร็วกว่า แต่รองรับแค่ @>)
CREATE INDEX idx_gin_path ON users USING GIN (data jsonb_path_ops);

-- Expression index on specific JSONB path
CREATE INDEX idx_city ON users ((data->'address'->>'city'));
```

### MongoDB Indexes

| Index Type | ใช้ทำอะไร | Write Overhead | หมายเหตุ |
|-----------|----------|----------------|----------|
| **Default _id** | Primary key lookup | มีอยู่เสมอ ~8-10% ของ collection | B-Tree (WiredTiger) ลบไม่ได้ |
| **Single field** | Equality + range บน 1 field | ~10-15% ต่อ index | รองรับ sort บน indexed field |
| **Compound** | Multi-field queries, covered queries | สูงกว่า | ลำดับ field สำคัญ (ESR: Equality, Sort, Range) สูงสุด 32 fields |
| **Text** | Full-text search (`$text`) | ~50%+ insert ช้าลง | 1 text index ต่อ collection |

```javascript
// Single field index
db.users.createIndex({ name: 1 })

// Compound index (ESR rule: Equality, Sort, Range)
db.users.createIndex({ status: 1, createdAt: -1, age: 1 })

// Text index
db.users.createIndex({ name: "text", bio: "text" })

// Index on nested field
db.users.createIndex({ "address.city": 1 })
```

---

## 3. Big O Complexity

### ไม่มี Index

| Operation | PostgreSQL | MongoDB |
|----------|-----------|---------|
| INSERT | O(1) amortized | O(1) amortized |
| SELECT (filter) | **O(n)** full scan | **O(n)** collection scan |
| UPDATE (by field) | O(n) scan + O(1) | O(n) scan + O(1) |
| DELETE (by field) | O(n) scan + O(1) | O(n) scan + O(1) |
| Sort | O(n log n) | O(n log n) * |
| JOIN / $lookup | O(n + m) hash join | O(n * m) $lookup |
| Aggregation | O(n) | O(n) |

> \* MongoDB ถ้า sort result > 100MB จะ fail ต้องใส่ `allowDiskUse: true`

### มี B-Tree / Default Index

| Operation | PostgreSQL | MongoDB |
|----------|-----------|---------|
| SELECT (equality, indexed) | **O(log n)** | **O(log n)** |
| SELECT (range, indexed) | O(log n + k) | O(log n + k) |
| INSERT (มี m indexes) | O(m * log n) | O(m * log n) |
| UPDATE (by PK/_id) | O(log n) + O(m * log n) | O(log n) + O(m * log n) |
| DELETE (by PK/_id) | O(log n) + O(m * log n) | O(log n) + O(m * log n) |
| Covered query (index only) | O(log n) | O(log n) |

> k = จำนวน result ที่ match

### Special: Hash Index

| Operation | PostgreSQL Hash | B-Tree |
|----------|----------------|--------|
| Equality (`=`) | **O(1)** amortized | O(log n) |
| Range (`<`, `>`) | ไม่รองรับ | O(log n + k) |
| Sort | ไม่รองรับ | O(log n) |

---

## 4. JSONB (PostgreSQL) vs BSON (MongoDB)

### เปรียบเทียบ Format

| | PostgreSQL JSONB | MongoDB BSON |
|--|-----------------|-------------|
| Format | Binary, keys sorted | Binary JSON, preserve key order |
| Max size | 1GB per field (TOAST) | 16MB per document |
| Types | JSON standard (string, number, bool, null, array, object) | Extended (Date, ObjectId, Decimal128, Binary, Regex, ...) |

### Query Performance บน Nested Data

ตัวอย่าง: query `address.city = 'Bangkok'` บน 10,000 records

| วิธี | เวลา | หมายเหตุ |
|------|------|----------|
| **PostgreSQL** ไม่มี index | ~8-20ms | Full scan + JSONB decompression ทุกแถว |
| **PostgreSQL** GIN index (jsonb_path_ops) | ~0.3-1ms | GIN lookup เร็วมาก |
| **PostgreSQL** Expression B-Tree index | ~0.2-0.5ms | เร็วสุดถ้ารู้ path แน่นอน |
| **MongoDB** ไม่มี index | ~5-15ms | Native traversal ไม่ต้อง deserialize |
| **MongoDB** single field index | ~0.2-0.5ms | B-Tree บน dotted path |

### เมื่อไหร่ใช้อะไร?

- **ไม่รู้ว่าจะ query field ไหน** → PostgreSQL GIN index (1 index ครอบคลุมทุก key)
- **รู้ query path แน่นอน** → MongoDB single/compound index หรือ PostgreSQL expression index
- **ข้อมูล nested ลึก 3+ ระดับ ไม่มี index** → MongoDB เร็วกว่า (BSON native traversal)
- **ต้อง JOIN JSON กับ relational data** → PostgreSQL ชนะขาด

---

## 5. สรุป: ใช้อะไรดี?

| เงื่อนไข | ใช้อะไร | เหตุผล |
|---------|---------|--------|
| Write-heavy (>70% writes) | **MongoDB** | เร็วกว่า 15-30% |
| Read-heavy + รู้ query pattern | **เท่ากัน** | indexed reads = O(log n) ทั้งคู่ |
| Ad-hoc / analytics query | **PostgreSQL** | query planner + JIT compilation เร็วกว่า 20-50% |
| Mixed relational + document | **PostgreSQL** | JOIN optimization เร็วกว่า 2-5x |
| Horizontal scaling (sharding) | **MongoDB** | native sharding vs ต้องใช้ Citus |
| Schema flexibility สูง | **MongoDB** | schemaless native |
| ACID transactions สำคัญ | **PostgreSQL** | mature, reliable |
| Complex aggregation | **PostgreSQL** | SQL mature กว่า |

---

## 6. References

- benchANT (2023-2024): MongoDB vs PostgreSQL benchmark - benchant.com
- YCSB (Yahoo Cloud Serving Benchmark)
- EnterpriseDB Benchmark (2024): PostgreSQL JSONB vs MongoDB
- Percona (2023): MongoDB vs PostgreSQL JSONB comparison
