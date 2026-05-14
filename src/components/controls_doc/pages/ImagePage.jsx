import React from 'react';
import { ImageControl, TableviewControl } from '../../controls';

function ImagePage({ addLog }) {
    return (
        <div className="page-content">
            <h1>🖼️ Image Control</h1>
            <p className="lead">
                Display images with lazy loading, lightbox, error handling, and visual effects
            </p>

            <section className="content-section">
                <h2>📖 Overview</h2>
                <p>
                    ImageControl provides enhanced image display with features like lazy loading,
                    lightbox modal, fallback images, and visual effects.
                </p>
            </section>

            <section className="content-section">
                <h2>🎯 Key Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Lazy Loading</h3>
                        <p>Load images only when visible</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Lightbox</h3>
                        <p>Click to view full-screen</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🛡️</div>
                        <h3>Error Handling</h3>
                        <p>Fallback image on load error</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎨</div>
                        <h3>Visual Effects</h3>
                        <p>Shadow, grayscale, object-fit</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Basic Images</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div>
                            <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>Simple Image</p>
                            <ImageControl control={{
                                src: 'https://picsum.photos/200/200?random=1',
                                alt: 'Sample Image',
                                width: '200px',
                                height: '200px'
                            }} />
                        </div>

                        <div>
                            <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>Rounded</p>
                            <ImageControl control={{
                                src: 'https://picsum.photos/200/200?random=2',
                                alt: 'Rounded Image',
                                width: '200px',
                                height: '200px',
                                borderRadius: '12px'
                            }} />
                        </div>

                        <div>
                            <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>Circle Avatar</p>
                            <ImageControl control={{
                                src: 'https://randomuser.me/api/portraits/men/32.jpg',
                                alt: 'Avatar',
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} />
                        </div>
                    </div>
                </div>

                <pre className="code-block">{`<ImageControl control={{
    src: 'https://example.com/image.jpg',
    alt: 'Description',
    width: '200px',
    height: '200px',
    borderRadius: '12px',  // or '50%' for circle
    objectFit: 'cover'     // cover | contain | fill
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🎨 Visual Effects</h2>
                <div className="example-demo">
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div>
                            <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>With Shadow</p>
                            <ImageControl control={{
                                src: 'https://picsum.photos/200/150?random=3',
                                width: '200px',
                                height: '150px',
                                shadow: true,
                                borderRadius: '8px'
                            }} />
                        </div>

                        <div>
                            <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>Grayscale</p>
                            <ImageControl control={{
                                src: 'https://picsum.photos/200/150?random=4',
                                width: '200px',
                                height: '150px',
                                grayscale: true,
                                borderRadius: '8px'
                            }} />
                        </div>

                        <div>
                            <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>Shadow + Grayscale</p>
                            <ImageControl control={{
                                src: 'https://picsum.photos/200/150?random=5',
                                width: '200px',
                                height: '150px',
                                shadow: true,
                                grayscale: true,
                                borderRadius: '8px'
                            }} />
                        </div>
                    </div>
                </div>

                <pre className="code-block">{`<ImageControl control={{
    src: 'image.jpg',
    shadow: true,      // Add box-shadow
    grayscale: true,   // Convert to grayscale
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🔍 Lightbox (Enlargeable)</h2>
                <p>Click images to view in full-screen lightbox:</p>
                
                <div className="example-demo">
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <ImageControl control={{
                            src: 'https://picsum.photos/400/300?random=6',
                            width: '150px',
                            height: '150px',
                            objectFit: 'cover',
                            enlargeable: true,
                            borderRadius: '8px',
                            shadow: true
                        }} />
                        <ImageControl control={{
                            src: 'https://picsum.photos/400/300?random=7',
                            width: '150px',
                            height: '150px',
                            objectFit: 'cover',
                            enlargeable: true,
                            borderRadius: '8px',
                            shadow: true
                        }} />
                        <ImageControl control={{
                            src: 'https://picsum.photos/400/300?random=8',
                            width: '150px',
                            height: '150px',
                            objectFit: 'cover',
                            enlargeable: true,
                            borderRadius: '8px',
                            shadow: true
                        }} />
                    </div>
                    <p style={{ marginTop: '10px', fontSize: '13px', color: '#6b7280' }}>
                        💡 Click any image to enlarge
                    </p>
                </div>

                <pre className="code-block">{`<ImageControl control={{
    src: 'image.jpg',
    enlargeable: true,  // Enable lightbox on click
    width: '200px'
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>🛡️ Error Handling</h2>
                <p>Show fallback image when loading fails:</p>
                
                <div className="example-demo">
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>Broken URL (with fallback)</p>
                            <ImageControl control={{
                                src: 'https://invalid-url.com/broken.jpg',
                                fallback: 'https://via.placeholder.com/200x200/cccccc/666666?text=No+Image',
                                width: '200px',
                                height: '200px',
                                borderRadius: '8px'
                            }} />
                        </div>

                        <div>
                            <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>With Placeholder</p>
                            <ImageControl control={{
                                src: 'https://picsum.photos/200/200?random=9',
                                placeholder: 'https://via.placeholder.com/200x200/f3f4f6/9ca3af?text=Loading...',
                                lazy: true,
                                width: '200px',
                                height: '200px',
                                borderRadius: '8px'
                            }} />
                        </div>
                    </div>
                </div>

                <pre className="code-block">{`<ImageControl control={{
    src: 'image.jpg',
    fallback: 'fallback-image.jpg',  // Shown on error
    placeholder: 'loading.gif',      // Shown while loading
    lazy: true                       // Enable lazy loading
}} />`}</pre>
            </section>

            <section className="content-section">
                <h2>📊 Object Fit Modes</h2>
                <p>Control how images fit their containers:</p>
                
                <div className="example-demo">
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div>
                            <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>Cover (default)</p>
                            <ImageControl control={{
                                src: 'https://picsum.photos/400/300?random=10',
                                width: '200px',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                style: { border: '2px solid #e5e7eb' }
                            }} />
                        </div>

                        <div>
                            <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>Contain</p>
                            <ImageControl control={{
                                src: 'https://picsum.photos/400/300?random=11',
                                width: '200px',
                                height: '150px',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                style: { border: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }
                            }} />
                        </div>

                        <div>
                            <p style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>Fill</p>
                            <ImageControl control={{
                                src: 'https://picsum.photos/400/300?random=12',
                                width: '200px',
                                height: '150px',
                                objectFit: 'fill',
                                borderRadius: '8px',
                                style: { border: '2px solid #e5e7eb' }
                            }} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>🎯 Gallery Example</h2>
                <div className="example-demo">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                        {[13, 14, 15, 16, 17, 18].map(num => (
                            <ImageControl key={num} control={{
                                src: `https://picsum.photos/300/300?random=${num}`,
                                width: '100%',
                                height: '150px',
                                objectFit: 'cover',
                                enlargeable: true,
                                shadow: true,
                                borderRadius: '8px',
                                lazy: true
                            }} />
                        ))}
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
                            <td><code>src</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Image source URL (or use databind)</td>
                        </tr>
                        <tr>
                            <td><code>databind</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Property path for image src</td>
                        </tr>
                        <tr>
                            <td><code>alt</code></td>
                            <td><code>string</code></td>
                            <td><code>''</code></td>
                            <td>Alt text for accessibility</td>
                        </tr>
                        <tr>
                            <td><code>width</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Image width (px, %, auto)</td>
                        </tr>
                        <tr>
                            <td><code>height</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Image height (px, %, auto)</td>
                        </tr>
                        <tr>
                            <td><code>objectFit</code></td>
                            <td><code>string</code></td>
                            <td><code>'cover'</code></td>
                            <td>'cover' | 'contain' | 'fill' | 'none'</td>
                        </tr>
                        <tr>
                            <td><code>borderRadius</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Border radius (px, %, use 50% for circle)</td>
                        </tr>
                        <tr>
                            <td><code>shadow</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Add box-shadow effect</td>
                        </tr>
                        <tr>
                            <td><code>grayscale</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Convert to grayscale</td>
                        </tr>
                        <tr>
                            <td><code>enlargeable</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Enable lightbox on click</td>
                        </tr>
                        <tr>
                            <td><code>lazy</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Enable lazy loading</td>
                        </tr>
                        <tr>
                            <td><code>fallback</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Fallback image URL on error</td>
                        </tr>
                        <tr>
                            <td><code>placeholder</code></td>
                            <td><code>string</code></td>
                            <td><code>-</code></td>
                            <td>Placeholder image while loading</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td><code>boolean</code></td>
                            <td><code>false</code></td>
                            <td>Disable interactions</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default ImagePage;
