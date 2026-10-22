import useApiCall from "@/hooks/useApiCall"
import { toast } from "react-toastify"

export default function useDeleteSemester({ onRefresh, selectedSemesterId }: { onRefresh: () => void, selectedSemesterId?: string }) {
    const { execute, loading } = useApiCall()
    const onDelete = async () => {      
        await execute({
              apiUrl: `/semesters/${selectedSemesterId}`,
              method: 'del',
              type: 'private',
        })
        onRefresh()
        toast.success('Xóa học kì thành công')
    }
    return { onDelete, loading }
}
