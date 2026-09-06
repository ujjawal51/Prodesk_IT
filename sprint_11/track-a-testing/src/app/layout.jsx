import './globals.css';

export const metadata = {
  title: 'Sprint 11 Track A: QA Testing Suite',
  description: 'Automated Testing Suite utilizing Jest and React Testing Library in Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
