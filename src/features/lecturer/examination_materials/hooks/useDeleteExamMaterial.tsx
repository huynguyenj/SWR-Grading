import useApiCall from "@/hooks/useApiCall"
import { toast } from "react-toastify"


export default function useDeleteExamMaterial({ onRefresh, selectedExamMaterialId }: { onRefresh: () => void, selectedExamMaterialId?: string }) {
    const { execute, loading } = useApiCall()
    const onDelete = async () => {      
      const response = await execute({
              apiUrl: `exam-materials/${selectedExamMaterialId}`,
              method: 'del',
              type: 'private',
        })
        if (response.error) {
            toast.error(response.error)
            return
        }
        onRefresh()
        toast.success('Xóa học kì thành công')
    }
    return { onDelete, loading }
}
