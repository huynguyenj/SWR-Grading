import type { NavSection } from "@/layouts/admin/constants/Nav.config";
import { FiFlag, FiHome, FiMessageSquare, FiUsers } from "react-icons/fi";

export const examinerNavItem: NavSection[] = [
//   {
//     title: 'Tổng quan',
//     items: [
//       { label: 'Dashboard', href: '/admin', icon: FiHome },
//       { label: 'Thống kê', href: '/admin/analytics', icon: FiBarChart2 },
//     ],
//   },
  {
    title: 'Quản lý',
    items: [
        { label: 'Tổng quan', href: '/examiner', icon: FiHome },
        { label: 'Quản lí học kì', href: '/monitor/examination', icon: FiMessageSquare },
        { label: 'Quản lí kì thi', href: '/monitor/grading', icon: FiFlag },
        { label: 'Sinh viên', href: '/monitor/student', icon: FiUsers },
    ],
  },
]