import useApiCall from "@/hooks/useApiCall"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import z from "zod"

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
 
export const questionSchema = z.object({
  title: z.string().min(1, 'Tiêu đề câu hỏi không được để trống'),
  content: z.string().min(1, 'Nội dung câu hỏi không được để trống'),
  point: z.string().min(1, 'Điểm không được để trống'),
})

export const examMaterialSchema = z.object({
      Description: z.string(),
      SemesterId: z.string().min(1, 'Hãy chọn học kì phù hợp'),
      Questions: z.array(questionSchema).min(1, 'Phải có ít nhất 1 câu hỏi'),
      Question: z.instanceof(File, { error: 'File câu hỏi không được để trống' }).refine((file) => file.type === DOCX_MIME, 'File câu hỏi chỉ được upload dạng word'),
      AnswerRubric: z.instanceof(File, { error: 'File rubric không được để trống' }),
      AnswerTemplate: z.instanceof(File, { error: 'File answer không được để trống' }).refine((file) => file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'File anser chỉ được upload dạng word'),
})

const emptyQuestion = { title: '', content: '', point: '' }
type ExamMaterialFormType = z.infer<typeof examMaterialSchema>
export default function useUploadExamMaterial() {
  const { control, formState: { errors }, handleSubmit, register, reset, watch, setValue } = useForm<ExamMaterialFormType>({ resolver: zodResolver(examMaterialSchema) })
  const { fields, append, remove } = useFieldArray({ control, name: 'Questions' })
  const { execute, loading } = useApiCall()
  const onSubmit = handleSubmit(async (values) => {
    // Có file trong payload -> phải gửi dạng multipart/form-data, không gửi JSON thường
    const formData = new FormData()
    formData.append('Description', values.Description)
    formData.append('SemesterId', values.SemesterId)
    values.Questions.forEach((question, index) => {
      formData.append(
      `Questions[${index}].Title`,
      question.title
      )

      formData.append(
      `Questions[${index}].Content`,
      question.content
      )

      formData.append(
      `Questions[${index}].Point`,
      question.point
      )
      })
    formData.append('Question', values.Question)
    formData.append('AnswerRubric', values.AnswerRubric)
    formData.append('AnswerTemplate', values.AnswerTemplate)
    for (const [key, value] of formData.entries()) {
       console.log(key, value);
      }

    const response = await execute({
      apiUrl: 'exam-materials',
      method: 'post',
      type: 'private',
      body: formData,
    })
    if (response.error) {
      toast.error(response.error)
      return
    }
    toast.success('Upload thành công')
    reset()
  })
 
  return {
   control,
    register,
    errors,
    reset,
    watch,
    loading,
    onSubmit,
    // questions (useFieldArray)
    questionFields: fields,
    appendQuestion: () => append(emptyQuestion),
    removeQuestion: remove,
    // 3 file field — input file thường không hoạt động tốt với register() mặc định
    // nên set giá trị thủ công qua setValue thay vì spread register('question') vào <input type="file">
    setQuestionFile: (file: File | null) =>
      setValue('Question', file as File, { shouldValidate: true }),
    setRubricFile: (file: File | null) =>
      setValue('AnswerRubric', file as File, { shouldValidate: true }),
    setAnswerTemplateFile: (file: File | null) =>
      setValue('AnswerTemplate', file as File, { shouldValidate: true }),
  }
  }

