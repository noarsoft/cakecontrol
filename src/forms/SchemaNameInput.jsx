import { useState, useEffect } from 'react';

function SchemaNameInput({ value, onSave }) {
    const [draft, setDraft] = useState(value);

    useEffect(() => { setDraft(value); }, [value]);

    const save = () => {
        const trimmed = draft.trim();
        if (trimmed && trimmed !== value) onSave(trimmed);
        else setDraft(value);
    };

    return (
        <input
            className="fb-schema-name-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={save}
            onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
        />
    );
}

export default SchemaNameInput;
