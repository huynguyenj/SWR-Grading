import { useAuthStore } from '@/features/authentication/store/auth-store'
import { redirect } from 'react-router'

export function guestLoader() {
  return async () => {
    const { accessToken, role } = useAuthStore.getState()

    if (accessToken && role) {
      throw redirect(`/${role.toLocaleLowerCase()}`)
    }

    return null
  }
}