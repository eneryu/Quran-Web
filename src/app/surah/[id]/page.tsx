'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { ReciterSelect } from '@/components/ReciterSelect'
import { TafsirDialog } from '@/components/TafsirDialog'
import { getSurah, getTafsirs } from '@/lib/api'
import type { Verse, Reciter, Surah, Tafsir } from '@/lib/api'

interface SurahPageProps {
  params: Promise<{
    id: string
  }>
}

export default function SurahPage({ params }: SurahPageProps) {
  const { id } = React.use(params)
  const [verses, setVerses] = React.useState<Verse[]>([])
  const [surah, setSurah] = React.useState<any>(null)
  const [reciters, setReciters] = React.useState<Reciter[]>([])
  const [selectedReciter, setSelectedReciter] = React.useState('')
  const [audioUrl, setAudioUrl] = React.useState('')
  const [selectedVerse, setSelectedVerse] = React.useState<Verse | null>(null)
  const [tafsirs, setTafsirs] = React.useState<Tafsir[]>([])
  const audioRef = React.useRef<HTMLAudioElement>(null)

  React.useEffect(() => {
    getSurah(parseInt(id)).then((surahData) => {
      setVerses(surahData.verses)
      setSurah(surahData)
      setReciters(surahData.reciters)
      if (surahData.reciters.length > 0) {
        setSelectedReciter(surahData.reciters[0].id)
      }
    })
  }, [id])

  React.useEffect(() => {
    if (selectedReciter && reciters.length > 0) {
      const reciter = reciters.find(r => r.id === selectedReciter)
      if (reciter?.url) {
        setAudioUrl(reciter.url)
      }
    }
  }, [selectedReciter, reciters])

  const handleVerseClick = async (verse: Verse) => {
    setSelectedVerse(verse)
    setTafsirs([]) // Clear previous
    const data = await getTafsirs(parseInt(id), verse.numberInSurah)
    setTafsirs(data)
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8 glass p-8 rounded-3xl border-primary/10 shadow-premium">
          <div className="text-center md:text-right">
            <h2 className="text-4xl md:text-5xl font-bold mb-2 font-arabic text-primary">{surah?.name}</h2>
            <p className="text-gray-400 text-lg">{surah?.englishName} • {surah?.numberOfAyahs} آيات</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <ReciterSelect
              reciters={reciters || []}
              selectedReciter={selectedReciter}
              onReciterChange={setSelectedReciter}
            />
            {audioUrl && (
              <div className="flex items-center bg-dark/40 rounded-full px-4 py-2 border border-white/5 backdrop-blur-md">
                <audio
                  ref={audioRef}
                  key={audioUrl}
                  src={audioUrl}
                  controls
                  className="h-8 audio-player"
                />
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {verses?.map((verse, index) => (
            <div
              key={verse.number}
              className="verse group"
              onClick={() => handleVerseClick(verse)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="verse-number">{verse.numberInSurah}</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-primary/20 to-transparent mr-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <p className="verse-text">{verse.text}</p>
              </div>
            </div>
          ))}
          {(!verses || verses.length === 0) && (
            <div className="grid gap-6">
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="h-32 glass rounded-2xl animate-pulse"></div>
              ))}
            </div>
          )}
        </div>

        {selectedVerse && (
          <TafsirDialog
            isOpen={!!selectedVerse}
            onClose={() => setSelectedVerse(null)}
            verseText={selectedVerse.text}
            tafsirs={tafsirs}
          />
        )}
      </main>
    </>
  )
}