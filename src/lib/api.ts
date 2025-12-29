import axios from 'axios';

// Base URLs
const QURAN_API = 'https://api.alquran.cloud/v1';
const HADITH_API_PROXY = '/api/hadith';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Verse {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

export interface Reciter {
  identifier: string;
  name: string;
  englishName: string;
}

export interface Tafsir {
  author: string;
  content: string;
}

export interface HadithBook {
  bookName: string;
  bookSlug: string;
  hadiths_count: string;
  chapters_count: string;
}

export interface HadithChapter {
  chapterNumber: string;
  chapterArabic: string;
  chapterEnglish: string;
}

export interface Hadith {
  id: number;
  hadithNumber: string;
  hadithArabic: string;
  hadithEnglish: string;
  hadithUrdu: string;
  status: string;
  bookSlug: string;
}

// QURAN FUNCTIONS - Using alquran.cloud for Arabic metadata
export async function getSurahs(): Promise<Surah[]> {
  const response = await axios.get(`${QURAN_API}/surah`);
  return response.data.data;
}

export async function getSurah(number: number): Promise<Surah & { verses: Verse[] }> {
  // Fetch Arabic text
  const response = await axios.get(`${QURAN_API}/surah/${number}`);
  return response.data.data;
}

export async function getSurahWithAudio(number: number, edition: string): Promise<Surah & { verses: (Verse & { audio: string })[] }> {
  const response = await axios.get(`${QURAN_API}/surah/${number}/${edition}`);
  return response.data.data;
}

export async function getReciters(): Promise<Reciter[]> {
  // Fetch audio editions
  const response = await axios.get(`${QURAN_API}/edition/format/audio`);
  return response.data.data;
}

export async function getRecitation(identifier: string, surah: number): Promise<string> {
  const response = await axios.get(`${QURAN_API}/surah/${surah}/${identifier}`);
  return response.data.data;
}

export async function getTafsirs(surah: number, ayah: number): Promise<Tafsir[]> {
  // Use Al-Muyassar (Arabic) and Al-Jalalayn (Arabic)
  const [muyassar, jalalayn] = await Promise.all([
    axios.get(`${QURAN_API}/ayah/${surah}:${ayah}/ar.muyassar`),
    axios.get(`${QURAN_API}/ayah/${surah}:${ayah}/ar.jalalayn`)
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
  ];
}

// HADITH FUNCTIONS
export async function getHadithBooks(): Promise<HadithBook[]> {
  const response = await axios.get(`${HADITH_API_PROXY}?path=books`);
  return response.data.books;
}

export async function getHadithChapters(bookSlug: string): Promise<HadithChapter[]> {
  const response = await axios.get(`${HADITH_API_PROXY}?path=${bookSlug}/chapters`);
  return response.data.chapters;
}

export async function getHadiths(bookSlug: string, chapterId: string): Promise<Hadith[]> {
  const response = await axios.get(`${HADITH_API_PROXY}?path=hadiths&book=${bookSlug}&chapter=${chapterId}`);
  return response.data.hadiths.data;
}

export async function searchHadiths(query: string): Promise<Hadith[]> {
  const response = await axios.get(`${HADITH_API_PROXY}?path=hadiths&hadithArabic=${encodeURIComponent(query)}`);
  return response.data.hadiths.data;
}
