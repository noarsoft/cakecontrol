# CakeControl — Database Design

> สร้างเมื่อ: 2026-04-08
> DB: PostgreSQL 16 | ORM: Prisma
> Pattern: root_id (UUID PK), id (auto-increment display ID), soft delete via activate flag

---

## Design Principles

1. **root_id** = UUID, เป็น PK จริง ใช้ใน FK ทั้งหมด — ไม่ใช้ auto-increment ID เป็น FK
2. **id** = auto-increment integer สำหรับแสดงผล / อ้างอิงง่ายๆ
3. **Soft delete** = `activate` boolean (true = active, false = deleted)
4. **Audit** = `modified_date` ทุกตาราง, `created_date` ตารางหลัก
5. **JSONB** = ใช้สำหรับ dynamic schema (form builder) เท่านั้น ไม่ใช้แทน normalized columns
6. **Naming** = suffix `x` ตาม convention: `userx`, `groupx`, `rolex`, `appx`

---

## ER Diagram

```
┌─────────┐    M:M     ┌──────────────┐    M:M     ┌─────────┐
│  userx  │◄──────────►│ groupx_userx │◄──────────►│  groupx │
└────┬────┘            └──────────────┘            └─────────┘
     │
     │ M:M
     ▼
┌──────────────┐    M:M     ┌─────────┐
│ userx_rolex  │◄──────────►│  rolex  │
└──────┬───────┘            └─────────┘
       │
       │ FK
       ▼
┌─────────┐
│  appx   │
└─────────┘

┌─────────┐
│registerx│──► FK userx
└─────────┘

┌─────────────┐     1:N     ┌────────────┐     1:N     ┌───────────┐
│ data_schema │◄───────────►│ data_view  │             │ data_form │
│             │◄────────────────────────────────────────│           │
└─────────────┘                                        └───────────┘

┌─────────────┐
│ file_upload │
└─────────────┘
```

---

## Tables

### 1. userx (ผู้ใช้)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK, DEFAULT gen_random_uuid() | Primary key |
| id | SERIAL | UNIQUE, NOT NULL | Display ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | อีเมล |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hash |
| is_power_user | BOOLEAN | DEFAULT false | Super admin flag |
| activate | BOOLEAN | DEFAULT true | Soft delete |
| created_date | TIMESTAMPTZ | DEFAULT now() | วันที่สร้าง |
| modified_date | TIMESTAMPTZ | DEFAULT now() | วันที่แก้ไขล่าสุด |

```sql
CREATE TABLE userx (
    root_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id            SERIAL UNIQUE NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_power_user BOOLEAN DEFAULT false,
    activate      BOOLEAN DEFAULT true,
    created_date  TIMESTAMPTZ DEFAULT now(),
    modified_date TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_userx_email ON userx(email);
CREATE INDEX idx_userx_activate ON userx(activate);
```

**API endpoints**: `GET/POST /userx`, `GET/PATCH/DELETE /userx/root/:rootId`

---

### 2. groupx (กลุ่ม)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK | Primary key |
| id | SERIAL | UNIQUE | Display ID |
| group_key | VARCHAR(100) | UNIQUE, NOT NULL | Key สำหรับอ้างอิง |
| name | VARCHAR(255) | NOT NULL | ชื่อกลุ่ม |
| description | TEXT | | คำอธิบาย |
| activate | BOOLEAN | DEFAULT true | Soft delete |
| created_date | TIMESTAMPTZ | DEFAULT now() | |
| modified_date | TIMESTAMPTZ | DEFAULT now() | |

```sql
CREATE TABLE groupx (
    root_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id            SERIAL UNIQUE NOT NULL,
    group_key     VARCHAR(100) UNIQUE NOT NULL,
    name          VARCHAR(255) NOT NULL,
    description   TEXT,
    activate      BOOLEAN DEFAULT true,
    created_date  TIMESTAMPTZ DEFAULT now(),
    modified_date TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_groupx_group_key ON groupx(group_key);
```

