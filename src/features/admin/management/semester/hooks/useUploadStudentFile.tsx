
import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const uploadStudentFileSchema = z.object({
  File: z
    .instanceof(File, {
      error: 'Vui lòng chọn file Excel',
    })
    .refine(
      (file) => /\.(xlsx|xls)$/i.test(file.name),
      'Chỉ hỗ trợ file Excel (.xlsx, .xls)',
    ),
})

export type UploadStudentFileInput = z.input<
  typeof uploadStudentFileSchema
>

export type UploadStudentFileType = z.output<
  typeof uploadStudentFileSchema
>

export default function useUploadStudentFile({
  semesterId,
  onRefresh,
}: {
  semesterId: string
  onRefresh?: () => void
}) {
  const { execute, loading } = useApiCall()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UploadStudentFileInput, unknown, UploadStudentFileType>({
    resolver: zodResolver(uploadStudentFileSchema),
    defaultValues: {
      File: undefined,
    },
  })

  const onSubmit = async (
    values: UploadStudentFileType,
  ): Promise<boolean> => {
    const formData = new FormData()
    formData.append('File', values.File)

    const response = await execute({
      apiUrl: `semesters/${semesterId}/students/import-excel`,
      method: 'post',
      type: 'private',
      body: formData,
    })

    if (response.error) {
      toast.error(response.error.message || 'Import sinh viên thất bại')
      return false
    }

    toast.success('Import danh sách sinh viên thành công')
    onRefresh?.()
    reset()

    return true
  }

  return {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    errors,
    loading,
    onSubmit,
    setFile: (file: File | null) => {
      setValue('File', file as File, {
        shouldValidate: true,
        shouldDirty: true,
      })
    },
  }
}
