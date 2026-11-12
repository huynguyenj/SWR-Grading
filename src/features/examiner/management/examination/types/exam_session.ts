import type { ExaminationStatus } from '@/features/admin/management/examination/types/examination.type'

export interface ExaminationSessionStudentType {
  studentId: string
  studentCode: string
  fullName: string
  email: string
}

export interface ExaminationSessionSemesterType {
  semesterId: string
  semesterCode: string
  name: string
  startDate: string
  endDate: string
}

export interface ExaminationSessionExaminationType {
  examinationId: string
  name: string
  startDate: string
  endDate: string
}

export interface ExaminationSessionType {
  examinationSessionId: string
  examinationId: string
  examinationCode: string
  startDate: string
  startTime: string
  status: ExaminationStatus
  semesterId: string
  paperSetId: string

  createdDay: string
  updatedDay: string

  totalSubmission: number
  students: ExaminationSessionStudentType[]

  semester: ExaminationSessionSemesterType
  examination: ExaminationSessionExaminationType
}

export const SESSION_STATUS_LABEL: Record<
  ExaminationSessionType['status'],
  string
> = {
  0: 'Nháp',
  1: 'Đang diễn ra',
  2: 'Đã đóng',
  3: 'Đã hoàn thành',
  4: 'Đã hủy',
}

export const SESSION_STATUS_CLASS: Record<
  ExaminationSessionType['status'],
  string
> = {
  0: 'bg-bg-muted text-text-secondary',
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-orange-100 text-orange-700',
  3: 'bg-green-100 text-green-700',
  4: 'bg-red-100 text-red-700',
}