import { useState, useCallback } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const BENCH_API = 'http://localhost:3003/api/benchmark';

const COLORS = {
    postgres: '#336791',
    mongodb: '#4DB33D',
    postgresLight: '#5B9BD5',
    mongoLight: '#6FCF5F',
};

function BenchmarkPage({ addLog }) {
    return <LiveBenchmarkTab addLog={addLog} />;
}

/* ───── Live Benchmark Tab ───── */
function LiveBenchmarkTab({ addLog }) {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [history, setHistory] = useState([]);
    const [runs, setRuns] = useState(1);
    const [liveN, setLiveN] = useState(1000);
    const [liveK, setLiveK] = useState(5);    // K = จำนวน columns (1-50)
    const [liveM, setLiveM] = useState(40);   // M = percent ของ index (0-100)
    const [error, setError] = useState(null);

    const checkStatus = useCallback(async () => {
        try {
            const res = await fetch(`${BENCH_API}/status`);
            const data = await res.json();
            setStatus(data.data);
            setError(null);
        } catch {
            setStatus(null);
            setError('ต่อ Benchmark API ไม่ได้ — รัน npm run bench ใน server/ ก่อน');
        }
    }, []);

    const runBenchmark = useCallback(async () => {
        setLoading(true);
        setError(null);
        addLog?.(`Running: N=${liveN}, K=${liveK} cols, M=${liveM}% indexed, runs=${runs}...`);
        try {
            const res = await fetch(`${BENCH_API}/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ n: liveN, k: liveK, m: liveM, runs }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            setResults(data.data);
            setHistory(prev => [data.data, ...prev].slice(0, 10));
            addLog?.(`Done: PG insert=${data.data.postgres.insert}ms, MG insert=${data.data.mongodb.insert}ms`);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [liveN, liveK, liveM, runs, addLog]);

    const ops = ['insert', 'selectNoIndex', 'selectIndexed', 'update', 'delete'];
    const opLabels = {
        insert: `INSERT ${liveN.toLocaleString()} rows × ${liveK} cols`,
        selectNoIndex: `SELECT (scan on column${liveK})`,
        selectIndexed: `SELECT (indexed column1) LIMIT 10`,
        update: 'UPDATE (by PK)',
        delete: 'DELETE (by PK)',
    };

    const comparisonData = results ? ops.map(op => ({
        name: opLabels[op],
        pg: results.postgres[op] ?? 0,
        mongo: results.mongodb[op] ?? 0,
    })) : [];

    const jsonbData = results ? [{
        name: `JSONB query (data.category = 'A')`,
        pgGin: results.postgres.selectJsonGin ?? 0,
        pgBtree: results.postgres.selectJsonBtree ?? 0,
        mongo: results.mongodb.selectJsonMongo ?? 0,
    }] : [];

    return (
        <div className="page-content">
            <h1>Live Benchmark — PostgreSQL vs MongoDB</h1>
            <p className="lead">
                ยิง DB จริงทั้ง 2 ตัว วัดเวลาด้วย <code>performance.now()</code>
            </p>

            {/* Status Check */}
            <section className="content-section">
                <div style={{ marginBottom: 16 }}>
                    <button onClick={checkStatus} style={liveBtnStyle}>
                        Check DB Status
                    </button>
                    {status && (
                        <span style={{ marginLeft: 12, fontSize: 13 }}>
                            PG: {status.postgres ? `v${status.pgVersion}` : 'offline'}
                            {' | '}
                            Mongo: {status.mongodb ? `v${status.mongoVersion}` : 'offline'}
                        </span>
                    )}
                </div>

                {error && (
                    <div style={{ ...noteStyle, background: '#ff000015', borderColor: '#ff000040', color: '#cc0000', marginBottom: 16 }}>
                        {error}
                    </div>
                )}

                {/* Controls */}
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 20 }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>N (records, 100 - 1,000,000)</label>
                        <input type="number" value={liveN} onChange={e => setLiveN(Math.max(100, Math.min(1000000, parseInt(e.target.value) || 100)))} min={100} max={1000000} style={inputStyle} />
                        <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {[100, 1000, 10000, 100000, 500000, 1000000].map(p => (
                                <button key={p} onClick={() => setLiveN(p)} style={{
                                    ...presetBtnStyle,
                                    background: liveN === p ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                    color: liveN === p ? '#fff' : 'var(--text-primary)',
                                }}>
                                    {p >= 1000000 ? `${p / 1000000}M` : p >= 1000 ? `${p / 1000}K` : p}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>K — Columns (1 - 50)</label>
                        <input type="number" value={liveK} onChange={e => setLiveK(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))} min={1} max={50} style={inputStyle} />
                        <div style={{ marginTop: 4, display: 'flex', gap: 4 }}>
                            {[1, 5, 10, 25, 50].map(p => (
                                <button key={p} onClick={() => setLiveK(p)} style={{
                                    ...presetBtnStyle,
                                    background: liveK === p ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                    color: liveK === p ? '#fff' : 'var(--text-primary)',
                                }}>
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>
                            M — % Indexed ({Math.round(liveK * liveM / 100)} cols มี index)
                        </label>
                        <input type="number" value={liveM} onChange={e => setLiveM(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))} min={0} max={100} style={inputStyle} />
                        <div style={{ marginTop: 4, display: 'flex', gap: 4 }}>
                            {[0, 25, 50, 75, 100].map(p => (
                                <button key={p} onClick={() => setLiveM(p)} style={{
                                    ...presetBtnStyle,
                                    background: liveM === p ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                    color: liveM === p ? '#fff' : 'var(--text-primary)',
                                }}>
                                    {p}%
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Runs (avg)</label>
                        <input type="number" value={runs} onChange={e => setRuns(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))} min={1} max={5} style={inputStyle} />
                    </div>
                    <button onClick={runBenchmark} disabled={loading} style={{
                        ...liveBtnStyle,
                        background: loading ? 'var(--bg-secondary)' : 'var(--accent-primary)',
                        color: loading ? 'var(--text-secondary)' : '#fff',
                        fontSize: 15, padding: '10px 28px',
                    }}>
                        {loading ? 'Running...' : 'Run Benchmark'}
                    </button>
                </div>

                {/* Progress */}
                {loading && (
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', background: 'var(--accent-primary)', borderRadius: 2,
                                animation: 'benchProgress 2s ease-in-out infinite',
                                width: '60%',
                            }} />
                        </div>
                        <style>{`@keyframes benchProgress { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
                        <p style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                            กำลังยิง DB จริง... PG ก่อน แล้ว Mongo (sequential เพื่อไม่แย่ง resource)
                            {liveN >= 500000 && ' — N ใหญ่มาก อาจใช้เวลา 1-3 นาที'}
                        </p>
                    </div>
                )}

                {/* Results */}
                {results && (
                    <>
                        {/* Meta */}
                        <div style={{ ...noteStyle, marginBottom: 16, fontSize: 12 }}>
                            <strong>Run info:</strong> N={results.meta.n.toLocaleString()} rows, K={results.meta.k} columns,
                            M={results.meta.m}% → <strong>{results.meta.numIndexes} indexes</strong>,
                            runs={results.meta.runs}, LIMIT={results.meta.selectLimit}
                            <br />
                            <strong>Indexed columns (random):</strong> {
                                results.meta.indexedColumns?.length
                                    ? results.meta.indexedColumns.map(c => `column${c}`).join(', ')
                                    : 'ไม่มี'
                            }
                            {' '}— ทั้ง PG และ Mongo ใช้ชุดเดียวกัน
                            <br />
                            <span style={{ opacity: 0.6 }}>
                                PG v{results.meta.pgVersion}, Mongo v{results.meta.mongoVersion},
                                {' '}{new Date(results.meta.timestamp).toLocaleString('th-TH')}
                            </span>
                        </div>

                        {/* Result Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
                            {ops.map(op => (
                                <ResultCard
                                    key={op}
                                    title={opLabels[op]}
                                    pg={results.postgres[op] ?? 0}
                                    mg={results.mongodb[op] ?? 0}
                                />
                            ))}
                        </div>

                        {/* PG vs Mongo Chart */}
                        <h3>PostgreSQL vs MongoDB (ms)</h3>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={comparisonData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                                <YAxis stroke="var(--text-secondary)" />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend />
                                <Bar dataKey="pg" name="PostgreSQL" fill={COLORS.postgres} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="mongo" name="MongoDB" fill={COLORS.mongodb} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>

                        {/* Detail Table */}
                        <h3 style={{ marginTop: 24 }}>Detail Comparison</h3>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Operation</th>
                                    <th style={{ ...thStyle, color: COLORS.postgres }}>PostgreSQL</th>
                                    <th style={{ ...thStyle, color: COLORS.mongodb }}>MongoDB</th>
                                    <th style={thStyle}>Winner</th>
                                    <th style={thStyle}>Diff</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ops.map(op => {
                                    const pg = results.postgres[op] ?? 0;
                                    const mg = results.mongodb[op] ?? 0;
                                    const winner = pg < mg ? 'PostgreSQL' : pg > mg ? 'MongoDB' : 'Tie';
                                    const winColor = pg < mg ? COLORS.postgres : pg > mg ? COLORS.mongodb : 'var(--text-secondary)';
                                    const diff = pg > 0 && mg > 0
                                        ? Math.abs(((pg - mg) / Math.max(pg, mg)) * 100).toFixed(0) + '%'
                                        : '-';
                                    return (
                                        <tr key={op}>
                                            <td style={tdStyle}>{opLabels[op]}</td>
                                            <td style={{ ...tdStyle, fontWeight: 600, color: COLORS.postgres }}>{formatMs(pg)}</td>
                                            <td style={{ ...tdStyle, fontWeight: 600, color: COLORS.mongodb }}>{formatMs(mg)}</td>
                                            <td style={{ ...tdStyle, color: winColor, fontWeight: 600 }}>{winner}</td>
                                            <td style={tdStyle}>{diff}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* JSONB 3-way */}
                        <h3 style={{ marginTop: 32 }}>
                            JSONB Nested Query — 3-way Comparison
                        </h3>
                        <p style={{ opacity: 0.7, fontSize: 13, marginBottom: 12 }}>
                            Query: <code>data.category = ...</code> บน {results.meta.n.toLocaleString()} records
                            (ตาราง JSONB แยกต่างหาก มี GIN + Expression index เสมอ)
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
                            <div style={cardStyle}>
                                <div style={{ fontSize: 12, opacity: 0.7 }}>PG GIN Index</div>
                                <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.postgres }}>
                                    {formatMs(results.postgres.selectJsonGin ?? 0)}
                                </div>
                                <div style={{ fontSize: 11, opacity: 0.5, fontFamily: 'monospace' }}>
                                    data @&gt; '{`{"category":"A"}`}'
                                </div>
                            </div>
                            <div style={cardStyle}>
                                <div style={{ fontSize: 12, opacity: 0.7 }}>PG Expression B-Tree</div>
                                <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.postgresLight }}>
                                    {formatMs(results.postgres.selectJsonBtree ?? 0)}
                                </div>
                                <div style={{ fontSize: 11, opacity: 0.5, fontFamily: 'monospace' }}>
                                    data-&gt;&gt;'category' = 'A'
                                </div>
                            </div>
                            <div style={cardStyle}>
                                <div style={{ fontSize: 12, opacity: 0.7 }}>MongoDB (single field index)</div>
                                <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.mongodb }}>
                                    {formatMs(results.mongodb.selectJsonMongo ?? 0)}
                                </div>
                                <div style={{ fontSize: 11, opacity: 0.5, fontFamily: 'monospace' }}>
                                    {`{ 'data.category': 'A' }`}
                                </div>
                            </div>
                        </div>

                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={jsonbData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                <YAxis stroke="var(--text-secondary)" />
                                <Tooltip contentStyle={tooltipStyle} formatter={v => `${v} ms`} />
                                <Legend />
                                <Bar dataKey="pgGin" name="PG GIN" fill={COLORS.postgres} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="pgBtree" name="PG Expression B-Tree" fill={COLORS.postgresLight} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="mongo" name="MongoDB" fill={COLORS.mongodb} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                )}

                {/* History */}
                {history.length > 1 && (
                    <>
                        <h3 style={{ marginTop: 24 }}>Run History ({history.length} runs)</h3>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>#</th>
                                    <th style={thStyle}>N</th>
                                    <th style={thStyle}>K</th>
                                    <th style={thStyle}>M%</th>
                                    <th style={{ ...thStyle, color: COLORS.postgres }}>PG Insert</th>
                                    <th style={{ ...thStyle, color: COLORS.mongodb }}>MG Insert</th>
                                    <th style={{ ...thStyle, color: COLORS.postgres }}>PG JSON</th>
                                    <th style={{ ...thStyle, color: COLORS.mongodb }}>MG JSON</th>
                                    <th style={thStyle}>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((h, i) => (
                                    <tr key={i}>
                                        <td style={tdStyle}>{history.length - i}</td>
                                        <td style={tdStyle}>{h.meta.n.toLocaleString()}</td>
                                        <td style={tdStyle}>{h.meta.k}</td>
                                        <td style={tdStyle}>{h.meta.m}%</td>
                                        <td style={tdStyle}>{formatMs(h.postgres.insert)}</td>
                                        <td style={tdStyle}>{formatMs(h.mongodb.insert)}</td>
                                        <td style={tdStyle}>{formatMs(h.postgres.selectJsonGin ?? 0)}</td>
                                        <td style={tdStyle}>{formatMs(h.mongodb.selectJsonMongo ?? 0)}</td>
                                        <td style={{ ...tdStyle, fontSize: 11 }}>{new Date(h.meta.timestamp).toLocaleTimeString('th-TH')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </section>
        </div>
    );
}

/* ───── Result Card ───── */
function ResultCard({ title, pg, mg }) {
    const winner = pg < mg ? 'postgres' : pg > mg ? 'mongodb' : 'tie';
    const diff = pg > 0 && mg > 0 ? Math.abs(((pg - mg) / Math.max(pg, mg)) * 100).toFixed(0) : 0;
    return (
        <div style={cardStyle}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, opacity: 0.8 }}>{title}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: COLORS.postgres, fontWeight: winner === 'postgres' ? 700 : 400 }}>
                    PG: {formatMs(pg)}
                </span>
                <span style={{ color: COLORS.mongodb, fontWeight: winner === 'mongodb' ? 700 : 400 }}>
                    MG: {formatMs(mg)}
                </span>
            </div>
            {winner !== 'tie' && (
                <div style={{
                    fontSize: 11, marginTop: 4, padding: '2px 6px', borderRadius: 4,
                    background: winner === 'postgres' ? '#33679120' : '#4DB33D20',
                    color: winner === 'postgres' ? COLORS.postgres : COLORS.mongodb,
                    display: 'inline-block',
                }}>
                    {winner === 'postgres' ? 'PostgreSQL' : 'MongoDB'} เร็วกว่า ~{diff}%
                </div>
            )}
        </div>
    );
}

function formatMs(ms) {
    if (ms < 0.01) return `${(ms * 1000).toFixed(1)}µs`;
    if (ms < 1) return `${ms.toFixed(3)}ms`;
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

/* ───── Styles ───── */
const inputStyle = {
    padding: '8px 12px',
    border: '1px solid var(--border-primary)',
    borderRadius: 6,
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: 16,
    width: 140,
};

const presetBtnStyle = {
    padding: '2px 10px',
    border: '1px solid var(--border-primary)',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
};

const cardStyle = {
    padding: 16,
    borderRadius: 8,
    border: '1px solid var(--border-primary)',
    background: 'var(--bg-secondary)',
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
};

const thStyle = {
    textAlign: 'left',
    padding: '8px 12px',
    borderBottom: '2px solid var(--border-primary)',
    fontWeight: 600,
};

const tdStyle = {
    padding: '6px 12px',
    borderBottom: '1px solid var(--border-primary)',
};

const tooltipStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-primary)',
    borderRadius: 6,
    color: 'var(--text-primary)',
};

const noteStyle = {
    padding: 12,
    borderRadius: 6,
    background: 'var(--bg-tertiary, var(--bg-secondary))',
    border: '1px solid var(--border-primary)',
    fontSize: 13,
};

const liveBtnStyle = {
    padding: '8px 16px',
    border: '1px solid var(--border-primary)',
    borderRadius: 6,
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
};

export default BenchmarkPage;
