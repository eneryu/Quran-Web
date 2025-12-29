'use client'

import { Noto_Kufi_Arabic, Amiri } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const kufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-kufi',
})

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={`${kufi.variable} ${amiri.variable}`}>
      <head>
        <title>القرآن الكريم - موسوعة إسلامية شاملة</title>
        <meta name="description" content="موقع القرآن الكريم - قراءة واستماع للقرآن الكريم والأحاديث النبوية مع التفسير" />
      </head>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <div className="flex-1">
            {children}
          </div>
          <footer className="py-8 border-t border-white/5 bg-dark/40 backdrop-blur-sm text-center">
            <a
              href="https://github.com/eneryu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary transition-colors text-sm font-medium"
            >
              Developed with ❤️ by Jack
            </a>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
