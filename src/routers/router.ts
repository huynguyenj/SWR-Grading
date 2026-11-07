import AdminLayout from '@/layouts/admin/AdminLayout'
import { createBrowserRouter } from 'react-router'
import protectedRole from './loader/protected_route'
import { ROLE } from './const/role_route'
import { guestLoader } from './loader/guest_route'
import MonitorLayout from '@/layouts/monitor/MonitorLayout'
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
                  },
                  {
                        path:'/admin/users',
                        lazy: {
                              Component: async() => (await import('@/pages/admin/AdminUserPage')).default
                        }
                  },
                                    {
                        path:'/admin/student',
                        lazy: {
                              Component: async() => (await import('@/pages/admin/AdminStudentPage')).default
                        }
                  },
                                    {
                        path: '/admin/semester',
                        lazy: {
                              Component: async() => (await import('@/pages/admin/AdminSemesterPage')).default
                        }
                  },
                  {
                        path: '/admin/examination',
                        lazy: {
                              Component: async() => (await import('@/pages/admin/AdminExaminationPage')).default
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
                        path: '/lecturer/examination',
                        lazy: {
                              Component: async() => (await import('@/pages/monitor/ExaminationMaterialManagementPage')).default
                        }
                  },
                                    {
                        path: '/lecturer/grading',
                        lazy: {
                              Component: async() => (await import('@/pages/monitor/GradingPage')).default
                        }
                  },
            ]
      }
])