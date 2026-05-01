// @ts-nocheck
// Groq AI client — https://console.groq.com/keys

const SYSTEM_PROMPT = `You are a strict resume RESTRUCTURING engine. You do NOT review, rewrite, or summarize.
You preserve the candidate's original wording exactly, except for fixing GLARING spelling and grammar mistakes
and ensuring every bullet ends with a period. If a section is missing from the source, mark "missing": true and
leave its content empty. If you fix a glaring error, record what you changed in "notes". Anything in the source
that does not fit a known section goes into "uncategorized_content".

Rules:
- candidate_name MUST be formatted as "First L." (first name + first initial of last name + period).
- job_title comes from the job_title_override field provided by the user. If override is empty, leave job_title "" and note that it is missing in the UI (do not invent it).
- Education: institution first, then degree. NEVER include years.
- Specialties + Skills, Technical Skills: comma-separated paragraph, preserve original capitalization.
- Certifications: array of strings, each one cert per item.
- Experiences: preserve bullets/paragraphs exactly. Ensure every bullet ends with a period. Normalize dates to "Month Year - Month Year" or "Year - Year". Omit location if not present.
- Do not summarize. Do not rewrite for style. Do not omit content.

Output VALID JSON only matching the provided schema. No markdown, no commentary.`;

const SCHEMA_HINT = `{
  "candidate_name": "First L.",
  "job_title": "",
  "location": "",
  "summary": { "text": "", "notes": "", "missing": false },
  "education": [ { "institution": "", "degree": "" } ],
  "specialties_skills": { "text": "", "notes": "", "missing": false },
  "technical_skills": { "text": "", "notes": "", "missing": false },
  "certifications": { "items": [], "notes": "", "missing": false },
  "experiences": [
    {
      "job_title": "",
      "company": "",
      "location": "",
      "date_range": "",
      "paragraph": "",
      "bullets": []
    }
  ],
  "uncategorized_content": []
}`;

/**
 * Parse extracted resume text into the standardized structured object.
 * @param {string} resumeText
 * @param {{ jobTitleOverride?: string }} opts
 * @returns {Promise<object>}
 */
export async function parseResumeWithAI(resumeText, opts = {}) {
  const userPrompt = `Schema (return JSON in this exact shape):
${SCHEMA_HINT}

job_title_override: ${JSON.stringify(opts.jobTitleOverride || '')}

Resume text (extracted from a PDF; layout artifacts may be present — be tolerant but preserve content exactly):
"""
${resumeText}
"""`;

  return callGroq(userPrompt);
}

// ---------- Groq (OpenAI-compatible Chat Completions) ----------
async function callGroq(userPrompt) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const model = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';
  if (!apiKey) {
    throw new Error('Missing VITE_GROQ_API_KEY. Get a free key at https://console.groq.com/keys');
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error (${res.status}): ${errText.slice(0, 400)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || '';
  if (!text) throw new Error('Empty response from Groq');
  return parseJsonResponse(text);
}

function parseJsonResponse(text) {
  // Strip code fences just in case the model adds them.
  const cleaned = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Fallback: extract the first {...} block
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* fallthrough */ }
    }
    throw new Error('AI returned non-JSON: ' + cleaned.slice(0, 300));
  }
}
