import { FiFileText } from 'react-icons/fi'
import type { ReferenceFile } from '../types/grading-exam.type'

interface ReferenceFilesSectionProps {
  examPaperFile?: ReferenceFile
  rubricFile?: ReferenceFile
  answerFile?: ReferenceFile
  // onFileClick: (label: string, file: ReferenceFile) => void
}

interface FileSlotProps {
  label: string
  file?: ReferenceFile
  // onClick: () => void
}

function FileSlot({ label, file }: FileSlotProps) {
  if (!file) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-dashed border-border-default px-4 py-3 opacity-60">
        <FiFileText className="w-5 h-5 text-text-muted shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-muted">{label}</p>
          <p className="text-sm text-text-muted">Chưa có file</p>
        </div>
      </div>
    )
  }

  return (
    <button
      // onClick={onClick}
      className="flex items-center gap-3 rounded-md border border-border-default bg-bg-primary px-4 py-3 text-left transition-colors hover:border-brand-orange hover:bg-brand-orange/5"
    >
      <FiFileText className="w-5 h-5 text-brand-orange shrink-0" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-text-muted">{label}</p>
        <p className="text-sm font-medium text-text-primary truncate">{file.fileName}</p>
      </div>
    </button>
  )
}

export default function ReferenceFilesSection({
  examPaperFile,
  rubricFile,
  answerFile,
  // onFileClick,
}: ReferenceFilesSectionProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
      <FileSlot
        label="Đề thi"
        file={examPaperFile}
        // onClick={() => examPaperFile && onFileClick('Đề thi', examPaperFile)}
      />
      <FileSlot
        label="Rubric chấm điểm"
        file={rubricFile}
        // onClick={() => rubricFile && onFileClick('Rubric chấm điểm', rubricFile)}
      />
      <FileSlot
        label="Đáp án"
        file={answerFile}
        // onClick={() => answerFile && onFileClick('Đáp án', answerFile)}
      />
    </div>
  )
}