'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MessageKey } from '@/i18n'

type CellEditorPopoverProps = {
  value: string
  displayValue: string
  editValue: string
  backgroundColor?: string
  suggestedSubjects: Array<{ raw: string; label: string }>
  onSave: (subject: string) => void
  t: (key: MessageKey) => string
}

export function CellEditorPopover({
  value,
  displayValue,
  editValue,
  backgroundColor,
  suggestedSubjects,
  onSave,
  t
}: CellEditorPopoverProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)

  const save = () => {
    onSave(draft)
    setOpen(false)
  }

  const clear = () => {
    onSave('')
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setDraft(editValue)
        }
        setOpen(nextOpen)
      }}
    >
      <PopoverTrigger asChild>
        <button
          type='button'
          className='h-16 w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border border-border px-2 text-base font-semibold transition hover:ring-2 hover:ring-ring/40 sm:h-20 sm:text-lg'
          style={{ backgroundColor: value ? backgroundColor ?? '#ffffff' : '#ffffff' }}
        >
          {displayValue || '+'}
        </button>
      </PopoverTrigger>
      <PopoverContent className='w-64 space-y-3'>
        <p className='text-sm font-semibold'>{t('subject.edit.title')}</p>
        <form
          className='space-y-3'
          onSubmit={(event) => {
            event.preventDefault()
            save()
          }}
        >
          <Input
            value={draft}
            maxLength={20}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t('subject.input.placeholder')}
          />
          <div className='flex gap-2'>
            <Button type='submit' className='flex-1'>
              {t('common.save')}
            </Button>
            <Button type='button' variant='secondary' className='flex-1' onClick={clear}>
              {t('subject.clear')}
            </Button>
          </div>
          {suggestedSubjects.length > 0 ? (
            <div className='space-y-2'>
              <p className='text-xs font-semibold text-muted-foreground'>{t('subject.suggestions')}</p>
              <div className='flex flex-wrap gap-1.5'>
                {suggestedSubjects.map((subject) => (
                  <button
                    key={subject.raw}
                    type='button'
                    className='rounded-full border bg-muted px-2 py-1 text-xs font-semibold hover:bg-muted/70'
                    onClick={() => {
                      onSave(subject.raw)
                      setOpen(false)
                    }}
                  >
                    {subject.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </form>
      </PopoverContent>
    </Popover>
  )
}
