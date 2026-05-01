// @ts-nocheck
// Local enforcement of formatting rules as a safety net on top of AI output.

export function ensureNameFormat(name) {
  if (!name) return '';
  const trimmed = name.trim();
  // If already "First L." pattern, leave alone.
  if (/^[A-Z][a-zA-Z'\-]+\s+[A-Z]\.$/.test(trimmed)) return trimmed;
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0];
  const last = parts[parts.length - 1];
  return `${first} ${last.charAt(0).toUpperCase()}.`;
}

export function ensurePeriod(s) {
  if (!s) return '';
  const t = s.trim();
  if (!t) return '';
  if (/[.!?]$/.test(t)) return t;
  return t + '.';
}

/**
 * Post-process AI output: enforce name format and bullet-period rule.
 * Returns a new object (immutable).
 */
export function applyRules(parsed) {
  const out = JSON.parse(JSON.stringify(parsed || {}));
  out.candidate_name = ensureNameFormat(out.candidate_name);

  if (Array.isArray(out.experiences)) {
    out.experiences = out.experiences.map((e) => ({
      ...e,
      bullets: Array.isArray(e.bullets) ? e.bullets.map(ensurePeriod) : []
    }));
  }
  return out;
}

export function emptyResume() {
  return {
    candidate_name: '',
    job_title: '',
    location: '',
    summary: { text: '', notes: '', missing: false },
    education: [],
    specialties_skills: { text: '', notes: '', missing: false },
    technical_skills: { text: '', notes: '', missing: false },
    certifications: { items: [], notes: '', missing: false },
    experiences: [],
    uncategorized_content: []
  };
}
