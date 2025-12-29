import axios from 'axios'

const QURAN_BASE_URL = 'https://api.alquran.cloud/v1'

export interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
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

// Arabic mapping for reciters since API returns English
const RECITER_ARABIC_NAMES: Record<string, string> = {
  'ar.alafasy': 'مشاري رشيد العفاسي',
  'ar.abdulsamad': 'عبد الباسط عبد الصمد',
  'ar.shatree': 'أبو بكر الشاطري',
  'ar.ajamy': 'أحمد بن علي العجمي',
  'ar.ghamadi': 'سعد الغامدي',
  'ar.minshawi': 'محمد صديق المنشاوي',
  'ar.hudhaify': 'علي بن عبد الرحمن الحذيفي'
}

export async function getSurahs(): Promise<Surah[]> {
  const response = await axios.get(`${QURAN_BASE_URL}/surah`)
  return response.data.data
}

export async function getSurah(number: number) {
  // Fetch Arabic Text
  const response = await axios.get(`${QURAN_BASE_URL}/surah/${number}`)
  const surahData = response.data.data

  // Audio Editions (Arabic)
  const audioList = [
    { id: 'ar.alafasy', name: 'مشاري رشيد العفاسي' },
    { id: 'ar.abdulsamad', name: 'عبد الباسط عبد الصمد' },
    { id: 'ar.shatree', name: 'أبو بكر الشاطري' },
    { id: 'ar.hudhaify', name: 'علي الحذيفي' },
    { id: 'ar.minshawi', name: 'صديق المنشاوي' }
  ]

  return {
    ...surahData,
    verses: surahData.verses.map((v: any) => ({
      number: v.number,
      numberInSurah: v.numberInSurah,
      text: v.text
    })),
    reciters: audioList
  }
}

export async function getAudioUrl(reciterId: string, surahNumber: number) {
  const response = await axios.get(`${QURAN_BASE_URL}/surah/${surahNumber}/${reciterId}`)
  return response.data.data.verses[0].audio // This is a bit tricky since alquran.cloud returns per verse
  // Better to use a different source for full surah audio if needed, but let's stick to verse-by-verse or a full surah API
}

export async function getTafsirs(surah: number, ayah: number): Promise<Tafsir[]> {
  // Fetch Arabic Tafsirs only
  // 1. Muyassar (ar.muyassar)
  // 2. Jalalayn (ar.jalalayn)
  const [muyassar, jalalayn] = await Promise.all([
    axios.get(`${QURAN_BASE_URL}/ayah/${surah}:${ayah}/ar.muyassar`),
    axios.get(`${QURAN_BASE_URL}/ayah/${surah}:${ayah}/ar.jalalayn`)
  ]);

  return [
    {
      author: 'التفسير الميسر',
      content: muyassar.data.data.text
    },
    {
      author: 'تفسير الجلالين',
      content: jalalayn.data.data.text
    }
  ]
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