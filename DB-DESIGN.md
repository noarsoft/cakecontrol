# CakeControl — Database Design

> สร้างเมื่อ: 2026-04-08 | อัปเดต: 2026-04-09
> DB: PostgreSQL 16 | ORM: Prisma
> ไม่มี auth ใช้ฟรี

---

## Design Principles

1. **root_id** = UUID, PK จริง ไม่เปลี่ยน ใช้อ้างอิงตลอด
2. **id** = auto-increment integer ใช้เป็น FK ระหว่าง tables (เวลาแก้ data แต่ root_id เดิม อิง id แทน)
3. **Default columns ทุก table**: `root_id`, `id`, `previous_id`, `activate`, `flag`, `modified_date_time`
4. **Date format** = VARCHAR ไม่ใช้ TIMESTAMPTZ → `yyyymmdd_hhmmss` เช่น `20260409_143052`
5. **JSONB** = ใช้สำหรับ dynamic schema
6. **ไม่มี auth** = ใช้ฟรี ไม่มี login

---

## ER Diagram

```
data_schema (1) ──→ (N) data_view       โชว์ตาราง
data_schema (1) ──→ (N) data_formcfg    ฟอร์มหน้าตายังไง
data_schema (1) ──→ (N) data_form       ข้อมูลจริง
```

```
              data_view (โชว์ตาราง)
                 ↑ N:1
data_form ←── data_schema ──→ data_formcfg
  N:1            (1)              N:1
ข้อมูลจริง    มี field อะไร    ฟอร์มจัดวางยังไง
```

---

## Tables

### 1. data_schema (เช็ค format ของ data)

หน้าที่หลัก: เก็บ format ของ databind ว่า field ไหนเป็น type อะไร

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK, DEFAULT gen_random_uuid() | Primary key (ไม่เปลี่ยน) |
| id | SERIAL | UNIQUE, NOT NULL | Display ID + ใช้เป็น FK |
| previous_id | INT | FK → data_schema(id), NULLABLE | version ก่อนหน้า |
| name | VARCHAR(255) | NOT NULL | ชื่อ schema |
| json | JSONB | NOT NULL DEFAULT '{}' | field definitions (key + type) |
| flag | VARCHAR(50) | DEFAULT 'draft' | draft / published / archived |
| activate | BOOLEAN | DEFAULT true | soft delete |
| modified_date_time | VARCHAR(15) | | `yyyymmdd_hhmmss` |

```sql
CREATE TABLE data_schema (
    root_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id                  SERIAL UNIQUE NOT NULL,
    previous_id         INT REFERENCES data_schema(id),
    name                VARCHAR(255) NOT NULL,
    json                JSONB NOT NULL DEFAULT '{}',
    flag                VARCHAR(50) DEFAULT 'draft',
    activate            BOOLEAN DEFAULT true,
    modified_date_time  VARCHAR(15)
);

CREATE INDEX idx_data_schema_flag ON data_schema(flag);
CREATE INDEX idx_data_schema_previous ON data_schema(previous_id);
```

**json format** (เช็ค format ของ databind):
```json
{
    "name": { "type": "string" },
    "age": { "type": "number" },
    "role": { "type": "string", "enum": ["admin", "user", "guest"] },
    "is_active": { "type": "boolean" },
    "join_date": { "type": "date" },
    "email": { "type": "email" }
}
```

**Supported types**:
| type | description |
|------|-----------|
| string | ข้อความ |
| number | ตัวเลข |
| boolean | true/false |
| date | วันที่ |
| email | อีเมล |
| file | ไฟล์ |
| array | array ของ items |

**Versioning flow (previous_id อิง id)**:
```
schema v1 (id: 1, previous_id: null)
    ↑
schema v2 (id: 2, previous_id: 1)
    ↑
schema v3 (id: 3, previous_id: 2)  ← current
```

---

### 2. data_view (โชว์ตารางอย่างเดียว)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK | Primary key |
| id | SERIAL | UNIQUE | Display ID |
| previous_id | INT | FK → data_view(id), NULLABLE | version ก่อนหน้า |
| fk_data_schema | INT | FK → data_schema(id), NOT NULL | schema ที่ใช้ (อิง id) |
| view_type | VARCHAR(50) | NOT NULL | 'table' |
| name | VARCHAR(255) | | ชื่อ view |
| json | JSONB | NOT NULL DEFAULT '{}' | columns config |
| flag | VARCHAR(50) | DEFAULT 'draft' | draft / published |
| activate | BOOLEAN | DEFAULT true | soft delete |
| modified_date_time | VARCHAR(15) | | `yyyymmdd_hhmmss` |

```sql
CREATE TABLE data_view (
    root_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id                  SERIAL UNIQUE NOT NULL,
    previous_id         INT REFERENCES data_view(id),
    fk_data_schema      INT NOT NULL REFERENCES data_schema(id),
    view_type           VARCHAR(50) NOT NULL,
    name                VARCHAR(255),
    json                JSONB NOT NULL DEFAULT '{}',
    flag                VARCHAR(50) DEFAULT 'draft',
    activate            BOOLEAN DEFAULT true,
    modified_date_time  VARCHAR(15)
);

CREATE INDEX idx_data_view_schema ON data_view(fk_data_schema);
CREATE INDEX idx_data_view_type ON data_view(view_type);
```

