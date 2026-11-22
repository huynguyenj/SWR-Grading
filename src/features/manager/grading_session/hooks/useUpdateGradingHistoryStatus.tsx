
import { apiPrivate } from "@/config/axiox.config"
import { useState } from "react"

interface UpdateGradingHistoryStatusPayload {
    status: 0 | 1
}

export default function useUpdateGradingHistoryStatus() {
    const [loadingHistoryId, setLoadingHistoryId] = useState<string | null>(null)

    const updateStatus = async (
        historyId: string,
        status: UpdateGradingHistoryStatusPayload["status"],
    ) => {
        try {
            setLoadingHistoryId(historyId)

            await apiPrivate.put(
                `/grading-histories/${historyId}/status`,
                { status },
            )

            return true
        } catch (error) {
            console.error("Failed to update grading history status:", error)
            return false
        } finally {
            setLoadingHistoryId(null)
        }
    }

    return {
        updateStatus,
        loadingHistoryId,
    }
}
