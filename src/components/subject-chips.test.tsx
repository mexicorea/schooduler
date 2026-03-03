import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { MessageKey } from '@/i18n'
import { SubjectChips } from '@/components/subject-chips'

describe('SubjectChips', () => {
  it('기본 과목 칩에는 삭제 버튼이 보이지 않아야 한다', () => {
    const t = (key: MessageKey) => key

    render(
      <SubjectChips
        lang='ko'
        subjects={['수학', '로봇']}
        subjectColors={{ 수학: '#ffffff', 로봇: '#eeeeee' }}
        onRemove={vi.fn()}
        onColorChange={vi.fn()}
        t={t}
      />
    )

    expect(screen.queryByLabelText('수학 delete')).not.toBeInTheDocument()
    expect(screen.getByLabelText('로봇 delete')).toBeInTheDocument()
  })
})
