import { useMemo, useState } from 'react'
import type { ItemDetail } from '../types/submission.type'
import useUpdateSubmissionItemDetail from '../hooks/useUpdateSubmissionItemDetail'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { FiEdit, FiX } from 'react-icons/fi'

type LecturerGradingSectionType = {
  submissionItemDetail: ItemDetail[]
  submissionId: string
  onRefresh: (submissionId: string) => void
  lecturerComment?: string
}

export default function LecturerGradingSection({
  submissionItemDetail,
  onRefresh,
  submissionId,
  lecturerComment
}: LecturerGradingSectionType) {
  const [editingDetailId, setEditingDetailId] = useState<string | null>(null)
  const {
    handleSubmitItem,
    onSubmit,
    resetItems,
    updateItemLoading,
    updateItemRegister,
  } = useUpdateSubmissionItemDetail()

  const lecturerGradingSortedList = useMemo(() => {
    return [...submissionItemDetail].sort((a, b) => {
      const numA = Number(
        a.questionTitle.match(/^Question\s+(\d+)/i)?.[1] ?? 0,
      )

      const numB = Number(
        b.questionTitle.match(/^Question\s+(\d+)/i)?.[1] ?? 0,
      )

      return numA - numB
    })
  }, [submissionItemDetail])
  const totalScore = useMemo(() => {
      return submissionItemDetail.reduce((sum, currentVal) => {
            return sum + currentVal.score
      } , 0)
  }, [submissionItemDetail])
  const handleEdit = (item: ItemDetail) => {
    setEditingDetailId(item.detailId)
    resetItems({
      score: item.score ?? 0,
      comment: item.comment ?? '',
      notRecognized: '',
    })
  }

  const handleCancel = () => {
    setEditingDetailId(null)
    resetItems()
  }

  const handleUpdate = (detailId: string) => {
    return handleSubmitItem(async (values) => {
      const success = await onSubmit(detailId, values)
      if (success) {
        setEditingDetailId(null)
        resetItems()
        onRefresh(submissionId)
      }
    })()
  }

  return (
    <div className="flex flex-col max-h-[70vh] overflow-y-auto px-3 py-5">
      <div>
        <p className="text-xs font-medium text-text-muted">Điểm giáo viên</p>
        <p className="text-2xl font-semibold text-text-primary">
                  {totalScore.toFixed(1)}
        <span className="ml-1 text-sm font-normal text-text-muted">/ 10</span>
        </p>
      </div>
      {lecturerGradingSortedList.map((item) => {
        const isEditing = editingDetailId === item.detailId
        return (
          <div
            key={item.detailId}
            className="rounded-md bg-bg-muted/50 p-3 m-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                {!isEditing && (
                  <Button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="bg-brand-wine px-2 py-2 rounded-full"
                  >
                    <FiEdit className='size-3'/>
                  </Button>
                )}

                <span className="text-sm text-text-primary">
                  {item.questionTitle}
                </span>
              </div>

              {!isEditing && (
                <span className="shrink-0 text-sm font-semibold text-text-primary">
                  {item.score}
                </span>
              )}
            </div>

            {!isEditing && item.comment && (
              <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                {item.comment}
              </p>
            )}

            {isEditing && (
              <form
                className="mt-4 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  void handleUpdate(item.detailId)
                }}
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-primary">
                    Điểm
                  </label>

                  <Input
                    {...updateItemRegister('score', {
                      valueAsNumber: true,
                    })}
                    size="basic"
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-text-primary">
                    Nhận xét
                  </label>

                  <textarea
                    {...updateItemRegister('comment')}
                    rows={5}
                    placeholder="Nhận xét về bài làm..."
                    className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 resize-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-text-primary">
                    Nội dung chưa nhận diện
                  </label>

                  <textarea
                    {...updateItemRegister('notRecognized')}
                    rows={3}
                    placeholder="Nhập nội dung chưa được nhận diện..."
                    className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/15 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="basic"
                    onClick={handleCancel}
                    disabled={updateItemLoading}
                  >
                    <FiX className="mr-1" />
                    Hủy
                  </Button>

                  <Button
                    type="submit"
                    disabled={updateItemLoading}
                  >
                    {updateItemLoading
                      ? 'Đang cập nhật...'
                      : 'Cập nhật'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        )
      })}
         {lecturerComment &&
               <div>
                  <p className="mb-1.5 text-xs font-medium text-text-muted">Nhận xét tổng quan</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{lecturerComment}</p>
                </div>
         }
    </div>
  )
}