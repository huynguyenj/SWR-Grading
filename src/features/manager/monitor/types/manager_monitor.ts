import type { AdminUser } from "@/features/admin/management/user/types/admin_user";

export interface ManagerMonitor extends AdminUser {
      assignedCount: number
}

export interface ManagerAvailableMonitor extends ManagerMonitor {
      isBusy: boolean
      workingStatus: string
      inProgressCount: number
      completedCount: number
}