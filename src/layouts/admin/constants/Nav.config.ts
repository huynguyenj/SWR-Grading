import {
  FiHome,
  FiUsers,
  FiMessageSquare,
  FiFlag,
  FiBarChart2,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'

export interface NavItem {
  label: string
  href: string
  icon: IconType
  badge?: string | number
}

export interface NavSection {
  title: string
  items: NavItem[]
}

/**
 * Toàn bộ cấu trúc menu của sidebar được khai báo tại đây.
 * Muốn thêm/xóa/sửa trang -> chỉ cần sửa file này,
 * không cần đụng vào component Sidebar.
 */
export const navSections: NavSection[] = [
  {
    title: 'Tổng quan',
    items: [
      { label: 'Dashboard', href: '/admin', icon: FiHome },
      { label: 'Thống kê', href: '/admin/analytics', icon: FiBarChart2 },
    ],
  },
  {
    title: 'Quản lý',
    items: [
      { label: 'Người dùng', href: '/admin/users', icon: FiUsers },
      { label: 'Học kì', href: '/admin/semester', icon: FiMessageSquare },
      { label: 'Tổ chức thi', href: '/admin/examination', icon: FiFlag },
    ],
  },
  // {
  //   title: 'Hệ thống',
  //   items: [{ label: 'Cài đặt', href: '/admin/settings', icon: FiSettings }],
  // },
]