import { FiHelpCircle, FiFile, FiCalendar, FiZap } from 'react-icons/fi'
import { formatDate } from '@/utils/format'
import PaperSetStatusBadge from '../../examination_materials/components/PaperSetStatusBadge'
import Pagination from '@/components/ui/pagination'
import useCreateDiary from '../hooks/useCreateDiary'
import Button from '@/components/ui/button'
import useGetPaperSetForLecturer from '../hooks/useGetPaperSetForLecturer'



export default function PaperSetTable() {
  const { currentPaperSetPage, pagePaperSetSize, paperSetDataList, refresh, setCurrentPaperSetPage, setPagePaperSetSize } = useGetPaperSetForLecturer()
  const { onAutoSubmit, loading: createLoading} = useCreateDiary({ onRefresh: refresh })
  if (paperSetDataList?.items.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <p className="text-sm text-text-muted">Chưa có bài kiểm tra nào.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary mb-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-default bg-bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium text-text-secondary">Tiêu đề</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Số câu hỏi</th>
              <th className="px-4 py-3 font-medium text-text-secondary">File đính kèm</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Mã đề</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Ngày tạo</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Trạng thái</th>
              <th className="px-4 py-3 font-medium text-text-secondary text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paperSetDataList?.items.map((paper) => (
              <tr
                key={paper.paperSetId}
                className="border-b border-border-default last:border-0 hover:bg-bg-muted/40 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-text-primary">{paper.description}</td>
                <td className="px-4 py-3 text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <FiHelpCircle className="w-3.5 h-3.5 text-text-muted" />
                    {paper.totalQuestions}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <FiFile className="w-3.5 h-3.5 text-text-muted" />
                    {paper.files[0].fileName}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <FiFile className="w-3.5 h-3.5 text-text-muted" />
                    {paper.paperSetCode}
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar className="w-3.5 h-3.5 text-text-muted" />
                    {formatDate(paper.createdDate)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <PaperSetStatusBadge status={paper.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  {/* Nút tượng trưng — chưa gắn chức năng thật */}
                  <Button
                    variant='basic'
                    disabled={createLoading}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-brand-orange hover:text-brand-orange transition-colors"
                    title="Tạo nhật ký nhanh (chưa có chức năng)"
                    onClick={() => onAutoSubmit(paper)}
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
          currentPage={currentPaperSetPage}
          pageSize={pagePaperSetSize}
          onPageSizeChange={setPagePaperSetSize}
          onPageChange={setCurrentPaperSetPage}
          totalPages={paperSetDataList?.totalPages}
          totalItems={paperSetDataList?.totalCount}
      />
    </div>
  )
}