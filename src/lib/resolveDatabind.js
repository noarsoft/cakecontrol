/**
 * resolveDatabind.js
 *
 * Resolves a dotted databind path against a data object.
 * Canonical implementation of the pattern used across 10+ controls.
 *
 * Usage:
 *   resolveDatabind('address.city', rowData)  → rowData?.address?.city
 *   resolveDatabind('name', rowData)          → rowData?.name
 */

export function resolveDatabind(databind, data) {
    if (!databind || !data) return undefined;

    const keys = databind.split('.');
    let value = data;
    for (const key of keys) {
        value = value?.[key];
        if (value === undefined) return undefined;
    }
    return value;
}
