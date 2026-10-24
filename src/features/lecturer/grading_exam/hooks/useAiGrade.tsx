import useApiCall from "@/hooks/useApiCall"
import type { SubmissionType } from "../types/submission.type"

export default function useAiGrade() {
  const { execute, loading } = useApiCall()
  const handleAiGrading = async (submissions?: SubmissionType[]) => {
      if (!submissions) return
      const submissionUnGrade = submissions.filter((submission) => submission.aiScore == null)
      const promises = submissionUnGrade?.map((unGradeSubmission) => execute({
            apiUrl: `submissions/${unGradeSubmission.submissionId}/ai-grade`,
            method: 'post',
            type: 'private'   
      }))
      const results = await Promise.allSettled(promises)
      results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                  console.log(`Bài làm ${submissionUnGrade[index].submissionFile} chấm thành công`);
            } else {
                  console.error(`Bài làm ${submissionUnGrade[index].submissionFile} chấm thất bại`);
                  
            }
      })
  }
  return { handleAiGrading, loading }
}
