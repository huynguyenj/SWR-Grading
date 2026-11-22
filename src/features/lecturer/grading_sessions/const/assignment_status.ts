import type { AssignmentStatus } from "@/features/manager/grading_session/hooks/useMonitorUpdateAssignment"

export const getAssignmentStatus = (status: number): string => {
  switch (status) {
    case 0:
      return "Chờ xử lý"
    case 1:
      return "Hoàn thành"
    case 2:
      return "Đã chấm"
    case 3:
      return "Quá hạn"
    default:
      return "Không xác định"
  }
}

export const getAssignmentStatusClass = (status: number): string => {
  switch (status) {
    case 0:
      return "bg-yellow-100 text-yellow-700"
    case 1:
      return "bg-green-100 text-green-700"
    case 2:
      return "bg-blue-100 text-blue-700"
    case 3:
      return "bg-red-100 text-red-700"
    default:
      return "bg-bg-muted text-text-secondary"
  }
}

export const ASSIGNMENT_STATUS_OPTIONS: {
    value: AssignmentStatus
    label: string
}[] = [
    { value: 0, label: 'Chờ xử lí' },
    { value: 1, label: 'Hoàn thành' },
    { value: 2, label: 'Đã chấm' },
    { value: 3, label: 'Quá hạn' },
]
