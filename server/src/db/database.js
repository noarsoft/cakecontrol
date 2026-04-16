/**
 * database.js — SQLite database setup (local dev)
 * ใช้ better-sqlite3 จำลอง PostgreSQL 4-table schema
 * root_id = UUID PK, id = auto-increment FK, previous_id versioning
 */
import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', '..', 'cakecontrol.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent reads
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Create Tables ───
db.exec(`
    CREATE TABLE IF NOT EXISTS data_schema (
        root_id             TEXT PRIMARY KEY,
        id                  INTEGER UNIQUE NOT NULL,
        previous_id         INTEGER REFERENCES data_schema(id),
        name                TEXT NOT NULL,
        json                TEXT NOT NULL DEFAULT '{}',
        flag                TEXT DEFAULT 'draft',
        activate            INTEGER DEFAULT 1,
        modified_date_time  TEXT
    );

    CREATE TABLE IF NOT EXISTS data_view (
        root_id             TEXT PRIMARY KEY,
        id                  INTEGER UNIQUE NOT NULL,
        previous_id         INTEGER REFERENCES data_view(id),
        fk_data_schema      INTEGER NOT NULL REFERENCES data_schema(id),
        view_type           TEXT NOT NULL,
        name                TEXT,
        json                TEXT NOT NULL DEFAULT '{}',
        flag                TEXT DEFAULT 'draft',
        activate            INTEGER DEFAULT 1,
        modified_date_time  TEXT
    );

    CREATE TABLE IF NOT EXISTS data_formcfg (
        root_id             TEXT PRIMARY KEY,
        id                  INTEGER UNIQUE NOT NULL,
        previous_id         INTEGER REFERENCES data_formcfg(id),
        fk_data_schema      INTEGER NOT NULL REFERENCES data_schema(id),
        name                TEXT,
        json                TEXT NOT NULL DEFAULT '{}',
        flag                TEXT DEFAULT 'draft',
        activate            INTEGER DEFAULT 1,
        modified_date_time  TEXT
    );

    CREATE TABLE IF NOT EXISTS data_form (
        root_id             TEXT PRIMARY KEY,
        id                  INTEGER UNIQUE NOT NULL,
        previous_id         INTEGER REFERENCES data_form(id),
        fk_data_schema      INTEGER NOT NULL REFERENCES data_schema(id),
        data                TEXT NOT NULL DEFAULT '{}',
        flag                TEXT DEFAULT 'active',
        activate            INTEGER DEFAULT 1,
        modified_date_time  TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_data_view_schema ON data_view(fk_data_schema);
    CREATE INDEX IF NOT EXISTS idx_data_formcfg_schema ON data_formcfg(fk_data_schema);
    CREATE INDEX IF NOT EXISTS idx_data_form_schema ON data_form(fk_data_schema);
    CREATE INDEX IF NOT EXISTS idx_data_form_activate ON data_form(activate);
`);

// ─── Helpers ───

function now() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function nextId(table) {
    const row = db.prepare(`SELECT MAX(id) as maxId FROM ${table}`).get();
    return (row.maxId || 0) + 1;
}

function parseJson(row) {
    if (!row) return null;
    const result = { ...row, activate: !!row.activate };
    if (result.json !== undefined) {
        try { result.json = JSON.parse(result.json); } catch { /* keep string */ }
    }
    if (result.data !== undefined) {
        try { result.data = JSON.parse(result.data); } catch { /* keep string */ }
    }
    return result;
}

function parseRows(rows) {
    return rows.map(parseJson);
}

// ─── data_schema ───

