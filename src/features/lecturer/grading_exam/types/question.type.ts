/** 1 câu hỏi trong bộ đề (file đề) */
export interface PaperQuestionType {
  questionId: string
  paperSetId: string
  title: string
  content: string
  point: number
  diagramId: string | null
  diagramName: string | null
}

