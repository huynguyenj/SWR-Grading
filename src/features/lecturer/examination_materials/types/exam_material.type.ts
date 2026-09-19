export type PaperSetStatus = 0 | 1 | 2
export type PaperSetType = {
  paperSetId: string
  paperSetCode: string
  description: string
  totalQuestions: number
  status: PaperSetStatus
  examinationId: string | null
  createdDate: string
  updatedDate: string
  fileQuestionDocs: string
  fileAnswerRubric: string
  fileAnswerTemplate: string
}

export type PreviewQuestionType = {
  title: string
  content: string
  point: number
}