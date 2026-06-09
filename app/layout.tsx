import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vibe Business Platform | AI Marketing Stratég',
  description: 'AI-powered brand analýza, funnel design a marketingové materiály pro vaše klienty.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className="min-h-screen bg-[#050811] text-white antialiased">{children}</body>
    </html>
  );
}
