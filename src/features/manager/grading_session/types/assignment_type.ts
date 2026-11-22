
export interface AssignmentStaffType {
  staffId: string
  staffCode: string
  fullName: string
  email: string
}

export interface AssignmentStudentType {
  studentId: string
  studentCode: string
  fullName: string
}

export interface AssignmentPaperSetType {
  paperSetId: string
  paperSetCode: string
  totalQuestions: number
}

export interface AssignmentExaminationSessionType {
  examinationSessionId: string
  examinationCode: string
  examinationName: string
  semesterName: string
  semesterCode: string
}

export interface AssignmentType {
  assignmentId: string
  gradingSessionId: string
  submissionId: string
  staffId: string
  status: number
  assignedDate: string
  updatedDate: string
  isReassigned: boolean
  staff: AssignmentStaffType
  student: AssignmentStudentType
  paperSet: AssignmentPaperSetType
  examinationSession: AssignmentExaminationSessionType
}