export const schemaRepo = {
    getAll() {
        const rows = db.prepare('SELECT * FROM data_schema WHERE activate = 1 ORDER BY id').all();
        return parseRows(rows);
    },

    getById(id) {
        const row = db.prepare('SELECT * FROM data_schema WHERE id = ? AND activate = 1').get(id);
        return parseJson(row);
    },

    getByRootId(rootId) {
        const row = db.prepare('SELECT * FROM data_schema WHERE root_id = ? AND activate = 1').get(rootId);
        return parseJson(row);
    },

    create(name, json = {}) {
        const rootId = randomUUID();
        const id = nextId('data_schema');
        const stmt = db.prepare(`
            INSERT INTO data_schema (root_id, id, name, json, modified_date_time)
            VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(rootId, id, name, JSON.stringify(json), now());
        return this.getById(id);
    },

    update(id, updates) {
        const current = this.getById(id);
        if (!current) return null;
        const fields = [];
        const values = [];
        const allowed = ['name', 'json', 'flag', 'previous_id'];
        for (const key of allowed) {
            if (updates[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(key === 'json' ? JSON.stringify(updates[key]) : updates[key]);
            }
        }
        if (fields.length === 0) return current;
        fields.push('modified_date_time = ?');
        values.push(now());
        values.push(id);
        db.prepare(`UPDATE data_schema SET ${fields.join(', ')} WHERE id = ?`).run(...values);
        return this.getById(id);
    },

    delete(id) {
        const result = db.prepare('UPDATE data_schema SET activate = 0, modified_date_time = ? WHERE id = ?').run(now(), id);
        return result.changes > 0;
    },
};

// ─── data_view ───

export const viewRepo = {
    getBySchema(schemaId) {
        const rows = db.prepare('SELECT * FROM data_view WHERE fk_data_schema = ? AND activate = 1 ORDER BY id').all(schemaId);
        return parseRows(rows);
    },

    getById(id) {
        const row = db.prepare('SELECT * FROM data_view WHERE id = ? AND activate = 1').get(id);
        return parseJson(row);
    },

    create(schemaId, viewType, json, name = '') {
        const rootId = randomUUID();
        const id = nextId('data_view');
        db.prepare(`
            INSERT INTO data_view (root_id, id, fk_data_schema, view_type, name, json, modified_date_time)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(rootId, id, schemaId, viewType, name, JSON.stringify(json), now());
        return this.getById(id);
    },

    update(id, updates) {
        const current = this.getById(id);
        if (!current) return null;
        const fields = [];
        const values = [];
        const allowed = ['name', 'json', 'view_type', 'flag', 'previous_id'];
        for (const key of allowed) {
            if (updates[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(key === 'json' ? JSON.stringify(updates[key]) : updates[key]);
            }
        }
        if (fields.length === 0) return current;
        fields.push('modified_date_time = ?');
        values.push(now());
        values.push(id);
        db.prepare(`UPDATE data_view SET ${fields.join(', ')} WHERE id = ?`).run(...values);
        return this.getById(id);
    },

    delete(id) {
        return db.prepare('UPDATE data_view SET activate = 0, modified_date_time = ? WHERE id = ?').run(now(), id).changes > 0;
    },
};

// ─── data_formcfg ───

export const formcfgRepo = {
    getBySchema(schemaId) {
        const rows = db.prepare('SELECT * FROM data_formcfg WHERE fk_data_schema = ? AND activate = 1 ORDER BY id').all(schemaId);
        return parseRows(rows);
    },

    getById(id) {
        const row = db.prepare('SELECT * FROM data_formcfg WHERE id = ? AND activate = 1').get(id);
        return parseJson(row);
    },

    create(schemaId, json, name = '') {
        const rootId = randomUUID();
        const id = nextId('data_formcfg');
        db.prepare(`
            INSERT INTO data_formcfg (root_id, id, fk_data_schema, name, json, modified_date_time)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(rootId, id, schemaId, name, JSON.stringify(json), now());
        return this.getById(id);
    },

    update(id, updates) {
        const current = this.getById(id);
        if (!current) return null;
        const fields = [];
        const values = [];
        const allowed = ['name', 'json', 'flag', 'previous_id'];
        for (const key of allowed) {
            if (updates[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(key === 'json' ? JSON.stringify(updates[key]) : updates[key]);
            }
        }
        if (fields.length === 0) return current;
        fields.push('modified_date_time = ?');
        values.push(now());
        values.push(id);
        db.prepare(`UPDATE data_formcfg SET ${fields.join(', ')} WHERE id = ?`).run(...values);
        return this.getById(id);
    },

    delete(id) {
        return db.prepare('UPDATE data_formcfg SET activate = 0, modified_date_time = ? WHERE id = ?').run(now(), id).changes > 0;
    },
};

// ─── data_form ───

export const formRepo = {
    getBySchema(schemaId) {
        const rows = db.prepare('SELECT * FROM data_form WHERE fk_data_schema = ? AND activate = 1 ORDER BY id').all(schemaId);
        return parseRows(rows);
    },

    getById(id) {
        const row = db.prepare('SELECT * FROM data_form WHERE id = ? AND activate = 1').get(id);
        return parseJson(row);
    },

    create(schemaId, data) {
        const rootId = randomUUID();
        const id = nextId('data_form');
        db.prepare(`
            INSERT INTO data_form (root_id, id, fk_data_schema, data, modified_date_time)
            VALUES (?, ?, ?, ?, ?)
        `).run(rootId, id, schemaId, JSON.stringify(data), now());
        return this.getById(id);
    },

    update(id, data) {
        const current = this.getById(id);
        if (!current) return null;
        db.prepare('UPDATE data_form SET data = ?, modified_date_time = ? WHERE id = ?')
            .run(JSON.stringify(data), now(), id);
        return this.getById(id);
    },

    delete(id) {
        return db.prepare('UPDATE data_form SET activate = 0, modified_date_time = ? WHERE id = ?').run(now(), id).changes > 0;
    },
};

export default db;
