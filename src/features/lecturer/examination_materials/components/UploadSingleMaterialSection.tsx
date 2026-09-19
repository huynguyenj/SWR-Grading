import { useEffect } from 'react'
import { FiCalendar, FiTrash2 } from 'react-icons/fi'
import SemesterStatusBadge from '@/features/admin/management/semester/components/SemesterBadge'
import Input from '@/components/ui/input'
import TextArea from '@/components/ui/textarea'
import { formatDate } from '@/utils/format'
import type { SemesterType } from '@/features/admin/management/semester/types/semester'
import useUploadExamMaterial from '../hooks/useUploadExamMaterial'
import SingleFileUploadField from '@/components/ui/SingleFileUpload'
import { DOCX_ACCEPT } from './UploadDocumentModal'
import Button from '@/components/ui/button'
import useReadFile from '../hooks/useReadFile'

interface UploadSingleMaterialProps {
  semester: SemesterType
  isSelected: boolean
  /** Gọi lại khi upload thành công — dùng để page refetch danh sách/đóng modal */
  onUploaded?: () => void
  onClose: () => void
}

export default function UploadSingleMaterialSection({ isSelected, semester, onUploaded, onClose }: UploadSingleMaterialProps) {
   const {
      register,
      errors,
      reset,
      watch,
      loading,
      onSubmit,
      questionFields,
      removeQuestion,
      setQuestionFile,
      setRubricFile,
      setAnswerTemplateFile,
    } = useUploadExamMaterial()
   const questionFile = watch('Question')
   const rubricFile = watch('AnswerRubric')
   const answerTemplateFile = watch('AnswerTemplate')
   const { handlePreviewFile, questionList } = useReadFile()
  // Mỗi khi mở modal cho 1 học kỳ khác -> reset form + gán sẵn semesterId
  useEffect(() => {
    if (isSelected && semester) {
      reset({
        Description: '',
        SemesterId: semester.semesterId,
      })
    }
  }, [isSelected, semester, reset])
  useEffect(() => {
    const updateQuestionField = () => {
      if (questionList.length === 0) return
      // questionList.forEach((q) => {
      //   appendQuestion()
      // })
      reset({
        SemesterId: semester.semesterId,
        Question: questionFile,
        Questions: questionList.map((q) => {
          return {
            title: q.title,
            content: q.content,
            point: String(q.point)
          }
        })
      })
             
    }
    updateQuestionField()
  }, [questionList])
  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit()
    onUploaded?.()
    onClose()
  }
  
  return (
      <>
            <form
               onSubmit={handleFormSubmit}
               className="px-5 py-4 space-y-5 max-h-[80vh] overflow-y-auto"
             >
               {/* Thông tin tóm tắt học kỳ — chỉ xem, không sửa được */}
               <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-md bg-bg-muted/50 px-4 py-3 text-sm text-text-secondary">
                 <span className="flex items-center gap-1.5">
                   <FiCalendar className="w-3.5 h-3.5 text-text-muted" />
                   {formatDate(semester.startDate)} – {formatDate(semester.endDate)}
                 </span>
                 <SemesterStatusBadge status={semester.status} />
               </div>
    
               {/* Upload 3 file bắt buộc: đề / rubric / đáp án */}
               <div>
                 <h3 className="mb-2 text-sm font-semibold text-text-primary">Tài liệu học kỳ</h3>
                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
                  <div className='flex items-start justify-between'>
                    <SingleFileUploadField
                      label="File đề (.docx)"
                      file={questionFile}
                      onChange={setQuestionFile}
                      accept={DOCX_ACCEPT}
                      error={errors.Question?.message}
                    />
                    <Button
                      type='button'
                      onClick={() => handlePreviewFile(questionFile)}
                      disabled={questionFile == null}
                    >
                      Kiểm tra nội dung file
                    </Button>
                  </div>
                  <div>
                   <SingleFileUploadField
                     label="File rubric (.xlsx)"
                     file={rubricFile}
                     onChange={setRubricFile}
                     accept=".pdf,.doc,.docx,.xlsx"
                     error={errors.AnswerRubric?.message}
                   />
                   <SingleFileUploadField
                     label="File đáp án (.docx)"
                     file={answerTemplateFile}
                     onChange={setAnswerTemplateFile}
                     accept={DOCX_ACCEPT}
                     error={errors.AnswerTemplate?.message}
                   />
                  </div>
                 </div>
               </div>
              {/* Danh sách câu hỏi — thêm/xóa động */}
              { questionList.length > 0 &&
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-text-primary">Danh sách câu hỏi</h3>
                    {/* <button
                      type="button"
                      onClick={appendQuestion}
                      className="flex items-center gap-1.5 text-sm font-medium text-brand-orange hover:text-brand-rust transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Import file câu hỏi
                    </button> */}
                  </div>
      
                  <div className="space-y-3">
                    {questionFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="rounded-md border border-border-default p-3 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-text-muted">
                            Câu hỏi {index + 1}
                          </span>
                          {questionFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeQuestion(index)}
                              className="text-text-muted hover:text-danger transition-colors"
                              aria-label={`Xóa câu hỏi ${index + 1}`}
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
      
                        <div>
                          <Input
                            size="basic"
                            placeholder="Tiêu đề câu hỏi"
                            {...register(`Questions.${index}.title`)}
                            error={errors.Questions?.[index]?.title?.message}
                          />
                        </div>
      
                        <div>
                          <TextArea
                            placeholder="Nội dung câu hỏi"
                            rows={2}
                            {...register(`Questions.${index}.content`)}
                          />
                          {errors.Questions?.[index]?.content && (
                            <p className="mt-1 text-xs text-danger">
                              {errors.Questions[index]?.content?.message}
                            </p>
                          )}
                        </div>
      
                        <div className="w-32">
                          <Input
                            size="basic"
                            placeholder="Điểm"
                            {...register(`Questions.${index}.point`)}
                            error={errors.Questions?.[index]?.title?.message}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
      
                  {errors.Questions?.message && (
                    <p className="mt-1 text-xs text-danger">{errors.Questions.message}</p>
                  )}
                </div>
              
              }
              {/* Thông tin chung bài thi */}
               <div>
                 <label className="block text-sm font-medium text-text-primary mb-1.5">
                   Nội dung
                 </label>
                 <TextArea
                   placeholder="VD: Đề thi bao gồm các câu hỏi về diagram và quy trình..."
                   rows={3}
                   {...register('Description')}
                 />
                 {errors.Description && (
                   <p className="mt-1 text-xs text-danger">{errors.Description.message}</p>
                 )}
               </div>
               <div className="flex justify-end gap-2 border-t border-border-default pt-4">
                 <Button
                   variant='basic'
                   type="button"
                   onClick={onClose}
                 >
                   Hủy
                 </Button>
                 <Button
                   type="submit"
                   disabled={loading}
                 >
                   {loading ? 'Đang tải lên...' : 'Upload'}
                 </Button>
               </div>
             </form>
      </>
  )
}
