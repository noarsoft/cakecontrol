import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormControl from '../components/controls/FormControl';
import ThemeSwitcher from '../ThemeSwitcher';
import { schemaToFormConfig } from '../lib/schemaTransform';
import {
    initService, getSchemaById, getFormcfgsBySchema, createFormData,
} from '../lib/schemaService';
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

    useEffect(() => {
        (async () => {
            await initService();
            const id = parseInt(schemaId, 10);
            const s = await getSchemaById(id);
            if (!s) {
                setNotFound(true);
                return;
            }
            setSchema(s);
            const cfgs = await getFormcfgsBySchema(id);
            if (cfgs[0]) setFormcfgJson(cfgs[0].json);
        })();
    }, [schemaId]);

    const formConfig = useMemo(() => {
        if (!schema) return null;
        return schemaToFormConfig(schema.json, formcfgJson);
    }, [schema, formcfgJson]);

    const config = useMemo(() => {
        if (!formConfig) return null;
        return {
            ...formConfig,
            data: [formData],
            onChange: (e) => {
                const val = e?.target?.value;
                if (val && typeof val === 'object') {
                    setFormData(val);
                }
            },
        };
    }, [formConfig, formData]);

    const handleSubmit = async () => {
        await createFormData(parseInt(schemaId, 10), formData);
        setSubmitted(true);
    };

    const handleReset = () => {
        setFormData({});
        setSubmitted(false);
    };

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
                    <button className="fb-mode-btn" onClick={() => navigate('/formbuilder')}>
                        กลับ Form Builder
                    </button>
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
                        <span className="fb-filler-success-icon">✓</span>
                        <h3>บันทึกสำเร็จ!</h3>
                        <p>ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว</p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            <button className="fb-mode-btn" onClick={handleReset}>
                                กรอกอีกครั้ง
                            </button>
                            <button className="fb-mode-btn" onClick={() => navigate('/formbuilder')}>
                                กลับ Form Builder
                            </button>
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
                    <p>กรอกข้อมูลให้ครบแล้วกดบันทึก</p>
                </div>
                <div className="fb-filler-body">
                    <FormControl config={config} />
                </div>
                <div className="fb-filler-footer">
                    <button className="fb-mode-btn" onClick={handleReset}>
                        ล้างข้อมูล
                    </button>
                    <button className="fb-mode-btn active" onClick={handleSubmit}>
                        บันทึก
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FormFillerPage;
