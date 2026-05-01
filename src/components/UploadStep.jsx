
import React, { useRef, useState } from 'react';

export default function UploadStep({ onPdf }) {
  const [drag, setDrag] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file.');
      return;
    }
    onPdf(file, { jobTitleOverride: jobTitle.trim() });
  };

  return (
    <div>
      <div className="field-row">
        <label htmlFor="jt">Job Title (required)</label>
        <input
          id="jt"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Organizational Change Management"
        />
      </div>
      <p className="muted" style={{ marginLeft: 192 }}>
        The standardized template uses the title you provide here, not the title from the source resume.
      </p>

      <div
        className={'upload-card ' + (drag ? 'dragging' : '')}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        style={{ marginTop: 18 }}
      >
        <h2>Upload Resume PDF</h2>
        <p>Drag and drop a PDF here, or click to browse.</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          className="btn-primary"
          style={{ marginTop: 14 }}
          onClick={() => {
            if (!jobTitle.trim()) {
              if (!confirm('Job Title is empty — it will be flagged as missing in the draft. Continue?')) return;
            }
            inputRef.current?.click();
          }}
        >
          Choose PDF
        </button>
      </div>
    </div>
  );
}
