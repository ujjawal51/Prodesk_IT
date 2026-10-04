import '../../styles/globals.css';

export const metadata = {
  title: 'Sprint 12 | Track A Component Library & Design System',
  description: 'Enterprise Component Driven Development with Storybook and Next.js'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
