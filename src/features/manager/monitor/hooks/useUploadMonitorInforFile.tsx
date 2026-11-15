
import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const uploadMonitorFileSchema = z.object({
  File: z
    .instanceof(File, {
      error: 'Vui lòng chọn file Excel',
    })
    .refine(
      (file) => /\.(xlsx|xls)$/i.test(file.name),
      'Chỉ hỗ trợ file Excel (.xlsx, .xls)',
    ),
})

export type UploadMonitorFileInput = z.input<
  typeof uploadMonitorFileSchema
>

export type UploadMonitorFileType = z.output<
  typeof uploadMonitorFileSchema
>

export default function useUploadMonitorInformationFile({
  onRefresh,
}: {
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
  } = useForm<UploadMonitorFileInput, unknown, UploadMonitorFileType>({
    resolver: zodResolver(uploadMonitorFileSchema),
    defaultValues: {
      File: undefined,
    },
  })

  const onSubmit = async (
    values: UploadMonitorFileType,
  ): Promise<boolean> => {
    const formData = new FormData()
    formData.append('File', values.File)

    const response = await execute({
      apiUrl: `manager/monitors/import-excel`,
      method: 'post',
      type: 'private',
      body: formData,
    })

    if (response.error) {
      toast.error(response.error.message || 'Upload giám khảo thất bại')
      return false
    }

    toast.success('Upload danh sách giám khảo thành công')
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
