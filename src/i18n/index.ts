import { messagesEn } from '@/i18n/messages.en'
import { messagesKo } from '@/i18n/messages.ko'
import { Lang } from '@/types/timetable'

export const messagesByLang = {
  ko: messagesKo,
  en: messagesEn
}

export type MessageKey = keyof typeof messagesKo

export const tByLang = (lang: Lang, key: MessageKey): string => {
  return messagesByLang[lang][key]
}
