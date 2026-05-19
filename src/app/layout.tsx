import type { Metadata } from 'next';
import { Syne, Nunito } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { Toaster } from 'react-hot-toast';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NurseFiti Kenya — Pass Your NCK Exam, First Try',
  description: "Kenya's Smartest NCK Revision Platform. DigiProctor-identical mock exams, 5,000+ answered MCQs, and an AI study plan.",
  keywords: ['NCK exam', 'KRCHN', 'BScN', 'nursing Kenya', 'NCK revision', 'DigiProctor', 'nursing council Kenya'],
  authors: [{ name: 'NurseFiti' }],
  openGraph: {
    title: 'NurseFiti Kenya — Pass Your NCK Exam, First Try',
    description: "Kenya's Smartest NCK Revision Platform",
    type: 'website',
    locale: 'en_KE',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${nunito.variable}`} suppressHydrationWarning>
      <body className={nunito.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--white)',
                color: 'var(--dark)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--green)',
                  secondary: 'var(--white)',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--red)',
                  secondary: 'var(--white)',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
