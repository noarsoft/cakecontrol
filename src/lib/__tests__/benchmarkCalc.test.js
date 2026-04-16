import {
    calcInsertTime, calcSelectNoIndex, calcSelectIndexed,
    calcUpdateTime, calcDeleteTime, calcJsonQuery,
    generateChartData, getBigOTable
} from '../benchmarkCalc';

describe('benchmarkCalc.js', () => {
    describe('calcInsertTime', () => {
        test('returns postgres and mongodb times', () => {
            const result = calcInsertTime(1000, 2);
            expect(result).toHaveProperty('postgres');
            expect(result).toHaveProperty('mongodb');
            expect(result).toHaveProperty('complexity');
            expect(result.postgres).toBeGreaterThan(0);
            expect(result.mongodb).toBeGreaterThan(0);
        });

        test('scales with N', () => {
            const small = calcInsertTime(100, 2);
            const large = calcInsertTime(10000, 2);
            expect(large.postgres).toBeGreaterThan(small.postgres);
            expect(large.mongodb).toBeGreaterThan(small.mongodb);
        });

        test('more indexes = slower insert', () => {
            const fewIdx = calcInsertTime(1000, 1);
            const manyIdx = calcInsertTime(1000, 5);
            expect(manyIdx.postgres).toBeGreaterThan(fewIdx.postgres);
        });
    });

    describe('calcSelectNoIndex', () => {
        test('returns results', () => {
            const result = calcSelectNoIndex(1000);
            expect(result.postgres).toBeGreaterThan(0);
            expect(result.mongodb).toBeGreaterThan(0);
        });

        test('scales linearly with N', () => {
            const s1 = calcSelectNoIndex(1000);
            const s2 = calcSelectNoIndex(10000);
            // Should roughly scale 10x
            expect(s2.postgres / s1.postgres).toBeGreaterThan(5);
        });
    });

    describe('calcSelectIndexed', () => {
        test('indexed is faster than no-index', () => {
            const noIdx = calcSelectNoIndex(10000);
            const idx = calcSelectIndexed(10000, 10);
            expect(idx.postgres).toBeLessThan(noIdx.postgres);
            expect(idx.mongodb).toBeLessThan(noIdx.mongodb);
        });
    });

    describe('calcUpdateTime / calcDeleteTime', () => {
        test('returns positive values', () => {
            const upd = calcUpdateTime(1000, 2);
            const del = calcDeleteTime(1000, 2);
            expect(upd.postgres).toBeGreaterThan(0);
            expect(del.postgres).toBeGreaterThan(0);
        });
    });

    describe('calcJsonQuery', () => {
        test('returns postgresGin, postgresExpr, mongodb', () => {
            const result = calcJsonQuery(1000, false);
            expect(result).toHaveProperty('postgresGin');
            expect(result).toHaveProperty('postgresExpr');
            expect(result).toHaveProperty('mongodb');
        });

        test('indexed is faster', () => {
            const noIdx = calcJsonQuery(10000, false);
            const idx = calcJsonQuery(10000, true);
            expect(idx.postgresGin).toBeLessThan(noIdx.postgresGin);
        });
    });

    describe('generateChartData', () => {
        test('returns array with correct length', () => {
            const nValues = [100, 500, 1000];
            const data = generateChartData(nValues, 10, 2);
            expect(data).toHaveLength(3);
        });

        test('each item has expected keys', () => {
            const data = generateChartData([1000], 10, 2);
            const item = data[0];
            expect(item).toHaveProperty('n');
            expect(item).toHaveProperty('label');
            expect(item).toHaveProperty('insertPg');
            expect(item).toHaveProperty('insertMg');
            expect(item).toHaveProperty('selectNoPg');
            expect(item).toHaveProperty('selectIdxPg');
        });
    });

    describe('getBigOTable', () => {
        test('returns noIndex and withIndex arrays', () => {
            const result = getBigOTable(1000, 10, 2);
            expect(result).toHaveProperty('noIndex');
            expect(result).toHaveProperty('withIndex');
            expect(result.noIndex.length).toBeGreaterThan(0);
            expect(result.withIndex.length).toBeGreaterThan(0);
        });

        test('each row has op, postgres, mongodb', () => {
            const result = getBigOTable(1000, 10, 2);
            for (const row of result.noIndex) {
                expect(row).toHaveProperty('op');
                expect(row).toHaveProperty('postgres');
                expect(row).toHaveProperty('mongodb');
            }
        });
    });
});
