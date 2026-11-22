import type { ExaminationType } from '@/features/admin/management/examination/types/examination.type'
import type { SemesterType } from '@/features/admin/management/semester/types/semester'

export type StudentSubmissionStatus = 0 | 1 | 2 | 3 | 4

export interface StudentSubmissionGradingDetail {
  detailId: string
  score: number
  comment: string | null
  parsedAnswerId: string
}

export interface StudentSubmissionGradingHistory {
  historyId: string
  status: number
  statusName: string
  evaluationType: number
  evaluationTypeName: string
  gradingRound: number
  totalScore: number
  generalFeedback: string | null
  createdAt: string
  details: StudentSubmissionGradingDetail[]
}

export interface StudentSubmission {
  submissionId: string
  fileSubmissions: string
  submissionFile: string
  studentId: string
  studentCode: string
  studentName: string
  status: StudentSubmissionStatus
  statusName: string
  examinationSessionId: string
  examinationCode: string
  semester: Pick<SemesterType, 'semesterId' | 'semesterCode' | 'name'>
  examination: Pick<ExaminationType, 'examinationId' | 'name'>
  gradingHistories: StudentSubmissionGradingHistory[]
  createdDate: string
  updatedDate: string
}