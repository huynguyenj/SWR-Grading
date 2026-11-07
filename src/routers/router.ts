import AdminLayout from '@/layouts/admin/AdminLayout'
import { createBrowserRouter } from 'react-router'
import protectedRole from './loader/protected_route'
import { ROLE } from './const/role_route'
import { guestLoader } from './loader/guest_route'
import MonitorLayout from '@/layouts/monitor/MonitorLayout'
import ExaminerLayout from '@/layouts/examiner/ExaminerLayout'
export const router = createBrowserRouter([
      {
            path: '/',
            loader: guestLoader(),
            children: [
                  {
                        index: true,
                        lazy:{
                              Component: async() => (await import('@/pages/common/LoginPage')).default
                        }
                  }
            ]
      },
      {
            path: '/forbidden',
            lazy: {
                  Component: async() => (await import('@/pages/common/ForbiddenPage')).default
            }
      },
      {
            path: '/admin',
            Component: AdminLayout,
            loader: protectedRole(ROLE.admin),
            children: [
                  {
                        index: true,
                        lazy: {
                              Component: async() => (await import('@/pages/admin/AdminDashboardPage')).default
                        }
                  },
                  {
                        path: '/admin/analytics',
                        lazy: {
                              Component: async() => (await import('@/pages/admin/AdminAnalysisPage')).default
                        }
                  }
            ]
      },
      {
            path: '/monitor',
            Component: MonitorLayout,
            loader: protectedRole(ROLE.monitor),
            children: [
                  {
                        index: true,
                        lazy: {
                              Component: async() => (await import('@/pages/monitor/MonitorMainPage')).default
                        }
                  },
                                    {
                        path: '/monitor/examination',
                        lazy: {
                              Component: async() => (await import('@/pages/monitor/ExaminationMaterialManagementPage')).default
                        }
                  },
                                    {
                        path: '/monitor/grading',
                        lazy: {
                              Component: async() => (await import('@/pages/monitor/GradingPage')).default
                        }
                  },
            ]
      },
      {
            path: '/examiner',
            Component: ExaminerLayout,
            loader: protectedRole(ROLE.examiner),
            children: [             
                  {
                        index: true,
                        path: '/examiner/semester',
                        lazy: {
                              Component: async() => (await import('@/pages/examiner/SemesterManagement')).default
                        }
                  },
                  {
                        path:'/examiner/student',
                        lazy: {
                              Component: async() => (await import('@/pages/examiner/StudentManagement')).default
                        }
                  },
                  {
                        path: '/examiner/examination',
                        lazy: {
                              Component: async() => (await import('@/pages/examiner/ExaminationManagement')).default
                        }
                  }
            ]
      }
])