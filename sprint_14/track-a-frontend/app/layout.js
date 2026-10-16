import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Sprint 14 - Auth System | ProDesk IT',
  description: 'Secure Authentication System with JWT - Sprint 14 Walking Skeleton',
  keywords: 'authentication, JWT, React, Next.js, Sprint 14',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
