import type { Metadata } from 'next';
import './globals.css';

import localFont from 'next/font/local';

const spaceMono = localFont({
  src: [
    { path: '../public/assets/fonts/SpaceMono-Regular.ttf', weight: '400' },
    { path: '../public/assets/fonts/SpaceMono-Bold.ttf', weight: '700' },
  ],
  variable: '--font-space-mono',
  display: 'swap',
});

const spaceGrotesk = localFont({
  src: [
    { path: '../public/assets/fonts/SpaceGrotesk-Regular.ttf', weight: '400' },
    { path: '../public/assets/fonts/SpaceGrotesk-Medium.ttf', weight: '500' },
    { path: '../public/assets/fonts/SpaceGrotesk-Bold.ttf', weight: '700' },
  ],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const caveat = localFont({
  src: '../public/assets/fonts/Caveat-Variable.ttf',
  weight: '400 700',
  variable: '--font-caveat',
  display: 'swap',
});

const fraunces = localFont({
  src: '../public/assets/fonts/Fraunces-Variable.ttf',
  weight: '100 900',
  variable: '--font-fraunces',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Karma',
  description: 'Karma-skærmen i loungen',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceMono.variable} ${spaceGrotesk.variable} ${caveat.variable} ${fraunces.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
