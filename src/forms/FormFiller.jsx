import { useState, useMemo, useEffect, useCallback } from 'react';
import FormControl from '../components/controls/FormControl';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { schemaToFormConfig, getSchemaPages, evaluateShowWhen } from '../lib/schemaTransform';
import { createFormData } from '../lib/schemaService';

function isFieldEmpty(value) {
    if (value === '' || value === null || value === undefined) return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
}

function FormFiller({ schema, formcfgJson, onSubmit, onDirtyChange }) {
    const [formData, setFormData] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const [showDebug, setShowDebug] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [errors, setErrors] = useState({});

    const fullFormConfig = useMemo(
        () => schemaToFormConfig(schema.json, formcfgJson),
        [schema.json, formcfgJson]
    );

    const requiredFields = useMemo(() => {
        const fields = {};
        const json = schema.json;
        for (const [key, def] of Object.entries(json)) {
            if (key.startsWith('_')) continue;
            if (def.required) fields[key] = def.label || key;
        }
        return fields;
    }, [schema.json]);

    const pages = useMemo(() => getSchemaPages(schema.json), [schema.json]);
    const totalPages = pages.length;
    const hasPages = totalPages > 1;

    const validateFields = useCallback((fieldKeys) => {
        const newErrors = {};
        for (const key of fieldKeys) {
            const fieldDef = schema.json[key];
            if (fieldDef?.showWhen && !evaluateShowWhen(fieldDef.showWhen, formData)) continue;
            if (requiredFields[key] && isFieldEmpty(formData[key])) {
                newErrors[key] = 'กรุณากรอกข้อมูล';
            }
        }
        return newErrors;
    }, [requiredFields, formData, schema.json]);

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
        controls: pageConfig.controls.map(c => ({
            ...c,
            error: errors[c.databind] || undefined,
        })),
        onChange: (e) => {
            const val = e?.target?.value;
            if (val && typeof val === 'object') {
                setFormData(val);
                setErrors(prev => {
                    const next = { ...prev };
                    for (const [k, v] of Object.entries(val)) {
                        if (next[k] && !isFieldEmpty(v)) delete next[k];
                    }
                    return next;
                });
            }
        },
    }), [pageConfig, formData, errors]);

    const hasData = Object.values(formData).some(v => v !== '' && v !== null && v !== undefined);
    const isLastPage = !hasPages || currentPage === totalPages - 1;

    useEffect(() => {
        onDirtyChange?.(hasData && !submitted);
    }, [hasData, submitted, onDirtyChange]);

    const handleSubmit = async () => {
        const allFieldKeys = Object.entries(schema.json).filter(([k, v]) => !k.startsWith('_') || (typeof v === 'object' && v !== null && v.type)).filter(([, v]) => v.type !== 'pagebreak').map(([k]) => k);
        const validationErrors = validateFields(allFieldKeys);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        await createFormData(schema.id, formData);
        setSubmitted(true);
        onDirtyChange?.(false);
        onSubmit?.();
    };

    const handleReset = () => {
        setFormData({});
        setSubmitted(false);
        setResetKey(k => k + 1);
        setCurrentPage(0);
        setErrors({});
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            const pageFieldKeys = pages[currentPage]?.fieldKeys || [];
            const pageErrors = validateFields(pageFieldKeys);
            if (Object.keys(pageErrors).length > 0) {
                setErrors(prev => ({ ...prev, ...pageErrors }));
                return;
            }
            setCurrentPage(p => p + 1);
        }
    };
    const handlePrev = () => { if (currentPage > 0) setCurrentPage(p => p - 1); };

    if (submitted) {
        return (
            <div className="fb-filler">
                <div className="fb-filler-header"><h2>{schema.name}</h2></div>
                <div className="fb-filler-success">
                    <span className="fb-filler-success-icon"><Icon name="check" size={30} /></span>
                    <h3>บันทึกสำเร็จ!</h3>
                    <p>ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว</p>
                    <Button variant="primary" onClick={handleReset}>กรอกอีกครั้ง</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fb-filler">
            <div className="fb-filler-header">
                <h2>{schema.name}</h2>
                {schema.json?._description ? (
                    <p className="fb-filler-description">{schema.json._description}</p>
                ) : (
                    <p>กรอกข้อมูลแล้วกดบันทึก</p>
                )}
            </div>

            {hasPages && (
                <div className="fb-filler-stepper">
                    <div className="fb-filler-stepper-track">
                        {pages.map((page, idx) => (
                            <div key={idx} className="fb-filler-step-wrapper">
                                <button
                                    className={`fb-filler-step ${idx === currentPage ? 'active' : ''} ${idx < currentPage ? 'done' : ''}`}
                                    onClick={() => setCurrentPage(idx)}
                                    title={page.label || `หน้า ${idx + 1}`}
                                >
                                    {idx < currentPage ? <Icon name="check" size="sm" /> : idx + 1}
                                </button>
                                {idx < totalPages - 1 && (
                                    <div className={`fb-filler-step-line ${idx < currentPage ? 'done' : ''}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="fb-filler-progress">
                        <div className="fb-filler-progress-bar" style={{ width: `${(currentPage / (totalPages - 1)) * 100}%` }} />
                    </div>
                    <div className="fb-filler-page-info">
                        {pages[currentPage]?.label || `หน้า ${currentPage + 1} จาก ${totalPages}`}
                    </div>
                </div>
            )}

            <div className="fb-filler-body">
                <FormControl key={`${resetKey}-${currentPage}`} config={config} />
            </div>

            {showDebug && (
                <div style={{ padding: 12, borderRadius: 6, background: 'var(--bg-secondary)', fontSize: 13, fontFamily: 'monospace' }}>
                    <strong>Form Data:</strong>
                    <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>
                        {hasData ? JSON.stringify(formData, null, 2) : 'ยังไม่มีข้อมูล — กรอกฟอร์มด้านบนก่อน'}
                    </pre>
                </div>
            )}

            <div className="fb-filler-footer">
                <Button
                    variant="ghost"
                    size="sm"
                    className="fb-filler-debug-toggle"
                    onClick={() => setShowDebug(d => !d)}
                >
                    {showDebug ? 'ซ่อน JSON' : 'แสดง JSON'}
                </Button>

                {hasPages && currentPage > 0 && (
                    <Button variant="secondary" onClick={handlePrev}>ย้อนกลับ</Button>
                )}

                {hasPages && !isLastPage && (
                    <Button variant="primary" onClick={handleNext}>ถัดไป</Button>
                )}

                {!hasPages && (
                    <Button variant="secondary" onClick={handleReset}>ล้างข้อมูล</Button>
                )}

                {isLastPage && (
                    <Button variant="primary" onClick={handleSubmit}>บันทึก</Button>
                )}
            </div>
        </div>
    );
}

export default FormFiller;
