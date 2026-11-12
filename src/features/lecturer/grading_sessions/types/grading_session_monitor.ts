import type { AssignmentType } from "@/features/manager/grading_session/types/assignment_type"

export interface MonitorAssignmentType extends AssignmentType {
    submissionId: string
}

export interface GradingSessionType {
    gradingSessionId: string
    examinationSessionId: string
    title: string
    createdDate: string
    updatedDate: string
    deadline: string
    numberSubmissions: number
    assignedCount: number
    assignments: MonitorAssignmentType[]
}