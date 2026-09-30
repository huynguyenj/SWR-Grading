import type { SubmissionType } from "./submission.type"

export interface GradingDiaryType {
  gradingDiaryId: string
  name: string
  content: string
  paperSetId: string
  fileAnswerRubric: string
  paperSetCode: string
  createById: string
  lecturerName: string
  submissionsCount: number
}
export interface GradingDiaryDetailType extends GradingDiaryType {
      submissions: SubmissionType[]
}