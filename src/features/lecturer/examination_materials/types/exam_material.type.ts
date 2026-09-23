export type PaperSetStatus = 0 | 1 | 2 | 3 | 4
type PaperSetFilesType = {
  fileType: number
  fileName: string
  contentType: string
  fileSize: number
}
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
  semesterId: string
  lecturerName: string
  lecturerCode: string
  files: PaperSetFilesType[]
}

export type PreviewQuestionType = {
  title: string
  content: string
  point: number
}