**API endpoints**: `GET/POST /groupx`, `GET/PATCH/DELETE /groupx/:rootId`

---

### 3. rolex (สิทธิ์/บทบาท)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK | Primary key |
| id | SERIAL | UNIQUE | Display ID |
| role_key | VARCHAR(100) | UNIQUE, NOT NULL | Key สำหรับอ้างอิง |
| name | VARCHAR(255) | NOT NULL | ชื่อ role |
| description | TEXT | | คำอธิบาย |
| perms_schema | JSONB | DEFAULT '[]' | สิทธิ์เข้าถึง schema |
| perms_service | JSONB | DEFAULT '[]' | สิทธิ์เข้าถึง service/API |
| activate | BOOLEAN | DEFAULT true | |
| created_date | TIMESTAMPTZ | DEFAULT now() | |
| modified_date | TIMESTAMPTZ | DEFAULT now() | |

```sql
CREATE TABLE rolex (
    root_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id            SERIAL UNIQUE NOT NULL,
    role_key      VARCHAR(100) UNIQUE NOT NULL,
    name          VARCHAR(255) NOT NULL,
    description   TEXT,
    perms_schema  JSONB DEFAULT '[]',
    perms_service JSONB DEFAULT '[]',
    activate      BOOLEAN DEFAULT true,
    created_date  TIMESTAMPTZ DEFAULT now(),
    modified_date TIMESTAMPTZ DEFAULT now()
);
```

**perms_schema example**:
```json
["data_schema:read", "data_schema:write", "data_form:read"]
```

**perms_service example**:
```json
["userx:read", "userx:write", "groupx:read"]
```

---

### 4. appx (แอปพลิเคชัน)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK | Primary key |
| id | SERIAL | UNIQUE | Display ID |
| name | VARCHAR(255) | NOT NULL | ชื่อแอป |
| description | TEXT | | คำอธิบาย |
| activate | BOOLEAN | DEFAULT true | |
| created_date | TIMESTAMPTZ | DEFAULT now() | |
| modified_date | TIMESTAMPTZ | DEFAULT now() | |

```sql
CREATE TABLE appx (
    root_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id            SERIAL UNIQUE NOT NULL,
    name          VARCHAR(255) NOT NULL,
    description   TEXT,
    activate      BOOLEAN DEFAULT true,
    created_date  TIMESTAMPTZ DEFAULT now(),
    modified_date TIMESTAMPTZ DEFAULT now()
);
```

---

### 5. groupx_userx (Junction: User ↔ Group)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK | Primary key |
| userx_root_id | UUID | FK → userx, NOT NULL | |
| groupx_root_id | UUID | FK → groupx, NOT NULL | |
| created_date | TIMESTAMPTZ | DEFAULT now() | |
| modified_date | TIMESTAMPTZ | DEFAULT now() | |

```sql
CREATE TABLE groupx_userx (
    root_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userx_root_id  UUID NOT NULL REFERENCES userx(root_id) ON DELETE CASCADE,
    groupx_root_id UUID NOT NULL REFERENCES groupx(root_id) ON DELETE CASCADE,
    created_date   TIMESTAMPTZ DEFAULT now(),
    modified_date  TIMESTAMPTZ DEFAULT now(),
    UNIQUE(userx_root_id, groupx_root_id)
);

CREATE INDEX idx_groupx_userx_user ON groupx_userx(userx_root_id);
CREATE INDEX idx_groupx_userx_group ON groupx_userx(groupx_root_id);
```

**API endpoints**:
- `POST /groupx-userx` — เพิ่ม user เข้า group
- `DELETE /groupx-userx/root/:rootId` — ลบ membership
- `GET /groupx-userx/user/:rootId/details` — groups ของ user
- `GET /groupx-userx/group/:rootId/members` — members ของ group

---

### 6. userx_rolex (Junction: User ↔ Role ↔ App)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK | Primary key |
| userx_root_id | UUID | FK → userx, NOT NULL | |
| rolex_root_id | UUID | FK → rolex, NOT NULL | |
| appx_root_id | UUID | FK → appx, NOT NULL | role ใช้กับ app ไหน |
| created_date | TIMESTAMPTZ | DEFAULT now() | |
| modified_date | TIMESTAMPTZ | DEFAULT now() | |

