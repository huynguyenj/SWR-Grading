import useApiCall from "@/hooks/useApiCall"
import type { AssignmentType } from "../types/assignment_type"
import { useEffect, useState } from "react"

export default function useGetAssignmentGradingSession({ gradingSessionId }: { gradingSessionId: string }) {
  const { execute, loading } = useApiCall<AssignmentType[]>()
  const [assignmentList, setAssignmentList] = useState<AssignmentType[]>()
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
  }, [gradingSessionId])
  return { assignmentList, loading }
}
