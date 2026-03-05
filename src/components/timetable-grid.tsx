'use client'

import { CellEditorPopover } from '@/components/cell-editor-popover'
import { createCellKey } from '@/lib/default-state'
import { getSubjectDisplayName } from '@/lib/subject-translation'
import { buildTableRows } from '@/lib/time-calc'
import { MessageKey } from '@/i18n'
import { Period, TimeConfig, TimetableCells, Weekday, WEEKDAYS } from '@/types/timetable'

type TimetableGridProps = {
  lang: 'ko' | 'en'
  cells: TimetableCells
  subjects: string[]
  subjectColors: Record<string, string>
  timeConfig: TimeConfig
  onSaveCell: (weekday: Weekday, period: Period, subject: string) => void
  t: (key: MessageKey) => string
}

const weekdayMessageKey: Record<Weekday, MessageKey> = {
  mon: 'day.mon',
  tue: 'day.tue',
  wed: 'day.wed',
  thu: 'day.thu',
  fri: 'day.fri'
}

export function TimetableGrid({
  lang,
  cells,
  subjects,
  subjectColors,
  timeConfig,
  onSaveCell,
  t
}: TimetableGridProps) {
  const rows = buildTableRows(timeConfig)

  return (
    <div className='print-timetable-grid overflow-x-auto rounded-2xl border-2 bg-white/90 shadow-sm'>
      <table className='print-timetable-table w-full min-w-[760px] table-fixed border-collapse'>
        <colgroup>
          <col className='w-[210px]' />
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr className='bg-slate-100'>
            <th className='border-b border-r px-3 py-4 text-center text-base font-extrabold'>{t('table.time')}</th>
            {WEEKDAYS.map((day) => (
              <th key={day} className='border-b border-r px-3 py-4 text-center text-base font-bold last:border-r-0 sm:text-lg'>
                {t(weekdayMessageKey[day])}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            if (row.type === 'lunch') {
              return (
                <tr key={`lunch-${row.start}`} className='bg-amber-100/80'>
                  <td className='border-r border-t px-2 py-3 text-center text-base font-bold'>
                    {row.start} - {row.end}
                  </td>
                  <td colSpan={5} className='border-t px-2 py-3 text-center text-base font-extrabold text-amber-900 sm:text-lg'>
                    {t('table.lunch')}
                  </td>
                </tr>
              )
            }

            return (
              <tr key={`period-${row.period}`}>
                <td className='border-r border-t px-2 py-3 text-center text-zinc-700'>
                  <div className='text-base font-extrabold'>
                    {lang === 'ko' ? `${row.period}${t('period.label')}` : `${t('period.label')} ${row.period}`}
                  </div>
                  <div className='text-sm font-bold'>
                    {row.start} - {row.end}
                  </div>
                </td>
                {WEEKDAYS.map((weekday) => {
                  const key = createCellKey(weekday, row.period)
                  const subject = cells[key]
                  const suggestedSubjects = subjects
                    .filter((item) => item !== subject)
                    .map((item) => ({
                      raw: item,
                      label: getSubjectDisplayName(item, lang)
                    }))
                  const displaySubject = getSubjectDisplayName(subject, lang)

                  return (
                    <td
                      key={key}
                      className='border-r border-t p-2 align-middle last:border-r-0'
                      onDragOver={(event) => {
                        event.preventDefault()
                      }}
                      onDrop={(event) => {
                        event.preventDefault()
                        const droppedSubject =
                          event.dataTransfer.getData('application/x-timetable-subject') ||
                          event.dataTransfer.getData('text/plain')
                        if (droppedSubject.trim()) {
                          onSaveCell(weekday, row.period, droppedSubject.trim())
                        }
                      }}
                    >
                      <CellEditorPopover
                        value={subject}
                        displayValue={displaySubject}
                        editValue={displaySubject}
                        backgroundColor={subject ? subjectColors[subject] : undefined}
                        suggestedSubjects={suggestedSubjects}
                        onSave={(value) => onSaveCell(weekday, row.period, value)}
                        t={t}
                      />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
