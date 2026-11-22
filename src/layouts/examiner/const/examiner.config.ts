import type { NavSection } from "@/layouts/admin/constants/Nav.config";
import { FiFlag, FiMessageSquare, FiUsers } from "react-icons/fi";

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
        { label: 'Quản lí học kì', href: '/examiner/semester', icon: FiMessageSquare },
        { label: 'Quản lí kì thi', href: '/examiner/examination', icon: FiFlag },
        { label: 'Đợt thi', href: '/examiner/examination-session', icon: FiFlag },
        { label: 'Sinh viên', href: '/examiner/student', icon: FiUsers },
    ],
  },
]