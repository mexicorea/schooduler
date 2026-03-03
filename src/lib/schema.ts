import { z } from 'zod'

import { createCellKey, createInitialAppState } from '@/lib/default-state'
import { cleanupSubjectColors } from '@/lib/pastel-color'
import { canonicalizeSubjectName } from '@/lib/subject-translation'
import { parseTimeToMinutes } from '@/lib/time-calc'
import { AppState, PERIODS, WEEKDAYS } from '@/types/timetable'

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/

const clamp = (value: number, minimum: number, maximum: number): number => {
  return Math.max(minimum, Math.min(maximum, value))
}

const inferLunchAfterPeriod = (
  firstPeriodStart: string,
  classMinutes: number,
  breakMinutes: number,
  lunchStart: string
): number | null => {
  const firstStart = parseTimeToMinutes(firstPeriodStart)
  const lunchStartMinutes = parseTimeToMinutes(lunchStart)

  if (firstStart === null || lunchStartMinutes === null) {
    return null
  }

  let currentStart = firstStart

  for (let period = 1; period <= 5; period += 1) {
    const end = currentStart + classMinutes
    const nextStart = end + breakMinutes

    if (lunchStartMinutes >= end && lunchStartMinutes <= nextStart) {
      return period
    }

    currentStart = nextStart
  }

  return null
}

const importSchema = z.object({
  lang: z.enum(['ko', 'en']).optional(),
  timetableTitle: z.string().optional(),
  studentInfo: z
    .object({
      schoolName: z.string().optional(),
      grade: z.string().optional(),
      className: z.string().optional(),
      studentNumber: z.string().optional(),
      studentName: z.string().optional()
    })
    .optional(),
  timeConfig: z
    .object({
      firstPeriodStart: z.string().regex(timePattern).optional(),
      classMinutes: z.number().int().min(1).max(180).optional(),
      breakMinutes: z.number().int().min(0).max(120).optional(),
      lunchAfterPeriod: z.number().int().min(1).max(5).optional(),
      lunchMinutes: z.number().int().min(1).max(180).optional(),
      lunchStart: z.string().regex(timePattern).optional(),
      lunchEnd: z.string().regex(timePattern).optional()
    })
    .optional(),
  cells: z.record(z.string(), z.string()).optional(),
  subjectColors: z.record(z.string(), z.string()).optional(),
  activities: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().optional(),
        weekday: z.enum(['mon', 'tue', 'wed', 'thu', 'fri']),
        startTime: z.string().regex(timePattern),
        endTime: z.string().regex(timePattern)
      })
    )
    .optional(),
  version: z.number().optional()
})

export const parseImportedState = (raw: unknown): AppState => {
  const parsed = importSchema.parse(raw)
  const initial = createInitialAppState()

  const cells = { ...initial.cells }

  if (parsed.cells) {
    for (const weekday of WEEKDAYS) {
      for (const period of PERIODS) {
        const key = createCellKey(weekday, period)
        const subject = parsed.cells[key]

        if (typeof subject === 'string') {
          cells[key] = canonicalizeSubjectName(subject)
        }
      }
    }
  }

  const canonicalSubjectColors = Object.entries(parsed.subjectColors ?? {}).reduce<Record<string, string>>((acc, [subject, color]) => {
    const canonical = canonicalizeSubjectName(subject)

    if (canonical && !acc[canonical]) {
      acc[canonical] = color
    }

    return acc
  }, {})

  const firstPeriodStart = parsed.timeConfig?.firstPeriodStart ?? initial.timeConfig.firstPeriodStart
  const classMinutes = parsed.timeConfig?.classMinutes ?? initial.timeConfig.classMinutes
  const breakMinutes = parsed.timeConfig?.breakMinutes ?? initial.timeConfig.breakMinutes

  let lunchAfterPeriod = parsed.timeConfig?.lunchAfterPeriod ?? initial.timeConfig.lunchAfterPeriod
  let lunchMinutes = parsed.timeConfig?.lunchMinutes ?? initial.timeConfig.lunchMinutes

  const legacyLunchStart = parsed.timeConfig?.lunchStart
  const legacyLunchEnd = parsed.timeConfig?.lunchEnd

  if (legacyLunchStart && legacyLunchEnd) {
    const startMinutes = parseTimeToMinutes(legacyLunchStart)
    const endMinutes = parseTimeToMinutes(legacyLunchEnd)

    if (startMinutes !== null && endMinutes !== null && endMinutes > startMinutes) {
      lunchMinutes = clamp(endMinutes - startMinutes, 1, 180)
    }

    const inferred = inferLunchAfterPeriod(firstPeriodStart, classMinutes, breakMinutes, legacyLunchStart)
    if (inferred !== null) {
      lunchAfterPeriod = inferred
    }
  }

  const activities =
    parsed.activities?.flatMap((activity, index) => {
      const normalizedTitle = activity.title?.trim().slice(0, 30) ?? ''
      const startMinutes = parseTimeToMinutes(activity.startTime)
      const endMinutes = parseTimeToMinutes(activity.endTime)

      if (!normalizedTitle || startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
        return []
      }

      return [
        {
          id: activity.id?.trim() || `activity-${index + 1}`,
          title: normalizedTitle,
          weekday: activity.weekday,
          startTime: activity.startTime,
          endTime: activity.endTime
        }
      ]
    }) ?? []

  const mergedState: AppState = {
    ...initial,
    lang: parsed.lang ?? initial.lang,
    timetableTitle: parsed.timetableTitle?.trim().slice(0, 40) || initial.timetableTitle,
    studentInfo: {
      schoolName: parsed.studentInfo?.schoolName ?? initial.studentInfo.schoolName,
      grade: parsed.studentInfo?.grade ?? initial.studentInfo.grade,
      className: parsed.studentInfo?.className ?? initial.studentInfo.className,
      studentNumber: parsed.studentInfo?.studentNumber ?? initial.studentInfo.studentNumber,
      studentName: parsed.studentInfo?.studentName ?? initial.studentInfo.studentName
    },
    timeConfig: {
      firstPeriodStart,
      classMinutes,
      breakMinutes,
      lunchAfterPeriod: clamp(lunchAfterPeriod, 3, 5) as AppState['timeConfig']['lunchAfterPeriod'],
      lunchMinutes: clamp(lunchMinutes, 1, 180)
    },
    cells,
    subjectColors: cleanupSubjectColors(cells, canonicalSubjectColors),
    activities,
    version: 5
  }

  return mergedState
}
