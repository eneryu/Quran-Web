'use client'

import React from 'react'
import Link from 'next/link'
import type { Surah } from '@/lib/api'
import { IconChevronDown } from '@tabler/icons-react'

interface SurahCardProps {
  surah: Surah
}

export function SurahCard({ surah }: SurahCardProps) {
  return (
    <Link
      href={`/surah/${surah.number}`}
      className="premium-card relative overflow-hidden active:scale-[0.98] group"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold border border-primary/20 rotate-45 group-hover:rotate-0 transition-transform duration-500">
            <span className="-rotate-45 group-hover:rotate-0 transition-transform duration-500">{surah.number}</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold font-arabic text-light group-hover:text-primary transition-colors">{surah.name}</h3>
            <p className="text-sm text-gray-500 mt-1 font-medium">{surah.englishName}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${surah.revelationType === 'Meccan' ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
            {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
          </span>
          <span className="text-xs text-gray-400 font-medium">{surah.numberOfAyahs} آية</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
        <span>{surah.englishNameTranslation}</span>
        <IconChevronDown className="w-4 h-4 -rotate-90 text-gray-600 group-hover:text-primary transition-colors" />
      </div>
    </Link>
  )
}