import useApiCall from "@/hooks/useApiCall"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import z from "zod"
import type { PaperSetType } from "../../examination_materials/types/exam_material.type"

const diarySchema = z.object({
   paperSetId: z.string(),
   name: z.string().min(1, 'Tên không được để trống'),
   content: z.string()
})

type DiarySchemaType = z.infer<typeof diarySchema>

export default function useCreateDiary() {
  const { formState: { errors }, register, handleSubmit, reset } = useForm<DiarySchemaType>({ resolver: zodResolver(diarySchema) })
  const { execute, loading } = useApiCall()
  const onManualSubmit = async (formData: DiarySchemaType) => {
      const response = await execute({
            apiUrl: 'grading-diaries',
            method: 'post',
            type: 'private',
            body: formData
      }) 
      if (response.error) {
            toast.error(response.error.message)
            return
      }
      toast.success('Tạo nhật kí thành công')
  }
  const onAutoSubmit = async (paperSet: PaperSetType) => {
      const formData: DiarySchemaType = {
            content: `Nhật kí chấm điểm của đề ${paperSet.paperSetCode}`,
            name: `Đề ${paperSet.paperSetCode} - ${paperSet.totalQuestions}`,
            paperSetId: paperSet.paperSetId
      }
      const response = await execute({
            apiUrl: 'grading-diaries',
            method: 'post',
            type: 'private',
            body: formData
      }) 
      if (response.error) {
            toast.error(response.error.message)
            return
      }
      toast.success('Tạo nhật kí thành công')
  }
  return { onAutoSubmit, onManualSubmit, reset, register, errors, handleSubmit, loading }
}
