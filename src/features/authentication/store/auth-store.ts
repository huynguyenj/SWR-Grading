import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthType = {
  accessToken: string | null
  role: string | null
  userId: string | null
  userName: string | null
  setAccessToken: (accessToken: string) => void,
   setAuthInfo: (accessToken: string, userId: string, role: string, userName: string) => void
  removeAuthInfo: () => void
}

export const useAuthStore = create<AuthType>()(
  persist(
    (set) => ({
      accessToken: null,
      userId: null,
      role: null,
      userName: null,
      setAccessToken: (accessToken: string) => set({ accessToken: accessToken }),
      setAuthInfo: (accessToken: string, userId: string, role: string, userName: string) => set({ accessToken: accessToken, userId: userId, role: role, userName: userName }),
      removeAuthInfo: () => set((state) => ({ ...state, accessToken: null, userId: null, role: null }))
    }),
    { name: 'swr-grading-auth-info' }
  )
)