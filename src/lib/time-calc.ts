import { LUNCH_AFTER_PERIODS, PERIODS, TableRow, TimeConfig } from '@/types/timetable'

type PeriodSlot = {
  period: (typeof PERIODS)[number]
  startMinutes: number
  endMinutes: number
}

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/

export const parseTimeToMinutes = (value: string): number | null => {
  const match = value.match(TIME_REGEX)

  if (!match) {
    return null
  }

  return Number(match[1]) * 60 + Number(match[2])
}

export const formatMinutesToTime = (minutes: number): string => {
  const safe = ((minutes % 1440) + 1440) % 1440
  const hour = Math.floor(safe / 60)
  const minute = safe % 60

  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

const clampMinutes = (value: number, minimum: number, maximum: number): number => {
  return Math.max(minimum, Math.min(maximum, value))
}

const clampLunchAfterPeriod = (value: number): number => {
  return Math.max(LUNCH_AFTER_PERIODS[0], Math.min(LUNCH_AFTER_PERIODS[LUNCH_AFTER_PERIODS.length - 1], value))
}

export const buildPeriodSlots = (config: TimeConfig): PeriodSlot[] => {
  const firstStart = parseTimeToMinutes(config.firstPeriodStart) ?? 9 * 60
  const classMinutes = clampMinutes(config.classMinutes, 1, 180)
  const breakMinutes = clampMinutes(config.breakMinutes, 0, 120)
  const lunchMinutes = clampMinutes(config.lunchMinutes, 1, 180)
  const lunchAfterPeriod = clampLunchAfterPeriod(config.lunchAfterPeriod)

  let currentStart = firstStart

  return PERIODS.map((period, index) => {
    const startMinutes = currentStart
    const endMinutes = startMinutes + classMinutes

    if (index < PERIODS.length - 1) {
      currentStart = endMinutes + (period === lunchAfterPeriod ? lunchMinutes : breakMinutes)
    }

    return {
      period,
      startMinutes,
      endMinutes
    }
  })
}

export const buildTableRows = (config: TimeConfig): TableRow[] => {
  const slots = buildPeriodSlots(config)
  const lunchAfterPeriod = clampLunchAfterPeriod(config.lunchAfterPeriod)
  const lunchMinutes = clampMinutes(config.lunchMinutes, 1, 180)

  const periodRows: TableRow[] = slots.map((slot) => ({
    type: 'period',
    period: slot.period,
    label: `${slot.period}`,
    start: formatMinutesToTime(slot.startMinutes),
    end: formatMinutesToTime(slot.endMinutes)
  }))

  const lunchTargetSlot = slots.find((slot) => slot.period === lunchAfterPeriod)
  if (!lunchTargetSlot) {
    return [...periodRows]
  }

  const lunchStart = lunchTargetSlot.endMinutes
  const lunchEnd = lunchStart + lunchMinutes
  const insertionIndex = slots.findIndex((slot) => slot.period === lunchTargetSlot.period) + 1

  const rows = [...periodRows]
  rows.splice(insertionIndex, 0, {
    type: 'lunch',
    label: 'Lunch',
    start: formatMinutesToTime(lunchStart),
    end: formatMinutesToTime(lunchEnd)
  })

  return rows
}
