import { useState, useMemo } from 'react';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    generateChartData, calcInsertTime, calcSelectNoIndex,
    calcSelectIndexed, calcUpdateTime, calcDeleteTime,
    calcJsonQuery, getBigOTable
} from '../../../lib/benchmarkCalc';
import {
    estimatePostgresSize, estimateMongoSize, projectGrowth, formatBytes
} from '../../../lib/storageCalc';

const COLORS = {
    postgres: '#336791',
    mongodb: '#4DB33D',
    postgresLight: '#5B9BD5',
    mongoLight: '#6FCF5F',
};

const N_PRESETS = [100, 500, 1000, 5000, 10000, 50000, 100000];

function BenchmarkPage({ addLog }) {
    const [n, setN] = useState(10000);
    const [k, setK] = useState(10);
    const [m, setM] = useState(2);
    const [activeTab, setActiveTab] = useState('crud');
    const [jsonIndexed, setJsonIndexed] = useState(false);
    const [estAvgBytes, setEstAvgBytes] = useState(200);
    const [estIndexes, setEstIndexes] = useState(2);
    const [growthPerMonth, setGrowthPerMonth] = useState(500);
    const [growthStartN, setGrowthStartN] = useState(1000);

    const nValues = useMemo(() => {
        const vals = [100, 500, 1000, 2500, 5000, 7500, 10000];
        if (n > 10000) {
            vals.push(25000, 50000, n);
        }
        return vals.filter(v => v <= Math.max(n, 10000));
    }, [n]);

    const chartData = useMemo(() => generateChartData(nValues, k, m), [nValues, k, m]);
    const bigO = useMemo(() => getBigOTable(n, k, m), [n, k, m]);

    const currentResults = useMemo(() => {
        const insert = calcInsertTime(n, m);
        const selectNo = calcSelectNoIndex(n);
        const selectIdx = calcSelectIndexed(n, k);
        const update = calcUpdateTime(n, m);
        const del = calcDeleteTime(n, m);
        const json = calcJsonQuery(n, jsonIndexed);
        return { insert, selectNo, selectIdx, update, del, json };
    }, [n, k, m, jsonIndexed]);

    const handleNChange = (value) => {
        const val = Math.max(1, Math.min(1000000, parseInt(value) || 0));
        setN(val);
        addLog(`N = ${val.toLocaleString()} records`);
    };

    const tabs = [
        { id: 'crud', label: 'CRUD Compare' },
        { id: 'bigo', label: 'Big O Table' },
        { id: 'json', label: 'JSONB vs BSON' },
        { id: 'index', label: 'Index Impact' },
        { id: 'storage', label: 'Storage Size' },
        { id: 'growth', label: 'Growth Projector' },
    ];

    return (
        <div className="page-content">
            <h1>DB Benchmark — PostgreSQL vs MongoDB</h1>
            <p className="lead">
                เปรียบเทียบ performance แบบ interactive — ใส่ค่า N, K, M แล้วดู chart
                <br />
                <small style={{ opacity: 0.7 }}>
                    ข้อมูลจาก research_mongo_vs_postgres.md (estimated, ไม่ใช่ benchmark จริง)
                </small>
            </p>

            {/* Input Controls */}
            <section className="content-section">
                <h2>Parameters</h2>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
                            N (จำนวน records)
                        </label>
                        <input
                            type="number"
                            value={n}
                            onChange={e => handleNChange(e.target.value)}
                            min={1}
                            max={1000000}
                            style={inputStyle}
                        />
                        <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {N_PRESETS.map(preset => (
                                <button
                                    key={preset}
                                    onClick={() => handleNChange(preset)}
                                    style={{
                                        ...presetBtnStyle,
                                        background: n === preset ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                                        color: n === preset ? '#fff' : 'var(--text-primary)',
                                    }}
                                >
                                    {preset >= 1000 ? `${preset / 1000}K` : preset}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
                            K (result count)
                        </label>
                        <input
                            type="number"
                            value={k}
                            onChange={e => setK(Math.max(1, parseInt(e.target.value) || 1))}
                            min={1}
                            max={10000}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
                            M (จำนวน indexes)
                        </label>
                        <input
                            type="number"
                            value={m}
                            onChange={e => setM(Math.max(0, parseInt(e.target.value) || 0))}
                            min={0}
                            max={20}
                            style={inputStyle}
                        />
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <section className="content-section">
                <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid var(--border-primary)', marginBottom: 16 }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '8px 20px',
                                border: 'none',
                                borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                background: 'transparent',
                                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                fontWeight: activeTab === tab.id ? 700 : 400,
                                cursor: 'pointer',
                                marginBottom: -2,
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'crud' && (
                    <CrudTab
                        n={n} chartData={chartData}
                        results={currentResults}
                    />
                )}
                {activeTab === 'bigo' && <BigOTab bigO={bigO} n={n} k={k} m={m} />}
                {activeTab === 'json' && (
                    <JsonTab
                        n={n} jsonIndexed={jsonIndexed}
                        setJsonIndexed={setJsonIndexed}
                        results={currentResults}
                    />
                )}
                {activeTab === 'index' && <IndexTab n={n} chartData={chartData} />}
                {activeTab === 'storage' && (
                    <StorageTab
                        n={n} avgBytes={estAvgBytes} setAvgBytes={setEstAvgBytes}
                        indexes={estIndexes} setIndexes={setEstIndexes}
                    />
                )}
                {activeTab === 'growth' && (
                    <GrowthTab
                        n={growthStartN} setN={setGrowthStartN}
                        avgBytes={estAvgBytes}
                        growthPerMonth={growthPerMonth}
                        setGrowthPerMonth={setGrowthPerMonth}
                    />
                )}
            </section>
        </div>
    );
}

/* ───── Tab: CRUD Compare ───── */
function CrudTab({ n, chartData, results }) {
    return (
        <div>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
                <ResultCard
                    title={`INSERT ${n.toLocaleString()} rows`}
                    pg={results.insert.postgres}
                    mg={results.insert.mongodb}
                    complexity={results.insert.complexity}
                />
                <ResultCard
                    title="SELECT (no index)"
                    pg={results.selectNo.postgres}
                    mg={results.selectNo.mongodb}
                    complexity={results.selectNo.complexity}
                />
                <ResultCard
                    title="SELECT (indexed)"
                    pg={results.selectIdx.postgres}
                    mg={results.selectIdx.mongodb}
                    complexity={results.selectIdx.complexity}
                />
                <ResultCard
                    title="UPDATE (by PK)"
                    pg={results.update.postgres}
                    mg={results.update.mongodb}
                    complexity={results.update.complexity}
                />
                <ResultCard
                    title="DELETE (by PK)"
                    pg={results.del.postgres}
                    mg={results.del.mongodb}
                    complexity={results.del.complexity}
                />
            </div>

            {/* INSERT Chart */}
            <h3>INSERT — Batch Insert (ms)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                    <XAxis dataKey="label" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="insertPg" name="PostgreSQL" fill={COLORS.postgres} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="insertMg" name="MongoDB" fill={COLORS.mongodb} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>

            {/* SELECT no index Chart */}
            <h3 style={{ marginTop: 24 }}>SELECT (no index) — Full Scan (ms)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                    <XAxis dataKey="label" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Line type="monotone" dataKey="selectNoPg" name="PostgreSQL" stroke={COLORS.postgres} strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="selectNoMg" name="MongoDB" stroke={COLORS.mongodb} strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>

            {/* UPDATE/DELETE Chart */}
            <h3 style={{ marginTop: 24 }}>UPDATE & DELETE — By Primary Key (ms)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                    <XAxis dataKey="label" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="updatePg" name="PG Update" fill={COLORS.postgres} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="updateMg" name="MG Update" fill={COLORS.mongodb} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="deletePg" name="PG Delete" fill={COLORS.postgresLight} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="deleteMg" name="MG Delete" fill={COLORS.mongoLight} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

/* ───── Tab: Big O Table ───── */
function BigOTab({ bigO, n, k, m }) {
    return (
        <div>
            <h3>ไม่มี Index</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Operation</th>
                        <th style={{ ...thStyle, color: COLORS.postgres }}>PostgreSQL</th>
                        <th style={{ ...thStyle, color: COLORS.mongodb }}>MongoDB</th>
                    </tr>
                </thead>
                <tbody>
                    {bigO.noIndex.map((row, i) => (
                        <tr key={i}>
                            <td style={tdStyle}>{row.op}</td>
                            <td style={{ ...tdStyle, fontFamily: 'monospace' }}>{row.postgres}</td>
                            <td style={{ ...tdStyle, fontFamily: 'monospace' }}>{row.mongodb}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 style={{ marginTop: 24 }}>มี B-Tree Index (N={n.toLocaleString()}, K={k}, M={m})</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Operation</th>
                        <th style={{ ...thStyle, color: COLORS.postgres }}>PostgreSQL</th>
                        <th style={{ ...thStyle, color: COLORS.mongodb }}>MongoDB</th>
                    </tr>
                </thead>
                <tbody>
                    {bigO.withIndex.map((row, i) => (
                        <tr key={i}>
                            <td style={tdStyle}>{row.op}</td>
                            <td style={{ ...tdStyle, fontFamily: 'monospace' }}>{row.postgres}</td>
                            <td style={{ ...tdStyle, fontFamily: 'monospace' }}>{row.mongodb}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={noteStyle}>
                <strong>Notes:</strong>
                <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                    <li>MongoDB Sort &gt; 100MB ต้อง <code>allowDiskUse: true</code></li>
                    <li>PostgreSQL JOIN ใช้ Hash Join = O(N+M), MongoDB $lookup = O(N×M)</li>
                    <li>Hash index: O(1) equality แต่ไม่รองรับ range/sort</li>
                </ul>
            </div>
        </div>
    );
}

/* ───── Tab: JSONB vs BSON ───── */
function JsonTab({ n, jsonIndexed, setJsonIndexed, results }) {
    const json = results.json;
    return (
        <div>
            <h3>Nested Query: <code>address.city = 'Bangkok'</code></h3>

            <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={jsonIndexed}
                        onChange={e => setJsonIndexed(e.target.checked)}
                    />
                    <span>มี Index</span>
                </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <div style={cardStyle}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>PG GIN Index</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.postgres }}>
                        {json.postgresGin.toFixed(3)} ms
                    </div>
                </div>
                <div style={cardStyle}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>PG Expression B-Tree</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.postgres }}>
                        {json.postgresExpr.toFixed(3)} ms
                    </div>
                </div>
                <div style={cardStyle}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>MongoDB</div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.mongodb }}>
                        {json.mongodb.toFixed(3)} ms
                    </div>
                </div>
            </div>

            <div style={{ ...noteStyle, marginTop: 16 }}>
                <strong>Complexity:</strong> {json.complexity}
            </div>

            <h3 style={{ marginTop: 24 }}>เมื่อไหร่ใช้อะไร?</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>เงื่อนไข</th>
                        <th style={thStyle}>แนะนำ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style={tdStyle}>ไม่รู้ query field ไหน</td><td style={tdStyle}>PostgreSQL GIN (1 index ครอบคลุมทุก key)</td></tr>
                    <tr><td style={tdStyle}>รู้ query path แน่นอน</td><td style={tdStyle}>MongoDB single index / PG expression index</td></tr>
                    <tr><td style={tdStyle}>Nested ลึก 3+ ระดับ ไม่มี index</td><td style={tdStyle}>MongoDB (BSON native traversal)</td></tr>
                    <tr><td style={tdStyle}>JOIN JSON กับ relational data</td><td style={tdStyle}>PostgreSQL</td></tr>
                </tbody>
            </table>

            <h3 style={{ marginTop: 24 }}>Format Comparison</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}></th>
                        <th style={{ ...thStyle, color: COLORS.postgres }}>PostgreSQL JSONB</th>
                        <th style={{ ...thStyle, color: COLORS.mongodb }}>MongoDB BSON</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style={tdStyle}>Format</td><td style={tdStyle}>Binary, keys sorted</td><td style={tdStyle}>Binary JSON, preserve key order</td></tr>
                    <tr><td style={tdStyle}>Max size</td><td style={tdStyle}>1GB (TOAST)</td><td style={tdStyle}>16MB per document</td></tr>
                    <tr><td style={tdStyle}>Types</td><td style={tdStyle}>JSON standard</td><td style={tdStyle}>Extended (Date, ObjectId, Decimal128, ...)</td></tr>
                </tbody>
            </table>
        </div>
    );
}

/* ───── Tab: Index Impact ───── */
function IndexTab({ n, chartData }) {
    return (
        <div>
            <h3>PostgreSQL Index Types</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Type</th>
                        <th style={thStyle}>ใช้ทำอะไร</th>
                        <th style={thStyle}>Write Overhead</th>
                        <th style={thStyle}>หมายเหตุ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style={tdStyle}>B-Tree (default)</td><td style={tdStyle}>Equality, range, sort</td><td style={tdStyle}>~10-20%</td><td style={tdStyle}>อเนกประสงค์ที่สุด</td></tr>
                    <tr><td style={tdStyle}>Hash</td><td style={tdStyle}>Equality เท่านั้น (=)</td><td style={tdStyle}>น้อยกว่า B-Tree</td><td style={tdStyle}>ทำ range ไม่ได้</td></tr>
                    <tr><td style={tdStyle}>GIN on JSONB</td><td style={tdStyle}>Containment (@&gt;), existence (?)</td><td style={tdStyle}>~30-50%</td><td style={tdStyle}>jsonb_path_ops เล็กกว่า 40-60%</td></tr>
                </tbody>
            </table>

            <h3 style={{ marginTop: 24 }}>MongoDB Index Types</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Type</th>
                        <th style={thStyle}>ใช้ทำอะไร</th>
                        <th style={thStyle}>Write Overhead</th>
                        <th style={thStyle}>หมายเหตุ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style={tdStyle}>Default _id</td><td style={tdStyle}>PK lookup</td><td style={tdStyle}>~8-10%</td><td style={tdStyle}>ลบไม่ได้</td></tr>
                    <tr><td style={tdStyle}>Single field</td><td style={tdStyle}>Equality + range 1 field</td><td style={tdStyle}>~10-15%</td><td style={tdStyle}>รองรับ sort</td></tr>
                    <tr><td style={tdStyle}>Compound</td><td style={tdStyle}>Multi-field, covered queries</td><td style={tdStyle}>สูงกว่า</td><td style={tdStyle}>ESR rule, max 32 fields</td></tr>
                    <tr><td style={tdStyle}>Text</td><td style={tdStyle}>Full-text search</td><td style={tdStyle}>~50%+</td><td style={tdStyle}>1 ต่อ collection</td></tr>
                </tbody>
            </table>

            {/* SELECT indexed vs no-index chart */}
            <h3 style={{ marginTop: 24 }}>SELECT — Indexed vs No Index (ms)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                    <XAxis dataKey="label" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="selectNoPg" name="PG No Index" fill={COLORS.postgresLight} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="selectIdxPg" name="PG Indexed" fill={COLORS.postgres} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="selectNoMg" name="MG No Index" fill={COLORS.mongoLight} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="selectIdxMg" name="MG Indexed" fill={COLORS.mongodb} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

/* ───── Tab: Storage Size ───── */
function StorageTab({ n, avgBytes, setAvgBytes, indexes, setIndexes }) {
    const pg = useMemo(() => estimatePostgresSize(n, avgBytes, indexes), [n, avgBytes, indexes]);
    const mongo = useMemo(() => estimateMongoSize(n, avgBytes, indexes), [n, avgBytes, indexes]);
    const localEst = n * (avgBytes + 100);

    const comparisonData = [
        { name: 'Data', pg: pg.dataBytes, mongo: mongo.dataBytes },
        { name: 'Indexes', pg: pg.indexBytes + pg.ginBytes, mongo: mongo.idIndexBytes + mongo.additionalIndexBytes },
        { name: 'Overhead', pg: pg.toastBytes, mongo: mongo.rawDataBytes - mongo.dataBytes },
    ];

    const totalData = [
        { name: 'PostgreSQL', bytes: pg.totalBytes },
        { name: 'MongoDB', bytes: mongo.totalBytes },
        { name: 'localStorage', bytes: localEst },
    ];

    return (
        <div>
            <h3>Storage Parameters</h3>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
                <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>N (ใช้จาก parameter ด้านบน)</label>
                    <input type="number" value={n} disabled style={{ ...inputStyle, opacity: 0.6 }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Avg record size (bytes)</label>
                    <input type="number" value={avgBytes} onChange={e => setAvgBytes(Math.max(10, parseInt(e.target.value) || 10))} min={10} max={10000} style={inputStyle} />
                </div>
                <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Indexes</label>
                    <input type="number" value={indexes} onChange={e => setIndexes(Math.max(0, parseInt(e.target.value) || 0))} min={0} max={20} style={inputStyle} />
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
                <div style={cardStyle}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>PostgreSQL</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.postgres }}>{formatBytes(pg.totalBytes)}</div>
                    <div style={{ fontSize: 11, opacity: 0.5 }}>row: {pg.rowSize}B, {pg.rowsPerPage} rows/page</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>MongoDB</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.mongodb }}>{formatBytes(mongo.totalBytes)}</div>
                    <div style={{ fontSize: 11, opacity: 0.5 }}>BSON: {Math.round(mongo.bsonSize)}B, compress: {Math.round(mongo.compressionRatio * 100)}%</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>localStorage</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#E67E22' }}>{formatBytes(localEst)}</div>
                    <div style={{ fontSize: 11, opacity: 0.5 }}>JSON + overhead</div>
                </div>
            </div>

            {/* Breakdown Chart */}
            <h3>Storage Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" tickFormatter={v => formatBytes(v)} />
                    <Tooltip formatter={v => formatBytes(v)} contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="pg" name="PostgreSQL" fill={COLORS.postgres} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="mongo" name="MongoDB" fill={COLORS.mongodb} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>

            {/* Total Comparison */}
            <h3 style={{ marginTop: 24 }}>Total Comparison</h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={totalData} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                    <XAxis type="number" stroke="var(--text-secondary)" tickFormatter={v => formatBytes(v)} />
                    <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" width={90} />
                    <Tooltip formatter={v => formatBytes(v)} contentStyle={tooltipStyle} />
                    <Bar dataKey="bytes" name="Total" radius={[0, 4, 4, 0]}>
                        {totalData.map((entry, i) => {
                            const colors = [COLORS.postgres, COLORS.mongodb, '#E67E22'];
                            return <rect key={i} fill={colors[i]} />;
                        })}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Detail Table */}
            <h3 style={{ marginTop: 24 }}>Detail</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Component</th>
                        <th style={{ ...thStyle, color: COLORS.postgres }}>PostgreSQL</th>
                        <th style={{ ...thStyle, color: COLORS.mongodb }}>MongoDB</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td style={tdStyle}>Data (rows/documents)</td><td style={tdStyle}>{formatBytes(pg.dataBytes)}</td><td style={tdStyle}>{formatBytes(mongo.dataBytes)}</td></tr>
                    <tr><td style={tdStyle}>TOAST / Compression savings</td><td style={tdStyle}>{formatBytes(pg.toastBytes)}</td><td style={tdStyle}>{formatBytes(mongo.rawDataBytes - mongo.dataBytes)} saved</td></tr>
                    <tr><td style={tdStyle}>B-Tree Indexes</td><td style={tdStyle}>{formatBytes(pg.indexBytes)}</td><td style={tdStyle}>{formatBytes(mongo.idIndexBytes + mongo.additionalIndexBytes)}</td></tr>
                    <tr><td style={tdStyle}>GIN Index (JSONB)</td><td style={tdStyle}>{formatBytes(pg.ginBytes)}</td><td style={tdStyle}>-</td></tr>
                    <tr style={{ fontWeight: 700 }}><td style={tdStyle}>Total</td><td style={tdStyle}>{formatBytes(pg.totalBytes)}</td><td style={tdStyle}>{formatBytes(mongo.totalBytes)}</td></tr>
                </tbody>
            </table>
        </div>
    );
}

/* ───── Tab: Growth Projector ───── */
function GrowthTab({ n, setN, avgBytes, growthPerMonth, setGrowthPerMonth }) {
    const projections = useMemo(
        () => projectGrowth(n, avgBytes, 12, growthPerMonth),
        [n, avgBytes, growthPerMonth]
    );

    return (
        <div>
            <h3>Growth Projection — PG vs MongoDB (12 months)</h3>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24, alignItems: 'flex-end' }}>
                <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Start N (records)</label>
                    <input type="number" value={n} onChange={e => setN(Math.max(0, parseInt(e.target.value) || 0))} min={0} max={10000000} style={inputStyle} />
                </div>
                <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>Growth / month</label>
                    <input type="number" value={growthPerMonth} onChange={e => setGrowthPerMonth(Math.max(1, parseInt(e.target.value) || 1))} min={1} max={100000} style={inputStyle} />
                </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={projections} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                    <XAxis dataKey="label" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" tickFormatter={v => formatBytes(v)} />
                    <Tooltip formatter={v => formatBytes(v)} contentStyle={tooltipStyle} />
                    <Legend />
                    <Line type="monotone" dataKey="pgBytes" name="PostgreSQL" stroke={COLORS.postgres} strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="mongoBytes" name="MongoDB" stroke={COLORS.mongodb} strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="localBytes" name="localStorage" stroke="#E67E22" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                </LineChart>
            </ResponsiveContainer>

            {/* Projection Table */}
            <table style={{ ...tableStyle, marginTop: 16 }}>
                <thead>
                    <tr>
                        <th style={thStyle}>Month</th>
                        <th style={thStyle}>Records</th>
                        <th style={{ ...thStyle, color: COLORS.postgres }}>PostgreSQL</th>
                        <th style={{ ...thStyle, color: COLORS.mongodb }}>MongoDB</th>
                        <th style={{ ...thStyle, color: '#E67E22' }}>localStorage</th>
                    </tr>
                </thead>
                <tbody>
                    {projections.filter((_, i) => i % 3 === 0 || i === projections.length - 1).map(p => (
                        <tr key={p.month}>
                            <td style={tdStyle}>{p.label}</td>
                            <td style={tdStyle}>{p.records.toLocaleString()}</td>
                            <td style={tdStyle}>{formatBytes(p.pgBytes)}</td>
                            <td style={tdStyle}>{formatBytes(p.mongoBytes)}</td>
                            <td style={tdStyle}>{formatBytes(p.localBytes)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={noteStyle}>
                <strong>localStorage limit:</strong> ~5MB limit,
                ที่ {growthPerMonth} records/month จะเต็มประมาณ {Math.ceil((5 * 1024 * 1024) / (growthPerMonth * (avgBytes + 100)))} เดือน
            </div>
        </div>
    );
}

/* ───── Shared Components ───── */
function ResultCard({ title, pg, mg, complexity }) {
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
            <div style={{ fontSize: 11, opacity: 0.6, fontFamily: 'monospace' }}>{complexity}</div>
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

export default BenchmarkPage;
