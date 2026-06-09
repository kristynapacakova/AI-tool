import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Funnel Generator | AI Marketing',
  description: 'Generátor marketingových funnelů pro váš byznys – rychle a profesionálně.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className="min-h-screen bg-[#050811] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
