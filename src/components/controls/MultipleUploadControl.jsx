// MultipleUploadControl.jsx
import React, { useState, useRef } from 'react';
import ProgressControl from './ProgressControl';
import './MultipleUploadControl.css';

function MultipleUploadControl({ control = {}, onUploadComplete, onUploadError, apiUrl, token, chunkSize, maxFileSize, allowedTypes, onProgress, onError }) {
    const fileInputRef = useRef(null);
    const [uploads, setUploads] = useState([]); // Track multiple uploads
    const [error, setError] = useState('');

    // Configuration - merge control prop with direct props (direct props take precedence)
    const MAX_FILE_SIZE = maxFileSize || control.maxFileSize || 50 * 1024 * 1024; // 50MB default
    const ALLOWED_TYPES = allowedTypes || control.allowedTypes || ['image/jpeg', 'image/png', 'application/pdf'];
    const CHUNK_SIZE = chunkSize || control.chunkSize || 1024 * 1024; // 1MB chunks default
    const API_URL = apiUrl || control.apiUrl || 'http://localhost:3002';
    const TOKEN = token || control.token || localStorage.getItem('accessToken');

    const handleFileSelect = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        setError('');

        for (const file of selectedFiles) {
            // Validate file
            if (!ALLOWED_TYPES.includes(file.type)) {
                setError(`File type not allowed: ${file.name}. Allowed types: ${ALLOWED_TYPES.join(', ')}`);
                continue;
            }

            if (file.size > MAX_FILE_SIZE) {
                setError(`File too large: ${file.name}. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
                continue;
            }

            // Start chunking
            await processFileUpload(file);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const processFileUpload = async (file) => {
        const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Add to uploads tracking
        setUploads(prev => [...prev, {
            id: uploadId,
            filename: file.name,
            status: 'processing',
            progress: 0,
            totalParts: Math.ceil(file.size / CHUNK_SIZE),
            uploadedParts: 0
        }]);

        try {
            // Read file as base64
            const base64String = await fileToBase64(file);
            
            // Split into chunks
            const chunks = splitBase64String(base64String, CHUNK_SIZE, file.size);
            const totalParts = chunks.length;

            // Step 1: Initiate upload - send filename to backend
            const initiateResponse = await initiateUpload(file.name);
            const uploadToken = initiateResponse.uploadToken;

            // Step 2: Upload each part
            for (let partIndex = 0; partIndex < chunks.length; partIndex++) {
                const chunkData = chunks[partIndex];

                await uploadChunk(uploadToken, {
                    filename: file.name,
                    part: partIndex,
                    total_part_number: totalParts,
                    base64: chunkData
                });

                // Update progress
                const progressPercent = Math.round((partIndex + 1) / totalParts * 100);
                setUploads(prev => prev.map(u => 
                    u.id === uploadId 
                        ? { ...u, progress: progressPercent, uploadedParts: partIndex + 1 }
                        : u
                ));
                
                // Call progress callback
                if (onProgress) {
                    onProgress(progressPercent);
                }
            }

            // Step 3: Finalize upload
            const finalResponse = await finalizeUpload(uploadToken);

            // Update status
            setUploads(prev => prev.map(u =>
                u.id === uploadId
                    ? { ...u, status: 'completed', progress: 100, fileId: finalResponse.fileId }
                    : u
            ));

            if (onUploadComplete) {
                onUploadComplete(finalResponse);
            }
        } catch (err) {
            const errorMessage = `Upload failed for ${file.name}: ${err.message}`;
            setError(errorMessage);
            setUploads(prev => prev.map(u =>
                u.id === uploadId
                    ? { ...u, status: 'failed' }
                    : u
            ));

            // Call error callbacks
            if (onUploadError) {
                onUploadError(err);
            }
            if (onError) {
                onError(err);
            }
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const splitBase64String = (base64String, chunkBytes, originalFileSize) => {
        const chunks = [];
        const bytesPerChunk = Math.ceil((base64String.length / originalFileSize) * chunkBytes);

        for (let i = 0; i < base64String.length; i += bytesPerChunk) {
            chunks.push(base64String.substring(i, i + bytesPerChunk));
        }

        return chunks;
    };

    const initiateUpload = async (filename) => {
        const response = await fetch(`${API_URL}/fileupload/initiate`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify({ filename })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Failed to initiate upload');
        }
        return await response.json();
    };

    const uploadChunk = async (uploadToken, chunkData) => {
        const response = await fetch(`${API_URL}/fileupload/chunk/${uploadToken}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify(chunkData)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || `Failed to upload chunk ${chunkData.part}`);
        }
        return await response.json();
    };

    const finalizeUpload = async (uploadToken) => {
        const response = await fetch(`${API_URL}/fileupload/finalize/${uploadToken}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            }
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Failed to finalize upload');
        }
        return await response.json();
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="multiple-upload-control">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ALLOWED_TYPES.join(',')}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            {/* Upload button */}
            <button
                type="button"
                className="upload-button"
                onClick={handleButtonClick}
                style={control.buttonStyle}
            >
                <i className="bi bi-cloud-upload"></i>
                {control.buttonLabel || 'Choose Files to Upload'}
            </button>

            {/* Error message */}
            {error && (
                <div className="upload-error">
                    <i className="bi bi-exclamation-circle"></i>
                    <span>{error}</span>
                </div>
            )}

            {/* Upload progress list */}
            <div className="upload-list">
                {uploads.map((upload) => (
                    <div key={upload.id} className="upload-item">
                        <div className="upload-info">
                            <span className="filename">
                                <i className="bi bi-file"></i> {upload.filename}
                            </span>
                            <span className={`status ${upload.status}`}>
                                {upload.status === 'processing' && 'Uploading...'}
                                {upload.status === 'completed' && '✓ Completed'}
                                {upload.status === 'failed' && '✗ Failed'}
                            </span>
                        </div>
                        <div className="progress-wrapper">
                            <ProgressControl
                                control={{
                                    value: upload.progress,
                                    max: 100,
                                    showLabel: true,
                                    label: `${upload.uploadedParts}/${upload.totalParts} parts`
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MultipleUploadControl;
