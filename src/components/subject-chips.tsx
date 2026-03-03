'use client'

import { useRef, useState } from 'react'

import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { MessageKey } from '@/i18n'
import { getSubjectDisplayName, getSubjectDisplayNameWithEmoji, isPresetSubjectName } from '@/lib/subject-translation'
import { Lang } from '@/types/timetable'

type SubjectChipsProps = {
  lang: Lang
  subjects: string[]
  subjectColors: Record<string, string>
  onRemove: (subject: string) => void
  onColorChange: (subject: string, color: string) => void
  t: (key: MessageKey) => string
}

const createChipDragGhost = (label: string, color: string): HTMLDivElement => {
  const ghost = document.createElement('div')
  ghost.textContent = label.slice(0, 24)
  ghost.style.position = 'fixed'
  ghost.style.top = '-9999px'
  ghost.style.left = '-9999px'
  ghost.style.display = 'inline-flex'
  ghost.style.alignItems = 'center'
  ghost.style.justifyContent = 'center'
  ghost.style.padding = '8px 14px'
  ghost.style.borderRadius = '999px'
  ghost.style.border = '1px solid rgba(15, 23, 42, 0.18)'
  ghost.style.background = color
  ghost.style.color = '#111827'
  ghost.style.font = '600 14px ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif'
  ghost.style.whiteSpace = 'nowrap'
  ghost.style.pointerEvents = 'none'

  return ghost
}

export function SubjectChips({ lang, subjects, subjectColors, onRemove, onColorChange, t }: SubjectChipsProps) {
  const [pendingColors, setPendingColors] = useState<Record<string, string>>({})
  const dragGhostRef = useRef<HTMLDivElement | null>(null)

  const getDisplayColor = (subject: string): string => {
    return pendingColors[subject] ?? subjectColors[subject] ?? '#f4f4f5'
  }

  const commitPendingColor = (subject: string) => {
    const pending = pendingColors[subject]
    if (!pending) {
      return
    }

    if (pending !== subjectColors[subject]) {
      onColorChange(subject, pending)
    }

    setPendingColors((prev) => {
      const next = { ...prev }
      delete next[subject]
      return next
    })
  }

  const cleanupDragGhost = () => {
    if (dragGhostRef.current) {
      dragGhostRef.current.remove()
      dragGhostRef.current = null
    }
  }

  return (
    <Card className='rounded-2xl border-2'>
      <CardHeader>
        <CardTitle className='text-lg'>{t('subject.panel.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        {subjects.length === 0 ? (
          <p className='text-sm text-muted-foreground'>{t('subject.panel.empty')}</p>
        ) : (
          <div className='flex flex-wrap gap-2'>
            {subjects.map((subject) => {
              const color = getDisplayColor(subject)
              const displaySubject = getSubjectDisplayName(subject, lang)
              const displaySubjectWithEmoji = getSubjectDisplayNameWithEmoji(subject, lang)
              const isRemovable = !isPresetSubjectName(subject)

              return (
                <Popover key={subject}>
                  <div
                    className='group inline-flex items-center gap-1 rounded-full border px-2 py-1.5 text-sm font-semibold'
                    style={{ backgroundColor: color }}
                    draggable
                    onDragStart={(event) => {
                      cleanupDragGhost()
                      event.dataTransfer.setData('application/x-timetable-subject', subject)
                      event.dataTransfer.setData('text/plain', displaySubjectWithEmoji)
                      event.dataTransfer.effectAllowed = 'copy'
                      const dragGhost = createChipDragGhost(displaySubjectWithEmoji, color)
                      document.body.appendChild(dragGhost)
                      dragGhostRef.current = dragGhost
                      event.dataTransfer.setDragImage(dragGhost, dragGhost.offsetWidth / 2, dragGhost.offsetHeight / 2)
                    }}
                    onDragEnd={cleanupDragGhost}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type='button'
                        className='rounded-full px-2 py-1 hover:bg-white/40'
                        aria-label={`${displaySubject} color`}
                      >
                        {displaySubjectWithEmoji}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className='w-52 space-y-2'>
                      <p className='text-sm font-semibold'>{displaySubjectWithEmoji}</p>
                      <input
                        type='color'
                        value={color}
                        onChange={(event) => {
                          const nextColor = event.target.value
                          setPendingColors((prev) => ({
                            ...prev,
                            [subject]: nextColor
                          }))
                        }}
                        onPointerUp={() => commitPendingColor(subject)}
                        onBlur={() => commitPendingColor(subject)}
                        className='h-10 w-full cursor-pointer rounded-md border border-input'
                      />
                    </PopoverContent>
                    {isRemovable ? (
                      <Button
                        type='button'
                        size='icon'
                        variant='ghost'
                        className='h-6 w-6 rounded-full opacity-70 hover:opacity-100'
                        onClick={(event) => {
                          event.stopPropagation()
                          onRemove(subject)
                        }}
                        aria-label={`${displaySubject} delete`}
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    ) : null}
                  </div>
                </Popover>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
