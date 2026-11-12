import useApiCall from '@/hooks/useApiCall'
import type { PaginationType } from '@/types/pagination.type'
import { useEffect, useState } from 'react'
import type { GradingSessionType } from '../types/grading_session_monitor'
import { useAuthStore } from '@/features/authentication/store/auth-store'


export default function useGetMonitorGradingSession() {
    const { execute, loading } = useApiCall<PaginationType<GradingSessionType>>()
    const authStore = useAuthStore.getState()
    const [gradingSessionDataList, setGradingSessionDataList] =
        useState<PaginationType<GradingSessionType>>()

    const [currentGradingSessionPage, setCurrentGradingSessionPage] =
        useState(1)

    const [pageGradingSessionSize, setPageGradingSessionSize] =
        useState(10)

    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        if (!authStore.userId) return

        const getGradingSessionList = async () => {
            const data = await execute({
                apiUrl: `/monitors/${authStore.userId}/grading-sessions`,
                method: 'get',
                type: 'private',
                body: {
                    Page: currentGradingSessionPage,
                    PageSize: pageGradingSessionSize
                }
            })

            if (data.error) return

            setGradingSessionDataList(data.data)
        }

        getGradingSessionList()
    }, [
        authStore.userId,
        currentGradingSessionPage,
        pageGradingSessionSize,
        refreshKey
    ])

    const refresh = () => {
        setRefreshKey(prev => prev + 1)
    }

    return {
        gradingSessionDataList,
        loading,
        currentGradingSessionPage,
        pageGradingSessionSize,
        setCurrentGradingSessionPage,
        setPageGradingSessionSize,
        refresh
    }
}