import { describe, expect, it } from 'vitest'

import { buildExportFileName } from '@/lib/import-export'

describe('import-export', () => {
  const fixedDate = new Date('2026-03-03T10:20:30')

  it('시간표 제목이 없으면 schooduler 기본 파일명으로 생성해야 한다', () => {
    expect(buildExportFileName(undefined, fixedDate)).toBe('schooduler-20260303-102030.json')
    expect(buildExportFileName({ preferredTitle: '' }, fixedDate)).toBe('schooduler-20260303-102030.json')
  })

  it('no name 변형 제목은 기본 파일명으로 처리해야 한다', () => {
    expect(buildExportFileName({ preferredTitle: 'no name' }, fixedDate)).toBe('schooduler-20260303-102030.json')
    expect(buildExportFileName({ preferredTitle: ' No_Name ' }, fixedDate)).toBe('schooduler-20260303-102030.json')
    expect(buildExportFileName({ preferredTitle: 'noname' }, fixedDate)).toBe('schooduler-20260303-102030.json')
  })

  it('유효한 제목이 있으면 schooduler-title-timestamp 형태로 생성해야 한다', () => {
    expect(buildExportFileName({ preferredTitle: '우리 반 1학기' }, fixedDate)).toBe(
      'schooduler-우리-반-1학기-20260303-102030.json'
    )
  })

  it('파일명 불가 문자는 안전한 문자로 치환해야 한다', () => {
    expect(buildExportFileName({ preferredTitle: '3/2반: 과학*실험?' }, fixedDate)).toBe(
      'schooduler-3_2반_-과학_실험-20260303-102030.json'
    )
  })

  it('제목이 파일명으로 유효하지 않으면 기본 파일명으로 처리해야 한다', () => {
    expect(buildExportFileName({ preferredTitle: '///***' }, fixedDate)).toBe('schooduler-20260303-102030.json')
  })
})
