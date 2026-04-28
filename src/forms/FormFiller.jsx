import { useState, useMemo } from 'react';
import FormControl from '../components/controls/FormControl';
import { schemaToFormConfig } from '../lib/schemaTransform';
import { createFormData } from '../lib/schemaService';

function FormFiller({ schema, formcfgJson, onSubmit }) {
    const [formData, setFormData] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const formConfig = useMemo(
        () => schemaToFormConfig(schema.json, formcfgJson),
        [schema.json, formcfgJson]
    );

    const config = useMemo(() => ({
        ...formConfig,
        data: [formData],
        onChange: (e) => {
            const val = e?.target?.value;
            if (val && typeof val === 'object') setFormData(val);
        },
    }), [formConfig, formData]);

    const handleSubmit = async () => {
        await createFormData(schema.id, formData);
        setSubmitted(true);
        onSubmit?.();
    };

    const handleReset = () => { setFormData({}); setSubmitted(false); };

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
            <div className="fb-filler-body">
                <FormControl config={config} />
            </div>
            <div className="fb-filler-footer">
                <button className="fb-mode-btn" onClick={handleReset}>ล้างข้อมูล</button>
                <button className="fb-mode-btn active" onClick={handleSubmit}>บันทึก</button>
            </div>
        </div>
    );
}

export default FormFiller;
