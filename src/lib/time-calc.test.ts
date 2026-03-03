import { describe, expect, it } from 'vitest'

import { defaultTimeConfig } from '@/lib/default-state'
import { buildPeriodSlots, buildTableRows } from '@/lib/time-calc'

describe('time-calc', () => {
  it('6교시 시간 슬롯을 계산해야 한다', () => {
    const slots = buildPeriodSlots(defaultTimeConfig)

    expect(slots).toHaveLength(6)
    expect(slots[0]).toMatchObject({
      period: 1,
      startMinutes: 540,
      endMinutes: 580
    })
    expect(slots[1]).toMatchObject({
      period: 2,
      startMinutes: 590,
      endMinutes: 630
    })
  })

  it('점심이 4교시와 5교시 사이면 5교시는 점심 종료 시각에 시작해야 한다', () => {
    const slots = buildPeriodSlots({
      ...defaultTimeConfig,
      firstPeriodStart: '09:10',
      classMinutes: 40,
      breakMinutes: 10,
      lunchAfterPeriod: 4,
      lunchMinutes: 50
    })

    expect(slots[3]).toMatchObject({
      period: 4,
      startMinutes: 700,
      endMinutes: 740
    })
    expect(slots[4]).toMatchObject({
      period: 5,
      startMinutes: 790,
      endMinutes: 830
    })
  })

  it('점심 행은 선택한 교시 사이에 삽입되어야 한다', () => {
    const rows = buildTableRows({
      ...defaultTimeConfig,
      firstPeriodStart: '09:10',
      classMinutes: 40,
      breakMinutes: 10,
      lunchAfterPeriod: 4,
      lunchMinutes: 50
    })

    expect(rows).toHaveLength(7)
    expect(rows[4]).toMatchObject({
      type: 'lunch',
      start: '12:20',
      end: '13:10'
    })
    expect(rows[5]).toMatchObject({
      type: 'period',
      period: 5,
      start: '13:10'
    })
  })
})
