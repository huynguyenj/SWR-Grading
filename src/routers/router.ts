import AdminLayout from '@/layouts/admin/AdminLayout'
import { createBrowserRouter } from 'react-router'
export const router = createBrowserRouter([
      {
            path: '/',
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
            path: '/admin',
            Component: AdminLayout,
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
            path: '/lecture',
            children: [
                  {
                        index: true,
                        lazy: {
                              Component: async() => (await import('@/pages/lecture/LectureMainPage')).default
                        }
                  }
            ]
      }
])