
import { useEffect, useState } from 'react'

import useApiCall from '@/hooks/useApiCall'
import type { PaginationType } from '@/types/pagination.type'
import type { ApplicationType } from '../types/application_type'



export default function useGetApplicationList() {
    const { execute, loading } =
        useApiCall<PaginationType<ApplicationType>>()

    const [applicationDataList, setApplicationDataList] =
        useState<PaginationType<ApplicationType>>()

    // Pagination state
    const [currentApplicationPage, setCurrentApplicationPage] = useState(1)
    const [pageApplicationSize, setPageApplicationSize] = useState(10)

    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const getApplicationList = async () => {
            const params = new URLSearchParams({
                Page: String(currentApplicationPage),
                PageSize: String(pageApplicationSize),
            })

            const data = await execute({
                apiUrl: `applications?${params.toString()}`,
                method: 'get',
                type: 'private',
            })

            setApplicationDataList(data.data)
        }

        void getApplicationList()
    }, [currentApplicationPage,pageApplicationSize,refreshKey])

    // Refresh application list
    const refresh = () => {
        setRefreshKey((prev) => prev + 1)
    }


    return {
        applicationDataList,
        loading,
        currentApplicationPage,
        pageApplicationSize,
        setCurrentApplicationPage,
        setPageApplicationSize,
        refresh,
    }
}
