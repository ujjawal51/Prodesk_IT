const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function callGeminiAPI(formData) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('NO_API_KEY');
  }

  const skillsList = formData.skills.split(',').map((s) => s.trim()).filter(Boolean);

  const toneGuide = {
    professional: 'professional, confident, and results-driven',
    enthusiastic: 'enthusiastic, warm, and genuinely excited',
    formal: 'formal, precise, and respectful',
  };

  const today = new Date().toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const prompt = `You are an expert career coach and professional letter writer.

Write a compelling, personalized cover letter for a job application:
- Candidate Name: ${formData.name}
- Applying For: ${formData.role}
- Target Company: ${formData.company}
- Key Skills: ${skillsList.join(', ')}
- Tone: ${toneGuide[formData.tone] || toneGuide.professional}

Requirements:
1. Start with today's date (${today})
2. Address: "Dear Hiring Manager,"
3. Write exactly 4 body paragraphs
4. End with "Warm regards," + candidate name
5. Keep it under 400 words
6. Use **bold** for company name and candidate name only
7. No bullet points or headers in the body
8. Return plain text paragraphs separated by blank lines`;

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.75, maxOutputTokens: 800, topP: 0.9 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API Error ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned an empty response.');
  return text;
}

export function buildTemplateLetter(formData) {
  const today = new Date().toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const skillsList = formData.skills.split(',').map((s) => s.trim()).filter(Boolean);
  const skillsFormatted =
    skillsList.length > 1
      ? skillsList.slice(0, -1).join(', ') + ', and ' + skillsList[skillsList.length - 1]
      : skillsList[0] || 'various technical skills';

  const openers = {
    professional: `I am writing to express my strong interest in the **${formData.role}** position at **${formData.company}**.`,
    enthusiastic: `I am thrilled to apply for the **${formData.role}** position at **${formData.company}** — a company I deeply admire!`,
    formal: `I respectfully submit my application for the position of **${formData.role}** at **${formData.company}**.`,
  };

  const opener = openers[formData.tone] || openers.professional;

  return `${today}

Hiring Manager
${formData.company}

Dear Hiring Manager,

${opener} With a strong foundation in ${skillsFormatted}, I am confident that my profile aligns well with the requirements of this role.

Throughout my journey as a developer, I have cultivated deep expertise in ${skillsList[0] || 'software development'}. My hands-on experience has enabled me to build robust, scalable solutions while maintaining a keen eye for clean code and user experience. I believe great software lives at the intersection of technical excellence and creative problem-solving.

What excites me most about the opportunity at **${formData.company}** is the chance to contribute to a team that values innovation and impact. I bring not only technical proficiency in ${skillsFormatted}, but also the ability to communicate complex ideas clearly, collaborate across teams, and deliver results under pressure.

Thank you for considering my application. I would welcome the opportunity to discuss how my experience and passion align with the goals of **${formData.company}**. I look forward to the possibility of contributing to your continued success.

Warm regards,
**${formData.name}**`;
}

export function markdownToHtml(text) {
  let safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  return safe
    .split(/\n\n+/)
    .map((p) => p.replace(/\n/g, '<br>').trim())
    .filter((p) => p.length > 0)
    .map((p) => `<p>${p}</p>`)
    .join('\n');
}
