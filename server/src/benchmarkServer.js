/**
 * Standalone benchmark server
 * ไม่พึ่ง better-sqlite3 — ใช้แค่ pg + mongodb
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import benchmarkRouter from './routes/benchmark.js';

const app = express();
const PORT = process.env.BENCH_PORT || 3003;

app.use(cors());
app.use(express.json());

app.use('/api/benchmark', benchmarkRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'benchmark', timestamp: new Date().toISOString() });
});

const server = app.listen(PORT, () => {
    console.log(`Benchmark API running at http://localhost:${PORT}`);
    console.log(`  GET  /api/benchmark/status`);
    console.log(`  POST /api/benchmark/run   { n, k, indexCount, runs }`);
});

// Allow long-running benchmarks (N=1M can take 1-2 min)
server.timeout = 10 * 60 * 1000; // 10 minutes
server.headersTimeout = 10 * 60 * 1000 + 5000;
