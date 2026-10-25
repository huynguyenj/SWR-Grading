import useApiCall from "@/hooks/useApiCall"
import type { SubmissionType } from "../types/submission.type"
import { useState } from "react"

type UseAiGradeType = {
      onRefresh: () => void
}

export default function useAiGrade({ onRefresh }: UseAiGradeType) {
  const { execute, loading } = useApiCall()
  const [isGrading, setIsGrading] = useState(false)
  const handleAiGrading = async (submissions?: SubmissionType[]) => {
      if (!submissions) return
      const submissionUnGrade = submissions.filter((submission) => submission.aiScore == null)
      setIsGrading(true)
    try {
      const promises = submissionUnGrade.map((submission) =>
        execute({
          apiUrl: `submissions/${submission.submissionId}/ai-grade`,
          method: "post",
          type: "private",
        })
      )

      const results = await Promise.allSettled(promises)

      results.forEach((result, index) => {
        const submission = submissionUnGrade[index]

        if (result.status === "fulfilled") {
          console.log(
            `Bài làm ${submission.submissionFile} chấm thành công`
          )
        } else {
          console.error(
            `Bài làm ${submission.submissionFile} chấm thất bại`,
            result.reason
          )
        }
      })

      onRefresh()
    } finally {
      setIsGrading(false)
    }
  }
  return { handleAiGrading, loading, isGrading }
}
