import { describe, expect, it } from 'vitest'

import { cleanupSubjectColors, PASTEL_PALETTE, pickSubjectColor } from '@/lib/pastel-color'

describe('pastel-color', () => {
  it('미사용 파스텔 색상을 우선 할당해야 한다', () => {
    const color = pickSubjectColor({ Math: PASTEL_PALETTE[0] })

    expect(color).toBe(PASTEL_PALETTE[1])
  })

  it('팔레트가 가득 찬 경우 랜덤 파스텔을 생성해야 한다', () => {
    const filled = Object.fromEntries(PASTEL_PALETTE.map((color, index) => [`S${index}`, color]))
    const color = pickSubjectColor(filled, () => 0.5)

    expect(color).toMatch(/^#([a-f0-9]{6})$/i)
    expect(PASTEL_PALETTE).not.toContain(color)
  })

  it('사용하지 않는 과목 색상은 정리해야 한다', () => {
    const cells = {
      'mon-1': '국어',
      'mon-2': ''
    } as const

    const cleaned = cleanupSubjectColors(cells as never, {
      국어: '#ffffff',
      수학: '#eeeeee'
    })

    expect(cleaned).toEqual({ 국어: '#ffffff' })
  })

  it('동일 과목 alias 색상은 canonical 한 개로 정리되어야 한다', () => {
    const cells = {
      'mon-1': '체육',
      'mon-2': ''
    } as const

    const cleaned = cleanupSubjectColors(cells as never, {
      PE: '#111111',
      체육: '#222222'
    })

    expect(cleaned).toEqual({ 체육: '#111111' })
  })
})
