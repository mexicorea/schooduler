import { describe, expect, it } from 'vitest'

import {
  canonicalizeSubjectName,
  getSubjectDisplayName,
  getSubjectDisplayNameWithEmoji,
  isPresetSubjectName
} from '@/lib/subject-translation'

describe('subject-translation', () => {
  it('영문 기본 과목명을 한글 canonical로 저장할 수 있어야 한다', () => {
    expect(canonicalizeSubjectName('Math')).toBe('수학')
    expect(canonicalizeSubjectName('P.E.')).toBe('체육')
  })

  it('저장된 과목명을 언어에 맞게 표시해야 한다', () => {
    expect(getSubjectDisplayName('수학', 'en')).toBe('Math')
    expect(getSubjectDisplayName('사회', 'en')).toBe('Soc. St.')
    expect(getSubjectDisplayName('창체', 'en')).toBe('ECA')
    expect(getSubjectDisplayName('미술', 'en')).toBe('Art')
    expect(getSubjectDisplayName('Math', 'ko')).toBe('수학')
    expect(getSubjectDisplayName('로봇', 'en')).toBe('로봇')
  })

  it('기본 과목 여부를 alias까지 포함해 판별해야 한다', () => {
    expect(isPresetSubjectName('Math')).toBe(true)
    expect(isPresetSubjectName('수학')).toBe(true)
    expect(isPresetSubjectName('로봇')).toBe(false)
  })

  it('기본 과목 표시명에는 이모지를 붙이고 사용자 과목은 그대로 표시해야 한다', () => {
    expect(getSubjectDisplayNameWithEmoji('Math', 'en')).toBe('Math 📐')
    expect(getSubjectDisplayNameWithEmoji('수학', 'ko')).toBe('수학 📐')
    expect(getSubjectDisplayNameWithEmoji('로봇', 'ko')).toBe('로봇')
  })
})
