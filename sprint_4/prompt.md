# Sprint 4 — AI Cover Letter Generator (React)
## Prompt Engineering Notes

---

### Prompt 1: Core Gemini System Prompt

**Problem:** How to inject user form data into an LLM prompt?

**Solution:** Template literal prompt with all variables:

```js
const prompt = `You are an expert career coach...
- Candidate Name: ${formData.name}
- Applying For: ${formData.role}
- Target Company: ${formData.company}
- Key Skills: ${skillsList.join(', ')}
- Tone: ${toneGuide[formData.tone]}

Requirements:
1. Start with today's date
2. Address: "Dear Hiring Manager,"
3. 4 body paragraphs
4. End with "Warm regards," + name
5. Under 400 words
6. Use **bold** for company name and candidate name only
7. Plain text paragraphs separated by blank lines`;
```

---

### Prompt 2: Security in Vite React (CRITICAL)

**Problem:** How to store API key safely in React/Vite?

**Solution:** Use `.env` file with Vite's `VITE_` prefix convention:

```
# .env (gitignored)
VITE_GEMINI_API_KEY=AIza...your_key_here
```

```js
// Access in React code:
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

**Rules:**
- `.env` must be in `.gitignore`
- Variable must start with `VITE_` for Vite to expose it
- Never hardcode key in `.jsx` or `.js` files
- Commit `.env.example` as a safe template

---

### Prompt 3: React State Architecture

**Problem:** How to manage 3 UI states (empty → generating → result)?

**Solution:** Single `status` state string in App.jsx:

```jsx
const [status, setStatus] = useState('empty'); // 'empty' | 'generating' | 'result'

// In generation function:
setStatus('generating');
const text = await callGeminiAPI(formData);
setLetterHtml(markdownToHtml(text));
setStatus('result');
```

**OutputPanel** renders based on `status` prop:
```jsx
{status === 'empty'      && <EmptyState />}
{status === 'generating' && <GeneratingState />}
{status === 'result'     && <ResultView html={letterHtml} />}
```

---

### Prompt 4: Graceful API Fallback (Phase 1 → Phase 2)

**Problem:** What if user has no API key?

**Solution:** Try API, catch `NO_API_KEY` error, fall back to template:

```js
try {
  rawText = await callGeminiAPI(formData);        // Phase 2
} catch (err) {
  if (err.message === 'NO_API_KEY') {
    rawText = buildTemplateLetter(formData);      // Phase 1 fallback
  } else {
    throw err; // real API error → show to user
  }
}
```

---

### Prompt 5: Markdown → HTML Conversion

**Problem:** Gemini returns `**bold**` markdown. Need clean HTML.

**Solution:**
```js
function markdownToHtml(text) {
  let safe = text
    .replace(/&/g, '&amp;')           // XSS prevention
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  return safe
    .split(/\n\n+/)
    .map(p => p.replace(/\n/g, '<br>').trim())
    .filter(p => p.length > 0)
    .map(p => `<p>${p}</p>`)
    .join('\n');
}
```
Used with React's `dangerouslySetInnerHTML={{ __html: letterHtml }}`.

---

### Prompt 6: PDF Upload + Extraction (Phase 3)

**Problem:** Browser can't use Node.js `pdf-parse`. How to extract PDF text?

**Solution:** Dynamically load PDF.js from CDN only when needed:

```js
async function loadPdfJs() {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  document.head.appendChild(script);
  await new Promise(r => script.onload = r);
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/.../pdf.worker.min.js';
}
```

---

### Engineering References
- Google Gemini API: https://aistudio.google.com/app/apikey
- Vite env guide: https://vitejs.dev/guide/env-and-mode
- Gemini REST API: https://ai.google.dev/api/generate-content
- PDF.js docs: https://mozilla.github.io/pdf.js/
