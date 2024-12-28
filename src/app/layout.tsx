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
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
