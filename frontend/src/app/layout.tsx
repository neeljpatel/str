import type { Metadata } from 'next';
import { Playfair_Display, Lato } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: 'Chicago Ave Collective | Urban Vacation Rentals',
  description: 'The Ultimate Chicago Hub for Large Groups, Centrally Located to Everything.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} scroll-smooth`}>
      <body className="font-sans min-h-screen flex flex-col bg-brand-light text-brand-dark antialiased">
        {children}
      </body>
    </html>
  );
}
