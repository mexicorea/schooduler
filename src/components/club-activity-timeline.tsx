'use client'

import { MessageKey } from '@/i18n'
import { parseTimeToMinutes } from '@/lib/time-calc'
import { ActivityItem, Weekday, WEEKDAYS } from '@/types/timetable'

type ClubActivityTimelineProps = {
  activities: ActivityItem[]
  t: (key: MessageKey) => string
}

const weekdayMessageKey: Record<Weekday, MessageKey> = {
  mon: 'day.mon',
  tue: 'day.tue',
  wed: 'day.wed',
  thu: 'day.thu',
  fri: 'day.fri'
}

const TIMELINE_DEFAULT_START = 14 * 60 + 40
const TIMELINE_DEFAULT_END = 18 * 60
const SLOT_MINUTES = 10
const SLOT_HEIGHT = 16

const floorToSlot = (minutes: number): number => {
  return Math.floor(minutes / SLOT_MINUTES) * SLOT_MINUTES
}

const ceilToSlot = (minutes: number): number => {
  return Math.ceil(minutes / SLOT_MINUTES) * SLOT_MINUTES
}

const formatTime = (minutes: number): string => {
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

export function ClubActivityTimeline({ activities, t }: ClubActivityTimelineProps) {
  const validActivities = activities
    .map((activity) => {
      const start = parseTimeToMinutes(activity.startTime)
      const end = parseTimeToMinutes(activity.endTime)

      if (start === null || end === null || end <= start) {
        return null
      }

      return {
        ...activity,
        start,
        end
      }
    })
    .filter((activity): activity is NonNullable<typeof activity> => Boolean(activity))

  const earliest = validActivities.length > 0 ? Math.min(...validActivities.map((activity) => activity.start)) : TIMELINE_DEFAULT_START
  const latest = validActivities.length > 0 ? Math.max(...validActivities.map((activity) => activity.end)) : TIMELINE_DEFAULT_END

  const timelineStart = Math.min(TIMELINE_DEFAULT_START, floorToSlot(earliest))
  const timelineEnd = Math.max(TIMELINE_DEFAULT_END, ceilToSlot(latest))

  const totalSlots = Math.max(1, Math.floor((timelineEnd - timelineStart) / SLOT_MINUTES))
  const totalHeight = totalSlots * SLOT_HEIGHT

  const lineMinutes = Array.from({ length: totalSlots + 1 }, (_, index) => timelineStart + index * SLOT_MINUTES)
  const timeMarks = lineMinutes.filter((minutes) => minutes % 60 === 0 || minutes === timelineStart || minutes === timelineEnd)

  const activitiesByDay = WEEKDAYS.reduce<Record<Weekday, typeof validActivities>>((acc, weekday) => {
    acc[weekday] = validActivities
      .filter((activity) => activity.weekday === weekday)
      .sort((a, b) => a.start - b.start || a.end - b.end)

    return acc
  }, {} as Record<Weekday, typeof validActivities>)

  return (
    <div className='space-y-2'>
      <h3 className='print-hide-subtitle px-1 text-lg font-bold'>{t('activity.timeline.title')}</h3>
      <div className='print-timeline-grid overflow-x-auto rounded-2xl border-2 bg-white/90 shadow-sm'>
        <div className='print-timeline-inner min-w-[760px] overflow-hidden'>
          <div className='grid grid-cols-[210px_repeat(5,minmax(0,1fr))] border-b bg-slate-100'>
            <div className='border-r px-2 py-3 text-center text-base font-extrabold'>{t('table.time')}</div>
            {WEEKDAYS.map((weekday) => (
              <div key={weekday} className='border-r px-2 py-3 text-center text-base font-bold last:border-r-0'>
                {t(weekdayMessageKey[weekday])}
              </div>
            ))}
          </div>

          <div className='grid grid-cols-[210px_repeat(5,minmax(0,1fr))] bg-white'>
            <div className='relative border-r bg-slate-50'>
              <div style={{ height: `${totalHeight}px` }}>
                {timeMarks.map((minutes) => {
                  const top = ((minutes - timelineStart) / SLOT_MINUTES) * SLOT_HEIGHT

                  return (
                    <div
                      key={`label-${minutes}`}
                      className='absolute left-0 right-0 -translate-y-1/2 px-2 text-center text-sm font-bold text-zinc-700'
                      style={{ top }}
                    >
                      {formatTime(minutes)}
                    </div>
                  )
                })}
              </div>
            </div>

            {WEEKDAYS.map((weekday) => (
              <div key={weekday} className='relative border-r last:border-r-0' style={{ height: `${totalHeight}px` }}>
                {lineMinutes.map((minutes) => {
                  const top = ((minutes - timelineStart) / SLOT_MINUTES) * SLOT_HEIGHT
                  const isHourMark = minutes % 60 === 0

                  return (
                    <div
                      key={`${weekday}-line-${minutes}`}
                      className={isHourMark ? 'absolute left-0 right-0 border-t border-zinc-300' : 'absolute left-0 right-0 border-t border-zinc-100'}
                      style={{ top }}
                    />
                  )
                })}

                {activitiesByDay[weekday].map((activity) => {
                  const top = ((activity.start - timelineStart) / SLOT_MINUTES) * SLOT_HEIGHT
                  const rawHeight = ((activity.end - activity.start) / SLOT_MINUTES) * SLOT_HEIGHT
                  const height = Math.max(28, rawHeight - 4)

                  return (
                    <div
                      key={activity.id}
                      className='absolute left-2 right-2 flex items-center justify-center rounded-xl border border-cyan-400 bg-cyan-200 px-2 text-center text-sm font-semibold text-cyan-900 shadow-sm'
                      style={{ top: top + 2, height }}
                    >
                      {activity.title}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
