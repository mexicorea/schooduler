import { AppState } from '@/types/timetable'

type ExportOptions = {
  preferredTitle?: string
}

const EXPORT_FILE_PREFIX = 'schooduler'

const normalizeTitleToken = (value: string): string => {
  return value.trim().toLowerCase().replace(/[\s_-]/g, '')
}

const isDefaultTitle = (value: string): boolean => {
  return normalizeTitleToken(value) === 'noname'
}

const sanitizeTitleForFileName = (value: string): string => {
  return value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')
    .replace(/\s+/g, '-')
    .replace(/_+/g, '_')
    .replace(/-+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
    .slice(0, 60)
}

const formatExportTimestamp = (now: Date): string => {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}${month}${day}-${hours}${minutes}${seconds}`
}

export const buildExportFileName = (options?: ExportOptions, now: Date = new Date()): string => {
  const preferredTitle = options?.preferredTitle?.trim() ?? ''
  const normalizedTitle = sanitizeTitleForFileName(preferredTitle)
  const hasCustomTitle = Boolean(preferredTitle && !isDefaultTitle(preferredTitle) && normalizedTitle)
  const timestamp = formatExportTimestamp(now)

  if (hasCustomTitle) {
    return `${EXPORT_FILE_PREFIX}-${normalizedTitle}-${timestamp}.json`
  }

  return `${EXPORT_FILE_PREFIX}-${timestamp}.json`
}

export const exportStateAsJson = (state: AppState, options?: ExportOptions): void => {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: 'application/json;charset=utf-8'
  })

  const link = document.createElement('a')
  const objectUrl = URL.createObjectURL(blob)
  link.href = objectUrl
  link.download = buildExportFileName(options)
  link.click()

  URL.revokeObjectURL(objectUrl)
}

export const readJsonFile = async (file: File): Promise<unknown> => {
  const content = await file.text()
  return JSON.parse(content)
}
