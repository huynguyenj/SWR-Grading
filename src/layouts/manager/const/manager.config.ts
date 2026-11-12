import type { NavSection } from "@/layouts/admin/constants/Nav.config";
import { FiFlag } from "react-icons/fi";
import { MdGrade } from "react-icons/md";
import { FaWpforms } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";

export const managerNavItem: NavSection[] = [
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
        { label: 'Đợt thi', href: '/manager/examination-session', icon: FiFlag },
        { label: 'Quản lí phiên chấm', href: '/manager/grading-session', icon: MdGrade },
        { label: 'Quản lí đơn', href: '/manager/application', icon: FaWpforms },
        { label: 'Báo cáo', href: '/manager/report', icon: HiDocumentReport },
    ],
  },
]