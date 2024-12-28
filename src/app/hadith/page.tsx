'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { getFortyHadith } from '@/lib/api'
import type { Hadith } from '@/lib/api'

export default function HadithPage() {
  const [hadiths, setHadiths] = React.useState<Hadith[]>([])

  React.useEffect(() => {
    getFortyHadith().then(setHadiths)
  }, [])

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8">الأربعون النووية</h2>

        <div className="space-y-6">
          {hadiths.map((hadith) => (
            <div key={hadith.id} className="p-6 rounded-lg bg-dark-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-primary">الحديث {hadith.number}</span>
              </div>
              <p className="text-xl font-arabic leading-loose mb-4">{hadith.arab}</p>
              <p className="text-gray-400 leading-relaxed">{hadith.text}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  )
} 