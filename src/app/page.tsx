'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { ActivitiesPanel } from '@/components/activities-panel'
import { ClubActivityTimeline } from '@/components/club-activity-timeline'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SettingsPanel } from '@/components/settings-panel'
import { SubjectChips } from '@/components/subject-chips'
import { TimetableGrid } from '@/components/timetable-grid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/sonner'
import { messagesByLang, MessageKey } from '@/i18n'
import { exportStateAsJson, readJsonFile } from '@/lib/import-export'
import { parseImportedState } from '@/lib/schema'
import { collectSubjectPanelList } from '@/lib/subject-panel'
import { useTimetableStore } from '@/stores/use-timetable-store'

export default function Home() {
  const lang = useTimetableStore((state) => state.lang)
  const timetableTitle = useTimetableStore((state) => state.timetableTitle)
  const studentInfo = useTimetableStore((state) => state.studentInfo)
  const timeConfig = useTimetableStore((state) => state.timeConfig)
  const cells = useTimetableStore((state) => state.cells)
  const subjectColors = useTimetableStore((state) => state.subjectColors)
  const activities = useTimetableStore((state) => state.activities)
  const setLang = useTimetableStore((state) => state.setLang)
  const setTimetableTitle = useTimetableStore((state) => state.setTimetableTitle)
  const setTimeField = useTimetableStore((state) => state.setTimeField)
  const setCellSubject = useTimetableStore((state) => state.setCellSubject)
  const removeSubject = useTimetableStore((state) => state.removeSubject)
  const setSubjectColor = useTimetableStore((state) => state.setSubjectColor)
  const addActivity = useTimetableStore((state) => state.addActivity)
  const removeActivity = useTimetableStore((state) => state.removeActivity)
  const importState = useTimetableStore((state) => state.importState)
  const resetState = useTimetableStore((state) => state.resetState)

  const importRef = useRef<HTMLInputElement | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')

  const t = useCallback((key: MessageKey) => messagesByLang[lang][key], [lang])

  const subjects = useMemo(() => collectSubjectPanelList(cells), [cells])

  const exportCurrentState = () => {
    exportStateAsJson({
      lang,
      timetableTitle,
      studentInfo,
      timeConfig,
      cells,
      subjectColors,
      activities,
      version: 5
    }, {
      preferredTitle: timetableTitle
    })
  }

  const importJson = async (file: File) => {
    try {
      const parsed = parseImportedState(await readJsonFile(file))
      importState(parsed)
      toast.success(t('toast.import.success'))
    } catch {
      toast.error(t('toast.import.error'))
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-amber-50 via-sky-50 to-lime-50 px-4 py-6 sm:px-6'>
      <div className='mx-auto max-w-[1500px] space-y-4'>
        <header className='rounded-2xl border-2 bg-white/90 p-4 shadow-sm'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <h1 className='text-2xl font-extrabold tracking-tight sm:text-3xl'>{t('app.name')}</h1>
              <p className='mt-1 text-sm text-muted-foreground sm:text-base'>{t('app.description')}</p>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <LanguageSwitcher lang={lang} onChange={setLang} t={t} />
              <input
                ref={importRef}
                type='file'
                accept='application/json'
                className='hidden'
                onChange={async (event) => {
                  const file = event.target.files?.[0]
                  if (file) {
                    await importJson(file)
                    event.target.value = ''
                  }
                }}
              />
              <Button type='button' variant='outline' onClick={() => importRef.current?.click()}>
                {t('common.import')}
              </Button>
              <Button type='button' variant='outline' onClick={exportCurrentState}>
                {t('common.export')}
              </Button>
              <Button
                type='button'
                variant='destructive'
                onClick={() => {
                  resetState()
                  toast.success(t('toast.reset.done'))
                }}
              >
                {t('common.reset')}
              </Button>
            </div>
          </div>
        </header>

        <main className='grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)_320px]'>
          <aside className='space-y-4'>
            <SettingsPanel
              lang={lang}
              timeConfig={timeConfig}
              onTimeNumberChange={(field, value) => setTimeField(field, value)}
              onTimeValueChange={(field, value) => setTimeField(field, value)}
              t={t}
            />
            <ActivitiesPanel activities={activities} onAddActivity={addActivity} onRemoveActivity={removeActivity} t={t} />
          </aside>

          <section className='space-y-3'>
            {isEditingTitle ? (
              <div className='flex justify-center'>
                <form
                  className='flex w-full max-w-xl items-center gap-2'
                  onSubmit={(event) => {
                    event.preventDefault()
                    setTimetableTitle(titleDraft.trim() || 'no name')
                    setIsEditingTitle(false)
                  }}
                >
                  <Input
                    value={titleDraft}
                    maxLength={40}
                    autoFocus
                    onChange={(event) => setTitleDraft(event.target.value)}
                    placeholder='no name'
                  />
                  <Button
                    type='submit'
                  >
                    OK
                  </Button>
                  <Button
                    type='button'
                    variant='secondary'
                    onClick={() => {
                      setTitleDraft(timetableTitle)
                      setIsEditingTitle(false)
                    }}
                  >
                    Cancel
                  </Button>
                </form>
              </div>
            ) : (
              <div className='flex justify-center'>
                <button
                  type='button'
                  className='rounded-full border bg-amber-100/80 px-6 py-2 text-center text-xl font-extrabold text-amber-900 transition hover:bg-amber-100 sm:text-2xl'
                  onClick={() => {
                    setTitleDraft(timetableTitle)
                    setIsEditingTitle(true)
                  }}
                >
                  {timetableTitle || 'no name'}
                </button>
              </div>
            )}
            <TimetableGrid
              lang={lang}
              cells={cells}
              subjects={subjects}
              subjectColors={subjectColors}
              timeConfig={timeConfig}
              onSaveCell={setCellSubject}
              t={t}
            />
            <ClubActivityTimeline activities={activities} t={t} />
          </section>

          <aside>
            <SubjectChips
              lang={lang}
              subjects={subjects}
              subjectColors={subjectColors}
              onRemove={removeSubject}
              onColorChange={setSubjectColor}
              t={t}
            />
          </aside>
        </main>
      </div>
      <Toaster position='top-center' richColors />
    </div>
  )
}
