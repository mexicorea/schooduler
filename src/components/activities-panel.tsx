'use client'

import { useMemo, useState } from 'react'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageKey } from '@/i18n'
import { parseTimeToMinutes } from '@/lib/time-calc'
import { ActivityItem, Weekday, WEEKDAYS } from '@/types/timetable'

type ActivitiesPanelProps = {
  activities: ActivityItem[]
  onAddActivity: (input: Omit<ActivityItem, 'id'>) => void
  onRemoveActivity: (id: string) => void
  t: (key: MessageKey) => string
}

const weekdayMessageKey: Record<Weekday, MessageKey> = {
  mon: 'day.mon',
  tue: 'day.tue',
  wed: 'day.wed',
  thu: 'day.thu',
  fri: 'day.fri'
}

export function ActivitiesPanel({ activities, onAddActivity, onRemoveActivity, t }: ActivitiesPanelProps) {
  const [title, setTitle] = useState('')
  const [weekday, setWeekday] = useState<Weekday>('mon')
  const [startTime, setStartTime] = useState('14:40')
  const [endTime, setEndTime] = useState('16:00')

  const isTimeRangeValid = useMemo(() => {
    const startMinutes = parseTimeToMinutes(startTime)
    const endMinutes = parseTimeToMinutes(endTime)

    if (startMinutes === null || endMinutes === null) {
      return false
    }

    return endMinutes > startMinutes
  }, [startTime, endTime])

  const normalizedTitle = title.trim()
  const isTitleValid = normalizedTitle.length > 0

  const addActivity = () => {
    if (!isTimeRangeValid || !isTitleValid) {
      return
    }

    onAddActivity({
      title: normalizedTitle,
      weekday,
      startTime,
      endTime
    })

    setTitle('')
  }

  return (
    <Card className='rounded-2xl border-2'>
      <CardHeader>
        <CardTitle className='text-lg'>{t('activity.panel.title')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div>
          <label className='mb-1 block text-sm font-semibold'>{t('activity.title')}</label>
          <Input value={title} maxLength={30} onChange={(event) => setTitle(event.target.value)} />
        </div>

        <div>
          <label className='mb-1 block text-sm font-semibold'>{t('activity.day')}</label>
          <Select value={weekday} onValueChange={(value) => setWeekday(value as Weekday)}>
            <SelectTrigger className='w-full bg-white'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WEEKDAYS.map((day) => (
                <SelectItem key={day} value={day}>
                  {t(weekdayMessageKey[day])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='mb-1 block text-sm font-semibold'>{t('activity.startTime')}</label>
          <Input type='time' value={startTime} onChange={(event) => setStartTime(event.target.value)} />
        </div>

        <div>
          <label className='mb-1 block text-sm font-semibold'>{t('activity.endTime')}</label>
          <Input type='time' value={endTime} onChange={(event) => setEndTime(event.target.value)} />
        </div>

        {!isTitleValid ? <p className='text-xs font-semibold text-destructive'>{t('activity.titleError')}</p> : null}
        {!isTimeRangeValid ? <p className='text-xs font-semibold text-destructive'>{t('activity.timeError')}</p> : null}

        <Button type='button' className='w-full' disabled={!isTimeRangeValid || !isTitleValid} onClick={addActivity}>
          {t('activity.add')}
        </Button>

        <div className='space-y-2'>
          {activities.length === 0 ? (
            <p className='text-sm text-muted-foreground'>{t('activity.empty')}</p>
          ) : (
            activities.map((activity) => {
              return (
                <div key={activity.id} className='rounded-lg border bg-muted/40 p-2'>
                  <div className='flex items-start justify-between gap-2'>
                    <p className='text-sm font-semibold'>{activity.title}</p>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      className='h-7 w-7 shrink-0'
                      onClick={() => onRemoveActivity(activity.id)}
                      aria-label={`${activity.title} ${t('common.delete')}`}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    {t(weekdayMessageKey[activity.weekday])} {activity.startTime} - {activity.endTime}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
