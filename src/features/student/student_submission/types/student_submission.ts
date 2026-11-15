import type { ExaminationType } from "@/features/admin/management/examination/types/examination.type";
import type { SemesterType } from "@/features/admin/management/semester/types/semester";

export type StudentSubmissionStatus = 0 | 1 | 2 | 3

export interface StudentSubmission {
      submissionId: string
      fileSubmission: string
      submissionFile: string
      studentId: string
      studentCode: string
      studentName: string
      status: StudentSubmissionStatus
      statusName: string
      examinationCode: string
      examinationSession: string
      semester: Pick<SemesterType, 'semesterId' | 'semesterCode' | 'name'>
      examination: Pick<ExaminationType, 'examinationId' | 'name'>
      createdDate: string
      updatedDate: string
}