```sql
CREATE TABLE userx_rolex (
    root_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userx_root_id  UUID NOT NULL REFERENCES userx(root_id) ON DELETE CASCADE,
    rolex_root_id  UUID NOT NULL REFERENCES rolex(root_id) ON DELETE CASCADE,
    appx_root_id   UUID NOT NULL REFERENCES appx(root_id) ON DELETE CASCADE,
    created_date   TIMESTAMPTZ DEFAULT now(),
    modified_date  TIMESTAMPTZ DEFAULT now(),
    UNIQUE(userx_root_id, rolex_root_id, appx_root_id)
);

CREATE INDEX idx_userx_rolex_user ON userx_rolex(userx_root_id);
CREATE INDEX idx_userx_rolex_role ON userx_rolex(rolex_root_id);
```

**API endpoints**:
- `POST /userx-rolex` — assign role ให้ user ใน app
- `DELETE /userx-rolex/root/:rootId`
- `GET /userx-rolex/user/:rootId/details`

---

### 7. registerx (คำขอสมัคร)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK | Primary key |
| id | SERIAL | UNIQUE | Display ID |
| userx_root_id | UUID | FK → userx | link กับ user ที่สร้าง |
| first_name | VARCHAR(255) | | |
| last_name | VARCHAR(255) | | |
| display_name | VARCHAR(255) | | |
| reason | TEXT | | เหตุผลที่สมัคร |
| consent | BOOLEAN | DEFAULT false | ยอมรับเงื่อนไข |
| status | VARCHAR(50) | DEFAULT 'pending' | pending / approved / rejected |
| created_date | TIMESTAMPTZ | DEFAULT now() | |
| modified_date | TIMESTAMPTZ | DEFAULT now() | |

```sql
CREATE TABLE registerx (
    root_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id             SERIAL UNIQUE NOT NULL,
    userx_root_id  UUID REFERENCES userx(root_id),
    first_name     VARCHAR(255),
    last_name      VARCHAR(255),
    display_name   VARCHAR(255),
    reason         TEXT,
    consent        BOOLEAN DEFAULT false,
    status         VARCHAR(50) DEFAULT 'pending',
    created_date   TIMESTAMPTZ DEFAULT now(),
    modified_date  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_registerx_status ON registerx(status);
```

---

## Form Builder Tables

### 8. data_schema (โครงสร้าง field)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK | Primary key (ไม่เปลี่ยน ใช้อ้างอิงตลอด) |
| id | SERIAL | UNIQUE | Display ID |
| previous_id | UUID | FK → data_schema(root_id), NULLABLE | version ก่อนหน้า (linked list) |
| name | VARCHAR(255) | NOT NULL | ชื่อ schema |
| json | JSONB | NOT NULL DEFAULT '[]' | field definitions |
| flag | VARCHAR(50) | DEFAULT 'draft' | draft / published / archived |
| activate | BOOLEAN | DEFAULT true | |
| created_date | TIMESTAMPTZ | DEFAULT now() | |
| modified_date | TIMESTAMPTZ | DEFAULT now() | |

```sql
CREATE TABLE data_schema (
    root_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id            SERIAL UNIQUE NOT NULL,
    previous_id   UUID REFERENCES data_schema(root_id),
    name          VARCHAR(255) NOT NULL,
    json          JSONB NOT NULL DEFAULT '[]',
    flag          VARCHAR(50) DEFAULT 'draft',
    activate      BOOLEAN DEFAULT true,
    created_date  TIMESTAMPTZ DEFAULT now(),
    modified_date TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_data_schema_flag ON data_schema(flag);
CREATE INDEX idx_data_schema_previous ON data_schema(previous_id);
```

