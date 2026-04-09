import { useState, useMemo } from 'react';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
    measureLocalStorage, analyzeFieldSizes, formatBytes,
    estimatePostgresSize, estimateMongoSize, projectGrowth
} from '../../../lib/storageCalc';

const COLORS = {
    postgres: '#336791',
    mongodb: '#4DB33D',
    local: '#E67E22',
    accent: 'var(--accent-primary)',
};

const PIE_COLORS = ['#336791', '#4DB33D', '#E67E22', '#9B59B6', '#E74C3C', '#1ABC9C'];

function StoragePage({ addLog }) {
    const [refreshKey, setRefreshKey] = useState(0);
    const [activeTab, setActiveTab] = useState('live');
    const [estN, setEstN] = useState(10000);
    const [estAvgBytes, setEstAvgBytes] = useState(200);
    const [estIndexes, setEstIndexes] = useState(2);
    const [growthPerMonth, setGrowthPerMonth] = useState(500);

    const storage = useMemo(() => {
        void refreshKey;
        return measureLocalStorage();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(k => k + 1);
        addLog('Storage data refreshed');
    };

    const tabs = [
        { id: 'live', label: 'Live Monitor' },
        { id: 'fields', label: 'Field Analysis' },
        { id: 'estimate', label: 'Size Estimator' },
        { id: 'growth', label: 'Growth Projector' },
    ];

    return (
        <div className="page-content">
            <h1>Storage Analytics</h1>
            <p className="lead">
                วัดพื้นที่จริงจาก localStorage + ประมาณ PostgreSQL / MongoDB storage
            </p>

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

                {activeTab === 'live' && <LiveMonitorTab storage={storage} onRefresh={handleRefresh} />}
                {activeTab === 'fields' && <FieldAnalysisTab storage={storage} />}
                {activeTab === 'estimate' && (
                    <EstimatorTab
                        n={estN} setN={setEstN}
                        avgBytes={estAvgBytes} setAvgBytes={setEstAvgBytes}
                        indexes={estIndexes} setIndexes={setEstIndexes}
                    />
                )}
                {activeTab === 'growth' && (
                    <GrowthTab
                        storage={storage}
                        growthPerMonth={growthPerMonth}
                        setGrowthPerMonth={setGrowthPerMonth}
                    />
                )}
            </section>
        </div>
    );
}

/* ───── Tab: Live Monitor ───── */
function LiveMonitorTab({ storage, onRefresh }) {
    const tableData = Object.values(storage.tables).map(t => ({
        name: t.label,
        bytes: t.bytes,
        count: t.count,
    }));

    const usageColor = storage.usagePercent > 80 ? '#E74C3C'
        : storage.usagePercent > 50 ? '#E67E22' : '#2ECC71';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>localStorage Usage</h3>
                <button onClick={onRefresh} style={refreshBtnStyle}>Refresh</button>
            </div>

            {/* Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
                <MetricCard label="Project Data" value={formatBytes(storage.totalProjectBytes)} sub="4 tables" />
                <MetricCard label="Total localStorage" value={formatBytes(storage.totalAllBytes)} sub={`${storage.usagePercent}% of 5MB`} color={usageColor} />
                <MetricCard label="Remaining" value={formatBytes(storage.limitBytes - storage.totalAllBytes)} sub="available" color="#2ECC71" />
            </div>

            {/* Usage Bar */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span>0 B</span>
                    <span>5 MB</span>
                </div>
                <div style={{ height: 24, background: 'var(--bg-secondary)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-primary)' }}>
                    <div style={{
                        height: '100%',
                        width: `${Math.min(storage.usagePercent, 100)}%`,
                        background: usageColor,
                        borderRadius: 12,
                        transition: 'width 0.3s',
                    }} />
                </div>
            </div>

            {/* Per-Table Breakdown */}
            <h3>Per Table</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Table</th>
                        <th style={thStyle}>Records</th>
                        <th style={thStyle}>Size</th>
                        <th style={thStyle}>Avg/Record</th>
                        <th style={thStyle}>Min</th>
                        <th style={thStyle}>Max</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(storage.tables).map(t => (
                        <tr key={t.label}>
                            <td style={{ ...tdStyle, fontWeight: 600 }}>{t.label}</td>
                            <td style={tdStyle}>{t.count}</td>
                            <td style={tdStyle}>{formatBytes(t.bytes)}</td>
                            <td style={tdStyle}>{formatBytes(t.avgRecordBytes)}</td>
                            <td style={tdStyle}>{formatBytes(t.minRecordBytes)}</td>
                            <td style={tdStyle}>{formatBytes(t.maxRecordBytes)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pie Chart */}
            <h3 style={{ marginTop: 24 }}>Storage Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={tableData.filter(t => t.bytes > 0)}
                        dataKey="bytes"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                        {tableData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatBytes(v)} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

/* ───── Tab: Field Analysis ───── */
function FieldAnalysisTab({ storage }) {
    const formsTable = storage.tables.forms;
    const fieldData = useMemo(
        () => analyzeFieldSizes(formsTable.records),
        [formsTable.records]
    );

    if (formsTable.count === 0) {
        return <div style={{ padding: 40, textAlign: 'center', opacity: 0.5 }}>ไม่มีข้อมูลใน data_form — ไปสร้างใน Form Builder ก่อน</div>;
    }

    const chartData = fieldData.map(f => ({
        name: f.key,
        totalBytes: f.totalBytes,
        avgBytes: f.avgBytes,
    }));

    return (
        <div>
            <h3>Field Size Breakdown (data_form)</h3>
            <p style={{ fontSize: 13, opacity: 0.7 }}>{formsTable.count} records analyzed</p>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                    <XAxis type="number" stroke="var(--text-secondary)" tickFormatter={v => formatBytes(v)} />
                    <YAxis type="category" dataKey="name" stroke="var(--text-secondary)" width={70} />
                    <Tooltip formatter={v => formatBytes(v)} contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="totalBytes" name="Total" fill={COLORS.postgres} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="avgBytes" name="Avg/Record" fill={COLORS.mongodb} radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>

            <table style={{ ...tableStyle, marginTop: 16 }}>
                <thead>
                    <tr>
                        <th style={thStyle}>Field</th>
                        <th style={thStyle}>Total</th>
                        <th style={thStyle}>Avg/Record</th>
                        <th style={thStyle}>Records</th>
                    </tr>
                </thead>
                <tbody>
                    {fieldData.map(f => (
                        <tr key={f.key}>
                            <td style={{ ...tdStyle, fontFamily: 'monospace' }}>{f.key}</td>
                            <td style={tdStyle}>{formatBytes(f.totalBytes)}</td>
                            <td style={tdStyle}>{formatBytes(f.avgBytes)}</td>
                            <td style={tdStyle}>{f.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ───── Tab: Size Estimator ───── */
function EstimatorTab({ n, setN, avgBytes, setAvgBytes, indexes, setIndexes }) {
    const pg = useMemo(() => estimatePostgresSize(n, avgBytes, indexes), [n, avgBytes, indexes]);
    const mongo = useMemo(() => estimateMongoSize(n, avgBytes, indexes), [n, avgBytes, indexes]);
    const localEst = n * (avgBytes + 100); // localStorage JSON overhead

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
            <h3>Parameters</h3>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
                <InputGroup label="N (records)" value={n} onChange={setN} min={1} max={10000000} />
                <InputGroup label="Avg record size (bytes)" value={avgBytes} onChange={setAvgBytes} min={10} max={10000} />
                <InputGroup label="Indexes" value={indexes} onChange={setIndexes} min={0} max={20} />
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
                <MetricCard label="PostgreSQL" value={formatBytes(pg.totalBytes)} sub={`row: ${pg.rowSize}B, ${pg.rowsPerPage} rows/page`} color={COLORS.postgres} />
                <MetricCard label="MongoDB" value={formatBytes(mongo.totalBytes)} sub={`BSON: ${Math.round(mongo.bsonSize)}B, compress: ${Math.round(mongo.compressionRatio * 100)}%`} color={COLORS.mongodb} />
                <MetricCard label="localStorage" value={formatBytes(localEst)} sub="JSON + overhead" color={COLORS.local} />
            </div>

            {/* Comparison Chart */}
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
                        <Cell fill={COLORS.postgres} />
                        <Cell fill={COLORS.mongodb} />
                        <Cell fill={COLORS.local} />
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
function GrowthTab({ storage, growthPerMonth, setGrowthPerMonth }) {
    const formsTable = storage.tables.forms;
    const currentCount = formsTable.count;
    const avgBytes = formsTable.avgRecordBytes || 200;

    const projections = useMemo(
        () => projectGrowth(currentCount, avgBytes, 12, growthPerMonth),
        [currentCount, avgBytes, growthPerMonth]
    );

    return (
        <div>
            <h3>Growth Projection (12 months)</h3>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24, alignItems: 'flex-end' }}>
                <InputGroup label="Current records" value={currentCount} onChange={() => {}} disabled />
                <InputGroup label="Avg record (bytes)" value={avgBytes} onChange={() => {}} disabled />
                <InputGroup label="Growth / month" value={growthPerMonth} onChange={setGrowthPerMonth} min={1} max={100000} />
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
                    <Line type="monotone" dataKey="localBytes" name="localStorage" stroke={COLORS.local} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
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
                        <th style={{ ...thStyle, color: COLORS.local }}>localStorage</th>
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

            {storage.usagePercent > 0 && (
                <div style={noteStyle}>
                    <strong>localStorage limit warning:</strong> ถ้า growth {growthPerMonth}/month,
                    localStorage (~5MB) จะเต็มประมาณ {Math.ceil((5 * 1024 * 1024 - storage.totalAllBytes) / (growthPerMonth * (avgBytes + 100)))} เดือน
                </div>
            )}
        </div>
    );
}

/* ───── Shared Components ───── */
function MetricCard({ label, value, sub, color }) {
    return (
        <div style={cardStyle}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: color || 'var(--text-primary)' }}>{value}</div>
            {sub && <div style={{ fontSize: 11, opacity: 0.5 }}>{sub}</div>}
        </div>
    );
}

function InputGroup({ label, value, onChange, min, max, disabled }) {
    return (
        <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 13 }}>{label}</label>
            <input
                type="number"
                value={value}
                onChange={e => onChange(Math.max(min || 0, parseInt(e.target.value) || 0))}
                min={min}
                max={max}
                disabled={disabled}
                style={inputStyle}
            />
        </div>
    );
}

/* ───── Styles ───── */
const cardStyle = {
    padding: 16,
    borderRadius: 8,
    border: '1px solid var(--border-primary)',
    background: 'var(--bg-secondary)',
};

const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: 14 };
const thStyle = { textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid var(--border-primary)', fontWeight: 600 };
const tdStyle = { padding: '6px 12px', borderBottom: '1px solid var(--border-primary)' };
const tooltipStyle = { background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 6, color: 'var(--text-primary)' };
const inputStyle = { padding: '8px 12px', border: '1px solid var(--border-primary)', borderRadius: 6, background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, width: 140 };
const refreshBtnStyle = { padding: '6px 16px', border: '1px solid var(--border-primary)', borderRadius: 4, background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: 13 };
const noteStyle = { marginTop: 16, padding: 12, borderRadius: 6, background: 'var(--bg-tertiary, var(--bg-secondary))', border: '1px solid var(--border-primary)', fontSize: 13 };

export default StoragePage;
