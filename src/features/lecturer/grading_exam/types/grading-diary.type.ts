export interface GradingDiaryType {
  gradingDiaryId: string
  name: string
  content: string
  paperSetId: string
  paperSetCode: string
  createById: string
  lecturerName: string
  submissionsCount: number
}
export interface GradingDiaryDetailType extends GradingDiaryType {
      submissions: []
}