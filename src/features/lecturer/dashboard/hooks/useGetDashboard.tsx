import useApiCall from '@/hooks/useApiCall'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getMockDashboard, type LecturerDashboardType } from '../types/dashboard.type'

// TODO: đổi thành false khi BE có endpoint dashboard thật
const USE_MOCK_DASHBOARD = true

export default function useGetLecturerDashboard({ semesterId }: { semesterId: string }) {
  const { execute, loading } = useApiCall<LecturerDashboardType>()
  const [dashboard, setDashboard] = useState<LecturerDashboardType>()

  useEffect(() => {
    const getDashboard = async () => {
      if (USE_MOCK_DASHBOARD) {
        setDashboard(getMockDashboard(semesterId))
        return
      }

      // GIẢ ĐỊNH endpoint — chưa được cung cấp, cần xác nhận lại route/tham số với BE
      const response = await execute({
        apiUrl: '/dashboard/lecturer',
        method: 'get',
        type: 'private',
        body: {
          SemesterId: semesterId === 'all' ? undefined : semesterId,
        },
      })
      if (response.error) {
        toast.error(response.error.message)
        return
      }
      setDashboard(response.data)
    }
    getDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesterId])

  return { dashboard, loading }
}