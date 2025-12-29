import axios from 'axios'

const QURAN_BASE_URL = 'https://quranapi.pages.dev/api'

export interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

export interface NewSurah {
  surahName: string
  surahNameArabic: string
  surahNameArabicLong: string
  surahNameTranslation: string
  revelationPlace: string
  totalAyah: number
  surahNo?: number
}

export interface Verse {
  number: number
  text: string
  numberInSurah: number
  audio?: string
}

export interface Reciter {
  id: string
  name: string
  url?: string
}

export interface HadithBook {
  bookName: string
  bookSlug: string
  hadiths_count: string
  chapters_count: string
}

export interface HadithChapter {
  chapterNumber: string
  chapterArabic: string
  chapterEnglish: string
}

export interface Hadith {
  id: number
  hadithNumber: string
  hadithArabic: string
  hadithEnglish: string
  hadithUrdu: string
  status: string
  bookSlug: string
}

export interface Tafsir {
  author: string
  content: string
}

export async function getSurahs(): Promise<Surah[]> {
  const response = await axios.get(`${QURAN_BASE_URL}/surah.json`)
  return response.data.map((s: NewSurah, index: number) => ({
    number: index + 1,
    name: s.surahNameArabic,
    englishName: s.surahName,
    englishNameTranslation: s.surahNameTranslation,
    numberOfAyahs: s.totalAyah,
    revelationType: s.revelationPlace === 'Mecca' ? 'Meccan' : 'Medinan'
  }))
}

export async function getSurah(number: number) {
  const response = await axios.get(`${QURAN_BASE_URL}/${number}.json`)
  const data = response.data

  // Mapping new API format to internal format
  const verses: Verse[] = data.arabic1.map((text: string, index: number) => ({
    number: index + 1,
    numberInSurah: index + 1,
    text: text
  }))

  const reciters: Reciter[] = Object.entries(data.audio || {}).map(([id, info]: [string, any]) => ({
    id,
    name: info.reciter,
    url: info.url
  }))

  return {
    number: data.surahNo,
    name: data.surahNameArabic,
    englishName: data.surahName,
    numberOfAyahs: data.totalAyah,
    verses,
    reciters
  }
}

export async function getTafsirs(surah: number, ayah: number): Promise<Tafsir[]> {
  const response = await axios.get(`${QURAN_BASE_URL}/tafsir/${surah}_${ayah}.json`)
  return response.data.tafsirs.map((t: any) => ({
    author: t.author,
    content: t.content
  }))
}

// Hadith API functions via Proxy
export async function getHadithBooks(): Promise<HadithBook[]> {
  const response = await axios.get('/api/hadith?path=books')
  return response.data.books
}

export async function getHadithChapters(bookSlug: string): Promise<HadithChapter[]> {
  const response = await axios.get(`/api/hadith?path=${bookSlug}/chapters`)
  return response.data.chapters
}

export async function getHadiths(bookSlug: string, chapterId: string): Promise<Hadith[]> {
  const response = await axios.get(`/api/hadith?path=hadiths&book=${bookSlug}&chapter=${chapterId}`)
  return response.data.hadiths.data
}

export async function searchHadiths(query: string): Promise<Hadith[]> {
  const response = await axios.get(`/api/hadith?path=hadiths&hadithArabic=${encodeURIComponent(query)}`)
  return response.data.hadiths.data
}