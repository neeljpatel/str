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
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MRMZLR4X');`}
            </Script>
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-MRMZLR4X"
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
