export function PropsTable({ props }) {
    return (
        <table className="props-table">
            <thead>
                <tr>
                    <th>Prop</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {props.map((prop, idx) => (
                    <tr key={idx}>
                        <td><code>{prop.name}</code></td>
                        <td><code>{prop.type}</code></td>
                        <td><code>{prop.default || '-'}</code></td>
                        <td>{prop.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export function CodeBlock({ children, language = 'javascript' }) {
    return (
        <pre className="code-block">
            <code className={`language-${language}`}>{children}</code>
        </pre>
    );
}

export function FeatureCard({ icon, title, description }) {
    return (
        <div className="feature-card">
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}

export function CategoryOverview({ title, icon, description, controls }) {
    return (
        <div className="category-box">
            <h3>{icon} {title}</h3>
            <p>{description}</p>
            <div className="control-list">
                {controls.map((control, idx) => (
                    <span key={idx} className="control-tag">{control}</span>
                ))}
            </div>
        </div>
    );
}

export function ComingSoonPage({ pageName }) {
    return (
        <div className="page-content coming-soon">
            <div className="coming-soon-content">
                <div className="coming-soon-icon">🚧</div>
                <h1>{pageName}</h1>
                <p>Documentation coming soon...</p>
            </div>
        </div>
    );
}
