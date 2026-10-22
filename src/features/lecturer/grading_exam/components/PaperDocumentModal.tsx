import { useEffect, useMemo } from 'react'
import Modal from '@/components/ui/modal'
import useGetQuestions from '../hooks/useGetQuestion'
import { parseQuestionContent } from '../utils/data_resolver'
import type { PaperQuestionType } from '../types/question.type'
import { formatPoint } from '@/utils/format'

interface PaperSetDocumentsModalProps {
  /** null = đóng modal */
  paperSetId: string | null
  onClose: () => void
}


/** BE trả câu hỏi không theo thứ tự -> sắp theo số trong "Question N: ..." */
function questionNumber(question: PaperQuestionType) {
  const match = question.title.match(/(\d+)/)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

export default function PaperSetDocumentsModal({
  paperSetId,
  onClose,
}: PaperSetDocumentsModalProps) {
  const { questions, loading, handleGetQuestions } = useGetQuestions()

  useEffect(() => {
    if (paperSetId) {
      handleGetQuestions(paperSetId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperSetId])

  const sortedQuestions = useMemo(
    () => [...(questions ?? [])].sort((a, b) => questionNumber(a) - questionNumber(b)),
    [questions],
  )
  const totalPoint = sortedQuestions.reduce((sum, q) => sum + q.point, 0)

  return (
    <Modal open={paperSetId !== null} onClose={onClose} title="File đề" maxWidth="full">
      <div className="max-h-[75vh] space-y-5 overflow-y-auto px-5 py-4">
        {loading || !questions ? (
          <p className="py-8 text-center text-sm text-text-muted">Đang tải đề thi...</p>
        ) : sortedQuestions.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted">
            Bộ đề này chưa có câu hỏi nào.
          </p>
        ) : (
          <>
            <p className="text-sm text-text-secondary">
              {sortedQuestions.length} câu hỏi · tổng{' '}
              <span className="font-semibold text-text-primary">{formatPoint(totalPoint)}</span> điểm
            </p>

            {sortedQuestions.map((question) => {
              const { intro, items } = parseQuestionContent(question.title, question.content)

              return (
                <section
                  key={question.questionId}
                  className="overflow-hidden rounded-lg border border-border-default"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-border-default bg-bg-muted/50 px-4 py-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-text-primary">{question.title}</h3>
                      {question.diagramName && (
                        <p className="mt-0.5 text-xs text-text-muted">
                          Sơ đồ: {question.diagramName}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-medium text-brand-orange">
                      {formatPoint(question.point)} điểm
                    </span>
                  </div>

                  <div className="space-y-3 px-4 py-3">
                    {intro.length === 0 && items.length === 0 && (
                      <p className="text-sm text-text-muted">Câu hỏi chưa có nội dung.</p>
                    )}

                    {intro.map((paragraph, i) => (
                      <p key={i} className="text-sm leading-relaxed text-text-secondary">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {items.length > 0 && (
                    <div className="overflow-x-auto border-t border-border-default">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border-default text-left">
                            <th className="px-4 py-2.5 font-medium text-text-secondary">Ý</th>
                            <th className="px-4 py-2.5 font-medium text-text-secondary">Yêu cầu</th>
                            <th className="px-4 py-2.5 text-right font-medium text-text-secondary">
                              Điểm
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-border-default align-top last:border-0"
                            >
                              <td className="whitespace-nowrap px-4 py-2.5 font-medium text-text-primary">
                                {item.id}
                              </td>
                              <td className="px-4 py-2.5 leading-relaxed text-text-secondary">
                                {item.text}
                              </td>
                              <td className="whitespace-nowrap px-4 py-2.5 text-right font-semibold text-text-primary">
                                {item.point === null ? (
                                  <span className="font-normal text-text-muted">—</span>
                                ) : (
                                  formatPoint(item.point)
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              )
            })}
          </>
        )}
      </div>
    </Modal>
  )
}