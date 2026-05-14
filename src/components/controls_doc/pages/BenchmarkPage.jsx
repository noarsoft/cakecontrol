import { useState, useCallback } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const BENCH_API = 'http://localhost:3003/api/benchmark';

const COLORS = {
    pgRel: '#336791',
    mongodb: '#4DB33D',
    pgJsonb: '#E97F0F',
};

const OPS = ['insert', 'selectAll', 'selectFilter', 'createIndex', 'selectIndexed', 'update', 'delete'];
const OP_LABELS = {
    insert: 'INSERT (bulk)',
    selectAll: 'SELECT * (JOIN/scan)',
    selectFilter: 'SELECT filter (no idx)',
    createIndex: 'CREATE B-Tree',
    selectIndexed: 'SELECT filter (indexed)',
    update: 'UPDATE (1 row)',
    delete: 'DELETE (1 row)',
};

function formatMs(ms) {
    if (ms == null) return '-';
    if (ms < 0.01) return `${(ms * 1000).toFixed(1)}µs`;
    if (ms < 1) return `${ms.toFixed(3)}ms`;
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

function formatBytes(bytes) {
    if (bytes == null || bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

function winner3(a, b, c) {
    const min = Math.min(a, b, c);
    const w = [];
    if (a === min) w.push('PG-Rel');
    if (b === min) w.push('Mongo');
    if (c === min) w.push('PG-JB');
    return w.join('/');
}

function BenchmarkPage({ addLog }) {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);
    const [showSample, setShowSample] = useState(false);

    const checkStatus = useCallback(async () => {
        try {
            const res = await fetch(`${BENCH_API}/status`);
            const data = await res.json();
            setStatus(data.data);
            setError(null);
        } catch {
            setStatus(null);
            setError('ต่อ Benchmark API ไม่ได้ — รัน npm run server ใน benchmark/ ก่อน');
        }
    }, []);

    const runBenchmark = useCallback(async () => {
        setLoading(true);
        setError(null);
        addLog?.('Running benchmark (Wikipedia data)...');
        try {
            const res = await fetch(`${BENCH_API}/run`, { method: 'POST' });
            const data = await res.json();
            if (!data.success) throw new Error(data.error);
            setResults(data.data);
            setHistory(prev => [data.data, ...prev].slice(0, 10));
            addLog?.(`Done: insert PG=${data.data.execution_time_ms.insert.pg_relational}ms`);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [addLog]);

    const chartData = results ? OPS.map(op => ({
        name: OP_LABELS[op],
        'PG Relational': results.execution_time_ms[op]?.pg_relational ?? 0,
        'MongoDB': results.execution_time_ms[op]?.mongodb ?? 0,
        'PG JSONB': results.execution_time_ms[op]?.pg_jsonb ?? 0,
    })) : [];

    const storageData = results ? ['data', 'index', 'total'].map(key => ({
        name: key === 'data' ? 'Data' : key === 'index' ? 'Index' : 'Total',
        'PG Relational': results.storage_bytes.pg_relational?.[key] ?? 0,
        'MongoDB': results.storage_bytes.mongodb?.[key] ?? 0,
        'PG JSONB': results.storage_bytes.pg_jsonb?.[key] ?? 0,
    })) : [];

    return (
        <div className="page-content">
            <h1>DB Benchmark — PG Relational vs MongoDB vs PG JSONB</h1>
            <p className="lead">
                เปรียบเทียบ 3 วิธีเก็บข้อมูล Wikipedia revision จริง —
                PG 3 tables (normalized) vs MongoDB (flat) vs PG JSONB (flat)
            </p>

            <section className="content-section">
                {/* Status */}
                <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <button onClick={checkStatus} style={btnStyle}>Check DB Status</button>
                    <button onClick={runBenchmark} disabled={loading} style={{
                        ...btnStyle,
                        background: loading ? 'var(--bg-secondary)' : 'var(--accent-primary)',
                        color: loading ? 'var(--text-secondary)' : '#fff',
                        fontSize: 15, padding: '10px 28px',
                    }}>
                        {loading ? 'Running...' : 'Run Benchmark'}
                    </button>
                    {status && (
                        <span style={{ fontSize: 13 }}>
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

                {/* Wiki Data Info */}
                {status?.wikiData && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
                        <InfoCard label="Categories" value={status.wikiData.categories} />
                        <InfoCard label="Pages" value={status.wikiData.pages} />
                        <InfoCard label="Revisions" value={status.wikiData.revisions?.toLocaleString()} />
                        <InfoCard label="Data Size" value={`${status.wikiData.totalSizeMB} MB`} />
                    </div>
                )}

                {/* Sample Data */}
                {status?.sampleData && (
                    <div style={{ marginBottom: 20 }}>
                        <button
                            onClick={() => setShowSample(v => !v)}
                            style={{ ...btnStyle, fontSize: 12, padding: '6px 14px' }}
                        >
                            {showSample ? '▼' : '▶'} ตัวอย่างข้อมูล Wikipedia (5 rows แรก)
                        </button>
                        {showSample && <SampleDataSection data={status.sampleData} />}
                    </div>
                )}

                {/* Progress */}
                {loading && (
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', background: 'var(--accent-primary)', borderRadius: 2,
                                animation: 'benchProgress 2s ease-in-out infinite', width: '60%',
                            }} />
                        </div>
                        <style>{`@keyframes benchProgress { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }`}</style>
                        <p style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                            กำลังรัน benchmark... PG Relational (3 tables) → MongoDB → PG JSONB
                        </p>
                    </div>
                )}

                {results && (
                    <>
                        {/* Meta */}
                        <div style={{ ...noteStyle, marginBottom: 16, fontSize: 12 }}>
                            <strong>Wikipedia data:</strong>{' '}
                            {results.meta.categories} categories, {results.meta.pages} pages,{' '}
                            {results.meta.revisions?.toLocaleString()} revisions ({results.meta.totalSizeMB} MB)
                            <br />
                            <strong>PG Relational:</strong> 3 normalized tables (bench_category → bench_page → bench_revision)
                            <br />
                            <strong>MongoDB & PG JSONB:</strong> flat documents (1 collection/table)
                            <br />
                            <span style={{ opacity: 0.6 }}>
                                {new Date(results.meta.timestamp).toLocaleString('th-TH')}
                            </span>
                        </div>

                        {/* Result Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 24 }}>
                            {OPS.map(op => {
                                const t = results.execution_time_ms[op];
                                return (
                                    <ResultCard3
                                        key={op}
                                        title={OP_LABELS[op]}
                                        pgRel={t?.pg_relational ?? 0}
                                        mongo={t?.mongodb ?? 0}
                                        pgJsonb={t?.pg_jsonb ?? 0}
                                    />
                                );
                            })}
                        </div>

                        {/* Execution Time Chart */}
                        <h3>Execution Time (ms)</h3>
                        <ResponsiveContainer width="100%" height={380}>
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
                                <YAxis stroke="var(--text-secondary)" />
                                <Tooltip contentStyle={tooltipStyle} formatter={v => `${formatMs(v)}`} />
                                <Legend />
                                <Bar dataKey="PG Relational" fill={COLORS.pgRel} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="MongoDB" fill={COLORS.mongodb} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="PG JSONB" fill={COLORS.pgJsonb} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>

                        {/* Detail Table */}
                        <h3 style={{ marginTop: 24 }}>Detail Comparison</h3>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Operation</th>
                                    <th style={{ ...thStyle, color: COLORS.pgRel }}>PG Relational</th>
                                    <th style={{ ...thStyle, color: COLORS.mongodb }}>MongoDB</th>
                                    <th style={{ ...thStyle, color: COLORS.pgJsonb }}>PG JSONB</th>
                                    <th style={thStyle}>Winner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {OPS.map(op => {
                                    const t = results.execution_time_ms[op];
                                    const pg = t?.pg_relational ?? 0;
                                    const mg = t?.mongodb ?? 0;
                                    const jb = t?.pg_jsonb ?? 0;
                                    const w = winner3(pg, mg, jb);
                                    return (
                                        <tr key={op}>
                                            <td style={tdStyle}>{OP_LABELS[op]}</td>
                                            <td style={{ ...tdStyle, fontWeight: 600, color: COLORS.pgRel }}>{formatMs(pg)}</td>
                                            <td style={{ ...tdStyle, fontWeight: 600, color: COLORS.mongodb }}>{formatMs(mg)}</td>
                                            <td style={{ ...tdStyle, fontWeight: 600, color: COLORS.pgJsonb }}>{formatMs(jb)}</td>
                                            <td style={{ ...tdStyle, fontWeight: 600 }}>{w}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Storage */}
                        <h3 style={{ marginTop: 32 }}>Storage Comparison</h3>
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={thStyle}>Metric</th>
                                    <th style={{ ...thStyle, color: COLORS.pgRel }}>PG Relational</th>
                                    <th style={{ ...thStyle, color: COLORS.mongodb }}>MongoDB</th>
                                    <th style={{ ...thStyle, color: COLORS.pgJsonb }}>PG JSONB</th>
                                    <th style={thStyle}>Winner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {storageData.map(row => (
                                    <tr key={row.name}>
                                        <td style={tdStyle}>{row.name}</td>
                                        <td style={{ ...tdStyle, color: COLORS.pgRel }}>{formatBytes(row['PG Relational'])}</td>
                                        <td style={{ ...tdStyle, color: COLORS.mongodb }}>{formatBytes(row['MongoDB'])}</td>
                                        <td style={{ ...tdStyle, color: COLORS.pgJsonb }}>{formatBytes(row['PG JSONB'])}</td>
                                        <td style={{ ...tdStyle, fontWeight: 600 }}>{winner3(row['PG Relational'], row['MongoDB'], row['PG JSONB'])}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <ResponsiveContainer width="100%" height={300} style={{ marginTop: 16 }}>
                            <BarChart data={storageData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                                <YAxis stroke="var(--text-secondary)" tickFormatter={v => formatBytes(v)} />
                                <Tooltip contentStyle={tooltipStyle} formatter={v => formatBytes(v)} />
                                <Legend />
                                <Bar dataKey="PG Relational" fill={COLORS.pgRel} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="MongoDB" fill={COLORS.mongodb} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="PG JSONB" fill={COLORS.pgJsonb} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>

                        {/* Bonus: GIN vs B-Tree */}
                        {results.bonus_jsonb_gin && (
                            <>
                                <h3 style={{ marginTop: 32 }}>Bonus: PG JSONB — GIN vs B-Tree</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
                                    <div style={cardStyle}>
                                        <div style={{ fontSize: 12, opacity: 0.7 }}>B-Tree CREATE INDEX</div>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.pgJsonb }}>
                                            {formatMs(results.execution_time_ms.createIndex?.pg_jsonb)}
                                        </div>
                                        <div style={{ fontSize: 11, opacity: 0.5, fontFamily: 'monospace' }}>
                                            (data-&gt;&gt;'category')
                                        </div>
                                    </div>
                                    <div style={cardStyle}>
                                        <div style={{ fontSize: 12, opacity: 0.7 }}>GIN CREATE INDEX</div>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: '#9B59B6' }}>
                                            {formatMs(results.bonus_jsonb_gin.createIndex_ms)}
                                        </div>
                                        <div style={{ fontSize: 11, opacity: 0.5, fontFamily: 'monospace' }}>
                                            USING GIN(data)
                                        </div>
                                    </div>
                                    <div style={cardStyle}>
                                        <div style={{ fontSize: 12, opacity: 0.7 }}>B-Tree SELECT</div>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.pgJsonb }}>
                                            {formatMs(results.execution_time_ms.selectIndexed?.pg_jsonb)}
                                        </div>
                                    </div>
                                    <div style={cardStyle}>
                                        <div style={{ fontSize: 12, opacity: 0.7 }}>GIN SELECT</div>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: '#9B59B6' }}>
                                            {formatMs(results.bonus_jsonb_gin.selectIndexed_ms)}
                                        </div>
                                        <div style={{ fontSize: 11, opacity: 0.5, fontFamily: 'monospace' }}>
                                            data @&gt; '{`{"category":"..."}`}'
                                        </div>
                                    </div>
                                    <div style={cardStyle}>
                                        <div style={{ fontSize: 12, opacity: 0.7 }}>GIN Index Size</div>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: '#9B59B6' }}>
                                            {formatBytes(results.bonus_jsonb_gin.storage?.index)}
                                        </div>
                                    </div>
                                    <div style={cardStyle}>
                                        <div style={{ fontSize: 12, opacity: 0.7 }}>GIN Total Size</div>
                                        <div style={{ fontSize: 22, fontWeight: 700, color: '#9B59B6' }}>
                                            {formatBytes(results.bonus_jsonb_gin.storage?.total)}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
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
                                    <th style={thStyle}>Revisions</th>
                                    <th style={{ ...thStyle, color: COLORS.pgRel }}>PG Insert</th>
                                    <th style={{ ...thStyle, color: COLORS.mongodb }}>MG Insert</th>
                                    <th style={{ ...thStyle, color: COLORS.pgJsonb }}>JB Insert</th>
                                    <th style={{ ...thStyle, color: COLORS.pgRel }}>PG Storage</th>
                                    <th style={{ ...thStyle, color: COLORS.mongodb }}>MG Storage</th>
                                    <th style={{ ...thStyle, color: COLORS.pgJsonb }}>JB Storage</th>
                                    <th style={thStyle}>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((h, i) => (
                                    <tr key={i}>
                                        <td style={tdStyle}>{history.length - i}</td>
                                        <td style={tdStyle}>{h.meta.revisions?.toLocaleString()}</td>
                                        <td style={tdStyle}>{formatMs(h.execution_time_ms.insert?.pg_relational)}</td>
                                        <td style={tdStyle}>{formatMs(h.execution_time_ms.insert?.mongodb)}</td>
                                        <td style={tdStyle}>{formatMs(h.execution_time_ms.insert?.pg_jsonb)}</td>
                                        <td style={tdStyle}>{formatBytes(h.storage_bytes.pg_relational?.total)}</td>
                                        <td style={tdStyle}>{formatBytes(h.storage_bytes.mongodb?.total)}</td>
                                        <td style={tdStyle}>{formatBytes(h.storage_bytes.pg_jsonb?.total)}</td>
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

function InfoCard({ label, value }) {
    return (
        <div style={cardStyle}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
        </div>
    );
}

function ResultCard3({ title, pgRel, mongo, pgJsonb }) {
    const min = Math.min(pgRel, mongo, pgJsonb);
    const w = winner3(pgRel, mongo, pgJsonb);
    return (
        <div style={cardStyle}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, opacity: 0.8 }}>{title}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: COLORS.pgRel, fontWeight: pgRel === min ? 700 : 400 }}>
                    PG: {formatMs(pgRel)}
                </span>
                <span style={{ color: COLORS.mongodb, fontWeight: mongo === min ? 700 : 400 }}>
                    MG: {formatMs(mongo)}
                </span>
                <span style={{ color: COLORS.pgJsonb, fontWeight: pgJsonb === min ? 700 : 400 }}>
                    JB: {formatMs(pgJsonb)}
                </span>
            </div>
            <div style={{
                fontSize: 11, marginTop: 4, padding: '2px 6px', borderRadius: 4,
                background: 'var(--bg-tertiary, var(--bg-secondary))',
                display: 'inline-block',
            }}>
                Winner: {w}
            </div>
        </div>
    );
}

function SampleDataSection({ data }) {
    const sectionHead = { margin: '16px 0 8px', fontSize: 14, fontWeight: 600 };
    const subNote = { fontSize: 11, opacity: 0.6, marginBottom: 6 };
    const monoTd = { ...tdStyle, fontFamily: 'monospace', fontSize: 12, whiteSpace: 'nowrap' };
    const scrollWrap = { overflowX: 'auto', marginBottom: 16 };

    return (
        <div style={{ marginTop: 12, padding: 16, borderRadius: 8, border: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}>
            {/* bench_category */}
            <h4 style={sectionHead}>
                bench_category <span style={{ fontWeight: 400, opacity: 0.6 }}>({data.categories.length} of 58 rows)</span>
            </h4>
            <p style={subNote}>rootid = UUID auto-generated, prev_id = linked list</p>
            <div style={scrollWrap}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>id</th>
                            <th style={thStyle}>name</th>
                            <th style={thStyle}>date</th>
                            <th style={thStyle}>time</th>
                            <th style={thStyle}>date_time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.categories.map(c => (
                            <tr key={c.id}>
                                <td style={monoTd}>{c.id}</td>
                                <td style={tdStyle}>{c.name}</td>
                                <td style={monoTd}>{c.date}</td>
                                <td style={monoTd}>{c.time}</td>
                                <td style={monoTd}>{c.date_time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* bench_page */}
            <h4 style={sectionHead}>
                bench_page <span style={{ fontWeight: 400, opacity: 0.6 }}>({data.pages.length} of 399 rows)</span>
            </h4>
            <p style={subNote}>rootid = Wikipedia pageid, category_id = FK → bench_category</p>
            <div style={scrollWrap}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>id</th>
                            <th style={thStyle}>rootid (pageid)</th>
                            <th style={thStyle}>category</th>
                            <th style={thStyle}>page_title</th>
                            <th style={thStyle}>date</th>
                            <th style={thStyle}>date_time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.pages.map(p => (
                            <tr key={p.id}>
                                <td style={monoTd}>{p.id}</td>
                                <td style={monoTd}>{p.rootid}</td>
                                <td style={tdStyle}>{p.category}</td>
                                <td style={tdStyle}>{p.page_title}</td>
                                <td style={monoTd}>{p.date}</td>
                                <td style={monoTd}>{p.date_time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* bench_revision */}
            <h4 style={sectionHead}>
                bench_revision <span style={{ fontWeight: 400, opacity: 0.6 }}>({data.revisions.length} of 3,657 rows)</span>
            </h4>
            <p style={subNote}>rootid = revid, prev_id = parentid (linked list ของ edit history)</p>
            <div style={scrollWrap}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>id</th>
                            <th style={thStyle}>rootid (revid)</th>
                            <th style={thStyle}>prev_id (parentid)</th>
                            <th style={thStyle}>pageid</th>
                            <th style={thStyle}>username</th>
                            <th style={thStyle}>comment</th>
                            <th style={thStyle}>content</th>
                            <th style={thStyle}>date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.revisions.map(r => (
                            <tr key={r.id}>
                                <td style={monoTd}>{r.id}</td>
                                <td style={monoTd}>{r.rootid}</td>
                                <td style={monoTd}>{r.prev_id}</td>
                                <td style={monoTd}>{r.pageid}</td>
                                <td style={tdStyle}>{r.username}</td>
                                <td style={{ ...tdStyle, fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {r.comment}
                                </td>
                                <td style={monoTd}>{r.content_length.toLocaleString()} chars</td>
                                <td style={monoTd}>{r.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* flat row (MongoDB / PG JSONB) */}
            <h4 style={sectionHead}>
                flatRow (MongoDB / PG JSONB) <span style={{ fontWeight: 400, opacity: 0.6 }}>({data.flatRows.length} of 3,657 docs)</span>
            </h4>
            <p style={subNote}>denormalize จาก 3 tables → flat document สำหรับ MongoDB collection + PG JSONB column</p>
            <div style={scrollWrap}>
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>rootid</th>
                            <th style={thStyle}>prev_id</th>
                            <th style={thStyle}>page_title</th>
                            <th style={thStyle}>category</th>
                            <th style={thStyle}>username</th>
                            <th style={thStyle}>comment</th>
                            <th style={thStyle}>content</th>
                            <th style={thStyle}>date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.flatRows.map(f => (
                            <tr key={f.rootid}>
                                <td style={monoTd}>{f.rootid}</td>
                                <td style={monoTd}>{f.prev_id}</td>
                                <td style={tdStyle}>{f.page_title}</td>
                                <td style={tdStyle}>{f.category}</td>
                                <td style={tdStyle}>{f.username}</td>
                                <td style={{ ...tdStyle, fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {f.comment}
                                </td>
                                <td style={monoTd}>{f.content_length.toLocaleString()} chars</td>
                                <td style={monoTd}>{f.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Relation diagram */}
            <h4 style={sectionHead}>Relation</h4>
            <pre style={{
                fontSize: 12, fontFamily: 'monospace', padding: 12, borderRadius: 6,
                background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
                overflowX: 'auto', lineHeight: 1.5,
            }}>
{`bench_category (58)       bench_page (399)          bench_revision (3,657)
┌─────────────────┐       ┌─────────────────┐       ┌──────────────────────┐
│ id: 1           │──┐    │ id: 1           │──┐    │ id: 1                │
│ rootid: uuid    │  │    │ rootid: 22395556│  │    │ rootid: 1300578444   │
│ name:           │  ├───>│ category_id: 1  │  ├───>│ prev_id: 1283297281  │
│  agricultural_  │  │    │ page_title:     │  │    │ page_id: 1           │
│  science        │  │    │  Agricultural   │  │    │ username: Wikideas1  │
│ date: 20250715  │  │    │  engineering    │  │    │ date: 20250715       │
└─────────────────┘  │    └─────────────────┘  │    └──────────────────────┘
                     │                         │    ┌──────────────────────┐
                     │                         └───>│ id: 2                │
                     │                              │ rootid: 1283297281   │
                     │                              │ prev_id: 1283296400  │
                     │                              │ page_id: 1           │
                     │                              │ username: Entranced98│
                     └─ (1:N)                       └──────────────────────┘
                                                         (linked list)`}
            </pre>
        </div>
    );
}

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

const btnStyle = {
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
