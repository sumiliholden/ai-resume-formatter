# Resume Formatter

Turns a messy uploaded resume PDF into the company's standardized, branded format.

Pipeline:
1. **Upload** a PDF (and optionally type the Job Title).
2. The app extracts text in-browser with `pdfjs-dist`.
3. The extracted text is sent to a **Groq free-tier** model (`llama-3.3-70b-versatile`) that restructures it into a strict JSON schema (no rewriting, no summarizing, missing fields flagged).
4. A **draft** view shows notes, missing-field flags, and "Uncategorized Content" alongside an editable form.
5. After approval, a **branded PDF** is generated client-side via `html2pdf.js` — notes and uncategorized content are stripped from the final.

The branded layout (sidebar + main column, green `#95B541` headings, Montserrat / Open Sans) replicates `test.docx`.

---

## Setup

```powershell
cd app
npm install
copy .env.example .env
# then edit .env and paste your free Groq API key
npm run dev
```

Get a free API key here: <https://console.groq.com/keys>

The free tier (`llama-3.3-70b-versatile`) is generous enough for this workload. To swap providers later, change `src/services/aiClient.js`.

## Project structure

```
app/
  index.html
  vite.config.js
  src/
    main.jsx
    App.jsx                 # 3-stage flow (Upload → Draft → Final)
    components/
      UploadStep.jsx        # PDF upload + Job Title prompt
      DraftEditor.jsx       # Editable form bound to the data object
      ResumeTemplate.jsx    # Branded HTML/CSS template (draft + final modes)
    services/
      pdfExtract.js         # pdfjs-dist text extraction
      aiClient.js           # Groq REST call + strict JSON schema prompt
      rules.js              # Local enforcement (name format, period on bullets)
    styles/
      global.css
      resume.css            # Brand styles (colors, fonts, sidebar layout)
```

## Behaviour rules enforced

- Candidate name auto-formatted to `First L.`
- Job Title comes from user input — never invented
- Education shown as institution → degree, **never with years**
- Specialties / Technical Skills / Certifications flagged when missing
- Every experience bullet ends with a period (post-processed locally even if the AI forgets)
- Original wording preserved — no summarizing or rewriting
- Draft shows `Notes:`, missing flags, and `Uncategorized Content`
- Final PDF removes all of the above

## Future upgrades

- Swap free Groq for paid Gemini / Claude / OpenAI in `src/services/aiClient.js` (one file)
- Add OCR (Tesseract.js) for scanned PDFs
- Add DOCX upload via `mammoth`
- Persist drafts to localStorage / a backend
- Replace `html2pdf.js` with server-side Chromium rendering (Puppeteer) for pixel-perfect output
