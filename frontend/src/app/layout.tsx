import type { Metadata } from 'next';
import { Outfit, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';

const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-outfit',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RentDeck — Kayak & Snowboard Kiralama Yönetimi',
  description:
    'Kayak ve snowboard kiralama dükkanınızı dijital olarak yönetin. Kiracılar, ekipman, paketler, kiralamalar ve bakım işleri tek panelde.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${outfit.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen antialiased" style={{ fontFamily: 'var(--font-outfit), Outfit, system-ui, sans-serif' }}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
