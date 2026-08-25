import { createBrowserRouter } from 'react-router'
export const router = createBrowserRouter([
      {
            path: '/',
            children: [
                  {
                        index: true,
                        lazy:{
                              Component: async() => (await import('@/pages/LoginPage')).default
                        }
                  }
            ]
      },
      {
            path: '/admin',
            children: [
                  {
                        index: true,
                        lazy: {
                              Component: async() => (await import('@/pages/AdminMainPage')).default
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
                              Component: async() => (await import('@/pages/LectureMainPage')).default
                        }
                  }
            ]
      }
])