import PaperSetStatusBadge from "@/features/lecturer/examination_materials/components/PaperSetStatusBadge";
import type { PaperSetType } from "@/features/lecturer/examination_materials/types/exam_material.type";
import { formatDate } from "@/utils/format";
import { FiBookOpen, FiFileText, FiUser } from "react-icons/fi";

export default function ExaminationPaperSetCard( {paperSet} : {paperSet: PaperSetType}) {
    return (
      <div
        key={paperSet.paperSetId}
        className="rounded-lg border border-border-default bg-bg-primary p-4 space-y-3"
      >
        {/* Thông tin bộ đề */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <FiFileText className="h-4 w-4 shrink-0 text-brand-orange" />
              <h4 className="font-semibold text-text-primary">
                {paperSet.paperSetCode}
              </h4>
            </div>

            <p className="mt-1 text-sm text-text-secondary">
              {paperSet.description || 'Không có mô tả'}
            </p>
          </div>

              <PaperSetStatusBadge status={paperSet.status} />
        </div>

        {/* Số lượng câu hỏi */}
        <div className="flex items-center gap-2 rounded-md bg-bg-muted/50 px-3 py-2">
          <FiBookOpen className="h-4 w-4 text-text-muted" />
          <span className="text-sm text-text-secondary">
            Tổng số câu hỏi:
          </span>
          <span className="text-sm font-semibold text-text-primary">
            {paperSet.totalQuestions}
          </span>
        </div>

        {/* Giảng viên */}
        <div className="flex items-start gap-2">
          <FiUser className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />

          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary">
              {paperSet.lecturerName || 'Chưa có thông tin giảng viên'}
            </p>
            <p className="text-xs text-text-muted">
              Mã giảng viên: {paperSet.lecturerCode || '—'}
            </p>
          </div>
        </div>

        {/* Ngày tạo và cập nhật */}
        <div className="grid grid-cols-1 gap-2 border-t border-border-default pt-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-text-muted">Ngày tạo</p>
            <p className="mt-1 text-sm text-text-secondary">
              {paperSet.createdDate ? formatDate(paperSet.createdDate) : '—'}
            </p>
          </div>

          <div>
            <p className="text-xs text-text-muted">Cập nhật lần cuối</p>
            <p className="mt-1 text-sm text-text-secondary">
              {paperSet.updatedDate ? formatDate(paperSet.updatedDate) : '—'}
            </p>
          </div>
        </div>
      </div>
    )
  }