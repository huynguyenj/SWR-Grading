import useApiCall from "@/hooks/useApiCall"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import z from "zod"

const semesterSchema = z.object({
   semesterCode: z.string(),
   name: z.string(),
   startDate: z.date(),
   endDate: z.date()
})
type CreateSemesterType = z.infer<typeof semesterSchema>
export default function useCreateSemester() {
  const { execute, loading } = useApiCall()
  const { register, handleSubmit, formState: { errors } } = useForm<CreateSemesterType>({ resolver: zodResolver(semesterSchema) })
  const onSubmit = async (createSemesterForm: CreateSemesterType) => {
      const data = await execute({
            apiUrl: '/semester',
            method: 'post',
            type: 'private',
            body: createSemesterForm
      })
      console.log(data);
      toast.success('Tạo học kì thành công')
  }
  return { register, handleSubmit, errors, loading, onSubmit }
}
