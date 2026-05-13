import { useState, useMemo } from 'react';
import FormControl from '../components/controls/FormControl';
import { schemaToFormConfig, getSchemaPages } from '../lib/schemaTransform';
import { createFormData } from '../lib/schemaService';

function FormFiller({ schema, formcfgJson, onSubmit }) {
    const [formData, setFormData] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const [showDebug, setShowDebug] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    const fullFormConfig = useMemo(
        () => schemaToFormConfig(schema.json, formcfgJson),
        [schema.json, formcfgJson]
    );

    const pages = useMemo(() => getSchemaPages(schema.json), [schema.json]);
    const totalPages = pages.length;
    const hasPages = totalPages > 1;

    const pageConfig = useMemo(() => {
        if (!hasPages) return fullFormConfig;
        const pageFieldKeys = new Set(pages[currentPage]?.fieldKeys || []);
        return {
            ...fullFormConfig,
            controls: fullFormConfig.controls.filter(c => pageFieldKeys.has(c.databind)),
        };
    }, [fullFormConfig, hasPages, pages, currentPage]);

    const config = useMemo(() => ({
        ...pageConfig,
        data: [formData],
        onChange: (e) => {
            const val = e?.target?.value;
            if (val && typeof val === 'object') setFormData(val);
        },
    }), [pageConfig, formData]);

    const hasData = Object.values(formData).some(v => v !== '' && v !== null && v !== undefined);
    const isLastPage = !hasPages || currentPage === totalPages - 1;

    const handleSubmit = async () => {
        if (!hasData) return;
        await createFormData(schema.id, formData);
        setSubmitted(true);
        onSubmit?.();
    };

    const handleReset = () => {
        setFormData({});
        setSubmitted(false);
        setResetKey(k => k + 1);
        setCurrentPage(0);
    };

    const handleNext = () => { if (currentPage < totalPages - 1) setCurrentPage(p => p + 1); };
    const handlePrev = () => { if (currentPage > 0) setCurrentPage(p => p - 1); };

    if (submitted) {
        return (
            <div className="fb-filler">
                <div className="fb-filler-header"><h2>{schema.name}</h2></div>
                <div className="fb-filler-success">
                    <span className="fb-filler-success-icon">✓</span>
                    <h3>บันทึกสำเร็จ!</h3>
                    <p>ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว</p>
                    <button className="fb-mode-btn active" onClick={handleReset}>กรอกอีกครั้ง</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fb-filler">
            <div className="fb-filler-header">
                <h2>{schema.name}</h2>
                <p>กรอกข้อมูลแล้วกดบันทึก</p>
            </div>

            {hasPages && (
                <div className="fb-filler-pages">
                    {pages.map((page, idx) => (
                        <button
                            key={idx}
                            className={`fb-filler-page-dot ${idx === currentPage ? 'active' : ''} ${idx < currentPage ? 'done' : ''}`}
                            onClick={() => setCurrentPage(idx)}
                            title={page.label || `หน้า ${idx + 1}`}
                        >
                            {idx < currentPage ? '✓' : idx + 1}
                        </button>
                    ))}
                </div>
            )}

            {hasPages && pages[currentPage]?.label && (
                <div className="fb-filler-page-title">{pages[currentPage].label}</div>
            )}

            <div className="fb-filler-body">
                <FormControl key={`${resetKey}-${currentPage}`} config={config} />
            </div>

            {showDebug && (
                <div style={{ padding: 12, borderRadius: 6, background: 'var(--bg-secondary)', fontSize: 13, fontFamily: 'monospace' }}>
                    <strong>Form Data:</strong>
                    <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>{JSON.stringify(formData, null, 2)}</pre>
                </div>
            )}

            <div className="fb-filler-footer">
                <button
                    className="fb-mode-btn"
                    onClick={() => setShowDebug(d => !d)}
                    style={{ marginRight: 'auto', opacity: 0.6, fontSize: 12 }}
                >
                    {showDebug ? 'ซ่อน JSON' : 'แสดง JSON'}
                </button>

                {hasPages && currentPage > 0 && (
                    <button className="fb-mode-btn" onClick={handlePrev}>ย้อนกลับ</button>
                )}

                {hasPages && !isLastPage && (
                    <button className="fb-mode-btn active" onClick={handleNext}>ถัดไป</button>
                )}

                {!hasPages && (
                    <button className="fb-mode-btn" onClick={handleReset}>ล้างข้อมูล</button>
                )}

                {isLastPage && (
                    <button className="fb-mode-btn active" onClick={handleSubmit} disabled={!hasData}>บันทึก</button>
                )}
            </div>
        </div>
    );
}

export default FormFiller;
