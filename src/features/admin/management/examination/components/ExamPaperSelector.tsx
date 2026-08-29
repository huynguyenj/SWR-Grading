import type { ExamPaper, PaperSelectionMode } from "../types/examination.type"

interface ExamPaperSelectorProps {
  mode: PaperSelectionMode
  onModeChange: (mode: PaperSelectionMode) => void
  availablePapers: ExamPaper[]
  assignedPaperId: string
  onAssignedPaperChange: (id: string) => void
  randomPoolSize: number
  onRandomPoolSizeChange: (n: number) => void
  disabled: boolean
}

export default function ExamPaperSelector({
  mode,
  onModeChange,
  availablePapers,
  assignedPaperId,
  onAssignedPaperChange,
  randomPoolSize,
  onRandomPoolSizeChange,
  disabled,
}: ExamPaperSelectorProps) {
  return (
    <div className="space-y-3">
      {/* Toggle chế độ chọn đề */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onModeChange('assigned')}
          className={[
            'rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            mode === 'assigned'
              ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
              : 'border-border-default text-text-secondary hover:bg-bg-muted',
          ].join(' ')}
        >
          Chỉ định đề
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onModeChange('random')}
          className={[
            'rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            mode === 'random'
              ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
              : 'border-border-default text-text-secondary hover:bg-bg-muted',
          ].join(' ')}
        >
          Ngẫu nhiên
        </button>
      </div>

      {disabled && (
        <p className="text-xs text-text-muted">Chọn học kỳ trước để xem ngân hàng đề thi.</p>
      )}

      {!disabled && availablePapers.length === 0 && (
        <p className="text-xs text-warning">
          Học kỳ này chưa có đề thi nào được giảng viên upload.
        </p>
      )}

      {!disabled && availablePapers.length > 0 && mode === 'assigned' && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Chọn đề thi cụ thể
          </label>
          <select
            value={assignedPaperId}
            onChange={(e) => onAssignedPaperChange(e.target.value)}
            className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
          >
            <option value="">-- Chọn đề thi --</option>
            {availablePapers.map((paper) => (
              <option key={paper.id} value={paper.id}>
                {paper.fileName} (GV: {paper.uploadedBy})
              </option>
            ))}
          </select>
        </div>
      )}

      {!disabled && availablePapers.length > 0 && mode === 'random' && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Số đề lấy ngẫu nhiên từ ngân hàng
          </label>
          <input
            type="number"
            min={1}
            max={availablePapers.length}
            value={randomPoolSize}
            onChange={(e) => onRandomPoolSizeChange(Number(e.target.value))}
            className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15"
          />
          <p className="mt-1 text-xs text-text-muted">
            Ngân hàng đề của học kỳ này hiện có {availablePapers.length} đề. Hệ thống sẽ random
            cho mỗi thí sinh 1 đề trong số đề được chọn.
          </p>
        </div>
      )}
    </div>
  )
}