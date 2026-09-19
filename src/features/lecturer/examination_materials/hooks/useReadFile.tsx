import useApiCall from "@/hooks/useApiCall"
import type { PreviewQuestionType } from "../types/exam_material.type"
import { useState } from "react"
import { toast } from "react-toastify"

export default function useReadFile() {
  const { execute, loading } = useApiCall<PreviewQuestionType[]>()
  const [questionList, setQuestionList] = useState<PreviewQuestionType[]>([])
  const handlePreviewFile = async (file: File | null) => {
      if (!file) {
            toast.error('Hãy import file')
            return
      }
      const formData = new FormData()
      formData.append('question', file)
      const response = await execute({
            apiUrl: 'paper-sets/preview-questions',
            method: 'post',
            type: 'private',
            body: formData
      })
      if (response.error) {
            toast.error(response.error.message)
            return
      }
      setQuestionList(response.data)
  }
  return { handlePreviewFile, questionList, loading }
}
