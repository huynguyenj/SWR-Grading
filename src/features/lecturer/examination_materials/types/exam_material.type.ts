export type ExamMaterialStatus = 0 | 1 | 2
export type ExamMaterialType = {
  examMaterialId: string
  examMaterialCode: string
  description: string
  totalQuestions: number
  status: ExamMaterialStatus
  examinationId: string | null
  createdDate: string
  updatedDate: string
  fileQuestionDocs: string
  fileAnswerRubric: string
  fileAnswerTemplate: string
}

