export type Lang = 'ko' | 'en'

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri'

export type Period = 1 | 2 | 3 | 4 | 5 | 6

export type LunchAfterPeriod = 3 | 4 | 5

export type CellKey = `${Weekday}-${Period}`

export interface StudentInfo {
  schoolName: string
  grade: string
  className: string
  studentNumber: string
  studentName: string
}

export interface TimeConfig {
  firstPeriodStart: string
  classMinutes: number
  breakMinutes: number
  lunchAfterPeriod: LunchAfterPeriod
  lunchMinutes: number
}

export interface ActivityItem {
  id: string
  title: string
  weekday: Weekday
  startTime: string
  endTime: string
}

export interface SubjectColorMap {
  [subjectName: string]: string
}

export type TimetableCells = Record<CellKey, string>

export interface AppState {
  lang: Lang
  studentInfo: StudentInfo
  timetableTitle: string
  timeConfig: TimeConfig
  cells: TimetableCells
  subjectColors: SubjectColorMap
  activities: ActivityItem[]
  version: 5
}

export type TableRow =
  | {
      type: 'period'
      period: Period
      start: string
      end: string
      label: string
    }
  | {
      type: 'lunch'
      start: string
      end: string
      label: string
    }

export const WEEKDAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri']

export const PERIODS: Period[] = [1, 2, 3, 4, 5, 6]

export const LUNCH_AFTER_PERIODS: LunchAfterPeriod[] = [3, 4, 5]
