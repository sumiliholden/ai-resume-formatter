
import React from 'react';

/**
 * DraftEditor — left column form bound to the resume data object.
 * Lets the user resolve missing fields and tweak content before final export.
 */
export default function DraftEditor({ data, onChange }) {
  const update = (path, value) => {
    const next = JSON.parse(JSON.stringify(data));
    const segs = path.split('.');
    let cur = next;
    for (let i = 0; i < segs.length - 1; i++) cur = cur[segs[i]];
    cur[segs[segs.length - 1]] = value;
    onChange(next);
  };

  const addEducation = () => {
    onChange({
      ...data,
      education: [...(data.education || []), { institution: '', degree: '' }]
    });
  };

  const removeEducation = (i) => {
    onChange({
      ...data,
      education: data.education.filter((_, idx) => idx !== i)
    });
  };

  const updateEdu = (i, key, value) => {
    const next = [...data.education];
    next[i] = { ...next[i], [key]: value };
    onChange({ ...data, education: next });
  };

  const updateExp = (i, key, value) => {
    const next = [...data.experiences];
    next[i] = { ...next[i], [key]: value };
    onChange({ ...data, experiences: next });
  };

  const updateBullet = (ei, bi, value) => {
    const next = [...data.experiences];
    const bullets = [...(next[ei].bullets || [])];
    bullets[bi] = value;
    next[ei] = { ...next[ei], bullets };
    onChange({ ...data, experiences: next });
  };

  const addExperience = () => {
    onChange({
      ...data,
      experiences: [
        ...(data.experiences || []),
        { job_title: '', company: '', location: '', date_range: '', paragraph: '', bullets: [] }
      ]
    });
  };

  const removeExperience = (i) => {
    onChange({ ...data, experiences: data.experiences.filter((_, idx) => idx !== i) });
  };

  const addBullet = (ei) => {
    const next = [...data.experiences];
    next[ei] = { ...next[ei], bullets: [...(next[ei].bullets || []), ''] };
    onChange({ ...data, experiences: next });
  };

  const removeBullet = (ei, bi) => {
    const next = [...data.experiences];
    next[ei] = { ...next[ei], bullets: next[ei].bullets.filter((_, idx) => idx !== bi) };
    onChange({ ...data, experiences: next });
  };

  return (
    <div className="panel">
      <h2>Edit Draft</h2>
      <p className="muted" style={{ marginTop: -8, marginBottom: 12 }}>
        Resolve missing fields and adjust content. The right side updates live.
      </p>

      <h3>Header</h3>
      <div className="field-row">
        <label>Candidate Name</label>
        <input
          value={data.candidate_name || ''}
          onChange={(e) => update('candidate_name', e.target.value)}
          placeholder="John D."
        />
      </div>
      <div className="field-row">
        <label>Job Title</label>
        <input
          value={data.job_title || ''}
          onChange={(e) => update('job_title', e.target.value)}
          placeholder="Required — provided by you"
        />
      </div>
      <div className="field-row">
        <label>Location</label>
        <input
          value={data.location || ''}
          onChange={(e) => update('location', e.target.value)}
          placeholder="Washington, D.C."
        />
      </div>

      <h3>Summary</h3>
      <textarea
        rows={4}
        value={data.summary?.text || ''}
        onChange={(e) => update('summary.text', e.target.value)}
      />
      <input
        style={{ marginTop: 6 }}
        value={data.summary?.notes || ''}
        onChange={(e) => update('summary.notes', e.target.value)}
        placeholder="Notes (optional, draft only)"
      />

      <h3>Education</h3>
      {(data.education || []).map((e, i) => (
        <div key={i} className="experience-block">
          <div className="field-row">
            <label>Institution</label>
            <input value={e.institution} onChange={(ev) => updateEdu(i, 'institution', ev.target.value)} />
          </div>
          <div className="field-row">
            <label>Degree</label>
            <input value={e.degree} onChange={(ev) => updateEdu(i, 'degree', ev.target.value)} />
          </div>
          <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => removeEducation(i)}>
            Remove
          </button>
        </div>
      ))}
      <div className="list-add">
        <button className="btn-secondary" onClick={addEducation}>+ Add Education</button>
      </div>

      <h3>Specialties + Skills</h3>
      <textarea
        rows={3}
        value={data.specialties_skills?.text || ''}
        onChange={(e) => update('specialties_skills.text', e.target.value)}
        placeholder="Comma-separated"
      />
      <input
        style={{ marginTop: 6 }}
        value={data.specialties_skills?.notes || ''}
        onChange={(e) => update('specialties_skills.notes', e.target.value)}
        placeholder="Notes (optional)"
      />

      <h3>Technical Skills</h3>
      <textarea
        rows={3}
        value={data.technical_skills?.text || ''}
        onChange={(e) => update('technical_skills.text', e.target.value)}
        placeholder="Comma-separated"
      />
      <input
        style={{ marginTop: 6 }}
        value={data.technical_skills?.notes || ''}
        onChange={(e) => update('technical_skills.notes', e.target.value)}
        placeholder="Notes (optional)"
      />

      <h3>Certifications</h3>
      <textarea
        rows={4}
        value={(data.certifications?.items || []).join('\n')}
        onChange={(e) =>
          update(
            'certifications.items',
            e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
          )
        }
        placeholder="One per line"
      />
      <input
        style={{ marginTop: 6 }}
        value={data.certifications?.notes || ''}
        onChange={(e) => update('certifications.notes', e.target.value)}
        placeholder="Notes (optional)"
      />

      <h3>Experiences</h3>
      {(data.experiences || []).map((exp, i) => (
        <div key={i} className="experience-block">
          <div className="field-row">
            <label>Job Title</label>
            <input value={exp.job_title} onChange={(ev) => updateExp(i, 'job_title', ev.target.value)} />
          </div>
          <div className="field-row">
            <label>Company</label>
            <input value={exp.company} onChange={(ev) => updateExp(i, 'company', ev.target.value)} />
          </div>
          <div className="field-row">
            <label>Location</label>
            <input value={exp.location} onChange={(ev) => updateExp(i, 'location', ev.target.value)} />
          </div>
          <div className="field-row">
            <label>Dates</label>
            <input
              value={exp.date_range}
              onChange={(ev) => updateExp(i, 'date_range', ev.target.value)}
              placeholder="2022 - Present"
            />
          </div>
          <div className="field-row">
            <label>Paragraph</label>
            <textarea
              rows={3}
              value={exp.paragraph || ''}
              onChange={(ev) => updateExp(i, 'paragraph', ev.target.value)}
            />
          </div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-text)' }}>Bullets</label>
          {(exp.bullets || []).map((b, bi) => (
            <div key={bi} style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <input value={b} onChange={(ev) => updateBullet(i, bi, ev.target.value)} />
              <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => removeBullet(i, bi)}>
                ×
              </button>
            </div>
          ))}
          <div className="list-add">
            <button className="btn-secondary" onClick={() => addBullet(i)}>+ Bullet</button>
            <button className="btn-secondary" onClick={() => removeExperience(i)}>Remove Experience</button>
          </div>
        </div>
      ))}
      <div className="list-add">
        <button className="btn-secondary" onClick={addExperience}>+ Add Experience</button>
      </div>

      {data.uncategorized_content?.length > 0 && (
        <>
          <h3>Uncategorized Content (draft only)</h3>
          <textarea
            rows={4}
            value={(data.uncategorized_content || []).join('\n')}
            onChange={(e) =>
              update(
                'uncategorized_content',
                e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
              )
            }
          />
          <p className="muted">This section is automatically removed from the final PDF.</p>
        </>
      )}
    </div>
  );
}
