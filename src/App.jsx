
import React, { useState } from 'react';
import UploadStep from './components/UploadStep.jsx';
import DraftEditor from './components/DraftEditor.jsx';
import ResumeTemplate from './components/ResumeTemplate.jsx';
import ResumePdf from './components/ResumePdf.jsx';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { extractPdfText } from './services/pdfExtract.js';
import { parseResumeWithAI } from './services/aiClient.js';
import { applyRules, emptyResume } from './services/rules.js';

const STAGE = { UPLOAD: 'upload', DRAFT: 'draft', FINAL: 'final' };

export default function App() {
  const [stage, setStage] = useState(STAGE.UPLOAD);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState(emptyResume());

  const handlePdf = async (file, opts) => {
    setError('');
    setLoading(true);
    try {
      setLoadingText('Extracting text from PDF…');
      const text = await extractPdfText(file);
      if (!text || text.trim().length < 30) {
        throw new Error('Could not extract text — the PDF may be a scanned image. OCR is not supported in the free tier yet.');
      }

      setLoadingText('Parsing with AI…');
      const parsed = await parseResumeWithAI(text, { jobTitleOverride: opts.jobTitleOverride });
      const finalized = applyRules({ ...emptyResume(), ...parsed });
      // Force the user-supplied job title if they provided one (rules say it must come from user).
      if (opts.jobTitleOverride) finalized.job_title = opts.jobTitleOverride;
      setData(finalized);
      setStage(STAGE.DRAFT);
    } catch (e) {
      console.error(e);
      setError(e.message || String(e));
    } finally {
      setLoading(false);
      setLoadingText('');
    }
  };

  const exportFinalPdf = async () => {
    // Apply rules right before export (period-on-bullets, name format)
    const finalData = applyRules(data);
    setData(finalData);
    setStage(STAGE.FINAL);

    // Strip draft-only artifacts for the final PDF
    const clean = {
      ...finalData,
      uncategorized_content: [],
      summary: { ...(finalData.summary || {}), notes: '' },
      specialties_skills: { ...(finalData.specialties_skills || {}), notes: '' },
      technical_skills: { ...(finalData.technical_skills || {}), notes: '' },
      certifications: { ...(finalData.certifications || {}), notes: '' }
    };

    const blob = await pdf(<ResumePdf data={clean} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(clean.candidate_name || 'resume').replace(/\W+/g, '_')}_resume.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="logo-dot" />
        <h1>Resume Formatter</h1>
        <div style={{ flex: 1 }} />
        <span className="muted">{stage === STAGE.UPLOAD ? 'Stage 1: Upload' : stage === STAGE.DRAFT ? 'Stage 2: Draft Review' : 'Stage 3: Final Export'}</span>
      </header>

      <main className="app-main">
        <div className="stage-tabs">
          <div className={'stage-tab ' + (stage === STAGE.UPLOAD ? 'active' : '')}>1 · Upload</div>
          <div className={'stage-tab ' + (stage === STAGE.DRAFT ? 'active' : '')}>2 · Draft</div>
          <div className={'stage-tab ' + (stage === STAGE.FINAL ? 'active' : '')}>3 · Final</div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {stage === STAGE.UPLOAD && <UploadStep onPdf={handlePdf} />}

        {stage === STAGE.DRAFT && (
          <>
            <div className="draft-layout">
              <DraftEditor data={data} onChange={setData} />
              <div>
                <div className="panel" style={{ padding: 12, marginBottom: 12 }}>
                  <strong style={{ fontFamily: 'Poppins, sans-serif' }}>Live PDF Preview</strong>
                  <div className="muted" style={{ marginTop: 4 }}>
                    This is the exact PDF that will be exported. Notes & Uncategorized Content are stripped from this preview.
                  </div>
                </div>
                <div style={{ height: 'calc(100vh - 280px)', minHeight: 500, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                  <PDFViewer width="100%" height="100%" showToolbar={false}>
                    <ResumePdf
                      data={{
                        ...data,
                        uncategorized_content: [],
                        summary: { ...(data.summary || {}), notes: '' },
                        specialties_skills: { ...(data.specialties_skills || {}), notes: '' },
                        technical_skills: { ...(data.technical_skills || {}), notes: '' },
                        certifications: { ...(data.certifications || {}), notes: '' }
                      }}
                    />
                  </PDFViewer>
                </div>
              </div>
            </div>
            <div className="toolbar">
              <button className="btn-secondary" onClick={() => setStage(STAGE.UPLOAD)}>
                ← Start Over
              </button>
              <button className="btn-primary" onClick={exportFinalPdf}>
                Approve & Export Final PDF →
              </button>
            </div>
          </>
        )}

        {stage === STAGE.FINAL && (
          <>
            <div className="panel" style={{ marginBottom: 14 }}>
              <strong style={{ fontFamily: 'Montserrat, sans-serif' }}>Final Branded Output</strong>
              <div className="muted" style={{ marginTop: 4 }}>
                Notes and Uncategorized Content have been removed. The PDF download should have started automatically — preview below.
              </div>
            </div>
            <div style={{ height: 'calc(100vh - 260px)', minHeight: 600, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
              <PDFViewer width="100%" height="100%" showToolbar>
                <ResumePdf
                  data={{
                    ...data,
                    uncategorized_content: [],
                    summary: { ...(data.summary || {}), notes: '' },
                    specialties_skills: { ...(data.specialties_skills || {}), notes: '' },
                    technical_skills: { ...(data.technical_skills || {}), notes: '' },
                    certifications: { ...(data.certifications || {}), notes: '' }
                  }}
                />
              </PDFViewer>
            </div>
            <div className="toolbar">
              <button className="btn-secondary" onClick={() => setStage(STAGE.DRAFT)}>
                ← Back to Draft
              </button>
              <button className="btn-primary" onClick={exportFinalPdf}>
                Re-download PDF
              </button>
            </div>
          </>
        )}
      </main>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          {loadingText || 'Working…'}
        </div>
      )}
    </div>
  );
}