**json field format** (field definitions):
```json
[
    {
        "key": "name",
        "type": "textbox",
        "label": "ชื่อ-นามสกุล",
        "required": true,
        "placeholder": "กรอกชื่อ",
        "validation": { "minLength": 2, "maxLength": 100 }
    },
    {
        "key": "role",
        "type": "select",
        "label": "สิทธิ์",
        "required": true,
        "options": [
            { "value": "admin", "label": "Admin" },
            { "value": "user", "label": "User" }
        ]
    },
    {
        "key": "age",
        "type": "number",
        "label": "อายุ",
        "validation": { "min": 0, "max": 200 }
    },
    {
        "key": "is_active",
        "type": "toggle",
        "label": "สถานะ",
        "defaultValue": true
    }
]
```

**Supported field types**:
| type | validation | options |
|------|-----------|---------|
| textbox | minLength, maxLength, pattern | - |
| number | min, max, step | - |
| select | - | options: [{value, label}] |
| checkbox | - | - |
| toggle | - | - |
| date | minDate, maxDate | - |
| password | minLength | - |
| boolean | - | - |
| email | - | - |
| file | maxSize, accept | - |
| array | minItems, maxItems | items (nested field def) |

**Versioning flow (previous_id)**:
```
schema v1 (root_id: aaa, previous_id: null)
    ↑
schema v2 (root_id: bbb, previous_id: aaa)
    ↑
schema v3 (root_id: ccc, previous_id: bbb)  ← current

Query latest: WHERE previous_id IS NOT NULL ORDER BY created_date DESC
Query history: recursive CTE follow previous_id chain
```

---

### 9. data_view (การแสดงผล)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK | Primary key |
| id | SERIAL | UNIQUE | Display ID |
| fk_data_schema | UUID | FK → data_schema(root_id), NOT NULL | schema ที่ใช้ |
| view_type | VARCHAR(50) | NOT NULL | 'table' หรือ 'form' |
| name | VARCHAR(255) | | ชื่อ view |
| json | JSONB | NOT NULL DEFAULT '{}' | view config |
| created_date | TIMESTAMPTZ | DEFAULT now() | |
| modified_date | TIMESTAMPTZ | DEFAULT now() | |

```sql
CREATE TABLE data_view (
    root_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id              SERIAL UNIQUE NOT NULL,
    fk_data_schema  UUID NOT NULL REFERENCES data_schema(root_id),
    view_type       VARCHAR(50) NOT NULL,
    name            VARCHAR(255),
    json            JSONB NOT NULL DEFAULT '{}',
    created_date    TIMESTAMPTZ DEFAULT now(),
    modified_date   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_data_view_schema ON data_view(fk_data_schema);
CREATE INDEX idx_data_view_type ON data_view(view_type);
```

**view_type = 'table'** (json format):
```json
{
    "columns": [
        { "key": "name", "header": "ชื่อ", "width": "auto", "sortable": true },
        { "key": "role", "header": "สิทธิ์", "width": "100", "sortable": true, "type": "badge" },
        { "key": "age", "header": "อายุ", "width": "80", "sortable": true }
    ]
}
```

**view_type = 'form'** (json format):
```json
{
    "colnumbers": 6,
    "controls": [
        { "key": "name", "colno": 1, "rowno": 1, "colspan": 6 },
        { "key": "role", "colno": 1, "rowno": 2, "colspan": 3 },
        { "key": "age", "colno": 4, "rowno": 2, "colspan": 3 }
    ]
}
```

→ FE ใช้ `schemaToFormConfig(schema, view)` รวม field defs + layout เป็น config สำหรับ CRUDControl

---

### 10. data_form (ข้อมูลจริงที่กรอก)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK | Primary key |
| id | SERIAL | UNIQUE | Display ID |
| fk_data_schema | UUID | FK → data_schema(root_id), NOT NULL | schema ที่ใช้ |
| data | JSONB | NOT NULL DEFAULT '{}' | ข้อมูลที่กรอก |
| created_by | UUID | FK → userx(root_id), NULLABLE | ใครกรอก |
| created_date | TIMESTAMPTZ | DEFAULT now() | |
| modified_date | TIMESTAMPTZ | DEFAULT now() | |

