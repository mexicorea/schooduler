import { AppState, CellKey, Period, PERIODS, TimeConfig, TimetableCells, WEEKDAYS, Weekday } from '@/types/timetable'

export const createCellKey = (weekday: Weekday, period: Period): CellKey => `${weekday}-${period}`

export const createDefaultCells = (): TimetableCells => {
  const cells = {} as TimetableCells

  for (const day of WEEKDAYS) {
    for (const period of PERIODS) {
      cells[createCellKey(day, period)] = ''
    }
  }

  return cells
}

export const defaultTimeConfig: TimeConfig = {
  firstPeriodStart: '09:00',
  classMinutes: 40,
  breakMinutes: 10,
  lunchAfterPeriod: 4,
  lunchMinutes: 50
}

export const createInitialAppState = (): AppState => ({
  lang: 'ko',
  timetableTitle: 'no name',
  studentInfo: {
    schoolName: '',
    grade: '',
    className: '',
    studentNumber: '',
    studentName: ''
  },
  timeConfig: { ...defaultTimeConfig },
  cells: createDefaultCells(),
  subjectColors: {},
  activities: [],
  version: 4
})
