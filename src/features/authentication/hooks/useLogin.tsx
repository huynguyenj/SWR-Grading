
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// import { useNavigate } from 'react-router'
// import type { UserType } from '../types/user'
import { toast } from 'react-toastify'
import useApiCall from '@/hooks/useApiCall'

const LoginFormSchema = z.object({
  email: z.email({ error: 'Hãy nhập đúng định dạng của email @gmail.com' }),
  password: z.string().min(8, { error: 'Mật khẩu ít nhất 8 kí tự' })
})
export type LoginFormType = z.infer<typeof LoginFormSchema>
export default function useLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormType>({ resolver: zodResolver(LoginFormSchema) })
  const { execute, loading } = useApiCall()
  // const navigate = useNavigate()
  const onSubmit = async (loginFormData: LoginFormType) => {
      const data = await execute({
        apiUrl: '/Auth/login',
        method: 'post',
        type: 'public',
        body: loginFormData
      })
      console.log(data);
      toast.success('Đăng nhập thành công')
      
  }
  return { onSubmit, register, handleSubmit, errors, loading }
}
