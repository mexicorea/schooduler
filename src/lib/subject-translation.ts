import { Lang } from '@/types/timetable'

type SubjectEntry = {
  ko: string
  en: string
  emoji: string
  aliases?: string[]
}

const SUBJECT_ENTRIES: SubjectEntry[] = [
  { ko: '국어', en: 'Korean', emoji: '📖' },
  { ko: '수학', en: 'Math', emoji: '📐' },
  { ko: '과학', en: 'Science', emoji: '🔬' },
  { ko: '사회', en: 'Soc. St.', emoji: '🌍', aliases: ['Social Studies'] },
  { ko: '체육', en: 'P.E.', emoji: '⚽', aliases: ['PE', 'Physical Education'] },
  { ko: '창체', en: 'ECA', emoji: '🌱', aliases: ['EA', 'Experiential Activities'] },
  { ko: '음악', en: 'Music', emoji: '🎵' },
  { ko: '미술', en: 'Art', emoji: '🎨', aliases: ['Arts'] },
  { ko: '도덕', en: 'Ethics', emoji: '🤝' },
  { ko: '영어', en: 'English', emoji: '🔤' }
]

export const PRESET_SUBJECTS = SUBJECT_ENTRIES.map((entry) => entry.ko)

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

const presetSubjectSet = new Set(PRESET_SUBJECTS)

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

export const getSubjectEmoji = (storedValue: string): string => {
  const canonical = canonicalizeSubjectName(storedValue)
  if (!canonical) {
    return ''
  }

  return entryByKo[canonical]?.emoji ?? ''
}

export const getSubjectDisplayNameWithEmoji = (storedValue: string, lang: Lang): string => {
  const displayName = getSubjectDisplayName(storedValue, lang)
  if (!displayName) {
    return ''
  }

  const emoji = getSubjectEmoji(storedValue)
  return emoji ? `${displayName} ${emoji}` : displayName
}

export const isPresetSubjectName = (value: string): boolean => {
  const canonical = canonicalizeSubjectName(value)
  if (!canonical) {
    return false
  }

  return presetSubjectSet.has(canonical)
}
