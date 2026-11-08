import type { ExaminationStatus, ExaminationType } from "@/features/admin/management/examination/types/examination.type"
import type { SemesterType } from "@/features/admin/management/semester/types/semester"

export const SESSION_STATUS_LABEL: Record<ExaminationSessionType['status'], string> = {
  0: 'Nháp',
  1: 'Đang diễn ra',
  2: 'Đã đóng',
  3: 'Đã hoàn thành',
  4: 'Đã hủy',
}

export const SESSION_STATUS_CLASS: Record<ExaminationSessionType['status'], string> = {
  0: 'bg-bg-muted text-text-secondary',
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-orange-100 text-orange-700',
  3: 'bg-green-100 text-green-700',
  4: 'bg-red-100 text-red-700',
}

export interface ExaminationSessionType {
  examinationId: string
  examinationSessionId: string
  examinationCode: string
  startDate: string // "YYYY-MM-DD"
  startTime: string // "HH:mm:ss"
  status: ExaminationStatus
  semesterId: string
  paperSetId: string
  semester: SemesterType
  examination: ExaminationType
}
