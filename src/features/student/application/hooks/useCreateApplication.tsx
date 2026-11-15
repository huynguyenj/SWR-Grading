
import useApiCall from '@/hooks/useApiCall'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const createApplicationSchema = z.object({
    submissionId: z.string().uuid('Invalid submission ID'),
    reason: z
        .string()
        .trim()
        .min(1, 'Hãy cung cấp lí do viết đơn.'),
})

type CreateApplicationInput = z.input<typeof createApplicationSchema>
type CreateApplicationOutput = z.output<typeof createApplicationSchema>

interface CreateApplicationResponse {
    error?: {
        message?: string
    }
}

interface UseCreateApplicationProps {
    submissionId: string
    onRefresh: () => void
}

export default function useCreateApplication({
    submissionId,
    onRefresh,
}: UseCreateApplicationProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateApplicationInput, unknown, CreateApplicationOutput>({
        resolver: zodResolver(createApplicationSchema),
        defaultValues: {
            submissionId,
            reason: '',
        },
    })

    const { execute, loading } =
        useApiCall<CreateApplicationResponse>()

    const onSubmit = async (values: CreateApplicationOutput) => {
        try {
            const response = await execute({
                apiUrl: '/applications',
                method: 'post',
                type: 'private',
                body: {
                    submissionId: values.submissionId,
                    reason: values.reason,
                },
            })

            if (response?.error) {
                toast.error(
                    response.error.message || 'Tạo đơn thất bại.',
                )
                return false
            }

            toast.success('Tạo đơn thành công!')
            reset({
                submissionId,
                reason: '',
            })

            onRefresh()
            return true
        } catch {
            toast.error('Something went wrong while creating the application.')
            return false
        }
    }

    return {
        register,
        handleSubmit,
        errors,
        loading,
        onSubmit,
        reset,
    }
}
