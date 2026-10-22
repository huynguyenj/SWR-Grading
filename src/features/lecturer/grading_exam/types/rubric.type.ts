export interface RubricSubItem {
  /** Mã mục chấm, VD: "1", "8.a" */
  subId: string
  point: number
  /** Dạng "Dạng trả lời | Hướng dẫn chấm" — một số mục chỉ có phần dạng trả lời */
  guideline: string
}

export interface RubricQuestion {
  questionId: string
  title: string
  point: number
}

/** 1 rubric tương ứng với 1 câu hỏi (hoặc nhóm câu) trong bộ đề */
export interface RubricType {
  rubricId: string
  paperSetId: string
  /** Tổng điểm của rubric này */
  point: number
  /** Chuỗi JSON trùng với `subItems` — dùng `subItems` cho tiện */
  content: string
  subItems: RubricSubItem[]
  diagramId: string | null
  diagramName: string | null
  questions: RubricQuestion[]
}