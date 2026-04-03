import type { Metadata } from 'next';
import { Playfair_Display, Lato } from 'next/font/google';
import Script from 'next/script';
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
  const isProd = process.env.NODE_ENV === 'production';

  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} scroll-smooth`}>
      <body className="font-sans min-h-screen flex flex-col bg-brand-light text-brand-dark antialiased">
        {isProd && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-M501Q013KE"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-M501Q013KE');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
