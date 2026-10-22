import useApiCall from "@/hooks/useApiCall"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import z from "zod"

const semesterSchema = z.object({
   semesterCode: z.string(),
   name: z.string(),
   startDate: z.coerce.date(),
   endDate: z.coerce.date(),
   status: z.string()
}).refine((data) => data.endDate > data.startDate, {
      error: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
      path: ['endDate']
})
type UpdateSemesterInput = z.input<typeof semesterSchema>
type UpdateSemesterType = z.output<typeof semesterSchema>

export default function useUpdateSemester({ onRefresh }: { onRefresh: () => void }) {
  const { execute, loading } = useApiCall()
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<UpdateSemesterInput, unknown, UpdateSemesterType>({ resolver: zodResolver(semesterSchema) })
  const [selectedSemesterId, setSelectedSemesterId] = useState('')  
  const onSubmit = async (updateSemesterForm: UpdateSemesterType) => {
      const body = {
            semesterCode: updateSemesterForm.semesterCode,
            name: updateSemesterForm.name,
            startDate: updateSemesterForm.startDate.toISOString().split('T')[0],
            endDate: updateSemesterForm.endDate.toISOString().split('T')[0],
            status: Number(updateSemesterForm.status)
      }
      console.log(body);      
      await execute({
            apiUrl: `/semesters/${selectedSemesterId}`,
            method: 'put',
            type: 'private',
            body: body
      })
      onRefresh()
      toast.success('Cập nhật học kì thành công')
  }
  return { updateRegister: register, handleSubmit, errors, loading, onSubmit, reset, control, setSelectedSemesterId }
}
