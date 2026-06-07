export function computeFieldDiff(olderPayload, newerPayload) {
    const older = olderPayload || {};
    const newer = newerPayload || {};
    const allKeys = new Set([...Object.keys(older), ...Object.keys(newer)]);
    const diffs = [];

    for (const field of allKeys) {
        const oldVal = older[field];
        const newVal = newer[field];
        const oldExists = field in older;
        const newExists = field in newer;

        if (!oldExists && newExists) {
            diffs.push({ field, status: 'added', oldValue: undefined, newValue: newVal });
        } else if (oldExists && !newExists) {
            diffs.push({ field, status: 'removed', oldValue: oldVal, newValue: undefined });
        } else if (stringify(oldVal) !== stringify(newVal)) {
            diffs.push({ field, status: 'changed', oldValue: oldVal, newValue: newVal });
        } else {
            diffs.push({ field, status: 'unchanged', oldValue: oldVal, newValue: newVal });
        }
    }
    return diffs;
}

function stringify(val) {
    if (val === null || val === undefined) return String(val);
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
}

export function formatTimestamp(ts) {
    if (!ts) return '-';
    const s = String(ts).padStart(14, '0');
    const y = s.slice(0, 4);
    const m = s.slice(4, 6);
    const d = s.slice(6, 8);
    const hh = s.slice(8, 10);
    const mm = s.slice(10, 12);
    const ss = s.slice(12, 14);
    return `${d}/${m}/${y} ${hh}:${mm}:${ss}`;
}

export function getFlagLabel(flag) {
    if (!flag || flag === 'active' || flag === '') return 'ปกติ';
    if (flag === 'd' || flag === 'deleted') return 'ลบแล้ว';
    if (flag === 'u') return 'อัพเดต schema';
    return flag;
}

export function computeSchemaDiff(olderJson, newerJson) {
    const older = olderJson || {};
    const newer = newerJson || {};
    const allKeys = new Set([...Object.keys(older), ...Object.keys(newer)]);
    const diffs = [];

    for (const key of allKeys) {
        if (key.startsWith('_')) continue;
        const oldDef = older[key];
        const newDef = newer[key];

        if (!oldDef && newDef) {
            diffs.push({ field: key, status: 'added', label: newDef.label || key, type: newDef.type });
        } else if (oldDef && !newDef) {
            diffs.push({ field: key, status: 'removed', label: oldDef.label || key, type: oldDef.type });
        } else if (oldDef && newDef) {
            const changes = [];
            if (oldDef.type !== newDef.type) changes.push(`type: ${oldDef.type} → ${newDef.type}`);
            if ((oldDef.label || key) !== (newDef.label || key)) changes.push(`label: ${oldDef.label || key} → ${newDef.label || key}`);
            if (stringify(oldDef.enum) !== stringify(newDef.enum)) changes.push('options เปลี่ยน');
            const oldRest = { ...oldDef }; delete oldRest.type; delete oldRest.label; delete oldRest.enum; delete oldRest._order;
            const newRest = { ...newDef }; delete newRest.type; delete newRest.label; delete newRest.enum; delete newRest._order;
            if (stringify(oldRest) !== stringify(newRest)) changes.push('config เปลี่ยน');
            if (changes.length > 0) {
                diffs.push({ field: key, status: 'changed', label: newDef.label || oldDef.label || key, detail: changes.join(', ') });
            }
        }
    }
    return diffs;
}

export function formatValue(val) {
    if (val === null || val === undefined) return '-';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
}
