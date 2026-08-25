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
      }
])