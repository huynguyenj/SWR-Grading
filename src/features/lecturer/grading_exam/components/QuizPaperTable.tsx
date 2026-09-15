import { FiHelpCircle, FiFile, FiCalendar, FiZap } from 'react-icons/fi'
import type { QuizPaper } from '../types/grading-exam.type'
import QuizStatusBadge from './QuizBadge'

interface QuizPapersTableProps {
  quizzes: QuizPaper[]
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function QuizPapersTable({ quizzes }: QuizPapersTableProps) {
  if (quizzes.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-primary py-16 text-center">
        <p className="text-sm text-text-muted">Chưa có bài kiểm tra nào.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-primary">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-default bg-bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium text-text-secondary">Tiêu đề</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Số câu hỏi</th>
            <th className="px-4 py-3 font-medium text-text-secondary">File đính kèm</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Ngày tạo</th>
            <th className="px-4 py-3 font-medium text-text-secondary">Trạng thái</th>
            <th className="px-4 py-3 font-medium text-text-secondary text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr
              key={quiz.id}
              className="border-b border-border-default last:border-0 hover:bg-bg-muted/40 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-text-primary">{quiz.title}</td>
              <td className="px-4 py-3 text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <FiHelpCircle className="w-3.5 h-3.5 text-text-muted" />
                  {quiz.totalQuestions}
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <FiFile className="w-3.5 h-3.5 text-text-muted" />
                  {quiz.fileDocs}
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <FiCalendar className="w-3.5 h-3.5 text-text-muted" />
                  {formatDate(quiz.createDate)}
                </div>
              </td>
              <td className="px-4 py-3">
                <QuizStatusBadge status={quiz.status} />
              </td>
              <td className="px-4 py-3 text-right">
                {/* Nút tượng trưng — chưa gắn chức năng thật */}
                <button
                  className="inline-flex items-center gap-1.5 rounded-md border border-border-default px-3 py-1.5 text-xs font-medium text-text-secondary hover:border-brand-orange hover:text-brand-orange transition-colors"
                  title="Tạo nhật ký nhanh (chưa có chức năng)"
                >
                  <FiZap className="w-3.5 h-3.5" />
                  Tạo nhật ký nhanh
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}