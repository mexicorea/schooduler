import { describe, expect, it } from 'vitest'

import { canonicalizeSubjectName, getSubjectDisplayName } from '@/lib/subject-translation'

describe('subject-translation', () => {
  it('영문 기본 과목명을 한글 canonical로 저장할 수 있어야 한다', () => {
    expect(canonicalizeSubjectName('Math')).toBe('수학')
    expect(canonicalizeSubjectName('P.E.')).toBe('체육')
  })

  it('저장된 과목명을 언어에 맞게 표시해야 한다', () => {
    expect(getSubjectDisplayName('수학', 'en')).toBe('Math')
    expect(getSubjectDisplayName('Math', 'ko')).toBe('수학')
    expect(getSubjectDisplayName('로봇', 'en')).toBe('로봇')
  })
})
