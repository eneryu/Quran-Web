'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { ReciterSelect } from '@/components/ReciterSelect'
import { TafsirDialog } from '@/components/TafsirDialog'
import { getSurah, getReciters, getRecitation, getTafsir } from '@/lib/api'
import type { Verse, Reciter } from '@/lib/api'

interface SurahPageProps {
  params: {
    id: string
  }
}

export default function SurahPage({ params }: SurahPageProps) {
  const [verses, setVerses] = React.useState<Verse[]>([])
  const [reciters, setReciters] = React.useState<Reciter[]>([])
  const [selectedReciter, setSelectedReciter] = React.useState('')
  const [audioUrl, setAudioUrl] = React.useState('')
  const [selectedVerse, setSelectedVerse] = React.useState<Verse | null>(null)
  const [tafsir, setTafsir] = React.useState('')
  const audioRef = React.useRef<HTMLAudioElement>(null)

  React.useEffect(() => {
    Promise.all([
      getSurah(parseInt(params.id)),
      getReciters()
    ]).then(([surahData, recitersData]) => {
      setVerses(surahData.verses)
      setReciters(recitersData)
      if (recitersData.length > 0) {
        setSelectedReciter(recitersData[0].identifier)
      }
    })
  }, [params.id])

  React.useEffect(() => {
    if (selectedReciter) {
      getRecitation(selectedReciter, parseInt(params.id))
        .then(setAudioUrl)
    }
  }, [selectedReciter, params.id])

  const handleVerseClick = async (verse: Verse) => {
    setSelectedVerse(verse)
    const tafsirText = await getTafsir(parseInt(params.id), verse.numberInSurah)
    setTafsir(tafsirText)
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">سورة {verses[0]?.surah?.name}</h2>
          <div className="flex items-center gap-4">
            <ReciterSelect
              reciters={reciters}
              selectedReciter={selectedReciter}
              onReciterChange={setSelectedReciter}
            />
            {audioUrl && (
              <audio ref={audioRef} src={audioUrl} controls className="h-10" />
            )}
          </div>
        </div>

        <div className="space-y-4">
          {verses.map((verse) => (
            <div
              key={verse.number}
              className="verse"
              onClick={() => handleVerseClick(verse)}
            >
              <span className="verse-number">{verse.numberInSurah}</span>
              <span className="verse-text">{verse.text}</span>
            </div>
          ))}
        </div>

        {selectedVerse && (
          <TafsirDialog
            isOpen={!!selectedVerse}
            onClose={() => setSelectedVerse(null)}
            verseText={selectedVerse.text}
            tafsir={tafsir}
          />
        )}
      </main>
    </>
  )
} 