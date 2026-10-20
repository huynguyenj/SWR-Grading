import useApiCall from '@/hooks/useApiCall'
import { useState } from 'react'
import { toast } from 'react-toastify'
import type { PaperQuestionType } from '../types/question.type'

export default function useGetQuestions() {
  const { execute, loading } = useApiCall<PaperQuestionType[]>()
  const [questions, setQuestions] = useState<PaperQuestionType[]>()

  const handleGetQuestions = async (paperSetId: string) => {
    // Xóa dữ liệu của bộ đề trước để modal không hiện nhầm câu hỏi cũ trong lúc tải    
    setQuestions(undefined)
    const response = await execute({
      apiUrl: `questions?paperSetId=${paperSetId}`,
      method: 'get',
      type: 'private',
    })
    if (response.error) {
      toast.error(response.error.message)
      return
    }
    setQuestions(response.data)
  }

  return { questions, handleGetQuestions, loading }
}