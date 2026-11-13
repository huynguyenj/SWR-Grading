export type ApplicationStatus = 0 | 1 | 2 | 3 | 4

export interface ApplicationType {
    reason: string
    status: ApplicationStatus
    createDate: string
}