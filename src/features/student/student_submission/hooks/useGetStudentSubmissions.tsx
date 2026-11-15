import { useAuthStore } from '@/features/authentication/store/auth-store'
import useApiCall from '@/hooks/useApiCall'
import { useEffect, useState } from 'react'
import type { StudentSubmission } from '../types/student_submission'

export default function useGetStudentSubmission() {
    const { execute, loading } = useApiCall<StudentSubmission[]>()

    const [studentSubmissionList, setStudentSubmissionList] =
        useState<StudentSubmission[]>([])

    const [refreshKey, setRefreshKey] = useState(0)

    const studentId = useAuthStore((state) => state.userId)

    useEffect(() => {

        if (!studentId) {
            return
        }

        let isMounted = true

        const getStudentSubmission = async () => {
            const data = await execute({
                apiUrl: `submissions/student/${studentId}`,
                method: 'get',
                type: 'private',
            })

            if (isMounted) {
                setStudentSubmissionList(data.data ?? [])
            }
        }

        void getStudentSubmission()

        return () => {
            isMounted = false
        }
    }, [studentId, refreshKey])

    const refresh = () => {
        setRefreshKey((prev) => prev + 1)
    }

    return {
        studentSubmissionList,
        loading,
        refresh,
    }
}