export type SubmissionStatus = '0' | '1' | '2' | '3'

export interface CriterionScore {
  criterionId: string
  criterionName: string
  score: number
}

export interface SubmissionDetail {
  submissionId: string
  submissionFile: string
  filePath: string | null
  diaryId: string
  diaryName: string
  studentCode: string
  studentName: string
  aiScore: number | null
  aiLogs: string | null
  lecturerScore: number | null
  comment: string
  status: SubmissionStatus
  statusName: string
  criteriaScores: CriterionScore[]
  createdDate: string
  updatedDate: string
}
