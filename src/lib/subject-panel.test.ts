import { describe, expect, it } from 'vitest'

import { createDefaultCells } from '@/lib/default-state'
import { collectSubjectPanelList } from '@/lib/subject-panel'

describe('subject-panel', () => {
  it('빈 시간표여도 기본 과목은 과목 목록에 보여야 한다', () => {
    const subjects = collectSubjectPanelList(createDefaultCells())

    expect(subjects).toEqual(expect.arrayContaining(['국어', '수학', '과학', '영어', '음악', '도덕', '창체', '체육']))
  })

  it('기본 과목 alias가 입력돼도 과목 목록에는 canonical 한 개만 있어야 한다', () => {
    const cells = createDefaultCells()
    cells['mon-1'] = 'Math'

    const subjects = collectSubjectPanelList(cells)
    const mathSubjects = subjects.filter((subject) => subject === '수학')

    expect(mathSubjects).toHaveLength(1)
  })

  it('사용자 정의 과목은 기본 과목 뒤에 추가되어야 한다', () => {
    const cells = createDefaultCells()
    cells['fri-6'] = '로봇'

    const subjects = collectSubjectPanelList(cells)

    expect(subjects.at(-1)).toBe('로봇')
  })
})
