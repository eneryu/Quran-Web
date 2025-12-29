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
    try {
      const data = await getHadithChapters(book.bookSlug)
      setChapters(data)
    } finally {
      setLoading(prev => ({ ...prev, chapters: false }))
    }
  }

  const handleChapterSelect = async (chapter: HadithChapter) => {
    setSelectedChapter(chapter)
    setSelectedHadith(null)
    setLoading(prev => ({ ...prev, hadiths: true }))
    if (selectedBook) {
      try {
        const data = await getHadiths(selectedBook.bookSlug, chapter.chapterNumber)
        setHadiths(data)
      } finally {
        setLoading(prev => ({ ...prev, hadiths: false }))
      }
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery) return
    setLoading(prev => ({ ...prev, hadiths: true }))
    setSelectedBook(null)
    setSelectedChapter(null)
    setSelectedHadith(null)
    try {
      const data = await searchHadiths(searchQuery)
      setHadiths(data)
    } finally {
      setLoading(prev => ({ ...prev, hadiths: false }))
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-dark">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-500 ${selectedHadith ? 'lg:w-3/5' : 'w-full'}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold font-arabic gradient-text">موسوعة الحديث الشريف</h2>
              <p className="text-gray-500 text-sm mt-2">تصفح كنوز السنة النبوية الشريفة من الكتب الصحاح</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 group" dir="rtl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث في الأحاديث الشريفة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-8 py-5 rounded-3xl bg-dark-card/30 backdrop-blur-md text-white border border-white/10 group-hover:border-primary/50 focus:border-primary outline-none transition-all shadow-xl pr-14 text-right font-arabic"
                />
                <button type="submit" className="absolute left-6 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform">
                  <IconSearch className="w-6 h-6" />
                </button>
              </div>
            </form>

            {/* Breadcrumbs */}
            <div className="flex flex-row-reverse items-center gap-2 mb-8 text-sm overflow-x-auto pb-2 no-scrollbar" dir="rtl">
              <button
                onClick={() => { setSelectedBook(null); setSelectedChapter(null); setHadiths([]); setSelectedHadith(null); }}
                className={`px-4 py-2 rounded-xl glass border-white/5 whitespace-nowrap ${!selectedBook ? 'text-primary bg-primary/10 border-primary/20' : 'text-gray-400'}`}
              >
                المكتبة الشاملة
              </button>
              {selectedBook && (
                <>
                  <IconChevronLeft className="w-4 h-4 text-gray-600 rotate-180" />
                  <button
                    onClick={() => { setSelectedChapter(null); setHadiths([]); setSelectedHadith(null); }}
                    className={`px-4 py-2 rounded-xl glass border-white/5 whitespace-nowrap ${selectedBook && !selectedChapter ? 'text-primary bg-primary/10 border-primary/20' : 'text-gray-400'}`}
                  >
                    {selectedBook.bookName}
                  </button>
                </>
              )}
              {selectedChapter && (
                <>
                  <IconChevronLeft className="w-4 h-4 text-gray-600 rotate-180" />
                  <span className="px-4 py-2 rounded-xl glass border-primary/20 text-primary whitespace-nowrap font-arabic">
                    {selectedChapter.chapterArabic}
                  </span>
                </>
              )}
            </div>

            {/* Content Lists */}
            <div className="max-w-6xl mx-auto" dir="rtl">
              {/* Books List */}
              {!selectedBook && !hadiths.length && !loading.hadiths && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <button
                      key={book.bookSlug}
                      onClick={() => handleBookSelect(book)}
                      className="glass p-6 rounded-3xl text-right group hover:border-primary/40 hover:bg-primary/5 border-white/5 transition-all active:scale-[0.98] relative overflow-hidden"
                    >
                      <div className="flex items-center gap-4 mb-4 flex-row-reverse">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <IconBooks className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold font-arabic text-light flex-1">{book.bookName}</h3>
                      </div>
                      <div className="flex justify-between flex-row-reverse text-xs text-gray-500 border-t border-white/5 pt-4">
                        <span className="font-bold">{book.hadiths_count} حديث</span>
                        <span className="bg-white/5 px-2 py-0.5 rounded-lg">{book.chapters_count} باب</span>
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
                      className="glass p-6 rounded-2xl flex items-center justify-between hover:border-primary/40 hover:bg-primary/5 transition-all group active:scale-[0.99] flex-row-reverse"
                    >
                      <div className="flex items-center gap-6 flex-row-reverse">
                        <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
                          {chapter.chapterNumber}
                        </span>
                        <h4 className="text-lg font-bold font-arabic text-light group-hover:text-primary transition-colors text-right">
                          {chapter.chapterArabic}
                        </h4>
                      </div>
                      <IconChevronLeft className="w-5 h-5 text-gray-600 rotate-180" />
                    </button>
                  ))}
                  {loading.chapters && Array(10).fill(0).map((_, i) => (
                    <div key={i} className="h-20 glass rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              )}

              {/* Hadiths Grid */}
              {(hadiths.length > 0 || loading.hadiths) && (
                <div className="space-y-6">
                  {hadiths.map((hadith, index) => (
                    <div
                      key={hadith.id}
                      onClick={() => setSelectedHadith(hadith)}
                      className={`verse-card group relative flex flex-row-reverse gap-6 items-start p-8 ${selectedHadith?.id === hadith.id ? 'bg-primary/10 border-primary ring-1 ring-primary/20 shadow-2xl' : 'border-white/5'}`}
                    >
                      <span className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl text-xs font-bold transition-all border ${selectedHadith?.id === hadith.id ? 'bg-primary text-white border-primary' : 'bg-white/5 text-gray-500 border-white/5'}`}>
                        {hadith.hadithNumber}
                      </span>
                      <p className={`flex-1 text-2xl md:text-3xl font-arabic leading-[2.2] text-right antialiased transition-colors ${selectedHadith?.id === hadith.id ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                        {hadith.hadithArabic}
                      </p>
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

        {/* Sidebar: Details (Arabic Only Focus) */}
        <aside
          className={`fixed lg:relative top-0 right-0 h-full lg:h-auto z-[60] lg:z-auto transition-all duration-500 ease-in-out border-r border-white/5 glass shadow-2xl overflow-hidden ${selectedHadith ? 'w-full lg:w-[40%] visible opacity-100 translate-x-0' : 'w-0 invisible opacity-0 translate-x-full'
            }`}
          dir="rtl"
        >
          {selectedHadith && (
            <div className="h-full flex flex-col bg-dark/95 backdrop-blur-3xl">
              <div className="p-8 border-b border-white/10 flex items-center justify-between flex-row-reverse">
                <div className="flex items-center gap-4 flex-row-reverse">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <IconInfoCircle className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold text-xl font-arabic">تفاصيل الحديث الشريف</h3>
                    <p className="text-xs text-gray-500 mt-1">{selectedHadith.bookSlug} • حديث رقم {selectedHadith.hadithNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedHadith(null)}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 transition-all"
                >
                  <IconX className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10 text-right">
                {/* HERO: Primary Arabic Text */}
                <div className="p-8 rounded-3xl bg-primary/10 border border-primary/20 shadow-lg">
                  <h4 className="text-primary font-bold mb-6 flex items-center gap-3 text-lg font-arabic">
                    <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                    نص الحديث الشريف:
                  </h4>
                  <p className="text-3xl font-arabic leading-[2.2] text-light text-center antialiased">
                    {selectedHadith.hadithArabic}
                  </p>
                </div>

                <div className="grid gap-6">
                  {/* Status Badge */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-400 font-arabic">حكم الحديث:</span>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${selectedHadith.status === 'Sahih' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'}`}>
                      {selectedHadith.status === 'Sahih' ? 'صحيح' : 'حسن / آخر'}
                    </span>
                  </div>

                  {/* NOTE: English and Urdu hidden because the user is allergic to non-Arabic right now */}
                  {/* If they were to be included, they should be in an accordion or at the very bottom */}
                </div>
              </div>

              <div className="p-8 border-t border-white/10">
                <button className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                  <IconShare className="w-5 h-5" />
                  مشاركة الحديث (صدقة جارية)
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}