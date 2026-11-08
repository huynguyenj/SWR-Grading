import { apiPrivate } from "@/config/axiox.config"
import { toast } from "react-toastify"

export default function useGetStudentSemesterFile() {
  const handleDownloadStudentFiles = async () => {
      const response: Blob = await apiPrivate.get(
      '/semesters/students/import-template',
      {
            responseType: "blob",
      },
      )
      const url = window.URL.createObjectURL(response)
      const link = document.createElement("a")
      link.href = url // gán link tạm thời dựa trên URL của web: http://localhost/... => <a href="http://localhost:5173/abc-123">
      link.download = 'Student_template' // gán TEST.zip vào download="TEST.zip" của thẻ a => <a download="TEST.zip">
      document.body.appendChild(link) // cho thẻ vào DOM
      link.click() // khi có thẻ a thì dùng .click() để JS tự tải thay vì đưa user nhấn
      link.remove() // xóa thẻ a ra khỏi DOM
      window.URL.revokeObjectURL(url)
      toast.success('Tải file thành công')
  }
  return { handleDownloadStudentFiles }
}
