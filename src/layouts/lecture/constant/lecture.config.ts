import { FiHome, FiCalendar, FiEdit3 } from 'react-icons/fi'
import type { IconType } from 'react-icons'

export interface NavItem {
  label: string
  href: string
  icon: IconType
}

/**
 * Danh sách trang trong navbar của Lecturer.
 * Muốn thêm/xóa trang -> chỉ sửa mảng này.
 */
export const lecturerNavItems: NavItem[] = [
  { label: 'Tổng quan', href: '/lecture', icon: FiHome },
  { label: 'Quản lí đề thi', href: '/lecture/examination', icon: FiCalendar },
//   { label: 'Chấm điểm', href: '/lecturer/exams', icon: FiFileText },
  { label: 'Chấm bài', href: '/lecture/grading', icon: FiEdit3 },
//   { label: 'Lớp học', href: '/lecturer/classes', icon: FiUsers },
]