
import React from 'react';
import '../styles/resume.css';

/**
 * Branded resume template — replicates test.docx.
 * Pass `mode="draft"` to show notes, missing flags, and uncategorized.
 * Pass `mode="final"` to render the clean print/PDF version.
 */
export default function ResumeTemplate({ data, mode = 'draft' }) {
  const isDraft = mode === 'draft';
  const d = data || {};

  const flag = (label) => (
    <span className="flag">⚠ {label}</span>
  );

  const certificationsList = d.certifications?.items || [];

  return (
    <div className="resume-page" id="resume-page">
      {/* Sidebar */}
      <aside className="resume-sidebar">
        <h2>Location</h2>
        <p>
          {d.location || ''}
          {!d.location && isDraft && flag('missing')}
        </p>

        <h2>Summary</h2>
        {d.summary?.text ? (
          <p className="sb-body">{d.summary.text}</p>
        ) : (
          isDraft && <p className="sb-body">{flag('summary missing')}</p>
        )}
        {isDraft && d.summary?.notes && (
          <div className="notes">Notes: {d.summary.notes}</div>
        )}

        <h2>Education</h2>
        {d.education?.length ? (
          d.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div className="sb-edu-school">{e.institution}</div>
              <div className="sb-edu-degree">{e.degree}</div>
            </div>
          ))
        ) : (
          isDraft && <div>{flag('education missing')}</div>
        )}

        <h2>Specialties + Skills</h2>
        {d.specialties_skills?.text ? (
          <div className="sb-specialties">{d.specialties_skills.text}</div>
        ) : (
          isDraft && <div>{flag('specialties missing')}</div>
        )}
        {isDraft && d.specialties_skills?.notes && (
          <div className="notes">Notes: {d.specialties_skills.notes}</div>
        )}

        <h2>Technical Skills</h2>
        {d.technical_skills?.text ? (
          <div className="sb-specialties">{d.technical_skills.text}</div>
        ) : (
          isDraft && <div>{flag('technical skills missing')}</div>
        )}
        {isDraft && d.technical_skills?.notes && (
          <div className="notes">Notes: {d.technical_skills.notes}</div>
        )}
      </aside>

      {/* Main column */}
      <section className="resume-main">
        <h1 className="person-name">
          {d.candidate_name || (isDraft ? '[Name]' : '')}
        </h1>
        <div className="job-title">
          {d.job_title || (isDraft ? '[Job Title — required]' : '')}
        </div>
        {!d.job_title && isDraft && (
          <div style={{ marginTop: 4 }}>{flag('job title missing')}</div>
        )}

        <h2 className="section-header">Certifications</h2>
        {certificationsList.length ? (
          certificationsList.map((c, i) => (
            <div key={i} className="cert-line">{c}</div>
          ))
        ) : (
          isDraft && <div>{flag('no certifications listed')}</div>
        )}
        {isDraft && d.certifications?.notes && (
          <div className="notes">Notes: {d.certifications.notes}</div>
        )}

        <h2 className="section-header">Select Experiences</h2>
        {(d.experiences || []).map((exp, i) => (
          <div className="exp-block" key={i}>
            <div className="exp-title">{exp.job_title || (isDraft ? '[role]' : '')}</div>
            <div className="exp-meta">
              {[exp.company, exp.location, exp.date_range]
                .filter(Boolean)
                .join(' | ')}
            </div>
            {exp.paragraph && <div className="exp-paragraph">{exp.paragraph}</div>}
            {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
              <ul className="exp-bullets">
                {exp.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {isDraft && d.uncategorized_content?.length > 0 && (
          <>
            <h2 className="section-header" style={{ color: '#8a5a00' }}>
              Uncategorized Content (draft only)
            </h2>
            <ul className="exp-bullets">
              {d.uncategorized_content.map((u, i) => (
                <li key={i}>{u}</li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
