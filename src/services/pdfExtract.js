// @ts-nocheck
// PDF text extraction using pdfjs-dist (works in browser).
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
// Vite-friendly worker import:
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

/**
 * Extract plain text from a PDF File. Preserves line breaks per text item row.
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function extractPdfText(file) {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const pageTexts = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Group items by approximate Y to reconstruct lines
    const lines = new Map();
    for (const item of content.items) {
      const y = Math.round(item.transform[5]);
      if (!lines.has(y)) lines.set(y, []);
      lines.get(y).push(item);
    }
    const sortedYs = [...lines.keys()].sort((a, b) => b - a); // top-down
    const pageLines = sortedYs.map((y) => {
      const row = lines.get(y).sort((a, b) => a.transform[4] - b.transform[4]);
      return row.map((it) => it.str).join(' ').replace(/\s+/g, ' ').trim();
    }).filter(Boolean);
    pageTexts.push(pageLines.join('\n'));
  }

  await pdf.destroy();
  return pageTexts.join('\n\n');
}
