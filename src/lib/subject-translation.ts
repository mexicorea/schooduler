import { Lang } from '@/types/timetable'

type SubjectEntry = {
  ko: string
  en: string
  aliases?: string[]
}

const SUBJECT_ENTRIES: SubjectEntry[] = [
  { ko: '국어', en: 'Korean' },
  { ko: '수학', en: 'Math' },
  { ko: '과학', en: 'Science' },
  { ko: '사회', en: 'S.S.', aliases: ['Social Studies'] },
  { ko: '체육', en: 'P.E.', aliases: ['PE', 'Physical Education'] },
  { ko: '창체', en: 'E.A.', aliases: ['EA', 'Experiential Activities'] },
  { ko: '음악', en: 'Music' },
  { ko: '미술', en: 'Arts', aliases: ['Art'] },
  { ko: '도덕', en: 'Ethics' },
  { ko: '영어', en: 'English' }
]

const normalizeToken = (value: string): string => {
  return value.trim().toLowerCase().replace(/[\s.\-_/]/g, '')
}

const canonicalByToken = SUBJECT_ENTRIES.reduce<Record<string, string>>((acc, entry) => {
  const tokens = [entry.ko, entry.en, ...(entry.aliases ?? [])]

  for (const token of tokens) {
    acc[normalizeToken(token)] = entry.ko
  }

  return acc
}, {})

const entryByKo = SUBJECT_ENTRIES.reduce<Record<string, SubjectEntry>>((acc, entry) => {
  acc[entry.ko] = entry
  return acc
}, {})

export const canonicalizeSubjectName = (value: string): string => {
  const trimmed = value.trim().slice(0, 20)
  if (!trimmed) {
    return ''
  }

  const canonical = canonicalByToken[normalizeToken(trimmed)]
  return canonical ?? trimmed
}

export const getSubjectDisplayName = (storedValue: string, lang: Lang): string => {
  const canonical = canonicalizeSubjectName(storedValue)
  if (!canonical) {
    return ''
  }

  const entry = entryByKo[canonical]
  if (!entry) {
    return canonical
  }

  return lang === 'ko' ? entry.ko : entry.en
}
