import { useEffect, useRef, useState } from 'react'
import { FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import useGetSemester from '@/features/admin/management/semester/hooks/useGetSemester'

interface SemesterSelectProps {
  value: string
  onChange: (semesterId: string) => void
}

interface SemesterDropdownProps {
  onSelect: (semesterId: string, label: string) => void
}

export default function SemesterSelect({
  value,
  onChange,
}: SemesterSelectProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState('')

  const displayLabel =
    value === 'all'
      ? 'Tất cả học kỳ'
      : selectedLabel || 'Chọn học kỳ'

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

  const handleSelect = (semesterId: string, label: string) => {
    onChange(semesterId)
    setSelectedLabel(label)
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative w-full sm:w-64">
      <label className="mb-2 block text-sm font-medium text-text-primary">
        Học kỳ
      </label>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className={[
          'flex w-full items-center justify-between gap-3 rounded-lg border',
          'border-border-primary bg-bg-primary px-3 py-2.5 text-sm',
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
        <SemesterDropdown
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}

function SemesterDropdown({ onSelect }: SemesterDropdownProps) {
  const {
    semesterDataList,
    loading,
    currentSemesterPage,
    setCurrentSemesterPage,
  } = useGetSemester()

  const semesters = semesterDataList?.items ?? []
  const hasPrevious = semesterDataList?.hasPrevious ?? false
  const hasNext = semesterDataList?.hasNext ?? false
  const totalPages = semesterDataList?.totalPages ?? 1

  return (
    <div
      role="listbox"
      aria-label="Danh sách học kỳ"
      className={[
        'absolute left-0 right-0 top-full z-50 mt-2',
        'overflow-hidden rounded-lg border border-border-primary',
        'bg-bg-primary shadow-lg',
      ].join(' ')}
    >
      {/* Option: all semesters */}
      <button
        type="button"
        role="option"
        aria-selected={false}
        disabled={loading}
        onClick={() => onSelect('all', 'Tất cả học kỳ')}
        className={[
          'w-full border-b border-border-primary px-3 py-2.5',
          'text-left text-sm text-text-primary transition-colors',
          'hover:bg-bg-secondary disabled:cursor-not-allowed',
        ].join(' ')}
      >
        Tất cả học kỳ
      </button>

      {/* Semester options */}
      <div className="max-h-64 overflow-y-auto">
        {loading && semesters.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-text-secondary">
            Đang tải danh sách học kỳ...
          </div>
        ) : semesters.length > 0 ? (
          semesters.map((semester) => (
            <button
              key={semester.semesterId}
              type="button"
              role="option"
              aria-selected={false}
              disabled={loading}
              onClick={() =>
                onSelect(
                  semester.semesterId,
                  `${semester.semesterCode} - ${semester.name}`,
                )
              }
              className={[
                'w-full px-3 py-2.5 text-left transition-colors',
                'hover:bg-bg-secondary disabled:cursor-not-allowed',
              ].join(' ')}
            >
              <span className="block truncate text-sm font-medium text-text-primary">
                {semester.semesterCode}
              </span>

              <span className="mt-0.5 block truncate text-xs text-text-secondary">
                {semester.name}
              </span>
            </button>
          ))
        ) : (
          !loading && (
            <div className="px-3 py-6 text-center text-sm text-text-secondary">
              Không có học kỳ nào.
            </div>
          )
        )}

        {loading && semesters.length > 0 && (
          <div className="px-3 py-2 text-center text-xs text-text-secondary">
            Đang tải...
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border-primary px-3 py-2">
        <button
          type="button"
          aria-label="Trang trước"
          disabled={!hasPrevious || loading}
          onClick={() => setCurrentSemesterPage((page) => page - 1)}
          className={[
            'rounded-md p-2 text-text-primary transition-colors',
            'hover:bg-bg-secondary disabled:cursor-not-allowed',
            'disabled:opacity-40',
          ].join(' ')}
        >
          <FiChevronLeft />
        </button>

        <span className="text-xs text-text-secondary">
          Trang {currentSemesterPage}
          {semesterDataList ? ` / ${totalPages}` : ''}
        </span>

        <button
          type="button"
          aria-label="Trang tiếp theo"
          disabled={!hasNext || loading}
          onClick={() => setCurrentSemesterPage((page) => page + 1)}
          className={[
            'rounded-md p-2 text-text-primary transition-colors',
            'hover:bg-bg-secondary disabled:cursor-not-allowed',
            'disabled:opacity-40',
          ].join(' ')}
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  )
}