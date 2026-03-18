import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'YONI — who are you',
  description: 'YONI is a global neutral platform for NCRISG-based self-exploration, growth, peaceful blessing, and free expression.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}