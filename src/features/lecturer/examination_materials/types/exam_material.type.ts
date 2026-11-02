import type { ExaminationKind, ExaminationStatus } from "@/features/admin/management/examination/types/examination.type"

export type PaperSetStatus = 0 | 1 | 2 | 3 | 4
export type PaperSetFileType = 1 | 2 | 3

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
  examinationCode: string | null
  examinationName: string | null
  examinationType: ExaminationKind
  examinationStatus: ExaminationStatus
  examinationStartDate: Date
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

type FilesType = {
  fileType: PaperSetFileType
  fileName: string
  text: string
}

export type FileInformationType = {
  paperSetId: string
  files: FilesType[]
}