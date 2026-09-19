import { apiPrivate } from "@/config/axiox.config";
import { toast } from "react-toastify";

export default function useDownloadExamFiles({ examMaterialId, examMaterialCode }:{ examMaterialId: string, examMaterialCode: string }) {
  const handleDownloadFiles = async () => {
      const response: Blob = await apiPrivate.get(
      `/paper-sets/${examMaterialId}/content`,
      {
            responseType: "blob",
      },
      )
      const url = window.URL.createObjectURL(response)
      const link = document.createElement("a")
      link.href = url // gán link tạm thời dựa trên URL của web: http://localhost/... => <a href="http://localhost:5173/abc-123">
      link.download = examMaterialCode // gán TEST.zip vào download="TEST.zip" của thẻ a => <a download="TEST.zip">
      document.body.appendChild(link) // cho thẻ vào DOM
      link.click() // khi có thẻ a thì dùng .click() để JS tự tải thay vì đưa user nhấn
      link.remove() // xóa thẻ a ra khỏi DOM
      window.URL.revokeObjectURL(url)
      toast.success('Tải file thành công')
  }
  return { handleDownloadFiles }
}

// API
//  │
//  │ trả file ZIP
//  ▼
// response (Blob)
//  │
//  │ createObjectURL()
//  ▼
// blob:http://localhost/...  ← URL tạm thời
//  │
//  │ gán vào <a>
//  ▼
// <a href="blob:..." download="TEST.zip">
//  │
//  │ click()
//  ▼
// Browser tải file
//  │
//  ▼
// revokeObjectURL()
//  │
//  ▼
// giải phóng bộ nhớ