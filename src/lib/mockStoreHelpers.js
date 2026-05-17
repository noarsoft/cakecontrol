export const STORAGE_KEYS = {
    business: 'cakecontrol_business',
    schemas: 'cakecontrol_schemas',
    views: 'cakecontrol_views',
    forms: 'cakecontrol_forms',
    data: 'cakecontrol_data',
};

export function genId() {
    return crypto.randomUUID();
}

export function now() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const s = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    return Number(s);
}

export function getStore(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
        return [];
    }
}

export function setStore(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function nextId(key) {
    const items = getStore(key);
    const maxId = items.reduce((max, item) => Math.max(max, item.id || 0), 0);
    return maxId + 1;
}

export function detectKeyRenames(oldJson, newJson) {
    if (!oldJson || !newJson) return {};
    const renames = {};
    const oldByOrder = {};
    const hasOrder = Object.values(oldJson).some(d => d._order) && Object.values(newJson).some(d => d._order);

    if (hasOrder) {
        for (const [key, def] of Object.entries(oldJson)) {
            if (def._order) oldByOrder[def._order] = key;
        }
        for (const [key, def] of Object.entries(newJson)) {
            if (!def._order) continue;
            const oldKey = oldByOrder[def._order];
            if (oldKey && oldKey !== key) renames[oldKey] = key;
        }
    } else {
        const oldKeys = new Set(Object.keys(oldJson));
        const newKeys = new Set(Object.keys(newJson));
        const removed = [...oldKeys].filter(k => !newKeys.has(k));
        const added = [...newKeys].filter(k => !oldKeys.has(k));
        if (removed.length === added.length) {
            for (let i = 0; i < removed.length; i++) {
                if (oldJson[removed[i]].type === newJson[added[i]].type) {
                    renames[removed[i]] = added[i];
                }
            }
        }
    }
    return renames;
}

export function migrateDataKeys(storeKey, schemaId, renames) {
    const renameEntries = Object.entries(renames);
    if (renameEntries.length === 0) return;
    const dataItems = getStore(storeKey);
    let changed = false;
    dataItems.forEach(record => {
        if (record.data_schema_id !== schemaId || record.activate === false) return;
        const d = record.data;
        if (!d || typeof d !== 'object') return;
        const migrated = {};
        for (const [k, v] of Object.entries(d)) {
            migrated[renames[k] || k] = v;
        }
        record.data = migrated;
        changed = true;
    });
    if (changed) setStore(storeKey, dataItems);
}
