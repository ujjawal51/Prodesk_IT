// PDF text extraction using PDF.js (loaded dynamically)

let pdfJsLoaded = false;

function loadPdfJs() {
  return new Promise((resolve, reject) => {
    if (pdfJsLoaded) return resolve();
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      // eslint-disable-next-line no-undef
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      pdfJsLoaded = true;
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function extractPdfText(file) {
  try {
    await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    // eslint-disable-next-line no-undef
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map((item) => item.str).join(' ') + '\n';
    }
    return fullText.trim();
  } catch (err) {
    console.warn('PDF extraction failed:', err);
    return '';
  }
}
