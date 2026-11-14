
import useApiCall from "@/hooks/useApiCall"

export interface UpdateGradingDetailBody {
    score: number
    comment: string
}

export default function useUpdateGradingDetail() {
    const { execute } = useApiCall()

    const updateGradingDetail = async (
        detailId: string,
        body: UpdateGradingDetailBody,
    ) => {
        return await execute({
            apiUrl: `/grading-details/${detailId}`,
            method: "put",
            type: "private",
            body,
        })
    }

    return {
        updateGradingDetail,
    }
}
