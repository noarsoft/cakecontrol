import { FormControl } from '../../controls';
import { CodeBlock } from '../shared';

function DataBindingPage({ addLog }) {
    return (
        <div className="page-content">
            <h1>🔄 Data Binding Guide</h1>
            <p className="lead">
                Learn how to bind data to controls using the <code>databind</code> property
            </p>

            <section className="content-section">
                <h2>📖 Basic Concept</h2>
                <p>
                    All controls support the <code>databind</code> property to automatically bind to data fields.
                    This eliminates the need to manually manage value and onChange handlers.
                </p>

                <CodeBlock>{`// Without databind - Manual handling
<TextboxControl
    control={{
        value: user.name,
        onChange: (e) => setUser({...user, name: e.target.value})
    }}
/>

// With databind - Automatic binding
<TextboxControl
    control={{ databind: 'name' }}
    rowData={user}
/>`}</CodeBlock>
            </section>

            <section className="content-section">
                <h2>🎯 Nested Data Binding</h2>
                <p>Use dot notation to access nested properties:</p>

                <CodeBlock>{`const user = {
    profile: {
        firstName: 'John',
        lastName: 'Doe',
        address: {
            city: 'Bangkok'
        }
    }
};

// Bind to nested properties
<TextboxControl
    control={{ databind: 'profile.firstName' }}
    rowData={user}
/>
<TextboxControl
    control={{ databind: 'profile.address.city' }}
    rowData={user}
/>`}</CodeBlock>
            </section>

            <section className="content-section">
                <h2>📝 Live Example</h2>
                <div className="example-demo">
                    <FormControl config={{
                        colnumbers: 6,
                        data: [{
                            user: {
                                name: 'สมชาย ใจดี',
                                email: 'somchai@test.com',
                                age: 25,
                                verified: true
                            }
                        }],
                        controls: [
                            { colno: 1, rowno: 1, colSpan: 3, label: 'ชื่อ', databind: 'user.name', type: 'textbox' },
                            { colno: 4, rowno: 1, colSpan: 3, label: 'อีเมล', databind: 'user.email', type: 'textbox' },
                            { colno: 1, rowno: 2, colSpan: 2, label: 'อายุ', databind: 'user.age', type: 'number' },
                            { colno: 3, rowno: 2, colSpan: 2, label: 'ยืนยันแล้ว', databind: 'user.verified', type: 'toggle' }
                        ]
                    }} />
                </div>
            </section>
        </div>
    );
}

export default DataBindingPage;
