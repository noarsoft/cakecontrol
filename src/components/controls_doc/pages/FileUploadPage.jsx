import React, { useState } from 'react';
import { MultipleUploadControl, ButtonControl } from '../../controls';

function FileUploadPage({ addLog }) {
    const [uploads, setUploads] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleUploadComplete = (fileData) => {
        setUploads(prev => [...prev, fileData]);
        addLog(`✅ File uploaded: ${fileData.filename}`);
    };

    const handleUploadError = (error) => {
        addLog(`❌ Upload error: ${error.message}`);
    };

    const handleProgress = (progress) => {
        addLog(`📤 Upload progress: ${Math.round(progress)}%`);
    };

    return (
        <div className="page-content">
            <h1>📁 File Upload Control</h1>
            <p className="lead">
                Drag and drop or select files to upload with chunked transfer, progress tracking, and validation
            </p>

            <section className="content-section">
                <h2>✨ Features</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📦</div>
                        <h3>Chunked Upload</h3>
                        <p>Large files split into manageable chunks</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Progress Tracking</h3>
                        <p>Real-time upload progress visualization</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">✓</div>
                        <h3>Validation</h3>
                        <p>File type and size validation</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h3>Base64 Encoding</h3>
                        <p>Automatic base64 encoding of file chunks</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📋 Props</h2>
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
                            <td><code>apiUrl</code></td>
                            <td>string</td>
                            <td><code>'http://localhost:3002'</code></td>
                            <td>Backend API base URL</td>
                        </tr>
                        <tr>
                            <td><code>token</code></td>
                            <td>string</td>
                            <td>required</td>
                            <td>Bearer token for authentication</td>
                        </tr>
                        <tr>
                            <td><code>chunkSize</code></td>
                            <td>number</td>
                            <td><code>1024 * 1024</code> (1MB)</td>
                            <td>Size of each chunk in bytes</td>
                        </tr>
                        <tr>
                            <td><code>maxFileSize</code></td>
                            <td>number</td>
                            <td><code>50 * 1024 * 1024</code> (50MB)</td>
                            <td>Maximum file size in bytes</td>
                        </tr>
                        <tr>
                            <td><code>allowedTypes</code></td>
                            <td>string[]</td>
                            <td><code>['image/jpeg', 'image/png', 'application/pdf']</code></td>
                            <td>Allowed file MIME types</td>
                        </tr>
                        <tr>
                            <td><code>onUploadComplete</code></td>
                            <td>function</td>
                            <td>-</td>
                            <td>Callback when upload completes</td>
                        </tr>
                        <tr>
                            <td><code>onProgress</code></td>
                            <td>function</td>
                            <td>-</td>
                            <td>Callback for progress updates (0-100)</td>
                        </tr>
                        <tr>
                            <td><code>onError</code></td>
                            <td>function</td>
                            <td>-</td>
                            <td>Callback on upload error</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="content-section">
                <h2>🎯 Upload Flow</h2>
                <div className="flow-diagram">
                    <div className="flow-step">
                        <div className="step-number">1</div>
                        <h4>Select File</h4>
                        <p>Choose file via drag & drop or click</p>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="step-number">2</div>
                        <h4>Validate</h4>
                        <p>Check type and size</p>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="step-number">3</div>
                        <h4>Initiate</h4>
                        <p>Create upload session</p>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="step-number">4</div>
                        <h4>Upload Chunks</h4>
                        <p>Send base64 chunks</p>
                    </div>
                    <div className="flow-arrow">→</div>
                    <div className="flow-step">
                        <div className="step-number">5</div>
                        <h4>Finalize</h4>
                        <p>Combine & save file</p>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <h2>📝 Live Demo</h2>
                <div className="example-demo">
                    <div className="upload-section">
                        <h3>Upload File</h3>
                        <MultipleUploadControl
                            apiUrl="http://localhost:3002"
                            token={localStorage.getItem('accessToken') || 'demo-token'}
                            chunkSize={1024 * 512} // 512KB chunks
                            maxFileSize={50 * 1024 * 1024} // 50MB max
                            allowedTypes={['image/jpeg', 'image/png', 'application/pdf', 'text/plain']}
                            onUploadComplete={handleUploadComplete}
                            onProgress={handleProgress}
                            onError={handleUploadError}
                        />
                    </div>
                </div>
            </section>

            {uploads.length > 0 && (
                <section className="content-section">
                    <h2>📂 Uploaded Files ({uploads.length})</h2>
                    <table className="props-table">
                        <thead>
                            <tr>
                                <th>Filename</th>
                                <th>Size</th>
                                <th>Upload Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {uploads.map((upload, idx) => (
                                <tr key={idx}>
                                    <td>{upload.filename}</td>
                                    <td>{(upload.fileSize / 1024).toFixed(2)} KB</td>
                                    <td>{new Date().toLocaleTimeString()}</td>
                                    <td><span style={{ color: '#10b981' }}>✓ Complete</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            <section className="content-section">
                <h2>💡 Usage Example</h2>
                <pre className="code-block">
{`import { MultipleUploadControl } from './controls';

function MyPage() {
    const handleUploadComplete = (fileData) => {
        console.log('File uploaded:', fileData);
        // {
        //   fileId: 'fil_xxx',
        //   filename: 'document.pdf',
        //   fileSize: 2048,
        //   src: 'systems/fileupload/file_upload/251119/...'
        // }
    };

    const handleProgress = (progress) => {
        console.log('Upload progress:', progress + '%');
    };

    const handleError = (error) => {
        console.error('Upload error:', error);
    };

    return (
        <MultipleUploadControl
            apiUrl="http://localhost:3002"
            token={accessToken}
            chunkSize={1024 * 1024} // 1MB
            maxFileSize={50 * 1024 * 1024} // 50MB
            allowedTypes={['image/jpeg', 'image/png', 'application/pdf']}
            onUploadComplete={handleUploadComplete}
            onProgress={handleProgress}
            onError={handleError}
        />
    );
}`}
                </pre>
            </section>

            <section className="content-section">
                <h2>🔌 API Endpoints</h2>
                <table className="props-table">
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th>Endpoint</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span style={{ background: '#28a745', color: 'white', padding: '2px 6px', borderRadius: '3px' }}>POST</span></td>
                            <td><code>/fileupload/initiate</code></td>
                            <td>Initialize upload session, returns uploadToken</td>
                        </tr>
                        <tr>
                            <td><span style={{ background: '#28a745', color: 'white', padding: '2px 6px', borderRadius: '3px' }}>POST</span></td>
                            <td><code>/fileupload/chunk/:uploadToken</code></td>
                            <td>Upload single chunk with base64 data</td>
                        </tr>
                        <tr>
                            <td><span style={{ background: '#28a745', color: 'white', padding: '2px 6px', borderRadius: '3px' }}>POST</span></td>
                            <td><code>/fileupload/finalize/:uploadToken</code></td>
                            <td>Finalize upload, combine chunks, save file</td>
                        </tr>
                        <tr>
                            <td><span style={{ background: '#dc3545', color: 'white', padding: '2px 6px', borderRadius: '3px' }}>DELETE</span></td>
                            <td><code>/fileupload/cancel/:uploadToken</code></td>
                            <td>Cancel upload and cleanup temporary files</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="content-section">
                <h2>📌 Key Features</h2>
                <ul className="feature-list">
                    <li><strong>Chunked Upload:</strong> Files are automatically split into configurable chunks for reliable transfer</li>
                    <li><strong>Base64 Encoding:</strong> Each chunk is encoded as base64 for safe HTTP transmission</li>
                    <li><strong>Progress Tracking:</strong> Real-time progress updates as chunks are uploaded</li>
                    <li><strong>File Validation:</strong> Validates file type and size before upload</li>
                    <li><strong>Session Management:</strong> Each upload gets a unique uploadToken for tracking</li>
                    <li><strong>Error Handling:</strong> Comprehensive error handling with retry capability</li>
                    <li><strong>Database Integration:</strong> Uploaded files automatically stored in PostgreSQL</li>
                    <li><strong>File Organization:</strong> Files organized by date in file system: <code>file_upload/YYMMDD/token.ext</code></li>
                </ul>
            </section>

            <style jsx>{`
                .flow-diagram {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    overflow-x: auto;
                    padding: 20px;
                    background: #f9fafb;
                    border-radius: 8px;
                    margin: 20px 0;
                }

                .flow-step {
                    flex-shrink: 0;
                    text-align: center;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    border: 2px solid #e5e7eb;
                    min-width: 120px;
                }

                .step-number {
                    display: inline-block;
                    width: 32px;
                    height: 32px;
                    background: #3b82f6;
                    color: white;
                    border-radius: 50%;
                    line-height: 32px;
                    font-weight: bold;
                    margin-bottom: 8px;
                }

                .flow-step h4 {
                    margin: 8px 0 4px;
                    font-size: 14px;
                }

                .flow-step p {
                    margin: 0;
                    font-size: 12px;
                    color: #6b7280;
                }

                .flow-arrow {
                    flex-shrink: 0;
                    font-size: 20px;
                    color: #9ca3af;
                }

                .upload-section {
                    padding: 30px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                }

                .feature-list {
                    list-style: none;
                    padding: 0;
                }

                .feature-list li {
                    padding: 12px 0;
                    border-bottom: 1px solid #e5e7eb;
                }

                .feature-list li:last-child {
                    border-bottom: none;
                }

                .feature-list strong {
                    color: #0d6efd;
                }
            `}</style>
        </div>
    );
}

export default FileUploadPage;
