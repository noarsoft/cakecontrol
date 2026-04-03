import React from 'react';
import { QRCodeControl, TableviewControl } from '../../controls';

function QRCodePage({ addLog }) {
    const sampleData = [
        { id: 1, name: 'Product A', url: 'https://example.com/product/a', price: '$19.99' },
        { id: 2, name: 'Product B', url: 'https://example.com/product/b', price: '$29.99' },
        { id: 3, name: 'Product C', url: 'https://example.com/product/c', price: '$39.99' }
    ];

    return (
        <div className="page-content">
            <h1>📱 QR Code Control</h1>
            <p className="lead">
                Generate QR codes from text or URLs with customizable options
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    QRCodeControl generates QR codes using the qrcode library. Perfect for sharing URLs,
                    contact information, or any text data that can be scanned by mobile devices.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔗</div>
                        <h3>Any Data Type</h3>
                        <p>URLs, text, vCard, Wi-Fi, etc.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Customizable</h3>
                        <p>Size, colors, error correction</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Data Binding</h3>
                        <p>Generate from data fields</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Mobile Ready</h3>
                        <p>Scannable by any QR reader</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Examples</h2>
                <div className="example-demo">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>Simple URL</h4>
                            <QRCodeControl control={{
                                value: 'https://example.com',
                                width: 150,
                                height: 150
                            }} />
                            <p style={{ fontSize: '12px', marginTop: '10px', color: '#6b7280' }}>
                                Scan to visit example.com
                            </p>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>Text Message</h4>
                            <QRCodeControl control={{
                                value: 'Hello from QR Code!',
                                width: 150,
                                height: 150
                            }} />
                            <p style={{ fontSize: '12px', marginTop: '10px', color: '#6b7280' }}>
                                Scan to see message
                            </p>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>Email</h4>
                            <QRCodeControl control={{
                                value: 'mailto:hello@example.com',
                                width: 150,
                                height: 150
                            }} />
                            <p style={{ fontSize: '12px', marginTop: '10px', color: '#6b7280' }}>
                                Scan to send email
                            </p>
                        </div>
                    </div>
                </div>

                <pre className="code-block">{`<QRCodeControl control={{
    value: 'https://example.com',
    width: 150,
    height: 150
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Custom Colors & Sizes</h2>
                <div className="example-demo">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>Default (Black & White)</h4>
                            <QRCodeControl control={{
                                value: 'https://example.com',
                                width: 120,
                                height: 120
                            }} />
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>Blue QR Code</h4>
                            <QRCodeControl control={{
                                value: 'https://example.com',
                                width: 120,
                                height: 120,
                                color: {
                                    dark: '#3b82f6',
                                    light: '#eff6ff'
                                }
                            }} />
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>Green QR Code</h4>
                            <QRCodeControl control={{
                                value: 'https://example.com',
                                width: 120,
                                height: 120,
                                color: {
                                    dark: '#10b981',
                                    light: '#f0fdf4'
                                }
                            }} />
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>Large (200x200)</h4>
                            <QRCodeControl control={{
                                value: 'https://example.com',
                                width: 200,
                                height: 200
                            }} />
                        </div>
                    </div>
                </div>

                <pre className="code-block">{`<QRCodeControl control={{
    value: 'https://example.com',
    width: 120,
    height: 120,
    color: {
        dark: '#3b82f6',  // QR code color
        light: '#eff6ff'  // Background color
    }
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🔄 With Data Binding</h2>
                <div className="example-demo">
                    <TableviewControl config={{
                        data: sampleData,
                        headers: ['Product', 'Price', 'QR Code', 'URL'],
                        colwidths: ['auto', '100px', '130px', 'auto'],
                        controls: [
                            { type: 'label', databind: 'name' },
                            { 
                                type: 'label', 
                                databind: 'price',
                                style: { fontWeight: 'bold', color: '#10b981' }
                            },
                            {
                                type: 'qrcode',
                                databind: 'url',
                                width: 100,
                                height: 100,
                                margin: 1
                            },
                            {
                                type: 'link',
                                databind: 'url',
                                value: 'Visit',
                                target: '_blank',
                                icon: '🔗'
                            }
                        ]
                    }} />
                </div>

                <pre className="code-block">{`// In TableviewControl
{
    type: 'qrcode',
    databind: 'url',
    width: 100,
    height: 100
}`}</pre>
            </section>

            <section className="content-section">
                <h2>🛡️ Error Correction Levels</h2>
                <div className="example-demo">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {['L', 'M', 'Q', 'H'].map(level => (
                            <div key={level} style={{ textAlign: 'center' }}>
                                <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>Level {level}</h4>
                                <QRCodeControl control={{
                                    value: 'https://example.com/test',
                                    width: 120,
                                    height: 120,
                                    errorCorrectionLevel: level
                                }} />
                                <p style={{ fontSize: '11px', marginTop: '10px', color: '#6b7280' }}>
                                    {level === 'L' && '~7% recovery'}
                                    {level === 'M' && '~15% recovery'}
                                    {level === 'Q' && '~25% recovery'}
                                    {level === 'H' && '~30% recovery'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="note-box" style={{ marginTop: '20px' }}>
                    <strong>Error Correction Levels:</strong>
                    <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                        <li><strong>L (Low):</strong> ~7% data can be restored</li>
                        <li><strong>M (Medium):</strong> ~15% data can be restored (default)</li>
                        <li><strong>Q (Quartile):</strong> ~25% data can be restored</li>
                        <li><strong>H (High):</strong> ~30% data can be restored</li>
                    </ul>
                </div>
            </section>

            <section className="content-section">
                <h2>📞 Common Use Cases</h2>
                
                <h3>1. Contact Card (vCard)</h3>
                <div className="example-demo">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <QRCodeControl control={{
                            value: `BEGIN:VCARD
VERSION:3.0
FN:John Doe
TEL:+66-123-456-789
EMAIL:john@example.com
END:VCARD`,
                            width: 150,
                            height: 150
                        }} />
                        <div>
                            <p><strong>Scan to save contact:</strong></p>
                            <p>Name: John Doe</p>
                            <p>Phone: +66-123-456-789</p>
                            <p>Email: john@example.com</p>
                        </div>
                    </div>
                </div>

                <h3>2. Wi-Fi Network</h3>
                <div className="example-demo">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <QRCodeControl control={{
                            value: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword123;;',
                            width: 150,
                            height: 150
                        }} />
                        <div>
                            <p><strong>Scan to connect to Wi-Fi:</strong></p>
                            <p>Network: MyNetwork</p>
                            <p>Password: MyPassword123</p>
                            <p>Security: WPA</p>
                        </div>
                    </div>
                </div>

                <h3>3. Phone Number</h3>
                <div className="example-demo">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <QRCodeControl control={{
                            value: 'tel:+66123456789',
                            width: 150,
                            height: 150
                        }} />
                        <div>
                            <p><strong>Scan to call:</strong></p>
                            <p>Phone: +66-123-456-789</p>
                        </div>
                    </div>
                </div>

                <h3>4. SMS Message</h3>
                <div className="example-demo">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <QRCodeControl control={{
                            value: 'SMSTO:+66123456789:Hello from QR Code!',
                            width: 150,
                            height: 150
                        }} />
                        <div>
                            <p><strong>Scan to send SMS:</strong></p>
                            <p>To: +66-123-456-789</p>
                            <p>Message: Hello from QR Code!</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📋 Props Reference</h2>
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
                        <tr>
                            <td><code>value</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Data to encode in QR code</td>
                        </tr>
                        <tr>
                            <td><code>databind</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Field name to bind from rowData</td>
                        </tr>
                        <tr>
                            <td><code>width</code></td>
                            <td><code>number</code></td>
                            <td><code>200</code></td>
                            <td>QR code width in pixels</td>
                        </tr>
                        <tr>
                            <td><code>height</code></td>
                            <td><code>number</code></td>
                            <td><code>200</code></td>
                            <td>QR code height in pixels</td>
                        </tr>
                        <tr>
                            <td><code>errorCorrectionLevel</code></td>
                            <td><code>'L'|'M'|'Q'|'H'</code></td>
                            <td><code>'M'</code></td>
                            <td>Error correction level</td>
                        </tr>
                        <tr>
                            <td><code>margin</code></td>
                            <td><code>number</code></td>
                            <td><code>1</code></td>
                            <td>Quiet zone margin</td>
                        </tr>
                        <tr>
                            <td><code>color.dark</code></td>
                            <td><code>string</code></td>
                            <td><code>'#000000'</code></td>
                            <td>Dark module color</td>
                        </tr>
                        <tr>
                            <td><code>color.light</code></td>
                            <td><code>string</code></td>
                            <td><code>'#ffffff'</code></td>
                            <td>Light background color</td>
                        </tr>
                        <tr>
                            <td><code>style</code></td>
                            <td><code>object</code></td>
                            <td><code>{}</code></td>
                            <td>Additional CSS styles</td>
                        </tr>
                        <tr>
                            <td><code>className</code></td>
                            <td><code>string</code></td>
                            <td><code>''</code></td>
                            <td>Additional CSS classes</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="content-section">
                <h2>💡 Tips & Best Practices</h2>
                <div className="note-box">
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li><strong>Size:</strong> Minimum 100x100px for reliable scanning</li>
                        <li><strong>Error Correction:</strong> Use 'H' for logos/images over QR code</li>
                        <li><strong>Contrast:</strong> Ensure good contrast between dark and light colors</li>
                        <li><strong>Testing:</strong> Always test with multiple QR readers</li>
                        <li><strong>URL Shorteners:</strong> Use for long URLs to reduce complexity</li>
                        <li><strong>Print Quality:</strong> Use higher resolution for printed QR codes</li>
                        <li><strong>Data Limit:</strong> Keep data under 4,296 characters</li>
                        <li><strong>Mobile First:</strong> Test on actual mobile devices</li>
                    </ul>
                </div>
            </section>

            <section className="content-section">
                <h2>📱 Data Format Examples</h2>
                <pre className="code-block">{`// URL
value: 'https://example.com'

// Email
value: 'mailto:email@example.com?subject=Hello&body=Message'

// Phone
value: 'tel:+66123456789'

// SMS
value: 'SMSTO:+66123456789:Message text here'

// vCard (Contact)
value: \`BEGIN:VCARD
VERSION:3.0
FN:John Doe
ORG:Company Name
TEL:+66-123-456-789
EMAIL:john@example.com
URL:https://example.com
ADR:;;123 Street;City;State;12345;Country
END:VCARD\`

// Wi-Fi
value: 'WIFI:T:WPA;S:NetworkName;P:Password;;'
// T = Type (WPA/WEP/nopass)
// S = SSID
// P = Password

// Geo Location
value: 'geo:13.7563,100.5018' // Latitude,Longitude

// Calendar Event
value: \`BEGIN:VEVENT
SUMMARY:Meeting
DTSTART:20250120T100000
DTEND:20250120T110000
LOCATION:Conference Room
END:VEVENT\``}</pre>
            </section>
        </div>
    );
}

export default QRCodePage;
