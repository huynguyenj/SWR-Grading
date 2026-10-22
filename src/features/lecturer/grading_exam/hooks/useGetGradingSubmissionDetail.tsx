import useApiCall from "@/hooks/useApiCall"
import type { SubmissionDetailType } from "../types/submission.type"
import { useState } from "react"

export default function useGetGradingSubmissionDetail() {
  const { execute, loading } = useApiCall<SubmissionDetailType>()
  const [submissionDetail, setSubmissionDetail] = useState<SubmissionDetailType>()
  const handleGetGradingDetail = async (submissionId: string) => {
      const response = await execute({
            apiUrl: `submissions/${submissionId}`,
            method: 'get',
            type: 'private'
      })
      setSubmissionDetail(response.data)
  }
  return { loading, submissionDetail, handleGetGradingDetail }
}
