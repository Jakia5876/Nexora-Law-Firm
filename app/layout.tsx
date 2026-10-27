import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nexora Law Firm | Advocates & Legal Consultants',
  description: 'Premier legal counsel in Corporate Litigation, Cross-Border M&A, Intellectual Property, and Trial Defense.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nexoralaw.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} scroll-smooth`}>
      <body className="bg-neutral-950 text-neutral-100 min-h-screen flex flex-col font-sans antialiased">
        <Navbar />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />

        {/* Vibe96 Live Demo Verification Engine */}
        <script src="https://vibe96.com/js/v96-demo.js" defer></script>
      </body>
    </html>
  );
}
