import axios from 'axios'

const quranApi = axios.create({
  baseURL: 'https://api.alquran.cloud/v1'
})

const hadithApi = axios.create({
  baseURL: 'https://api.sunnah.com/v1'
})

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
  juz: number
  page: number
}

export interface Reciter {
  identifier: string
  name: string
  englishName: string
}

export interface Hadith {
  number: number
  arab: string
  id: string
  text: string
}

export async function getSurahs() {
  const response = await quranApi.get('/surah')
  return response.data.data as Surah[]
}

export async function getSurah(number: number) {
  const response = await quranApi.get(`/surah/${number}`)
  return response.data.data as Surah & { verses: Verse[] }
}

export async function getReciters() {
  const response = await quranApi.get('/edition/format/audio')
  return response.data.data as Reciter[]
}

export async function getRecitation(identifier: string, surah: number) {
  const response = await quranApi.get(`/surah/${surah}/${identifier}`)
  return response.data.data.audioUrl as string
}

export async function getTafsir(surah: number, ayah: number) {
  const response = await quranApi.get(`/ayah/${surah}:${ayah}/ar.muyassar`)
  return response.data.data.text as string
}

export async function getFortyHadith() {
  const response = await hadithApi.get('/collections/nawawi40', {
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_HADITH_API_KEY
    }
  })
  return response.data.data as Hadith[]
} 