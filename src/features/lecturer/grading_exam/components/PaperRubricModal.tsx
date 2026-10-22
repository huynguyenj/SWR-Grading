import { useEffect, useMemo } from 'react'
import Modal from '@/components/ui/modal'
import type { RubricType } from '../types/rubric.type'
import useGetRubrics from '../hooks/useGetRubric'
import { formatPoint } from '@/utils/format'

interface PaperRubricModalProps {
  paperSetId: string | null
  onClose: () => void
}

/** 0.1 + 0.2 trong JS ra 0.30000000000000004 nên làm tròn trước khi hiển thị */

/** guideline có dạng "Dạng trả lời | Hướng dẫn chấm" — tách ra để hiển thị 2 cột riêng.
 *  Không có dấu " | " thì coi toàn bộ là hướng dẫn chấm. */
function splitGuideline(guideline: string) {
  const index = guideline.indexOf(' | ')
  if (index === -1) return { kind: '', description: guideline }
  return { kind: guideline.slice(0, index), description: guideline.slice(index + 3) }
}

/** BE trả rubric không theo thứ tự câu hỏi -> sắp theo số trong "Question N: ..." */
function questionNumber(rubric: RubricType) {
  const match = rubric.questions[0]?.title.match(/(\d+)/)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

export default function PaperRubricModal({ paperSetId, onClose }: PaperRubricModalProps) {
  const { rubrics, loading, handleGetRubrics } = useGetRubrics()

  useEffect(() => {
    if (paperSetId) {
      handleGetRubrics(paperSetId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperSetId])

  const sortedRubrics = useMemo(
    () => [...(rubrics ?? [])].sort((a, b) => questionNumber(a) - questionNumber(b)),
    [rubrics],
  )
  const totalPoint = sortedRubrics.reduce((sum, r) => sum + r.point, 0)

  return (
    <Modal open={paperSetId !== null} onClose={onClose} title="Rubric chấm điểm" maxWidth="full">
      <div className="max-h-[75vh] space-y-5 overflow-y-auto px-5 py-4">
        {loading || !rubrics ? (
          <p className="py-8 text-center text-sm text-text-muted">Đang tải rubric...</p>
        ) : sortedRubrics.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted">
            Bộ đề này chưa có rubric nào.
          </p>
        ) : (
          <>
            <p className="text-sm text-text-secondary">
              {sortedRubrics.length} câu hỏi · tổng{' '}
              <span className="font-semibold text-text-primary">{formatPoint(totalPoint)}</span> điểm
            </p>

            {sortedRubrics.map((rubric) => (
              <section
                key={rubric.rubricId}
                className="overflow-hidden rounded-lg border border-border-default"
              >
                <div className="flex items-center justify-between gap-3 border-b border-border-default bg-bg-muted/50 px-4 py-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary">
                      {rubric.questions.map((q) => q.title).join(' · ') || 'Rubric'}
                    </h3>
                    {rubric.diagramName && (
                      <p className="mt-0.5 text-xs text-text-muted">Sơ đồ: {rubric.diagramName}</p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-medium text-brand-orange">
                    {formatPoint(rubric.point)} điểm
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border-default text-left">
                        <th className="px-4 py-2.5 font-medium text-text-secondary">Mục</th>
                        <th className="px-4 py-2.5 font-medium text-text-secondary">Dạng trả lời</th>
                        <th className="px-4 py-2.5 font-medium text-text-secondary">
                          Hướng dẫn chấm
                        </th>
                        <th className="px-4 py-2.5 text-right font-medium text-text-secondary">
                          Điểm
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rubric.subItems.map((item) => {
                        const { kind, description } = splitGuideline(item.guideline)
                        return (
                          <tr
                            key={item.subId}
                            className="border-b border-border-default align-top last:border-0"
                          >
                            <td className="whitespace-nowrap px-4 py-2.5 font-medium text-text-primary">
                              {item.subId}
                            </td>
                            <td className="px-4 py-2.5">
                              {kind ? (
                                <span className="inline-flex whitespace-nowrap rounded-md bg-bg-muted px-2 py-0.5 text-xs text-text-secondary">
                                  {kind}
                                </span>
                              ) : (
                                <span className="text-text-muted">—</span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 leading-relaxed text-text-secondary">
                              {description || <span className="text-text-muted">—</span>}
                            </td>
                            <td className="whitespace-nowrap px-4 py-2.5 text-right font-semibold text-text-primary">
                              {formatPoint(item.point)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </Modal>
  )
}