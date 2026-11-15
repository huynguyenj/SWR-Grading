export type ApplicationStatus = 0 | 1 | 2 | 3 | 4

export interface ApplicationType {
    id: string
    submissionId: string
    studentId: string
    studentCode: string
    studentName: string
    reason: string
    status: ApplicationStatus
    createdDay: string
    updatedDay: string
    examinationName: string
    examinationSessionCode: string
    officialScore: number
}