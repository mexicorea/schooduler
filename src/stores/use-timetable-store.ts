'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { createCellKey, createInitialAppState } from '@/lib/default-state'
import { cleanupSubjectColors, collectSubjects, pickSubjectColor } from '@/lib/pastel-color'
import { parseImportedState } from '@/lib/schema'
import { canonicalizeSubjectName } from '@/lib/subject-translation'
import { parseTimeToMinutes } from '@/lib/time-calc'
import { ActivityItem, AppState, CellKey, Lang, Period, TimeConfig, Weekday } from '@/types/timetable'

type StudentField = keyof AppState['studentInfo']

type TimeField = keyof TimeConfig

interface TimetableStore extends AppState {
  setLang: (lang: Lang) => void
  setTimetableTitle: (title: string) => void
  setStudentField: (field: StudentField, value: string) => void
  setTimeField: (field: TimeField, value: string | number) => void
  setCellSubject: (weekday: Weekday, period: Period, subject: string) => void
  removeSubject: (subjectName: string) => void
  setSubjectColor: (subjectName: string, color: string) => void
  addActivity: (input: Omit<ActivityItem, 'id'>) => void
  removeActivity: (id: string) => void
  importState: (state: AppState) => void
  resetState: () => void
  getSubjects: () => string[]
}

const normalizeSubject = (value: string): string => canonicalizeSubjectName(value)
const normalizeTitle = (value: string): string => value.trim().slice(0, 40)
const normalizeActivityTitle = (value: string): string => value.trim().slice(0, 30)
const createActivityId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `activity-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
}

const initialState = createInitialAppState()

export const useTimetableStore = create<TimetableStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setLang: (lang) => {
        if (get().lang === lang) {
          return
        }

        set({ lang })
      },
      setTimetableTitle: (title) => {
        const normalized = normalizeTitle(title)
        if (!normalized || get().timetableTitle === normalized) {
          return
        }

        set({ timetableTitle: normalized })
      },
      setStudentField: (field, value) => {
        if (get().studentInfo[field] === value) {
          return
        }

        set((state) => ({
          studentInfo: {
            ...state.studentInfo,
            [field]: value
          }
        }))
      },
      setTimeField: (field, value) => {
        if (get().timeConfig[field] === value) {
          return
        }

        set((state) => ({
          timeConfig: {
            ...state.timeConfig,
            [field]: value
          }
        }))
      },
      setCellSubject: (weekday, period, subject) => {
        set((state) => {
          const normalized = normalizeSubject(subject)
          const key: CellKey = createCellKey(weekday, period)
          const nextCells = {
            ...state.cells,
            [key]: normalized
          }

          const nextColors = { ...state.subjectColors }

          if (normalized && !nextColors[normalized]) {
            nextColors[normalized] = pickSubjectColor(nextColors)
          }

          return {
            cells: nextCells,
            subjectColors: cleanupSubjectColors(nextCells, nextColors)
          }
        })
      },
      removeSubject: (subjectName) => {
        const target = normalizeSubject(subjectName)

        set((state) => {
          if (!target) {
            return {}
          }

          const nextCells = Object.entries(state.cells).reduce((acc, [key, value]) => {
            acc[key as CellKey] = value === target ? '' : value
            return acc
          }, {} as AppState['cells'])

          const nextColors = { ...state.subjectColors }
          delete nextColors[target]

          return {
            cells: nextCells,
            subjectColors: cleanupSubjectColors(nextCells, nextColors)
          }
        })
      },
      setSubjectColor: (subjectName, color) => {
        const target = normalizeSubject(subjectName)

        if (!target || !color) {
          return
        }

        if (get().subjectColors[target] === color) {
          return
        }

        set((state) => ({
          subjectColors: {
            ...state.subjectColors,
            [target]: color
          }
        }))
      },
      addActivity: (input) => {
        const title = normalizeActivityTitle(input.title)
        const startMinutes = parseTimeToMinutes(input.startTime)
        const endMinutes = parseTimeToMinutes(input.endTime)

        if (!title || startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
          return
        }

        set((state) => ({
          activities: [
            ...state.activities,
            {
              id: createActivityId(),
              title,
              weekday: input.weekday,
              startTime: input.startTime,
              endTime: input.endTime
            }
          ]
        }))
      },
      removeActivity: (id) => {
        set((state) => ({
          activities: state.activities.filter((activity) => activity.id !== id)
        }))
      },
      importState: (state) => {
        set({
          ...state,
          subjectColors: cleanupSubjectColors(state.cells, state.subjectColors)
        })
      },
      resetState: () => {
        set(createInitialAppState())
      },
      getSubjects: () => {
        return collectSubjects(get().cells)
      }
    }),
    {
      name: 'simple-timetable-v1',
      version: 4,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState) => {
        return parseImportedState(persistedState)
      },
      partialize: (state) => ({
        lang: state.lang,
        timetableTitle: state.timetableTitle,
        studentInfo: state.studentInfo,
        timeConfig: state.timeConfig,
        cells: state.cells,
        subjectColors: state.subjectColors,
        activities: state.activities,
        version: state.version
      })
    }
  )
)
