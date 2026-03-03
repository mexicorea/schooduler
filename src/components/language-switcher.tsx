'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageKey } from '@/i18n'
import { Lang } from '@/types/timetable'

type LanguageSwitcherProps = {
  lang: Lang
  onChange: (lang: Lang) => void
  t: (key: MessageKey) => string
}

const LANGUAGE_AUTONYM: Record<Lang, string> = {
  ko: '한국어',
  en: 'English'
}

export function LanguageSwitcher({ lang, onChange, t }: LanguageSwitcherProps) {
  return (
    <div className='flex items-center gap-2'>
      <span className='text-sm font-medium text-muted-foreground'>{t('language.label')}</span>
      <Select value={lang} onValueChange={(value) => onChange(value as Lang)}>
        <SelectTrigger className='w-[130px] bg-white'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='ko'>{LANGUAGE_AUTONYM.ko}</SelectItem>
          <SelectItem value='en'>{LANGUAGE_AUTONYM.en}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