**json format** (table columns config):
```json
{
    "columns": [
        { "key": "name", "header": "ชื่อ", "width": "auto", "sortable": true },
        { "key": "role", "header": "สิทธิ์", "width": "100", "sortable": true, "type": "badge" },
        { "key": "age", "header": "อายุ", "width": "80", "sortable": true }
    ]
}
```

---

### 3. data_formcfg (form config — ฟอร์มหน้าตายังไง)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK | Primary key |
| id | SERIAL | UNIQUE | Display ID |
| previous_id | INT | FK → data_formcfg(id), NULLABLE | version ก่อนหน้า |
| fk_data_schema | INT | FK → data_schema(id), NOT NULL | schema ที่ใช้ (อิง id) |
| name | VARCHAR(255) | | ชื่อ form config |
| json | JSONB | NOT NULL DEFAULT '{}' | form layout config |
| flag | VARCHAR(50) | DEFAULT 'draft' | draft / published |
| activate | BOOLEAN | DEFAULT true | soft delete |
| modified_date_time | VARCHAR(15) | | `yyyymmdd_hhmmss` |

```sql
CREATE TABLE data_formcfg (
    root_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id                  SERIAL UNIQUE NOT NULL,
    previous_id         INT REFERENCES data_formcfg(id),
    fk_data_schema      INT NOT NULL REFERENCES data_schema(id),
    name                VARCHAR(255),
    json                JSONB NOT NULL DEFAULT '{}',
    flag                VARCHAR(50) DEFAULT 'draft',
    activate            BOOLEAN DEFAULT true,
    modified_date_time  VARCHAR(15)
);

CREATE INDEX idx_data_formcfg_schema ON data_formcfg(fk_data_schema);
```

**json format** (form layout):
```json
{
    "colnumbers": 6,
    "controls": [
        { "key": "name", "label": "ชื่อ-นามสกุล", "colno": 1, "rowno": 1, "colspan": 6, "placeholder": "กรอกชื่อ" },
        { "key": "role", "label": "สิทธิ์", "colno": 1, "rowno": 2, "colspan": 3 },
        { "key": "age", "label": "อายุ", "colno": 4, "rowno": 2, "colspan": 3 }
    ]
}
```

---

### 4. data_form (ข้อมูลจริงที่กรอก)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK | Primary key |
| id | SERIAL | UNIQUE | Display ID |
| previous_id | INT | FK → data_form(id), NULLABLE | version ก่อนหน้า |
| fk_data_schema | INT | FK → data_schema(id), NOT NULL | schema ที่ใช้ (อิง id) |
| data | JSONB | NOT NULL DEFAULT '{}' | ข้อมูลที่กรอก |
| flag | VARCHAR(50) | DEFAULT 'active' | active / archived |
| activate | BOOLEAN | DEFAULT true | soft delete |
| modified_date_time | VARCHAR(15) | | `yyyymmdd_hhmmss` |

```sql
CREATE TABLE data_form (
    root_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id                  SERIAL UNIQUE NOT NULL,
    previous_id         INT REFERENCES data_form(id),
    fk_data_schema      INT NOT NULL REFERENCES data_schema(id),
    data                JSONB NOT NULL DEFAULT '{}',
    flag                VARCHAR(50) DEFAULT 'active',
    activate            BOOLEAN DEFAULT true,
    modified_date_time  VARCHAR(15)
);

CREATE INDEX idx_data_form_schema ON data_form(fk_data_schema);
CREATE INDEX idx_data_form_data ON data_form USING GIN(data);
CREATE INDEX idx_data_form_activate ON data_form(activate);
```

**data example**:
```json
{
    "name": "สมชาย ใจดี",
    "role": "admin",
    "age": 28,
    "is_active": true
}
```

**query example**:
```sql
SELECT * FROM data_form
WHERE fk_data_schema = 1
AND data->>'role' = 'admin'
AND activate = true;
```

---

## Flow

```
data_schema (เช็ค format: name=string, age=number)
     ↓
data_view (โชว์ตารางยังไง: columns config)
data_formcfg (ฟอร์มหน้าตายังไง: label, layout)
     ↓ generate
columns config → CRUDControl → TableviewControl
formConfig     → CRUDControl → FormControl + ModalControl
     ↓
data_form (เก็บข้อมูลจริง)
```

---

## Default Columns (ทุก table)

| Column | Type | Description |
|--------|------|-------------|
| root_id | UUID | PK ไม่เปลี่ยน |
| id | SERIAL | auto-increment ใช้เป็น FK + display |
| previous_id | INT | version ก่อนหน้า (อิง id) |
| activate | BOOLEAN | soft delete |
| flag | VARCHAR(50) | สถานะ (draft/published/active/archived) |
| modified_date_time | VARCHAR(15) | `yyyymmdd_hhmmss` เช่น `20260409_143052` |

---

## Summary

| Table | หน้าที่ | JSONB | FK อิง |
|-------|--------|-------|--------|
| data_schema | เช็ค format (key + type) | json (field defs) | - |
| data_view | โชว์ตาราง | json (columns config) | data_schema.id |
| data_formcfg | form config (label, layout) | json (form layout) | data_schema.id |
| data_form | ข้อมูลจริง | data (form entries) | data_schema.id |
