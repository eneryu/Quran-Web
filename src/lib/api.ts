import axios from 'axios';

// --- NEW STABLE ARABIC APIs (Quran.com v4) ---
const QURAN_COM_API = 'https://api.quran.com/api/v4';
const HADITH_CDN = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

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
  verse_key?: string;
}

export interface Reciter {
  identifier: string;
  name: string;
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
}

export interface Hadith {
  id: number;
  hadithNumber: string;
  hadithArabic: string;
  status: string;
  bookSlug: string;
}

// --- QURAN FUNCTIONS (Arabic First) ---

export async function getSurahs(): Promise<Surah[]> {
  try {
    const response = await axios.get(`${QURAN_COM_API}/chapters?language=ar`);
    return response.data.chapters.map((c: any) => ({
      number: c.id,
      name: c.name_arabic,
      englishName: c.name_complex,
      englishNameTranslation: c.translated_name.name,
      numberOfAyahs: c.verses_count,
      revelationType: c.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'
    }));
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
}

export async function getFullSurahData(number: number, reciterId: number = 7) {
  try {
    // 1. Fetch Uthmani Text
    const textRes = await axios.get(`${QURAN_COM_API}/quran/verses/uthmani?chapter_number=${number}`);

    // 2. Fetch Audio (Mishary Alafasy is 7 by default)
    // api.quran.com v4 recitations: /recitations/{id}/by_chapter/{chapter_number}
    const audioRes = await axios.get(`${QURAN_COM_API}/recitations/${reciterId}/by_chapter/${number}`);

    // 3. Fetch Chapter Metadata
    const metaRes = await axios.get(`${QURAN_COM_API}/chapters/${number}?language=ar`);
    const c = metaRes.data.chapter;

    const verses = textRes.data.verses.map((v: any, i: number) => ({
      number: v.id,
      text: v.text_uthmani,
      numberInSurah: i + 1,
      verse_key: v.verse_key,
      audio: audioRes.data.audio_files[i]?.url
        ? (audioRes.data.audio_files[i].url.startsWith('http') ? audioRes.data.audio_files[i].url : `https://audio.qurancdn.com/${audioRes.data.audio_files[i].url}`)
        : ''
    }));

    return {
      metadata: {
        number: c.id,
        name: c.name_arabic,
        englishName: c.name_complex,
        englishNameTranslation: c.translated_name.name,
        numberOfAyahs: c.verses_count,
        revelationType: c.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'
      },
      verses
    };
  } catch (error) {
    console.error('Error fetching full surah data:', error);
    throw error;
  }
}

export async function getReciters(): Promise<Reciter[]> {
  // Common Arabic reciters from Quran.com
  return [
    { identifier: '7', name: 'مشاري راشد العفاسي' },
    { identifier: '1', name: 'عبد الباسط عبد الصمد' },
    { identifier: '3', name: 'عبد الرحمن السديس' },
    { identifier: '6', name: 'ماهر المعيقلي' },
    { identifier: '5', name: 'محمود خليل الحصري' },
    { identifier: '4', name: 'محمد صديق المنشاوي' },
    { identifier: '2', name: 'أبو بكر الشاطري' },
    { identifier: '10', name: 'سعد الغامدي' },
    { identifier: '11', name: 'سعود الشريم' }
  ];
}

export async function getTafsirs(surah: number, ayah: number): Promise<Tafsir[]> {
  try {
    // Tafsir Al-Muyassar (ID: 16) and Ibn Kathir (ID: 169 - actually let's re-verify) 
    // Let's use Muyassar (16) and Jalalayn (17) from Quran.com v4
    const [muyassar, jalalayn] = await Promise.all([
      axios.get(`${QURAN_COM_API}/tafsirs/16/by_ayah/${surah}:${ayah}`),
      axios.get(`${QURAN_COM_API}/tafsirs/17/by_ayah/${surah}:${ayah}`)
    ]);

    return [
      {
        author: 'التفسير الميسر',
        content: muyassar.data.tafsir.text
      },
      {
        author: 'تفسير الجلالين',
        content: jalalayn.data.tafsir.text
      }
    ];
  } catch (error) {
    console.error('Error fetching tafsirs:', error);
    return [{ author: 'عربي', content: 'لم يتم العثور على التفسير لهذه الآية.' }];
  }
}

// --- HADITH FUNCTIONS (Arabic Library via CDN) ---

let cachedHadiths: Record<string, any> = {};

async function fetchHadithEdition(slug: string) {
  if (cachedHadiths[slug]) return cachedHadiths[slug];
  const res = await axios.get(`${HADITH_CDN}/ara-${slug}.json`);
  cachedHadiths[slug] = res.data;
  return res.data;
}

export async function getHadithBooks(): Promise<HadithBook[]> {
  // Manually curate the best Arabic editions from the CDN
  return [
    { bookName: 'صحيح البخاري', bookSlug: 'bukhari', hadiths_count: '7563', chapters_count: '97' },
    { bookName: 'صحيح مسلم', bookSlug: 'muslim', hadiths_count: '3033', chapters_count: '56' },
    { bookName: 'سنن الترمذي', bookSlug: 'tirmidhi', hadiths_count: '3956', chapters_count: '50' },
    { bookName: 'سنن أبي داود', bookSlug: 'abudawud', hadiths_count: '5274', chapters_count: '43' },
    { bookName: 'سنن النسائي', bookSlug: 'nasai', hadiths_count: '5758', chapters_count: '52' },
    { bookName: 'سنن ابن ماجه', bookSlug: 'ibnmajah', hadiths_count: '4341', chapters_count: '37' }
  ];
}

export async function getHadithChapters(bookSlug: string): Promise<HadithChapter[]> {
  // The CDN Hadith API has a simpler structure. We'll group by metadata if available 
  // or just return numbers if the structure is flat.
  // For now, because the CDN is flat, we'll return a "Browse All" or "Search" focused approach.
  return [{ chapterNumber: '1', chapterArabic: 'تصفح جميع الأحاديث' }];
}

export async function getHadiths(bookSlug: string, _chapterId: string): Promise<Hadith[]> {
  try {
    const data = await fetchHadithEdition(bookSlug);
    // Return first 100 for browsing
    return data.hadiths.slice(0, 100).map((h: any, i: number) => ({
      id: i,
      hadithNumber: h.hadithnumber?.toString() || (i + 1).toString(),
      hadithArabic: h.text,
      status: 'من المصدر',
      bookSlug: bookSlug
    }));
  } catch (err) {
    return [];
  }
}

export async function searchHadiths(query: string): Promise<Hadith[]> {
  try {
    // Search in Bukhari by default or all cached
    const data = await fetchHadithEdition('bukhari');
    const filtered = data.hadiths.filter((h: any) => h.text.includes(query)).slice(0, 50);
    return filtered.map((h: any, i: number) => ({
      id: i,
      hadithNumber: h.hadithnumber?.toString() || (i + 1).toString(),
      hadithArabic: h.text,
      status: 'صحيح',
      bookSlug: 'bukhari'
    }));
  } catch (err) {
    return [];
  }
}
