# CakeControl — Database Design

> สร้างเมื่อ: 2026-04-08 | อัปเดต: 2026-04-22
> DB: PostgreSQL 16 | ORM: Prisma
> ไม่มี auth ใช้ฟรี

---

## Design Principles

1. **rootid** = UUID, PK จริง ไม่เปลี่ยน ใช้อ้างอิงตลอด
2. **id** = auto-increment integer ใช้เป็น FK ระหว่าง tables (เวลาแก้ data แต่ rootid เดิม อิง id แทน)
3. **Default columns ทุก table**: `rootid`, `id`, `prev_id`, `activate`, `flag`, `modify_datetime`
4. **Date format** = VARCHAR ไม่ใช้ TIMESTAMPTZ → `yyyymmdd_hhmmss` เช่น `20260409_143052`
5. **JSONB** = ใช้สำหรับ dynamic schema
6. **ไม่มี auth** = ใช้ฟรี ไม่มี login

---

## ER Diagram

```
data_schema (1) ──→ (N) view     โชว์ตาราง
data_schema (1) ──→ (N) form     ฟอร์มหน้าตายังไง
data_schema (1) ──→ (N) data     ข้อมูลจริง
```

```
              view (โชว์ตาราง)
                 ↑ N:1
  data    ←── data_schema ──→  form
  N:1            (1)            N:1
ข้อมูลจริง    มี field อะไร   ฟอร์มจัดวางยังไง
```

---

## Tables

### 1. data_schema (Schema ของ data)

หน้าที่หลัก: เก็บ format ของ databind ว่า field ไหนเป็น type อะไร

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| rootid | UUID | PK, DEFAULT gen_random_uuid() | id แม่ (ไม่เปลี่ยน) |
| id | SERIAL | UNIQUE, NOT NULL | Display ID + ใช้เป็น FK |
| prev_id | INT | FK → data_schema(id), NULLABLE | lineage (version ก่อนหน้า) |
| name | VARCHAR(255) | NOT NULL | ชื่อ schema |
| json | JSONB | NOT NULL DEFAULT '{}' | field definitions (key + type) |
| flag | VARCHAR(50) | DEFAULT 'draft' | draft / published / archived |
| activate | BOOLEAN | DEFAULT true | soft delete (d = default) |
| modify_datetime | VARCHAR(15) | | `yyyymmdd_hhmmss` |

```sql
CREATE TABLE data_schema (
    rootid              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id                  SERIAL UNIQUE NOT NULL,
    prev_id             INT REFERENCES data_schema(id),
    name                VARCHAR(255) NOT NULL,
    json                JSONB NOT NULL DEFAULT '{}',
    flag                VARCHAR(50) DEFAULT 'draft',
    activate            BOOLEAN DEFAULT true,
    modify_datetime     VARCHAR(15)
);

CREATE INDEX idx_data_schema_flag ON data_schema(flag);
CREATE INDEX idx_data_schema_prev ON data_schema(prev_id);
```

**json format** (เช็ค format ของ databind):
```json
{
    "fname": { "type": "string" },
    "age": { "type": "number" },
    "birthday": { "type": "yymmdd" },
    "start_time": { "type": "hhmm" },
    "created_at": { "type": "yymmddhhmmhh" }
}
```

**Supported types**:
| type | description |
|------|-----------|
| string | ข้อความ |
| number | ตัวเลข |
| yymmdd | วันที่ (ปีเดือนวัน) |
| hhmm | เวลา (ชั่วโมงนาที) |
| yymmddhhmmhh | วันที่+เวลา |

**Versioning flow (prev_id อิง id)**:
```
schema v1 (id: 1, prev_id: null)
    ↑
schema v2 (id: 2, prev_id: 1)
    ↑
schema v3 (id: 3, prev_id: 2)  ← current
```

---

### 2. data (Data จริงๆ)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| rootid | UUID | PK | id แม่ |
| id | SERIAL | UNIQUE | Display ID |
| prev_id | INT | FK → data(id), NULLABLE | lineage |
| data_schema_id | INT | FK → data_schema(id), NOT NULL | fk schema |
| data | JSONB | NOT NULL DEFAULT '{}' | ข้อมูลจริง |
| flag | VARCHAR(50) | DEFAULT 'active' | active / archived |
| activate | BOOLEAN | DEFAULT true | soft delete (d) |
| modify_datetime | VARCHAR(15) | | `yyyymmdd_hhmmss` |

```sql
CREATE TABLE data (
    rootid              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id                  SERIAL UNIQUE NOT NULL,
    prev_id             INT REFERENCES data(id),
    data_schema_id      INT NOT NULL REFERENCES data_schema(id),
    data                JSONB NOT NULL DEFAULT '{}',
    flag                VARCHAR(50) DEFAULT 'active',
    activate            BOOLEAN DEFAULT true,
    modify_datetime     VARCHAR(15)
);

CREATE INDEX idx_data_schema ON data(data_schema_id);
CREATE INDEX idx_data_activate ON data(activate);
CREATE INDEX idx_data_json ON data USING GIN(data);
```

**data example**:
```json
{
    "fname": "xxx",
    "age": 28
}
```

---

### 3. view (หน้าตาแถว record ที่ไปแสดงบนตาราง)

