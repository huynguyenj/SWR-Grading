
export type UserRole = 0 | 1 | 2 | 3 | 4

export interface AdminUser {
    id: string
    staffCode: string
    fullName: string
    email: string
    birthday: string
    role: UserRole
    isActive: boolean
    createdDay: string
    updatedDay: string
}

export interface AdminUserQueryParams {
    Role?: UserRole
    Search?: string
    Page: number
    PageSize: number
}

export const USER_ROLE_OPTIONS = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Giám khảo' },
    { value: 3, label: 'Khảo thí' },
    { value: 4, label: 'Quản lí bộ môn' },
] as const

export const USER_ROLE_LABELS: Record<UserRole, string> = {
    0: 'Học sinh',
    1: 'Admin',
    2: 'Giám khảo',
    3: 'Khảo thí',
    4: 'Quản lí bộ môn',
}
