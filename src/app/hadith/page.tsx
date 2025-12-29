'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { getHadithBooks, getHadithChapters, getHadiths, searchHadiths } from '@/lib/api'
import type { HadithBook, HadithChapter, Hadith } from '@/lib/api'
import { IconBook, IconList, IconMessageCircle2, IconSearch, IconChevronLeft, IconBooks, IconX, IconInfoCircle, IconShare } from '@tabler/icons-react'

export default function HadithPage() {
  const [books, setBooks] = React.useState<HadithBook[]>([])
  const [selectedBook, setSelectedBook] = React.useState<HadithBook | null>(null)
  const [chapters, setChapters] = React.useState<HadithChapter[]>([])
  const [selectedChapter, setSelectedChapter] = React.useState<HadithChapter | null>(null)
  const [hadiths, setHadiths] = React.useState<Hadith[]>([])
  const [selectedHadith, setSelectedHadith] = React.useState<Hadith | null>(null)
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
    setSelectedHadith(null)
    setLoading(prev => ({ ...prev, chapters: true }))
    const data = await getHadithChapters(book.bookSlug)
    setChapters(data)
    setLoading(prev => ({ ...prev, chapters: false }))
  }

  const handleChapterSelect = async (chapter: HadithChapter) => {
    setSelectedChapter(chapter)
    setSelectedHadith(null)
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
    setSelectedHadith(null)
    const data = await searchHadiths(searchQuery)
    setHadiths(data)
    setLoading(prev => ({ ...prev, hadiths: false }))
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-dark">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content: Books/Chapters/Hadiths List */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-500 ${selectedHadith ? 'lg:w-3/5' : 'w-full'}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold font-arabic gradient-text">موسوعة الحديث الشريف</h2>
              <p className="text-gray-500 text-sm mt-1">تصفح كنوز السنة النبوية الشريفة</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 group">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث في الأحاديث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/50 focus:border-primary outline-none transition-all shadow-lg text-sm pr-12"
                />
                <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                  <IconSearch className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-6 text-xs overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => { setSelectedBook(null); setSelectedChapter(null); setHadiths([]); setSelectedHadith(null); }}
                className={`px-3 py-1.5 rounded-lg glass border-white/5 ${!selectedBook ? 'text-primary' : 'text-gray-400'}`}
              >
                المكتبة
              </button>
              {selectedBook && (
                <>
                  <IconChevronLeft className="w-3 h-3 text-gray-600" />
                  <button
                    onClick={() => { setSelectedChapter(null); setHadiths([]); setSelectedHadith(null); }}
                    className={`px-3 py-1.5 rounded-lg glass border-white/5 ${selectedBook && !selectedChapter ? 'text-primary' : 'text-gray-400'}`}
                  >
                    {selectedBook.bookName}
                  </button>
                </>
              )}
              {selectedChapter && (
                <>
                  <IconChevronLeft className="w-3 h-3 text-gray-600" />
                  <span className="px-3 py-1.5 rounded-lg glass border-primary/20 text-primary">
                    {selectedChapter.chapterArabic}
                  </span>
                </>
              )}
            </div>

            {/* Lists Area */}
            <div className="max-w-6xl mx-auto">
              {!selectedBook && !hadiths.length && !loading.hadiths && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {books.map((book) => (
                    <button
                      key={book.bookSlug}
                      onClick={() => handleBookSelect(book)}
                      className="glass p-5 rounded-2xl text-right group hover:border-primary/40 transition-all active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <IconBooks className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold font-arabic text-light">{book.bookName}</h3>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500 border-t border-white/5 pt-3">
                        <span>{book.hadiths_count} حديث</span>
                        <span>{book.chapters_count} باب</span>
                      </div>
                    </button>
                  ))}
                  {loading.books && Array(9).fill(0).map((_, i) => (
                    <div key={i} className="h-32 glass rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              )}

              {selectedBook && !selectedChapter && !hadiths.length && !loading.hadiths && (
                <div className="grid grid-cols-1 gap-3">
                  {chapters.map((chapter) => (
                    <button
                      key={chapter.chapterNumber}
                      onClick={() => handleChapterSelect(chapter)}
                      className="glass p-5 rounded-xl flex items-center justify-between hover:border-primary/40 transition-all group active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-5">
                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">{chapter.chapterNumber}</span>
                        <h4 className="font-bold font-arabic text-light group-hover:text-primary transition-colors text-right">{chapter.chapterArabic}</h4>
                      </div>
                      <IconChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                  ))}
                  {loading.chapters && Array(10).fill(0).map((_, i) => (
                    <div key={i} className="h-16 glass rounded-xl animate-pulse"></div>
                  ))}
                </div>
              )}

              {(hadiths.length > 0 || loading.hadiths) && (
                <div className="space-y-4">
                  {hadiths.map((hadith, index) => (
                    <div
                      key={hadith.id}
                      onClick={() => setSelectedHadith(hadith)}
                      className={`verse-card group relative ${selectedHadith?.id === hadith.id ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5' : 'border-transparent'}`}
                    >
                      <div className="flex gap-5 items-start">
                        <span className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-[10px] font-bold transition-all ${selectedHadith?.id === hadith.id ? 'bg-primary text-white' : 'bg-white/5 text-gray-500'}`}>
                          {hadith.hadithNumber}
                        </span>
                        <p className={`flex-1 text-xl md:text-2xl font-arabic leading-[1.8] text-right antialiased transition-colors ${selectedHadith?.id === hadith.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                          {hadith.hadithArabic}
                        </p>
                      </div>
                    </div>
                  ))}
                  {loading.hadiths && Array(6).fill(0).map((_, i) => (
                    <div key={i} className="h-32 glass rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Hadith Details */}
        <aside
          className={`fixed lg:relative top-0 right-0 h-full lg:h-auto z-[60] lg:z-auto transition-all duration-500 ease-in-out border-r border-white/5 glass shadow-2xl overflow-hidden ${selectedHadith ? 'w-full lg:w-[40%] visible opacity-100 translate-x-0' : 'w-0 invisible opacity-0 translate-x-full'
            }`}
        >
          {selectedHadith && (
            <div className="h-full flex flex-col bg-dark/95 backdrop-blur-3xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <IconInfoCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">تفاصيل الحديث</h3>
                    <p className="text-xs text-gray-500">{selectedHadith.bookSlug} • رقم {selectedHadith.hadithNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHadith(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 transition-all"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                  <p className="text-2xl font-arabic leading-[2] text-light text-center">{selectedHadith.hadithArabic}</p>
                </div>

                <div className="grid gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hadith Status</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedHadith.status === 'Sahih' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>{selectedHadith.status}</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <h5 className="text-primary font-bold text-xs flex items-center gap-2">
                      <div className="w-1 h-3 bg-primary rounded-full"></div>
                      English Translation
                    </h5>
                    <p className="text-gray-400 leading-relaxed text-base italic">{selectedHadith.hadithEnglish}</p>
                  </div>

                  {selectedHadith.hadithUrdu && (
                    <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <h5 className="text-accent font-bold text-xs flex items-center gap-2">
                        <div className="w-1 h-3 bg-accent rounded-full"></div>
                        Urdu Translation
                      </h5>
                      <p className="text-gray-400 leading-relaxed text-base italic font-arabic text-right">{selectedHadith.hadithUrdu}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-white/5">
                <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-all flex items-center justify-center gap-2">
                  <IconShare className="w-4 h-4" />
                  مشاركة الحديث
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}