CakeControl ตัว table view — ต้องพยายาม map เช่น เพศก่อนหน้านี้เป็น string ชาย หญิง แล้วอยากเป็น 0 1

> **หมายเหตุ**: field format schema id ไม่ตรงบอกมีการ update — เอาง่ายๆ ตอนนี้แสดงเป็น string ไปก่อน

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| rootid | UUID | PK | id แม่ |
| id | SERIAL | UNIQUE | Display ID |
| prev_id | INT | FK → view(id), NULLABLE | lineage |
| data_schema_id | INT | FK → data_schema(id), NOT NULL | fk schema |
| view_type | VARCHAR(50) | NOT NULL | 'table' *(เก็บไว้ก่อน — อาจลบทีหลัง)* |
| name | VARCHAR(255) | | ชื่อ view *(เก็บไว้ก่อน — อาจลบทีหลัง)* |
| json_table_config | JSONB | NOT NULL DEFAULT '{}' | columns config |
| flag | VARCHAR(50) | DEFAULT 'draft' | draft / published |
| activate | BOOLEAN | DEFAULT true | soft delete (d) |
| modify_datetime | VARCHAR(15) | | `yyyymmdd_hhmmss` |

```sql
CREATE TABLE view (
    rootid              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id                  SERIAL UNIQUE NOT NULL,
    prev_id             INT REFERENCES view(id),
    data_schema_id      INT NOT NULL REFERENCES data_schema(id),
    view_type           VARCHAR(50) NOT NULL,
    name                VARCHAR(255),
    json_table_config   JSONB NOT NULL DEFAULT '{}',
    flag                VARCHAR(50) DEFAULT 'draft',
    activate            BOOLEAN DEFAULT true,
    modify_datetime     VARCHAR(15)
);

CREATE INDEX idx_view_schema ON view(data_schema_id);
CREATE INDEX idx_view_type ON view(view_type);
```

**json_table_config format** (table columns config):
```json
{
    "columns": [
        { "key": "fname", "header": "ชื่อ", "width": "auto", "sortable": true },
        { "key": "age", "header": "อายุ", "width": "80", "sortable": true }
    ]
}
```

---

### 4. form (หน้าตา form บันทึก)

FK `data_id` ชี้ไปที่ `data_schema(id)` — form config เป็น per-schema ไม่ใช่ per-record

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| rootid | UUID | PK | id แม่ |
| id | SERIAL | UNIQUE | Display ID |
| prev_id | INT | FK → form(id), NULLABLE | lineage |
| data_id | INT | FK → data_schema(id), NOT NULL | fk schema |
| name | VARCHAR(255) | | ชื่อ form config |
| json_form_config | JSONB | NOT NULL DEFAULT '{}' | form layout config |
| flag | VARCHAR(50) | DEFAULT 'draft' | draft / published |
| activate | BOOLEAN | DEFAULT true | soft delete (d) |
| modify_datetime | VARCHAR(15) | | `yyyymmdd_hhmmss` |

```sql
CREATE TABLE form (
    rootid              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id                  SERIAL UNIQUE NOT NULL,
    prev_id             INT REFERENCES form(id),
    data_id             INT NOT NULL REFERENCES data_schema(id),
    name                VARCHAR(255),
    json_form_config    JSONB NOT NULL DEFAULT '{}',
    flag                VARCHAR(50) DEFAULT 'draft',
    activate            BOOLEAN DEFAULT true,
    modify_datetime     VARCHAR(15)
);

CREATE INDEX idx_form_data ON form(data_id);
```

**json_form_config format** (form layout):
```json
{
    "colnumbers": 6,
    "controls": [
        { "key": "fname", "label": "ชื่อ-นามสกุล", "colno": 1, "rowno": 1, "colspan": 6, "placeholder": "กรอกชื่อ" },
        { "key": "age", "label": "อายุ", "colno": 1, "rowno": 2, "colspan": 3 }
    ]
}
```

---

## Flow

```
data_schema (เช็ค format: fname=string, age=number)
     ↓
view (โชว์ตารางยังไง: json_table_config)
form (ฟอร์มหน้าตายังไง: json_form_config)
     ↓ generate
json_table_config → CRUDControl → TableviewControl
json_form_config  → CRUDControl → FormControl + ModalControl
     ↓
data (เก็บข้อมูลจริง)
```

---

## Default Columns (ทุก table)

| Column | Type | Description |
|--------|------|-------------|
| rootid | UUID | PK id แม่ ไม่เปลี่ยน |
| id | SERIAL | auto-increment ใช้เป็น FK + display |
| prev_id | INT | lineage (version ก่อนหน้า อิง id) |
| activate | BOOLEAN | soft delete (d) |
| flag | VARCHAR(50) | สถานะ (draft/published/active/archived) |
| modify_datetime | VARCHAR(15) | `yyyymmdd_hhmmss` เช่น `20260409_143052` |

---

## Summary

| Table | หน้าที่ | JSONB column | FK อิง |
|-------|--------|-------------|--------|
| data_schema | เช็ค format (key + type) | json (field defs) | - |
| data | ข้อมูลจริง | data (form entries) | data_schema.id via `data_schema_id` |
| view | โชว์ตาราง | json_table_config | data_schema.id via `data_schema_id` |
| form | form config (label, layout) | json_form_config | data_schema.id via `data_id` |
