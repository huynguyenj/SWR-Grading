import type { PaperSetType } from "@/features/lecturer/examination_materials/types/exam_material.type"

export type SemesterStatus = 0 | 1 | 2
// export const SemesterTranslate: Record<number, SemesterStatus> = {
//   0: 'Sắp diễn ra',
//   1: 'Đang hoạt động',
//   2: 'Đã đóng'
// } 
export interface SemesterType {
  semesterId: string
  name: string
  semesterCode: string
  startDate: string // ISO date
  endDate: string // ISO date
  status: SemesterStatus
  examCount: number
}

export interface SemesterDetailType extends SemesterType {
  paperSets: PaperSetType[]
}