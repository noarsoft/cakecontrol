import { Router } from 'express';
import { runBenchmark, checkStatus } from '../benchmark/benchmarkService.js';

const router = Router();

router.get('/status', async (req, res) => {
    try {
        const status = await checkStatus();
        res.json({ success: true, data: status });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/benchmark/run
 * body: { n: 1000, k: 5, m: 40, runs: 1 }
 *   n = จำนวน rows (100 - 1,000,000)
 *   k = จำนวน columns (1 - 50)
 *   m = percent ของ columns ที่มี index (0 - 100)
 *   runs = จำนวนรอบ (1 - 5)
 */
router.post('/run', async (req, res) => {
    try {
        const { n = 1000, k = 5, m = 40, runs = 1 } = req.body;

        const safeN = Math.max(100, Math.min(1000000, parseInt(n) || 1000));
        const safeK = Math.max(1, Math.min(50, parseInt(k) || 5));
        const safeM = Math.max(0, Math.min(100, parseInt(m) || 0));
        const safeRuns = Math.max(1, Math.min(5, parseInt(runs) || 1));

        const result = await runBenchmark(safeN, safeK, safeM, safeRuns);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
