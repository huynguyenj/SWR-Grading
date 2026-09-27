import useApiCall from "@/hooks/useApiCall"
import type { SubmissionDetail } from "../types/grading-exam.type"
import { useState } from "react"
import { toast } from "react-toastify"

export default function useGetGradingDiaryDetail() {
  const { execute, loading } = useApiCall<SubmissionDetail[]>()
  const [listSubmission, setListSubmissions] = useState<SubmissionDetail[]>()
  const handleGetListSubmission = async (diaryId: string) => {
      const response = await execute({
            apiUrl: `grading-diaries/${diaryId}/submissions`,
            method: 'get',
            type: 'private'
      })
      if (response.error) {
            toast.error(response.error.message)
            return
      }
      setListSubmissions(response.data)
  }

  return { loading, listSubmission, handleGetListSubmission }
}
