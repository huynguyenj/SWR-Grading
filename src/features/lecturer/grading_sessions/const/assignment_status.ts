import type { AssignmentStatus } from "@/features/manager/grading_session/hooks/useMonitorUpdateAssignment"

export const getAssignmentStatus = (status: number): string => {
  switch (status) {
    case 0:
      return "Chờ xử lý"
    case 1:
      return "Đã phê duyệt"
    case 2:
      return "Đã từ chối"
    case 3:
      return "Đang thực hiện"
    case 4:
      return "Hoàn thành"
    default:
      return "Không xác định"
  }
}

export const getAssignmentStatusClass = (status: number): string => {
  switch (status) {
    case 0:
      return "bg-yellow-100 text-yellow-700"
    case 1:
      return "bg-blue-100 text-blue-700"
    case 2:
      return "bg-red-100 text-red-700"
    case 3:
      return "bg-orange-100 text-orange-700"
    case 4:
      return "bg-green-100 text-green-700"
    default:
      return "bg-bg-muted text-text-secondary"
  }
}

export const ASSIGNMENT_STATUS_OPTIONS: {
    value: AssignmentStatus
    label: string
}[] = [
    { value: 0, label: 'Chờ xử lý' },
    { value: 1, label: 'Đã phê duyệt' },
    { value: 2, label: 'Đã từ chối' },
    { value: 3, label: 'Đang thực hiện' },
    { value: 4, label: 'Hoàn thành' }
]
