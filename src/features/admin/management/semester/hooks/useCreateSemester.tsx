import useApiCall from "@/hooks/useApiCall"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import z from "zod"

const semesterSchema = z.object({
   semesterCode: z.string(),
   name: z.string(),
   startDate: z.coerce.date(),
   endDate: z.coerce.date()
}).refine((data) => data.endDate > data.startDate, {
      error: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
      path: ['endDate']
})
type CreateSemesterInput = z.input<typeof semesterSchema>
type CreateSemesterType = z.output<typeof semesterSchema>

export default function useCreateSemester({ onRefresh }: { onRefresh: () => void }) {
  const { execute, loading } = useApiCall()
  const { register, handleSubmit, formState: { errors } } = useForm<CreateSemesterInput, unknown, CreateSemesterType>({ resolver: zodResolver(semesterSchema) })
  const onSubmit = async (createSemesterForm: CreateSemesterType) => {
      const body = {
            semesterCode: createSemesterForm.semesterCode,
            name: createSemesterForm.name,
            startDate: createSemesterForm.startDate.toISOString().split('T')[0],
            endDate: createSemesterForm.endDate.toISOString().split('T')[0],
            status: 0
      }
      console.log(body);
      
      const data = await execute({
            apiUrl: '/semesters',
            method: 'post',
            type: 'private',
            body: body
      })
      console.log(data);
      onRefresh()
      toast.success('Tạo học kì thành công')
  }
  return { register, handleSubmit, errors, loading, onSubmit }
}
