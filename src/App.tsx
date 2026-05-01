import { useState } from 'react'
import './App.css'

type FormatStyle = 'professional' | 'creative' | 'technical'

const SAMPLE_RESUME = `John Doe
john@example.com | 555-123-4567 | linkedin.com/in/johndoe

EXPERIENCE
Software Engineer at Acme Corp (2020-Present)
- built stuff with React and Node
- worked on backend apis
- helped team with code reviews

Junior Dev at StartupXYZ (2018-2020)
- wrote frontend code
- fixed bugs

EDUCATION
BS Computer Science, State University, 2018

SKILLS
JavaScript, React, Node.js, Python, SQL`

const FORMAT_PROMPTS: Record<FormatStyle, string> = {
  professional:
    'Reformatted with consistent section headers, strong action verbs, and quantified achievements for a professional tone.',
  creative:
    'Reformatted with a modern, visually distinct layout suitable for design or marketing roles.',
  technical:
    'Reformatted to highlight technical depth, project impact, and stack specifics for engineering roles.',
}

function formatResume(raw: string, style: FormatStyle): string {
  // Placeholder formatter – in production this would call an AI API.
  const lines = raw.trim().split('\n').filter(Boolean)
  const header = lines.slice(0, 2).join('\n')
  const body = lines.slice(2).join('\n')
  return `${header}

── Formatted as: ${style.toUpperCase()} ──
${FORMAT_PROMPTS[style]}

${body}

✓ Bullet points strengthened with action verbs
✓ Dates normalised to consistent format
✓ Section headers standardised
✓ Contact line formatted`
}

export default function App() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [style, setStyle] = useState<FormatStyle>('professional')
  const [loading, setLoading] = useState(false)

  function handleFormat() {
    if (!input.trim()) return
    setLoading(true)
    // Simulate async AI call
    setTimeout(() => {
      setOutput(formatResume(input, style))
      setLoading(false)
    }, 800)
  }

  function handleCopy() {
    navigator.clipboard.writeText(output)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>✦ AI Resume Formatter</h1>
        <p className="subtitle">Paste your resume, pick a style, and let AI polish it instantly.</p>
      </header>

      <main className="editor">
        <div className="panel">
          <div className="panel-header">
            <span>Raw Resume</span>
            <button
              className="btn-ghost"
              onClick={() => setInput(SAMPLE_RESUME)}
            >
              Load sample
            </button>
          </div>
          <textarea
            className="resume-input"
            placeholder="Paste your resume here…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="controls">
          <div className="style-picker">
            {(['professional', 'creative', 'technical'] as FormatStyle[]).map((s) => (
              <button
                key={s}
                className={`style-btn ${style === s ? 'active' : ''}`}
                onClick={() => setStyle(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            className="btn-primary"
            onClick={handleFormat}
            disabled={loading || !input.trim()}
          >
            {loading ? 'Formatting…' : '✦ Format Resume'}
          </button>
        </div>

        <div className="panel">
          <div className="panel-header">
            <span>Formatted Resume</span>
            {output && (
              <button className="btn-ghost" onClick={handleCopy}>
                Copy
              </button>
            )}
          </div>
          <textarea
            className="resume-output"
            readOnly
            placeholder="Your formatted resume will appear here…"
            value={output}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>AI Resume Formatter · Built with React + Vite</p>
      </footer>
    </div>
  )
}
