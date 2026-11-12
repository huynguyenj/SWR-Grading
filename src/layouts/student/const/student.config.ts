import { FiCalendar } from 'react-icons/fi'
import type { NavItem } from '@/layouts/monitor/constant/monitor.config'
import { FaNoteSticky } from "react-icons/fa6";
import { SiGoogleforms } from "react-icons/si";


export const studentNavItems: NavItem[] = [
  { label: 'Đợt thi', href: '/student', icon: FiCalendar },
  { label: 'Bài làm', href: '/student/submission', icon: FaNoteSticky },
  { label: 'Đơn', href: '/student/application', icon: SiGoogleforms },
]