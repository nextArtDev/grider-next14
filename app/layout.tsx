import type { Metadata } from 'next'

import './globals.css'

import { Toaster } from '@/components/ui/sonner'
import AuthProvider from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { numericFont, primaryFont } from '@/lib/fonts'
import { ReduxProviders } from '@/redux/Providers'
import { ModalProvider } from '@/providers/modal-providers'

export const metadata: Metadata = {
  title: 'Book Store',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <ReduxProviders>
        <AuthProvider>
          <body
            className={`${primaryFont.className} ${numericFont.className} adad min-h-screen`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* <ModalProvider /> */}
              {children}
              <Toaster richColors position="bottom-left" />
            </ThemeProvider>
          </body>
        </AuthProvider>
      </ReduxProviders>
    </html>
  )
}
