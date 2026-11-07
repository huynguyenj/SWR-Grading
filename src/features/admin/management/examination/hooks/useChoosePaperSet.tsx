
import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const examinationPaperSet = z.object({
  paperSetIds: z
    .array(z.string())
    .min(1, 'Phải có ít nhất 1 đề'),
})

export type ExaminationPaperSets = z.infer<typeof examinationPaperSet>

export default function useChoosePaperSet({ examinationId }: { examinationId: string }) {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ExaminationPaperSets>({
    resolver: zodResolver(examinationPaperSet),
    defaultValues: {
      paperSetIds: [],
    },
  })
  const { execute, loading } = useApiCall()
  const paperSetList = useWatch({
    control,
    name: 'paperSetIds',
  })

  // Thêm Paper Set
  const addPaperSet = (paperSetId: string) => {
    const currentIds = getValues('paperSetIds')

    if (currentIds.includes(paperSetId)) return

    setValue('paperSetIds', [...currentIds, paperSetId], {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  // Xóa Paper Set theo ID
  const removePaperSet = (paperSetId: string) => {
    const currentIds = getValues('paperSetIds')

    setValue(
      'paperSetIds',
      currentIds.filter((id) => id !== paperSetId),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    )
  }

  const onSubmit = async (formData: ExaminationPaperSets) => {
    const response = await execute({
      apiUrl: `examinations/${examinationId}/paper-sets`,
      method: 'post',
      type: 'private',
      body: formData
    })
    if (response.error) {
      toast.error(response.error.message)
      return
    }
    toast.success('Chọn đề thi thành công')
  }

  return {
    control,
    handleSubmit,
    errors,
    addPaperSet,
    paperSetList: paperSetList ?? [],
    removePaperSet,
    onSubmit,
    loading
  }
}
