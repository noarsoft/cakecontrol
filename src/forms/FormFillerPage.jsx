import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormControl from '../components/controls/FormControl';
import ThemeSwitcher from '../ThemeSwitcher';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icon';
import { schemaToFormConfig, getSchemaPages } from '../lib/schemaTransform';
import {
    initService, getSchemaById, getFormcfgsBySchema, createFormData,
} from '../lib/schemaService';
import { PAGES } from '../lib/routes';
import './FormBuilder.css';

/**
 * Standalone form filler page — accessible via /form/:schemaId
 * เหมือน Google Forms: เปิด link → กรอก → submit
 */
function FormFillerPage() {
    const { schemaId } = useParams();
    const navigate = useNavigate();
    const [schema, setSchema] = useState(null);
    const [formcfgJson, setFormcfgJson] = useState(null);
    const [formData, setFormData] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                await initService();
                const s = await getSchemaById(schemaId);
                if (!s) {
                    setNotFound(true);
                    return;
                }
                setSchema(s);
                const cfgs = await getFormcfgsBySchema(s.id);
                if (cfgs[0]) setFormcfgJson(cfgs[0].json_form_config);
            } catch {
                setNotFound(true);
            }
        })();
    }, [schemaId]);

    const fullFormConfig = useMemo(() => {
        if (!schema) return null;
        return schemaToFormConfig(schema.json, formcfgJson);
    }, [schema, formcfgJson]);

    const pages = useMemo(() => {
        if (!schema) return [];
        return getSchemaPages(schema.json);
    }, [schema]);
    const totalPages = pages.length;
    const hasPages = totalPages > 1;

    const pageConfig = useMemo(() => {
        if (!fullFormConfig) return null;
        if (!hasPages) return fullFormConfig;
        const pageFieldKeys = new Set(pages[currentPage]?.fieldKeys || []);
        return {
            ...fullFormConfig,
            controls: fullFormConfig.controls.filter(c => pageFieldKeys.has(c.databind)),
        };
    }, [fullFormConfig, hasPages, pages, currentPage]);

    const config = useMemo(() => {
        if (!pageConfig) return null;
        return {
            ...pageConfig,
            data: [formData],
            onChange: (e) => {
                const val = e?.target?.value;
                if (val && typeof val === 'object') {
                    setFormData(val);
                }
            },
        };
    }, [pageConfig, formData]);

    const hasData = Object.values(formData).some(v => v !== '' && v !== null && v !== undefined);
    const isLastPage = !hasPages || currentPage === totalPages - 1;

    const handleSubmit = async () => {
        if (!hasData) return;
        await createFormData(schema.id, formData);
        setSubmitted(true);
    };

    const handleReset = () => {
        setFormData({});
        setSubmitted(false);
        setResetKey(k => k + 1);
        setCurrentPage(0);
    };

    const handleNext = () => { if (currentPage < totalPages - 1) setCurrentPage(p => p + 1); };
    const handlePrev = () => { if (currentPage > 0) setCurrentPage(p => p - 1); };

    if (notFound) {
        return (
            <div className="fb-standalone-page">
                <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 10 }}>
                    <ThemeSwitcher />
                </div>
                <div className="fb-filler">
                    <div className="fb-filler-header">
                        <h2>ไม่พบฟอร์ม</h2>
                        <p>Schema ID: {schemaId} ไม่มีในระบบ</p>
                    </div>
                    <Button variant="secondary" icon="arrow-left" onClick={() => navigate(PAGES.FORM_BUILDER)}>
                        กลับ Form Builder
                    </Button>
                </div>
            </div>
        );
    }

    if (!schema || !config) {
        return (
            <div className="fb-standalone-page">
                <div className="fb-filler">
                    <div className="fb-filler-header">
                        <h2>กำลังโหลด...</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="fb-standalone-page">
                <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 10 }}>
                    <ThemeSwitcher />
                </div>
                <div className="fb-filler">
                    <div className="fb-filler-header">
                        <h2>{schema.name}</h2>
                    </div>
                    <div className="fb-filler-success">
                        <span className="fb-filler-success-icon"><Icon name="check" size={30} /></span>
                        <h3>บันทึกสำเร็จ!</h3>
                        <p>ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว</p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            <Button variant="primary" onClick={handleReset}>
                                กรอกอีกครั้ง
                            </Button>
                            <Button variant="secondary" onClick={() => navigate(PAGES.FORM_BUILDER)}>
                                กลับ Form Builder
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fb-standalone-page">
            <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 10 }}>
                <ThemeSwitcher />
            </div>
            <div className="fb-filler">
                <div className="fb-filler-header">
                    <h2>{schema.name}</h2>
                    {schema.json?._description ? (
                        <p className="fb-filler-description">{schema.json._description}</p>
                    ) : (
                        <p>กรอกข้อมูลให้ครบแล้วกดบันทึก</p>
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
                <div className="fb-filler-footer">
                    {hasPages && currentPage > 0 && (
                        <Button variant="secondary" onClick={handlePrev}>ย้อนกลับ</Button>
                    )}

                    {!hasPages && (
                        <Button variant="secondary" onClick={handleReset}>ล้างข้อมูล</Button>
                    )}

                    {hasPages && !isLastPage && (
                        <Button variant="primary" onClick={handleNext}>ถัดไป</Button>
                    )}

                    {isLastPage && (
                        <Button variant="primary" onClick={handleSubmit} disabled={!hasData}>
                            บันทึก
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FormFillerPage;
