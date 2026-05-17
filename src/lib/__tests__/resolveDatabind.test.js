import { resolveDatabind } from '../resolveDatabind';

describe('resolveDatabind', () => {
    it('resolves simple key', () => {
        expect(resolveDatabind('name', { name: 'Alice' })).toBe('Alice');
    });

    it('resolves nested dotted path', () => {
        const data = { address: { city: 'Bangkok' } };
        expect(resolveDatabind('address.city', data)).toBe('Bangkok');
    });

    it('resolves deeply nested path', () => {
        const data = { a: { b: { c: { d: 42 } } } };
        expect(resolveDatabind('a.b.c.d', data)).toBe(42);
    });

    it('returns undefined for missing key', () => {
        expect(resolveDatabind('missing', { name: 'Alice' })).toBeUndefined();
    });

    it('returns undefined for missing nested path', () => {
        expect(resolveDatabind('a.b.c', { a: { x: 1 } })).toBeUndefined();
    });

    it('returns undefined if databind is empty', () => {
        expect(resolveDatabind('', { name: 'Alice' })).toBeUndefined();
    });

    it('returns undefined if databind is null', () => {
        expect(resolveDatabind(null, { name: 'Alice' })).toBeUndefined();
    });

    it('returns undefined if data is null', () => {
        expect(resolveDatabind('name', null)).toBeUndefined();
    });

    it('returns undefined if data is undefined', () => {
        expect(resolveDatabind('name', undefined)).toBeUndefined();
    });

    it('resolves falsy values (0, false, empty string)', () => {
        expect(resolveDatabind('count', { count: 0 })).toBe(0);
        expect(resolveDatabind('active', { active: false })).toBe(false);
        expect(resolveDatabind('text', { text: '' })).toBe('');
    });

    it('resolves array values', () => {
        const data = { items: [1, 2, 3] };
        expect(resolveDatabind('items', data)).toEqual([1, 2, 3]);
    });

    it('resolves object values', () => {
        const nested = { x: 1 };
        const data = { config: nested };
        expect(resolveDatabind('config', data)).toBe(nested);
    });
});
