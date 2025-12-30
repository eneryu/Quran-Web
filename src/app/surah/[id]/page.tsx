'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { ReciterSelect } from '@/components/ReciterSelect'
import { getSurahData, getTafsirs } from '@/lib/api'
import type { Verse, Reciter, Tafsir, Surah } from '@/lib/api'
import { IconX, IconUser, IconPlayerPlay, IconPlayerPause, IconBook, IconAlertCircle, IconPlayerSkipBack, IconPlayerSkipForward, IconVolume } from '@tabler/icons-react'

interface SurahPageProps {
    params: Promise<{
        id: string
    }>
}

export default function SurahPage({ params }: SurahPageProps) {
    const { id } = React.use(params)
    const [verses, setVerses] = React.useState<Verse[]>([])
    const [surah, setSurah] = React.useState<Surah | null>(null)
    const [reciters, setReciters] = React.useState<Reciter[]>([])
    const [selectedReciter, setSelectedReciter] = React.useState<string>('')
    const [selectedVerse, setSelectedVerse] = React.useState<Verse | null>(null)
    const [tafsirs, setTafsirs] = React.useState<Tafsir[]>([])
    const [selectedTafsirIdx, setSelectedTafsirIdx] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(true)
    const [isLoadingTafsir, setIsLoadingTafsir] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    // Audio state
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [currentTime, setCurrentTime] = React.useState(0)
    const [duration, setDuration] = React.useState(0)
    const audioRef = React.useRef<HTMLAudioElement>(null)

    // Initial Load
    React.useEffect(() => {
        let isMounted = true;

        getSurahData(parseInt(id))
            .then((data) => {
                if (isMounted) {
                    setSurah(data.metadata)
                    setVerses(data.verses)
                    setReciters(data.reciters)
                    if (data.reciters.length > 0) {
                        setSelectedReciter(data.reciters[0].id)
                    }
                    setIsLoading(false)
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error(err)
                    setError('عذراً، حدث خطأ أثناء تحميل السورة. يرجى المحاولة مرة أخرى.')
                    setIsLoading(false)
                }
            })

        return () => { isMounted = false }
    }, [id])

    // Audio event handlers
    React.useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleDurationChange = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, []);

    const currentReciter = reciters.find(r => r.id === selectedReciter);

    const handleVerseClick = async (verse: Verse) => {
        setSelectedVerse(verse)
        setSelectedTafsirIdx(0)
        setIsLoadingTafsir(true)
        try {
            const data = await getTafsirs(parseInt(id), verse.numberInSurah)
            setTafsirs(data)
        } finally {
            setIsLoadingTafsir(false)
        }
    }

    const togglePlayPause = () => {
        if (!audioRef.current || !currentReciter?.url) return;

        if (audioRef.current.src !== currentReciter.url) {
            audioRef.current.src = currentReciter.url;
        }

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime = parseFloat(e.target.value);
    }

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    const stopAudio = () => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-dark" dir="rtl">
            <Header />

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content Area: Verses List */}
                <div
                    className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-500 ${selectedVerse ? 'lg:w-3/5' : 'w-full'}`}
                >
                    <div className="container mx-auto px-4 py-8">
                        {error ? (
                            <div className="max-w-xl mx-auto glass p-8 rounded-3xl text-center border-red-500/20">
                                <IconAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold font-arabic mb-2">تعذر التحميل</h3>
                                <p className="text-gray-400 font-arabic mb-6">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-2 rounded-xl bg-primary text-white font-arabic font-bold"
                                >
                                    إعادة المحاولة
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="glass p-6 rounded-2xl mb-8 flex flex-wrap items-center justify-between gap-4">
                                    <div className="text-right">
                                        {isLoading ? (
                                            <div className="space-y-2">
                                                <div className="h-8 w-32 bg-white/5 animate-pulse rounded-lg"></div>
                                                <div className="h-4 w-24 bg-white/5 animate-pulse rounded-lg"></div>
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-3xl font-bold font-arabic text-primary">{surah?.name}</h2>
                                                <p className="text-gray-500 text-sm font-arabic">{surah?.englishNameTranslation} • {surah?.numberOfAyahs} آية</p>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <ReciterSelect
                                            reciters={reciters || []}
                                            selectedReciter={selectedReciter}
                                            onReciterChange={setSelectedReciter}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 mx-auto">
                                    {verses?.map((verse) => (
                                        <div
                                            key={verse.number}
                                            onClick={() => handleVerseClick(verse)}
                                            className={`verse-card group relative ${selectedVerse?.number === verse.number ? 'bg-primary/10 border-primary ring-1 ring-primary/20 shadow-lg shadow-primary/5' : 'border-transparent'}`}
                                        >
                                            <div className="flex gap-6 items-start">
                                                <span className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${selectedVerse?.number === verse.number ? 'bg-primary text-white' : 'bg-white/5 text-gray-500 group-hover:bg-primary/20 group-hover:text-primary'}`}>
                                                    {verse.numberInSurah}
                                                </span>
                                                <p className={`flex-1 text-2xl md:text-3xl font-arabic leading-[2] text-right antialiased transition-colors ${selectedVerse?.number === verse.number ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                                    {verse.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {(isLoading || verses.length === 0) && !error && Array(10).fill(0).map((_, i) => (
                                        <div key={i} className="h-24 glass rounded-xl animate-pulse"></div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Sidebar: Tafsir Details */}
                <aside
                    className={`fixed lg:relative top-0 left-0 h-full lg:h-auto z-[60] lg:z-auto transition-all duration-500 ease-in-out border-l border-white/5 glass shadow-2xl overflow-hidden ${selectedVerse ? 'w-full lg:w-[40%] visible opacity-100 translate-x-0' : 'w-0 invisible opacity-0 -translate-x-full'
                        }`}
                >
                    {selectedVerse && (
                        <div className="h-full flex flex-col bg-dark/95 backdrop-blur-3xl">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <IconBook className="w-5 h-5" />
                                    </div>
                                    <div className="text-right">
                                        <h3 className="font-bold text-lg font-arabic">التفسير والبيان</h3>
                                        <p className="text-xs text-gray-500 font-arabic">الآية {selectedVerse.numberInSurah} من سورة {surah?.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedVerse(null)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 transition-all font-arabic"
                                >
                                    <IconX className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                    <p className="text-2xl font-arabic leading-[2.2] text-light text-center">{selectedVerse.text}</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block text-right font-arabic">اختر المفسر:</label>
                                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                        {tafsirs?.map((t, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedTafsirIdx(idx)}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 font-arabic ${selectedTafsirIdx === idx
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                <IconUser className="w-4 h-4" />
                                                {t.author}
                                            </button>
                                        ))}
                                        {isLoadingTafsir && Array(2).fill(0).map((_, i) => (
                                            <div key={i} className="h-10 w-24 bg-white/5 rounded-xl animate-pulse"></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-primary font-bold flex items-center gap-2 text-right font-arabic">
                                        <div className="w-1 h-4 bg-primary rounded-full"></div>
                                        شرح الآية:
                                    </h4>
                                    {isLoadingTafsir ? (
                                        <div className="space-y-3">
                                            <div className="h-4 bg-white/5 rounded w-full animate-pulse"></div>
                                            <div className="h-4 bg-white/5 rounded w-4/5 animate-pulse"></div>
                                            <div className="h-4 bg-white/5 rounded w-full animate-pulse"></div>
                                        </div>
                                    ) : (
                                        <div
                                            className="text-lg leading-[1.8] text-gray-300 antialiased font-light font-arabic text-right selection:bg-primary/30 prose prose-invert max-w-none prose-headings:text-primary prose-headings:font-arabic prose-p:text-gray-300"
                                            dangerouslySetInnerHTML={{ __html: tafsirs[selectedTafsirIdx]?.content || 'جاري التحميل...' }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {/* Spotify-style Audio Player Footer */}
            {currentReciter?.url && (
                <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 backdrop-blur-xl bg-dark/90">
                    <div className="container mx-auto px-4 py-3">
                        <div className="flex items-center gap-6">
                            {/* Track Info */}
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                                    <IconBook className="w-6 h-6" />
                                </div>
                                <div className="text-right overflow-hidden">
                                    <p className="font-arabic font-bold text-white truncate">{surah?.name}</p>
                                    <p className="font-arabic text-xs text-gray-400 truncate">{currentReciter?.name}</p>
                                </div>
                            </div>

                            {/* Player Controls */}
                            <div className="flex-1 flex flex-col items-center gap-2">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={togglePlayPause}
                                        className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
                                    >
                                        {isPlaying ? <IconPlayerPause className="w-6 h-6" /> : <IconPlayerPlay className="w-6 h-6 mr-[-2px]" />}
                                    </button>
                                </div>

                                {/* Progress Bar */}
                                <div className="flex items-center gap-3 w-full max-w-xl">
                                    <span className="text-xs text-gray-500 w-10 text-left">{formatTime(currentTime)}</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration || 0}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                                    />
                                    <span className="text-xs text-gray-500 w-10 text-right">{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Volume / Close */}
                            <div className="flex items-center gap-3 min-w-[100px] justify-end">
                                <IconVolume className="w-5 h-5 text-gray-400" />
                                <button
                                    onClick={stopAudio}
                                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-all"
                                >
                                    <IconX className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <audio ref={audioRef} />
                </div>
            )}
        </div>
    )
}
