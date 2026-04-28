import { useState, useMemo } from 'react';
import FormControl from '../components/controls/FormControl';
import { schemaToFormConfig } from '../lib/schemaTransform';

function FormPreview({ schemaJson, formcfgJson, schemaName }) {
    const [formData, setFormData] = useState({});

    const formConfig = useMemo(
        () => schemaToFormConfig(schemaJson, formcfgJson),
        [schemaJson, formcfgJson]
    );

    const config = useMemo(() => ({
        ...formConfig,
        data: [formData],
        onChange: (e) => {
            const val = e?.target?.value;
            if (val && typeof val === 'object') setFormData(val);
        },
    }), [formConfig, formData]);

    return (
        <div className="fb-preview">
            <h3>{schemaName} — Preview</h3>
            <FormControl config={config} />
            <div style={{ marginTop: 20, padding: 12, borderRadius: 6, background: 'var(--bg-primary)', fontSize: 13, fontFamily: 'monospace' }}>
                <strong>Form Data:</strong>
                <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>{JSON.stringify(formData, null, 2)}</pre>
            </div>
        </div>
    );
}

export default FormPreview;
