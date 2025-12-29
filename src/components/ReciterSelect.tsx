'use client'

import React from 'react'
import * as Select from '@radix-ui/react-select'
import { IconChevronDown, IconMicrophone } from '@tabler/icons-react'
import type { Reciter } from '@/lib/api'

interface ReciterSelectProps {
  reciters: Reciter[]
  selectedReciter: string
  onReciterChange: (value: string) => void
}

export function ReciterSelect({ reciters, selectedReciter, onReciterChange }: ReciterSelectProps) {
  const currentReciter = reciters?.find(r => r.identifier === selectedReciter)

  return (
    <Select.Root value={selectedReciter} onValueChange={onReciterChange}>
      <Select.Trigger
        className="flex items-center gap-3 px-6 py-3 rounded-2xl glass border-primary/20 hover:border-primary/40 focus:outline-none transition-all duration-300 group shadow-lg min-w-[240px] flex-row-reverse"
        dir="rtl"
      >
        <IconMicrophone className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
        <Select.Value>
          <span className="text-gray-200 font-medium font-arabic">
            {currentReciter?.name || 'اختر القارئ'}
          </span>
        </Select.Value>
        <Select.Icon className="mr-auto">
          <IconChevronDown className="w-4 h-4 text-gray-500" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="z-[150] overflow-hidden bg-dark-card/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
          <Select.Viewport className="p-2">
            <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white/5 text-gray-400 cursor-default">
              <IconChevronDown className="rotate-180" />
            </Select.ScrollUpButton>

            {reciters?.map((reciter) => (
              <Select.Item
                key={reciter.identifier}
                value={reciter.identifier}
                className="relative flex items-center px-8 py-3 text-sm text-gray-300 hover:text-white hover:bg-primary/20 rounded-xl cursor-pointer outline-none transition-colors data-[selected]:bg-primary data-[selected]:text-white mb-1 last:mb-0 flex-row-reverse text-right"
              >
                <Select.ItemText className="font-arabic">{reciter.name}</Select.ItemText>
              </Select.Item>
            ))}

            {(!reciters || reciters.length === 0) && (
              <div className="px-8 py-3 text-sm text-gray-500 italic text-right font-arabic">جاري تحميل القراء...</div>
            )}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
