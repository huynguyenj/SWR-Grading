export type SubmissionStatus = '0' | '1' | '2' | '3'
export interface SubmissionType {
   submissionId: string
   submissionFile: string
   aiScore: number
   lecturerScore: number
   status: SubmissionStatus
   comment:string
   createdDate: string
}

export interface CriterionScore {
  criterion: string
  max_score: number
  actual_score: number
  comment: string
}

export interface SubmissionDetailType extends SubmissionType {
  filePath: string | null
  diaryId: string
  diaryName: string
  studentCode: string
  studentName: string
  aiLogs: string | null
  comment: string
  statusName: string
  criteriaScores: CriterionScore[]
  updatedDate: string
}

