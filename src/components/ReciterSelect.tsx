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
  return (
    <Select.Root value={selectedReciter} onValueChange={onReciterChange}>
      <Select.Trigger className="inline-flex items-center justify-between gap-2 px-4 py-2 rounded-lg bg-dark-card text-white border border-white/10 hover:border-white/20 transition-colors">
        <Select.Value />
        <Select.Icon>
          <IconChevronDown className="w-4 h-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="overflow-hidden bg-dark-card rounded-lg border border-white/10">
          <Select.ScrollUpButton />
          <Select.Viewport>
            {reciters.map((reciter) => (
              <Select.Item
                key={reciter.identifier}
                value={reciter.identifier}
                className="relative flex items-center px-8 py-2 text-sm text-white hover:bg-white/5 cursor-pointer outline-none"
              >
                <Select.ItemText>{reciter.name}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
} 