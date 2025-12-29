'use client'

import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { IconX, IconUser } from '@tabler/icons-react'
import type { Tafsir } from '@/lib/api'

interface TafsirDialogProps {
  isOpen: boolean
  onClose: () => void
  verseText: string
  tafsirs: Tafsir[]
}

export function TafsirDialog({ isOpen, onClose, verseText, tafsirs }: TafsirDialogProps) {
  const [selectedAuthor, setSelectedAuthor] = React.useState(0)

  // Reset selected author when dialog opens with new data
  React.useEffect(() => {
    if (isOpen) setSelectedAuthor(0)
  }, [isOpen, tafsirs])

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-dark/80 backdrop-blur-md z-[100] animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-3xl p-8 glass rounded-3xl border-primary/20 shadow-premium z-[101] animate-slide-up outline-none overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <Dialog.Title className="text-2xl font-bold gradient-text">التفسير والبيان</Dialog.Title>
              <p className="text-gray-500 text-sm mt-1">اختر المفسر المفضل لديك من القائمة</p>
            </div>
            <Dialog.Close className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300">
              <IconX className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar relative z-10">
            {tafsirs.map((t, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAuthor(idx)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${selectedAuthor === idx
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                  }`}
              >
                <IconUser className="w-4 h-4" />
                {t.author}
              </button>
            ))}
            {tafsirs.length === 0 && (
              <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse"></div>
            )}
          </div>

          <div className="space-y-6 relative z-10 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-2xl font-arabic leading-[2] text-light text-center">{verseText}</p>
            </div>

            <div className="p-1">
              <h4 className="text-primary font-bold mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full"></div>
                شرح الآية:
              </h4>
              <div
                className="text-lg leading-[1.8] text-gray-300 antialiased font-light prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: tafsirs[selectedAuthor]?.content || 'جاري تحميل التفسير...' }}
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary-dark transition-all duration-300 active:scale-95"
            >
              إغلاق
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}