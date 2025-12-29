import axios from 'axios';

// NEW API - Much more reliable and has Arabic by default
const QURAN_API = 'https://quranapi.pages.dev/api';
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
  groupVerse?: string | null;
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

// List of surahs in Arabic for quick reference
const surahNamesAr = [
  'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال', 'التوبة', 'يونس',
  'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه',
  'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم',
  'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر',
  'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق',
  'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة',
  'الصف', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج',
  'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس',
  'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج', 'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد',
  'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات',
  'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر',
  'المسد', 'الإخلاص', 'الفلق', 'الناس'
];

const reciterNamesAr: Record<string, string> = {
  '1': 'مشاري راشد العفاسي',
  '2': 'أبو بكر الشاطري',
  '3': 'ناصر القطامي',
  '4': 'ياسر الدوسري',
  '5': 'هاني الرفاعي'
};

const tafsirAuthorAr: Record<string, string> = {
  'Ibn Kathir': 'ابن كثير',
  'Maarif Ul Quran': 'معارف القرآن',
  'Tazkirul Quran': 'تذكير القرآن'
};

// QURAN FUNCTIONS using quranapi.pages.dev
export async function getSurahs(): Promise<Surah[]> {
  try {
    const response = await axios.get(`${QURAN_API}/surahlist.json`);
    const list = response.data || [];
    return list.map((s: any, i: number) => ({
      number: i + 1,
      name: surahNamesAr[i] || s.name,
      englishName: s.name,
      englishNameTranslation: s.translation,
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

    const verses: Verse[] = data.arabic1.map((text: string, i: number) => ({
      number: i + 1,
      numberInSurah: i + 1,
      text,
      audio: data.audio?.['1']?.originalUrl // Default to Alafasy
    }));

    const reciters: Reciter[] = Object.entries(data.audio || {}).map(([id, info]: [string, any]) => ({
      id,
      name: reciterNamesAr[id] || info.reciter,
      url: info.originalUrl || info.url
    }));

    return {
      metadata: {
        number: data.surahNo,
        name: data.surahNameArabicLong || surahNamesAr[surahNo - 1],
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

export async function getTafsirs(surahNo: number, ayahNo: number): Promise<Tafsir[]> {
  try {
    const response = await axios.get(`${QURAN_API}/tafsir/${surahNo}_${ayahNo}.json`);
    const data = response.data.tafsirs || [];
    return data.map((t: any) => ({
      author: tafsirAuthorAr[t.author] || t.author,
      content: t.content,
      groupVerse: t.groupVerse
    }));
  } catch (error) {
    console.error('Error fetching tafsirs:', error);
    return [{ author: 'خطأ', content: 'تعذر تحميل التفسير حالياً.', groupVerse: null }];
  }
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
