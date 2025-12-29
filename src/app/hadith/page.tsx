'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { getHadithBooks, getHadithChapters, getHadiths, searchHadiths } from '@/lib/api'
import type { HadithBook, HadithChapter, Hadith } from '@/lib/api'
import { IconBook, IconList, IconMessageCircle2, IconSearch, IconChevronLeft, IconBooks } from '@tabler/icons-react'

export default function HadithPage() {
  const [books, setBooks] = React.useState<HadithBook[]>([])
  const [selectedBook, setSelectedBook] = React.useState<HadithBook | null>(null)
  const [chapters, setChapters] = React.useState<HadithChapter[]>([])
  const [selectedChapter, setSelectedChapter] = React.useState<HadithChapter | null>(null)
  const [hadiths, setHadiths] = React.useState<Hadith[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [loading, setLoading] = React.useState({ books: true, chapters: false, hadiths: false })

  React.useEffect(() => {
    getHadithBooks().then(data => {
      setBooks(data)
      setLoading(prev => ({ ...prev, books: false }))
    })
  }, [])

  const handleBookSelect = async (book: HadithBook) => {
    setSelectedBook(book)
    setSelectedChapter(null)
    setHadiths([])
    setLoading(prev => ({ ...prev, chapters: true }))
    const data = await getHadithChapters(book.bookSlug)
    setChapters(data)
    setLoading(prev => ({ ...prev, chapters: false }))
  }

  const handleChapterSelect = async (chapter: HadithChapter) => {
    setSelectedChapter(chapter)
    setLoading(prev => ({ ...prev, hadiths: true }))
    if (selectedBook) {
      const data = await getHadiths(selectedBook.bookSlug, chapter.chapterNumber)
      setHadiths(data)
    }
    setLoading(prev => ({ ...prev, hadiths: false }))
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery) return
    setLoading(prev => ({ ...prev, hadiths: true }))
    setSelectedBook(null)
    setSelectedChapter(null)
    const data = await searchHadiths(searchQuery)
    setHadiths(data)
    setLoading(prev => ({ ...prev, hadiths: false }))
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12 animate-fade-in">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold font-arabic gradient-text">موسوعة الحديث الشريف</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            استكشف كتب السنة النبوية الشريفة، الأحاديث، الشروحات، والأبواب الفقهية.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 group">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث في الأحاديث (بالعربية)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-8 py-5 rounded-3xl bg-dark-card/30 backdrop-blur-md text-white border border-white/10 group-hover:border-primary/50 focus:border-primary outline-none transition-all duration-300 shadow-xl pr-14"
            />
            <button type="submit" className="absolute left-6 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform">
              <IconSearch className="w-6 h-6" />
            </button>
          </div>
        </form>

        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-sm overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => { setSelectedBook(null); setSelectedChapter(null); setHadiths([]); }}
            className={`px-4 py-2 rounded-full glass border-white/5 whitespace-nowrap ${!selectedBook ? 'text-primary border-primary/20' : 'text-gray-400'}`}
          >
            المكتبة
          </button>
          {selectedBook && (
            <>
              <IconChevronLeft className="w-4 h-4 text-gray-600 shrink-0" />
              <button
                onClick={() => { setSelectedChapter(null); setHadiths([]); }}
                className={`px-4 py-2 rounded-full glass border-white/5 whitespace-nowrap ${selectedBook && !selectedChapter ? 'text-primary border-primary/20' : 'text-gray-400'}`}
              >
                {selectedBook.bookName}
              </button>
            </>
          )}
          {selectedChapter && (
            <>
              <IconChevronLeft className="w-4 h-4 text-gray-600 shrink-0" />
              <span className="px-4 py-2 rounded-full glass border-primary/20 text-primary whitespace-nowrap">
                {selectedChapter.chapterArabic}
              </span>
            </>
          )}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {/* Books List */}
          {!selectedBook && !hadiths.length && !loading.hadiths && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <button
                  key={book.bookSlug}
                  onClick={() => handleBookSelect(book)}
                  className="premium-card text-right group hover:scale-[1.02] active:scale-95 transition-all text-light"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <IconBooks className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-arabic">{book.bookName}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">{book.bookSlug}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-400 border-t border-white/5 pt-4">
                    <span>{book.hadiths_count} حديث</span>
                    <span>{book.chapters_count} باب</span>
                  </div>
                </button>
              ))}
              {loading.books && Array(9).fill(0).map((_, i) => (
                <div key={i} className="h-40 glass rounded-3xl animate-pulse"></div>
              ))}
            </div>
          )}

          {/* Chapters List */}
          {selectedBook && !selectedChapter && !hadiths.length && !loading.hadiths && (
            <div className="grid grid-cols-1 gap-4">
              {chapters.map((chapter) => (
                <button
                  key={chapter.chapterNumber}
                  onClick={() => handleChapterSelect(chapter)}
                  className="glass p-6 rounded-2xl flex items-center justify-between hover:border-primary/40 transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{chapter.chapterNumber}</span>
                    <div className="text-right">
                      <h4 className="text-lg font-bold font-arabic text-light group-hover:text-primary transition-colors">{chapter.chapterArabic}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{chapter.chapterEnglish}</p>
                    </div>
                  </div>
                  <IconChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                </button>
              ))}
              {loading.chapters && Array(10).fill(0).map((_, i) => (
                <div key={i} className="h-20 glass rounded-2xl animate-pulse"></div>
              ))}
            </div>
          )}

          {/* Hadiths List (from Chapter or Search) */}
          {(hadiths.length > 0 || loading.hadiths) && (
            <div className="max-w-4xl mx-auto space-y-8">
              {hadiths.map((hadith, index) => (
                <div
                  key={hadith.id}
                  className="premium-card group animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">رقم: {hadith.hadithNumber}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${hadith.status === 'Sahih' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>{hadith.status}</span>
                    </div>
                    <span className="text-gray-500 text-xs font-bold uppercase">{hadith.bookSlug}</span>
                  </div>
                  <p className="text-3xl font-arabic leading-[2] mb-8 text-light text-center border-b border-white/5 pb-8">{hadith.hadithArabic}</p>
                  <div className="space-y-4">
                    <div className="bg-dark/20 p-6 rounded-2xl border border-white/5">
                      <h5 className="text-primary font-bold text-sm mb-2 flex items-center gap-2">
                        <div className="w-1 h-3 bg-primary rounded-full"></div>
                        English Translation:
                      </h5>
                      <p className="text-gray-400 leading-relaxed text-lg italic">{hadith.hadithEnglish}</p>
                    </div>
                    {hadith.hadithUrdu && (
                      <div className="bg-dark/20 p-6 rounded-2xl border border-white/5">
                        <h5 className="text-accent font-bold text-sm mb-2 flex items-center gap-2">
                          <div className="w-1 h-3 bg-accent rounded-full"></div>
                          Translation Urdu:
                        </h5>
                        <p className="text-gray-400 leading-relaxed text-lg italic font-arabic text-right">{hadith.hadithUrdu}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading.hadiths && Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-64 glass rounded-3xl animate-pulse"></div>
              ))}
              {!loading.hadiths && hadiths.length === 0 && (
                <div className="text-center py-20 glass rounded-3xl border-white/5">
                  <p className="text-gray-500 text-lg">لم يتم العثور على أحاديث.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}