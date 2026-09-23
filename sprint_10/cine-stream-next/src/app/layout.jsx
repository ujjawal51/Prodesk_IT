import './globals.css';
import { ClientShell } from '../components/ClientShell';

export const metadata = {
  title: 'Cine-Stream | Next.js 15 Media Discovery',
  description: 'Enterprise-grade cinematic streaming and discovery platform with Server-Side Rendering (SSR) and AI-powered recommendations.',
  keywords: ['movies', 'streaming', 'cinema', 'nextjs', 'ssr', 'tmdb', 'gemini-ai'],
  authors: [{ name: 'Cine-Stream Engineering' }],
  openGraph: {
    title: 'Cine-Stream | Cinematic Streaming Platform',
    description: 'Explore trending movies, search seamlessly, and discover films via Gemini AI.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
