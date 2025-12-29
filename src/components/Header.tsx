'use client'

import React from 'react'
import Link from 'next/link'
import { IconBook2, IconMessageCircle2 } from '@tabler/icons-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-dark/60 border-b border-white/5">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
              <span className="text-white text-xl font-bold">Q</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold gradient-text tracking-tight">القرآن الكريم</h1>
          </Link>

          <nav className="flex items-center gap-2 md:gap-4 p-1.5 bg-dark-lighter/50 rounded-full border border-white/5 shadow-inner">
            <HeaderLink href="/" icon={<IconBook2 className="w-5 h-5" />} label="القرآن" />
            <HeaderLink href="/hadith" icon={<IconMessageCircle2 className="w-5 h-5" />} label="الأحاديث" />
          </nav>
        </div>
      </div>
    </header>
  )
}

function HeaderLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 text-sm md:text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
    >
      {icon}
      <span className="hidden sm:inline-block ml-1">{label}</span>
    </Link>
  )
}