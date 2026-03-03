import { collectSubjects } from '@/lib/pastel-color'
import { PRESET_SUBJECTS } from '@/lib/subject-translation'
import { TimetableCells } from '@/types/timetable'

export const collectSubjectPanelList = (cells: TimetableCells): string[] => {
  const customSubjects = collectSubjects(cells)
  return [...new Set([...PRESET_SUBJECTS, ...customSubjects])]
}
