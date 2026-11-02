import type { SubmissionStatus } from "./submission.type"

export interface CriterionScore {
  criterionId: string
  criterionName: string
  score: number
}

export interface StudentAnswer {
  questionNumber: number
  question: string
  extractedText: string
  extractedImageUrl: string
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
  studentAnswers: StudentAnswer[]
  createdDate: string
  updatedDate: string
}
