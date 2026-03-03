import { AppState } from '@/types/timetable'

type ExportOptions = {
  preferredTitle?: string
}

const normalizeFileBaseName = (value: string): string => {
  const normalized = value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

  return normalized
}

export const exportStateAsJson = (state: AppState, options?: ExportOptions): void => {
  const now = new Date()
  const dateLabel = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now
    .getDate()
    .toString()
    .padStart(2, '0')}`

  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: 'application/json;charset=utf-8'
  })

  const link = document.createElement('a')
  const objectUrl = URL.createObjectURL(blob)
  link.href = objectUrl
  const preferredTitle = options?.preferredTitle?.trim()
  const hasCustomTitle = Boolean(preferredTitle && preferredTitle.toLowerCase() !== 'no name')
  const fileBaseName = hasCustomTitle && preferredTitle ? normalizeFileBaseName(preferredTitle) : 'simple-timetable'
  link.download = `${fileBaseName || 'simple-timetable'}-${dateLabel}.json`
  link.click()

  URL.revokeObjectURL(objectUrl)
}

export const readJsonFile = async (file: File): Promise<unknown> => {
  const content = await file.text()
  return JSON.parse(content)
}
