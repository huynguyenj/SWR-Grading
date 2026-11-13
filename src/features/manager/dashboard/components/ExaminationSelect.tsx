
import { useEffect, useRef, useState } from 'react'
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'

import useGetExaminationList from '@/features/admin/management/examination/hooks/useGetExaminationList'
// import {
//   EXAMINATION_STATUS_LABEL,
//   type ExaminationStatus,
// } from '@/features/admin/management/examination/types/examination.type'

interface ExaminationSelectProps {
  value: string
  onChange: (examinationId: string) => void
}

interface ExaminationDropdownProps {
  value: string
  onSelect: (examinationId: string, label: string) => void
}

// const STATUS_CLASS: Record<ExaminationStatus, string> = {
//   0: 'bg-bg-muted text-text-secondary',
//   1: 'bg-success/10 text-success',
//   2: 'bg-warning/10 text-warning',
//   3: 'bg-brand-orange/10 text-brand-orange',
//   4: 'bg-danger/10 text-danger',
// }

export default function ExaminationSelect({
  value,
  onChange,
}: ExaminationSelectProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState('')

  const displayLabel =
    value === 'all'
      ? 'Tất cả học kỳ'
      : selectedLabel || 'Chọn kì thi'

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

  const handleSelect = (examinationId: string, label: string) => {
    onChange(examinationId)
    setSelectedLabel(label)
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative w-full sm:w-72">
      <label className="mb-2 block text-sm font-medium text-text-primary">
        Kỳ thi
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
        <span className="truncate">
          {displayLabel}
        </span>

        <FiChevronDown
          className={`shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <ExaminationDropdown
          value={value}
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}

function ExaminationDropdown({
  value,
  onSelect,
}: ExaminationDropdownProps) {
  const {
    examinationDataList,
    loading,
    currentExaminationPage,
    setCurrentExaminationPage,
  } = useGetExaminationList()

  const examinations = examinationDataList?.items ?? []

  const hasPrevious = examinationDataList?.hasPrevious ?? false
  const hasNext = examinationDataList?.hasNext ?? false
  const totalPages = examinationDataList?.totalPages ?? 1

  return (
    <div
      role="listbox"
      aria-label="Danh sách kỳ thi"
      className={[
        'absolute left-0 right-0 top-full z-50 mt-2',
        'overflow-hidden rounded-lg border border-border-default',
        'bg-bg-primary shadow-lg',
      ].join(' ')}
    >
    {/* Option: all semesters */}
      <button
        type="button"
        role="option"
        aria-selected={false}
        disabled={loading}
        onClick={() => onSelect('all', 'Tất cả kì thi')}
        className={[
          'w-full border-b border-border-primary px-3 py-2.5',
          'text-left text-sm text-text-primary transition-colors',
          'hover:bg-bg-secondary disabled:cursor-not-allowed',
        ].join(' ')}
      >
        Tất cả kì thi
      </button>
      {/* Examination options */}
      <div className="max-h-72 overflow-y-auto">
        {loading && examinations.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-text-secondary">
            Đang tải danh sách kỳ thi...
          </div>
        ) : examinations.length > 0 ? (
          examinations.map((examination) => {
            const isSelected =
              value === examination.examinationId

            const label =
              `${examination.examinationCode} - ${examination.name}`

            return (
              <button
                key={examination.examinationId}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={loading}
                onClick={() =>
                  onSelect(examination.examinationId, label)
                }
                className={[
                  'w-full border-b border-border-default px-3 py-3',
                  'text-left transition-colors last:border-b-0',
                  'hover:bg-bg-muted disabled:cursor-not-allowed',
                  isSelected ? 'bg-bg-muted' : '',
                ].join(' ')}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="min-w-0 truncate text-sm font-medium text-text-primary">
                    {examination.examinationCode}
                  </span>
{/* 
                  <span
                    className={[
                      'shrink-0 rounded-full px-2 py-0.5',
                      'text-[10px] font-medium',
                      STATUS_CLASS[examination.status],
                    ].join(' ')}
                  >
                    {EXAMINATION_STATUS_LABEL[examination.status]}
                  </span> */}
                </div>

                <span className="mt-1 block truncate text-xs text-text-secondary">
                  {examination.name}
                </span>
              </button>
            )
          })
        ) : (
          !loading && (
            <div className="px-3 py-6 text-center text-sm text-text-secondary">
              Không có kỳ thi nào.
            </div>
          )
        )}

        {loading && examinations.length > 0 && (
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
            setCurrentExaminationPage((page) => page - 1)
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
          Trang {currentExaminationPage}
          {examinationDataList ? ` / ${totalPages}` : ''}
        </span>

        <button
          type="button"
          aria-label="Trang tiếp theo"
          disabled={!hasNext || loading}
          onClick={() =>
            setCurrentExaminationPage((page) => page + 1)
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
