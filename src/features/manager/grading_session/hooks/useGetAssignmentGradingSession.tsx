import useApiCall from "@/hooks/useApiCall"
import type { AssignmentType } from "../types/assignment_type"
import { useEffect, useState } from "react"

export default function useGetAssignmentGradingSession({ gradingSessionId }: { gradingSessionId: string }) {
  const { execute, loading } = useApiCall<AssignmentType[]>()
  const [assignmentList, setAssignmentList] = useState<AssignmentType[]>()
  const [refreshKey, setRefreshKey] = useState(0)
  useEffect(() => {
    const getAssignmentList = async () =>  {
      const response = await execute({
        apiUrl: `grading-sessions/${gradingSessionId}/assignments`,
        method: 'get',
        type: 'private'
      })
      setAssignmentList(response.data)
    }
    getAssignmentList()
  }, [gradingSessionId, refreshKey])
  const onRefresh = () => {
    setRefreshKey((state) => state + 1)
  }
  return { assignmentList, loading, onRefresh }
}
