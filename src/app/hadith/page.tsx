'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { getFortyHadith } from '@/lib/api'
import type { Hadith } from '@/lib/api'
import { IconMessageCircle2 } from '@tabler/icons-react'

export default function HadithPage() {
  const [hadiths, setHadiths] = React.useState<Hadith[]>([])

  React.useEffect(() => {
    getFortyHadith().then(setHadiths)
  }, [])

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12 animate-fade-in">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-arabic gradient-text">الأربعون النووية</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            مجموعة من الأحاديث النبوية الشريفة التي جمعها الإمام النووي، والتي تعتبر من جوامع كلم النبي صلى الله عليه وسلم.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {hadiths?.map((hadith, index) => (
            <div
              key={hadith.id}
              className="premium-card group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20">الحديث {hadith.number}</span>
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <IconMessageCircle2 className="w-6 h-6" />
                </div>
              </div>
              <p className="text-3xl font-arabic leading-[2] mb-8 text-light text-center border-b border-white/5 pb-8">{hadith.arab}</p>
              <div className="bg-dark/20 p-6 rounded-2xl border border-white/5">
                <p className="text-gray-400 leading-relaxed text-lg italic line-clamp-4 group-hover:line-clamp-none transition-all duration-500">{hadith.text}</p>
              </div>
            </div>
          ))}
          {(!hadiths || hadiths.length === 0) && (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-dark-card/20 animate-pulse border border-white/5"></div>
            ))
          )}
        </div>
      </main>
    </>
  )
}