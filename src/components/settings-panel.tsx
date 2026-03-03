'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageKey } from '@/i18n'
import { LUNCH_AFTER_PERIODS, TimeConfig } from '@/types/timetable'

type SettingsPanelProps = {
  lang: 'ko' | 'en'
  timeConfig: TimeConfig
  onTimeNumberChange: (field: 'classMinutes' | 'breakMinutes' | 'lunchAfterPeriod' | 'lunchMinutes', value: number) => void
  onTimeValueChange: (field: 'firstPeriodStart', value: string) => void
  t: (key: MessageKey) => string
}

const toNumber = (value: string): number => {
  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

export function SettingsPanel({
  lang,
  timeConfig,
  onTimeNumberChange,
  onTimeValueChange,
  t
}: SettingsPanelProps) {
  const formatLunchBetweenLabel = (afterPeriod: number): string => {
    if (lang === 'ko') {
      return `${afterPeriod}교시와 ${afterPeriod + 1}교시 사이`
    }

    return `Between period ${afterPeriod} and ${afterPeriod + 1}`
  }

  return (
    <div className='space-y-4'>
      <Card className='rounded-2xl border-2'>
        <CardHeader>
          <CardTitle className='text-lg'>{t('settings.time.title')}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <label className='mb-1 block text-sm font-semibold'>{t('settings.firstPeriodStart')}</label>
            <Input
              type='time'
              value={timeConfig.firstPeriodStart}
              onChange={(event) => onTimeValueChange('firstPeriodStart', event.target.value)}
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-semibold'>{t('settings.classMinutes')}</label>
            <Input
              type='number'
              min={1}
              max={180}
              value={timeConfig.classMinutes}
              onChange={(event) => onTimeNumberChange('classMinutes', toNumber(event.target.value))}
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-semibold'>{t('settings.breakMinutes')}</label>
            <Input
              type='number'
              min={0}
              max={120}
              value={timeConfig.breakMinutes}
              onChange={(event) => onTimeNumberChange('breakMinutes', toNumber(event.target.value))}
            />
          </div>
          <div>
            <label className='mb-1 block text-sm font-semibold'>{t('settings.lunchBetweenPeriods')}</label>
            <Select
              value={String(timeConfig.lunchAfterPeriod)}
              onValueChange={(value) => onTimeNumberChange('lunchAfterPeriod', toNumber(value))}
            >
              <SelectTrigger className='w-full bg-white'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LUNCH_AFTER_PERIODS.map((afterPeriod) => (
                  <SelectItem key={afterPeriod} value={String(afterPeriod)}>
                    {formatLunchBetweenLabel(afterPeriod)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className='mb-1 block text-sm font-semibold'>{t('settings.lunchMinutes')}</label>
            <Input
              type='number'
              min={1}
              max={180}
              value={timeConfig.lunchMinutes}
              onChange={(event) => onTimeNumberChange('lunchMinutes', toNumber(event.target.value))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
