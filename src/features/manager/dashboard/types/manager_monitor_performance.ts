
import type { PaginationType } from '@/types/pagination.type'

export interface ManagerMonitorPerformanceType {
  monitorId: string
  staffCode: string
  fullName: string
  email: string
  assignedCount: number
  completedCount: number
  inProgressCount: number
  overdueCount: number
  completionRate: number
  averageGivenScore: number | null
}

export interface ManagerMonitorPerformanceResponseType {
  filterContext: {
    semesterId: string | null
    semesterName: string | null
    semesterCode: string | null
    examinationId: string | null
    examinationName: string | null
    examinationCode: string | null
  }

  totalMonitors: number
  totalAssignments: number
  totalCompletedAssignments: number
  overallCompletionRate: number

  pagedMonitors: PaginationType<ManagerMonitorPerformanceType>
}

export interface GetManagerMonitorPerformanceParams {
  semesterId?: string | null
  examinationId?: string | null
  search?: string
  page?: number
  pageSize?: number
}
