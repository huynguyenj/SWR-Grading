import useApiCall from "@/hooks/useApiCall"
import { toast } from "react-toastify"


export default function useDeletePaperSet({ onRefresh, selectedPaperSetId }: { onRefresh: () => void, selectedPaperSetId?: string }) {
    const { execute, loading } = useApiCall()
    const onDelete = async () => {      
      const response = await execute({
              apiUrl: `paper-sets/${selectedPaperSetId}`,
              method: 'del',
              type: 'private',
        })
        if (response.error) {
            toast.error(response.error.message)
            return
        }
        onRefresh()
        toast.success('Xóa học kì thành công')
    }
    return { onDelete, loading }
}
