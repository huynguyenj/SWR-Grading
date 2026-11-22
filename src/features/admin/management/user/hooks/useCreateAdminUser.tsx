// hooks/useCreateAdminUser.ts

import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const createAdminUserSchema = z.object({
    fullName: z.string().min(1, 'Họ và tên không được để trống'),

    email: z
        .string()
        .min(1, 'Email không được để trống')
        .email('Email không hợp lệ'),

    password: z
        .string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),

    birthday: z.string().min(1, 'Ngày sinh không được để trống'),

    role: z.union([
        z.literal(0),
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
    ]),

    studentCode: z.string(),
    major: z.string(),
    staffCode: z.string(),
    subject: z.string(),
})

export type CreateAdminUserInput = z.input<typeof createAdminUserSchema>
export type CreateAdminUserType = z.output<typeof createAdminUserSchema>

interface UseCreateAdminUserProps {
    onRefresh: () => void
    onSuccess?: () => void
}

export default function useCreateAdminUser({
    onRefresh,
    onSuccess,
}: UseCreateAdminUserProps) {
    const { execute, loading } = useApiCall()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CreateAdminUserInput, unknown, CreateAdminUserType>({
        resolver: zodResolver(createAdminUserSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            birthday: '',
            role: 1,
            studentCode: '',
            major: '',
            staffCode: '',
            subject: '',
        },
    })

    const selectedRole = watch('role')

    const onSubmit = async (createUserForm: CreateAdminUserType) => {
        const body = {
            fullName: createUserForm.fullName.trim(),
            email: createUserForm.email.trim(),
            password: createUserForm.password,
            birthday: createUserForm.birthday,
            role: createUserForm.role,
            studentCode:
                createUserForm.role === 0
                    ? createUserForm.studentCode.trim()
                    : '',
            major:
                createUserForm.role === 0
                    ? createUserForm.major.trim()
                    : '',
            staffCode:
                createUserForm.role !== 0
                    ? createUserForm.staffCode.trim()
                    : '',
            subject:
                createUserForm.role !== 0
                    ? createUserForm.subject.trim()
                    : '',
        }

        const data = await execute({
            apiUrl: '/auth/register',
            method: 'post',
            type: 'private',
            body,
        })

        if (data.error) {
            toast.error(data.error.message)
            return
        }

        toast.success('Tạo tài khoản thành công')
        onRefresh()
        onSuccess?.()
    }

    return {
        register,
        handleSubmit,
        errors,
        loading,
        onSubmit,
        selectedRole,
    }
}