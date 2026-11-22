import useApiCall from '@/hooks/useApiCall'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { SubmissionGradingType } from '../types/grading_submisison_type'

export default function useGetSubmissionGrading(submissionId: string) {
    const { execute, loading } = useApiCall<SubmissionGradingType>()

    const [submissionGrading, setSubmissionGrading] =
        useState<SubmissionGradingType>()

    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        if (!submissionId) return

        let isMounted = true

        const getSubmissionGrading = async () => {
            try {
                const response = await execute({
                    apiUrl: `/submissions/${submissionId}/grading`,
                    method: 'get',
                    type: 'private'
                })

                if (!isMounted) return

                if (response.error) {
                    toast.error(response.error.message)
                    return
                }

                setSubmissionGrading(response.data)
            } catch {
                if (isMounted) {
                    toast.error('Không thể tải thông tin chấm bài')
                }
            }
        }

        getSubmissionGrading()

        return () => {
            isMounted = false
        }
    }, [submissionId, refreshKey])

    const refresh = () => {
        setRefreshKey(prev => prev + 1)
    }

    return {
        submissionGrading,
        loading,
        refresh
    }
}