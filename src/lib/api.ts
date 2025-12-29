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
  audio?: string;
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

const reciterNamesAr: Record<string, string> = {
  'ar.alafasy': 'مشاري راشد العفاسي',
  'ar.abdurrahmaansudais': 'عبد الرحمن السديس',
  'ar.abdulsamad': 'عبد الباسط عبد الصمد',
  'ar.shaatree': 'أبو بكر الشاطري',
  'ar.ahmedajamy': 'أحمد بن علي العجمي',
  'ar.husary': 'محمود خليل الحصري',
  'ar.minshawi': 'محمد صديق المنشاوي',
  'ar.mahermuaiqly': 'ماهر المعيقلي',
  'ar.saoodshuraym': 'سعود الشريم',
  'ar.hanirifai': 'هاني الرفاعي',
  'ar.ghamadi': 'سعد الغامدي',
  'ar.hudhaify': 'علي بن عبد الرحمن الحذيفي'
};

// QURAN FUNCTIONS
export async function getSurahs(): Promise<Surah[]> {
  try {
    const response = await axios.get(`${QURAN_API}/surah`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
}

export async function getFullSurahData(number: number, edition: string = 'ar.alafasy') {
  try {
    // Fetch Arabic text and Audio edition in one call
    // Note: quran-simple is very fast and reliable for text
    const response = await axios.get(`${QURAN_API}/surah/${number}/editions/quran-simple,${edition}`);
    const [textEdition, audioEdition] = response.data.data;

    return {
      metadata: {
        number: textEdition.number,
        name: textEdition.name,
        englishName: textEdition.englishName,
        englishNameTranslation: textEdition.englishNameTranslation,
        numberOfAyahs: textEdition.numberOfAyahs,
        revelationType: textEdition.revelationType,
      },
      verses: textEdition.verses.map((v: any, i: number) => ({
        ...v,
        audio: audioEdition.verses[i].audio
      }))
    };
  } catch (error) {
    console.error('Error fetching full surah data:', error);
    throw error;
  }
}

export async function getReciters(): Promise<Reciter[]> {
  try {
    const response = await axios.get(`${QURAN_API}/edition/format/audio`);
    const data = response.data.data || [];
    return data.map((r: any) => ({
      ...r,
      name: reciterNamesAr[r.identifier] || r.name
    }));
  } catch (error) {
    console.error('Error fetching reciters:', error);
    return [];
  }
}

export async function getTafsirs(surah: number, ayah: number): Promise<Tafsir[]> {
  try {
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
  } catch (error) {
    console.error('Error fetching tafsirs:', error);
    return [{ author: 'خطأ', content: 'تعذر تحميل التفسير حالياً.' }];
  }
}

// HADITH FUNCTIONS
export async function getHadithBooks(): Promise<HadithBook[]> {
  const response = await axios.get(`${HADITH_API_PROXY}?path=books`);
  return response.data.books || [];
}

export async function getHadithChapters(bookSlug: string): Promise<HadithChapter[]> {
  const response = await axios.get(`${HADITH_API_PROXY}?path=${bookSlug}/chapters`);
  return response.data.chapters || [];
}

export async function getHadiths(bookSlug: string, chapterId: string): Promise<Hadith[]> {
  const response = await axios.get(`${HADITH_API_PROXY}?path=hadiths&book=${bookSlug}&chapter=${chapterId}`);
  return response.data.hadiths?.data || [];
}

export async function searchHadiths(query: string): Promise<Hadith[]> {
  const response = await axios.get(`${HADITH_API_PROXY}?path=hadiths&hadithArabic=${encodeURIComponent(query)}`);
  return response.data.hadiths?.data || [];
}
