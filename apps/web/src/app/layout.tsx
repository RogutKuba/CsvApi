import type { Metadata } from 'next';
import '@billing/ui/styles/global.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'CSV to API',
  description: 'Instantly convert CSV to API for free',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <Script
        src='https://beamanalytics.b-cdn.net/beam.min.js'
        data-token='675cad43-f0ad-4eac-918d-e29733cbbe32'
        async
      />
      <body className='h-screen w-screen flex'>
        <main className='grow flex flex-col'>{children}</main>
      </body>
    </html>
  );
}
