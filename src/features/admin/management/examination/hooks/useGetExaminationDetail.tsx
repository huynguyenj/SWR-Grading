import useApiCall from '@/hooks/useApiCall'
import type { ExaminationDetailType } from '../types/examination.type'
import { useEffect, useState } from 'react'

export default function useGetExaminationDetail({ examinationId }: { examinationId: string }) {
  const { execute, loading } = useApiCall<ExaminationDetailType>()
  const [examinationDetail, setExaminationDetail] = useState<ExaminationDetailType>()
  useEffect(() => {
      const getExaminationDetail = async () => {
            const response = await execute({
                  apiUrl: `examinations/${examinationId}`,
                  method: 'get',
                  type: 'private'
            })
            setExaminationDetail(response.data)
      }
      getExaminationDetail()
  }, [examinationId])
  return { examinationDetail, loading }
}
