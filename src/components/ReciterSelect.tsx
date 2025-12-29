'use client'

import React from 'react'
import * as Select from '@radix-ui/react-select'
import { IconChevronDown } from '@tabler/icons-react'
import type { Reciter } from '@/lib/api'

interface ReciterSelectProps {
  reciters: Reciter[]
  selectedReciter: string
  onReciterChange: (reciter: string) => void
}

export function ReciterSelect({ reciters, selectedReciter, onReciterChange }: ReciterSelectProps) {
  const selectedReciterName = reciters?.find(r => r.identifier === selectedReciter)?.name || 'اختر القارئ'

  return (
    <Select.Root value={selectedReciter} onValueChange={onReciterChange}>
      <Select.Trigger className="inline-flex items-center justify-between gap-4 px-6 py-3 rounded-full glass hover:bg-white/5 text-white border border-white/10 hover:border-primary/50 transition-all duration-300 min-w-[200px] outline-none group focus:ring-2 focus:ring-primary/20">
        <Select.Value aria-label={selectedReciter}>
          {selectedReciterName}
        </Select.Value>
        <Select.Icon>
          <IconChevronDown className="w-5 h-5 text-primary group-hover:translate-y-0.5 transition-transform" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content position="popper" sideOffset={8} className="overflow-hidden bg-dark-card/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-premium min-w-[240px] animate-fade-in">
          <Select.ScrollUpButton />
          <Select.Viewport className="p-2">
            {reciters?.map((reciter) => (
              <Select.Item
                key={reciter.identifier}
                value={reciter.identifier}
                className="relative flex items-center px-4 py-3 text-sm text-gray-300 rounded-xl hover:bg-primary/10 hover:text-primary cursor-pointer outline-none transition-colors data-[state=checked]:bg-primary/20 data-[state=checked]:text-primary"
              >
                <Select.ItemText>{reciter.name}</Select.ItemText>
              </Select.Item>
            ))}
            {(!reciters || reciters.length === 0) && (
              <div className="p-4 text-center text-sm text-gray-500">جاري التحميل...</div>
            )}
          </Select.Viewport>
          <Select.ScrollDownButton />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
} 