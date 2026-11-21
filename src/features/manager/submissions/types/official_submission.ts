export interface OfficialSubmissionDetail {
  detailId: string
  parsedAnswerId: string
  questionId: string
  questionTitle: string
  maxScore: number
  score: number
  comment: string | null
}

export interface OfficialSubmission {
  submissionId: string
  studentId: string
  studentCode: string
  studentName: string
  examinationName: string
  examinationCode: string
  paperSetCode: string
  semesterName: string
  semesterCode: string
  officialScore: number
  gradedBy: string
  gradedById: string
  historyId: string
  gradedAt: string
  details: OfficialSubmissionDetail[]
}