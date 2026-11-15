import type { AdminUser } from "@/features/admin/management/user/types/admin_user";

export interface ManagerMonitor extends AdminUser {
      assignedCount: number
}