```sql
CREATE TABLE data_form (
    root_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id              SERIAL UNIQUE NOT NULL,
    fk_data_schema  UUID NOT NULL REFERENCES data_schema(root_id),
    data            JSONB NOT NULL DEFAULT '{}',
    created_by      UUID REFERENCES userx(root_id),
    created_date    TIMESTAMPTZ DEFAULT now(),
    modified_date   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_data_form_schema ON data_form(fk_data_schema);
CREATE INDEX idx_data_form_created_by ON data_form(created_by);
CREATE INDEX idx_data_form_data ON data_form USING GIN(data);
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

**GIN index** บน `data` column ทำให้ query JSONB ได้เร็ว:
```sql
-- ค้นหาตาม field value
SELECT * FROM data_form
WHERE fk_data_schema = 'xxx'
AND data->>'role' = 'admin';

-- ค้นหา full-text ใน JSONB
SELECT * FROM data_form
WHERE fk_data_schema = 'xxx'
AND data::text ILIKE '%สมชาย%';
```

---

### 11. file_upload (ไฟล์อัพโหลด)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| root_id | UUID | PK | Primary key |
| id | SERIAL | UNIQUE | Display ID |
| filename | VARCHAR(500) | NOT NULL | ชื่อไฟล์ |
| upload_token | UUID | UNIQUE, NOT NULL | token สำหรับ chunked upload |
| status | VARCHAR(50) | DEFAULT 'initiated' | initiated / uploading / finalized / cancelled |
| path | VARCHAR(1000) | | path บน storage |
| file_size | BIGINT | | ขนาดไฟล์ (bytes) |
| mime_type | VARCHAR(255) | | MIME type |
| total_parts | INTEGER | | จำนวน chunks ทั้งหมด |
| uploaded_parts | INTEGER | DEFAULT 0 | chunks ที่ upload แล้ว |
| uploaded_by | UUID | FK → userx(root_id) | ใคร upload |
| created_date | TIMESTAMPTZ | DEFAULT now() | |
| modified_date | TIMESTAMPTZ | DEFAULT now() | |

```sql
CREATE TABLE file_upload (
    root_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id             SERIAL UNIQUE NOT NULL,
    filename       VARCHAR(500) NOT NULL,
    upload_token   UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    status         VARCHAR(50) DEFAULT 'initiated',
    path           VARCHAR(1000),
    file_size      BIGINT,
    mime_type      VARCHAR(255),
    total_parts    INTEGER,
    uploaded_parts INTEGER DEFAULT 0,
    uploaded_by    UUID REFERENCES userx(root_id),
    created_date   TIMESTAMPTZ DEFAULT now(),
    modified_date  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_file_upload_token ON file_upload(upload_token);
CREATE INDEX idx_file_upload_status ON file_upload(status);
```

**API flow**:
```
POST /fileupload/initiate        → { uploadToken }
POST /fileupload/:token/chunk    → upload each part (base64)
POST /fileupload/:token/finalize → assemble + mark finalized
POST /fileupload/:token/cancel   → cleanup
```

---

## Prisma Schema (สำหรับ Backend)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Userx {
  rootId       String   @id @default(uuid()) @map("root_id") @db.Uuid
  id           Int      @unique @default(autoincrement())
  email        String   @unique @db.VarChar(255)
  passwordHash String   @map("password_hash") @db.VarChar(255)
  isPowerUser  Boolean  @default(false) @map("is_power_user")
  activate     Boolean  @default(true)
  createdDate  DateTime @default(now()) @map("created_date") @db.Timestamptz()
  modifiedDate DateTime @default(now()) @updatedAt @map("modified_date") @db.Timestamptz()

  groups      GroupxUserx[]
  roles       UserxRolex[]
  registers   Registerx[]
  dataForms   DataForm[]    @relation("CreatedBy")
  fileUploads FileUpload[]

  @@map("userx")
}

model Groupx {
  rootId       String   @id @default(uuid()) @map("root_id") @db.Uuid
  id           Int      @unique @default(autoincrement())
  groupKey     String   @unique @map("group_key") @db.VarChar(100)
  name         String   @db.VarChar(255)
  description  String?  @db.Text
  activate     Boolean  @default(true)
  createdDate  DateTime @default(now()) @map("created_date") @db.Timestamptz()
  modifiedDate DateTime @default(now()) @updatedAt @map("modified_date") @db.Timestamptz()

  members GroupxUserx[]

  @@map("groupx")
}

model Rolex {
  rootId       String   @id @default(uuid()) @map("root_id") @db.Uuid
  id           Int      @unique @default(autoincrement())
  roleKey      String   @unique @map("role_key") @db.VarChar(100)
  name         String   @db.VarChar(255)
  description  String?  @db.Text
  permsSchema  Json     @default("[]") @map("perms_schema")
  permsService Json     @default("[]") @map("perms_service")
  activate     Boolean  @default(true)
  createdDate  DateTime @default(now()) @map("created_date") @db.Timestamptz()
  modifiedDate DateTime @default(now()) @updatedAt @map("modified_date") @db.Timestamptz()

  users UserxRolex[]

  @@map("rolex")
}

model Appx {
  rootId       String   @id @default(uuid()) @map("root_id") @db.Uuid
  id           Int      @unique @default(autoincrement())
  name         String   @db.VarChar(255)
  description  String?  @db.Text
  activate     Boolean  @default(true)
  createdDate  DateTime @default(now()) @map("created_date") @db.Timestamptz()
  modifiedDate DateTime @default(now()) @updatedAt @map("modified_date") @db.Timestamptz()

  userRoles UserxRolex[]

  @@map("appx")
}

model GroupxUserx {
  rootId       String   @id @default(uuid()) @map("root_id") @db.Uuid
  userxRootId  String   @map("userx_root_id") @db.Uuid
  groupxRootId String   @map("groupx_root_id") @db.Uuid
  createdDate  DateTime @default(now()) @map("created_date") @db.Timestamptz()
  modifiedDate DateTime @default(now()) @updatedAt @map("modified_date") @db.Timestamptz()

  user  Userx  @relation(fields: [userxRootId], references: [rootId], onDelete: Cascade)
  group Groupx @relation(fields: [groupxRootId], references: [rootId], onDelete: Cascade)

  @@unique([userxRootId, groupxRootId])
  @@map("groupx_userx")
}

model UserxRolex {
  rootId       String   @id @default(uuid()) @map("root_id") @db.Uuid
  userxRootId  String   @map("userx_root_id") @db.Uuid
  rolexRootId  String   @map("rolex_root_id") @db.Uuid
  appxRootId   String   @map("appx_root_id") @db.Uuid
  createdDate  DateTime @default(now()) @map("created_date") @db.Timestamptz()
  modifiedDate DateTime @default(now()) @updatedAt @map("modified_date") @db.Timestamptz()

  user Userx @relation(fields: [userxRootId], references: [rootId], onDelete: Cascade)
  role Rolex @relation(fields: [rolexRootId], references: [rootId], onDelete: Cascade)
  app  Appx  @relation(fields: [appxRootId], references: [rootId], onDelete: Cascade)

  @@unique([userxRootId, rolexRootId, appxRootId])
  @@map("userx_rolex")
}

model Registerx {
  rootId       String   @id @default(uuid()) @map("root_id") @db.Uuid
  id           Int      @unique @default(autoincrement())
  userxRootId  String?  @map("userx_root_id") @db.Uuid
  firstName    String?  @map("first_name") @db.VarChar(255)
  lastName     String?  @map("last_name") @db.VarChar(255)
  displayName  String?  @map("display_name") @db.VarChar(255)
  reason       String?  @db.Text
  consent      Boolean  @default(false)
  status       String   @default("pending") @db.VarChar(50)
  createdDate  DateTime @default(now()) @map("created_date") @db.Timestamptz()
  modifiedDate DateTime @default(now()) @updatedAt @map("modified_date") @db.Timestamptz()

  user Userx? @relation(fields: [userxRootId], references: [rootId])

  @@map("registerx")
}

model DataSchema {
  rootId       String   @id @default(uuid()) @map("root_id") @db.Uuid
  id           Int      @unique @default(autoincrement())
  previousId   String?  @map("previous_id") @db.Uuid
  name         String   @db.VarChar(255)
  json         Json     @default("[]")
  flag         String   @default("draft") @db.VarChar(50)
  activate     Boolean  @default(true)
  createdDate  DateTime @default(now()) @map("created_date") @db.Timestamptz()
  modifiedDate DateTime @default(now()) @updatedAt @map("modified_date") @db.Timestamptz()

  previous DataSchema?  @relation("SchemaVersions", fields: [previousId], references: [rootId])
  next     DataSchema[] @relation("SchemaVersions")
  views    DataView[]
  forms    DataForm[]

  @@map("data_schema")
}

model DataView {
  rootId        String   @id @default(uuid()) @map("root_id") @db.Uuid
  id            Int      @unique @default(autoincrement())
  fkDataSchema  String   @map("fk_data_schema") @db.Uuid
  viewType      String   @map("view_type") @db.VarChar(50)
  name          String?  @db.VarChar(255)
  json          Json     @default("{}")
  createdDate   DateTime @default(now()) @map("created_date") @db.Timestamptz()
  modifiedDate  DateTime @default(now()) @updatedAt @map("modified_date") @db.Timestamptz()

  schema DataSchema @relation(fields: [fkDataSchema], references: [rootId])

  @@map("data_view")
}

model DataForm {
  rootId        String   @id @default(uuid()) @map("root_id") @db.Uuid
  id            Int      @unique @default(autoincrement())
  fkDataSchema  String   @map("fk_data_schema") @db.Uuid
  data          Json     @default("{}")
  createdBy     String?  @map("created_by") @db.Uuid
  createdDate   DateTime @default(now()) @map("created_date") @db.Timestamptz()
  modifiedDate  DateTime @default(now()) @updatedAt @map("modified_date") @db.Timestamptz()

  schema DataSchema @relation(fields: [fkDataSchema], references: [rootId])
  user   Userx?     @relation("CreatedBy", fields: [createdBy], references: [rootId])

  @@map("data_form")
}

model FileUpload {
  rootId        String   @id @default(uuid()) @map("root_id") @db.Uuid
  id            Int      @unique @default(autoincrement())
  filename      String   @db.VarChar(500)
  uploadToken   String   @unique @default(uuid()) @map("upload_token") @db.Uuid
  status        String   @default("initiated") @db.VarChar(50)
  path          String?  @db.VarChar(1000)
  fileSize      BigInt?  @map("file_size")
  mimeType      String?  @map("mime_type") @db.VarChar(255)
  totalParts    Int?     @map("total_parts")
  uploadedParts Int      @default(0) @map("uploaded_parts")
  uploadedBy    String?  @map("uploaded_by") @db.Uuid
  createdDate   DateTime @default(now()) @map("created_date") @db.Timestamptz()
  modifiedDate  DateTime @default(now()) @updatedAt @map("modified_date") @db.Timestamptz()

  user Userx? @relation(fields: [uploadedBy], references: [rootId])

  @@map("file_upload")
}
```

---

## Summary

| Table | Rows (est.) | JSONB | Indexes |
|-------|-------------|-------|---------|
| userx | ~100-1K | - | email, activate |
| groupx | ~10-50 | - | group_key |
| rolex | ~10-20 | perms_schema, perms_service | - |
| appx | ~1-5 | - | - |
| groupx_userx | ~500 | - | user, group |
| userx_rolex | ~200 | - | user, role |
| registerx | ~100 | - | status |
| data_schema | ~50-200 | json (field defs) | flag, previous_id |
| data_view | ~100-400 | json (view config) | schema, type |
| data_form | ~1K-100K | data (form entries) | schema, created_by, GIN(data) |
| file_upload | ~500 | - | token, status |
