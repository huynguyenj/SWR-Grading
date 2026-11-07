import type { ExaminationStatus } from "@/features/admin/management/examination/types/examination.type"

export interface ExaminationSessionType {
  examinationId: string
  examinationCode: string
  startDate: string // "YYYY-MM-DD"
  startTime: string // "HH:mm:ss"
  status: ExaminationStatus
  semesterId: string
  paperSetId: string
}
