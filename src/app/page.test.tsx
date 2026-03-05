import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Home from '@/app/page'
import { createInitialAppState } from '@/lib/default-state'
import { useTimetableStore } from '@/stores/use-timetable-store'

describe('Home', () => {
  beforeEach(() => {
    useTimetableStore.getState().importState(createInitialAppState())
  })

  it('인쇄 버튼을 누르면 브라우저 인쇄를 호출해야 한다', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})
    const user = userEvent.setup()

    render(<Home />)
    await user.click(screen.getByRole('button', { name: '인쇄' }))

    expect(printSpy).toHaveBeenCalledTimes(1)
  })

  it('특별 활동이 없으면 인쇄 영역에서 활동 타임라인을 렌더링하지 않아야 한다', () => {
    render(<Home />)

    expect(screen.queryByTestId('print-activities')).not.toBeInTheDocument()
  })

  it('특별 활동이 있으면 인쇄 순서가 제목, 정규 시간표, 특별 활동이어야 한다', () => {
    useTimetableStore.getState().addActivity({
      title: '농구',
      weekday: 'thu',
      startTime: '15:00',
      endTime: '16:00'
    })

    render(<Home />)

    const printTitle = screen.getByTestId('print-title')
    const regularTimetable = screen.getByTestId('print-regular-timetable')
    const activities = screen.getByTestId('print-activities')

    expect(printTitle.compareDocumentPosition(regularTimetable) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(regularTimetable.compareDocumentPosition(activities) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
