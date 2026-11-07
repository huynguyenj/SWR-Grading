import useApiCall from '@/hooks/useApiCall'
import { useEffect, useState } from 'react'
import type { ExaminationSessionType } from '../types/exam_session'

export default function useGetExaminationSessions({
  examinationId,
}: {
  examinationId: string
}) {
  const { execute, loading } = useApiCall<ExaminationSessionType[]>()
  const [examinationSessions, setExaminationSessions] = useState<
    ExaminationSessionType[]
  >([])

  useEffect(() => {
    if (!examinationId) {
      return
    }

    const getExaminationSessions = async () => {
      const response = await execute({
        apiUrl: `examinations/${examinationId}/sessions`,
        method: 'get',
        type: 'private',
      })

      setExaminationSessions(response.data)
    }

    getExaminationSessions()
  }, [examinationId])

  return { examinationSessions, loading }
}