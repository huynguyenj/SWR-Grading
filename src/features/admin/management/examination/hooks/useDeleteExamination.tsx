import useApiCall from "@/hooks/useApiCall"
import { toast } from "react-toastify"

export default function useDeleteExamination({ onRefresh, selectedDeleteExaminationId}: { onRefresh: () => void, selectedDeleteExaminationId?: string }) {
    const { execute, loading } = useApiCall()
    const onDelete = async () => {      
        await execute({
              apiUrl: `examinations/${selectedDeleteExaminationId}`,
              method: 'del',
              type: 'private',
        })
        onRefresh()
        toast.success('Xóa đợt thi thành công')
    }
    return { onDelete, loading }
}
