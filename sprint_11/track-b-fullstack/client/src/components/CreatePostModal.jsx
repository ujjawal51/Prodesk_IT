import React, { useState, useRef } from 'react';
import { X, UploadCloud, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Fullstack');
  const [tags, setTags] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('File size exceeds the 5MB limit.');
      return;
    }

    setFormError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setFormError('Post title is required.');
      return;
    }
    if (!content.trim()) {
      setFormError('Post content is required.');
      return;
    }

    setSubmitting(true);
    setFormError('');

    try {
      /**
       * Screenshot 1 Strict Architecture Requirement:
       * Frontend: Dispatch the payload using the FormData object.
       */
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('content', content.trim());
      formData.append('author', author.trim() || 'Resident Engineer');
      formData.append('category', category);
      formData.append('tags', tags);

      // Append raw binary file for Multer parsing on backend
      if (selectedFile) {
        formData.append('thumbnail', selectedFile);
      }

      await onSubmit(formData);

      // Reset and close
      handleClose();
    } catch (err) {
      setFormError(err.response?.data?.error || err.message || 'Failed to inject document into MongoDB.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setAuthor('');
    setCategory('Fullstack');
    setTags('');
    handleRemoveImage();
    setFormError('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
              Publish New Article
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Data Injection Pipeline with Multipart FormData & Cloudinary CDN
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {formError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                color: '#fca5a5',
                fontSize: '13px'
              }}
            >
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#e2e8f0', marginBottom: '6px' }}>
              Article Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Architecting Cloudinary Streaming with Multer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: '#0f172a',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Category & Author Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#e2e8f0', marginBottom: '6px' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: '#0f172a',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                <option value="Fullstack">Fullstack</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Architecture">Architecture</option>
                <option value="Testing">Testing</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#e2e8f0', marginBottom: '6px' }}>
                Author
              </label>
              <input
                type="text"
                placeholder="Resident Engineer"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: '#0f172a',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Multipart Thumbnail Upload Section */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#e2e8f0', marginBottom: '6px' }}>
              Image Thumbnail (Multipart FormData Asset Upload)
            </label>

            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(99, 102, 241, 0.4)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(99, 102, 241, 0.04)',
                  transition: 'background 0.2s'
                }}
              >
                <UploadCloud size={32} style={{ color: 'var(--primary)', margin: '0 auto 8px' }} />
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>
                  Click to choose thumbnail image
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  JPG, PNG, WebP up to 5MB (Streamed via Multer to Cloudinary CDN)
                </p>
              </div>
            ) : (
              <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '160px' }}>
                <img
                  src={previewUrl}
                  alt="Thumbnail preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '4px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Content Body Textarea */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#e2e8f0', marginBottom: '6px' }}>
              Article Content *
            </label>
            <textarea
              rows={4}
              placeholder="Write the technical synopsis or article body..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: '#0f172a',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#e2e8f0', marginBottom: '6px' }}>
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="MERN, Testing, Cloudinary, Express"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: '#0f172a',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Form Submit Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '8px'
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Injecting to MongoDB...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  <span>Publish Document</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
