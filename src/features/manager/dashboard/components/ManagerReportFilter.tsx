import { FiSearch } from 'react-icons/fi'

import SemesterSelect from '@/features/admin/management/semester/components/SemesterSelect'
import ExaminationSelect from '@/features/manager/dashboard/components/ExaminationSelect'

interface ManagerReportFilterProps {
  semesterId: string
  examinationId: string
  search: string
  onSemesterChange: (value: string) => void
  onExaminationChange: (value: string) => void
  onSearchChange: (value: string) => void
}

export default function ManagerReportFilter({
  semesterId,
  examinationId,
  search,
  onSemesterChange,
  onExaminationChange,
  onSearchChange,
}: ManagerReportFilterProps) {
  return (
    <div className="rounded-lg border border-border-default bg-bg-primary p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.4fr]">
        {/* Semester */}
        <SemesterSelect
          value={semesterId}
          onChange={onSemesterChange}
        />

        {/* Examination */}
        <ExaminationSelect
          value={examinationId}
          onChange={onExaminationChange}
        />

        {/* Search */}
        <div>
          <label
            htmlFor="monitor-search"
            className="mb-2 block text-sm font-medium text-text-primary"
          >
            Tìm kiếm Monitor
          </label>

          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />

            <input
              id="monitor-search"
              type="text"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Tên, mã nhân viên hoặc email..."
              className={[
                'h-10 w-full rounded-md border border-border-default',
                'bg-bg-primary pl-9 pr-3 text-sm text-text-primary',
                'placeholder:text-text-muted',
                'outline-none transition-colors',
                'focus:border-brand-orange focus:ring-2',
                'focus:ring-brand-orange/20',
              ].join(' ')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}