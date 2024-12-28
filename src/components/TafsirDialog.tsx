'use client'

import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { IconX } from '@tabler/icons-react'

interface TafsirDialogProps {
  isOpen: boolean
  onClose: () => void
  verseText: string
  tafsir: string
}

export function TafsirDialog({ isOpen, onClose, verseText, tafsir }: TafsirDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl p-6 bg-dark-card rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-bold">التفسير</Dialog.Title>
            <Dialog.Close className="p-2 rounded-full hover:bg-white/5">
              <IconX className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-dark/50 border border-white/10">
              <p className="text-lg font-arabic leading-loose">{verseText}</p>
            </div>

            <div className="p-4 rounded-lg bg-dark/50 border border-white/10">
              <p className="text-lg leading-loose">{tafsir}</p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
} 