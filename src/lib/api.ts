import axios from 'axios';

// APIs
const QURAN_API = 'https://quranapi.pages.dev/api';
const TAFSIR_API = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir';
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
  audio?: string;
}

export interface Reciter {
  id: string;
  name: string;
  url?: string;
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

// Arabic reciter names
const reciterNamesAr: Record<string, string> = {
  '1': 'مشاري راشد العفاسي',
  '2': 'أبو بكر الشاطري',
  '3': 'ناصر القطامي',
  '4': 'ياسر الدوسري',
  '5': 'هاني الرفاعي'
};

const TAFSIR_SOURCES = [
  { slug: 'ar-tafsir-muyassar', name: 'التفسير الميسر' },
  { slug: 'ar-tafsir-ibn-kathir', name: 'تفسير ابن كثير' }
];

export async function getSurahs(): Promise<Surah[]> {
  try {
    // Use the full Arabic dump endpoint
    const response = await axios.get(`${QURAN_API}/arabic1.json`);
    const list = response.data || [];
    return list.map((s: any) => ({
      number: s.surahNo,
      name: s.surahNameArabicLong || s.surahNameArabic,
      englishName: s.surahName,
      englishNameTranslation: s.surahNameTranslation,
      numberOfAyahs: s.totalAyah,
      revelationType: s.revelationPlace
    }));
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
}

export async function getSurahData(surahNo: number): Promise<{ metadata: Surah; verses: Verse[]; reciters: Reciter[] }> {
  try {
    const response = await axios.get(`${QURAN_API}/${surahNo}.json`);
    const data = response.data;

    // Use arabic1 for verses (Uthmani script with tashkeel)
    const arabicVerses = data.arabic1 || [];

    // Get per-verse audio from verseAudio if available, otherwise use chapter audio
    const verseAudios = data.verseAudio?.['1']?.audios || [];

    const verses: Verse[] = arabicVerses.map((text: string, i: number) => ({
      number: i + 1,
      numberInSurah: i + 1,
      text,
      audio: verseAudios[i]?.originalUrl || verseAudios[i]?.url || data.audio?.['1']?.originalUrl
    }));

    const reciters: Reciter[] = Object.entries(data.audio || {}).map(([id, info]: [string, any]) => ({
      id,
      name: reciterNamesAr[id] || info.reciter,
      url: info.originalUrl || info.url
    }));

    return {
      metadata: {
        number: data.surahNo,
        name: data.surahNameArabicLong || data.surahNameArabic,
        englishName: data.surahName,
        englishNameTranslation: data.surahNameTranslation,
        numberOfAyahs: data.totalAyah,
        revelationType: data.revelationPlace
      },
      verses,
      reciters
    };
  } catch (error) {
    console.error('Error fetching surah data:', error);
    throw error;
  }
}

// ARABIC TAFSIR using spa5k/tafsir_api
export async function getTafsirs(surahNo: number, ayahNo: number): Promise<Tafsir[]> {
  const results: Tafsir[] = [];

  for (const source of TAFSIR_SOURCES) {
    try {
      const response = await axios.get(`${TAFSIR_API}/${source.slug}/${surahNo}/${ayahNo}.json`);
      if (response.data?.text) {
        results.push({
          author: source.name,
          content: response.data.text
        });
      }
    } catch (error) {
      console.error(`Error fetching tafsir ${source.slug}:`, error);
    }
  }

  if (results.length === 0) {
    return [{ author: 'خطأ', content: 'تعذر تحميل التفسير حالياً. يرجى المحاولة مرة أخرى.' }];
  }

  return results;
}

// HADITH FUNCTIONS
export async function getHadithBooks(): Promise<HadithBook[]> {
  try {
    const response = await axios.get(`${HADITH_API_PROXY}?path=books`);
    return response.data.books || [];
  } catch {
    return [];
  }
}

export async function getHadithChapters(bookSlug: string): Promise<HadithChapter[]> {
  try {
    const response = await axios.get(`${HADITH_API_PROXY}?path=${bookSlug}/chapters`);
    return response.data.chapters || [];
  } catch {
    return [];
  }
}

export async function getHadiths(bookSlug: string, chapterId: string): Promise<Hadith[]> {
  try {
    const response = await axios.get(`${HADITH_API_PROXY}?path=hadiths&book=${bookSlug}&chapter=${chapterId}`);
    return response.data.hadiths?.data || [];
  } catch {
    return [];
  }
}

export async function searchHadiths(query: string): Promise<Hadith[]> {
  try {
    const response = await axios.get(`${HADITH_API_PROXY}?path=hadiths&hadithArabic=${encodeURIComponent(query)}`);
    return response.data.hadiths?.data || [];
  } catch {
    return [];
  }
}
