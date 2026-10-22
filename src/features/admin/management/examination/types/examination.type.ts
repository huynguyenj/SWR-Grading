/** Exam Status từ BE: Draft=0, Ongoing=1, Closed=2, Completed=3, Cancelled=4 */
export type ExaminationStatus = 0 | 1 | 2 | 3 | 4

/**
 * ExaminationType (enum BE): RE=0, PE=1, ThreeW=2.
 * Đặt tên `ExaminationKind` để không trùng với interface `ExaminationType` bên dưới
 * (theo convention của bạn: `XxxType` là interface của entity).
 * Giá trị số suy ra từ data mẫu (examinationType: 1 ứng với mã "..._PE_...") — xác nhận lại với BE.
 */
export type ExaminationKind = 0 | 1 | 2

export const EXAMINATION_STATUS_LABEL: Record<ExaminationStatus, string> = {
  0: 'Nháp',
  1: 'Đang diễn ra',
  2: 'Đã đóng',
  3: 'Đã hoàn thành',
  4: 'Đã hủy',
}

export const EXAMINATION_KIND_LABEL: Record<ExaminationKind, string> = {
  0: 'Thi lại (RE)',
  1: 'Thi thực hành (PE)',
  2: '3 tuần (3W)',
}

export const EXAMINATION_KIND_OPTIONS: { value: ExaminationKind; label: string }[] = [
  { value: 0, label: EXAMINATION_KIND_LABEL[0] },
  { value: 1, label: EXAMINATION_KIND_LABEL[1] },
  { value: 2, label: EXAMINATION_KIND_LABEL[2] },
]

export interface ExaminationType {
  examinationId: string
  /** BE tự sinh từ SemesterCode + loại exam (VD: SWR302_FA26_PE_658287) — không nhập tay */
  examinationCode: string
  name: string
  examinationType: ExaminationKind
  startDate: string // "YYYY-MM-DD"
  startTime: string // "HH:mm:ss"
  durationMinutes: number
  beforeTimeMinutes: number
  note: string
  status: ExaminationStatus
  semesterId: string
  paperSetId: string
}

/** "08:00:00" -> "08:00" */
export function toShortTime(time: string) {
  return time.slice(0, 5)
}