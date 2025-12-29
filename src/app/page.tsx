'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { SurahCard } from '@/components/SurahCard'
import { getSurahs } from '@/lib/api'
import type { Surah } from '@/lib/api'
import { IconSearch } from '@tabler/icons-react'

export default function Home() {
  const [surahs, setSurahs] = React.useState<Surah[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    getSurahs().then(setSurahs)
  }, [])

  const filteredSurahs = (surahs || []).filter(surah =>
    surah.name.includes(searchQuery) ||
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12 animate-fade-in">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl md:text-7xl font-bold font-arabic gradient-text">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            مرحباً بك في تطبيق القرآن الكريم، رفيقك في رحلة التدبر والاستماع لكتاب الله.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16 group">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن سورة بالاسم (عربي أو إنجليزي)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-8 py-5 rounded-3xl bg-dark-card/30 backdrop-blur-md text-white border border-white/10 group-hover:border-primary/50 focus:border-primary outline-none transition-all duration-300 shadow-xl pr-14"
            />
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">
              <IconSearch className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredSurahs.map((surah) => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
          {filteredSurahs.length === 0 && surahs.length > 0 && (
            <div className="col-span-full text-center py-20 bg-dark-card/20 rounded-3xl border border-white/5">
              <p className="text-gray-500 text-lg italic">لم يتم العثور على نتائج للتحقق من: &quot;{searchQuery}&quot;</p>
            </div>
          )}
          {surahs.length === 0 && (
            Array(9).fill(0).map((_, i) => (
              <div key={i} className="h-40 rounded-3xl bg-dark-card/20 animate-pulse border border-white/5"></div>
            ))
          )}
        </div>
      </main>
    </>
  )
}
