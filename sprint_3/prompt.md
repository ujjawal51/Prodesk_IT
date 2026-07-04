### prompts

how to format data like this in js
Data Formatting: The API gives dates like 2023-01-25T12:00:00Z. You must format this to look human-readable (e.g., "25 Jan 2023").

-> function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}