import { useAuthStore } from '@/features/authentication/store/auth-store'
import { redirect } from 'react-router'

export default function protectedRole(role: string) {
  return async () => {
    const { accessToken, role: userRole } = useAuthStore.getState()
    if (!accessToken) throw redirect('/')
    if (role && role!== userRole) throw redirect('/forbidden')
    return null
  }
}
