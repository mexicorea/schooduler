import { describe, expect, it, beforeEach } from 'vitest'

import { createInitialAppState } from '@/lib/default-state'
import { useTimetableStore } from '@/stores/use-timetable-store'

describe('useTimetableStore', () => {
  beforeEach(() => {
    useTimetableStore.getState().importState(createInitialAppState())
  })

  it('셀에 과목을 입력하면 색상이 함께 생성되어야 한다', () => {
    useTimetableStore.getState().setCellSubject('mon', 1, '수학')

    const state = useTimetableStore.getState()
    expect(state.cells['mon-1']).toBe('수학')
    expect(state.subjectColors['수학']).toBeDefined()
  })

  it('기본 과목 영문 입력은 한글 canonical로 저장되어야 한다', () => {
    useTimetableStore.getState().setCellSubject('mon', 2, 'Math')

    const state = useTimetableStore.getState()
    expect(state.cells['mon-2']).toBe('수학')
  })

  it('과목 삭제 시 해당 과목 셀들이 비워져야 한다', () => {
    const store = useTimetableStore.getState()

    store.setCellSubject('mon', 1, '과학')
    store.setCellSubject('fri', 6, '과학')
    store.removeSubject('과학')

    const state = useTimetableStore.getState()
    expect(state.cells['mon-1']).toBe('')
    expect(state.cells['fri-6']).toBe('')
    expect(state.subjectColors['과학']).toBeUndefined()
  })

  it('과목 색상을 수동으로 변경할 수 있어야 한다', () => {
    const store = useTimetableStore.getState()

    store.setCellSubject('tue', 2, '음악')
    store.setSubjectColor('음악', '#abcdef')

    expect(useTimetableStore.getState().subjectColors['음악']).toBe('#abcdef')
  })

  it('특별 활동을 추가하고 삭제할 수 있어야 한다', () => {
    const store = useTimetableStore.getState()

    store.addActivity({
      title: '영어 회화',
      weekday: 'wed',
      startTime: '14:40',
      endTime: '16:00'
    })

    const added = useTimetableStore.getState().activities
    expect(added).toHaveLength(1)
    expect(added[0]).toMatchObject({
      title: '영어 회화',
      weekday: 'wed',
      startTime: '14:40',
      endTime: '16:00'
    })

    store.removeActivity(added[0].id)
    expect(useTimetableStore.getState().activities).toHaveLength(0)
  })

  it('활동 이름이 비어 있으면 특별 활동을 추가하지 않아야 한다', () => {
    const store = useTimetableStore.getState()

    store.addActivity({
      title: '   ',
      weekday: 'thu',
      startTime: '14:40',
      endTime: '16:00'
    })

    expect(useTimetableStore.getState().activities).toHaveLength(0)
  })
})
