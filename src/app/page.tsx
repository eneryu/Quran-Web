'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { SurahCard } from '@/components/SurahCard'
import { getSurahs } from '@/lib/api'
import type { Surah } from '@/lib/api'

export default function Home() {
  const [surahs, setSurahs] = React.useState<Surah[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    getSurahs().then(setSurahs)
  }, [])

  const filteredSurahs = surahs.filter(surah => 
    surah.name.includes(searchQuery) || 
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="ابحث عن سورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-dark-card text-white border border-white/10 focus:border-primary outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </div>
      </main>
    </>
  )
}
