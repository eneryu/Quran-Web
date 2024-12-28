'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IconBook2, IconMessageCircle2 } from '@tabler/icons-react'

export function Header() {
  return (
    <header className="border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/images/logo.svg" alt="Logo" width={40} height={40} className="animate-shine" />
            <h1 className="text-2xl font-bold gradient-text">القرآن الكريم</h1>
          </div>

          <nav className="flex items-center gap-6">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <IconBook2 className="w-5 h-5" />
              <span>القرآن</span>
            </Link>
            <Link 
              href="/hadith"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <IconMessageCircle2 className="w-5 h-5" />
              <span>الأحاديث</span>
            </Link>
          </nav>
        </div>
      </div>

      <footer className="fixed bottom-4 left-4">
        <a
          href="https://github.com/eneryu"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-500 hover:text-gray-400"
        >
          Developed by Jack
        </a>
      </footer>
    </header>
  )
} 