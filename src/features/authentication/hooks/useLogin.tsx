
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { apiPrivate } from '@/config/axiox.config'
import type { UserType } from '../types/user'
import { toast } from 'react-toastify'

const LoginFormSchema = z.object({
  username: z.email({ error: 'Hãy nhập đúng định dạng của email @gmail.com' }),
  password: z.string().min(8, { error: 'Mật khẩu ít nhất 8 kí tự' })
})
export type LoginFormType = z.infer<typeof LoginFormSchema>
export default function useLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormType>({ resolver: zodResolver(LoginFormSchema) })
  const navigate = useNavigate()
  const onSubmit = async (loginFormData: LoginFormType) => {
      try {
        const response: UserType[] = (await apiPrivate.get('user'))
        const user = response.find(u => u.name === loginFormData.username)
        if (!user) {
            toast.error('Username not existed')
            return
        }
        if (user.password === loginFormData.password) {
            toast.success('Login successfully')
            navigate(user.role === 'admin' ? '/admin' : '/lecture')
        } else {
            toast.error('Wrong password')
            return
        }
      } catch (error) {
        toast.error(error as string)    
      }
  }
  return { onSubmit, register, handleSubmit, errors }
}
