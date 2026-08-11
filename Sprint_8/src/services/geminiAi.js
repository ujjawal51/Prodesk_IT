export async function matchMoodToMovie(promptText) {
  if (!promptText || !promptText.trim()) return '';

  const key = localStorage.getItem('cine_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '';

  if (key) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Given user emotion: "${promptText}", respond with ONLY 1 exact popular movie title string or keywords to search on TMDB. No punctuation or sentences.`
              }]
            }]
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        const title = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (title) {
          return title.replace(/["']/g, '');
        }
      }
    } catch (err) {
      console.warn('AI error:', err);
    }
  }

  const str = promptText.toLowerCase();
  if (str.includes('sad') || str.includes('cry') || str.includes('down')) {
    return 'Interstellar';
  } else if (str.includes('hero') || str.includes('action') || str.includes('fight')) {
    return 'The Dark Knight';
  } else if (str.includes('sci-fi') || str.includes('future') || str.includes('space')) {
    return 'Dune';
  } else if (str.includes('mind') || str.includes('dream') || str.includes('confused')) {
    return 'Inception';
  } else if (str.includes('happy') || str.includes('anime') || str.includes('fun')) {
    return 'Spirited Away';
  }

  return str.split(' ')[0] || 'Cyberpunk';
}
