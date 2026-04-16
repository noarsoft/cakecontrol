import {
    estimatePostgresSize, estimateMongoSize, projectGrowth,
    formatBytes, analyzeFieldSizes
} from '../storageCalc';

describe('storageCalc.js', () => {
    describe('estimatePostgresSize', () => {
        test('returns all size components', () => {
            const result = estimatePostgresSize(1000, 200, 2);
            expect(result).toHaveProperty('dataBytes');
            expect(result).toHaveProperty('toastBytes');
            expect(result).toHaveProperty('indexBytes');
            expect(result).toHaveProperty('ginBytes');
            expect(result).toHaveProperty('totalBytes');
            expect(result).toHaveProperty('rowSize');
            expect(result).toHaveProperty('rowsPerPage');
        });

        test('total > 0 for non-zero N', () => {
            const result = estimatePostgresSize(100, 200, 1);
            expect(result.totalBytes).toBeGreaterThan(0);
            expect(result.dataBytes).toBeGreaterThan(0);
        });

        test('scales with N', () => {
            const small = estimatePostgresSize(100, 200, 1);
            const large = estimatePostgresSize(10000, 200, 1);
            expect(large.totalBytes).toBeGreaterThan(small.totalBytes);
        });

        test('more indexes = more storage', () => {
            const few = estimatePostgresSize(1000, 200, 1);
            const many = estimatePostgresSize(1000, 200, 5);
            expect(many.indexBytes).toBeGreaterThan(few.indexBytes);
        });

        test('TOAST kicks in for large records', () => {
            const small = estimatePostgresSize(1000, 100, 1);
            const large = estimatePostgresSize(1000, 3000, 1); // > 2048 TOAST threshold
            expect(large.toastBytes).toBeGreaterThan(0);
            expect(small.toastBytes).toBe(0);
        });
    });

    describe('estimateMongoSize', () => {
        test('returns all components', () => {
            const result = estimateMongoSize(1000, 200, 2);
            expect(result).toHaveProperty('dataBytes');
            expect(result).toHaveProperty('rawDataBytes');
            expect(result).toHaveProperty('idIndexBytes');
            expect(result).toHaveProperty('additionalIndexBytes');
            expect(result).toHaveProperty('totalBytes');
            expect(result).toHaveProperty('bsonSize');
            expect(result).toHaveProperty('compressionRatio');
        });

        test('compression reduces data size', () => {
            const result = estimateMongoSize(1000, 200, 1);
            expect(result.dataBytes).toBeLessThan(result.rawDataBytes);
        });

        test('BSON is ~10% larger than JSON', () => {
            const result = estimateMongoSize(1, 200, 0);
            // bsonSize = 32 overhead + 200 * 1.1 = 252
            expect(result.bsonSize).toBeGreaterThan(200);
        });
    });

    describe('PG vs Mongo comparison', () => {
        test('both return reasonable values for same parameters', () => {
            const pg = estimatePostgresSize(10000, 200, 2);
            const mongo = estimateMongoSize(10000, 200, 2);
            // Both should be in reasonable range (not zero, not absurd)
            expect(pg.totalBytes).toBeGreaterThan(1000);
            expect(mongo.totalBytes).toBeGreaterThan(1000);
            expect(pg.totalBytes).toBeLessThan(1e10); // < 10GB for 10K records
            expect(mongo.totalBytes).toBeLessThan(1e10);
        });
    });

    describe('projectGrowth', () => {
        test('returns correct number of months', () => {
            const result = projectGrowth(100, 200, 12, 500);
            expect(result).toHaveLength(13); // 0 through 12
        });

        test('first entry is current state', () => {
            const result = projectGrowth(100, 200, 6, 500);
            expect(result[0].month).toBe(0);
            expect(result[0].label).toBe('ตอนนี้');
            expect(result[0].records).toBe(100);
        });

        test('records grow each month', () => {
            const result = projectGrowth(100, 200, 3, 500);
            expect(result[1].records).toBe(600);
            expect(result[2].records).toBe(1100);
            expect(result[3].records).toBe(1600);
        });

        test('storage grows with records', () => {
            const result = projectGrowth(100, 200, 12, 1000);
            const first = result[0];
            const last = result[result.length - 1];
            expect(last.pgBytes).toBeGreaterThan(first.pgBytes);
            expect(last.mongoBytes).toBeGreaterThan(first.mongoBytes);
            expect(last.localBytes).toBeGreaterThan(first.localBytes);
        });
    });

    describe('formatBytes', () => {
        test('formats 0', () => {
            expect(formatBytes(0)).toBe('0 B');
        });

        test('formats bytes', () => {
            expect(formatBytes(500)).toBe('500 B');
        });

        test('formats KB', () => {
            const result = formatBytes(1536);
            expect(result).toContain('KB');
        });

        test('formats MB', () => {
            const result = formatBytes(2 * 1024 * 1024);
            expect(result).toBe('2.00 MB');
        });

        test('formats GB', () => {
            const result = formatBytes(5 * 1024 * 1024 * 1024);
            expect(result).toBe('5.00 GB');
        });
    });

    describe('analyzeFieldSizes', () => {
        test('returns empty for empty input', () => {
            expect(analyzeFieldSizes([])).toEqual([]);
            expect(analyzeFieldSizes(null)).toEqual([]);
        });

        test('analyzes field sizes correctly', () => {
            const records = [
                { data: { name: 'John', age: 30 } },
                { data: { name: 'Jane Doe', age: 25 } },
            ];
            const result = analyzeFieldSizes(records);
            expect(result.length).toBe(2);
            // Should be sorted by totalBytes descending
            expect(result[0].totalBytes).toBeGreaterThanOrEqual(result[1].totalBytes);
            expect(result[0].count).toBe(2);
        });
    });
});
