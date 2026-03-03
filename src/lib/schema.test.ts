import { describe, expect, it } from 'vitest'

import { parseImportedState } from '@/lib/schema'

describe('schema', () => {
  it('점심 위치가 1, 2교시 사이로 들어오면 3교시 이후로 보정해야 한다', () => {
    const parsed = parseImportedState({
      timeConfig: {
        lunchAfterPeriod: 1
      }
    })

    expect(parsed.timeConfig.lunchAfterPeriod).toBe(3)
  })
})
