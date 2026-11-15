import useGetExaminationSessionList from '@/features/admin/management/examination/hooks/useGetExaminationSessionList'
import type { ExaminationSessionType } from '@/features/examiner/management/examination/types/exam_session'
import { useEffect, useRef, useState } from 'react'
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'


interface ExamSessionSelectProps {
  value: string
  onChange: (examinationSessionId: string) => void
}

interface ExamSessionDropdownProps {
  value: string
  onSelect: (examinationSessionId: string, label: string) => void
}

const getExamSessionLabel = (
  examinationSession: ExaminationSessionType,
): string => {
  return `${examinationSession.semester.semesterCode} - ${examinationSession.semester.name} - ${examinationSession.examination.name}`
}

export default function ExamSessionSelect({
  value,
  onChange,
}: ExamSessionSelectProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState('')

  const displayLabel =
    value === 'all'
      ? 'Tất cả đợt thi'
      : selectedLabel || 'Chọn đợt thi'

  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleSelect = (
    examinationSessionId: string,
    label: string,
  ) => {
    onChange(examinationSessionId)
    setSelectedLabel(label)
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative w-full sm:w-80">
      <label className="mb-2 block text-sm font-medium text-text-primary">
        Đợt thi
      </label>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className={[
          'flex w-full items-center justify-between gap-3 rounded-lg border',
          'border-border-default bg-bg-primary px-3 py-2.5 text-sm',
          'text-text-primary transition-colors',
          'hover:border-brand-orange focus:outline-none focus:ring-2',
          'focus:ring-brand-orange/30',
        ].join(' ')}
      >
        <span className="truncate">{displayLabel}</span>

        <FiChevronDown
          className={`shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <ExamSessionDropdown
          value={value}
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}

function ExamSessionDropdown({
  value,
  onSelect,
}: ExamSessionDropdownProps) {
  const {
    examinationSessionDataList,
    loading,
    currentExaminationSessionPage,
    setCurrentExaminationSessionPage,
  } = useGetExaminationSessionList()

  const examinationSessions =
    examinationSessionDataList?.items ?? []

  const hasPrevious =
    examinationSessionDataList?.hasPrevious ?? false

  const hasNext =
    examinationSessionDataList?.hasNext ?? false

  const totalPages =
    examinationSessionDataList?.totalPages ?? 1

  return (
    <div
      role="listbox"
      aria-label="Danh sách đợt thi"
      className={[
        'absolute left-0 right-0 top-full z-50 mt-2',
        'overflow-hidden rounded-lg border border-border-default',
        'bg-bg-primary shadow-lg',
      ].join(' ')}
    >
      {/* Option: all examination sessions */}
      <button
        type="button"
        role="option"
        aria-selected={value === 'all'}
        disabled={loading}
        onClick={() => onSelect('all', 'Tất cả đợt thi')}
        className={[
          'w-full border-b border-border-default px-3 py-2.5',
          'text-left text-sm text-text-primary transition-colors',
          'hover:bg-bg-secondary disabled:cursor-not-allowed',
          value === 'all' ? 'bg-bg-muted' : '',
        ].join(' ')}
      >
        Tất cả đợt thi
      </button>

      {/* Examination session options */}
      <div className="max-h-72 overflow-y-auto">
        {loading && examinationSessions.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-text-secondary">
            Đang tải danh sách đợt thi...
          </div>
        ) : examinationSessions.length > 0 ? (
          examinationSessions.map((session) => {
            const isSelected =
              value === session.examinationSessionId

            const label = getExamSessionLabel(session)

            return (
              <button
                key={session.examinationSessionId}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={loading}
                onClick={() =>
                  onSelect(session.examinationSessionId, label)
                }
                className={[
                  'w-full border-b border-border-default px-3 py-3',
                  'text-left transition-colors last:border-b-0',
                  'hover:bg-bg-muted disabled:cursor-not-allowed',
                  isSelected ? 'bg-bg-muted' : '',
                ].join(' ')}
              >
                {/* Semester code and name */}
                <span className="block truncate text-sm font-medium text-text-primary">
                  {session.semester.semesterCode} - {session.semester.name}
                </span>

                {/* Examination name */}
                <span className="mt-1 block truncate text-xs text-text-secondary">
                  {session.examination.name}
                </span>
              </button>
            )
          })
        ) : (
          !loading && (
            <div className="px-3 py-6 text-center text-sm text-text-secondary">
              Không có đợt thi nào.
            </div>
          )
        )}

        {loading && examinationSessions.length > 0 && (
          <div className="px-3 py-2 text-center text-xs text-text-secondary">
            Đang tải...
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border-default px-3 py-2">
        <button
          type="button"
          aria-label="Trang trước"
          disabled={!hasPrevious || loading}
          onClick={() =>
            setCurrentExaminationSessionPage((page) => page - 1)
          }
          className={[
            'rounded-md p-2 text-text-primary transition-colors',
            'hover:bg-bg-muted disabled:cursor-not-allowed',
            'disabled:opacity-40',
          ].join(' ')}
        >
          <FiChevronLeft />
        </button>

        <span className="text-xs text-text-secondary">
          Trang {currentExaminationSessionPage}
          {examinationSessionDataList ? ` / ${totalPages}` : ''}
        </span>

        <button
          type="button"
          aria-label="Trang tiếp theo"
          disabled={!hasNext || loading}
          onClick={() =>
            setCurrentExaminationSessionPage((page) => page + 1)
          }
          className={[
            'rounded-md p-2 text-text-primary transition-colors',
            'hover:bg-bg-muted disabled:cursor-not-allowed',
            'disabled:opacity-40',
          ].join(' ')}
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  )
}