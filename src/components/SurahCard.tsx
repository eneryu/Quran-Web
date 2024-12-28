'use client'

import React from 'react'
import Link from 'next/link'
import type { Surah } from '@/lib/api'

interface SurahCardProps {
  surah: Surah
}

export function SurahCard({ surah }: SurahCardProps) {
  return (
    <Link 
      href={`/surah/${surah.number}`}
      className="block p-4 rounded-lg bg-dark-card/50 hover:bg-dark-card transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold">{surah.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{surah.englishName}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-400">{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
          <span className="text-sm text-primary mt-1">{surah.numberOfAyahs} آية</span>
        </div>
      </div>
    </Link>
  )
} 