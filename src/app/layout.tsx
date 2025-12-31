import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import PWAProvider from '@/components/PWAProvider';
import AuthProvider from '@/components/AuthProvider';
import AnalyticsProvider from '@/components/AnalyticsProvider';
import Navigation from '@/components/Navigation';
import { ToastProvider } from '@/lib/toastContext';
import ToastWrapper from '@/components/ToastWrapper';
import ClientErrorBoundary from '@/components/ClientErrorBoundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rupiya – Smart Expense Tracker',
  description: 'AI-powered personal finance and expense tracking platform',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Rupiya',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Rupiya" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900`}
      >
        <ClientErrorBoundary>
          <PWAProvider>
            <ToastProvider>
              <AuthProvider>
                <AnalyticsProvider>
                  <Navigation />
                  {children}
                </AnalyticsProvider>
              </AuthProvider>
              <ToastWrapper />
            </ToastProvider>
          </PWAProvider>
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
