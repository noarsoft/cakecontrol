import { FeatureCard, CategoryOverview, CodeBlock } from '../shared';

function OverviewPage({ setPage }) {
    return (
        <div className="page-content">
            <h1>📚 Control Components Library</h1>
            <p className="lead">
                A comprehensive collection of React controls for building modern web applications with seamless data binding support
            </p>

            <section className="content-section">
                <h2>✨ Key Features</h2>
                <div className="feature-grid">
                    <FeatureCard icon="🎯" title="30+ Controls" description="From basic inputs to advanced layouts" />
                    <FeatureCard icon="🔄" title="Data Binding" description="Seamless databind integration" />
                    <FeatureCard icon="📱" title="Responsive" description="Works on all devices" />
                    <FeatureCard icon="🎨" title="Customizable" description="Easy styling options" />
                    <FeatureCard icon="⚡" title="Performance" description="Optimized rendering" />
                    <FeatureCard icon="♿" title="Accessible" description="ARIA compliant" />
                </div>
            </section>

            <section className="content-section">
                <h2>📦 Control Categories</h2>
                <div className="category-overview">
                    <CategoryOverview
                        title="Layout Controls"
                        icon="📝"
                        description="Complex layouts and structures for organizing content"
                        controls={['Form', 'Table', 'Grid', 'Card', 'Accordion', 'Tabs', 'Tree', 'Button Group', 'Pagination']}
                    />
                    <CategoryOverview
                        title="Display Controls"
                        icon="🖼️"
                        description="Visual elements for displaying content and media"
                        controls={['Link', 'Image', 'Badge', 'Icon']}
                    />
                    <CategoryOverview
                        title="Date/Time Controls"
                        icon="📅"
                        description="Date and calendar selection components"
                        controls={['DatePicker', 'Calendar Grid']}
                    />
                    <CategoryOverview
                        title="Other Controls"
                        icon="🔧"
                        description="Additional utility controls"
                        controls={['Dropdown', 'Progress Bar', 'QR Code']}
                    />
                </div>
            </section>

            <section className="content-section">
                <h2>🚀 Quick Start</h2>
                <CodeBlock language="javascript">{`// 1. Import controls
import { TextboxControl, ButtonControl } from './controls';

// 2. Use in your component
function MyForm() {
    const [user, setUser] = useState({ name: '', email: '' });

    return (
        <div>
            <TextboxControl
                control={{
                    databind: 'name',
                    placeholder: 'Enter name'
                }}
                rowData={user}
            />
            <TextboxControl
                control={{
                    databind: 'email',
                    placeholder: 'Enter email'
                }}
                rowData={user}
            />
            <ButtonControl
                control={{
                    value: 'Submit',
                    onClick: () => console.log(user)
                }}
            />
        </div>
    );
}`}</CodeBlock>
            </section>

            <section className="content-section">
                <h2>📖 Next Steps</h2>
                <div className="quick-links">
                    <button className="quick-link-card" onClick={() => setPage('allcontrols')}>
                        <span className="quick-link-icon">🎯</span>
                        <div>
                            <h4>View All Controls</h4>
                            <p>See all available controls in action</p>
                        </div>
                    </button>
                    <button className="quick-link-card" onClick={() => setPage('databinding')}>
                        <span className="quick-link-icon">🔄</span>
                        <div>
                            <h4>Learn Data Binding</h4>
                            <p>Master data binding techniques</p>
                        </div>
                    </button>
                    <button className="quick-link-card" onClick={() => setPage('form')}>
                        <span className="quick-link-icon">📝</span>
                        <div>
                            <h4>Form Control</h4>
                            <p>Build complex forms easily</p>
                        </div>
                    </button>
                </div>
            </section>
        </div>
    );
}

export default OverviewPage;
