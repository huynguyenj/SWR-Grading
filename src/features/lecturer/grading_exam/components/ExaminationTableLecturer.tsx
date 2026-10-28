import { FiCalendar, FiClock, FiEye, FiZap } from 'react-icons/fi'

import { formatDate } from '@/utils/format'
import Button from '@/components/ui/button'
import useGetExaminationList from '@/features/admin/management/examination/hooks/useGetExaminationList'
import { EXAMINATION_KIND_LABEL, toShortTime, type ExaminationType } from '@/features/admin/management/examination/types/examination.type'
import ExamSessionStatusBadge from '@/features/admin/management/examination/components/ExaminationBadge'
import useCreateDiary from '../hooks/useCreateDiary'
import Pagination from '@/components/ui/pagination'
import { useState } from 'react'
import ViewExamSessionModal from '@/features/admin/management/examination/components/ViewExamSessionModal'


export default function ExaminationTableLecturer() {
    const {
      examinationDataList,
      currentExaminationPage,
      pageExaminationSize,
      setCurrentExaminationPage,
      setPageExaminationSize,
      refresh,
    } = useGetExaminationList()
    const { onAutoSubmitV2, loading: createLoading} = useCreateDiary({ onRefresh: refresh })
//     const { semesterDataList } = useGetSemester()
    const [viewExamSession, setViewExamSession] = useState<ExaminationType | null>(null)

//     function semesterName(id: string) {
//             if (!semesterDataList) return
//       return semesterDataList.items.find((s) => s.semesterId === id)?.name ?? '—'
//    }

  if (examinationDataList?.items.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <p className="text-sm text-text-muted">Không tìm thấy đợt thi nào phù hợp.</p>
      </div>
    )
  }

  return (
   <div>
      
      <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
            <table className="w-full text-sm">
            <thead>
            <tr className="border-b border-border-default bg-bg-muted/50 text-left">
                  <th className="px-4 py-3 font-medium text-text-secondary">Đợt thi</th>
                  <th className="px-4 py-3 font-medium text-text-secondary">Học kỳ</th>
                  <th className="px-4 py-3 font-medium text-text-secondary">Loại</th>
                  <th className="px-4 py-3 font-medium text-text-secondary">Thời gian</th>
                  <th className="px-4 py-3 font-medium text-text-secondary">Trạng thái</th>
                  <th className="px-4 py-3 font-medium text-text-secondary text-right">Thao tác</th>
            </tr>
            </thead>
            <tbody>
            {examinationDataList?.items.map((session) => (
                  <tr
                  key={session.examinationId}
                  className="border-b border-border-default last:border-0 hover:bg-bg-muted/40 transition-colors"
                  >
                  <td className="px-4 py-3">
                  <p className="font-medium text-text-primary">{session.name}</p>
                  <p className="mt-0.5 text-xs text-text-muted">{session.examinationCode}</p>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{}</td>
                  <td className="px-4 py-3 text-text-secondary">
                  {EXAMINATION_KIND_LABEL[session.examinationType] ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                  <div className="flex items-center gap-1.5">
                        <FiCalendar className="w-3.5 h-3.5 text-text-muted" />
                        {formatDate(session.startDate)}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-text-muted">
                        <FiClock className="w-3.5 h-3.5" />
                        {toShortTime(session.startTime)} · {session.durationMinutes} phút · mở trước{' '}
                        {session.beforeTimeMinutes} phút
                  </div>
                  </td>
                  <td className="px-4 py-3">
                  <ExamSessionStatusBadge status={session.status} />
                  </td>
                  <td className="flex justify-end px-4 py-3 text-right">
                        <button
                          onClick={() => setViewExamSession(session)}
                          className="rounded-md p-1.5 text-text-muted hover:bg-bg-mut  hover:text-text-primary transition-colors"
                          aria-label="Xem chi tiết"
                        >
                              <FiEye className="w-4 h-4" />
                        </button>
                        <Button
                              variant='basic'
                              disabled={createLoading}
                              className="inline-flex items-center gap-1.5 rounded-md border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-brand-orange hover:text-brand-orange transition-colors"
                              title="Tạo nhật ký nhanh (chưa có chức năng)"
                              onClick={() => onAutoSubmitV2(session)}
                        >
                        <FiZap className="w-3.5 h-3.5" />
                        Tạo nhật ký nhanh
                        </Button>
                  </td>
                  </tr>
            ))}
            </tbody>
            </table>
            
      </div>
        <Pagination
                currentPage={currentExaminationPage}
                pageSize={pageExaminationSize}
                onPageSizeChange={setPageExaminationSize}
                onPageChange={setCurrentExaminationPage}
                totalPages={examinationDataList?.totalPages}
                totalItems={examinationDataList?.totalCount}
        />
        <ViewExamSessionModal
            session={viewExamSession}
            onClose={() => setViewExamSession(null)}
        />
   </div>
  )
}