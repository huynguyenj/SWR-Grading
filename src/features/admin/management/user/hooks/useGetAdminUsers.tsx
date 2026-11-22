
import { useEffect, useState } from 'react'

import useApiCall from '@/hooks/useApiCall'
import useDebounce from '@/hooks/useDebounce'

import type { PaginationType } from '@/types/pagination.type'
import type {
    AdminUser,
    UserRole,
} from '../types/admin_user'

export default function useGetAdminUsers() {
    const { execute, loading } =
        useApiCall<PaginationType<AdminUser>>()

    const [adminUserDataList, setAdminUserDataList] =
        useState<PaginationType<AdminUser>>()

    const [currentUserPage, setCurrentUserPage] = useState(1)
    const [pageUserSize, setPageUserSize] = useState(10)

    const [search, setSearch] = useState('')
    const [role, setRole] = useState<UserRole | undefined>()

    const [refreshKey, setRefreshKey] = useState(0)

    // Debounce search input
    const debouncedSearch = useDebounce(search, 500)

    // Reset page when search or role changes
    useEffect(() => {
      const reloadPage = () => {
            setCurrentUserPage(1)
      }
      reloadPage()
    }, [debouncedSearch, role])

    // Fetch admin users
    useEffect(() => {
        const getAdminUserList = async () => {
            const params = new URLSearchParams({
                  Page: String(currentUserPage),
                  PageSize: String(pageUserSize),
                  Search: '',
                  Role: ''
            })
    

            if (debouncedSearch.trim()) {
                params.set('Search', debouncedSearch.trim())
            }

            if (role !== undefined) {
                params.set('Role', String(role))
            }
            
            const data = await execute({
                apiUrl: `admin/users?${params.toString()}`,
                method: 'get',
                type: 'private',
            })
            
            setAdminUserDataList(data.data)
        }

        getAdminUserList()
    }, [ currentUserPage, pageUserSize, debouncedSearch, role, refreshKey])

    // Refresh data
    const refresh = () => {
        setRefreshKey((prev) => prev + 1)
    }

    return {
        adminUserDataList,
        loading,
        currentUserPage,
        pageUserSize,
        setCurrentUserPage,
        setPageUserSize,
        search,
        setSearch,
        role,
        setRole,
        refresh,
    }
}
