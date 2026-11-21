import AdminLayout from '@/layouts/admin/AdminLayout'
import { createBrowserRouter } from 'react-router'
import protectedRole from './loader/protected_route'
import { ROLE } from './const/role_route'
import { guestLoader } from './loader/guest_route'
import MonitorLayout from '@/layouts/monitor/MonitorLayout'
import ExaminerLayout from '@/layouts/examiner/ExaminerLayout'
import ManagerLayout from '@/layouts/manager/ManagerLayout'
import StudentLayout from '@/layouts/student/StudentLayout'
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
                        index: true,
                        path: '/admin/users',
                        lazy: {
                              Component: async() => (await import('@/pages/admin/AdminUserPage')).default
                        }
                  },
                  {
                        path: '/admin/ai-model',
                        lazy: {
                              Component: async() => (await import('@/pages/admin/AdminAiModelPage')).default
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
                  {
                        path: '/monitor/grading/submissions/:submissionId',
                        lazy: {
                              Component: async() => (await import('@/pages/monitor/SubmissionGradingPage')).default
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
                              Component: async() => (await import('@/pages/examiner/ExaminerStudentPage')).default
                        }
                  },
                  {
                        path: '/examiner/examination',
                        lazy: {
                              Component: async() => (await import('@/pages/examiner/ExaminationManagement')).default
                        }
                  },
                                    {
                        path: '/examiner/examination-session',
                        lazy: {
                              Component: async() => (await import('@/pages/examiner/ExaminationSessionManagement')).default
                        }
                  }
            ]
      },
      {
            path: '/manager',
            Component: ManagerLayout,
            loader: protectedRole(ROLE.manager),
            children: [   
                  {
                        index: true,
                        path: '/manager',
                        lazy: {
                              Component: async() => (await import('@/pages/manager/ManagerDashboard')).default
                        }
                  },          
                  {
                        path: '/manager/examination-session',
                        lazy: {
                              Component: async() => (await import('@/pages/manager/ManagerExamSessionPage')).default
                        }
                  },
                  {
                        path:'/manager/grading-session',
                        lazy: {
                              Component: async() => (await import('@/pages/manager/ManagerGradingSessionPage')).default
                        }
                  },
                  {
                        path: '/manager/application',
                        lazy: {
                              Component: async() => (await import('@/pages/manager/ManagerApplicationPage')).default
                        }
                  },
                  {
                        path: '/manager/monitor',
                        lazy: {
                              Component: async() => (await import('@/pages/manager/ManagerMonitorManagement')).default
                        }
                  },
                  {
                        path: '/manager/report',
                        lazy: {
                              Component: async() => (await import('@/pages/manager/ManagerReportPage')).default
                        }
                  },
                  {
                        path: '/manager/submissions',
                        lazy: {
                              Component: async() => (await import('@/pages/manager/ManagerSubmissionResultPage')).default
                        }
                  }
            ]
      },
      {
            path: '/student',
            Component: StudentLayout,
            loader: protectedRole(ROLE.student),
            children: [             
                  {
                        index: true,
                        path: '/student',
                        lazy: {
                              Component: async() => (await import('@/pages/student/StudentExamSessionPage')).default
                        }
                  },
                  {
                        path:'/student/submission',
                        lazy: {
                              Component: async() => (await import('@/pages/student/StudentSubmissionPage')).default
                        }
                  },
                  {
                        path: '/student/application',
                        lazy: {
                              Component: async() => (await import('@/pages/student/ApplicationPage')).default
                        }
                  },
            ]
      }
])